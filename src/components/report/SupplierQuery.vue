<template>
  <div class="SupplierQuery">
    <van-nav-bar fixed>
      <div class="title" slot="title">{{this.$store.state.title}}</div>
    </van-nav-bar>
    <div class="report">
      <van-collapse v-model="activeNames">
        <van-collapse-item name="1">
          <div class="collapse-title" slot="title">查询方案</div>
          <van-field
            readonly
            clickable
            label="供应商"
            :value="supplier"
            placeholder="选择供应商"
            @click="openModal"
          />
          <van-field readonly clickable label="日期" :value="date" />
          <van-button class="search-button" type="default" block size="normal" @click="search">查询</van-button>
        </van-collapse-item>
      </van-collapse>
      <div class="report-body">
        <p class="table-title">采购物料汇总</p>
        <i-table
          border
          size="small"
          :height="500"
          :columns="reportColumns"
          :data="reportData"
          :loading="loading"
        ></i-table>
        <div id="line"></div>
      </div>
    </div>
    <Modal v-model="modal1" :closable="false" :footer-hide="true" title="供应商档案">
      <div class="modal-head"><Input class="bd-input" v-model="supplier1" placeholder="清输入供应商名称或编码"/><Button type="info" @click="search1">查询</Button></div>
      <i-table
          border
          size="small"
          :height="300"
          @on-row-click="rowClick"
          :columns="BdColumns"
          :data="BdData"
        ></i-table>
    </Modal>
  </div>
</template>

<script>
import { supplierFuzzySearch, getSupplierQueryData } from "../../request/api";
import { Toast } from "vant";
import echarts from "echarts";
export default {
  name: "SupplierQuery",
  data() {
    return {
      modal1:false,
      activeNames: [],
      supplier: "",
      supplier1:"",
      date: "",
      dateStart: "",
      dateEnd: "",
      loading: false,
      reportData: [],
      BdData:[],
      BdColumns:[
        {
          title: "编码",
          key: "label",
          align: "center",
          className: "iview-table",
          width: 70
        },
        {
          title: "名称",
          key: "value",
          align: "center",
          className: "iview-table"
        },
      ],
      reportColumns: [
        {
          title: "名称",
          key: "name",
          align: "center",
          className: "iview-table"
        },
        {
          title: "规格",
          key: "materialspec",
          align: "center",
          className: "iview-table"
        },
        {
          title: "数量",
          key: "nassistnum",
          align: "center",
          className: "iview-table"
        },
        {
          title: "金额",
          key: "norigtaxmny",
          align: "center",
          className: "iview-table"
        }
      ],
      dateList: [],
      moneylist: [],
      numlist: []
    };
  },
  methods: {
    drawLine() {
      this.charts = echarts.init(document.getElementById("line"));
      this.charts.setOption({
        title: {
          left: "30%",
          text: "采购量变化曲线"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["数量", "金额"],
          top: "25"
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: true,
          data: this.dateList
        },
        yAxis: [
          {
            name: "数量",
            type: "value"
          },
          {
            name: "金额",
            type: "value"
          }
        ],
        series: [
          {
            name: "金额",
            type: "line",
            yAxisIndex: 1,
            stack: "金额",
            smooth: true,
            data: this.moneylist
          },
          {
            name: "数量",
            type: "line",
            stack: "数量",
            smooth: true,
            data: this.numlist
          }
        ]
      });
    },
    getSupplierDate(){
      let that=this;
      let supplier1=this.supplier1;
      supplierFuzzySearch({name:supplier1}).then(function(res){
        let data=JSON.parse(res);
        if(data.state=="success"){
          that.BdData=data.rows;
        }else{
          Tosat(data.msg);
        }
      })
    },
    openModal(){
      this.modal1=true;
      if(this.BdData.length==0){
        this.getSupplierDate()
      }
    },
    search1(){
      this.getSupplierDate();
    },
    rowClick(row){
      this.supplier=row.value;
      this.supplier1="";
      this.modal1=false;
    },
    search() {
      let that = this;
      let supplier = this.supplier;
      let dateStart = this.dateStart;
      let dateEnd = this.dateEnd;
      if (supplier == "") {
        Toast("请选择供应商");
      } else {
        this.activeNames = [];
        this.loading = true;
        this.dateList=[];
        this.numlist=[];
        this.moneylist=[];
        getSupplierQueryData({
          name: supplier,
          dateStart: dateStart,
          dateEnd: dateEnd
        }).then(function(res) {
          let data =JSON.parse(res);
          if (data.state == "success") {
            let lineData = data.lineData;
            that.reportData = data.SQueryData;
            lineData.forEach(e => {
              that.dateList.push(e.billdate);
              that.numlist.push(e.nassistnum);
              that.moneylist.push(e.norigtaxmny);
            });
            that.$nextTick(function() {
              that.drawLine();
            });
            that.loading = false;
          } else {
            that.loading = false;
            Toast(data.msg);
          }
        });
      }
    },
    formatDate(date1) {
      let date = new Date(date1);
      let year = date.getFullYear();
      let month = "";
      let day = "01";
      if (date.getMonth() < 9) {
        month = "0" + (date.getMonth() + 1);
      } else {
        month = date.getMonth() + 1;
      }
      return `${year}-${month}-${day}`;
    }
  },
  mounted() {
    let title = this.$route.query.title;
    this.$store.commit("setTitle", title);
    let date = new Date();
    date.setTime(date.getTime() - 24 * 60 * 60 * 1000);
    this.dateEnd = this.formatDate(date);
    let year = date.getFullYear() - 1;
    let month = "";
    if (date.getMonth() < 9) {
      month = "0" + (date.getMonth() + 1);
    } else {
      month = date.getMonth() + 1;
    }
    let day = "01";
    this.dateStart = `${year}-${month}-${day}`;
    this.date = this.dateStart + "~" + this.dateEnd;
  }
};
</script>

<style scoped>
.table-title {
  text-align: center;
  font-size: 14px;
  font-weight: 600;
}
#line {
  margin-top: 20px;
  margin-bottom: 20px;
  width: 365px;
  height: 300px;
}
.modal-head{
  margin-bottom: 10px;
}
.bd-input{
  width: 250px;
  margin-right: 10px;
}
</style>
<template>
  <div class="customerSummary">
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
            label="客户"
            :value="customer"
            placeholder="选择客户"
            @click="openModal"
          />
          <van-field
            readonly
            clickable
            label="日期"
            :value="date"
            placeholder="选择日期"
            @click="showDatePicker = true"
          />
          <van-button class="search-button" type="default" block size="normal" @click="search">查询</van-button>
        </van-collapse-item>
      </van-collapse>
      <div class="report-body">
        <p class="table-title">物料汇总明细</p>
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
    <van-calendar
      v-model="showDatePicker"
      :min-date="minDate"
      :max-date="maxDate"
      :default-date="defaultDate"
      color="#418bca"
      type="range"
      :max-range="30"
      @confirm="onConfirm"
    />
    <Modal v-model="modal1" :closable="false" :footer-hide="true" title="客户档案">
      <div class="modal-head"><Input class="bd-input" v-model="customer1" placeholder="清输入客户名称或编码"/><Button type="info" @click="search1">查询</Button></div>
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
import { customerFuzzySearch, getCustomerSummaryData } from "../../request/api";
import { Toast } from "vant";
import echarts from "echarts";
export default {
  name: "customerSummary",
  data() {
    return {
      modal1:false,
      activeNames: [],
      showDatePicker: false,
      loading: false,
      customer: "",
      customer1:"",
      date: "",
      dateStart: "",
      dateEnd: "",
      minDate: new Date("2018/7/1"),
      maxDate: new Date(),
      dateList: [],
      moneylist: [],
      numlist: [],
      defaultDate: [],
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
          key: "nastnum",
          align: "center",
          className: "iview-table"
        },
        {
          title: "金额",
          key: "norigtaxmny",
          align: "center",
          className: "iview-table"
        }
      ]
    };
  },
  methods: {
    drawLine() {
      this.charts = echarts.init(document.getElementById("line"));
      this.charts.setOption({
        title: {
          left:'30%',
          text: "销售量变化曲线"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["数量","金额"],
          top:'25'
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
    getCustomerDate(){
      let that=this;
      let customer1=this.customer1;
      customerFuzzySearch({name:customer1}).then(function(res){
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
        this.getCustomerDate();
      }
    },
    search1(){
      this.getCustomerDate();
    },
    rowClick(row){
      this.customer=row.value;
      this.customer1="";
      this.modal1=false;
    },
    search() {
      let that = this;
      let customer = that.customer;
      let dateStart = that.dateStart;
      let dateEnd = that.dateEnd;
      if(customer==""){
        Toast("请选择客户");
      }else{
        this.activeNames=[];
        that.loading=true;
        this.dateList=[];
        this.numlist=[];
        this.moneylist=[];
        getCustomerSummaryData({
        customerName: customer,
        dateStart: dateStart,
        dateEnd: dateEnd
      }).then(function(res) {
        let data = JSON.parse(res);
        if (data.state == "success") {
          let lineData = data.lineData;
          that.reportData = data.summaryData;
          lineData.forEach(e => {
            that.dateList.push(e.billdate);
            that.numlist.push(e.nastnum);
            that.moneylist.push(e.norigtaxmny);
          });
          that.$nextTick(function() {
            that.drawLine();
          });
          that.loading=false;
        } else {
          that.loading=false;
          Toast(data.msg);
        }
      });
      
      }
      
    },
    formatDate(date1) {
      let date = new Date(date1);
      let year = date.getFullYear();
      let month = "";
      let day = "";
      if (date.getMonth() < 9) {
        month = "0" + (date.getMonth() + 1);
      } else {
        month = date.getMonth() + 1;
      }
      if (date.getDate() < 10) {
        day = "0" + (date.getDate());
      } else {
        day = date.getDate();
      }
      return `${year}-${month}-${day}`;
    },
    onConfirm(date) {
      this.dateStart = this.formatDate(date[0]);
      this.dateEnd = this.formatDate(date[1]);
      this.date = this.dateStart + "~" + this.dateEnd;
      this.showDatePicker = false;
    }
  },
  mounted() {
    let title = this.$route.query.title;
    this.$store.commit("setTitle", title);
    let date = new Date();
    let date1 = new Date();
    let date2 = new Date();
    date.setTime(date.getTime() - 24 * 60 * 60 * 1000);
    this.maxDate = date;
    date1.setTime(date1.getTime() - 24 * 60 * 60 * 1000);
    this.defaultDate.unshift(date1);
    this.dateEnd=this.formatDate(date1);
    date2.setTime(date2.getTime() - 7 * 24 * 60 * 60 * 1000);
    this.defaultDate.unshift(date2);
    this.dateStart=this.formatDate(date2);
    this.date = this.dateStart + "~" + this.dateEnd;
  }
};
</script>

<style scoped>
.table-title{
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
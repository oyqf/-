<template>
  <div class="singlGoodse">
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
            label="物料编码"
            :value="goodsCode"
            placeholder="选择物料"
            @click="openModal"
          />
          <van-field readonly clickable label="名称/规格" :value="goods" />
          <van-button class="search-button" type="default" block size="normal" @click="search">查询</van-button>
        </van-collapse-item>
      </van-collapse>
      <div class="report-body">
        <div id="line"></div>
      </div>
    </div>
    <Modal v-model="modal1" :closable="false" :footer-hide="true" title="物料档案">
      <div class="modal-head">
        <Input class="bd-input" v-model="code1" placeholder="清输入物料名称或编码" />
        <Button type="info" @click="search1">查询</Button>
      </div>
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
import {
  apigetMaterielCode,
  getMateriName,
  getSinglGoods
} from "../../request/api";
import echarts from "echarts";
import { Toast } from "vant";
export default {
  name: "singlGoods",
  data() {
    return {
      modal1: false,
      activeNames: [],
      goodsCode: "",
      code1: "",
      goods: "",
      dateStart: "",
      dateEnd: "",
      dateList: [],
      numlist: [],
      pricelist: [],
      moneylist: [],
      BdData: [],
      BdColumns: [
        {
          title: "编码",
          key: "label",
          align: "center",
          className: "iview-table"
        },
        {
          title: "名称",
          key: "value",
          align: "center",
          className: "iview-table"
        },
        {
          title: "规格",
          key: "value1",
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
          left: "30%",
          text: "近12月采购变化曲线"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["数量", "平均价", "金额"],
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
            name: "平均价",
            type: "line",
            yAxisIndex: 1,
            stack: "平均价",
            smooth: true,
            data: this.pricelist
          },
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
    search1() {
      let that = this;
      let code1 = this.code1;
      apigetMaterielCode({ code: code1 }).then(function(res) {
        let data = JSON.parse(res);
        if (data.state == "success") {
          that.BdData = data.rows;
        } else {
          Toast(data.msg);
        }
      });
    },
    openModal() {
      if(this.BdData.length==0){
        this.search1();
      }
      this.modal1 = true;
    },
    rowClick(row, index) {
      let that = this;
      this.goodsCode = row.label;
      this.goods = row.value;
      this.modal1 = false;
    },
    search() {
      let that = this;
      let goodsCode = this.goodsCode;
      let dateStart = this.dateStart;
      let dateEnd = this.dateEnd;
      if (goodsCode == "") {
        Toast("请输入物料编码");
      } else {
        this.activeNames = [];
        this.dateList = [];
        this.numlist = [];
        this.pricelist = [];
        this.moneylist = [];
        getSinglGoods({
          code: goodsCode,
          dateStart: dateStart,
          dateEnd: dateEnd
        }).then(function(res) {
          let data = JSON.parse(res);
          if (data.state == "success") {
            let row = data.rows;
            row.forEach(e => {
              that.dateList.push(e.month);
              that.numlist.push(e.nassistnum);
              that.pricelist.push(e.price);
              that.moneylist.push(e.norigtaxmny);
            });
            that.$nextTick(function() {
              that.drawLine();
            });
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
  width: 240px;
  margin-right: 10px;
}
</style>
<template>
  <div class="offlineSales">
    <van-nav-bar fixed>
      <div class="title" slot="title">{{this.$store.state.title}}</div>
    </van-nav-bar>
    <div class="report">
      <div class="head">
        <div class="head-item">
          <p class="head-p1">订单数</p>
          <p class="head-p2 order">{{headData.orderNum}}</p>
          <p class="head-p3 order">{{(headData.orderDiff>0?'+':'-')+headData.orderDiff}}</p>
        </div>
        <div class="head-item">
          <p class="head-p1">订单金额</p>
          <p class="head-p2 money">{{headData.money}}</p>
          <p class="head-p3 money">{{(headData.moneyDiff>0?'+':'-')+headData.moneyDiff}}</p>
        </div>
        <div class="head-item">
          <p class="head-p1">客户数</p>
          <p class="head-p2 customer">{{headData.customer}}</p>
          <p class="head-p3 customer">{{(headData.customerDiff>0?'+':'-')+headData.customerDiff}}</p>
        </div>
      </div>
      <div class="body">
        <div id="line"></div>
        <van-collapse v-model="activeNames">
          <van-collapse-item title="销售TOP10" name="1">
            <i-table  border size="small" :columns="materialColumns" :data="materialData"></i-table>
          </van-collapse-item>
          <van-collapse-item title="顾客TOP10" name="2">
            <i-table  border size="small" :columns="custColumns" :data="custData"></i-table>
          </van-collapse-item>
        </van-collapse>
      </div>
    </div>
  </div>
</template>

<script>
import { getofflineSales } from "../../request/api";
import { Toast } from "vant";
import echarts from "echarts";
export default {
  name: "offlineSales",
  data() {
    return {
      headData: {
        money: 0,
        moneyDiff: 0,
        orderNum: 0,
        orderDiff: 0,
        customer: 0,
        customerDiff: 0
      },
      dateList: [],
      chartData: {
        moneylist: [],
        orderlist: [],
        custlist: []
      },
      activeNames: ["1","2"],
      materialData:[],
      custData:[],
      materialColumns:[
        {
          title: "名称",
          key: "name",
          align: "center",
          className: 'iview-table'
        },
        {
          title: "规格",
          key: "remarks",
          align: "center",
          className: 'iview-table'
        },
        {
          title: "金额",
          key: "money",
          align: "center",
          className: 'iview-table'
        }
      ],
      custColumns:[
        {
          title: "客户名称",
          key: "name",
          align: "center",
          className: 'iview-table'
        },
        {
          title: "金额",
          key: "money",
          align: "center",
          className: 'iview-table'
        }
      ]
    };
  },
  methods: {
    drawLine() {
      this.charts = echarts.init(document.getElementById("line"));
      this.charts.setOption({
        title: {
          text: ""
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["订单金额", "订单数", "客户数"]
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
            name: "订单金额",
            type: "line",
            yAxisIndex: 1,
            stack: "订单金额",
            smooth: true,
            data: this.chartData.moneylist
          },
          {
            name: "订单数",
            type: "line",
            stack: "订单数",
            smooth: true,
            data: this.chartData.orderlist
          },
          {
            name: "客户数",
            type: "line",
            stack: "客户数",
            smooth: true,
            data: this.chartData.custlist
          }
        ]
      });
    }
  },
  mounted() {
    let title = this.$route.query.title;
    this.$store.commit("setTitle", title);
    let that = this;
    getofflineSales().then(function(res) {
      let data=JSON.parse(res);
      if (data.state == "success") {
        that.headData = data.headdate;
        that.chartData = data.chartdata;
        that.dateList = data.datelist;
        that.$nextTick(function() {
          that.drawLine();
        });
        that.materialData=data.saletop;
        that.custData=data.custtop;
      } else {
        Toast(data.msg);
      }
    });
  }
};
</script>

<style scoped>
.head{
  margin-top: 55px;
}
.head-item {
  width: 32%;
  display: inline-block;
  text-align: center;
}
.head-p1 {
  font-size: 14px;
}
.head-p2 {
  font-size: 20px;
  font-weight: 600;
}
.head-p3 {
  font-size: 14px;
}
.order {
  color: rgb(25, 190, 107);
}
.money {
  color: rgb(255, 153, 0);
}
.customer {
  color: rgb(45, 183, 245);
}
.body {
  margin-top: 20px;
}
#line {
  width: 375px;
  height: 300px;
}
</style>
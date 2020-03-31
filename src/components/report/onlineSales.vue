<template>
  <div class="onlineSales">
    <van-nav-bar fixed>
      <div class="title" slot="title">{{this.$store.state.title}}</div>
    </van-nav-bar>
    <div class="report">
      <div class="head">
        <p class="head-p1">订单金额</p>
        <p class="head-p2 money">{{money}}</p>
        <p class="head-p3 money">{{(moneyDiff>0?'+':'')+moneyDiff}}</p>
      </div>
      <div class="body">
        <div id="line"></div>
        <van-collapse v-model="activeNames">
          <van-collapse-item title="销售TOP10" name="1">
            <i-table border size="small" :columns="materialColumns" :data="materialData"></i-table>
          </van-collapse-item>
        </van-collapse>
        <div id="pie"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { getOnlineData } from "../../request/api";
import { Toast } from "vant";
import echarts from "echarts";
export default {
  name: "onlineSales",
  data() {
    return {
      money: 0,
      moneyDiff: 0,
      dateList: [],
      moneyList: [],
      pieItemList: [],
      pieData: [],
      activeNames: ["1"],
      materialData: [],
      materialColumns: [
        {
          title: "排名",
          type: "index",
          width: 60,
          align: "center",
          className: "iview-table"
        },
        {
          title: "名称",
          key: "Name",
          align: "center",
          className: "iview-table"
        },
        {
          title: "金额",
          key: "Aummont",
          align: "center",
          className: "iview-table"
        }
      ]
    };
  },
  methods: {
    GetDateFormat(str) {
      let date = new Date(parseInt(str.substr(6, 13)));
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      let date1 = date.toJSON().substr(5, 5);
      return date1;
    },
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
          data: ["订单金额"]
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
            name: "金额",
            type: "value"
          }
        ],
        series: [
          {
            name: "订单金额",
            type: "line",
            stack: "订单金额",
            smooth: true,
            data: this.moneyList
          }
        ]
      });
    },
    drawpie() {
      this.charts = echarts.init(document.getElementById("pie"));
      this.charts.setOption({
        title: {
          text: "店铺占比",
          left: "center"
        },
        tooltip: {
          trigger: "item",
          position: ["5%", "45%"],
          formatter: function(params, ticket, callback) {
            let store=params.name;
            let Ammount=params.data.AmmountItem.toString().split(".")[0];
            let Num=params.data.NumItem
            let percent=params.percent
            return store+" <br/>"+"金额："+Ammount+" : ("+percent+"%)<br/>数量："+Num;
          }
        },
        legend: {
          orient: "vertical",
          top: 30,
          left: "left",
          data: this.pieItemList
        },
        series: [
          {
            name: "店铺",
            type: "pie",
            radius: "55%",
            center: ["50%", "75%"],
            data: this.pieData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
    }
  },
  mounted() {
    let that = this;
    let title = this.$route.query.title;
    this.$store.commit("setTitle", title);
    getOnlineData().then(function(res) {
      let data = JSON.parse(res);
      console.log(data);
      if (data.state == "success") {
        let moneyList = data.moneyList;
        let storeRatio = data.storeRatio;
        let topAmu = 0;
        let topNum = 0;
        let topPer=0;
        let other = new Object();
        that.money = data.money.TotalIncome;
        that.moneyDiff = data.money.DailyChange;
        moneyList.forEach(e => {
          that.moneyList.push(e.Money);
          let dateItem = that.GetDateFormat(e.Date);
          that.dateList.push(dateItem);
        });
        storeRatio.forEach(e => {
          that.pieItemList.push(e.name);
          topAmu+=e.AmmountItem;
          topNum+=e.NumItem;
          topPer+=e.value;
        });
        that.pieItemList.push("其它店铺");
        that.pieData = storeRatio;
        other.name="其它店铺";
        other.value=1-topPer;
        other.AmmountItem=data.storeAmmount[0].Ammount-topAmu;
        other.NumItem=data.storeAmmount[0].Num-topNum;
        that.pieData.push(other);
        that.materialData = data.topData;
        that.$nextTick(function() {
          that.drawLine();
          that.drawpie();
        });
        console.log(that.pieData);
      } else {
        Toast(data.msg);
      }
    });
  }
};
</script>

<style scoped>
.head {
  width: 375px;
  display: inline-block;
  text-align: center;
  margin-top: 10px;
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
.money {
  color: rgb(255, 153, 0);
}
#line {
  width: 375px;
  height: 300px;
}
#pie {
  width: 355px;
  height: 550px;
  margin: 10px auto;
}
</style>
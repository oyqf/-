<template>
  <div class="outputSummary">
    <van-nav-bar fixed>
      <div class="title" slot="title">{{this.$store.state.title}}</div>
    </van-nav-bar>
    <div class="report">
      <i-table
        border
        size="small"
        :height="550"
        :loading="loading"
        :columns="reportColumns"
        :data="reportData"
        @on-row-click="rowClick"
      ></i-table>
    </div>
    <Modal v-model="modal1" :closable="false" :footer-hide="true" title="产量变化曲线">
      <div id="line"></div>
    </Modal>
  </div>
</template>

<script>
import { getOutputSummary,materialOutput } from "../../request/api";
import { Toast } from "vant";
import echarts from "echarts";
export default {
  name: "outputSummary",
  data() {
    return {
      loading: false,
      modal1:false,
      dateStart:"",
      dateEnd:"",
      reportData: [],
      dateList:[],
      numlist:[],
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
        }
      ],
    };
  },
  methods: {
    rowClick(row, index) {
      this.modal1=true;
      let code=row.code;
      let that=this;
      let dateStart=this.dateStart;
      let dateEnd=this.dateEnd;
      this.dateList=[];
      this.numlist=[];
      materialOutput({code:code,dateStart:dateStart,dateEnd})
      .then(function(res){
        let data=JSON.parse(res);
        if(data.state=="success"){
          let rows=data.rows;
          rows.forEach(e => {
            that.dateList.push(e.billdate);
            that.numlist.push(e.nassistnum)
          });

          that.$nextTick(function() {
              that.drawLine();
            });
        }
      })

    },
    drawLine() {
      this.charts = echarts.init(document.getElementById("line"));
      this.charts.setOption({
        title: {
          left: "30%",
          text: ""
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["数量"],
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
          }
        ],
        series: [
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
    destroyDraw(id){
      this.charts = echarts.init(document.getElementById(id));
      this.charts.clear();
    },
  },
  mounted() {
    let title = this.$route.query.title;
    this.$store.commit("setTitle", title);
    let that = this;
    let date = new Date();
    let date1 = new Date();
    date.setTime(date.getTime() - 24 * 60 * 60 * 1000);
    this.dateEnd =this.formatDate(date) ;
    date1.setTime(date1.getTime() - 15*24 * 60 * 60 * 1000);
    this.dateStart=this.formatDate(date1);
    this.loading=true;
    getOutputSummary({ date: this. dateEnd }).then(function(res) {
      let data = JSON.parse(res);
      if (data.state == "success") {
        that.reportData = data.rows;
        that.loading=false;
      } else {
        that.loading=false;
        Toast(data.msg);
      }
    });
  },
  watch: {
    'modal1':function(newVal){
      if(!newVal){
        this.destroyDraw('line');
      }
    }
    },
};
</script>

<style scoped>
.report {
  margin-top: 60px;
  padding: 5px;
}
#line{
  width: 315px;
  height: 300px;
  margin: 5px;
}
</style>
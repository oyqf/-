<template>
  <div class="inStorage">
    <van-nav-bar fixed>
      <div class="title" slot="title">{{this.$store.state.title}}</div>
    </van-nav-bar>
    <div class="report">
      <p class="table-title">昨天合格品入库前10</p>
      <i-table
        border
        size="small"
        :height="550"
        :loading="loading"
        :columns="reportColumns"
        :data="reportData"
      ></i-table>
    </div>
  </div>
</template>

<script>
import {getInStorageData} from "../../request/api";
import { Toast } from "vant";
export default {
  name: "inStorage",
  data() {
    return {
      loading:false,
      reportData: [],
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
      ]
    };
  },
  mounted() {
    let title = this.$route.query.title;
    this.$store.commit("setTitle", title);
    let that=this;
    let date=new Date();
    date.setTime(date.getTime() - 24 * 60 * 60 * 1000);
    let dateStr="";
    let year=date.getFullYear();
    let month="";
    let day="";
    if (date.getMonth() < 9) {
      month = "0" + (date.getMonth() + 1);
    } else {
      month = date.getMonth() + 1;
    }
    if (date.getDate() <10) {
      day = "0" + (date.getDate());
    } else {
      day = date.getDate();
    }
    dateStr=`${year}-${month}-${day}`;
    this.loading=true;
    getInStorageData({date:dateStr}).then(function(res){
        let data=JSON.parse(res);
        if(data.state=="success"){
            that.reportData=data.rows;
            that.loading=false;
        }else{
            Toast(data.msg);
            that.loading=false;
        }
    })
  }
};
</script>

<style scoped>
.table-title {
  text-align: center;
  font-size: 14px;
  font-weight: 600;
}
.report{
    margin-top: 70px;
    padding: 5px;
}
</style>
<template>
  <div class="shortage">
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
            label="库存组织"
            :value="Orgvalue"
            placeholder="选择库存组织"
            @click="showOrgPicker = true"
          />
          <van-field readonly clickable label="物料编码" :value="code" placeholder="选择物料" @click="openModal" />
          <van-field readonly clickable label="物料名称" :value="Materielvalue" placeholder="选择物料" @click="openModal" />
          <div class="specialfiled">
            <Input v-model="num" placeholder="数量" style="width:30%" />
            <Select v-model="edition" placeholder="BOM版本" style="width:60%">
              <Option
                v-for="item in editionlist"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </div>
          <van-button class="search-button" type="default" block size="normal" @click="search">查询</van-button>
        </van-collapse-item>
      </van-collapse>
      <div class="report-body">
        <i-table
          :height="500"
          border
          size="small"
          :columns="reportColumns"
          :data="reportData"
          :loading="loading"
        >
          <template slot-scope="{ row }" slot="isEnough">
            <p :class="row.isEnough?'isEnough':'isNotEnough'">{{row.isEnough?'充足':'缺料'}}</p>
          </template>
        </i-table>
      </div>
    </div>
    <van-popup v-model="showOrgPicker" position="bottom">
      <van-picker
        show-toolbar
        :columns="Orgcolumns"
        @cancel="showOrgPicker = false"
        @confirm="onOrgConfirm"
      />
    </van-popup>
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
  getFactory,
  apiWareHouseList,
  apigetMaterielCode,
  getMateriBom,
  apigetIBalancelist
} from "../../request/api";
import { Toast } from "vant";
export default {
  name: "shortage",
  data() {
    return {
      modal1: false,
      activeNames: [],
      Orgvalue: "",
      Materielvalue: "",
      code: "",
      num: "",
      code1: "",
      showOrgPicker: false,
      Orgcolumns: [],
      edition: "",
      editionlist: [],
      loading: false,
      reportData: [],
      BdData:[],
      BdColumns:[
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
        },
      ],
      reportColumns: [
        {
          title: "子项名称",
          key: "name",
          align: "center",
          className: "iview-table"
        },
        {
          title: "现存量",
          key: "total",
          align: "center",
          className: "iview-table"
        },
        {
          title: "需求量",
          key: "demandNum",
          align: "center",
          className: "iview-table"
        },
        {
          title: "备料情况",
          key: "isEnough",
          align: "center",
          slot: "isEnough",
          className: "iview-table"
        }
      ]
    };
  },
  methods: {
    onOrgConfirm(value) {
      this.Orgvalue = value;
      this.showOrgPicker = false;
    },
    onWareConfirm(value) {
      this.Warevalue = value;
      this.showWarePicker = false;
    },
    search1(){
      let that=this;
      let code1=this.code1;
      apigetMaterielCode({code:code1}).then(function(res){
        let data=JSON.parse(res);
        if(data.state=="success"){
          that.BdData=data.rows;
        }else{
          Toast(data.msg);
        }
      })
    },
    openModal(){
      if(this.BdData.length==0){
        this.search1();
      }
      this.modal1=true;
    },
    rowClick(row,index){
      let that=this;
      this.code=row.label;
      this.Materielvalue=row.value;
      getMateriBom({code:row.label}).then(function(res){
          let data=JSON.parse(res);
          if(data.state=="success"){
            that.editionlist=data.rows;
            that.edition=data.defaultEdition;
          }else{
            Toast(data.msg);
          }
      })
      this.modal1=false;
    },
    search() {
      let orgName = this.Orgvalue;
      let num = this.num;
      let bomId = this.edition;
      let that = this;
      if (orgName == "") {
        Toast("请选择工厂");
      } else {
        if (num == "") {
          Toast("请输入数量");
        } else {
          if (bomId == "") {
            Toast("请选择BOM版本");
          } else {
            this.activeNames = [];
            this.loading = true;
            apigetIBalancelist({
              orgName: orgName,
              num: num,
              bomId: bomId
            }).then(function(res) {
              let data = JSON.parse(res);
              if (data.state == "success") {
                that.reportData = data.rows;
                that.loading = false;
              } else {
                that.loading = false;
                Toast(data.msg);
              }
            });
          }
        }
      }
    }
  },
  mounted() {
    let title = this.$route.query.title;
    this.$store.commit("setTitle", title);
    let that = this;
    getFactory().then(res => {
      let data = JSON.parse(res);
      if (data.state == "success") {
        that.Orgcolumns = data.rows;
      } else {
        Toast(data.msg);
      }
    });
  }
};
</script>

<style scoped>
.specialfiled {
  padding: 10px;
  box-sizing: border-box;
}
.isEnough {
  color: rgb(25, 190, 107);
  font-weight: 600;
}
.isNotEnough {
  color: rgb(237, 64, 20);
  font-weight: 600;
}
.modal-head{
  margin-bottom: 10px;
}
.bd-input{
  width: 240px;
  margin-right: 10px;
}
</style>
<template>
  <div class="inventory">
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
          <van-field
            readonly
            clickable
            label="仓库"
            :value="Warevalue"
            placeholder="选择仓库"
            @click="showWare"
          />
          <van-field v-model="code" type="tel" label="物料编码"  placeholder="请输入编码" />
          <van-field v-model="name" type="text" label="物料名称" placeholder="请输入名称"/>
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
          @on-sort-change="sortChange"
        ></i-table>
        <van-pagination
          class="pager"
          v-model="pager.currentPage"
          :total-items="pager.total"
          :items-per-page="pager.pageItem"
          @change="search"
        />
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
    <van-popup v-model="showWarePicker" position="bottom">
      <van-picker
        show-toolbar
        :columns="Warecolumns"
        @cancel="showWarePicker = false"
        @confirm="onWareConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
import {
  apiStockorgList,
  apiWareHouseList,
  apiInventoryList
} from "../../request/api";
import { Toast } from "vant";
export default {
  name: "inventory",
  data() {
    return {
      activeNames: [],
      showOrgPicker: false,
      showWarePicker: false,
      Orgcolumns: [],
      Warecolumns: [],
      Orgvalue: "湖南科源医疗器材销售有限公司",
      Warevalue: "科源合格品库",
      code: "",
      name: "",
      pager: {
        currentPage: 1,
        total: 0,
        pageItem: 10
      },
      sorter: {
        key: "",
        order: ""
      },
      loading: false,
      reportData: [],
      reportColumns: [
        {
          title: "编码",
          key: "code",
          align: "center",
          width: 70,
          className: "iview-table"
        },
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
          key: "nonhandnum",
          align: "center",
          sortable: "custom",
          width: 90,
          className: "iview-table"
        }
      ]
    };
  },

  methods: {
    showWare() {
      if (this.Orgvalue == "") {
        Toast("请选择库存组织");
      } else {
        this.showWarePicker = true;
      }
    },
    onOrgConfirm(value) {
      this.Orgvalue = value;
      this.showOrgPicker = false;
    },
    onWareConfirm(value) {
      this.Warevalue = value;
      this.showWarePicker = false;
    },
    sortChange(e) {
      if (e.order != "normal") {
        this.sorter.key = e.key;
        this.sorter.order = e.order;
      } else {
        this.sorter.key = "";
        this.sorter.order = "";
      }
      this.search();
    },
    search() {
      let orgName = this.Orgvalue;
      let wareName = this.Warevalue;
      let code = this.code;
      let name = this.name;
      let currentPage = this.pager.currentPage;
      let pageItem = this.pager.pageItem;
      let key = this.sorter.key;
      let order = this.sorter.order;
      let that = this;
      if (orgName == "") {
        Toast("请选择库存组织");
      } else {
        if (wareName == "") {
          Toast("请选择仓库");
        } else {
          this.activeNames = [];
          this.loading = true;
          apiInventoryList({
            orgName: orgName,
            wareName: wareName,
            materielCode: code,
            materielName: name,
            currentPage: currentPage,
            pageItem: pageItem,
            key: key,
            order: order
          }).then(function(res) {
            let data = JSON.parse(res);
            if ((data.state = "success")) {
              that.reportData = data.rows;
              that.pager.total = data.total;
              that.loading = false;
            } else {
              that.loading = false;
              Toast(data.msg);
            }
          });
        }
      }
    },
    getWareHouseList(orgName){
      let that=this;
      apiWareHouseList({orgname:orgName}).then(function(res){
        let data = JSON.parse(res);
        if (data.state == "success") {
          that.Warecolumns = data.rows;
        } else {
          Toast(data.msg);
        }
      })
    }
  },
  watch: {
    Orgvalue(val) {
      this.Warevalue = "";
      this.getWareHouseList(val);
    }
  },
  mounted() {
    let title = this.$route.query.title;
    this.$store.commit("setTitle", title);
    let that = this;
    apiStockorgList().then(res => {
      let data = JSON.parse(res);
      if (data.state == "success") {
        that.Orgcolumns = data.rows;
      } else {
        Toast(data.msg);
      }
    });
    this.getWareHouseList("湖南科源医疗器材销售有限公司");
  }
};
</script>

<style scoped>
</style>
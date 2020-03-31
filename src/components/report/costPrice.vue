<template>
  <div class="costPrice">
    <van-nav-bar fixed>
      <div class="title" slot="title">{{this.$store.state.title}}</div>
    </van-nav-bar>
    <div class="report">
      <van-collapse v-model="activeNames">
        <van-collapse-item name="1">
          <div class="collapse-title" slot="title">查询方案</div>
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
  </div>
</template>

<script>
import { apigetCostPriceList } from "../../request/api";
import { Toast } from "vant";
export default {
  name: "costPrice",
  data() {
    return {
      activeNames: [],
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
          align: "center"
        },
        {
          title: "名称",
          key: "name",
          align: "center"
        },
        {
          title: "规格",
          key: "materialspec",
          align: "center"
        },
        {
          title: "单价",
          key: "norigtaxprice",
          align: "center",
          sortable: "custom"
        }
      ]
    };
  },
  methods: {
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
      
      let code = this.code;
      let name = this.name;
      let currentPage = this.pager.currentPage;
      let pageItem = this.pager.pageItem;
      let key = this.sorter.key;
      let order = this.sorter.order;
      let that = this;
      if (code == "" && name == "") {
        Toast("请输入物料编码或物料名称");
      } else {
        this.activeNames = [];
        this.loading = true;
        apigetCostPriceList({
          code: code,
          name: name,
          currentPage: currentPage,
          pageItem: pageItem,
          key: key,
          order: order
        }).then(res => {
          let data = JSON.parse(res);
          if (data.state == "success") {
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
  mounted(){
    let title = this.$route.query.title;
    this.$store.commit("setTitle", title);
  }
};
</script>

<style scoped>
</style>
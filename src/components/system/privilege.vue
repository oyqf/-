<template>
  <div class="privilege">
    <van-nav-bar fixed>
      <div class="title" slot="title">{{this.$store.state.title}}</div>
    </van-nav-bar>
    <div class="manage">
      <div class="manage-head">
        <i-input class="head-input" v-model="username" placeholder="请输入人员名称" />
        <Button type="info" @click="search1">查询</Button>
      </div>
      <i-table
        :height="450"
        border
        size="small"
        :columns="userColumns"
        :data="userData"
        :loading="loading"
      >
        <template slot-scope="{ row,index }" slot="action">
          <i-button type="primary" size="small" @click="modify(index)">修改</i-button>
        </template>
      </i-table>
      <van-pagination
        class="pager"
        v-model="pager.currentPage"
        :total-items="pager.total"
        :items-per-page="pager.pageItem"
        @change="search"
      />
    </div>
    <Modal v-model="modal1" title="角色列表" @on-ok="ok" @on-cancel="cancel">
      <i-table
        :height="350"
        border
        ref="selection"
        size="small"
        :columns="roleColumns"
        :data="roleData"
        :loading="loading1"
      ></i-table>
    </Modal>
  </div>
</template>

<script>
import { getRoleList, getUserList, modifyUser } from "../../request/api";
import { Toast } from "vant";
export default {
  inject: ["reload"],
  name: "privilege",
  data() {
    return {
      username: "",
      selectedUserId: "",
      modal1: false,
      loading1: false,
      loading: false,
      pager: {
        currentPage: 1,
        total: 0,
        pageItem: 10
      },
      userColumns: [
        {
          title: "编码",
          key: "id",
          align: "center",
          className: "iview-table"
        },
        {
          title: "名称",
          key: "name",
          align: "center",
          width: "100",
          className: "iview-table"
        },
        {
          title: "Action",
          slot: "action",
          align: "center",
          width: "80",
          className: "iview-table"
        }
      ],
      userData: [],
      roleColumns: [
        {
          type: "selection",
          width: 60,
          align: "center",
          className: "iview-table"
        },
        {
          title: "编码",
          key: "RoleID",
          align: "center",
          width: "70",
          className: "iview-table"
        },
        {
          title: "名称",
          key: "Name",
          align: "center",
          className: "iview-table"
        }
      ],
      roleData: []
    };
  },
  methods: {
    search() {
      let that = this;
      let username = this.username;
      let currentPage = this.pager.currentPage;
      getUserList({ page: currentPage, username: username })
      .then(function(res) {
        let data=JSON.parse(res);
        if (data.state == "success") {
          that.userData = data.rows;
          that.pager.total = data.total;
        } else {
          Toast(data.msg);
        }
      });
    },
    search1() {
      this.pager.currentPage = 1;
      this.pager.total = 0;
      this.search();
    },
    modify(index) {
      let roleStr = this.userData[index].roleList;
      this.selectedUserId = this.userData[index].id;
      let roleList = [];
      let roleList1 = this.$refs.selection.objData;
      if (roleStr != null) {
        roleList = roleStr.split(",");
      }
      for (let i = 0; i < roleList.length; i++) {
        for (let key in roleList1) {
          if (roleList[i] == roleList1[key].RoleID) {
            roleList1[key]._isChecked = true;
            break;
          }
        }
      }
      this.modal1 = true;
    },
    ok() {
      let that = this;
      let selectRole = "";
      let selectedUserId = this.selectedUserId;
      let roleList1 = this.$refs.selection.objData;
      for (let key in roleList1) {
        if (roleList1[key]._isChecked == true) {
          selectRole += roleList1[key].RoleID + ",";
        }
      }
      selectRole = selectRole.substring(0, selectRole.length - 1);
      modifyUser({ userId: selectedUserId, roleList: selectRole }).then(
        function(res) {
          let data=JSON.parse(res)
          if (data.state == "success") {
            that.reload();
            Toast(data.msg);
          } else {
            Toast(data.msg);
          }
        }
      );
    },
    cancel() {
      let selectData = this.$refs.selection.objData;
      for (let key in selectData) {
        selectData[key]._isChecked = false;
      }
    }
  },
  mounted() {
    let title = this.$route.query.title;
    this.$store.commit("setTitle", title);
    let that = this;
    this.search();
    getRoleList().then(function(res) {
      let data=JSON.parse(res)
      if (data.state == "success") {
        that.roleData = data.rows;
      } else {
        Toast(data.msg);
      }
    });
  }
};
</script>

<style scoped>
.manage-head{
    text-align: center;
}
</style>
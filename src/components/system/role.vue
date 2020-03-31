<template>
  <div class="role">
    <van-nav-bar fixed>
      <div class="title" slot="title">{{this.$store.state.title}}</div>
    </van-nav-bar>
    <div class="manage">
      <div class="manage-head">
        <i-input class="head-input" v-model="rolename" placeholder="请输入角色名称" />
        <Button type="info" @click="search">查询</Button>
        <Button type="success" @click="openmodal">新增</Button>
      </div>
      <i-table
        :height="550"
        border
        size="small"
        :columns="roleColumns"
        :data="roleData"
        :loading="roleTableloading"
      >
        <template slot-scope="{ row,index }" slot="action">
          <i-button type="primary" size="small" @click="modify(index)">修改</i-button>
          <i-button type="error" size="small" @click="remove(row.RoleID)">删除</i-button>
        </template>
      </i-table>
    </div>
    <Modal v-model="modal" :closable="false" @on-ok="roleok" @on-cancel="rolecancel">
      <i-input v-model="newrolename" placeholder="请输入角色名称" />
    </Modal>
    <Modal v-model="modal1" title="节点列表" @on-ok="nodeok" @on-cancel="nodecancel">
      <i-table
        :height="250"
        border
        ref="selection"
        size="small"
        :columns="nodeColumns"
        :data="nodeData"
      ></i-table>
    </Modal>
  </div>
</template>

<script>
import {
  getRoleList,
  addRole,
  deleteRole,
  modifyRole,
  getNodeList
} from "../../request/api";
import { Toast, Dialog } from "vant";
export default {
  inject: ["reload"],
  name: "role",
  data() {
    return {
      modal: false,
      modal1: false,
      rolename: "",
      newrolename: "",
      selectroleid: "",
      roleTableloading: false,
      roleData: [],
      roleColumns: [
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
          width: "120",
          className: "iview-table"
        },
        {
          title: "Action",
          slot: "action",
          align: "center",
          className: "iview-table"
        }
      ],
      nodeColumns: [
        {
          type: "selection",
          width: 60,
          align: "center",
          className: "iview-table"
        },
        {
          title: "编码",
          key: "SubmenuID",
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
      nodeData: []
    };
  },
  methods: {
    search() {
      let that = this;
      let rolename = this.rolename;
      this.roleTableloading=true;
      getRoleList({ name: rolename }).then(function(res) {
        let data=JSON.parse(res);
        if (data.state == "success") {
          that.roleData = data.rows;
          that.roleTableloading=false;
        } else {
          that.roleTableloading=false;
          Toast(data.msg);
        }
      });
    },
    remove(RoleID) {
      Dialog.confirm({
        message: "确认删除?"
      })
        .then(() => {
          let that = this;
          deleteRole({ roleid: RoleID }).then(function(res) {
            let data=JSON.parse(res);
            if (data.state == "success") {
              Toast(data.msg);
              that.reload();
            } else {
              Toast(data.msg);
            }
          });
        })
        .catch(() => {});
    },
    modify(index) {
      let nodeStr = this.roleData[index].SubmenuList;
      this.selectroleid = this.roleData[index].RoleID;
      let nodeList = [];
      let nodeList1 = this.$refs.selection.objData;
      if (nodeStr != null) {
        nodeList = nodeStr.split(",");
      }
      for (let i = 0; i < nodeList.length; i++) {
        for (let key in nodeList1) {
          if (nodeList[i] == nodeList1[key].SubmenuID) {
            nodeList1[key]._isChecked = true;
            break;
          }
        }
      }
      this.modal1 = true;
    },
    roleok() {
      let that = this;
      let newrolename = this.newrolename;
      addRole({ rolename: newrolename }).then(function(res) {
        let data=JSON.parse(res);
        if (data.state == "success") {
          that.newrolename = "";
          Toast(data.msg);
          that.reload();
        } else {
          Toast(data.msg);
        }
      });
    },
    nodeok() {
      let that = this;
      let selectroleid = this.selectroleid;
      let selectNode = "";
      let selectData = this.$refs.selection.objData;
      for (let key in selectData) {
        if (selectData[key]._isChecked == true) {
          selectNode += selectData[key].SubmenuID + ",";
        }
      }
      selectNode = selectNode.substring(0, selectNode.length - 1);
      modifyRole({ roleID: selectroleid, nodelist: selectNode })
      .then(function(res) {
        let data=JSON.parse(res);
        if (data.state == "success") {
          Toast(data.msg);
          that.reload();
        } else {
          Toast(data.msg);
        }
      });
    },
    rolecancel() {
      this.newrolename = "";
    },
    nodecancel() {
      let selectData = this.$refs.selection.objData;
      for (let key in selectData) {
        selectData[key]._isChecked = false;
      }
    },
    openmodal() {
      this.modal = true;
    }
  },
  mounted() {
    let title = this.$route.query.title;
    this.$store.commit("setTitle", title);
    let that = this;
    this.search()
    getNodeList().then(function(res) {
      let data=JSON.parse(res);
      if (data.state == "success") {
        that.nodeData = data.rows;
      } else {
        Toast(data.msg);
      }
    });
  }
};
</script>

<style scoped>

</style>
<template>
  <div class="home" v-if="login">
    <van-nav-bar>
      <div class="home-head" slot="title">
        <img src="../assets/img/title.png" alt />
      </div>
    </van-nav-bar>
    <div class="home-body">
      <img src="../assets/img/head.png" alt />
      <div v-for="item in menu" :key="item.rootID" class="menu-body">
        <p class="menu-title">{{item.rootName}}</p>
        <van-grid :column-num="4" :border="false">
          <van-grid-item
            v-for="item1 in item.menuitem"
            :key="item1.nodeID"
            @click="to(item1.nodeUrl,item1.nodeName)"
          >
            <svg class="icon svg-icon" aria-hidden="true">
              <use :xlink:href="'#'+item1.nodeIcon" />
            </svg>
            <p class="item-name">{{item1.nodeName}}</p>
          </van-grid-item>
        </van-grid>
      </div>
    </div>
  </div>
</template>

<script>
import { createMenu, GetAccessToken, GetuserID } from "../request/api";
import { Toast } from "vant";
import * as dd from "dingtalk-jsapi";
export default {
  name: "home",
  data() {
    return {
      menu: [],
      login:false
    };
  },
  methods: {
    to(url, title) {
      if (url != null) {
        this.$router.push({
          path: url,
          query: {
            title: title
          }
        });
      } else {
        this.$router.push({
          path: "/developing",
          query: {
            title: title
          }
        });
      }
    },
  },
  mounted() {
    let that = this;
      if (this.$store.state.userid == "") {
        dd.ready(function() {
          dd.runtime.permission.requestAuthCode({
            corpId: "ding11267caf60aa942435c2f4657eb6378f", // 企业id
            onSuccess: function(info) {
              let code = "";
              let accessToken = "";
              code = info.code; // 通过该免登授权码可以获取用户身份
              GetAccessToken().then(function(res) {
                let data = JSON.parse(res);
                if (data.errmsg == "ok") {
                  accessToken = data.access_token;
                  GetuserID({ access_token: accessToken, code: code }).then(
                    function(res1) {
                      let data = JSON.parse(res1);
                      if (data.errmsg == "ok") {
                        that.$store.commit("setUserID", data.userid);
                        let userid = that.$store.state.userid;
                        createMenu({ dingID: userid }).then(function(res) {
                          let data = JSON.parse(res);
                          if (data.state == "success") {
                            that.menu = data.menu;
                            that.login=true;
                            that.$store.commit("setMenu", data.menu);
                            that.$store.commit("setNodeList", data.nodeList);
                          } else {
                            Toast(data.msg);
                          }
                        });
                      } else {
                        Toast.fail("请在钉钉中打开此应用");
                      }
                    }
                  );
                }
              });
            },
            onFail: function(err) {
              Toast.fail("请在钉钉中打开此应用");
            }
          });
        });
      } else {
        this.login=true;
        this.menu = this.$store.state.menu;
      }
  }
};
</script>

<style scoped>
.home-head {
  font-weight: 600;
}
.home-head > img {
  width: 50%;
  vertical-align: middle;
}
.home-body {
  text-align: center;
}
.home-body > img {
  width: 95%;
}
.icon {
  font-size: 50px;
}
.menu-title {
  text-align: left;
  font-size: 16px;
  padding: 5px 5px 5px 5px;
  margin: 10px 10px 10px 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  color: rgba(0, 0, 0, 0.8);
}
.item-name {
  font-weight: 500;
}
</style>
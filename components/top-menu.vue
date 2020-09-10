<template>
  <div class="top-menu">
    <div class="head-top-nav">
      <img src="../assets/images/common/logoNew.png" style="float: left;display: inline;margin: 18px 8px 0px 0px;">
      <div class="heard-top-text">
        <!-- <div class="text-one" style="letter-spacing: 1PX;">倚天数字化平台</div>
        <div class="text-two" style="font-family: cursive;">WEBDEVELOPMENT HIERARCHY CONSTRUCT PLATFORM</div> -->
        <!-- <img src="../assets/images/common/logoNew.png" class="heard-top-img"> -->
      </div>
      <!-- <img src="../assets/images/common/logo.png" class="heard-logo-img" />
      <img src="../assets/images/common/nav-logo.png" class="heard-top-img" /> -->
    </div>
    <div class="nav-right-model">
      <ul id="nav-fun-list">
        <!-- <li>
            <nuxt-link to="/">
						<div class="common-div home-model nav-check">
							<img class="nav-fun-icon" src="../assets/images/common/index-icon2.png" style="margin-bottom: 3px;margin-right: 2px;" /><span>首页</span>
							<input type="hidden" class="nav-fun-hid" value="index" />
						</div>
            </nuxt-link>
        </li> -->
        <!-- <li class="them-li">
          <div
            class="common-div change-model"
            :class="themePanel ? 'nav-check nav-fun-check' : ''"
            @mouseover="themePanel = true"
            @mouseout="themePanel = false"
          >
            <img class="nav-fun-icon" src="../assets/images/common/cf2.png" />
            <span>主题</span>
            <input type="hidden" class="nav-fun-hid" value="changeTheme" />
          </div>
          <div class="theme-panel" v-show="themePanel">
            <div class="theme-div" theme-code="default">
              <span class="def-theme"></span>
              <span>默认</span>
            </div>
            <div class="theme-div" theme-code="purple">
              <span class="purple-theme"></span>
              <span>紫色系</span>
            </div>
            <div class="theme-div" theme-code="red">
              <span class="red-theme"></span>
              <span>中大院</span>
            </div>
          </div>
        </li> -->
        <li v-if="isLeftMenuShow">
          <div class="common-div logout-model" @click="toProjectManagerPage()">
            <span style="color:#fff">项目经理操作平台</span>
          </div>
        </li>
        <li>
          <div class="common-div logout-model" @click="logoutCas()">
            <img class="nav-fun-icon" src="../assets/images/common/logo-out-icon2.png" />
            <span style="color:#fff">注销</span>
            <input type="hidden" class="nav-fun-hid" value="out" />
          </div>
        </li>
        <li class="users-info-li">
          <span class="logo-user-name">{{userInfo.realName}}</span>
        </li>
        <li>
          <div class="common-div logout-model" @click="password()">
            <!-- <img class="nav-fun-icon" src="../assets/images/common/logo-out-icon2.png" /> -->
            <span style="color:#fff">修改密码</span>
            <input type="hidden" class="nav-fun-hid" value="out" />
          </div>
        </li>
        <li class="li-bak" style="display: none;"></li>
      </ul>
      <div style="clear: both;"></div>
    </div>
  </div>
</template>
<script>
import { option } from '../static/config';
import axios from '../service/http';
export default {
  props: {
    isLeftMenuShow: true
  },
  data() {
    return {
      themePanel: false,
      userInfo: {}
    };
  },
  mounted() {
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      axios.post('index/getCurrentUserInfo', {
        page: 1
      }).then(res => {
        this.userInfo = res.data.data;
      });
    },
    // 修改密码
    password () {
      this.$router.push({
        path: '/projectApproval/password',
        query: {
          dialogState: true
        }
      });
    },
    toProjectManagerPage() {
      let params = {}
      let routeData = this.$router.resolve({ 
        path: '/projectManagerOperating/projectManagerPage',
        query: params,
        params:{}
      })
      window.open(routeData.href, '_blank');
      // this.$router.push({
      //   path: '/projectManagerOperating/projectManagerPage',
      //   query: {
      //   }
      // })
    },
    logoutCas() {
      window.location.href=option.logoutUrl;
    }
  }
};
</script>
<style scoped>
.top-menu {
  width: 100%;
  height: 100%;
}
.nav-right-model {
  display: inline-block;
  height: 80px;
  line-height: 80px;
  position: absolute;
  right: 0;
  padding-right: 20px;
  background: #475c6d;
}
.nav-right-model ul li {
  float: left;
  font-size: 16px;
  color: #AAAAAA;
  padding-left: 40px;
  cursor: pointer;
}
.nav-right-model ul li div.common-div {
  height: 75px;
  padding: 0 10px;
}
.nav-right-model ul li img {
  vertical-align: middle;
  /* margin-right: 3px; */
  margin-bottom: 2px;
}
.theme-panel {
  background: #fff;
  border: 1px solid #417095;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  border-radius: 3px;
  cursor: pointer;
}
.theme-panel .theme-div {
  padding: 2px 0 0 5px;
  color: #333 !important;
  font-size: 14px;
  height: 35px;
  line-height: 35px;
  border-bottom: 1px solid #e0dede;
  cursor: pointer;
}
.def-theme {
  margin: 0 5px 5px 0;
  display: inline-block;
  width: 20px;
  height: 20px;
  background: #417095;
  vertical-align: middle;
}
.purple-theme {
  margin: 0 5px 5px 0;
  display: inline-block;
  width: 20px;
  height: 20px;
  background: #464e78;
  vertical-align: middle;
}
.red-theme {
  margin: 0 5px 5px 0;
  display: inline-block;
  width: 20px;
  height: 20px;
  background: #de595a;
  vertical-align: middle;
}
.nav-right-model ul li div.common-div {
  height: 75px;
  padding: 0 10px;
}
.nav-right-model .logo-user-name {
  margin-left: 5px;
  color: #ffffff !important;
}
.nav-fun-check {
  color: #ffffff !important;
}

.nav-check {
  color: #ffffff !important;
  border-bottom: 4px solid #179ee8;
}
.heard-top-text{
  float: left;
  padding-top: 15px;
  color: #fff;
}
.heard-top-text .text-one {
    line-height: normal;
    font-size: 24px;
    font-weight: bold;
}
.heard-top-text .text-two {
    line-height: normal;
    font-size: 12px;
}
.head-top-nav {
  width: 410px;
  height: 80px;
  float: left;
}

.head-top-nav img {
  pointer-events: none;
  vertical-align: middle;
}
</style>

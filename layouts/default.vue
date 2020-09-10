<template>
  <div class="container">
    <el-container>
      <el-header class="yt-header-index" height="80px">
        <top-menu :isLeftMenuShow="isLeftMenuShow"></top-menu>
      </el-header>
      <el-container>
        <el-aside v-if="isLeftMenuShow" class="yt-aside" width="200px">
          <left-menu></left-menu>
        </el-aside>
        <el-main class="yt-main" :style="{height: mainHeight}">
          <!--<router-link to="/user">
							user
						</router-link>
						<router-link to="/register">
							Register
          </router-link>-->
          <!-- <div :style="{height: mainHeight, color: 'red'}"> -->
            <nuxt />
          <!-- </div> -->
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import leftMenu from "~/components/left-menu.vue";
import topMenu from "~/components/top-menu.vue";
export default {
  data() {
    return {
      isLeftMenuShow: true,
      mainHeight: '100%'
    };
  },
  mounted() {
    this.getHeight();
    let ThisPagePath = this.$route.path;
    let queryParams = this.$route.query
    this.isLeftMenuShow = queryParams.menuShow == undefined ? true : queryParams.menuShow
    if (ThisPagePath === '/projectManagerOperating/projectManagerPage' || ThisPagePath === '/firstPage/firstPage') {
      this.isLeftMenuShow = false;
    }
    
  },
  created() {},
  methods: {
    //获取设置浏览器高度-80后设置给height变量
    getHeight() {
      this.mainHeight = window.innerHeight - 80 + 'px';
    }
  },
  watch: { // 监听路由变化
    $route (to, from) {
      let queryParams = to.query
      this.isLeftMenuShow = queryParams.menuShow == undefined ? true : queryParams.menuShow
      let ThisPagePath = to.fullPath;
      if (ThisPagePath === '/projectManagerOperating/projectManagerPage' || ThisPagePath === '/firstPage/firstPage') {
        this.isLeftMenuShow = false;
      }
    }
  },
  components: {
    leftMenu,
    topMenu
  }
};
</script>

<!--引用公用css文件-->
<style src="../assets/css/common/yt-common.css"></style>

<!--演示文件通用样式-->
<style src="../assets/css/common/demo.css"></style>

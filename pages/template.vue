<template>
  <div class="yt-dome-container">123</div>
</template>

<script>
//一级标题
import topTip from "../components/topTip";
//提交附件
import upload from "../components/upload";
//查看附件
import lookFiles from "../components/lookFiles.vue";
//axios接口组件
import axios from "../service/http";
//配置文件
import { option } from "../static/config";
export default {
  data() {
    return {};
  },
  components: {
    topTip,
    upload,
    lookFiles
  },
  mounted() {},
  methods: {}
};
</script>

<style scoped>
</style>

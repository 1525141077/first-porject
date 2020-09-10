<template>
  <div class="container">
    <div v-if="error.statusCode === 404">
      <img src="../assets/images/common/develop-page.png" alt="">
    </div>
    <div v-else>应用发生错误异常</div>
    <!-- <nuxt-link to="/">首 页</nuxt-link> -->
  </div>
</template>

<script>
export default {
  props: ['error'],
  layout: 'blog' // 你可以为错误页面指定自定义的布局
}
</script>

<style scoped>
.container {
	display: flex;
  height: 100%;
  flex-direction:column;
	justify-content : center;
	align-items : center;
}
</style>
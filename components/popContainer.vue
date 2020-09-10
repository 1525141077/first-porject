<template>
<div>
  <div class='popContainer'>
    <div class="pop-info">{{popInfo}}</div>
  </div>
</div>
</template>

<script>
// 父组件需要调用v-if来刷新组件
// 设置setTimeout函数
export default {
  props: {
    message: ''
  },
    data(){
        return{
          popInfo: this.message
        }
    },
    mounted () {
    },
    methods:{
    },
    components:{
      
    }
}
</script>

<style>
div.popContainer {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  text-align: center;
  padding-top: 20%;
}
.pop-info {
  padding: 0px 20px;
    color: #ffffff;
    line-height: 57px;
    display: inline-block;
    height: 60px;
    background: #B3B3B3;
    border-radius: 7px;
    opacity: 0.8;
    margin:  0 auto;
}
</style>
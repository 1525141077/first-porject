<template>
  <div class="main">
    <div class="content" v-for="(item,index) in list" :key="index">
      <h1 class="content-title">{{item.compName}}</h1>
      <div class="man">
        <span class="man-text">法定代表人：{{item.compPerson?item.compPerson:"--"}}</span>
        <span>注册资金：{{item.registeredCapital|moneyFormat}}</span>
      </div>
      <a class="btn" @click="details(item.compId)">查看详情</a>
    </div>
  </div>
</template>

<script>
//axios接口组件
import axios from "../../service/http";
//配置文件
import { option } from "../../static/config";
export default {
  data() {
    return {
      list: [],
    };
  },
  components: {},
  mounted() {
    this.getList();
  },
  filters:{
    moneyFormat (num) {
      if (num) {
        num = Number(num)
        num = (num.toFixed(2) + '').replace(
          /\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,
          '$&,'
        )
      }
      return num || '0.00'
    }
  },
  methods: {
    getList() {
      axios.post(option.base_path + "manpower/comp/getCompList").then((res) => {
        if (res.data.flag == 0) {
          this.list = res.data.data;
          console.log(res);
        }
      });
    },
    // 点击跳转详情
    details(id) {
      this.$router.replace({
        path: "/personnelArchives/viewCompInfor",
         query: {
          compId: id,
        }
       
      });
      //  this.$emit('/approval/details', id);
      console.log(id);
    },
    
  },
};
</script>

<style scoped>
.main {
  /* border: 1px solid #c0c0c0; */
  margin: 0px 10px 0px 0px;
}
.content {
  display: inline-block;
  position: relative;
  height: 180px;
  text-align: center;
  width: 49%;
  /* border: 1px solid black; */
  margin: 10px 0px 0px 10px;
  background-color: #ffffff;
}
.content-title {
  margin-top: 30px;
  text-align: center;
  font-weight: 800;
  font-size: 22px;
  color: #003465;
}
.man {
  margin-top: 30px;
}
.man-text {
  margin-right: 30px;
}
.btn {
  position: absolute;
  cursor: pointer;
  margin-top: 30px;
  right: 20px;
  color: #257db9;
}
</style>

<template>
  <div class="journa-list" v-if="LogList.length > 0">
    <topTip>
      <template>
        <el-col :span="8" style="text-align: left;" class="top-tip">
          <span style="color: #417095;font-size: 16px;font-weight: bolder;">日志信息</span>
        </el-col>
      </template>
    </topTip>
    <div class="row-div">
      <el-table border class="rz-tab" :data="LogList" :show-header="false">
        <el-table-column :key="Math.random()" prop="createUserName" align="center" width="100px"></el-table-column>
        <el-table-column :key="Math.random()" prop="createTime" label align="center" width="150px"></el-table-column>
        <el-table-column :key="Math.random()" prop="operation" label align="left"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import topTip from "./topTip.vue";
import axios from "../service/http";
import { option } from "../static/config";
export default {
  props: {
    //id
    pkId: "",
    //接口地址
    axiosUrl: {
      type: String,
      default() {
        return "";
      }
    }
  },
  data() {
    return {
      LogList: [],
      mainMap: {
        mainId: this.pkId
      }
    };
  },
  watch: {
    pkId: {
      handler(newVal, oldVal) {
        this.mainMap.mainId = newVal;
      }
    }
  },
  mounted() {
    this.getProjectJournalList();
  },
  methods: {
    //项目立项修改记录查询
    getProjectJournalList() {
      let tooltipList = [];
      var me = this;
      //调用axios.post方法
      //"CASPARAMS":"OFF_INDEX"
      axios
        .post(this.axiosUrl, this.pkId)
        .then(data => {
          // this.peopleList.push(man)
          this.LogList = data.data.data.logList;
          if (this.LogList.length !== 0) {
            // // // this.LogList.forEach(n => {
            // // //   tooltipList = n.operation.split('；')
            // // //   //set第一个值是要改谁 第二个值是改第一个里边的谁 第三个值是要改成什么
            // // //   //this.$set(n, 'tooltipList', tooltipList)
            // // // })
          }
          console.log("返回值", data.data.data);
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  },
  components: {
    topTip
  }
};
</script>

<style>
</style>

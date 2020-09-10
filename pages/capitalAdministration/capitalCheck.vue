<template>
  <div class="yt-dome-container">
    <topTip>
      <template>
        <el-col :span="8" style="text-align: left;" class="top-tip">
          <span style="color: #417095;font-size: 16px;font-weight: bolder;">现金收支</span>
        </el-col>
      </template>
    </topTip>
    <div class="baseInfo" style="margin-bottom:20px">
      <el-row>
        <el-col>
          <span class="yt-read-text">账户名称：</span>
          <span>{{this.accountName}}</span>
        </el-col>
      </el-row>
      <el-row style="margin-top:20px">
        <el-col :span="12">
          <span class="yt-read-text">编号：</span>
          <span>{{this.cashNum}}</span>
        </el-col>
        <el-col :span="12">
          <span class="yt-read-text">查询期间：</span>
          <span>{{this.startDate}}</span>
          <span class="yt-read-text">至</span>
          <span>{{this.endDate}}</span>
        </el-col>
      </el-row>
    </div>
    <el-table :data="bankList" border style="width: 100%;margin-bottom: 20px;">
       <el-table-column prop="appNum" header-align="center" align="center" label="单据编号"></el-table-column>
      <el-table-column prop="balanceDate" header-align="center" align="center" label="日期"></el-table-column>
      <el-table-column prop="balanceAmount" header-align="center" align="right" label="收入金额">
        <template scope="scope">
          <span>{{scope.row.balanceAmount | moneyFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="expenditureAmount" header-align="center" align="right" label="支出金额">
        <template scope="scope">
          <span>{{scope.row.expenditureAmount | moneyFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remarks" header-align="center" align="center" label="备注"></el-table-column>
      <el-table-column prop="createTime" header-align="center" align="center" label="录入时间"></el-table-column>
    </el-table>
    <el-pagination
      background
      :current-page="currentPage"
      :page-sizes="[15, 30, 50, 100, 200, 500]"
      :page-size="15"
      layout="total, prev, pager, next, sizes"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
    <div style="text-align: center;padding:20px 0px">
      <button type="button" class="el-button yt-bottom-btn el-button--primary" @click="returnList"><span>关闭</span></button>
    </div>
  </div>
</template>

<script>
//一级标题
import topTip from "@/components/topTip";
//提交附件
import upload from "@/components/upload";
//查看附件
import lookFiles from "@/components/lookFiles.vue";
//金额输入框
import finMoneyInput from "@/components/fin-money-input.vue";
//axios接口组件
import axios from "@/service/http";
//配置文件
import { option } from "@/static/config";
export default {
  data() {
    return {
      activeName: 'first',
      bankList:[],
      currentPage: 1,
      pageNum:'',
      pageSize:'',
      total: 0,
      accountName:'',
      cashNum:'',
      startDate:'',
      endDate:'',
    };
  },
  components: {
    topTip,
    upload,
    lookFiles
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
  mounted() {
    this.getCashManageDetails();
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleSizeChange(val) {
      this.pageSize= val;
      console.log(`每页 ${val} 条`);
      this.getCashManageDetails();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      console.log(`当前页: ${val}`);
      this.getCashManageDetails();
    },
    //获取现金收支查看列表
    getCashManageDetails(){
      var that=this;
      let data={};
      data.pkId=this.$route.query.pkId;
      data.startDate=this.$route.query.startDate;
      data.endDate=this.$route.query.endDate;
      data.pageSize=this.pageSize||15;
      data.pageNum=this.pageNum||1;
      axios
        .post(
          option.base_path + "db/capital/getCashManageDetails",data
        )
        .then(res => {
          that.accountName=this.$route.query.accountName;
          that.cashNum=this.$route.query.cashNum;
          that.startDate=this.$route.query.startDate;
          that.endDate=this.$route.query.endDate;
          that.bankList=res.data.data.rows;
          that.total = res.data.data.total;
          this.bankList.forEach((n) => {
                for (let k in n) {
                  if (n[k] === "") {
                    n[k] = "--";
                  }
                }
              });
        })
        .catch(err => err);
    },
    //返回
    returnList(){
      this.$router.replace({
        path: "/capitalAdministration/bankAndCash",
      });
    },

  }
};
</script>

<style scoped>
.baseInfo {
  margin: 0 20px;
}
.yt-read-text {
  color: rgb(65, 112, 149);
  font-weight: bold;
}
</style>

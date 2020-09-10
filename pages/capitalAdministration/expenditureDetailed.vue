<template>
  <div class="yt-dome-container">
    <topTip>
      <template>
          <el-col :span="8" style="text-align: left;" class="top-tip">
          <span style="color: #417095;font-size: 16px;font-weight: bolder;">收支明细信息</span>
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
          <span class="yt-read-text">银行帐号：</span>
          <span>{{this.accountNumber}}</span>
        </el-col>
        <el-col :span="12">
          <span class="yt-read-text">查询期间：</span>
          <span>{{this.startDate}}</span>
          <span class="yt-read-text">至</span>
          <span>{{this.endDate}}</span>
        </el-col>
      </el-row>
    </div>
    <div class="tab-mod" style="padding: 0px 10px 20px 10px;">
      <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="收入明细" name="first">
          <el-table :data="incomeList" border style="width: 100%;margin-bottom: 20px;">
            <el-table-column prop="entryAccountNum" header-align="center" align="center" label="到账单编号"></el-table-column>
            <el-table-column prop="entryAccountDate" header-align="center" align="center" label="到账日期"></el-table-column>
            <el-table-column prop="remitterName" header-align="center" align="center" label="汇款方名称"></el-table-column>
            <el-table-column prop="remitterAccount" header-align="center" align="center" label="汇款方账号"></el-table-column>
            <el-table-column prop="payeeAmountMoney" header-align="center" align="center" label="收款金额（元）">
                <template slot-scope="scope">
          <span>{{scope.row.payeeAmountMoney | moneyFormat}}</span>
        </template>
            </el-table-column>
          </el-table>
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[15, 30, 50, 100, 200, 500]"
            :page-size="15"
            layout="total, prev, pager, next, sizes"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </el-tab-pane>
        <el-tab-pane label="支出明细" name="second">
          <el-table :data="expenditureList" border style="width: 100%;margin-bottom: 20px;">
            <el-table-column prop="appNum" header-align="center" align="center" label="单据编号"></el-table-column>
            <el-table-column prop="costName" header-align="center" align="center" label="单据类型"></el-table-column>
            <el-table-column prop="balanceDate" header-align="center" align="center" label="支付日期"></el-table-column>
            <el-table-column prop="balanceAmount" header-align="center" align="center" label="支出金额（元）"></el-table-column>
            <el-table-column prop="receivablesName" header-align="center" align="center" label="收款方"></el-table-column>
            <el-table-column prop="accounts" header-align="center" align="center" label="收款帐号"></el-table-column>
          </el-table>
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[15, 30, 50, 100, 200, 500]"
            :page-size="15"
            layout="total, prev, pager, next, sizes"
            :total="expendTotal"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </el-tab-pane>
      </el-tabs>
    </div>
     <!-- 底部按钮START -->
      <div style="width: 100px;;margin: 20px auto 0px;">
         <el-row>
          <el-button @click="closeYe">关闭</el-button>
      </el-row>
      </div>
    <!-- 底部按钮END -->
  </div>
</template>

<script>
//一级标题
import topTip from "@/components/topTip";
//提交附件
import upload from "@/components/upload";
//查看附件
import lookFiles from "@/components/lookFiles.vue";
//axios接口组件
import axios from "@/service/http";
//配置文件
import { option } from "@/static/config";
export default {
  data() {
    return {
      activeName: 'first',
      incomeList:[],
      expenditureList:[],
      currentPage: 1,
      pageNum:'',
      pageSize:'',
      total: 0,
      expendTotal: 0,
      accountName:'',
      accountNumber:'',
      startDate:'',
      endDate:'',
    };
  },
  components: {
    topTip,
    upload,
    lookFiles
  },
  mounted() {
    this.getBankAccountDetails();
    this.getBankAccountExpenditureDetails();
  },
   filters: {
    moneyFormat(num) {
      if (num) {
        num = Number(num);
        num = (num.toFixed(2) + "").replace(
          /\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,
          "$&,"
        );
      }
      return num || "0.00";
    }
  },
  methods: {
    // 关闭当前页
    closeYe(){
        this.$router.push({ path: "/capitalAdministration/bankAndCash" });
      },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleSizeChange(val) {
      this.pageSize= val;
      console.log(`每页 ${val} 条`);
      this.getBankAccountDetails();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      console.log(`当前页: ${val}`);
      this.getBankAccountDetails();
    },
    //获取收入明细列表
    getBankAccountDetails(){
      let that=this;
      let data={};
      data.pkId=this.$route.query.pkId;
      data.startDate=this.$route.query.startDate;
      data.endDate=this.$route.query.endDate;
      data.pageSize=this.pageSize||15;
      data.pageNum=this.pageNum||1;
      axios
        .post(
          option.base_path + "db/capital/getBankAccountDetails",data
        )
        .then(res => {
          that.accountName=this.$route.query.accountName;
          that.accountNumber=this.$route.query.accountNumber;
          that.startDate=this.$route.query.startDate;
          that.endDate=this.$route.query.endDate;
          that.incomeList=res.data.data.rows;
          that.total = res.data.data.total;
        })
        .catch(err => err);
    },
    getBankAccountExpenditureDetails(){
      let thats=this;
      let data={};
      data.pkId=this.$route.query.pkId;
      data.startDate=this.$route.query.startDate;
      data.endDate=this.$route.query.endDate;
      data.pageSize=this.pageSize||15;
      data.pageNum=this.pageNum||1;
      axios
        .post(
          option.base_path + "db/capital/getBankAccountExpenditureDetails",data
        )
        .then(res => {
          thats.accountName=this.$route.query.accountName;
          thats.accountNumber=this.$route.query.accountNumber;
          thats.startDate=this.$route.query.startDate;
          thats.endDate=this.$route.query.endDate;
          thats.expenditureList=res.data.data.rows;
          thats.expendTotal = res.data.data.total;
        })
        .catch(err => err);
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

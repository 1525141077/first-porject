<template>
  <div class="yt-dome-container">
    <!-- 页面表头搜索框及查询按钮START -->
    <el-row style="padding-left: 10px;">
      <el-col :span="10">
        <el-form label-width="70px" size="small">
          <el-form-item label="关  键  字：">
            <el-input class placeholder="请输入" v-model="form.queryParams" clearable></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="3" style="text-align: right;">
        <el-button type="primary" @click="clickQuery">查询</el-button>
        <el-button type="info" @click="resetForm(form) ">重置</el-button>
      </el-col>
    </el-row>
    <!-- 页面表头搜索及查询按钮END -->
    <!-- 页面表格START -->
    <div class="tab-mod" style="padding: 0px 0px 20px 0px;">
      <el-tabs type="border-card" v-model="activeTab" @tab-click="handleClick">
        <!-- 支出明细状态的表格START -->
        <!-- 支出金额合计字段START -->
        <el-tab-pane label="支出明细"  v-model="form.type"  name="first">
          <el-row style="text-align: right;padding: 13px 20px 13px 0;">
            <el-col :span="24">
              <span style="color: #417095;font-weight: 700;">支出金额合计：</span>
              <span>{{sumExp}}</span>元
            </el-col>
          </el-row>
          <!-- 支出金额合计字段END -->
          <el-table
            :data="pendingTableData"
            border
            style="width: 100%;">
            <el-table-column
              prop="appNum"
              label="单据编号"
              width="150"
              align='center'
              >
              <!-- <el-link type="primary" v-for ='item in data.pependingTableData.num' >{{item}}</el-link> -->
            </el-table-column>
            <el-table-column
              prop="applicantUserName"
              label="申请人"
              width="100"
              align='center'>
            </el-table-column>
            <el-table-column
              prop="appName"
              label="支出事由"
              width=""
              align="center"
              >
            </el-table-column>
            <el-table-column
              prop="costName"
              label="单据类型"
              width="100"
              align="center"
              >
            </el-table-column>
            <el-table-column
              prop="expenditureMoney"
              label="支出金额"
              width="100"
              align='right'
              >
              <template slot-scope='scope'>
                <span >{{scope.row.expenditureMoney | moneyFormat }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="applicationTime"
              label="申请日期"
              width="150"
              align="center"
              >
            </el-table-column>
            <el-table-column
              prop="paymentDate"
              label="支付日期"
              width="150"
              align="center"
              >
            </el-table-column>
            <el-table-column
              prop="operat"
              label="操作"
              width="100"
              align="center"
              >
              <template slot-scope='scope'>
                <!-- <el-link type="primary" v-show="sc.row.taskKey!='activitiStartTask'" @click='toPage2("/approval/details",sc.row)' >查看</el-link> -->
                <el-link type="primary" @click='toPage2("/expensesReim/expenseAppDetail",scope.row)' >查看</el-link>
                <!-- <el-link type="primary" v-show="sc.row.taskKey=='activitiStartTask'" @click='toPage3("/busiTripApply/serveApply",sc.row)' >处理</el-link> -->
                <!-- <el-link type="primary" :underline="false">|</el-link> -->
                <!-- <lookApproveLog :processInstanceId="sc.row.processInstanceId">日志</lookApproveLog> -->
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            :current-page="currentPage"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[15, 30, 50, 100, 200, 500]"
            :page-size="15"
            layout="total, prev, pager, next"
            :total="total"
            >
          </el-pagination>
        <!-- 分页END -->
          <!-- 支出明细状态的表格END -->
        </el-tab-pane>
        <!-- 待执行明细START -->
        <el-tab-pane label="待执行明细"  v-model="form.type"  name="second">
          <!-- 待执行金额合计字段END -->
          <el-row style="text-align: right;padding: 13px 20px 13px 0;">
            <el-col :span="24">
              <span style="color: #417095;font-weight: 700;">待执行金额合计：</span>
              <span>{{sumExp}}</span>元
            </el-col>
          </el-row>
          <!-- 待执行金额合计字段END -->
          <el-table
            :data="pendingTableData"
            border
            style="width: 100%;">
            <el-table-column
              prop="appNum"
              label="单据编号"
              width="150"
              type='primary'
              align='center'
              >
            </el-table-column>
            <el-table-column
              prop="applicantUserName"
              label="申请人"
              width="100">
            </el-table-column>
            <el-table-column
              prop="appName"
              label="支出事由"
              width=""
              align='center'>
            </el-table-column>
            <el-table-column
              prop="costName"
              label="单据类型"
              width="120"
              align='center'>
            </el-table-column>
            <el-table-column
              prop="expenditureMoney"
              label="支出金额"
              width="100"
              align='right'>
              <template slot-scope='scope'>
                <span >{{scope.row.expenditureMoney | moneyFormat }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="paymentDate"
              label="申请日期"
              width="100"
              align='center'>
            </el-table-column>
            <el-table-column
              prop="workFlowState"
              label="当前状态"
              width="120"
              align='center'>
                <!-- <template slot-scope="scope">
                   <span style="color:#417095;cursor: pointer;" @click="journalTwo(scope.row.nodeNowState)">{{scope.row.nodeNowState}}</span>
                </template> -->
            </el-table-column>
            <el-table-column
              prop="operat"
              label="操作"
              width="100"
              align='center'>
              <template slot-scope='scope'>
                <!-- <el-link type="primary" v-show="sc.row.taskKey!='activitiStartTask'" @click='toPage2("/approval/details",sc.row)' >查看</el-link> -->
                <el-link type="primary"  @click='toPage3("/expensesReim/expenseAppDetail",scope.row)' >查看</el-link>
                <!-- <lookApproveLog :processInstanceId="scope.row.processInstanceId">日志</lookApproveLog> -->
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页START -->
          <el-pagination
            background
            :current-page="currentPage"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[15, 30, 50, 100, 200, 500]"
            :page-size="15"
            layout="total, prev, pager, next"
            :total="total"
            >
          </el-pagination>
        <!-- 分页END -->
        </el-tab-pane>
        <!-- 待执行明细END -->
        <!-- 借款明细STARAT -->
        <el-tab-pane label="借款明细"   name="third"  v-model="form.type">
          <!-- 借款金额合计字段START -->
          <el-row style="text-align: right;padding: 13px 20px 13px 0;">
            <el-col :span="24">
              <span style="color: #417095;font-weight: 700;">借款金额合计：</span>
              <span>{{loanAmount}}</span>元
              <span style="color: #417095;font-weight: 700;padding-left: 65px;">欠款金额合计：</span>
              <span>{{arrearsAmount}}</span>元
            </el-col>
          </el-row>
          <!-- 借款金额合计字段END -->
          <el-table
            :data="loanTableData"
            border
            style="width: 100%;">
            <el-table-column
              prop="loanAppNum"
              label="借款单编号"
              width="150"
              type='primary'
              align='center'
              >
            </el-table-column>
            <el-table-column
              prop="applicantUserName"
              label="申请人"
              width="100">
            </el-table-column>
            <el-table-column
              prop="loanAppName"
              label="借款事由"
              width=""
              align='center'>
            </el-table-column>
            <el-table-column
              prop="loanAmount"
              label="借款金额"
              width="100"
              align='right'>
              <template slot-scope='scope'>
                <span >{{scope.row.loanAmount | moneyFormat }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="arrearsAmount"
              label="欠款金额"
              width="100"
              align='right'>
              <template slot-scope='scope'>
                <span >{{scope.row.arrearsAmount | moneyFormat }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="applicantTime"
              label="借款日期"
              width="100"
              align='center'>
            </el-table-column>
            <el-table-column
              prop="record"
              label="还款记录"
              width="100"
              align='center'>
              <template scope="scope">
                <span  style="color:#417095;cursor: pointer;"  @click="journal(scope.row)" >详细记录</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="operation"
              label="操作"
              width="100"
              align='center'>
              <template slot-scope='scope'>
                <span  style="color:#417095;cursor: pointer;" @click='toPage4("/expensesReim/loanApplyDetail",scope.row)' >查看</span>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页START -->
          <el-pagination
          :current-page="currentPage2"
            background
            @size-change="handleSizeChange1"
            @current-change="handleCurrentChange1"
            :page-sizes="[15, 30, 50, 100, 200, 500]"
            :page-size="15"
            layout="total, prev, pager, next"
            :total="total2"
            >
          </el-pagination>
        <!-- 分页END -->
        </el-tab-pane>
        <!-- 已完结END -->
      </el-tabs>
    </div>
    <!-- 页面表格END -->
    <!-- 日志弹出框信息start -->
    <el-dialog title="借款还款记录" style="width:1350px;" :visible.sync="dialogLogsVisible">
      <el-form :model="journalForm">
        <el-row>
          <el-col :span="6">
            <el-form-item label="借款金额：">
                <span>{{journalForm.loanAmount| moneyFormat }}</span>
            </el-form-item>
          </el-col>
           <el-col :span="6">
            <el-form-item label="还款金额：">
                <span>{{journalForm.refundTotalAmount| moneyFormat }}</span>
            </el-form-item>
          </el-col>
           <el-col :span="6">
            <el-form-item label="欠款金额：">
                <span>{{journalForm.arrearsAmount| moneyFormat }}</span>
            </el-form-item>
          </el-col>
           <el-col :span="6">
            <el-form-item label="处理中的还款金额：">
                <span>{{journalForm.inApprovalRefundAmount| moneyFormat }}</span>
            </el-form-item>
          </el-col>

        </el-row>
        <el-table :data="journalForm.refundData" border>
            <el-table-column property="refundNum" align="center" label="还款流水号"></el-table-column>
            <el-table-column property="refundAmount" align="right" label="还款金额(元）">
              <template slot-scope='scope'>
                <span>{{scope.row.refundAmount| moneyFormat }}</span>
            </template>
            </el-table-column>
            <el-table-column property="refundTime" align="center" label="还款日期"></el-table-column>
            <el-table-column property="refundWayName" align="center" label="还款方式"></el-table-column>
        </el-table>
        <!-- @size-change="handleSizeChange"
        @current-change="handleCurrentChange"-->
        <el-pagination
          background
          :current-page="currentPage1"
          :page-size="10"
          layout="total, prev, pager, next"
          :total="total1"
          @size-change="journalHandleSizeChange"
          @current-change="journalHandleCurrentChange"
        ></el-pagination>
      </el-form>
    </el-dialog>
    <!-- 日志弹出框信息end -->

    <div style="width: 120px;margin: 0 auto;">
      <el-button @click='closeClick'>关闭</el-button>
    </div>

  </div>
</template>


<script>
  import axios from '../../service/http';
  import {option} from '../../static/config.js'
  export default {
    // 数据源
    data() {
      return {
      form:{
        type:1,
        queryParams: '',
        pageIndex:1,
        pageNum:15,
        projectId: this.$route.query.projectId
      },
      journalForm:{
        loanAmount: '',
        refundTotalAmount: '',
        arrearsAmount: '',
        inApprovalRefundAmount: '',
        refundData: [],
        pageIndex: 1,
        pageNum: 10
      },
      dialogLogsVisible:false, //日志弹出框
      sumExp:'',
      arrearsAmount:'',
      loanAmount:'',
      activeTab: 'first',
      pendingTableData: [],
      loanTableData:[],
      total: 0,
      total1: 0,
      total2: 0,
      currentPage: 1,
      currentPage1:1,
      currentPage2:1,
      imgsrc: '',
    }
    },
    // 初始化执行
    mounted() {
      this.getMessage()
      this.getLoanMessage()
    },
    // 方法声明
    methods: {
      //点击关闭
    closeClick() {
      this.$router.replace('/projectManagerOperating/projectManagerPage');
    },
      // 查询点击事件
      clickQuery(){
        this.getMessage()
        this.getLoanMessage()
      },
      // 获取支出明细和待执行明细的列表数据
      getMessage(){
        axios.post(option.base_path+'sz/expenditureApp/getExpenditureAppInfoList',this.form).then(res => {
            this.pendingTableData = res.data.data.rows;
            this.total = res.data.data.total;
            this.sumExp = res.data.data.sumExp
        }).catch((error) => {
          console.log('异常',error)
        })
      },
      // 支出明细的tab点击查看跳转详情页面并传值
      toPage2(path, row){
        this.$router.replace({
        path: '/expensesReim/expenseAppDetail',
        query: {
          pkId: row.pkId,
          // workFlowState: 2,
          costType: row.costType,
          isShow:1,
          xx:1
        }
      });
      },
      toPage3(path, row){
        this.$router.replace({
          path: '/expensesReim/expenseAppDetail',
          query: {
            pkId: row.pkId,
            // workFlowState: 2,
            costType: row.costType,
            isShow:1,
            xx:1
          }
        });
      },
      // 借款的tab点击查看跳转详情页面并传值
      toPage4(path, row) {
      this.$router.replace({
        path: '/expensesReim/loanApplyDetail',
        query: {
          pkId: row.loanAppId,
          approvalState: 2,
          // costType: row.costType
          isShow:1,
          xx:1//确认是否是从该页面进入详情的
        }
      });
    },
      // 获取借款明细的数据
      getLoanMessage(){
        axios.post(option.base_path+'sz/expenditureApp/getLoanAppInfoList',this.form).then(res => {
            this.loanTableData = res.data.data.rows;
            this.total2 = res.data.data.total;
            this.loanAmount = res.data.data.loanAmount
            this.arrearsAmount = res.data.data.arrearsAmount
        }).catch((error) => {
          console.log('异常',error)
        })
      },
      //点击列表里的日志触发事件
    journal(row){
        this.dialogLogsVisible = true;
        this.journalInfo(row);
    },
    //日志数据加载
    journalInfo(row){
        var data = {
            loanAppId: row.loanAppId,
            pageIndex: this.journalForm.pageIndex,
            pageNum: this.journalForm.pageNum
        }
         axios
            .post(option.base_path + "sz/loanApp/getRefundDetailJournalByLoanAppId", data)
            .then(data => {
                if(data.data.flag == 0) {
                    this.total1 = data.data.data.total;
                    this.journalForm.loanAmount = data.data.data.loanAmount;
                    this.journalForm.refundTotalAmount = data.data.data.refundTotalAmount;
                    this.journalForm.arrearsAmount = data.data.data.arrearsAmount;
                    this.journalForm.inApprovalRefundAmount = data.data.data.inApprovalRefundAmount;
                    this.journalForm.refundData = data.data.data.refundList;
                }
                console.log("返回值", data.data.data.flag);
                })
            .catch(function(error) {
                console.log(error);
            });
    },
      // 点击tab显示不同的数据
      handleClick(id) {
        if(id.index == 0){
            // 触发‘配置管理’事件
          // this.form.queryParams="WF_SUSPENDING_QUERY_SQL_PARAMS"
          this.form.type = 1
          console.log("1")
          this.getMessage()
        }else if(id.index==1){
        	// 触发‘用户管理’事件
          // this.form.queryParams="WF_SOLVED_QUERY_SQL_PARAMS"
          this.form.type = 2
          console.log("2")
          this.getMessage()
        }else if(id.index==2){
          this.form.type = 3
          console.log("3")
          this.getLoanMessage()
            // this.form.queryParams="WF_COMPLETED_QUERY_SQL_PARAMS"
        }

      },
    // 分页的事件
    handleSizeChange(val) {
      this.form.pageNum = val;
      console.log(`每页 ${val} 条`);
      this.getMessage();
    },
    handleCurrentChange(val) {
      this.form.pageIndex = val;
      console.log(`当前页: ${val}`);
      this.getMessage();
    },
    handleSizeChange1(val) {
      this.form.pageNum = val;
      console.log(`每页 ${val} 条`);
      this.getLoanMessage()
    },
    handleCurrentChange1(val) {
      this.form.pageIndex = val;
      console.log(`当前页: ${val}`);
      this.getLoanMessage()
    },
    //探矿中的手动切换每页条数
    journalHandleSizeChange(val) {
      this.journalForm.pageNum = val;
      console.log(`每页 ${val} 条`);
      //刷新
      this.journalInfo(this.currentRow);
    },
    //弹框中的手动切换页数
    journalHandleCurrentChange(val) {
      this.journalForm.pageIndex = val;
      console.log(`当前页: ${val}`);
      //刷新
      this.journalInfo(this.currentRow);
    },
    // 重置
    resetForm(form) {
      // this.data.activeTab = 'dai'
      this.activeTab='first',
      this.form = {
        type: 1,
        queryParams: '',
        pageIndex:1,
        pageNum:15,
      }

      this.getMessage();
      this.getLoanMessage()
    },
    },
    //金额格式化
    filters:{
    moneyFormat (num) {
      if (num) {
        num = Number(num)
        num = (num.toFixed(2) + '').replace(
          /\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,
          '$&,'
        )
      }
      return num || '0.00'
    }
  },
    // 组件注册
    components: {
    }
  }
</script>
<style scoped>
  .yt-dome-container {
    padding-bottom: 20px;
    padding-top: 20px;
    /* padding-left: 10px; */
  }
  .el-tabs__nav-scroll{
    border: 1px solid #DCDFE6;
    border-bottom: 0;
  }
  .el-tabs--border-card{
    border: 0;
    box-shadow: none;
  }
</style>

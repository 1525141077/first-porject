<template>
  <div class="yt-dome-container">
    <!-- :style="publicHeight" -->
    <el-container>
      <!-- 页面头部 -->
      <el-header class="yt-header">
        <el-form label-width="120px" size="small">
          <el-row>
            <el-col :span="10">
              <el-form-item label="关  键  字：">
                <el-input class placeholder="请输入借款事由" v-model="form.queryParams" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3" style="text-align: right;">
              <el-button type="primary" @click="getProjectList()">查询</el-button>
              <el-button type="info" @click="resetForm(form) ">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <!-- 分割新部分 -->
      <div
        style="height: 5px;background-color: #f3f3f3;border-top: 1px solid #dfe6f3;border-bottom: 1px solid #dfe6f3;"
      ></div>
      <!-- 页面主体 -->
      <div style="text-align:right;padding:20px 10px 20px 0px" v-show="show">
        <el-button type="primary" size="mini" @click="repaymentEven">打印借款单</el-button>
      </div>
      <el-tabs type="border-card" @tab-click="handleClick" v-model="rest">
        <!-- 待处理部分 -->
        <el-tab-pane label="待处理" v-model="form.queryStateParams" name="first">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column label="单据编号" prop="loanAppNum" align="center" style="color:rgb(105,182,255)">
                <template slot-scope="scope">
                 <span style="color:#417095;cursor: pointer;"  @click="toPage2('./loanApplyDetail',scope.row)">{{scope.row.loanAppNum}}</span>
              </template>
            </el-table-column>
            <el-table-column label="借款事由" prop="loanAppName" ></el-table-column>
            <el-table-column prop="applicantUserName" label="申请人"  align="center"></el-table-column>
            <el-table-column label="申请部门" prop="applicantUserDeptName"  align="center"></el-table-column>
            <el-table-column label="借款金额（元）" prop="arrearsAmount"  align="right">
                <template scope="scope">
            <span >{{scope.row.arrearsAmount | moneyFormat}}</span>
          </template>
        </el-table-column>
            </el-table-column>
            <el-table-column label="借款期限" prop="loanTerm"  align="center"></el-table-column>
            <el-table-column label="停滞时间" prop="stagnationTime"  align="center"></el-table-column>
            <el-table-column label="操作" prop="operation"  align="center">
              <template slot-scope="scope">
                   <el-link type="primary" v-show="scope.row.taskKey!='activitiStartTask'" @click='toPage1("./loanApplyDetail",scope.row)' >审批</el-link>
                <el-link type="primary" v-show="scope.row.taskKey=='activitiStartTask'" @click='toPage1("./loanApproval",scope.row)' >处理</el-link>
                <!-- <el-button type="text" size="small" style="padding:0px"  @click="toPage1('/approval/details',scope.row)">审批</el-button> -->
                <el-button type="text" size="small" style="padding:0px">|</el-button>
                  <lookApproveLog :processInstanceId="scope.row.processInstanceId"> <span slot="reference"  style="color:rgb(65,112,149);margin-left:5px;">日志</span></lookApproveLog>
              </template>
            </el-table-column>
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
        </el-tab-pane>
        <!-- 已处理部分 -->
        <el-tab-pane label="已处理" @tab-click="eee()" v-model="form.queryStateParams" name="second">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column label="单据编号" prop="loanAppNum"  align="center">
                <template slot-scope="scope">
                 <span style="color:#417095;cursor: pointer;"  @click="toPage2('./loanApplyDetail',scope.row)">{{scope.row.loanAppNum}}</span>
              </template>
            </el-table-column>
            <el-table-column label="借款事由" prop="loanAppName"></el-table-column>
            <el-table-column label="申请人" prop="applicantUserName"  align="center"></el-table-column>
            <el-table-column label="所属部门" prop="applicantUserDeptName"  align="center"></el-table-column>
            <el-table-column label="借款金额（元）" prop="loanAmount"  align="right">
              <template scope="scope">
            <span >{{scope.row.loanAmount | moneyFormat}}</span>
          </template>
            </el-table-column>
            <el-table-column label="借款期限" prop="loanTerm"  align="center"></el-table-column>
            <el-table-column label="申请日期" prop="handleTime"  align="center"></el-table-column>
            <el-table-column label="当前状态" prop="nodeNowState">
                <!-- <template slot-scope="scope">
                <span>{{scope.row.arrearsAmount}}</span>
                <i class="el-icon-notebook-1" @click="journal(scope.row)"></i>
              </template> -->
                <template slot-scope="scope">
                 <span style="color:#417095;cursor: pointer;" @click="journalTwo(scope.row,scope.$index)">{{scope.row.nodeNowState}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作"  align="center">
              <template slot-scope="scope">
                <lookApproveLog :processInstanceId="scope.row.processInstanceId"> <span slot="reference"  style="color:rgb(105,170,255);margin-left:5px;">日志</span></lookApproveLog>
              </template>
            </el-table-column>
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
        </el-tab-pane>
        <!-- 已完结部分 -->
        <el-tab-pane
          label="已完结"
          v-model="form.queryStateParams"
          name="three"
         
          :data="tableData"
          ref="singleTable"
        >
          <el-table :data="tableData" 
           highlight-current-row
          @current-change="tableDataChange"  
          border style="width: 100%">
            <el-table-column label="单据编号" prop="loanAppNum"  align="center">
                <template slot-scope="scope">
                 <span style="color:#417095;cursor: pointer;" @click="toPage2('./loanApplyDetail',scope.row)">{{scope.row.loanAppNum}}</span>
              </template>
            </el-table-column>
            <el-table-column label="借款事由" prop="loanAppName"></el-table-column>
            <el-table-column label="申请人" prop="applicantUserName"  align="center"></el-table-column>
            <el-table-column label="所属部门" prop="applicantUserDeptName"  align="center"></el-table-column>
            <el-table-column label="借款金额（元）" prop="loanAmount"  align="right">
              <template scope="scope">
            <span >{{scope.row.loanAmount | moneyFormat}}</span>
          </template>
            </el-table-column>
            <el-table-column label="借款期限" prop="loanTerm" align="center"></el-table-column>
            <el-table-column label="申请日期" prop="handleTime"  align="center"></el-table-column>
            <el-table-column label="欠款金额（元）" prop="arrearsAmount"  align="right">
              <template slot-scope="scope">
                <span>{{scope.row.arrearsAmount | moneyFormat}}</span>
                <i class="el-icon-notebook-1" @click="journal(scope.row)"></i>
              </template>
            </el-table-column>
            <el-table-column label="操作"  align="center">
              <template slot-scope="scope">
                <lookApproveLog :processInstanceId="scope.row.processInstanceId"> <span slot="reference"  style="color:rgb(105,170,255);margin-left:5px;">日志</span></lookApproveLog>
              </template>
            </el-table-column>
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
        </el-tab-pane>
      </el-tabs>

      <!-- @size-change="handleSizeChange"
      @current-change="handleCurrentChange"-->
      <!-- <el-pagination
        background
        :current-page="currentPage"
        :page-sizes="[15, 30, 50, 100, 200, 500]"
        :page-size="15"
        layout="total, prev, pager, next, sizes"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>-->
    </el-container>
    <!-- 已处理部分弹出框 -->
    <el-dialog title="当前状态"  :visible.sync="dialogLogsVisibleTwo">
        <img src="http://123.56.81.55:9200/ims-act/restful/workFlow/findPngByProcessInstanceId?processInstanceId=160789" alt="">
        <span>{{processInstanceId}}</span>
        <div style="text-align:center;padding-top:20px">
      <el-button type="info" :visible.sync="dialogLogsVisibleTwo" @click="closeDialogTwo">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 日志弹出框信息start -->
    <el-dialog title="借款还款记录" style="width:1250px;" :visible.sync="dialogLogsVisible">
      <el-form>
        <el-row>
          <el-col :span="6">
            <el-form-item label="借款金额：">
              <span>{{journalForm.loanAmount}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="还款金额：">
              <span>{{journalForm.refundTotalAmount}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="欠款金额：">
              <span>{{journalForm.arrearsAmount}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="处理中的还款金额：">
              <span>{{journalForm.inApprovalRefundAmount}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-table :data="journalForm.refundData" border>
          <el-table-column property="refundNum" align="center" label="单据编号/流水号"></el-table-column>
          <el-table-column property="refundAmount" align="right" label="还款金额"></el-table-column>
          <el-table-column property="refundTime" align="center" label="还款日期"></el-table-column>
          <el-table-column property="refundWayName" align="center" label="还款方式"></el-table-column>
        </el-table>
        <div style="text-align:center;padding-top:20px">
          <el-button type="info" :visible.sync="dialogLogsVisible" @click="closeDialog">关闭</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!-- 日志弹出框信息end -->
  </div>
</template>

<script>
  import lookApproveLog from '@/components/lookApproveLog'
import topTip from "../../components/topTip.vue";
import secondLevel from "../../components/secondLevel.vue";
import axios from "../../service/http";
import { option } from "../../static/config";
import approvalSelect from "../../components/ApprovalSelect/ApprovalSelect";
import approvalDetail from "../../components/ApprovalDetail/ApprovalDetail";
import showTravelPay from "../../components/showTravelPay.vue";
import finmoneyinput from "../../components/fin-money-input.vue";
export default {
  // 数据源
  data() {
    return {
      form: {
        queryStateParams: "WF_SUSPENDING_QUERY_SQL_PARAMS",
        // queryStateParams:"WF_SOLVED_QUERY_SQL_PARAMS",
        // queryStateParams:"WF_COMPLETED_QUERY_SQL_PARAMS",
        queryParams: "",
        pageIndex: 1,
        pageNum: 15,
        yitianSSODynamicKey: "",
        dynamicKey: "",
        processInstanceId:''
      },
      journalForm: {
        loanAmount: "",
        refundTotalAmount: "",
        arrearsAmount: "",
        inApprovalRefundAmount: "",
        refundData: [],
        
      },
      workFlowData: {
        //工作流参数
        processInstanceId: "",
        parameters: "",
        businessCode: "SZ_EXPENDITURE_APP"
        // projectNumber: ""
      },
      total: 0,
      approvalFlag: false,
      currentPage: 1,
      currentRow: null,//选中一条数据
      show: false,
      rest: "first",
      dialogLogsVisible: false, //日志弹出框
      dialogLogsVisibleTwo: false, //已处理弹出框
      tableData: [],
      processInstanceId:''
    };
  },
  // 初始化执行
  mounted() {
    this.getProjectList();
  },
  // 方法声明
  methods: {
    //手动切换每页条数
    handleSizeChange(val) {
      this.form.pageNum = val;
      console.log(`每页 ${val} 条`);
      this.getProjectList();
    },
    //手动切换页数
    handleCurrentChange(val) {
      this.form.pageIndex = val;
      console.log(`当前页: ${val}`);
      this.getProjectList();
    },
    // 切换tab页
    handleClick(id) {
      if (id.index == 0) {
        // 触发‘配置管理’事件

        this.form.queryStateParams = "WF_SUSPENDING_QUERY_SQL_PARAMS";
        this.show = false;
      } else if (id.index == 1) {
        // 触发‘用户管理’事件
        this.form.queryStateParams = "WF_SOLVED_QUERY_SQL_PARAMS";
        this.form.queryParams=""
        this.show = false;
      } else if (id.index == 2) {
        (this.form.queryStateParams = "WF_COMPLETED_QUERY_SQL_PARAMS"),
          (this.show = true);
      }
      this.getProjectList();
      console.log(this.form.queryStateParams);
    },
    //表格列选中列的数据赋值
    tableDataChange(val) {
        this.currentRow = val;
    },
    //选中数据跳转到借款单
    repaymentEven() {
        
        if(this.currentRow != null){
            this.toPage('./loanBill',this.currentRow)
            // let pkId = this.currentRow.loanAppId;
            // this.$refs.singleTable.setCurrentRow(row);
            // this.getRefundInfoByLoanAppId(pkId,this.ruleForm);
            // this.dialogFormVisible = true;
        }else{
            this.$message('请选中一行数据进行操作');
        }
    },
    toPage(path, row) {
      this.$router.replace({
        path: path,
        query: {
          loanAppId: row.loanAppId,
        //   costType: row.costType
        }
      });
    },
     //跳转到审批页
    toPage1(path, row) {
      this.$router.replace({
        path: path,
        query: {
          pkId: row.loanAppId,
          approvalState:1
        //   costType: row.costType
        }
      });
    },
    //跳转到详情页
    toPage2(path, row) {
      this.$router.replace({
        path: path,
        query: {
          pkId: row.loanAppId,
          approvalState:2
        //   costType: row.costType
        }
      });
    },
    //点击触发弹出框事件
    journal(row) {
      this.dialogLogsVisible = true;
      this.journalInfo(row);
    },
     //点击触发已处理部分弹出框事件
    journalTwo(row,index) {
      this.dialogLogsVisibleTwo = true;
       let tableData = JSON.parse(JSON.stringify(this.tableData));
      //  console.log("水电费上档次",tableData[index]);
       this.processInstanceId=tableData[index].processInstanceId
       
    },
    //关闭弹框的事件
    closeDialog() {
      this.dialogLogsVisible = false;
    },
    //关闭弹框的事件
    closeDialogTwo(row) {
      this.dialogLogsVisibleTwo = false;
    },
    //弹出框数据加载
    journalInfo(row) {
      var data = {
        loanAppId: row.loanAppId
      };
      axios
        .post(
          option.base_path + "sz/loanApp/getRefundDetailJournalByLoanAppId",
          data
        )
        .then(data => {
          if (data.data.flag == 0) {
            console.log('色的成熟度',data.data);
            
            this.journalForm.loanAmount = data.data.data.loanAmount;
            this.journalForm.refundTotalAmount =
              data.data.data.refundTotalAmount;
            this.journalForm.arrearsAmount = data.data.data.arrearsAmount;
            this.journalForm.inApprovalRefundAmount =
              data.data.data.inApprovalRefundAmount;
            this.journalForm.refundData = data.data.data.refundList;
          }
          console.log("返回值", data.data.data.flag);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // 重置
    resetForm(form) {
      this.rest = "first";
      this.form = {
        queryStateParams: "WF_SUSPENDING_QUERY_SQL_PARAMS",
        queryParams: "",
        pageIndex: 1,
        pageNum: 15,
        yitianSSODynamicKey: "",
        dynamicKey: ""
      };
      this.getProjectList();
    },
    
    getProjectList() {
      var me = this;
      //调用axios.post方法
      //"CASPARAMS":"OFF_INDEX"
      axios
        .post(
          option.base_path +
            "sz/loanApp/getUserLoanAppInfoWFListToPageByParams",
          this.form
        )
        .then(res => {
          this.nodeNowState=res.data.data.rows
          this.tableData = res.data.data.rows;
          console.log("返回值", res);
          console.log("表头", this.form.queryStateParams);
          this.total = res.data.data.total;
          this.workFlowData.processInstanceId = this.form.processInstanceId;
        })
        .catch(err => err);
      // .catch(function(error) {
      //   console.log(error);
      // });
    },
    showTip (row) {
        console.log(row)
        this.workFlowData.processInstanceId = row.processInstanceId
        this.approvalFlag = true
    },
    hideTip () {
        this.approvalFlag = false
    }
  },
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
      approvalDetail,
      lookApproveLog,
      finmoneyinput
  }
};
</script>
<style lang="stylus" scoped></style>
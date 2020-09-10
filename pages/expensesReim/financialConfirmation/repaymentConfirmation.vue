<template>
  <div class="yt-dome-container">
    <!-- :style="publicHeight" -->
    <el-container>
      <!-- 页面头部 -->
      <el-header class="yt-header">
        <el-form
          ref="form"
          :model="form"
          label-width="120px"
          :label-position="labelposition"
          size="small"
        >
          <el-row>
            <el-col :span="10">
              <el-form-item label="关  键  字：">
                <el-input
                  v-model="form.queryParams"
                  class
                  placeholder="请输入单据类型/借款事由"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="日期：">
                    <el-date-picker
                    v-model="form.date "
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="——"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                    </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="3" style="text-align: right;">
              <el-button type="primary" @click="getProjectList()">查询</el-button>
              <el-button type="info" @click="resetForm('form')">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <div
        style="height: 5px;background-color: #f3f3f3;border-top: 1px solid #dfe6f3;border-bottom: 1px solid #dfe6f3;"
      ></div>
      <!-- 页面主体 -->
       <el-row style="margin:15px 10px;">
        <el-col :span="4">
            <el-button type="primary" @click="repaymentEven">新增还款</el-button>
            <el-dialog title="添加还款信息" :visible.sync="dialogFormVisible">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="还款流水号：">
                        <span class="yt-link">提交后自动生成</span>
                    </el-form-item>
                    <el-row>
                    <el-col :span="15">
                        <el-form-item label="还款金额：" prop="refundAmount" >
                           <finMoneyInput style="width:222px;" v-model="ruleForm.refundAmount" :tail="'元'"></finMoneyInput>
                            <!-- <el-input maxlength="8" oninput="value=value.replace(/[^\d.]/g,'')" style="width:220px;text-aligh:right" placeholder="请输入金额" v-model="ruleForm.refundAmount" ></el-input>
                            <span>元</span> -->
                        </el-form-item>
                    </el-col>
                    <el-col :span="9">
                        <el-form-item label="欠款金额：" prop="arrearsAmount">
                            <!-- <finmoneyinput v-model="ruleForm.arrearsAmount" :tail="元"></finmoneyinput> -->
                            <span>{{ruleForm.arrearsAmount| moneyFormat}}元</span>
                        </el-form-item>
                    </el-col>
                    </el-row>
                    <el-form-item label="还款日期：" required>
                        <el-form-item prop="refundTime">
                            <el-date-picker value-format="yyyy-MM-dd" type="date" placeholder="选择日期" v-model="ruleForm.refundTime"></el-date-picker>
                        </el-form-item>
                    </el-form-item>
                    <el-form-item label="还款方式：" prop="refundWay">
                        <el-radio-group v-model="ruleForm.refundWay">
                            <el-radio class="cash" :label="1">现金</el-radio>
                            <el-radio class="transfer" :label="3">银行转账</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item style="text-align: center;">
                        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
                        <el-button @click="cancelBtn('ruleForm')">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </el-col>
      </el-row>
      <el-table 
        ref="singleTable"
        :data="tableData" 
        highlight-current-row
        @current-change="tableDataChange" 
        border style="width: 100%">
        <el-table-column npm
          prop="" 
          label="单据编号" 
          align="center"
          width="150">
             <template slot-scope="scope">
                 <span style="color:#417095;cursor: pointer;" @click="toPage('/expensesReim/loanApplyDetail',scope.row)">{{scope.row.loanAppNum}}</span>
              </template>
          </el-table-column>
        <el-table-column prop="loanAppName" label="借款事由" align="center" ></el-table-column>
        <el-table-column prop="applicantUserName" label="申请人" align="center" width="120"></el-table-column>
        <el-table-column prop="applicantUserDeptName" label="申请部门" align="center" width="120"></el-table-column>
        <el-table-column 
          prop="loanAmount" 
          label="借款金额（元）" 
          align="right"
          width="150">
            <template slot-scope='scope'>
                <span>{{scope.row.loanAmount| moneyFormat }}</span>
            </template>
          </el-table-column>
        <el-table-column 
          prop="applicantTime" 
          label="申请日期" 
          align="center"
          width="120">
        </el-table-column>
        <el-table-column prop="arrearsAmount" label="欠款金额（元）" align="right" width="150">
           <template slot-scope='scope'>
                <span>{{scope.row.arrearsAmount| moneyFormat }}</span>
            </template>
        </el-table-column>
        <el-table-column 
          prop="" 
          label="还款记录" 
          align="center"
          width="120">
            <template scope="scope">
                <el-link type="primary" @click="journal(scope.row)">日志</el-link>
            </template>
          </el-table-column>
      </el-table>
      <!-- @size-change="handleSizeChange"
      @current-change="handleCurrentChange"-->
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
    </el-container>
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
  </div>
</template>
<script>
import axios from '../../../service/http';
import { option } from '../../../static/config';
import finMoneyInput from "../../../components/fin-money-input.vue";
export default {
  // 数据源
  data() {
    return {
      loanAppId:0, //新增还款保存id
      currentRow: null,
      dialogFormVisible: false, //新增借款弹出框
      dialogLogsVisible:false, //日志弹出框
      ruleForm: {
        refundAmount: 0,
        arrearsAmount: '',
        refundTime:'',
        refundWay: 3
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
      rules: {
            refundAmount: [
            { required: true, message: '请填写还款金额', trigger: 'blur' }
            ],
            refundTime: [
            { type: 'string', required: true, message: '请选择日期', trigger: 'change' }
            ],
            refundWay: [
            { required: true, message: '请选择还款方式', trigger: 'change' }
            ]
        },
      //disabled: false,
      that: this,
      form: {
        queryParams: "",
        date: "",
        pageIndex: 1,
        pageNum: 15
      },
      total: 0,
      currentPage: 1,
      total1:0,
      currentPage1: 1,
      labelposition: "right",
      tableData: []
    };
  },
  watch: {
    disabled: {
      handler (newVal, oldVal) {
        
        this.disabled = newVal
      }
    }
  },
  // 初始化执行
  mounted() {
    this.getProjectList();
  },
  // 方法声明
  methods: {
    //表格列选中列的数据赋值
    tableDataChange(val) {
        this.currentRow = val;
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
    //添加还款信息的提交按钮事件
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
            if (valid) {
                var refundTotalAmount = this.ruleForm.refundAmount;
                var arrearsAmount = this.ruleForm.arrearsAmount;
                if(refundTotalAmount>arrearsAmount){//判断段金额不能大于欠款金额
                    this.$message('还款金额不能大于借款单可用余额');
                }else{
                    var pkId = this.loanAppId;
                    this.saveRefund(pkId);//调用新增还款方法
                    this.getRefundInfoByLoanAppId(pkId,formName);
                    this.getProjectList(); //刷新列表数据
                }
            } else {
                return false;
            }
        });
    },
    //添加还款信息方法
    saveRefund(pkId){
        var data = {
            loanAppId: pkId,//借款Id
            refundTime: this.ruleForm.refundTime,//还款日期
            refundAmount: this.ruleForm.refundAmount,//还款金额
            refundWay: this.ruleForm.refundWay//还款方式
        }
         axios
            .post(option.base_path + "sz/loanApp/saveRefund", data)
            .then(data => {
                if(data.data.flag == 0) {
                    this.$message('保存成功');
				} else {
                    this.$message('保存失败');
				}
                console.log("返回值", data.data.flag);
                })
            .catch(function(error) {
                console.log(error);
            });
    },
    //计算欠款金额
    getRefundInfoByLoanAppId(pkId){
        var data = {
            loanAppId: pkId
        }
         axios
            .post(option.base_path + "sz/loanApp/getRefundInfoByLoanAppId", data)
            .then(data => {
                if(data.data.flag == 0) {
                    //欠款金额赋值
                    this.ruleForm.arrearsAmount = data.data.data.arrearsAmount;
                } 
                console.log("返回值", data.data.flag);
                })
            .catch(function(error) {
                console.log(error);
            });
    },
    cancelBtn(formName) {
        this.$refs[formName].resetFields();
        this.formName = {
            refundAmount: 0,
            arrearsAmount: '',
            refundTime:'',
            refundWay: 3
        };
        this.loanAppId = 0;
        this.dialogFormVisible = false;
    },
    repaymentEven() {
        if(this.currentRow != null){
            let pkId = this.currentRow.loanAppId;
            this.loanAppId = pkId;
            this.getRefundInfoByLoanAppId(pkId,this.ruleForm);
            this.dialogFormVisible = true;
        }else{
            this.$message('请选中一行数据进行操作');
        }
    },
    toPage(path, row) {
      this.$router.replace({
        path: path,
        query: {
          loanId: row.loanAppId
        }
      });
    },
    resetForm(form) {
      this.form = {
        queryParams: "",
        date: "",
        pageIndex: 1,
        pageNum: 15
      };
      this.getProjectList();
    },
    //调用列表方法
    getProjectList() {
      var me = this;
      //调用axios.post方法
      //"CASPARAMS":"OFF_INDEX"
      var data = {
        queryParams: this.form.queryParams,
        startTime:(this.form.date!=''?this.form.date[0]:''),
        endTime:(this.form.date!=''?this.form.date[1]:''),
        pageNum: this.form.pageNum,
        pageIndex: this.form.pageIndex
      }
      axios
        .post(option.base_path + "sz/loanApp/getLoanAppBaseInfoListToPageByParams", data)
        .then(data => {
          // this.peopleList.push(man)
          this.tableData = data.data.data.rows;
          this.total = data.data.data.total;
          console.log("返回值", data.data.data.rows);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //手动切换每页条数
    handleSizeChange(val) {
      this.form.pageNum = val;
      console.log(`每页 ${val} 条`);
      //刷新
      this.getProjectList();
    },
    //手动切换页数
    handleCurrentChange(val) {
      this.form.pageIndex = val;
      console.log(`当前页: ${val}`);
      //刷新
      this.getProjectList();
    },
    //手动切换每页条数
    journalHandleSizeChange(val) {
      this.journalForm.pageNum = val;
      console.log(`每页 ${val} 条`);
      //刷新
      this.journalInfo(this.currentRow);
    },
    //手动切换页数
    journalHandleCurrentChange(val) {
      this.journalForm.pageIndex = val;
      console.log(`当前页: ${val}`);
      //刷新
      this.journalInfo(this.currentRow);
    }
  },
  // 组件注册
  components: {
    finMoneyInput,
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
  }
};
</script>

<style>
.name-farst {
    text-overflow: ellipsis;
    width: 34px;
    display: inline-block;
    overflow: hidden;
}
.center-line {
  color: #417095;
}
</style>
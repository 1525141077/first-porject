<template>
  <div class="yt-dome-container">
    <!-- 顶部信息START -->
    <topTip>
      <template>
        <el-row>
          <el-col :span="15" class="top-tip" style="text-align: left;">
            <div>
              <span style="color: #417095;font-size: 16px;font-weight: bolder;">基本信息</span>
            </div>
          </el-col>
        </el-row>
      </template>
    </topTip>
    <!-- 顶部信息END -->
    <!-- 表单 -->
    <el-form :model="ruleForm" ref="ruleForm" label-width="160px">
      <el-row>
        <el-col :span="10">
          <el-form-item
            label="项目名称/编号："
            prop="projectId"
            :rules="[
            { required: true, message: '项目名称/编号', trigger: 'blur' }]"
          >
            <span>{{ruleForm.projectId}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="项目总金额：" prop="name">
            <span>{{ruleForm.budgetMoney | moneyFormat}}</span>
            <a class="btn" @click="details"  v-show="!compact">展开合同明细</a>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 遍历展开合同明细 -->
      <div v-show="compact" style="background-color: rgb(245, 249, 252);padding-top: 20px;padding-bottom: 20px;margin-bottom: 20px;">
        <div v-for="item in ruleForm.contractList" :key="item" style="margin-bottom: 20px;margin-left: 55px;">
          <el-row>
            <el-col :span="14">
              <span class="yt-read-text" style="margin-left:20px">合同名称/编号：</span>
              <span>{{item.contractNum + "/" + item.contractName}}元</span>
            </el-col>
            <el-col :span="10">
              <span class="yt-read-text" style="margin-left:20px">合同项目分配金额：</span>
              <span>{{item.projectAmount==""?"0.00":item.projectAmount | moneyFormat}}元</span>
            </el-col>
          </el-row>
        </div>
        <a class="fewer" @click="details">收起</a>
      </div>
      <el-row>
        <el-col :span="7">
          <el-form-item label="已确认收入金额：" prop="name">
            <span>{{ruleForm.revenueRecognizedAmount | moneyFormat}}</span>元
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item
            label="发放比例（百分比）："
            :rules="[
              { required: true, message: '发放比例（百分比）', trigger: 'blur' }]"
          >
            <template>
              <el-input v-model="propor" style="width:60%"><template style="color: red;" slot="append">%</template></el-input>
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="发放总额度：" prop="amountIs">
            <finMoneyInput  v-model="ruleForm.revenueRecognizedAmount * propor *0.01" :tail="'元'"></finMoneyInput>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div
      style="height: 5px;background-color: #f3f3f3;border-top: 1px solid #dfe6f3;border-bottom: 1px solid #dfe6f3;margin-top: 20px;"
    ></div>
    <!-- 发放情况 -->
    <topTip>
      <template>
        <el-col :span="8" style="text-align: left;" class="top-tip">
          <span style="color: #417095;font-size: 16px;font-weight: bolder;">实际发放情况</span>
        </el-col>
      </template>
    </topTip>
    <div>
      <el-row style="margin-bottom: 10px;">
        <el-col :span='11'>
          <span class="yt-read-text" style="margin-left:20px">当前可发放金额：</span>
          <span>{{ruleForm.revenueRecognizedAmount * propor *0.01 - ruleForm.paidAmount | moneyFormat}}元</span>
        </el-col>
        <el-col :span='11'>
          <span class="yt-read-text">已发放金额：</span>
          <span>{{ruleForm.paidAmount==""?"0.00":ruleForm.paidAmount | moneyFormat}}</span>元
        </el-col>
      </el-row>
    </div>
    <secondLevel style="display: inline-block;">
      <template v-slot:textTitle>本次发放明细</template>
    </secondLevel>
    <span style="font-size: 10px; color: #999;">实际收到绩效工资的月份为“发放月份”的次月，例如发放月份为2020年7月，绩效金额在2020年8月发放的工资中体现</span>
    <!-- 表格START -->
    <el-table
    show-summary
    :summary-method="getSummaries"
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column
      prop="personnelName"
      label="项目参与人员"
      align='center'>
    </el-table-column>
    <el-table-column
      prop="cumulativeHours"
      label="累计填报工时（h）"
      align='center'>
    </el-table-column>
    <el-table-column
      prop="thisMonthHours"
      label="本月填报工时（h）"
      align='center'>
    </el-table-column>
    <el-table-column
      prop="grantMonth"
      label="发放月份"
      align='center'>
    </el-table-column>
    <el-table-column
      prop="grantAmount"
      label="已分配金额"
      align='right'>
      <template scope="scope">
        <span >{{scope.row.grantAmount | moneyFormat}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="thisMoney"
      label="本次分配金额"
      align='right'>
      <template scope="scope">
        <el-form>
          <finMoneyInput  v-model="scope.row.thisMoney" :tail="'元'"></finMoneyInput>
          <!-- <el-input></el-input> -->
        </el-form>
      </template>
    </el-table-column>
    <el-table-column
      prop="remask"
      label="说明"
      align='center'>
      <template scope="scope">
        <el-form>
          <el-input v-model="scope.row.remask"></el-input>
        </el-form>
      </template>
    </el-table-column>
  </el-table>
    <!-- 表格END -->
    <el-form>
      <approvalSelect  ref="approvalData" :params="workFlowData" ></approvalSelect>
    </el-form>
    <div style="text-align: center;padding-bottom:20px">
      <button type="button" @click='submitClick' class="el-button yt-bottom-btn el-button--primary">
        <span>提交</span>
      </button>
      <button type="button" class="el-button yt-bottom-btn el-button--default">
        <span>取消</span>
      </button>
    </div>
  </div>
</template>

<script>
//一级标题
import topTip from "@/components/topTip";
import showTravelPay from "../../components/showTravelPay.vue";
//二级标题
import secondLevel from "@/components/secondLevel";
import {finMoneyformat, dateFormat} from '../../assets/js/util/expensesUtils.js'
//金额输入框组件
import finMoneyInput from "../../components/fin-money-input";
//流程审批
import approvalSelect from "@/components/ApprovalSelect/ApprovalSelect";
import axios from "@/service/http";
import { option } from "@/static/config";
export default {
  // 数据源
  data() {
    return {
      ruleForm: {
        // contractId:'',
        projectId: this.$route.query.projectId,
        projectName:'',
        budgetMoney:'',
        contractList:[],
        thisGrantMonth:'',//本次发放月份
        // propor:10,//比例
        revenueRecognizedAmount:'',//已确认收入金额
        paidAmount:1230,//已发放金额
        // thisGrantList:[],
        thisMoney:0,

      },
      contractId:'',
      propor:10,//比例
      amountIs:0,
      tableData:[],
      workFlowData: {
        //工作流参数
        processInstanceId: "",
        parameters: "",
        businessCode: "PRACTICE_PERFORMANCE_FLOW",
        // projectNumber: ""
      },
      compact: false, //显示隐藏合同
      labelposition: "right",
    };
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
  // 初始化执行
  mounted() {
    this.getMessage()
  },
  // 方法声明
  methods: {

    //计算合计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "本次发放金额合计";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (index == 5) {
          if (!values.every((value) => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                // return prev + curr;
                return this.moneyFormat(this.rmoney(prev) + this.rmoney(curr));
              } else {
                return prev;
              }
            }, 0);
            // sums[index] += " 元";
          } else {
            sums[index] = "0.00";
          }
        }
      });

      return sums;
    },
    moneyFormat(num) {
      if (num) {
        num = Number(num);
        num = (num.toFixed(2) + "").replace(
          "$&,"
        );
      }
      return num || "0.00";
    },
    //金额格式化
    rmoney(s) {
      //转成string类型
      s = s + "";
      return parseFloat(s.replace(/[^\d\.-]/g, ""));
    },

    flowChange(value) {
      this.woks.work = value;
    },
    submitClick(){
      // let contractIds =
      axios.post(option.base_path+'wages/performance/savePracticePerformanceSubmit',{
        // practicePerformanceId:'',
        // practicePerformanceNum:'',
        projectId:this.$route.query.projectId,
        contractIds:this.contractId,
        revenueRecognizedAmount:this.ruleForm.revenueRecognizedAmount,
        grantRatio:this.propor,
        grantAmount:this.ruleForm.revenueRecognizedAmount * this.propor *0.01,
        paidAmount:this.ruleForm.paidAmount,
        currentAvailableAmount:this.ruleForm.revenueRecognizedAmount * this.propor *0.01 - this.ruleForm.paidAmount,
        thisGrantMonth:this.ruleForm.thisGrantMonth,
        thisGrantTotalAmount:0,
        thisGrantList:this.tableData
      }).then(res => {
        // this.data = res.data.data
        this.submitWorkFlow(res.data.data)
        this.$router.replace('/meritsPractice/practiceAppore')
        this.$message({
          message: '提交成功',
          type: 'success'
        });
        // console.log(this.ruleForm.contractList.contractName + this.ruleForm.contractList.projectAmount,'asdasd')
          // this.ruleForm = res.data.data
          // // this.total = res.data.data.total;
          // // this.GrantList = res.data.data.thisGrantList
          // this.tableData = res.data.data.thisGrantList
          // this.
        }).catch((error) => {
          console.log('异常',error)
        })

    },
     //  工作流
        submitWorkFlow(data) {
      axios
        .post(
          option.base_path +
            "wages/performance/savePracticePerformanceSubmitWorkflow",
          {
            practicePerformanceId: data, //appId  表单申请id
            parameters: '', //parameters  JSON格式字符串,
            dealingWithPeople: this.$refs.approvalData.approvalForm
              .nextOperCode, //dealingWithPeople  下一步操作人code
            opintion: this.$refs.approvalData.approvalForm.textarea, //opintion 审批意见
            processInstanceId: this.workFlowData.processInstanceId, //processInstanceId  流程实例ID,
            nextCode: this.$refs.approvalData.approvalForm.nextCode, //nextCode 操作流程代码
          }
        )
        .then((data) => {
          console.log(data);
          if (data.data.flag == 0) {
            // this.$router.push({ path: "/approval/myApplyList" });
          }
          //
          // console.log(data.data)
        });
    },
    // 获取页面数据
    getMessage(){
      axios.post(option.base_path+'wages/performance/getPerformance',this.ruleForm).then(res => {
          this.ruleForm = res.data.data
          // this.total = res.data.data.total;
          // this.contractId = res.data.data.contractList.contractId
           let contractIds = res.data.data.contractList;
          this.contractId= contractIds
            .map((item) => item.contractId)
            .join(",");
          // this.GrantList = res.data.data.thisGrantList
          this.tableData = res.data.data.thisGrantList
          // this.
        }).catch((error) => {
          console.log('异常',error)
        })

    },
    //展开隐藏合同
    details() {
      this.compact = !this.compact;
    },

  },
  // 组件注册
  components: {
    topTip,
    secondLevel,
    approvalSelect,
    finMoneyInput,
    showTravelPay
  },
};
</script>
<style scoped>
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
.yt-read-text {
  color: #003465;
  font-weight: bold;
}
.el-form-item {
  margin-bottom: 0px;
}
.btn {
  position: absolute;
  cursor: pointer;
  margin-left: 30px;
  color: #257db9;
}
/* .compact{
    display: flex;
    justify-content: center;
} */
.fewer {
  position: relative;
  margin-left: 900px;
  cursor: pointer;
  color: #257db9;
}
</style>

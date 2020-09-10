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
          <!-- <el-col :span="8" style="text-align: right;">
            <div>
              <label style="margin-right:20px">
                <span style="color:#003465;letter-spacing:4px">申请编号：</span>
                <span>提交后自动生成</span>
              </label>
            </div>
          </el-col> -->
        </el-row>
      </template>
    </topTip>
    <!-- 顶部信息END -->
    <!-- 表单 -->
    <el-form :model="ruleForm" ref="ruleForm" label-width="160px">
      <el-row>
        <el-col :span="10">
             <!-- <div v-if="this.$route.query.archivesState=='2'" style="margin-bottom: 20px;">
            <span class="yt-read-text" style="margin-left:20px">姓名：</span>
            <span>{{ this.ruleForm.name==""?"--":this.ruleForm.name}}</span>
          </div> -->
          <el-form-item
            label="项目名称/编号："
            prop="projectName"
            :rules="[
            { required: true, message: '项目名称/编号', trigger: 'blur' }]"
          >
            <span>{{ruleForm.projectName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="项目负责人：" prop="projectPersonName">
            <span>{{ruleForm.projectPersonName}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="项目总金额：" prop="budgetMoney">
            <span>{{ruleForm.budgetMoney | moneyFormat}}</span>
            <a class="btn" @click="details"  v-show="!compact">展开合同明细</a>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="项目类型：" prop="name">
            <span>{{ruleForm.projectTypeName}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-col :span="10">
          <el-form-item label="客户名称：" prop="name">
            <span>{{ruleForm.name}}</span>
          </el-form-item>
        </el-col>
      </el-row> -->
      <!-- 遍历展开合同明细 -->
      <div v-show="compact" style="background-color: rgb(245, 249, 252);padding: 20px;">
        <div v-for="item in ruleForm.contractList" :key="item" style="margin-bottom: 20px;margin-left: 10px;">
          <el-row>
            <el-col :span="8">
              <span class="yt-read-text" style="margin-left:40px">合同名称/编号：</span>
              <span>{{item.contractName + '/' + item.contractNum}}</span>
            </el-col>
            <el-col :span="8">
              <span class="yt-read-text" style="margin-left:20px">合同项目分配金额：</span>
              <span>{{item.projectAmount==""?"0.00":item.projectAmount | moneyFormat}}元</span>
            </el-col>
          </el-row>
        </div>
        <a class="fewer" @click="details">收起</a>
      </div>
    </el-form>
    <!-- 发放情况 -->
    <topTip>
      <template>
        <el-col :span="8" style="text-align: left;" class="top-tip">
          <span style="color: #417095;font-size: 16px;font-weight: bolder;">绩效分配明细</span>
        </el-col>
      </template>
    </topTip>
    <div>
      <el-row style="margin-bottom: 20px;">
        <el-col :span='7'>
          <span class="yt-read-text" style="margin-left:20px">已确认收入金额：</span>
          <span>{{ruleForm.revenueRecognizedAmount==""?"0.00":ruleForm.revenueRecognizedAmount | moneyFormat}}元</span>
        </el-col>
        <el-col :span='7'>
          <span class="yt-read-text" style="margin-left:20px">发放比例：</span>
          <span style="color: red;">{{ruleForm.grantRatio ==""?"10" : ruleForm.grantRatio}}%</span>
        </el-col>
        <el-col :span='7'>
          <span class="yt-read-text" style="margin-left:20px">发放总额度：</span>
          <span>{{ruleForm.grantAmount==""?"0.00":ruleForm.grantAmount | moneyFormat}}元</span>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 20px;">
        <el-col :span='7'>
          <span class="yt-read-text" style="margin-left:20px">已发放金额：</span>
          <span>{{ruleForm.paidAmount==""?"0.00": ruleForm.paidAmount | moneyFormat}}元</span>
        </el-col>
        <el-col :span='7'>
          <span class="yt-read-text" style="margin-left:20px">当前可发放金额：</span>
          <span>{{ruleForm.currentAvailableAmount==""?"0.00":ruleForm.currentAvailableAmount | moneyFormat}}元</span>
        </el-col>
        <el-col :span='7'>
          <span class="yt-read-text" style="margin-left:20px">本次申请金额：</span>
          <span>{{ruleForm.thisGrantTotalAmount==""?"0":ruleForm.thisGrantTotalAmount | moneyFormat}}元</span>
        </el-col>
      </el-row>
    </div>
    <!-- 表格信息 -->
    <el-table
    :data="ruleForm.tableData"
    border
    style="width: 100%">
    <el-table-column
      prop="grantMonth"
      label="发放月份"
      align='center'>
    </el-table-column>
    <el-table-column
      prop="grantTotalAmount"
      label="发放金额（元）"
      align='right'>
      <template scope="scope">
        <span >{{scope.row.grantTotalAmount | moneyFormat}}</span>
      </template>
    </el-table-column>
    <el-table-column
      v-if="this.$route.query.approvalState=='1'"
      prop="grantRemarks"
      label="说明"
      align='center'>
      <template scope="scope" >
        <el-form v-if='scope.row.grantMonth == ruleForm.thisGrantMonth'>
          <el-input v-model="thisGrantRemarks" placeholder='填写发放特殊情况说明'></el-input>
        </el-form>
        <span v-else>{{scope.row.grantRemarks}}</span>
    </template>
    </el-table-column>
    <el-table-column
      v-else-if="this.$route.query.approvalState=='2'"
      prop="grantRemarks"
      label="说明"
      align='center'>
    </el-table-column>
  </el-table>
  <!-- 表格信息END -->
    <el-row>
      <el-col :span="20" style="margin-left: 20px;margin-top: 10px;">
        <el-form>
          <el-form-item label="本次申请人员明细：" prop="name">
            <a class="btn" v-if='compList == false' @click="detailsTable">展开人员明细</a>
            <a class="btn" v-else @click="detailsTable">关闭人员明细</a>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 隐藏的表格信息 -->
    <el-table
    v-show='compList'
    :data="ruleForm.GrantList"
    border
    style="width: 100%">
    <el-table-column
      prop="personnelName"
      label="项目参与人员"
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
      prop="thisGrantAmount"
      label="本次分配金额"
      align='right'>
      <template scope="scope">
        <span >{{scope.row.thisGrantAmount | moneyFormat}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="remarks"
      label="说明"
      align='center'>
    </el-table-column>
  </el-table>
  <!-- 隐藏的表格信息END -->
    <!-- 审批流程START -->
    <el-form v-if="this.$route.query.approvalState=='1'">
      <approvalSelect  ref="approvalData" :params="workFlowData"  :key="workData" ></approvalSelect>
    </el-form>
  <!-- 审批流程END -->
    <div v-else-if="this.$route.query.approvalState=='2'">
      <topTip>
        <template>
          <el-row>
            <el-col :span="15" class="top-tip" style="text-align: left;">
              <div>
                <span style="color: #417095;font-size: 16px;font-weight: bolder;">流程日志</span>
              </div>
            </el-col>
          </el-row>
        </template>
      </topTip>
      <approvalDetail :processInstanceId="workFlowData.processInstanceId" :key="Math.random()"></approvalDetail>
    </div>

    <div style="text-align: center;padding-bottom:20px"  v-if="this.$route.query.approvalState=='1'">
      <button type="button" @click='submitClick' class="el-button yt-bottom-btn el-button--primary">
        <span>提交</span>
      </button>
      <button type="button" class="el-button yt-bottom-btn el-button--default" @click='closeClick'>
        <span>取消</span>
      </button>
    </div>
    <div style="text-align: center;padding-bottom:20px"  v-else-if="this.$route.query.approvalState=='2'">
      <button type="button" class="el-button yt-bottom-btn el-button--default" @click='closeClick'>
        <span>关闭</span>
      </button>
    </div>
  </div>
</template>

<script>
//一级标题
import topTip from "@/components/topTip";
//二级标题
import secondLevel from "@/components/secondLevel";
//流程审批
import approvalSelect from "@/components/ApprovalSelect/ApprovalSelect";
import approvalDetail from "../../components/ApprovalDetail/ApprovalDetail";
import axios from "@/service/http";
import { option } from "@/static/config";
//copy组件
import { cloneData } from "../../static/commonTool";
export default {
  // 数据源
  data() {
    return {
      ruleForm: {
        practicePerformanceId:this.$route.query.practicePerformanceId,
        grantRemarks:'',//说明
        projectId: "",//项目编号
        projectName:'',
        budgetMoney:'',//项目总金额
        projectPersonName:'',//项目负责人
        contractList:[],//合同list
        revenueRecognizedAmount:'',//已确认收入金额
        grantRatio:'',//发放百分比
        grantAmount:'',//发放总额度
        paidAmount:'',//已发放金额
        currentAvailableAmount:'',//当前可发放金额
        projectTypeName:'',//项目类型
        historyGrantMonthList:'',//历史发放月份
        thisGrantMonth: '2020-01',//本次发放月份
        GrantList:[],//人员明细列表
        tableData:[],
      },
      workData:'',
      thisGrantRemarks:'',
      workFlowData: {
        //工作流参数
        processInstanceId: "",
        parameters: "",
        businessCode: "PRACTICE_PERFORMANCE_FLOW",
        // projectNumber: ""
      },
      compact: false, //显示隐藏合同
      compList:false,//显示隐藏表格
      labelposition: "right",
      // thisMonth:'',
      aa:'',
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

  },
  created() {
    this.getMessage();
  },
  // 方法声明
  methods: {
    // 点击提交按钮
    //  工作流
    submitClick(data) {
      axios
        .post(
          option.base_path +
            "wages/performance/savePracticePerformanceSubmitWorkflow",
          {
            practicePerformanceId:this.ruleForm.practicePerformanceId, //appId  表单申请id
            parameters: '', //parameters  JSON格式字符串,
            dealingWithPeople: this.$refs.approvalData.approvalForm
              .nextOperCode, //dealingWithPeople  下一步操作人code
            opintion: this.$refs.approvalData.approvalForm.textarea, //opintion 审批意见
            processInstanceId: this.workFlowData.processInstanceId, //processInstanceId  流程实例ID,
            nextCode: this.$refs.approvalData.approvalForm.nextCode, //nextCode 操作流程代码
            thisGrantRemarks:this.thisGrantRemarks
          }
        )
        .then((data) => {
          this.$router.replace('/meritsPractice/practiceAppore')
          this.$message({
          message: '提交成功',
          type: 'success'
        });
          console.log(data);
          if (data.data.flag == 0) {
            // this.$router.push({ path: "/approval/myApplyList" });
          }
        });
    },
    // 点击取消关闭页面
    closeClick(){
      if(this.$route.query.close == '1'){
        this.$confirm('确认关闭此页面吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '关闭成功!'
            });
            this.$router.replace('')
            this.$router.replace({
              path:'/meritsPractice/achievementsList',
              query: {
                projectId:this.ruleForm.projectId
              }
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
        });
      }else{
        this.$confirm('确认关闭此页面吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '关闭成功!'
            });
            this.$router.replace('/meritsPractice/practiceAppore')
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
        });
      }
    },
    //展开隐藏合同
    details() {
      this.compact = !this.compact;
    },
    // 显示隐藏表格
    detailsTable(){
      this.compList = !this.compList;
    },
    // 获取页面数据
    getMessage(){
      let workFlowData = cloneData(this.workFlowData);

      axios.post(option.base_path+'wages/performance/getPracticePerformanceById',this.ruleForm).then(res => {
          this.ruleForm = res.data.data

          workFlowData.processInstanceId = res.data.data.processInstanceId;


          // this.total = res.data.data.total;
          this.ruleForm.GrantList = res.data.data.thisGrantList
          this.ruleForm.tableData = res.data.data.historyGrantMonthList
          this.workFlowData = workFlowData
          this.workData = Math.random()
          // this.
        }).catch((error) => {
          console.log('异常',error)
        })

    },

  },
  // 组件注册
  components: {
    topTip,
    secondLevel,
    approvalSelect,
    approvalDetail,
    cloneData
  },
};
</script>
<style scoped>
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
  margin-left: 650px;
  cursor: pointer;
  color: #257db9;
}
</style>

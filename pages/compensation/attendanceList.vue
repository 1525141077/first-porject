<template>
  <div class="yt-dome-container">
    <!-- 顶部信息START -->
    <topTip>
      <template>
        <el-row>
          <el-col :span="15" class="top-tip" align='left' >
            <div>
              <span style="color: #417095;font-size: 16px;font-weight: bolder;">基本信息</span>
            </div>
          </el-col>
          <el-col :span="8" align='right' >
            <div>
              <label><span style="color:rgb(65, 112, 149);font-weight:bold;letter-spacing:4px">申请日期：</span><span>{{ruleForm.originMonth}}</span></label>
            </div>
          </el-col>
        </el-row>
      </template>
    </topTip>
     <!-- 基本信息区域 -->
    <div class="user_info">
      <el-row style="margin-bottom: 20px;">
        <el-col :span="7" style="margin-left:10px">
          <label class="yt-read-text">
            <span style="letter-spacing: 40px;">姓</span>名：
            <span>{{ruleForm.realName==""?'--':ruleForm.realName}}</span>
          </label>
        </el-col>
        <el-col :span="8">
          <label class="yt-read-text">
            <span style="letter-spacing: 40px;">工</span>号：
          </label>
          <span>{{ruleForm.workNum==""?'--':ruleForm.workNum}}</span>
        </el-col>
        <el-col :span="8">
          <label class="yt-read-text">
            <span style="letter-spacing: 5px;">工作状</span>态：
          </label>
          <span>{{ruleForm.workStateName==""?'--':ruleForm.workStateName}}</span>
        </el-col>
      </el-row>
    </div>
    <!-- 顶部信息END -->
    <!-- 考勤扣款信息START -->
    <topTip>
      <template>
        <el-row>
          <el-col :span="15" class="top-tip" align='left' >
            <div>
              <span style="color: #417095;font-size: 16px;font-weight: bolder;">考勤扣款信息</span>
            </div>
          </el-col>
        </el-row>
      </template>
    </topTip>
     <!-- //表格 -->
     <el-table
     :data="tableData"
     border
     :header-cell-style="{background:'rgb(71,92,109)'}"
     style="width: 100%;">
     <el-table-column prop="sickLeave" label="病假" header-align="center" width='50'></el-table-column>
     <el-table-column prop="sickLeaveDeduction" label="扣款数" align="right" width='50'></el-table-column>
     <el-table-column prop="affairLeave" label="事假" align="right" width='50'></el-table-column>
     <el-table-column prop="affairLeaveDeduction" label="扣款数" align="right" width='50'></el-table-column>
     <el-table-column prop="annualLeave" label="年假" align="right" width='50'></el-table-column>
     <el-table-column prop="examLeave" label="考试假" align="right" width='50'></el-table-column>
     <el-table-column prop="maritalLeave" label="婚假" align="right" width='50'></el-table-column>
     <el-table-column prop="funeralLeave" label="丧假" align="right" width='50'></el-table-column>
     <el-table-column prop="prenatalExaminationLeave" label="产前检查假" align="right" width='80'></el-table-column>
     <el-table-column prop="maternityLeave" label="产假" align="right" width='50'></el-table-column>
     <el-table-column prop="familyLeave" label="探亲假" align="right" width='50'></el-table-column>
     <el-table-column prop="paternityLeave" label="陪产假" align="right" width='50'></el-table-column>
     <el-table-column prop="numberWorkDays" label="应工作天数" align="right"></el-table-column>
     <el-table-column prop="actualWorkDays" label="实际工作天数" align="right"></el-table-column>
     <el-table-column prop="probationDays" label="入离职扣款" align="right"></el-table-column>
     <el-table-column prop="probationDays" label="	试用期天数" align="right"></el-table-column>
     <el-table-column prop="probationDeduction" label="	试用期扣款" align="right"></el-table-column>
   </el-table>

   <!-- 考勤扣款信息START -->
   <topTip>
    <template>
      <el-row>
        <el-col :span="15" class="top-tip" align='left' >
          <div>
            <span style="color: #417095;font-size: 16px;font-weight: bolder;">差旅补贴信息</span>
          </div>
        </el-col>
      </el-row>
    </template>
  </topTip>
    <!-- //表格 -->
    <el-table
    :data="tableData"
    border
    :header-cell-style="{background:'rgb(71,92,109)'}"
    style="width: 100%;">
    <el-table-column prop="workNum" label="外阜	" header-align="center" align="right"></el-table-column>
    <el-table-column prop="sickLeave" label="补贴" align="right"></el-table-column>
    <el-table-column prop="thisCityMoney" label="本市" align="right"></el-table-column>
    <el-table-column prop="sumTotal" label="补贴" align="right"></el-table-column>
  </el-table>
  <div style="width: 100px;margin: 0 auto;margin-top: 20px;">
    <el-button @click='closeClick'>关闭</el-button>
  </div>
  </div>
</template>

<script>
  import topTip from "../../components/topTip.vue";
  import axios from "@/service/http";
  import { option } from "@/static/config";
export default {
  // 数据源
  data () {
    return {
      companyList: [],
      deptList: [],
      tableData: [],
      ruleForm: {
        realName: "",
        workStateName: "",
        originMonth:'',
        workNum:''
      },

    };
  },
  // 初始化执行
  mounted () {
    this.getMessage()
  },
  // 方法声明
  methods: {
    // 点击返回
    closeClick(){
      this.$router.replace('/compensation/attendanceData')
    },

    // 获取列表数据
    getMessage(){
      let that = this;
        axios
          .post(option.base_path + "wages/attendance/getMonthAttendanceByid", {
            pkId:this.$route.query.pkId
          })
          .then((res) => {
            // this.peopleList.push(man)
            this.ruleForm = res.data.data

            this.tableData.push(this.ruleForm);
            // this.total = res.data.data.total;
            console.log("返回值", res.data.data);
          })
          .catch(function (error) {
            console.log(error);
          });
    },
    // 点击返回，返回列表页
    // close(){
    //   this.$router.replace('/compensation/checkWorkAttendanceYear')
    // }
  },
  // 组件注册
  components: {
    topTip
  }
}
</script>
<style scoped>
.yt-read-text {
  color: #003465;
  font-weight: bold;

}
.has-gutter {

}
</style>

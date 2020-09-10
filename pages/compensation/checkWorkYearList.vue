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
              <el-button @click="close" >返回</el-button>
            </div>
          </el-col>
        </el-row>
      </template>
    </topTip>
     <!-- 基本信息区域 -->
    <div class="user_info">
      <el-row style=" margin-bottom: 20px;">
        <el-col :span="7" style="margin-left:10px">
          <label class="yt-read-text">
            <span style="letter-spacing: 40px;">姓</span>名：
            <span>{{ruleForm.realName == "" ? '--' : ruleForm.realName}}</span>
          </label>
        </el-col>
        <el-col :span="8">
          <label class="yt-read-text">
            <span style="letter-spacing: 40px;">工</span>号：
          </label>
          <span>{{ruleForm.workNum== "" ? '--' : ruleForm.workNum}}</span>
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
    <!-- 考勤信息 -->
    <topTip>
      <template>
        <el-row>
          <el-col :span="23" class="top-tip" align='left' >
            <div>
              <span style="color: #417095;font-size: 16px;font-weight: bolder;">各月度考勤信息</span>
            </div>
          </el-col>
        </el-row>
      </template>
    </topTip>
    <!-- 考勤信息END -->
     <!-- //表格 -->
     <el-table
     :data="tableData"
     border
     :header-cell-style="{background:'rgb(71,92,109)'}"
     style="width: 100%;">
     <el-table-column prop="month" label="月份" header-align="center" align="center" width='50' >

     </el-table-column>
     <el-table-column prop="sickLeave" label="病假" header-align="center" width='50'></el-table-column>
     <el-table-column prop="sickLeaveDeduction" label="扣款数" align="center" width='50'></el-table-column>
     <el-table-column prop="affairLeave" label="事假" align="center" width='50'></el-table-column>
     <el-table-column prop="affairLeaveDeduction" label="扣款数" align="center" width='50'></el-table-column>
     <el-table-column prop="annualLeave" label="年假" align="center" width='50'></el-table-column>
     <el-table-column prop="examLeave" label="考试假" align="center" width='50'></el-table-column>
     <el-table-column prop="maritalLeave" label="婚假" align="center" width='50'></el-table-column>
     <el-table-column prop="funeralLeave" label="丧假" align="center" width='50'></el-table-column>
     <el-table-column prop="prenatalExaminationLeave" label="产前检查假" align="center" width='80'></el-table-column>
     <el-table-column prop="maternityLeave" label="产假" align="center" width='50'></el-table-column>
     <el-table-column prop="familyLeave" label="探亲假" align="center" width='50'></el-table-column>
     <el-table-column prop="paternityLeave" label="陪产假" align="center" width='50'></el-table-column>
     <el-table-column prop="numberWorkDays" label="应工作天数" align="center"></el-table-column>
     <el-table-column prop="actualWorkDays" label="实际工作天数" align="center"></el-table-column>
     <el-table-column prop="probationDays" label="入离职扣款" align="center"></el-table-column>
     <el-table-column prop="probationDays" label="	试用期天数" align="center"></el-table-column>
     <el-table-column prop="probationDeduction" label="	试用期扣款" align="center"></el-table-column>
     <el-table-column label="差旅补贴信息">
      <el-table-column prop="sumTotal" label="	外阜" align="center"></el-table-column>
      <el-table-column prop="sickLeave" label="	补贴" align="center"></el-table-column>
      <el-table-column prop="thisCityMoney" label="	本市" align="center"></el-table-column>
      <el-table-column prop="sumTotal" label="	补贴" align="center"></el-table-column>
    </el-table-column>
   </el-table>
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
      total: 0,
      ruleForm: {
        realName: "",
        workNum: "",
        workStateName:'',
      },
    };
  },
  // 初始化执行
  mounted () {
    this.getMessage()
  },
  // 方法声明
  methods: {

    getMessage(){
      axios.post(option.base_path+'wages/attendance/getMonthAttendanceListByPersonnelId',{
        personnelId:this.$route.query.personnelId,
        year:this.$route.query.year
      }).then( res => {
        debugger
            this.ruleForm = res.data.data
            console.log("rengong",res.data.data)
            // this.tableData.push(this.ruleForm);
            this.tableData = res.data.data.yearList;
            console.log('士大夫撒',this.tableData)
            // this.total = res.data.data.total;
            // this.getProjectList()
        }).catch((error) => {
          console.log('异常',error)
        })
    },
    // 点击返回，返回列表页
    close(){
      this.$router.replace('/compensation/checkWorkAttendanceYear')
    }
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

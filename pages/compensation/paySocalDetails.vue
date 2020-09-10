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
              <label><span style="color:rgb(65, 112, 149);font-weight:bold;letter-spacing:4px">所属日期：</span><span>{{ruleForm.durationStay}}</span></label>
            </div>
          </el-col>
        </el-row>
      </template>
    </topTip>
     <!-- 基本信息区域 -->
    <div class="user_info">
      <el-row style="margin-bottom: 20px;">
        <el-col :span="6" style="margin-left:10px">
          <label class="yt-read-text">
            <span style="letter-spacing: 40px;">姓</span>名：
            <span>{{ruleForm.realName==""?'--':ruleForm.realName}}</span>
          </label>
        </el-col>
        <el-col :span="6" style="margin-left:10px">
          <label class="yt-read-text">
            <span style="letter-spacing: 40px;">所属地</span>区：
            <span>{{ruleForm.regionOriginName==""?'--':ruleForm.regionOriginName}}</span>
          </label>
        </el-col>
        <el-col :span="6">
          <label class="yt-read-text">
            <span style="letter-spacing: 40px;">工</span>号：
          </label>
          <span>{{ruleForm.workNum==""?'--':ruleForm.workNum}}</span>
        </el-col>
        <el-col :span="5">
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
              <span style="color: #417095;font-size: 16px;font-weight: bolder;">社保信息</span>
            </div>
          </el-col>
        </el-row>
      </template>
    </topTip>
    <div class="user_info">
      <el-row style="margin-bottom: 20px;">
        <el-col :span="6" style="margin-left:10px">
          <label class="yt-read-text">
            <span>实际缴纳公司：</span>
            <span>{{ruleForm.socialPayCompName==""?'--':ruleForm.socialPayCompName}}</span>
          </label>
        </el-col>
        <el-col :span="6" style="margin-left:10px">
          <label class="yt-read-text">
            <span>社保缴纳比例名称：</span>
            <span>{{ruleForm.socialPayScaleName==""?'--':ruleForm.socialPayScaleName}}</span>
          </label>
        </el-col>
        <el-col :span="6">
          <label class="yt-read-text">
            <span>社保缴纳状态：</span>
          </label>
          <span v-if='ruleForm.socialPayState==1'>正常</span>
          <span v-else-if='ruleForm.socialPayState==2'>暂不缴纳</span>
          <span v-else-if='ruleForm.socialPayState==3'>停缴</span>
          <span v-else-if='ruleForm.socialPayState==4'>次月停缴</span>
        </el-col>
        <el-col :span="5">
          <label class="yt-read-text">
            <span>社保缴纳比例方式：</span>
          </label>
          <span v-if='ruleForm.socialPayScaleMode==1'>正常比例</span>
          <span v-else-if='ruleForm.socialPayScaleMode==2'>个人全负担</span>
          <span v-else-if='ruleForm.socialPayScaleMode==3'>公司全负担</span>
          <!-- <span v-else-if='ruleForm.socialPayScaleMode==4'>次月停缴</span> -->
          <!-- <span>{{ruleForm.socialPayScaleMode=="1"?'正常比例': '非正常比例'}}</span> -->
        </el-col>
      </el-row>
    </div>
     <!-- //表格 -->
     <el-table
     :data="tableData"
     border
     :header-cell-style="{background:'rgb(71,92,109)'}"
     style="width: 100%;">
     <el-table-column prop="pensionPayBaseMoney" label="养老保险缴纳" header-align="center" >
      <el-table-column prop="pensionPayBaseMoney" label="养老基数" align="right"></el-table-column>
      <el-table-column prop="pensionCompScale" label="公司负担" align="right"></el-table-column>
      <el-table-column prop="pensionPersonalScale" label="个人负担" align="right"></el-table-column>
     </el-table-column>
     <el-table-column prop="medicalPayBaseMoney" label="医疗保险缴纳" header-align="center">
      <el-table-column prop="medicalPayBaseMoney" label="医疗基数" align="right"></el-table-column>
      <el-table-column prop="medicalCompScale" label="公司负担" align="right"></el-table-column>
      <el-table-column prop="medicalPersonalScale" label="个人负担" align="right"></el-table-column>
     </el-table-column>
     <el-table-column prop="injuredPayBaseMoney" label="工伤保险缴纳" header-align="center">
      <el-table-column prop="injuredPayBaseMoney" label="工伤基数" align="right"></el-table-column>
      <el-table-column prop="injuredCompScale" label="公司负担" align="right"></el-table-column>
      <el-table-column prop="injuredPersonalScale" label="个人负担" align="right" ></el-table-column>
     </el-table-column>
     <el-table-column prop="birthPayBaseMoney" label="生育保险缴纳" header-align="center">
      <el-table-column prop="birthPayBaseMoney" label="生育基数" align="right" ></el-table-column>
      <el-table-column prop="birthCompScale" label="公司负担" align="right"></el-table-column>
      <el-table-column prop="birthPersonalScale" label="个人负担" align="right"></el-table-column>
     </el-table-column>
     <el-table-column prop="joblessPayBaseMoney" label="失业保险缴纳" header-align="center">
      <el-table-column prop="joblessPayBaseMoney" label="失业基数" align="right"></el-table-column>
      <el-table-column prop="joblessCompScale" label="公司负担" align="right"></el-table-column>
      <el-table-column prop="joblessPersonalScale" label="个人负担" align="right"></el-table-column>
     </el-table-column>
   </el-table>
   <div class="user_info">
    <el-row style="margin-bottom: 20px;">
      <el-col :span="6" style="margin-left:10px">
        <label class="yt-read-text">
          <span>社保补缴月数：</span>
          <span>{{ruleForm.payBackMonthlyNumber==""?'--':ruleForm.payBackMonthlyNumber}}</span>
        </label>
      </el-col>
    </el-row>
  </div>
<!-- //表格 -->
<el-table
:data="tableData"
border
:header-cell-style="{background:'rgb(71,92,109)'}"
style="width: 100%;">
<el-table-column prop="sickLeave" label="养老保险补缴" header-align="center" >
 <el-table-column prop="pensionPayBackBaseMoney" label="补缴基数" align="right"></el-table-column>
 <el-table-column prop="pensionCompPayBackMoney" label="公司负担" align="right"></el-table-column>
 <el-table-column prop="pensionPersonalPayBackMoney" label="个人负担" align="right"></el-table-column>
</el-table-column>
<el-table-column prop="sickLeave" label="医疗保险补缴" header-align="center">
 <el-table-column prop="medicalPayBackBaseMoney" label="补缴基数" align="right"></el-table-column>
 <el-table-column prop="medicalCompPayBackMoney" label="公司负担" align="right"></el-table-column>
 <el-table-column prop="medicalPersonalPayBackMoney" label="个人负担" align="right"></el-table-column>
</el-table-column>
<el-table-column prop="sickLeave" label="工伤保险补缴" header-align="center">
 <el-table-column prop="injuredPayBackBaseMoney" label="补缴基数" align="right"></el-table-column>
 <el-table-column prop="injuredCompPayBackMoney" label="公司负担" align="right"></el-table-column>
 <el-table-column prop="injuredPersonalPayBackMoney" label="个人负担" align="right" ></el-table-column>
</el-table-column>
<el-table-column prop="sickLeave" label="生育保险补缴" header-align="center">
 <el-table-column prop="birthPayBackBaseMoney" label="补缴基数" align="right" ></el-table-column>
 <el-table-column prop="birthCompPayBackMoney" label="公司负担" align="right"></el-table-column>
 <el-table-column prop="birthPersonalPayBackMoney" label="个人负担" align="right"></el-table-column>
</el-table-column>
<el-table-column prop="sickLeave" label="失业保险补缴" header-align="center">
 <el-table-column prop="joblessPayBackBaseMoney" label="补缴基数" align="right"></el-table-column>
 <el-table-column prop="joblessCompPayBackMoney" label="公司负担" align="right"></el-table-column>
 <el-table-column prop="joblessPersonalPayBackMoney" label="个人负担" align="right"></el-table-column>
</el-table-column>
</el-table>

   <!-- 考勤扣款信息START -->
   <topTip>
    <template>
      <el-row>
        <el-col :span="15" class="top-tip" align='left' >
          <div>
            <span style="color: #417095;font-size: 16px;font-weight: bolder;">其他社保信息</span>
          </div>
        </el-col>
      </el-row>
    </template>
  </topTip>
  <div class="user_info">
    <el-row style="margin-bottom: 20px;">
      <el-col :span="8" style="margin-left:10px">
        <label class="yt-read-text">
          <span>大额互助：</span>
          <span>{{ruleForm.bigCooperation==""?'--':ruleForm.bigCooperation}}</span>
        </label>
      </el-col>
      <el-col :span="8" style="margin-left:10px">
        <label class="yt-read-text">
          <span>大额医疗：</span>
          <span>{{ruleForm.bigCooperationMoney==""?'--':ruleForm.bigCooperationMoney}}</span>
        </label>
      </el-col>
    </el-row>
  </div>
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
        durationStay:'',
        workNum:'',
        payBackMonthlyNumber:'',
        socialPayState:'',//缴纳状态
        socialPayScaleMode:'',
        socialPayCompName:'',
        bigCooperation:'',
        bigCooperationMoney:''
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
      this.$router.replace('/compensation/payAdminListExit')
    },

    // 获取列表数据
    getMessage(){
      // let that = this;
        axios
          .post(option.base_path + "fundPayMonth/getFundPayMonthDetailsInfo", {
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
</style>

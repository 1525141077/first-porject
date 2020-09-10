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
        </el-row>
      </template>
    </topTip>
     <!-- 基本信息区域 -->
    <div class="user_info">
      <el-row style=" margin-bottom: 20px;margin-left: 10px;">
        <el-col :span="7" style="margin-left:10px">
          <label class="yt-read-text">
            <span style="letter-spacing: 40px;">姓</span>名：
            <span>{{ruleForm.realName}}</span>
          </label>
        </el-col>
        <el-col :span="8">
          <label class="yt-read-text">
            <span style="letter-spacing: 40px;">工</span>号：
          </label>
          <span>{{ruleForm.workNum}}</span>
        </el-col>
        <el-col :span="8">
          <label class="yt-read-text">
            <span style="letter-spacing: 5px;">入职时</span>间：
          </label>
          <span>{{ruleForm.employDate}}</span>
        </el-col>
      </el-row>
      <el-row style=" margin-bottom: 20px;margin-left: 10px;">
        <el-col :span="7"  style="margin-left:10px">
          <label class="yt-read-text">
            <span style="letter-spacing: 5px;">所属地</span>区：
          </label>
          <span>{{ruleForm.regionOriginName}}</span>
        </el-col>
        <el-col :span="8">
          <label class="yt-read-text">
            <span style="letter-spacing: 5px;">工作状</span>态：
          </label>
          <span>{{ruleForm.workStateName}}</span>
        </el-col>
        <el-col :span="8" style="margin-left:10px">
          <label class="yt-read-text">
            <span>缴纳比例名称：</span>
            <span>{{ruleForm.socialPayScaleName}}</span>
          </label>
        </el-col>
      </el-row>
      <el-row style=" margin-bottom: 20px;margin-left: 10px;">
        <el-col :span="7" style="margin-left:10px">
          <label class="yt-read-text">
            <span>社保缴纳单位：</span>
            <span>{{ruleForm.socialPayCompName}}</span>
          </label>
        </el-col>
        <el-col :span="8" style="margin-left:10px">
          <label class="yt-read-text">
            <span>社保缴存状态：</span>
            <span v-if='ruleForm.socialPayState ==1'>正常</span>
            <span v-else-if='ruleForm.socialPayState == 2'>暂不缴纳</span>
            <span v-else-if='ruleForm.socialPayState ==3'>停缴</span>
            <span v-else-if='ruleForm.socialPayState ==4'>次月停缴</span>
          </label>
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
              <span style="color: #417095;font-size: 16px;font-weight: bolder;">社保信息</span>
            </div>
          </el-col>
        </el-row>
      </template>
    </topTip>
    <!-- 考勤信息END -->
    <!-- 表单部分START -->
    <el-form ref="ruleForm" :model="ruleForm" label-width="140px">
      <el-row>
        <el-col :span='8'>
          <el-form-item label="社保公司负担：" :rules="{required: true,message: '社保公司负担',trigger: 'blur'}">
            <!-- <el-input v-model="ruleForm.socialCompPayMoney"></el-input>元 -->
            <finmoneyinput v-model="ruleForm.socialCompPayMoney" :tail="'元'"></finmoneyinput>
          </el-form-item>
        </el-col>
        <el-col :span='8'>
          <el-form-item label="社保个人负担：" :rules="{required: true,message: '社保个人负担',trigger: 'blur'}">
            <!-- <el-input v-model="ruleForm.socialPersonalPayMoney"></el-input>元 -->
            <finmoneyinput v-model="ruleForm.socialPersonalPayMoney" :tail="'元'"></finmoneyinput>
          </el-form-item>
        </el-col>
        <el-col :span='7' style="margin-left: 20px;">
          <el-form-item label="大额医疗补交金额：" :rules="{required: true,message: '大额医疗补交金额',trigger: 'blur'}">
            <!-- <el-input v-model="ruleForm.workNum"></el-input>元 -->
            <finmoneyinput v-model="ruleForm.bigMedical" :tail="'元'"></finmoneyinput>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='8'>
          <el-form-item label="社保补缴月数：" :rules="{required: true,message: '社保补缴月数',trigger: 'blur'}">
            <el-input v-model="ruleForm.payBackMonthlyNumber" @blur='inputBlur'></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='8' style="margin-left: 20px;">
          <el-form-item label="医疗保险补缴基数：" :rules="{required: true,message: '医疗保险补缴基数',trigger: 'blur'}">
            <!-- <el-input v-model="ruleForm.workNum"></el-input>元 -->
            <finmoneyinput v-model="ruleForm.medicalPayBackBaseMoney" :tail="'元'"></finmoneyinput>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-left: 27px;">
        <el-col :span='8'>
          <el-form-item label="生育保险补缴基数：" :rules="{required: true,message: '生育保险补缴基数',trigger: 'blur'}">
            <!-- <el-input v-model="ruleForm.workNum"></el-input>元 -->
            <finmoneyinput v-model="ruleForm.birthPayBackBaseMoney" :tail="'元'"></finmoneyinput>
          </el-form-item>
        </el-col>
        <el-col :span='8' style="margin-left: 20px;">
          <el-form-item label="工伤保险补缴基数：" :rules="{required: true,message: '工伤保险补缴基数',trigger: 'blur'}">
            <!-- <el-input v-model="ruleForm.workNum"></el-input>元 -->
            <finmoneyinput v-model="ruleForm.injuredPayBackBaseMoney" :tail="'元'"></finmoneyinput>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-left: 27px;">
        <el-col :span='8'>
          <el-form-item label="失业保险补缴基数：" :rules="{required: true,message: '失业保险补缴基数',trigger: 'blur'}">
            <!-- <el-input v-model="ruleForm.workNum"></el-input>元 -->
            <finmoneyinput v-model="ruleForm.joblessPayBackBaseMoney" :tail="'元'"></finmoneyinput>
          </el-form-item>
        </el-col>
        <el-col :span='8' style="margin-left: 20px;">
          <el-form-item label="养老保险补缴基数：" :rules="{required: true,message: '养老保险补缴基数',trigger: 'blur'}">
            <!-- <el-input v-model="ruleForm.workNum"></el-input>元 -->
            <finmoneyinput v-model="ruleForm.pensionPayBackBaseMoney" :tail="'元'"></finmoneyinput>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-left: 27px;">
        <el-col :span='8'>
          <el-form-item label="社保补缴公司负担：" :rules="{required: true,message: '社保补缴公司负担',trigger: 'blur'}">
            <!-- <el-input v-model="ruleForm.workNum"></el-input>元 -->
            <finmoneyinput v-model="ruleForm.compPayBackMoney" :tail="'元'"></finmoneyinput>
          </el-form-item>
        </el-col>
        <el-col :span='8' style="margin-left: 20px;">
          <el-form-item label="社保补缴个人负担：" :rules="{required: true,message: '社保补缴个人负担',trigger: 'blur'}">
            <!-- <el-input v-model="ruleForm.workNum"></el-input>元 -->
            <finmoneyinput v-model="ruleForm.personalPayBackMoney" :tail="'元'"></finmoneyinput>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
      <el-col :span='20' style="position: relative;left: -50px;">
        <el-form-item label="备 注：" >
          <!-- <span style="letter-spacing: 40px;">备</span>注： -->
          <el-input type="textarea" v-model="ruleForm.remarks"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      </el-form-item>
    </el-form>
    <!-- 表单部分END -->
    <!-- <el-row> -->
      <div style="margin-top: 20px;margin-bottom: 20px;width: 120px;margin: 0 auto;">
        <el-button type="primary" @click='save'>保存</el-button>
        <el-button @click='closePage'>取消</el-button>
      </div>
    <!-- </el-row> -->
  </div>
</template>

<script>
  import topTip from "../../components/topTip.vue";
  import axios from "@/service/http";
  import { option } from "@/static/config";
  import finmoneyinput from "../../components/fin-money-input";
export default {
  // 数据源
  data () {
    return {
      companyList: [],
      deptList: [],
      tableData: [],
      total: 0,
      ruleForm: {
        pkId:this.$route.query.pkId,
        realName: "",
        workNum: "",
        employDate:'',
        regionOriginName:'',//所属地区
        bigMedical:'',
        workState:"",
        workStateName:'',//工作状态
        socialPayScaleName:'',//北京五险一金比例
        socialPayCompName:'',//缴纳单位
        socialPayState:'',//社保缴纳状态
        remarks:'',//备注
        compPayBackMoney:0,//社保公司补缴负担
        personalPayBackMoney:0,//社保个人补缴
        joblessPayBackBaseMoney:0,//失业补缴基数
        injuredPayBackBaseMoney:0,//工伤
        birthPayBackBaseMoney:0,//生育
        pensionPayBackBaseMoney:0,//养老
        medicalPayBackBaseMoney:0,//医疗
        payBackMonthlyNumber:0,//缴纳月数
      },
    };
  },
  // 初始化执行
  mounted () {
    this.getMessage()
    this.inputBlur()
  },
  // 方法声明
  methods: {
// 点击保存
    save(){
      // debugger
      this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            axios.post(option.base_path+'fundPayMonth/updateSocialPayMonthDetails',{
              pkId: this.$route.query.pkId,
              socialPayComp: this.ruleForm.socialPayComp,
              socialPayCompName: this.ruleForm.socialPayCompName,
              socialPayState: this.ruleForm.socialPayState,
              medicalPayBaseMoney: this.ruleForm.medicalPayBaseMoney,
              pensionPayBaseMoney: this.ruleForm.pensionPayBaseMoney,
              birthPayBaseMoney: this.ruleForm.birthPayBaseMoney,
              joblessPayBaseMoney: this.ruleForm.joblessPayBaseMoney,
              socialCompPayMoney: this.ruleForm.socialCompPayMoney,
              socialPersonalPayMoney: this.ruleForm.socialPersonalPayMoney,
              socialPayBackMonthlyNumber: this.ruleForm.socialPayBackMonthlyNumber,
              medicalPayBackBaseMoney: this.ruleForm.medicalPayBackBaseMoney,
              pensionPayBackBaseMoney: this.ruleForm.pensionPayBackBaseMoney,
              birthPayBackBaseMoney: this.ruleForm.birthPayBackBaseMoney,
              injuredPayBackBaseMoney: this.ruleForm.injuredPayBackBaseMoney,
              joblessPayBackBaseMoney: this.ruleForm.joblessPayBackBaseMoney,
              socialCompPayBackMoney: this.ruleForm.socialCompPayBackMoney,
              socialPersonalPayBackMoney: this.ruleForm.socialPersonalPayBackMoney,
              bigMedical: this.ruleForm.bigMedical,
              remarks: this.ruleForm.remarks,

      }).then( res => {
            // this.ruleForm = res.data.data
            console.log("士大夫撒",res.data.data)
            // this.tableData.push(this.ruleForm);
            // this.tableData = res.data.data.yearList;
            // console.log('士大夫撒',this.tableData)
            // this.total = res.data.data.total;
            // this.getProjectList()
            this.$message('保存成功');
        }).catch((error) => {
          console.log('异常',error)
        })
        // this.$router.replace('/compensation/payAdminListExit')
        this.$router.replace({
          path: '/compensation/payAdminListExit',
          query: {
            payMonthId: this.$route.query.payMonthId
          }
        });
      }
        })
    },
    closePage(){
      this.$confirm('确认关闭吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '已关闭'
          });
          this.$router.replace({
          path: '/compensation/payAdminListExit',
          query: {
            payMonthId:this.$route.query.payMonthId
          }
        });
        })
    },
    //
    getMessage(){
      axios.post(option.base_path+'fundPayMonth/getFundPayMonthDetailsInfo',{
        pkId:this.$route.query.pkId,
        // year:this.$route.query.year
      }).then( res => {
        // debugger
            this.ruleForm = res.data.data
            console.log("rengong",res.data)
            // this.tableData.push(this.ruleForm);
            // this.tableData = res.data.data.yearList;
            console.log('士大夫撒',this.ruleForm)
            // this.total = res.data.data.total;
            // this.getProjectList()
        }).catch((error) => {
          console.log('异常',error)
        })
    },
    // 计算社保数
    inputBlur(){
      axios.post(option.base_path+'base/accumulation/getAllPayScaleNameByRegionOrigin',{
        // pkId:this.$route.query.pkId,
        category:'',
        regionOrigin:''
        // year:this.$route.query.year
      }).then( res => {
        // debugger
            this.ruleForm = res.data.data
            console.log("rengong",res.data.data)
            // this.tableData.push(this.ruleForm);
            // this.tableData = res.data.data.yearList;
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
    topTip,
    finmoneyinput
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

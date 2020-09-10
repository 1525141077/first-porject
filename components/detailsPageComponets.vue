<template>
  <!--
  @check: 验证按钮
  @resetForm： 取消按钮
@close： 关闭按钮
  -->
<div class="details-page-componets" style="">
  <!-- 项目基本信息START -->
  <div>
    <!-- 顶部信息START -->
        <topTip>
          <template>
            <el-col :span="6"  style="text-align: left;" class="top-tip">
              <div  v-if="lookType === '1'">
                <span style="color: #417095;font-size: 16px;font-weight: bolder;">请填写项目基本信息</span>
                <span style="color: #797979;font-size: 14px;">预立项申请人填写</span>
              </div>
              <span v-else style="color: #417095;font-size: 16px;font-weight: bolder;">基本信息</span>
            </el-col>
            <el-col :span="8" style="text-align: right;">
              <span class="base-info">填报人：</span>
              <span style="font-size: 14px;">{{tbMan}}</span>
            </el-col>
            <el-col :span="6" style="text-align: right;">
              <span class="base-info">项目编号：</span>
              <span style="font-size: 14px;">{{pkId}}</span>
            </el-col>
          </template>
        </topTip>
    <!-- 顶部信息END -->
  <div class="info-form top-tip" style="padding-left: 30px;">
    <el-form ref="forms" class="top-tip" :model="form">
      <el-row>
        <el-col :span="20">
      <el-form-item label="项目名称：" label-width="100px" prop="projectName" :rules="{ required: defType, message: '请填写项目名称', trigger: 'blur' }">
        <el-input v-if="lookType === '1'" v-model="form.projectName" placeholder="请输入"></el-input>
        <span v-else>{{form.projectName}}</span>
      </el-form-item>
      </el-col>
      </el-row>
        <el-row>
          <el-col :span="20">
      <el-form-item label="客户名称："  label-width="100px" prop="customerName" :rules="{ required: defType, message: '请填写客户名称', trigger: 'blur' }">
        <el-input v-if="lookType === '1'" v-model="form.customerName" placeholder="请输入"></el-input>
        <span v-else>{{form.customerName}}</span>
      </el-form-item>
      </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="客户联系人："  label-width="100px" prop="customerContacts" :rules="{ required: defType, message: '请填写客户联系人', trigger: 'blur' }">
            <el-input v-if="lookType === '1'" v-model="form.customerContacts" placeholder="请输入"></el-input>
            <span v-else>{{form.customerContacts}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户联系方式："  label-width="100px" prop="customerContactInformation" :rules="{ required: otherType, message: '请填写客户联系方式', trigger: 'blur' }">
            <el-input v-if="lookType === '1'" v-model="form.customerContactInformation" placeholder="请输入"></el-input>
            <span v-else>{{form.customerContactInformation}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户职务："  label-width="100px" prop="customerPost" :rules="{ required: otherType, message: '请填写客户职务', trigger: 'blur' }">
            <el-input v-if="lookType === '1'" v-model="form.customerPost" placeholder="请输入"></el-input>
            <span v-else>{{form.customerPost}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="信息来源方式："  label-width="100px" prop="businessSource" :rules="{ required: otherType, message: '请填写业务来源', trigger: 'change' }">
             <el-select class="select-add" v-if="lookType === '1'" v-model="form.businessSource" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            <span v-else>{{form.businessSource}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="业务类型："  label-width="100px" prop="businessType" :rules="{ required: otherType, message: '请填写业务类型', trigger: 'blur' }">
            <el-input v-if="lookType === '1'" v-model="form.businessType" placeholder="请输入"></el-input>
            <span v-else>{{form.businessType}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
        <el-form-item label="项目意向收费(元)："  label-width="140px" prop="projectEstimate" :rules="{ required: otherType, message: '请填写项目估算', trigger: 'blur' }">
          <!-- <el-input v-if="lookType === '1'" v-model="form.projectEstimate" style="width:83% ;" placeholder="请输入"></el-input> -->
          <money v-if="lookType === '1'" style="width:100%;" :moneys="form.projectEstimate" :type="2" @blurMoney="blurMoney"></money>
          <span v-else>{{form.projectEstimate}}</span>
        </el-form-item>
        </el-col>
        
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="最晚反馈日期："  label-width="100px" prop="feedbackDate" :rules="{ required: otherType, message: '请填写最晚反馈日期', trigger: 'change' }">
            <el-date-picker
            class="date-time"
            value-format="yyyy-MM-dd"
             v-if="lookType === '1'"
              v-model="form.feedbackDate"
              type="date"
              placeholder="选择日期时间">
            </el-date-picker>
            <span v-else>{{form.feedbackDate}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <span  v-if="lookType === '1'" style="color: #797979;font-size: 14px;margin-left:142px">主要由立项管理人填写，请详细描述与客户沟通过程中发现的其他潜在需求</span>
        <el-form-item label="项目概况："  label-width="100px" prop="projectSurvey" :rules="{ required: defType, message: '请填写项目概况', trigger: 'blur' }">
          <el-input v-if="lookType === '1'" v-model="form.projectSurvey"
          type="textarea"
          autosize
          placeholder="请输入内容"></el-input>
          <div v-else style="display: inline-block;white-space: unset;line-height: 30px">{{form.projectSurvey}}</div>
        </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
  </div>
  <!-- 项目基本信息END -->
  <!-- 项目相关附件START -->
  <div>
    <!-- 顶部信息START -->
    <topTip>
      <template>
        <el-col :span="23" style="text-align: left;" class="top-tip">
          <span style="color: #417095;font-size: 16px;font-weight: bolder;">项目相关附件</span>
          <span  v-if="lookType === '1'" style="color: #797979;font-size: 14px;">请预立项申请人上传便于全员了解项目情况的附件</span>
          </el-col>
      </template>
    </topTip>
    <!-- 顶部信息END -->
  <div>
    <el-row style="padding-left: 10px;">
      <el-col :span="1.5" style="text-align: left;margin-left: 20px;font-size: 14px;">
        <span style="text-align: justify;color: #417095; font-weight:700;width: 120px;">项目相关附件：</span>
      </el-col>
      <el-col :span="19" v-if="form.projectFlieList.length > 0" style="text-align: left;">
        <upload  v-if="lookType === '1'" @upload="upload" @delFile="delFileBtn" :fileList="form.projectFlieList">
        </upload>
        <lookFiles
          v-for="(item, i) in form.projectFlieList"
            v-else
            :key="i"
           :fileName="item.fileName"
           :fileId="item.fileId"
           :type="1">
          </lookFiles>
      </el-col>
      <el-col :span="19" v-else style="text-align: left;">
      <span>暂无附件</span>
      </el-col>
    </el-row>
  </div>
  </div>
  <!-- 项目相关附件END -->
  <!-- 需求扩展START -->
  <div>
    <!-- 顶部信息START -->
    <topTip>
      <template>
        <el-col :span="23" style="text-align: left;" class="top-tip">
          <span style="color: #417095;font-size: 16px;font-weight: bolder;">需求扩展</span>
          <span  v-if="lookType === '1'" style="color: #797979;font-size: 14px;">主要由立项申请人填写，请详细描述与客户沟通过程中发现的其他潜在需求</span>
          </el-col>
      </template>
    </topTip>
    <!-- 顶部信息END -->
  <div>
    <el-row>
      <el-col :span="23" style="margin-left: 23px;">
        <el-input v-if="lookType === '1'" v-model="form.demandExpansion"
        type="textarea"
        autosize
        placeholder="请输入内容"></el-input>
      <div v-else style="display: inline-block;white-space: pre-wrap;width: 100%;margin-right: 10px;"><div style="display: inline-block;white-space: pre-wrap;width: 100%;margin-left: 30px;" v-if="form.demandExpansion === '无'">{{form.demandExpansion}}</div><div v-else style="display: inline-block;white-space: pre-wrap;">{{form.demandExpansion}}</div></div>
      </el-col>
    </el-row>
  </div>
  </div>
  <!-- 需求扩展END -->
  <!-- 资源匹配START -->
  <div>
    <!-- 顶部信息START -->
    <topTip>
      <template>
        <el-col :span="23" style="text-align: left;" class="top-tip">
          <span style="color: #417095;font-size: 16px;font-weight: bolder;">资源匹配</span>
          <span  v-if="lookType === '1'" style="color: #797979;font-size: 14px;">主要由立项申请人填写，请填写匹配资源，如人员、资质证明等信息</span>
          </el-col>
      </template>
    </topTip>
    <!-- 顶部信息END -->
  <div>
    <el-row>
      <el-col :span="23" style="margin-left: 23px;">
        <el-input v-if="lookType === '1'" v-model="form.resourceMatching"
        type="textarea"
        autosize
        placeholder="请输入"></el-input>
      <div v-else style="display: inline-block;white-space: pre-wrap;width: 100%;margin-right: 10px;"><div style="display: inline-block;white-space: pre-wrap;width: 100%;margin-left: 30px;" v-if="form.resourceMatching === '无'">{{form.resourceMatching}}</div><div v-else style="display: inline-block;white-space: pre-wrap;">{{form.resourceMatching}}</div></div>
      </el-col>
    </el-row>
  </div>
  </div>
  <!-- 资源匹配END -->
  <!-- 立项信息填写START -->
  <div>
    <!-- 顶部信息START -->
    <topTip>
      <template>
        <el-col :span="23" style="text-align: left;" class="top-tip">
          <span style="color: #417095;font-size: 16px;font-weight: bolder;">竞聘信息填写</span>
          <span  v-if="lookType === '1'" style="color: #797979;font-size: 14px;">立项申请人填写</span>
          </el-col>
      </template>
    </topTip>
    <!-- 顶部信息END -->
  <div class="info-form top-tip">
    <el-form ref="formInfo" class="top-tip" :model="formInfo">
      <el-row style="padding-left:30px;">
        <el-col :span="8">
          <el-form-item label="是否需要竞聘："  label-width="100px" prop="isCompete" :rules="{ required: defType, message: '请填写项目名称', trigger: 'change' }">
            <el-radio-group v-model="formInfo.isCompete" v-if="lookType === '1'" @change="redioChange">
                <el-radio :label="'1'">是</el-radio>
                <el-radio :label="'2'">否</el-radio>
              </el-radio-group>
            <span v-else>{{isCompete}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <div v-if="formInfo.isCompete === '1'">
            <el-form-item label="竞聘截止时间："  label-width="100px" prop="closingDate" :rules="{ required: defTypeYes, message: '请选择竞聘截止时间', trigger: 'blur' }">
             <el-date-picker
             value-format="yyyy-MM-dd HH:mm"
             format="yyyy-MM-dd HH:mm"
              style="width:80%!important ;"
             class="date-time"
              v-if="lookType === '1'"
               v-model="formInfo.closingDate"
               type="datetime"
               placeholder="选择日期时间">
             </el-date-picker>
             <span v-else>{{formInfo.closingDate}}</span>
             </el-form-item>
          </div>
          <div v-else>
            <el-form-item label="指定项目负责人："   label-width="120px" prop="projectPerson" :rules="{ required: defTypeNo, validator: this.checkName, trigger: 'change' }">
                <selectMan  :selectName="formInfo.projectPerson" style="width:80% ;" v-if="lookType === '1'" @choseMan="change">
                </selectMan>
              <span v-else>{{projectPersonData}}</span>
          </el-form-item>
          </div>
        </el-col>
        <el-col :span="8" style="">
          <el-form-item label="内部竞标价格(元)：" class="details-money"  label-width="140px" prop="projectBudget" :rules="{ required: defType, message: '请填写项目预算', trigger: 'blur' }">
            <!-- <el-input v-if="lookType === '1'" style="width:80% ;"placeholder="请输入" v-model="formInfo.projectBudget"></el-input> -->
            <money v-if="lookType === '1'" style="width:83%;" :moneys="formInfo.projectBudget" :type="1" @blurMoney="blurMoney"></money>
            <span v-else>{{formInfo.projectBudget}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="padding-left:30px;">
        <el-col :span="22" v-if="formInfo.isCompete === '1'">
        <el-form-item label="竞聘模板附件：" v-if="formInfo.competeFileList.length>0" label-width="100px" prop="competeFileList" :rules="{ required: otherType, message: '请填写项目概况', trigger: 'blur' }">
          <upload  v-if="lookType === '1'" @upload="jpUpload" @delFile="jpDelFileBtn" :fileList="formInfo.competeFileList">
          </upload>
          <lookFiles
              v-else
            v-for="item in formInfo.competeFileList"
             :fileName="item.fileName"
             :fileId="item.fileId"
             :type="1">
            </lookFiles>
        </el-form-item>
        <el-form-item label="竞聘模板附件：" v-else label-width="100px" prop="competeFileList" :rules="{ required: otherType, message: '请填写项目概况', trigger: 'blur' }">
        <span>暂无附件</span>
        </el-form-item>
        </el-col>
        <el-col v-else>
        <el-form-item label="说明："  label-width="50px" prop="projectPersonRemak"
         :rules="{ required: defTypeNo, message: '请填写说明', trigger: 'blur' }">
          <el-input v-if="lookType === '1'"
           v-model="formInfo.projectPersonRemak"
          type="textarea"
          autosize
          placeholder="请填写不需要竞聘的原因说明">
          </el-input>
          <div v-else style="display: inline-block;white-space: pre-wrap;">{{formInfo.projectPersonRemak}}</div>
        </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
  </div>
  <!-- 立项信息填写END -->
  <!-- 底部按钮START -->
  <!-- 录入人START -->
  <div v-if="lookType === '1' && userinfo.realName === '立项管理员'" style="text-align: center;">
    <el-button class="yt-bottom-btn" :loading="btnLoading" type="primary" @click="allFormCheck('10', 1)">立项</el-button>
    <el-button class="yt-bottom-btn" :loading="btnLoading" @click="allFormCheck('20', 1)">暂不立项</el-button>
    <el-button class="yt-bottom-btn" :loading="btnLoading" @click="resetBtn">取消</el-button>
  </div>
  <!-- 录入人END -->
  <!-- 普通职员START -->
  <div v-else-if="lookType === '1' && userinfo.realName !== '立项管理员'" style="text-align: center;">
    <el-button class="yt-bottom-btn" :loading="btnLoading" type="primary" @click="allFormCheck('0', 2)">{{subName}}</el-button>
    <el-button class="yt-bottom-btn" :loading="btnLoading" @click="resetBtn">取消</el-button>
  </div>
  <!-- 普通职员END -->
  <div v-else-if= "lookType === '2' && needBtn" style="text-align: center;margin:10px 0px 10px 0px;">
    <el-button class="yt-bottom-btn" @click="closeBtn">关闭</el-button>
  </div>
  <!-- 底部按钮END -->
</div>
</template>

<script>
// 金额组件
import money from './money.vue'
// 选人组件
import selectMan from './selectMan.vue'
import lookFiles from './lookFiles.vue'
import topTip from './topTip.vue'
import upload from './upload.vue'
import axios from '../service/http'
import { option } from '../static/config'
export default {
  props: {
    // 判断按钮是否需要等待
    btnLoading: {
      type: Boolean,
      default () {
        return false
      }
    },
    // 父组件传过来的值
    popList: {
      type: Object,
      default () {
        return {}
      }
    },
    // 判断字段验证（1：全部验证；2：部分验证）默认部分
    assembly: {
      type: String,
      default () {
        return '2'
      }
    },
    // 判断是新增还是查看（1：新增；2：查看）默认新增
    lookType: {
      type: String,
      default () {
        return '1'
      }
    },
    // 判断是否修改
    repair: {
      type: String,
      default () {
        return ''
      }
    },
    // 判断是否需要按钮（true：需要；false：不需要
    needBtn: {
      type: Boolean,
      default () {
        return true
      }
    }
  },
  data () {
    return {
      // 改变按钮信息
      subName: '提交',
      // 当前登录人信息
      userinfo: {},
      // 提交状态
      subState: '',
      peopleList: [],
      tbMan: '王海涛  18235412541',
      pkId: '',
      // 查看时显示
      isCompete: '',
      defTypeYes: true,
      defTypeNo: false,
      // 默认有验证
      defType: true,
      // 可以添加验证
      otherType: false,
      form: {
        projectName: '',
        customerName: '',
        customerContacts: '',
        customerContactInformation: '',
        customerPost: '',
        businessSource: '',
        businessType: '',
        feedbackDate: '',
        projectEstimate: '',
        projectSurvey: '',
        demandExpansion: '',
        resourceMatching: '',
        projectFlieList: []
      },
      // projectFlieNewList: [],
      options: [{
        value: '',
        label: '请选择'
      },{
        value: '投标',
        label: '投标'
      }, {
        value: '业务',
        label: '业务'
      }, {
        value: '市场',
        label: '市场'
      }],
      formInfo: {
        isCompete: '1',
        closingDate: '',
        projectPersonRemak: '',
        projectPerson: '',
        projectPersonName: '',
        projectBudget: '',
        competeFileList: []
      },
      projectPersonData: '',
      // competeFileNewList: []
    }
  },
  watch: {
    popList: {
      handler (newVal, oldVal) {
        console.log('新的数据', newVal)
        this.father(newVal)
      }
    },
    btnLoading: {
      handler (newVal, oldVal) {
        this.btnLoading = newVal
      }
    }
  },
  mounted () {
    this.initFun()
  },
  methods: {
    // 初始化
    initFun () {
      // 判断是否需要全部字段验证
      let assembly = this.assembly
      if (assembly === '1') {
        this.defType = true
        this.otherType = true
      } else {
        this.defType = true
        this.otherType = false
      }
      // 判断是查看还是新增
      let lookType = this.lookType
      if (lookType === '2') {
        // 详情
        this.isCompete = (this.formInfo.isCompete === '1' ? '是' : '否')
        this.defType = false
        this.otherType = false
        this.defTypeNo = false
        this.defTypeYes = false
      } else {
        this.getUserInfo()
        // 是否改变按钮信息
        let repair = this.repair
        if (repair !== '') {
          this.subName = '保存'
        } else {
          this.subName = '提交'
        }
        // 新增
        if (assembly === '1') {
          this.defType = true
          this.otherType = true
        } else {
          this.defType = true
          this.otherType = false
        }
        this.defTypeNo = true
        this.defTypeYes = true
      }
    },
    // 获取金额
    blurMoney (moneyMap) {
      if (moneyMap.type === 1) {
        this.formInfo.projectBudget = moneyMap.money
      } else {
        this.form.projectEstimate = moneyMap.money
      }
    },
    // 金额格式化
    moneysFlter (money, type) {
      let newMoneys
      let numList
      // 判断是否输入的数字
      let testMoney = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g
      if (type === '2') {
        // 详情
        if (money) {
          if (testMoney.test(money)) {
            money = Number(money)
            money = (money.toFixed(2) + '').replace(
            /\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,
            '$&,'
            )
            if (money.indexOf('.') !== -1) {
              // 有小数
              numList = money.split('.')
              numList[1] = numList[1].replace(',', '')
              newMoneys = numList[0] + '.' + numList[1]
            } else {
              newMoneys = numMoney
            }
            return newMoneys
          }
        } else {
          return ''
        }
      } else {
        return money
      }
    },
    // 验证项目负责人
    checkName (rule, value, callback) {
      if (value === '') {
        callback('请指定项目负责人')
      } else {
        callback()
      }
    },
    // 指定项目负责人
    change (item) {
      this.formInfo.projectPerson = item.userItcode
      this.formInfo.projectPersonName = item.userName
      // this.$refs.formInfo.validateField('projectPersonName')
    },
    // 获取当前登录人
    getUserInfo () {
      axios.post(option.base_path + 'index/getCurrentUserInfo').then(res => {
        this.userinfo = res.data.data
        this.tbMan = res.data.data.realName + '  ' + res.data.data.userPhone
        console.log(res.data);
      })
    },
    // 判断父组件是否传值
    father (newVal) {
      // 是否查看
      let lookType = this.lookType
      let fatherVal = newVal
      // 项目附件
      let projectFlieList = []
      // 竞聘附件
      let competeFileList = []
      if (fatherVal.pkId && fatherVal.pkId !== '') {
        this.tbMan = fatherVal.createUserName + fatherVal.createPhone
        this.pkId = fatherVal.pkId
        this.form.projectName = fatherVal.projectName
        this.form.customerName = fatherVal.customerName
        this.form.customerContacts = fatherVal.customerContacts
        if (lookType === '1') {
          // 修改
          this.form.customerContactInformation = fatherVal.customerContactInformation
          this.form.customerPost = fatherVal.customerPost
          this.form.businessSource = fatherVal.businessSource
          this.form.businessType = fatherVal.businessType
          this.form.feedbackDate = fatherVal.feedbackDate
          this.form.projectEstimate = this.moneysFlter(fatherVal.projectEstimate, '2')
          this.form.demandExpansion = fatherVal.demandExpansion
          this.form.resourceMatching = fatherVal.resourceMatching
        } else {
          // 查看
          this.form.customerContactInformation = (fatherVal.customerContactInformation === '' ? '--': fatherVal.customerContactInformation)
          this.form.customerPost = (fatherVal.customerPost === '' ? '--': fatherVal.customerPost)
          this.form.businessSource = (fatherVal.businessSource === '' ? '--': fatherVal.businessSource)
          this.form.businessType = (fatherVal.businessType === '' ? '--': fatherVal.businessType)
          this.form.feedbackDate = (fatherVal.feedbackDate === '' ? '--': fatherVal.feedbackDate)
          this.form.projectEstimate = (fatherVal.projectEstimate === '' ? '--': this.moneysFlter(fatherVal.projectEstimate, '2'))
          this.form.demandExpansion = (fatherVal.demandExpansion === '' ? '无': fatherVal.demandExpansion)
          this.form.resourceMatching = (fatherVal.resourceMatching === '' ? '无': fatherVal.resourceMatching)
        }
        this.form.projectSurvey = fatherVal.projectSurvey
        // this.form.projectFlieList = fatherVal.projectFlieList
        if (fatherVal.projectFlieList.length > 0) {

          this.form.projectFlieList = []
          fatherVal.projectFlieList.forEach(n =>{
            for (let k in n) {
              if (k === 'fileName') {
                n['name'] = n[k]
              }
            }
            // this.form.projectFlieList.push(n)
            projectFlieList.push(n)
          })
            this.form.projectFlieList = this.forSet(projectFlieList)
        }
        this.formInfo.isCompete = fatherVal.isCompete
        this.isCompete = (fatherVal.isCompete === '1' ? '是' : '否')
        this.formInfo.closingDate = fatherVal.closingDate.substring(0, 16)
        this.formInfo.projectPerson = fatherVal.projectPerson
        this.formInfo.projectPersonName = fatherVal.projectPersonName
        this.projectPersonData = fatherVal.projectPersonName + fatherVal.projectPersonPhone
        this.formInfo.projectBudget = this.moneysFlter(fatherVal.projectBudget, '2')
        // this.formInfo.competeFileList = fatherVal.competeFileList
        if (fatherVal.competeFileList.length > 0) {
          this.formInfo.competeFileList = []
          fatherVal.competeFileList.forEach(n =>{
            for (let k in n) {
              if (k === 'fileName') {
                n['name'] = n[k]
              }
            }
            competeFileList.push(n)
          })
            this.formInfo.competeFileList = this.forSet(competeFileList)
        }
        // this.competeFileNewList.toArrA
        this.formInfo.projectPersonRemak = fatherVal.projectPersonRemak + ''
      }
    },
    // 删除附件
    delFileBtn (fileList) {
      this.form.projectFlieList = this.forSet(fileList)
    },
    // 竞聘删除附件
    jpDelFileBtn (fileList) {
      this.formInfo.competeFileList = this.forSet(fileList)
    },
    // 上传附件
    upload (file) {
      this.form.projectFlieList = this.forSet(file)
    },
    // 竞聘上传附件
    jpUpload (file) {
      this.formInfo.competeFileList = this.forSet(file)
    },
    // 是否需要竞聘改变事件
    redioChange (num) {
      // this.$refs.forms.resetFields()
      this.$refs.formInfo.resetFields()
      if (num === '1') {
        this.peopleList = []
        this.defTypeYes = true
        this.defTypeNo = false
      } else {
        this.subState = '50'
        this.defTypeYes = false
        this.defTypeNo = true
      }
      this.formInfo.isCompete = num
    },
    // 所有表单验证
    allFormCheck (type, num) {
      // type：10，立项 20暂不立项
      let subState = this.subState
      if (subState === '50' && type === '20' && num === 1) {
        subState = '20'
      } else if (subState === '50' && type === '10' && num === 1) {
        subState = '50'
      } else {
        subState = type
      }
      // 是否通过验证、
      let checked
      let d1 = new Promise((resolve, reject) => {
        this.$refs.forms.validate(n => {
          if (n) {
            resolve()
          } else {
            reject(new Error('验证失败'))
          }
        })
      })
      let d2 = new Promise((resolve, reject) => {
        this.$refs.formInfo.validate(n => {
          if (n) {
            resolve()
          } else {
            reject(new Error('验证失败'))
          }
        })
      })
      Promise.all([d1, d2]).then(() => {
        checked = true
        let dataMap = {
          tbMan: this.tbMan,
          pkId: this.pkId,
          type: subState,
          form: this.form,
          formInfo: this.formInfo,
          check: checked
        }
        console.log(dataMap)
        this.$emit('check', dataMap)
      }).catch(() => {
        checked = false
      })
    },
    // 循环设置
    forSet (list) {
      let newList = []
      list.forEach(n => {
        let map = {
          fileId: n.fileId,
          fileName: n.fileName,
          name: n.fileName
        }
        newList.push(map)
      })
      return newList
    },
    // 取消按钮
    resetBtn () {
      this.$confirm('当前页面的数据已修改，确定离开吗？离开后页面数据将不会保存！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs.forms.resetFields()
        this.$refs.formInfo.resetFields()
        this.$emit('resetForm')
      }).catch(() => {
      })
    },
    // 关闭按钮
    closeBtn () {
      this.$emit('close')
    }
  },
  components: {
    upload,
    topTip,
    lookFiles,
    selectMan,
    money
  }
}
</script>

<style>
  .el-form-item__content {
    text-align: left;
  }
.details-page-componets .el-form .el-form-item label:after {
    content: " ";
    display: inline-block;
    width: 100%;
}
.details-page-componets .el-form .el-form-item {
    margin-bottom: 0px;
}
.details-page-componets .el-form-item__content span{
  line-height:40px;
}
.details-page-componets .el-form-item__label {
  height: 40px;
}
.details-page-componets .el-form .el-form-item__label {
    text-align: justify;
    color: #417095;
    font-weight:700;
}
/* 这里去除必选字段的*,这个符号会造成一定影响,去掉之后我用了li列表进行定位,在前面加上" * ". */
.details-page-componets .el-form .el-form-item.is-required .el-form-item__label:before {
    content: none !important;
}
.select-add,
.date-time {
  width: 100% !important;
}
.base-info {
  color: #417095;
  font-size: 14px;
  font-weight: bolder;
}
.el-col {
  line-height: 26px;
}
.aa {
  /* line-height: 30px; */
  /* border-bottom: 1px solid #A0B7CA; */
   background: url(../assets/images/common/form-icons.png) no-repeat -1px -10px;
   padding-left: 40px;
   float: left;
   height: 27px;
   /* margin: 20px 0px; */
}
.top-line {/*
  border-bottom: 1px solid #417095;
  margin-left: 21px;;
  margin-bottom: 5px;
 */}
</style>

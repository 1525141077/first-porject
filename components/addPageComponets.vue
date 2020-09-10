<template>
  <!--
  @check: 验证按钮
  @resetForm： 取消按钮
@close： 关闭按钮
  -->
  <div class="add-page-componets" style>
    <!-- 项目基本信息START -->
    <div>
      <!-- 顶部信息START -->
      <topTip>
        <template>
          <el-col :span="8" style="text-align: left;" class="top-tip">
            <div v-if="lookType === '1'">
              <span style="color: #417095;font-size: 16px;font-weight: bolder;">请填写项目基本信息</span>
              <span style="color: #797979;font-size: 14px;">预立项申请人填写</span>
            </div>
            <span v-else style="color: #417095;font-size: 16px;font-weight: bolder;">基本信息</span>
          </el-col>
          <el-col :span="6" style="text-align: right;">
            <span class="base-info">填报人：</span>
            <span style="font-size: 14px;">{{tbMan}}</span>
          </el-col>
          <el-col :span="7" style="text-align: right;">
            <span class="base-info">项目编号：</span>
            <span v-if="pkId === ''" style="color: #797979;font-size: 14px;">提交后自动生成</span>
            <span style="font-size: 14px;">{{pkId}}</span>
          </el-col>
        </template>
      </topTip>
      <!-- 顶部信息END -->
      <div style="padding-right:22px;" class="bases-info" ref="baseInfo">
        <el-form ref="forms" :model="form" label-position="right">
          <el-form-item
            label="项目名称："
            label-width="140px"
            prop="projectName"
            :rules="{ required: defType, message: '请填写项目名称', trigger: 'blur' }"
          >
            <el-input v-if="lookType === '1'" v-model="form.projectName" placeholder="请输入"></el-input>
            <span v-else>{{form.projectName}}</span>
          </el-form-item>
          <el-form-item
            label="客户名称："
            label-width="140px"
            prop="customerName"
            :rules="{ required: defType, message: '请填写客户名称', trigger: 'blur' }"
          >
            <el-autocomplete
              v-if="lookType === '1'"
              class="inline-input"
              v-model="form.customerName"
              placeholder="请输入"
              :fetch-suggestions="getCustomerNameList"
              :trigger-on-focus="false"
              @select="handleSelect"
            ></el-autocomplete>
            <div v-if="lookType === '1'" v-show="haveCustomerName" style="color: #F56C6C;font-size: 12px;line-height: 1;padding-top: 4px;position: absolute;top: 100%;left: 0;">该客户已存在，请选择</div>
            <span v-else>{{form.customerName}}</span>
          </el-form-item>
          <el-row>
            <el-col :span="8">
              <el-form-item
                label="客户联系人："
                label-width="140px"
                prop="customerContacts"
                :rules="{ required: defType, message: '请填写客户联系人', trigger: 'blur' }"
              >
                <!-- <el-input v-if="lookType === '1'" v-model="form.customerContacts" placeholder="请输入"></el-input> -->
                <el-autocomplete
                  v-if="lookType === '1'"
                  class="inline-input"
                  v-model="form.customerContacts"
                  :fetch-suggestions="querySearch"
                  placeholder="请输入"
                  :trigger-on-focus="false"
                  @select="handleSelectmanList"
                ></el-autocomplete>
                <span v-else>{{form.customerContacts}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8" style="padding-left: 26px;">
              <el-form-item
                label="客户联系方式："
                label-width="125px"
                prop="customerContactInformation"
                :rules="{ required: otherType, message: '请填写客户联系方式', trigger: 'blur' }"
              >
                <el-input
                  v-if="lookType === '1'"
                  v-model="form.customerContactInformation"
                  placeholder="请输入"
                ></el-input>
                <span v-else>{{form.customerContactInformation}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8" style="padding-left: 62px;">
              <el-form-item
                label="客户职务："
                label-width="120px"
                prop="customerPost"
                :rules="{ required: otherType, message: '请填写客户职务', trigger: 'blur' }"
              >
                <el-input v-if="lookType === '1'" v-model="form.customerPost" placeholder="请输入"></el-input>
                <span v-else>{{form.customerPost}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item
                label="信息来源方式："
                label-width="140px"
                prop="businessSource"
                :rules="{ required: otherType, message: '请填写业务来源', trigger: 'change' }"
              >
                <el-select
                  class="select-add"
                  v-if="lookType === '1'"
                  v-model="form.businessSource"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <span v-else>{{form.businessSource}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8" style="padding-left: 26px;">
              <el-form-item
                label="业务类型："
                label-width="125px"
                prop="businessType"
                :rules="{ required: otherType, message: '请填写业务类型', trigger: 'blur' }"
              >
                <el-input v-if="lookType === '1'" v-model="form.businessType" placeholder="请输入"></el-input>
                <span v-else>{{form.businessType}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8" style="padding-left: 62px;">
              <el-form-item
                label="项目类型："
                label-width="122px"
                prop="projectType"
                :rules="{ required: defType, message: '请选择项目类型', trigger: 'change' }"
              >
                <!-- <el-input v-if="lookType === '1'" v-model="form.projectEstimate" style="width:83% ;" placeholder="请输入"></el-input> -->
                <el-select
                  class="select-add"
                  v-if="lookType === '1'"
                  v-model="form.projectType"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in projectTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <span v-else>{{form.projectTypeName}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item
                label="最晚反馈日期："
                label-width="144px"
                prop="feedbackDate"
                :rules="{ required: otherType, message: '请填写最晚反馈日期', trigger: 'change' }"
              >
                <el-date-picker
                  class="date-time"
                  value-format="yyyy-MM-dd"
                  v-if="lookType === '1'"
                  v-model="form.feedbackDate"
                  type="date"
                  placeholder="客户期望反馈的日期"
                ></el-date-picker>
                <span v-else>{{form.feedbackDate}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8" style="padding-left: 62px;">
              <el-form-item
                label="项目意向收费(元)："
                label-width="122px"
                prop="projectEstimate"
                :rules="{ required: otherType, message: '请填写项目估算', trigger: 'blur' }"
              >
                <!-- <el-input v-if="lookType === '1'" v-model="form.projectEstimate" style="width:83% ;" placeholder="请输入"></el-input> -->
                <money
                  v-if="lookType === '1'"
                  style="width:100% ;"
                  :moneys="form.projectEstimate"
                  :type="2"
                  @blurMoney="blurMoney"
                ></money>
                <span v-else>{{form.projectEstimate}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <!-- <span  v-if="lookType === '1'" style="color: #797979;font-size: 14px;margin-left:142px">主要由立项管理人填写，请详细描述与客户沟通过程中发现的其他潜在需求</span> -->
              <el-form-item
                label="项目概况："
                label-width="140px"
                prop="projectSurvey"
                :rules="{ required: defType, message: '请填写项目概况', trigger: 'blur' }"
              >
                <el-input
                  v-if="lookType === '1'"
                  v-model="form.projectSurvey"
                  type="textarea"
                  autosize
                  placeholder="请填写项目概况，包括：项目需求概述、项目目的、项目成果用途、项目周期等信息"
                ></el-input>
                <div
                  v-else
                  style="display: inline-block;white-space: pre-wrap;"
                >{{form.projectSurvey}}</div>
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
            <span
              v-if="lookType === '1'"
              style="color: #797979;font-size: 14px;"
            >请预立项申请人上传便于全员了解项目情况的附件</span>
          </el-col>
        </template>
      </topTip>
      <!-- 顶部信息END -->
      <div style="padding-right:20px;">
        <el-form>
          <el-form-item label="项目相关附件：" label-width="144px">
            <upload
              v-if="lookType === '1'"
              @upload="upload"
              @delFile="delFileBtn"
              :fileList="form.projectFlieList"
            ></upload>
            <lookFiles
              v-for="item in form.projectFlieList"
              v-else
              :fileName="item.fileName"
              :fileId="item.fileId"
              :type="1"
            ></lookFiles>
          </el-form-item>
        </el-form>
        <!-- <el-col :span="1" style="text-align: left;margin-left: 20px;font-size: 14px;">
        项目相关附件：
      </el-col>
      <el-col :span="19" style="text-align: left;margin-left: 10px;">
        <upload  v-if="lookType === '1'" @upload="upload" @delFile="delFileBtn" :fileList="form.projectFlieList">
        </upload>
        <lookFiles
          v-for="item in form.projectFlieList"
            v-else
           :fileName="item.fileName"
           :fileId="item.fileId"
           :type="1">
          </lookFiles>
        </el-col>-->
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
            <span
              v-if="lookType === '1'"
              style="color: #797979;font-size: 14px;"
            >主要由立项申请人填写，请详细描述与客户沟通过程中发现的其他潜在需求</span>
          </el-col>
        </template>
      </topTip>
      <!-- 顶部信息END -->
      <div>
        <el-row>
          <el-col :span="23" style="margin-left: 23px;">
            <el-input
              v-if="lookType === '1'"
              v-model="form.demandExpansion"
              type="textarea"
              autosize
              placeholder="请输入"
            ></el-input>
            <div
              v-else
              style="display: inline-block;white-space: pre-wrap;"
            >{{form.demandExpansion}}</div>
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
            <span
              v-if="lookType === '1'"
              style="color: #797979;font-size: 14px;"
            >主要由立项申请人填写，请填写匹配资源，如人员、资质证明等信息</span>
          </el-col>
        </template>
      </topTip>
      <!-- 顶部信息END -->
      <div ref="topInfo">
        <el-row>
          <el-col :span="23" style="margin-left: 23px;">
            <el-input
              v-if="lookType === '1'"
              v-model="form.resourceMatching"
              type="textarea"
              autosize
              placeholder="请输入"
            ></el-input>
            <div
              v-else
              style="display: inline-block;white-space: pre-wrap;"
            >{{form.resourceMatching}}</div>
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
            <span v-if="lookType === '1'" style="color: #797979;font-size: 14px;">立项申请人填写</span>
          </el-col>
        </template>
      </topTip>
      <!-- 顶部信息END -->
      <div style="padding-right:20px;">
        <el-form ref="formInfo" :model="formInfo">
          <el-form-item
            label="是否需要竞聘："
            label-width="140px"
            prop="isCompete"
            :rules="{ required: changeType, message: '请填写项目名称', trigger: 'change' }"
          >
            <el-radio-group
              v-model="formInfo.isCompete"
              v-if="lookType === '1'"
              @change="redioChange"
            >
              <el-radio :label="'1'">是</el-radio>
              <el-radio :label="'2'">否</el-radio>
            </el-radio-group>
            <span v-else>{{isCompete}}</span>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <div v-if="formInfo.isCompete === '1'">
                <el-form-item
                  label="竞聘截止时间："
                  label-width="140px"
                  prop="closingDate"
                  :rules="{ required: defTypeYes, message: '请选择竞聘截止时间', trigger: 'blur' }"
                >
                  <el-date-picker
                    value-format="yyyy-MM-dd HH:mm"
                    format="yyyy-MM-dd HH:mm"
                    style="width:80%!important ;"
                    class="date-time"
                    v-if="lookType === '1'"
                    v-model="formInfo.closingDate"
                    type="datetime"
                    placeholder="选择日期时间"
                  ></el-date-picker>
                  <span v-else>{{formInfo.closingDate}}</span>
                </el-form-item>
              </div>
              <div v-else>
                <el-form-item
                  label="指定项目负责人："
                  label-width="140px"
                  prop="projectPerson"
                  :rules="{ required: defTypeNo, validator: this.checkName, trigger: 'change' }"
                >
                  <selectMan
                    :selectName="projectPersonData"
                    style="width:100% ;"
                    v-if="lookType === '1'"
                    @choseMan="change"
                  ></selectMan>
                  <span v-else>{{formInfo.projectPersonName}}</span>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="内部竞标价格(元)："
                label-width="180px"
                prop="projectBudget"
                :rules="{ required: changeType, message: '请填写项目预算', trigger: 'blur' }"
              >
                <!-- <el-input v-if="lookType === '1'" style="width:80% ;"placeholder="请输入" v-model="formInfo.projectBudget"></el-input> -->
                <money
                  v-if="lookType === '1'"
                  style="width:100%;"
                  :moneys="formInfo.projectBudget"
                  :type="1"
                  @blurMoney="blurMoney"
                ></money>
                <span v-else>{{formInfo.projectBudget}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col v-if="formInfo.isCompete === '1'">
              <el-form-item
                label="竞聘模板附件："
                label-width="140px"
                prop="competeFileList"
                :rules="{ required: otherType, message: '请填写项目概况', trigger: 'blur' }"
              >
                <upload
                  v-if="lookType === '1'"
                  @upload="jpUpload"
                  @delFile="jpDelFileBtn"
                  :fileList="formInfo.competeFileList"
                ></upload>
                <lookFiles
                  v-else
                  v-for="item in formInfo.competeFileList"
                  :fileName="item.fileName"
                  :fileId="item.fileId"
                  :type="1"
                ></lookFiles>
              </el-form-item>
            </el-col>
            <el-col v-else>
              <el-form-item
                label="说明："
                label-width="140px"
                prop="projectPersonRemak"
                :rules="{ required: defTypeNo, message: '请填写说明', trigger: 'blur' }"
              >
                <el-input
                  v-if="lookType === '1'"
                  v-model="formInfo.projectPersonRemak"
                  type="textarea"
                  autosize
                  placeholder="请填写不需要竞聘的原因说明"
                ></el-input>
                <div
                  v-else
                  style="display: inline-block;white-space: pre-wrap;"
                >{{formInfo.projectPersonRemak}}</div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <!-- 立项信息填写END -->
    <!-- 底部按钮START -->
    <!-- 录入人START -->
    <div
      v-if="lookType === '1' && isLx === false && (repair === '0'|| repair === '' || repair === '20')"
      style="text-align: center;"
    >
      <el-button
        class="yt-bottom-btn"
        :loading="btnLoading"
        type="primary"
        @click="allFormCheck('10', 1)"
      >立项</el-button>
      <el-button class="yt-bottom-btn" :loading="btnLoading" @click="allFormCheck('20', 1)">暂不立项</el-button>
      <el-button class="yt-bottom-btn" :loading="btnLoading" @click="resetBtn">取消</el-button>
    </div>
    <!-- 录入人END -->
    <!-- 普通职员START -->
    <div
      v-else-if="lookType === '1' && isLx === true || (repair !== '0' && repair !== '20')"
      style="text-align: center;"
    >
      <el-button
        class="yt-bottom-btn"
        :loading="btnLoading"
        type="primary"
        @click="allFormCheck('0', 2)"
      >{{subName}}</el-button>
      <el-button class="yt-bottom-btn" :loading="btnLoading" @click="resetBtn">取消</el-button>
    </div>
    <!-- 普通职员END -->
    <div v-else-if="lookType === '2' && needBtn" style="text-align: center;">
      <el-button class="yt-bottom-btn" @click="closeBtn">关闭</el-button>
    </div>
    <!-- 底部按钮END -->
  </div>
</template>

<script>
// 金额组件
import money from "./money.vue";
// 选人组件
import selectMan from "./selectMan.vue";
import lookFiles from "./lookFiles.vue";
import topTip from "./topTip.vue";
import upload from "./upload.vue";
import axios from "../service/http";
import { option } from "../static/config";
import { isEqual } from "../static/ojebctjs";
export default {
  props: {
    // 判断按钮是否需要等待
    btnLoading: {
      type: Boolean,
      default() {
        return false;
      },
    },
    // 父组件传过来的值
    popList: {
      type: Object,
      default() {
        return {};
      },
    },
    // 判断字段验证（1：全部验证；2：部分验证）默认部分
    assembly: {
      type: String,
      default() {
        return "2";
      },
    },
    // 判断是新增还是查看（1：新增；2：查看）默认新增
    lookType: {
      type: String,
      default() {
        return "1";
      },
    },
    // 判断是否修改
    repair: {
      type: String,
      default() {
        return "";
      },
    },
    // 判断是否需要按钮（true：需要；false：不需要
    needBtn: {
      type: Boolean,
      default() {
        return true;
      },
    },
  },
  data() {
    return {
      haveCustomerName:false,//提示信息部分
      // 是否修改了数据
      isNo: false,
      // 当前列表状态
      listState: "",
      // 改变按钮信息
      subName: "提交",
      // 当前登录人信息
      userinfo: {},
      // 提交状态
      subState: "",
      peopleList: [],
      tbMan: "王海涛  18235412541",
      pkId: "",
      // 查看时显示
      isCompete: "",
      defTypeYes: true,
      defTypeNo: false,
      changeType: false,
      // 默认有验证
      defType: true,
      // 可以添加验证
      otherType: false,
      form: {
        projectName: "",
        customerName: "",
        customerContacts: "",
        customerContactInformation: "",
        customerPost: "",
        businessSource: "",
        businessType: "",
        feedbackDate: "",
        projectEstimate: "",
        projectSurvey: "",
        demandExpansion: "",
        resourceMatching: "",
        projectFlieList: [],
        projectType: '',
        projectTypeName: ''
      },
      // projectFlieNewList: [],
      options: [
        {
          value: "",
          label: "请选择",
        },
        {
          value: "投标",
          label: "投标",
        },
        {
          value: "业务",
          label: "业务",
        },
        {
          value: "市场",
          label: "市场",
        },
        {
          value: "其他",
          label: "其他",
        },
      ],
      projectTypeOptions: [
        {
          value: "",
          label: "请选择",
        },
        {
          value: "1",
          label: "市场项目",
        },
        {
          value: "2",
          label: "研发项目",
        }
      ],
      formInfo: {
        isCompete: "1",
        closingDate: "",
        projectPersonRemak: "",
        projectPerson: "",
        projectPersonName: "",
        projectPersonPhone: "",
        projectBudget: "",
        competeFileList: [],
      },
      projectPersonData: "",
      isLx: false,
      jpManList: [],
      // competeFileNewList: []
    };
  },
  watch: {
    repair: {
      handler(newVal, oldVal) {
        this.repair = newVal;
      },
    },
    popList: {
      handler(newVal, oldVal) {
        console.log("新的数据", newVal);
        this.father(newVal);
      },
    },
    btnLoading: {
      handler(newVal, oldVal) {
        this.btnLoading = newVal;
      },
    },
  },
  mounted() {
    window.addEventListener("scroll", this.scrollEven(), true);
    this.initFun();
  },
  methods: {
    // 滚动条事件
    scrollEven() {
      let scrollX = this.$refs.baseInfo.scrollTop;
      console.log("滚动条", scrollX);
    },
    // 初始化
    initFun() {
      // 判断是否需要全部字段验证
      let assembly = this.assembly;
      if (assembly === "1") {
        this.defType = true;
        this.otherType = true;
      } else {
        this.defType = true;
        this.otherType = false;
      }
      // 判断是查看还是新增
      let lookType = this.lookType;
      if (lookType === "2") {
        // 详情
        this.isCompete = this.formInfo.isCompete === "1" ? "是" : "否";
        this.defType = false;
        this.changeType = false;
        this.otherType = false;
        this.defTypeNo = false;
        this.defTypeYes = false;
      } else {
        this.getUserInfo();
        // 是否改变按钮信息
        let repair = this.repair;
        if (repair !== "") {
          this.subName = "保存";
        } else {
          this.subName = "提交";
        }
        // 新增
        if (assembly === "1") {
          this.defType = true;
          this.otherType = true;
        } else {
          this.defType = true;
          this.otherType = false;
        }
      }
    },
    // 获取金额
    blurMoney(moneyMap) {
      if (moneyMap.type === 1) {
        this.formInfo.projectBudget = moneyMap.money;
      } else {
        this.form.projectEstimate = moneyMap.money;
      }
    },
    // 金额格式化
    moneysFlter(money, type) {
      let newMoneys;
      let numList;
      // 判断是否输入的数字
      let testMoney = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g;
      if (type === "2") {
        // 详情
        if (money) {
          if (testMoney.test(money)) {
            money = money.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,");
            if (money.indexOf(".") !== -1) {
              // 有小数
              numList = money.split(".");
              numList[1] = numList[1].replace(/\,/g, "");
              newMoneys = numList[0] + "." + numList[1];
            } else {
              newMoneys = money;
            }
            return newMoneys;
          }
        } else {
          return "";
        }
      } else {
        return money;
      }
    },
    // 验证项目负责人
    checkName(rule, value, callback) {
      if (value === "") {
        if (this.defTypeNo === true) {
          callback("请指定项目负责人");
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    // 指定项目负责人
    change(item) {
      this.formInfo.projectPerson = item.userItcode;
      this.formInfo.projectPersonName = item.userName;
      this.formInfo.projectPersonPhone = item.userPhone;
      this.projectPersonData = item.userName + item.userPhone;
      // this.$refs.formInfo.validateField('projectPersonName')
    },
    // 获取当前登录人
    getUserInfo() {
      axios.post(option.base_path + "index/getCurrentUserInfo").then((res) => {
        this.userinfo = res.data.data;
        if (res.data.data.rodNames.indexOf(",立项管理员,") === -1) {
          // 非立项管理人
          this.isLx = true;
          this.changeType = false;
          this.defTypeNo = false;
          this.defTypeYes = false;
        } else {
          this.changeType = true;
          this.defTypeNo = false;
          this.defTypeYes = true;
        }
        this.tbMan = res.data.data.realName + "  " + res.data.data.userPhone;
        console.log(res.data);
      });
    },
    // 判断父组件是否传值
    father(newVal) {
      // 是否查看
      let lookType = this.lookType;
      // 修改时是否立项
      let listType = this.$route.query.state;
      let fatherVal = newVal;
      // 项目附件
      let projectFlieList = [];
      // 竞聘附件
      let competeFileList = [];
      if (fatherVal.pkId && fatherVal.pkId !== "") {
        this.tbMan = fatherVal.createUserName + fatherVal.createPhone;
        this.pkId = fatherVal.pkId;
        this.form.projectName = fatherVal.projectName;
        this.form.customerName = fatherVal.customerName;
        this.form.customerContacts = fatherVal.customerContacts;
        if (lookType === "1") {
          if (listType === "10") {
            this.changeType = true;
            if (fatherVal.isCompete === "1") {
              this.defTypeNo = false;
              this.defTypeYes = true;
            } else {
              this.defTypeNo = true;
              this.defTypeYes = false;
            }
          }
          // 修改
          this.form.customerContactInformation =
            fatherVal.customerContactInformation;
          this.form.customerPost = fatherVal.customerPost;
          this.form.businessSource = fatherVal.businessSource;
          this.form.businessType = fatherVal.businessType;
          this.form.feedbackDate = fatherVal.feedbackDate;
          this.form.projectEstimate = this.moneysFlter(
            fatherVal.projectEstimate,
            lookType
          );
          this.form.demandExpansion = fatherVal.demandExpansion;
          this.form.resourceMatching = fatherVal.resourceMatching;
        } else {
          // 查看
          this.form.customerContactInformation =
            fatherVal.customerContactInformation === ""
              ? "--"
              : fatherVal.customerContactInformation;
          this.form.customerPost =
            fatherVal.customerPost === "" ? "--" : fatherVal.customerPost;
          this.form.businessSource =
            fatherVal.businessSource === "" ? "--" : fatherVal.businessSource;
          this.form.businessType =
            fatherVal.businessType === "" ? "--" : fatherVal.businessType;
          this.form.feedbackDate =
            fatherVal.feedbackDate === "" ? "--" : fatherVal.feedbackDate;
          this.form.projectEstimate =
            fatherVal.projectEstimate === ""
              ? "--"
              : this.moneysFlter(fatherVal.projectEstimate, lookType);
          this.form.demandExpansion =
            fatherVal.demandExpansion === "" ? "无" : fatherVal.demandExpansion;
          this.form.resourceMatching =
            fatherVal.resourceMatching === ""
              ? "无"
              : fatherVal.resourceMatching;
        }
        this.form.projectSurvey = fatherVal.projectSurvey;
        // this.form.projectFlieList = fatherVal.projectFlieList
        if (fatherVal.projectFlieList.length > 0) {
          this.form.projectFlieList = [];
          fatherVal.projectFlieList.forEach((n) => {
            for (let k in n) {
              if (k === "fileName") {
                n["name"] = n[k];
              }
            }
            // this.form.projectFlieList.push(n)
            projectFlieList.push(n);
          });
          this.form.projectFlieList = this.forSet(projectFlieList);
        }
        this.formInfo.isCompete = fatherVal.isCompete;
        this.isCompete = fatherVal.isCompete === "1" ? "是" : "否";
        this.formInfo.closingDate = fatherVal.closingDate.substring(0, 16);
        this.formInfo.projectPerson = fatherVal.projectPerson;
        this.formInfo.projectPersonName = fatherVal.projectPersonName;
        this.formInfo.projectPersonPhone = fatherVal.projectPersonPhone;
        this.projectPersonData =
          fatherVal.projectPersonName + fatherVal.projectPersonPhone;
        this.formInfo.projectBudget = this.moneysFlter(
          fatherVal.projectBudget,
          this.lookType
        );
        // this.formInfo.competeFileList = fatherVal.competeFileList
        if (fatherVal.competeFileList.length > 0) {
          this.formInfo.competeFileList = [];
          fatherVal.competeFileList.forEach((n) => {
            for (let k in n) {
              if (k === "fileName") {
                n["name"] = n[k];
              }
            }
            competeFileList.push(n);
          });
          this.formInfo.competeFileList = this.forSet(competeFileList);
        }
        // this.competeFileNewList.toArrA
        this.formInfo.projectPersonRemak = fatherVal.projectPersonRemak + "";
      }
    },
    // 删除附件
    delFileBtn(fileList) {
      this.form.projectFlieList = this.forSet(fileList);
    },
    // 竞聘删除附件
    jpDelFileBtn(fileList) {
      this.formInfo.competeFileList = this.forSet(fileList);
    },
    // 上传附件
    upload(file) {
      this.form.projectFlieList = this.forSet(file);
    },
    // 竞聘上传附件
    jpUpload(file) {
      this.formInfo.competeFileList = this.forSet(file);
    },
    // 是否需要竞聘改变事件
    redioChange(num) {
      if (this.$route.query.state === "10") {
        this.$confirm(
          "“是否需要竞聘”的更改，很可能造成已生成竞聘结果的改变，是否继续？",
          "提示",
          {
            cancelButtonText: "取消",
            confirmButtonText: "确认",
            type: "warning",
          }
        )
          .then(() => {
            this.formInfo.closingDate = "";
            this.formInfo.projectPerson = "";
            this.formInfo.projectPersonName = "";
            this.formInfo.projectPersonPhone = "";
            this.projectPersonData = "";
            // this.$refs.forms.resetFields()
            this.$refs.formInfo.resetFields();
            if (this.isLx) {
              // 非立项管理人
              if (num === "1") {
                this.peopleList = [];
                this.subState = "10";
                this.defTypeYes = true;
                this.defTypeNo = false;
              } else {
                this.subState = "50";
                this.defTypeYes = false;
                this.defTypeNo = true;
              }
              this.changeType = true;
            } else {
              this.changeType = true;
              if (num === "1") {
                this.subState = "10";
                this.peopleList = [];
                this.defTypeYes = true;
                this.defTypeNo = false;
              } else {
                this.subState = "50";
                this.defTypeYes = false;
                this.defTypeNo = true;
              }
            }
            this.formInfo.isCompete = num;
          })
          .catch(() => {
            if (num === "2") {
              this.formInfo.isCompete = "1";
            } else {
              this.formInfo.isCompete = "2";
            }
          });
      } else {
        this.formInfo.closingDate = "";
        this.formInfo.projectPerson = "";
        this.formInfo.projectPersonName = "";
        this.formInfo.projectPersonPhone = "";
        this.projectPersonData = "";
        // this.$refs.forms.resetFields()
        this.$refs.formInfo.resetFields();
        if (this.isLx) {
          // 非立项管理人
          if (num === "1") {
            this.peopleList = [];
            this.subState = "10";
          } else {
            this.subState = "50";
          }
          this.changeType = false;
          this.defTypeYes = false;
          this.defTypeNo = false;
        } else {
          this.changeType = true;
          if (num === "1") {
            this.subState = "10";
            this.peopleList = [];
            this.defTypeYes = true;
            this.defTypeNo = false;
          } else {
            this.subState = "50";
            this.defTypeYes = false;
            this.defTypeNo = true;
          }
        }
        this.formInfo.isCompete = num;
      }
    },
    // 按钮事件
    allFormCheck(type, num) {
      
      // 判断是否是立项的(已立项：10；暂不立项：20；待立项：0)
      let listState = this.$route.query.state;
      // 判断是否是立项人
      let lxMan = this.isLx;
      // type：10，立项 20暂不立项
      let subState = this.subState;
      if (subState === "50" && type === "20" && num === 1) {
        subState = "20";
      } else if (subState === "50" && type === "10" && num === 1) {
        subState = "50";
      } else {
        subState = type;
      }
      if (lxMan) {
        // 不是立项人（普通人员）
        if (listState && listState === "10") {
          // 已立项
          // 字段验证结果
          this.checkForm(subState);
        } else {
          // 未立项
          this.$refs.forms.validate((n) => {
            if (n) {
              let dataMap = {
                tbMan: this.tbMan,
                pkId: this.pkId,
                type: subState,
                form: this.form,
                formInfo: this.formInfo,
                check: false,
              };
              console.log(dataMap);
              this.$emit("check", dataMap);
            } else {
              debugger;
              this.$nextTick(() => {
                console.log("1222");
              });
              this.$refs.baseInfo.scrollTop = 30;
              // 未验证成功
              console.log("滚动", this.$refs);
            }
          });
        }
      } else {
        // 是立项人
        if (type !== "20") {
          // 立项
          this.checkForm(subState);
        } else {
          // 暂不立项
          this.$refs.forms.validate((n) => {
            if (n) {
              let dataMap = {
                tbMan: this.tbMan,
                pkId: this.pkId,
                type: subState,
                form: this.form,
                formInfo: this.formInfo,
                check: false,
              };
              console.log(dataMap);
              this.$emit("check", dataMap);
            }
          });
        }
      }
    },
    // 验证
    checkForm(subState) {
      // 是否通过验证、
      let checked;
      let d1 = new Promise((resolve, reject) => {
        this.$refs.forms.validate((n) => {
          if (n) {
            resolve();
          } else {
            reject(new Error("验证失败"));
          }
        });
      });
      let d2 = new Promise((resolve, reject) => {
        this.$refs.formInfo.validate((n) => {
          if (n) {
            resolve();
          } else {
            reject(new Error("验证失败"));
          }
        });
      });
      Promise.all([d1, d2])
        .then(() => {
          checked = true;
          let dataMap = {
            tbMan: this.tbMan,
            pkId: this.pkId,
            type: subState,
            form: this.form,
            formInfo: this.formInfo,
            check: checked,
          };
          console.log(dataMap);
          this.$emit("check", dataMap);
        })
        .catch(() => {
          checked = false;
        });
    },
    // 循环设置
    forSet(list) {
      let newList = [];
      list.forEach((n) => {
        let map = {
          fileId: n.fileId,
          fileName: n.fileName,
          name: n.fileName,
        };
        newList.push(map);
      });
      return newList;
    },
    // 取消按钮
    resetBtn() {
      // 是否新增
      let bthType = this.repair;
      let isNo = this.isNo;
      if (bthType) {
        let newForm = {};
        Object.assign(newForm, this.form);
        Object.assign(newForm, this.formInfo);
        isNo = isEqual(newForm, this.popList);
      } else {
        isNo = false;
      }
      if (isNo) {
        this.$confirm(
          "当前页面的数据已修改，确定离开吗？离开后页面数据将不会保存！",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            this.$refs.forms.resetFields();
            this.$refs.formInfo.resetFields();
            this.$emit("resetForm");
          })
          .catch(() => {});
      } else {
        this.$refs.forms.resetFields();
        this.$refs.formInfo.resetFields();
        this.$emit("resetForm");
      }
    },
    // 关闭按钮
    closeBtn() {
      this.$emit("close");
    },
    // 选择一项
    handleSelect(item) {
      //获取客户联系人信息
      this.getCustomerLinkmanList();
      this.haveCustomerName=false;
    },
    // 选择一项
    handleSelectmanList(item) {
      let manList = this.jpManList;
      manList.forEach((n) => {
        if (n.customerContacts === item.customerContacts) {
          //联系人姓名
          this.form.customerContacts = n.customerContacts;
          //联系人职务
          this.form.customerPost = n.customerPost;
          //联系人手机
          this.form.customerContactsInformation = n.customerContactsInformation;
        }
      });
      console.log(this.form.customerPost);
    },
    // 获取客户名称
    //queryString 为在框中输入的值
    //callback 回调函数,将处理好的数据推回
    getCustomerNameList(queryString, callback) {
      let map = {
        customerName: queryString,
      };
      var list = [{}];
      axios
        .post(option.base_path + "db/customer/getCustomerNameList", map)
        .then((data) => {
          //赋值全局变量数据
          let dataList = data.data.data;
          
          for (let i of dataList) {
            i.value = i.customerName; //将想要展示的数据作为value
          }
          list = dataList;
          callback(list);
          console.log("违法单位",list.length)
          if(list.length==0){
            this.haveCustomerName=false;
           }else{
            this.haveCustomerName=true;
           }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    // 获取客户联系人信息
    getCustomerLinkmanList() {
      let map = {       
        customerName: this.form.customerName,
      };
      var list = [{}];
      axios
        .post(option.base_path + "db/customer/getCustomerLinkmanList", map)
        .then((data) => {
          //赋值全局变量数据
          let dataList = data.data.data;
          for (let i of dataList) {
            i.value = i.customerContacts; //将想要展示的数据作为value
          }
          this.jpManList = dataList;
          //如果等于1直接赋值
          if(dataList.length == 1){
            //联系人
            this.form.customerContacts = dataList[0].customerContacts;
            //联系方式
            this.form.customerContactInformation = dataList[0].customerContactsInformation;
            //客户职务
            this.form.customerPost = dataList[0].customerPost;
          }
          console.log(this.jpManList);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    // 返回输入建议方法
    querySearch(queryString, cb) {
      console.log(queryString);
      let restaurants = this.jpManList;
      let results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      cb(results);
    },
    // 筛选匹配的数据
    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
  },
  components: {
    upload,
    topTip,
    lookFiles,
    selectMan,
    money,
  },
};
</script>

<style>
.el-form-item__content {
  text-align: left;
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

.inline-input {
  width: 100%;
}

.top-line {
  /*
  border-bottom: 1px solid #417095;
  margin-left: 21px;;
  margin-bottom: 5px;
 */
}
</style>

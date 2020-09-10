<template>
  <div class="invoice-detail" style="position: relative;">
    <img
      src="../../assets/images/common/redgo.png"
      style="position: absolute;left:45%;top:2%;transform: rotate(-35deg); width:150px"
      v-if="this.lookType == 3 || (this.lookType == 2 && form.redFileList.length > 0)"
    />
    <img
      src="../../assets/images/common/goout.png"
      style="position: absolute;left:45%;top:2%;transform: rotate(-35deg); width:150px"
      v-if="this.lookType == 4|| (this.lookType == 2 && form.invalidFileList.length > 0)"
    />
    <div style="text-align: right; padding-right:20px; padding-top:20px">
      <label>申请人：</label>
      <span>{{form.applicantUserName}}</span>
      <label style="margin-left:20px">发票申请编号：</label>
      <span>{{form.invoiceAppNum}}</span>
    </div>
    <!-- 标题 -->
    <div style="text-align: center;">
      <span
        style="letter-spacing: 1px; font-size: 18px; font-weight: bold;"
      >{{form.invoiceType == 1 ? "增值税专用发票" : "增值税普通发票"}}</span>
      <div
        style="height: 2px; background: #000; width: 15%; margin: 0 auto;margin-top: 10px;margin-bottom: 10px"
      ></div>
      <!-- <span style="font-size: 12px;margin-left:176px">此联不作报销、扣税凭证使用</span> -->
      <div style="float:right;margin-right: 20px;">
        <label style="letter-spacing: 5px;">开票日期：</label>
        <span>{{form.invoiceDate}}</span>
      </div>
    </div>
    <!-- <el-form :model="form" label-position="right" label-width="120px">
    <el-row style="border: 1px solid #000">
      <el-col :span="1" style="border-right: 1px solid #000;text-align:center">
        <br />购
        <br />
        <br />买
        <br />
        <br />方
      </el-col>
      <el-col :span="10">
        <el-form-item label="名称："></el-form-item>
        <el-form-item label="纳税人识别号："></el-form-item>
        <el-form-item label="地址、电话："></el-form-item>
        <el-form-item label="开户行及账号："></el-form-item>
      </el-col>
      <el-col :span="1" style="text-align:center">
        合
        <br />同
        <br />开
        <br />票
        <br />信
        <br />息
      </el-col>
      <el-col :span="10"></el-col>
    </el-row>
    </el-form>-->
    <table class="print-table">
      <tbody>
        <tr>
          <td style="width:15px;padding: 20px 5px;">购买方</td>
          <td style="padding: 20px 5px;width:50%">
            <div style="padding-bottom:10px">
              <label>
                <span style="letter-spacing: 55px;">名</span>称：
              </label>
              <span>{{form.invoiceRise}}</span>
            </div>
            <div style="padding-bottom:10px">
              <label>纳税人识别号：</label>
              <span>{{form.taxpayerNumber}}</span>
            </div>
            <div style="padding-bottom:10px">
              <label>
                <span style="letter-spacing: 7px;">地</span>址、
                <span style="letter-spacing: 7px;">电</span>话：
              </label>
              <span>{{(form.contactAddress ? form.contactAddress : "--") + "/" + (form.contactPhone ? form.contactPhone : "--")}}</span>
            </div>
            <div style="padding-bottom:10px">
              <label>开户行及账号：</label>
              <span>{{(form.accountBank ? form.accountBank : "--") + "/" + (form.accountNumber ? form.accountNumber : "--")}}</span>
            </div>
          </td>
          <td style="width:15px;padding: 20px 5px;">合同开票信息</td>
          <td style="padding: 20px 5px;">
            <div style="padding-bottom:10px">
              <label>
                <span style="letter-spacing: 1px;">合同名称/编</span>号：
              </label>
              <span>{{form.contractNameNum}}</span>
            </div>
            <div style="padding-bottom:10px">
              <label>合同未开票金额：</label>
              <span>{{form.noInvoiceMoney | moneyFormat}}</span>（本次申请金额已从合同未开票金额中扣除）
            </div>
            <div style="padding-bottom:10px">
              <label>
                <span style="letter-spacing: 1px;">合同文本附</span>件：
              </label>
              <span style="cursor: pointer;" @click="toPdfDetails">{{form.textAttList.length > 0 ? form.textAttList[0].fileName : '--'}}</span>
            </div>
            <div v-if="form.textAttList.length > 1">
              <label
                @click="toPageOfContrat"
                style="color: #475c6d; font-weight: bold;cursor: pointer;"
              >查看更多合同</label>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- <topTip>
      <template>
        <el-row>
          <el-col :span="15" class="top-tip" style="text-align: left;">
            <div>
              <span style="color: #417095;font-size: 16px;font-weight: bolder;">申请内容</span>
            </div>
          </el-col>
        </el-row>
      </template>
    </topTip>-->
    <el-table
      border
      :data="form.goodsList"
      style="width: 100%; margin-top: 20px;"
      show-summary
      :summary-method="getSummariesFour"
    >
      <el-table-column prop="invoiceModel" label="货物或应税劳务、服务名称及规格型号"></el-table-column>
      <el-table-column prop="unit" label="单位" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.unit || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="num" label="数量" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.num | numberFormata(0)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="unitPrice" label="单价（元）" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.unitPrice | numberFormata(2)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="amountMoney" label="金额（含税）" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.amountMoney | numberFormata(2)}}</span>
        </template>
      </el-table-column>
    </el-table>
    <table class="print-table">
      <tbody>
        <tr>
          <td style="width:15px;padding: 20px 5px;">销售方</td>
          <td style="padding: 20px 5px;width:50%">
            <div style="padding-bottom:10px">
              <label>
                <span style="letter-spacing: 55px;">名</span>称：
              </label>
              <span>{{form.bCompany}}</span>
            </div>
            <div style="padding-bottom:10px">
              <label>纳税人识别号：</label>
              <span>{{form.bTaxpayerNumber}}</span>
            </div>
            <div style="padding-bottom:10px">
              <label>
                <span style="letter-spacing: 7px;">地</span>址、
                <span style="letter-spacing: 7px;">电</span>话：
              </label>
              <span>{{form.bAddressPhone}}</span>
            </div>
            <div style="padding-bottom:10px">
              <label>开户行及账号：</label>
              <span>{{form.bBankAccount}}</span>
            </div>
          </td>
          <td style="width:15px;padding: 20px 5px;">备注</td>
          <td style="padding: 20px 5px;">{{form.remarks}}</td>
        </tr>
      </tbody>
    </table>
    <topTip
      v-if="form.workFlowState == '已完成' || (form.taskKey == 'activitiEndTask' && this.lookType == 1)"
    >
      <template>
        <el-row>
          <el-col :span="15" class="top-tip" style="text-align: left;">
            <div>
              <span style="color: #417095;font-size: 16px;font-weight: bolder;">财务填写</span>
            </div>
          </el-col>
        </el-row>
      </template>
    </topTip>
    <el-form
      ref="form"
      :model="form"
      label-position="right"
      label-width="110px"
      style="padding: 0px 20px;"
      v-if="form.workFlowState == '已完成' || (form.taskKey == 'activitiEndTask' && this.lookType == 1)"
      :rules="rules"
    >
      <el-form-item label="发票附件上传：" label-width="120px" :class="required">
        <el-row>
          <el-col :span="24" style="position:relative">
            <upload
              @upload="uploadPicture"
              @delFile="delFileBtnPicture"
              :fileList="form.fileList"
              :listType="'invoice'"
              :fileTypeBool="1"
              :disabled="this.lookType !== 1"
              :photoUpload="'1'"
            ></upload>
            <div
              style="display: inline-block;position:absolute; left: 400px;top:2px;"
              v-if="this.lookType == 1"
            >
              <span style="font-size: 14px;color: #FF0000;vertical-align: middle;">*</span>
              <span>发票开具张数：</span>
              <el-input
                v-model="form.invoiceNumber"
                autocomplete="true"
                placeholder="请输入"
                style="width:200px"
              ></el-input>
            </div>
            <div
              style="display: inline-block;position:absolute; left: 400px;top:2px;"
              v-if="this.lookType !== 1"
            >
              <span>发票开具张数：</span>
              <span>{{form.invoiceNumber}}</span>
            </div>
            <!-- <img
              src="../../assets/images/common/red.png"
              style="display: inline-block;position:absolute; left: 800px;top:-5px;"
              v-if="this.lookType == 3 || this.form.invoiceType == 2"
            />
            <img
              src="../../assets/images/common/out.png"
              style="display: inline-block;position:absolute; left: 800px;top:-5px;"
              v-if="this.lookType == 4 || this.form.invoiceType == 3"
            />-->
          </el-col>
          <!-- <el-col :span="11">
            <span>发票开具张数：</span>
            <el-input
              v-model="form.invoiceNumber"
              autocomplete="true"
              placeholder="请输入"
              style="width:200px"
            ></el-input>
          </el-col>-->
        </el-row>
      </el-form-item>
      <!-- 红冲附件 -->
      <el-form-item
        label="红冲附件上传："
        label-width="120px"
        :class="required"
        v-if="this.lookType == 3 || (this.lookType == 2 && form.redFileList.length > 0)"
      >
        <el-row>
          <el-col :span="24" style="position:relative">
            <upload
              @upload="uploadRed"
              @delFile="delFileBtnRed"
              :fileList="form.redFileList"
              :listType="'invoice'"
              :fileTypeBool="1"
              :disabled="this.lookType == 2"
              :photoUpload="'1'"
            ></upload>
            <div style="display: inline-block;position:absolute; left: 220px;top:2px;">
              <span>请以票号命名附件，请同时上传红冲票和重开票据</span>
            </div>
            <div
              style="display: inline-block;position:absolute; left: 550px;top:2px;"
              v-if="this.lookType == 3"
            >
              <span style="font-size: 14px;color: #FF0000;vertical-align: middle;">*</span>
              <span>红冲发票开具张数：</span>
              <el-input
                v-model="form.invoiceRedNumber"
                autocomplete="true"
                placeholder="请输入"
                style="width:100px"
              ></el-input>
            </div>
            <div
              style="display: inline-block;position:absolute; left: 550px;top:2px;"
              v-if="this.lookType == 2"
            >
              <span>红冲发票开具张数：</span>
              <span>{{form.invoiceRedNumber}}</span>
            </div>
            <div
              style="display: inline-block;position:absolute; left: 800px;top:2px;"
              v-if="this.lookType == 3"
            >
              <span style="font-size: 14px;color: #FF0000;vertical-align: middle;">*</span>
              <span>重开发票张数：</span>
              <el-input
                v-model="form.invoiceRedAgainNumber"
                autocomplete="true"
                placeholder="请输入"
                style="width:100px"
              ></el-input>
            </div>
            <div
              style="display: inline-block;position:absolute; left: 800px;top:2px;"
              v-if="this.lookType == 2"
            >
              <span>重开发票张数：</span>
              <span>{{form.invoiceRedAgainNumber}}</span>
            </div>
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 作废附件 -->
      <el-form-item
        label="作废附件上传："
        label-width="120px"
        :class="required"
        v-if="this.lookType == 4 || (this.lookType == 2 && form.invalidFileList.length > 0)"
      >
        <el-row>
          <el-col :span="24" style="position:relative">
            <upload
              @upload="uploadOut"
              @delFile="delFileBtnOut"
              :fileList="form.invalidFileList"
              :listType="'invoice'"
              :fileTypeBool="1"
              :disabled="this.lookType == 2"
              :photoUpload="'1'"
            ></upload>
            <div style="display: inline-block;position:absolute; left: 220px;top:2px;">
              <span>请以票号命名附件，请上传重开票据</span>
            </div>
            <div
              style="display: inline-block;position:absolute; left: 700px;top:2px;"
              v-if="this.lookType == 4"
            >
              <span style="font-size: 14px;color: #FF0000;vertical-align: middle;">*</span>
              <span>重开发票张数：</span>
              <el-input
                v-model="form.invoiceInvalidAgainNumber"
                autocomplete="true"
                placeholder="请输入"
                style="width:200px"
              ></el-input>
            </div>
            <div
              style="display: inline-block;position:absolute; left: 700px;top:2px;"
              v-if="this.lookType == 2"
            >
              <span>重开发票张数：</span>
              <span>{{form.invoiceInvalidAgainNumber}}</span>
            </div>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <topTip>
      <template>
        <el-row>
          <el-col :span="15" class="top-tip" style="text-align: left;">
            <div>
              <span style="color: #417095;font-size: 16px;font-weight: bolder;">项目分配情况</span>
            </div>
          </el-col>
        </el-row>
      </template>
    </topTip>
    <el-table
      border
      :data="form.invoiceMoneyList"
      style="width: 100%"
      show-summary
      :summary-method="getSummaries"
    >
      <el-table-column prop="projectName" label="分配项目名称/编号" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.projectName + "/" + scope.row.projectNum}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="projectAmount" label="合同项目分配金额(元）" align="right" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.projectAmount | moneyFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="alreadyAllocationMoney" label="已分配收入金额(元）" align="right" width="220">
        <template slot-scope="scope">
          <span>{{scope.row.alreadyAllocationMoney | moneyFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="allocationMoney" label="本次分配收入金额（元）" align="right" width="220">
        <template slot-scope="scope">
          <span>{{scope.row.allocationMoney | moneyFormat}}</span>
        </template>
      </el-table-column>
    </el-table>
    <approvalSelect
      :key="workData"
      ref="approvalData"
      @flowChange="flowChange"
      :params="workFlowData"
      v-if="this.lookType == 1"
    ></approvalSelect>
    <div style="text-align: center;padding-bottom:20px;padding-top:20px">
      <button
        type="button"
        class="el-button yt-bottom-btn el-button--primary"
        v-if="this.lookType == 1"
        @click="saveInvoiceSubmitWorkflow"
      >
        <span>提交</span>
      </button>
      <button
        type="button"
        class="el-button yt-bottom-btn el-button--primary"
        v-if="this.lookType == 3"
        @click="updateRedInvoice"
      >
        <span>确定</span>
      </button>
      <button
        type="button"
        class="el-button yt-bottom-btn el-button--primary"
        v-if="this.lookType == 4"
        @click="updateInvalidInvoice"
      >
        <span>确定</span>
      </button>
      <button
        type="button"
        class="el-button yt-bottom-btn el-button--default"
        @click="resetFormData"
      >
        <span>{{btnText}}</span>
      </button>
    </div>
    <logAndApprove
      :pkId="pkId"
      :axiosUrl="axiosUrl"
      :processInstanceId="workFlowData.processInstanceId"
    ></logAndApprove>
  </div>
</template>
<style>
.print-table {
  border-collapse: collapse;
  border: none;
  width: 100%;
}
.print-table tbody {
  display: table-row-group;
  vertical-align: middle;
  border-color: inherit;
}
.print-tabley tr,
.print-table td {
  border: 1px solid #000;
}
</style>
<script>
//一级标题
import topTip from "../../components/topTip";
//提交附件
import upload from "../../components/upload";
//查看附件
import lookFiles from "../../components/lookFiles.vue";
//axios接口组件
import axios from "../../service/http";
//配置文件
import { option } from "../../static/config";
//获取下一步审批人
import approvalSelect from "../../components/ApprovalSelect/ApprovalSelect";
// 日志组件
import logAndApprove from "../../components/logAndApprove.vue";
import { finMoneyformat } from "../../assets/js/util/expensesUtils";
export default {
  props: {},
  data() {
    return {
      form: {
        pkId: "", //主表id
        applicantUserName: "", //申请人name
        invoiceDate: "", //开票日期
        invoiceAppNum: "", //发票申请编号
        invoiceType: "", //发票类型	1:增值税专用发票2：增值税普通发票
        contractId: "", //合同id
        contractNameNum: "", //合同名称/编号	查合同表
        noInvoiceMoney: 0, //合同未开票金额	后台计算
        invoiceRise: "", //发票抬头
        taxpayerNumber: "", //纳税人识别号
        accountBank: "", //开户行
        accountNumber: "", //账号
        contactAddress: "", //联系地址
        contactPhone: "", //联系电话
        remarks: "", //备注
        invoiceAmount: 0, //开票金额合计（含税）
        bCompany: "", //开票公司
        bTaxpayerNumber: "", //乙方纳税人识别号
        bAddressPhone: "", //乙方地址、电话
        bBankAccount: "", //乙方开户行及账号
        invoiceNumber: "", //发票开具张数
        invoiceRedNumber: "", //红冲发票开具张数
        invoiceRedAgainNumber: "", //红冲重开发票张数
        invoiceInvalidAgainNumber: "", //作废重开发票张数
        dealingWithPeople: "", //下一步操作人code
        opintion: "", //审批意见
        processInstanceId: "", //流程实例ID,
        nextCode: "", //操作流程代码
        goodsList: [
          //物品集合	List<map>
          //{//goodsList的值（物品集合）
          //列名	注释	备注
          //invoiceModel: "",	//货物或应税劳务、服务名称及规格型号
          //unit: "",	//单位
          //num: "",	//数量
          //unitPrice: "",	//单价（元）
          //amountMoney: ""
          //}	//金额（含税）	}
        ],
        invoiceMoneyList: [
          //发票金额分配	List<map>
          //{
          //invoiceMoneyList的值（发票金额分配）
          //列名	注释	备注
          //projectNum	//项目表PK_ID
          //projectName	//项目名称
          //projectAmount	//合同项目分配金额
          //allocationMoney	//本次分配收入金额
          //alreadyAllocationMoney	//已分配收入金额	后台计算获取
          //}
        ],
        fileList: [
          //fileList发票
          //列名	注释	备注
          //fileId	//附件Id
          //fileName	//附件名称
        ],
        //发票附件	List<map>
        redFileList: [
          //冲红发票附件	List<map>
          //redFileList红冲发票
          //列名	注释	备注
          //fileId	//附件Id
          //fileName	//附件名称
        ],
        invalidFileList: [
          //作废发票附件	List<map>
          //invalidFileList作废发票
          //列名	注释	备注
          //fileId	//附件Id
          //fileName	//附件名称
        ],
        textAttList: [
          //contractId: 0
          //createTime: ""
          //createUser: ""
          //createUserName: ""
          //fileId: 1892
          //fileName: "2020-002 建设路宝平公路至环城东路段路灯改造项目.pdf"
          //textAttMappingId: 770
        ],
      },
      //星号类
      required: "", //is-required
      woks: {
        work: "",
      },
      workFlowData: {
        //工作流参数
        appId: "", //表单申请id
        businessCode: "INCOME_INVOICE_APP",
        processInstanceId: "",
        parameters: "",
        invoiceNumber: "", //发票开具张数
        opintion: "",
        nextCode: "",
        dealingWithPeople: "",

        fileList: [],
      },
      //获取查询id
      // pkId: { pkId: 266 },this.$route.query.pkId
      pkId: { pkId: this.$route.query.pkId },
      pkIdCopy: this.$route.query.pkId,
      lookType: this.$route.query.lookType, //判断是那种情况（1：审批，2：详情，3：红冲，4：作废）默认新增
      //日志接口地址
      axiosUrl: option.base_path + "db/income/getInvoiceJournalList", //db/income/getInvoiceJournalList
      //关闭按钮文字
      btnText: "取消",
      workData: 0, //为工作流组件绑定的key值  用来更新组件
      //跳转
      goType: this.$route.query.goType,
      //必填
      rules: {
        invoiceNumber: [
          { required: true, message: "请输入发票开具张数", trigger: "blur" },
        ],
        invoiceRedNumber: [
          {
            required: true,
            message: "请输入红冲发票开具张数",
            trigger: "blur",
          },
        ],
        invoiceRedAgainNumber: [
          { required: true, message: "请输入重开发票张数", trigger: "blur" },
        ],
        invoiceInvalidAgainNumber: [
          { required: true, message: "请输入重开发票张数", trigger: "blur" },
        ],
      },
    };
  },
  components: {
    topTip,
    upload,
    lookFiles,
    approvalSelect,
    logAndApprove,
  },
  mounted() {
    this.getInvoiceDetails();
    this.changeText();
  },
  methods: {
    //改变文字
    changeText() {
      if (this.lookType == 1) {
        this.btnText = "取消";
      } else {
        this.btnText = "关闭";
      }
    },
    // 上传发票附件
    uploadPicture(file) {
      // var data = eval("(" + file + ")");
      this.form.fileList = this.forSetPage(file);
    },
    // 上传红冲附件
    uploadRed(file) {
      // var data = eval("(" + file + ")");
      this.form.redFileList = this.forSetPage(file);
    },
    // 上传作废附件
    uploadOut(file) {
      // var data = eval("(" + file + ")");
      this.form.invalidFileList = this.forSetPage(file);
    },
    // 删除发票附件
    delFileBtnPicture(fileList) {
      this.form.fileList = this.forSetPage(fileList);
    },
    // 删除红冲附件
    delFileBtnRed(fileList) {
      this.form.redFileList = this.forSetPage(fileList);
    },
    // 删除作废附件
    delFileBtnOut(fileList) {
      this.form.invalidFileList = this.forSetPage(fileList);
    },
    //附件循环设置
    forSetPage(list) {
      let newList = [];
      list.forEach((n) => {
        newList.push({
          fileId: n.fileId,
          fileName: n.fileName,
          name: n.fileName,
        });
      });
      return newList;
    },
    flowChange(value) {
      this.woks.work = value;
    },
    /**
     * 取消
     */
    resetFormData() {
      if (this.goType == 1) {
        this.$router.push({ path: "/invoice/invoiceList" });
      } else if (this.goType == 2) {
        this.$router.push({ path: "/invoice/invoiceDraft" });
      }
      // this.$router.push({ path: "/approval/draftsList" });
    },

    //查看详情
    getInvoiceDetails() {
      axios
        .post(option.base_path + "db/income/getInvoiceDetails", this.pkId)
        .then((data) => {
          this.form = {};
          this.form = data.data.data;
          let datas = data.data.data;
          this.workFlowData.appId = datas.pkId;
          this.workFlowData.processInstanceId = datas.processInstanceId; //processInstanceId	流程实例ID
          this.workFlowData.invoiceNumber = datas.invoiceNumber; //invoiceNumber	发票开具张数
          this.workFlowData.fileList = datas.fileList; //fileList	附件集合
          console.log("附件集合 ", this.form.fileList);
          console.log("工作流 ", this.workFlowData);
          this.workData = Math.random();
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    //3）提交/审批工作流
    saveInvoiceSubmitWorkflow() {
      this.workFlowData.dealingWithPeople = this.$refs.approvalData.approvalForm.nextOperCode; //dealingWithPeople	下一步操作人code
      this.workFlowData.opintion = this.$refs.approvalData.approvalForm.textarea; //opintion	审批意见
      this.workFlowData.nextCode = this.$refs.approvalData.approvalForm.nextCode; //nextCode	操作流程代码
      this.workFlowData.fileList = JSON.stringify(this.form.fileList);
      this.workFlowData.invoiceNumber = this.form.invoiceNumber;
      //校验审批组件必填项
      let workFlag = this.$refs["approvalData"].approvalValid();
      //判断必填
      let valid = true;
      if (
        this.form.taskKey == "activitiEndTask" &&
        this.lookType == 1 &&
        this.workFlowData.nextCode !== "returnedSubmit"
      ) {
        if (this.form.fileList.length == 0) {
          this.$message({
            message: "请上传发票附件",
            type: "warning",
          });
          valid = false;
        } else if (this.form.invoiceNumber == "") {
          this.$message({
            message: "请填写发票开具张数",
            type: "warning",
          });
          valid = false;
        }
      }
      if (workFlag && valid) {
        axios
          .post(
            option.base_path + "db/income/saveInvoiceSubmitWorkflow",
            this.workFlowData
          )
          .then((data) => {
            this.$message({
              message: "提交成功",
              type: "success",
            });
            this.$router.push({ path: "./invoiceList" });
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },

    //12）发票红冲
    updateRedInvoice() {
      let map = {
        pkId: this.pkIdCopy, //主表id
        invoiceRedNumber: this.form.invoiceRedNumber, //红冲发票开具张数
        invoiceRedAgainNumber: this.form.invoiceRedAgainNumber, //重开发票张数
        redFileList: this.form.redFileList, //红冲发票附件
      };
      map.redFileList = JSON.stringify(map.redFileList);
      //判断必填
      let valid = true;
      if (this.lookType == 3) {
        if (this.form.redFileList.length == 0) {
          this.$message({
            message: "请上传红冲发票附件",
            type: "warning",
          });
          valid = false;
        } else if (this.form.invoiceRedAgainNumber == "") {
          this.$message({
            message: "请填写重开发票张数",
            type: "warning",
          });
          valid = false;
        } else if (this.form.invoiceRedNumber == "") {
          this.$message({
            message: "请填写红冲发票开具张数",
            type: "warning",
          });
          valid = false;
        }
      }
      if (valid) {
        axios
          .post(option.base_path + "db/income/updateRedInvoice", map)
          .then((data) => {
            this.$message({
              message: "提交成功",
              type: "success",
            });
            this.$router.push({ path: "./invoiceList" });
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },

    //13）发票作废
    updateInvalidInvoice() {
      let map = {
        pkId: this.pkIdCopy, //主表id
        invoiceInvalidAgainNumber: this.form.invoiceInvalidAgainNumber, //作废重开发票张数
        invalidFileList: this.form.invalidFileList, //作废上传的发票附件
      };
      map.invalidFileList = JSON.stringify(map.invalidFileList);
      //判断必填
      let valid = true;
      if (this.lookType == 4) {
        if (this.form.invalidFileList.length == 0) {
          this.$message({
            message: "请上传作废发票附件",
            type: "warning",
          });
          valid = false;
        } else if (this.form.invoiceInvalidAgainNumber == "") {
          this.$message({
            message: "请填写重开发票张数",
            type: "warning",
          });
          valid = false;
        }
      }
      if (valid) {
        axios
          .post(option.base_path + "db/income/updateInvalidInvoice", map)
          .then((data) => {
            this.$message({
              message: "提交成功",
              type: "success",
            });
            this.$router.push({ path: "./invoiceList" });
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    moneyFormat(num) {
      if (num) {
        num = Number(num);
        num = (num.toFixed(2) + "").replace(
          /\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,
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
    //计算合计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (index == 3) {
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
            sums[index] = "";
          }
        }
      });
      //赋值合计变量
      this.invoiceTotal = sums[3];
      console.log(this.invoiceTotal);
      return sums;
    },
    //计算合计
    getSummariesFour(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (index == 4) {
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
            sums[index] = "";
          }
        }
      });
      //赋值合计变量
      this.invoiceTotal = sums[4];
      console.log(this.invoiceTotal);
      return sums;
    },
    //跳转合同详情
    toPageOfContrat() {
      this.$router.replace({
        path: "/contract/contractApply",
        query: {
          lookType: 1,
          pkId: this.form.contractId,
        },
      });
    },
    //预览pdf
    toPdfDetails() {
      let action =
        option.base_path +
        "db/bidding/attachmentPreview?fileId=" +
        this.form.textAttList[0].fileId +
        "&isDownload=false";
      window.open(action, "_blank");
    },
  },
  filters: {
    numberFormata(val, i) {
      let money = finMoneyformat(val, i);
      return money !== "0" && money !== "0.00" && money !== "" && money !== 0
        ? money
        : "--";
    },
    // 转换算法主函数
    numberToChinese(n) {
      if (n) {
        let fraction = ["角", "分"];
        let digit = [
          "零",
          "壹",
          "贰",
          "叁",
          "肆",
          "伍",
          "陆",
          "柒",
          "捌",
          "玖",
        ];
        let unit = [
          ["元", "万", "亿"],
          ["", "拾", "佰", "仟"],
        ];
        let head = n < 0 ? "欠" : "";
        n = Math.abs(n);
        let s = "";
        for (let i = 0; i < fraction.length; i++) {
          s += (
            digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]
          ).replace(/零./, "");
        }
        s = s || "整";
        n = Math.floor(n);
        for (let i = 0; i < unit[0].length && n > 0; i++) {
          let p = "";
          for (let j = 0; j < unit[1].length && n > 0; j++) {
            p = digit[n % 10] + unit[1][j] + p;
            n = Math.floor(n / 10);
          }
          s = p.replace(/(零.)*零$/, "").replace(/^$/, "零") + unit[0][i] + s;
        }
        return (
          head +
          s
            .replace(/(零.)*零元/, "元")
            .replace(/(零.)+/g, "零")
            .replace(/^整$/, "零元整")
        );
      } else {
        return "--";
      }
    },
    moneyFormat(num) {
      if (num) {
        num = Number(num);
        num = (num.toFixed(2) + "").replace(
          /\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,
          "$&,"
        );
      }
      return num || "0.00";
    },
  },
};
</script>

<style>
.invoice-detail .el-table__footer td:nth-child(1) .cell {
  text-align: center;
}
</style>

<style scoped>
.invoice-detail {
  min-width: 1200px;
  min-height: 97%;
  background-color: #fff;
}
</style>

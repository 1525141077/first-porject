<template>
  <div class="yt-dome-container">
    <el-form ref="forms" :model="expenseForm" label-position="right" label-width="110px">
      <topTip>
        <template>
          <el-row>
            <el-col :span="15" class="top-tip" style="text-align: left;">
              <div>
                <span style="color: #417095;font-size: 16px;font-weight: bolder;">基本信息</span>
              </div>
            </el-col>
            <el-col :span="8" style="text-align: right;">
              <div>
                <label style="margin-right:20px">
                  <span style="color:rgb(65, 112, 149);font-weight:bold;letter-spacing:4px">单据编号：</span>
                  <span style="font-size:14px;color:#999999;">提交后自动生成</span>
                </label>
                <label>
                  <span style="color:rgb(65, 112, 149);font-weight:bold;letter-spacing:4px">申请日期：</span>
                  <span>--</span>
                </label>
              </div>
            </el-col>
          </el-row>
        </template>
      </topTip>
      <!-- 基本信息区域 -->
      <div class="user_info">
        <el-row>
          <el-col :span="6">
            <label>
              <span class="yt-read-text" style="letter-spacing:5px">申请人：</span>
              <span>{{ userInfo.realName }}</span>
            </label>
          </el-col>
          <el-col :span="6">
            <label class="yt-read-text">
              <span style="letter-spacing: 40px;">部</span>门：
            </label>
            <span>{{ userInfo.deptName }}</span>
          </el-col>
          <el-col :span="6">
            <label class="yt-read-text">
              <span style="letter-spacing: 40px;">职</span>务：
            </label>
            <span>{{ userInfo.positionName }}</span>
          </el-col>
          <el-col :span="6">
            <label class="yt-read-text">
              <span style="letter-spacing: 40px;">电</span>话：
            </label>
            <span>{{ userInfo.userPhone }}</span>
          </el-col>
        </el-row>
      </div>
      <!-- 表单区域 -->
      <div style="margin-top:20px;padding-right:20px">
        <!-- <el-form ref="forms" :model="expenseForm" label-position="right" label-width="110px"> -->
        <el-form-item
          prop="reimReason"
          label="支出事由："
          :rules="{
            required: true,
            message: '请输入支出事由',
            trigger: 'blur'
          }"
        >
          <el-input size="small" placeholder="请输入" v-model="expenseForm.reimReason"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="5">
            <el-form-item
              label="业务类型："
              prop="projectCode"
              :rules="[{required: true,message: '请选择', trigger: 'blur' }]"
            >
              <el-select
                size="small"
                @change="onSelected"
                v-model="expenseForm.projectCode"
                placeholder="请选择"
              >
                <el-option label="请选择" value></el-option>
                <el-option
                  v-for="item in expenseType"
                  :key="item.dictTypeCode"
                  :label="item.disvalue"
                  :value="item.dictTypeCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7" v-if="this.twoSelect==true">
            <el-form-item
              label="项目名称："
              prop="projectTwoCode"
              :rules="[{ required:SelectList, message: '请选择', trigger: 'blur' }]"
            >
              <!-- <el-select size="small" @change="onTwoSelected" v-model="expenseForm.projectTwoCode">
                <el-option v-for="item in expenseTwoType" :key="item.projectCode" :label="item.projectName" :value="item.projectCode">
                </el-option>
              </el-select>-->
              <el-autocomplete
              size="small"
                class="inline-input"
                v-model="expenseForm.projectTwoName"
                placeholder="请输入关键字"
                :fetch-suggestions="querySearch"
                :trigger-on-focus="false"
                @select="handleSelect"
                style="width:200px"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="this.twoSelect==true">
            <el-form-item label="项目累计支出总额：" label-width="140px">{{ expenseT |moneyFormat }}元</el-form-item>
          </el-col>
        </el-row>
        <el-row style="radio-row">
          <el-form-item label="单据样式：">
            <el-col>
              <el-radio-group v-model="radioDefault" @change="radioChange(radioDefault)">
                <el-radio
                  :label="item.costCode"
                  v-for="item in formCodeList"
                  :key="item.costCode"
                >{{ item.costName }}</el-radio>
              </el-radio-group>
            </el-col>
          </el-form-item>
        </el-row>
      </div>
      <div
        style="height: 5px;background-color: #f3f3f3;border-top: 1px solid #dfe6f3;border-bottom: 1px solid #dfe6f3;"
      ></div>
      <div>
        <costDetailTable
          v-if="travel"
          :isApply="isApply"
          :isReimShow="isReimShow"
          :tableData="tableData"
        ></costDetailTable>
        <showTravelPay @sumTotal="sumTotal" v-show="!travel" ref="travelTab" :lookType="'1'"></showTravelPay>
      </div>
      <div>
        <el-row>
          <el-col>
            <div style="margin:20px 0 20px 20px">
              <label class="yt-sec-title-line"></label>
              <span class="yt-sec-title-text">申请支出总金额</span>
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-left:35px">
          <el-col :span="16">
            <span class="yt-read-text">申请支出总金额：</span>
            <span>{{ total|moneyFormat }}元</span>
          </el-col>
          <el-col :span="8">
            <span class="yt-read-text">人民币大写：</span>
            <span>{{capitalize}}</span>
          </el-col>
        </el-row>
        <el-row style="margin-top:20px">
          <el-col :span="9">
            <!-- <el-form> -->
            <el-form-item label="附单据张数：" label-width="120px">
              <el-input
                size="small"
                type="number"
                min="0"
                style="width:60%"
                v-model="billNumber"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div
        style="height: 5px;background-color: #f3f3f3;border-top: 1px solid #dfe6f3;border-bottom: 1px solid #dfe6f3;"
      ></div>
      <topTip>
        <template>
          <el-row>
            <el-col :span="15" class="top-tip" style="text-align: left;">
              <div>
                <span style="color: #417095;font-size: 16px;font-weight: bolder;">相关附件</span>
              </div>
            </el-col>
          </el-row>
        </template>
      </topTip>
      <el-row style="margin-left:21px">
        <el-col :span="24">
          <label class="yt-sec-title-line"></label>
          <span class="yt-sec-title-text">支出相关附件</span>
          <el-form-item label="支出相关附件：" label-width="115px">
            <upload @upload="upload" @delFile="delFileBtn" :fileList="expenseForm.expenseFlieList"></upload>
          </el-form-item>
        </el-col>
      </el-row>
      <div
        style="height: 5px;background-color: #f3f3f3;border-top: 1px solid #dfe6f3;border-bottom: 1px solid #dfe6f3;"
      ></div>
      <beneficiary :lookType="'1'" ref="payData"></beneficiary>
      <div
        style="height: 5px;background-color: #f3f3f3;border-top: 1px solid #dfe6f3;border-bottom: 1px solid #dfe6f3;"
      ></div>
      <!-- <el-form ref="approvalForm"> -->
      <approvalSelect
        :key="workData"
        ref="approvalData"
        @flowChange="flowChange"
        :params="workFlowData"
      ></approvalSelect>
      <!-- </el-form> -->
      <div style="text-align: center;padding-bottom:20px">
        <button
          :disabled="disabled"
          v-show="isReturn"
          @click="saveFormData"
          type="button"
          class="el-button yt-bottom-btn el-button--primary"
        >
          <span>保存</span>
        </button>
        <button
          :disabled="disabled"
          @click="subFormData"
          type="button"
          class="el-button yt-bottom-btn el-button--primary"
        >
          <span>确定</span>
        </button>
        <button
          type="button"
          class="el-button yt-bottom-btn el-button--default"
          @click="resetFormData"
        >
          <span>取消</span>
        </button>
      </div>
    </el-form>
  </div>
</template>
<script>
import topTip from "../../components/topTip.vue";
import upload from "../../components/upload.vue";
import costDetailTable from "../../components/costDetailTable.vue";
import showTravelPay from "../../components/showTravelPay.vue";
import beneficiary from "../../components/beneficiary.vue";
import axios from "../../service/http";
import { option } from "../../static/config";
import lookFiles from "../../components/lookFiles.vue";
import approvalSelect from "../../components/ApprovalSelect/ApprovalSelect";
export default {
  data() {
    return {
      userInfo: {}, //登录人信息
      expenseForm: {
        //必填项表单
        reimReason: "",
        projectCode: "",
        projectName: "",
        projectTwoCode: "",
        projectTwoName: "",
        expenseFlieList: [],
        advanceAppNum: "",
      },
      expenseType: [], //一级下拉集合
      expenseTwoType: [], //二级下拉集合
      twoSelect: false, //判断是否显示二级下拉
      SelectList: false,
      dataType: false,
      expenseT: "--", //项目累计支出总额：
      billNumber: "", //单据张数
      total: 0, //支出总金额
      isApply: true, //新增页面
      tableData: [], //费用明细集合
      formCodeList: [], //单据样式数组
      radioDefault: "", //单据样式code
      isReimShow: false,
      workFlowData: {
        //工作流参数
        businessCode: "SZ_EXPENDITURE_APP",
        processInstanceId: "",
        parameters: '{ type: "PROJECT_TYPE_1" }',
        projectNumber: "",
      },
      travel: true, //切换单据样式 为差旅费时隐藏费用明细组件
      workData: 0, //为工作流组件绑定的key值  用来更新组件
      disabled: false, //保存和提交按钮禁用
      processInstanceId: "", //流程id
      expenditureAppId: "", //支出id,
      woks: {
        work: "",
      },
      capitalize: "--", //大写金额
      isReturn: true, //是否退回
    };
  },
  components: {
    topTip,
    upload,
    costDetailTable,
    approvalSelect,
    lookFiles,
    beneficiary,
    showTravelPay,
  },
  mounted() {
    this.getUserInfo();
    this.getProjectTypeDictList();
    this.getDictInfoByFormCode();
    this.getType();
    //获取详情
    if (this.$route.query.pkId) {
      this.getExpenditureAppInfo();
    }
  },
  filters: {
    moneyFormat(num) {
      if (num && num != "--") {
        num = Number(num);
        num = (num.toFixed(2) + "").replace(
          /\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,
          "$&,"
        );
      }
      return num || "0.00";
    },
  },
  watch: {
    tableData: {
      handler() {
        let t = 0;
        if (this.tableData.length == 0) return;
        this.tableData.forEach((v) => {
          t += this.rmoney(v.money);
        });
        this.total = t;
        this.capitalize = this.NumToChinese(t);
      },
      deep: true,
    },
  },
  computed: {
    //保存提交需要的参数
    formData() {
      let costNormalList = [];
      this.tableData.forEach((v, i) => {
        costNormalList.push({
          normalId: "",
          typeOfExpenditure: v.dictTypeCode,
          normalName: v.content,
          normalAmount: v.money,
          remarks: v.remark,
          isReimburse: v.isReims,
        });
      });
      //costData
      let costData = JSON.stringify({
        costNormalList:
          this.radioDefault == "NORMAL_APPLY" ? costNormalList : [], //费用明细
        costNormalFinanceList:
          this.radioDefault == "FINANCIAL_ADMINISTRATION" ? costNormalList : [], //财务行政费用明细
        travelRouteList: this.travel ? [] : this.$refs.travelTab.travelList, //行程明细列表数据
        costCarfareList: this.travel
          ? []
          : this.$refs.travelTab.costCarfareList, //城市间交通费列表数据
        costHotelList: this.travel ? [] : this.$refs.travelTab.costHotelList, //住宿费列表数据
        costOtherList: this.travel ? [] : this.$refs.travelTab.costOtherList, //其他费用列表数据
      });
      let expenseFlieList = this.expenseForm.expenseFlieList;
      let fileStr = "";
      expenseFlieList.forEach((v) => {
        fileStr += v.fileId + ",";
      });
      return {
        // advanceAppId: "",
        // loanAppId: "",
        expenditureAppId: this.expenditureAppId,
        expenditureAppName: this.expenseForm.reimReason,
        costType: this.radioDefault,
        specialCode: this.expenseForm.projectCode,
        specialName: this.expenseForm.projectName,
        prjCode: this.expenseForm.projectTwoCode,
        prjName: this.expenseForm.projectTwoName,
        invoiceNum: this.billNumber,
        totalAmount: this.total,
        writeOffAmount: 0,
        officialCard: 0,
        cash: 0,
        cheque: 0,
        transfer: 0,
        paymentDate: "", //paymentDate	支付日期
        paymentAmount: 0, //paymentAmount	支付金额
        cmTotalAmount: 0, //cmTotalAmount	支付明细_报销总金额
        cmWriteOffAmount: 0, //cmWriteOffAmount	支付明细_冲销金额
        cmOfficialCard: 0, //cmOfficialCard	支付明细_公务卡金额
        cmCash: 0, //cmCash	支付明细_现金金额
        cmCheque: 0, //cmCheque	支付明细_支票金额
        cmTransfer: 0, //cmTransfer	支付明细_转账金额
        billingVoucherJson: "", //billingVoucherJson	记账凭证json
        applicantUser: this.userInfo.userName, //applicantUser	申请人code
        parameters: "", //parameters	JSON格式字符串,
        dealingWithPeople: this.$refs.approvalData.nextOperCode, //dealingWithPeople	下一步操作人code
        opintion: this.$refs.approvalData.textarea, //opintion	审批意见
        processInstanceId: this.processInstanceId, //processInstanceId	流程实例ID,
        nextCode: this.$refs.approvalData.nextCode, //nextCode	操作流程代码
        attIdStr: fileStr.substring(0, fileStr.length - 1),
        costData: costData, //costData	费用申请json
        payReceivablesData: JSON.stringify(
          this.$refs.payData.payReceivablesData
        ), //收款方
      };
    },
    //计算收款方合计
    sumPayMoney() {
      var total = 0;
      var {
        gatheringUnitList,
        gatheringPersonList,
        gatheringOtherList,
      } = this.$refs.payData.payReceivablesData;
      gatheringUnitList.forEach((v) => {
        total += v.totalAmountOfReceivables;
      });
      gatheringPersonList.forEach((v) => {
        total += v.amount;
      });
      gatheringOtherList.forEach((v) => {
        total += v.amount;
      });
      return total;
    },
  },
  methods: {
    //金额格式化
    rmoney(s) {
      //转成string类型
      s = s + "";
      return parseFloat(s.replace(/[^\d\.-]/g, ""));
    },
    //计算差旅费合计
    sumTotal(data) {
      var total = 0;
      var { travelList, costCarfareList, costHotelList, costOtherList } = data;
      costCarfareList.forEach((v) => {
        // if (v.crafare != "") {
        total +=
          this.rmoney(v.crafare) +
          this.rmoney(v.returnFee) +
          this.rmoney(v.trafficAccidentInsurancePremium) +
          this.rmoney(v.bookingFee);
        // }
      });
      costHotelList.forEach((v) => (total += this.rmoney(v.hotelExpense)));
      costOtherList.forEach((v) => (total += this.rmoney(v.reimAmount)));
      this.total = this.rmoney(total);
      this.capitalize = this.NumToChinese(this.rmoney(total));
    },
    flowChange(value) {
      this.woks.work = value;
    },
    // 获取当前登录人
    getUserInfo() {
      axios.post(option.base_path + "index/getCurrentUserInfo").then((res) => {
        this.userInfo = res.data.data;
      });
    },
    //单据样式
    getDictInfoByFormCode() {
      axios
        .post(option.base_path + "basicconfig/dictInfo/getDictInfoByFormCode", {
          formAppCode: "EXPENDITURE_APP",
        })
        .then((data) => {
          if (data.data.flag == 0) {
            //去掉误车费/误餐费
            data.file;
            this.formCodeList = data.data.data.filter((v, i) => i != 3);
            this.radioDefault = this.formCodeList[0].costCode;
          }
        });
    },
    //切换单据样式
    radioChange(val) {
      if (val == "FINANCIAL_ADMINISTRATION") {
        this.isReimShow = this.travel = true;
      } else if (val == "TRAVEL_APPLY") {
        this.travel = false;
      } else {
        this.isReimShow = false;
        this.travel = true;
      }
      this.tableData = [];
      this.total = this.billNumber = 0;
      this.capitalize = "--";
      this.$refs.travelTab.travelList = [];
      this.$refs.travelTab.costHotelList = [];
      this.$refs.travelTab.costCarfareList = [];
      var payData = this.$refs.payData.payReceivablesData;
      payData.gatheringUnitList = payData.gatheringPersonList = payData.gatheringOtherList = [];
    },
    //获取显示或者不显示的状态
    getType() {
      axios
        .post(option.base_path + "sz/expenditureApp/getdeptTypeByUserId")
        .then((data) => {
          // dataType
          this.dataType = data.data.data;
          console.log("啊飒飒", this.dataType);
        });
    },
    //一级下拉数据
    getProjectTypeDictList() {
      axios
        .post(option.base_path + "sz/expenditureApp/getProjectTypeDictList", {
          projectType: "BUSSINESS_TYPE",
        })
        .then((data) => {
          if (data.data.flag == 0) {
            this.expenseType = data.data.data;
          }
        });
    },
    //二级下拉数据
    getProjectTypeList(twoFlag, val) {
      axios
        .post(option.base_path + "sz/expenditureApp/getProjectTypeList", {
          params: "",
          pageIndex: 1,
          pageNum: 99999,
        })
        .then((data) => {
          if (data.data.flag == 0) {
            this.expenseTwoType = data.data.data;
            //赋值变量数据
            let dataList = data.data.data;
            // 筛选之后的
            let newNameList = [];
            dataList.forEach((n) => {
              for (let key in n) {
                if (key === "projectName") {
                  n["value"] = n["projectName"];
                }
              }
              newNameList.push(n);
            });
            this.expenseTwoType = newNameList;
            if (twoFlag) {
              this.expenseTwoType.forEach((v) => {
                if (v.projectCode == val) {
                  this.expenseT = v.sumTotalAmount;
                  this.expenseForm.projectTwoName = v.projectName;
                }
              });
            }
          }
        });
    },
    //一级下拉改变影响二级下拉框
    onSelected(val, projectShow) {
      this.expenseType.forEach((v) => {
        if (v.dictTypeCode == val) {
          this.expenseForm.projectName = v.disvalue;
        }
      });
      //项目类型
      if (val == "BUSSINESS_TYPE_1") {
        this.SelectList = true;
        let twoSelect = JSON.parse(JSON.stringify(this.twoSelect));
        twoSelect = true;
        this.twoSelect = twoSelect;

        this.expenseTwoType = [];
        //this.expenseForm.projectTwoCode = this.expenseForm.projectTwoName = "";
        this.workFlowData.projectNumber = "";
        this.expenseT = "--";
        this.workFlowData.parameters = '{ type: "BUSSINESS_TYPE_1" }';
        // this.getProjectTypeList();
        console.log("是否是", twoSelect);
      } else if (val == "BUSSINESS_TYPE_2") {
        let twoSelect = JSON.parse(JSON.stringify(this.twoSelect));
        twoSelect = true;
        this.twoSelect = twoSelect;

        this.SelectList = false;
        this.expenseTwoType = [];
        //this.expenseForm.projectTwoCode = this.expenseForm.projectTwoName = "";
        this.workFlowData.projectNumber = "";
        this.expenseT = "--";
        this.workFlowData.parameters = '{ type: "BUSSINESS_TYPE_2" }';
        // this.getProjectTypeList();
      } else if (val == "BUSSINESS_TYPE_3") {
        let twoSelect = JSON.parse(JSON.stringify(this.twoSelect));
        twoSelect = true;
        this.twoSelect = twoSelect;

        this.SelectList = false;
        this.expenseTwoType = [];
        //this.expenseForm.projectTwoCode = this.expenseForm.projectTwoName = "";
        this.workFlowData.projectNumber = "";
        this.expenseT = "--";
        this.workFlowData.parameters = '{ type: "BUSSINESS_TYPE_3" }';
        // this.getProjectTypeList();
      } else if (val == "BUSSINESS_TYPE_4") {
        this.SelectList = false;
        let dataType = JSON.parse(JSON.stringify(this.dataType));
        if ((dataType = true)) {
          this.twoSelect = true;
        } else {
          this.twoSelect = false;
        }

        console.log("第三方三", dataType);
        this.SelectList = false;
        this.expenseTwoType = [];
        //this.expenseForm.projectTwoCode = this.expenseForm.projectTwoName = "";
        this.workFlowData.projectNumber = "";
        this.expenseT = "--";
        this.workFlowData.parameters = '{ type: "BUSSINESS_TYPE_4" }';
        // this.getProjectTypeList();
      } else {
        //非项目类型
        let twoSelectTwo = JSON.parse(JSON.stringify(this.twoSelect));
        twoSelectTwo = false;
        this.twoSelect = twoSelectTwo;

        this.SelectList = false;
        this.expenseTwoType = [];
        //this.expenseForm.projectTwoCode = this.expenseForm.projectTwoName = "";
        this.workFlowData.projectNumber = "";
        this.expenseT = "--";
      }
      //判断是修改还是新增调用的方法
      if (!projectShow) {
        this.expenseForm.projectTwoCode = this.expenseForm.projectTwoName = "";
      }
      //       if (val == "BUSSINESS_TYPE_4") {
      // //         this.twoSelect=false;
      //         this.SelectList =true;
      //         this.workFlowData.parameters = '{type: "BUSSINESS_TYPE_4" }';
      //          this.expenseTwoType= [];
      //       } else if(val == "BUSSINESS_TYPE_1"){
      //         //非项目类型
      // //         this.twoSelect=true;
      //         this.SelectList =true;
      //         this.expenseTwoType= [];
      //         this.workFlowData.parameters = '{ type:"BUSSINESS_TYPE_1"}';
      //         // this.workFlowData.projectNumber = "";
      //       }else if(val == "BUSSINESS_TYPE_2"){
      //   //          this.twoSelect=true;
      //         this.SelectList =false;
      //         this.expenseTwoType= [];
      //         this.workFlowData.parameters = '{ type:"BUSSINESS_TYPE_2"}';
      //       }else if(val == "BUSSINESS_TYPE_3"){
      //   //          this.twoSelect=true;
      //         this.SelectList =false;
      //         this.expenseTwoType= [];
      //         this.workFlowData.parameters = '{ type:"BUSSINESS_TYPE_3"}';
      //       }
      this.getProjectTypeList();
      this.workData = Math.random();
    },
    //二级下拉框改变
    onTwoSelected(val) {
      this.workFlowData.projectNumber = val;
      // this.$refs.approvalData.$forceUpdate();
      this.workData = Math.random();
      this.expenseTwoType.forEach((v) => {
        if (v.projectCode == val) {
          this.expenseT = v.sumTotalAmount;
          this.expenseForm.projectTwoName = v.projectName;
          this.expenseForm.projectTwoCode = v.projectCode;
        }
      });
    },
    // 删除附件
    delFileBtn(fileList) {
      this.expenseForm.expenseFlieList = this.forSet(fileList);
    },
    // 上传附件
    upload(file) {
      // var data = eval("(" + file + ")");
      this.expenseForm.expenseFlieList = this.forSet(file);
    },
    // 循环设置
    forSet(list) {
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
    /**
     * 保存信息
     */
    saveFormData() {
      this.disabled = true;
      axios
        .post(
          option.base_path +
            "sz/expenditureApp/submitExpenditureAppInfoToDrafts",
          this.formData
        )
        .then((data) => {
          var that = this;
          if (data.data.flag == 0) {
            //解除禁用
            this.disabled = false;
            this.$message.success({
              message: data.data.message,
              type: "success",
              duration: 500,
              onClose() {
                that.$router.push({ path: "/approval/draftsList" });
              },
            });
          } else {
            this.$message.error(data.data.message);
          }
        });
    },
    /**
     * 提交
     */
    subFormData() {
      this.disabled = true;
      //校验审批组件必填项
      let workFlag = this.$refs["approvalData"].approvalValid();
      //校验页面表单必填项
      this.$refs.forms.validate((valid) => {
        if (valid && workFlag) {
          //申请总金额要等于收款方合计
          if (this.total == this.sumPayMoney) {
            if (this.radioDefault == "TRAVEL_APPLY") {
              if (this.$refs.travelTab.travelList.length != 0) {
                this.submitExpend();
              } else {
                this.$message.warning("行程详情不能为空");
                this.disabled = false;
              }
            } else {
              this.submitExpend();
            }
          } else {
            this.$message({
              message: "所有收款方收款金额合计必须等于申请支出总金额",
              type: "warning",
            });
            this.disabled = false;
          }
        } else {
          this.$message.warning("请填写必填项");
          this.disabled = false;
        }
      });
    },
    /**
     * 提交接口
     */
    submitExpend() {
      axios
        .post(
          option.base_path + "sz/expenditureApp/submitExpenditureAppInfo",
          this.formData
        )
        .then((data) => {
          if (data.data.flag == 0) {
            this.submitWorkFlow(data.data.data);
          }
        });
    },
    /**
     * 工作流
     */
    //
    submitWorkFlow(data) {
      this.disabled = true;
      axios
        .post(option.base_path + "sz/expenditureApp/submitWorkFlow", {
          appId: data, //appId	表单申请id
          parameters: '{type:"' + this.expenseForm.projectCode + '"}', //parameters	JSON格式字符串,
          dealingWithPeople: this.$refs.approvalData.approvalForm.nextOperCode, //dealingWithPeople	下一步操作人code
          opintion: this.$refs.approvalData.approvalForm.textarea, //opintion	审批意见
          processInstanceId: this.processInstanceId, //processInstanceId	流程实例ID,
          nextCode: this.$refs.approvalData.approvalForm.nextCode, //nextCode	操作流程代码
        })
        .then((data) => {
          if (data.data.flag == 0) {
            this.disabled = false;
            var that = this;
            this.$message.success({
              message: data.data.message,
              type: "success",
              duration: 400,
              onClose() {
                that.$router.push({ path: "/approval/myApplyList" });
              },
            });
          } else {
            this.$message.error(data.data.message);
          }
        });
    },
    /**
     * 取消
     */
    resetFormData() {
      this.$confirm("确定返回吗，所填写信息将不会保存", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$router.push({ path: "/approval/myApplyList" });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
      // this.$router.push({ path: "/approval/draftsList" });
    },
    /**
     * 页面详情接口
     */
    getExpenditureAppInfo() {
      axios
        .post(
          option.base_path + "sz/expenditureApp/getExpenditureAppInfoByAppId",
          {
            expenditureAppId: this.$route.query.pkId,
          }
        )
        .then((data) => {
          var list = [];
          if (data.data.flag == 0) {
            let d = data.data.data;
            this.total = d.totalAmount;
            this.capitalize = this.NumToChinese(d.totalAmount);
            //支出id
            this.expenditureAppId = d.expenditureAppId;
            this.expenseForm = {
              //必填项表单
              reimReason: d.expenditureAppName,
              projectCode: d.specialCode,
              projectName: d.specialName,
              projectTwoCode: d.prjCode,
              projectTwoName: d.prjName,
              expenseFlieList: [],
            };
            // if (d.specialCode == "PROJECT_TYPE_1") {
            //   this.twoSelect = true;
            //   this.expenseT = d.sumTotalAmount;
            //   this.getProjectTypeList(true, d.prjCode);
            //   this.workFlowData.parameters = '{ type: "PROJECT_TYPE_1" }';
            // } else {
            //   this.workFlowData.parameters = '{ type: "PROJECT_TYPE_2" }';
            // }
            this.onSelected(d.specialCode,true);
            //项目累计支出金额
            this.expenseT = d.sumTotalAmount;
            this.tableData = d.costData.costNormalList;
            this.workFlowData.projectNumber = d.prjCode;
            this.processInstanceId = d.processInstanceId;
            this.workFlowData.processInstanceId = d.processInstanceId;
            this.billNumber = d.invoiceNum;
            // this.capitalize = this.NumToChinese(d.totalAmount);
            this.workData = Math.random();

            this.radioDefault = d.costType;
            if (d.costType == "FINANCIAL_ADMINISTRATION") {
              this.isReimShow = this.travel = true;
              this.tableData = d.costData.costNormalFinanceList;
            } else if (d.costType == "TRAVEL_APPLY") {
              this.travel = false;
              this.$refs.travelTab.travelList = d.costData.travelRouteList; //行程明细列表数据
              this.$refs.travelTab.costCarfareList = d.costData.costCarfareList; //城市间交通费列表数据
              this.$refs.travelTab.costHotelList = d.costData.costHotelList; //住宿费列表数据
              this.$refs.travelTab.costOtherList = d.costData.costOtherList; //其他费用列表数据
            } else {
              this.isReimShow = false;
              this.travel = true;
            }
            this.tableData.forEach((v) => {
              list.push({
                content: v.normalName,
                dictTypeCode: v.typeOfExpenditure,
                dictTypeName: v.typeOfExpenditureName,
                isReims: v.isReimburse,
                isReimsName: "",
                money: v.normalAmount,
                remark: v.remarks,
                content: v.normalName,
              });
            });
            this.tableData = list; //费用明细
            this.$refs.payData.payReceivablesData = d.payReceivablesData; //收款方
            if (d.attList.length > 0) {
              var expenseFlieList = [];
              var newList = [];
              d.attList.forEach((n) => {
                for (let k in n) {
                  if (k === "attName") {
                    n["attName"] = n[k];
                  }
                }
                // this.form.projectFlieList.push(n)
                expenseFlieList.push(n);
                newList = [];
                expenseFlieList.forEach((x) => {
                  newList.push({
                    fileId: x.attId,
                    fileName: x.attName,
                    name: x.attName,
                  });
                });
              });
              this.expenseForm.expenseFlieList = this.forSet(newList);
            }
            if (d.taskKey == "activitiStartTask") {
              this.isReturn = false;
            }
          }
        });
    },
    //金额转大写
    NumToChinese(Num) {
      Num = Num + "";
      for (let i = Num.length - 1; i >= 0; i--) {
        Num = Num.replace(",", ""); //替换tomoney()中的“,”
        Num = Num.replace(" ", ""); //替换tomoney()中的空格
      }
      Num = Num.replace("￥", ""); //替换掉可能出现的￥字符
      if (isNaN(Num)) {
        //验证输入的字符是否为数字
        this.$message({
          message: "请检查小写金额是否正确",
          type: "warning",
        });
        return;
      }
      //---字符处理完毕，开始转换，转换采用前后两部分分别转换---//
      let part = String(Num).split(".");
      let newchar = "";
      //小数点前进行转化
      for (let i = part[0].length - 1; i >= 0; i--) {
        if (part[0].length > 10) {
          this.$message({
            message: "位数过大，无法计算",
            type: "warning",
          });
          return "";
        } //若数量超过拾亿单位，提示
        let tmpnewchar = "";
        let perchar = part[0].charAt(i);
        switch (perchar) {
          case "0":
            tmpnewchar = "零" + tmpnewchar;
            break;
          case "1":
            tmpnewchar = "壹" + tmpnewchar;
            break;
          case "2":
            tmpnewchar = "贰" + tmpnewchar;
            break;
          case "3":
            tmpnewchar = "叁" + tmpnewchar;
            break;
          case "4":
            tmpnewchar = "肆" + tmpnewchar;
            break;
          case "5":
            tmpnewchar = "伍" + tmpnewchar;
            break;
          case "6":
            tmpnewchar = "陆" + tmpnewchar;
            break;
          case "7":
            tmpnewchar = "柒" + tmpnewchar;
            break;
          case "8":
            tmpnewchar = "捌" + tmpnewchar;
            break;
          case "9":
            tmpnewchar = "玖" + tmpnewchar;
            break;
        }
        switch (part[0].length - i - 1) {
          case 0:
            tmpnewchar = tmpnewchar + "元";
            break;
          case 1:
            if (perchar != 0) tmpnewchar = tmpnewchar + "拾";
            break;
          case 2:
            if (perchar != 0) tmpnewchar = tmpnewchar + "佰";
            break;
          case 3:
            if (perchar != 0) tmpnewchar = tmpnewchar + "仟";
            break;
          case 4:
            tmpnewchar = tmpnewchar + "万";
            break;
          case 5:
            if (perchar != 0) tmpnewchar = tmpnewchar + "拾";
            break;
          case 6:
            if (perchar != 0) tmpnewchar = tmpnewchar + "佰";
            break;
          case 7:
            if (perchar != 0) tmpnewchar = tmpnewchar + "仟";
            break;
          case 8:
            tmpnewchar = tmpnewchar + "亿";
            break;
          case 9:
            tmpnewchar = tmpnewchar + "拾";
            break;
        }
        newchar = tmpnewchar + newchar;
      }
      //小数点之后进行转化
      if (Num.indexOf(".") != -1) {
        if (part[1].length > 2) {
          this.$message({
            message: "小数点之后只能保留两位,系统将自动截断",
            type: "warning",
          });
          part[1] = part[1].substr(0, 2);
        }
        for (let i = 0; i < part[1].length; i++) {
          let tmpnewchar = "";
          let perchar = part[1].charAt(i);
          switch (perchar) {
            case "0":
              tmpnewchar = "零" + tmpnewchar;
              break;
            case "1":
              tmpnewchar = "壹" + tmpnewchar;
              break;
            case "2":
              tmpnewchar = "贰" + tmpnewchar;
              break;
            case "3":
              tmpnewchar = "叁" + tmpnewchar;
              break;
            case "4":
              tmpnewchar = "肆" + tmpnewchar;
              break;
            case "5":
              tmpnewchar = "伍" + tmpnewchar;
              break;
            case "6":
              tmpnewchar = "陆" + tmpnewchar;
              break;
            case "7":
              tmpnewchar = "柒" + tmpnewchar;
              break;
            case "8":
              tmpnewchar = "捌" + tmpnewchar;
              break;
            case "9":
              tmpnewchar = "玖" + tmpnewchar;
              break;
          }
          if (i == 0) tmpnewchar = tmpnewchar + "角";
          if (i == 1) tmpnewchar = tmpnewchar + "分";
          newchar = newchar + tmpnewchar;
        }
      }
      //替换所有无用汉字
      while (newchar.search("零零") != -1)
        newchar = newchar.replace("零零", "零");
      newchar = newchar.replace("零亿", "亿");
      newchar = newchar.replace("亿万", "亿");
      newchar = newchar.replace("零万", "万");
      newchar = newchar.replace("零元", "元");
      newchar = newchar.replace("零角", "");
      newchar = newchar.replace("零分", "");
      if (
        newchar.charAt(newchar.length - 1) == "元" ||
        newchar.charAt(newchar.length - 1) == "角"
      )
        newchar = newchar + "整";
      //处理如果是无内容的给出--
      if (newchar == "元整") {
        newchar = "--";
      }
      //  document.write(newchar);
      return newchar;
    },
    // 返回输入建议方法
    querySearch(queryString, cb) {
      console.log(queryString);
      let restaurants = this.expenseTwoType;
      let results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      cb(results);
    },
    // 筛选匹配的姓名数据
    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) !==
          -1
        );
      };
    },
    // 选择一项
    handleSelect(item) {
      debugger
      let manList = this.expenseTwoType;
      manList.forEach((n) => {});
      console.log(item);
      this.onTwoSelected(item.projectCode);
      // this.params.projectNumber = value;
      // // 获取项目名称及code
      // this.project.find(item => {
      //   if (item.projectCode == value) {
      //     this.loanInfo.prjName = item.projectName;
      //     return;
      //   }
      // });
      // this.reloadSele = Math.random();
      this.$emit("choseMan", this.contractMap);
    },
  },
};
</script>
<style lang="css" scoped>
.user_info {
  margin-left: 30px;
}
.yt-read-text {
  color: #003465;
  font-weight: bold;
}
.radio-row .el-form-item__label {
  line-height: 25px;
}
</style>

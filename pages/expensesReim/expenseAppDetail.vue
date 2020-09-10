<template>
  <div class="yt-dome-container">
    <el-form ref="approvalForm" :model="workFlowFlag">
      <topTip>
        <template>
          <el-row>
            <el-col :span="14" class="top-tip" style="text-align: left;">
              <div>
                <span style="color: #417095;font-size: 16px;font-weight: bolder;">基本信息</span>
              </div>
            </el-col>
            <el-col :span="9" style="text-align: right;">
              <div>
                <label style="margin-right:20px"><span style="color:rgb(65, 112, 149);font-weight:bold;letter-spacing:4px">单据编号：</span><span>{{expenditureAppNum}}</span></label>
                <label><span style="color:rgb(65, 112, 149);font-weight:bold;letter-spacing:4px">申请日期：</span><span>{{applicantTime}}</span></label>
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
              <span>{{formData.applicantUserName}}</span>
            </label>
          </el-col>
          <el-col :span="6">
            <label class="yt-read-text"><span style="letter-spacing: 40px;">部</span>门：</label>
            <span>{{formData.applicantUserDeptName}}</span>
          </el-col>
          <el-col :span="6">
            <label class="yt-read-text"><span style="letter-spacing: 40px;">职</span>务：</label>
            <span>{{formData.applicantUserPositionName}}</span>
          </el-col>
          <el-col :span="6">
            <label class="yt-read-text"><span style="letter-spacing: 40px;">电</span>话：</label>
            <span>{{formData.applicantUserPhone}}</span>
          </el-col>
        </el-row>
        <el-row style="margin-top:20px">
          <el-col :span="6">
            <span class="yt-read-text" style="letter-spacing:5px">所属项目：</span>
            <span>{{specialName}}</span>
          </el-col>
          <div>
            <el-col :span="8">
              <span class="yt-read-text" style="letter-spacing:5px">项目名称：</span>
              <span>{{prjName==""?"--":prjName}}</span>
            </el-col>
            <el-col :span="6">
              <span class="yt-read-text">项目累计支出总额：</span>
              <span>{{sumTotalAmount |moneyFormat}}元</span>
            </el-col>
          </div>

        </el-row>
        <el-row style="margin-top:20px;">
          <el-col>
            <span class="yt-read-text" style="letter-spacing:5px">支出事由：</span>
            <span>{{expenditureAppName}}</span>
          </el-col>
        </el-row>
        <el-row style="margin-top:20px">
          <el-col>
            <span class="yt-read-text" style="letter-spacing:5px">单据样式：</span>
            <span>{{costTypeName}}</span>
          </el-col>
        </el-row>
      </div>
      <div style="margin-top:20px;height: 5px;background-color: #f3f3f3;border-top: 1px solid #dfe6f3;border-bottom: 1px solid #dfe6f3;"></div>
      <costDetailTable v-show="show" :tableData="tableData" :isApply="false" :isReimShow="isReimShow" />
      <showTravelPay v-show="!show" ref="travelTab" :lookType="'2'"></showTravelPay>
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
            <span class="yt-read-text">申请支出总金额：</span><span>{{total |moneyFormat}}元</span>
          </el-col>
          <el-col :span="8">
            <span class="yt-read-text">人民币大写：</span><span>{{capitalize}}</span>
          </el-col>
        </el-row>
        <el-row style="margin-top:20px">
          <el-col :span="9">
            <!-- <el-form> -->
            <div>
              <span style="margin-left:35px">附单据张数：</span> <span>{{billNumber}}</span>
            </div>
            <!-- </el-form> -->
          </el-col>
        </el-row>
      </div>
      <div style="margin-top:20px;height: 5px;background-color: #f3f3f3;border-top: 1px solid #dfe6f3;border-bottom: 1px solid #dfe6f3;"></div>
      <topTip>
        <template>
          <el-row>
            <el-col :span="15" class="top-tip" style="text-align: left;">
              <div>
                <span style="color: #417095;font-size: 16px;font-weight: bolder;">相关附件</span>
              </div>
            </el-col>
          </el-row>
          <el-form-item label="支出相关附件：" label-width="115px" style="margin-left:10px;">
            <span v-show="!fileFlag">暂无附件</span>
            <lookFiles v-show="fileFlag" v-for="item in expenseForm.expenseFlieList" :key="item.fileId" :fileName="item.fileName" :fileId="item.fileId" :type="1">
            </lookFiles>
          </el-form-item>
        </template>
      </topTip>
      <div style="margin-top:20px;height: 5px;background-color: #f3f3f3;border-top: 1px solid #dfe6f3;border-bottom: 1px solid #dfe6f3;"></div>
      <beneficiary ref="payData" :lookType="'2'"></beneficiary>
      <div v-if="displayComp">
        <div style="margin-top:20px;height: 5px;background-color: #f3f3f3;border-top: 1px solid #dfe6f3;border-bottom: 1px solid #dfe6f3;"></div>
        <topTip>
          <template>
            <el-row>
              <el-col :span="15" class="top-tip" style="text-align: left;">
                <div>
                  <span style="color: #417095;font-size: 16px;font-weight: bolder;">核算账套信息</span>
                </div>
              </el-col>
            </el-row>
          </template>
        </topTip>

        <el-row style="padding-bottom:20px;margin-left:30px" v-show="this.$route.query.approvalState=='1'">
          <!-- <span style="color:red">*</span> -->
            <label class="yt-read-text"><span style="letter-spacing: 5px;">付款公</span>司：</label>
          <!-- <el-select v-model="compVal" size="small">
            <el-option v-for="item in compList" :key="item.accountId" :label="item.compName" :value="item.accountId">
            </el-option>
          </el-select> -->
          <!-- <el-form-item
            label="付款公司："
            label-width="140px"
            prop="compVal"
          > -->
          <!-- :rules="{ required: defType, message: '请填写客户名称', trigger: 'blur' }" -->
          <!-- <div style="width: 300px;display: inline-block;"> -->
            <el-autocomplete
              class="inline-input"
              v-model="compName"
              placeholder="请输入"
              :fetch-suggestions="getCompList"
              :trigger-on-focus="false"
              clearable
            ></el-autocomplete>
          <!-- </div> -->
            <!-- <span v-else>{{form.customerName}}</span> -->
          <!-- </el-form-item> -->
        </el-row>
        <el-row style="padding-bottom:20px;margin-left:30px" v-show="this.$route.query.approvalState=='2'">
          <label class="yt-read-text"><span style="letter-spacing: 5px;">付款公</span>司：</label>
          <span>{{ this.formData.compName==""?"--":this.formData.compName}}</span>
        </el-row>
      </div>
      <div style="margin-top:20px;height: 5px;background-color: #f3f3f3;border-top: 1px solid #dfe6f3;border-bottom: 1px solid #dfe6f3;"></div>
      <!-- <el-form ref="approvalForm"> -->
      <approvalSelect ref="approvalData" @flowChange="flowChange" v-show="this.$route.query.approvalState=='1'" v-if="approvalFlag" :key="workData" :params="workFlowData"></approvalSelect>
      <!-- </el-form> -->
      <div v-show="this.$route.query.approvalState=='2'">
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
        <approvalDetail v-if="approvalFlag" :processInstanceId="workFlowData.processInstanceId"></approvalDetail>
      </div>
      <div style="text-align: center;padding-bottom:20px" v-show="this.$route.query.approvalState=='1'">
        <button :disabled="disabled" v-if="taskKey" @click="saveLotPayDetailInfo" type="button" class="el-button yt-bottom-btn el-button--primary"><span>支付完成，流程结束</span></button>
        <button :disabled="disabled" v-else @click="saveLotPayDetailInfo" type="button" class="el-button yt-bottom-btn el-button--primary"><span>提交</span></button>

        <button type="button" class="el-button yt-bottom-btn el-button--default" @click="returnBtn"> <span>取消</span></button>
      </div>
      <div v-if='this.$route.query.isShow == 1'  style="text-align: center;padding-bottom:20px;margin-top:20px">
        <button type="button" class="el-button yt-bottom-btn el-button--default" @click="returnBtn"> <span>关闭</span></button>
      </div>
      <div v-else v-show="this.$route.query.approvalState=='2'" style="text-align: center;padding-bottom:20px;margin-top:20px">
        <button type="button" class="el-button yt-bottom-btn el-button--primary" @click="documentSticker"> <span>打印单据粘贴单</span></button>
        <button type="button" v-if="printExpend" class="el-button yt-bottom-btn el-button--primary" @click="expenditureVoucher"> <span>打印支出凭单</span></button>
        <button type="button" v-if="printExpDetail" class="el-button yt-bottom-btn el-button--primary" @click="printDetails"> <span>打印支出凭单（明细）</span></button>
        <button type="button" class="el-button yt-bottom-btn el-button--default" @click="returnBtn"> <span>关闭</span></button>
      </div>

    </el-form>
  </div>
</template>
<script>
import topTip from "../../components/topTip.vue";
import axios from "../../service/http";
import { option } from "../../static/config";
import costDetailTable from "../../components/costDetailTable.vue";
import approvalSelect from "../../components/ApprovalSelect/ApprovalSelect";
import approvalDetail from "../../components/ApprovalDetail/ApprovalDetail";
import beneficiary from "../../components/beneficiary.vue";
import upload from "../../components/upload.vue";
import lookFiles from "../../components/lookFiles.vue";
import showTravelPay from "../../components/showTravelPay.vue";
export default {
  data() {
    return {
      formData: {
        applicantUserName: "",
        applicantUserDeptName: "",
        applicantUserPositionName: "",
        applicantUserPhone: "",
      },
      workFlowFlag: {
        works: ""
      },
      approvalFlag: false,
      realName: "",
      deptName: "",
      positionName: "",
      userPhone: "",
      expenditureAppNum: "",
      applicantTime: "",
      specialName: "",
      prjName: "",
      sumTotalAmount: "",
      expenditureAppName: "",
      costTypeName: "",
      tableData: [],
      total: 0,
      billNumber: 0,
      workFlowData: {
        //工作流参数
        processInstanceId: "",
        parameters: "",
        businessCode: "SZ_EXPENDITURE_APP"
        // projectNumber: ""
      },
      workData: 0,
      twoSelect: false,
      compList: [],
      compName:"",
      compVal: "",
      approvalState: "",
      capitalize: "", //金额大写
      isReimShow: false,
      expenseForm: {
        expenseFlieList: []
      },
      show: true,
      fileFlag: true, //是否显示暂无附件
      displayComp: false, //核算账套信息  权限控制
      printExpend: false, //打印支出凭单 权限控制
      printExpDetail: false, //打印支出凭单(明细) 权限控制
      taskKey: false, //流程为最后一步要显示的按钮
      disabled: false
    };
  },
  watch: {
    "expenseForm.expenseFlieList": {
      handler(newVal) {
        if (newVal.lemgth == 0) {
        }
      },
      immediate: true
    }
  },
  filters: {
    moneyFormat(num) {
      if (num) {
        num = Number(num);
        num = (num.toFixed(2) + "").replace(
          /\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,
          "$&,"
        );
      }
      return num || "0.00";
    }
  },
  mounted() {
    this.accessControlFun();
    this.getExpenditureAppInfo();
    this.getCompList();
  },
  components: {
    topTip,
    costDetailTable,
    approvalSelect,
    beneficiary,
    approvalDetail,
    lookFiles,
    upload,
    showTravelPay
  },
  computed: {
    subData() {
      return {
        appId: this.$route.query.pkId, //appId 表单申请id
        compCode: this.compName,
        parameters: '{totalAmount:"' + this.total + '"}', //parameters JSON格式字符串,
        dealingWithPeople: this.$refs.approvalData.approvalForm.nextOperCode, //dealingWithPeople 下一步操作人code
        opintion: this.$refs.approvalData.approvalForm.textarea, //opintion 审批意见
        processInstanceId: this.workFlowData.processInstanceId, //processInstanceId 流程实例ID,
        nextCode: this.$refs.approvalData.approvalForm.nextCode, //nextCode 操作流程代码
        appType: "EXPENDITURE_APP",
        payDetailList: [],
      };
    }
  },
  methods: {
    //调用权限控制接口
    accessControlFun() {
      axios
        .post(option.base_path + "index/getFuncListByMenuId", {
          dynamicKey: "",
          systemId: 69
        })
        .then(data => {
          data.data.data.forEach(v => {
            if (v.funcCode == "displayComp") {
              this.displayComp = true;
            } else if (v.funcCode == "printExpend") {
              this.printExpend = true;
            } else if (v.funcCode == "printExpDetail") {
              this.printExpDetail = true;
            }
          });
        });
    },
    flowChange(val) {
      this.formData.workFlowFlag = val;
    },
    // 打印支出凭单（明细）
    printDetails() {
      this.$router.replace({
        path: "/priorApp/printDetails",
        query: {
          // pkId:this.$route.query.pkId,
          approvalState:'2',
          expenditureAppId: this.$route.query.pkId,
          costType: this.formData.costType,
          jump:'1'
        }
      });
    },
    //支出凭单
    documentSticker() {
      this.$router.replace({
        path: "/expensesReim/documentSticker",
        query: {
          approvalState:'2',
          expenditureAppId: this.$route.query.pkId,
          costType: this.formData.costType,
          jump:'1'
        }
      });
    },
    // 单据粘贴单
    expenditureVoucher() {
      this.$router.replace({
        path: "/expensesReim/print/expenditureVoucher",
        query: {
          approvalState:'2',
          expenditureAppId: this.$route.query.pkId,
          costType: this.formData.costType,
          jump:'1'
        }
      });
    },
    //返回
    returnBtn() {
      if(this.$route.query.xx == 1){
        this.$router.push({ path: "/projectManager/expendProject" });
      }else{
        this.$router.push({ path: "/priorApp/expenditureApp" });
      }
      this.$route.query.isShow = 2
    },
    // 循环设置
    forSet(list) {
      let newList = [];
      list.forEach(n => {
        newList.push({
          fileId: n.fileId,
          fileName: n.fileName,
          name: n.fileName
        });
      });
      return newList;
    },
    getExpenditureAppInfo() {
      axios
        .post(
          option.base_path + "sz/expenditureApp/getExpenditureAppInfoByAppId",
          {
            expenditureAppId: this.$route.query.pkId
            // expenditureAppId: 751
          }
        )
        .then(data => {
          if (data.data.flag == 0) {
            let d = data.data.data;
            this.approvalFlag = true;
            this.formData = d;
            let list = [];
            this.expenditureAppNum = d.expenditureAppNum;
            this.applicantTime = d.applicantTime;
            this.specialName = d.specialName;
            this.prjName = d.prjName;
            if (d.specialCode == "PROJECT_TYPE_1") {
              this.twoSelect = true;
            }
            if (d.taskKey == "activitiEndTask") {
              this.taskKey = true;
            }
            this.sumTotalAmount = d.sumTotalAmount;
            this.expenditureAppName = d.expenditureAppName;
            this.costTypeName = d.costTypeName;
            if (d.costType == "NORMAL_APPLY") {
              this.tableData = d.costData.costNormalList;
            } else if (d.costType == "TRAVEL_APPLY") {
              this.$refs.travelTab.travelList = d.costData.travelRouteList; //行程明细列表数据
              this.$refs.travelTab.costCarfareList = d.costData.costCarfareList; //城市间交通费列表数据
              this.$refs.travelTab.costHotelList = d.costData.costHotelList; //住宿费列表数据
              this.$refs.travelTab.costOtherList = d.costData.costOtherList; //其他费用列表数据
              this.show = false;
            } else {
              this.isReimShow = true;
              this.show = true;
              this.tableData = d.costData.costNormalFinanceList;
            }
            if (d.attList.length > 0) {
              var expenseFlieList = [];
              var newList = [];
              d.attList.forEach(n => {
                for (let k in n) {
                  if (k === "attName") {
                    n["attName"] = n[k];
                  }
                }
                expenseFlieList.push(n);
                newList = [];
                expenseFlieList.forEach(x => {
                  newList.push({
                    fileId: x.attId,
                    fileName: x.attName,
                    name: x.attName
                  });
                });
              });
              this.expenseForm.expenseFlieList = this.forSet(newList);
            } else {
              this.fileFlag = false;
            }
            this.tableData.forEach(v => {
              list.push({
                content: v.normalName,
                dictTypeCode: v.typeOfExpenditure,
                dictTypeName: v.typeOfExpenditureName,
                isReims: v.isReimburse,
                isReimsName: "",
                money: v.normalAmount,
                remark: v.remarks
              });
            });
            this.tableData = list;
            this.total = d.totalAmount;
            this.billNumber = d.invoiceNum == "" ? "0" : d.invoiceNum;
            this.capitalize = this.NumToChinese(d.totalAmount);
            //工作流参数
            this.workFlowData.processInstanceId = d.processInstanceId;
            this.workFlowData.parameters =
              '{totalAmount:"' + d.totalAmount + '"}';
            this.$refs.payData.payReceivablesData = d.payReceivablesData; //收款方
          }
        });
    },
    // 付款公司输入关键字获取公司名称
    getCompList(queryString,callback) {
      let that =this;
      // debugger
      // var lists = [{}];
      let map = {
        compName: queryString,
      };
      axios.post(option.base_path + "db/capital/getAllBankList",map).then(res => {
        if (res.data.flag == 0) {
          // that.compList = res.data.data;
          let complists = res.data.data;
          for (let i of complists) {
            i.value = i.compName; //将想要展示的数据作为value
          }
          // lists = complists;
          callback(complists);
          // this.compList.forEach(v => {
          //   if (v.accountId == "62") {
          //     this.compVal = v.accountId;
          //   }
          // });
        }
      });
    },
    saveLotPayDetailInfo() {
      this.disabled = true;
      let workFlag = this.$refs["approvalData"].approvalValid();
      if (workFlag) {
        axios
          .post(
            option.base_path +
              "sz/payDetailBillingVoucher/saveLotPayDetailInfo",
            this.subData
          )
          .then(data => {
            if (data.data.flag == 0) {
              this.submitWorkFlow(this.disabled);
            }
          });
      } else {
        this.disabled = false;
      }
    },
    submitWorkFlow(disabled) {
      axios
        .post(
          option.base_path + "sz/expenditureApp/submitWorkFlow",
          this.subData
        )
        .then(data => {
          if (data.data.flag == 0) {
            var that = this;
            this.$message.success({
              message: data.data.message,
              type: "success",
              duration: 300,
              onClose() {
                that.$router.push({ path: "/priorApp/expenditureApp" });
              }
            });
          }
        });
    },
    //金额大写
    NumToChinese(Num) {
      Num = Num + "";
      for (let i = Num.length - 1; i >= 0; i--) {
        Num = Num.replace(",", ""); //替换tomoney()中的“,”
        Num = Num.replace(" ", ""); //替换tomoney()中的空格
      }
      Num = Num.replace("￥", ""); //替换掉可能出现的￥字符
      if (isNaN(Num)) {
        //验证输入的字符是否为数字
        $yt_alert_Model.prompt("请检查小写金额是否正确", 2000);
        return;
      }
      //---字符处理完毕，开始转换，转换采用前后两部分分别转换---//
      let part = String(Num).split(".");
      let newchar = "";
      //小数点前进行转化
      for (let i = part[0].length - 1; i >= 0; i--) {
        if (part[0].length > 10) {
          $yt_alert_Model.prompt("位数过大，无法计算", 2000);
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
          $yt_alert_Model.prompt("小数点之后只能保留两位,系统将自动截段", 2000);
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
    }
  }
};
</script>
<style lang="css">
.user_info {
  margin-left: 30px;
}
.yt-read-text {
  color: #003465;
  font-weight: bold;
}
</style>

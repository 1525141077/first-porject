<template>
  <div class="yt-dome-container">
    <!-- 顶部信息START -->
    <topTip>
      <template>
        <el-row>
          <el-col :span="13" class="top-tip" style="text-align: left;">
            <div>
              <span style="color: #417095;font-size: 16px;font-weight: bolder;">基本信息</span>
            </div>
          </el-col>
          <el-col :span="10" style="text-align: right;">
            <div>
              <label style="margin-right:20px">
                <span style="color:#003465;letter-spacing:4px">单据编号：</span>
                <span>{{loanAppNum}}</span>
              </label>
              <label>
                <span style="color:#003465;letter-spacing:4px">申请日期：</span>
                <span>{{applicantTime}}</span>
              </label>
            </div>
          </el-col>
        </el-row>
      </template>
    </topTip>
    <!-- 顶部信息END -->
    <el-form :model="loanInfo" ref="loanInfo">
      <div class="baseInfo">
        <el-row>
          <el-col :span="6">
            <label>
              <span class="yt-read-text" style="letter-spacing:5px">申请人：</span>
              <span>{{loanInfo.applicantUserName}}</span>
            </label>
          </el-col>
          <el-col :span="6">
            <label class="yt-read-text">
              <span style="letter-spacing: 40px;">部</span>门：
            </label>
            <span>{{loanInfo.applicantUserDeptName}}</span>
          </el-col>
          <el-col :span="6">
            <label class="yt-read-text">
              <span style="letter-spacing: 40px;">职</span>务：
            </label>
            <span>{{loanInfo.applicantUserPositionName}}</span>
          </el-col>
          <el-col :span="6">
            <label class="yt-read-text">
              <span style="letter-spacing: 40px;">电</span>话：
            </label>
            <span>{{loanInfo.applicantUserPhone}}</span>
          </el-col>
        </el-row>
        <el-row style="margin-top:20px">
          <el-col :span="24">
            <label class="yt-read-text">
              <span style="letter-spacing: 5px;">借款事由：</span>
            </label>
            <span>{{loanInfo.loanAppName}}</span>
          </el-col>
        </el-row>
        <el-row style="margin-top:20px">
          <el-col :span="8">
            <label class="yt-read-text">
              <span style="letter-spacing: 5px;">所属项目：</span>
            </label>
            <span>{{loanInfo.type}}</span>
          </el-col>
          <el-col :span="12">
            <label class="yt-read-text">
              <span style="letter-spacing: 5px;">项目名称：</span>
            </label>
            <span>{{loanInfo.prjName}}</span>
          </el-col>
        </el-row>
        <el-row style="margin-top:20px">
          <el-col :span="8">
            <label class="yt-read-text">
              <span>是否有未结清账单：</span>
            </label>
            <span>{{isSettleInfo.noCloseOut}}</span>
          </el-col>
          <el-col :span="14">
            <label class="yt-read-text">
              <span>未清账借款单编号：</span>
            </label>
            <span>{{isSettleInfo.loanAppNumStr}}</span>
          </el-col>
        </el-row>
      </div>
      <!-- 借款信息 -->
      <top-tip>
        <span style="color: #417095;font-size: 16px;font-weight: bolder;">借款信息</span>
      </top-tip>
      <!-- 借款信息表单 -->
      <div class="baseInfo">
        <el-row>
          <el-col :span="12">
            <label class="yt-read-text">
              <span class="yt-read-text" style="letter-spacing:5px">收款方：</span>
            </label>
            <span>{{loanInfo.receiptType}}</span>
          </el-col>
          <el-col :span="12">
            <label class="yt-read-text">
              <span>借款人/单位名称：</span>
            </label>
            <span>{{loanInfo.borrower}}</span>
          </el-col>
        </el-row>
        <el-row style="margin-top:20px">
          <el-col :span="12">
            <label class="yt-read-text">
              <span style="letter-spacing:5px">借款金额：</span>
            </label>
            <span>{{loanInfo.loanAmount | moneyFormat}}</span>
          </el-col>
          <el-col :span="12">
            <label class="yt-read-text">
              <span>人民币大写：</span>
            </label>
            <span>{{loanMoneyChinese}}</span>
          </el-col>
        </el-row>
        <el-row style="margin-top:20px">
          <el-col :span="12">
            <label class="yt-read-text">
              <span style="letter-spacing:5px">借款期限：</span>
            </label>
            <span>{{loanInfo.loanTerm}}</span>
          </el-col>
          <el-col :span="12">
            <label class="yt-read-text">
              <span>预计还款日期：</span>
            </label>
            <span>{{loanInfo.expectRepaymentTime}}</span>
          </el-col>
        </el-row>
        <el-row style="margin-top:20px">
          <el-col :span="6">
            <label class="yt-read-text">
              <span style="letter-spacing:5px">付款方式：</span>
            </label>
            <span>{{loanInfo.paymentMethod}}</span>
          </el-col>
          <el-col :span="6">
            <label class="yt-read-text">
              <span style="letter-spacing:5px">开户行：</span>
            </label>
            <span>{{loanInfo.openBank}}</span>
          </el-col>
          <el-col :span="12">
            <label class="yt-read-text">
              <span style="letter-spacing:5px">银行账号：</span>
            </label>
            <span>{{loanInfo.bankAccount}}</span>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <!-- 审批 -->
    <el-form>
      <approvalSelect
        v-show="this.$route.query.approvalState=='1'"
        v-if="approvalFlag"
        :key="workData"
        ref="approvalData"
        :params="workFlowData"
      ></approvalSelect>
    </el-form>
    <!-- 流程日志 -->
    <div v-show="this.$route.query.approvalState=='2'">
      <topTip>
        <template>
          <el-row>
            <el-col :span="15" class="top-tip" style="text-align: left;">
              <div>
                <span style="color: #417095;font-size: 16px;font-weight: bolder;">流程日志</span>
              </div>
            </el-col>
          </el-row>
        </template>
      </topTip>
      <approvalDetail v-if="approvalFlag" :processInstanceId="workFlowData.processInstanceId"></approvalDetail>
    </div>
    <div
      style="text-align: center;padding-bottom:20px"
      v-show="this.$route.query.approvalState=='1'"
    >
      <button type="button" class="el-button yt-bottom-btn el-button--primary">
        <span @click="saveLotPayDetailInfo()">提交</span>
      </button>
      <button type="button" class="el-button yt-bottom-btn el-button--default">
        <span @click="returnBtn">取消</span>
      </button>
    </div>
    <el-row>
      <el-col :span="24" v-if="this.$route.query.isShow == 1" class="btn" v-show="this.$route.query.approvalState=='2'">
        <button type="button" class="el-button yt-bottom-btn el-button--default">
          <span @click="exit">关闭</span>
        </button>
      </el-col>
      <el-col :span="24" v-else  class="btn" v-show="this.$route.query.approvalState=='2'">
        <button type="button" class="el-button yt-bottom-btn el-button--primary">
          <span @click="borrow">打印借款凭证</span>
        </button>
        <button type="button" class="el-button yt-bottom-btn el-button--default">
          <span @click="exit">关闭</span>
        </button>
      </el-col>

    </el-row>
  </div>
</template>

<script>
import approvalSelect from "@/components/ApprovalSelect/ApprovalSelect";
import topTip from "@/components/topTip";
import axios from "../../service/http";
import { option } from "../../static/config";
import approvalDetail from "../../components/ApprovalDetail/ApprovalDetail";
export default {
  data() {
    return {
      loanInfo: {
        //申请人
        applicantUserName: "",
        // 部门
        applicantUserDeptName: "",
        // 职务
        applicantUserPositionName: "",
        // 电话
        applicantUserPhone: "",
        // 借款事由
        loanAppName: "",
        // 项目类型名称
        type: "",
        // 所属项目
        prjName: "",

        // 收款方code RECEIPT_TYPE_1个人 RECEIPT_TYPE_2单位
        receiptType: "",
        // 借款人/单位名称
        borrower: "",
        // 借款金额
        loanAmount: "",
        // 人民币大写自己转
        // 借款期限name      借款期限没有code
        loanTerm: "",
        // 预计还款日期
        expectRepaymentTime: "",
        // 付款方式code        付款方式没有name
        paymentMethod: "",
        // 开户行
        openBank: "",
        // 银行账号
        bankAccount: "",
        // 提交页面没有付款公司
        // 事前申请单id
        advanceAppId: "",
        // 事前申请单编号
        advanceAppNum: "",
        //JSON格式字符串
        parameters: "",
        //操作流程code
        nextCode: "",
        //审批人code
        dealingWithPeople: "",
        //审批意见
        opintion: "",
        //流程实例ID
        processInstanceId: ""
      },
      // 未结清账单
      isSettleInfo: {
        // 是否有未结清账单
        noCloseOut: "",
        // 未清账借款单编号
        loanAppNumStr: ""
      },
      // 单据编号
      loanAppNum: "提交后自动生成",
      // 申请日期
      applicantTime: "提交后自动生成",
      // 金额大写
      loanMoneyChinese: "",
      // 显示切换审批和日志
      approvalFlag: false,
      // 审批组件状态
      workData: 0,
      workFlowData: {
        //工作流参数
        processInstanceId: "",
        parameters: "",
        businessCode: "SZ_EXPENDITURE_APP"
        // projectNumber: ""
      },
      asd: {}
    };
  },
  created() {
    // 获取登陆人基本信息
    this.getBaseInfo();
    this.getLoanAppInfoDetailByLoanAppId();
  },
  computed: {
  },
  methods: {
    // 格式化金额
    moneyFilter(s, n) {
      let lose = ""; //负号
      // 判断是否是数字
      if (typeof s !== "number" && isNaN(s)) {
        return "";
      }
      if (s != undefined && s != "") {
        if (s < 0) {
          //判断是否是负数
          s = (s + "").substring(1); //截取-号
          lose = "-";
        }
        n = n > 0 && n <= 20 ? n : 2;
        s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
        let l = s
            .split(".")[0]
            .split("")
            .reverse(),
          r = s.split(".")[1];
        let t = "";
        for (let i = 0; i < l.length; i++) {
          t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? "," : "");
        }
        return (
          lose +
          "" +
          t
            .split("")
            .reverse()
            .join("") +
          "." +
          r
        ); //拼接
      } else if (s == "") {
        return "";
      } else if (s == 0) {
        return "0.00"; //拼接
      }
    },
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
    },

    // 获取登录人基本信息
    getBaseInfo() {
      axios
        .post(option.base_path + "index/getCurrentUserInfo", this.userInfo)
        .then(data => {
          if (data.data.flag == 0) {
            this.loanInfo.applicantUserName = data.data.data.realName;
            this.loanInfo.applicantUserDeptName = data.data.data.deptName;
            this.loanInfo.applicantUserPositionName =
              data.data.data.positionName;
            this.loanInfo.applicantUserPhone = data.data.data.userPhone;
          }
        });
    },
    // 关闭
    exit() {
      if(this.$route.query.xx == 1){
        this.$router.push({ path: "/projectManager/expendProject" });

      }else{
        this.$router.push({ path: "/expensesReim/appLoanApplication" });
      }
      this.$route.query.isShow = 1

    },
    //返回
    returnBtn() {
      this.$router.push({ path: "/expensesReim/appLoanApplication" });
    },
    //打印借款单
    borrow(){
         this.$router.replace({
        path: "/expensesReim/loanBill",
        query: {
          loanAppId: this.$route.query.pkId,
        }
      });
    },
    // 获取数据
    getLoanAppInfoDetailByLoanAppId() {
      axios
        .post(option.base_path + "sz/loanApp/getLoanAppInfoDetailByLoanAppId", {
          loanAppId: this.$route.query.pkId
        })
        .then(res => {
          if (res.data.flag == 0) {
            let item = res.data.data;
            // this.asd=item;
            console.log(item, "adsfgveuiowvneirvbnsdijfvneshihvnig");
            this.loanInfo = item;
            this.isSettleInfo = item.isSettleInfo;
            this.loanAppNum = item.loanAppNum;
            this.applicantTime = item.applicantTime;
            if (
              item.receiptType == "RECEIPT_TYPE_1" ||
              item.receiptType == "个人"
            ) {
              this.loanInfo.receiptType = "个人";
            } else if (
              item.receiptType == "RECEIPT_TYPE_2" ||
              item.receiptType == "单位"
            ) {
              this.loanInfo.receiptType = "单位";
            }
            this.loanMoneyChinese = this.NumToChinese(this.loanInfo.loanAmount);
            if (item.paymentMethod == "PAY_TYPE_1") {
              item.paymentMethod = "现金";
            } else if (item.paymentMethod == "PAY_TYPE_2") {
              item.paymentMethod = "支票";
            } else if (item.paymentMethod == "PAY_TYPE_3") {
              item.paymentMethod = "银行转账";
            }
            //工作流参数
            this.approvalFlag = true;
            this.workFlowData.processInstanceId = item.processInstanceId;
          }
        });
    },
    //提交
    saveLotPayDetailInfo() {
       this.disabled = true;
       let workFlag = this.$refs["approvalData"].approvalValid();
      this.asd = {
        advanceAppId:this.loanInfo.advanceAppId,
        loanAppNum: this.loanInfo.loanAppNum,
        loanAppName: this.loanInfo.loanAppName,
        loanAmount: this.loanInfo.loanAmount,
        loanTerm: this.loanInfo.loanTerm,
        paymentMethod: this.loanInfo.paymentMethod,
        expectRepaymentTime: this.loanInfo.expectRepaymentTime,
        applicantUser: this.loanInfo.applicantUser,
        type: this.loanInfo.type,
        prjCode: this.loanInfo.prjCode,
        prjName: this.loanInfo.prjName,
        receiptType: this.loanInfo.receiptType,
        borrower: this.loanInfo.borrower,
        bankAccount: this.loanInfo.bankAccount,
        openBank: this.loanInfo.openBank,
        loanAppId: this.$route.query.pkId, //	表单申请id
        parameters: "", //parameters	JSON格式字符串,
        dealingWithPeople: this.$refs.approvalData.approvalForm.nextOperCode, //dealingWithPeople	下一步操作人code
        opintion: this.$refs.approvalData.approvalForm.textarea, //opintion	审批意见
        processInstanceId: this.loanInfo.processInstanceId, //processInstanceId	流程实例ID,
        nextCode: this.$refs.approvalData.approvalForm.nextCode //nextCode	操作流程代码
      };
        if (workFlag) {
      axios
        .post(option.base_path + "sz/loanApp/submitLoanAppInfo", this.asd)
        .then(data => {
          if (data.data.flag == 0) {
            this.$router.push({ path: "/expensesReim/appLoanApplication" });
          }
        });
         } else {
        this.disabled = false;
      }
    },
  },
  components: {
    approvalSelect,
    topTip,
    axios,
    approvalDetail
  },
  filters: {
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

<style scoped>
.btn {
  text-align: center;
  margin-top: 20px;
}
.yt-read-text {
  color: #003465;
  font-weight: bold;
}
.baseInfo {
  margin: 0 20px;
}
</style>

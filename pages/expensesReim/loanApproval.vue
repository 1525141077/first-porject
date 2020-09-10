<template>
  <div class="loanApproval">
    <top-tip>
      <div class="title">基本信息</div>
      <div class="rightInfo">
        <label>单据编号：</label>
        <label class="greyColor">{{loanInfo.loanAppNum}}</label>
        <label style="margin-left:20px;">申请日期：</label>
        <label class="greyColor">{{loanInfo.applicantTime}}</label>
      </div>
    </top-tip>
    <el-form :model="loanInfo" ref="loanForm">
      <div class="baseInfo">
        <el-row style="margin-bottom:20px;">
          <el-col :span="6">
            <label class="yt-read-text">
              <label style="letter-spacing:15px;">申请</label>人：
            </label>
            <span>{{loanInfo.applicantUserName}}</span>
          </el-col>
          <el-col :span="6">
            <label class="yt-read-text">
              <label style="letter-spacing:40px;">部</label>门：
            </label>
            <span>{{loanInfo.applicantUserDeptName}}</span>
          </el-col>
          <el-col :span="6">
            <label class="yt-read-text">
              <label style="letter-spacing:40px;">职</label>务：
            </label>
            <span>{{loanInfo.applicantUserPositionName}}</span>
          </el-col>
          <el-col :span="6">
            <label class="yt-read-text">
              <label style="letter-spacing:40px;">电</label>话：
            </label>
            <span>{{loanInfo.applicantUserPhone}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="借款事由："
              label-width="102px"
              prop="loanAppName"
              :rules="{ required: true, message: '请输入借款事由', trigger: 'blur' }"
            >
              <el-input
                v-model="loanInfo.loanAppName"
                placeholder="请输入借款事由"
                size="small"
                style="width:800px;"
              ></el-input>
              <el-checkbox
                v-if="temporaryNotes"
                v-model="serveApplyChecked"
                @change="serveApplyChange"
              >差旅费借款</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="serveApplyChecked">
          <el-col :span="12">
            <el-form-item
              label="事前申请单："
              label-width="102px"
              prop="advanceAppNum"
              :rules="{ required: true, message: '请选择事前申请单', trigger: 'blur' }"
            >
              <el-input
                :disabled="advanceDis"
                v-model="loanInfo.advanceAppNum"
                @focus="showDialog"
                placeholder="请选择事前申请单"
                size="small"
                style="width:400px;"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="事前申请单可用金额：">{{loanInfo.advanceAppMoneny}}元</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="所属项目："
              label-width="102px"
              prop="proType"
              :rules="{ required: true, message: '请选择所属项目', trigger: 'change' }"
            >
              <el-select
                v-model="loanInfo.proType"
                size="small"
                placeholder="请选择所属项目"
                @change="receiptTypeChange"
              >
                <el-option
                  v-for="item in projectType"
                  :key="'index'+item.disvalue"
                  :label="item.disvalue"
                  :value="item.dictTypeCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="projectIsShow">
            <el-form-item
              label="项目名称/编号："
              label-width="120px"
              prop="prjCode"
              :rules="{ required: true, message: '请选择所属项目', trigger: 'change' }"
            >
              <!-- <el-select no-match-text="无匹配数据" filterable default-first-option size="small" v-model="loanInfo.prjCode" placeholder="请选择所属项目" @change="projectCange">
                <el-option v-for="(item,index) in project" :key="index+item.projectName" :label="item.projectName" :value="item.projectCode">
                </el-option>
              </el-select>-->
              <el-autocomplete
                class="inline-input"
                v-model="loanInfo.projectName"
                placeholder="请输入关键字"
                :fetch-suggestions="querySearch"
                :trigger-on-focus="false"
                @select="handleSelect"
                style="width:200px"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否有未清账借款单：" label-width="140px" prop="isSettleInfo.noCloseOut">
              <label>{{loanInfo.isSettleInfo.noCloseOut}}</label>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="isLoanAppNumStr">
            <el-form-item label="未清账借款单编号：" label-width="140px" prop="isSettleInfo.loanAppNumStr">
              <label class="loanAppNumStr">{{loanInfo.isSettleInfo.loanAppNumStr}}</label>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <top-tip>
        <div class="title">借款信息</div>
      </top-tip>
      <div class="loanForm">
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="收款方："
              label-width="102px"
              prop="receiptType"
              :rules="{ required: true, message: '请选择收款方', trigger: 'blur' }"
            >
              <el-select size="small" v-model="loanInfo.receiptType" placeholder="请选择收款方">
                <el-option
                  v-for="item in receiptMethodArray"
                  :key="'index'+item.disvalue"
                  :label="item.disvalue"
                  :value="item.dictTypeCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="借款人/单位名称："
              label-width="140px"
              prop="borrower"
              :rules="{ required: true, message: '借款人/单位名称', trigger: 'blur' }"
            >
              <el-input
                v-model="loanInfo.borrower"
                placeholder="请输入借款人/单位名称"
                size="small"
                style="width:200px;"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="借款金额："
              label-width="102px"
              prop="borrower"
              :rules="{ required: true, message: '请输入借款金额', trigger: 'blur' }"
            >
              <el-input
                ref="browMoney"
                @focus="focusMoney"
                @blur="blurMoney"
                v-model="loanInfo.loanAmount"
                placeholder="请输入借款金额"
                size="small"
                class="money_right"
                style="width: 190px;"
              >
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="人民币大写：" label-width="140px" prop="borrower">
              <label>{{loanMoneyChinese}}</label>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="借款期限：" label-width="102px" prop="loanTermCode">
              <el-select
                size="small"
                v-model="loanInfo.loanTermCode"
                placeholder="请选择借款期限"
                @change="loanTermChange"
              >
                <el-option
                  v-for="item in loanTermArray"
                  :key="'index'+item.disValue"
                  :label="item.disValue"
                  :value="item.disCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预计还款日期：" label-width="140px" prop="borrower">
              <el-date-picker
                v-model="loanInfo.expectRepaymentTime"
                type="date"
                placeholder="请选择预计还款日期"
                size="small"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item
              label="付款方式："
              label-width="102px"
              prop="paymentMethod"
              :rules="{ required: true, message: '请选择付款方式', trigger: 'blur' }"
            >
              <el-select
                size="small"
                v-model="loanInfo.paymentMethod"
                placeholder="请选择付款方式"
                @change="paymentMethodChange"
              >
                <el-option
                  v-for="item in paymentMethodArray"
                  :key="'index'+item.disvalue"
                  :label="item.disvalue"
                  :value="item.dictTypeCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="bankIsShow">
            <el-form-item label="开户行：" label-width="90px" prop="paymentMethod">
              <el-input
                v-model="loanInfo.openBank"
                placeholder="请输入开户行"
                size="small"
                style="width:200px;"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="bankIsShow">
            <el-form-item label="银行账号：" label-width="140px" prop="paymentMethod">
              <el-input
                v-model="loanInfo.bankAccount"
                placeholder="请输入银行账号"
                size="small"
                style="width:200px;"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="approval">
        <approval-select
          :key="reloadSele"
          ref="approvalData"
          :params="params"
          @flowChange="flowChange"
          @operaChange="operaChange"
          @textareaBlur="textareaBlur"
        ></approval-select>
      </div>
      <div class="btnGroup">
        <!-- <el-button class="defaultBtn" @click="saveBtn" :loading="isLoading">保存</el-button>
        <el-button class="defaultBtn" @click="confirmBtn" :loading="isLoading">确认</el-button>
        <el-button class="defaultBtn" @click="mianCancelBtn" style="background:#d6e6f3;color:#666;">取消</el-button> -->

        <button @click="saveBtn" type="button" class="el-button yt-bottom-btn el-button--primary"><span>保存</span></button>
        <button @click="confirmBtn" type="button" class="el-button yt-bottom-btn el-button--primary"><span>确定</span></button>
        <button type="button" class="el-button yt-bottom-btn el-button--default" @click="mianCancelBtn"> <span>取消</span></button>
      </div>
    </el-form>
    <el-dialog
      @close="closeCallBack"
      title="选择事前申请单"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <div class="dialogHeader">
        <el-input v-model="keyWord" size="small" placeholder="请输入关键字进行查询" style="width:400px;"></el-input>
        <el-button @click="queryBtn" class="smallDefaultBtn" style="margin-left:20px;">查询</el-button>
        <el-button
          @click="restBtn"
          class="smallDefaultBtn"
          style="background:#d6e6f3;color:#666;"
        >重置</el-button>
      </div>
      <el-table :data="gridData" @row-click="gridClick" highlight-current-row ref="advanceTable">
        <el-table-column property="advanceAppNum" label="单据编号" width="150"></el-table-column>
        <el-table-column property="advanceAppName" label="事前申请事由" width="200"></el-table-column>
        <el-table-column property="advanceAppBalance" label="申请金额"></el-table-column>
        <el-table-column property="applicantTime" label="申请日期"></el-table-column>
      </el-table>
      <!-- 分页START -->
      <div>
        <el-pagination
          @size-change="advanceChange"
          @current-change="subNumChange"
          :current-page.sync="advancePageNum"
          :page-size="advancePageSize"
          :total="advancetotal"
          layout="total, prev, pager, next"
        ></el-pagination>
      </div>
      <!-- 分页END -->
      <div class="dialogBottom">
        <el-button @click="sureBtn" class="smallDefaultBtn">确认</el-button>
        <el-button
          @click="cancelBtn"
          class="smallDefaultBtn"
          style="background:#d6e6f3;color:#666;"
        >取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import topTip from "@/components/topTip";
import approvalSelect from "@/components/ApprovalSelect/ApprovalSelect";
import finMoneyInput from "@/components/fin-money-input";
import req from "@/service/http";
import { Message } from "element-ui";
import { option } from "@/static/config";
export default {
  name: "loanApproval",
  data() {
    return {
      loanInfo: {
        //借款id
        loanAppId: "",
        // 单据编号
        loanAppNum: "提交后自动生成",
        // 申请日期
        applicantTime: "--",
        //申请人
        applicantUserName: "",
        //申请人Code
        applicantUser: "",
        // 部门
        applicantUserDeptName: "",
        // 职务
        applicantUserPositionName: "",
        // 电话
        applicantUserPhone: "",
        // 借款事由
        loanAppName: "",
        // 所属项目CODE
        proType: "",
        // 所属项目名称
        type: "",
        // 项目名称code
        prjCode: "",
        // 项目名称
        prjName: "",
        // 未结清账单
        isSettleInfo: {
          // 是否有未结清账单
          noCloseOut: "",
          // 未清账借款单编号
          loanAppNumStr: "",
        },
        // 收款方code
        receiptType: "RECEIPT_TYPE_1",
        // 收款方code RECEIPT_TYPE_1个人 RECEIPT_TYPE_2单位
        receiptMethod: "",
        // 借款人/单位名称
        borrower: "",
        // 借款金额
        loanAmount: "0.00",
        // 人民币大写自己转
        //借款期限code
        loanTermCode: "",
        // 借款期限name
        loanTerm: "",
        // 预计还款日期
        expectRepaymentTime: "",
        // 付款方式code
        paymentMethod: "PAY_TYPE_3",
        // 开户行
        openBank: "",
        // 银行账号
        bankAccount: "",
        // 提交页面没有付款公司
        // 事前申请单id
        advanceAppId: "",
        // 事前申请单编号
        advanceAppNum: "",
        //事前申请单可用金额
        advanceAppMoneny: "--",
        //JSON格式字符串
        parameters: "",
        //操作流程code
        nextCode: "",
        //审批人code
        dealingWithPeople: "",
        //审批意见
        opintion: "",
        //流程实例ID
        processInstanceId: "",
      },
      // 金额大写
      loanMoneyChinese: "--",
      // 项目类型下拉框初始化数据
      projectType: [],
      projectIsShow: false,
      // 项目名称下拉框初始化数据
      project: [],
      // 未结清账单编号是否显示
      isLoanAppNumStr: false,
      // 收款方下拉框初始化数据
      receiptMethodArray: [],
      // 借款期限下拉框
      loanTermArray: [],
      // 付款方式
      paymentMethodArray: [],
      // 开户行、银行卡隐藏显示
      bankIsShow: true,
      // 事前复选框是否选中
      serveApplyChecked: false,
      // 事前申请单是否允许修改
      advanceDis: false,
      // 事前申请单弹出框显示隐藏
      dialogTableVisible: false,
      // 支出事前申请单列表数据
      gridData: [],
      // 事前申请单id
      expenditureAppId: "",
      // 事前申请模糊查询
      keyWord: "",
      // 事前申请单选中数据
      expendChoose: {},
      advancePageNum: 1,
      advancePageSize: 5,
      advancetotal: 1,
      // 审批下拉框
      params: {
        processInstanceId: "",
        parameters: '{"type": "PROJECT_TYPE_1"}',
        businessCode: "SZ_LOAN_APP",
        projectNumber: "",
      },
      // 刷新审批下拉框
      reloadSele: 0,
      // 保存确认按钮
      isLoading: false,
      /*
       *暂时取消部分功能需要时可以解开
       */
      temporaryNotes: false,
    };
  },
  created() {
    //获取借款申请信息数据
    if (this.$route.query.pkId) {
      this.getLoanApproval();
    }
    // 获取登陆人基本信息
    this.getBaseInfo();
    // 初始化所属项目以及项目名称、收款方
    this.initProjectSelect();
    // 初始化查询是否有未结清账单
    this.getCurrentUserIsSettleInfo();
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
        let l = s.split(".")[0].split("").reverse(),
          r = s.split(".")[1];
        let t = "";
        for (let i = 0; i < l.length; i++) {
          t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? "," : "");
        }
        return lose + "" + t.split("").reverse().join("") + "." + r; //拼接
      } else if (s === "") {
        return "";
      } else if (s === 0) {
        return "0.00"; //拼接
      }
    },
    // 金额格式化(获得焦点)
    focusMoney() {
      let s = this.loanInfo.loanAmount;
      if (s != "" && s != undefined) {
        //转成string类型
        s = s + "";
        this.loanInfo.loanAmount = parseFloat(s.replace(/[^\d\.-]/g, ""));
      } else {
        this.loanInfo.loanAmount = "";
      }
      this.$nextTick(() => {
        this.$refs.browMoney.select(); //自动选中
      });
    },
    // 金额格式化(失去焦点)
    blurMoney() {
      this.loanInfo.loanAmount = this.moneyFilter(this.loanInfo.loanAmount);
      this.loanMoneyChinese = this.NumToChinese(this.loanInfo.loanAmount);
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
            message: "位数过大无法计算",
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
            message: "小数点之后只能保留两位,系统将自动截段",
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
    // 借款期限下拉框改变
    loanTermChange(value) {
      this.loanTermArray.map((item) => {
        if (value == item.disCode) {
          this.loanInfo.loanTerm = item.disValue;
        }
      });
    },
    // 初始化所属项目以及项目名称、收款方、借款期限、付款方式
    async initProjectSelect() {
      try {
        // 项目类型
        await req({
          url: "sz/expenditureApp/getProjectTypeDictList",
          params: {
            projectType: "PROJECT_TYPE",
          },
        }).then((data) => {
          if (data.data.flag == 0) {
            this.projectType = data.data.data;
          }
        });
        // 项目名称
        await req({
          url: "sz/expenditureApp/getProjectTypeList",
        }).then((data) => {
          if (data.data.flag == 0) {
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
            this.project = newNameList;
          }
        });
        // 收款方
        await req({
          url: "sz/loanApp/getReceiptTypeList",
          params: {
            projectType: "RECEIPT_TYPE",
          },
        }).then((data) => {
          if (data.data.flag == 0) {
            this.receiptMethodArray = data.data.data;
          }
        });
        // 借款期限
        this.loanTermArray = [
          { disCode: "1", disValue: "一个月之内" },
          { disCode: "2", disValue: "超过一个月" },
        ];
        // 付款方式
        await req({
          url: "sz/loanApp/getPaymentTypeList",
          params: {
            payType: "PAY_TYPE",
          },
        }).then((data) => {
          if (data.data.flag == 0) {
            this.paymentMethodArray = data.data.data;
          }
        });
      } catch (error) {
        Message.error({
          message: "后台数据加载出错",
        });
      }
    },
    // 获取当前登录人未结清账单
    getCurrentUserIsSettleInfo() {
      req({
        url: "sz/loanApp/getCurrentUserIsSettleInfo",
      }).then((data) => {
        if (data.data.flag == 0) {
          this.loanInfo.isSettleInfo = data.data.data;
          if (data.data.data.noCloseOut == "是") {
            this.isLoanAppNumStr = true;
          }
        }
      });
    },
    // 获取登录人基本信息
    getBaseInfo() {
      req({
        url: "index/getCurrentUserInfo",
      }).then((data) => {
        if (data.data.flag == 0) {
          this.loanInfo.applicantUser = data.data.data.userName;
          this.loanInfo.applicantUserName = data.data.data.realName;
          this.loanInfo.applicantUserDeptName = data.data.data.deptName;
          this.loanInfo.applicantUserPositionName = data.data.data.positionName;
          this.loanInfo.applicantUserPhone = data.data.data.userPhone;
        }
      });
    },
    // 所属项目类型改变事件
    receiptTypeChange(value) {
      // 所属项目的显示与隐藏
      if (value == "PROJECT_TYPE_1") {
        this.projectIsShow = true;
        this.loanInfo.type = "项目类型";
      } else {
        this.projectIsShow = false;
        this.loanInfo.type = "非项目类型";
      }
      // 清空项目下拉框数据
      this.loanInfo.prjCode = "";
      this.params.parameters = '{"type":"' + value + '"}';
      this.loanInfo.parameters = this.params.parameters;
      this.reloadSele = Math.random();
    },
    // 项目名称改变
    projectCange(value) {
      this.params.projectNumber = value;
      // 获取项目名称及code
      this.project.find((item) => {
        if (item.projectCode == value) {
          this.loanInfo.prjName = item.projectName;
          this.loanInfo.prjCode = item.projectCode;
          return;
        }
      });
      this.reloadSele = Math.random();
    },
    // 付款方式change
    paymentMethodChange(value) {
      if (value != "PAY_TYPE_3") {
        this.bankIsShow = false;
        this.loanInfo.openBank = "";
        this.loanInfo.bankAccount = "";
      } else {
        this.bankIsShow = true;
      }
    },
    // 选中事前申请单输入框
    showDialog(value) {
      this.dialogTableVisible = true;
      this.advanceDis = true;
      this.getServeTable(this.keyWord);
      this.$nextTick(() => {
        this.$refs.advanceTable.setCurrentRow(this.expendChoose);
      });
    },
    // 获取事前申请单列表
    async getServeTable(keyWord) {
      try {
        await req({
          url: "sz/advanceApp/getAdvanceAppListToPageByParams",
          params: {
            type: "LOAN_APP",
            costType: "TRAVEL_APPLY",
            expenditureAppId: this.expenditureAppId,
            queryParams: keyWord,
            pageIndex: this.advancePageNum,
            pageNum: this.advancePageSize,
            pageSize: "",
          },
        }).then((data) => {
          if (data.data.flag == 0) {
            this.gridData = data.data.data.rows;
            this.advancetotal = data.data.data.total;
          }
        });
      } catch (error) {
        Message.error({
          message: "后台数据获取出错",
        });
      }
    },
    // 点击事前申请查询
    queryBtn() {
      this.getServeTable(this.keyWord);
    },
    // 事前申请单重置按钮
    restBtn() {
      this.keyWord = "";
      this.getServeTable("");
    },
    // 事前申请单确认按钮
    sureBtn() {
      if (this.expendChoose.advanceAppId != undefined) {
        this.dialogTableVisible = false;
        this.loanInfo.advanceAppId = this.expendChoose.advanceAppId;
        this.loanInfo.advanceAppNum = this.expendChoose.advanceAppNum;
        this.loanInfo.advanceAppMoneny = (
          Number(this.expendChoose.advanceAmount).toFixed(2) + ""
        ).replace(/\d(?=(?:\d{3})+\b)/g, "$&,");
      } else {
        this.$message({
          message: "请选中一行数据",
          type: "warning",
        });
      }
    },
    // 事前申请单取消按钮
    cancelBtn() {
      this.dialogTableVisible = false;
    },
    // 点击一行时触发
    gridClick(row, column, event) {
      this.expendChoose = row;
    },
    // 操作流程code
    flowChange(value) {
      this.loanInfo.nextCode = value;
    },
    // 审批人code
    operaChange(value) {
      this.loanInfo.dealingWithPeople = value;
    },
    // 意见
    textareaBlur(value) {
      this.loanInfo.opintion = value;
    },
    // 获取以及修正页面数据
    getPageData() {
      let loaninfo = this.loanInfo;
      for (var obj in loaninfo) {
        // 如果没有选择事前申请单删除事前申请单属性
        if (!this.serveApplyChecked) {
          if (obj == "advanceAppId") {
            delete loaninfo[obj];
          }
        }
        // 清空申请单号以及申请单申请事件
        if (obj == "loanAppNum" || obj == "applicantTime") {
          loaninfo[obj] = "";
        }
        // 修改借款金额
        if (obj == "loanAmount") {
          let s = loaninfo[obj];
          if (s != "" && s != undefined) {
            //转成string类型
            s = s + "";
            loaninfo[obj] = parseFloat(s.replace(/[^\d\.-]/g, ""));
          } else {
            loaninfo[obj] = "";
          }
        }
        // 删除无用属性
        if (obj == "applicantTime") {
          delete loaninfo[obj];
        }
      }
      return loaninfo;
    },
    // 规范详情数据
    getloanInfoFun(data) {
      for (let obj in data) {
        // 获取项目类型code
        if (obj == "type") {
          if (data[obj] == "项目类型") {
            data.proType = "PROJECT_TYPE_1";
          } else if (data[obj] == "非项目类型") {
            data.proType = "PROJECT_TYPE_2";
          }
        }
        // 借款期限
        if (obj == "loanTerm") {
          if (data[obj] == "一个月之内") {
            data.loanTermCode = "1";
          } else if (data[obj] == "超过一个月") {
            data.proTypeCode = "2";
          }
        }
        // 得到中文
        if (obj == "loanAmount") {
          let s = data[obj];
          if (s != "" && s != undefined) {
            //转成string类型
            s = s + "";
            data[obj] = parseFloat(s.replace(/[^\d\.-]/g, ""));
          } else {
            data[obj] = "";
          }
          this.loanMoneyChinese = this.NumToChinese(data[obj]);
        }
        // 判断是否显示事前申请
        if (obj == "advanceAppId") {
          if (data[obj] != "") {
            this.serveApplyChecked = true;
          }
        }
        // 修改事前申请金额字段
        if (obj == "advanceAppBalance") {
          data["advanceAppMoneny"] = this.moneyFilter(data[obj]);
        }
      }
      return data;
    },
    // 点击保存
    saveBtn() {
      this.isLoading = true;
      let data = this.getPageData();
      req({
        url: "sz/loanApp/saveLoanAppInfoToDrafts",
        method: "post",
        data: data,
      }).then((data) => {
        if (data.data.flag == 0) {
          this.$router.push({ path: "/approval/draftsList" });
        }
      });
    },
    // 点击提交
    confirmBtn() {
      if (this.serveApplyChecked) {
        if (this.loanInfo.loanAmount > this.loanInfo.serveApplyChecked) {
          Message.warning({
            message: "借款金额不能大于事前申请单可用金额",
          });
        } else {
          this.submiteFun();
        }
      } else {
        this.submiteFun();
      }
    },
    // 提交方法
    submiteFun() {
      let data = this.getPageData();
      let approvalSelect = this.$refs["approvalData"].approvalValid();
      this.$refs["loanForm"].validate((valid) => {
        if (valid && approvalSelect) {
          this.isLoading = true;
          req({
            url: "sz/loanApp/submitLoanAppInfo",
            method: "post",
            data: data,
          })
            .then((data) => {
              if (data.data.flag == 0) {
                this.$router.push({ path: "/approval/myApplyList" });
              }
            })
            .catch((errot) => {
              Message.warning({
                message: "提交失败",
              });
            });
        } else {
          Message.warning({
            message: "请填写必填项",
          });
        }
      });
    },
    // 单选框改变
    serveApplyChange() {
      this.loanInfo.advanceAppId = "";
      this.loanInfo.advanceAppNum = "";
    },
    // 事前弹窗关闭时的回调
    closeCallBack() {
      this.advanceDis = false;
      this.keyWord = "";
    },
    advanceChange(item) {
      this.advancePageSize = item;
      this.getServeTable(this.keyWord);
    },
    subNumChange(item) {
      this.advancePageNum = item;
      this.getServeTable(this.keyWord);
    },
    // 取消按钮
    mianCancelBtn() {
      // this.$router.push("loanDetail");
      this.$router.push({ path: "/approval/draftsList" });
    },
    //获取页面详情
    getLoanApproval() {
      req({
        url: option.base_path + "sz/loanApp/getLoanAppInfoDetailByLoanAppId",
        method: "post",
        data: {
          loanAppId: this.$route.query.pkId,
        },
      }).then((data) => {
        if (data.data.flag == 0) {
          this.loanInfo = this.getloanInfoFun(data.data.data);
          // 项目名称的显示与隐藏
          if ((this.loanInfo.proType = "PROJECT_TYPE_1")) {
            this.projectIsShow = true;
          } else {
            this.projectIsShow = false;
          }
          // 付款方式change
          if (this.loanInfo.paymentMethod != "PAY_TYPE_3") {
            this.bankIsShow = false;
          } else {
            this.bankIsShow = true;
          }
          // 获取工作流参数赋值
          this.params.projectNumber = this.loanInfo.prjCode;
          this.reloadSele = Math.random();
        }
      });
    },
    // 返回输入建议方法
    querySearch(queryString, cb) {
      console.log(queryString);
      let restaurants = this.project;
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
      let manList = this.project;
      manList.forEach((n) => {});
      console.log(item);
      this.projectCange(item.projectCode);
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
  components: {
    approvalSelect,
    topTip,
    finMoneyInput,
  },
};
</script>

<style>
.money_right .el-input__inner {
  text-align: right;
}
.loanApproval {
  min-height: 100%;
  background-color: #fff;
}
.title {
  position: absolute;
  left: 35px;
  color: #417095;
  font-size: 16px;
  font-weight: bold;
}
.rightInfo {
  position: absolute;
  right: 35px;
}
.baseInfo {
  margin-left: 15px;
}
.greyColor {
  color: #c8c8c8;
}
.loanForm {
  margin-left: 15px;
}
.defaultBtn {
  background-color: #417095;
  color: #fff;
  height: 40px;
  line-height: 40px;
  padding: 0 30px;
  font-size: 18px;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  outline: none;
}
.defaultBtn:hover {
  opacity: 0.8;
  filter: alpha(opacity=80);
}
.btnGroup,
.dialogBottom {
  text-align: center;
  margin-top: 20px;
  padding-bottom: 20px;
}
.dialogHeader {
  margin-bottom: 20px;
}
.smallDefaultBtn {
  background-color: #417095;
  color: #fff;
  padding: 0 10px 1px;
  height: 30px;
  line-height: 30px;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  outline: none;
}
.loanAppNumStr {
  white-space: normal;
  word-break: break-all;
}
.yt-read-text {
  color: #003465;
  font-weight: bold;
}
</style>
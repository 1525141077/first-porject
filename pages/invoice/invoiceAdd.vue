<template>
  <div class="yt-dome-container">
    <topTip>
      <template>
        <el-row>
          <el-col :span="15" class="top-tip" style="text-align: left;">
            <div>
              <span style="color: #417095;font-size: 16px;font-weight: bolder;">开票基本信息</span>
            </div>
          </el-col>
          <el-col :span="8" style="text-align: right;">
            <div>
              <label style="margin-right:20px">
                <span style="color:#003465;letter-spacing:4px">发票申请编号：</span>
                <span>{{form.invoiceAppNum || "提交后自动生成"}}</span>
              </label>
            </div>
          </el-col>
        </el-row>
      </template>
    </topTip>
    <el-form :model="form" ref="form" label-position="right" label-width="120px" :rules="rules">
      <el-form-item label="发票类型：">
        <el-radio-group v-model="form.invoiceType" @change="radioChange">
          <el-radio label="1">增值税专用发票</el-radio>
          <el-radio label="2">增值税普通发票</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-row>
        <el-col :span="11">
          <el-form-item label="合同名称/编号：" prop="contractNameNum">
            <el-autocomplete
              class="inline-input"
              v-model="form.contractNameNum"
              placeholder="请输入关键字"
              :fetch-suggestions="querySearch"
              :trigger-on-focus="false"
              @select="handleSelect"
            ></el-autocomplete>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="合同未开票金额：">
            <span>{{form.noInvoiceMoney | moneyFormat}}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="11">
          <el-form-item label="发票抬头：" prop="invoiceRise">
            <el-input v-model="form.invoiceRise" placeholder="选择合同后，自动带出"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="纳税人识别号：" prop="taxpayerNumber">
            <el-input v-model="form.taxpayerNumber" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="11">
          <el-form-item label="开户行：" prop="accountBank">
            <el-input v-model="form.accountBank" placeholder="增值税专用发票此项必填"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="账号：" prop="accountNumber">
            <el-input v-model="form.accountNumber" placeholder="增值税专用发票此项必填"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="11">
          <el-form-item label="联系地址：" prop="contactAddress">
            <el-input v-model="form.contactAddress" placeholder="增值税专用发票此项必填"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="联系电话：" prop="contactPhone">
            <el-input v-model="form.contactPhone" placeholder="增值税专用发票此项必填"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注：">
        <el-input v-model="form.remarks" placeholder="请输入" style="width:91%"></el-input>
      </el-form-item>
    </el-form>

    <el-table border :data="form.goodsList" style="width: 100%; margin-top: 20px;">
      <el-table-column prop="invoiceModel" label="货物或应税劳务、服务名称及规格型号">
        <template slot="header" slot-scope="scopeTop">
          <span class="not-null befor-not" style>*</span>
          <span>货物或应税劳务、服务名称及规格型号</span>
          <el-popover
            placement="top-start"
            title
            width="500"
            trigger="hover"
            content="货物或应税劳务、服务名称及规格型号是开票的内容,是根据公司的经营范围中的项目决定的。填写前可咨询财务人员。如购买方对此项有特殊要求，请及时与财务沟通，并在备注栏中说明。举例：服务费"
          >
            <img
              src="../../static/icon/icon-warn.png"
              alt
              style="width:20px;height:20px;vertical-align: middle;"
              slot="reference"
            />
          </el-popover>
        </template>
        <template scope="scope">
          <el-input v-model="scope.row.invoiceModel" autocomplete="true" placeholder="请输入"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="单位" align="center" width="150">
        <template scope="scope">
          <el-input v-model="scope.row.unit" autocomplete="true" placeholder="请输入"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="数量" width="150">
        <template scope="scope">
          <el-input v-model="scope.row.num" autocomplete="true" placeholder="请输入数字"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="单价（元）" width="250">
        <template scope="scope">
          <finmoneyinput v-model="scope.row.unitPrice" :tail="'元'"></finmoneyinput>
        </template>
      </el-table-column>
      <el-table-column label="金额（含税）" width="250">
        <template slot="header" slot-scope="scopeTop">
          <span class="not-null befor-not" style>*</span>
          <span>金额（含税）</span>
        </template>
        <template scope="scope">
          <finmoneyinput v-model="scope.row.amountMoney" :tail="'元'" @blur="tableMoneyBlur"></finmoneyinput>
        </template>
      </el-table-column>
      <el-table-column prop label="操作" width="80" align="center">
        <template scope="scope">
          <el-button type="danger" icon="el-icon-delete" circle @click="delTr(scope.$index)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div
      style="width: 100%; border: 1px solid #DFE6F3; text-align: center;height:40px;line-height:40px;"
    >
      <el-button icon="el-icon-plus" circle size="small" @click="addTr"></el-button>
    </div>

    <el-form :model="form" label-position="right" label-width="160px" :rules="rules">
      <el-form-item label="开票金额合计（含税）：">
        <span style="margin-right: 10px">{{form.invoiceAmount | moneyFormat}}</span>元
      </el-form-item>
      <el-row>
        <el-col :span="11">
          <el-form-item label="开票公司：">
            <span style>{{form.bCompany || "--"}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="纳税人识别号：">
            <span style>{{form.bTaxpayerNumber || "--"}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="地址、电话：">
            <span style>{{form.bAddressPhone || "--"}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="开户行及账号：">
            <span style>{{form.bBankAccount || "--"}}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <topTip v-if="form.invoiceMoneyList.length > 1">
      <template>
        <el-row>
          <el-col :span="15" class="top-tip" style="text-align: left;">
            <div>
              <span style="color: #417095;font-size: 16px;font-weight: bolder;">发票金额分配</span>
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
      v-if="form.invoiceMoneyList.length > 1"
    >
      <el-table-column prop="projectNum" label="分配项目名称/编号" align="center" width="350">
        <template scope="scope">
          <span>{{scope.row.projectName + "/" + scope.row.projectNum}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="projectAmount" label="合同项目分配金额(元）" align="right">
        <template scope="scope">
          <span>{{scope.row.projectAmount | moneyFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="alreadyAllocationMoney" label="已开票金额" align="right" width="220">
        <template scope="scope">
          <span>{{scope.row.alreadyAllocationMoney | moneyFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="allocationMoney" label="本次开票金额" width="220" align="right">
        <template scope="scope">
          <finmoneyinput v-model="scope.row.allocationMoney" :tail="'元'" @blur="invoiceMoneyValid"></finmoneyinput>
        </template>
      </el-table-column>
    </el-table>
    <approvalSelect
      :key="workData"
      ref="approvalData"
      @flowChange="flowChange"
      :params="workFlowData"
    ></approvalSelect>
    <div style="text-align: center;padding-bottom:20px">
      <button
        type="button"
        class="el-button yt-bottom-btn el-button--primary"
        @click="saveInvoiceDraft"
      >
        <span>暂存</span>
      </button>
      <button
        type="button"
        class="el-button yt-bottom-btn el-button--primary"
        @click="saveInvoiceSubmit"
      >
        <span>提交</span>
      </button>
      <button
        type="button"
        class="el-button yt-bottom-btn el-button--default"
        @click="resetFormData"
      >
        <span>取消</span>
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
.el-autocomplete {
  display: block;
}
.not-null {
  font-size: 14px;
  color: #ff0000;
  vertical-align: middle;
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
// 金额组件
import finmoneyinput from "../../components/fin-money-input";
//获取下一步审批人
import approvalSelect from "../../components/ApprovalSelect/ApprovalSelect";
// 日志组件
import logAndApprove from "../../components/logAndApprove.vue";
//copy组件
import { cloneData } from "../../static/commonTool";
export default {
  data() {
    return {
      // form: {
      //   contractNum: "", //单号
      //   isContractAmount: "1", //发票类型
      //   contractNameNum: "", //合同名称
      //   noInvoiceMoney: 0, //合同未开票金额：
      //   Invoice: "", //发票抬头
      //   taxpayerNum: "", //纳税人识别号
      //   openBank: "", //开户行
      //   account: "", //账号
      //   address: "", //店址
      //   phone: "", //电话
      //   remarks: "", //备注
      //   invoiceList: [
      //     {
      //       cargo: "", //货物或应税劳务、服务名称及规格型号
      //       unit: "", //单位
      //       quantity: "", //数量
      //       univalent: 0, //单价
      //       totalPrice: 0 //"金额（含税）
      //     }
      //   ], //表
      //   moneyTable: []
      // },
      form: {
        pkId: "", //主表id
        invoiceAppNum: "", //发票申请编号
        invoiceType: "1", //	发票类型	1:增值税专用发票2：增值税普通发票
        contractId: "", //	合同id
        invoiceRise: "", //	发票抬头
        taxpayerNumber: "", //	纳税人识别号
        accountBank: "", //	开户行
        accountNumber: "", //	账号
        contactAddress: "", //	联系地址
        contactPhone: "", //	联系电话
        remarks: "", //	备注
        invoiceAmount: 0, //	开票金额合计（含税）
        bCompany: "", //	开票公司
        bTaxpayerNumber: "", //	乙方纳税人识别号
        bAddressPhone: "", //	乙方地址、电话
        bBankAccount: "", //	乙方开户行及账号
        goodsList: [
          {
            invoiceModel: "", //货物或应税劳务、服务名称及规格型号
            unit: "", //单位
            num: "", //数量
            unitPrice: 0, //单价（元）
            amountMoney: 0, //金额（含税）
          },
        ],
        //	物品集合	List<map>
        invoiceMoneyList: [
          // {
          //   projectNum: "HIT233", //项目表Num
          //   projectName: "一个项目", //项目名称
          //   alreadyAllocationMoney: 0, //已分配收入金额(元）
          //   projectAmount: 0, //合同项目分配金额
          //   allocationMoney: 0 //本次分配收入金额
          // }
        ], //	发票金额分配	List<map>
        contractNameNum: "", //合同名称
        noInvoiceMoney: "", //合同未开票金额
      },
      //必填
      rules: {
        contractNameNum: [
          { required: true, message: "请输入合同名称/编号", trigger: "blur" },
        ],
        invoiceRise: [
          { required: true, message: "请输入发票抬头", trigger: "blur" },
        ],
        taxpayerNumber: [
          { required: true, message: "请输入纳税人识别号", trigger: "blur" },
        ],
        accountBank: [
          { required: true, message: "请输入开户银行", trigger: "blur" },
        ],
        accountNumber: [
          { required: true, message: "请输入银行账号", trigger: "blur" },
        ],
        contactAddress: [
          { required: true, message: "请输入联系地址", trigger: "blur" },
        ],
        contactPhone: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
        ],
      },
      jpManList: [
        // {
        //   contractName: "合同名1",
        //   contractNum: "NUM001",
        //   value: "合同名1"
        // },
        // {
        //   contractName: "合同名2",
        //   contractNum: "NUM002",
        //   value: "合同名2"
        // },
        // {
        //   contractName: "合同名3",
        //   contractNum: "NUM003",
        //   value: "合同名3"
        // },
        // {
        //   contractName: "合同名4",
        //   contractNum: "NUM004",
        //   value: "合同名4"
        // }
      ],
      contractMap: {
        pkId: "",
        contractNum: "",
        contractName: "",
        contractAmount: "",
        entrustingParty: "",
        commissionedParty: "",
        noInvoiceMoney: "",
      },
      workData: 0, //为工作流组件绑定的key值  用来更新组件
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
      // pkId: { contractId: 266 },this.$route.query.pkId
      pkId: { pkId: 266 },
      pkIdCopy: this.$route.query.pkId,
      //日志接口地址
      axiosUrl: option.base_path + "db/income/getInvoiceJournalList",
      //金额分配表合计
      invoiceTotal: 0,
      //跳转
      goType: this.$route.query.goType,
    };
  },
  components: {
    topTip,
    upload,
    approvalSelect,
    lookFiles,
    finmoneyinput,
    logAndApprove,
  },
  mounted() {
    //获取所有合同
    this.getContractPerformanceList();
    if (this.pkIdCopy) {
      this.getInvoiceDetails();
    }
  },
  watch: {},
  methods: {
    // 返回输入建议方法
    querySearch(queryString, cb) {
      console.log(queryString);
      let restaurants = this.jpManList;
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
      let manList = this.jpManList;
      manList.forEach((n) => {
        if (n.contractName === item.contractName) {
          //合同id
          this.contractMap.pkId = n.pkId;
          this.form.contractId = n.pkId;
          //合同名称
          this.form.contractName = n.value;
          //合同编号
          this.form.contractNum = n.contractNum;
          //合同金额
          this.form.noInvoiceMoney = n.noInvoiceMoney;
          //合同甲方
          this.form.invoiceRise = n.entrustingParty;
          //合同乙方
          this.contractMap.commissionedParty = n.commissionedParty;
          //合同未开票金额
          this.contractMap.noInvoiceMoney = n.noInvoiceMoney;
          //开票公司
          this.form.bCompany = n.commissionedParty;
        }
      });
      this.$emit("choseMan", this.contractMap);
      //5）获取开票公司发票信息
      this.getCompanyInvoiceList();
      //1.	通过发票抬头获取发票信息
      this.getInvoiceChangeDetails();
      //发票金额分配
      this.getInvoiceAmountList();
    },

    //删除一行
    delTr(index, tableName) {
      this.$confirm(`确定删除吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      }).then(() => {
        //判断数组是否是最后一条，不是则可删除，是则不可删除并提示
        if (this.form.goodsList.length > 1) {
          //从数组中删除
          this.form.goodsList.splice(index, 1);
        } else {
          this.$message.error("至少保留一条数据");
        }
      });
    },
    //添加一行
    addTr() {
      this.form.goodsList.push({
        invoiceModel: "", //货物或应税劳务、服务名称及规格型号
        unit: "", //单位
        num: "", //数量
        unitPrice: 0, //单价（元）
        amountMoney: 0, //金额（含税）
      });
      console.log(this.form.goodsList);
    },
    flowChange(value) {
      this.woks.work = value;
    },
    // 获取所有人
    getContractPerformanceList() {
      let map = {
        contractState: 1,
      };
      axios
        .post(option.base_path + "db/income/getContractPerformanceList", map)
        .then((data) => {
          //赋值全局变量数据
          let dataList = data.data.data;
          // 是否有已选择的姓名
          let oldNameList = this.oldNameList;
          let newNameLists = [];
          // 筛选之后的
          let newNameList = [];
          dataList.forEach((n) => {
            for (let key in n) {
              if (key === "contractName") {
                n["value"] = n[key] + "/" + n["contractNum"];
              }
            }
            newNameList.push(n);
          });
          this.jpManList = newNameList;
          console.log(this.jpManList);
          //如果有合同id
          if (this.$route.query.contractId) {
            let selectMap = "";
            //赋值id
            this.form.contractId = this.$route.query.contractId;
            //赋值name
            this.form.contractNameNum = this.$route.query.contractNameNum;
            //循环合同list
            this.jpManList.forEach((item) => {
              //判断如果id相同
              if (this.$route.query.contractId == item.pkId) {
                selectMap = item;
              }
            });
            this.handleSelect(selectMap);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    //单选事件
    radioChange() {
      if (this.form.invoiceType == "1") {
        (this.rules.accountBank = [
          { required: true, message: "请输入开户银行", trigger: "blur" },
        ]),
          (this.rules.accountNumber = [
            { required: true, message: "请输入银行账号", trigger: "blur" },
          ]),
          (this.rules.contactAddress = [
            { required: true, message: "请输入联系地址", trigger: "blur" },
          ]);
        this.rules.contactPhone = [
          { required: true, message: "请输入联系电话", trigger: "blur" },
        ];
      } else {
        (this.rules.accountBank = [
          { required: false, message: "请输入开户银行", trigger: "blur" },
        ]),
          (this.rules.accountNumber = [
            { required: false, message: "请输入银行账号", trigger: "blur" },
          ]),
          (this.rules.contactAddress = [
            { required: false, message: "请输入联系地址", trigger: "blur" },
          ]);
        this.rules.contactPhone = [
          { required: false, message: "请输入联系电话", trigger: "blur" },
        ];
      }
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
          if (this.goType == 1) {
            this.$router.push({ path: "/invoice/invoiceList" });
          } else if (this.goType == 2) {
            this.$router.push({ path: "/invoice/invoiceDraft" });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
      // this.$router.push({ path: "/approval/draftsList" });
    },

    // 1.	通过发票抬头获取发票信息
    getInvoiceChangeDetails() {
      console.log(this.form);
      let com = {
        invoiceRise: this.form.invoiceRise,
      };
      axios
        .post(option.base_path + "db/customer/getInvoiceDetails", com)
        .then((data) => {
          if (data.data.flag == 0 && data.data.data !== null) {
            let datas = data.data.data;
            //纳税人识别号
            this.form.taxpayerNumber = datas.taxpayerNumber;
            //开户行
            this.form.accountBank = datas.accountBank;
            //账号
            this.form.accountNumber = datas.accountNumber;
            //地址
            this.form.contactAddress = datas.contactAddress;
            //电话
            this.form.contactPhone = datas.contactPhone;
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    // 5）获取开票公司发票信息
    getCompanyInvoiceList() {
      let com = {
        commissionedParty: this.form.bCompany,
      };
      axios
        .post(option.base_path + "db/income/getCompanyInvoiceList", com)
        .then((data) => {
          //这TM是个list，就要三个字段还传的list，后来改这个代码的，这可不是我的锅，记住了
          let datas = data.data.data[0];
          //纳税人识别号
          this.form.bTaxpayerNumber = datas.taxpayerNumber;
          //地址、电话
          this.form.bAddressPhone =
            datas.registerAddress + "/" + datas.registerPhone;
          //开户行及账号
          this.form.bBankAccount = datas.depositBank + "/" + datas.bankAccount;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    // 1）保存至草稿箱-发票信息（暂存）
    saveInvoiceDraft() {
      //复制出一份form
      let form = cloneData(this.form);
      form.goodsList = JSON.stringify(this.form.goodsList);
      form.goodsList = JSON.stringify(this.form.goodsList);
      form.invoiceMoneyList = JSON.stringify(this.form.invoiceMoneyList);
      //判断分配表是否赋值金额
      this.distributionTableShow();
      axios
        .post(option.base_path + "db/income/saveInvoiceDraft", form)
        .then((data) => {
          if (data.data.flag == 0) {
            this.$message({
              message: "暂存成功",
              type: "success",
            });
            this.$router.push({ path: "./invoiceDraft" });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    // 2）提交申请信息（提交）
    saveInvoiceSubmit() {
      //验证物品合集表必填验证
      let goodsListValid = this.goodsListValid();
      //判断分配表是否赋值金额
      this.distributionTableShow();
      //金额验证
      let allMoneyValid = this.allMoneyValid();
      //发票金额分配表中本次分配收入金额（元）计算验证
      let invoiceMoneyValid = this.invoiceMoneyValid();
      //复制出一份form
      let form = cloneData(this.form);
      form.goodsList = JSON.stringify(this.form.goodsList);
      form.goodsList = JSON.stringify(this.form.goodsList);
      form.invoiceMoneyList = JSON.stringify(this.form.invoiceMoneyList);
      //校验审批组件必填项
      let workFlag = this.$refs["approvalData"].approvalValid();
      this.$refs["form"].validate((valid) => {
        if (
          valid &&
          goodsListValid &&
          allMoneyValid &&
          invoiceMoneyValid &&
          workFlag
        ) {
          axios
            .post(option.base_path + "db/income/saveInvoiceSubmit", form)
            .then((data) => {
              if (data.data.flag == 0) {
                this.saveInvoiceSubmitWorkflow(data.data.data);
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        } else {
        }
      });
    },
    // 3）提交/审批工作流
    saveInvoiceSubmitWorkflow(data) {
      this.workFlowData.appId = data.id;
      this.workFlowData.dealingWithPeople = this.$refs.approvalData.approvalForm.nextOperCode; //dealingWithPeople	下一步操作人code
      this.workFlowData.opintion = this.$refs.approvalData.approvalForm.textarea; //opintion	审批意见
      this.workFlowData.nextCode = this.$refs.approvalData.approvalForm.nextCode; //nextCode	操作流程代码
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
    },

    //发票金额分配
    getInvoiceAmountList() {
      let map = {
        contractId: this.form.contractId,
      };
      axios
        .post(option.base_path + "db/income/getInvoiceAmountList", map)
        .then((data) => {
          this.form.invoiceMoneyList = data.data.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    //计算物品合集表的合计
    tableMoneyBlur(row) {
      this.form.invoiceAmount = 0;
      this.form.goodsList.forEach((n) => {
        this.form.invoiceAmount += n.amountMoney;
      });
      console.log(this.invoiceAmount);
    },

    //验证物品合集表必填验证
    goodsListValid() {
      //标识
      let valid = true;
      this.form.goodsList.forEach((n) => {
        if (n.invoiceModel == "") {
          valid = false;
          setTimeout(() => {
            this.$message.error("货物或应税劳务、服务名称及规格型号不能为空");
          }, 1000);
        }
      });
      return valid;
    },

    //金额验证
    allMoneyValid() {
      if (this.invoiceTotal == "") {
        this.invoiceTotal = 0;
      }
      //标识
      let valid = true;
      //如果开票金额合计（含税）大于合同未开票金额，则提示并不通过
      if (this.form.invoiceAmount > this.form.noInvoiceMoney) {
        valid = false;
        this.$message.error("开票金额合计（含税）不能大于大于合同未开票金额");
        //如果发票金额分配表合计大不等于开票金额合计（含税），则提示并不通过
      } else if (
        this.rmoney(this.invoiceTotal) != this.rmoney(this.form.invoiceAmount)
      ) {
        valid = false;

        setTimeout(() => {
          this.$message.error("开票金额合计（含税）必须等于发票金额分配表合计");
        }, 1000);
      }
      return valid;
    },

    //发票金额分配表中本次分配收入金额（元）计算验证
    invoiceMoneyValid() {
      //标识
      let valid = true;
      this.form.invoiceMoneyList.forEach((n) => {
        //已分配收入金额(元）加 本次分配收入金额如果大于合同项目分配金额，则不通过并提示
        if (n.allocationMoney + n.alreadyAllocationMoney > n.projectAmount) {
          valid = false;
          setTimeout(() => {
            this.$message.error(
              "本次分配收入金额与已分配收入金额合计不能大于合同项目分配金额"
            );
          }, 1000);
        }
      });
      return valid;
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
            sums[index] = "0.00";
          }
        }
      });
      //赋值合计变量
      this.invoiceTotal = sums[3];
      // if (this.invoiceTotal == "") {
      //   this.invoiceTotal = 0;
      // }
      console.log(this.invoiceTotal);
      return sums;
    },

    //查看详情
    getInvoiceDetails() {
      let map = {
        pkId: this.pkIdCopy,
      };
      axios
        .post(option.base_path + "db/income/getInvoiceDetails", map)
        .then((data) => {
          this.form = data.data.data;
          let datas = data.data.data;
          this.workFlowData.appId = datas.pkId;
          this.workFlowData.processInstanceId = datas.processInstanceId; //processInstanceId	流程实例ID
          this.workFlowData.invoiceNumber = datas.invoiceNumber; //invoiceNumber	发票开具张数
          this.workFlowData.fileList = datas.fileList; //invoiceNumber	发票开具张数
          console.log("工作流 ", this.workFlowData);
          this.workData = Math.random();
          this.radioChange();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    //判断分配表金额是否赋值
    distributionTableShow(){
      //如果表内容等于1行
      if (this.form.invoiceMoneyList.length == 1) {
        //赋值唯一一行的本次收入分配金额为开票金额合计（含税）
        this.form.invoiceMoneyList[0].allocationMoney = this.form.invoiceAmount;
        //同时赋值合计
        this.invoiceTotal = this.form.invoiceAmount;
      }
    }

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
</style>

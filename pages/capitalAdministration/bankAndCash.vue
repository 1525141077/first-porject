<template>
  <div class="yt-dome-container">
    <el-header class="yt-header">
      <el-form :model="checkForm" label-width="80px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="关键字：">
              <el-input v-model="checkForm.selectParam" placeholder="请输入账户名称" style="width:60%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="查询期间：">
              <el-date-picker v-model="checkForm.checkDate" type="daterange" value-format="yyyy-MM-dd"
                range-separator="到" start-placeholder="开始日期" end-placeholder="结束日期" @change="getCheckDate">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button type="primary" @click="onQuery">查询</el-button>
              <el-button @click="onReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-row style="margin-left: 3%;margin-bottom: 20px;">
      <el-button type="primary" @click="addData">新增</el-button>
    </el-row>
    <div class="main">
      <secondLevel>
        <template v-slot:textTitle>银行账户</template>
      </secondLevel>
      <el-table :data="bankList" border style="width: 100%;margin-bottom: 20px;" height="250">
        <el-table-column prop="accountName" header-align="center" align="center" label="账户名称"></el-table-column>
        <el-table-column prop="openAccountBank" header-align="center" align="center" label="开户行"></el-table-column>
        <el-table-column prop="accountNumber" header-align="center" align="center" label="银行帐号"></el-table-column>
        <el-table-column prop="accountNature" header-align="center" align="center" label="账户性质"></el-table-column>
        <el-table-column prop="startBalance" header-align="center" align="center" label="期初余额"></el-table-column>
        <el-table-column prop="currentIncomeAmount" header-align="center" align="center" label="本期收入"></el-table-column>
        <el-table-column prop="currentExpenditureAmount" header-align="center" align="center" label="本期支出">
        </el-table-column>
        <el-table-column prop="balance" header-align="center" align="center" label="余额">
          <template slot="header" slot-scope="">
            <span>余额</span>
            <el-popover placement="top-start" width="500" trigger="hover" content="余额如与账户真实余额不符，请检查是否存在未在系统中录入的到账单或支出单">
              <img src="../../static/icon/icon-warn.png" style="width:20px;height:20px;vertical-align: middle;"
                slot="reference" />
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop header-align="center" align="center" label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" style="padding:0px" @click="expenditureDetailed('', scope.row)">收支明细
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="main">
      <secondLevel>
        <template v-slot:textTitle>现金管理</template>
      </secondLevel>
      <el-table :data="cashList" border style="width: 100%;margin-bottom: 20px;" height="250">
        <el-table-column prop="accountName" header-align="center" align="center" label="账户名称"></el-table-column>
        <el-table-column prop="cashNum" header-align="center" align="center" label="编号"></el-table-column>
        <el-table-column prop="startBalance" header-align="center" align="center" label="期初余额"></el-table-column>
        <el-table-column prop="currentIncomeAmount" header-align="center" align="center" label="本期收入"></el-table-column>
        <el-table-column prop="currentExpenditureAmount" header-align="center" align="center" label="本期支出">
        </el-table-column>
        <el-table-column prop="balance" header-align="center" align="center" label="余额">
          <template slot="header" slot-scope="">
            <span>余额</span>
            <el-popover placement="top-start" width="500" trigger="hover" content="余额如与真实余额不符，请检查是否存在未在系统中录入的现金收支情况">
              <img src="../../static/icon/icon-warn.png" style="width:20px;height:20px;vertical-align: middle;"
                slot="reference" />
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" style="padding:0px" @click="cashInput(scope.$index, scope.row)">录入
            </el-button>
            <el-button type="text" size="small" style="padding:0px" @click="cashCheck('', scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增弹出框START -->
    <el-dialog title="新增" :visible.sync="addDialog" :close-on-click-modal="false" :showClose="false" width="650px">
      <el-row style="margin-bottom:20px;">
        <el-col>
          <span style="margin-left: 10px;">新增类型：</span>
          <el-radio v-model="addType" @change="zhanghu" label="1">银行账户</el-radio>
          <el-radio v-model="addType" @change="guanli" label="2">现金管理</el-radio>
        </el-col>
      </el-row>
      <el-form v-if='zhanghu1' :model="expenditureFormAdd" :rules="expenditureRules" ref="expenditureFormAdd"
        label-width="85px" :label-position="'left'">
        <el-row>
          <el-form-item label="账户名称：" prop="accountName"
            :rules="[{ required: true, message: '请输入账户名称', trigger: 'blur' }]">
            <el-input v-model="expenditureFormAdd.accountName" placeholder="请输入" style="width:90%"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="开户行：" prop="openAccountBank">
            <el-input v-model="expenditureFormAdd.openAccountBank" placeholder="请输入" style="width:90%"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="银行账号：" prop="accountNumber">
            <el-input v-model="expenditureFormAdd.accountNumber" placeholder="请输入" style="width:60%"
              @change="getBankAccount"></el-input>
            <span style="color:red;" v-if="this.haveBankAccount">该账号已存在</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="账户性质：" prop="accountNature">
            <el-select v-model="expenditureFormAdd.accountNature" placeholder="请选择" style="width:60%"
              :disabled="this.haveBankAccount">
              <el-option label="基本存款账户" value="基本存款账户"></el-option>
              <el-option label="一般存款账户" value="一般存款账户"></el-option>
              <el-option label="专用存款账户" value="专用存款账户"></el-option>
              <el-option label="临时存款账户" value="临时存款账户"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="建账日期：" prop="createAccountDate">
              <el-date-picker style="width:90%" v-model="expenditureFormAdd.createAccountDate" type="date"
                placeholder="请选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" :picker-options="pickerParty">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="期初余额：" prop="startBalance">
              <finMoneyInput v-model="expenditureFormAdd.startBalance" :tail="'元'" :disabled="this.haveBankAccount">
              </finMoneyInput>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-button type="primary" @click="saveExpenditure('expenditureFormAdd')" :disabled="this.haveBankAccount">保存
          </el-button>
          <el-button @click="closeExpenditure('expenditureFormAdd')">关闭</el-button>
        </el-row>
      </el-form>
      <el-form v-else :model="expenditureFormAdd" :rules="expenditureRules" ref="expenditureFormAdd" label-width="85px"
        :label-position="'right'">
        <el-row>
          <el-col :span="24">
            <el-form-item label="账户名称：" prop="accountName"
              :rules="[{ required: true, message: '请输入账户名称', trigger: 'blur' }]">
              <el-input v-model="expenditureFormAdd.accountName" placeholder="请输入" style="width:46%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="编号：" prop>
              <span>{{expenditureFormAdd.mainId}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="建账日期：" prop="createAccountDate">
              <el-date-picker v-model="expenditureFormAdd.createAccountDate" type="date" placeholder="请选择日期"
                format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="期初余额：" prop="startBalance">
              <finMoneyInput v-model="expenditureFormAdd.startBalance" :tail="'元'" style="width:46%"></finMoneyInput>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-button type="primary" @click="saveExpenditure('expenditureFormAdd')">保存</el-button>
          <el-button @click="closeExpenditure('expenditureFormAdd')">关闭</el-button>
        </el-row>
      </el-form>

    </el-dialog>
    <!-- 新增弹出框END -->
    <!-- 录入弹出框START -->
    <el-dialog title="录入" :visible.sync="inputDialog" :close-on-click-modal="false" :showClose="false" width="400px">
      <el-form :model="expenditureFormIpt" :rules="expenditureRules" ref="expenditureFormIpt" label-width="85px"
        :label-position="'right'">
        <div class="baseInfo">
          <el-row>
            <el-col>
              <span class="yt-read-text">账户名称：</span>
              <span>{{this.accountName}}</span>
            </el-col>
          </el-row>
          <el-row style="margin-top:20px">
            <el-col>
              <span class="yt-read-text">编号：</span>
              <span>{{this.cashNum}}</span>
            </el-col>
          </el-row>
        </div>
        <el-row>
          <el-col :span="24">
            <el-form-item label="日期：" prop="balanceDate">
              <el-date-picker v-model="expenditureFormIpt.balanceDate" type="date" placeholder="请选择日期"
                format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="收支：" prop="balanceType">
              <!-- <el-input v-model="expenditureFormIpt.balanceType" placeholder="请输入" style="width:80%"></el-input> -->
              <el-select v-model="expenditureFormIpt.balanceType" placeholder="请选择" style="width:60%">
                <el-option label="收入" value="收入"></el-option>
                <el-option label="支出" value="支出"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="金额：" prop="balanceAmount">
              <finMoneyInput v-model="expenditureFormIpt.balanceAmount" :tail="'元'" style="width:80%"></finMoneyInput>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注：" prop>
              <el-input v-model="expenditureFormIpt.remarks" placeholder="请输入" style="width:80%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-left: 50px;margin-bottom:20px;">
          <el-col :span="24">
            <span>信息保存后不可修改，请认真核对。</span>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-button type="primary" @click="saveIptForm('expenditureFormIpt')">保存</el-button>
          <el-button type="primary" @click="saveIpt('expenditureFormIpt')">保存并继续录入</el-button>
          <el-button @click="closeIpt('expenditureFormIpt')">关闭</el-button>
        </el-row>
      </el-form>
    </el-dialog>
    <!-- 录入弹出框END -->
  </div>
</template>

<script>
  //一级标题
  import topTip from "@/components/topTip";
  //二级标题
  import secondLevel from "@/components/secondLevel";
  //金额输入框
  import finMoneyInput from "@/components/fin-money-input.vue";
  //提交附件
  import upload from "@/components/upload";
  //查看附件
  import lookFiles from "@/components/lookFiles.vue";
  //axios接口组件
  import axios from "@/service/http";
  //配置文件
  import { option } from "@/static/config";
  export default {
    data() {
      return {
        zhanghu1: true,
        checkForm: {
          selectParam: "",
          checkDate: "",
        },
        //新增弹出框新增类型
        addType: "1",
        //新增弹出框是否显示
        addDialog: false,
        //录入弹出框是否显示
        inputDialog: false,
        //新增弹出框表单
        expenditureFormAdd: {
          accountName: "",
          openAccountBank: "",
          accountNumber: "",
          accountNature: "",
          createAccountDate: "",
          startBalance: 0,
          mainId: "保存后自动生成，编号全机构顺排，XJGL+四位流水",
        },
        //录入弹出框表单
        expenditureFormIpt: {
          mainId: "",
          balanceDate: "",
          balanceType: "",
          balanceAmount: 0,
          remarks: "",
        },
        //弹出框表单必填验证
        expenditureRules: {
          accountName: [
            { required: true, message: "请输入账户名称", trigger: "blur" },
          ],
          openAccountBank: [
            { required: true, message: "请输入开户行", trigger: "blur" },
          ],
          accountNumber: [
            { required: true, message: "请输入银行账号", trigger: "blur" },
          ],
          accountNature: [
            { required: true, message: "请选择账户性质", trigger: "blur" },
          ],
          createAccountDate: [
            { required: true, message: "请选择建账日期", trigger: "blur" },
          ],
          startBalance: [
            { required: true, message: "请输入期初余额", trigger: "blur" },
            { validator: this.tails, trigger: "blur" },
          ],
          balanceDate: [
            { required: true, message: "请选择日期", trigger: "blur" },
          ],
          balanceType: [
            { required: true, message: "请选择收支", trigger: "change" },
          ],
          balanceAmount: [
            { required: true, message: "请输入金额", trigger: "blur" },
          ],
        },
        //银行管理列表
        bankList: [],
        //现金管理列表
        cashList: [],
        //验证银行账户是否存在
        haveBankAccount: false,
        //建账日期是否禁用
        pickerParty: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
        },
        //录入还是新增
        cashBol: false,
        //现金管理列表index值
        cashListIndex: null,
        //录入表单 公司名称和编号
        accountName: "",
        cashNum: "",
        forms: {},
      };
    },
    components: {
      topTip,
      secondLevel,
      finMoneyInput,
      upload,
      lookFiles,
    },
    watch: {
      //监控新增类型单选按钮
      addType(newVal, oldVal) {
        if (newVal == "1") {
          this.expenditureFormAdd = {
            accountName: "",
            openAccountBank: "",
            accountNumber: "",
            accountNature: "",
            createAccountDate: "",
            startBalance: 0,
            mainId: "保存后自动生成，编号全机构顺排，XJGL+四位流水",
          };
          var nowData =
            new Date().getFullYear() +
            "-" +
            (new Date().getMonth() + 1) +
            "-" +
            new Date().getDate();
          this.expenditureFormAdd.createAccountDate = nowData;
        } else if (newVal == "2") {
          this.expenditureFormAdd = {
            addType: "2",
            accountName: "",
            openAccountBank: "",
            accountNumber: "",
            accountNature: "",
            createAccountDate: "",
            startBalance: 0,
            mainId: "保存后自动生成，编号全机构顺排，XJGL+四位流水",
          };
          var nowData = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate();
          this.expenditureFormAdd.createAccountDate = nowData;
        }
      },
    },
    mounted() {
      this.checkForm.checkDate = new Array(2);
      this.checkForm.checkDate[0] = new Date().getFullYear() + "-" + ((new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)) + "-01";
      this.checkForm.checkDate[1] = new Date().getFullYear() + "-" + ((new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)) + "-" + (+ new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate());
      this.getBankAccountList()
      this.getCashManageList()
    },
    methods: {
      zhanghu() {
        this.zhanghu1 = true
      },
      tails(rule, value, callback) {
        if (this.expenditureFormAdd.startBalance === 0) {
          this.$message({
            message: '请输入期初余额',
            type: 'warning'
          });
        } else {
          callback();
        }
      },
      guanli() {
        this.haveBankAccount = false
        this.zhanghu1 = false

      },
      //查询期间日期改变事件
      getCheckDate(value) {
        this.checkForm.checkDate = value;
      },
      //查询按钮
      onQuery() {
        this.getBankAccountList();
        this.getCashManageList();
      },
      //重置按钮
      onReset() {
        this.checkForm.selectParam = "";
        this.checkForm.checkDate = "";
        this.getBankAccountList();
        this.getCashManageList();
      },
      //新增按钮
      addData() {
        this.addDialog = true;
        var nowData =
          new Date().getFullYear() +
          "-" +
          (new Date().getMonth() + 1) +
          "-" +
          new Date().getDate();
        this.expenditureFormAdd.createAccountDate = nowData;
        if (this.haveBankAccount == true) {
          this.pickerParty = {
            disabledDate(time) {
              return time.getTime() != Date.now();
            },
          };
        } else {
          this.pickerParty = {
            disabledDate(time) {
              return time.getTime() > Date.now();
            },
          };
        }
      },
      //新增弹出框关闭按钮
      closeExpenditure(formName) {
        this.haveBankAccount = false
        this.addDialog = false;
        this.$refs.expenditureFormAdd.resetFields();
        this.expenditureFormAdd = {
          accountName: "",
          openAccountBank: "",
          accountNumber: "",
          accountNature: "",
          createAccountDate: "",
          startBalance: 0,
          mainId: '保存后自动生成，编号全机构顺排，XJGL+四位流水',
        };

      },
      //验证银行账号是否存在
      getBankAccount(value) {
        var that = this;
        axios
          .post(option.base_path + "db/capital/getAccountNumber", {
            accountNumber: value,
          })
          .then(function (res) {
            if (res.data.data != null) {
              that.haveBankAccount = true;
              that.pickerParty = {
                disabledDate(time) {
                  return time.getTime() != Date.now();
                },
              };
            } else {
              that.haveBankAccount = false;
              that.pickerParty = {
                disabledDate(time) {
                  return time.getTime() > Date.now();
                },
              };
            }
          });
      },
      // 银行管理 支出明细事件
      expenditureDetailed(path, row) {
        this.$router.replace({
          path: "/capitalAdministration/expenditureDetailed",
          query: {
            pkId: row.pkId,
            accountName: row.accountName,
            accountNumber: row.accountNumber,
            startDate: this.checkForm.checkDate[0],
            endDate: this.checkForm.checkDate[1],
          },
        });
      },
      // 现金管理 录入事件
      cashInput(index, row) {
        this.inputDialog = true;
        var nowData = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate();
        this.accountName = row.accountName;
        this.cashNum = row.cashNum;
        this.expenditureFormIpt.balanceDate = nowData;
        this.expenditureFormIpt.mainId = row.pkId;
      },
      // 现金管理 录入保存事件
      saveIptForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let that = this;
            let data = {};
            data.mainId = this.expenditureFormIpt.mainId;
            data.balanceDate = this.expenditureFormIpt.balanceDate;
            data.balanceType = this.expenditureFormIpt.balanceType;
            data.balanceAmount = this.expenditureFormIpt.balanceAmount;
            data.remarks = this.expenditureFormIpt.remarks;
            axios
              .post(option.base_path + "db/capital/saveCashManageDetails", data)
              .then(function (res) {
                that.inputDialog = false;
                that.$refs[formName].resetFields();
                that.getCashManageList();
              })
          }
        });
      },
      // 现金管理 录入保存并录入事件
      saveIpt(formName) {
        // this.cashInput();
        debugger
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let that = this;
            this.forms = {};
            debugger
            console.log('弹窗', this.expenditureFormIpt)
            this.forms.mainId = this.expenditureFormIpt.mainId;
            this.forms.balanceDate = this.expenditureFormIpt.balanceDate;
            this.forms.balanceType = this.expenditureFormIpt.balanceType;
            this.forms.balanceAmount = this.expenditureFormIpt.balanceAmount;
            this.forms.remarks = this.expenditureFormIpt.remarks;
            axios
              .post(option.base_path + "db/capital/saveCashManageDetails", this.forms)
              .then(function (res) {
                that.inputDialog = true;
                // that.expenditureFormIpt={
                //   balanceDate:"",
                //   balanceType:"",
                //   balanceAmount:0,
                //   remarks:"",
                // }
                that.expenditureFormIpt.balanceType = '';
                that.expenditureFormIpt.balanceAmount = 0;
                that.expenditureFormIpt.remarks = '';
                var nowData = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate();
                that.expenditureFormIpt.balanceDate = nowData;
                // that.expenditureFormIpt.balanceDate =data.mainId;
                // tpenditureFormIpt.mainId =this.expenditureFormIpt.mainIhat.exd;
                that.$refs[formName].resetFields();
                that.getCashManageList();
              })
          }
        });
      },
      // 现金管理 录入关闭事件
      closeIpt(formName) {
        this.inputDialog = false;
        this.expenditureFormIpt = {
          mainId: "",
          balanceDate: "",
          balanceType: "",
          balanceAmount: 0,
          remarks: "",
        }
        this.$refs[formName].resetFields();
      },
      // 现金管理 查看事件
      cashCheck(index, row) {
        this.$router.replace({
          path: "/capitalAdministration/capitalCheck",
          query: {
            pkId: row.pkId,
            accountName: row.accountName,
            cashNum: row.cashNum,
            startDate: this.checkForm.checkDate[0],
            endDate: this.checkForm.checkDate[1],
          },
        });
      },
      //银行管理和现金管理 新增 this.addType=='1'为银行管理 this.addType=='2'为现金管理
      saveExpenditure(formName) {
        debugger
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.addType == "1") {
              var that = this;
              let data = {};
              data.pkId = "";
              // startBalance
              data.accountName = this.expenditureFormAdd.accountName;
              data.startBalance = this.expenditureFormAdd.startBalance;
              data.openAccountBank = this.expenditureFormAdd.openAccountBank;
              data.accountNumber = this.expenditureFormAdd.accountNumber;
              data.accountNature = this.expenditureFormAdd.accountNature;
              data.createAccountDate = this.expenditureFormAdd.createAccountDate;
              // data.startBalance = this.expenditureFormAdd.startBalance;
              axios
                .post(option.base_path + "db/capital/saveBankAccount", data)
                .then(res => {
                  that.$message({
                    message: "新增成功",
                    type: "success",
                  });
                  this.getBankAccountList();
                  this.getCashManageList();
                  this.addDialog = false
                });
              this.addType = "1";
              this.expenditureFormAdd = {
                accountName: "",
                openAccountBank: "",
                accountNumber: "",
                accountNature: "",
                createAccountDate: "",
                startBalance: 0,
                mainId: "保存后自动生成，编号全机构顺排，XJGL+四位流水",
              };
              this.getBankAccountList();
              this.getCashManageList();
            } else if (this.addType == "2") {
              var that = this;
              let data = {};
              data.pkId = "";
              data.accountName = this.expenditureFormAdd.accountName;
              data.createAccountDate = this.expenditureFormAdd.createAccountDate;
              data.startBalance = this.expenditureFormAdd.startBalance;
              axios
                .post(option.base_path + "db/capital/saveCashManage", data)
                .then(res => {
                  if (res.data.flag == 0) {
                    that.$message({
                      message: "新增成功",
                      type: "success",
                    });
                  }
                  this.getBankAccountList();
                  this.getCashManageList();
                  this.addDialog = false
                });

              this.addType = "2";
              this.expenditureFormAdd = {
                accountName: "",
                openAccountBank: "",
                accountNumber: "",
                accountNature: "",
                createAccountDate: "",
                startBalance: 0,
                mainId: "保存后自动生成，编号全机构顺排，XJGL+四位流水",
              };
              this.getBankAccountList();
              this.getCashManageList();
              var nowData =
                new Date().getFullYear() +
                "-" +
                (new Date().getMonth() + 1) +
                "-" +
                new Date().getDate();
              this.expenditureFormAdd.balanceDate = nowData;

            }
          }
        });
      },
      //获取银行账号列表
      getBankAccountList() {
        // debugger
        let data = {};
        data.selectParam = this.checkForm.selectParam;
        data.startDate = this.checkForm.checkDate[0];
        data.endDate = this.checkForm.checkDate[1];
        axios
          .post(option.base_path + "db/capital/getBankAccountList", data)
          .then((res) => {
            // debugger
            this.bankList = res.data.data;
            this.bankList.forEach((item, index) => {
              item.startBalance = item.startBalance
                .toFixed(2)
                .replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
              item.currentIncomeAmount = item.currentIncomeAmount
                .toFixed(2)
                .replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
              item.currentExpenditureAmount = item.currentExpenditureAmount
                .toFixed(2)
                .replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
              item.balance = item.balance
                .toFixed(2)
                .replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            });
          })
          .catch((err) => err);
      },
      //获取现金管理列表
      getCashManageList() {
        // debugger
        let data = {};
        data.selectParam = this.checkForm.selectParam;
        data.startDate = this.checkForm.checkDate[0];
        data.endDate = this.checkForm.checkDate[1];
        axios
          .post(option.base_path + "db/capital/getCashManageList", data)
          .then((res) => {
            this.cashList = res.data.data;
            this.cashList.forEach((item, index) => {
              item.startBalance = item.startBalance
                .toFixed(2)
                .replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
              item.currentIncomeAmount = item.currentIncomeAmount
                .toFixed(2)
                .replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
              item.currentExpenditureAmount = item.currentExpenditureAmount
                .toFixed(2)
                .replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
              item.balance = item.balance
                .toFixed(2)
                .replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            });
          })
          .catch((err) => err);
      },

    },
  };
</script>

<style scoped>
  .main {
    margin: 10px 20px;
    /* border: 1px black solid; */
  }

  .baseInfo {
    margin: 0px 30px 20px 30px;
  }

  .yt-read-text {
    color: rgb(65, 112, 149);
    font-weight: bold;
  }
</style>

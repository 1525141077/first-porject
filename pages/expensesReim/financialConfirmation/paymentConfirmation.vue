<template>
  <div class="yt-dome-container">
    <!-- :style="publicHeight" -->
    <el-container>
      <!-- 页面头部 -->
      <el-header class="yt-header">
        <el-form
          ref="form"
          :model="form"
          label-width="120px"
          :label-position="labelposition"
          size="small"
        >
          <el-row>
            <el-col :span="10">
              <el-form-item label="关  键  字：">
                <el-input v-model="form.queryParams" class placeholder="请输入单据类型/单据编号" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3" style="text-align: right;">
              <el-button type="primary" @click="getProjectList()">查询</el-button>
              <el-button type="info" @click="resetForm('form')">重置</el-button>
            </el-col>
          </el-row>
          <!-- <el-row>
            <el-col :span="6" style="text-align: left;margin: 0px 0px 5px -15px;">
              <el-button type="primary" @click="toPage('/projectApproval/projectApproval','')">新增项目</el-button>
            </el-col>
          </el-row>-->
        </el-form>
      </el-header>
      <div
        style="height: 5px;background-color: #f3f3f3;border-top: 1px solid #dfe6f3;border-bottom: 1px solid #dfe6f3;"
      ></div>
      <!-- 页面主体 -->
      <el-row style="margin:0px 10px;margin-top:15px">
        <el-col :span="12">
          <template>
            状态：
            <el-radio-group v-model="radio" @change="changeState">
              <el-radio :label="2">已付款</el-radio>
              <el-radio :label="1">待付款</el-radio>
              <el-radio :label="0">全部</el-radio>
            </el-radio-group>
          </template>
        </el-col>
      </el-row>
      <el-row style="margin:15px 10px;">
        <el-col :span="2">
          <el-button type="primary" @click="closedialog(tableData)">支付确认</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="printEven">打印支出明细申请单</el-button>
        </el-col>
      </el-row>
      <!-- @select-all="tableCheckAll" -->
      <el-table :data="tableData" border @selection-change="tableCheck" style="width: 100%">
        <el-table-column type="selection" align="center" width="55px"></el-table-column>
        <el-table-column prop="appNum" label="单据编号" align="center" width="130px">
          <template slot-scope="scope">
            <span
              style="color:#417095;cursor: pointer;"
              @click="toDetailPage('/expensesReim/expenseAppDetail',scope.row)"
            >{{scope.row.appNum}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="costName" label="单据类型" align="center" width="130px"></el-table-column>
        <el-table-column label="申请日期" align="center" width="120px">
          <template slot-scope="scope">{{ scope.row.applicationTime }}</template>
        </el-table-column>
        <el-table-column prop="expMatters" label="支出事由" align="left" width="150px"></el-table-column>
        <el-table-column prop="transfer" label="支付方式转账（元）" align="right" width="120px">
          <template slot-scope="scope">
            <span>{{scope.row.transfer| moneyFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cash" label="支付方式现金（元）" align="right" width="120px">
          <template slot-scope="scope">
            <span>{{scope.row.cash| moneyFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="receivablesName" label="收款方" align="center" width="100px"></el-table-column>
        <el-table-column prop="accounts" label="收款账号" width="130px"></el-table-column>
        <el-table-column prop="openBank" label="收款银行" align="center" width="130px"></el-table-column>
        <el-table-column prop="compName" label="付款公司" align="center" width="130px"></el-table-column>
        <el-table-column prop label="状态" align="center" width="80px">
          <template scope="scope">
            <span v-if="scope.row.paymentConfirmation == ''">未付款</span>
            <span v-else-if="scope.row.paymentConfirmation == 1">未付款</span>
            <span v-else-if="scope.row.paymentConfirmation == 2">已付款</span>
          </template>
        </el-table-column>
        <el-table-column prop label="支付日期" width="200px">
          <template scope="scope">
            <div class="block">
              <el-date-picker
                v-model="scope.row.paymentDate"
                value-format="yyyy-MM-dd"
                type="date"
                style="width:180px"
                placeholder="选择日期"
              ></el-date-picker>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- @size-change="handleSizeChange"
      @current-change="handleCurrentChange"-->
      <el-pagination
        background
        :current-page="currentPage"
        :page-sizes="[15, 30, 50, 100, 200, 500]"
        :page-size="15"
        layout="total, prev, pager, next, sizes"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </el-container>
    <!-- 支付确认弹出框信息start -->
    <el-dialog title="支付确认" style="width:1250px;" :visible.sync="dialogLogsVisible">
      <el-form v-model="value" ref="value" class="demo-ruleForm">
        <el-row>
          <el-col :span="19">
            <el-form-item label="单据编号：">
              <span>{{number}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="19">
            <el-form-item label="付款公司：">
              <span>{{compName}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="this.transfer==0"></el-row>
        <el-row v-else>
          <el-col :span="6">
            <el-form-item label="支付方式：">
              <span>转账</span>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="金额：">
              <span>{{transfer | moneyFormat }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item
              label="付款银行账号："
              prop="accountNumber"
              :rules="[{ required:true, message: '请选择', trigger: 'blur' }]"
            >
              <!-- <div style="color: #F56C6C;font-size: 15px;line-height: 1;padding-top: 0px;position: absolute;top:35%;left: -3%;">*</div> -->
              <template>
                <el-select placeholder="请选择" v-model="bankList.accountNumber">
                  <el-option v-for="item in bankList" :label="item.accountNumber"></el-option>
                </el-select>
              </template>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="this.cash==0"></el-row>
        <el-row v-else>
          <el-col :span="6">
            <el-form-item label="支付方式：">
              <span>现金</span>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="金额：">
              <span>{{cash | moneyFormat }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item
              label="现金银行账户："
              prop="cashNum"
              :rules="[{ required:true, message: '请选择', trigger: 'blur' }]"
            >
              <!-- <div style="color: #F56C6C;font-size: 15px;line-height: 1;padding-top: 0px;position: absolute;top:35%;left: -3%;">*</div> -->
              <template>
                <el-select placeholder="请选择" v-model="cashList.cashNum">
                  <el-option v-for="item in cashList" :label="item.cashNum"></el-option>
                </el-select>
              </template>
            </el-form-item>
          </el-col>
        </el-row>
        <div style="text-align:center;padding-top:20px">
          <el-button
            type="primary"
            :visible.sync="dialogLogsVisible"
            @click="paymentConfirmation"
          >确定</el-button>
          <el-button
            type="info"
            :visible.sync="dialogLogsVisible"
            @click="dialogLogsVisible=false"
          >取消</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!-- 支付确认弹出框信息end -->
    <!-- 提示弹出框信息start -->
    <!-- <el-dialog title="支付确认" style="width:1250px;" :visible.sync="dialogLogsVisibleTwo">
      <el-form>
        <div style="text-align:center;padding-top:20px">
          <el-button type="primary" :visible.sync="dialogLogsVisibleTwo" @click="">确定</el-button>
          <el-button type="info" :visible.sync="dialogLogsVisibleTwo" @click="dialogLogsVisibleTwo=false">取消</el-button>
        </div>
      </el-form>
    </el-dialog>-->
    <!-- 提示弹出框信息end -->
  </div>
</template>

<script>
import axios from "../../../service/http";
import { option } from "../../../static/config";
export default {
  // 数据源
  data() {
    return {
      judgeOne: "", //判断付款公司是否一样
      judgeTwo: "", //判断付款公司是否一样
      bankId: "", //银行账号id
      cashId: "", //现金id
      bankList: [], //付款银行账号的列表
      cashList: [], //现金账户编号的列表
      conmpy: [], //点击多选框获公司名称
      compName: "", //弹出框付款公司
      number: "", //弹出框单据编号列
      transfer: 0, //弹出框现金金额
      cash: 0, //弹出框转账金额
      dialogLogsVisible: false, //弹出框关闭保存
      dialogLogsVisibleTwo: true, //弹出框关闭保存
      radio: 0,
      multipleSelection: [],
      disabled: false,
      that: this,
      form: {
        queryParams: "",
        pageIndex: 1,
        pageNum: 15,
      },
      total: 0,
      currentPage: 1,
      labelposition: "right",
      tableData: [],
      value: {
        cash: "",
        transfer: "",
      },
    };
  },
  watch: {
    disabled: {
      handler(newVal, oldVal) {
        this.disabled = newVal;
      },
    },
  },
  // 初始化执行
  mounted() {
    this.getProjectList();
  },
  // 方法声明
  methods: {
    tableCheck(val) {
      this.multipleSelection = val;
      try {
        this.multipleSelection = val;
        // console.log("埃尔文",this.multipleSelection)
        var list = this.multipleSelection.map((v) => v.compName);
        this.multipleSelection.forEach((v, i) => {
          list.forEach((x) => {
            this.judgeOne = x;
            this.judgeTwo = v.compName;
            console.log("第三方三", this.judgeOne);
            console.log("飞色色", this.judgeTwo);
            if (x != v.compName) {
              console.log("www");
              throw new Error("取消全选！");
            }
          });
        });
      } catch (e) {}
    },
    // tableCheckAll(val) {
    //   this.multipleSelection = val;
    // },

    //弹出框部分，获取信息以及打开关闭弹出框
    closedialog(rows) {
      if (this.multipleSelection.length == 0) {
        this.$message("请选中数据进行操作");
      } else if (this.judgeOne != this.judgeTwo) {
        this.$message("请选择相同付款公司的单据，进行支付确认");
      } else {
        this.transfer = 0;
        var number = "";
        var compName = "";
        this.dialogLogsVisible = true;
        //遍历每行选中的数据
        this.multipleSelection.forEach((a) => {
          console.log("沙发问问", a);
          number += a.appNum + "、";
          // this.number.substring(this.number.length,this.number.length-1)
          this.compName = a.compName;
          let cash = Number(a.cash); //现金金额

          let transfer = Number(a.transfer); //转账金额
          this.cash += cash;
          this.transfer += transfer;
          console.log("事服务费启", this.compName);
        });
        let nb = number.substring(0, number.length - 1);
        // let cn= compName.substring(0,compName.length-1)
        this.number = nb; //单据编号
        // this.compName=cn//公司名称

        axios
          .post(
            option.base_path + "sz/expenditureApp/getAccountNumberByCompName",
            {
              compName: this.compName,
            }
          )
          .then((data) => {
            // this.peopleList.push(man)
            this.bankList = data.data.data.bankList;
            this.cashList = data.data.data.cashList;
            // this.total = data.data.data.total;
            this.bankList.forEach((v) => {
              this.bankId = v.bankId;
            });
            this.cashList.forEach((v) => {
              this.cashId = v.cashId;
            });
            console.log("返回值", this.bankList);
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    paymentConfirmation() {
      if (this.multipleSelection.length == 0) {
        this.$message("请选中数据进行操作");
      } else {
        this.updateAccountingConfirmationStateById();
        this.dialogLogsVisible = false;
      }
    },
    //支付确认内容修改
    updateAccountingConfirmationStateById() {
      var arr = this.multipleSelection;
      let multis = [];
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].paymentDate == null || arr[i].paymentDate == "") {
          this.$message("请填写全部选中列的日期");
          return false;
        }
        multis.push({
          dateOfPayment: arr[i].paymentDate, //日期
          receivablesId: arr[i].receivablesId, //收款方信息表Id
          paymentConfirmation: 2, //付款确认状态
          receivablesType: arr[i].receivablesType, //收款方类型
          cash: arr[i].cash, //支付方式现金
          pkId: arr[i].pkId, //pkid
          transfer: arr[i].transfer, //支付方式转账
          appNum: arr[i].appNum, //单据编号
          costType: arr[i].costType, //
          receivablesName: arr[i].receivablesName, //收款方
          accounts: arr[i].accounts, //收款方账号
        });
      }
      multis = JSON.stringify(multis);
      axios
        .post(
          option.base_path +
            "sz/expenditureApp/updatePaymentConfirmationStateById",
          {
            paymentInfoJson: multis,
            bankId: this.bankId,
            cashId: this.cashId,
          }
        )
        .then((data) => {
          if (data.data.flag == 0) {
            this.$message(data.data.message);
            //刷新页面
            this.getProjectList();
          } else {
            this.$message("保存失败");
          }
          console.log("返回值", data.data.flag);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    //跳转支出明细打印页面
    printEven() {
      if (this.multipleSelection.length != 1) {
        this.$message("请选中一行数据进行操作");
      } else {
        this.toPage("/priorApp/printDetails", this.multipleSelection[0]);
      }
    },
    toPage(path, row) {
      this.$router.replace({
        path: path,
        query: {
          expenditureAppId: row.pkId,
          costType: row.costType,
        },
      });
    },
    toDetailPage(path, row) {
      this.$router.replace({
        path: path,
        query: {
          pkId: row.pkId,
          approvalState: 2, //1是从审批页进入  2是点击单号进入
        },
      });
    },
    changeState() {
      this.getProjectList();
    },
    resetForm(form) {
      this.form = {
        queryParams: "",
        pageIndex: 1,
        pageNum: 15,
      };
      this.radio = 0;
      this.getProjectList();
    },
    getProjectList() {
      var me = this;
      //调用axios.post方法
      //"CASPARAMS":"OFF_INDEX"
      var data = {
        queryParams: this.form.queryParams,
        paymentConfirmationState: this.radio,
        pageNum: this.form.pageNum,
        pageIndex: this.form.pageIndex,
      };
      axios
        .post(
          option.base_path +
            "sz/expenditureApp/getPaymentConfirmationListByParams",
          data
        )
        .then((data) => {
          // this.peopleList.push(man)
          this.tableData = data.data.data.rows;
          this.total = data.data.data.total;
          console.log("返回值", data.data.data.rows);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    //手动切换每页条数
    handleSizeChange(val) {
      this.form.pageNum = val;
      console.log(`每页 ${val} 条`);
      //刷新
      this.getProjectList();
    },
    //手动切换页数
    handleCurrentChange(val) {
      this.form.pageIndex = val;
      console.log(`当前页: ${val}`);
      //刷新
      this.getProjectList();
    },
  },
  // 组件注册
  components: {},
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
    },
  },
};
</script>

<style>
.name-farst {
  text-overflow: ellipsis;
  width: 34px;
  display: inline-block;
  overflow: hidden;
}
.center-line {
  color: #417095;
}
</style>

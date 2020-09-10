<template>
  <div class="yt-dome-container">
    <!-- :style="publicHeight" -->
    <el-container>
      <!-- 页面头部 -->
      <el-header class="yt-header">
        <el-form label-width="120px" size="small">
          <el-row>
            <el-col :span="10">
              <el-form-item label="关  键  字：">
                <el-input  v-model="form.queryParams" class placeholder="请输入凭证号/单据编号" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3" style="text-align: right;">
              <el-button type="primary" @click="getProjectList()">查询</el-button>
              <el-button type="info" @click="resetForm('form')">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <!-- 分割新部分 -->
      <div
        style="height: 5px;background-color: #f3f3f3;border-top: 1px solid #dfe6f3;border-bottom: 1px solid #dfe6f3;"
      ></div>
      <!-- 页面主体 -->
      <div style="margin:20px 0px 20px 10px">
        <span>状态：</span>
        <el-radio-group v-model="radio">
          <el-radio :label="3" @change="operation()" v-model="form.accountingStatus">已记账</el-radio>
          <el-radio :label="6" @change="unoperation()" v-model="form.accountingStatus">未记账</el-radio>
          <el-radio :label="9" @change="all()">全部</el-radio>
        </el-radio-group>
      </div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="appNum" label="单据编号" width="150"  align="center">
          <template slot-scope="scope">
                 <span style="color:#417095;cursor: pointer;" @click="toPage1('./expenseAppDetail',scope.row)">{{scope.row.appNum}}</span>
              </template>
        </el-table-column>
        <el-table-column prop="applicantTime" label="申请日期"  align="center"></el-table-column>
        <el-table-column prop="typeName" label="支出类型"  align="center"></el-table-column>
        <el-table-column prop="expenditureAppName" label="支出事由"></el-table-column>
        <el-table-column prop="normalName" label="费用明细"></el-table-column>
        <el-table-column prop="normalAmount" label="金额（元）"  align="right">
          <template scope="scope">
            <span >{{scope.row.normalAmount | moneyFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="billingDate" label="记账日期" width="175" align="center">
          <template slot-scope="scope">
            <el-date-picker
              v-model="scope.row.billingDate"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              v-show="!scope.row.show"
              style="width:150px;"
            ></el-date-picker>
            <span v-show="scope.row.show">{{scope.row.billingDate}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="documentNumber" label="凭证号" width="175"  align="center">
          <template slot-scope="scope">
            <el-input
            prop="name"
              placeholder="请输入凭证号"
              v-show="!scope.row.show"
              v-model="scope.row.documentNumber"
             :class="scope.row.documentNumber ? '':'bor-red'"
            ></el-input>
            <span v-show="scope.row.show">{{scope.row.documentNumber}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="accountingStatus" label="状态"  align="center">
          <template scope="scope">
            <span v-if="scope.row.accountingStatus == 1">已记账</span>
            <span v-else-if="scope.row.accountingStatus == 2">待记账</span>
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作">
          <template slot-scope="scope">
            <i
              class="el-icon-edit"
              @click="changeDom(scope.row,scope.$index)"
              style="color:rgb(141,158,255);margin-left:20px"
            ></i>
            <i
              class="el-icon-circle-check"
              @click="changeDomTwo(scope.row,scope.$index)"
              style="color:rgb(141,158,255);margin-left:20px"
            ></i>
          </template>
        </el-table-column>
      </el-table>
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
  </div>
</template>
<script>
import axios from "../../service/http";
import { option } from "../../static/config";
export default {
  // 数据源
  data() {
    return {
      form: {
        accountingState: "",
        queryParams: "",
        pageIndex: 1,
        pageNum: 15,
        yitianSSODynamicKey: "",
        dynamicKey: "",
        systemCode:""
      },
       //表单验证
// rules: {
//           name: [
//             { required: true, message: '请输入活动名称', trigger: 'blur' },
//             { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
//           ]
//     },
      total: 0,
      currentPage: 1,
      radio: 9,
      tableData: []

    };
  },
  // 初始化执行
  mounted() {
    this.getProjectList();
  },
  // 方法声明
  methods: {
    
    //手动切换每页条数
    handleSizeChange(val) {
      this.form.pageNum = val;
      console.log(`每页 ${val} 条`);
      this.getProjectList();
    },
    //手动切换页数
    handleCurrentChange(val) {
      this.form.pageIndex = val;
      console.log(`当前页: ${val}`);
      this.getProjectList();
    },
    // 已记账
    operation() {
      this.form = {
        accountingState: "1",
        queryParams: "",
        pageIndex: 1,
        pageNum: 15,
        yitianSSODynamicKey: "",
        dynamicKey: ""
      };
      this.getProjectList();
    },
    // 未记账
    unoperation() {
      this.form = {
        accountingState: "2",
        queryParams: "",
        pageIndex: 1,
        pageNum: 15,
        yitianSSODynamicKey: "",
        dynamicKey: ""
      };
      this.getProjectList();
    },
    // 全部
    all() {
      this.form = {
        accountingState: "",
        queryParams: "",
        pageIndex: 1,
        pageNum: 15,
        yitianSSODynamicKey: "",
        dynamicKey: ""
      };
      this.getProjectList();
    },
    // 重置
    resetForm(form) {
      this.form = {
        accountingState: "",
        queryParams: "",
        pageIndex: 1,
        pageNum: 15,
        yitianSSODynamicKey: "",
        dynamicKey: ""
      };
       this.radio=9
      this.getProjectList();
    },
    //保存修改
    upDate(){
 var me = this;
      //调用axios.post方法
      //"CASPARAMS":"OFF_INDEX"
      axios
        .post(
          option.base_path +
            "sz/expenditureApp/updateAccountingConfirmationStateById",
          {
            normalId: '',
            accountingStatus: '',
            billingDate: '',
            documentNumber: '',
             yitianSSODynamicKey:'' ,
          }
        )
        .then(res => {
          console.log('sdsdvsdvsdv 胜多负少ds',this.tableData)
          // this.tableData = res.data.data.rows;
          // this.tableData.forEach((item, i, arr) => {
          //   arr[i].show = true;
          //   console.log(arr);
          // });
          // console.log("返回值", res.data.data.rows);
          // this.total = res.data.data.total;
        })
        .catch(err => err);
    },
    // 查询
    getProjectList() {
      var me = this;
      //调用axios.post方法
      //"CASPARAMS":"OFF_INDEX"
      axios
        .post(
          option.base_path +
            "sz/expenditureApp/getAccountingConfirmationListByParams",
          this.form
        )
        .then(res => {
          this.tableData = res.data.data.rows;
          this.tableData.forEach((item, i, arr) => {
            arr[i].show = true;
            console.log(arr);
          });
          console.log("返回值", res.data.data.rows);
          this.total = res.data.data.total;
        })
        .catch(err => err);
      // .catch(function(error) {
      //   console.log(error);
      // });
    },
    //跳转到支出申请页
    toPage1(path, row) {
      this.$router.replace({
        path: path,
        query: {
          pkId: row.appId,
          approvalState:2
        //   costType: row.costType
        }
      });
    },
    // 点击修改
    changeDom (row, index) {
        let tableData = JSON.parse(JSON.stringify(this.tableData));
        tableData[index].show = false;
        this.tableData = tableData;
    },
    // 点击保存
    changeDomTwo (row, index) {
        let tableData = JSON.parse(JSON.stringify(this.tableData));
        
        console.log("h哈哈哈",tableData[index].documentNumber)
        if (tableData[index].documentNumber=="") {
          this.$message.error('请输入凭证号');
        }else{
           axios
        .post(
          option.base_path +
            "sz/expenditureApp/updateAccountingConfirmationStateById",
          {
            normalId:  tableData[index].pkId,
            accountingStatus:  tableData[index].accountingStatus,
            billingDate: tableData[index].billingDate,
            documentNumber: tableData[index].documentNumber,
             yitianSSODynamicKey:'' ,
          }
        )
        .then(res => {
          console.log( '数据',tableData[index].billingDate)
        })
        .catch(err => err);
tableData[index].show = true;
        tableData[index].accountingStatus=1;
this.$message({
          showClose: true,
          message: '保存成功',
          type: 'success'
        });
        }
        this.tableData = tableData;
       
    }
  },
  filters:{
moneyFormat (num) {
      if (num) {
        num = Number(num)
        num = (num.toFixed(2) + '').replace(
          /\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,
          '$&,'
        )
      }
      return num || '0.00'
    }
  },
  // 组件注册
  components: {}
};
</script>
<style >
.bor-red input.el-input__inner{
  border:1px solid red ; 
  border-radius:7px;
  z-index:99999;
}
</style>
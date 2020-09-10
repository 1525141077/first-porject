<template>
  <div class="yt-dome-container">
    <!-- 顶部信息START -->
    <topTip>
      <template>
        <el-row>
          <el-col :span="15" class="top-tip" style="text-align: left;">
            <div>
              <span style="color: #417095;font-size: 16px;font-weight: bolder;">基本信息</span>
            </div>
          </el-col>
          <el-col :span="8" style="text-align: right;">
            <div>
              <label style="margin-right:20px">
                <span style="color:#003465;letter-spacing:4px">申请编号：</span>
                <span>{{marketPerformanceNum==""?'提交后自动生成':marketPerformanceNum}}</span>
              </label>
            </div>
          </el-col>
        </el-row>
      </template>
    </topTip>
    <!-- 顶部信息END -->
    <!-- 表单 -->
    <el-form :model="ruleForm" ref="ruleForm" label-width="130px">
      <el-row>
        <el-col :span="10">
          <div
            v-if="this.$route.query.archivesState=='2'||this.$route.query.archivesState=='3'"
            style="margin-bottom: 20px;"
          >
            <span class="yt-read-text" style="margin-left:20px">姓名：</span>
            <span>{{ ruleForm.projectName+"/"+ruleForm.projectId}}</span>
          </div>
          <el-form-item label="项目名称/编号：" prop="name" v-else>
            <span>{{ruleForm.projectName+"/"+ruleForm.projectId}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <div
            v-if="this.$route.query.archivesState=='2'||this.$route.query.archivesState=='3'"
            style="margin-bottom: 20px;"
          >
            <span class="yt-read-text" style="margin-left:20px">立项申请人：</span>
            <span>{{ruleForm.createUserName==""?"--":ruleForm.createUserName}}</span>
          </div>
          <el-form-item label="立项申请人：" prop="name" v-else>
            <span>{{ruleForm.createUserName==""?"--":ruleForm.createUserName}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <div
            v-if="this.$route.query.archivesState=='2'||this.$route.query.archivesState=='3'"
            style="margin-bottom: 20px;"
          >
            <span class="yt-read-text" style="margin-left:20px">客户名称：</span>
            <span>{{ ruleForm.customerName==""?"--":ruleForm.customerName}}</span>
          </div>
          <el-form-item
            label="客户名称："
            prop="name"
            v-if="this.$route.query.archivesState=='1'||!this.$route.query.archivesState"
          >
            <span>{{ruleForm.customerName==""?"--":ruleForm.customerName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <div
            v-if="this.$route.query.archivesState=='2'||this.$route.query.archivesState=='3'"
            style="margin-bottom: 20px;"
          >
            <span class="yt-read-text" style="margin-left:20px">项目类型：</span>
            <span>{{ ruleForm.projectTypeName==""?"--":ruleForm.projectTypeName}}</span>
          </div>
          <el-form-item label="项目类型：" prop="name" v-else>
            <span>{{ruleForm.projectTypeName==""?"--":ruleForm.projectTypeName}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <div
            v-if="this.$route.query.archivesState=='2'||this.$route.query.archivesState=='3'"
            style="margin-bottom: 20px;"
          >
            <span class="yt-read-text" style="margin-left:20px">项目总金额：</span>
            <span>{{ruleForm.budgetMoney|moneyFormat}}</span>
            <a class="btn" v-show="detailsShow" @click="details">展开合同明细</a>
          </div>
          <el-form-item label="项目总金额：" prop="name" v-else>
            <span>{{ruleForm.budgetMoney|moneyFormat}}</span>
            <a class="btn" v-show="detailsShow" @click="details">展开合同明细</a>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 遍历展开合同明细 -->
      <div v-show="compact">
        <div
          v-for="item in ruleForm.contractList"
          :key="item"
          style="margin-bottom: 20px; background-color: rgb(245 249 252);padding: 20px;"
        >
          <el-row>
            <el-col :span="12">
              <span class="yt-read-text" style="margin-left:20px">合同名称/编号：</span>
              <span>{{item.contractName+"/"+item.contractNum}}</span>
            </el-col>
            <el-col :span="12">
              <span class="yt-read-text" style="margin-left:20px">合同项目分配金额：</span>
              <span>{{item.projectAmount|moneyFormat}}元</span>
            </el-col>
          </el-row>
        </div>
        <a class="fewer" v-show="detailsNone" @click="details">收起</a>
      </div>
      <el-row>
        <el-col :span="6">
          <div
            v-if="this.$route.query.archivesState=='2'||this.$route.query.archivesState=='3'"
            style="margin-bottom: 20px;"
          >
            <span class="yt-read-text" style="margin-left:20px">已确认收入金额：</span>
            <span>{{ ruleForm.revenueRecognizedAmount|moneyFormat}}</span>
          </div>
          <el-form-item label="已确认收入金额：" prop="revenueRecognizedAmount" v-else>
            <span>{{ruleForm.revenueRecognizedAmount|moneyFormat}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <div
            v-if="this.$route.query.archivesState=='2'||this.$route.query.archivesState=='3'"
            style="margin-bottom: 20px;"
          >
            <span class="yt-read-text" style="margin-left:20px">发放比例（百分比）：</span>
            <span>{{ this.ruleForm.grantRatio==""?"--":this.ruleForm.grantRatio}}%</span>
          </div>
          <el-form-item
            label="发放比例(百分比)："
            prop="grantRatio"
            v-if="this.$route.query.archivesState=='1'||!this.$route.query.archivesState"
          >
            <el-input v-model="grantRatio" style="width:30%" @change="getRatio"></el-input>
            <span>%</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <div
            v-if="this.$route.query.archivesState=='2'||this.$route.query.archivesState=='3'"
            style="margin-bottom: 20px;"
          >
            <span class="yt-read-text" style="margin-left:20px">发放总额度：</span>
            <span>{{ this.ruleForm.grantAmount|moneyFormat}}</span>
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              content="发放总额度=已确认收入金额*发放比例；发放总额度不是实际发放金额，但累计实际发放金额不得超过发放总额度"
            >
              <span slot="reference">
                <img
                  src="../../static/icon/icon-warn.png"
                  alt
                  style="width:20px;height:20px;vertical-align: middle;"
                />
              </span>
            </el-popover>
          </div>
          <el-form-item
            label="发放总额度："
            prop="grantAmount"
            v-if="this.$route.query.archivesState=='1'||!this.$route.query.archivesState"
          >
            <span>{{grantAmount|moneyFormat}}</span>
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              content="发放总额度=已确认收入金额*发放比例；发放总额度不是实际发放金额，但累计实际发放金额不得超过发放总额度"
            >
              <span slot="reference">
                <img
                  src="../../static/icon/icon-warn.png"
                  alt
                  style="width:20px;height:20px;vertical-align: middle;"
                />
              </span>
            </el-popover>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 发放情况 -->
    <topTip>
      <template>
        <el-col :span="8" style="text-align: left;" class="top-tip">
          <span style="color: #417095;font-size: 16px;font-weight: bolder;">发放情况</span>
        </el-col>
      </template>
    </topTip>
    <div>
      <el-row style="margin-bottom: 20px;">
        <el-col>
          <span class="yt-read-text" style="margin-left:20px">当前可发放金额：</span>
          <span>{{currentAvailableAmount==""?"0":currentAvailableAmount|moneyFormat}}元</span>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 20px;">
        <el-col>
          <span class="yt-read-text" style="margin-left:20px">已发放金额：</span>
          <span>{{ruleForm.paidAmount==""?"0":ruleForm.paidAmount|moneyFormat}}元</span>
        </el-col>
      </el-row>
    </div>
    <secondLevel>
      <template v-slot:textTitle>录入本次发放明细</template>
    </secondLevel>
    <div v-if="this.$route.query.archivesState=='2'||this.$route.query.archivesState=='3'">
      <el-table
        :data="particularsList"
        border
        style="width: 100%;margin-bottom: 20px;"
        :summary-method="getSummaries"
        show-summary
      >
        <el-table-column prop="personnelName" header-align="center" align="center" label="姓名"></el-table-column>
        <el-table-column prop="grantMonth" header-align="center" align="center" label="发放年月"></el-table-column>
        <el-table-column prop="thisGrantAmount" header-align="center" align="right" label="发放金额">
           <template scope="scope">
              <span>{{scope.row.thisGrantAmount |moneyFormat}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="remarks" header-align="center" align="left" label="备注"></el-table-column>
      </el-table>
    </div>

    <!-- 动态生成 -->
    <div v-if="this.$route.query.archivesState=='1'||!this.$route.query.archivesState">
      <el-form>
        <div v-for="(item, index) in thisGrantList" :key="index">
          <el-row style="margin-top:20px;">
            <el-col :span="6">
              <!-- :rules="{required: true,message: '请输入姓名',trigger: 'blur'}" -->
              <el-form-item
                label="姓名："
                label-width="65px"
                :prop="'thisGrantList.'+ index +'.personnelName'"
              >
                <el-autocomplete
                  style="width:60%;display: inline-block;"
                  v-model="item.personnelName"
                  placeholder="请输入"
                  :fetch-suggestions="querySearch"
                  :trigger-on-focus="false"
                  @select="handleSelect(item,index)"
                ></el-autocomplete>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="发放月份：" :prop="'thisGrantList.'+ index +'.grantMonth'">
                <el-date-picker
                  v-model="item.grantMonth"
                  type="month"
                  value-format="yyyy-MM"
                  style="width:60%;display: inline-block;"
                  placeholder="选择月"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="发放金额：" :prop="'thisGrantList.'+ index +'.thisGrantAmount'">
                <!-- <el-input
                  v-model="item.thisGrantAmount"
                  @change="getAmount(index)"
                 oninput="value=value.replace(/[^\d.]/g,'')"
                  placeholder="请输入内容"
                 style="width:60%;display: inline-block;"
                ></el-input> -->
                    <finMoneyInput  v-model="item.thisGrantAmount" :tail="'元'"  @blur="getAmount(index)"  style="width:60%;display: inline-block;"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="备注：" :prop="'thisGrantList.'+ index +'.remarks'">
                <el-input
                  v-model="item.remarks"
                  placeholder="请输入内容"
                  style="width:60%;display: inline-block;"
                ></el-input>
                <i
                  class="el-icon-delete"
                  style="font-size: 24px;cursor: pointer;"
                  @click="delCustomer(index)"
                ></i>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div style="padding: 10px 30px;width: 150px;" @click="addcustomer()">
        <i class="el-icon-circle-plus-outline" style="font-size: 24px;"></i>
        <span style="display: inline-block;vertical-align: top;font-size: 16px;">添加发放明细</span>
      </div>
      <div>
        <el-row style="margin-bottom: 20px;">
          <el-col>
            <span class="yt-read-text" style="margin-left:20px">本次发放金额合计：</span>
            <span>{{thisGrantTotalAmount==""?"0":thisGrantTotalAmount|moneyFormat}}</span>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 流程日志 -->
    <div v-if="this.$route.query.archivesState=='2'">
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
      <approvalDetail :processInstanceId="workFlowData.processInstanceId" :key="Math.random()"></approvalDetail>
    </div>
    <div
      v-if="this.$route.query.archivesState=='3'||!this.$route.query.archivesState||this.$route.query.archivesState=='1'"
    >
      <el-form>
        <approvalSelect ref="approvalData" :params="workFlowData" :key="workData"></approvalSelect>
      </el-form>
    </div>

    <div style="text-align: center;padding-bottom:20px" v-if="this.$route.query.archivesState=='2'">
      <button type="button" class="el-button yt-bottom-btn el-button--default">
        <span @click="exitList">关闭</span>
      </button>
    </div>
    <div style="text-align: center;padding-bottom:20px" v-if="this.$route.query.archivesState=='3'">
      <button type="button" class="el-button yt-bottom-btn el-button--primary">
        <span @click="subFormDataList">提交</span>
      </button>
      <button type="button" class="el-button yt-bottom-btn el-button--default">
        <span @click="exit">取消</span>
      </button>
    </div>
    <div
      style="text-align: center;padding-bottom:20px"
      v-if="!this.$route.query.archivesState||this.$route.query.archivesState=='1'"
    >
      <button type="button" class="el-button yt-bottom-btn el-button--primary">
        <span @click="subFormData">提交</span>
      </button>
      <button type="button" class="el-button yt-bottom-btn el-button--default">
        <span @click="exit">取消</span>
      </button>
    </div>
  </div>
</template>

<script>
//一级标题
import topTip from "@/components/topTip";
//二级标题
import secondLevel from "@/components/secondLevel";
//流程审批
import approvalSelect from "@/components/ApprovalSelect/ApprovalSelect";
//流程日志
import approvalDetail from "@/components/ApprovalDetail/ApprovalDetail";
//金额输入框组件
import finMoneyInput from "@/components/fin-money-input";
import axios from "@/service/http";
import { option } from "@/static/config";
export default {
  // 数据源
  data() {
    return {
      ruleForm: {
        marketPerformanceNum: "", //单据编号
        projectName: "",
        projectId: "",
        createUserName: "",
        projectTypeName: "",
        projectName: "",
        customerName: "", //客户名称
        budgetMoney: "",
        revenueRecognizedAmount: "", //已确认收入金额
        grantRatio: "", //发放比列
        grantAmount: "", //发放总额度
        currentAvailableAmount: "", //当前可发送金额
        paidAmount: "", //
        contractIds: "",
        name: "阿瑟东",
        contractList: [
          {
            contractIds: "",
            contractName: "",
            contractNum: "",
            projectAmount: "",
          },
        ],
      },
      thisGrantList: [
        {
          personnelId: "", //人员id
          personnelName: "",
          thisGrantAmount: "", //发放金额
          remarks: "", //备注
          grantMonth: "", //年月
        },
      ],
      marketPerformanceNum: "", //单据编号
      grantRatio: "", //发放比列
      grantAmount: "", //发放总额度
      thisGrantTotalAmount: "", //本次发放金额合计
      currentAvailableAmount: "", //当前可发送金额
      //工作流参数
      approvalFlag: true,
      particularsList: [],
      workFlowData: {
        //工作流参数
        processInstanceId: "",
        parameters: "",
        businessCode: "MARKET_PERFORMANCE_FLOW",
        // projectNumber: ""
      },
      workData: 0,
      detailsShow: true,
      detailsNone: false,
      compact: false, //显示隐藏合同
      labelposition: "right",
      restaurants: [],
    };
  },
  // 初始化执行
  mounted() {
    // this.submitWorkFlow();

    if (this.$route.query.archivesState) {
      this.getMarketPerformanceById();
    } else {
      this.getMarketPerformance();
      this.getCustomerNameList();
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
    },
  },
  // 方法声明
  methods: {
    //关闭
    exitList() { 
      // this.$router.go(-1);
      this.$router.push({ path: "/meritsMarket/grantingApproval" });
    },
    //展开隐藏合同
    details() {
      this.compact = !this.compact;
      if (this.compact == true) {
        this.detailsShow = false;
        this.detailsNone = true;
      } else {
        this.detailsShow = true;
        this.detailsNone = false;
      }
    },
    //添加联系人
    addcustomer() {
      this.thisGrantList.push({
        personnelId: "", //人员id
        personnelName: "",
        thisGrantAmount: "", //发放金额
        remarks: "", //备注
        grantMonth: "", //年月
      });
    },
    //删除联系人
    delCustomer(index) {
      this.$confirm("此操作删除联系人信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.thisGrantList.splice(index, 1);
          this.$message.success("删除成功");
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (!values.every((value) => isNaN(value))) {
          if (index > 1 && index < 3) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return this.moneyFormat(this.rmoney(prev) + this.rmoney(curr));
              } else {
                return prev;
              }
            }, 0);
          }

          // sums[index] += '.00';
        }
      });

      return sums;
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
    //当前名字数据
    handleSelect(item, index) {
      debugger;
      this.restaurants.forEach((v) => {
        if (v.personnelName == item.personnelName) {
          this.thisGrantList[index].personnelId = v.personnelId;
        }
      });

      // this.thisGrantList[index].personnelId=item.personnelId
      // console.log(item);
      // item.value =  item.personnelId
      console.log(item, index);
      console.log(this.thisGrantList, "11111");
    },
    // 获取名称姓名
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // let price = results.personnelId
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) !==
          -1
        );
      };
    },
    // 获取名称姓名
    getCustomerNameList() {
      axios
        .post(option.base_path + "manpower/personnel/getAllPersonnelList", {})
        .then((data) => {
          //赋值全局变量数据
          let dataList = data.data.data;
          dataList.forEach((n) => {
            for (let key in n) {
              if (key === "personnelName") {
                n["value"] = n["personnelName"];
              }
            }
            this.restaurants.push(n);
          });
        });

      console.log(this.restaurants, "111");
    },
    //计算本次发放金额合计
    getAmount(index) {
debugger
       
// this.$nextTick(()=>{
        // DOM 更新了 
         let that = this;
      let totalAmount = 0;
      for (let i = 0; i <= index; i++) {
        totalAmount += Number(that.thisGrantList[i].thisGrantAmount);
      }
      this.thisGrantTotalAmount = totalAmount;       
//  })
      //  this.$forceUpdate();
     
    
    },
    //计算总额度
    getRatio(val) {
      let str = Number(val / 100).toFixed(2);
      // this.grantRatio = str;
      this.grantAmount = this.ruleForm.revenueRecognizedAmount * str;
      let valStr = Number(str * 100);
      // valStr += "%";
      this.grantRatio = valStr;
      this.currentAvailableAmount = this.grantAmount - this.ruleForm.paidAmount; //当前可发送金额
    },
    //   提交
    subFormData() {
      this.$refs.ruleForm.validate((valid) => {
        debugger;
        this.ruleForm.grantRatio = this.grantRatio; //发放比例百分比
        this.ruleForm.grantAmount = this.grantAmount; //发放总额度
        this.ruleForm.thisGrantList = this.thisGrantList;
        this.ruleForm.thisGrantTotalAmount = this.thisGrantTotalAmount;
        this.ruleForm.grantAmount = this.grantAmount; //发放总额度
        this.ruleForm.currentAvailableAmount = this.currentAvailableAmount;
        this.ruleForm.marketPerformanceNum = this.marketPerformanceNum; //单据编号
        // this.ruleForm.contractIds = this.ruleForm.contractList.contractIds
        delete this.ruleForm.contractList;
        delete this.ruleForm.finishTime;

        //验证通过
        if (valid) {
          axios
            .post(
              option.base_path +
                "wages/performance/saveMarketPerformanceSubmit",
              this.ruleForm
            )
            .then((res) => {
              debugger;
              console.log("asdasdasda", res.data.data);
              if (res.data.flag == 0) {
                this.submitWorkFlow(res.data.data);
              }
            });
        } else {
          this.disabled = false;
        }
      });
    },
    subFormDataList() {
      axios
        .post(
          option.base_path +
            "wages/performance/saveMarketPerformanceSubmitWorkflow",
          {
            marketPerformanceId: this.$route.query.marketPerformanceId, //appId	表单申请id
            parameters: "", //parameters	JSON格式字符串,
            dealingWithPeople: this.$refs.approvalData.approvalForm
              .nextOperCode, //dealingWithPeople	下一步操作人code
            opintion: this.$refs.approvalData.approvalForm.textarea, //opintion	审批意见
            processInstanceId: this.workFlowData.processInstanceId, //processInstanceId	流程实例ID,
            nextCode: this.$refs.approvalData.approvalForm.nextCode, //nextCode	操作流程代码
          }
        )
        .then((data) => {
          console.log(data);
          if (data.data.flag == 0) {
            this.$router.push({ path: "/meritsMarket/grantingApproval" });
          }
          //
          // console.log(data.data)
        });
    },
    //  工作流
    submitWorkFlow(data) {
      axios
        .post(
          option.base_path +
            "wages/performance/saveMarketPerformanceSubmitWorkflow",
          {
            marketPerformanceId: data, //appId	表单申请id
            parameters: "", //parameters	JSON格式字符串,
            dealingWithPeople: this.$refs.approvalData.approvalForm
              .nextOperCode, //dealingWithPeople	下一步操作人code
            opintion: this.$refs.approvalData.approvalForm.textarea, //opintion	审批意见
            processInstanceId: this.workFlowData.processInstanceId, //processInstanceId	流程实例ID,
            nextCode: this.$refs.approvalData.approvalForm.nextCode, //nextCode	操作流程代码
          }
        )
        .then((data) => {
          console.log(data);
          if (data.data.flag == 0) {
            this.$router.push({ path: "/meritsMarket/grantingApproval" });
          }
          //
          // console.log(data.data)
        });
    },
    //取消
    exit() {
      this.$router.push({ path: "/meritsMarket/manage" });
    },
    //获取数据
    getMarketPerformance() {
      axios
        .post(option.base_path + "wages/performance/getPerformance", {
          projectId: this.$route.query.projectId,
        })
        .then((res) => {
          // if (res.data.flag == 0) {
          this.ruleForm = res.data.data;
          debugger;
          let contractIds = res.data.data.contractList;
          this.ruleForm.contractIds = contractIds
            .map((item) => item.contractId)
            .join(",");
          console.log(this.ruleForm.contractIds);
          // this.wagesList = res.data.data;
          // this.total = res.data.total;
          console.log("安德森", res.data.data);
          // }
        });
    },
    //获取详情
    getMarketPerformanceById() {
      axios
        .post(option.base_path + "wages/performance/getMarketPerformanceById", {
          marketPerformanceId: this.$route.query.marketPerformanceId,
        })
        .then((res) => {
          if (res.data.flag == 0) {
            let item = res.data.data;
            this.ruleForm = res.data.data;
            debugger;
            let contractIds = res.data.data.contractList;
            this.ruleForm.contractIds = contractIds
              .map((item) => item.contractId)
              .join(",");
            // console.log(this.ruleForm.contractIds);
            this.particularsList = item.thisGrantList;
            this.thisGrantList = item.thisGrantList;
            this.grantRatio = item.grantRatio; //发放比例百分比
            this.grantAmount = item.grantAmount; //发放总额度
            this.marketPerformanceNum = item.marketPerformanceNum
            this.thisGrantTotalAmount = item.thisGrantTotalAmount;
            this.currentAvailableAmount = item.currentAvailableAmount;
            this.workData = Math.random();
            this.paidAmount = item.paidAmount;
            this.workFlowData.processInstanceId = item.processInstanceId;
            //  this.$forceUpdate()
            console.log(this.workFlowData.processInstanceId, "asdsasd");
            console.log("安德森", res.data.data);
          }
        });
    },
  },

  // 组件注册
  components: {
    topTip,
    secondLevel,
    approvalSelect,
    approvalDetail,
    finMoneyInput
  },
};
</script>
<style scoped>
.yt-read-text {
  color: #003465;
  font-weight: bold;
}
.el-form-item {
  margin-bottom: 0px;
}
.btn {
  position: absolute;
  cursor: pointer;
  margin-left: 30px;
  color: #257db9;
}
/* .compact{
    display: flex;
    justify-content: center;
} */
.fewer {
  position: relative;
  margin-left: 850px;
  cursor: pointer;
  color: #257db9;
}
</style>

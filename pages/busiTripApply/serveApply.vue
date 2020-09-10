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
                <span style="color:#003465;letter-spacing:4px">单据编号：</span>
                <span>提交后自动生成</span>
              </label>
              <label>
                <span style="color:#003465;letter-spacing:4px">申请日期：</span>
                <span>--</span>
              </label>
            </div>
          </el-col>
        </el-row>
      </template>
    </topTip>
    <!-- 顶部信息END -->
    <!-- 基本信息区域 -->
    <div class="user_info">
      <el-row>
        <el-col :span="6">
          <label>
            <span class="yt-read-text" style="letter-spacing:5px">申请人：</span>
            <span>{{userInfo.realName}}</span>
          </label>
        </el-col>
        <el-col :span="6">
          <label class="yt-read-text">
            <span style="letter-spacing: 40px;">部</span>门：
          </label>
          <span>{{userInfo.deptName}}</span>
        </el-col>
        <el-col :span="6">
          <label class="yt-read-text">
            <span style="letter-spacing: 40px;">职</span>务：
          </label>
          <span>{{userInfo.positionName}}</span>
        </el-col>
        <el-col :span="6">
          <label class="yt-read-text">
            <span style="letter-spacing: 40px;">电</span>话：
          </label>
          <span>{{userInfo.userPhone}}</span>
        </el-col>
      </el-row>
    </div>
    <!-- 表单 -->
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
      :label-position="labelposition"
      style="margin: 20px 10px 10px"
    >
      <el-row>
        <el-col :span="10">
          <el-form-item label="事前申请事由：" prop="advanceAppReason">
            <el-input size="small" v-model="ruleForm.advanceAppReason" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="单据样式：" prop="cost">
            <el-radio-group v-model="ruleForm.cost">
              <el-radio :label="1">差旅费支出</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="display: flex">
          <el-form-item label="业务类型：" prop="specialCode">
            <el-select
              v-model="ruleForm.specialCode"
              size="small"
              @change="onSelect"
              placeholder="请选择"
            >
              <el-option
                v-for="item in theirItems"
                :key="item.dictTypeCode"
                :label="item.disvalue"
                :value="item.dictTypeCode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="项目名称："
            prop="prjCode"
            v-if="projectType"
            :rules="ruleForm.specialCode !== 'BUSSINESS_TYPE_1'?rules.prjCode:[{ required: true, message: '请选择', trigger: 'blur' }]"
          >
            <!-- <el-select
              v-model="ruleForm.prjCode"
              @change="onTwoSelected"
              size="small"
              placeholder="请选择"
            >
              <el-option
                v-for="item in itemsName"
                :key="item.projectCode"
                :label="item.projectName"
                :value="item.projectCode"
              ></el-option>
            </el-select> -->
             <el-autocomplete
                class="inline-input"
                v-model="ruleForm.projectName"
                placeholder="请输入关键字"
                :fetch-suggestions="querySearch"
                :trigger-on-focus="false"
                @select="handleSelect"
                style="width:200px"
              ></el-autocomplete>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div
      style="height: 5px;background-color: #f3f3f3;border-top: 1px solid #dfe6f3;border-bottom: 1px solid #dfe6f3;margin-bottom: 20px;"
    ></div>
    <showTravelPay :lookType="'1'" ref="travelTab"  @sumTotal="sumTotal"></showTravelPay>
    <!-- 二级标题 -->
    <secondLevel>
      <template v-slot:textTitle>申请支出总金额</template>
    </secondLevel>
    <!-- 表单 -->
    <div style="margin-bottom: 20px;">
      <el-row style="margin-left:35px">
        <el-col :span="16">
          <span class="yt-read-text">申请支出总金额：</span>
          <span>{{advanceAmount|moneyFormat}}元</span>
        </el-col>
        <el-col :span="8">
          <span class="yt-read-text">人民币大写：</span>
          <span>{{capitalize}}</span>
        </el-col>
      </el-row>
    </div>
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
    <el-row style="margin-left:25px">
      <el-col :span="24">
        <label class="yt-sec-title-line"></label>
        <span class="yt-sec-title-text">支出相关附件</span>
        <div style="margin-top:20px">
          <div style="margin-top:10px;">支出相关附件：</div>
          <span style="margin-left:50px">
            <upload @upload="upload" @delFile="delFileBtn" :fileList="ruleForm.expenseFlieList"></upload>
          </span>

          <!-- <lookFiles v-for="item in expenseForm.expenseFlieList" :key="item.fileId" :fileName="item.fileName" :fileId="item.fileId" :type="1"> -->
          <!-- </lookFiles> -->
        </div>
      </el-col>
    </el-row>
    <div
      style="height: 5px;background-color: #f3f3f3;border-top: 1px solid #dfe6f3;border-bottom: 1px solid #dfe6f3;margin-bottom: 20px;"
    ></div>
    <el-form>
      <approvalSelect :key="workData" ref="approvalData" :params="workFlowData"></approvalSelect>
    </el-form>
    <!-- <div style="text-align:center;padding:30px 0">
      <el-button type="primary" :disabled="disabled" @click="saveFormData">保存</el-button>
      <el-button type="warning" style="margin:0 20px" @click="subFormData">提交</el-button>
      <el-button type="danger" style="margin:0" @click="resetFormData">取消</el-button>
    </div> -->
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
  </div>
</template>

<script>
import topTip from "../../components/topTip.vue";
import axios from "../../service/http";
import { option } from "../../static/config";
import approvalSelect from "../../components/ApprovalSelect/ApprovalSelect.vue";
import showTravelPay from "../../components/showTravelPay.vue";
import secondLevel from "../../components/secondLevel.vue";
import upload from "../../components/upload.vue";
export default {
  // 数据源
  data() {
    return {
      userInfo: {},
      ruleForm: {
        advanceAmount:"",
        advanceAppReason: "",
        specialCode: "",
        specialName: "",
        prjCode: "",
        prjName: "",
        costType: "TRAVEL_APPLY",
        cost: 1,
        advanceAppId: "",
        advanceAppNum: "",
        applicantUser: "",
        expenseFlieList: [],
        applicantUserName: "",
      },
      advanceAmount: 0,
      capitalize: "--",
      labelposition: "right",
      rules: {
        advanceAppReason: [
          { required: true, message: "请输入事前申请事由", trigger: "blur" },
        ],
        specialCode: [{ required: true, message: "请选择", trigger: "change" }],
        // prjCode: [{ required: true, message: "请选择", trigger: "change" }]
      },
      theirItems: [], //一级下拉所属项目
      projectType: false, //一级下拉框是否是项目类型
      itemsName: [], //二级下项目名称
      workFlowData: {
        //工作流参数
        businessCode: "SZ_EXPENDITURE_APP",
        processInstanceId: "",
        parameters: '{ type: "BUSSINESS_TYPE" }',
        projectNumber: "",
      },
      workData: 0, //为工作流组件绑定的key值  用来更新组件
      disabled: false, //保存和提交按钮禁用
       isReturn: true, //是否退回
    };
  },
  // 初始化执行
  mounted() {
    this.user();
    this.getTheirItems();
    this.getdeptTypeByUserId();
    this.getItemsName();
    this.details();
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
  // 方法声明
  methods: {
    //获取人员信息
    user() {
      axios
        .post(option.base_path + "index/getCurrentUserInfo", this.userInfo)
        .then((res) => {
          this.userInfo = res.data.data;
          this.ruleForm.applicantUser = this.userInfo.userName;
          this.ruleForm.applicantUserName = this.userInfo.realName;
          console.log(
            "接口" +
              this.userInfo.userName +
              "本地" +
              this.ruleForm.applicantUser
          );
          console.log("返回值", res.data.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    //一级下拉所属项目
    getTheirItems() {
      axios
        .post(option.base_path + "sz/expenditureApp/getProjectTypeDictList", {
          projectType: "BUSSINESS_TYPE",
        })
        .then((res) => {
          if (res.data.flag == 0) {
            //  var theirItemsList = res.data.data;
            this.theirItems = res.data.data;
          }
        });
    },
    //显示隐藏职能中心
    getdeptTypeByUserId() {
      axios
        .post(option.base_path + "sz/expenditureApp/getdeptTypeByUserId")
        .then((res) => {
          if (res.data.data !== "true") {
            this.theirItems = this.theirItems.filter(
              (v) => v.dictTypeCode != "BUSSINESS_TYPE_4"
            );
          }
        });
    },
    //一级下拉所属项目事件显示二级下拉
    onSelect(val) {
      this.theirItems.forEach((v) => {
        if (v.dictTypeCode == val) {
          this.ruleForm.specialName = v.disvalue;
        }
      });
      
      //项目类型
      if (val == "BUSSINESS_TYPE_4") {
        this.projectType = false;
        this.workFlowData.parameters = '{type: "BUSSINESS_TYPE_4" }';
        this.ruleForm.prjCode = "";
        this.itemsName = [];
        //  this.getdeptTypeByUserId();
      } else if (val == "BUSSINESS_TYPE_1") {
        //非项目类型
        this.projectType = true;
        this.ruleForm.prjCode = "";
        this.itemsName = [];
        this.workFlowData.parameters = '{ type:"BUSSINESS_TYPE_1"}';
        // this.workFlowData.projectNumber = "";
      } else if (val == "BUSSINESS_TYPE_2") {
        this.projectType = true;
        this.ruleForm.prjCode = "";
        this.itemsName = [];
        this.workFlowData.parameters = '{ type:"BUSSINESS_TYPE_2"}';
      } else if (val == "BUSSINESS_TYPE_3") {
        this.projectType = true;
        this.ruleForm.prjCode = "";
        this.itemsName = [];
        this.workFlowData.parameters = '{ type:"BUSSINESS_TYPE_3"}';
      }
      this.getItemsName();
      this.workData = Math.random();
    },
      // 返回输入建议方法
    querySearch(queryString, cb) {
      let restaurants = this.itemsName;
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
      let manList = this.itemsName;
      manList.forEach((n) => {});
      console.log(item);
      this.onTwoSelected(item.projectCode);
    
      this.$emit("choseMan", this.contractMap);
    },
    //二级下项目名称
    getItemsName(twoFlag, val) {
      axios
        .post(option.base_path + "sz/expenditureApp/getProjectTypeList", {
          params: "",
          pageIndex: 1,
          pageNum: 99999,
        })
        .then((res) => {
          if (res.data.flag == 0) {
            this.itemsName = res.data.data;
             //赋值变量数据
            let dataList = res.data.data;
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
              this.itemsName = newNameList;
            if (twoFlag) {
              this.itemsName.forEach((item) => {
                if (item.projectCode == val) {
                  this.ruleForm.prjName = v.projectName;
                  this.ruleForm.prjCode =v.projectCode;
                }
              });
            }
          }
        });
    },
    //二级下拉框改变
    onTwoSelected(val) {
      this.workFlowData.projectNumber = val;
      this.workData = Math.random();
      this.itemsName.forEach((v) => {
        if (v.projectCode == val) {
          this.ruleForm.prjName = v.projectName;
          this.ruleForm.prjCode =v.projectCode;
        }
      });
    },
     //金额格式化
    rmoney(s) {
      //转成string类型
      s = s + "";
      return parseFloat(s.replace(/[^\d\.-]/g, ""));
    },
    //计算差旅费合计
    sumTotal(data) {
      var advanceAmount = 0;
      var { travelList, costCarfareList, costHotelList, costOtherList } = data;
      costCarfareList.forEach((v) => {
        // if (v.crafare != "") {
        advanceAmount +=
          this.rmoney(v.crafare) +
          this.rmoney(v.returnFee) +
          this.rmoney(v.trafficAccidentInsurancePremium) +
          this.rmoney(v.bookingFee);
        // }
      });
      costHotelList.forEach((v) => (advanceAmount += this.rmoney(v.hotelExpense)));
      costOtherList.forEach((v) => (advanceAmount += this.rmoney(v.reimAmount)));
      this.advanceAmount = this.rmoney(advanceAmount);
      this.capitalize = this.NumToChinese(this.rmoney(advanceAmount));
       this.ruleForm.advanceAmount = this.rmoney(advanceAmount);
    },
    //   提交
    subFormData() {
      this.$refs.ruleForm.validate((valid) => {
        this.ruleForm.costData = JSON.stringify({
          travelRouteList: this.$refs.travelTab.travelList, //行程明细列表数据
          costCarfareList: this.$refs.travelTab.costCarfareList, //城市间交通费列表数据
          costHotelList: this.$refs.travelTab.costHotelList, //住宿费列表数据
          costOtherList: this.$refs.travelTab.costOtherList, //其他费用列表数据
        });
        this.ruleForm.advanceAttIdStr = this.ruleForm.expenseFlieList
          .map((v) => v.fileId)
          .join(",");
        this.ruleForm.advanceAmount = this.advanceAmount || 0;
        this.ruleForm.capitalize = this.NumToChinese(this.advanceAmount);
        //验证通过
        if (valid) {
          axios
            .post(
              option.base_path + "sz/advanceApp/submitAdvanceAppInfo",
              this.ruleForm
            )
            .then((res) => {
              console.log("asdasdasda", res.data.data);
              if (res.data.flag == 0) {
                this.submitWorkFlow(res.data.data);
                this.user();
              }
            });
        } else {
          this.disabled = false;
        }
      });
    },
    //  工作流
    submitWorkFlow(data) {
      axios
        .post(option.base_path + "sz/advanceApp/submitWorkFlow", {
          appId: data, //appId	表单申请id
          parameters: '{type:"' + this.ruleForm.specialCode + '"}', //parameters	JSON格式字符串,
          dealingWithPeople: this.$refs.approvalData.approvalForm.nextOperCode, //dealingWithPeople	下一步操作人code
          opintion: this.$refs.approvalData.approvalForm.textarea, //opintion	审批意见
          processInstanceId: this.processInstanceId, //processInstanceId	流程实例ID,
          nextCode: this.$refs.approvalData.approvalForm.nextCode, //nextCode	操作流程代码
        })
        .then((data) => {
          console.log(data);
          if (data.data.flag == 0) {
            this.$router.push({ path: "/approval/myApplyList" });
          }
          //
          // console.log(data.data)
        });
    },
    /**
     * 保存信息
     */
    saveFormData() {
      this.disabled = true;
      this.ruleForm.costData = JSON.stringify({
        travelRouteList: this.$refs.travelTab.travelList, //行程明细列表数据
        costCarfareList: this.$refs.travelTab.costCarfareList, //城市间交通费列表数据
        costHotelList: this.$refs.travelTab.costHotelList, //住宿费列表数据
        costOtherList: this.$refs.travelTab.costOtherList, //其他费用列表数据
      });
      this.ruleForm.advanceAppId = this.$route.query.pkId; //传id
      this.ruleForm.advanceAmount = this.advanceAmount || 0;
      this.ruleForm.capitalize = this.NumToChinese(this.advanceAmount);
      this.ruleForm.advanceAttIdStr = this.ruleForm.expenseFlieList
        .map((v) => v.fileId)
        .join(",");
      axios
        .post(
          option.base_path + "sz/advanceApp/saveAdvanceAppInfoToDrafts",
          this.ruleForm
        )
        .then((data) => {
          this.disabled = false;
          if (data.data.flag == 0) {
            this.$router.push({ path: "/approval/draftsList" });
          } else {
            this.$message.error(data.data.message);
          }
        });
    },
    // 取消
    resetFormData() {
      this.$router.push({ path: "/approval/draftsList" });
    },
    // 上传附件
    upload(file) {
      this.ruleForm.expenseFlieList = this.forSet(file);
    },
    // 删除附件
    delFileBtn(fileList) {
      this.ruleForm.expenseFlieList = this.forSet(fileList);
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
    // 页面详情接口
    details() {
      axios
        .post(
          option.base_path +
            "sz/advanceApp/getAdvanceAppInfoDetailByAdvanceAppId",
          {
            advanceAppId: this.$route.query.pkId,
          }
        )
        .then((data) => {
          var list = [];
          if (data.data.flag == 0) {
            let item = data.data.data;
            console.log(item);
            //支出id
            this.advanceAppId = item.advanceAppId;

            //必填项表单
            this.ruleForm.advanceAppReason = item.advanceAppName;
            this.ruleForm.cost = 1;
            this.ruleForm.specialCode = item.specialCode;
            this.ruleForm.prjCode = item.prjCode;
            this.ruleForm.expenseFlieList = [];
            this.ruleForm.costType = "TRAVEL_APPLY";
            this.$refs.travelTab.travelList = item.costData.travelRouteList; //行程明细列表数据
            this.$refs.travelTab.costCarfareList =
              item.costData.costCarfareList; //城市间交通费列表数据
            this.$refs.travelTab.costHotelList = item.costData.costHotelList; //住宿费列表数据
            this.$refs.travelTab.costOtherList = item.costData.costOtherList; //其他费用列表数据
             this.advanceAmount = item.advanceAmount || 0;
             this.ruleForm.advanceAmount = this.advanceAmount;
            this.capitalize = this.NumToChinese(item.advanceAmount);
            //   if (item.specialCode == "PROJECT_TYPE_1") {
            //   this.projectType = true;
            //   this.getItemsName(true, item.prjCode);
            //   this.workFlowData.parameters = '{ type: "PROJECT_TYPE_1" }';
            // } else {
            //   this.workFlowData.parameters = '{ type: "PROJECT_TYPE_2" }';
            // }

            if (item.specialCode == "BUSSINESS_TYPE_4") {
              this.projectType = false;
              this.workFlowData.parameters = '{type: "BUSSINESS_TYPE_4" }';
            } else if (item.specialCode == "BUSSINESS_TYPE_1") {
              //非项目类型
              this.projectType = true;
              this.getItemsName(true, item.prjCode);
              this.workFlowData.parameters = '{ type:"BUSSINESS_TYPE_1"}';
              // this.workFlowData.projectNumber = "";
            } else if (item.specialCode == "BUSSINESS_TYPE_2") {
              this.projectType = true;
              this.getItemsName(true, item.prjCode);
              this.workFlowData.parameters = '{ type:"BUSSINESS_TYPE_2"}';
            } else if (item.specialCode == "BUSSINESS_TYPE_3") {
              this.projectType = true;
              this.getItemsName(true, item.prjCode);
              this.workFlowData.parameters = '{ type:"BUSSINESS_TYPE_3"}';
            }
            this.workFlowData.projectNumber = item.prjCode;
            this.processInstanceId = item.processInstanceId;
            this.workFlowData.processInstanceId = item.processInstanceId;
            this.workData = Math.random();
            //附件
            if (item.attList.length > 0) {
              var expenseFlieList = [];
              var newList = [];
              item.attList.forEach((n) => {
                for (let k in n) {
                  if (k === "attName") {
                    n["attName"] = n[k];
                  }
                }
                expenseFlieList.push(n);
                expenseFlieList.forEach((x) => {
                  newList.push({
                    fileId: x.attId,
                    fileName: x.attName,
                    name: x.attName,
                  });
                });
              });
              this.ruleForm.expenseFlieList = this.forSet(newList);
            }
             if (item.taskKey == "activitiStartTask") {
              this.isReturn = false;
            }
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
    },
  },
  // 组件注册
  components: {
    topTip,
    axios,
    approvalSelect,
    showTravelPay,
    secondLevel,
    upload,
  },
};
</script>
<style scoped>
.user_info {
  margin: 0px 20px;
}
.yt-read-text {
  color: #003465;
  font-weight: bold;
}
.el-form-item {
  margin-bottom: 10px;
}
</style>

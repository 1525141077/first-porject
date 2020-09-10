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
                <span>{{ruleForm.advanceAppNum}}</span>
              </label>
              <label>
                <span style="color:#003465;letter-spacing:4px">申请日期：</span>
                <span>{{ruleForm.applicantTime}}</span>
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
    <el-row style="margin-top:20px">
      <el-col :span="6">
        <span class="yt-read-text" style="margin-left:20px">事前申请事由：</span>
        <span>{{ruleForm.advanceAppName}}</span>
      </el-col>
    </el-row>
    <el-row style="margin-top:20px">
      <el-col :span="6">
        <span class="yt-read-text" style="letter-spacing:5px;margin-left:20px">单据样式：</span>
        <span>{{ruleForm.advanceCostTypeName}}</span>
      </el-col>
    </el-row>
    <el-row style="margin-top:20px">
      <el-col :span="6">
        <span class="yt-read-text" style="margin-left:20px">所属预算项目：</span>
        <span>{{ruleForm.specialName}}</span>
      </el-col>
      <div>
        <el-col :span="6">
          <span class="yt-read-text" style="letter-spacing:5px">项目名称：</span>
          <span>{{ruleForm.prjName}}</span>
        </el-col>
      </div>
    </el-row>
    <div
      style="height: 5px;background-color: #f3f3f3;border-top: 1px solid #dfe6f3;border-bottom: 1px solid #dfe6f3;margin-top:20px"
    ></div>
    <showTravelPay :lookType="'2'" ref="travelTab"></showTravelPay>
    <!-- 二级标题 -->
    <secondLevel>
      <template v-slot:textTitle>申请支出总金额</template>
    </secondLevel>
    <!-- 表单 -->
    <div style="margin-bottom: 20px;">
      <el-row style="margin-left:35px">
        <el-col :span="16">
          <span class="yt-read-text">申请支出总金额：</span>
          <span>{{advanceAmount}}元</span>
        </el-col>
        <el-col :span="8">
          <span class="yt-read-text">人民币大写：</span>
          <span>{{capitalize}}</span>
        </el-col>
      </el-row>
    </div>
    <div
      style="height: 5px;background-color: #f3f3f3;border-top: 1px solid #dfe6f3;border-bottom: 1px solid #dfe6f3"
    ></div>
    <!-- 相关附件 -->
    <topTip>
      <template>
        <el-row>
          <el-col :span="15" class="top-tip" style="text-align: left;">
            <div>
              <span style="color: #417095;font-size: 16px;font-weight: bolder;">相关附件</span>
            </div>
          </el-col>
        </el-row>
      </template>
    </topTip>
    <!-- 二级标题 -->
    <secondLevel>
      <template v-slot:textTitle>事前申请相关附件</template>
    </secondLevel>
    <div class="yt-sec-title-text" style="font-size:14px">事前申请相关附件：</div>
    <lookFiles
      v-for="item in ruleForm.expenseFlieList"
      :key="item.fileId"
      :fileName="item.fileName"
      :fileId="item.fileId"
      :type="1"
    ></lookFiles>
    <!-- 步骤流程 -->
    <div
      style="margin-top:20px;height: 5px;background-color: #f3f3f3;border-top: 1px solid #dfe6f3;border-bottom: 1px solid #dfe6f3;"
    ></div>
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
      <button
        @click="saveLotPayDetailInfo"
        type="button"
        class="el-button yt-bottom-btn el-button--primary"
      >
        <span>提交</span>
      </button>
      <button type="button" class="el-button yt-bottom-btn el-button--default" @click="returnBtn">
        <span>取消</span>
      </button>
    </div>
    <el-row>
      <el-col :span="24" class="btn" v-show="this.$route.query.approvalState=='2'">
        <button type="button" class="el-button yt-bottom-btn el-button--default" @click="exit">
          <span>关闭</span>
        </button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import topTip from "../../components/topTip.vue";
import secondLevel from "../../components/secondLevel.vue";
import axios from "../../service/http";
import { option } from "../../static/config";
import approvalSelect from "../../components/ApprovalSelect/ApprovalSelect";
import approvalDetail from "../../components/ApprovalDetail/ApprovalDetail";
import showTravelPay from "../../components/showTravelPay.vue";
import lookFiles from "../../components/lookFiles.vue";
export default {
  // 数据源
  data() {
    return {
      userInfo: {},
      ruleForm: {
        advanceAppName: "",
        advanceCostTypeName: "",
        specialName: "",
        prjName: "",
        applicantTime: "",
        expenseFlieList: []
      },
      labelposition: "right",
      rules: {
        name: [
          { required: true, message: "请输入事前申请事由", trigger: "blur" }
        ],
        region: [{ required: true, message: "请选择", trigger: "change" }]
      },
      workFlowData: {
        //工作流参数
        processInstanceId: "",
        parameters: "",
        businessCode: "SZ_EXPENDITURE_APP"
        // projectNumber: ""
      },
      workData: 0,
      approvalFlag: false,
      travelTab: [],
      approvalState: "",
      advanceAmount: 0,
      capitalize: "" //金额大写
    };
  },
  computed: {
    subData() {
      return {
        appId: this.$route.query.pkId, //appId 表单申请id
        compCode: this.compVal, //公司
        parameters: '{type:"' + this.specialCode + '"}', //parameters	JSON格式字符串,
        dealingWithPeople: this.$refs.approvalData.approvalForm.nextOperCode, //dealingWithPeople 下一步操作人code
        opintion: this.$refs.approvalData.approvalForm.textarea, //opintion 审批意见
        processInstanceId: this.workFlowData.processInstanceId, //processInstanceId 流程实例ID,
        nextCode: this.$refs.approvalData.approvalForm.nextCode, //nextCode 操作流程代码
        appType: "EXPENDITURE_APP",
        payDetailList: []
      };
    }
  },
  // 初始化执行
  mounted() {
    this.user();
    this.form();
  },
  // 方法声明
  methods: {
    //获取人员信息
    user() {
      axios
        .post(option.base_path + "index/getCurrentUserInfo", this.userInfo)
        .then(res => {
          this.userInfo = res.data.data;
          console.log("返回值", res.data.data);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
      //金额格式化
    rmoney(s) {
      //转成string类型
      s = s + "";
      return parseFloat(s.replace(/[^\d\.-]/g, ""));
    },
    // 获取表单
    form() {
      axios
        .post(
          option.base_path +
            "sz/advanceApp/getAdvanceAppInfoDetailByAdvanceAppId",
          {
            advanceAppId: this.$route.query.pkId
          }
        )
        .then(res => {
          console.log(this.$route.query.pkId);
          //   console.log("返回值", res.data.data.costData.costHotelList);
          if (res.data.flag == 0) {
            let item = res.data.data;
            this.ruleForm = item;
            this.$refs.travelTab.travelList = item.costData.travelRouteList; //行程明细列表数据
            this.$refs.travelTab.costCarfareList =
              item.costData.costCarfareList; //城市间交通费列表数据
            this.$refs.travelTab.costHotelList = item.costData.costHotelList; //住宿费列表数据
            this.$refs.travelTab.costOtherList = item.costData.costOtherList; //其他费用列表数据
            this.advanceAmount = item.advanceAmount || 0;
            this.capitalize = this.NumToChinese(item.advanceAmount);
            if (item.attList.length > 0) {
              var expenseFlieList = [];
              var newList = [];
              item.attList.forEach(n => {
                for (let k in n) {
                  if (k === "attName") {
                    n["attName"] = n[k];
                  }
                }
                expenseFlieList.push(n);
                expenseFlieList.forEach(x => {
                  newList.push({
                    fileId: x.attId,
                    fileName: x.attName,
                    name: x.attName
                  });
                });
              });
              this.ruleForm.expenseFlieList = this.forSet(newList);
            }
            //工作流参数
            this.approvalFlag = true;
            this.workFlowData.processInstanceId = item.processInstanceId;

            this.workFlowData.parameters =
              '{totalAmount:"' + item.advanceAmount + '"}';
          }
        })
        .catch(function(error) {
          console.log(error);
        });
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
    // 关闭
    exit() {
      this.$router.push({ path: "myApplyList" });
    },
    //返回
    returnBtn() {
      this.$router.push({ path: "/approval/myApplyList" });
    },
    // 提交
    saveLotPayDetailInfo() {
      this.disabled = true;
      let workFlag = this.$refs["approvalData"].approvalValid();
      if (workFlag) {
        axios
          .post(
            option.base_path + "sz/advanceApp/submitAdvanceAppInfo",
            this.subData
          )
          .then(data => {
            if (data.data.flag == 0) {
              this.submitWorkFlow();
            }
          });
      } else {
        this.disabled = false;
      }
    },
    // 工作流
    submitWorkFlow() {
      axios
        .post(option.base_path + "sz/advanceApp/submitWorkFlow", this.subData)
        .then(data => {
          if (data.data.flag == 0) {
            this.$router.push({ path: "/priorApp/priorApp" });
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
  },
  // 组件注册
  components: {
    topTip,
    axios,
    secondLevel,
    approvalSelect,
    approvalDetail,
    showTravelPay,
    lookFiles
  }
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
.yt-sec-title {
  padding-top: 0px !important;
}
.cost-list-title {
  padding-left: 45px;
  font-size: 16px;
  height: 35px;
  line-height: 35px;
  border-left: 0;
  border-right: 0;
}
.btn {
  text-align: center;
  margin-top: 20px;
}
</style>

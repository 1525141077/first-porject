<template>
  <div class="yt-dome-container">
    <div>
      <!-- 顶部信息START -->
      <topTip>
        <template>
          <el-col :span="18" style="text-align: left;" class="top-tip">
            <span style="color: #417095;font-size: 16px;font-weight: bolder;">基础信息</span>
          </el-col>
        </template>
      </topTip>
      <!-- 顶部信息END -->
      <!-- 到账单信息START -->
      <div>
        <el-row style="margin-left:30px;margin-bottom:20px;">
          <el-col :span="8">
            <label class="lab-name" style="letter-spacing: 2px;">客户名称：</label>
            <span>{{detailsInfo.customerName||"--"}}</span>
          </el-col>
          <el-col :span="8">
            <label class="lab-name" style="letter-spacing: 2px;">客户行业：</label>
            <span>{{detailsInfo.customerTrade||"--"}}</span>
          </el-col>
          <el-col :span="8">
            <label class="lab-name" style="letter-spacing: 2px;">所属地区：</label>
            <span>{{detailsInfo.regionName||"--"}}</span>
          </el-col>
        </el-row>
        <el-row style="margin-left:30px;margin-bottom:20px;">
          <el-col :span="12">
            <label class="lab-name" style="letter-spacing: 2px;">开票名称：</label>
            <span>{{detailsInfo.invoiceRise||"--"}}</span>
          </el-col>
          <el-col :span="12">
            <label class="lab-name" style="letter-spacing: 2px;">纳税人识别号：</label>
            <span>{{detailsInfo.taxpayerNumber||"--"}}</span>
          </el-col>
        </el-row>
        <el-row style="margin-left:30px;margin-bottom:20px;">
          <el-col :span="12">
            <label class="lab-name"  style="letter-spacing: 6px;">开票地址/电话：</label>
            <span>{{detailsInfo.contactAddress + gang + detailsInfo.contactPhone||"--"}}</span>
          </el-col>
          <el-col :span="12">
            <label class="lab-name" style="letter-spacing: 6px;">开户银行/账号：</label>
            <span>{{detailsInfo.accountBank + gang + detailsInfo.accountNumber||"--"}}</span>
          </el-col>
        </el-row>
      </div>
      <!-- 到账单信息END -->
      <div>
        <!-- 确认收入顶部信息START -->
        <topTip>
          <template>
            <el-col :span="18" style="text-align: left;" class="top-tip">
              <span style="color: #417095;font-size: 16px;font-weight: bolder;">客户联系人信息</span>
            </el-col>
          </template>
        </topTip>
        <div>
          <div v-for="item in detailsInfo.customerLinkmanList" :key="item.pkId" class="customerBox">
            <el-row style="margin-top:20px;">
              <el-col :span="8">
                <span class="lab-name">联系人姓名：</span>
                <span>{{item.customerContacts||"--"}}</span>
              </el-col>
              <el-col :span="8">
                <span class="lab-name">部门：</span>
                <span>{{item.customerContactsDept||"--"}}</span>
              </el-col>
              <el-col :span="8">
                <span class="lab-name">职务：</span>
                <span>{{item.customerPost||"--"}}</span>
              </el-col>
            </el-row>
            <el-row style="margin:20px 0px;">
              <el-col :span="8">
                <span class="lab-name">手机号：</span>
                <span>{{item.customerContactsInformation||"--"}}</span>
              </el-col>
              <el-col :span="8">
                <span class="lab-name">邮箱：</span>
                <span>{{item.customerContactsEmail||"--"}}</span>
              </el-col>
            </el-row>
            <div style></div>
          </div>
        </div>
        <!-- 确认收入顶部信息END -->
        <!-- 确认收入 START -->
        <div>
          <div v-for="(item, i) in dataList" :key="i">
            <el-row style="margin:0px 30px 20px 30px;">
              <el-col :span="8">
                <label class="lab-name">联系人姓名：</label>
                <span>{{item.customerContacts||"--"}}</span>
              </el-col>
              <el-col :span="8">
                <label class="lab-name">部门：</label>
                <span>{{item.customerContactsDept||"--"}}</span>
              </el-col>
              <el-col :span="8">
                <label class="lab-name">职务：</label>
                <span>{{item.customerPost||"--"}}</span>
              </el-col>
            </el-row>
            <el-row style="margin:10px 0px;">
              <el-col :span="8">
                <label class="lab-name">手机：</label>
                <span>{{item.customerContactsInformation||"--"}}</span>
              </el-col>
              <el-col :span="16">
                <label class="lab-name">邮箱：</label>
                <span>{{item.customerContactsEmail||"--"}}</span>
              </el-col>
            </el-row>
          </div>
          <div>
            <topTip>
              <template>
                <el-col :span="18" style="text-align: left;" class="top-tip">
                  <span style="color: #417095;font-size: 16px;font-weight: bolder;">合作项目</span>
                </el-col>
              </template>
            </topTip>
            <el-table :data="cooperateProjectList" border>
              <el-table-column label="项目编号" prop="projectNum" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.projectNum||"--"}}</span>
                </template>
              </el-table-column>
              <el-table-column label="项目名称" prop="projectName" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.projectName||"--"}}</span>
                </template>
              </el-table-column>
              <el-table-column label="项目经理" prop="projectPersonName" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.projectPersonName||"--"}}</span>
                </template>
              </el-table-column>
              <el-table-column label="联系方式" prop="projectPersonPhone" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.projectPersonPhone||"--"}}</span>
                </template>
              </el-table-column>
              <el-table-column label="项目方向" prop="businessType" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.businessType||"--"}}</span>
                </template>
              </el-table-column>
              <el-table-column label="项目金额(元)" prop="projectBudget" align="right">
                <template slot-scope="scope">
                  <span>{{scope.row.projectBudget | moneyFormat}}</span>
                </template>
              </el-table-column>
              <el-table-column label="回款率" prop="remittanceRate" align="center">
                 <template slot-scope="scope">
                  <span>{{scope.row.remittanceRate + "%"||"--"}}</span>
                </template>
              </el-table-column>
              <el-table-column label="项目实施公司" prop="commissionedParty" align="center">
                 <template slot-scope="scope">
                  <span>{{scope.row.commissionedParty||"--"}}</span>
                </template>
              </el-table-column>
              <el-table-column label="联系人" prop="customerContacts" align="center">
                 <template slot-scope="scope">
                  <span>{{scope.row.customerContacts||"--"}}</span>
                </template>
              </el-table-column>
              <el-table-column label="是否结项" prop="isConclusion" align="center">
                 <template slot-scope="scope">
                  <span>{{scope.row.isConclusion||"--"}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div>
            <topTip>
              <template>
                <el-col :span="18" style="text-align: left;" class="top-tip">
                  <span style="color: #417095;font-size: 16px;font-weight: bolder;">合作前景分析</span>
                </el-col>
              </template>
            </topTip>
            <div
              style="margin-left: 30px;"
            >{{detailsInfo.cooperateProspect==''?'暂无数据':detailsInfo.cooperateProspect}}</div>
          </div>
        </div>
      </div>
      <!-- 底部按钮 START -->
      <div style="text-align: center;margin:10px 0px;">
        <el-button class="yt-bottom-btn" @click="backBtn">关闭</el-button>
      </div>
      <!-- 底部按钮END -->
      <!-- 日志信息 START -->
      <journalList :interFace="'db/customer/getCapitalJournalList'" :pkId="ids"></journalList>
      <!-- 日志信息 END -->
    </div>
  </div>
</template>

<script>
// 日志
import journalList from "../../components/journalList.vue";
import topTip from "../../components/topTip.vue";
import axios from "../../service/http";
import { option } from "../../static/config";
export default {
  data() {
    return {
      cooperateProjectList: [],
      ids: this.$route.query.pkId,
      detailsInfo: {
        pkId: "",
        customerName: "",
        customerTrade: "",
        regionCode: "",
        regionName: "",
        invoiceRise: "",
        taxpayerNumber: "",
        accountBank: "",
        accountNumber: "",
        contactAddress: "",
        contactPhone: "",
        cooperateProspect: "",
        customerLinkmanList: [],
      },
      userInfo: "",
      dataList: [],
      gang: "/",
    };
  },
  mounted() {
    this.getUserInfo();
    this.lookDetails();
  },
  methods: {
    // 查看当前登录人
    getUserInfo() {
      axios
        .post(option.base_path + "index/getCurrentUserInfo", {
          page: 1,
        })
        .then((res) => {
          this.userInfo =
            res.data.data.realName + " " + res.data.data.userPhone;
        });
    },
    // 查看详情
    lookDetails() {
      let params = {
        pkId: this.$route.query.pkId || "",
      };
      axios
        .post(option.base_path + "db/customer/getCustomerDetails", params)
        .then((res) => {
          if (res.data.flag == 0) {
            this.detailsInfo = res.data.data;

            if (
              this.detailsInfo.contactAddress == "" ||
              this.detailsInfo.accountBank == ""
            ) {
              this.gang = "";
            } else {
              this.gang = "/";
            }
          }
          if (this.detailsInfo.customerName != "") {
            this.getCooperateProject();
          }
        });
    },
    // 关闭
    backBtn() {
      this.$router.replace({
        path: "/customer/customerList",
      });
    },
    //获取合作项目
    getCooperateProject() {
      // this.detailsInfo.customerLinkmanList.forEach((item, index) => {
        axios
          .post(option.base_path + "db/customer/getCooperateProjectList", {
            customerName: this.detailsInfo.customerName,
          })
          .then((res) => {
            console.log(res, "  console.logthis.detailsInfo");
            this.cooperateProjectList = this.cooperateProjectList.concat(
              res.data.data
            );
          })
          .catch((err) => err);
      // });
    },
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
  components: {
    topTip,
    journalList,
  },
};
</script>

<style>
.customerBox {
  margin: 0px 40px;
  border-bottom: 1px dashed black;
}
.customerBox:last-child {
  border-bottom: none;
}
.lab-name {
  text-align: justify;
  color: #417095;
  font-weight: 700;
}
.el-table__footer-wrapper tbody td,
.el-table__header-wrapper tbody td {
  background-color: #ffffff;
}
</style>

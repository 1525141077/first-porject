<template>
  <div class="yt-dome-container">
    <div>
      <!-- 顶部信息START -->
      <topTip>
        <template>
          <el-col :span="18" style="text-align: left;" class="top-tip">
            <span style="color: #417095;font-size: 16px;font-weight: bolder;">到账单信息</span>
          </el-col>
          <el-col :span="5" style="text-align: left;" class="top-tip">
            <span style="color: #417095;font-size: 14px;font-weight: bolder;">登录人：</span>
            <span>{{userInfo}}</span>
          </el-col>
        </template>
      </topTip>
      <!-- 顶部信息END -->
      <!-- 到账单信息START -->
      <div>
        <el-row style="margin-left:30px;margin-bottom:20px;">
          <el-col :span="23">
            <label class="lab-name" style="letter-spacing: 2px;">汇款方名称：</label>
            <span>{{detailsInfo.remitterName}}</span>
          </el-col>
        </el-row>
        <el-row style="margin-left:30px;">
          <el-col :span="8">
            <label class="lab-name">收款金额(元)：</label>
            <span>{{detailsInfo.payeeAmountMoney}}</span>
          </el-col>
          <el-col :span="8">
            <label class="lab-name">到账日期：</label>
            <span>{{detailsInfo.entryAccountDate}}</span>
          </el-col>
          <el-col :span="8">
            <label class="lab-name">可认领金额(元)：</label>
            <span>{{detailsInfo.canClaimMoney}}</span>
          </el-col>
        </el-row>
      </div>
      <!-- 到账单信息END -->
      <div>
        <!-- 确认收入顶部信息START -->
        <topTip>
          <template>
            <el-col :span="18" style="text-align: left;" class="top-tip">
              <span style="color: #417095;font-size: 16px;font-weight: bolder;">确认收入</span>
            </el-col>
          </template>
        </topTip>
        <!-- 确认收入顶部信息END -->
        <!-- 确认收入 START -->
        <!-- <div style="margin: 0px 10px 10px 30px;">根据“到账单”汇款方、收款方信息匹配发票申请，仅显示未完成分配的发票申请</div> -->
        <div v-if="detailsInfo.claimType !== '2'">
          <div
            v-for="(item, i) in dataList"
            :key="i"
            style="border: 1px solid #dfe6f3;padding: 5px 20px 10px 20px;margin:10px;"
          >
            <el-row style="margin:10px 0px;">
              <el-col :span="8">
                <label class="lab-name">发票申请单号：</label>
                <span>{{item.invoiceAppNum}}</span>
              </el-col>
              <el-col :span="16">
                <label class="lab-name">合同名称/编号：</label>
                <span>{{item.contractName + '/' + item.contractNum}}</span>
              </el-col>
            </el-row>
            <el-table
              border
              show-summary
              :summary-method="getSummaries"
              :data="item.projectInformatList"
              style="width: 100%"
            >
              <el-table-column
                class="sum-td"
                prop="projectName"
                label="分配项目名称/编号"
                show-overflow-tooltip
              >
                <template scope="scope">
                  <span>{{scope.row.projectName + ' / ' + scope.row.projectNum}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="projectAmount" label="发票金额" align="right" width="120">
                <template scope="scope">
                  <span>{{scope.row.projectAmount | moneyFormat}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="noRelationAmount" label="未关联收入金额" align="right" width="150">
                <template scope="scope">
                  <span>{{scope.row.noRelationAmount | moneyFormat}}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="本次关联收入金额"
                prop="confirmIncomeAmount"
                align="right"
                width="200"
              >
                <template scope="scope">
                  <!-- <el-input v-model="scope.row.confirmIncomeAmount" class="money-input" @focus="moneyFocus(scope.row.confirmIncomeAmount, i, scope.$index)"
                  @blur="moneyTotal(scope.row.confirmIncomeAmount, scope.row.allMoney, i, scope.$index)" :key="scope.$index" placeholder="请输入金额"></el-input>-->
                  <finmoneyinput
                    v-model="scope.row.confirmIncomeAmount"
                    :tail="'元'"
                    @blur="moneyTotal(scope.row.confirmIncomeAmount, scope.row.allMoney, i, scope.$index)"
                  ></finmoneyinput>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <!-- 财务确认收入 START -->
        <div v-else>
          <el-form>
            <el-row style="margin:0px 30px 20px 30px;">
              <el-col :span="8">
                <label class="lab-name">认领人：</label>
                <span>{{detailsInfo.claimUsers}}</span>
              </el-col>
              <el-col :span="16">
                <label class="lab-name">认领日期：</label>
                <span>{{detailsInfo.claimDate}}</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item
                  label="确认收入(元)："
                  label-width="110px"
                  prop="copyMon"
                  :rules="{ required: false, message: '请输入金额', trigger: 'blur' }"
                >
                  <!-- <el-input @blur="blurMoney" @focus="focusMoney" v-model="detailsInfo.confirmIncomeAmount" placeholder="请输入金额"></el-input> -->
                  <finmoneyinput v-model="copyMon" :tail="'元'" :disabled="true"></finmoneyinput>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="说明：" label-width="110px">
              <el-input v-model="detailsInfo.remarks" type="textarea" autosize placeholder="请输入"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <!-- 财务确认收入 END -->
        <!-- 确认收入 END -->
        <el-row style="padding-left: 30px;" v-if="detailsInfo.claimType !== '2'">
          <el-col :span="12">
            <span>本次关联收入金额合计(元)：</span>
            <span>{{allMoney | moneyFormat}}</span>
          </el-col>
          <el-col :span="12">
            <span>认领日期：</span>
            <span>{{thisDate}}</span>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 底部按钮 START -->
    <div style="text-align: center;margin:10px 0px;">
      <el-button class="yt-bottom-btn" type="primary" :loading="subLoading" @click="submitRlInfo">确定</el-button>
      <el-button class="yt-bottom-btn" @click="backBtn">取消</el-button>
    </div>
    <!-- 底部按钮END -->
    <!-- 日志信息 START -->
    <journalList :interFace="'db/entry/getEntryJournalList'" :pkId="ids"></journalList>
    <!-- 日志信息 END -->
  </div>
</template>

<script>
// 金额组件
import finmoneyinput from "../../components/fin-money-input";
// 日志
import journalList from "../../components/journalList.vue";
import topTip from "../../components/topTip.vue";
import axios from "../../service/http";
import { option } from "../../static/config";
export default {
  data() {
    return {
      // 是否超出
      outState: false,
      // 认领列表
      rlList: [],
      subLoading: false,
      ids: this.$route.query.pkId,
      detailsInfo: {},
      userInfo: "",
      dataList: [],
      allMoney: 0,
      thisDate: "",
      newsMoney: 0,
      copyMon: 0,
      canClaim: 0,
    };
  },
  mounted() {
    this.getUserInfo();
    this.lookDetails();
    this.getThisDate();
    this.getCalaimInfo();
  },
  methods: {
    blurMoney() {
      this.detailsInfo.confirmIncomeAmount = this.moneysFlter(
        this.detailsInfo.confirmIncomeAmount
      );
    },
    focusMoney() {
      this.detailsInfo.confirmIncomeAmount = this.detailsInfo.confirmIncomeAmount.replace(
        /,/g,
        ""
      );
    },
    // 金额格式化
    moneysFlter(num) {
      if (num) {
        num = Number(num);
        num = (num.toFixed(2) + "").replace(
          /\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,
          "$&,"
        );
      }
      return num || "0.00";
    },
    // 金额失去焦点
    moneyTotal(money, totalMoney, rowIndex, tabIndex) {
      debugger;
      if (money > totalMoney) {
        this.$message.warning("金额不能超过未关联的金额");
        this.outState = true;
        // this.dataList[rowIndex].projectInformatList[tabIndex].confirmIncomeAmount = this.moneysFlter(money, '2')
        this.dataList[rowIndex].projectInformatList[
          tabIndex
        ].confirmIncomeAmount = 0;
      } else {
        this.outState = false;
      }
      this.allMoney = 0;
      this.newsMoney = 0;
      this.rlList.forEach((n) => {
        this.allMoney += Number(n.confirmIncomeAmount);
        this.newsMoney += Number(n.confirmIncomeAmount);
      });
      // this.allMoney += Number(money)
    },
    // 获取焦点
    // moneyFocus (money, rowIndex, tabIndex) {
    //   this.dataList[rowIndex].projectInformatList[tabIndex].confirmIncomeAmount = this.dataList[rowIndex].projectInformatList[tabIndex].confirmIncomeAmount.toString().replace(/,/g, "")
    // },
    // 认领确定
    submitRlInfo() {
      if (this.canClaim >= this.allMoney) {
        this.allMoney = this.moneysFlter(this.allMoney);
      } else {
        this.$message.warning("“本次关联收入金额合计”不应大于“可认领金额”");
        this.dataList[rowIndex].projectInformatList[
          tabIndex
        ].confirmIncomeAmount = 0;
        this.outState = true;
      }
      if (!this.outState) {
        if (this.detailsInfo.claimType !== "2") {
          let mapList = JSON.parse(JSON.stringify(this.dataList));
          let moneyTotal = 0;
          if (mapList.length !== 0) {
            mapList.forEach((n) => {
              moneyTotal = 0;
              if (n.projectInformatList.length !== 0) {
                n.projectInformatList.forEach((a) => {
                  if (a.projectAmount) {
                    a.projectAmount = a.projectAmount
                      .toString()
                      .replace(/,/g, "");
                  }
                  if (a.noRelationAmount) {
                    a.noRelationAmount = a.noRelationAmount
                      .toString()
                      .replace(/,/g, "");
                  }
                  moneyTotal += Number(a.confirmIncomeAmount);
                });
              }
              n.projectInformatList = JSON.stringify(n.projectInformatList);
              n.amountTotal = moneyTotal;
            });
          }
          let params = {
            pkId: this.$route.query.pkId,
            confirmIncomeAmount: this.newsMoney,
            invoiceInformatList: mapList,
          };
          this.subLoading = true;
          axios
            .post(option.base_path + "db/entry/saveClaimDetails", params)
            .then((res) => {
              this.subLoading = false;
              this.$message.success("认领成功");
              this.backBtn();
            });
        } else {
          this.sureCw();
        }
      }
    },
    // 认领财务
    sureCw() {
      let params = {
        pkId: this.$route.query.pkId,
        confirmIncomeAmount: this.detailsInfo.confirmIncomeAmount,
        remarks: this.detailsInfo.remarks,
      };
      this.subLoading = true;
      axios
        .post(option.base_path + "db/entry/updateFinanceDirectCllim", params)
        .then((res) => {
          this.subLoading = false;
          this.$message.success("认领成功");
          this.backBtn();
        });
    },
    // 获取认领日期
    getThisDate() {
      let newDate = new Date();
      let newYear = newDate.getFullYear();
      let newMonth =
        newDate.getMonth() + 1 < 10
          ? "0" + (newDate.getMonth() + 1)
          : newDate.getMonth() + 1;
      let newDay =
        newDate.getDate() < 10 ? "0" + newDate.getDate() : newDate.getDate();
      let newDateTime = newYear + "-" + newMonth + "-" + newDay;
      this.thisDate = newDateTime;
    },
    // 合计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        } else if (index === 3) {
          const values = data.map((item) => Number(item[column.property]));
          if (!values.every((value) => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] = this.moneysFlter(sums[index]);
            // sums[index] += ' 元';
          } else {
            sums[index] = "--";
          }
        }
      });
      return sums;
    },
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
        pkId: this.$route.query.pkId,
      };
      axios
        .post(option.base_path + "db/entry/getDetails", params)
        .then((res) => {
          this.detailsInfo = res.data.data;
          this.copyMon = res.data.data.payeeAmountMoney;
          this.canClaim = res.data.data.canClaimMoney;
          this.detailsInfo.payeeAmountMoney = this.moneysFlter(
            this.detailsInfo.payeeAmountMoney
          );
          this.detailsInfo.canClaimMoney = this.moneysFlter(
            this.detailsInfo.canClaimMoney
          );
        });
    },
    // 获取认领信息
    getCalaimInfo() {
      let params = {
        pkId: this.$route.query.pkId,
      };
      axios
        .post(option.base_path + "db/entry/getClaimDetails", params)
        .then((res) => {
          this.dataList = res.data.data;
          if (this.dataList.length !== 0) {
            this.dataList.forEach((n) => {
              if (n.projectInformatList.length !== 0) {
                n.projectInformatList.forEach((a) => {
                  this.rlList.push(a);
                  this.allMoney += Number(a.confirmIncomeAmount);
                  this.newsMoney += Number(a.confirmIncomeAmount);
                  a.allMoney = a.noRelationAmount + a.confirmIncomeAmount;
                  // a.confirmIncomeAmount = this.moneysFlter(a.confirmIncomeAmount)
                  // a.noRelationAmount = this.moneysFlter(a.noRelationAmount, '2')
                  // a.projectAmount = this.moneysFlter(a.projectAmount, '2')
                });
              }
            });
            this.allMoney = this.moneysFlter(this.allMoney);
          }
        });
    },
    // 关闭
    backBtn() {
      this.$router.replace({
        path: "/incomeReceived/incomeReceivedList",
      });
    },
  },
  filters: {
    numberFormata(val, i) {
      let money = finMoneyformat(val, i);
      return money !== "0" && money !== "0.00" && money !== "" && money !== 0
        ? money
        : "--";
    },
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
    finmoneyinput,
  },
};
</script>

<style>
.lab-name {
  text-align: justify;
  color: #417095;
  font-weight: 700;
}
.money-input .el-input__inner {
  text-align: right;
}
.el-table__footer-wrapper tbody td,
.el-table__header-wrapper tbody td {
  background-color: #ffffff;
}
</style>

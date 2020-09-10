<template>
  <div class="yt-dome-container">
    <div>
      <!-- 顶部信息START -->
      <topTip>
        <template>
          <el-col :span="18" style="text-align: left;" class="top-tip">
            <span style="color: #417095;font-size: 16px;font-weight: bolder;">到账信息</span>
            </el-col>
            <el-col :span="5" style="text-align: left;" class="top-tip">
            <span style="color: #417095;font-size: 14px;font-weight: bolder;">到账单编号：</span>
            <span>{{userInfo}}</span>
            </el-col>
        </template>
      </topTip>
      <!-- 顶部信息END -->
      <!-- 到账单信息START -->
      <div>
        <el-row style="margin-left:30px;margin-bottom:20px;">
          <el-col :span="12">
            <label class="lab-name" style="letter-spacing: 2px;">汇款方名称：</label>
            <span>{{detailsInfo.remitterName}}</span>
          </el-col>
          <el-col :span="12">
            <label class="lab-name" style="letter-spacing: 2px;">汇款方账号：</label>
            <span>{{detailsInfo.remitterAccount}}</span>
          </el-col>
        </el-row>
        <el-row style="margin-left:30px;margin-bottom:20px;">
          <el-col :span="12">
            <label class="lab-name" style="letter-spacing: 2px;">收款方名称：</label>
            <span>{{detailsInfo.payeeName}}</span>
          </el-col>
          <el-col :span="12">
            <label class="lab-name" style="letter-spacing: 2px;">收款方账号：</label>
            <span>{{detailsInfo.payeeAccount}}</span>
          </el-col>
        </el-row>
        <el-row style="margin-left:30px;margin-bottom:20px;">
          <el-col :span="12">
            <label class="lab-name">收款金额(元)：</label>
            <span>{{detailsInfo.payeeAmountMoney | moneFlter}}</span>
          </el-col>
          <el-col :span="12">
            <label class="lab-name" style="letter-spacing: 6px;">到账日期：</label>
            <span>{{detailsInfo.entryAccountDate}}</span>
          </el-col>
        </el-row>
        <el-row style="margin-left:30px;">
          <el-col :span="12">
            <label class="lab-name" style="letter-spacing: 6px;">认领方式：</label>
            <span>{{detailsInfo.claimType}}</span>
          </el-col>
          <el-col :span="12">
            <label class="lab-name" style="letter-spacing: 2px;">认领接收人：</label>
            <span>{{detailsInfo.claimUsers}}</span>
          </el-col>
        </el-row>
      </div>
      <!-- 到账单信息END -->
    <div>
      <!-- 确认收入顶部信息START -->
      <topTip>
        <template>
          <el-col :span="18" style="text-align: left;" class="top-tip">
            <span style="color: #417095;font-size: 16px;font-weight: bolder;">认领信息</span>
            </el-col>
        </template>
      </topTip>
      <!-- 确认收入顶部信息END -->
      <!-- 确认收入 START -->
      <div v-if="detailsInfo.claimType !== '财务直接认领'">
        <div v-for="(item, i) in dataList" :key="i">
          <el-row style="margin:0px 30px 20px 30px;">
            <el-col :span="8">
              <label class="lab-name">认领人：</label>
              <span>{{item.invoiceAppUserName}}</span>
            </el-col>
            <el-col :span="16">
              <label class="lab-name">认领日期：</label>
              <span>{{item.calimDate}}</span>
            </el-col>
          </el-row>
          <div style="border: 1px solid #dfe6f3;padding: 5px 20px 10px 20px;margin:0px 10px 20px 10px;">
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
          style="width: 100%">
          <el-table-column
            prop="memberName"
            label="分配项目名称/编号"
            show-overflow-tooltip>
            <template scope="scope">
              <span>{{scope.row.projectName + '/' + scope.row.projectNum}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="projectAmount"
            label="分配收入金额"
            align="right"
            width="120">
            <template scope="scope">
                <span>{{scope.row.projectAmount | moneFlter}}</span>
              </template>
          </el-table-column>
          <el-table-column
            prop="noRelationAmount"
            label="未确认收入金额"
            align="right"
            width="150">
            <template scope="scope">
                <span>{{scope.row.noRelationAmount | moneFlter}}</span>
              </template>
          </el-table-column>
          <el-table-column
            prop="confirmIncomeAmount"
            label="本次确认收入金额"
            align="right"
            width="150">
            <template scope="scope">
                <span>{{scope.row.confirmIncomeAmount | moneFlter}}</span>
              </template>
          </el-table-column>
        </el-table>
        </div>
      </div>
      </div>
      <div v-else>
          <el-row style="margin:0px 30px 20px 30px;">
            <el-col :span="12">
              <label class="lab-name" style="letter-spacing: 2px;">认领人：</label>
              <span>{{detailsInfo.claimUsers}}</span>
            </el-col>
            <el-col :span="12">
              <label class="lab-name" style="letter-spacing: 2px;">认领日期：</label>
              <span>{{detailsInfo.claimDate}}</span>
            </el-col>
          </el-row>
           <el-row style="margin:10px 30px;">
            <el-col :span="12">
              <label class="lab-name" style="letter-spacing: 2px;">确认收入：</label>
              <span>{{detailsInfo.confirmIncomeAmount | moneFlter}}</span>
            </el-col>
          </el-row>
           <el-row style="margin:20px 30px;">
            <el-col :span="12">
              <label class="lab-name" style="letter-spacing: 2px;">说明：</label>
              <div style="display: inline-block;white-space: pre-wrap;">{{detailsInfo.remarks}}</div>
            </el-col>
          </el-row>
      </div>
      <!-- 确认收入 END -->
    </div>
    </div>
    <!-- 底部按钮 START -->
    <div style="text-align: center;margin:10px 0px;">
      <el-button class="yt-bottom-btn" @click="backBtn">关闭</el-button>
    </div>
    <!-- 底部按钮END -->
    <!-- 日志信息 START -->
    <journalList
    :interFace="'db/entry/getEntryJournalList'"
    :pkId="ids">
    </journalList>
    <!-- 日志信息 END -->
  </div>
</template>

<script>
// 日志
import journalList from '../../components/journalList.vue'
import topTip from '../../components/topTip.vue'
import axios from '../../service/http'
import { option } from '../../static/config'
export default {
  data() {
    return {
      ids: this.$route.query.pkId,
      detailsInfo: {
      },
      userInfo: '',
      dataList: []
    }
  },
  mounted() {
    this.getUserInfo()
    this.lookDetails()
    this.lookRlDetails()
  },
  methods: {
    // 金额格式化
    moneysFlter (num, type) {
      if (num) {
        num = Number(num);
        num = (num.toFixed(2) + "").replace(
          /\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,
          "$&,"
        )
      }
      return num || "0.00"
    },
    // 合计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
         if (index === 0) {
            sums[index] = '合计';
            return;
          } else if (index === 3) {
            const values = data.map(item => Number(item[column.property]));
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              }, 0);
              sums[index] = this.moneysFlter(sums[index], '2')
              // sums[index] += ' 元';
            } else {
              sums[index] = 'N/A';
            }
          }
      });
      return sums;
    },
    // 查看当前登录人
    getUserInfo () {
      axios.post(option.base_path + 'index/getCurrentUserInfo', {
        page: 1
      }).then(res => {
        this.userInfo = res.data.data.realName + ' ' + res.data.data.userPhone
      })
    },
    // 查看认领详情
    lookRlDetails () {
      let params = {
        pkId: this.$route.query.pkId
      }
      axios.post(option.base_path + 'db/entry/getClaimInformation', params).then(res => {
        this.dataList = res.data.data
      })
    },
    // 查看详情
    lookDetails () {
      let params = {
        pkId: this.$route.query.pkId
      }
      axios.post(option.base_path + 'db/entry/getDetails', params).then(res => {
        this.detailsInfo = res.data.data
        // this.detailsInfo.payeeAmountMoney = this.moneysFlter(this.detailsInfo.payeeAmountMoney, '2')
        for (const k in this.detailsInfo) {
          if (k === 'claimType') {
            if (this.detailsInfo[k] === '1') {
              this.detailsInfo[k] = '匹配认领项目'
            } else if (this.detailsInfo[k] === '2') {
              this.detailsInfo[k] = '财务直接认领'
            } else {
              this.detailsInfo[k] = '指定认领人'
            }
          }
        }
      })
    },
    // 关闭
    backBtn  () {
      this.$router.replace({
        path: '/incomeReceived/incomeReceivedList'
      })
    }
  },
  filters: {
    moneFlter (num) {
      if (num) {
        num = Number(num);
        num = (num.toFixed(2) + "").replace(
          /\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,
          "$&,"
        )
      }
      return num || "0.00"
    }
  },
  components: {
    topTip,
    journalList
  }
};
</script>

<style>
.lab-name {
   text-align: justify;
    color: #417095;
    font-weight:700;
}
.el-table__footer-wrapper tbody td, .el-table__header-wrapper tbody td {
  background-color: #ffffff;
}
</style>

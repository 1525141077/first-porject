<template>
  <div class="yt-dome-container income-received-add">
    <!-- <addPageComponets :popList="dataMap" :lookType="'2'" :needBtn ="false"></addPageComponets> -->
    <!-- 上传竞聘方案START -->
    <div>
    <div>
      <!-- 顶部信息START -->
      <topTip>
        <template>
          <el-col :span="17" style="text-align: left;" class="top-tip">
            <span style="color: #417095;font-size: 16px;font-weight: bolder;">到账信息</span>
            </el-col>
            <el-col :span="5" style="text-align: left;" class="top-tip">
            <span style="color: #417095;font-size: 14px;font-weight: bolder;">到账单编号：</span>
            <span style="font-size: 14px;">{{cardNum}}</span>
            </el-col>
        </template>
      </topTip>
      <!-- 顶部信息END -->
    <div>
      <el-form ref="subInfo" :model="subInfo" style="padding-right:20px;">
        <el-row>
          <el-col :span="12" style="padding-right:20px;">
            <el-form-item label="汇款方名称："  label-width="110px" prop="remitterName" :rules="{ required: true, message: '请输入汇款方名称', trigger: 'blur' }">
              <el-input v-model="subInfo.remitterName" placeholder="请输入内容" @blur="getMatchingInvoice"></el-input>
             </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="汇款方账号："  label-width="110px" prop="remitterAccount" :rules="{ required: true, message: '请输入汇款方账号', trigger: 'blur' }">
              <el-input v-model="subInfo.remitterAccount" @blur="getMatchingInvoice" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
            <el-row>
              <el-col :span="12" style="padding-right:20px;">
                <el-form-item label="收款方名称："  label-width="110px" prop="payeeName" :rules="{ required: true, message: '请输入收款方名称', trigger: 'blur' }">
                  <el-input v-model="subInfo.payeeName" @blur="getMatchingInvoice" placeholder="请输入内容"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="收款方账号："  label-width="110px" prop="payeeAccount" :rules="{ required: true, message: '请输入收款方账号', trigger: 'blur' }">
                  <el-input v-model="subInfo.payeeAccount" @blur="getMatchingInvoice" placeholder="请输入内容"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" style="padding-right:20px;">
                <el-form-item label="收款金额(元)："  label-width="110px" prop="payeeAmountMoney" :rules="{ required: true, message: '请输入收款金额', trigger: 'blur' }">
                    <!-- <el-input v-model="subInfo.payeeAmountMoney" placeholder="请输入内容"></el-input> -->
                    <!-- <money :moneys="subInfo.payeeAmountMoney" @blurMoney="blurMoney"></money> -->
                    <finmoneyinput v-model="subInfo.payeeAmountMoney" :tail="'元'"></finmoneyinput>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                 <el-form-item label="到账日期："  label-width="110px" prop="entryAccountDate" :rules="{ required: true, message: '请选择到账日期', trigger: 'change' }">
                     <el-date-picker
                     style="width:100%;"
                      format="yyyy - MM - dd"
                    value-format="yyyy-MM-dd"
                      v-model="subInfo.entryAccountDate"
                      type="date"
                      placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          <!-- 认领START -->
          <el-form-item label="请选择认领方式"  label-width="110px">
            <el-radio-group v-model="subInfo.claimType" @change="redioChange" style="margin-left: 20px;">
              <el-radio :label="'1'">匹配开票申请</el-radio>
              <el-radio :label="'2'">财务直接认领</el-radio>
              <el-radio :label="'3'">指定认领人</el-radio>
            </el-radio-group>
          </el-form-item>
          <div style="padding:10px 20px;border:1px solid #dfe6f3;margin: 0px 0px 20px 10px;">
            <!-- 匹配开票申请 START -->
            <div :key="subInfo.claimType + '1'" v-if="subInfo.claimType === '1'">
              <span style="color: #797979;font-size: 13px;">匹配开票申请规则：发票申请的购买方、销售方名称和账号与到账单汇款方、收款方名称和账号完全一致</span>
              <el-table
              border
              ref="kpTable"
              @selection-change="checkBoxList"
              :span-method="objectSpanMethod"
              :data="ppTable"
              style="width: 100%">
               <el-table-column
               :selectable="checkboxInit"
               class-name="check-box-add"
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                prop="name"
                label="发票申请人"
                align="center"
                width="130">
              </el-table-column>
              <el-table-column
                prop="invoiceAppNum"
                label="发票申请编号"
                align="center"
                width="150">
              </el-table-column>
              <el-table-column
                prop="contractNameNum"
                label="合同名称/编号">
              </el-table-column>
              <el-table-column
              prop="noRelationAmount"
              align="right"
              width="180"
              label="发票未关联收入金额(元)">
              <template scope="scope">
                <span>{{scope.row.noRelationAmount | moneFlter}}</span>
              </template>
              </el-table-column>
            </el-table>
            </div>
            <!-- 匹配开票申请 END -->
            <!-- 财务直接认领 START -->
            <div :key="subInfo.claimType + '2'" v-else-if="subInfo.claimType === '2'">
              <el-row>
                <el-col :span="12" style="padding-right: 20px;">
                  <el-form-item label="确认收入(元)：" label-width="110px" prop="confirmIncomeAmount" :rules="{ required: true, message: '请输入金额', trigger: 'blur' }">
                    <!-- <el-input v-model="subInfo.confirmIncomeAmount" placeholder="请输入内容"></el-input> -->
                    <finmoneyinput v-model="subInfo.confirmIncomeAmount" :tail="'元'"></finmoneyinput>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="认领日期：" label-width="110px">
                    <span>{{subInfo.claimDate}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="说明：" label-width="110px">
                    <el-input
                      v-model="subInfo.remarks"
                      type="textarea"
                      autosize
                      placeholder="请输入">
                      </el-input>
                  </el-form-item>
            </div>
            <!-- 财务直接认领 END -->
            <!-- 指定认领人 START -->
            <div :key="subInfo.claimType + '3'" v-else>
              <el-form-item label="请选择认领人：" label-width="100px">
                <div>
                  <div v-for="(item, i) in peopleList" :key="i" style="display:inline-block;margin-bottom:5px;">
                    <selectMan :key="i" :selectName="item.nameString" @choseMan="handleSelect($event, i)" style="width:76%;display:inline-block;"></selectMan>
                    <el-button
                      style="padding: 0;"
                      type="text"
                      size="small"
                      @click="deletePeo(i)"
                    >删除</el-button>
                  </div>
                  <div style="display:inline-block;position:relative;">
                    <label class="list-add" @click="addTabList"></label>
                  </div>
                </div>
              </el-form-item>
              <div>
                <el-table
                border
                ref="zdTable"
                @selection-change="checkBoxListTwo"
                :span-method="objectSpanMethod"
                  :data="peopleTable"
                  style="width: 100%">
                  <el-table-column
                  :selectable="checkboxInit"
                  class-name="check-box-add"
                    type="selection"
                    width="55">
                  </el-table-column>
                  <el-table-column
                    prop="invoiceAppUserName"
                    label="发票申请人"
                    align="center"
                    width="130">
                  </el-table-column>
                  <el-table-column
                    prop="invoiceAppNum"
                    label="发票申请编号"
                    align="center"
                    width="150">
                  </el-table-column>
                  <el-table-column
                    prop="contractNameNum"
                    label="合同名称/编号">
                  </el-table-column>
                  <el-table-column
                  prop="noRelationAmount"
                  align="right"
                  width="180"
                  label="发票未关联收入金额(元)">
                  <template scope="scope">
                    <span>{{scope.row.noRelationAmount | moneFlter}}</span>
                  </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <!-- 指定认领人 END -->
          </div>
          <!-- 认领END -->
          <!-- 修改认领信息 START -->
          <!-- 确认收入顶部信息START -->
            <topTip v-if="ids">
              <template>
                <el-col :span="18" style="text-align: left;" class="top-tip">
                  <span style="color: #417095;font-size: 16px;font-weight: bolder;">认领信息</span>
                  </el-col>
              </template>
            </topTip>
            <!-- 确认收入顶部信息END -->
            <!-- 匹配开票申请 START -->
            <div v-if="ids">
              <!-- 循环 -->
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
              :key="pkId"
              :data="item.projectInformatList"
              show-summary
              :summary-method="getSummaries"
              style="width: 100%">
                <el-table-column
              class="sum-td"
                prop="projectName"
                label="分配项目名称/编号"
                show-overflow-tooltip>
                <template scope="scope">
                    <span>
                      {{scope.row.projectName + ' / ' + scope.row.projectNum}}
                    </span>
                  </template>
                </el-table-column>
              <el-table-column
                prop="projectAmount"
                label="发票金额"
                align="right"
                width="120">
                <template scope="scope">
                  <span>{{scope.row.projectAmount | moneFlter}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="noRelationAmount"
                label="发票未关联收入金额"
                align="right"
                width="180">
                <template scope="scope">
                  <span>{{scope.row.noRelationAmount | moneFlter}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="confirmIncomeAmount"
                label="本次关联收入金额"
                align="right"
                width="150">
                <template scope="scope">
                  <!-- <el-input v-model="scope.row.confirmIncomeAmount"  class="money-input" @focus="moneyFocus(scope.row.confirmIncomeAmount, i, scope.$index)"
                   @blur="moneyTotal(scope.row.confirmIncomeAmount, i, scope.$index)" :key="scope.$index" placeholder="请输入金额"></el-input> -->
                    <finmoneyinput v-model="scope.row.confirmIncomeAmount" @blur="moneyTotal(scope.row.confirmIncomeAmount, scope.row.allMoney, i, scope.$index)" :tail="'元'"></finmoneyinput>
                </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          </div>
          <!-- 匹配开票申请 END -->
          <!--财务直接认领 START -->
          <div v-else-if="ids && subInfo.claimType === '2'">
            <el-row style="margin:0px 30px 20px 30px;">
                <el-col :span="8">
                  <label class="lab-name">认领人：</label>
                  <span>{{detailsData.claimUsers}}</span>
                </el-col>
                <el-col :span="16">
                  <label class="lab-name">认领日期：</label>
                  <span>{{detailsData.claimDate}}</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <el-form-item label="确认收入(元)：" label-width="110px" prop="confirmIncomeAmount" :rules="{ required: true, message: '请输入金额', trigger: 'blur' }">
                    <!-- <el-input @blur="blurMoney" @focus="focusMoney" v-model="subInfo.confirmIncomeAmount" placeholder="请输入内容"></el-input> -->
                    <finmoneyinput v-model="subInfo.confirmIncomeAmount" :tail="'元'"></finmoneyinput>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="说明：" label-width="110px">
                  <el-input
                    v-model="subInfo.remarks"
                    type="textarea"
                    autosize
                    placeholder="请输入">
                    </el-input>
                </el-form-item>
          </div>
          <!--财务直接认领 END -->
          <!-- 修改认领信息 END -->
      </el-form>
    </div>
    </div>
    <!-- 底部按钮 START -->
    <div style="text-align: center;" scope="scope">
      <el-button class="yt-bottom-btn" type="primary" v-if="ids" :loading="subLoading" @click="submitRlInfo">确定</el-button>
      <el-button class="yt-bottom-btn" type="primary" v-else :loading="subLoading" @click="submit">{{subName}}</el-button>
      <el-button class="yt-bottom-btn" @click="backBtn">取消</el-button>
    </div>
    <!-- 底部按钮END -->
    <!-- 日志信息 START -->
    <journalList
    v-if="ids"
    :interFace="'db/entry/getEntryJournalList'"
    :pkId="ids">
    </journalList>
    <!-- 日志信息 END -->
    </div>
    <!-- 弹窗START -->
     <el-dialog
      title=""
      :visible.sync="dialogState"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="30%"
      center
      :before-close="canelBtn">
      <div style="text-align:center;">
        <p style="font-size:18px;margin:10px 0px;">{{dialogInfo}}</p>
      </div>
      <span slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button :loading="subLoading" @click="canelBtn">取 消</el-button>
        <el-button type="primary" :loading="subLoading" @click="sureBtn">确认</el-button>
      </span>
    </el-dialog>
    <!-- 弹窗END -->
  </div>
</template>

<script>
// 金额组件
import finmoneyinput from "../../components/fin-money-input";
// 日志
import journalList from '../../components/journalList.vue'
// 选人组件
import selectMan from "../../components/selectMan.vue"
import topTip from '../../components/topTip.vue'
// import addPageComponets from "../../components/addPageComponets.vue"
import axios from '../../service/http'
import { option } from '../../static/config'
export default {
  data() {
    return {
      outState: false,
      // 判断是否勾选了认领人
      checkType: false,
      dataList: [],
      detailsData : {},
      ids: this.$route.query.pkId,
      dialogState: false,
      dialogInfo: '',
      subLoading: false,
      // 申请人列表
      peopleTable: [],
      // 认领人集合
      peopleList: [{
        nameString: '',
        userName: '',
        userCode: ''
      }],
      cardNum: '提交后自动生成',
      subName: '确认并发送邮件通知认领人',
      tableData: [],
      subInfo: {
        pkId: '',
        entryAccountNum: '',
        remitterName: '',
        remitterAccount: '',
        payeeName: '',
        payeeAccount: '',
        payeeAmountMoney: 0,
        entryAccountDate: '',
        claimType: '1',
        confirmIncomeAmount: '',
        claimDate: '',
        remarks: '',
        invoiceAppUserList: [],
        claimInformationList: []
      }
    }
  },
  mounted() {
    if (this.ids) {
      this.$alert('如更换认领人,请将原认领人“本次关联收入金额”清零。', '修改提示', {
        type:'warning',
          confirmButtonText: '确定',
          callback: action => {
          }
        })
      this.lookDetails()
      this.lookRlDetails()
      this.lookListDetails()
    }
  },
  methods: {
    blurMoney () {
      this.subInfo.confirmIncomeAmount = this.moneysFlter(this.subInfo.confirmIncomeAmount, '2')
    },
    focusMoney () {
      this.subInfo.confirmIncomeAmount = this.subInfo.confirmIncomeAmount.replace(/,/g, "")
    },
    // 金额失去焦点
    moneyTotal (money, totalMoney, rowIndex, tabIndex) {
      if (money > totalMoney) {
        this.$message.warning('金额不能超过未关联的金额')
        this.outState = true
        // this.dataList[rowIndex].projectInformatList[tabIndex].confirmIncomeAmount = this.moneysFlter(money, '2')
        this.dataList[rowIndex].projectInformatList[tabIndex].confirmIncomeAmount = 0
      } else {
        this.outState = false
      }
      // this.allMoney = 0
      // this.newsMoney = 0
      // this.rlList.forEach(n => {
      //   this.allMoney += Number(n.confirmIncomeAmount)
      //   this.newsMoney += Number(n.confirmIncomeAmount)
      // })
      // this.allMoney = this.moneysFlter(this.allMoney)
      // this.allMoney += Number(money)
    },
    // 金额失去焦点
    // moneyTotal (money, rowIndex, tabIndex) {
    //   this.dataList[rowIndex].projectInformatList[tabIndex].confirmIncomeAmount = this.moneysFlter(money, '2')
    //   // this.allMoney += Number(money)
    // },
    // // 获取焦点
    // moneyFocus (money, rowIndex, tabIndex) {
    //   this.dataList[rowIndex].projectInformatList[tabIndex].confirmIncomeAmount = this.dataList[rowIndex].projectInformatList[tabIndex].confirmIncomeAmount.toString().replace(/,/g, "")
    // },
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
    // 金额
    blurMoney (money) {
      this.subInfo.payeeAmountMoney = money.money
    },
    // 禁用多选框
    checkboxInit(row, index) {
      if (!row.nameType) {
        return 0
      } else {
        return 1
      }
    },
    // 查看认领详情
    lookRlDetails () {
      let params = {
        pkId: this.$route.query.pkId
      }
      axios.post(option.base_path + 'db/entry/getClaimInformation', params).then(res => {
        this.dataList = res.data.data
        this.dataList.forEach(n => {
          n.projectInformatList.forEach(a => {
            a.allMoney = a.noRelationAmount + a.confirmIncomeAmount
          })
        })
      })
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
    objectSpanMethod ({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 1 || columnIndex === 0) {
        if (row.nameType) {
          return {
            rowspan: row.length,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    // 第一个列表
    checkBoxList (selectList) {
      this.subInfo.invoiceAppUserList = []
      if (selectList.length !== 0) {
        selectList.forEach(n => {
          let params = {
            invoiceAppUser: n.invoiceAppUser,
            invoiceAppUserName: n.name
          }
          this.subInfo.invoiceAppUserList.push(params)
        })
        this.checkType = true
      } else {
        this.subInfo.invoiceAppUserList = []
        this.checkType = false
      }
    },
    // 第二个列表
    checkBoxListTwo (selectList) {
      this.subInfo.invoiceAppUserList = []
      if (selectList.length !== 0) {
        selectList.forEach(n => {
          let params = {
            invoiceAppUser: n.invoiceAppUser,
            invoiceAppUserName: n.name
          }
          this.subInfo.invoiceAppUserList.push(params)
        })
        this.checkType = true
      } else {
        this.subInfo.invoiceAppUserList = []
        this.checkType = true
      }
    },
    // 获取匹配开票申请
    getMatchingInvoice () {
      let that = this;
      debugger
      let params = {
        pkId: this.ids,
        remitterName: this.subInfo.remitterName,
        remitterAccount: this.subInfo.remitterAccount,
        payeeName: this.subInfo.payeeName,
        payeeAccount: this.subInfo.payeeAccount
      }
      axios.post(option.base_path + 'db/entry/getMatchingInvoice', params).then(res => {
        if (this.subInfo.claimType === '1') {
          that.ppTable = [];
          let prevName = ''
          let nameLists = res.data.data;
           this.$forceUpdate()
          if (nameLists.length !== 0) {
            nameLists.forEach((n, i) => {
              if (n.invoiceInformatList.length !== 0) {
                debugger
                n.invoiceInformatList.forEach((a, b) => {
                  a.name = n.invoiceAppUserName
                  a.isSelect = n.isSelect
                  a.length = n.invoiceInformatList.length
                  for (const k in a) {
                    if (a[k] === '') {
                      a[k] = '--'
                    }
                  }
                  that.ppTable.push(a)
                })
              }
            })
            this.$forceUpdate()
            console.log('222', that.ppTable)
          }
          if (this.ppTable.length !== 0) {
            this.ppTable.forEach(n => {
              // 循环是否可以合并
              if (n.name !== prevName) {
                n.nameType = true
              } else {
                n.nameType = false
              }
              prevName = n.name
            })
            this.ppTable.forEach(n => {
              if (n.isSelect === '1' && n.nameType) {
                this.$nextTick(() => {
                  this.$refs.kpTable.toggleRowSelection(n, true)
                })
              }
            })
          }
        }
      })
    },
    // 获取认领人信息
    getAppointUser (item) {
      debugger
       let params = {
        pkId: this.ids,
        invoiceAppUserList: item
      }
      let prevName = ''
      axios.post(option.base_path + 'db/entry/getAppointUser', params).then(res => {
        debugger
        this.peopleTable = res.data.data;
        console.log("撒地方撒",this.peopleTable)
        this.peopleTable.forEach((n, i) => {
          // n.noRelationAmount = this.moneysFlter(n.noRelationAmount, '2')
          n.name = n.invoiceAppUserName
          if (n.invoiceAppUserName !== prevName) {
            n.nameType = true
            length = 1
          } else {
            n.nameType = false
          }
          prevName = n.invoiceAppUserName
        })
      })
    },
    // 查看详情
    lookDetails () {
      let params = {
        pkId: this.ids
      }
      axios.post(option.base_path + 'db/entry/getDetails', params).then(res => {
        this.cardNum = res.data.data.entryAccountNum
        this.subInfo.pkId = res.data.data.pkId
        this.subInfo.entryAccountNum = res.data.data.entryAccountNum
        this.subInfo.remitterName = res.data.data.remitterName
        this.subInfo.remitterAccount = res.data.data.remitterAccount
        this.subInfo.payeeName = res.data.data.payeeName
        this.subInfo.payeeAccount = res.data.data.payeeAccount
        this.subInfo.payeeAmountMoney = res.data.data.payeeAmountMoney ? Number(res.data.data.payeeAmountMoney) : 0
        this.subInfo.entryAccountDate = res.data.data.entryAccountDate
        this.subInfo.claimType = res.data.data.claimType
        this.subInfo.confirmIncomeAmount = res.data.data.confirmIncomeAmount ? Number(res.data.data.confirmIncomeAmount) : 0
        this.subInfo.claimDate = res.data.data.claimDate
        this.subInfo.remarks = res.data.data.remarks
      })
    },
    // 查看列表详情
    lookListDetails () {
      let params = {
        pkId: this.ids
      }
      axios.post(option.base_path + 'db/entry/getUpdateclaimDetails', params).then(res => {
        // this.peopleTable = res.data.data.invoiceInformatList
        // this.tableData = res.data.data.invoiceInformatList
        let prevName = ''
        let nameLists = res.data.data
         debugger
        if (this.subInfo.claimType === '1') {
          
          // conaole.log(nameLists)
          this.ppTable = [];
          if (nameLists.length !== 0) {
            nameLists.forEach((n, i) => {
              if (n.invoiceInformatList.length !== 0) {
                n.invoiceInformatList.forEach((a, b) => {
                  a.name = n.invoiceAppUserName
                  a.isSelect = n.isSelect
                  a.length = n.invoiceInformatList.length
                  for (const k in a) {
                    if (a[k] === '') {
                      a[k] = '--'
                    }
                  }
                  debugger
                  this.ppTable.push(a)
                })
              }
            })
          }
          if (this.ppTable.length !== 0) {
            this.ppTable.forEach(n => {
              // 循环是否可以合并
              if (n.name !== prevName) {
                n.nameType = true
              } else {
                n.nameType = false
              }
              prevName = n.name
            })
            this.ppTable.forEach(n => {
              if (n.isSelect === '1' && n.nameType) {
                this.$nextTick(() => {
                  this.$refs.kpTable.toggleRowSelection(n, true)
                })
              }
            })
          }
        } else if (this.subInfo.claimType === '3') {
          this.peopleTable = []
          this.peopleList = []
          if (nameLists.length !== 0) {
            nameLists.forEach((n, i) => {
              // 插入认领人
              let paran = {
                nameString: n.invoiceAppUserName + ' ' + n.invoiceAppUser,
                userName: n.invoiceAppUserName,
                userCode: n.invoiceAppUser
              }
              this.peopleList.push(paran)
              if (n.invoiceInformatList.length !== 0) {
                n.invoiceInformatList.forEach((a, b) => {
                  a.name = n.invoiceAppUserName
                  a.isSelect = n.isSelect
                  a.length = n.invoiceInformatList.length
                  for (const k in a) {
                    if (a[k] === '') {
                      a[k] = '--'
                    }
                  }
                  this.peopleTable.push(a)
                })
              }
            })
          }
          if (this.peopleTable.length !== 0) {
            this.peopleTable.forEach(n => {
              // 循环是否可以合并
              if (n.name !== prevName) {
                n.nameType = true
              } else {
                n.nameType = false
              }
              prevName = n.name
            })
            this.peopleTable.forEach(n => {
              if (n.isSelect === '1' && n.nameType) {
                this.$nextTick(() => {
                  this.$refs.zdTable.toggleRowSelection(n, true)
                })
              }
            })
          }
        }
      })
    },
    // 确认认领信息
    submitRlInfo () {
      debugger
        let nameString = ''
      if (!this.outState) {
        let moneyTotal = 0
        let listData = JSON.parse(JSON.stringify(this.dataList))
        if (listData.length !== 0) {
          listData.forEach(n => {
            moneyTotal = 0
            if (n.projectInformatList.length !== 0) {
              n.projectInformatList.forEach(a => {
                moneyTotal += Number(a.confirmIncomeAmount)
              })
            }
            n.amountTotal = moneyTotal
            n.projectInformatList = JSON.stringify(n.projectInformatList)
          })
        }
        this.subInfo.claimInformationList = listData
        console.log("第三方三",this.subInfo.payeeAmountMoney)
        if(this.dataList&&this.dataList.length>0){
           this.dataList[0].projectInformatList.forEach(v=>{
          console.log("是多少仨",v.confirmIncomeAmount)
          if(v.confirmIncomeAmount>v.noRelationAmount || this.subInfo.payeeAmountMoney>this.dataList[0].projectInformatList.amountTotal ){
            this.$message.warning('金额不能超过未关联的金额')
          }else{
             this.sureBtn()
          }
        })
        
        }else{
         
           this.sureBtn()
        }
       
        
        
      }
    },
    // 弹框确认
    sureBtn () {
      debugger
      let ids = this.ids
      let subInfo = this.subInfo
      this.subLoading = true
      // this.subInfo.invoiceAppUserList =JSON.stringify(this.subInfo.invoiceAppUserList);
      axios.post(option.base_path + 'db/entry/saveAccount', subInfo).then(res => {
        this.subLoading = false
        if(res.data.flag ==0){
          this.$message.success('成功')
            this.dialogInfo = ''
            this.backBtn()
            this.dialogState = false
        }else{
             this.$message.error('失败')
        }
        // if (!ids) {
          
        // } else {
        //   this.$message.success('修改成功')
        // }
      
      })
    },
    // 提交
    submit() {
      debugger
      let nameString = ''
      let type = this.subInfo.claimType
      let checkType = this.checkType
      // subInfo.confirmIncomeAmount
      this.$refs.subInfo.validate(n => {
        if (n) {
          if (type === '2') {
             if(this.subInfo.confirmIncomeAmount==this.subInfo.payeeAmountMoney){
                this.sureBtn()    
          }else{
               this.$message.warning('字段“收款金额”和“确认收入”填写的金额必须相等')
          }
            // 财务认领
          } else {
            if (checkType) {
              this.subInfo.invoiceAppUserList.forEach(n => {
                if (nameString === '') {
                  nameString += n.invoiceAppUserName
                } else {
                  nameString += ',' + n.invoiceAppUserName
                }
              })
              // 非财务认领
              this.dialogInfo = '发送邮件通知认领人：' + nameString
              this.dialogState = true
            } else {
              this.$alert('请勾选认领人', '标题名称', {
                confirmButtonText: '确定',
                callback: action => {
                }
              })
            }
          }
        }
      })
    },
    canelBtn () {
      this.dialogInfo = ''
      this.dialogState = false
    },
    // 添加认领人
    addTabList () {
      let params = {
        nameString: '',
        userName: '',
        userCode: ''
      }
      this.peopleList.push(params)
    },
    // 删除认领人
    deletePeo (i) {
      let invoiceAppUserList = []
      this.peopleList.splice(i, 1)
      this.peopleList.forEach(n => {
        invoiceAppUserList.push(n.userCode)
      })
      this.getAppointUser(invoiceAppUserList)
    },
    // 选人
    handleSelect (item, i) {
      let invoiceAppUserList = []
      this.peopleList[i].nameString = item.userName + ' ' + item.userPhone
      this.peopleList[i].userName = item.userName
      this.peopleList[i].userCode = item.userItcode
      this.peopleList.forEach(n => {
        invoiceAppUserList.push(n.userCode)
      })
      this.getAppointUser(invoiceAppUserList)
    },
    // 单选框
    redioChange (item) {
      let ids = this.ids
      debugger
      if (!ids) {
        if (item === '1' || item === '3') {
          this.subName = '确认并发送邮件通知认领人'
        } else {
          this.subName = '确定'
          this.subInfo.claimDate = this.getThisDate()
        }
      } else {
        // 修改时
      }
    },
    // 获取认领日期
    getThisDate () {
      let newDate = new Date()
      let newYear = newDate.getFullYear()
      let newMonth = (newDate.getMonth() + 1) < 10 ? '0' + (newDate.getMonth() + 1) : (newDate.getMonth() + 1)
      let newDay = newDate.getDate() < 10 ? '0' + newDate.getDate() : newDate.getDate()
      let newDateTime = newYear + '-' + newMonth + '-' + newDay
      return newDateTime
    },
    // 返回
    backBtn () {
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
    },
  },
  components: {
    topTip,
    selectMan,
    journalList,
    finmoneyinput
  }
}
</script>

<style>
.list-add {
    cursor: pointer;
    background: url(../../assets/images/common/form-icons.png) no-repeat -11px -47px;
    width: 24px;
    height: 25px;
    display: inline-block;
    position: absolute;
    top: -15px;
}
.income-received-add .el-table .hide-selection .el-checkbox__input {
      display: none
}
.income-received-add td.check-box-add .el-checkbox {
  margin-left: 9px;
}
.lab-name {
   text-align: justify;
    color: #417095;
    font-weight:700;
}
.money-input .el-input__inner, .look-fils .el-input__inner {
  text-align: right;
}
.el-table__footer-wrapper tbody td, .el-table__header-wrapper tbody td {
  background-color: #ffffff;
}
</style>

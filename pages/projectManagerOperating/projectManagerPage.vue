<template>
  <div class="project-manager-page">
    <el-row>
      <!-- 左侧 -->
      <el-col :span="13" class="page-left">
        <!-- 项目详情 -->
        <div class="content-mod projectDetail">
          <el-row class="border-bottom">
            <el-col :span="12">
              <img src="../../assets/images/project-manager/项目详情.png" alt="" class="top-img">
              <span class="img-text">项目详情</span>
            </el-col>
            <el-col :span="12" style="text-align:right;" class="top-right">
              <el-button v-if="pidVisible" @click="pidOpenBounced('2')" type="text">保存</el-button>
              <el-button v-else @click="pidOpenBounced('1')" type="text">编辑</el-button>
              <!-- 弹出控件 -->
              <el-popover
                v-model="epVisible"
                placement="bottom-end"
                width="500"
                trigger="click">
                <el-row class="border-bottom">
                  <el-col :span="24">
                    <span class="img-text">我负责的项目</span>
                  </el-col>
                </el-row>
                <div style="padding:10px;">
                  <el-table
                  :data="userProjectList"
                  highlight-current-row
                  @current-change="switchProject">
                    <el-table-column width="130" prop="projectId" label="项目编号" align="center"></el-table-column>
                    <el-table-column min-width="100" prop="projectName" label="项目名称/简称" show-overflow-tooltip></el-table-column>
                  </el-table>
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="projectListParam.pageIndex"
                    :page-size="projectListParam.pageNum"
                    :pager-count="pagerCount"
                    layout="total, prev, pager, next, jumper"
                    :total="projectListTotal">
                  </el-pagination>
                </div>
                <div style="text-align:center;">
                  <el-button type="" @click="epVisible = false">取消</el-button>
                </div>
                <el-button slot="reference" type="text" @click="getProjectList">切换项目</el-button>
              </el-popover>
            </el-col>
          </el-row>
          <el-form ref="projectDetail" :model="pageInfo" :rules="rules" :label-position="labelPosition">
            <div style="line-height: 40px;padding:10px 10px 10px 25px;">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="项目名称：" label-width="82px">
                    <span>{{pageInfo.projectName}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12" v-if="!pidVisible">
                  <el-form-item label="项目简称：" label-width="82px">
                    <span>{{pageInfo.projectForshot}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-else>
                  <el-form-item label="项目简称：" label-width="82px" prop="projectForshot" :key="projectId">
                    <el-input v-model="pageInfo.projectForshot" placeholder="请输入项目简称，限制在10个字以内"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="项目编号：" label-width="70px">
                    <span>{{pageInfo.projectId}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item v-if="!pidVisible" label="结项时间：" label-width="82px">
                    <span>{{pageInfo.finishTime}}</span>
                  </el-form-item>
                  <span v-else>
                    <el-form-item label="结项时间：" label-width="82px">
                      <el-date-picker
                        v-model="pageInfo.finishTime"
                        type="date"
                        placeholder="选择日期"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions1">
                      </el-date-picker>
                    </el-form-item>
                  </span>
                </el-col>
                <el-col :span="12">
                  <el-form-item v-if="!pidVisible" label="费用支出预算：" label-width="100px">
                    <span>{{pageInfo.budgetMoney | finMoneyformata(2)}}</span><span>元</span>
                  </el-form-item>
                  <span v-else>
                    <el-form-item label="费用支出预算：" label-width="100px">
                      <fin-money-input :value.sync="pageInfo.budgetMoney" :tail="budgetMoneyTail"></fin-money-input>
                    </el-form-item>
                  </span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12" style="padding-left:12px;">
                  <el-checkbox v-model="pageInfo.isExpenditure" :disabled="!pidVisible">禁止支出/借款中选择此项目</el-checkbox>
                </el-col>
                <el-col :span="12">
                  <el-checkbox v-model="pageInfo.isWorkeHours" :disabled="!pidVisible">禁止工时填报中选择此项目</el-checkbox>
                </el-col>
              </el-row>
            </div>
          </el-form>
        </div>
        <div class="content-mod">
          <el-row style="text-align:center;" class="img-list">
            <el-col :span="4">
              <div class="to-detail" @click="toDetail('合同申请')">
                <div>
                  <img src="../../assets/images/project-manager/合同申请 拷贝.png" class="img-item" alt="">
                  <!-- <i class="el-icon-s-order img-item" style="color:#358eda;font-size: 3.5em;"></i> -->
                </div>
                <span>新增合同</span>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="to-detail" @click="toDetail('收入确认')">
                <div>
                  <img src="../../assets/images/project-manager/收入确认.png" class="img-item" alt="">
                </div>
                <span>收入确认</span>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="to-detail" @click="toDetail('发票申请')">
                <div>
                  <img src="../../assets/images/project-manager/发票申请.png" class="img-item" alt="">
                </div>
                <span>发票申请</span>
              </div>
            </el-col>
            <el-col :span="4">
              <div>
                <div>
                  <img src="../../assets/images/project-manager/u36.png" class="img-item" alt="">
                </div>
                <span>项目结项</span>
              </div>
            </el-col>
            <el-col :span="4">
              <div style="cursor: pointer;" @click='achieClick'>
                <div>
                  <img src="../../assets/images/project-manager/u36.png" class="img-item" alt="">
                </div>
                <span>绩效分配</span>
              </div>
            </el-col>
            <el-col :span="4">
              <div>
                <div>
                  <img src="../../assets/images/project-manager/u36.png" class="img-item" alt="">
                </div>
                <span>发票查询</span>
              </div>
            </el-col>
          </el-row>
        </div>
        <!-- 合同履行 -->
        <div class="content-mod">
          <el-row class="border-bottom">
            <el-col :span="12">
              <img src="../../assets/images/project-manager/合同执行.png" alt="" class="top-img">
              <span class="img-text">合同履行</span>
            </el-col>
            <el-col :span="12" style="text-align:right;" class="top-right" v-if="isContractPerformanceList">
              <el-button type="text" v-if="!contractManagerDialogVisible" @click="contractManagerDialogOpen">编辑</el-button>
              <el-button type="text" v-if="contractManagerDialogVisible" @click="contractSave">保存</el-button>
              <!-- <el-button type="text" @click="toDetail('合同履行')">详细信息&gt;&gt;</el-button> -->
            </el-col>
          </el-row>
          <div style="height:205px;overflow: auto;">
            <div v-if="!isContractPerformanceList" style="text-align:center;font-size:14px;padding-top:90px;color:#909399;">
              暂无合同信息
            </div>
            <div v-else v-for="(item) in pageInfo.contractPerformanceList" :key="item.contractId">
              <el-row style="line-height: 50px;">
                <el-col :span="24" style="text-align:left;padding-left: 35px;">
                  <span style="float:left;">合同编号/名称：</span>
                   <el-button type="text" @click="toDetail('合同履行')">{{item.contractNum}}</el-button><span>/{{item.contractName}}</span>
                  <span>
                    <!-- <el-tooltip class="item" :disabled="item.contractName === ''" effect="dark" :content="item.contractName" placement="top">
                      <div class="wxz_overflow">{{item.contractName}}</div>
                    </el-tooltip> -->
                  </span>
                </el-col>
                <!-- <el-col :span="9" style="float:right;text-align:right;padding-right: 10px;">
                  <span>合同编号:</span>
                  <span>{{item.contractNum}}</span>
                </el-col> -->
              </el-row>
              <el-table
                :data="item.paymentList"
                style="width: 100%">
                <el-table-column type="index" label="" width="70" align="center"></el-table-column>
                <el-table-column prop="termsOfPayment"  label="付款条件说明" min-width="130" show-overflow-tooltip align="left" header-align="left">
                  <template slot-scope="scope">
                    <span>{{scope.row.termsOfPayment}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="paymentTime" label="预计付款日期" min-width="170" align="center">
                  <template slot-scope="scope">
                    <span v-if="!contractManagerDialogVisible">{{scope.row.paymentTime}}</span>
                    <el-date-picker
                      v-else
                      v-model="scope.row.paymentTime"
                      type="date"
                      placeholder="选择日期">
                    </el-date-picker>
                  </template>
                </el-table-column>
                <el-table-column prop="paymentAmount" label="预计付款金额" min-width="140" align="right"  header-align="right" :key="item.projectLogId">
                  <template slot-scope="scope">
                    <span v-if="!contractManagerDialogVisible" style="padding-right:25px;">{{scope.row.paymentAmount | finMoneyformata('2')}}</span>
                    <fin-money-input v-else :value.sync="scope.row.paymentAmount" :tail="tableTail"></fin-money-input>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <!-- 项目日志 -->
        <div class="content-mod">
          <el-row class="border-bottom">
            <el-col :span="24">
              <img src="../../assets/images/project-manager/项目日志.png" alt="" class="top-img">
              <span class="img-text">项目日志</span>
            </el-col>
          </el-row>
          <el-table
            :show-header="isShowHeader"
            :data="projectInfoList"
            height="190"
            style="width: 100%;">
            <el-table-column
              prop="projectLog"
              label=""
              min-width="180" show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="projectLogTime"
              label=""
              align="right"
              width="150px">
            </el-table-column>
          </el-table>
          <div style="text-align:center;">
            <el-button type="text" @click="getProjectManagerPlatformLogList" v-html="loadMore"></el-button>
          </div>
        </div>
      </el-col>
      <!-- 右侧 -->
      <el-col :span="11" class="page-right">
        <!-- 项目成员 -->
        <div class="content-mod">
          <el-row class="border-bottom">
            <el-col :span="12">
              <img src="../../assets/images/project-manager/项目成员.png" alt="" class="top-img">
              <span class="img-text">项目成员</span>
            </el-col>
            <el-col :span="12" style="text-align:right;" class="top-right">
              <el-button type="text" @click="toDetail('项目成员')">成员管理&gt;&gt;</el-button>
            </el-col>
          </el-row>
          <el-row style="text-align:center; line-height:40px; padding: 20px 10px 20px 30px;">
            <el-col :span="8">
              <div>
                <el-switch v-model="pageInfo.memberOnOff" @change="updateProjectOnOff"></el-switch>
              </div>
              <span>项目成员竞聘开关</span>
            </el-col>
            <el-col :span="8">
              <div class="emphasis-text">{{pageInfo.projectTeamNum}}</div>
              <span>项目成员</span>
            </el-col>
            <el-col :span="8">
              <div class="emphasis-text">{{pageInfo.newProjectTeamNum}}</div>
              <span>新的成员申请加入</span>
            </el-col>
          </el-row>
        </div>
        <!-- 项目工时 -->
        <div class="content-mod">
          <el-row class="border-bottom">
            <el-col :span="12">
              <img src="../../assets/images/project-manager/成本及工时.png" alt="" class="top-img">
              <span class="img-text">项目工时</span>
            </el-col>
            <el-col :span="12" style="text-align:right;" class="top-right">
              <el-button type="text" @click="toDetail('项目成本及工时')">工时确认&gt;&gt;</el-button>
            </el-col>
          </el-row>
          <el-row style="padding: 20px 0"  class="content-txt">
            <el-col :span="12">
              <el-col :span="8" style="text-align:right;">
                <img src="../../assets/images/project-manager/已确认工作量.png" alt="" style="width:40px;height:40px;">
              </el-col>
              <el-col :span="16">
                <div>{{pageInfo.confirmedWorkload}}</div>
                <div>已确认工作量（人天）</div>
              </el-col>
            </el-col>
            <el-col :span="12">
              <el-col :span="8" style="text-align:right;">
                <img src="../../assets/images/project-manager/已确认工作量.png" alt="" style="width:40px;height:40px;">
              </el-col>
              <el-col :span="16">
                <div>{{pageInfo.unconfirmedHours}}</div>
                <div>待确认工时</div>
              </el-col>
            </el-col>
          </el-row>
        </div>
        <!-- 收入确认情况 -->
        <div class="content-mod">
          <el-row class="border-bottom">
            <el-col :span="12">
              <img src="../../assets/images/project-manager/收入确认.png" alt="" class="top-img">
              <span class="img-text">收入确认情况</span>
            </el-col>
            <!-- <el-col :span="12" style="text-align:right;" class="top-right">
              <el-button type="text" @click="toDetail('收入确认情况')">详细信息&gt;&gt;</el-button>
            </el-col> -->
          </el-row>
          <el-row style="" class="border-b-r">
            <el-col :span="12" class="content-txt">
              <span>项目总金额：</span>
              <span>{{pageInfo.projectTotalAmount | finMoneyformata('2')}}</span>
            </el-col>
            <el-col :span="12" class="content-txt">
              <span>已确认收入金额：</span>
              <span>{{pageInfo.confirmedIncomeAmount | finMoneyformata('2')}}</span>
            </el-col>
            <el-col :span="12" class="content-txt">
              <span>未回款金额：</span>
              <span>{{pageInfo.outstandingAmount | finMoneyformata('2')}}</span>
            </el-col>
            <el-col :span="12" class="content-txt">
              <span>未核销发票金额：</span>
              <span>{{pageInfo.toBeConfirmedAmount | finMoneyformata('2')}}</span>
            </el-col>
          </el-row>
        </div>
        <!-- 绩效分配情况 -->
        <div class="content-mod">
          <el-row class="border-bottom">
            <el-col :span="12">
              <img src="../../assets/images/project-manager/绩效.png" alt="" class="top-img">
              <span class="img-text">绩效分配情况</span>
            </el-col>
            <el-col :span="12" style="text-align:right;" class="top-right">
              <el-button type="text" @click="toDetail('绩效分配情况')">详细信息&gt;&gt;</el-button>
            </el-col>
          </el-row>
          <el-row style="" class="border-b-r">
            <el-col :span="12" class="content-txt">
              <span>已确认收入金额：</span>
              <span>{{pageInfo.receivedAmount | finMoneyformata('2')}}</span>
            </el-col>
            <el-col :span="12" class="content-txt">
              <span>可分配总金额：</span>
              <span>{{pageInfo.distributableAmount | finMoneyformata('2')}}</span>
            </el-col>
            <el-col :span="12" class="content-txt">
              <span>已分配总金额：</span>
              <span>{{pageInfo.allocatedAmount | finMoneyformata('2')}}</span>
            </el-col>
            <el-col :span="12" class="content-txt">
              <span>待分配总金额：</span>
              <span>{{pageInfo.toBeAllocatedAmount | finMoneyformata('2')}}</span>
            </el-col>
          </el-row>
        </div>
        <!-- 项目支出 -->
        <div class="content-mod" style="padding-bottom: 30px;">
          <el-row class="border-bottom">
            <el-col :span="12">
              <img src="../../assets/images/project-manager/项目支出.png" alt="" class="top-img">
              <span class="img-text">项目支出</span>
            </el-col>
            <el-col :span="12" style="text-align:right;" class="top-right">
              <el-button type="text" @click="toDetail('项目支出')">详细信息&gt;&gt;</el-button>
            </el-col>
          </el-row>
          <el-row style="" class="border-b-r">
            <el-col :span="12" class="content-txt">
              <span>费用支出预算：</span>
              <span>{{pageInfo.budgetMoney | finMoneyformata('2')}}</span>
            </el-col>
            <el-col :span="12" class="content-txt">
              <span>支出金额：</span>
              <span>{{pageInfo.expenditureAmount | finMoneyformata('2')}}</span>
            </el-col>
            <el-col :span="12" class="content-txt">
              <span>待执行金额：</span>
              <span>{{pageInfo.toBeExecutedAmount | finMoneyformata('2')}}</span>
            </el-col>
            <el-col :span="12" class="content-txt">
              <span>可申请金额：</span>
              <span>{{pageInfo.applicableAmount | finMoneyformata('2')}}</span>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <!-- 完善项目信息弹窗 -->
    <div v-if="dialogFormVisible">
      <project-info-dialog
        :pageInfo="pageInfo"
        :title="pidTitle"
        :pidIsCenter="pidIsCenter"
        :dialogFormVisible="dialogFormVisible"
        @balanceClose="pidBalanceClose"
        @balanceClose1="pidBalanceClose1"
      ></project-info-dialog>
    </div>
  </div>
</template>

<script>
import axios from '../../service/http'
import { option } from '../../static/config'
import projectInfoDialog from './project-info-dialog.vue'
import {finMoneyformat, dateFormat} from '../../assets/js/util/expensesUtils.js'
import finMoneyInput from '../../components/fin-money-input-copy.vue'
export default {
  // 数据源
  data () {
    return {
      loadMore: '加载更多<i class="el-icon-refresh"></i>',
      pickerOptions1: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
      tableTail: '￥',
      projectDetail: {},
      rules: {
        projectForshot: {required: true, validator: this.overMinus, trigger: 'blur'}
      }, // 项目详情表单
      projectId: '', // 当前项目id
      formLabelWidth: '90px',
      labelPosition: 'right',
      pageInfo: {},
      isContractPerformanceList: false,
      projectInfoList: [], // 项目日志列表
      platformLogParam: {
        projectId: this.projectId, // 项目编号 * 首次进入可传空，切换项目时必传
        pageIndex: 1, // 页数
        pageNum: 0 // 显示条数
      },
      projectListTotal: 0,
      // 切换项目 弹出框
      userProjectList: [], // 当前登陆人项目信息列表
      projectListParam: {
        pageIndex: 1, // 页数
        pageNum: 4 // 显示条数
      },
      budgetMoneyTail: '元',
      pagerCount: 5,
      pageSize: 5,
      total: 0,
      pidVisible: false, // 项目信息 修改控制
      checked1: '',
      checked2: '',
      currentPage: 1,
      epVisible: false,
      isShowHeader: false, // 是否显示表头
      activeName: '1',
      value3: true,
      dialogFormVisible: false, // 完善项目信息 弹框是否显示
      pidTitle: '请完善项目信息', // 完善项目信息 弹框标题
      pidIsCenter: false, // 完善项目信息 弹框标题是否居中
      contractManagerDialogVisible: false, // 合同管理 弹框是否显示
      cmdIsCenter: false, // 合同管理 弹框是否剧中
      cmdTitle: '合同管理', // 合同管理 弹框是否显示
    }
  },
  // 初始化执行
  mounted () {
    // 获取项目经理操作平台统计数据
    this.getProjectManagerPlatform()
    // 获取项目日志信息
    // this.getProjectManagerPlatformLogList()
    // 初始化项目信息 弹框
    // this.pidOpenBounced()
  },
  // 方法声明
  methods: {
    // 点击绩效分配跳转分配详情页面
    achieClick(){
      this.$router.replace('/meritsPractice/performanceDistribution')
      this.$router.replace({
        path: '/meritsPractice/performanceDistribution',
        query: {
          projectId: this.projectId
        }
      });
    },
    // Promise
    methodPromise: function (url, param) {
      return new Promise((resolve, reject) => {
        axios.post(option.base_path + url, param).then(res => {
          resolve(res)
        }).catch(err => {
          this.$message.error(err)
        })
      })
    },
    // 获取项目经理操作平台统计数据
    getProjectManagerPlatform () {
      let param = {
        projectId: this.projectId // 项目编号  *首次进入可传空，切换项目时必传
      }
      this.methodPromise('project/platform/getProjectManagerPlatform', param).then(res => {
        if(res.data.flag === 0) {
          let data = res.data.data
          if (data) {
            data.isExpenditure = data.isExpenditure === '1' ? true : false // (1是 2否)
            data.isWorkeHours = data.isWorkeHours === '1' ? true : false // (1是 2否)
            data.memberOnOff = data.memberOnOff === '1' ? true : false // (1开 2关)
            data.budgetMoney = Number(data.budgetMoney)
            this.isContractPerformanceList = data.contractPerformanceList.length > 0
            this.projectId = data.projectId
            this.pageInfo = data
            // 判断是否显示 完善项目信息弹窗
            if (!this.pageInfo.projectForshot || this.pageInfo.projectForshot === '') {
              if (!this.pageInfo.finishTime || this.pageInfo.finishTime === '') {
                this.pageInfo.finishTime = dateFormat(new Date())
              }
              // 初始化项目信息 弹框
              this.$nextTick(() => {
                this.pidOpenBounced()
              })
            }
            // 首次进入项目结项时间为空
            if (!this.projectId) {
              this.pageInfo.finishTime = ''
            }
            // 获取日志信息
            this.platformLogParam.pageNum = 0
            this.getProjectManagerPlatformLogList()
            this.updateBrowseTimeById()
          } else {
            this.$alert('您没有可管理的项目！', {
              confirmButtonText: '确定',
              showClose: false,
              center: true
            }).then(() => {
              // this.$router.go(-1)
              window.close()
            })
          }
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 去详情页
    toDetail (toPage) {
      let routeData = {}
      if (toPage === '项目成员') {
        // 重置新成员申请
        this.updateProjectBrowseState()
        let params = {projectId: this.projectId, menuShow:false}
        // routeData = this.$router.resolve({
        //   path: '/projectManager/projectManagerAdd',
        //   query: params
        // })
        // window.open(routeData.href, '_blank');
        this.$router.push({
          path: '/projectManager/projectManagerAdd',
          query: params
        })
      } else if (toPage === '合同履行') {
        let params = {lookType:1,pkId:this.pageInfo.contractPerformanceList[0].contractId,showBack:true}
        // routeData = this.$router.resolve({
        //   path: '/contract/contractList',
        //   query: params
        // })
        // window.open(routeData.href, '_blank');
        this.$router.push({
          path: '/contract/contractApply',
          query: params
        })
      } else if (toPage === '项目成本及工时') {
        let params = {projectId: this.projectId, menuShow:false}
        // routeData = this.$router.resolve({
        //   path: '/newWorkHours/confirmationByManager',
        //   query: params
        // })
        // window.open(routeData.href, '_blank');
        this.$router.push({
          path: '/newWorkHours/confirmationByManager',
          query: params
        })
      } else if (toPage === '收入确认') {
        this.$router.push({
          path: '/incomeReceived/incomeReceivedList',
          query: {
            // entrustingParty:this.pageInfo.customerName,
            // list:[{
            //   projectNum:this.pageInfo.projectId,
            //   projectName:this.pageInfo.projectName,
            //   projectPersonName:this.pageInfo.projectPersonName,
            //   projectAmount:this.pageInfo.budgetMoney
            // }]
          }
        })
      } else if (toPage === '发票申请') {

        let contractNum=this.pageInfo.contractPerformanceList[0].contractNum
        let contractName=this.pageInfo.contractPerformanceList[0].contractName
        let contractNameNum=this.pageInfo.contractPerformanceList[0].contractName + '/' + this.pageInfo.contractPerformanceList[0].contractNum
        this.$router.push({
          path: '/invoice/invoiceAdd',
          query: {
          contractNameNum: contractNameNum,
          contractId:this.pageInfo.contractPerformanceList[0].contractId,
          lookType: 2,
          goType: 1
          }
        })
      } else if (toPage === '绩效分配情况') {
        // let params = {lookType:1,pkId:this.pageInfo.contractPerformanceList[0].contractId,showBack:true}
        let params = {projectId: this.projectId}
        this.$router.push({
          path: '/meritsPractice/achievementsList',
          query: params
        })

      }else if (toPage === '项目支出') {
        // let params = {lookType:1,pkId:this.pageInfo.contractPerformanceList[0].contractId,showBack:true}
        let params = {projectId: this.projectId}
        this.$router.push({
          path: '/projectManager/expendProject',
          query: params
        })

      } else if (toPage === '合同申请') {
        let params = {}
        // routeData = this.$router.resolve({
        //   path: '/contract/contractApply',
        //   query: params
        // })
        // window.open(routeData.href, '_blank');
        this.$router.push({
          path: '/contract/contractApply',
          query: {
            entrustingParty:this.pageInfo.customerName,
            list:[{
              projectNum:this.pageInfo.projectId,
              projectName:this.pageInfo.projectName,
              projectPersonName:this.pageInfo.projectPersonName,
              projectAmount:this.pageInfo.budgetMoney
            }]
          }
        })
      }
    },
    // 重置新成员申请
    updateProjectBrowseState () {
      let param = {
        projectId: this.projectId
      }
      this.methodPromise('project/platform/updateProjectBrowseState', param).then(res => {
        if(res.data.flag === 0) {
        } else {
        }
      })
    },
    // 更新项目访问信息
    updateBrowseTimeById () {
      let param = {
        projectId: this.projectId
      }
      this.methodPromise('project/platform/updateBrowseTimeById', param).then(res => {
        if(res.data.flag === 0) {
        } else {
        }
      })
    },
    // 获取项目日志信息
    getProjectManagerPlatformLogList () {
      this.platformLogParam.projectId = this.projectId
      this.platformLogParam.pageIndex = 1
      this.platformLogParam.pageNum += 4
      this.methodPromise('project/platform/getProjectManagerPlatformLogList', this.platformLogParam).then(res => {
        if(res.data.flag === 0) {
          let data = res.data.data.rows
          this.projectInfoList = data
          if (this.projectInfoList && res.data.data.total > this.projectInfoList.length) {
            this.loadMore = '加载更多<i class="el-icon-refresh"></i>'
          } else {
            this.loadMore = '没有更多数据了'
          }
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 获取当前登录人项目信息
    getProjectList () {
      this.methodPromise('project/platform/getProjectList', this.projectListParam).then(res => {
        if(res.data.flag === 0) {
          let data = res.data.data.rows
          this.projectListTotal = res.data.data.total
          this.userProjectList = data
        } else {
          this.$message.error(res.data.data.message)
        }
      })
    },
    // 根据项目编号修改项目信息
    updateProjectById () {
      this.$refs['projectDetail'].validate((valid) => {
        if (valid) {
          let param = {
            projectId: this.pageInfo.projectId, //	项目编号	必传
            projectForshot: this.pageInfo.projectForshot, //	项目简称
            finishTime: this.pageInfo.finishTime ? dateFormat(this.pageInfo.finishTime) : '', //	结项时间
            budgetMoney: this.pageInfo.budgetMoney, //	费用支出金额
            isExpenditure: this.pageInfo.isExpenditure ? '1' : '2', //	是否禁止支出/借款中选择此项目	（1是 2否）
            isWorkeHours: this.pageInfo.isWorkeHours ? '1' : '2' //	是否禁止工时填报中选择此项目	（1是 2否）
          }
          this.methodPromise('project/platform/updateProjectById', param).then(res => {
            if(res.data.flag === 0) {
              // 获取项目经理操作平台统计数据
              this.getProjectManagerPlatform()
              this.pidVisible = false
              this.$message.success(res.data.message)
            } else {
              this.$message.error(res.data.message)
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    // 根据合同付款ID修改合同付款信息
    updateProjectPaymentById () {
      let paramList = []
      if (this.pageInfo.contractPerformanceList && this.pageInfo.contractPerformanceList.length > 0) {
        this.pageInfo.contractPerformanceList.forEach(v => {
          v.paymentList.forEach(item => {
            let param = {
              contractId: v.contractId,
              paymentId: item.contractPaymentId, // 合同支付ID
              paymentDate: item.paymentTime, // 预计付款日期
              paymentAmount: item.paymentAmount // 预计付款金额
            }
            paramList.push(param)
          })
        })
      }
      this.methodPromise('project/platform/updateProjectPaymentById', {
        projectId: this.projectId,
        paymentListStr: JSON.stringify(paramList)
      }).then(res => {
        if(res.data.flag === 0) {
          this.$message.success(res.data.message)
          this.cmdBalanceClose()
          // 获取项目经理操作平台统计数据
          this.getProjectManagerPlatform()
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 修改项目成员竞聘信息
    updateProjectOnOff () {
      let param = {
        pkId: this.projectId, // 项目编号
        memberOnOff: this.pageInfo.memberOnOff ? '1' : '2' // 项目成员竞聘开关	成员竞聘开关1:开2：关
      }
      this.methodPromise('project/platform/updateProjectOnOff', param).then(res => {
        if(res.data.flag === 0) {
          this.$message.success(res.data.message)
        } else {
          this.$message.error(res.data.message)
        }
        // 获取项目经理操作平台统计数据
        this.getProjectManagerPlatform()
      })
    },
    // 合同履行 保存按钮
    contractSave () {
      // 根据合同付款ID修改合同付款信息
      this.updateProjectPaymentById()
    },
    // 完善项目信息 打开
    pidOpenBounced (isDetail) {
      if (isDetail === '1') { // 编辑
        this.pidVisible = true
      } else if (isDetail === '2') { // 保存
        this.updateProjectById()
      } else {
        this.pageInfo.finishTime = ''
        this.pidTitle = '请完善项目信息'
        this.pidIsCenter = true
        this.dialogFormVisible = true
      }
    },
    // 完善项目信息 关闭
    pidBalanceClose () {
      // 获取项目经理操作平台统计数据
      this.getProjectManagerPlatform()
      this.dialogFormVisible = false
      // 跳转到上一个页面
      // this.$router.go(-1)
    },
    // 取消按钮
    pidBalanceClose1 () {
      this.dialogFormVisible = false
      // 跳转到上一个页面
      // this.$router.go(-1)
    },
    // 合同管理弹框 打开
    contractManagerDialogOpen () {
      this.contractManagerDialogVisible = true
    },
    // 合同管理弹框 关闭
    cmdBalanceClose () {
      this.contractManagerDialogVisible = false
    },
    // 切换项目模块 分页
    handleSizeChange(val) {
      this.projectListParam.pageNum = val
      this.getProjectList()
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.projectListParam.pageIndex = val
      this.getProjectList()
      console.log(`当前页: ${val}`);
    },
    switchProject(val) {
      if (val && val.projectId !== '') {
        this.epVisible = false
        this.projectId = val.projectId
        // 切换项目
        this.getProjectManagerPlatform()
      }
    },
    overMinus (rule, value, callback) {
      if (!value || value === '') {
        callback(new Error('请输入项目简称'))
      } else if (value.length > 10) {
        callback(new Error('请限制在10字以内'))
      } else {
        callback()
      }
    }
  },
  watch: {},
  filters: {
    finMoneyformata (val, i) {
      let money = finMoneyformat(val, i)
      return money !== '0.00' ? money : '0.00'
    }
  },
  // 组件注册
  components: {
    projectInfoDialog,
    finMoneyInput,
    finMoneyformat
  }
}
</script>

<style>
.project-manager-page .el-table th{
  background-color: rgba(0, 0, 0, 0);
}
.project-manager-page .el-table tr th>.cell{
  color: #333333;
  font-size: 16px;
  font-weight: 400;
}
.project-manager-page .el-checkbox__input.is-disabled+span.el-checkbox__label{
  color: #000;
}
.project-manager-page .projectDetail .el-form-item{
  padding-bottom: 0;
}
.el-table th>.cell {
  text-align: inherit;
}
</style>
<style scoped>
.projectDetail .el-form-item{
  margin-bottom: 0;
}
.wxz_overflow {
  /*固定套路4条*/
  /*display: inline-block;*/
  float: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  /*根据实际项目，设置合适的宽度*/
  width: 70%;
}
.el-input{
  width: 90%;
}
.project-manager-page{
  /* padding: 5px; */
}
.page-left{
  padding-right: 5px;
}
.page-right{
  /* padding-right: 5px; */

}
.page-left div.content-mod,.page-right div.content-mod{
  padding: 5px;
  margin-bottom: 5px;
  background-color:#fff;
}
.project-manager-page div.content-txt{
  padding-left:35px;
}
.border-bottom{
  padding: 5px;
  border-bottom: 1px solid #f3f3f3;
}
.top-img{
  height: 28px;
  width: 28px;
}
.img-text{
  /* font-family: "Arial Normal","Arial"; */
  position: relative;
  bottom: 7px;
  font-size: 16px;
  font-weight: 400;
  color: #333333;
}
.top-right{
  line-height: 28px;
}
.img-list .el-col{
  padding: 10px;
}
.img-item{
  height: 48px;
  width: 48px;
  margin-bottom: 5px;
}
.border-b-r{
  text-align: left;
  line-height: 50px;
  margin: 10px;
}
.border-b-r .el-col:nth-child(1),
.border-b-r .el-col:nth-child(3){
  border-right: 1px dashed #f3f3f3;
  border-bottom: 1px dashed #f3f3f3;
}
.border-b-r .el-col:nth-child(2),
.border-b-r .el-col:nth-child(4){
  border-bottom: 1px dashed #f3f3f3;
}
.emphasis-text{
  font-size: 28px;
  color: red;
}
.to-detail {
  cursor: pointer;
}

</style>

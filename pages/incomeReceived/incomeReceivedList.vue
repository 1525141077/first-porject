<template>
  <div class="yt-dome-container">
    <!-- :style="publicHeight" -->
    <el-container>
      <!-- 页面头部 -->
      <el-header class="yt-header">
        <el-form
          ref="form"
          label-width="120px"
          size="small"
        >
          <el-row>
            <el-col :span="10" style="margin-left: -60px;">
              <el-form-item label="关键字：">
                <el-input
                  v-model="params.selectParam"
                  class
                  placeholder="请输入到账单编号/汇款方名称/账号/收款方名称/账号"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7" style="padding-left:20px;">
              <el-form-item label="到账日期：">
                  <el-date-picker
                    v-model="params.allDatas"
                    @change="dateChange"
                    format="yyyy - MM - dd"
                    value-format="yyyy-MM-dd"
                    type="daterange"
                    range-separator="————"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6" style="text-align: right;margin-left: 90px;">
              <el-button type="primary" @click="getProjectBiddingList()">查询</el-button>
              <el-button type="info" @click="resetForm('params')">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
        <!-- 按钮START -->
        <div style="margin: 10px 0px;" v-if="isGl">
          <el-button class="yt-bottom-btn" style="margin-right: 0px;" type="primary" @click="addAcount">新增到账</el-button>
          <el-button class="yt-bottom-btn" style="margin-right: 0px;" type="primary" @click="repairAcount">修改</el-button>
        </div>
        <!-- 按钮END -->
      </el-header>
      <div
        style="height: 5px;background-color: #f3f3f3;border-top: 1px solid #dfe6f3;border-bottom: 1px solid #dfe6f3;"
      ></div>
      <!-- 页面主体 -->
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="待认领" name="first">
          <el-table :data="tableData"
       border 
       highlight-current-row
       @row-click="rowClick"
       style="width: 100%">
        <el-table-column prop="entryAccountNum" label="到账单编号" align="center" width="140px">
        </el-table-column>
        <el-table-column prop="entryAccountDate" label="到账日期" width="140px"  ref="cesName" align="center">
        </el-table-column>
        <el-table-column
          prop="remitterName"
          label="汇款方名称"
          header-align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="remitterAccount" label="汇款方账号">
        </el-table-column>
        <el-table-column
          prop="payeeName"
          label="收款方名称"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="payeeAccount" label="收款方账号">
        </el-table-column>
        <el-table-column prop="payeeAmountMoney" label="收款金额(元)" align="right" width="120px">
          <template scope="scope">
            <span>{{scope.row.payeeAmountMoney |moneFlter}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="activeName === 'first'" prop="noClaimMoney" align="right" label="未认领金额" width="120px">
          <template scope="scope">
            <span>{{scope.row.noClaimMoney |moneFlter}}</span>
          </template>
        </el-table-column>
        <el-table-column prop label="操作" align="center" :width="activeName === 'first' ? '140px' : '90px'">
          <template scope="scope">
            <!-- 竞聘 -->
            <div v-if="scope.row.type==1" class="table-btn" style="display:inline-block;"> 
              <el-button
                type="text"
                size="small"
                @click="toPage('/incomeReceived/incomeReceivedClaimPage',scope.row)"
              >认领</el-button>
              <span class="center-line">|</span>
            </div>
              <el-button
                type="text"
                size="small"
                @click="toPage('/incomeReceived/incomeReceivedDetails',scope.row)"
              >查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        :current-page="params.pageNum"
        :page-sizes="[15, 30, 50, 100, 200, 500]"
        :page-size="params.pageSize"
        layout="total, prev, pager, next, sizes"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
        </el-tab-pane>
        <el-tab-pane label="已完成" name="second">
      <el-table :data="tableData"
       border 
       highlight-current-row
       @row-click="rowClick"
       style="width: 100%">
        <el-table-column  prop="entryAccountNum" label="到账单编号" align="center" width="140px">
        </el-table-column>
        <el-table-column prop="entryAccountDate" label="到账日期" width="140px"  ref="cesName" align="center">
        </el-table-column>
        <el-table-column
          prop="remitterName"
          label="汇款方名称"
          header-align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="remitterAccount" label="汇款方账号">
        </el-table-column>
        <el-table-column
          prop="payeeName"
          label="收款方名称"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="payeeAccount" label="收款方账号">
        </el-table-column>
        <el-table-column prop="payeeAmountMoney" label="收款金额(元)" align="right" width="120px">
          <template scope="scope">
            <span>{{scope.row.payeeAmountMoney |moneFlter}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="activeName === 'first'" prop="noClaimMoney" align="right" label="未认领金额" width="120px">
          <template scope="scope">
            <span>{{scope.row.noClaimMoney |moneFlter}}</span>
          </template>
        </el-table-column>
        <el-table-column prop label="操作" align="center" :width="activeName === 'first' ? '140px' : '90px'">
          <template scope="scope">
            <!-- 竞聘 -->
            <div v-if="activeName === 'first'" class="table-btn" style="display:inline-block;"> 
              <el-button
                type="text"
                size="small"
                @click="toPage('/incomeReceived/incomeReceivedClaimPage',scope.row)"
              >认领</el-button>
              <span class="center-line">|</span>
            </div>
              <el-button
                type="text"
                size="small"
                @click="toPage('/incomeReceived/incomeReceivedDetails',scope.row)"
              >查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        :current-page="params.pageNum"
        :page-sizes="[15, 30, 50, 100, 200, 500]"
        :page-size="params.pageSize"
        layout="total, prev, pager, next, sizes"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
        </el-tab-pane>
      </el-tabs>
      
    </el-container>
  </div>
</template>

<script>
import axios from '../../service/http';
import { option } from '../../static/config';
export default {
  // 数据源
  data() {
    return {
      isGl:false,
      rowData: {},
      total: 0,
      activeName: 'first',
      // fince: false, //核算账套信息  权限控制
      params: {
        allDatas:'',
        entryAccountDateStart: '',
        entryAccountDateEnd:'',
        selectParam: '',
        isComplete: 'NO',
        pageNum: 1,
        pageSize: 15,
        yitianSSODynamicKey:'',
        systemCode:'',
        dynamicKey:''
      },
      tableData: [{
        pkId: '',
        entryAccountNum: '',
        remitterName: '',
        remitterAccount: '',
        payeeName: '',
        payeeAccount: '',
        payeeAmountMoney: '',
        entryAccountDate: '',
        noClaimMoney: ''
      }],
      dateList: []
    }
  },
  // 初始化执行
  mounted() {
    this.getUserInfo();
    // this.accessControlFun();
  },
  // 方法声明
  methods: {
    //调用权限控制接口
    // accessControlFun() {
    //   axios
    //     .post(option.base_path + "index/getFuncListByMenuId", {
    //       dynamicKey: "",
    //       systemId: 69
    //     })
    //     .then(data => {
    //       data.data.data.forEach(v => {
    //         if (v.funcCode == "fince") {
    //           this.fince = true;
    //         } else{

    //         }
    //       });
    //     });
    // },
    // 点击当前行
    rowClick (item) {
      this.rowData = item
    },
    // 切换tab页
    handleClick (tab, event) {
      if (tab.name === 'first') {
        this.params.isComplete = 'NO'
        // this.params.selectParam=""
      } else {
        this.params.isComplete = 'YES'
        // this.params.selectParam=""
        
      }
      this.getProjectBiddingList()
    },
    // 日期改变
    dateChange (item) {
      this.params.entryAccountDateStart = item[0]
      this.params.entryAccountDateEnd = item[1]
    },
    addAcount () {
      this.$router.replace({
        path: '/incomeReceived/incomeReceivedAdd',
        query: {}
      });
    },
    repairAcount () {
      if (this.rowData.pkId) {
        this.$router.replace({
          path: '/incomeReceived/incomeReceivedAdd',
          query: {
            pkId: this.rowData.pkId
          }
        })
      } else {
        this.$message.warning('请先点击列表数据')
      }
    },
    // 获取当前登录人信息
    getUserInfo () {
      axios.post(option.base_path + 'index/getCurrentUserInfo', {
        page: 1
      }).then(res => {
        this.getProjectBiddingList();
        this.userInfo = res.data.data;
        // 初次进入
        if (res.data.data.rodNames.indexOf(',财务对账管理,') !== -1) {
          this.isGl = true
        }
      })
    },
    toPage(path,row,type) {
      this.$router.replace({
        path: path,
        query: {
          pkId: row.pkId
        }
      });
    },
    resetForm(params) {
      this.activeName = 'first'
      this.dateList = []
      this.params.selectParam = ''
      this.params.entryAccountDateStart = ''
      this.params.entryAccountDateEnd = ''
      this.params.allDatas=''
      this.params.isComplete = 'NO'
      //刷新
      this.getProjectBiddingList();
    },
    getProjectBiddingList() {
      var me = this;
      //调用axios.post方法
      //"CASPARAMS":"OFF_INDEX"
      axios
        .post(option.base_path + "db/entry/getAccountList", this.params)
        .then(data => {
          // this.peopleList.push(man)
          this.tableData = data.data.data.rows;
          
          if (this.tableData.length !== 0) {
            this.tableData.forEach(n => {
              for(let k in n) {
                if (n[k] === '') {
                  n[k] = '--'
                }
              }
            })
          }
          this.total = data.data.data.total;
          console.log("返回值", data.data.data.rows);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // 金额格式化
    moneysFlter (money) {
      money = money + ''
      let newMoneys
      let numList
      // 判断是否输入的数字
      let testMoney = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g
      // 详情
        if (money) {
          if (testMoney.test(money)) {
            money = Number(money)
            money = (money.toFixed(2) + '').replace(
            /\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,
            '$&,'
            )
            if (money.indexOf('.') !== -1) {
              // 有小数
              numList = money.split('.')
              numList[1] = numList[1].replace(',', '')
              newMoneys = numList[0] + '.' + numList[1]
            } else {
              newMoneys = money
            }
            return newMoneys
          }
        } else {
          return ''
        }
    },
    //手动切换每页条数
    handleSizeChange(val) {
      this.params.pageSize = val;
      console.log(`每页 ${val} 条`);
      //刷新
      this.getProjectBiddingList();
    },
    //手动切换页数
    handleCurrentChange(val) {
      this.params.pageNum = val;
      console.log(`当前页: ${val}`);
      //刷新
      this.getProjectBiddingList();
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
  // 组件注册
  components: {}
}
</script>

<style>
</style>

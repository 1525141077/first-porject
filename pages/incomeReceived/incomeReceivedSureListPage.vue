<template>
  <div class="yt-dome-container">
    <!-- :style="publicHeight" -->
    <el-container>
      <!-- 页面头部 -->
      <el-header class="yt-header">
          <el-row>
            <el-col :span="10">
              <label class="lab-name">项目名称/编号：</label>
              <span></span>
            </el-col>
          </el-row>
      </el-header>
      <div
        style="height: 5px;background-color: #f3f3f3;border-top: 1px solid #dfe6f3;border-bottom: 1px solid #dfe6f3;"
      ></div>
      <!-- 页面主体 -->
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="pkId" label="到账单编号" align="center" width="120px">
        </el-table-column>
        <el-table-column prop="projectName" label="收入确认日期" width="140px"  ref="cesName" align="center">
        </el-table-column>
        <el-table-column
          prop="customerName"
          label="收入确认金额"
          header-align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="businessType" label="认领人" align="center" width="150px">
        </el-table-column>
        <el-table-column
          prop="projectBudget"
          label="收款方名称"
          align="right"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="closingDate" label="到账单编号" align="center" width="150px">
        </el-table-column>
      </el-table>
      <!-- <el-pagination
        background
        :current-page="currentPage"
        :page-sizes="[15, 30, 50, 100, 200, 500]"
        :page-size="15"
        layout="total, prev, pager, next, sizes"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination> -->
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
      total: 0,
      tableData: [{
        pkId: '',
        projectName: '',
        customerName: '',
        businessType: '',
        projectBudget: '',
        closingDate: '',
        money: '',
        projectPersonName: ''
      }],
      currentPage: 1,
    }
  },
  // 初始化执行
  mounted() {
    this.getUserInfo()
  },
  // 方法声明
  methods: {
    // 获取当前登录人信息
    getUserInfo () {
      axios.post(option.base_path + 'index/getCurrentUserInfo', {
        page: 1
      }).then(res => {
        this.getProjectBiddingList();
        this.userInfo = res.data.data;
        // 初次进入
        if (res.data.data.rodNames.indexOf(',竞聘管理员,') === -1) {
          this.isGl = true
        }
      })
    },
    getProjectBiddingList() {
      var me = this;
      //调用axios.post方法
      //"CASPARAMS":"OFF_INDEX"
      axios
        .post(option.base_path + "db/bidding/getProjectBiddingList", this.form)
        .then(data => {
          // this.peopleList.push(man)
          this.tableData = data.data.data.rows;
          if (this.tableData.length !== 0) {
            this.tableData.forEach(n => {
              n.projectBudget = this.moneysFlter(n.projectBudget + '')
              if (n.state === '10' || n.state === '40') {
                n.projectPersonName = ''
              }
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
      this.form.pageSize = val;
      console.log(`每页 ${val} 条`);
      //刷新
      this.getProjectBiddingList();
    },
    //手动切换页数
    handleCurrentChange(val) {
      this.form.pageNum = val;
      console.log(`当前页: ${val}`);
      //刷新
      this.getProjectBiddingList();
    }
  },
  filters: {
  },
  // 组件注册
  components: {}
}
</script>

<style>
.lab-name {
   text-align: justify;
    color: #417095;
    font-weight:700;
}
</style>

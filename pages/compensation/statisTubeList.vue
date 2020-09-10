<template>
  <div class="yt-dome-container">
    <el-header class="yt-header">
      <el-form ref="form" :model="form" label-width="110px" :label-position="labelposition" size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="所 属 期 间：">
              <el-date-picker v-model="form.month" @change="monthChange" format="yyyy-MM" value-format="yyyy-MM" type="month" placeholder="选择月" size='small'>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <!-- <div style="text-align: end;"> -->
            <el-button type="primary" @click="getData">查询</el-button>
            <el-button type="info" @click="resetForm('form')">重置</el-button>
            <!-- </div> -->
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <div
      style="height: 5px;background-color: #f3f3f3;border-top: 1px solid #dfe6f3;border-bottom: 1px solid #dfe6f3;margin-bottom: 20px;">
    </div>
    <!-- tab切换的表格START -->
    <el-tabs v-model="activeName" type="card"  @tab-click="handleClick">
      <el-tab-pane label="社保" name="first">
      </el-tab-pane>
      <!-- 社保的表格END -->
      <!-- 公积金START -->
      <el-tab-pane label="公积金"  v-model="form.queryStateParams"  name="second">
      </el-tab-pane>
      <!-- 公积金END -->
      <!-- 实发工资STARAT -->
      <el-tab-pane label="实发工资"  v-model="form.queryStateParams" name="third">
      </el-tab-pane>
      <!-- 实发工资END -->
      <!-- 个所税START -->
      <el-tab-pane label="个所税" name="fourth">
      </el-tab-pane>
      <!-- 个所税END -->
    </el-tabs>
    <!-- tab切换的表格END -->
    <el-table
      :data="pendingTableData"
      border
      style="width: 100%;">
      <el-table-column
        v-for="(item, index) in companyList"
        :key="item.affiliatedComp"
        :prop="item.affiliatedComp"
        :label="item.affiliatedCompName"
        :align="index == 0 ? 'center' : 'right'"
        >
        <template slot-scope="scope">
          <a v-if="index == 0 &&scope.row.month==''" class="click-link" @click="toDetail(scope.row)">{{scope.row[item.affiliatedComp] }}</a>
          <span v-else-if="index == 0&&!scope.row.month" >{{scope.row[item.affiliatedComp] }}</span>
          <span v-else>{{scope.row[item.affiliatedComp] | moneyFormat}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import axios from '../../service/http';
  import {option} from '../../static/config.js'
export default {
  // 数据源
  data () {
    return {
      tabRequers: {
        first: 'fundPayMonth/getFundPaySocial', //社保，
        second: 'fundPayMonth/getFundPayStatistics', //公积金
        third: 'wages/afterTax/getAfterTaxStatistics', //实发工资
        fourth: 'wages/afterTax/getIndicidualIncomeTaxStatistics' //各所税
      },// 接口对象，保存每个标签对应tab要请求的接口
      form: {
        month: ''
      },
      companyList: [],
      value2:'',
      pendingTableData: [],
      total: 0,
      currentPage: 1,
      labelposition: "right",
      imgsrc: '',
      tableData: [],
      dialogLogsVisibleTwo: false, //已处理弹出框
      activeName: 'first'
    }
  },
  // 初始化执行
  mounted () {
    let time = new Date();
    this.form.month = time.getFullYear()+'-'+(time.getMonth()>9?time.getMonth():'0'+time.getMonth());
    this.getCompany()
    this.getFundPaySocial(this.tabRequers[this.activeName]);
  },
  // 方法声明
  methods: {
    // 查询按钮
    getData () {
      this.getFundPaySocial(this.tabRequers[this.activeName]);
    },
    // 重置
    resetForm () {
      this.form.month = ''
    },
    // 公积金实际缴纳公司
    getCompany () {
      axios
        .post(option.base_path + "fundPayMonth/getFundPayStatisticsComp", {})
        .then((res) => {
          let data = res.data;
          if(data.flag==0){
            if(data.data.length>0){
              this.companyList.push({
                affiliatedComp: "sjjn",
                affiliatedCompName: "实际缴纳公司",
                forShort: "实际",
              })
              data.data.forEach(n => {
                this.companyList.push(n)
              })
              this.companyList.push({
                affiliatedComp: "hj",
                affiliatedCompName: "合计",
                forShort: "合计",
              })
            }
          }
          console.log("返回值", res.data.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    // 查询数据
    getFundPaySocial (url) {
      axios
        .post(option.base_path + url, {
          month: ''
        })
        .then((res) => {
          let pendingTableData = []
          let data = res.data;
          if(data.flag == 0) {
            let payMoneyAmount = 0;
					  //合计金额
            if(data.data.drawMoneyList.length>0){
              let topRow = {
                affiliatedComp: "hjje",
                affiliatedCompName: "合计金额",
                sjjn: "合计金额"
              }
              data.data.drawMoneyList.forEach(n => {
                payMoneyAmount += parseFloat(n.payMoney);
                topRow[n.payComp] = n.payMoney
              })
              topRow['hj'] = payMoneyAmount
              pendingTableData.push(topRow)
            }
            //所属公司
					if(data.data.compePayMoneyInfoList.length>0){
            // 缴纳金额行
						let compTr = '';
						// 公司缴纳金额行
						let realCompTr = '';
						// 个人缴纳金额行
						let realPersonTr = '';
						var companyArray=data.data.compePayMoneyInfoList;
						// 行总金额
						let payMoneyAmount = 0;
						let compPayMoneyAmount = 0;
            let personalPayMoneyAmount = 0;
            companyArray.forEach(n => {
              // 动态文字数据及金额对象
              let newRow = {
                sjjn: n.affiliatedCompName,
                comCode: n.affiliatedComp,
                month: n.month
              }
              // 公司费用对象
              let compRow = {
                sjjn: '其中实际公司负担费用'
              }
              //个人负担费用对象
              let personRow = {
                sjjn: '其中实际个人负担费用'
              }
              // 缴纳详细金额 循环添加金额列数据
							if(n.payMoneyInfoList.length>0){
                n.payMoneyInfoList.forEach(pay => {
                  newRow[pay.payComp] = pay.payMoney
                  payMoneyAmount += parseFloat(pay.payMoney);
                  // 只有社保和公积金需要添加额外行
                  if (this.activeName == 'first' || this.activeName == 'second') {
                    compPayMoneyAmount += parseFloat(pay.compPayMoney);
                    personalPayMoneyAmount += parseFloat(pay.personalPayMoney);
                    compRow[pay.payComp] = pay.compPayMoney
                    personRow[pay.payComp] = pay.personalPayMoney
                  }
                })
              }
              // 最后添加合计列数据
              newRow['hj'] = payMoneyAmount
              compRow['hj'] = compPayMoneyAmount
              personRow['hj'] = personalPayMoneyAmount
              //添加行数据
              pendingTableData.push(newRow)
              // 只有社保和公积金需要添加额外行
              if (this.activeName == 'first' || this.activeName == 'second') {
                pendingTableData.push(compRow)
                pendingTableData.push(personRow)
              }
              //重置合计
              payMoneyAmount = 0;
							compPayMoneyAmount = 0;
							personalPayMoneyAmount = 0;
            })
          }
          }
          this.pendingTableData = pendingTableData
          console.log("返回值", this.pendingTableData);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    // getMessage(){

    // },
    handleClick(id) {
      this.getFundPaySocial(this.tabRequers[this.activeName]);
    },
    // handleSizeChange(val) {
    // this.form.pageNum = val;
    // console.log(`每页 ${val} 条`);
    // this.getMessage();
    // },
    // handleCurrentChange(val) {
    //   this.form.pageIndex = val;
    //   console.log(`当前页: ${val}`);
    //   this.getMessage();
    // },
    monthChange (val) {
      //this.form.month = val
    },
    toDetail (row) {
      console.log(row)
      var month=row.month;
      var comCode=row.comCode;
      if (this.activeName == 'first') {
        // 社保和公积金详情
        this.$router.replace({
          path: '/compensation/statisticalDetails',
          query: {
            month: this.form.month,
          }
        });
      } else if(this.activeName == 'second'){
        // 实发工资和个所税详情
        this.$router.replace({
          path: '/compensation/statisticalAccumulDetails',
          query: {
            month: this.form.month,
          }
        });
      }else if(this.activeName == 'third'){
        // 实发工资和个所税详情
        this.$router.replace({
          path: '/compensation/statisticalWagesDetails',
          query: {
            month: this.form.month,
          }
        });
      }else{
        this.$router.replace({
          path: '/compensation/statisticalTaxDetails',
          query: {
            month: this.form.month,
          }
        });
      }
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
    }
  },
  // 组件注册
  components: {
  }
}
</script>
<style scoped>
.click-link {
  color: #417095;
  cursor: pointer;
  text-decoration: none;
}
</style>

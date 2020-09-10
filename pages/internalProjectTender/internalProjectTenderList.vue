<template>
  <div class="yt-dome-container">
    <!-- :style="publicHeight" -->
    <el-container>
      <!-- 页面头部 -->
      <el-header class="yt-header">
        <el-form
          ref="form"
          :model="form"
          label-width="120px"
          :label-position="labelposition"
          size="small"
        >
          <el-row>
            <el-col :span="10">
              <el-form-item label="请输入关键字：">
                <el-input
                  v-model="form.selectParam"
                  class
                  placeholder="项目编号/项目名称/客户名称/中标人"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" style="padding-left:20px;">
              <el-form-item label="竞聘状态(经理)：">
                <el-select v-model="form.state" placeholder="请选择" clearable>
                  <el-option label="全部" value=""></el-option>
                  <el-option label="竞聘中" value="10"></el-option>
                  <el-option label="竞聘截止" value="40"></el-option>
                  <el-option label="已完成" value="50"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" style="text-align: right;">
              <el-button type="primary" @click="getProjectBiddingList()">查询</el-button>
              <el-button type="info" @click="resetForm('form')">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <div
        style="height: 5px;background-color: #f3f3f3;border-top: 1px solid #dfe6f3;border-bottom: 1px solid #dfe6f3;"
      ></div>
      <!-- 页面主体 -->
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="pkId" label="项目编号" align="center" width="120px"></el-table-column>
        <el-table-column prop="projectName" label="项目名称"  ref="cesName" header-align="center" align="left">
          <template scope="scope">
             <el-Tooltip :content="scope.row.projectName" placement="top">
              <span>{{scope.row.projectName | ellipsis(that)}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="customerName"
          label="客户名称"
          header-align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="businessType" label="业务类型" align="center" width="120px"></el-table-column>
        <el-table-column
          prop="projectBudget"
          label="项目预算（元）"
          align="right"
          header-align="center"
          width="120px"
        ></el-table-column>
        <el-table-column prop="closingDate" label="竞聘截止时间" align="center" width="150px"></el-table-column>
        <el-table-column prop="" label="竞聘状态(经理)" align="center" width="100px">
          <template scope="scope">
            <span v-if="scope.row.state == 10">竞聘中</span>
            <span v-else-if="scope.row.state == 40">竞聘截止</span>
            <span v-else-if="scope.row.state == 50">已完成</span>
          </template>
        </el-table-column>
        <el-table-column prop="projectPersonName" label="中选人(经理)" align="center" width="120px"></el-table-column>
        <el-table-column prop label="竞聘操作" align="center" width="150px">
          <template scope="scope">
            <!-- 竞聘 -->
            <div v-if="scope.row.state == 10" class="table-btn"> 
                <el-button
                v-if="scope.row.state == 10"
                type="text"
                size="small"
                @click="toPage('/internalProjectTender/internalProjectTenderAdd',scope.row,'1')"
              >经理</el-button>
              <span class="center-line">|</span>
              <el-button
                type="text"
                size="small"
                :disabled="scope.row.memberOnOff === '0' ? true : false"
                @click="toPage('/internalProjectTender/internalProjectTenderAdd',scope.row,'3')"
              >成员</el-button>
              <span class="center-line">|</span>
              <el-button
                type="text"
                size="small"
                @click="toPage('/internalProjectTender/internalProjectTenderDetails',scope.row,'2')"
              >查看</el-button>
            </div>
            <!-- 竞聘截止 -->
              <div v-if="scope.row.state == 40" class="table-btn">
                <el-button
              type="text"
              :disabled="isGl"
              size="small"
              @click="toPage('/internalProjectTender/internalProjectTenderAdd',scope.row,'2')"
            >经理结果录入</el-button>
            <span class="center-line">|</span>
              <el-button
                type="text"
                size="small"
                :disabled="scope.row.memberOnOff === '0' ? true : false"
                @click="toPage('/internalProjectTender/internalProjectTenderAdd',scope.row,'3')"
              >成员</el-button>
              </div>
             <!-- 已完成 -->
              <div v-if="scope.row.state == 50" class="table-btn">
                <el-button
                type="text"
                size="small"
                @click="toPage('/internalProjectTender/internalProjectTenderDetails',scope.row,'2')"
              >查看</el-button>
              <span class="center-line">|</span>
                <el-button
                type="text"
                size="small"
                :disabled="scope.row.memberOnOff === '2' ? true : false"
                @click="toPage('/internalProjectTender/internalProjectTenderAdd',scope.row,'3')"
              >成员</el-button>
              </div>
            
          </template>
        </el-table-column>
      </el-table>
      <!-- @size-change="handleSizeChange"
      @current-change="handleCurrentChange"-->
      <el-pagination
        background
        :current-page="currentPage"
        :page-sizes="[15, 30, 50, 100, 200, 500]"
        :page-size="15"
        layout="total, prev, pager, next, sizes"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
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
      that: this,
      form: {
        selectParam: "",
        state: "",
        pageSize: 15,
        pageNum: 1
      },
      total: 0,
      labelposition: "right",
      currentPage: 1,
      tableData: [],
      isGl: false
    };
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
    toPage(path,row,type) {
      this.$router.replace({
        path: path,
        query: {
          mainId: row.pkId,
          state: row.state,
          type: type
        }
      });
    },
    resetForm(form) {
      this.form = {
        selectParam: "",
        state: "",
        pageSize: 15,
        pageNum: 1
      };
      //刷新
      this.getProjectBiddingList();
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
    ellipsis (value, that) {
      
      // 列总长度像素
        let domNameLength = (Number(that.$refs.cesName.$parent.bodyWidth.substring(0,that.$refs.cesName.$parent.bodyWidth.indexOf('px'))) - 800) / 2
        console.log('长度', domNameLength)
        // 能接受的总长度
        let fontLength = Number((domNameLength /14).toFixed())
        //文字总长度的一半
        let len = fontLength / 2 - 1
        let n = value.length - len
        if (!value) return ''
        if (value.length > fontLength) {
          // 超出多少文字
          // let outWord = Number(value.length - fontLength).toFixed()
          // that.disabled = true
          return value.substring(0, len-1) + '...' +value.substring(n+1,value.length)
        }
        return value
      }
  },
  // 组件注册
  components: {}
}
</script>

<style>
.el-form-item--small .el-form-item__content, .el-form-item--small .el-form-item__label {
  line-height: 40px !important;
}
.center-line {
  color: #417095;
}
.table-btn button {
  margin: 0px;
  padding: 0px;
}
.center-line {
  color: #417095;
}
</style>

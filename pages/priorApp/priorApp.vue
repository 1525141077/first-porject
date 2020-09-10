<template>
  <div class="dome-container">
    <!-- 页面关键字搜索模块START -->
      <el-header class="yt-header">
        <el-form
          label-width="70px"
          size="small"
        >
          <el-row>
            <el-col :span="10">
              <el-form-item label="关  键  字：">
                <el-input class placeholder="请输入借款事由" v-model="form.queryParams" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3" style="text-align: right;">
              <el-button type="primary" @click="getMessage()">查询</el-button>
              <el-button type="info" @click="resetForm(form) ">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-header>
    <!-- 页面关键字搜索模块END -->
    <!-- 页面表格START -->
    <div class="tab-mod" style="padding: 0px 10px 20px 10px;">
      <el-tabs type="border-card" v-model="activeTab" @tab-click="handleClick">
        <!-- 待处理状态的表格START -->
        <el-tab-pane label="待处理"  v-model="form.queryStateParams"  name="first">
          <el-table
            :data="pendingTableData"
            border
            style="width: 100%;">
            <el-table-column
              prop="advanceAppNum"
              label="单据编号"
              width="150"
              align='center'
              >
              <template slot-scope='scope'>
                <span  style="color:#417095;cursor: pointer;" @click='toPage4("/approval/details",scope.row)' >{{scope.row.advanceAppNum}}</span>
              </template>
              <!-- <el-link type="primary" v-for ='item in data.pependingTableData.num' >{{item}}</el-link> -->
            </el-table-column>
            <el-table-column
              prop="advanceAppName"
              label="事前申请事由"
              width="">
            </el-table-column>
            <el-table-column
              prop="advanceAmount"
              label="事前申请总金额"
              width="200"
              align="right"
              >
              <template slot-scope='scope'>
                <span >{{scope.row.advanceAmount | moneyFormat }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="applicantUserName"
              label="申请人"
              width="80"
              align="center"
              >
            </el-table-column>
            <el-table-column
              prop="applicantDept"
              label="申请部门"
              width="100"
              align='center'
              >
            </el-table-column>
            <el-table-column
              prop="stagnationTime"
              label="停滞时间"
              width="100"
              align="center"
              >
            </el-table-column>
            <el-table-column
              prop="operat"
              label="操作"
              width="100"
              align="center"
              >
              <template slot-scope='sc'>
                <el-link type="primary" v-show="sc.row.taskKey!='activitiStartTask'" @click='toPage2("/approval/details",sc.row)' >审批</el-link>
                <el-link type="primary" v-show="sc.row.taskKey=='activitiStartTask'" @click='toPage3("/busiTripApply/serveApply",sc.row)' >处理</el-link>
                <el-link type="primary" :underline="false">|</el-link>
                <lookApproveLog :processInstanceId="sc.row.processInstanceId">日志</lookApproveLog>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            :current-page="currentPage"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[15, 30, 50, 100, 200, 500]"
            :page-size="15"
            layout="total, prev, pager, next"
            :total="total"
            >
          </el-pagination>
        <!-- 分页END -->
          <!-- 待处理状态的表格END -->
        </el-tab-pane>
        <!-- 已处理START -->
        <el-tab-pane label="已处理"  v-model="form.queryStateParams"  name="second">
          <el-table
            :data="pendingTableData"
            border
            style="width: 100%;">
            <el-table-column
              prop="advanceAppNum"
              label="单据编号"
              width="150"
              type='primary'
              align='center'
              >
              <template slot-scope='scope'>
                <span  style="color:#417095;cursor: pointer;" @click='toPage4("/approval/details",scope.row)' >{{scope.row.advanceAppNum}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="advanceAppName"
              label="事前申请事由"
              width="">
            </el-table-column>
            <el-table-column
              prop="advanceAmount"
              label="事前申请总金额"
              width="200"
              align='right'>
              <template slot-scope='scope'>
                <span >{{scope.row.advanceAmount | moneyFormat }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="applicantUserName"
              label="申请人"
              width="80"
              align='center'>
            </el-table-column>
            <el-table-column
              prop="applicantDept"
              label="申请部门"
              width="100"
              align='center'>
            </el-table-column>
            <el-table-column
              prop="nodeNowState"
              label="当前状态"
              width="120"
              align='center'>
                <template slot-scope="scope">
                   <span style="color:#417095;cursor: pointer;" @click="journalTwo(scope.row.nodeNowState)">{{scope.row.nodeNowState}}</span>
                </template>
            </el-table-column>
            <el-table-column
              prop="operat"
              label="操作"
              width="100"
              align='center'>
              <template slot-scope='scope'>
                <lookApproveLog :processInstanceId="scope.row.processInstanceId">日志</lookApproveLog>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页START -->
          <el-pagination
            :current-page="currentPage"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[15, 30, 50, 100, 200, 500]"
            :page-size="15"
            layout="total, prev, pager, next"
            :total="total"
            >
          </el-pagination>
        <!-- 分页END -->
        </el-tab-pane>
        <!-- 已处理END -->
        <!-- 已完结STARAT -->
        <el-tab-pane label="已完结"  v-model="form.queryStateParams" name="third">
          <el-table
            :data="pendingTableData"
            border
            style="width: 100%;">
            <el-table-column
              prop="advanceAppNum"
              label="单据编号"
              width="150"
              type='primary'
              align='center'
              >
              <template slot-scope='scope'>
                <span  style="color:#417095;cursor: pointer;" @click='toPage4("/approval/details",scope.row)' >{{scope.row.advanceAppNum}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="advanceAppName"
              label="事前申请事由"
              width="">
            </el-table-column>
            <el-table-column
              prop="advanceAmount"
              label="事前申请总金额"
              width="200"
              align='right'>
              <template slot-scope='scope'>
                <span >{{scope.row.advanceAmount | moneyFormat }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="applicantUserName"
              label="申请人"
              width="80"
              align='center'>
            </el-table-column>
            <el-table-column
              prop="applicantDept"
              label="申请部门"
              width="100"
              align='center'>
            </el-table-column>
            <el-table-column
              prop="applicantTime"
              label="申请日期"
              width="100"
              align='center'>
            </el-table-column>
            <el-table-column
              prop="operation"
              label="操作"
              width="100"
              align='center'>
              <template slot-scope='scope'>
                <lookApproveLog :processInstanceId="scope.row.processInstanceId">日志</lookApproveLog>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页START -->
          <el-pagination
          :current-page="currentPage"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[15, 30, 50, 100, 200, 500]"
            :page-size="15"
            layout="total, prev, pager, next"
            :total="total"
            >
          </el-pagination>
        <!-- 分页END -->
        </el-tab-pane>
        <!-- 已完结END -->
         <!-- 已处理部分弹出框 -->
        <el-dialog title="当前状态" style="width:1250px;" :visible.sync="dialogLogsVisibleTwo">
          <!-- <img :src="imgsrc" alt=""> -->
          <span>{{imgsrc}}</span>
          <div style="text-align:center;padding-top:20px">
        <el-button type="info" :visible.sync="dialogLogsVisibleTwo" @click="closeDialogTwo">关闭</el-button>
        </div>
      </el-dialog>
      </el-tabs>
    </div>
    <!-- 页面表格END -->
  </div>
</template>
<script>
import axios from '../../service/http';
import {option} from '../../static/config.js'
import lookApproveLog from '@/components/lookApproveLog'
export default {
  // 数据源
  data () {
    return {
      form:{
        queryStateParams: 'WF_SUSPENDING_QUERY_SQL_PARAMS',
        queryParams: '',
        pageIndex:1,
        pageNum:15,
      },
      activeTab: 'first',
      pendingTableData: [],
      total: 0,
      currentPage: 1,
      imgsrc: '',
      dialogLogsVisibleTwo: false, //已处理弹出框
    }
  },
  // 初始化执行
  mounted () {
    this.getMessage()
  },
  // 方法声明
  methods: {
    toPage2(path, row) {
      this.$router.replace({
        path: '/approval/details',
        query: {
          pkId: row.advanceAppId,
          approvalState: 1,
          costType: row.costType
        }
      });
    },
    toPage3(path, row) {
      this.$router.replace({
        path: '/busiTripApply/serveApply',
        query: {
          pkId: row.advanceAppId
        }
      });
    },
    toPage4(path, row) {
      this.$router.replace({
        path: '/approval/details',
        query: {
          pkId: row.advanceAppId,
          approvalState: 2,
          costType: row.costType
        }
      });
    },
    journalTwo(nodeNowState) {
      this.dialogLogsVisibleTwo = true;
      // this.journalInfo(row);
      this.imgsrc=nodeNowState
    },
    //关闭弹框的事件
    closeDialogTwo(row) {
      this.dialogLogsVisibleTwo = false;
    },
    handleClick(id) {
        if(id.index == 0){
            // 触发‘配置管理’事件
        	this.form.queryStateParams="WF_SUSPENDING_QUERY_SQL_PARAMS"
        }else if(id.index==1){
        	// 触发‘用户管理’事件
        	this.form.queryStateParams="WF_SOLVED_QUERY_SQL_PARAMS"
        }else if(id.index==2){
            this.form.queryStateParams="WF_COMPLETED_QUERY_SQL_PARAMS"
        }
        this.getMessage()
        console.log(this.form.queryStateParams)
      },
      handleSizeChange(val) {
      this.form.pageNum = val;
      console.log(`每页 ${val} 条`);
      this.getMessage();
    },
    handleCurrentChange(val) {
      this.form.pageIndex = val;
      console.log(`当前页: ${val}`);
      this.getMessage();
    },
    // 重置
    resetForm(form) {
      // this.data.activeTab = 'dai'
      this.activeTab='first',
      this.form = {
        queryStateParams: 'WF_SUSPENDING_QUERY_SQL_PARAMS',
        queryParams: '',
        pageIndex:1,
        pageNum:15,
      }

      this.getMessage();

    },
    getMessage(){
      axios.post(option.base_path+'sz/advanceApp/getUserAdvanceAppInfoWFListToPageByParams',this.form).then(res => {
        this.pendingTableData=res.data.data.rows
        this.total = res.data.data.total;
    }).catch((error) => {
      console.log('异常',error)
    })
    }
  },
  filters:{
    moneyFormat (num) {
      if (num) {
        num = Number(num)
        num = (num.toFixed(2) + '').replace(
          /\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,
          '$&,'
        )
      }
      return num || '0.00'
    }
  },
  // 组件注册
  components: {
    lookApproveLog,
  }
}
</script>
<style scoped>
.el-tabs__nav-scroll{
    border: 1px solid #DCDFE6;
    border-bottom: 0;
  }
  .el-tabs--border-card{
    border: 0;
    box-shadow: none;
  }
</style>


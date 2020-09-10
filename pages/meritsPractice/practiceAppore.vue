<template>
  <div class="dome-container">
    <!-- 页面关键字搜索模块START -->
    <el-header class="yt-header">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="10">
            <el-form-item label="关  键  字：">
              <el-input class placeholder="请输入申请编号/事由" v-model="form.queryParams" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3" style="text-align: right;">
            <el-button type="primary" @click="getMessage()">查询</el-button>
            <el-button type="info" @click="resetForm('form') ">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <!-- 页面关键字搜索模块END -->
    <!-- 页面表格START -->
    <div class="tab-mod" style=" -top: 20px;min-height: 100%;min-width: 100%;">
      <el-tabs type="border-card" v-model="activeTab" @tab-click="handleClick">
        <!-- 待处理状态的表格START -->
        <el-tab-pane label="待处理" v-model="form.queryStateParams" name="first">
          <el-table
            :data="processedTableData"
            border
            highlight-current-row
            @current-change="clickcheck"
            style="width: 100%;"
          >
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="practicePerformanceNum" label="单据编号" width="140" align="center">
              <template slot-scope="scope">
                <span
                  style="color:#417095;cursor: pointer;"
                  @click="toPage('/meritsPractice/practiceApporePage', 2, scope.row)"
                >{{scope.row.practicePerformanceNum}}</span>
              </template>
              <!-- <el-link type="primary">{{pendingTableData.num}}</el-link> -->
            </el-table-column>
            <el-table-column prop="projectId" label="项目名称/编号" align="left" width>
              <template slot-scope="scope">{{scope.row.projectId + scope.row.projectName}}</template>
            </el-table-column>
            <el-table-column prop="finishTime" label="预期结项时间" width="200"></el-table-column>
            <el-table-column prop="projectPersonName" label="项目负责人" width="100" align="center"></el-table-column>
            <el-table-column prop="budgetMoney" label="项目总金额" width="100" align="right">
              <template slot-scope="scope">
                <span>{{scope.row.budgetMoney | moneyFormat }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="revenueRecognizedAmount"
              label="已确认收入金额"
              width="140"
              align="right"
            >
              <template slot-scope="scope">
                <span>{{scope.row.revenueRecognizedAmount | moneyFormat }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="grantRatio" label="发放比例" width="100" align="right">
              <template slot-scope="scope">
                <span>{{scope.row.grantRatio + '%'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="grantAmount" label="发放总额度" width="100" align="right">
              <template slot-scope="scope">
                <span>{{scope.row.grantAmount | moneyFormat }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="paidAmount" label="已发金额" width="100" align="right">
              <template slot-scope="scope">
                <span>{{scope.row.paidAmount | moneyFormat }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="thisGrantTotalAmount" label="本次发放金额" width="100" align="right">
              <template slot-scope="scope">
                <span>{{scope.row.thisGrantTotalAmount | moneyFormat }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="operat" label="操作" width="100" align="center">
              <template slot-scope="sc">
                <el-link
                  type="primary"
                  v-show="sc.row.taskKey!='activitiStartTask'"
                  @click="toPage('/meritsPractice/practiceApporePage',1,sc.row)"
                >审批</el-link>
                <el-link
                  type="primary"
                  v-show="sc.row.taskKey=='activitiStartTask'"
                  @click="toPage('/meritsPractice/performanceDistribution','',sc.row)"
                >处理</el-link>
                <el-link type="primary" :underline="false">|</el-link>
                <lookApproveLog :processInstanceId="sc.row.processInstanceId">日志</lookApproveLog>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页START -->
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
          <!-- 分页END -->
          <!-- 待处理状态的表格END -->
        </el-tab-pane>
        <!-- 已处理START -->
        <el-tab-pane label="已处理" v-model="form.queryStateParams" name="second">
          <el-table
            :data="processedTableData"
            border
            highlight-current-row
            @current-change="clickcheck"
            style="width: 100%;"
          >
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="practicePerformanceNum" label="单据编号" width="140" align="center">
              <template slot-scope="scope">
                <span
                  style="color:#417095;cursor: pointer;"
                  @click="toPage('/meritsPractice/practiceApporePage', 2, scope.row)"
                >{{scope.row.practicePerformanceNum}}</span>
              </template>
              <!-- <el-link type="primary">{{pendingTableData.num}}</el-link> -->
            </el-table-column>
            <el-table-column prop="expenditureAppName" label="项目名称/编号" align="left" width>
              <template slot-scope="scope">{{scope.row.projectId + scope.row.projectName}}</template>
            </el-table-column>
            <el-table-column prop="finishTime" label="预期结项时间" width="200"></el-table-column>
            <el-table-column prop="projectPersonName" label="项目负责人" width="100" align="center"></el-table-column>
            <el-table-column prop="budgetMoney" label="项目总金额" width="100" align="right">
              <template slot-scope="scope">
                <span>{{scope.row.budgetMoney | moneyFormat }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="revenueRecognizedAmount"
              label="已确认收入金额"
              width="140"
              align="right"
            >
              <template slot-scope="scope">
                <span>{{scope.row.revenueRecognizedAmount | moneyFormat }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="grantRatio" label="发放比例" width="100" align="right">
              <template slot-scope="scope">
                <span>{{scope.row.grantRatio + '%'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="grantAmount" label="发放总额度" width="100" align="right">
              <template slot-scope="scope">
                <span>{{scope.row.grantAmount | moneyFormat }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="paidAmount" label="已发金额" width="100" align="right">
              <template slot-scope="scope">
                <span>{{scope.row.paidAmount | moneyFormat }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="thisGrantTotalAmount" label="本次发放金额" width="100" align="right">
              <template slot-scope="scope">
                <span>{{scope.row.thisGrantTotalAmount | moneyFormat }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="operat" label="操作" width="100" align="center">
              <template slot-scope="scope">
                <lookApproveLog :processInstanceId="scope.row.processInstanceId">日志</lookApproveLog>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页START -->
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[15, 30, 50, 100, 200, 500]"
            :page-size="15"
            layout="total, prev, pager, next, sizes"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          ></el-pagination>
          <!-- 分页END -->
        </el-tab-pane>
        <!-- 已处理END -->
        <!-- 已完结STARAT -->
        <el-tab-pane label="已完结" v-model="form.queryStateParams" name="thiird">
          <el-table
            :data="processedTableData"
            border
            highlight-current-row
            @current-change="clickcheck"
            style="width: 100%;"
          >
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="practicePerformanceNum" label="单据编号" width="140" align="center">
              <template slot-scope="scope">
                <span
                  style="color:#417095;cursor: pointer;"
                  @click="toPage('/meritsPractice/practiceApporePage', 2, scope.row)"
                >{{scope.row.practicePerformanceNum}}</span>
              </template>
              <!-- <el-link type="primary">{{pendingTableData.num}}</el-link> -->
            </el-table-column>
            <el-table-column prop="expenditureAppName" label="项目名称/编号" align="left" width>
              <template slot-scope="scope">{{scope.row.projectId + scope.row.projectName}}</template>
            </el-table-column>
            <el-table-column prop="finishTime" label="预期结项时间" width="200"></el-table-column>
            <el-table-column prop="projectPersonName" label="项目负责人" width="100" align="center"></el-table-column>
            <el-table-column prop="budgetMoney" label="项目总金额" width="100" align="right">
              <template slot-scope="scope">
                <span>{{scope.row.budgetMoney | moneyFormat }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="revenueRecognizedAmount"
              label="已确认收入金额"
              width="140"
              align="right"
            >
              <template slot-scope="scope">
                <span>{{scope.row.revenueRecognizedAmount | moneyFormat }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="grantRatio" label="发放比例" width="100" align="right">
              <template slot-scope="scope">
                <span>{{scope.row.grantRatio + '%'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="grantAmount" label="发放总额度" width="100" align="right">
              <template slot-scope="scope">
                <span>{{scope.row.grantAmount | moneyFormat }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="paidAmount" label="已发金额" width="100" align="right">
              <template slot-scope="scope">
                <span>{{scope.row.paidAmount | moneyFormat }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="thisGrantTotalAmount" label="本次发放金额" width="100" align="right">
              <template slot-scope="scope">
                <span>{{scope.row.thisGrantTotalAmount | moneyFormat }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="operat" label="操作" width="100" align="center">
              <template slot-scope="scope">
                <lookApproveLog :processInstanceId="scope.row.processInstanceId">日志</lookApproveLog>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页START -->
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
          <!-- 分页END -->
        </el-tab-pane>
        <!-- 已完结END -->
      </el-tabs>
    </div>
    <!-- 页面表格END -->
    <!-- 已处理部分弹出框 -->
    <el-dialog title="当前状态" :visible.sync="dialogLogsVisibleTwo">
      <div style="width: 100%;height: auto;overflow-x: auto;">
        <img :src="imgsrc" alt />
      </div>
      <!-- <img src="http://123.56.81.55:9200/ims-act/restful/workFlow/findPngByProcessInstanceId?processInstanceId=141098" alt=""> -->
      <!-- <span>{{imgsrc}}</span> -->
      <div style="text-align:center;padding-top:20px">
        <el-button type="info" :visible.sync="dialogLogsVisibleTwo" @click="closeDialogTwo">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "../../service/http";
import { option } from "../../static/config.js";
import lookApproveLog from "@/components/lookApproveLog";
export default {
  // 数据源
  data() {
    return {
      form: {
        queryStateParams: "WF_SUSPENDING_QUERY_SQL_PARAMS",
        queryParams: "",
        pageIndex: 1,
        pageNum: 15,
      },
      form2: {
        deptName: "",
      },
      input: "",
      imgsrc: "",
      activeTab: "first",
      processedTableData: [],
      total: 0,
      currentPage: 1,
      multipleSelection: [],
      expenditureAppId: "",
      currentRow: null, //选中一条数据
      dialogLogsVisibleTwo: false, //已处理弹出框
    };
  },
  // 初始化执行
  mounted() {
    this.getMessage();
  },
  // 方法声明
  methods: {
    journalTwo(row) {
      console.log(nodeNowState);
      this.dialogLogsVisibleTwo = true;
      let nodeNowState = row.nodeNowState;
      // this.imgsrc=nodeNowState
      // if (nodeNowState == "待【部门经理审批】审批") {
      //   this.imgsrc =
      //     option.workFlow + "restful/workFlow/findPngByProcessInstanceId?processInstanceId=" + row.processInstanceId;
      // } else if (nodeNowState == "待【项目经理审批】审批") {
      //   this.imgsrc = "待【项目经理审批】审批";
      // } else if (nodeNowState == "待【财务审批】审批") {
      //   this.imgsrc = "待【财务审批】审批";
      // } else if (nodeNowState == "待申请人再次提交") {
      //   this.imgsrc = "待申请人再次提交";
      // } else if (nodeNowState == "待【总经办审批】审批") {
      //   this.imgsrc = "待【总经办审批】审批";
      // } else if (nodeNowState == "总办人填写") {
      //   this.imgsrc =
      //     "http://123.56.81.55:9200/ims-act/restful/workFlow/findPngByProcessInstanceId?processInstanceId=141098";
      // }
      this.imgsrc =
        option.workFlow +
        "restful/workFlow/findPngByProcessInstanceId?processInstanceId=" +
        row.processInstanceId;
    },
    //关闭弹框的事件
    closeDialogTwo(row) {
      this.dialogLogsVisibleTwo = false;
    },
    handleClick(id) {
      if (id.index == 0) {
        // 触发‘待处理’事件
        this.form.queryStateParams = "WF_SUSPENDING_QUERY_SQL_PARAMS";
      } else if (id.index == 1) {
        // 触发‘已处理’事件
        this.form.queryStateParams = "WF_SOLVED_QUERY_SQL_PARAMS";
      } else if (id.index == 2) {
        // 触发‘已完结’事件
        this.form.queryStateParams = "WF_COMPLETED_QUERY_SQL_PARAMS";
      }
      this.getMessage();
      console.log(this.form.queryStateParams);
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
    //     print(){
    //       this.$router.push('./printDetails')
    // //       if(this.multipleSelection.length != 1){
    // //         this.$message('请选中一行数据进行操作');
    // //       }else{
    // //         this.toPage('./printDetails',this.multipleSelection[this.val])
    // //       }
    //     },
    resetForm(form) {
      (this.activeTab = "first"),
        (this.form = {
          queryStateParams: "WF_SUSPENDING_QUERY_SQL_PARAMS",
          queryParams: "",
          pageIndex: 1,
          pageNum: 15,
        });
      this.getMessage();
    },
    getMessage() {
      axios
        .post(
          option.base_path +
            "wages/performance/getPracticePerformanceWorkflowList",
          this.form
        )
        .then((res) => {
          // console.log(this.data.data.rows)
          console.log("rengong", res);
          this.processedTableData = res.data.data.rows;
          this.total = res.data.data.total;
        })
        .catch((error) => {
          console.log("异常", error);
        });
    },
    // 点击选中这一行
    clickcheck(val) {
      // this.expenditureAppId=val.expenditureAppId
      console.log(val);
      // this.multipleSelection = val;
      this.currentRow = val;
    },
    toPage(path, approvalState, row) {
      this.$router.replace({
        path: path,
        query: {
          practicePerformanceId: row.practicePerformanceId,
          approvalState: approvalState,
        },
      });
    },
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
    },
  },
  // 组件注册
  components: {
    lookApproveLog,
  },
};
</script>
<style scoped>
.el-tabs__nav-scroll {
  border: 1px solid #dcdfe6;
  border-bottom: 0;
}
.el-tabs--border-card {
  border: 0;
  box-shadow: none;
}
</style>

<template>
  <div class="dome-container">
    <el-form style="padding:15px 20px 0">
      <el-form-item label="关 键 字：">
        <el-row>
          <el-col :span="5">
            <el-input size="small" v-model="selectParam" placeholder="请输入申请编号、项目名称/编号"></el-input>
          </el-col>
          <el-col :span="3" style="margin-left:20px">
            <el-button type="primary" @click="getMarketPerformanceWorkflowList()">查询</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <div
      style="height: 5px;background-color: #f3f3f3;border-top: 1px solid #dfe6f3;border-bottom: 1px solid #dfe6f3;"
    ></div>
    <el-tabs type="border-card" @tab-click="handleClick" v-model="queryStateParams">
      <el-tab-pane label="待处理" name="WF_SUSPENDING_QUERY_SQL_PARAMS">
        <el-table ref="multipleTable" :data="wagesList" style="width: 100%" border>
          <el-table-column prop="marketPerformanceNum" label="申请编号" align="center">
            <template slot-scope="scope">
               <span  style="color:#417095;cursor: pointer;"  @click="addTextList(scope.row)">{{scope.row.marketPerformanceNum}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="projectTime" label="项目名称/编号" align="left">
            <template slot-scope="scope">
              <span>{{scope.row.projectName}}/{{scope.row.projectId}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="thisGrantTotalAmount" label="本次发放金额" align="right">
            <template scope="scope">
              <span>{{scope.row.thisGrantTotalAmount |moneFlter}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="applicantUserName" label="申请人" align="center"></el-table-column>
          <el-table-column prop="stagnationTime" label="停滞时间" align="center"></el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" v-show="scope.row.taskKey!='activitiStartTask'" @click="exitArr(scope.row)">审批</el-button>
               <el-button type="text" size="small" v-show="scope.row.taskKey=='activitiStartTask'" @click="exitList(scope.row)">处理</el-button>
                <el-link type="primary" :underline="false">|</el-link>
              <el-button type="text" size="small" @click="addText(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          :current-page="1"
          :page-sizes="[15, 30, 50, 100, 200, 500]"
          :page-size="15"
          layout="total, prev, pager, next, sizes"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </el-tab-pane>
      <el-tab-pane label="已处理" name="WF_SOLVED_QUERY_SQL_PARAMS">
        <el-table :data="wagesList" style="width: 100%;" border>
          <el-table-column prop="marketPerformanceNum" label="申请编号" align="center">
            <template slot-scope="scope">
               <span  style="color:#417095;cursor: pointer;"  @click="addTextList(scope.row)">{{scope.row.marketPerformanceNum}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="projectTime" label="项目名称/编号" align="left">
            <template slot-scope="scope">
              <span>{{scope.row.projectName}}/{{scope.row.projectId}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="thisGrantTotalAmount" label="本次发放金额" align="right">
            <template scope="scope">
              <span>{{scope.row.thisGrantTotalAmount |moneFlter}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="applicantUserName" label="申请人" align="center"></el-table-column>
          <el-table-column prop="nodeNowState" label="状态" align="center">
             <template slot-scope="scope">
                <a
                  style="color:#417095;cursor: pointer;"
                  @click="showEditDialog(scope.row)"
                
                >{{scope.row.nodeNowState}}</a>
                <!-- <span v-else>{{scope.row.nodeNowState}}</span> -->
              </template>
          </el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="addTextList(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
         <!-- 审批点击状态 -->
          <el-dialog
            title="当前状态"
            :visible.sync="dialogVisible"
            width="50%"
            :before-close="handleClose"
          >
            <div style="width: 100%;height: auto;overflow-x: auto;">
              <img :src="imgsrc" alt />
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
          </el-dialog>
        <el-pagination
          background
          :current-page="1"
          :page-sizes="[15, 30, 50, 100, 200, 500]"
          :page-size="15"
          layout="total, prev, pager, next, sizes"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </el-tab-pane>
      <el-tab-pane label="已完结" name="WF_COMPLETED_QUERY_SQL_PARAMS">
        <el-table :data="wagesList" style="width: 100%;" border>
          <el-table-column prop="marketPerformanceNum" label="申请编号" align="center">
            <template slot-scope="scope">
              <span  style="color:#417095;cursor: pointer;"  @click="addTextList(scope.row)">{{scope.row.marketPerformanceNum}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="projectTime" label="项目名称/编号" align="left">
            <template slot-scope="scope">
              <span>{{scope.row.projectName}}/{{scope.row.projectId}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="thisGrantTotalAmount" label="本次发放金额" align="right">
            <template scope="scope">
              <span>{{scope.row.thisGrantTotalAmount |moneFlter}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="applicantUserName" label="申请人" align="center"></el-table-column>
          <el-table-column prop="nodeNowState" label="状态" align="center"></el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="addTextListTwo(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
       
        <el-pagination
          background
          :current-page="1"
          :page-sizes="[15, 30, 50, 100, 200, 500]"
          :page-size="15"
          layout="total, prev, pager, next, sizes"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import axios from "../../service/http";
import { option } from "../../static/config";
export default {
  data() {
    return {
      selectParam: "",
      queryStateParams: "WF_SUSPENDING_QUERY_SQL_PARAMS",
      wagesList: [
        // {
        //   projectNum: "中科倚天",
        //   projectTime: "2020-08-23",
        //   userName: "倚天机构",
        //   total: "23",
        //   sureTotal: "2",
        //   mange: "10%",
        //   successTotal: "4",
        //   approvalTotal: "23",
        //   differenceTotal: "12",
        // },
        // {
        //   projectNum: "中科倚天1",
        //   projectTime: "2020-08-23",
        //   userName: "倚天机构1",
        //   total: "23",
        //   sureTotal: "2",
        //   mange: "10%",
        //   successTotal: "4",
        //   approvalTotal: "0",
        //   differenceTotal: "12",
        // },
        // {
        //   projectNum: "中科倚天1",
        //   projectTime: "2020-08-23",
        //   userName: "倚天机构1",
        //   total: "23",
        //   sureTotal: "2",
        //   mange: "10%",
        //   successTotal: "4",
        //   approvalTotal: "1000",
        //   differenceTotal: "12",
        // },
      ],
       dialogVisible: false,
        imgsrc: "",
      total: 0,
      pageNum: 1,
      pageSize: 15,
    };
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {
    this.getMarketPerformanceWorkflowList();
  },
  methods: {
    //处理
    exitList(row) {
      this.$router.replace({
        path: "/meritsMarket/newIssue",
        query: {
          marketPerformanceId: row.marketPerformanceId,
          archivesState: 1,
        },
      });
    },
    //审批
    exitArr(row){
    this.$router.replace({
        path: "/meritsMarket/newIssue",
        query: {
          marketPerformanceId: row.marketPerformanceId,
          archivesState: 3,
        },
      });
    },
    //查看
    addText(row) {
      this.$router.replace({
        path: "/meritsMarket/newIssue",
        query: {
          marketPerformanceId: row.marketPerformanceId,
          archivesState: 2,
        },
      });
    },
     // 监听对话框的关闭事件
    handleClose() {
      this.$refs.wagesList.resetFields();
    },
     //点击弹出框
    showEditDialog(row) {
      debugger
      this.dialogVisible = true;
      this.imgsrc =
        option.workFlow +
        "restful/workFlow/findPngByProcessInstanceId?processInstanceId=" +
        row.processInstanceId;
    },
    //处理查看
    addTextList(row) {
      this.$router.replace({
        path: "/meritsMarket/newIssue",
        query: {
          marketPerformanceId: row.marketPerformanceId,
          archivesState: 2,
        },
      });
    },
    //完结查看
    addTextListTwo(row) {
      this.$router.replace({
        path: "/meritsMarket/newIssue",
        query: {
          marketPerformanceId: row.marketPerformanceId,
          archivesState: 2,
        },
      });
    },
    getMarketPerformanceWorkflowList() {
      axios
        .post(
          option.base_path +
            "wages/performance/getMarketPerformanceWorkflowList",
          {
            queryStateParams: this.queryStateParams,
            selectParam: this.selectParam,
            pageSize: this.pageNum,
            pageNum: this.pageSize,
          }
        )
        .then((res) => {
          if (res.data.flag == 0) {
            this.wagesList = res.data.data.rows;
            this.total = res.data.data.total;
          }
        });
    },
    handleClick(id) {
      this.getMarketPerformanceWorkflowList();
    },
    //手动切换每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.getMarketPerformanceWorkflowList();
    },
    //手动切换页数
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getMarketPerformanceWorkflowList();
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
    //金额格式化
    rmoney(s) {
      //转成string类型
      s = s + "";
      return parseFloat(s.replace(/[^\d\.-]/g, ""));
    },
  },
  filters: {
    moneFlter(num) {
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
};
</script>
<style scoped>
/* @import url(); 引入css类 */
.el-tabs--border-card {
  border-bottom: 0;
  border-left: 0;
  border-right: 0;
  box-shadow: none;
}
</style>
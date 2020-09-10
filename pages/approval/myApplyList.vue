<template>
  <div class="yt-dome-container">
    <!-- 页面头部 -->
    <el-header class="yt-header">
      <el-form
        ref="form"
        :model="form"
        label-width="150px"
        :label-position="labelposition"
        size="small"
      >
        <el-row>
          <el-col :span="16">
            <el-form-item label="申请事由/单据编号：">
              <el-input v-model="form.queryParams" class placeholder="请输入申请事由/单据编号" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="申请类别：">
              <el-select v-model="form.formType" placeholder="请选择" clearable>
                <el-option label="请选择" value="0"></el-option>
                <el-option label="事前申请" value="ADVANCE_APP"></el-option>
                <el-option label="借款申请" value="LOAN_APP"></el-option>
                <el-option label="支出申请" value="EXPENDITURE_APP"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="申请日期：">
              <el-date-picker
                v-model="form.date "
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="到"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="11" style="display:flex">
            <el-form-item
              label="申请金额："
              :rules="[
						{ type: 'number', message: '金额必须为数字值', trigger: 'blur',}
						]"
            >
              <el-input
                placeholder="请输入"
                style="width: 80px"
                v-model.number="form.startAmount"
                oninput="value=value.replace(/[^\d.]/g,'')"
                clearable
              ></el-input>-
              <el-input
                placeholder="请输入"
                style="width: 80px"
                v-model.number="form.endAmount"
                oninput="value=value.replace(/[^\d.]/g,'')"
                clearable
              ></el-input>
            </el-form-item>
            <div
              style="text-align: right;display: inline-block;margin:auto;margin-top: 0px;margin-right: 0px;"
            >
              <el-button type="primary" @click="changeSelect">查询</el-button>
              <el-button type="info" @click="resetForm('form')">重置</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <div
      style="height: 5px;background-color: #f3f3f3;border-top: 1px solid #dfe6f3;border-bottom: 1px solid #dfe6f3;margin-bottom: 20px;"
    ></div>
    <el-dropdown style="margin-bottom:20px;margin-left:20px" @command="handleCommand">
      <el-button type="primary">
        新增申请
        <i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="0">事前申请</el-dropdown-item>
        <el-dropdown-item command="1">支出申请</el-dropdown-item>
        <el-dropdown-item command="2">借款申请</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div class="tab-mod" style=" -top: 20px;min-height: 100%;min-width: 100%;">
      <el-tabs type="border-card" v-model="activeTab" @tab-click="handleClick">
        <!-- 草稿状态的表格START -->
        <el-tab-pane label="草稿" v-model="form.queryStateParams" name="first">
          <el-table :data="tableDataDrafts" border style="width: 100%">
            <el-table-column prop="applicantTime" label="保存日期" align="center" width="120px"></el-table-column>
            <el-table-column prop="appName" label="拟申请事由" header-align="center" align="left"></el-table-column>
            <el-table-column prop="formTypeName" label="申请类型" header-align="center"></el-table-column>
            <el-table-column prop="totalAmount" label="拟申请金额(元)" align="right" width="150px">
              <template slot-scope="scope">
                <span>{{scope.row.totalAmount | moneyFormat}}</span>
              </template>
            </el-table-column>
            <el-table-column prop label="操作" align="center" width="150px">
              <template slot-scope="scope">
                <el-button size="mini" @click="toPageDrafts('',scope.row)">编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row.pkId,scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            :current-page="currentPageDrafts"
            :page-sizes="[15, 30, 50, 100, 200, 500]"
            :page-size="15"
            layout="total, prev, pager, next, sizes"
            :total="totalDrafts"
            @size-change="handleSizeChangeDrafts"
            @current-change="handleCurrentChangeDrafts"
          ></el-pagination>
        </el-tab-pane>
        <!-- 草稿状态的表格END -->
        <!-- 已提交状态的表格START -->
        <el-tab-pane label="已提交" v-model="form.queryStateParams" name="second">
          <el-row style="margin:0px 10px;margin-top:15px">
            <el-col :span="24" style="text-align: right;margin-bottom: 20px;">
              <el-button type="primary" @click="open">撤销</el-button>
            </el-col>
          </el-row>
          <!-- 页面主体 -->
          <el-table
            :data="tableData"
            border
            style="width: 100%"
            highlight-current-row
            @current-change="changeTable"
          >
            <el-table-column prop="handleTime" label="申请日期" width="150" align="center"></el-table-column>
            <el-table-column prop="appNum" label="单据编号" width="150">
              <template slot-scope="scope">
                <a
                  style="color:#417095;cursor: pointer;"
                  @click="toPage('',scope.row)"
                >{{scope.row.appNum}}</a>
              </template>
            </el-table-column>
            <el-table-column prop="appName" label="申请事由"></el-table-column>
            <el-table-column prop="formTypeName" label="申请类别" width="100" align="center"></el-table-column>
            <el-table-column prop="totalAmount" label="申请金额(元)" width="150" align="right">
              <template slot-scope="scope">
                <span>{{scope.row.totalAmount | moneyFormat}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="nodeNowState" label="当前状态">
              <template slot-scope="scope">
                <a
                  style="color:#417095;cursor: pointer;"
                  @click="showEditDialog(scope.row)"
                  v-if="scope.row.workFlowState=='审批中'"
                >{{scope.row.nodeNowState}}</a>
                <span v-else>{{scope.row.nodeNowState}}</span>
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
            :current-page="currentPage"
            :page-sizes="[15, 30, 50, 100, 200, 500]"
            :page-size="15"
            layout="total, prev, pager, next, sizes"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </el-tab-pane>
        <!-- 已提交状态的表格END -->
      </el-tabs>
    </div>
  </div>
</template>

<script>
import axios from "../../service/http";
import { option } from "../../static/config";
export default {
  // 数据源
  data() {
    return {
      form: {
        queryParams: "",
        formType: "",
        date: "",
        startAmount: "",
        endAmount: "",
        pageIndex: 1,
        pageNum: 15,
      },
      formDrafts: {
        queryParams: "",
        formType: "",
        date: "",
        startAmount: "",
        endAmount: "",
        pageIndex: 1,
        pageNum: 15,
      },

      total: 0,
      totalDrafts: 0,
      currentPage: 1,
      currentPageDrafts: 1,
      labelposition: "right",
      tableData: [],
      tableDataDrafts: [],
      dialogVisible: false,
      imgsrc: "",
      activeTab: "first",
    };
  },
  // 初始化执行
  mounted() {
    this.getProjectList();
    this.getDraftsAppInfo();
  },
  // 方法声明
  methods: {
    // 已提交跳转
    toPage(path, row) {
      if (row.formType == "ADVANCE_APP") {
        path = "/approval/details";
      } else if (row.formType == "LOAN_APP") {
        path = "/expensesReim/loanApplyDetail";
      } else if (row.formType == "EXPENDITURE_APP") {
        path = "/expensesReim/expenseAppDetail";
      }
      this.$router.replace({
        path: path,
        query: {
          pkId: row.pkId,
          approvalState: 2,
        },
      });
    },
    //查询不同的表
    changeSelect() {
      if (this.activeTab == "first") {
        this.getDraftsAppInfo();
      } else {
        this.getProjectList();
      }
    },
    // 跳转
    toPageDrafts(path, row) {
      if (row.formType == "ADVANCE_APP") {
        path = "/busiTripApply/serveApply";
      } else if (row.formType == "LOAN_APP") {
        path = "/expensesReim/loanApproval";
      } else if (row.formType == "EXPENDITURE_APP") {
        path = "/expensesReim/expenseAccount";
      }
      this.$router.replace({
        path: path,
        query: {
          pkId: row.pkId,
        },
      });
    },
    //点击选中表格数据
    changeTable(val) {
      this.currentRow = val;
    },
    //撤销
    open() {
      if (this.currentRow) {
        let id = this.currentRow.pkId;
        let formType = this.currentRow.formType;
        let nodeNowState = this.currentRow.nodeNowState;
        if (nodeNowState != "待申请人再次提交") {
          this.$message("该数据在流程中不能撤销");
          console.log(id, "该数据在流程中不能撤销", formType, nodeNowState);
        } else {
          this.$confirm("确定撤销此条数据吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              axios
                .post(
                  option.base_path + "sz/applyApp/deleteApplicantListByPkId",
                  {
                    pkId: id,
                    formType: formType,
                  }
                )
                .then((res) => {
                  this.$message({
                    type: "success",
                    message: "撤销成功!",
                  });
                });
              this.getProjectList();
              console.log(id, "成功", formType, nodeNowState);
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消撤销",
              });
            });
        }
      } else {
        this.$message("请选中数据进行操作");
      }
    },
    // 监听对话框的关闭事件
    handleClose() {
      this.$refs.tableData.resetFields();
    },
    //点击弹出框
    showEditDialog(row) {
      //  this.a.nodeNowState=id
      //  this.getProjectList(id)
      // if (nodeNowState == "待【部门经理审批】审批") {
      //   this.imgsrc =
      //     "http://123.56.81.55:9200/ims-act/restful/workFlow/findPngByProcessInstanceId?processInstanceId=160789";
      // } else if (nodeNowState == "待【项目经理审批】审批") {
      //   this.a = "待【项目经理审批】审批";
      // } else if (nodeNowState == "待【财务审批】审批") {
      //   this.a = "待【财务审批】审批";
      // } else if (nodeNowState == "待申请人再次提交") {
      //   this.a = "待申请人再次提交";
      // } else if (nodeNowState == "待【总经办审批】审批") {
      //   this.a = "待【总经办审批】审批";
      // } else if (nodeNowState == "总办人填写") {
      //   this.imgsrc =
      //     "http://123.56.81.55:9200/ims-act/restful/workFlow/findPngByProcessInstanceId?processInstanceId=141098";
      // }
      this.dialogVisible = true;
      this.imgsrc =
        option.workFlow +
        "restful/workFlow/findPngByProcessInstanceId?processInstanceId=" +
        row.processInstanceId;
    },

    //手动切换每页条数  草稿
    handleSizeChangeDrafts(val) {
      this.formDrafts.pageNum = val;
      console.log(`每页 ${val} 条`);
      //this.getProjectList();
      this.getDraftsAppInfo();
    },
    //手动切换页数  草稿
    handleCurrentChangeDrafts(val) {
      this.formDrafts.pageIndex = val;
      console.log(`当前页: ${val}`);
      //this.getProjectList();
      this.getDraftsAppInfo();
    },

    //手动切换每页条数  已提交
    handleSizeChange(val) {
      this.form.pageNum = val;
      console.log(`每页 ${val} 条`);
      this.getProjectList();
    },
    //手动切换页数  已提交
    handleCurrentChange(val) {
      this.form.pageIndex = val;
      console.log(`当前页: ${val}`);
      this.getProjectList();
    },
    // 重置
    resetForm(form) {
      this.form = {
        pageNum: 15,
        pageIndex: 1,
        queryParams: "",
        formType: "",
        date: "",
        startAmount: "",
        endAmount: "",
      };
      this.formDrafts = {
        pageNum: 15,
        pageIndex: 1,
        queryParams: "",
        formType: "",
        date: "",
        startAmount: "",
        endAmount: "",
      };
      this.getProjectList();
      this.getDraftsAppInfo();
    },
    // 查询 已提交
    getProjectList(id) {
      var me = this;
      (this.form.startDate = this.form.date != "" ? this.form.date[0] : ""),
        (this.form.endDate = this.form.date != "" ? this.form.date[1] : ""),
        axios
          .post(
            option.base_path + "sz/applyApp/myApplicationAppInfo",
            this.form
          )
          .then((res) => {
            this.tableData = res.data.data.rows;
            console.log("返回值", res.data.data.rows);
            this.total = res.data.data.total;
            // if(id){
            //    this.tableData.forEach(item => {
            //     if(id==item.pkId){
            //      this.a = item.nodeNowState
            //   }
            // });
            // }
          })
          .catch((err) => err);
    },
    // 查询 草稿
    getDraftsAppInfo() {
      this.formDrafts.queryParams = this.form.queryParams;
      this.formDrafts.formType = this.form.formType;
      this.formDrafts.startAmount = this.form.startAmount;
      this.formDrafts.endAmount = this.form.endAmount;
      let that = this;
      (this.formDrafts.startDate =
        this.formDrafts.date != "" ? this.formDrafts.date[0] : ""),
        (this.formDrafts.endDate =
          this.formDrafts.date != "" ? this.formDrafts.date[1] : ""),
        axios
          .post(option.base_path + "sz/applyApp/DraftsAppInfo", this.formDrafts)
          .then((res) => {
            // this.peopleList.push(man)
            this.tableDataDrafts = res.data.data.rows;
            this.totalDrafts = res.data.data.total;
            console.log("返回值", res.data.data);
          })
          .catch(function (error) {
            console.log(error);
          });
    },
    handleClick(id) {
      this.form.pageIndex = 1;
      this.form.pageNum = 15;
    },
    // 删除
    handleDelete(id, row) {
      let that = this;
      let path;
      if (row.formType == "ADVANCE_APP") {
        path = "sz/advanceApp/deleteAdvanceInfoById";
      } else if (row.formType == "LOAN_APP") {
        path = "sz/loanApp/deleteLoanInfoById";
      } else if (row.formType == "EXPENDITURE_APP") {
        path = "sz/expenditureApp/deleteExpenditureInfoById";
      }
      that
        .$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          axios
            .post(option.base_path + `${path}`, {
              appId: id,
              loanId: id,
              advanceId: id,
            })
            .then((res) => {
              this.getDraftsAppInfo();
            });
          that.$message.success("删除成功");
        })
        .catch(() => {
          that.$message.info("已取消删除");
        });
    },
    handleCommand(command) {
      //this.$message("click on item " + command);
      let path = "";
      if (command == "0") {
        path = "/busiTripApply/serveApply";
      } else if (command == "2") {
        path = "/expensesReim/loanApproval";
      } else if (command == "1") {
        path = "/expensesReim/expenseAccount";
      }
      this.$router.replace({
        path: path,
        query: {},
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
    axios,
  },
};
</script>
<style  scoped>
.el-form-item__label {
  padding: 0 !important;
}
.el-dropdown {
  vertical-align: top;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>

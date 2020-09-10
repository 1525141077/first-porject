<template>
  <div class="dome-container">
    <el-form style="padding:15px 20px 0">
      <el-form-item label="关 键 字：">
        <el-row>
          <el-col :span="5">
            <el-input size="small" v-model="selectParam" placeholder="请输入项目名称/编号、客户名称"></el-input>
          </el-col>
          <el-col :span="3" style="margin-left:20px">
            <el-button type="primary" @click="getMarketPerformanceList()">查询</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <div style="height: 5px;background-color: #f3f3f3;border-top: 1px solid #dfe6f3;border-bottom: 1px solid #dfe6f3;"></div>
    <el-row style="margin:20px">
      <el-col>
        <el-button type="primary" @click="updateMarket()">标记为已完成</el-button>
        <el-popover placement="right-start" width="200" trigger="hover" content="审批中的金额为零时，才可标记为已完成。">
          <span slot="reference">
            <img src="../../static/icon/icon-warn.png" alt style="width:23px;height:23px;margin-left:10px;vertical-align: middle;" />
          </span>
        </el-popover>
      </el-col>
    </el-row>
    <el-tabs type="border-card" @tab-click="handleClick" v-model="marketPerformanceType">
      <el-tab-pane label="待发放" name="1" style="width: 100%">
        <el-table ref="multipleTable" :data="wagesList" style="width: 100%" border @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center">
          </el-table-column>
          <el-table-column prop="projectName" label="项目名称/编号" width="400" align="left">
          <template slot-scope="scope">
            <span>{{scope.row.projectName +"/"+scope.row.projectId}}</span>
          </template>
          </el-table-column>
          <el-table-column prop="finishTime" label="结项时间" width="150" align="center">
          </el-table-column>
          <el-table-column prop="customerName" label="客户名称" width="250" align="left">
          </el-table-column>
          <el-table-column prop="budgetMoney" label="项目总金额" width="150" align="right">
            <template scope="scope">
              <span>{{scope.row.budgetMoney |moneFlter}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="revenueRecognizedAmount" label="已确认收入金额" width="150" align="right">
            <template scope="scope">
              <span>{{scope.row.revenueRecognizedAmount |moneFlter}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="grantRatio" label="发放比例" width="100" align="center">
            <template scope="scope">
              <span>{{scope.row.grantRatio==""?"--":scope.row.grantRatio}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="paidAmount" label="完成发放金额" width="150" align="right">
            <template scope="scope">
              <span>{{scope.row.paidAmount |moneFlter}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="approvalAmount" label="审批中金额" width="150" align="right">
            <template scope="scope">
              <span>{{scope.row.approvalAmount |moneFlter}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="currentAvailableAmount" label="可发放额度" width="150" align="right">
            <template scope="scope">
              <span>{{scope.row.currentAvailableAmount |moneFlter}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="append(scope.row)">新增发放</el-button>
              <el-button type="text" size="small" @click="examine(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background :current-page="1" :page-sizes="[15, 30, 50, 100, 200, 500]" :page-size="15" layout="total, prev, pager, next, sizes" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
      </el-tab-pane>
      <el-tab-pane label="已完成" name="2">
        <el-table :data="wagesList" style="width: 100%;" border>
          <el-table-column prop="projectName" label="项目名称/编号" align="left">
          </el-table-column>
          <el-table-column prop="finishTime" label="结项时间" width="150" align="center">
          </el-table-column>
          <el-table-column prop="customerName" label="客户名称" width="250" align="left">
           
          </el-table-column>
          <el-table-column prop="budgetMoney" label="项目总金额" width="150" align="right">
            <template scope="scope">
              <span>{{scope.row.budgetMoney |moneFlter}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="revenueRecognizedAmount" label="已确认收入金额" width="150" align="right">
            <template scope="scope">
              <span>{{scope.row.revenueRecognizedAmount |moneFlter}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="grantRatio" label="发放比例" width="100" align="center">
            <template scope="scope">
              <span>{{scope.row.grantRatio==""?"--":scope.row.grantRatio}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="paidAmount" label="完成发放金额" width="150" align="right">
            <template scope="scope">
              <span>{{scope.row.paidAmount |moneFlter}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template slot-scope="scope">
             <el-button type="text" size="small" @click="examine(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background :current-page="1" :page-sizes="[15, 30, 50, 100, 200, 500]" :page-size="15" layout="total, prev, pager, next, sizes" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :visible.sync="centerDialogVisible" width="32%" center>
      <span> 所选项目中，存在“审批中的金额”未清零的数据，不能标记为"已完成" </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "../../service/http";
import { option } from "../../static/config";
export default {
  data() {
    return {
      marketPerformanceType: "1",
      selectParam: "",
      pageNum: 1,
      pageSize: 15,
      centerDialogVisible: false,
      wagesList: [],

      total: 0,
      projectIds: "",
      selectedList: [],
    };
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {
    this.getMarketPerformanceList();
  },

  methods: {
    //新增跳转
    append(row){
      this.$router.replace({
        path: '/meritsMarket/newIssue',
        query: {
          projectId: row.projectId,
        },
      });
    },
    //查看跳转
    examine(row){
      this.$router.replace({
        path: '/meritsMarket/examine',
        query: {
          projectId: row.projectId,
          projectName:row.projectName,
          projectId:row.projectId,
          approvalAmount:row.approvalAmount,
          paidAmount:row.paidAmount,
        },
      });
    },
    handleSelectionChange(list) {
      this.selectedList = list;
      var arr = [];
      list.forEach((v) => {
        if (v.approvalTotal != 0) {
          this.centerDialogVisible = true;
          this.$refs.multipleTable.toggleRowSelection(v, false);
        } else {
          arr.push(v);
          console.log(arr);
          this.projectIds = arr.map((n) => n.projectId).join(",");
        }
      });
    },

    getMarketPerformanceList() {
      axios
        .post(option.base_path + "wages/performance/getMarketPerformanceList", {
          selectParam: this.selectParam,
          marketPerformanceType: this.marketPerformanceType,
          pageSize: this.pageNum,
          pageNum: this.pageSize,
        })
        .then((res) => {
          if (res.data.flag == 0) {
            this.wagesList = res.data.data.rows;
            this.total = res.data.data.total;
          }
        });
    },

    handleClick(id) {
      if (id.index == 0) {
        // 触发‘配置管理’事件
        this.marketPerformanceType = "1";
      } else if (id.index == 1) {
        // 触发‘用户管理’事件
        this.marketPerformanceType = "2";
      }
      this.getMarketPerformanceList();
    },
    //手动切换每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.getMarketPerformanceList();
    },
    //手动切换页数
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getMarketPerformanceList();
    },
    //标记已完成
    updateMarket() {
      if (this.selectedList.length > 0) {
        axios
          .post(
            option.base_path +
              "wages/performance/updateMarketPerformanceStateByIds",
            {
              projectIds: this.projectIds,
            }
          )
          .then((res) => {
            if (res.data.flag == 0) {
              this.$message.success(res.data.message);
              this.marketPerformanceType = "2";
              this.getMarketPerformanceList();
            } else {
              this.$message.error(res.data.message);
            }
          });
      } else {
        this.$message.warning("请勾选一行数据操作");
      }
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
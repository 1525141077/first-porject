<template>
  <div class="dome-container salary-container">
    <el-row>
      <el-form style="padding:20px">
        <el-col :span="5">
          <el-form-item label="所 属 年 度：">
            <el-date-picker style="width:175px" value-format="yyyy" size="small" :editable="false" v-model="query.year" type="year" placeholder="请选择">
            </el-date-picker>

          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label='关 键 字：'>
            <el-input v-model="query.queryParams" style="width:190px" size="small" placeholder="请输入查询关键字"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3" style="margin-top:6px">
          <el-button type="primary" @click="queryData">查询</el-button>
          <el-button type="info" @click="resetData">重置</el-button>
        </el-col>
      </el-form>
    </el-row>
    <div style="height: 5px;background-color: #f3f3f3;border-top: 1px solid #dfe6f3;border-bottom: 1px solid #dfe6f3;"></div>
    <el-table :summary-method="getSummaries" show-summary border :data="tableData" style="width: 100%;margin-top:20px">
      <el-table-column prop="workStateName" label="工作状态" width="150" align="center">
        <template scope="scope">
          <span>{{scope.row.workStateName==""?"--":scope.row.workStateName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="realName" label="姓名" width="120" align="center">
      </el-table-column>
      <el-table-column prop="workNum" label="工号" align="center">
      </el-table-column>
      <el-table-column prop="monthBasicWages" label="全年基本工资和" width="150" align="right">
        <template scope="scope">
          <span>{{scope.row.monthBasicWages |moneFlter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="monthBonus" label="全年月度奖金和" width="150" align="right">
        <template scope="scope">
          <span>{{scope.row.monthBonus |moneFlter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="otherBonus" label="全年其他奖金和" width="150" align="right">
        <template scope="scope">
          <span>{{scope.row.otherBonus |moneFlter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="travelSubsidy" label="全年差旅补贴" width="150" align="right">
        <template scope="scope">
          <span>{{scope.row.travelSubsidy |moneFlter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="flexibleBenefits" label="全年弹性福利" width="150" align="right">
        <template scope="scope">
          <span>{{scope.row.flexibleBenefits |moneFlter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="actualAmount" label="全年工资合计" width="150" align="right">
        <template scope="scope">
          <span>{{scope.row.actualAmount |moneFlter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="indicidualIncomeTax" label="全年个所税" width="150" align="right">
        <template scope="scope">
          <span>{{scope.row.indicidualIncomeTax |moneFlter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="actualAmountAverage" label="全年月平均工资" width="150" align="right">
        <template scope="scope">
          <span>{{scope.row.actualAmountAverage |moneFlter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="monthCount" label="全年发放工资月份数" width="150" align="right">
        <template scope="scope">
          <span>{{scope.row.monthCount |moneFlter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="socilCompPayMoney" label="全年社险公司担负金额" width="150" align="right">
        <template scope="scope">
          <span>{{scope.row.socilCompPayMoney |moneFlter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="socilPersonalPayMoney" label="全年社险个人担负金额" width="150" align="right">
        <template scope="scope">
          <span>{{scope.row.socilPersonalPayMoney |moneFlter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="fundCompPayMoney" label="全年公积金公司担负金额" width="150" align="right">
        <template scope="scope">
          <span>{{scope.row.fundCompPayMoney |moneFlter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="fundPersonalPayMoney" label="全年公积金个人担负金额" width="150" align="right">
        <template scope="scope">
          <span>{{scope.row.fundPersonalPayMoney |moneFlter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="compPayMoney" label="全年社险公积金公司担负金额合计" width="150" align="right">
        <template scope="scope">
          <span>{{scope.row.compPayMoney |moneFlter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="personalPayMoney" label="全年社险公积金个人担负金额合计" width="150" align="right">
        <template scope="scope">
          <span>{{scope.row.personalPayMoney |moneFlter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="全年成本统计" width="150" align="right">
        <template scope="scope">
          <span>{{scope.row.amount |moneFlter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="exit(scope.row)" size="small">查看明细</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background :current-page="1" :page-sizes="[15, 30, 50, 100, 200, 500]" :page-size="15" layout="total, prev, pager, next, sizes" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
  </div>
</template>

<script>
import axios from "../../../service/http";
import { option } from "../../../static/config.js";
export default {
  data() {
    return {
      companyList: [],
      deptList: [],
      tableData: [],
      total: 0,
      query: {
        affiliatedComp: "",
        affiliatedDept: "",
        queryParams: "",
        year: "",
        pageIndex: 1,
        pageNum: 15,
      },
    };
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {
    //获取上一年
    this.query.year = new Date().getFullYear() - 1 + "";
    this.getCompany();
    this.getAfterTaxByYear();
  },
  methods: {
    //所属公司
    getCompany() {
      axios.post(option.base_path + "api/dept/getCompList", {}).then((res) => {
        if (res.data.flag == 0) {
          this.companyList = res.data.data;
        }
      });
    },
    //部门
    getDept(compId) {
      axios
        .post(option.base_path + "api/dept/getDeptListByCompId", {
          compId: compId,
        })
        .then((res) => {
          if (res.data.flag == 0) {
            this.deptList = res.data.data;
          }
        });
    },
    changeCompany(val) {
      this.getDept(val);
      this.query.affiliatedDept = "";
    },
    //表格数据
    getAfterTaxByYear() {
      axios
        .post(option.base_path + "wages/afterTax/getAfterTaxByYear", this.query)
        .then((res) => {
          if (res.data.flag == 0) {
            this.tableData = res.data.data.rows;
            this.total = res.data.data.total;
          }
        });
    },
    //手动切换每页条数
    handleSizeChange(val) {
      this.query.pageNum = val;
      this.getAfterTaxByYear();
    },
    //手动切换页数
    handleCurrentChange(val) {
      this.query.pageIndex = val;
      console.log(`当前页: ${val}`);
      this.getAfterTaxByYear();
    },
    //查询
    queryData() {
      this.getAfterTaxByYear();
    },
    //重置
    resetData() {
      this.deptList = this.companyList = [];
      this.query = {
        affiliatedComp: "",
        affiliatedDept: "",
        queryParams: "",
        year: new Date().getFullYear() - 1 + "",
        pageIndex: 1,
        pageNum: 15,
      };
      this.getAfterTaxByYear();
    },
      //查看明细
    exit(row){
        this.$router.replace({
                path: '/compensation/projManagement/yearDetails',
                query: {
                personnelId: row.personnelId,
                year:this.query.year
                }
            });
    },
    //计算合计列
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (!values.every((value) => isNaN(value))) {
          if (index > 4 && index != 21) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return this.moneyFormat(this.rmoney(prev) + this.rmoney(curr));
              } else {
                return prev;
              }
            }, 0);
          }
        }
      });

      return sums;
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
<style>
/* @import url(); 引入css类 */
.salary-container .el-table {
  overflow: auto;
}

.salary-container .el-table__body-wrapper,
.el-table__header-wrapper,
.el-table__footer-wrapper {
  overflow: visible;
}
.salary-container .el-table::after {
  position: relative !important;
}
</style>
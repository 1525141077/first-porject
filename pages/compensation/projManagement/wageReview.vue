<template>
  <div class="dome-container">
    <el-form style="padding:15px 20px 0">
      <el-form-item label="所 属 期 间：">
        <el-row>
          <el-col :span="5">
            <el-date-picker :clearable="false" value-format="yyyy-MM" size="small" :editable="false" v-model="date" type="month" placeholder="选择月">
            </el-date-picker>
          </el-col>
          <el-col :span="3" style="text-align: right;">
            <el-button type="primary" @click="getMessage(index)">查询</el-button>
            <el-button type="info" @click="resetForm">重置</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <div style="height: 5px;background-color: #f3f3f3;border-top: 1px solid #dfe6f3;border-bottom: 1px solid #dfe6f3;"></div>
    <el-tabs type="border-card" @tab-click="handleClick">
      <el-tab-pane label="基本工资">
        <el-table :summary-method="getSummaries" show-summary :data="wagesList" style="width: 100%" border>
          <el-table-column prop="compName" label="公司" align="center">
          </el-table-column>
          <el-table-column prop="actualTotal" :label="((month-1)==0?12:(month-1))+'月份'" width="200" align="right">
            <template scope="scope">
              <span>{{scope.row.actualTotal |moneFlter}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="changeActualTotal" :label="month+'月份'" width="200" align="right">
            <template scope="scope">
              <span>{{scope.row.changeActualTotal |moneFlter}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="differenceActualTotal" label="差异" width="200" align="right">
            <template scope="scope">
              <span>{{scope.row.differenceActualTotal |moneFlter}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="exit(scope.row)">查看差异详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="社保">
        <el-table :summary-method="getSummaries" show-summary :data="cardinalList" style="width: 100%;" border>
          <el-table-column prop="category" label="类别" align="center">
          </el-table-column>
          <el-table-column prop="beforeTheChange" :label="((month-1)==0?12:(month-1))+'月份'" width="200" align="right">
            <template scope="scope">
              <span>{{scope.row.beforeTheChange |moneFlter}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="afterTheChange" :label="month+'月份'" width="200" align="right">
            <template scope="scope">
              <span>{{scope.row.afterTheChange |moneFlter}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="discrepancy" label="差异" width="200" align="right">
            <template scope="scope">
              <span>{{scope.row.discrepancy |moneFlter}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="exit(scope.row)">查看差异详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="公积金">
        <el-table :summary-method="getSummaries" show-summary :data="accumulationList" style="width: 100%" border>
          <el-table-column prop="category" label="类别" align="center">
          </el-table-column>
          <el-table-column prop="beforeTheChange" :label="((month-1)==0?12:(month-1))+'月份'" width="200" align="right">
            <template scope="scope">
              <span>{{scope.row.beforeTheChange |moneFlter}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="afterTheChange" :label="month+'月份'" width="200" align="right">
            <template scope="scope">
              <span>{{scope.row.afterTheChange |moneFlter}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="discrepancy" label="差异" width="200" align="right">
            <template scope="scope">
              <span>{{scope.row.discrepancy |moneFlter}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="exit(scope.row)" size="small">查看差异详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import axios from "../../../service/http";
import { option } from "../../../static/config.js";
export default {
  data() {
    return {
      date: "",
      month: "",
      wagesList: [],
      cardinalList: [],
      accumulationList: [],
      index: 0,
    };
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {
    this.getDate();
    this.getWageStatistics();
  },
  methods: {
    //获取当前日期
    getDate() {
      let nowDate = new Date();
      let date = {
        year: nowDate.getFullYear(),
        month: nowDate.getMonth(),
        date: nowDate.getDate(),
      };
      this.date = date.year + "-" + 0 + date.month;
      this.month = date.month;
    },
    //查询
    getMessage(index) {
      let dateSplit = this.date.split("-")[1];
      if (dateSplit.startsWith("0")) {
        dateSplit = dateSplit.substr(1);
      }
      this.month = dateSplit;
      if (index == 0) {
        this.getWageStatistics();
      } else {
        this.getFundPayCardinalStatistics(index);
      }
    },
    //重置
    resetForm() {
      this.getDate();
      this.getWageStatistics();
      this.getFundPayCardinalStatistics(this.index);
    },
       //查看差异详情
    exit(row){
        this.$router.replace({
                path: '/compensation/projManagement/wageList',
                query: {
                compCode: row.compCode,
                category:'3',
                originMonth:this.date,
                }
            });
    },
    //基本工资tab
    getWageStatistics() {
      axios
        .post(option.base_path + "wages/afterTax/getWageStatistics", {
          originMonth: this.date,
        })
        .then((res) => {
          if (res.data.flag == 0) {
            this.wagesList = res.data.data.rows;
          }
        });
    },
    //社保  公积金tab
    getFundPayCardinalStatistics(index) {
      axios
        .post(option.base_path + "fundPayMonth/getFundPayCardinalStatistics", {
          originMonth: this.date,
        })
        .then((res) => {
          if (res.data.flag == 0) {
            if (index == 1) {
              this.cardinalList = res.data.data;
            } else {
              this.accumulationList = res.data.data;
            }
          }
        });
    },
    handleClick(id) {
      this.index = id.index;
      if (id.index != 0) {
        this.getFundPayCardinalStatistics(id.index);
      }
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (index != 4) {
          if (!values.every((value) => isNaN(value))) {
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
<style scoped>
/* @import url(); 引入css类 */
.el-tabs--border-card {
  border: 0;
  box-shadow: none;
}
</style>
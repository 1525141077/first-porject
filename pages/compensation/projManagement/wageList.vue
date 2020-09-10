<template>
  <div class="yt-dome-container">
    <el-header class="yt-header">
      <el-form
        ref="form"
        :model="form"
        label-width="110px"
        :label-position="labelposition"
        size="small"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="关  键  字：">
              <el-input v-model="form.queryParams" class placeholder="请输入姓名" clearable style="width:90%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="差异类型：" style="margin-bottom: 20px;">
             <el-select v-model="form.compCode" placeholder="请选择工作状态"  style="width:90%">
              <el-option
                v-for="item in tissueList"
                :key="item.value"
                :label="item.disvalue"
                :value="item.value"
              ></el-option>
            </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="6"></el-col> -->
          <el-col :span="3" style="margin-left: -30px;">
              <div style="text-align: end;">
            <el-button type="primary" @click="getProjectList()">查询</el-button>
            <el-button type="info" @click="resetForm('form')">重置</el-button>
              </div>
           
          </el-col>
           <el-col :span="9">
              <div style="text-align: end;">
            <el-button type="info"  @click="exit">返回</el-button>
              </div>
           
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <div
      style="height: 5px;background-color: #f3f3f3;border-top: 1px solid #dfe6f3;border-bottom: 1px solid #dfe6f3;margin-bottom: 20px;"
    ></div>
    <!-- //表格 -->
    <el-table :data="tableData" border style="width: 100%"  show-summary  :summary-method="getSummaries">
      <el-table-column prop="affiliatedDeptName" label="部门" header-align="center"></el-table-column>
      <el-table-column prop="name" label="姓名" align="center" ></el-table-column>
      <el-table-column prop="workNum" label="工号" align="center"></el-table-column>
      <el-table-column prop="adjustmentState" label="差异类型" align="center"></el-table-column>
      <el-table-column prop="workMoneyChange" label="变动金额" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.workMoneyChange | moneyFormat}}</span>
          </template>
      </el-table-column>
    </el-table>
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
  </div>
</template>

<script>
import axios from "@/service/http";
import { option } from "@/static/config";
export default {
  // 数据源
  data() {
    return {
      form: {
        queryParams: "",
        formType: "",
        startAmount: "",
        date: "",
        pageIndex: 1,
        pageNum: 15,
        pkId: "",
        workState:"",
        compCode:'',
      },
      tissueList:[],
      total: 0,
      currentPage: 1,
      labelposition: "right",
      tableData: [],
    };
  },
  // 初始化执行
  mounted() {
    this.getProjectList();
    this.gettissue();
  },
  // 方法声明
  methods: {
    //手动切换每页条数
    handleSizeChange(val) {
      this.form.pageNum = val;
      console.log(`每页 ${val} 条`);
      this.getProjectList();
    },
    //手动切换页数
    handleCurrentChange(val) {
      this.form.pageIndex = val;
      console.log(`当前页: ${val}`);
      this.getProjectList();
    },
    // 重置
    resetForm(form) {
      this.form = {
        queryParams: "",
        formType: "",
        pageNum: 15,
        pageIndex: 1,
        date: "",
        startAmount: "",
        endAmount: "",
      };
      this.getProjectList();
    },
      //返回
    exit() {
      this.$router.push({
        path: "/compensation/projManagement/wageReview",
      });
    },
    //工作状态下拉框
    gettissue() {
      axios
        .post(option.base_path + "manpower/personnel/getDictInfoListByDictTypeCode",
         {
            dictTypeCode:"workState",
          })
        .then((res) => {
          if (res.data.flag == 0) {
            this.tissueList = res.data.data;
            console.log(this.tissueList, "撒地方撒sea");
          }
        //   this.getPersonnelArchivesEnterInfo();
        });
    },
    //工作状态下拉
   onworkState(val){
     this.tissueList.forEach((item) => {
        if (item.value == val) {
          this.form.workState = item.value;
        }
        // this.getWorkNum();
      });
  },
     getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return this.moneyFormat(this.rmoney(prev) + this.rmoney(curr));
              } else {
                return prev;
              }
            }, 0);
            // sums[index] += '.00';
          }
        });

        return sums;
      
      },
    // 查询
    getProjectList() {
      let that = this;
     
        axios
          .post(option.base_path + "fundPayMonth/getFundPayCardinalStatisticsParticulars", {
            originMonth:this.$route.query.originMonth,
            category:'3',
          })
          .then((res) => {
            // this.peopleList.push(man)
            this.tableData = res.data.data.rows;
            this.total = res.data.data.total;
            console.log("返回值", res.data.data);
          })
          .catch(function (error) {
            console.log(error);
          });
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
    // 删除
    handleDelete(id) {
     let that =this;
        that.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
         axios.post(option.base_path + "wages/gant/deleteMonthWages", {
              pkId:id,
         }).then(res => {
        this.getProjectList()
         })
      that.$message.success('删除成功')

      }).catch(() => {
          that.$message.info('已取消删除')
          })
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
<style scoped>
.block {
  display: flex;
}

.demonstration {
  display: flex;
  align-items: center;
}
.line {
  text-align: center;
}
.del{
 color: #003465;
 cursor: pointer;
}
</style>

<template>
  <div class="yt-dome-container">
    <el-header class="yt-header">
      <el-form ref="form" :model="form" label-width="110px" :label-position="labelposition" size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="所 属 期 间：">
              <el-date-picker v-model="form.year" value-format="yyyy" type="year" placeholder="选择年" size='small'>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="关  键  字：">
              <el-input v-model="form.queryParams" class placeholder="请输入姓名" clearable style="width:90%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- <div style="text-align: end;"> -->
            <el-button type="primary" @click="getMessage()">查询</el-button>
            <el-button type="info" @click="resetForm('form')">重置</el-button>
            <!-- </div> -->
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <div
      style="height: 5px;background-color: #f3f3f3;border-top: 1px solid #dfe6f3;border-bottom: 1px solid #dfe6f3;margin-bottom: 20px;">
    </div>
      <!-- //表格 -->
      <el-table
      :data="tableData"
      border
      style="width: 100%">
      <!-- <el-table-column prop="applicantTime" label="所属公司" align="center" width="120px"></el-table-column> -->
      <!-- <el-table-column prop="appName" label="所属月份" header-align="center" align="left"></el-table-column> -->
      <el-table-column prop="realName" label="姓名" header-align="center" align="center" >
        <template slot-scope="scope">
          <span style="color:rgb(141,158,255);margin-left:20px;cursor: pointer;" @click='edit("/compensation/checkWorkYearList",scope.row)'>{{scope.row.realName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="workNum" label="工号" header-align="center"></el-table-column>
      <el-table-column prop="sickLeave" label="病假" align="center"></el-table-column>
      <el-table-column prop="affairLeave" label="事假" align="center"></el-table-column>
      <el-table-column prop="annualLeave" label="年假" align="center"></el-table-column>
      <el-table-column prop="examLeave" label="考试假	" align="center"></el-table-column>
      <el-table-column prop="maritalLeave" label="婚假" align="center"></el-table-column>
      <el-table-column prop="businessTravel" label="出差" align="center"></el-table-column>
      <el-table-column prop="funeralLeave" label="丧假" align="center"></el-table-column>
      <el-table-column prop="prenatalExaminationLeave" label="产前检查假" align="center" width='100'></el-table-column>
      <el-table-column prop="maternityLeave" label="产假" align="center"></el-table-column>
      <el-table-column prop="familyLeave" label="探亲假" align="center"></el-table-column>
      <el-table-column prop="paternityLeave" label="陪产假" align="center"></el-table-column>
      <el-table-column prop="sumTotal" label="合计" align="center"></el-table-column>
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
  data () {
    return {
      form: {
        queryParams: "",
        formType: "",
        year:'2019',
        startAmount: "",
        date: "",
        pageIndex: 1,
        pageNum: 15,
        pkId: "",
      },

      total: 0,
      currentPage: 1,
      labelposition: "right",
      tableData: [],
      multipleSelection: [],
      //  开始日期
      pickerStartDate: {
        disabledDate: (time) => {
          if (this.form.closeDate) {
            return time.getTime() > this.form.closeDate;
          }
        },
      },
      // 结束日期
      pickerCloseDate: {
        disabledDate: (time) => {
          return time.getTime() < this.form.startDate;
        },
      },
    };
  },
  // 初始化执行
  mounted () {
    this.getMessage()
  },
  // 方法声明
  methods: {
    // 点击姓名跳转至详情页
    edit(path, row){
        this.$router.replace({
          path: '/compensation/checkWorkYearList',
          query: {
            personnelId: row.personnelId,
            year:this.form.year
          }
        });
      },
    //
      // 获取列表数据
    getMessage(){
      axios
        .post(option.base_path + "wages/attendance/getMonthAttendanceListByYear", this.form)
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
    //手动切换每页条数
    handleSizeChange(val) {
      this.form.pageNum = val;
      console.log(`每页 ${val} 条`);
      this.getMessage();
    },
    //手动切换页数
    handleCurrentChange(val) {
      this.form.pageIndex = val;
      console.log(`当前页: ${val}`);
      this.getMessage();
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
      this.getMessage();
    },
    toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      }
  },
  // 组件注册
  components: {
  }
}
</script>
<style lang="stylus" scoped>

</style>

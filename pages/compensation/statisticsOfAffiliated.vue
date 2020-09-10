<template>
  <div class="yt-dome-container">
    <el-header class="yt-header">
      <el-form ref="form" :model="form" label-width="110px" :label-position="labelposition" size="small">
        <el-row>
          <el-col :span="12">
            <el-form-item label="选择日期：">
              <el-date-picker v-model="form.date" value-format="yyyy-MM" type="monthrange" range-separator="至" start-placeholder="开始月份"
                end-placeholder="结束月份">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="关  键  字：">
              <el-input v-model="form.queryParams" class placeholder="请输入姓名" clearable style="width:90%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="缴费情况" style="margin-bottom: 20px;">
              <el-select v-model="form.paymentState" placeholder="请选择" clearable style="width:90%">
                <el-option label="请选择" value="0"></el-option>
                <el-option label="未交" value="1"></el-option>
                <el-option label="已交" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="6"></el-col> -->
          <el-col :span="11">
            <div style="text-align: end;">
              <el-button type="primary" @click="getProjectList()">查询</el-button>
              <el-button type="info" @click="resetForm('form')">重置</el-button>
            </div>

          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <div
      style="height: 5px;background-color: #f3f3f3;border-top: 1px solid #dfe6f3;border-bottom: 1px solid #dfe6f3;margin-bottom: 20px;">
    </div>
    <!-- 按钮 -->
    <el-row style="margin:0px 10px;margin-top:15px;">
      <el-col :span="24" align='right' style="margin-bottom: 20px;">
        <!-- <el-button type="primary" @click="open">导入数据</el-button> -->
        <el-button type="primary" @click="open">导出</el-button>
        <el-button type="primary" @click="money">缴费</el-button>
      </el-col>
    </el-row>
    <!-- //表格 -->
    <el-table border ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <!-- <el-table-column prop="applicantTime" label="所属公司" align="center" width="120px"></el-table-column> -->
      <el-table-column prop="realName" label="姓名" header-align="center" align="left" width="80px"></el-table-column>
      <el-table-column prop="durationStay" label="所属期间" header-align="center" width="100px"></el-table-column>
      <el-table-column prop="socialPayBaseMoney" label="社险基数" align="center" width="100px"></el-table-column>
      <el-table-column prop="socialPersonalPayMoney" label="社险个人实际缴纳金额" align="center"></el-table-column>
      <el-table-column prop="fundPayBaseMoney" label="公积金基数" align="center" width="100px"></el-table-column>
      <el-table-column prop="fundPersonalPayMoney" label="公积金个人实际缴纳金额	" align="center"></el-table-column>
      <el-table-column prop="payMoneyAmount" label="费用金额	" align="center" width="100px"></el-table-column>
      <el-table-column prop="payMentStateName" label="缴费情况" align="center" width="100px"></el-table-column>
    </el-table>
    <el-pagination background :current-page="currentPage" :page-sizes="[15, 30, 50, 100, 200, 500]" :page-size="15"
      layout="total, prev, pager, next, sizes" :total="total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange"></el-pagination>
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
          paymentState:'',
          queryParams: "",
          formType: "",
          startAmount: "",
          date: "",
          pageIndex: 1,
          pageNum: 15,
          pkId: "",
        },
        listId: '',
        total: 0,
        currentPage: 1,
        labelposition: "right",
        tableData: [],
        multipleSelection: [],
        //  开始日期
        pickerStartDate: {
          disabledDate: (time) => {
            if (this.form.endDate) {
              return time.getTime() > this.form.endDate;
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
    mounted() {
      this.getProjectList()
    },
    // 方法声明
    methods: {

      // 获取列表数据
      getProjectList() {
          (this.form.startDate = this.form.date != "" ? this.form.date[0] : ""),
          (this.form.endDate = this.form.date != "" ? this.form.date[1] : ""),
        axios
          .post(option.base_path + "fundPayMonth/getFundPaySocialAnchored", this.form)
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
      // 导出
      open(){
      let params = this.form.params;
      let fundPayMonthIds = this.listId;
      let startTime = "";
      let endTime = "";
      let queryParams = "";
      let affiliateComp = "";
      let pageParam = "&startTime=" + startTime + "&endTime=" + endTime + "&queryParams=" + queryParams + "&affiliateComp=" + affiliateComp;
      window.location.href =
        option.base_path +
        "fundPayMonth/exportFundPaySocialAnchored?fundPayMonthIds=" +
        fundPayMonthIds +
        pageParam;
      },
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
        var fundPayMonthId = "";
        //遍历每行选中的数据
        this.multipleSelection.forEach(a => {
          fundPayMonthId += a.fundPayMonthId + ','
          // this.number.substring(this.number.length,this.number.length-1)
        })
        let id = fundPayMonthId.substring(0, fundPayMonthId.length - 1)
        this.listId = id
        console.log("士大夫撒", id)
      },
      money() {
        if (this.multipleSelection.length == 0) {
          this.$message('请选中一条数据')
        } else {
          axios
            .post(option.base_path + "fundPayMonth/updateAnchoredPaymentState",
              {
                fundPayMonthIds: this.listId
              }
            )
            .then((res) => {
              this.$message('缴费成功')
              this.getProjectList()
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      }
    },
    // 组件注册
    components: {
    }
  }
</script>
<style lang="stylus" scoped>

</style>

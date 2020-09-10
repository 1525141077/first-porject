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
          <el-col :span="10">
            <el-form-item label="拟申请事由："  >
              <el-input v-model="form.queryParams" class placeholder="请输入关键字" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="申请类别：" >
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
          <el-col :span="24">
            <el-form-item label="申请日期：">
                    <el-date-picker
                    v-model="form.date "
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="到"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                    </el-date-picker>
              </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="拟申请金额：" style="margin-bottom: 0px;" >
              <el-col :span="9">
                <el-form-item prop="startAmount">
                  <el-input v-model.number="form.startAmount" placeholder="请输入" oninput="value=value.replace(/[^\d.]/g,'')"></el-input>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="1">-</el-col>
              <el-col :span="9">
                <el-form-item prop="endAmount">
                 <el-input v-model.number="form.endAmount" placeholder="请输入" oninput="value=value.replace(/[^\d.]/g,'')"></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>

          <el-col :span="3" >
            <el-button type="primary" @click="getProjectList()">查询</el-button>
            <el-button type="info" @click="resetForm('form')">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <div
      style="height: 5px;background-color: #f3f3f3;border-top: 1px solid #dfe6f3;border-bottom: 1px solid #dfe6f3;margin-bottom: 20px;"
    ></div>
    <!-- //表格 -->
    <el-table :data="tableData" border style="width: 100%">
        <el-table-column  prop="applicantTime"  label="保存日期" align="center" width="120px"></el-table-column>
        <el-table-column   prop="appName"
          label="拟申请事由" 
          header-align="center"
          align="left">
          </el-table-column>
        <el-table-column prop="formTypeName"
          label="申请类型"
          header-align="center"
        ></el-table-column>
        <el-table-column prop="totalAmount"  label="拟申请金额(元)" align="right" width="150px">
          <template slot-scope="scope">
            <span>{{scope.row.totalAmount | moneyFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop label="操作" align="center" width="150px">
           <template slot-scope="scope">
        <el-button
          size="mini"
          @click="toPage('',scope.row)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.row.pkId,scope.row)">删除</el-button>
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
import axios from "../../service/http";
import { option } from "../../static/config";
export default {
  // 数据源
  data() {
    return {
      form: {
        queryParams: "",
        formType: "",
        startAmount: "",
         date:"",
         pageIndex:1,
         pageNum: 15,
         pkId:""
      },
    
       total: 0,
      currentPage: 1,
       labelposition: "right",
       tableData: [],
      //  开始日期
        pickerStartDate: {
        disabledDate: time => {
          if (this.form.closeDate) {
            return time.getTime() > this.form.closeDate
          }
        }
      },
      // 结束日期
      pickerCloseDate: {
        disabledDate: time => {
          return time.getTime() < this.form.startDate
        }
      },
    };
  },
  // 初始化执行
  mounted() {
     this.getProjectList();
  },
  // 方法声明
  methods: {
     //手动切换每页条数
    handleSizeChange(val) {
      this.form.pageNum = val;
      console.log(`每页 ${val} 条`);
        this.getProjectList()
    },
    //手动切换页数
    handleCurrentChange(val) {
      this.form.pageIndex = val;
      console.log(`当前页: ${val}`);
        this.getProjectList()
    },
    // 重置
     resetForm(form) {
      this.form = {
        queryParams: "",
        formType: "",
        pageNum: 15,
        pageIndex: 1,
        date:"",
        startAmount: "",
        endAmount: "",
       
      };
      this.getProjectList()
    },
    // 跳转
      toPage(path, row) {
        if(row.formType=='ADVANCE_APP'){
          path='/busiTripApply/serveApply'
        }else if(row.formType=='LOAN_APP'){
           path='/expensesReim/loanApproval'
        }else if(row.formType=='EXPENDITURE_APP'){
           path='/expensesReim/expenseAccount'
        }
      this.$router.replace({
        path: path,
        query: {
          pkId: row.pkId
        }
      });
    },
    // 查询
        getProjectList () {
          let that = this
       this.form.startDate=(this.form.date!=''?this.form.date[0]:''),
        this.form.endDate=(this.form.date!=''?this.form.date[1]:''),
        axios.post(option.base_path + 'sz/applyApp/DraftsAppInfo', this.form).then(res => {
          // this.peopleList.push(man)
           this.tableData = res.data.data.rows;
            this.total = res.data.data.total;
          console.log('返回值', res.data.data)
        })
        .catch(function (error) {
          console.log(error);
        })
    },
    // 删除
     handleDelete(id,row){
       let that =this;
       let path;
        if(row.formType=='ADVANCE_APP'){
          path='sz/advanceApp/deleteAdvanceInfoById'
        }else if(row.formType=='LOAN_APP'){
           path='sz/loanApp/deleteLoanInfoById'
        }else if(row.formType=='EXPENDITURE_APP'){
           path='sz/expenditureApp/deleteExpenditureInfoById'
        }
        that.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
         axios.post(option.base_path + `${path}`, {
              appId:id,
              loanId:id,
              advanceId:id
         }).then(res => {
        this.getProjectList()
         })
      that.$message.success('删除成功')
     
      }).catch(() => {
          that.$message.info('已取消删除')
          })
     },
  },
   filters:{
    moneyFormat (num) {
      if (num) {
        num = Number(num)
        num = (num.toFixed(2) + '').replace(
          /\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,
          '$&,'
        )
      }
      return num || '0.00'
    }
  },
  // 组件注册
  components: {
    axios,

  }
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
.line{
  text-align: center;
}
.el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner{
  width:423px !important;
}
</style>

<template>
    <div class="yt-dome-container">
    <!-- :style="publicHeight" -->
    <el-container>
      <!-- 页面头部 -->
      <el-header class="yt-header">
        <el-form label-width="70px" size="small">
          <el-row>
            <el-col :span="6">
              <el-form-item label="关  键  字：">
                <el-input class placeholder="请输入关键字" v-model="form.realName" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" style="margin-left: 0px;">
              <el-form-item label="日 期：">
                <el-date-picker
                style="width: 170px;"
                v-model="form.originMonth"
                value-format="yyyy-MM"
                type="month"
                placeholder="选择日期">
                    </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6" style="margin-left: 20px;">
              <el-form-item label="工作状态：">
                <el-select v-model="form.workState" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3" style="text-align: right;">
              <el-button type="primary" @click="getProjectList()">查询</el-button>
              <el-button type="info" @click="resetForm('form') ">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <div
        style="height: 5px;background-color: #f3f3f3;border-top: 1px solid #dfe6f3;border-bottom: 1px solid #dfe6f3;"
      ></div>
      <!-- 页面主体 -->
      <!-- @select-all="tableCheckAll" -->
      <el-table 
        :data="tableData" 
        border 
        style="width: 100%;margin-top: 20px;">
        <el-table-column
          type="selection"
          align="center"
          width="55px">
        </el-table-column>
        <el-table-column 
          prop="originMonth" label="所属月份" 
          align="center" 
          width="">
          <!-- <template slot-scope="scope">
            <span style="color:#417095;cursor: pointer;" @click="toDetailPage('/expensesReim/expenseAppDetail',scope.row)">{{scope.row.appNum}}</span>
          </template> -->
        </el-table-column>
        <el-table-column 
          prop="affiliatedCompName" 
          label="所属公司" 
          align="center" 
          width="">
        </el-table-column>
        <el-table-column
          label="所属部门"
          align="center" 
          width=""
          prop="affiliatedDeptName">
          <!-- <template slot-scope="scope"></template> -->
        </el-table-column>
        <el-table-column 
          prop="realName" 
          label="姓名" 
          align="center"
          width="">
        </el-table-column>
        <el-table-column
          prop="workNum"
          label="工号"
          align="center"
          width="">
          <!--  <template slot-scope='scope'>
              <span></span>
           </template> -->
        </el-table-column>
        <el-table-column
          prop="workState"
          label="工作状态"
          align="center"
          width="">
           <!-- <template slot-scope='scope'>
              <span></span>
           </template> -->
        </el-table-column>
        <el-table-column
          prop="coefficientPerformance"
          label="执业绩效"
          align="center"
          width="">
           <!-- <template slot-scope='scope'>
              <span></span>
           </template> -->
        </el-table-column>
        <el-table-column
          prop="coefficientPerformance"
          label="市场绩效"
          align="center"
          width="">
           <!-- <template slot-scope='scope'>
              <span></span>
           </template> -->
        </el-table-column>
        <el-table-column 
          prop="monthBonus" 
          label="支撑绩效" 
          align="right" 
          width="">
        </el-table-column>
        <el-table-column
          prop="otherBonus"
          label="其他奖金及补款"
          width=""
          align="right">
        </el-table-column>
        <el-table-column 
          prop="bonusSum" 
          label="奖金合计" 
          align="center" 
          width="">
          <!-- <template slot-scope="scope">{{scope.row.bonusSum | moneyFormat}}</template> -->
        </el-table-column>
        <el-table-column 
          prop="remarks" 
          label="备注" 
          align="center" 
          width="">
        </el-table-column>
      </el-table>
      <!-- @size-change="handleSizeChange"
      @current-change="handleCurrentChange"-->
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
    </el-container>
  </div>
</template>

<script>
import axios from '../../service/http';
import { option } from '../../static/config';
export default {
  // 数据源
  data() {
    return {
      currentPage: 1,
        total: 0,//页数显示
        value1:'',//控制日期
        tableData:[],
        form: {
          realName:'',
          originMonth:'2020-07',
          workState:''
        },
        options: [{
          value: '1',
          label: '在职'
        }, {
          value: '2',
          label: '挂职'
        }, {
          value: '3',
          label: '挂靠'
        }, {
          value: '4',
          label: '离职'
        }],
        value: ''
    };
  },
  watch: {
    
  },
  // 初始化执行
  mounted() {
    this.getProjectList()
  },
  // 方法声明
  methods: {
    
    //手动切换每页条数
    handleSizeChange(val) {
      this.form.pageNum = val;
      console.log(`每页 ${val} 条`);
      //刷新
      this.getProjectList();
    },
    //手动切换页数
    handleCurrentChange(val) {
      this.form.pageIndex = val;
      console.log(`当前页: ${val}`);
      //刷新
      this.getProjectList();
      
    },
    // 重置
    resetForm(form) {
      this.form = {
          realName:'',
          originMonth:'',
          workState:''
      };
      this.getProjectList();
    },
    // 查询列表数据
    getProjectList() {
      var me = this;
      //调用axios.post方法
      //"CASPARAMS":"OFF_INDEX"
      axios
        .post(
          option.base_path +
            "wages/bonus/getBonusWagesListByParams",this.form
        )
        .then(res => {
          this.tableData = res.data.data.rows;
        //   this.tableData.forEach((item, i, arr) => {
        //     arr[i].show = true;
        //     console.log(arr);
        //   });
        console.log("返回值",this.tableData);
          this.total = res.data.data.total;
        })
        .catch(err => err);
    },
  },
  // 组件注册
  components: {},
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
  }
};
</script>

<style>

</style>

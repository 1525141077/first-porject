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
            <el-form-item label="关  键  字：" label-width='70px'>
              <el-input v-model="form.realName" class placeholder="请输入姓名" clearable style="width:100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="职 务：">
                <el-select v-model="form.positionCode" placeholder="请选择" clearable style="width:90%">
                    <el-option
                    v-for="item in positionList"
                    :key="item.positionCode"
                    :label="item.positionNameing"
                    :value="item.positionCode"
                    ></el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="职业资格：">
              <el-radio v-model="form.isLicensing" label="1">是</el-radio>
              <el-radio v-model="form.isLicensing" label="2">否</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="6" align='right'>
            <el-button @click='closeClick'>返回</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="年 龄：" label-width='50px'>
              <el-input v-model="form.startAge" class placeholder="请输入" clearable style="width:41%"></el-input>
              ——
              <el-input v-model="form.endAge" class placeholder="请输入" clearable style="width:41%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工作状态：" style="margin-bottom: 20px;">
              <el-select v-model="form.workState" placeholder="请选择" clearable style="width:90%">
                <el-option
                v-for="item in workStateList"
                :key="item.value"
                :label="item.disvalue"
                :value="item.value"
                ></el-option>
            </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="6"></el-col> -->
          <el-col :span="5" align='left'>
              <div style="text-align: end;">
            <el-button type="primary" @click="getProjectList()">查询</el-button>
            <el-button type="info" @click="resetForm('form')">重置</el-button>
              </div>

          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <div
      style="height: 5px;background-color: #f3f3f3;border-top: 1px solid #dfe6f3;border-bottom: 1px solid #dfe6f3;margin-bottom: 20px;"
    ></div>
    <!-- 按钮 -->
        <el-row style="margin:0px 10px;margin-top:15px;">
          <el-col :span="24" style="margin-bottom: 20px;" align='left'>
            <!-- <el-button type="primary" @click="open">导入数据</el-button> -->
            <!-- <el-button type="primary" @click="open">导出</el-button> -->
            <el-button type="primary" @click="open('/compensation/payAddForm')">添加缴费</el-button>
          </el-col>
        </el-row>
      <!-- //表格 -->
      <el-table
      border
      ref="singleTable"
      :data="tableData"
      highlight-current-row
      @current-change="handleCurrentChanges"
      style="width: 100%">
      <!-- <el-table-column prop="applicantTime" label="所属公司" align="center" width="120px"></el-table-column> -->
      <el-table-column prop="realName" label="姓名" header-align="center" align="center" width="80px">
        <template slot-scope='scope'>
          <span style="color:rgb(141,158,255);cursor: pointer;" @click='clickName("/compensation/attendanceList",scope.row)'>{{scope.row.realName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="workStateName" label="工作状态" header-align="center" align="center" width="100px"></el-table-column>
      <!-- <el-table-column prop="totalAmount" label="所属公司" align="center" width="100px"></el-table-column> -->
      <el-table-column prop="socialPayCompName" label="公积金实际缴纳公司" align="center"></el-table-column>
      <el-table-column prop="socialCompPayMoney" label="公积金公司实际缴纳金额" align="right">
        <template slot-scope='scope'>
          <span>{{scope.row.socialCompPayMoney | moneyFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="socialPersonalPayMoney" label="公积金个人缴纳金额" align="right">
        <template slot-scope='scope'>
          <span>{{scope.row.socialPersonalPayMoney | moneyFormat}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="totalAmount" label="合计	" align="center" width="100px"></el-table-column> -->
      <el-table-column prop="remarks" label="备注" align="left">
        <template slot-scope='scope'>
          <span>{{scope.row.remarks == '' ? '无' : scope.row.remarks}}</span>
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
  data () {
    return {
      form: {
        payMonthId:'',
        realName:'',
        positionCode:'',
        isLicensing:'',
        startAge:'',
        endAge:'',
        workState:'',
        queryParams: "",
        formType: "",
        startAmount: "",
        date: "",
        pageIndex: 1,
        pageNum: 15,
        pkId: "",
      },
      currentRow: null,
      total: 0,
      currentPage: 1,
      labelposition: "right",
      tableData: [],
      multipleSelection: [],
      workStateList:[],
      positionList:[],
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
  filters:{
    moneyFormat (num) {
      if (num) {
        num = Number(num)
        num = (num.toFixed(2) + '').replace(
          /\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,
          '$&,'
        )
      }
      return num || '0.00'
    }
  },
  // 初始化执行
  mounted () {
    this.getPostList()
    this.getAddRegionList()
    this.getProjectList()
  },
  // 方法声明
  methods: {
    // 点击返回
    closeClick(){
      this.$router.replace('/compensation/payAdminList')
    },
    // 获取职务的下拉列表
    getPostList(){
      axios.post(option.base_path + "%20base/accumulation/getAllPosition",
        {
          dictTypeCode: "positionCode"
        }
        ).then(res => {
          this.positionList = res.data.data;
        })
    },
    clickName(path, row){
      this.$router.replace({
          path: '/compensation/paySocalDetails',
          query: {
            pkId: row.pkId,
            // approvalState: 1,
            // costType: row.costType
          }
        });
    },
    //添加缴费
    open(path){
      if(this.currentRow==null){
        this.$message('请选中一条信息');
        }else{
          this.$router.replace({
          path: path,
          query: {
            pkId: this.currentRow.pkId,
            payMonthId:this.$route.query.payMonthId
            // approvalState: 1,
            // costType: row.costType
          }
        });
        }
    },
    // 获取工作状态的下拉列表
    getAddRegionList(){
        axios.post(option.base_path + "manpower/personnel/getDictInfoListByDictTypeCode",
        {
          dictTypeCode: "workState"
        }
        ).then(res => {
          this.workStateList = res.data.data;
        })
      },
      // 选中一行
      handleCurrentChanges(val) {
        this.currentRow = val;
        console.log("大丰收",this.currentRow.pkId)
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
    //获取列表数据
    getProjectList(){
        axios.post(option.base_path + "fundPayMonth/getFundPayMonthDetailsList",{
          payMonthId:this.$route.query.payMonthId,
          realName: this.form.realName,
          positionCode: this.form.positionCode,
          startAge: this.form.startAge,
          endAge:this.form.endAge,
          workState: this.form.workState,
          isLicensing:this.form.isLicensing
        }).then(res => {
          this.tableData = res.data.data.rows;
          this.total = res.data.data.total
        })
      },
  },
  // 组件注册
  components: {
  }
}
</script>
<style lang="stylus" scoped>

</style>

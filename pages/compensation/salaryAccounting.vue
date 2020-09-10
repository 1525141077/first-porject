<template>
    <div class="yt-dome-container">
        <!-- 头部信息 -->
        <el-form label-width="100px" size="small">
            <el-row >
              <el-col :span="7" style="margin-top: 20px;margin-left: 10px;"> 
                <el-form-item label="所  属  区  间：">
                    <el-date-picker
                    v-model="form.originMonth"
                    format="yyyy-MM"
                     value-format="yyyy-MM"
                    type="month"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="4" style="text-align: right;margin-top: 20px;">
                <el-button type="primary" @click="getProjectList()">查询</el-button>
                <el-button type="info" @click="resetForm('form')">重置</el-button>
              </el-col>
            </el-row>
          </el-form>
          <div
        style="height: 5px;background-color: #f3f3f3;border-top: 1px solid #dfe6f3;border-bottom: 1px solid #dfe6f3;"
      ></div>
      <el-row style="margin:15px 10px;">
        <el-col :span="3">
          <el-button type="primary" @click="account">一键核算</el-button>
        </el-col>
        <el-col :span="2" style="margin-left: -20px;">
          <el-button type="primary" @click="beforeExport">导出税前</el-button>
        </el-col>
      </el-row>
      <!-- 头部信息 -->
      <!-- 表格信息 -->
      <el-table
      :data="tableData"
       border
       show-summary
       highlight-current-row
    @current-change="handleCurrentChange"
      style="width: 100%">
      <el-table-column
        prop="originMonth"
        label="所属期间"
        align=center>
      </el-table-column>
      <el-table-column
        prop="shouldTotal"
        label="应发合计"
        align=right>
      </el-table-column>
      <el-table-column
        prop="actualTotal"
        label="扣税合计"
        align=right>
      </el-table-column>
      <el-table-column
        prop="taxDeductionTotal"
        label="实发合计"
        align=right>
      </el-table-column>
      <el-table-column
        prop="createUserName"
        label="创建人"
        align=center>
      </el-table-column>
      <el-table-column
      prop="operation"
        label="操作"
        width="100">
        <template slot-scope="scope">
            <i
              class="el-icon-edit"
              @click="toPage('./salaryModification',scope.row)"
              style="color:rgb(141,158,255);margin-left:20px"
            ></i>
            <i
            class="el-icon-delete"
              @click="deletes(scope.row,scope.$index)"
              style="color:rgb(141,158,255);margin-left:20px"
            ></i>
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
      <!-- 表格信息 -->
       <!-- 一键核算弹出框信息 -->
     <!-- 提示弹出框信息start -->
     <el-dialog title="支付确认" style="width:800px;" :visible.sync="dialogLogsVisible">
      <el-form :model="ruleForm"  ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <!-- <el-form-item label="所 属 期 间 : " required> -->
            <el-row>
            <el-col :span="21">
              <el-form-item prop="date1" label="所 属 期 间 : " :rules="[{ required: true, message:'请选择日期'}]" >
                <el-date-picker 
                value-format="yyyy-MM"
               type="month" 
               placeholder="选择日期"
                v-model="ruleForm.date1" 
                style="width: 200px;margin-left: 0px;"
                >
            </el-date-picker>
            <div  v-show="haveCustomerName" style="color: #F56C6C;font-size: 12px;line-height: 2;padding-top: 0px;position: absolute;top: 90%;left: 0;">{{message}}</div>
              </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col >
          <!-- </el-form-item> -->
          <el-form-item>
        <div style="text-align:center;padding-top:20px;margin-left: -100px;">
          <el-button type="primary" :visible.sync="dialogLogsVisible" @click="saveForm('ruleForm')">保存</el-button>
          <el-button type="info" :visible.sync="dialogLogsVisible" @click="dialogLogsVisible=false">取消</el-button>
        </div>
    </el-form-item>
</el-col>
</el-row>
      </el-form>
    </el-dialog>
    <!-- 一键核算弹出框信息 -->

    <!-- 导出税前弹出框信息 -->
     <!-- 提示弹出框信息start -->
     <el-dialog title="导出税前" style="width:800px;" :visible.sync="dialogLogsVisibleTwo">
      <el-form :model="ruleForm"  ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <!-- <el-form-item label="所 属 期 间 : " required> -->
            <el-row>
              <el-table
              ref="multipleTable"
              border
              :data="popupData"
              tooltip-effect="dark"
              @selection-change="tableCheck"
              style="width: 100%"
              >
              <el-table-column
                type="selection"
                width="55"
                align=center>
              </el-table-column>
              <el-table-column
                label="公司名称"
                width=""
                prop="affiliatedCompName">
                
              </el-table-column>
            </el-table>
        </el-row>
        <el-row>
            <el-col >
          <!-- </el-form-item> -->
          <el-form-item>
        <div style="text-align:center;padding-top:20px;margin-left: -100px;">
          <el-button type="primary" :visible.sync="dialogLogsVisibleTwo" @click="exports">导出</el-button>
          <el-button type="info" :visible.sync="dialogLogsVisibleTwo" @click="cencel">取消</el-button>
        </div>
    </el-form-item>
</el-col>
</el-row>
      </el-form>
    </el-dialog>
    <!-- 导出税前弹出框信息 -->
    </div>
  </template>
  
  <script>
  //一级标题
  import topTip from "../../components/topTip";
  //提交附件
  import upload from "../../components/upload";
  //查看附件
  import lookFiles from "../../components/lookFiles.vue";
  //axios接口组件
  import axios from "../../service/http";
  //配置文件
  import { option } from "../../static/config";
  export default {
    data() {
      return {
        listId:'',
        originMonthTwo:'',//单选行选中的月份
        currentPage: 1,
        total: 0,//页数显示
        dialogLogsVisible:false,
        dialogLogsVisibleTwo:false,
        value1:'',
        haveCustomerName:false,
        message:'',//弹出框提示信息
        form: {
            originMonth:'2020-07',
            pageIndex: 1,
            pageNum: 15
      },
      ruleForm: {
          date1: '2020-08',
        },
        tableData: [],
        popupData:[],
      };
    },
    components: {
      topTip,
      upload,
      lookFiles
    },
    mounted() {
        this.getProjectList();
        this.popupList()
    },
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
    // 查询列表数据
    getProjectList() {
      var me = this;
      //调用axios.post方法
      //"CASPARAMS":"OFF_INDEX"
      axios
        .post(
          option.base_path +
            "wages/afterTax/getAfterTaxMonthListByParams",
          this.form
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
    // 弹出框列表数据
    popupList() {
      var me = this;
      //调用axios.post方法
      //"CASPARAMS":"OFF_INDEX"
      axios
        .post(
          option.base_path +
            "fundPayMonth/getFundPayStatisticsComp",
          this.form
        )
        .then(res => {
          this.popupData = res.data.data;
        //   this.tableData.forEach((item, i, arr) => {
        //     arr[i].show = true;
        //     console.log(arr);
        //   });
        console.log("返回值",this.popupData);
          this.total = res.data.data.total;
        })
        .catch(err => err);
      
    },
    // 重置
    resetForm(form) {
      this.form = {
            originMonth:'2020-07',
            pageIndex: 1,
            pageNum: 15
      };
      this.getProjectList();
    },
     //跳转到修改页面
     toPage(path, row) {
      this.$router.replace({
        path: path,
        query: {
        afterTaxMonthId: row.originMonth,
        }
      });
    },
    // 删除列表数据
    deletes(row, index) {
        
      var me = this;
      //调用axios.post方法
      //"CASPARAMS":"OFF_INDEX"
      axios
        .post(
          option.base_path +
            "wages/afterTax/deleteAfterTaxMonth",
          {
              pkId:this.tableData[index].pkId,
          }
        )
        .then(res => {
            this.getProjectList();
        })
        .catch(err => err);
      
    },
    // 调用弹出框提示信息接口
    tips() {
        
        var me = this;
        //调用axios.post方法
        //"CASPARAMS":"OFF_INDEX"
        axios
          .post(
            option.base_path +
              "wages/afterTax/addAfterTaxMonth",
            {
                originMonth:this.ruleForm.date1,
            }
          )
          .then(res => {
            //   alert(res.data.data.message)
            this.message=res.data.message
            this.haveCustomerName=true
              console.log('第三方生物',res.data.message)
          })
          .catch(err => err);
        
      },
      //复选框选中信息
    tableCheck(val) {
      this.multipleSelection = val;
      console.log("第三方三",this.multipleSelection)

      var affiliatedComp="";
        
        //遍历每行选中的数据
        this.multipleSelection.forEach(a=>{
              
          affiliatedComp+=a.affiliatedComp+','
              // this.number.substring(this.number.length,this.number.length-1)
            })
        let id= affiliatedComp.substring(0,affiliatedComp.length-1)
        this.listId=id;
        console.log("沙发问问",id)
    },
    //点击核算显示弹出框
    account(){
        this.dialogLogsVisible=true;
        this.ruleForm.date1='2020-08'
        this.haveCustomerName=false;

    },
    //保存弹出框信息
    saveForm(formName) {
        console.log("是否是",this.ruleForm.date1)
        this.$refs[formName].validate((valid) => {
          if (valid) {
              this.tips()
           
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //导出税前弹出框
      beforeExport(){
console.log("是否是",this.tableData.length)
if(this.tableData.length==0){
  this.$message('请选中一行需要导出的数据');
}else{
  this.dialogLogsVisibleTwo=true
}
      },
      //取消上传
      cencel(rows){
        this.$refs.multipleTable.clearSelection();
        this.dialogLogsVisibleTwo=false
      },
      //导出
      exports(rows){
			let	afterTaxMonthId = this.listId;
			let	payComps = this.originMonthTwo;
			let pageParam = '&afterTaxMonthId=' + afterTaxMonthId + '&payComps=' + payComps;
      window.location.href = option.base_path + 'wages/bonus/exportExcelDataByBonusIds?' + pageParam;
       
      this.$refs.multipleTable.clearSelection();
        this.dialogLogsVisibleTwo=false
      },
      handleCurrentChange(val) {
        console.log("所得税范围",val.originMonth)
        this.originMonthTwo=val.originMonth
      }
    }
  };
  </script>
  
  <style scoped>
  </style>
  
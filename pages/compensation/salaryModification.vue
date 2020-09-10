<template>
    <div class="yt-dome-container">
        <!-- 头部信息 -->
        <el-form label-width="100px" size="small">
            <el-row >
              <el-col :span="7" style="margin-top: 20px;margin-left: -20px;"> 
                <el-form-item label="关  键  字：">
                    <el-input class placeholder="请输入关键字" v-model="form.realName" clearable></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="56" style="margin-top: 20px;margin-left: 0px;"> 
                <el-form-item label="实 缴 公 司：">
                    <el-select v-model="options.affiliatedComp" placeholder="请选择">
                        <el-option
                          v-for="item in options"
                          :key="item.affiliatedComp"
                          :label="item.affiliatedCompName"
                          :value="item.affiliatedComp">
                        </el-option>
                      </el-select>
                  </el-form-item>
              </el-col>
              <el-col :span="4" style="text-align: right;margin-top: 20px;margin-left: -60px;">
                <el-button type="primary" @click="getProjectList()">查询</el-button>
                <el-button type="info" @click="resetForm('form')">重置</el-button>
              </el-col>
              <el-col :span="8" style="text-align: right;margin-top: 20px;margin-left: 20px;">
                <el-button type="info" style="margin-left:100px ;" @click="toPage('./salaryAccounting')">返回</el-button>
              </el-col>
            </el-row>
          </el-form>
          <div
        style="height: 5px;background-color: #f3f3f3;border-top: 1px solid #dfe6f3;border-bottom: 1px solid #dfe6f3;"
      ></div>
      <el-row style="margin:15px 10px;">
        <el-col :span="3">
          <el-button type="primary" @click="orther">个税导入</el-button>
        </el-col>
        <el-col :span="4" style="margin-left: -35px;">
          <el-button type="primary" @click="closedialog(tableData)">批量添加个税抵扣</el-button>
        </el-col>
        <el-col :span="4" style="margin-left: -20px;">
            <el-button type="primary" @click="closedialogTwo(tableData)">批量修改税后扣除</el-button>
          </el-col>
          <el-col :span="2" style="margin-left: -20px;">
            <el-button type="primary" @click="exports">导出工资表</el-button>
          </el-col>
      </el-row>
      <!-- 头部信息 -->
      <!-- 表格信息 -->
      <el-table
    ref="multipleTable"
    border
    :data="tableData"
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
      label="姓名"
      width=""
      prop="realName">
      
    </el-table-column>
    <el-table-column
      prop="workNum"
      label="工号"
      width="">
    </el-table-column>
    <el-table-column
      prop="affiliatedComp"
      label="所属公司"
      show-overflow-tooltip>
    </el-table-column>
    <el-table-column
      label="实缴公司"
      width=""
      prop="payComp">
      
    </el-table-column>
    <el-table-column
      prop="monthBasicWages"
      label="月基本工资"
      width="">
    </el-table-column>
    <el-table-column
      prop="bonusSum"
      label="绩效奖金"
      show-overflow-tooltip>
    </el-table-column>
    <el-table-column
      label="福利津贴"
      width=""
      prop="flexibleBenefits">
      <!-- <template slot-scope="scope"></template> -->
    </el-table-column>
    <el-table-column
      prop="travelSubsidy"
      label="差旅补贴"
      width="">
    </el-table-column>
    <el-table-column
      prop="compPayMoney"
      label="社保公积金扣款"
      show-overflow-tooltip>
    </el-table-column>
    <el-table-column
      label="考勤扣款"
      width=""
      prop="attendanceDeduction">
      <!-- <template slot-scope="scope"></template> -->
    </el-table-column>
    <el-table-column
      prop="preTaxIncome"
      label="税前收入"
      width="">
    </el-table-column>
    <el-table-column
      prop="preTaxMoney"
      label="税前应扣金额"
      show-overflow-tooltip>
    </el-table-column>
    <el-table-column
      label="税前应发金额"
      width=""
      prop="actualAmount">
      <!-- <template slot-scope="scope"></template> -->
    </el-table-column>
    <el-table-column
      prop="indicidualIncomeTax"
      label="个人所得税"
      width="">
    </el-table-column>
    <el-table-column
      prop="afterTaxMonthId"
      label="税后应扣金额"
      show-overflow-tooltip>
    </el-table-column>
    <el-table-column
      prop="preTaxMoney"
      label="实发金额"
      show-overflow-tooltip>
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
      <!-- 批量添加个税抵扣弹出框信息start -->
     <el-dialog title="修改个税抵扣(天津)" style="width:1250px;" :visible.sync="dialogLogsVisibleTwo">
      <el-form>
        <el-row>
            <el-col :span="15">
                <el-form-item label="公积金贷款利息(天津)：" prop="content" label-width="160px" >
                    <finmoneyinput  :tail="'元'"></finmoneyinput>
                  </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="15">
                <el-form-item label="抵扣通讯费：" prop="content" label-width="95px" >
                    <finmoneyinput  v-model="money" :tail="'元'"></finmoneyinput>
                  </el-form-item>
            </el-col>
          </el-row>
        <div style="text-align:center;padding-top:20px">
          <el-button type="primary" :visible.sync="dialogLogsVisibleTwo" @click="sure()">确定</el-button>
          <el-button type="info" :visible.sync="dialogLogsVisibleTwo" @click="dialogLogsVisibleTwo=false">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!-- 批量添加个税抵扣弹出框信息end -->
    <!-- 批量修改个税抵扣弹出框信息start -->
    <el-dialog title="修改税后扣除" style="width:1250px;" :visible.sync="dialogLogsVisible">
        <el-form>
          <el-row>
              <el-col :span="15">
                  <el-form-item label="税后应扣金额：" prop="content" label-width="100px" >
                      <finmoneyinput  :tail="'元'"></finmoneyinput>
                    </el-form-item>
              </el-col>
            </el-row>
          <div style="text-align:center;padding-top:20px">
            <el-button type="primary" :visible.sync="dialogLogsVisible" @click="sureTwo()">确定</el-button>
            <el-button type="info" :visible.sync="dialogLogsVisible" @click="dialogLogsVisible=false">取消</el-button>
          </div>
        </el-form>
      </el-dialog>
      <!-- 批量修改个税抵扣弹出框信息end -->
      <!-- 个税导入提示弹出框信息start -->
     <el-dialog title="导入文件" style="width:900px;" :visible.sync="dialogLogsVisibleThree">
      <el-form  label-width="100px" >
        <!-- <el-form-item label="所 属 期 间 : " required> -->
          <el-row>
            <el-col :span="16">
              <div style="color: #F56C6C;font-size: 15px;line-height: 1;padding-top: 0px;position: absolute;top:25%;left: -1%;">*</div>
              <el-form-item label="文件名称 ："  label-width="80px" >
        <el-input  v-model="name" placeholder="请选择Excel文件"></el-input>
        <div  v-show="haveCustomerName" style="color: #F56C6C;font-size: 12px;line-height: 1;padding-top: 0px;position: absolute;top: 110%;left: 0;">请选择Excel文件</div>
      </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-upload
          class="upload-demo"
          ref="upload"
          action
          :before-upload="beforeUpload"
          :show-file-list="false"
          :auto-upload="true"
          
        >
        <el-button
            slot="trigger"
            size="small"
            type="primary"
            style="margin: 5px 0px 0px 10px;"
          >请上传</el-button>
        </el-upload>
            </el-col>
          </el-row>
        <el-row>
            <el-col >
          <!-- </el-form-item> -->
          <el-form-item>
        <div style="text-align:center;padding-top:20px;margin-left: -100px;">
          <el-button type="primary" :visible.sync="dialogLogsVisibleThree" @click="imports">确定</el-button>
          <el-button type="info" :visible.sync="dialogLogsVisibleThree" @click="dialogLogsVisibleThree=false">取消</el-button>
        </div>
    </el-form-item>
</el-col>
</el-row>
      </el-form>
    </el-dialog>
    <!-- 个税导入提示弹出框信息end -->
     <!-- 底部导入文件后部分 -->
     <div style="margin-top: 30px;" v-show=listShow>
      <!-- 头部提示框 -->
      <div style="height: 50px;background-color:rgb(65, 112, 149);line-height: 50px;">
        <span style="color: white;margin-left: 20px;">Excel导入-错误信息</span>
      </div>
      <el-row style="margin-top:20px" >
        <el-col :span="5">
          <span class="yt-read-text" style="letter-spacing:5px;margin-left:20px">错误数据条数：</span>
          <span>{{fileData.errorNum}}</span>
        </el-col>
        <div>
            <el-col :span="5">
              <span class="yt-read-text" style="letter-spacing:5px">成功数据条数：</span>
              <span>{{fileData.successNum}}</span>
            </el-col>
          </div>
      </el-row>
      <el-row>
        <el-button style="margin-left: 20px;margin-top: 20px;margin-bottom: 20px;" type="primary" @click="exports">导出错误数据</el-button>
      </el-row>
      <el-table
          :data="errorData"
          border
          style="width: 100%">
          <el-table-column
            prop="realName"
            label="姓名"
            align='center'
            width="">
          </el-table-column>
          <el-table-column
            prop="idCard"
            label="身份证号"
            width=""
            align='center'>
          </el-table-column>
          
          <el-table-column
            prop="originMonth"
            label="所属月份"
            align='center'>
          </el-table-column>
          <el-table-column
            prop="successData"
            label="税后扣除"
            align='center'>
          </el-table-column>
          
        </el-table>
          </div>
          <!-- 底部导入文件后部分 -->
    </div>
  </template>
  
  <script>
  //一级标题
  import topTip from "../../components/topTip";
  //金额输入框组件
  import finmoneyinput from "../../components/fin-money-input";
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
        pkids:'',//导出数据所需要传的id
        currentPage: 1,
        name:'',
        listShow:false,
        fileData:[],//获取导入文件列表
        errorData:[],//获取导入文件列表表格数据
        total: 0,//页数显示
        money:500,//抵扣通讯费金额
        haveCustomerName:false,
        dialogLogsVisibleTwo:false,//控制批量添加弹出框
        dialogLogsVisibleThree:false,//个税导入弹出框
        dialogLogsVisible:false,//控制批量修改弹出框
        options: [{
            affiliatedCompName:'',
        }
        ],
        value: '',
        tableData: [],
        multipleSelection:[],//复选框选中行的信息
        form:{
            realName:'',
            affiliatedComp:'',
            payComp:''
        },
      };
    },
    components: {
      topTip,
      upload,
      lookFiles,
      finmoneyinput
    },
    mounted() {
        this.getSelectOne();
        if (this.$route.query.afterTaxMonthId) {
       this.afterTaxMonthId = this.$route.query.afterTaxMonthId;
       this.getProjectList()
    }
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
    //复选框选中信息
    tableCheck(val) {
      this.multipleSelection = val;
      console.log("第三方三",this.multipleSelection)

      var pkId="";
        //遍历每行选中的数据
        this.multipleSelection.forEach(a=>{
              
              pkId+=a.pkId+','
              // this.number.substring(this.number.length,this.number.length-1)
            })
        let id= pkId.substring(0,pkId.length-1)
        this.pkids=id
        console.log("第三方三",this.pkids)
    },
    //批量添加弹出框部分，获取信息以及打开关闭弹出框
    closedialog(rows){
      if(this.multipleSelection.length == 0)
      {this.$message('请选中数据进行操作');}
else{
        this.dialogLogsVisibleTwo=true	
      }
      
    },
     //批量修改弹出框部分，获取信息以及打开关闭弹出框
     closedialogTwo(rows){
      if(this.multipleSelection.length == 0)
      {this.$message('请选中数据进行操作');}
else{
        this.dialogLogsVisible=true	
      }
      
    },
    //批量添加弹出框点击确定
    sure(){
 // this.number=''
          var pkId="";
        
        //遍历每行选中的数据
        this.multipleSelection.forEach(a=>{
              
              pkId+=a.pkId+','
              // this.number.substring(this.number.length,this.number.length-1)
            })
        let id= pkId.substring(0,pkId.length-1)
        this.pkids=id
        console.log("沙发问问",id)

         axios
        .post(option.base_path + "wages/afterTax/updatePreTaxDeductionBypkIds", {
          pkIds:id,
          ceynXjmDeduction:this.money
        })
        .then(data => {
         this.getProjectList();
         this.dialogLogsVisibleTwo=false;
         this.$message('修改成功');
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //批量修改弹出框点击确定
    sureTwo(){
 // this.number=''
          var pkId="";
        
        //遍历每行选中的数据
        this.multipleSelection.forEach(a=>{
              
              pkId+=a.pkId+','
              // this.number.substring(this.number.length,this.number.length-1)
            })
        let id= pkId.substring(0,pkId.length-1)
        console.log("沙发问问",id)

         axios
        .post(option.base_path + "wages/afterTax/updatePreTaxDeductionBypkIds", {
          pkIds:id,
          ceynXjmDeduction:this.money
        })
        .then(data => {
         this.getProjectList();
         this.dialogLogsVisible=false;
         this.$message('修改成功');
        })
        .catch(function(error) {
          console.log(error);
        });
    },
  // 查询列表数据
    getProjectList() {
      var me = this;
      //调用axios.post方法
      //"CASPARAMS":"OFF_INDEX"
      axios
        .post(
          option.base_path +
            "wages/afterTax/getAfterTaxMonthDetailsListByParams",{
                afterTaxMonthId:this.afterTaxMonthId,
                realName:this.form.realName,
                affiliatedComp:'',
                payComp:this.options.affiliatedComp
            }
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
     // 重置
     resetForm(form) {
        this.form.realName='',
        this.options.affiliatedComp='',

      this.getProjectList();
    },
    // 获取实缴公司下拉框
    getSelectOne(){
        var me = this;
      //调用axios.post方法
      //"CASPARAMS":"OFF_INDEX"
      axios
        .post(
          option.base_path +
            "fundPayMonth/getFundPayStatisticsComp"
        )
        .then(res => {
          this.options = res.data.data;
        //   this.tableData.forEach((item, i, arr) => {
        //     arr[i].show = true;
        //     console.log(arr);
        //   });
        console.log("撒方式",this.options);
        })
        .catch(err => err);
    },
    //返回到薪资管理页面
    toPage(path, row) {
      this.$router.replace({
        path: path,
        query: {
        }
      });
    },

      // 上传之前
      beforeUpload(file) {
      // 判断是否删除过文件
      let delFile = this.delFile;
      let fileLists = [];
      if (delFile) {
        // 删除过
        fileLists = this.oldFiles;
      } else {
        fileLists = this.fileList;
      }
      let fd = new FormData();
      fd.append("file", file);
      axios
        .post(option.base_path + "wages/afterTax/importAfterTaxMonthDetailsByExcel", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((data) => {
          let fileData = data.data.data;
          this.fileData=data.data.data;
          this.errorData=data.data.data.errorData;
          if (
              fileData.fileName.split(".")[1] == "xls" ||
              fileData.fileName.split(".")[1] == "xlsx"
            ) {
              fileLists.push(fileData);
            } else {
              this.$message.error("不支持的文件类型，请重新上传");
            }
          this.nameList = fileLists;
          console.log("文件上传", fileLists);
          this.$emit("upload", fileLists);
        })
        .catch(function (error) {
          console.log(error);
        });
        
        //下面这个接口主要是为了获取上传文件的名称，除此之外无其他用处
        axios
        .post(option.base_path + "fileUpDownload/upload", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((data) => {
          let fileDatas = data.data.data;
          this.name=fileDatas.naming
          // this.fileData=data.data.data;
          // this.errorData=data.data.data.errorData;
          if (
              fileDatas.fileName.split(".")[1] == "xls" ||
              fileDatas.fileName.split(".")[1] == "xlsx"
            ) {
              fileLists.push(fileDatas);
            } else {
              this.$message.error("不支持的文件类型，请重新上传");
            }
          this.nameList = fileLists;
          console.log("文件上传", fileLists);
          this.$emit("upload", fileLists);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    //打开弹出框
    orther(){
      this.dialogLogsVisibleThree=true;
      this.name='';
      this.haveCustomerName=false;
    },
    //导入表格
    imports(){
      if(this.name==''){
this.haveCustomerName=true
      }else{
        this.listShow=true;
      this.dialogLogsVisibleThree=false
      }
      
    },
    //导出表格
    exports(){
      if(this.multipleSelection.length == 0)
      {this.$message('请先选中需要导出收入证明的数据');
    }else{
      let	pkIds = this.pkids;
			// let pageParam = '&realName=' + realName + '&affiliatedDept=' + affiliatedDept + '&affiliatedComp=' + affiliatedComp + '&originMonth=' + originMonth;
      window.location.href = option.base_path + 'wages/afterTax/exportAfterTaxMonthDetails?pkIds='+ pkIds;
      }

    }
    }
  };
  </script>
  
  <style scoped>
  </style>
  
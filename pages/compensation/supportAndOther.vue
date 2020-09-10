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
              <el-button type="info" @click="resetForm('from') ">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <div
        style="height: 5px;background-color: #f3f3f3;border-top: 1px solid #dfe6f3;border-bottom: 1px solid #dfe6f3;"
      ></div>
      <!-- 页面主体 -->
      <el-row style="margin:15px 10px;">
        <el-col :span="4">
          <el-button type="primary" @click="orther">导入支撑和其他绩效</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="exports">导出数据</el-button>
        </el-col>
      </el-row>
      <!-- @select-all="tableCheckAll" -->
      <el-table 
        :data="tableData"
        @selection-change="tableCheck" 
        border 
        style="width: 100%">
        <el-table-column
          type="selection"
          align="center"
          width="55px">
        </el-table-column>
        <el-table-column 
          prop="originMonth" 
          label="所属月份" 
          align="center" 
          width="130px">
          <!-- <template slot-scope="scope">
            <span style="color:#417095;cursor: pointer;" @click="toDetailPage('/expensesReim/expenseAppDetail',scope.row)">{{scope.row.appNum}}</span>
          </template> -->
        </el-table-column>
        <el-table-column 
          prop="affiliatedCompName" 
          label="所属公司" 
          align="center" 
          width="130px">
        </el-table-column>
        <el-table-column
          label="所属部门"
          align="center" 
          width="120px"
          prop="affiliatedDeptName">
          <!-- <template slot-scope="scope"></template> -->
        </el-table-column>
        <el-table-column 
          prop="realName" 
          label="姓名" 
          align="center"
          width="150px">
        </el-table-column>
        <el-table-column
          prop="workNum"
          label="工号"
          align="center"
          width="120px">
          <!--  <template slot-scope='scope'>
              <span></span>
           </template> -->
        </el-table-column>
        <el-table-column
          prop="workState"
          label="工作状态"
          align="center"
          width="120px">
           <!-- <template slot-scope='scope'>
              <span></span>
           </template> -->
        </el-table-column>
        <el-table-column 
          prop="monthBonus" 
          label="支撑绩效" 
          align="right" 
          width="100px">
        </el-table-column>
        <el-table-column
          prop="otherBonus"
          label="其他奖金及补款"
          width="130px"
          align="right">
        </el-table-column>
        <el-table-column 
          prop="bonusSum" 
          label="小计" 
          align="center" 
          width="right">
          <!-- <template slot-scope="scope">{{scope.row.bonusSum | moneyFormat}}</template> -->
        </el-table-column>
        <el-table-column 
          prop="remarks" 
          label="备注" 
          align="center" 
          width="130px">
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
     
     <!-- 提示弹出框信息start -->
     <el-dialog title="导入文件" style="width:900px;" :visible.sync="dialogLogsVisible">
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
          <el-button type="primary" :visible.sync="dialogLogsVisible" @click="imports">确定</el-button>
          <el-button type="info" :visible.sync="dialogLogsVisible" @click="dialogLogsVisible=false">取消</el-button>
        </div>
    </el-form-item>
</el-col>
</el-row>
      </el-form>
    </el-dialog>
    <!-- 提示弹出框信息end -->
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
      prop="workNum"
      label="工号"
      width=""
      align='center'>
    </el-table-column>
    <el-table-column
      prop="workStateName"
      label="工作状态"
      align='center'>
    </el-table-column>
    <el-table-column
      prop="originMonth"
      label="所属月份"
      align='center'>
    </el-table-column>
    <el-table-column
      prop="monthBonus"
      label="月度奖金"
      align='center'>
    </el-table-column>
    <el-table-column
      prop="otherBonus"
      label="其他奖金"
      align='center'>
    </el-table-column>
  </el-table>
    </div>
    <!-- 底部导入文件后部分 -->
  </div>
</template>

<script>
import axios from '../../service/http';
import { option } from '../../static/config';
//提交附件
import upload from "../../components/upload";
export default {
  // 数据源
  data() {
    return {
      listId:'',
      file:'',//文件
      listShow:false,//控制页面底部显示隐藏
      fileData:[],//获取导入文件列表
      errorData:[],//获取导入文件列表表格数据
      currentPage: 1,
      name:'',//导入文件名字
        total: 0,//页数显示
        value1:'',//控制日期
        dialogLogsVisible:false,//控制弹出框显隐
        haveCustomerName:false,
        tableData:[],
        achievetables:[],
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
        
        console.log("返回值",this.tableData);
          this.total = res.data.data.total;
        })
        .catch(err => err);
    },
    //上传附件
    // upload(file) {
    //   // var data = eval("(" + file + ")");
    //   this.achievetables = this.forSetPage(file);
    //   this.name=this.achievetables[0].name
    //   this.file=file
    //   console.log("assac不是",this.achievetables)
    //   console.log("的范围为",file)

    // },
    // listType: {
    //   type: String,
    //   default() {
    //     return "text";
    //   },
    // },
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
        .post(option.base_path + "wages/bonus/importBonusWagesByExcel", fd, {
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
      this.dialogLogsVisible=true;
      this.name='';
      this.haveCustomerName=false;
    },
    //导入表格
    imports(){
      if(this.name==''){
this.haveCustomerName=true
      }else{
        this.listShow=true;
      this.dialogLogsVisible=false
      }
      
    },
    //复选框选中信息
    tableCheck(val) {
      this.multipleSelection = val;
      // console.log("第三方三",this.multipleSelection)
      var pkId="";
        
        //遍历每行选中的数据
        this.multipleSelection.forEach(a=>{
              
              pkId+=a.pkId+','
              // this.number.substring(this.number.length,this.number.length-1)
            })
        let id= pkId.substring(0,pkId.length-1)
        this.listId=id;
        console.log("沙发问问",id)
    },
    //导出数据
    exports(){
      // axios
      let	realName = this.form.realName;
      let bonusIds = this.listId;
			let	affiliatedDept = '';
			let	affiliatedComp = '';
			let	originMonth = this.form.originMonth;
			let pageParam = '&realName=' + realName + '&affiliatedDept=' + affiliatedDept + '&affiliatedComp=' + affiliatedComp + '&originMonth=' + originMonth;
      window.location.href = option.base_path + 'wages/bonus/exportExcelDataByBonusIds?bonusIds='+ bonusIds + pageParam;
       
    },
  },
  // 组件注册
  components: {
    upload,
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
  }
};
</script>

<style>
.el-upload-list{
  display: none;
}
</style>

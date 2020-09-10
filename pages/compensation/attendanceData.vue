<template>
  <div class="yt-dome-container">
    <el-header class="yt-header">
      <el-form ref="form" :model="form" label-width="110px" :label-position="labelposition" size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="所 属 期 间：">
              <el-date-picker v-model="form.originMonth" value-format="yyyy-MM" type="month" placeholder="选择月" size='small'>
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
            <el-button type="primary" @click="getProjectList()">查询</el-button>
            <el-button type="info" @click="resetForm('form')">重置</el-button>
            <!-- </div> -->
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <div
      style="height: 5px;background-color: #f3f3f3;border-top: 1px solid #dfe6f3;border-bottom: 1px solid #dfe6f3;margin-bottom: 20px;">
    </div>
    <!-- 按钮 -->
      <el-row style="margin:0px 10px;margin-top:15px;">
        <el-col :span="24" style="margin-bottom: 20px;">
          <!-- <el-button type="primary" @click="open">导入数据</el-button> -->
          <el-button type="primary"  @click="orther">导入数据</el-button>
          <el-button type="primary"  @click="exports">导出数据</el-button>
        </el-col>
      </el-row>
      <!-- //表格 -->
      <el-table
      border
      ref="tableData"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <!-- <el-table-column prop="applicantTime" label="所属公司" align="center" width="120px"></el-table-column> -->
      <el-table-column prop="originMonth" label="所属月份" header-align="center" align="center"></el-table-column>
      <el-table-column prop="realName" label="姓名" header-align="center" align="center" >
        <template slot-scope='scope'>
          <span style="color:rgb(141,158,255);cursor: pointer;" @click='nameClick("/compensation/attendanceList",scope.row)'>{{scope.row.realName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="workNum" label="工号" header-align="center"></el-table-column>
      <el-table-column prop="leaveDeduction" label="事病假扣款" align="center">
        <template slot-scope='scope'>
          <span>{{scope.row.leaveDeduction | moneyFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="businessTravel" label="差旅补贴" align="center">
        <template slot-scope='scope'>
          <span>{{scope.row.businessTravel | moneyFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="entryExitDeduction" label="入离职扣款" align="center">
        <template slot-scope='scope'>
          <span>{{scope.row.entryExitDeduction | moneyFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="probationDeduction" label="试用期扣款	" align="center">
        <template slot-scope='scope'>
          <span>{{scope.row.probationDeduction | moneyFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column label="合计" align="center">
        <template slot-scope='scope'>
          {{heji}}
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

     <!-- 提示弹出框信息start -->
    <el-dialog title="导入文件" style="width:900px;" :visible.sync="dialogLogsVisible">
      <el-form label-width="100px">
        <!-- <el-form-item label="所 属 期 间 : " required> -->
        <el-row>
          <el-col :span="16">
            <div
              style="color: #F56C6C;font-size: 15px;line-height: 1;padding-top: 0px;position: absolute;top:25%;left: -1%;"
            >*</div>
            <el-form-item label="文件名称 ：" label-width="80px">
              <el-input v-model="name" placeholder="请选择Excel文件"></el-input>
              <div
                v-show="haveCustomerName"
                style="color: #F56C6C;font-size: 12px;line-height: 1;padding-top: 0px;position: absolute;top: 110%;left: 0;"
              >请选择Excel文件</div>
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
          <el-col>
            <!-- </el-form-item> -->
            <el-form-item>
              <div style="text-align:center;padding-top:20px;margin-left: -100px;">
                <el-button type="primary" :visible.sync="dialogLogsVisible" @click="addimport">确定</el-button>
                <el-button
                  type="info"
                  :visible.sync="dialogLogsVisible"
                  @click="dialogLogsVisible=false"
                >取消</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <!-- 提示弹出框信息end -->
    <!-- 底部导入文件后部分 -->
    <div style="margin-top: 30px;" v-show="listShow">
      <!-- 头部提示框 -->
      <div style="height: 50px;background-color:rgb(65, 112, 149);line-height: 50px;">
        <span style="color: white;margin-left: 20px;">Excel导入-错误信息</span>
      </div>
      <el-row style="margin-top:20px">
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
        <el-button
          style="margin-left: 20px;margin-top: 20px;margin-bottom: 20px;"
          type="primary"
          @click="exports"
        >导出错误数据</el-button>
      </el-row>
      <el-table :data="errorData" border style="width: 100%">
        <el-table-column prop="realName" label="姓名" align="center" width></el-table-column>
        <el-table-column prop="workNum" label="工号" width align="center"></el-table-column>
        <el-table-column prop="workStateName" label="工作状态" align="center"></el-table-column>
        <el-table-column prop="originMonth" label="所属月份" align="center"></el-table-column>
        <el-table-column prop="monthBonus" label="月度奖金" align="center"></el-table-column>
        <el-table-column prop="otherBonus" label="其他奖金" align="center"></el-table-column>
      </el-table>
    </div>
    <!-- 底部导入文件后部分 -->
  </div>
</template>

<script>
  import axios from '../../service/http';
  import {option} from '../../static/config.js'
export default {
  // 数据源
  data () {
    return {
      form: {
        originMonth:'2020-08',
        queryParams: "",
        formType: "",
        startAmount: "",
        date: "",
        pageIndex: 1,
        pageNum: 15,
        pkId: "",
      },
      heji:0,
      total: 0,
      currentPage: 1,
      labelposition: "right",
      tableData: [],
      multipleSelection: [],
         listId: "",
      file: "", //文件
      name: "", //导入文件名字
      listShow: false, //控制页面底部显示隐藏
      fileData: [], //获取导入文件列表
      errorData: [], //获取导入文件列表表格数据
      dialogLogsVisible: false, //控制弹出框显隐
      haveCustomerName: false,
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
    this.getProjectList()
  },
  // 方法声明
  methods: {
    // 点击姓名跳转页面
    nameClick(path, row) {
      this.$router.replace({
        path: '/compensation/attendanceList',
        query: {
          pkId: row.pkId,
          // approvalState: 1,
          // costType: row.costType
        }
      });
    },
   


//打开弹出框
    orther() {
      this.dialogLogsVisible = true;
      this.name = "";
      this.haveCustomerName = false;
    },
    // 选中数据
     handleSelectionChange(val) {
       debugger
       this.multipleSelection = val;
      var bankId = "";
      //遍历每行选中的数据
      this.multipleSelection.forEach((a) => {
        bankId += a.pkId + ",";
      });
      let id = bankId.substring(0, bankId.length - 1);
      this.listId = id;
      },
 //导入表格
    addimport() {
      if (this.name == "") {
        this.haveCustomerName = true;
      } else {
        this.listShow = true;
        this.dialogLogsVisible = false;
      }
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
        .post(option.base_path + "wages/gant/importPersonnelBankByExcel", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((data) => {
          let fileData = data.data.data;
          this.fileData = data.data.data;
          this.errorData = data.data.data.errorData;
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
          this.name = fileDatas.naming;
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

    //导出数据
    exports() {
      // axios
      let params = this.form.params;
      let originMonth = this.form.originMonth;
      let attendanceIds = this.listId;
      let queryParams = "";
      let affiliatedDept = "";
      let affiliatedComp = "";
      let pageParam = "&queryParams=" + queryParams + "&affiliatedDept=" + affiliatedDept + "&affiliatedComp=" + affiliatedComp+"&originMonth="+originMonth;
      window.location.href =
        option.base_path +
        "wages/attendance/exportExcelDataByAttendanceIds?attendanceIds=" + attendanceIds +pageParam ;
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
    getProjectList(){
      axios
        .post(option.base_path + "wages/attendance/getMonthAttendanceListByParams", this.form)
          .then((res) => {
            // this.peopleList.push(man)
            this.tableData = res.data.data.rows;
            this.total = res.data.data.total;
            console.log("返回值", res.data.data);
            this.tableData.forEach((item,i) => {
              this.heji = parseInt(item.leaveDeduction + item.businessTravel + item.entryExitDeduction + item.probationDeduction)
              console.log(heji,'asad')
            })
          })
          .catch(function (error) {
            console.log(error);
      });
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
     
  },
  // 组件注册
  components: {
  }
}
</script>
<style lang="stylus" scoped>

</style>

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
              <el-input
                v-model="form.realName"
                class
                placeholder="请输入姓名"
                clearable
                style="width:90%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工作状态：" style="margin-bottom: 20px;">
              <el-select
                v-model="form.workState"
                placeholder="请选择工作状态"
                @change="onworkState"
                style="width:90%"
              >
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
          <el-col :span="6">
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
    <el-row style="margin:0px 10px;margin-top:15px">
      <el-col :span="24" style="margin-bottom: 20px;">
        <el-button type="primary" @click="orther">导入数据</el-button>
        <el-button type="primary" @click="exports">导出数据</el-button>
      </el-col>
    </el-row>
    <!-- //表格 -->
    <el-table :data="tableData" border style="width: 100%" @selection-change="tableCheck">
      <el-table-column type="selection" align="center" width="55"></el-table-column>
      <el-table-column prop="payComp" label="实缴公司" header-align="center" align="left">
          <template slot-scope="scope">
          <span>{{scope.row.payComp==""?"--":scope.row.payComp}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="realName" label="姓名" align="center" width="80px"></el-table-column>
      <el-table-column prop="workNum" label="工号" align="center" width="80px"></el-table-column>
      <el-table-column prop="workState" label="工作状态" align="center" width="100px">
         <template slot-scope="scope">
          <span>{{scope.row.workState==""?"--":scope.row.workState}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="postWage" label="基本工资" align="right" width="100px">
        <template slot-scope="scope">
          <span>{{scope.row.postWage | moneyFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="practisingAllowance" label="职务津贴" align="right" width="100px">
        <template slot-scope="scope">
          <span>{{scope.row.practisingAllowance | moneyFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="dutyAllowance" label="执业津贴" align="right" width="100px">
        <template slot-scope="scope">
          <span>{{scope.row.dutyAllowance | moneyFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="monthBasicWages" label="月基本工资和" align="right" width="120px">
        <template slot-scope="scope">
          <span>{{scope.row.monthBasicWages | moneyFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column prop label="操作" align="center" width="150px">
        <template slot-scope="scope">
          <i class="el-icon-delete del" @click="handleDelete(scope.row.pkId)"></i>
          <!-- <el-button size="mini" type="danger">删除</el-button> -->
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
    <el-dialog title="导入文件" :visible.sync="dialogLogsVisible" width="35%">
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
          <el-col :span="3">
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
          <el-col :span="3">
            <el-button type="primary" style="margin: 5px 0px 0px 10px;" @click="templates">下载模板</el-button>
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
      <el-table
        :data="errorData"
        border
        style="width: 100%"
        highlight-current-row
        @current-change="handleCurrentChanges"
      >
        <el-table-column prop="affiliatedCompName" label="所属公司" align="left" width></el-table-column>
        <el-table-column prop="realName" label="姓名" align="center" width></el-table-column>
        <el-table-column prop="workNum" label="工号" width align="center"></el-table-column>
        <el-table-column prop="originMonth" label="所属银行" align="center"></el-table-column>
        <el-table-column prop="monthBonus" label="银行卡号" align="center"></el-table-column>
        <el-table-column prop="bankDeposit" label="工作状态" align="center"></el-table-column>

        <el-table-column prop="postWage" label="岗位工资" align="center" width="100px">
          <template slot-scope="scope">
            <span>{{scope.row.postWage | moneyFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="practisingAllowance" label="职务津贴" align="center" width="100px">
          <template slot-scope="scope">
            <span>{{scope.row.practisingAllowance | moneyFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="dutyAllowance" label="执业津贴" align="center" width="100px">
          <template slot-scope="scope">
            <span>{{scope.row.dutyAllowance | moneyFormat}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 底部导入文件后部分 -->
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
        realName: "",
        pageIndex: 1,
        pageNum: 15,
        workState: "",
      },
      tissueList: [],
      total: 0,
      currentPage: 1,
      labelposition: "right",
      tableData: [],
      // listId: "",
      file: "", //文件
      name: "", //导入文件名字
      listShow: false, //控制页面底部显示隐藏
      fileData: [], //获取导入文件列表
      errorData: [], //获取导入文件列表表格数据
      dialogLogsVisible: false, //控制弹出框显隐
      haveCustomerName: false,
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
    // 选中数据
    handleCurrentChanges(val) {
      ;
      console.log(val);
      this.currentRow = val;
      // this.pkId = val.pkId;
    },
    // 重置
    resetForm(form) {
      this.form = {
        realName: "",
        formType: "",
        pageNum: 15,
        pageIndex: 1,
        date: "",
        startAmount: "",
        endAmount: "",
      };
      this.getProjectList();
    },
    //打开弹出框
    orther() {
      this.dialogLogsVisible = true;
      this.name = "";
      this.haveCustomerName = false;
    },

    //复选框选中信息
    tableCheck(val) {
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
    //下载模板
    templates() {
      let wageIds = "TC_PRE_WAGE_IMPORT";
      window.location.href =
        option.base_path +
        "fileUpDownload/downloadTemplate?templateCode=" +
        wageIds;
    },
    //导出数据
    exports() {
      // axios
      if (this.multipleSelection || this.currentRow) {
        let params = this.form.params;
        let wageIds = this.listId || this.currentRow.pkId;
        let realName = "";
        let affiliatedComp = "";
        let affiliatedDept = "";
        let pageParam =
          "&realName=" +
          realName +
          "&affiliatedDept=" +
          affiliatedDept +
          "&affiliatedComp=" +
          affiliatedComp;
        window.location.href =
          option.base_path +
          "wages/gant/exportWagesExcelData?wageIds=" +
          wageIds +
          pageParam;
      } else {
        this.$message("请选择数据");
      }
    },

    //工作状态下拉框
    gettissue() {
      axios
        .post(
          option.base_path + "manpower/personnel/getDictInfoListByDictTypeCode",
          {
            dictTypeCode: "workState",
          }
        )
        .then((res) => {
          if (res.data.flag == 0) {
            this.tissueList = res.data.data;
            console.log(this.tissueList, "bumen");
          }
          //   this.getPersonnelArchivesEnterInfo();
        });
    },
    //工作状态下拉
    onworkState(val) {
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
          sums[index] = "合计";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (!values.every((value) => isNaN(value))) {
          if (index > 5 && index != 10) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return this.moneyFormat(this.rmoney(prev) + this.rmoney(curr));
              } else {
                return prev;
              }
            }, 0);
          }

          // sums[index] += '.00';
        }
      });

      return sums;
    },
    // 查询
    getProjectList() {
      let that = this;
      axios
        .post(
          option.base_path + "wages/gant/getMonthWagesListByParams",
          this.form
        )
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
      let that = this;
      that
        .$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          axios
            .post(option.base_path + "wages/gant/deleteMonthWages", {
              pkId: id,
            })
            .then((res) => {
              this.getProjectList();
            });
          that.$message.success("删除成功");
        })
        .catch(() => {
          that.$message.info("已取消删除");
        });
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
.del {
  color: #003465;
  cursor: pointer;
}
</style>

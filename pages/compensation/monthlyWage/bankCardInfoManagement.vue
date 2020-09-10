<template>
  <div class="yt-dome-container">
    <el-header class="yt-header">
      <el-form ref="form" :model="form" label-width="110px" :label-position="labelposition" size="small">
        <el-row>
          <el-col :span="6">
            <el-form-item label="关  键  字：">
              <el-input v-model="form.params" class placeholder="请输入查询关键字" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工作状态：">
              <el-select v-model="form.workState" placeholder="请选择工作状态" @change="onworkState" style="width:90%">
                <el-option v-for="item in tissueList" :key="item.value" :label="item.disvalue" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="getProjectList()">查询</el-button>
            <el-button type="info" @click="resetForm('form')">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <div style="height: 5px;background-color: #f3f3f3;border-top: 1px solid #dfe6f3;border-bottom: 1px solid #dfe6f3;margin-bottom: 20px;"></div>
    <!-- 按钮 -->
    <el-row style="margin:0px 10px;margin-top:15px">
      <el-col :span="24" style="margin-bottom: 20px;">
        <el-button type="primary" @click="orther">导入数据</el-button>
        <el-button type="primary" @click="exports">导出数据</el-button>
        <el-button type="primary" @click="open">新增</el-button>
      </el-col>
    </el-row>
    <!-- //表格 -->
    <el-table :data="tableData" border style="width: 100%" @selection-change="tableCheck">
      <el-table-column type="selection" align="center" width="55"></el-table-column>
      <el-table-column prop="actualIssuingCompany" label="实际发放公司" align="center">
          <template slot-scope="scope">
          <span>{{scope.row.actualIssuingCompany==""?"--":scope.row.actualIssuingCompany}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="personnelName" label="姓名" align="center"></el-table-column>
      <el-table-column prop="workNum" label="工号" align="center"></el-table-column>
      <el-table-column prop="bankDeposit" label="所属银行" align="center"></el-table-column>
      <el-table-column prop="bankNumBer" label="银行卡号" align="center"></el-table-column>
      <el-table-column prop label="操作" align="center" width="150px">
        <template slot-scope="scope">
          <el-button size="mini" @click="amend(scope.$index,scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.bankId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background :current-page="currentPage" :page-sizes="[15, 30, 50, 100, 200, 500]" :page-size="15" layout="total, prev, pager, next, sizes" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
    <!-- 新增弹窗 -->
    <el-dialog :title="titleName" :visible.sync="dialogVisible" width="50%">
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-row v-if="titleName=='新增'">
          <el-col :span="12">
            <el-form-item label="姓名：" prop="personnelName" :rules="[{ required: true, message: '填写内容不符合'}]">
              <!-- <el-input v-model="ruleForm.deptName" placeholder="" ></el-input> -->
              <el-autocomplete class="inline-input" v-model="ruleForm.personnelName" :fetch-suggestions="querySearch" placeholder :trigger-on-focus="false" @select="handleSelect"></el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工号：" prop="workNum">
              <span class="readTxt">{{ruleForm.workNum==''?'自动带出':ruleForm.workNum}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row style="margin-bottom:20px" v-if="titleName=='修改'">
          <el-col :span="8">
            <span class="yt-read-text" style="margin-left:30px">所属公司：</span>
            <span>{{ this.ruleForm.affiliatedComp==""?"--":this.ruleForm.affiliatedComp}}</span>
          </el-col>
          <el-col :span="8">
            <span class="yt-read-text" style="margin-left:30px">姓名：</span>
            <span>{{ this.ruleForm.personnelName==""?"--":this.ruleForm.personnelName}}</span>
          </el-col>
          <el-col :span="8">
            <span class="yt-read-text" style="margin-left:30px">工号：</span>
            <span>{{ this.ruleForm.workNum==""?"--":this.ruleForm.workNum}}</span>
          </el-col>
        </el-row>

        <el-form-item label="所属银行：" prop="bankDeposit" :rules="[{ required: true, message: '所属银行不能为空'}]">
          <el-input v-model="ruleForm.bankDeposit" placeholder></el-input>
        </el-form-item>
        <el-form-item label="银行卡号：" prop="bankNumBer" :rules="[{ required: true, message: '银行卡号不能为空'}]">
          <el-input v-model="ruleForm.bankNumBer" placeholder></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdatePersonnelBank">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改弹窗
    <el-dialog title="修改" :visible.sync="dialog" width="50%">
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-row style="margin-bottom:20px">
          <el-col :span="8">
            <span class="yt-read-text" style="margin-left:30px">所属公司：</span>
            <span>{{ this.ruleForm.affiliatedComp==""?"--":this.ruleForm.affiliatedComp}}</span>
          </el-col>
          <el-col :span="8">
            <span class="yt-read-text" style="margin-left:30px">姓名：</span>
            <span>{{ this.ruleForm.personnelName==""?"--":this.ruleForm.personnelName}}</span>
          </el-col>
          <el-col :span="8">
            <span class="yt-read-text" style="margin-left:30px">工号：</span>
            <span>{{ this.ruleForm.workNum==""?"--":this.ruleForm.workNum}}</span>
          </el-col>
        </el-row>
        <el-form-item
          label="所属银行："
          prop="bankDeposit"
          :rules="[{ required: true, message: '所属银行不能为空'}]"
        >
          <el-input v-model="ruleForm.bankDeposit" placeholder></el-input>
        </el-form-item>
        <el-form-item
          label="银行卡号："
          prop="bankNumBer"
          :rules="[{ required: true, message: '银行卡号不能为空'}]"
        >
          <el-input v-model="ruleForm.bankNumBer" placeholder></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdatePersonnelBank">确 定</el-button>
      </span>
    </el-dialog>-->

    <!-- 提示弹出框信息start -->
    <el-dialog title="导入文件" width="35%" :visible.sync="dialogLogsVisible">
      <el-form label-width="100px">
        <!-- <el-form-item label="所 属 期 间 : " required> -->
        <el-row>
          <el-col :span="16">
            <div style="color: #F56C6C;font-size: 15px;line-height: 1;padding-top: 0px;position: absolute;top:25%;left: -1%;">*</div>
            <el-form-item label="文件名称 ：" label-width="80px">
              <el-input v-model="name" placeholder="请选择Excel文件"></el-input>
              <div v-show="haveCustomerName" style="color: #F56C6C;font-size: 12px;line-height: 1;padding-top: 0px;position: absolute;top: 110%;left: 0;">请选择Excel文件</div>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-upload class="upload-demo" ref="upload" action :before-upload="beforeUpload" :show-file-list="false" :auto-upload="true">
              <el-button slot="trigger" size="small" type="primary" style="margin: 5px 0px 0px 10px;">请上传</el-button>
            </el-upload>
          </el-col>
            <el-col :span="3">
             <el-button type="primary"  style="margin: 5px 0px 0px 10px;" @click="templates">下载模板</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <!-- </el-form-item> -->
            <el-form-item>
              <div style="text-align:center;padding-top:20px;margin-left: -100px;">
                <el-button type="primary" @click="addimport">确定</el-button>
                <el-button type="info" @click="dialogLogsVisible=false">取消</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <!-- 提示弹出框信息end -->
    <!-- 底部导入文件后部分 -->
    <div style="margin-top: 30px;" v-show="listShow" id="errorTab">
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
        <el-button style="margin-left: 20px;margin-top: 20px;margin-bottom: 20px;" type="primary" @click="exports">导出错误数据</el-button>
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
import axios from "@/service/http";
import { option } from "@/static/config";
import upload from "@/components/upload";
export default {
  // 数据源
  data() {
    return {
      form: {
        params: "",
        formType: "",
        startAmount: "",
        date: "",
        pageIndex: 1,
        pageNum: 15,
        pkId: "",
      },
      listId: "",
      file: "", //文件
      name: "", //导入文件名字
      listShow: false, //控制页面底部显示隐藏
      fileData: [], //获取导入文件列表
      errorData: [], //获取导入文件列表表格数据
      dialogLogsVisible: false, //控制弹出框显隐
      haveCustomerName: false,
      dialogVisible: false, //新增弹框
      surface: false, //编辑表格
      titleName: "新增",
      total: 0,
      currentPage: 1,
      labelposition: "right",
      tableData: [],
      tissueList: [],
      restaurants: [],
      ruleForm: {
        affiliatedComp: "",
        personnelName: "",
        workNum: "",
        bankDeposit: "",
        bankNumBer: "",
      },
    };
  },
  // 初始化执行
  mounted() {
    this.getProjectList();
    this.gettissue();
    this.getProjectManager();
  },
  // 方法声明
  methods: {
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
        bankId += a.bankId + ",";
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
    //下载模板
templates(){
  let wageIds = 'TC_BANK_IMPORT'
 window.location.href =
          option.base_path +
          "fileUpDownload/downloadTemplate?templateCode=" +
          wageIds;
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
      let bankIds = this.listId;
      let affiliatedComp = "";
      let pageParam = "&params=" + params + "&affiliatedComp=" + affiliatedComp;
      window.location.href =
        option.base_path +
        "wages/gant/exportPersonnelBankExcelData?bankIds=" +
        bankIds +
        pageParam;
    },

    //   新增弹窗
    open() {
      (this.ruleForm.personnelName = ""),
        (this.ruleForm.workNum = ""),
        (this.dialogVisible = true);
      this.surface = false;
      this.titleName = "新增";
    },
    //弹框取消
    cancel() {
      this.dialogVisible = false;
      this.$refs.ruleForm.resetFields();
    },
    //弹框input搜索
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) !==
          -1
        );
      };
    },
    // 下拉框
    handleSelect(item) {

      this.ruleForm.workNum = item.workNum;

      console.log(item);
    },
    saveOrUpdatePersonnelBank() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          axios
            .post(
              option.base_path + "wages/gant/saveOrUpdatePersonnelBank",
              this.ruleForm
            )
            .then((res) => {
              this.save();
            });
        }
      });
    },
    // 保存
    save() {
      if (this.surface == true) {
        this.surface = false;
        this.dialogVisible = false;
        this.tableData[
          this.tableDataIndex
        ].personnelName = this.ruleForm.personnelName;
        this.tableData[this.tableDataIndex].workNum = this.ruleForm.workNum;
        this.tableData[
          this.tableDataIndex
        ].bankDeposit = this.ruleForm.bankDeposit;
        this.tableData[
          this.tableDataIndex
        ].bankNumBer = this.ruleForm.bankNumBer;
        this.tableData[
          this.tableDataIndex
        ].affiliatedComp = this.ruleForm.affiliatedComp;
        this.$refs.ruleForm.resetFields();
      } else {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            //工作经历列表显示数据
            // this.tableData.push({
            //   personnelName: this.ruleForm.personnelName,
            //   workNum: this.ruleForm.workNum,
            //   bankDeposit: this.ruleForm.bankDeposit,
            //   bankNumBer: this.ruleForm.bankNumBer,
            // });
            this.dialogVisible = false;
            this.$refs.ruleForm.resetFields();
            this.getProjectList();
          }
        });
      }
    },
    //修改弹窗
    amend(index, row) {
      this.titleName = "修改";
      this.surface = true;
      this.dialogVisible = true;
      this.ruleForm.affiliatedComp = row.affiliatedComp;
      this.ruleForm.personnelName = row.personnelName;
      this.ruleForm.workNum = row.workNum;
      this.ruleForm.bankDeposit = row.bankDeposit;
      this.ruleForm.bankNumBer = row.bankNumBer;
      this.tableDataIndex = index;
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
        params: "",
        formType: "",
        pageNum: 15,
        pageIndex: 1,
        date: "",
        startAmount: "",
        endAmount: "",
      };
      this.getProjectList();
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
    getProjectManager() {
      axios
        .post(option.base_path + "manpower/personnel/getAllPersonnelList", {})
        .then((res) => {
          if (res.data.flag == 0) {
            let dataList = res.data.data;
            dataList.forEach((n) => {
              for (let key in n) {
                if (key === "personnelName") {
                  n["value"] = n["personnelName"];
                }
              }
              this.restaurants.push(n);
            });
          }
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
    // 查询
    getProjectList() {
      let that = this;
      axios
        .post(option.base_path + "wages/gant/getPersonnelBankList", this.form)
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
            .post(option.base_path + "wages/gant/deletePersonnelBankById", {
              bankId: id,
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
  // 组件注册
  components: {
    axios,
    upload,
  },
};
</script>
<style scoped>
.readTxt {
  color: gray;
  font-weight: 500;
}
.yt-read-text {
  color: #003465;
  font-weight: bold;
}
</style>

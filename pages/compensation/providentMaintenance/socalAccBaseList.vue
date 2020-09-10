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
              <el-input v-model="form.realName" class placeholder="请输入关键字" style="width:90%" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="地区：">
               <el-select
                v-model="form.regionOrigin"
                placeholder="请选择"
                @change="onregionOrigin"
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
          <el-col :span="6">
            <el-form-item label="职务：">
              <el-select
                v-model="form.positionCode"
                placeholder="请选择"
                @change="onpositionCode"
                style="width:90%"
              >
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
            <el-form-item label="执业资格：">
              <el-radio-group v-model="form.isLicensing">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="2">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="6">
            <el-button type="primary" @click="getProjectList()">查询</el-button>
            <el-button type="info" @click="resetForm('form')">重置</el-button>
          </el-col>-->
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="年龄：" style="margin-bottom: 0px;">
              <el-col :span="10">
                <el-form-item prop="ageStart">
                  <el-input
                    v-model.number="form.ageStart"
                    placeholder="请输入"
                    oninput="value=value.replace(/[^\d.]/g,'')"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="1">-</el-col>
              <el-col :span="10">
                <el-form-item prop="ageEnd">
                  <el-input
                    v-model.number="form.ageEnd"
                    placeholder="请输入"
                    oninput="value=value.replace(/[^\d.]/g,'')"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工作状态：" style="margin-bottom: 20px;">
              <el-select v-model="form.workState" placeholder="请选择工作状态" @change="onworkState"   style="width:90%">
              <el-option
                v-for="item in workStateList"
                :key="item.value"
                :label="item.disvalue"
                :value="item.value"
              ></el-option>
            </el-select>
            </el-form-item>
          </el-col>
           <el-col :span="9">
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
        <el-button type="primary"  @click="orther">导入</el-button>
        <el-button type="primary"  @click="exports">导出</el-button>
      </el-col>
    </el-row>
    <!-- //表格 -->
    <el-table :data="tableData" border style="width: 100%"  highlight-current-row
    @current-change="handleCurrentChanges">
      <el-table-column prop="regionOrigin" label="地区名称" align="center" width="300px"></el-table-column>
      <el-table-column prop="realName" label="姓名" align="center" width="100px">
         <template slot-scope="scope">
              <span>{{scope.row.realName==""?"--":scope.row.realName}}</span>
          </template>
      </el-table-column>
      <el-table-column prop="workState" label="工作状态" align="center" width="150px">
          <template slot-scope="scope">
              <span>{{scope.row.workState==""?"--":scope.row.workState}}</span>
          </template>
      </el-table-column>
      <el-table-column prop="payBaseMoney" label="公积金基数" align="right" width="150px">
          <template slot-scope="scope">
              <span>{{scope.row.payBaseMoney | moneyFormat}}</span>
          </template>
      </el-table-column>
      <el-table-column prop="medicalPayBaseMoney" label="医疗保险基数" align="right" width="150px">
          <template slot-scope="scope">
              <span>{{scope.row.medicalPayBaseMoney | moneyFormat}}</span>
          </template>
      </el-table-column>
      <el-table-column prop="birthPayBaseMoney" label="生育保险基数" align="right" width="150px">
          <template slot-scope="scope">
              <span>{{scope.row.birthPayBaseMoney | moneyFormat}}</span>
          </template>
      </el-table-column>
      <el-table-column prop="injuredPayBaseMoney" label="工伤保险基数" align="right" width="150px">
          <template slot-scope="scope">
              <span>{{scope.row.injuredPayBaseMoney | moneyFormat}}</span>
          </template>
      </el-table-column>
      <el-table-column prop="pensionPayBaseMoney" label="养老保险基数" align="right" width="150px">
          <template slot-scope="scope">
              <span>{{scope.row.pensionPayBaseMoney | moneyFormat}}</span>
          </template>
      </el-table-column>
      <el-table-column prop="joblessPayBaseMoney" label="失业保险基数" align="right" width="150px">
          <template slot-scope="scope">
              <span>{{scope.row.joblessPayBaseMoney | moneyFormat}}</span>
          </template>
      </el-table-column>
      <el-table-column prop="remarks" label="备注" align="left" width="100px">
          <template slot-scope="scope">
              <span>{{scope.row.remarks ||"无"}}</span>
          </template>
      </el-table-column>
      <el-table-column prop label="操作" align="center" width="100px">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.pkId)">删除</el-button>
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
    <el-dialog title="导入文件"  width="35%" :visible.sync="dialogLogsVisible">
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
             <el-button type="primary"  style="margin: 5px 0px 0px 10px;" @click="templates">下载模板</el-button>
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
import axios from "@/service/http";
import { option } from "@/static/config";
export default {
  // 数据源
  data() {
    return {
      form: {
        realName: "",
        regionOrigin: "",
        positionCode: "",
        workState:"",
        pageIndex: 1,
        pageNum: 15,
        isLicensing: "",
        ageStart:"",
        ageEnd:"",
      },
tissueList:[],//地区
positionList:[],//职务
workStateList:[],//工作状态
      total: 0,
      currentPage: 1,
      labelposition: "right",
      tableData: [],
        // pkId: "",
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
    this.getAllPosition();
    this.getDictInfoListByDictTypeCode();
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
    // 重置
    resetForm(form) {
      this.form = {
         realName: "",
        regionOrigin: "",
        positionCode: "",
        workState:"",
        pageIndex: 1,
        pageNum: 15,
        isLicensing: "",
        ageStart:"",
        ageEnd:"",
      };
      this.getProjectList();
    },


//下载模板
templates(){
  let wageIds = 'TC_PRE_FUND_IMPORT'
 window.location.href =
          option.base_path +
          "fileUpDownload/downloadTemplate?templateCode=" +
          wageIds;
},

 //打开弹出框
    orther() {
      this.dialogLogsVisible = true;
      this.name = "";
      this.haveCustomerName = false;
    },
    // 选中数据
     handleCurrentChanges(val) {

       console.log(val)
        this.currentRow = val;
        // this.pkId = val.pkId;
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
      let params =  this.form.workState;
      let baseIds =  this.currentRow.pkId;
      let realName = "";
      let regionOrigin = "";
      let positionCode = "";
      let isLicensing = "";
       let ageStart = "";
        let ageEnd = "";
         let compCode = "";

      let pageParam = "&realName=" + realName + "&regionOrigin=" + regionOrigin + "&positionCode=" + positionCode  + "&isLicensing=" + isLicensing  + "&ageStart=" + ageStart + "&ageEnd=" + ageEnd + "&compCode=" + compCode;
      window.location.href =
        option.base_path +
        "base/accumulation/exportWagesExcelDataByBaseIds?baseIds=" + baseIds +pageParam +params;
    },








    //工作状态下拉框
    getDictInfoListByDictTypeCode() {
      axios
        .post(option.base_path + "manpower/personnel/getDictInfoListByDictTypeCode",
         {
            dictTypeCode:"workState"
          })
        .then((res) => {
          if (res.data.flag == 0) {
            this.workStateList = res.data.data;
          }
        //   this.getPersonnelArchivesEnterInfo();
        });
    },
    //工作状态下拉
   onworkState(val){
     this.workStateList.forEach((item) => {
        if (item.value == val) {
          this.form.workState = item.value;
        }
        // this.getWorkNum();
      });
  },




      //地区下拉框
    gettissue() {
      axios
        .post(option.base_path + "manpower/personnel/getDictInfoListByDictTypeCode", {
          dictTypeCode: "native",
        })
        .then((res) => {
          if (res.data.flag == 0) {
            this.tissueList = res.data.data;
          }
        });
    },
    //地区下拉
    onregionOrigin(val) {
      this.tissueList.forEach((item) => {
        if (item.value == val) {
          this.form.regionOrigin = item.value;
        }
      });
    },
    //职务
    getAllPosition(){
  axios
        .post(option.base_path + "%20base/accumulation/getAllPosition")
        .then((res) => {
          if (res.data.flag == 0) {
            this.positionList = res.data.data;
          }
        });
    },
    // 职务下拉框
    onpositionCode(val){
     this.positionList.forEach((item) => {
        if (item.positionCode == val) {
          this.form.positionCode = item.positionCode;
        }
      });
    },
    // 查询
    getProjectList() {
      let that = this;
        axios
          .post(option.base_path + "base/accumulation/getBaseListByParams", this.form)
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
      let that =this;
        that.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
         axios.post(option.base_path + "base/accumulation/deleteBaseBypkId", {
              pkId:id,
         }).then(res => {
        this.getProjectList()
         })
      that.$message.success('删除成功')

      }).catch(() => {
          that.$message.info('已取消删除')
          })
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
</style>

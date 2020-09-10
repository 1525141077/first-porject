<template>
  <div class="dome-container">
    <!-- 页面关键字搜索模块START -->
    <el-header class="yt-header">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="6">
            <el-form-item label="关  键  字：">
              <el-input class placeholder="请输入关键字" v-model="form.params" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" style="margin-left: 10px;">
            <el-form-item label="部门组织：">
              <el-select v-model="form.deptId" @change="onJob" placeholder="请选择">
                <!-- <el-option v-for="item in list" :key="item.value" :value="item.value" :label="item.label"></el-option> -->
                <el-option
                  v-for="item in positionList"
                  :key="item.deptId"
                  :label="item.deptName"
                  :value="item.deptId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" style="margin-left: 10px;">
            <el-form-item label="工作状态：">
              <el-select v-model="form.workState" @change='changeWork' placeholder="请选择" clearable>
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.disvalue"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3" style="text-align: right;">
            <el-button type="primary" @click="getMessage()">查询</el-button>
            <el-button type="info" @click="resetForm('form') ">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <!-- 页面关键字搜索模块END -->
    <!-- 表格主体START -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="workNum" label="工号" width="100" align="center"></el-table-column>
      <el-table-column prop="realName" label="姓名" width="100" align="center">
        <template slot-scope="scope">
          <a
            style="color:#417095;cursor: pointer;"
            @click="toPage('/expensesReim/expenseAppDetail',scope.row)"
          >{{scope.row.realName}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="workStateName" label="工作状态" width="100" align="center"></el-table-column>
      <el-table-column
        v-if ='State'
        prop="employDate"
        label="入职时间"
        width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        v-else
        prop="demissionDate"
        label="离职时间"
        width="100"
        align="center"
      ></el-table-column>
      <el-table-column prop="deptName" label="部门组织" align="left"></el-table-column>
      <el-table-column prop="positionName" label="岗位" width="100" align="center"></el-table-column>
      <el-table-column prop="idCard" label="身份证号" width="200" align="center"></el-table-column>
      <el-table-column prop="phone" label="电话" width="200" align="center"></el-table-column>
      <el-table-column prop="dangqiang" label="操作" width="80" align="center">
        <template slot-scope="scope">
          <i
            class="el-icon-edit"
            style="color:rgb(141,158,255);margin-left:20px;cursor: pointer;"
            @click="toPage2('/expensesReim/expenseAppDetail',scope.row)"
          ></i>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格主体END -->
    <!-- //分页 -->
    <el-pagination
      background
      :current-page="currentPage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[15, 30, 50, 100, 200, 500]"
      :page-size="15"
      layout="total, prev, pager, next,sizes"
      :total="total"
      >
    </el-pagination>
    <!-- <el-pagination
      background
      :current-page="currentPage"
      :page-sizes="[15, 30, 50, 100, 200, 500]"
      :page-size="15"
      layout="total, prev, pager, next, sizes"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination> -->
  </div>
</template>

<script>
import axios from "../../service/http";
import { option } from "../../static/config.js";
export default {
  // 数据源
  data() {
    return {
      options: [],
      value: "",
      form: {
        params: "",
        deptId: "",
        deptName: "",
        workState: "",
        date: "",
        startAmount: "",
        endAmount: "",
        pageIndex: 1,
        pageNum: 15,
        deptTypeName: "",
        deptType: "",
      },
      positionList:[],
      total:0,//总页条数
      currentPage: 1,//页码大小
      tableData:[
      ],
      // positionList:[],
      // total:0,//总页条数
      // currentPage: 1,//页码大小
      // tableData:[],
      // positionList: [],
      // total: 0, //总页条数
      // currentPage: 1, //页码大小
      // tableData: [],
      asd:1,
      State:true,
    };
  },
  // 初始化执行
  mounted() {
    this.getMessage();
    this.getDropDown();
    this.getAllDeptPosition();
  },
  // 方法声明
  methods: {
    changeWork(val){
      // if(res.data.data.rows.workState===0){
      //       this.State=false
      //     }
      // if(val==0){
      //   this.State=false
      // }else{
      //   this.State=true
      // }
      // debugger
        // if()
        // this.form.workState =
        // // this.getMessage();
        // this.asd = 1
        // this.getMessage();
    },
    // 获取下拉列表
    getDropDown() {
      axios
        .post(
          option.base_path + "manpower/personnel/getDictInfoListByDictTypeCode",
          {
            dictTypeCode: "workState",
            // disvalue:this.form.deptTypeName,
            // value:this.form.deptType,
          }
        )
        .then((res) => {
          if (res.data.flag == 0) {
            this.options = res.data.data;
            console.log(this.positionList, "bumen");
          }
        });
    },
    // 20）获取全部部门组织以及岗位信息（二级联动）
    getAllDeptPosition() {
      axios
        .post(
          option.base_path + "manpower/dept/getAllDeptPosition",
        )
        .then((res) => {
          if (res.data.flag == 0) {
            this.positionList = res.data.data;
            console.log(this.positionList, "bumen");
          }
        });
    },
    // 获取下拉列表
    getDropDown() {
      axios
        .post(
          option.base_path + "manpower/personnel/getDictInfoListByDictTypeCode",
          {
            dictTypeCode: "workState",
            // disvalue:this.form.deptTypeName,
            // value:this.form.deptType,
          }
        )
        .then((res) => {
          if (res.data.flag == 0) {
            this.options = res.data.data;
            console.log(this.positionList, "bumen");
          }
        });
    },
    //岗位
    onJob(val) {
      this.positionList.forEach((item) => {
        if (item.deptId == val) {
          this.form.deptTypeName = item.deptTypeName;
        }
      });
    },
    toPage(path, row) {
      this.$router.replace({
        path: "/personnelArchives/personnelArchivesEnter",
        query: {
          personnelId: row.personnelId,
          archivesState: 2,
        },
      });
    },
    toPage2(path, row) {
      this.$router.replace({
        path: "/personnelArchives/personnelArchivesEnter",
        query: {
          personnelId: row.personnelId,
          // archivesState: 2,
        },
      });
    },
    getMessage() {
      debugger
      let map = {
        params: this.form.params,
        deptId: this.form.deptId,
        workState: this.form.workState,
        pageIndex: this.form.pageIndex,
        pageNum: this.form.pageNum
      }
      axios
        .post(
          option.base_path + "manpower/personnel/getPersonnelListByParams",
          map
        )
        .then((res) => {
          // console.log(this.data.data.rows)
          console.log("rengong", res);
          this.tableData = res.data.data.rows;
          this.total = res.data.data.total;
          if(this.form.workState==""){
            this.State=true
          }else{
            if(this.form.workState==0){
              this.State=false
            }else{
              this.State=true
            }
          }
          // if(this.tableData.workStateName=="离职")
        })
        .catch((error) => {
          console.log("异常", error);
        });

      // console.log(this.label,'asdasda')
    },
    handleSizeChange(val) {
      this.form.pageNum = val;
      console.log(`每页 ${val} 条`);
      this.getMessage();
    },
    handleCurrentChange(val) {
      this.form.pageIndex = val;
      console.log(`当前页: ${val}`);
      this.getMessage();
    },
    // 重置
    resetForm(form) {
      this.form = {
        pageNum: 15,
        pageIndex: 1,
        params: "",
        deptId: "",
        workState: "",
        date: "",
        startAmount: "",
        endAmount: "",
      };
      this.getMessage();
    },
  },
  // 组件注册
  components: {},
};
</script>
<style lang="stylus" scoped></style>

<template>
  <div class="yt-dome-container">
    <el-header class="yt-header">
      <el-form ref="form" :model="form" label-width="110px" :label-position="labelposition" size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="所 属 期 间：">
              <el-date-picker v-model="form.durationStay" value-format="yyyy-MM" type="month" placeholder="选择月" size='small'>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="类   别：">
              <el-select v-model="form.category" placeholder="请选择" clearable style="width:90%">
                <el-option label="请选择" value="0"></el-option>
                <el-option label="公积金" value="1"></el-option>
                <el-option label="社保" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="6">
            <el-form-item label="所 属 公 司：">
              <el-select v-model="form.formComp" placeholder="请选择" clearable style="width:90%">
                <el-option label="请选择" value="0"></el-option>
                <el-option label="会计师事务所" value="1"></el-option>
                <el-option label="中正和资产评估" value="2"></el-option>
                <el-option label="工程造价" value="3"></el-option>
                <el-option label="北京分所审计部" value="4"></el-option>
                <el-option label="机构投资中心" value="5"></el-option>
                <el-option label="税务师事务所" value="6"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
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
    <el-row style="margin:0px 10px;margin-top:10px">
      <el-col :span="24" style="margin-bottom: 20px;">
        <el-button type="primary" @click="addMessage()">新增</el-button>
      </el-col>
    </el-row>
    <!-- 按钮END -->
    <!-- //表格 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="regionOriginName" label="所属地区" align="center"></el-table-column>
      <el-table-column prop="category" label="缴纳类别" header-align="center" align="center">
        <template slot-scope="scope">
          {{scope.row.category == '1' ? '公积金' : '社保'}}
        </template>
      </el-table-column>
      <el-table-column prop="payCompName" label="实际缴纳公司" header-align="center" align="center"></el-table-column>
      <el-table-column prop="durationStay" label="所属期间" align="center"></el-table-column>
      <el-table-column prop="createUserName" label="创建人" align="center"></el-table-column>
      <el-table-column prop label="操作" align="center" width='100' >
        <template slot-scope="scope">
          <i class="el-icon-edit" style="color:rgb(141,158,255);margin-left:20px;cursor: pointer;" @click='edit("/compensation/payAdminListExit",scope.row)'></i>
          <i class="el-icon-delete del" style="color:rgb(141,158,255);margin-left:20px;cursor: pointer;" @click="handleDelete(scope.row.pkId,scope.row)"></i>
          <!-- <el-button size="mini" type="danger">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background :current-page="currentPage" :page-sizes="[15, 30, 50, 100, 200, 500]" :page-size="15"
      layout="total, prev, pager, next, sizes" :total="total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange"></el-pagination>
    <!-- 新增弹出框 -->
    <el-dialog title="新增岗位" :visible.sync="dialogVisible" width="50%">
      <div>
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="所属地区：" :rules="{required: true,message: '请输入岗位名称',trigger: 'blur'}">
                 <el-select v-model="disvalue" @change='regionChange' placeholder="请选择" clearable style="width:90%">
                  <el-option
                  v-for="item in region"
                  :key="item.value"
                  :label="item.disvalue"
                  :value="item.value"
                ></el-option>
                  </el-select>
            </el-form-item>
             <el-form-item label="类别：" :rules="{required: true,message: '请输入岗位名称',trigger: 'blur'}">
                 <el-select v-model="category" placeholder="请选择" clearable style="width:90%">
                    <el-option label="请选择" value="0"></el-option>
                    <el-option label="公积金" value="1"></el-option>
                    <el-option label="社保" value="2"></el-option>
                  </el-select>
             </el-form-item>
             <el-form-item label="实际缴纳公司:" :rules="{required: true,message: '请输入岗位名称',trigger: 'blur'}">
                 <el-select v-model="affiliatedComp" @change='affiliatedChange' placeholder="请选择" clearable style="width:90%">
                  <el-option
                  v-for="item in positionList"
                  :key="item.affiliatedComp"
                  :label="item.affiliatedCompName"
                  :value="item.affiliatedComp"
                ></el-option>
                  </el-select>
             </el-form-item>
             <el-form-item label="所属期间：">
                <el-date-picker
                  v-model="durationStay"
                  type="month"
                  placeholder="选择月"
                  value-format="yyyy-MM"
                  >
                </el-date-picker>
             </el-form-item>
        </el-form>
        <div class="footer-bottom">
          <el-button type="primary" @click="save1">保存</el-button>
          <el-button @click="close">关闭</el-button>
        </div>
      </div>
    </el-dialog>
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
          queryParams: "",
          durationStay:'2020-08',
          category:"",
          pageIndex: 1,
          pageNum: 15,
          pkId: "",
        },
        affiliatedCompName:'',
        value:'',
        disvalue:'',
        affiliatedComp:'',
        dialogVisible: false,
        positionList:[],
        region:[],
        ruleForm: {
          positionName: "",
          positionRemarks: ""
        },
        regionOrigin: '',
        category: '',
        regionOrigin: '',
        payComp: '',
        durationStay: '',
        total: 0,
        currentPage: 1,
        labelposition: "right",
        tableData: [],
      }
    },
    // 初始化执行
    mounted() {
      this.getProjectList();
      this.getAddList()
      this.getAddRegionList()
    },
    // 方法声明
    methods: {
      // 点击编辑跳转至新页面
      edit(path, row){
        this.$router.replace({
          path: '/compensation/payAdminListExit',
          query: {
            payMonthId: row.pkId
          }
        });
      },
      // 获取地区的value
      regionChange(val){
        this.region.forEach((item) => {
        if (item.value == val) {
//   this.as.deptTypeName = item.disvalue;
          this.value = item.value;
        }
      });
      },
      // 获取实缴公司的affiliatedComp
      affiliatedChange(val){
        this.positionList.forEach((item) => {
        if (item.affiliatedComp == val) {
//           this.as.deptTypeName = item.disvalue;
          this.affiliatedComp = item.affiliatedComp;
        }
      });
      },
      // 获取实缴公司的下拉列表
      getAddList(){
        axios.post(option.base_path + "fundPayMonth/getFundPayStatisticsComp",
        {
          dictTypeCode: "affiliatedComp"
        }
        ).then(res => {
          this.positionList = res.data.data;
        })
      },
      // 获取所属地区的下拉列表
      getAddRegionList(){
        axios.post(option.base_path + "manpower/personnel/getDictInfoListByDictTypeCode",
        {
          dictTypeCode: "native"
        }
        ).then(res => {
          this.region = res.data.data;
        })
      },
      // 获取数据
      getProjectList() {
        let that = this;
        axios
          .post(option.base_path + "fundPayMonth/getFundPayMonthList", this.form)
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
      // 弹窗保存按钮
      save1(){
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            axios.post(option.base_path+"fundPayMonth/addFundPayMonth",{
              regionOrigin: this.value,
              category: this.category,
              payComp: this.affiliatedComp,
              durationStay: this.durationStay,
            }).then(res => {
              this.getProjectList()
              // this.ruleForm = res.data.data
            })
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      // 关闭弹窗
      close(){
        this.dialogVisible = false
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
      // 点击新增显示弹窗
      addMessage() {
        this.dialogVisible = true;
      },
      // 列表中点击删除
      handleDelete(id){
        let that =this;
          that.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.post(option.base_path + "fundPayMonth/deleteFundPayMonth", {
            pkId:id,
          }).then(res => {
            if (res.data.flag == 0) {
                  this.getProjectList()
                  // this.dialogVisible =false
                  // this.$refs.ruleForm.resetFields();
                }
          })
          that.$message.success('删除成功')
        }).catch(() => {
            that.$message.info('已取消删除')
            })
      }
    },
    // 组件注册
    components: {
    }
  }
</script>
<style scoped>
.footer-bottom {
    text-align: center;
    width: 100%;
  }
  .el-form-item__label{
    width: auto !important;
  }
</style>

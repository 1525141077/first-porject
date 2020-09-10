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
              <el-input v-model="form.payScaleName" class placeholder="请输入关键字" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="地区：">
              <el-select
                v-model="form.regionOrigin"
                placeholder="请选择"
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
          <el-col :span="6">
            <el-button type="primary" @click="getProjectList()">查询</el-button>
            <el-button type="info" @click="resetForm('form')">重置</el-button>
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
        <el-button type="primary" @click="open">新增</el-button>
      </el-col>
    </el-row>
    <!-- //表格 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="payScaleName" label="缴纳比例名称" align="center" ></el-table-column>
      <el-table-column prop="regionOriginName" label="地区名称" align="center" width="120px">
        <template slot-scope="scope">{{scope.row.regionOriginName||scope.row.regionOrigin}}</template>
      </el-table-column>
      <el-table-column prop="compScale" label="公积金单位比例" align="center" width="150px">
         <template slot-scope="scope">{{scope.row.compScale+"%"}}</template>
      </el-table-column>
      <el-table-column prop="personalScale" label="公积金个人比例" align="center" width="150px">
         <template slot-scope="scope">{{scope.row.personalScale+"%"}}</template>
      </el-table-column>
      <el-table-column prop="socilCompScale" label="社保单位比例" align="center" width="150px">
         <template slot-scope="scope">{{scope.row.socilCompScale+"%"}}</template>
      </el-table-column>
      <el-table-column prop="socilPersonalScale" label="社保个人比例" align="center" width="150px">
         <template slot-scope="scope">{{scope.row.socilPersonalScale+"%"}}</template>
      </el-table-column>
      <el-table-column prop="termValidity" label="有效期至" align="center" width="100px"></el-table-column>
      <el-table-column prop label="操作" align="center" width="150px">
        <template slot-scope="scope">
          <el-button size="mini" @click="toPage(scope.$index, scope.row)">编辑</el-button>
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
    <!-- 新增 -->
    <el-dialog :title="titleName" :visible.sync="dialogVisible" width="50%">
      <el-form :model="ruleForm" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="缴纳比例名称："
              prop="payScaleName"
              :rules="[{ required: true, message: '请输入缴纳比例名称'}]"
            >
              <el-input v-model="ruleForm.payScaleName" placeholder="请输入" style="width:90%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="地区名称："
              prop="regionOrigin"
              :rules="[{ required: true, message: '请选择'}]"
            >
              <el-select
                v-model="ruleForm.regionOrigin"
                placeholder="请选择"
                @change="onregionOrigin"
                style="width:90%"
              >
                <el-option
                  v-for="item in regionList"
                  :key="item.value"
                  :label="item.disvalue"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="公积金单位："
              prop="compScale"
              :rules="[{ required: true, message: '请输入个人需缴纳百分比'}]"
            >
              <el-input v-model="ruleForm.compScale" placeholder="请输入" style="width:90%"></el-input>
              <span>%</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="公积金个人："
              prop="personalScale"
              :rules="[{ required: true, message: '请输入个人需缴纳百分比'}]"
            >
              <el-input v-model="ruleForm.personalScale" placeholder="请输入" style="width:90%"></el-input>
              <span>%</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item
              label="医疗单位："
              prop="medicalCompScale"
              :rules="[{ required: true, message: '请输入个人需缴纳百分比'}]"
            >
              <el-input v-model="ruleForm.medicalCompScale" placeholder="请输入" style="width:90%"></el-input>
              <span>%</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="医疗个人："
              prop="medicalPersonalScale"
              :rules="[{ required: true, message: '请输入个人需缴纳百分比'}]"
            >
              <el-input v-model="ruleForm.medicalPersonalScale" placeholder="请输入" style="width:90%"></el-input>
              <span>%</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item
              label="养老单位："
              prop="pensionCompScale"
              :rules="[{ required: true, message: '请输入个人需缴纳百分比'}]"
            >
              <el-input v-model="ruleForm.pensionCompScale" placeholder="请输入" style="width:90%"></el-input>
              <span>%</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="养老个人："
              prop="pensionPersonalScale"
              :rules="[{ required: true, message: '请输入个人需缴纳百分比'}]"
            >
              <el-input v-model="ruleForm.pensionPersonalScale" placeholder="请输入" style="width:90%"></el-input>
              <span>%</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item
              label="生育单位："
              prop="birthCompScale"
              :rules="[{ required: true, message: '请输入个人需缴纳百分比'}]"
            >
              <el-input v-model="ruleForm.birthCompScale" placeholder="请输入" style="width:90%"></el-input>
              <span>%</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="生育个人："
              prop="birthPersonalScale"
              :rules="[{ required: true, message: '请输入个人需缴纳百分比'}]"
            >
              <el-input v-model="ruleForm.birthPersonalScale" placeholder="请输入" style="width:90%"></el-input>
              <span>%</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item
              label="工伤单位："
              prop="injuredCompScale"
              :rules="[{ required: true, message: '请输入个人需缴纳百分比'}]"
            >
              <el-input v-model="ruleForm.injuredCompScale" placeholder="请输入" style="width:90%"></el-input>
              <span>%</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="工伤个人："
              prop="injuredPersonalScale"
              :rules="[{ required: true, message: '请输入个人需缴纳百分比'}]"
            >
              <el-input v-model="ruleForm.injuredPersonalScale" placeholder="请输入" style="width:90%"></el-input>
              <span>%</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item
              label="失业单位："
              prop="joblessCompScale"
              :rules="[{ required: true, message: '请输入个人需缴纳百分比'}]"
            >
              <el-input v-model="ruleForm.joblessCompScale" placeholder="请输入" style="width:90%"></el-input>
              <span>%</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="失业个人："
              prop="joblessPersonalScale"
              :rules="[{ required: true, message: '请输入个人需缴纳百分比'}]"
            >
              <el-input v-model="ruleForm.joblessPersonalScale" placeholder="请输入" style="width:90%"></el-input>
              <span>%</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="大额医疗(天津)："
              prop="bigMedical"
              :rules="[{ required: true, message: '请输入个人需缴纳百分比'}]"
              style="margin-left: 35px;"
            >
              <el-radio-group v-model="ruleForm.bigMedical">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="2">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="大额医疗金额："
              prop="bigMedicalMoney"
              :rules="[{ required: ruleForm.bigMedical===2?false:true, message: '请输入个人需缴纳百分比'}]"
            >
              <el-input
                v-model="ruleForm.bigMedicalMoney"
                placeholder="请输入"
                style="width:90%"
                :disabled="ruleForm.bigMedical===1?false:true"
              ></el-input>
              <span>%</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="大额互助(北京)："
              prop="bigCooperation"
              style="margin-left: 35px;"
              :rules="[{ required: true, message: '请输入个人需缴纳百分比'}]"
            >
              <el-radio-group v-model="ruleForm.bigCooperation" >
                <el-radio :label="1">是</el-radio>
                <el-radio :label="2">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="大额互助金额："
              prop="bigCooperationMoney"
             
              :rules="[{ required: ruleForm.bigCooperation===2?false:true, message: '请输入个人需缴纳百分比'}]"
            >
              <el-input
                v-model="ruleForm.bigCooperationMoney"
                placeholder="请输入"
                style="width:90%"
                :disabled="ruleForm.bigCooperation===1?false:true"
              ></el-input>
              <span>%</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="有效期至：" prop="termValidity">
              <el-date-picker
                v-model="ruleForm.termValidity"
                value-format="yyyy-MM"
                type="month"
                placeholder="选择月"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row type="flex" justify="center">
        <el-button type="primary" @click="addMaintenance">保存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </el-row>
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
        payScaleName: "",
        regionOrigin: "",
        startAmount: "",
        date: "",
        pageIndex: 1,
        pageNum: 15,
        pkId: "",
      },
      dialogVisible: false, //弹窗
      surface: false, //编辑表格
      titleName: "新增",
      total: 0,
      currentPage: 1,
      labelposition: "right",
      tableData: [],
      tableDataIndex: "",
      tissueList: [], //地区
      regionList: [],
      ruleForm: {
        payScaleName: "",
        regionOrigin: "",
        deptName: "",
        compScale: "",
        personalScale: "",
        medicalCompScale: "",
        medicalPersonalScale: "",
        pensionCompScale: "",
        pensionPersonalScale: "",
        birthCompScale: "",
        birthPersonalScale: "",
        injuredCompScale: "",
        injuredPersonalScale: "",
        joblessCompScale: "",
        joblessPersonalScale: "",

        deptTypeName: "",
        deptRemarks: "",
        workNum: "",
        realName: "",

        affiliatedComp: "",
        personnelName: "",
        workNum: "",
        bankDeposit: "",
        bankNumBer: "",
        bigMedical: 2,
        bigMedicalMoney: "",
        bigCooperation: 2,
        bigCooperationMoney: "",
        termValidity: "",
      },
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
    // 重置
    resetForm(form) {
      this.form = {
        payScaleName: "",
        formType: "",
        pageNum: 15,
        pageIndex: 1,
        date: "",
        startAmount: "",
        endAmount: "",
      };
      this.getProjectList();
    },
    //地区下拉框
    gettissue() {
      axios
        .post(
          option.base_path + "manpower/personnel/getDictInfoListByDictTypeCode",
          {
            dictTypeCode: "native",
          }
        )
        .then((res) => {
          if (res.data.flag == 0) {
            this.tissueList = res.data.data;
            this.regionList = res.data.data;
          }
        });
    },
    //地区下拉
    onworkState(val) {
      this.tissueList.forEach((item) => {
        if (item.value == val) {
          this.form.regionOrigin = item.value;
        }
      });
    },
    // 新增下拉地区
    onregionOrigin(val) {
      this.regionList.forEach((item) => {
        if (item.value == val) {
          this.ruleForm.regionOrigin = item.value;
          this.ruleForm.deptName = item.disvalue;
        }
      });
    },
    // 新增弹框
    open() {
      this.dialogVisible = true;
      this.surface = false;
      this.titleName = "新增";
    },
    //弹框取消
    cancel() {
      this.dialogVisible = false;
      this.$refs.ruleForm.resetFields();
    },
    //修改
    toPage(index, item) {
  
      this.titleName = "修改";
      this.surface = true;
      this.dialogVisible = true;
      axios
        .post(option.base_path + "fund/accumulation/getMaintenanceById", {
          pkId: item.pkId,
        })
        .then((res) => {
          if (res.data.flag == 0) {
            console.log(res.data.data);
            let row = res.data.data;
            this.ruleForm.payScaleName = row.payScaleName;
            this.ruleForm.deptName = row.regionOriginName;
            this.ruleForm.regionOrigin = row.regionOrigin;
            this.ruleForm.compScale = row.compScale;
            this.ruleForm.personalScale = row.personalScale;
            this.ruleForm.socilCompScale = row.socilCompScale;
            this.ruleForm.socilPersonalScale = row.socilPersonalScale;
            this.ruleForm.termValidity = row.termValidity;

            this.ruleForm.medicalCompScale = row.medicalCompScale;
            this.ruleForm.medicalPersonalScale = row.medicalPersonalScale;
            this.ruleForm.pensionCompScale = row.pensionCompScale;
            this.ruleForm.pensionPersonalScale = row.pensionPersonalScale;
            this.ruleForm.birthCompScale = row.birthCompScale;
            this.ruleForm.birthPersonalScale = row.birthPersonalScale;
            this.ruleForm.injuredCompScale = row.injuredCompScale;
            this.ruleForm.injuredPersonalScale = row.injuredPersonalScale;
            this.ruleForm.joblessCompScale = row.joblessCompScale;
            this.ruleForm.joblessPersonalScale = row.joblessPersonalScale;

            this.ruleForm.bigMedical = row.bigMedical;
            this.ruleForm.bigMedicalMoney = row.bigMedicalMoney;
            this.ruleForm.bigCooperation = row.bigCooperation;
            this.ruleForm.bigCooperationMoney = row.bigCooperationMoney;
          }
        });
      this.tableDataIndex = index;
      this.pkId = item.pkId;
    },
    //保存成功
    save() {

    },
    //  保存按钮
    addMaintenance() {
      let that = this;
      if (this.surface == true) {
        this.tableData[this.tableDataIndex].pkId = this.pkId;
        this.tableData[
          this.tableDataIndex
        ].payScaleName = this.ruleForm.payScaleName;
        this.tableData[
          this.tableDataIndex
        ].regionOriginName = this.ruleForm.deptName;
        this.tableData[
          this.tableDataIndex
        ].regionOrigin = this.ruleForm.regionOrigin;
        this.tableData[this.tableDataIndex].compScale = this.ruleForm.compScale;
        this.tableData[
          this.tableDataIndex
        ].personalScale = this.ruleForm.personalScale;
        this.tableData[
          this.tableDataIndex
        ].socilCompScale = this.ruleForm.socilCompScale;
        this.tableData[
          this.tableDataIndex
        ].socilPersonalScale = this.ruleForm.socilPersonalScale;
        this.tableData[
          this.tableDataIndex
        ].termValidity = this.ruleForm.termValidity;
        this.tableData[
          this.tableDataIndex
        ].medicalCompScale = this.ruleForm.medicalCompScale;
        this.tableData[
          this.tableDataIndex
        ].medicalPersonalScale = this.ruleForm.medicalPersonalScale;
        this.tableData[
          this.tableDataIndex
        ].pensionCompScale = this.ruleForm.pensionCompScale;
        this.tableData[
          this.tableDataIndex
        ].pensionPersonalScale = this.ruleForm.pensionPersonalScale;
        this.tableData[
          this.tableDataIndex
        ].birthCompScale = this.ruleForm.birthCompScale;
        this.tableData[
          this.tableDataIndex
        ].birthPersonalScale = this.ruleForm.birthPersonalScale;
        this.tableData[
          this.tableDataIndex
        ].injuredCompScale = this.ruleForm.injuredCompScale;
        this.tableData[
          this.tableDataIndex
        ].injuredPersonalScale = this.ruleForm.injuredPersonalScale;
        this.tableData[
          this.tableDataIndex
        ].joblessCompScale = this.ruleForm.joblessCompScale;
        this.tableData[
          this.tableDataIndex
        ].joblessPersonalScale = this.ruleForm.joblessPersonalScale;
        this.tableData[
          this.tableDataIndex
        ].bigMedical = this.ruleForm.bigMedical;
        this.tableData[
          this.tableDataIndex
        ].bigMedicalMoney = this.ruleForm.bigMedicalMoney;
        this.tableData[
          this.tableDataIndex
        ].bigCooperation = this.ruleForm.bigCooperation;
        this.tableData[
          this.tableDataIndex
        ].bigCooperationMoney = this.ruleForm.bigCooperationMoney;

        this.surface = false;
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            axios
              .post(
                option.base_path + "fund/accumulation/updateMaintenanceBypkId",
                this.tableData[this.tableDataIndex]
              )
              .then((res) => {
                that.getProjectList();
              })
              .catch(function (error) {
                console.log(error);
              });
          }
          this.dialogVisible = false;
          this.$refs.ruleForm.resetFields();
        });
      } else {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            axios
              .post(
                option.base_path + "fund/accumulation/addMaintenance",
                this.ruleForm
              )
              .then((res) => {
                //      this.tableData.push({
                //   payScaleName: this.ruleForm.payScaleName,
                //   regionOriginName: this.ruleForm.deptName,
                //   regionOrigin: this.ruleForm.regionOrigin,
                //   compScale: this.ruleForm.compScale,
                //   personalScale: this.ruleForm.personalScale,
                //   socilCompScale: this.ruleForm.socilCompScale,
                //   socilPersonalScale: this.ruleForm.socilPersonalScale,
                //   termValidity: this.ruleForm.termValidity,

                //   medicalCompScale: this.ruleForm.medicalCompScale,
                //   medicalPersonalScale: this.ruleForm.medicalPersonalScale,
                //   pensionCompScale: this.ruleForm.pensionCompScale,
                //   pensionPersonalScale: this.ruleForm.pensionPersonalScale,
                //   birthCompScale: this.ruleForm.birthCompScale,
                //   birthPersonalScale: this.ruleForm.birthPersonalScale,
                //   injuredCompScale: this.ruleForm.injuredCompScale,
                //   injuredPersonalScale: this.ruleForm.injuredPersonalScale,
                //   joblessCompScale: this.ruleForm.joblessCompScale,
                //   joblessPersonalScale: this.ruleForm.joblessPersonalScale,
                //   bigMedical: this.ruleForm.bigMedical,
                //   bigMedicalMoney: this.ruleForm.bigMedicalMoney,
                //   bigCooperation: this.ruleForm.bigCooperation,
                //   bigCooperationMoney: this.ruleForm.bigCooperationMoney,
                // });
                that.getProjectList();
                this.dialogVisible = false;
                this.$refs.ruleForm.resetFields();
                this.$message({
                  showClose: true,
                  message: "保存成功",
                  type: "success",
                });
              })
              .catch(function (error) {
                console.log(error);
              });
          }
        });
      }
    },
    // 查询
    getProjectList() {
      let that = this;
      axios
        .post(
          option.base_path + "fund/accumulation/getMaintenanceListByParams",
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
            .post(
              option.base_path + "fund/accumulation/deleteMaintenanceBypkId",
              {
                pkId: id,
              }
            )
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
.el-form-item__content {
  display: flex;
}
</style>

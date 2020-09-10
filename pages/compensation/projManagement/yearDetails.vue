<template>
  <div class="dome-container">
    <!-- 顶部信息START -->
    <topTip>
      <template>
        <el-row>
          <el-col :span="13" class="top-tip" style="text-align: left;">
            <div>
              <span style="color: #417095;font-size: 16px;font-weight: bolder;">基本信息</span>
            </div>
          </el-col>
          <el-col :span="10" style="text-align: right;">
            <div>
                <button type="button" class="el-button yt-bottom-btn el-button--default" style=" position: relative;top: -10px;" @click="exit">
                <span>返回</span>
            </button>
            </div>
          </el-col>
        </el-row>
      </template>
    </topTip>
     <!-- 基本信息区域 -->
    <div class="user_info">
      <el-row style=" margin-bottom: 20px;">
        <el-col :span="7" style="margin-left:20px">
          <label class="yt-read-text">
            <span style="letter-spacing: 40px;">姓</span>名：
            <span>{{realName==""?'--':realName}}</span>
          </label>
        </el-col>
        <el-col :span="7">
          <label class="yt-read-text">
            <span style="letter-spacing: 40px;">工</span>号：
          </label>
          <span>{{workNum==""?'--':workNum}}</span>
        </el-col>
        <el-col :span="7">
          <label class="yt-read-text">
            <span style="letter-spacing: 5px;">工作状</span>态：
          </label>
          <span>{{workStateName==""?'--':workStateName}}</span>
        </el-col>
      </el-row>
       <el-row style=" margin-bottom: 20px;">
        <el-col :span="7" style="margin-left:20px">
          <label class="yt-read-text">
            <span style="letter-spacing: 5px;">所属公</span>司：
            <span>{{affiliatedCompName==""?'--':affiliatedCompName}}</span>
          </label>
        </el-col>
        <el-col :span="7">
          <label class="yt-read-text">
             <span style="letter-spacing: 5px;">所属部</span>门：
          </label>
          <span>{{affiliatedDeptName==""?'--':affiliatedDeptName}}</span>
        </el-col>
      </el-row>
    </div>
    <!-- 顶部信息END -->
    <div style="height: 5px;background-color: #f3f3f3;border-top: 1px solid #dfe6f3;border-bottom: 1px solid #dfe6f3;"></div>
    <el-table  border :data="tableData" style="width: 100%;margin-top:20px" >
      <el-table-column prop="affiliatedCompName" label="所属公司" width="180" align="center">
      </el-table-column>
      <el-table-column prop="affiliatedDeptName" label="所属部门" width="120" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.affiliatedDeptName==""?"--":scope.row.affiliatedDeptName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="workStateName" label="工作状态" width="150" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.workStateName==""?"--":scope.row.workStateName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="realName" label="姓名" width="120" align="center">
      </el-table-column>
      <el-table-column prop="workNum" label="工号" align="center">
      </el-table-column>
      <el-table-column prop="address" label="全年基本工资和" width="150" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.monthBasicWages |moneFlter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="monthBonus" label="全年月度奖金和" width="150" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.monthBonus |moneFlter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="全年其他奖金和" width="150" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.otherBonus |moneFlter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="travelSubsidy" label="全年差旅补贴" width="150" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.travelSubsidy |moneFlter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="flexibleBenefits" label="全年弹性福利" width="150" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.flexibleBenefits |moneFlter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="全年工资合计" width="150" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.actualAmount |moneFlter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="全年个所税" width="150" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.indicidualIncomeTax |moneFlter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="全年月平均工资" width="150" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.actualAmountAverage |moneFlter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="全年发放工资月份数" width="150" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.monthCount |moneFlter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="全年社险公司担负金额" width="150" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.socilCompPayMoney |moneFlter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="全年社险个人担负金额" width="150" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.socilPersonalPayMoney |moneFlter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="全年公积金公司担负金额" width="150" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.fundCompPayMoney |moneFlter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="全年公积金个人担负金额" width="150" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.fundPersonalPayMoney |moneFlter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="compPayMoney" label="全年社险公积金公司担负金额合计" width="150" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.compPayMoney |moneFlter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="personalPayMoney" label="全年社险公积金个人担负金额合计" width="150" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.personalPayMoney |moneFlter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="全年成本统计" width="150" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.amount |moneFlter}}</span>
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
  </div>
</template>

<script>
import topTip from "@/components/topTip.vue";
import axios from "../../../service/http";
import { option } from "../../../static/config.js";
export default {
  data() {
    return {
      companyList: [],
      deptList: [],
      tableData: [],
      realName:'',
      workNum:'',
      pageIndex: 1,
      affiliatedCompName:'',
      affiliatedDeptName:'',
      workStateName:'',
      total: 1,
      ruleForm: {
        realName: "",
        applicantTime: "",
       
      },
    };
  },
   // 组件注册
  components: {
    topTip,
   
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {
    this.getAfterTaxByYear();
  },
  methods: {
    //表格数据
    getAfterTaxByYear() {
      axios
        .post(option.base_path + "wages/afterTax/getAfterTaxByPersonnelId", 
             {
            personnelId: this.$route.query.personnelId,
            year:this.$route.query.year
          }
        )
        .then((res) => {
          if (res.data.flag == 0) {
            this.tableData = res.data.data.yearList;
      this.realName=res.data.data.realName
      this.workNum=res.data.data.workNum
      this.affiliatedCompName=res.data.data.affiliatedCompName
      this.affiliatedDeptName=res.data.data.affiliatedDeptName
      this.workStateName=res.data.data.workStateName
            // this.total = res.data.data.total;
          }
        });
    },
     //关闭
    exit() {
      this.$router.push({
        path: "/compensation/projManagement/salaryStatisticsYear",
      });
    },
    //手动切换每页条数
    handleSizeChange(val) {
      this.form.pageNum = val;
      console.log(`每页 ${val} 条`);
      this.getAfterTaxByYear();
    },
    //手动切换页数
    handleCurrentChange(val) {
      this.form.pageIndex = val;
      console.log(`当前页: ${val}`);
      this.getAfterTaxByYear();
    },
    //查询
    queryData() {
      this.getAfterTaxByYear();
    },
    //重置
    resetData() {
      this.deptList = this.companyList = [];
      this.query = {
        affiliatedComp: "",
        affiliatedDept: "",
        queryParams: "",
        year: new Date().getFullYear() - 1 + "",
        pageIndex: 1,
        pageNum: 15,
      };
      this.getAfterTaxByYear();
    },
  },
  filters: {
    moneFlter(num) {
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
};
</script>
<style scoped>
.yt-read-text {
  color: #003465;
  font-weight: bold;

}
</style>
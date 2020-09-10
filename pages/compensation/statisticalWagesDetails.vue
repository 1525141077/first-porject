<template>
  <div class="yt-dome-container">
      <!-- 头部信息 -->
      <el-form label-width="120px" size="small">
          <el-row >
            <el-col :span="6" style="margin-top: 20px;margin-left: 10px;letter-spacing: 18px;">
              <el-form-item label="月  份：">
                  <el-date-picker
                  v-model="form.month"
                  format="yyyy-MM"
                   value-format="yyyy-MM"
                  type="month"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="5" style="text-align: right;margin-top: 20px;margin-left: -10px;">
              <el-button type="primary" @click="getProjectList()">查询</el-button>
              <el-button type="info" @click="resetForm('form')">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
        <div
      style="height: 5px;background-color: #f3f3f3;border-top: 1px solid #dfe6f3;border-bottom: 1px solid #dfe6f3;"
    ></div>
    <el-row style="margin:15px 10px;">

      <el-col :span="2" style="margin-left: 0px;">
        <el-button type="primary" @click="beforeExport">导出</el-button>
      </el-col>
    </el-row>
    <!-- 头部信息 -->
    <!-- 表格信息 -->
    <el-table
    :data="tableData"
     border
     show-summary
    style="width: 100%">
    <el-table-column
      prop="realName"
      label="姓名"
      align=right>
    </el-table-column>
    <el-table-column
      prop="workNum"
      label="工号"
      align=right>
    </el-table-column>
    <el-table-column
      prop="actualAmount"
      label="实发工资"
      align=right>
      <template scope="scope">
          <span >{{scope.row.actualAmount | moneyFormat}}</span>
        </template>

    </el-table-column>
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
    <div style="width: 120px;margin: 0 auto;margin-top: 20px;">
      <el-button @click='closeClick'>关闭</el-button>
    </div>
  </div>
</template>

<script>
//一级标题
import topTip from "../../components/topTip";
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
      listId:'',
      originMonthTwo:'',//单选行选中的月份
      currentPage: 1,
      total: 0,//页数显示
      dialogLogsVisible:false,
      dialogLogsVisibleTwo:false,
      value1:'',
      haveCustomerName:false,
      message:'',//弹出框提示信息
      form: {
          month:this.$route.query.month,
          // category:2,
          pageIndex: 1,
          pageNum: 15,
          // month: 2020-07,
          // affiliatedComp: SWSW,
          // category: 2,
    },
    listMonth:'',
    ruleForm: {
        date1: '2020-08',
      },
      tableData: [],
      popupData:[],
    };
  },

  components: {
    topTip,
    upload,
    lookFiles
  },
  mounted() {
      this.getProjectList();
      // this.popupList();
      if (this.$route.query) {
    this.month = this.$route.query.month;
    this.comCode = this.$route.query.comCode;
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
  // 查询列表数据
  getProjectList() {
    var me = this;
    //调用axios.post方法
    //"CASPARAMS":"OFF_INDEX"
    axios
      .post(
        option.base_path +
          "wages/afterTax/getAfterTaxStatisticsList",
        this.form
      )
      .then(res => {
        this.listMonth = this.form.month
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
  // 弹出框列表数据
  // popupList() {
  //   var me = this;
  //   //调用axios.post方法
  //   //"CASPARAMS":"OFF_INDEX"
  //   axios
  //     .post(
  //       option.base_path +
  //         "fundPayMonth/getFundPayStatisticsComp",
  //       this.form
  //     )
  //     .then(res => {
  //       this.popupData = res.data.data;
  //     //   this.tableData.forEach((item, i, arr) => {
  //     //     arr[i].show = true;
  //     //     console.log(arr);
  //     //   });
  //     console.log("返回值",this.popupData);
  //       this.total = res.data.data.total;
  //     })
  //     .catch(err => err);

  // },
  // 重置
  resetForm(form) {
    this.form = {
          month:'2020-07',
          pageIndex: 1,
          pageNum: 15
    };
    this.getProjectList();
  },
   //跳转到修改页面
   closeClick() {
    this.$router.replace('/compensation/statisTubeList');
  },
  // 删除列表数据
  // deletes(row, index) {

  //   var me = this;
  //   //调用axios.post方法
  //   //"CASPARAMS":"OFF_INDEX"
  //   axios
  //     .post(
  //       option.base_path +
  //         "wages/afterTax/deleteAfterTaxMonth",
  //       {
  //           pkId:this.tableData[index].pkId,
  //       }
  //     )
  //     .then(res => {
  //         this.getProjectList();
  //     })
  //     .catch(err => err);

  // },
  // 调用弹出框提示信息接口
  tips() {

      var me = this;
      //调用axios.post方法
      //"CASPARAMS":"OFF_INDEX"
      axios
        .post(
          option.base_path +
            "wages/afterTax/addAfterTaxMonth",
          {
            month:this.ruleForm.date1,
          }
        )
        .then(res => {
          //   alert(res.data.data.message)
          this.message=res.data.message
          this.haveCustomerName=true
            console.log('第三方生物',res.data.message)
        })
        .catch(err => err);

    },
    //复选框选中信息
  tableCheck(val) {
    this.multipleSelection = val;
    console.log("第三方三",this.multipleSelection)

    var affiliatedComp="";

      //遍历每行选中的数据
      this.multipleSelection.forEach(a=>{

        affiliatedComp+=a.affiliatedComp+','
            // this.number.substring(this.number.length,this.number.length-1)
          })
      let id= affiliatedComp.substring(0,affiliatedComp.length-1)
      this.listId=id;
      console.log("沙发问问",id)
  },
  //保存弹出框信息
  saveForm(formName) {
      console.log("是否是",this.ruleForm.date1)
      this.$refs[formName].validate((valid) => {
        if (valid) {
            this.tips()

        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //导出
    beforeExport(){
          let	month = this.form.month;
          let	affiliatedComp = '';//这个是要传过来的数据，传好之后需要重新赋值，现在写死未测试使用
          // let	category = '2';
        let pageParam =  '&month=' + month + '&affiliatedComp=' + affiliatedComp;
          window.location.href = option.base_path + 'wages/afterTax/exportAfterTaxStatisticsList?' + pageParam;
    },

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

<style scoped>
</style>

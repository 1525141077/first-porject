<template>
  <div class="yt-dome-container">
    <!-- 顶部信息START -->
    <topTip>
      <template>
        <el-row>
          <el-col :span="15" class="top-tip" style="text-align: left;">
            <div>
              <span style="color: #417095;font-size: 16px;font-weight: bolder;">绩效申请概览</span>
            </div>
          </el-col>
        </el-row>
      </template>
    </topTip>
    <!-- 顶部信息END -->
    <!-- 表格信息 -->
    <el-table
    :data="tableData"
     border
    style="width: 100%">
    <el-table-column
      prop="practicePerformanceNum"
      label="单据编号"
      align='center'>
      <template slot-scope='scope'>
          <span style="color: rgb(65, 112, 149);cursor: pointer;" @click='detailClick("/meritsPractice/practiceApporePage",scope.row)'>{{scope.row.practicePerformanceNum}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="thisGrantMonth"
      label="发放月份"
      align='center'>
    </el-table-column>
    <el-table-column
      prop="thisGrantTotalAmount"
      label="发放金额（元）"
      align=right>
      <template scope="scope">
          <span >{{scope.row.preTaxMoney | moneyFormat}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="nodeNowState"
      label="当前状态"
      align='center'>
      <template slot-scope="scope">
         <span style="color:#417095;cursor: pointer;" @click="journalTwo(scope.row)">{{scope.row.nodeNowState}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="workNum"
      label="操作"
      align='center'>
      <template slot-scope='sc'>
        <!-- <el-link type="primary" v-show="sc.row.taskKey!='activitiStartTask'" @click='toPage2("/approval/details",sc.row)' >审批</el-link>
        <el-link type="primary" v-show="sc.row.taskKey=='activitiStartTask'" @click='toPage3("/busiTripApply/serveApply",sc.row)' >处理</el-link>
        <el-link type="primary" :underline="false">|</el-link> -->
        <lookApproveLog :processInstanceId="sc.row.processInstanceId">日志</lookApproveLog>
      </template>
    </el-table-column>
  </el-table>
    <div style="text-align: center;margin-top:50px">
      <button type="button" class="el-button yt-bottom-btn el-button--default"  @click='closeClick'>
        <span >关闭</span>
      </button>
    </div>

    <!-- 已处理部分弹出框 -->
    <el-dialog title="当前状态" :visible.sync="dialogLogsVisibleTwo" >
      <div style="width: 100%;height: auto;overflow-x: auto;">
        <img :src="imgsrc" alt="">
      </div>
      <!-- <img src="http://123.56.81.55:9200/ims-act/restful/workFlow/findPngByProcessInstanceId?processInstanceId=141098" alt=""> -->
      <!-- <span>{{imgsrc}}</span> -->
    <div style="text-align:center;padding-top:20px">
    <el-button type="info" :visible.sync="dialogLogsVisibleTwo" @click="closeDialogTwo">关闭</el-button>
    </div>
    </el-dialog>
  </div>

</template>

<script>
//一级标题
import topTip from "../../components/topTip";
// 日志文件
import lookApproveLog from '@/components/lookApproveLog'
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
      practicePerformanceId:'',
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
  },
  components: {
    topTip,
    upload,
    lookFiles,
    lookApproveLog
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
    //点击编号跳转详情
    detailClick(path,row){
      this.$router.replace({
        path:path,
        query: {
           practicePerformanceId:row.practicePerformanceId,
           approvalState:2,
           close:'1'
        }
      });
    },
    //关闭弹框的事件
    closeDialogTwo(row) {
      this.dialogLogsVisibleTwo = false;
    },
    journalTwo(row) {
      console.log(nodeNowState);
      this.dialogLogsVisibleTwo = true;
      let nodeNowState = row.nodeNowState;
      // this.imgsrc=nodeNowState
      // if (nodeNowState == "待【部门经理审批】审批") {
      //   this.imgsrc =
      //     option.workFlow + "restful/workFlow/findPngByProcessInstanceId?processInstanceId=" + row.processInstanceId;
      // } else if (nodeNowState == "待【项目经理审批】审批") {
      //   this.imgsrc = "待【项目经理审批】审批";
      // } else if (nodeNowState == "待【财务审批】审批") {
      //   this.imgsrc = "待【财务审批】审批";
      // } else if (nodeNowState == "待申请人再次提交") {
      //   this.imgsrc = "待申请人再次提交";
      // } else if (nodeNowState == "待【总经办审批】审批") {
      //   this.imgsrc = "待【总经办审批】审批";
      // } else if (nodeNowState == "总办人填写") {
      //   this.imgsrc =
      //     "http://123.56.81.55:9200/ims-act/restful/workFlow/findPngByProcessInstanceId?processInstanceId=141098";
      // }
      this.imgsrc =
        option.workFlow +
        "restful/workFlow/findPngByProcessInstanceId?processInstanceId=" +
        row.processInstanceId;
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
  // 查询列表数据
  getProjectList() {
    var me = this;
    //调用axios.post方法
    //"CASPARAMS":"OFF_INDEX"
    axios.post(
        option.base_path + "wages/performance/getPracticePerformanceListByProjectId",{
          projectId:this.$route.query.projectId
        }).then(res => {
        this.listMonth = this.form.month
        this.tableData = res.data.data;
      //   this.tableData.forEach((item, i, arr) => {
      //     arr[i].show = true;
      //     console.log(arr);
      //   });
      console.log("返回值",this.tableData);
        this.total = res.data.data.total;
      }).catch(err => err);

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
   //点击关闭
   closeClick() {
    this.$router.replace('/projectManagerOperating/projectManagerPage');
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
        let pageParam =  '&month=' + month + '&affiliatedComp=' +affiliatedComp;
          window.location.href = option.base_path + 'wages/afterTax/exportIndicidualIncomeTaxStatisticsList?' + pageParam;
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

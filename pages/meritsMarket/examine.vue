<template>
  <div class="dome-container">
    <topTip>
      <template>
        <div>
          <span style="color: #417095;font-size: 16px;font-weight: bolder;">基本信息</span>
        </div>
      </template>
    </topTip>
    <div style="margin-left:20px">
      <span class="font-style">项目名称/编号：</span>
      <span>{{form.projectName+"/"+form.projectId}}</span>
    </div>
    <div style="margin:20px 20px">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="marketPerformanceNum" label="申请编号" width="180" align="center">
        </el-table-column>
        <el-table-column prop="revenueRecognizedAmount" label="已确认收入金额" width="180" align="right">
           <template scope="scope">
              <span>{{scope.row.revenueRecognizedAmount |moneFlter}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="grantRatio" label="发放比例" align="center">
        </el-table-column>
        <el-table-column prop="thisGrantTotalAmount" label="本次发放金额" align="right">
           <template scope="scope">
              <span>{{scope.row.thisGrantTotalAmount |moneFlter}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="nodeNowState" label="当前状态"  align="center">
          <template slot-scope="scope">
                <a
                  style="color:#417095;cursor: pointer;"
                  @click="showEditDialog(scope.row)"
                  v-if="scope.row.nodeNowState=='待【财务】审批'"
                >{{scope.row.nodeNowState}}</a>
                <span v-else>{{scope.row.nodeNowState}}</span>
              </template>
        </el-table-column>
        <el-table-column prop="address" label="操作"  align="center" width="100"> 
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="addText(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
       <!-- 审批点击状态 -->
          <el-dialog
            title="当前状态"
            :visible.sync="dialogVisible"
            width="50%"
            :before-close="handleClose"
          >
            <div style="width: 100%;height: auto;overflow-x: auto;">
              <img :src="imgsrc" alt />
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
          </el-dialog>
    </div>
    <el-row style="margin:20px 0 0 20px">
      <el-col :span="12">
        <span class="font-style">完成发放金额：</span>
        <span>{{form.paidAmount}}</span>
      </el-col>
      <el-col :span="8">
        <span class="font-style">审批中金额：</span>
        <span>{{form.approvalAmount}}</span>
      </el-col>
    </el-row>
    <div style="text-align: center;margin-top:50px">
      <button type="button" class="el-button yt-bottom-btn el-button--default">
        <span @click="exit">关闭</span>
      </button>
    </div>
  </div>
</template>

<script>
import axios from "../../service/http";
import { option } from "../../static/config";
import topTip from "../../components/topTip.vue";
export default {
  data() {
    return {
      form:{
        projectId:"1",
        projectName:"2",
        paidAmount:"",
        approvalAmount:"",
      },
        dialogVisible: false,
        imgsrc: "",
      tableData:[],
    };
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {
    this.getMarketPerformanceListByProjectId();
  },
  methods:{
       //关闭
    exit() {
      this.$router.push({ path: "/meritsMarket/manage" });
    },
      // 监听对话框的关闭事件
    handleClose() {
      this.$refs.wagesList.resetFields();
    },
     //点击弹出框
    showEditDialog(row) {
      debugger
      this.dialogVisible = true;
      this.imgsrc =
        option.workFlow +
        "restful/workFlow/findPngByProcessInstanceId?processInstanceId=" +
        row.processInstanceId;
    },
    //查看
    addText(row){
      debugger
      this.$router.replace({
        path: '/meritsMarket/newIssue',
        query: {
          marketPerformanceId: row.marketPerformanceId,
          archivesState:2,
        },
      });
  
    },
    //详情
    getMarketPerformanceListByProjectId() {
      axios
        .post(option.base_path + "wages/performance/getMarketPerformanceListByProjectId", {
         projectId:this.$route.query.projectId
        })
        .then((res) => {
          if (res.data.flag == 0) {
            this.tableData = res.data.data;
            this.form.projectName=this.$route.query.projectName
             this.form.projectId=this.$route.query.projectId
              this.form.approvalAmount=this.$route.query.approvalAmount
                this.form.paidAmount=this.$route.query.paidAmount
                
            // this.total = res.data.total;
            console.log("安德森",res)
          }
        });
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
  components: {
    topTip,
  },
};
</script>
<style scoped>
/* @import url(); 引入css类 */
.font-style {
  color: #003465;
  font-weight: bold;
}
</style>
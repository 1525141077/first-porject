<template>
  <div class="dome-container">
    <!-- 页面关键字搜索模块START -->
    <el-header class="yt-header">
      <el-form label-width="80px" size="small">
        <el-row>
          <el-col :span="6">
            <el-form-item label="关键字：">
              <el-input class placeholder="请输入发票申请编号/抬头" v-model="form.selectParam" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="状态：">
              <el-select v-model="form.invoiceType" placeholder="请选择">
                <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <img src="../../static/icon/icon-warn.png" alt style="width:20px;height:20px;vertical-align: middle;" @click="openWarn" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="红冲/作废：">
              <el-select v-model="form.invoiceState" placeholder="请选择">
                <el-option v-for="item in voidList" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
    <!-- 页面表格START -->
    <el-row>
      <el-col :span="24" align="left">
        <el-button type="danger" @click="printEven" v-if="printBtn" v-show="hongchongBtn">红冲</el-button>
        <el-button type="warning" @click="mingcheck" v-if="deleteBtn" v-show="voidBtn">作废</el-button>
        <!-- <el-button type="primary" @click="mingcheck" v-if="cancelBtn">撤销</el-button> -->
      </el-col>
    </el-row>
    <div class="tab-mod" style="margin-top: 20px;min-height: 100%;min-width: 100%;">
      <el-tabs type="border-card" v-model="activeTab" @tab-click="handleClick">
        <!-- 待处理状态的表格START -->
        <el-tab-pane label="待处理" v-model="form.queryStateParams" name="first">
          <el-table :data="processedTableData" border highlight-current-row @current-change="clickcheck" style="width: 100%;">
            <el-table-column prop="invoiceAppNum" label="发票申请编号" width="140" align="center">
              <template slot-scope="scope">
                <!-- expenditureAppNum  invoiceAppNum  -->
                <span style="color:#417095;cursor: pointer;" @click="toPage4('/invoice/invoiceDetails',scope.row)">{{scope.row.invoiceAppNum}}</span>
              </template>
              <!-- <el-link type="primary">{{pendingTableData.num}}</el-link> -->
            </el-table-column>
            <el-table-column prop="invoiceRise" label="发票抬头" width></el-table-column>
            <el-table-column prop="invoiceAmount" label="含税金额(元）" width="200" align="right">
              <template slot-scope="scope">
                <span>{{scope.row.invoiceAmount | moneyFormat }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="invoiceType" label="发票类型" width="100" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.invoiceType == 1 ? "增值税专用发票" : "增值税普通发票"}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="applicantUserName" label="申请人" width="80" align="center"></el-table-column>
            <el-table-column prop="stagnationTime" label="停滞时间" width="120" align="center"></el-table-column>
            <el-table-column prop="operat" label="操作" width="100" align="center">
              <template slot-scope="sc">
                <el-link type="primary" v-show="sc.row.taskKey!='activitiStartTask'" @click="toPage2('/invoice/invoiceDetails',sc.row)">审批</el-link>
                <el-link type="primary" v-show="sc.row.taskKey=='activitiStartTask'" @click="toPage3('',sc.row)">处理</el-link>

                <el-link type="primary" :underline="false">|</el-link>
                <lookApproveLog :processInstanceId="sc.row.processInstanceId"></lookApproveLog>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页START -->
          <el-pagination background :current-page="currentPage" :page-sizes="[15, 30, 50, 100, 200, 500]" :page-size="15" layout="total, prev, pager, next, sizes" :total="total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
          <!-- 分页END -->
          <!-- 待处理状态的表格END -->
        </el-tab-pane>
        <!-- 已处理START -->
        <el-tab-pane label="已处理" v-model="form.queryStateParams" name="second">
          <el-table :data="processedTableData" border highlight-current-row @current-change="clickcheck" style="width: 100%;">
            <el-table-column prop="invoiceAppNum" label="发票申请编号" width="140" type="primary" align="center">
              <template slot-scope="scope">
                <span style="color:#417095;cursor: pointer;" @click="toPage4('/invoice/invoiceDetails',scope.row)">{{scope.row.invoiceAppNum}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="invoiceRise" label="发票抬头" width></el-table-column>
            <el-table-column prop="invoiceAmount" label="含税金额(元）" width="200" align="right">
              <template slot-scope="scope">
                <span>{{scope.row.invoiceAmount | moneyFormat }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="invoiceType" label="发票类型" width="100" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.invoiceType == 1 ? "增值税专用发票" : "增值税普通发票"}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="applicantUserName" label="申请人" width="80" align="center"></el-table-column>
            <el-table-column prop="nodeNowState" label="状态" width="120" align="center">
              <template slot-scope="scope">
                <span style="color:#417095;cursor: pointer;" @click="journalTwo(scope.row)">{{scope.row.nodeNowState}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="operat" label="操作" width="100" align="center">
              <template slot-scope="scope">
                <el-link type="primary" @click="toPage4('/invoice/invoiceDetails',scope.row)">查看</el-link>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页START -->
          <el-pagination background :current-page="currentPage" :page-sizes="[15, 30, 50, 100, 200, 500]" :page-size="15" layout="total, prev, pager, next, sizes" :total="total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
          <!-- 分页END -->
        </el-tab-pane>
        <!-- 已处理END -->
        <!-- 已完结STARAT -->
        <el-tab-pane label="已完结" v-model="form.queryStateParams" name="thiird">
          <el-table :data="processedTableData" border highlight-current-row @current-change="clickcheck" style="width: 100%;">
            <el-table-column prop="invoiceAppNum" label="发票申请编号" width="140" type="primary" align="center">
              <template slot-scope="scope">
                <span style="color:#417095;cursor: pointer;" @click="toPage4('/invoice/invoiceDetails',scope.row)">{{scope.row.invoiceAppNum}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="invoiceRise" label="发票抬头" width></el-table-column>
            <el-table-column prop="invoiceAmount" label="含税金额(元）" width="200" align="right">
              <template slot-scope="scope">
                <span>{{scope.row.invoiceAmount | moneyFormat }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="invoiceNumber" label="发票张数" width="100" align="center"></el-table-column>
            <el-table-column prop="invoiceType" label="发票类型" width="100" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.invoiceType == 1 ? "增值税专用发票" : "增值税普通发票"}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="applicantUserName" label="申请人" width="80" align="center"></el-table-column>
            <el-table-column prop="nodeNowState" label="状态" width="120" align="center">
              <template slot-scope="scope">
                <span style="color:#417095;cursor: pointer;">{{scope.row.nodeNowState}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="invoiceState" label="红冲/作废" width="120" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.invoiceState == 2">已红冲</span>
                <span v-else-if="scope.row.invoiceState == 3">已作废</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column prop="operat" label="操作" width="100" align="center">
              <template slot-scope="scope">
                <el-link type="primary" @click="toPage4('/invoice/invoiceDetails',scope.row)">查看</el-link>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页START -->
          <el-pagination background :current-page="currentPage" :page-sizes="[15, 30, 50, 100, 200, 500]" :page-size="15" layout="total, prev, pager, next, sizes" :total="total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
          <!-- 分页END -->
        </el-tab-pane>
        <!-- 已完结END -->
      </el-tabs>
    </div>
    <!-- 页面表格END -->
    <!-- 已处理部分弹出框 -->
    <el-dialog title="当前状态" :visible.sync="dialogLogsVisibleTwo">
      <div style="width: 100%;height: auto;overflow-x: auto;">
        <img :src="imgsrc" alt />
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
import axios from "../../service/http";
import { option } from "../../static/config.js";
//引入组件
import lookApproveLog from "@/components/lookApproveLog";
export default {
  // 数据源
  data() {
    return {
      form: {
        queryStateParams: "WF_SUSPENDING_QUERY_SQL_PARAMS",
        selectParam: "",
        invoiceState: "",
        invoiceType: "",
        pageNum: 1,
        pageSize: 15
      },
      input: "",
      imgsrc: "",
      activeTab: "first",
      processedTableData: [],
      total: 0,
      currentPage: 1,
      multipleSelection: [],
      expenditureAppId: "",
      currentRow: null, //选中一条数据
      dialogLogsVisibleTwo: false, //已处理弹出框
      //类型下拉框
      typeList: [
        {
          value: "DCWSH",
          label: "待财务审核"
        },
        {
          value: "DSQRCL",
          label: "待申请人处理"
        },
        {
          value: "YKP",
          label: "已开票"
        },
        {
          value: "HXZ",
          label: "核销中"
        },
        {
          value: "YHX",
          label: "已核销"
        }
      ],
      //红冲/作废下拉框
      voidList: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "2",
          label: "红冲重开"
        },
        {
          value: "3",
          label: "作废重开"
        },
        {
          value: "1",
          label: "其他"
        }
      ],
      //红冲按钮
      printBtn: false,
      //作废按钮
      deleteBtn: false,
      //撤销按钮
      cancelBtn: true,
      userInfo: {},
      voidBtn: false, //红冲按钮权限控制
      hongchongBtn: false, //作废按钮权限控制
      timer: null,//时间
    };
  },
  // 初始化执行
  created() {
    this.getMessage();
    this.accessControlFun(); //调用权限控制接口
    // this.getuser();
    // this.getMenuId();
  },
  // 方法声明
  methods: {
    //调用权限控制接口
    accessControlFun() {
      axios
        .post(option.base_path + "index/getFuncListByMenuId", {
          dynamicKey: "",
          systemId: 69
        })
        .then(data => {
          data.data.data.forEach(v => {
            if (v.funcCode == "hongchongBtn") {
              //红冲按钮
              this.hongchongBtn = true;
            } else if (v.funcCode == "voidBtn") {
              //作废按钮
              this.voidBtn = true;
            }
          });
        });
    },
    //获取人员信息
    getuser() {
      axios
        .post(option.base_path + "index/getCurrentUserInfo", this.userInfo)
        .then(res => {
          this.userInfo = res.data.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //查看获取权限
    getMenuId() {
      axios
        .post(option.base_path + "index/getFuncListByMenuId", {
          dynamicKey: "",
          systemId: 69,
          menuId: 1080
        })
        .then(res => {
          console.log(res.data.data);
        })
        .catch(function(error) {
          console.log(error);
        });
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
    //关闭弹框的事件
    closeDialogTwo(row) {
      this.dialogLogsVisibleTwo = false;
    },
    // 跳转作废
    mingcheck() {
      if (this.currentRow != null) {
        this.toOut("/invoice/invoiceDetails", {
          pkId: this.currentRow.pkId,
          lookType: 4
        });
      } else {
        this.$message("请选中一行数据进行操作");
      }
    },
    toPage2(path, row) {
      this.$router.replace({
        path: path,
        query: {
          pkId: row.pkId,
          lookType: 1,
          goType: 1
        }
      });
    },
    toPage3(path, row) {
      this.$router.replace({
        path: "/invoice/invoiceAdd",
        query: {
          pkId: row.pkId,
          lookType: 2,
          goType: 1
        }
      });
    },
    handleClick(id) {
      if (id.index == 0) {
        // 触发‘配置管理’事件
        this.form.queryStateParams = "WF_SUSPENDING_QUERY_SQL_PARAMS";
        //隐藏红冲和作废
        this.printBtn = false;
        this.deleteBtn = false;
        this.cancelBtn = true;
      } else if (id.index == 1) {
        // 触发‘用户管理’事件
        this.form.queryStateParams = "WF_SOLVED_QUERY_SQL_PARAMS";
        //隐藏红冲和作废
        this.printBtn = false;
        this.deleteBtn = false;
        this.cancelBtn = false;
      } else if (id.index == 2) {
        this.form.queryStateParams = "WF_COMPLETED_QUERY_SQL_PARAMS";
        //显示红冲和作废
        this.printBtn = true;
        this.deleteBtn = true;
        this.cancelBtn = false;
      }
      this.getMessage();
    },
    handleSizeChange(val) {
      this.form.pageSize = val;
      console.log(`每页 ${val} 条`);
      this.getMessage();
    },
    handleCurrentChange(val) {
      this.form.pageNum = val;
      console.log(`当前页: ${val}`);
      this.getMessage();
    },
    //     print(){
    //       this.$router.push('./printDetails')
    // //       if(this.multipleSelection.length != 1){
    // //         this.$message('请选中一行数据进行操作');
    // //       }else{
    // //         this.toPage('./printDetails',this.multipleSelection[this.val])
    // //       }
    //     },
    resetForm(form) {
      (this.activeTab = "first"),
        (this.form = {
          queryStateParams: "WF_SUSPENDING_QUERY_SQL_PARAMS",
          selectParam: "",
          pageNum: 1,
          pageSize: 15
        });
      this.getMessage();
    },
    getMessage() {
      axios
        .post(option.base_path + "db/income/getInvoiceWorkflowList", this.form)
        .then(res => {
          console.log("rengong", res);
          this.processedTableData = res.data.data.rows;
          this.total = res.data.data.total;
        })
        .catch(error => {
          console.log("异常", error);
        });
    },
    // 点击选中这一行
    clickcheck(val) {
      // this.expenditureAppId=val.expenditureAppId
      console.log(val);
      // this.multipleSelection = val;
      this.currentRow = val;
    },
    // 跳转新增
    pastcheck() {
      this.toAdd("./invoiceAdd", this.currentRow);
    },
    //跳转红冲
    printEven() {
      if (this.currentRow != null) {
        this.toPage("/invoice/invoiceDetails", {
          pkId: this.currentRow.pkId,
          lookType: 3,
          goType: 1
        });
      } else {
        this.$message("请选中一行数据进行操作");
      }
    },
    toOut(path, row) {
      this.$router.replace({
        path: path,
        query: {
          pkId: row.pkId,
          lookType: 4,
          goType: 1
        }
      });
    },
    toAdd(path, row) {
      this.$router.replace({
        path: path,
        query: {
          lookType: 1,
          goType: 1
        }
      });
    },
    toPage(path, row) {
      this.$router.replace({
        path: path,
        query: {
          pkId: row.pkId,
          lookType: 3,
          goType: 1
        }
      });
    },
    toPage4(path, row) {
      this.$router.replace({
        path: path,
        query: {
          pkId: row.pkId,
          lookType: 2,
          goType: 1
        }
      });
    },
    // 发票申请状态小贴士弹窗
    openWarn() {
      if (this.timer) {
          clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
          this.openWarnlist();
        }, 1000)
    },
    openWarnlist(){
     this.$notify.close();
      this.$notify({
        title: "发票申请状态小贴士：",
        dangerouslyUseHTMLString: true,
        customClass: "warn",
        message:
          '<el-row style="font-size:12px;max-height: 300px;overflow: auto;">' +
          '<el-col :span="24">' +
          "<div>发票申请共有待财务审核、待申请人处理、已开票、核销中、已核销五个状态。</div><br>" +
          '<div style="color:black;font-weight: bolder;">待财务审核</div>' +
          "<div>用户填写发票申请，提交，便进入“待财务审核”状态。</div><br>" +
          '<div style="color:black;font-weight: bolder;">待申请人处理</div>' +
          "<div>财务人员接到用户提交的发票申请，如发现申请填写有问题，可选择“退回申请人”操作，提交后，发票申请状态变为“待申请人处理”。申请人可在“待处理”页面中进行处理后再次提交，也可直接撤销。</div><br>" +
          '<div style="color:black;font-weight: bolder;">已开票</div>' +
          "<div>财务人员接到用户提交的发票申请，如无问题，可选择“开票”操作，提交后，发票申请状态变为“已开票”。</div><br>" +
          '<div style="color:black;font-weight: bolder;">核销中</div>' +
          "<div>已开票的发票申请，因为还没有实际收到款项，我们也可把其称之为“预开发票”。这些预开的发票，需要实际收到款项后进行“核销”。所以当实际收到的款项未到达发票申请金额时，我们称之为“核销中”。</div><br>" +
          '<div style="color:black;font-weight: bolder;">已核销</div>' +
          "<div>已开票的发票申请，因为还没有实际收到款项，我们也可把其称之为“预开发票”。这些预开的发票，需要实际收到款项后进行“核销”。所以当实际收到的款项到达了发票申请金额时，我们称之为“已核销”。</div><br>" +
          '<div style="color:red;">场景举例：</div>' +
          '<div style="text-indent:2em;">2020年7月9日，员工李明填写发票申请，申请开票金额为500万，提交后生成了一条编号为“FP20200709001”的发票申请。此时FP20200709001状态为“待财务审核”。</div><br>' +
          '<div style="text-indent:2em;">2020年7月10日，财务人员赵芳芳审核了该申请，认为申请中信息中开票抬头填写有误，返回给李明修改，此时FP20200709001状态为“待申请人处理”</div><br>' +
          '<div style="text-indent:2em;">2020年7月10日，李明修改后，再次提交，FP20200709001状态变为“待财务审核”</div><br>' +
          '<div style="text-indent:2em;">2020年7月10日， 财务人员赵芳芳通过了该申请，并开具了发票，发票申请FP20200709001，状态变为“已开票”。</div><br>' +
          '<div style="text-indent:2em;">2020年7月30日，客户将第一笔款项300万打入公司账户，李明核销了发票申请FP20200709001的部分金额，此时发票状态为“核销中”。</div><br>' +
          '<div style="text-indent:2em;">2020年12月10日，客户尾款200万打入公司账户，李明核销了发票申请FP20200709001的剩余金额。至此发票申请FP20200709001完成核销，状态变为“已核销”。</div><br>' +
          "</el-col>" +
          "</el-row>"
      });
    }
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
    }
  },
  // 组件注册
  components: {
    lookApproveLog
  }
};
</script>
<style>
.warn {
  font-size: 12px;
  max-height: 700px;
  overflow: auto;
}
</style>
<style scoped>
.el-tabs__nav-scroll {
  border: 1px solid #dcdfe6;
  border-bottom: 0;
}
.el-tabs--border-card {
  border: 0;
  box-shadow: none;
}
.warn {
  color: red;
  font-size: 12px;
  max-height: 300px;
  overflow: auto;
}
</style>

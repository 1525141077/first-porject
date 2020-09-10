<template>
  <div class="yt-dome-container">
    <el-header class="yt-header">
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
        :label-position="labelposition"
        size="small"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="关键字：">
              <el-input v-model="form.selectParam" class placeholder="请输入关键字" clearable></el-input>
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
          <el-col :span="3" style="margin-left:20px">
            <el-button type="primary" @click="getProjectList()">查询</el-button>
            <el-button type="info" @click="resetForm('form')">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-row>
      <el-col :span="24" align="left">
        <el-button type="primary" @click="pastcheck" style="margin-left: 20px">新增</el-button>
      </el-col>
    </el-row>
    <div class="tab-mod" style="margin-top: 20px;min-height: 100%;min-width: 100%;">
      <el-tabs type="border-card" v-model="activeName" @tab-click="tabClick">
        <el-tab-pane label="草稿" name="1">
          <!-- //表格 -->
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="createTime" label="保存日期" align="center" width="120px"></el-table-column>
            <el-table-column prop="invoiceRise" label="发票抬头" show-overflow-tooltip	 header-align="center" align="left"></el-table-column>
            <el-table-column prop="invoiceAmount" label="含税金额（元）" align="right" width="150px">
              <template slot-scope="scope">
                <span>{{scope.row.invoiceAmount | moneyFormat}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="invoiceType" label="发票类型" header-align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.invoiceType == '1'">增值税专用发票</span>
                <span v-else-if="scope.row.invoiceType == '2'">增值税普通发票</span>
              </template>
            </el-table-column>
            <el-table-column prop label="操作" align="center" width="150px">
              <template slot-scope="scope">
                <el-button size="mini" @click="toPage('',scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.row.pkId,scope.row)">删除</el-button>
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
        </el-tab-pane>
        <el-tab-pane label="已提交" name="2">
          <el-table :data="dataList" border style="width: 100%">
            <el-table-column prop="invoiceAppNum" label="发票申请编号" align="center" width="130px"></el-table-column>
            <el-table-column prop="invoiceRise" show-overflow-tooltip	 label="发票抬头" header-align="center" align="left"></el-table-column>
            <el-table-column prop="invoiceAmount" label="含税金额（元）" align="right" width="150px">
              <template slot-scope="scope">
                <span>{{scope.row.invoiceAmount | moneyFormat}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="invoiceNumber" label="发票张数" width="100" align="center"></el-table-column>
            <el-table-column prop="invoiceType" label="发票类型" header-align="center" width="130">
              <template slot-scope="scope">
                <span v-if="scope.row.invoiceType == '1'">增值税专用发票</span>
                <span v-else-if="scope.row.invoiceType == '2'">增值税普通发票</span>
              </template>
            </el-table-column>
            <el-table-column prop="nodeNowState" label="状态" width="140" align="center">
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
            <el-table-column prop label="操作" align="center" width="120px">
              <template slot-scope="scope">
                <el-link type="primary" @click="toPage4('/invoice/invoiceDetails',scope.row)">查看</el-link>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            :current-page="dataPage"
            :page-sizes="[15, 30, 50, 100, 200, 500]"
            :page-size="15"
            layout="total, prev, pager, next, sizes"
            :total="dataTotal"
            @size-change="dataSizeChange"
            @current-change="dataCurrentChange"
          ></el-pagination>
        </el-tab-pane>
      </el-tabs>
      
    </div>
  </div>
</template>

<script>
import axios from "../../service/http";
import { option } from "../../static/config";
export default {
  // 数据源
  data() {
    return {
      currentRow: null, //选中一条数据
      form: {
        selectParam: "",
        invoiceType: "",
        workFlowState: '1', //（1 草稿箱 2 已提交）
        invoiceState: '', //  红冲/作废
        pageNum: 1,
        pageSize: 15
      },
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
      activeName: '1',
      total: 0,
      currentPage: 1,
      labelposition: "right",
      tableData: [],
      dataList: [],
      dataTotal: 0,
      dataPage: 1,
      //  开始日期
      pickerStartDate: {
        disabledDate: time => {
          if (this.form.closeDate) {
            return time.getTime() > this.form.closeDate;
          }
        }
      },
      // 结束日期
      pickerCloseDate: {
        disabledDate: time => {
          return time.getTime() < this.form.startDate;
        }
      }
    };
  },
  // 初始化执行
  mounted() {
    this.getProjectList();
  },
  // 方法声明
  methods: {
    //手动切换每页条数
    handleSizeChange(val) {
      this.form.pageSize = val;
      console.log(`每页 ${val} 条`);
      this.getProjectList();
    },
    //手动切换页数
    handleCurrentChange(val) {
      this.form.pageNum = val;
      console.log(`当前页: ${val}`);
      this.getProjectList();
    },
    // 重置
    resetForm(form) {
      this.form = {
        selectParam: "",
        invoiceType: "",
        workFlowState: '1', //（1 草稿箱 2 已提交）
        invoiceState: '', //  红冲/作废
        pageNum: 1,
        pageSize: 15
      };
      this.getProjectList();
    },
    // 跳转
    toPage(path, row) {
      path = "./invoiceAdd";
      this.$router.replace({
        path: path,
        query: {
          pkId: row.pkId,
          lookType: 2,
          goType: 2
        }
      });
    },
    // 查询
    getProjectList() {
      let that = this;
      this.form.workFlowState = this.activeName
      axios
        .post(option.base_path + "db/income/getInvoiceDraftList", this.form)
        .then(res => {
          if (this.activeName == '1') {
            this.tableData = res.data.data.rows;
            this.total = res.data.data.total;
          } else {
            this.dataList = res.data.data.rows;
            this.dataTotal = res.data.data.total;
          }
          console.log("返回值", res.data.data);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // 删除
    handleDelete(id, row) {
      let that = this;
      that
        .$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          axios
            .post(option.base_path + "db/income/deleteInvoiceDraft", {
              pkId: id
            })
            .then(res => {
              this.getProjectList();
            });
          that.$message.success("删除成功");
        })
        .catch(() => {
          that.$message.info("已取消删除");
        });
    },
    tabClick () {
      this.getProjectList();
    },
    dataSizeChange (val) {
      this.form.pageSize = val
      this.getProjectList();
    },
    dataCurrentChange (val) {
      this.form.pageNum = val
      this.getProjectList();
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
    },
    // 跳转新增
    pastcheck() {
      this.toAdd("./invoiceAdd", this.currentRow);
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
    toPage4(path, row) {
      this.$router.replace({
        path: path,
        query: {
          pkId: row.pkId,
          lookType: 2,
          goType: 1
        }
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
    axios
  }
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
.el-date-editor--daterange.el-input,
.el-date-editor--daterange.el-input__inner,
.el-date-editor--timerange.el-input,
.el-date-editor--timerange.el-input__inner {
  width: 423px !important;
}
</style>

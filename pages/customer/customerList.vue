<template>
  <div class="yt-dome-container">
    <!-- :style="publicHeight" -->
    <el-container>
      <!-- 页面头部 -->
      <el-header class="yt-header">
        <el-form ref="form" label-width="60px" size="small">
          <el-row>
            <el-col :span="10">
              <el-form-item >
                  <label slot="label">关键字：</label>
                <el-input v-model="params.selectParam" class placeholder="请输入客户名称/地区/行业" clearable></el-input>
              </el-form-item>
            </el-col>
            <div style="position: relative;left: 20px;display: flex;top: 3px;">
              <el-button type="primary" @click="getProjectBiddingList(1)">查询</el-button>
              <!-- <el-button type="info" @click="resetForm('form')">重置</el-button> -->
            </div>
          </el-row>
        </el-form>
        <!-- 按钮START -->
        <div style="margin: 10px 0px;">
          <el-button
            class="yt-bottom-btn"
            style="margin-right: 0px;"
            type="primary"
            @click="addAcount"
          >新增</el-button>
        </div>
        <!-- 按钮END -->
      </el-header>
      <div
        style="height: 5px;background-color: #f3f3f3;border-top: 1px solid #dfe6f3;border-bottom: 1px solid #dfe6f3;"
      ></div>
      <!-- 页面主体 -->
      <el-table
        :data="tableData"
        border
        highlight-current-row
        @row-click="rowClick"
        style="width: 100%"
      >
        <el-table-column prop="customerName" label="客户名称" align="center"></el-table-column>
        <el-table-column prop="regionName" label="客户地区" width="140px" ref="cesName" align="center"></el-table-column>
        <el-table-column prop="customerTrade" label="客户行业" align="center"></el-table-column>
        <el-table-column prop="cooperationCompanyNum" align="center" label="合作公司数量" width="120px">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top"  >
              <div v-for="(item,index) in scope.row.companyForshot" :key="index">
                <p @mouseover="mouseOver(scope.row)">{{item.companyForshot}}</p>
              </div>
              <div slot="reference" class="name-wrapper">{{ scope.row.cooperationCompanyNum}}</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="cooperationProjectNum" label="合作项目数量" width="120px">
          <!-- <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <div v-for="(item,index) in scope.row.companyForshot" :key="index">
                <p>{{item}}</p>
              </div>
              <div slot="reference" class="name-wrapper">{{ scope.row.cooperationProjectNum }}</div>
            </el-popover>
          </template> -->
        </el-table-column>
        <el-table-column prop="updateTime" align="center" label="最新修改时间"></el-table-column>
        <el-table-column prop label="操作" align="center" width="140px">
          <template scope="scope">
            <el-button
              type="text"
              size="small"
              @click="toPage('/customer/customerAdd',scope.row)"
            >修改</el-button>
            <span class="center-line">|</span>
            <el-button
              type="text"
              size="small"
              @click="toPage('/customer/customerDetails',scope.row)"
            >查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        :current-page="params.pageNum"
        :page-sizes="[15, 30, 50, 100, 200, 500]"
        :page-size="params.pageSize"
        layout="total, prev, pager, next, sizes"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </el-container>
  </div>
</template>

<script>
import axios from "../../service/http";
import { option } from "../../static/config";
export default {
  // 数据源
  data() {
    return {
      total: 0,
      params: {
        selectParam: "",
        pageNum: 1,
        pageSize: 15,
      },
      tableData: [
        {
          pkId: "",
          entryAccountNum: "",
          remitterName: "",
          remitterAccount: "",
          payeeName: "",
          payeeAccount: "",
          payeeAmountMoney: "",
          entryAccountDate: "",
          noClaimMoney: "",
        },
      ],
    };
  },
  // 初始化执行
  mounted() {
    this.getUserInfo();
  },
  // 方法声明
  methods: {
    // 点击当前行
    rowClick(item) {
      this.rowData = item;
    },
    addAcount() {
      this.$router.replace({
        path: "/customer/customerAdd",
        query: {},
      });
    },
    // 获取当前登录人信息
    getUserInfo() {
      axios
        .post(option.base_path + "index/getCurrentUserInfo", {
          page: 1,
        })
        .then((res) => {
          this.getProjectBiddingList();
          this.userInfo = res.data.data;
          // 初次进入
          if (res.data.data.rodNames.indexOf(",财务对账管理,") !== -1) {
            this.isGl = true;
          }
        });
    },
    toPage(path, row, type) {
      this.$router.replace({
        path: path,
        query: {
          pkId: row.pkId,
        },
      });
    },
    //重置按钮事件
    // resetForm(form) {
    //   this.activeName = 'first'
    //   this.dateList = []
    //   this.params.selectParam = ''
    //   //刷新
    //   this.getProjectBiddingList();
    // },
    //获取客户资源查询列表
    getProjectBiddingList(pageNum) {
      if (pageNum == 1) {
        this.params.pageNum = 1;
      }
      // debugger
      // let data = {};
      // data.selectParam = this.params.selectParam;
      axios
        .post(option.base_path + "db/customer/getCustomerList", this.params)
        .then((data) => {
          if (data.data.flag == 0) {
            this.tableData = data.data.data.rows;
            this.total = data.data.data.total;
            if (this.tableData.length !== 0) {
              this.tableData.forEach((n, i) => {
                for (let k in n) {
                  if (n[k] === "") {
                    n[k] = "--";
                  }
                }

                axios.post(option.base_path + "db/customer/getCompanyForshotList",
                    {
                      customerName: n.customerName,
                    }
                  )
                  .then((res) => {
                    if (res.data.flag == 0) {
                      n.companyForshot = res.data.data;
                      this.tableData.splice(i, 1, n)
                    }
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
              });
            }
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    mouseOver(row){
      console.log(row,"row")
    },
    //手动切换每页条数
    handleSizeChange(val) {
      this.params.pageSize = val;
      console.log(`每页 ${val} 条`);
      //刷新
      this.getProjectBiddingList();
    },
    //手动切换页数
    handleCurrentChange(val) {
      this.params.pageNum = val;
      console.log(`当前页: ${val}`);
      //刷新
      this.getProjectBiddingList();
    },
  },
  filters: {},
  // 组件注册
  components: {},
};
</script>

<style>
</style>

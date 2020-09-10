<template>
  <div class="yt-dome-container">
    <el-form ref="form" :model="form" :label-position="'right'" style="padding:20px 0px 0px 20px">
      <el-row>
        <el-col :span="18">
          <el-form-item label="关键字：">
            <el-input v-model="form.keyword" style="width:80%" placeholder="请输入项目名称、项目编号、项目经理、客户查询"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary">查询</el-button>
          <el-button type="info">重置</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-select v-model="form.timeType">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.timeType"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-date-picker
            v-model="dataInput"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="——"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <el-radio-group v-model="radio" @change="changeData">
              <el-radio :label="1">当月</el-radio>
              <el-radio :label="2">当年</el-radio>
              <el-radio :label="3">全部</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="项目类型：">
            <el-select v-model="form.projectType" placeholder="全部">
              <el-option
                v-for="item in projectType"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="项目竞聘状态：">
            <el-select v-model="form.competeType" placeholder="全部">
              <el-option
                v-for="item in projectCompete"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="项目合同状态：">
            <el-select v-model="form.contractState" placeholder="全部">
              <el-option
                v-for="item in projectContract"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="项目回款状态：">
            <el-select v-model="form.collectionState" placeholder="全部">
              <el-option
                v-for="item in projectCollection"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div
      style="background-color: rgb(243, 243, 243); 
    border-top: 1px solid rgb(223, 230, 243); 
    border-bottom: 1px solid rgb(223, 230, 243);
    text-align:left;
    color:#ff6600;
    height:45px;
    font-size:16px;
    display: flex;
    align-items:center"
    >风险：无相关风险或未设置风险规则，请联系风险管理确认！</div>
    <div class="box-div">
      <div>共{{projectMap.projectTotal}}个项目，其中{{projectMap.competeTotal}}个开放竞聘，共{{projectMap.competeProjectPersonTotal}}人次参与竞聘项目经理，{{projectMap.competeProjectPersonMemberTotal}}人次参与竞聘项目成员</div>
      <div>已关联的合同金额共计{{projectMap.contractTotalAmount | moneyFormat}} 元，已开票金额{{projectMap.invoiceTotalAmount | moneyFormat}}元，已回款{{projectMap.collectionTotalAmount | moneyFormat}}元，未回款金额，其中：已开票未回款{{projectMap.invoiceNoCollectionTotalAmount | moneyFormat}}元；尚有{{projectMap.noContractTotal}}个项目未关联合同</div>
    </div>
    <el-table :data="tableData" border @sort-change="changeOrder">
      <el-table-column prop="projectId" label="项目编号（默认倒序）" width="200" sortable="custom"></el-table-column>
      <el-table-column prop="projectName" label="项目名称" width="100"></el-table-column>
      <el-table-column prop="projectTypeName" label="项目类型" width="100"></el-table-column>
      <el-table-column prop="competeTypeName" label="竞聘状态" width="100"></el-table-column>
      <el-table-column prop="winningSituation" label="中选与竞聘情况" width="180"></el-table-column>
      <el-table-column prop="projectPersonName" label="项目经理" width="100"></el-table-column>
      <el-table-column prop="projectPersonMemberName" label="项目成员" width="100"></el-table-column>
      <el-table-column prop="customerName" label="客户名称" width="100"></el-table-column>
      <el-table-column prop="contractState" label="合同状态" width="100"></el-table-column>
      <el-table-column prop="contractTime" label="合同签订日期" width="180" sortable="custom"></el-table-column>
      <el-table-column prop="contractAmount" label="合同金额（元）" width="160" sortable="custom">
        <template slot-scope="scope">
          <span>{{scope.row.contractAmount | moneyFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="invoiceAmount" label="开票金额（元）" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.invoiceAmount | moneyFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="collectionState" label="回款状态" width="100"></el-table-column>
      <el-table-column prop="collectionAmount" label="回款金额（元）" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.collectionAmount | moneyFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="noCollectionAmount" label="未回款金额（元）" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.noCollectionAmount | moneyFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="invoiceNoCollectionAmount" label="其中：已开票未回款（元）" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.invoiceNoCollectionAmount | moneyFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="allocationMarket" label="已分配市场绩效（合同金额百分比）" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.allocationMarket + '%'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="noAllocationMarket" label="剩余未分配市场绩效（合同金额百分比）" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.noAllocationMarket + '%'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="allocationPractice " label="已分配执业绩效（合同金额百分比）" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.allocationPractice + '%'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="noAllocationPractice" label="剩余未分配执业绩效（合同金额百分比）" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.noAllocationPractice + '%'}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :current-page="1"
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
//axios接口组件
import axios from "../../service/http";
//配置文件
import { option } from "../../static/config";
export default {
  data() {
    return {
      form: {
        params: "", //	关键字查询
        timeType: "", //	日期类型	1 立项日期  2合同签订日期
        startTime: "", //	开始日期
        endTime: "", //	结束日期
        projectType: "", //	项目类型	1市场项目  2研发项目
        competeType: "", //	项目竞聘状态	1无需竞聘 2竞聘中 3竞聘完成
        contractState: "", //	项目合同状态	1履约中 2履约完毕 3未关联合同
        collectionState: "", //	项目回款状态	1回款100%  2回款90%及以上  3回款90%以下  4未回款
        projectIdSort: "DESC", //	项目编号排序	正序 ASC  倒叙 DESC
        contractTimeSort: "DESC", //	合同签订日期排序	正序 ASC  倒叙 DESC
        contractAmountSort: "DESC", //	合同金额（元）排序	正序 ASC  倒叙 DESC
        pageIndex: 15, //	每页条数	必传
        pageNum: 1, //	页面编号	必传
      },
      projectMap: {
        projectTotal: 0,
        competeTotal: 0,
        competeProjectPersonTotal: 0,
        competeProjectPersonMemberTotal: 0,
        contractTotalAmount: 0,
        invoiceTotalAmount: 0,
        collectionTotalAmount: 0,
        invoiceNoCollectionTotalAmount: 0,
        noContractTotal: 0,
      },
      tableData: [],
      dataInput: [],
      radio: 3,
      options: [
        {
          timeType: "立项日期",
          id: "1",
        },
        {
          timeType: "合同签订日期",
          id: "2",
        },
      ],
      projectType: [
        {
          value: "市场项目",
          id: "1",
        },
        {
          value: "研发项目",
          id: "2",
        },
      ],
      projectCompete: [
        {
          value: "无需竞聘",
          id: "1",
        },
        {
          value: "竞聘中",
          id: "2",
        },
        {
          value: "竞聘完成",
          id: "3",
        },
      ],
      projectContract: [
        {
          value: "履约中",
          id: "1",
        },
        {
          value: "履约完毕",
          id: "2",
        },
        {
          value: "未关联合同",
          id: "3",
        },
      ],
      projectCollection: [
        {
          value: "回款100%",
          id: "1",
        },
        {
          value: "回款90%及以上",
          id: "2",
        },
        {
          value: "回款90%以下",
          id: "3",
        },
        {
          value: "未回款",
          id: "4",
        },
      ],
      total: 0,
    };
  },
  components: {},
  mounted() {},
  methods: {
    changeData(value) {
      if (value == 1) {
        this.data[0] = "2020-09-01";
        this.data[1] = "2020-09-30";
      } else if (value == 2) {
        this.form.startTime = "";
        this.form.endTime = "";
      } else if (value == 3) {
        this.form.startTime = "";
        this.form.endTime = "";
      }
    },
    //排序传参
    changeOrder(value) {
      console.log(value);
      switch (value.prop) {
        //项目编号排序
        case "projectId":
          if (value.order == "ascending") {//正序
            this.form.projectIdSort = 'ASC';
          }else if (value.order == "descending"){//倒序
            this.form.projectIdSort = 'DESC';
          }
          //项目查询
          this.getProjectStatisticalQuery();
          break;
        //合同签订日期排序
        case "contractAmount":
          if (value.order == "ascending") {//正序
            this.form.contractTimeSort = 'ASC';
          }else if (value.order == "descending"){//倒序
            this.form.contractTimeSort = 'DESC';
          }
          //项目查询
          this.getProjectStatisticalQuery();
          break;
        //合同金额排序
        case "contractTime":
          if (value.order == "ascending") {//正序
            this.form.contractAmountSort = 'ASC';
          }else if (value.order == "descending"){//倒序
            this.form.contractAmountSort = 'DESC';
          }
          //项目查询
          this.getProjectStatisticalQuery();
          break;
        default:
          break;
      }
    },
    //项目查询
    getProjectStatisticalQuery() {
      let map = {};
      axios
        .post(
          option.base_path + "project/platform/getProjectStatisticalQuery",
          this.form
        )
        .then((res) => {
          if (res.data.flag == 0) {
            this.tableData = res.data.data.rows;
            this.total = res.data.data.total;
            this.projectMap = res.data.data;
          }
        });
    },
    //手动切换每页条数
    handleSizeChange(val) {
      this.form.pageNum = val;
      //this.getProjectStatisticalQuery();
    },
    //手动切换页数
    handleCurrentChange(val) {
      this.form.pageIndex = val;
      console.log(`当前页: ${val}`);
      //this.getProjectStatisticalQuery();
    },
  },
  filters: {
    // 转换算法主函数
    numberToChinese(n) {
      if (n) {
        let fraction = ["角", "分"];
        let digit = [
          "零",
          "壹",
          "贰",
          "叁",
          "肆",
          "伍",
          "陆",
          "柒",
          "捌",
          "玖",
        ];
        let unit = [
          ["元", "万", "亿"],
          ["", "拾", "佰", "仟"],
        ];
        let head = n < 0 ? "欠" : "";
        n = Math.abs(n);
        let s = "";
        for (let i = 0; i < fraction.length; i++) {
          s += (
            digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]
          ).replace(/零./, "");
        }
        s = s || "整";
        n = Math.floor(n);
        for (let i = 0; i < unit[0].length && n > 0; i++) {
          let p = "";
          for (let j = 0; j < unit[1].length && n > 0; j++) {
            p = digit[n % 10] + unit[1][j] + p;
            n = Math.floor(n / 10);
          }
          s = p.replace(/(零.)*零$/, "").replace(/^$/, "零") + unit[0][i] + s;
        }
        return (
          head +
          s
            .replace(/(零.)*零元/, "元")
            .replace(/(零.)+/g, "零")
            .replace(/^整$/, "零元整")
        );
      } else {
        return "--";
      }
    },
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
};
</script>

<style>
.box-div {
  border: 1px solid #ebebeb;
  border-radius: 3px;
  box-shadow: 0 0 8px 0 rgba(232, 237, 250, 0.6),
    0 2px 4px 0 rgba(232, 237, 250, 0.5);
  width: 100%;
  font-weight: bold;
  text-align: center;
  font-size: 16px;
  padding: 10px 0 10px 0;
}
</style>

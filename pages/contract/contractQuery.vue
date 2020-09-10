<template>
  <div class="yt-dome-container">
    <el-form ref="form" :model="form" :label-position="'right'" style="padding:20px 0px 0px 20px">
      <el-row>
        <el-col :span="18">
          <el-form-item label="关键字：">
            <el-input
              v-model="form.keyword"
              style="width:80%"
              placeholder="请输入合同名称、合同编号、委托方名称、被委托方名称查询"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary">查询</el-button>
          <el-button type="info">重置</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="签订日期：">
            <el-date-picker
              v-model="dataInput"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="——"
              start-placeholder="请选择日期"
              end-placeholder="请选择日期"
            ></el-date-picker>
          </el-form-item>
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
          <el-form-item label="合同类型：">
            <el-select v-model="form.contractType" placeholder="全部">
              <el-option
                v-for="item in contractType"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="合同状态：">
            <el-select v-model="form.contractState" placeholder="全部">
              <el-option
                v-for="item in contractCompete"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="回款情况：">
            <el-select v-model="form.collectionState" placeholder="全部">
              <el-option
                v-for="item in contractContract"
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
      <div>共{{projectMap.projectTotal}}个合同，其中收入合同共涉及合同金额{{projectMap.competeTotal}}元，已收款{{projectMap.competeProjectPersonTotal}}元，未收款{{projectMap.competeProjectPersonMemberTotal}}元；</div>
      <div>有{{projectMap.contractTotalAmount | moneyFormat}} 个收入合同在最近一个季度内有阶段回款计划，涉及金额{{projectMap.invoiceTotalAmount | moneyFormat}}元。</div>
    </div>
    <el-table :data="tableData" border @sort-change="changeOrder">
      <el-table-column prop="contractNum" label="合同编号" width="120" sortable="custom"></el-table-column>
      <el-table-column prop="contractName" label="合同名称" width="100" align="left"></el-table-column>
      <el-table-column prop="contractType" label="合同类型" width="100"></el-table-column>
      <el-table-column prop="entrustingParty" label="委托方" width="100" align="left"></el-table-column>
      <el-table-column prop="commissionedParty" label="被委托方" width="120"></el-table-column>
      <el-table-column prop="contractTime" label="签订日期（默认倒序）" width="200" sortable="custom"></el-table-column>
      <el-table-column prop="contractAmount" label="合同金额（元）" width="160" sortable="custom" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.contractAmount | moneyFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="contractStateName" label="合同状态" width="100"></el-table-column>
      <el-table-column prop="executedContract" label="已履行合同阶段/应履行合同阶段" width="140"></el-table-column>
      <el-table-column prop="latelyTime" label="最近一个收（付）款日期" width="150" sortable="custom" align="right"></el-table-column>
      <el-table-column
        prop="collectAmount"
        label="已（收）付款金额/应（收）付款金额（元）"
        width="200"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span>{{scope.row.collectAmount | moneyFormat}}</span>
          <br />
          <span>"/" + {{scope.row.dueAmount | moneyFormat}} + {{scope.row.collectDueProportion}} + "%"</span>
        </template>
      </el-table-column>
      <el-table-column prop="contractProjectName" label="合同关联项目" width="120" align="left"></el-table-column>
      <el-table-column prop="contractProjectPersonName" label="合同关联项目经理" width="120"></el-table-column>
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
        startTime: "", //	开始日期
        endTime: "", //	结束日期
        contractType: "", //	项目类型	1.收入合同 2.支出合同
        contractState: "", //	项目合同状态	1.履行中 2.已完成
        collectionState: "", //	项目回款状态	1回款100% 2回款90%及以上3回款90%以下4未回款5未关联项目
        collectionTimeSort: "", //	签订日期排序	正序 ASC  倒叙 DESC
        contractAmountSort: "", //	合同金额（元）排序	正序 ASC  倒叙 DESC
        latelyTimeSort: "", //	最近一个收（付）款日期排序	正序 ASC  倒叙 DESC
        pageIndex: "", //	每页条数	必传
        pageNum: "", //	页面编号	必传
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
      contractType: [
        {
          value: "收入合同",
          id: "1",
        },
        {
          value: "支出合同",
          id: "2",
        },
      ],
      contractCompete: [
        {
          value: "履行中",
          id: "1",
        },
        {
          value: "已完成",
          id: "2",
        },
      ],
      contractContract: [
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
        {
          value: "未关联项目",
          id: "5",
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
        //签订日期排序
        case "contractTime":
          if (value.order == "ascending") {
            //正序
            this.form.collectionTimeSort = "ASC";
          } else if (value.order == "descending") {
            //倒序
            this.form.collectionTimeSort = "DESC";
          }
          //合同查询
          this.getContractStatisticalQuery();
          break;
        //合同金额排序
        case "contractAmount":
          if (value.order == "ascending") {
            //正序
            this.form.contractAmountSort = "ASC";
          } else if (value.order == "descending") {
            //倒序
            this.form.contractAmountSort = "DESC";
          }
          //合同查询
          this.getContractStatisticalQuery();
          break;
        //最近一个收（付）款日期排序
        case "latelyTime":
          if (value.order == "ascending") {
            //正序
            this.form.latelyTimeSort = "ASC";
          } else if (value.order == "descending") {
            //倒序
            this.form.latelyTimeSort = "DESC";
          }
          //合同查询
          this.getContractStatisticalQuery();
          break;
        default:
          break;
      }
    },
    //合同查询
    getContractStatisticalQuery() {
      let map = {};
      axios
        .post(
          option.base_path + "contract/getContractStatisticalQuery",
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
      //this.getContractStatisticalQuery();
    },
    //手动切换页数
    handleCurrentChange(val) {
      this.form.pageIndex = val;
      console.log(`当前页: ${val}`);
      //this.getContractStatisticalQuery();
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
  text-align: right;
  font-size: 16px;
  padding: 10px 0 10px 0;
}
</style>

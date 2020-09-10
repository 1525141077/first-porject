<template>
  <div class="yt-dome-container">
    <el-form style="padding: 20px 20px;" ref="form">
      <el-row>
        <el-col :span="7" align="right">
          <el-form-item label="关键字：" label-width="60px">
            <el-input v-model="form.queryParam" autocomplete="true" placeholder="请输入合同编号、合同名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5" align="left">
          <el-form-item label="合同状态：" label-width="80px">
            <el-select v-model="form.contractState" placeholder="全部">
              <el-option
                v-for="item in contractStateList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="9" align="right">
          <el-button type="primary" @click="getContractInfoList()">查询</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div style="padding-left:20px;padding-bottom:10px">
      <el-button type="primary" @click="addPage('./contractApply',0)">新增合同</el-button>
      <el-button type="primary" @click="toPage('./contractApply',2)">修改合同信息</el-button>
    </div>
    <el-table border :data="gridData" @current-change="clickcheck" highlight-current-row>
      <el-table-column property="contractNum" label="合同编号" width="150" align="center">
        <template slot-scope="scope">
          <span
            style="color:#417095;cursor: pointer;"
            @click="toPageDetail('./contractApply',1,scope.row.contractId)"
          >{{scope.row.contractNum}}</span>
        </template>
      </el-table-column>
      <el-table-column property="contractName" label="合同名称" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column property="partner" label="合作方" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column property="contractAmount" label="合同金额（元）" width="150" align="right">
        <template scope="scope">
          <span>{{scope.row.contractAmount | moneyFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column property="contractType" label="合同类型" width="100" align="center">
        <template scope="scope">
          <span>{{contractTypeBool(scope.row.contractType)}}</span>
        </template>
      </el-table-column>
      <el-table-column property="contractState" label="合同状态" align="center" width="100">
        <template scope="scope">
          <span>{{contractStateBool(scope.row.contractState)}}</span>
        </template>
      </el-table-column>
      <el-table-column property="updateTime" label="更新时间" width="100" align="center"></el-table-column>
      <el-table-column property="updateUserName" label="最新修改人" align="center" width="150"></el-table-column>
    </el-table>
    <el-pagination
      background
      :current-page="currentPage"
      :page-sizes="[15, 30, 50, 100, 200, 500]"
      :page-size="15"
      layout="total, prev, pager, next, sizes"
      :total="pageTotal"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
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
      form: {
        queryParam: "", //关键字
        contractState: "", //合同状态
        pageIndex: 1,
        pageNum: 15
      },
      contractStateList: [
        {
          value: "1",
          label: "履行中"
        },
        {
          value: "2",
          label: "已完成"
        }
      ], //合同状态集合
      currentPage: 1,
      pageTotal: 0,
      //表格数据
      gridData: [],
      currentRow: null //选中一条数据
    };
  },
  components: {
    topTip,
    upload,
    lookFiles
  },
  mounted() {
    this.getContractInfoList();
  },
  methods: {
    //手动切换每页条数
    handleSizeChange(val) {
      this.form.pageNum = val;
      console.log(`每页 ${val} 条`);
      //刷新
      this.getContractInfoList();
    },
    //手动切换页数
    handleCurrentChange(val) {
      this.form.pageIndex = val;
      console.log(`当前页: ${val}`);
      //刷新
      this.getContractInfoList();
    },
    // 关联项目信息
    getContractInfoList() {
      axios
        .post(option.base_path + "contract/getContractInfoList", this.form)
        .then(data => {
          let datas = data.data.data.rows;
          this.gridData = datas;
          this.pageTotal = data.data.data.total;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    resetForm(form) {
      this.form = {
        queryParam: "", //关键字
        contractState: "", //合同状态
        pageIndex: 1,
        pageNum: 15
      };
      //刷新
      this.getContractInfoList();
    },

    //跳转新增页面
    addPage(path, lookType) {
      this.$router.replace({
        path: path,
        query: {
          lookType: lookType
        }
      });
    },

    toPage(path, lookType) {
      if (this.currentRow != null) {
        this.$router.replace({
          path: path,
          query: {
            lookType: lookType,
            pkId: this.currentRow.contractId
          }
        });
      } else {
        this.$message("请选中一行数据进行操作");
      }
    },

    toPageDetail(path, lookType, contractId) {
      this.$router.replace({
        path: path,
        query: {
          lookType: lookType,
          pkId: contractId
        }
      });
    },

    // 点击选中这一行
    clickcheck(val) {
      console.log(val);
      this.currentRow = val;
    },
    //判断类型
    contractTypeBool(contractType) {
      let contractTypeName = "";
      if (contractType == 1) {
        contractTypeName = "收入合同";
      } else if (contractType == 2) {
        contractTypeName = "支出合同";
      } else {
        contractTypeName = "--";
      }
      return contractTypeName;
    },
    //判断状态
    contractStateBool(contractState) {
      let contractStateName = "";
      if (contractState == 1) {
        contractStateName = "履行中";
      } else if (contractState == 2) {
        contractStateName = "已完成";
      } else {
        contractStateName = "--";
      }
      return contractStateName;
    }
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
          "玖"
        ];
        let unit = [
          ["元", "万", "亿"],
          ["", "拾", "佰", "仟"]
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
    }
  }
};
</script>

<style scoped>
</style>

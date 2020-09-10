<template>
  <div>
    <topTip>
      <el-row>
        <el-col :span="15" class="top-tip" style="text-align: left;">
          <div>
            <span style="color: #417095;font-size: 16px;font-weight: bolder;">支出费用信息</span>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin:20px 20px 20px 9px">
        <el-col>
          <label class="yt-sec-title-line"></label>
          <span class="yt-sec-title-text">费用明细</span>
          <span style="margin-left:20px;vertical-align: middle;" v-if="isApply">
            <el-button type="primary" @click="addDilogShow('1')">新增</el-button>
          </span>
        </el-col>
      </el-row>
    </topTip>
    <div>
      <el-table :summary-method="getSummaries" show-summary border stripe size="small" :data="tableData" style="width: 100%">
        <el-table-column align="center" label="支出类型" width="180">
          <template slot-scope="scope">
            {{scope.row.dictTypeName}}
          </template>
        </el-table-column>
        <el-table-column prop="content" label="费用明细" width="300">
        </el-table-column>
        <el-table-column align="right" width="200" prop="money" label="金额（元）">
          <template slot-scope="scope">
            <span>{{scope.row.money |moneyFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="特殊说明">
          <template slot-scope="scope">
            {{scope.row.remark==""?"无":scope.row.remark}}
          </template>
        </el-table-column>
        <el-table-column v-if="isReimShow" width="100" label="是否报销">
          <template slot-scope="scope">
            {{scope.row.isReims=="1"?"是":"否"}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center" v-if="isApply">
          <template slot-scope="scope">
            <el-button type="text" size="small" style="padding:0px" @click="editBtn(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" size="small" style="padding:0px" @click="remove(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增费用明细弹窗 -->
    <el-dialog title="费用明细信息" center :close-on-click-modal="false" @close="closeD('1')" :visible.sync="addInfoFlag" width="35%">
      <div slot="title" style="color:#fff;font-size:16px;display:flex;align-item:center;padding:10px">
        <img style="width:25px;height:25px;margin-right:10px" src="../assets/images/common/info-icon.png" alt="" />
        <span>费用明细信息</span>
      </div>
      <el-form label-position="right" :model="addForm" :rules="addRules" ref="ruleForm">
        <el-form-item label="支出类型：" prop="dictTypeCode" label-width="100px">
          <el-select @change="onAddSelected" v-model="addForm.dictTypeCode" placeholder="请选择">
            <el-option label="请选择" value=""></el-option>
            <el-option v-for="item in expenseType" :key="item.dictTypeCode" :label="item.disvalue" :value="item.dictTypeCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="费用明细：" prop="content" label-width="100px">
          <el-input v-model="addForm.content" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="金额：" prop="money" label-width="100px">
          <finmoney v-model="addForm.money" :tail="'元'"></finmoney>
        </el-form-item>
        <el-form-item v-if="isReimShow" label="是否报销：" prop="isReimsName" label-width="100px">
          <el-select v-model="addForm.isReims">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="特殊说明：" prop="remark" label-width="100px">
          <el-input type="textarea" maxlength="100" resize="none" show-word-limit v-model="addForm.remark" placeholder="最多填写100字"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sureBtn">保 存</el-button>
        <el-button @click="addInfoFlag = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 修改 -->
    <el-dialog center :close-on-click-modal="false" style="padding-right:30px" @close="closeD('2')" :visible.sync="editInfoFlag" width="30%">
      <div slot="title" style="color:#fff;font-size:16px;display:flex;align-item:center;padding:10px">
        <img style="width:25px;height:25px;margin-right:10px" src="../assets/images/common/info-icon.png" alt="" />
        <span>费用明细信息</span>
      </div>
      <el-form label-position="right" :model="editForm" ref="ruleFormEdit" :rules="editRules">
        <el-form-item label="支出类型：" prop="dictTypeCode" label-width="100px">
          <el-select @change="onEditSelected" v-model="editForm.dictTypeCode" placeholder="请选择">
            <el-option label="请选择" value=""></el-option>
            <el-option v-for="item in expenseType" :key="item.dictTypeCode" :label="item.disvalue" :value="item.dictTypeCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="费用明细：" prop="content" label-width="100px">
          <el-input v-model="editForm.content" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item :inline="true" label="金额：" prop="money" label-width="100px">
          <!-- <el-input v-model="editForm.money"> -->
          <finmoney v-model="editForm.money" :tail="'元'"></finmoney>
        </el-form-item>
        <el-form-item v-if="isReimShow" label="是否报销：" prop="isReimsName" label-width="100px">
          <el-select v-model="editForm.isReims">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="特殊说明：" prop="remark" label-width="100px">
          <el-input type="textarea" maxlength="100" resize="none" show-word-limit v-model="editForm.remark" placeholder="最多填写100字"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editSave">保 存</el-button>
        <el-button @click="editInfoFlag = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import topTip from "../components/topTip";
import axios from "../service/http";
import { option } from "../static/config";
import finmoney from "../components/fin-money-input";
export default {
  props: {
    //表格数据
    tableData: {
      type: Array,
      default() {
        return [];
      }
    },
    isApply: {
      type: Boolean,
      default() {
        return false;
      }
    },
    isReimShow: {
      //控制是否报销列显示与隐藏
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  data() {
    var checkMoney = (rule, value, callback) => {
      if (value == 0) {
        return callback(new Error("字段不能为空"));
      } else {
        callback();
      }
    };
    return {
      // isApply: true, //判断是否问申请页还是详情页
      number: "", //单据张数
      expenseType: [], //支出类型下拉数据
      addForm: {
        //新增表单数据
        content: "",
        money: 0,
        remark: "",
        dictTypeName: "",
        dictTypeCode: "",
        isReims: "1",
        isReimsName: ""
      },
      editForm: {
        //修改表单数据
        content: "",
        money: 0,
        remark: "",
        dictTypeName: "",
        dictTypeCode: "",
        isReims: "1",
        isReimsName: ""
      },
      addInfoFlag: false, //控制新增信息弹窗显隐
      editInfoFlag: false, //控制修改信息弹窗显隐
      addRules: {
        content: [
          {
            required: true,
            message: "此信息不能为空,不要超过20个字",
            trigger: "blur",
            max: 20
          }
        ],
        money: [{ required: true, validator: checkMoney, trigger: "blur" }],
        dictTypeCode: [
          { required: true, message: "请选择支出类型", trigger: "change" }
        ]
      },
      editRules: {
        content: [
          {
            required: true,
            message: "此信息不能为空,不要超过20个字",
            trigger: "blur",
            max: 20
          }
        ],
        money: [{ required: true, validator: checkMoney, trigger: "blur" }],
        dictTypeCode: [
          { required: true, message: "请选择支出类型", trigger: "change" }
        ]
      }
    };
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
  components: {
    topTip,
    finmoney
  },
  mounted() {
    this.getProjectTypeDictList();
  },
  watch: {
    isReimShow: {
      handler() {
        this.getProjectTypeDictList();
      }
    }
  },
  methods: {
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
    //金额格式化
    rmoney(s) {
      //转成string类型
      s = s + "";
      return parseFloat(s.replace(/[^\d\.-]/g, ""));
    },
    addDilogShow() {
      this.addInfoFlag = true;
      this.addForm.isReims = "1";
      this.addForm.money = 0;
      this.addForm.content = this.addForm.remark = this.addForm.dictTypeName = this.addForm.dictTypeCode =
        "";
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (index == 2) {
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return this.moneyFormat(this.rmoney(prev) + this.rmoney(curr));
              } else {
                return prev;
              }
            }, 0);
            // sums[2] += "元";
          }
        }
      });
      return sums;
    },
    getProjectTypeDictList() {
      //
      axios
        .post(option.base_path + "/sz/expenditureApp/getProjectTypeDictList", {
          projectType: this.isReimShow ? "FINANCE_TYPE" : "EXPENDITURE_TYPE"
        })
        .then(data => {
          if (data.data.flag == 0) {
            this.expenseType = data.data.data;
          }
        });
    },
    //新增弹窗确定事件
    sureBtn() {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return;
        this.tableData.push({
          content: this.addForm.content,
          money: this.addForm.money,
          remark: this.addForm.remark,
          dictTypeName: this.addForm.dictTypeName,
          dictTypeCode: this.addForm.dictTypeCode,
          isReimsName: this.addForm.isReimsName,
          isReims: this.addForm.isReims
        });
        // this.addInfoFlag = false;
        this.addForm.isReims = "1";
        this.$refs.ruleForm.resetFields();
        this.$message({
          message: "填写的信息已成功加入到列表中",
          type: "success"
        });
      });
    },
    closeD(val) {
      console.log(val);
      if (val == "1") {
        this.addForm.isReims = "1";
        this.$refs.ruleForm.resetFields();
      } else {
        this.editForm.isReims = "1";
        this.$refs.ruleFormEdit.resetFields();
      }
    },
    //修改按钮弹窗赋值
    editBtn(index, row) {
      this.editInfoFlag = true;
      this.ind = index;
      this.editForm.content = row.content;
      this.editForm.money = row.money;
      this.editForm.remark = row.remark;
      this.editForm.dictTypeName = row.dictTypeName;
      this.editForm.dictTypeCode = row.dictTypeCode;
      this.editForm.isReims = row.isReims;
      //输入框改变列表立刻更改
      //   this.editaddForm=row
    },
    //表格删除一行
    remove(i) {
      this.$confirm("确定删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.tableData.splice(i, 1);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //修改表格保存事件
    editSave() {
      this.$refs.ruleFormEdit.validate(valid => {
        if (!valid) return;
        this.tableData[this.ind].content = this.editForm.content;
        this.tableData[this.ind].money = this.editForm.money;
        this.tableData[this.ind].remark = this.editForm.remark;
        this.tableData[this.ind].dictTypeName = this.editForm.dictTypeName;
        this.tableData[this.ind].dictTypeCode = this.editForm.dictTypeCode;
        this.tableData[this.ind].isReims = this.editForm.isReims;
        this.editInfoFlag = false;
      });
    },
    /**
     * 支出类型下拉框改变事件
     */
    onAddSelected(val) {
      this.expenseType.forEach(v => {
        if (v.dictTypeCode == val) {
          this.addForm.dictTypeName = v.disvalue;
        }
      });
    },
    onEditSelected(val) {
      this.expenseType.forEach(v => {
        if (v.dictTypeCode == val) {
          this.editForm.dictTypeName = v.disvalue;
        }
      });
    }
  }
};
</script>
<style lang="css" scoped>
.yt-sec-title-line {
  border-left: 5px solid #244972;
  border-radius: 10px;
  vertical-align: middle;
}
.yt-sec-title-text {
  margin-left: 10px;
  color: #003465;
  font-size: 16px;
  font-weight: bold;
  vertical-align: middle;
}
.yt-read-text {
  color: #003465;
  font-weight: bold;
}
</style>
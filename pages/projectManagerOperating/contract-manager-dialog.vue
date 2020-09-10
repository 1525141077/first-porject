<template>
  <div class="cmd">
    <el-dialog 
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisible"
      :center="cmdIsCenter"
      :show-close="false">
      <div slot="title" style="padding:10px 0 5px;color:#fff;font-size:16px;" >
        <el-row>
          <el-col :span="12">
            <img src="../../assets/images/project-manager/u65-2.png" alt="" class="top-img">
            <span class="img-text">{{title}}</span>
          </el-col>
          <el-col :span="12" style="text-align:right;" class="cmd-top-button">
            <el-button type="text" @click="balanceClose">保存</el-button>
            <el-button type="text">详细信息&gt;&gt;</el-button>
          </el-col>
        </el-row>
      </div>
      <el-form ref="form" :model="form" :label-position="labelPosition">
        <div style="line-height: 40px;padding:10px">
          <el-row style="text-align:center;line-height: 50px">
            <el-col :span="14">合同名称：倚天机构数字化平台（1.0 版本）建设项目合同</el-col>
            <el-col :span="10">合同编号:HT20200703001</el-col>
          </el-row>
          <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
              type="index"
              label=""
              width="30"
              align="center">
            </el-table-column>
            <el-table-column
              prop="date"
              label="付款条件说明"
              min-width="180"
              show-overflow-tooltip
              align="center">
            </el-table-column>
            <el-table-column
              prop="name"
              label="预计付款日期"
              width="180"
              align="center">
            </el-table-column>
            <el-table-column
              prop="address"
              label="预计付款金额"
              width="180"
              align="center">
            </el-table-column>
          </el-table>
        </div>
      </el-form>
      <!-- v-if="isDisabled" -->
      <!-- <div slot="footer" class="dialog-footer" >
        <el-button type="primary" @click="balanceClose">立即进入</el-button>
      </div> -->
    </el-dialog>
  </div>
</template>

<script>
import finMoneyInput from '../../components/fin-money-input-copy.vue'
export default {
  props: {
    dialogFormVisible: false,
    cmdIsCenter: false,
    title: {
      type: String,
      default: {
        return: ''
      }
    }
  },
  // 数据源
  data () {
    return {
      formLabelWidth: '',
      labelPosition: 'right',
      form: {},
      isDisabled: false,
      tableData: [{
        date: '签订合同后7日内，支付合同金额的30%',
        name: '2020-07-07',
        address: '500,000.00'
      }, {
        date: '签订合同后7日内，支付合同金额的30%',
        name: '2020-07-07',
        address: '500,000.00'
      }]
    }
  },
  // 初始化执行
  mounted () {
    if (this.title === '项目详情') {
      this.isDisabled = false
    } else {
      this.isDisabled = true
    }
  },
  // 方法声明
  methods: {
    // 点击取消
    balanceClose () {
      this.$nextTick(() => {
        this.$emit('balanceClose', false)
      })
    }
  },
  // 组件注册
  components: {
    finMoneyInput
  }
}
</script>
<style>
.cmd .el-dialog{
  width: 700px;
}
.cmd .el-input{
  width: 60%;
}
.cmd .cmd-top-button .el-button{
  color: #fff;
}
.cmd .img-text{
  /* font-family: "Arial Normal","Arial"; */
  position: relative;
  bottom: 5px;
  font-size: 16px;
  font-weight: 400;
}
.cmd .top-img{
  height: 22px;
  width: 22px;
}
</style>

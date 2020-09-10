<template>
  <div class="pid">
    <el-dialog 
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisible"
      :center="pidIsCenter"
      :show-close="false">
      <div slot="title" style="padding:10px;color:#fff;font-size:20px;" v-if="isDisabled">
        {{title}}
      </div>
      <div slot="title" style="padding:10px 0;color:#fff;font-size:16px;" v-if="!isDisabled">
        <el-row>
          <el-col :span="12">
            <img src="../../assets/images/project-manager/u21-2.png" alt="" class="top-img">
            <span class="img-text">{{title}}</span>
          </el-col>
          <el-col :span="12" style="text-align:right;" class="pid-top-button">
            <el-button type="text" @click="balanceClose">保存</el-button>
            <el-button type="text">切换项目</el-button>
          </el-col>
        </el-row>
      </div>
      <el-form ref="form" :model="form" :label-position="labelPosition">
        <div style="line-height: 40px;padding:10px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="项目名称：" :label-width="formLabelWidth">
                <span>{{pageInfo.projectName}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="项目简称：" :label-width="formLabelWidth" :rules="{ required: true, validator: overMinus, trigger: 'blur' }" prop="projectForshot">
                <el-input v-model="form.projectForshot" placeholder="请输入项目简称，限制在10个字以内"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目编号：" label-width="100px">
                <span>{{pageInfo.projectId}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="结项时间：" :label-width="formLabelWidth">
                <el-date-picker
                  v-model="form.finishTime"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerOptions1">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="费用支出预算：" label-width="100px">
                <!-- <el-input v-model="form.name"></el-input> -->
                <fin-money-input :value.sync="form.budgetMoney" :tail="tail"></fin-money-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" style="padding-left: 17px">
              <el-checkbox v-model="form.isExpenditure">禁止支出/借款中选择此项目</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="form.isWorkeHours">禁止工时填报中选择此项目</el-checkbox>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <!-- v-if="isDisabled" -->
      <div slot="footer" class="dialog-footer" v-if="isDisabled">
        <el-button @click="balanceClose1" style="margin-right: 20px;">取 消</el-button>
        <el-button type="primary" @click="updateProjectById('form')">立即进入</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from '../../service/http'
import { option } from '../../static/config'
import { cloneObjectFn, dateFormat } from '../../assets/js/util/expensesUtils.js'
import finMoneyInput from '../../components/fin-money-input-copy.vue'
export default {
  props: {
    pageInfo: null,
    dialogFormVisible: false,
    pidIsCenter: false,
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
      tail: '元',
      formLabelWidth: '90px',
      labelPosition: 'right',
      form: {},
      pickerOptions1: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
      isDisabled: false
    }
  },
  // 初始化执行
  mounted () {
    if (this.title === '项目详情') {
      this.isDisabled = false
    } else {
      this.isDisabled = true
    }
    this.form = cloneObjectFn(this.pageInfo)
  },
  // 方法声明
  methods: {
    // Promise
    methodPromise: function (url, param) {
      return new Promise((resolve, reject) => {
        axios.post(option.base_path + url, param).then(res => {
          resolve(res)
        }).catch(err => {
          this.$message.error(err)
        })
      })
    },
    // 关闭弹窗
    balanceClose () {
      this.$nextTick(() => {
        this.$emit('balanceClose', false)
      })
    },
    // 点击取消
    balanceClose1 () {
      this.$nextTick(() => {
        this.$emit('balanceClose1', false)
      })
    },
    // 根据项目编号修改项目信息
    updateProjectById (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let param = {
            projectId: this.form.projectId, //	项目编号	必传
            projectForshot: this.form.projectForshot, //	项目简称
            finishTime: this.form.finishTime ? dateFormat(this.form.finishTime) : '', //	结项时间
            budgetMoney: this.form.budgetMoney, //	费用支出金额
            isExpenditure: this.form.isExpenditure ? '1' : '2', //	是否禁止支出/借款中选择此项目	（1是 2否）
            isWorkeHours: this.form.isWorkeHours ? '1' : '2' //	是否禁止工时填报中选择此项目	（1是 2否）
          }
          this.methodPromise('project/platform/updateProjectById', param).then(res => {
            if(res.data.flag === 0) {
              this.$message.success(res.data.message)
              this.$refs[formName].resetFields();
              this.balanceClose()
            } else {
              this.$message.error(res.data.message)
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    overMinus (rule, value, callback) {
      if (!value || value === '') {
        callback(new Error('请输入项目简称'))
      } else if (value.length > 10) {
        callback(new Error('请限制在10字以内'))
      } else {
        callback()
      }
    }
  },
  // 组件注册
  components: {
    finMoneyInput
  }
}
</script>
<style>
.pid .el-dialog{
  width: 800px;
}
.pid .el-input{
  width: 90%;
}
.pid .pid-top-button .el-button{
  color: #fff;
}
.pid .top-img{
  height: 23px;
  width: 23px;
}
.pid .img-text{
  /* font-family: "Arial Normal","Arial"; */
  position: relative;
  bottom: 5px;
  font-size: 16px;
  font-weight: 400;
}
</style>


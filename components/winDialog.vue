<template>
  <div class="win-dialog">
    <el-dialog
      title=""
      :visible.sync="dialogState"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="40%"
      center
      :before-close="canelBtn">
      <div style="text-align:center;">
        <p style="font-weight:bolder;font-size:22px;">中选人信息</p>
        <p style="font-size:18px;margin:10px 0px;">{{name}}</p>
        <p style="color:#C0C0C0">（请确认中选信息，确认后将通过邮件公布竞聘结果）</p>
      </div>
      <span slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button @click="canelBtn">取 消</el-button>
        <el-button type="primary" @click="sureBtn">确认并发送邮件</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialogSta: {
      type: Boolean,
      default () {
        return false
      }
    },
    name: {
      type: String,
      default () {
        return ''
      }
    }
  },
  data () {
    return {
      // 是否显示弹窗
      dialogState: this.dialogSta
    }
  },
  mounted () {
  },
  methods: {
    // 取消
    canelBtn() {
      this.$emit('canelBtn')
    },
    // 确认
    sureBtn () {
      this.$emit('sureBtn')
    }
  }
}
</script>

<style>
.win-dialog .el-dialog__header {
  background-color: #ffffff !important;
}
</style>

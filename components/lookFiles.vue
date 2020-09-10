<template>
  <div class="look-fils">
    <el-row>
      <el-col :span="20">
        <span>{{fileName}}</span>
      </el-col>
      <el-col :span="2" style="text-align: right;">
        <el-button :disabled="disabled" type="text" @click="look" class="el-icon-search">预览</el-button>
      </el-col>
      <el-col :span="2" style="text-align: right;">
        <el-button type="text" class="el-icon-download" @click="downLoad">下载</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from '../service/http';
import { option } from '../static/config'
export default {
  props: {
    fileName: '',
    fileId: '',
    type: ''
  },
  data () {
    return {
      disabled: false
    }
  },
  mounted () {
    this.initFile()
  },
  methods: {
    // 初始化
    initFile () {
      let fielName = this.fileName.substr(-3, 3)
      if (fielName !== 'pdf' && fielName !== 'jpg' && fielName !== 'png') {
        this.disabled = true
      } else {
        this.disabled = false
      }
    },
    // 预览pdf
    look () {
      // if (this.fileName.indexOf('.pdf') === 20) {
      //   this.$message('支持PDF文件预览')
      // } else {
      let fielName = this.fileName.substr(-3, 3)
      if (fielName !== 'pdf') {
        let action = option.base_path + 'fileUpDownload/download?pkId=' + this.fileId + '&isDownload=false'
        window.open(action, '_blank');
      } else {
        let action = option.base_path + 'db/bidding/attachmentPreview?fileId=' + this.fileId + '&isDownload=false'
        window.open(action, '_blank');
      }
        // let link = document.createElement('a','_blank')
        // link.setAttribute('href',action)
        // document.body.appendChild(link)
        // link.click()
        // document.body.removeChild(link)
      // }
    },
    // 下载
    downLoad () {
      let action = option.base_path + 'fileUpDownload/download?pkId=' + this.fileId + '&isDownload=true'
      let link = document.createElement('a')
      link.setAttribute('href',action)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}
</script>

<style scoped>
  .el-col {
    line-height: unset !important;
  }
</style>

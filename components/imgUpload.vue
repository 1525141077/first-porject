<template>
  <div class="img-upload">
    <el-upload
      class="upload-demo"
      ref="upload"
      action=""
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :before-upload="beforeUpload"
      :file-list="nameList"
      :before-remove="beforeRemove"
      :auto-upload="true">
      <!-- <i class="el-icon-plus"></i> -->
      <i class="el-icon-upload"></i>
      <!-- <el-button slot="trigger" size="small" type="primary">高拍仪</el-button> -->
      <!-- <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-button style="margin-left: 10px;" size="small" type="success" @click="jpSubmit">请上传</el-button> -->
      <div slot="tip" class="el-upload__tip"></div>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </el-upload>
    <el-button size="small" @click="startVideo" class="file-photo">
      <i class="el-icon-plus"></i>
    </el-button>
    <div v-if="eaxmpleVisible">
      <new-eaxmple
        :title="title"
        :eaxmpleVisible="eaxmpleVisible"
        :fileClickObj="fileList"
        @imgUploading="imgUploading"
        @balanceClose="balanceClose">
      </new-eaxmple>
    </div>
  </div>
</template>

<script>
import axios from '../service/http'
import { option } from '../static/config'
import { StartVideo, hdCamidMain } from'../assets/js/common/photo/photo'
import newEaxmple from './new-eaxmple'
  export default {
    props: {
      fileList: {
        type: Array,
        default () {
          return []
        }
      },
      rawListName: {
        type: String,
        default () {
          return ""
        }
      },
      label: {
        type: String,
        default () {
          return ""
        }
      }
    },
    data () {
      return {
        // 文件列表
        nameList: [],
        oldFiles: [],
        // 是否删除了文件
        delFile: false,
        dialogVisible: false,
        dialogImageUrl: '',
        // 高拍仪相关
        eaxmpleVisible: false,
        title: '高拍仪'
      }
    },
    watch: {
      fileList: {
        handler (newVal, oldVal) {
          this.nameList = newVal
          console.log('新的', newVal)
        }
      }
    },
    mounted () {
    },
    components: {
      newEaxmple // 高拍仪组件
    },
    methods: {
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      // 上传之前
      beforeUpload (file) {
      },
      // 点击列表文件
      handlePreview (file) {
        let files = this.nameList
        let fileId = ''
        let fileName = ''
        if (files.length !== 0) {
          files.forEach(n => {
            if (n.fileName === file.name) {
              fileId = n.fileId
              fileName = n.fileName
            }
          })
          fileName = fileName.substr(-3, 3)
          if (fileName !== 'pdf') {
            if (fileName === 'jpg' || fileName === 'png') {
              let action = option.base_path + 'fileUpDownload/download?pkId=' + fileId + '&isDownload=false'
              window.open(action, '_blank');
            } else {
              this.$message.success('暂不支持在线预览')
            }
          } else {
            let action = option.base_path + 'db/bidding/attachmentPreview?fileId=' + fileId + '&isDownload=false'
            window.open(action, '_blank');
          }
        }
      },
      // 移除文件
      handleRemove (file, files) {
        this.oldFiles = []
        console.log(files)
        this.delFile = true
        if (files.length !== 0) {
          files.forEach(n => {
            this.oldFiles.push(n)
          })
        } else {
          this.oldFiles = []
        }
        // 父组件调用
        let oldList = this.oldFiles
        this.$emit('delFile', oldList, this.rawListName)
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`删除该文件?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
      },
      /**
       * 启动高拍仪
       */
      startVideo () {
        // 显示高拍仪组件
        this.eaxmpleVisible = true
        // if(this.isExitsFunction(StartVideo)) {
        //   //启动并配置分辨率
        //   StartVideo(hdCamidMain, 3264, 2448);
        // }
        //显示预览框
        // $yt_alert_Model.getDivPosition($('.active-div'));
        // $('.active-div').show();
      },
      /**
       * 判断函数是否存在
       * @param {Object} funcName
       */
      isExitsFunction (funcName) {  
        try {    
          if(typeof(eval(funcName)) == "function") {      
            return true;    
          }  
        } catch(e) {}  
        return false;
      },
      // 图片上传方法
      imgUploading (imgInfo) {
        this.fileList.push({
          name: imgInfo.fileName, 
          url: option.base_path + 'fileUpDownload/download?pkId=' + imgInfo.pkId + '&isDownload=false',
          id: imgInfo.pkId
        })
        this.balanceClose()
      },
      balanceClose () {
        debugger
        this.eaxmpleVisible = false
      }
    }
  }
</script>

<style>
.img-upload .upload-demo{
 float: left;
 display: inline-block;
 width: 200px;
}
.img-upload .file-photo{
  /* display: inline-block; */
  position: relative;
  top: 55px;
  right: 70px;
}
.img-upload .el-icon-upload{
  position: relative;
}
</style>

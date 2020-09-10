<template>
  <div>
    <el-form>
      <el-form-item label>
        <uploadList
          v-show="listType == 'picture-card'"
          :files="nameList"
          :handlePreview="handlePreview"
          @remove="handleRemove"
          @download="download"
          :listType="listType"
          :flieIcon="flieIcon"
          :disabledShow="disabled"
          :value-key="'fileId'"
        ></uploadList>
        <el-upload
          class="upload-demo"
          ref="upload"
          action
          :before-upload="beforeUpload"
          :show-file-list="false"
          :auto-upload="true"
          :list-type="listType == 'picture-card' ? 'picture-card' : ''"
          v-if="!(disabled || (oneOrMany && nameList.length > 0))"
          :style="listType == 'picture-card' ? 'display: inline-block;position: relative;' : ''"
        >
          <!-- <uploadList 
          v-if="nameList.length !== 0"
            :files="nameList"
            :handlePreview="handlePreview" 
            :listType="'text'"
            :handleRemove="handleRemove">
          </uploadList>-->
          <i
            slot="default"
            class="el-icon-plus"
            v-if="listType == 'picture-card' && photoUpload !== '1'"
          ></i>
          <div v-if="addText" v-html="addText" class="picture-name"></div>
          <el-button
            slot="trigger"
            size="small"
            type="primary"
            v-if="!disabled && listType != 'picture-card'"
          >选取文件</el-button>
          <el-button
            @click="startVideo"
            style="display: inline-block;position:absolute; left: 90px;top:7px"
            v-if="listType == 'invoice' && !disabled && photoUpload == '1'"
          >高拍仪拍照上传</el-button>
          <slot name="right"></slot>
          <span slot="tip" class="el-upload__tip" v-if="listType == 'picture' && !disabled">请上传图片</span>

          <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="jpSubmit">请上传</el-button> -->
          <div slot="tip" class="el-upload__tip" style="color: #aeaeae">
            <slot></slot>
          </div>
        </el-upload>
        <uploadList
          v-show="listType !== 'picture-card'"
          :files="nameList"
          :handlePreview="handlePreview"
          @remove="handleRemove"
          @download="download"
          :listType="listType"
          :flieIcon="flieIcon"
          :disabledShow="disabled"
        ></uploadList>
      </el-form-item>
    </el-form>
    <div v-if="eaxmpleVisible">
      <new-eaxmple
        :title="title"
        :eaxmpleVisible="eaxmpleVisible"
        :fileClickObj="fileList"
        @imgUploading="imgUploading"
        @balanceClose="balanceClose"
      ></new-eaxmple>
    </div>
  </div>
</template>

<script>
import axios from "../service/http";
import { option } from "../static/config";
import uploadList from "./upload-list.vue";
import { StartVideo, hdCamidMain } from "../assets/js/common/photo/photo";
import newEaxmple from "./new-eaxmple";
export default {
  props: {
    fileList: {
      type: Array,
      default() {
        return [];
      },
    },
    listType: {
      type: String,
      default() {
        return "text";
      },
    },
    //是否显示高拍仪上传按钮 1是 2否
    photoUpload: {
      type: String,
      default() {
        return "2";
      },
    },
    //是否限制上传类型
    fileTypeBool: {
      type: Number,
      default() {
        return 0;
      },
    },
    //是否显示预览大图标
    flieIcon: {
      type: Boolean,
      default() {
        return false;
      },
    },
    //是否是详情或审批
    disabled: {
      type: Boolean,
      default() {
        return false;
      },
    },
    //是否只上传一个
    oneOrMany: {
      type: Boolean,
      default() {
        return false;
      },
    },
    //卡片样式上传情况下，提示信息
    addText: {
      type: String,
      default() {
        return '';
      },
    },
  },
  data() {
    return {
      // 文件列表
      nameList: [],
      oldFiles: [],
      // 是否删除了文件
      delFile: false,
      // 高拍仪相关
      eaxmpleVisible: false,
      title: "高拍仪",
    };
  },
  watch: {
    fileList: {
      handler(newVal, oldVal) {
        this.nameList = newVal;
        console.log("新的", newVal);
      },
    },
  },
  mounted() {
    if (this.fileList && this.fileList.length) {
      console.log(this.fileList);
      this.nameList = this.fileList;
    }
  },
  methods: {
    // 下载文件
    download(file) {
      let action =
        option.base_path +
        "fileUpDownload/download?pkId=" +
        file.fileId +
        "&isDownload=true";
      let link = document.createElement("a");
      link.setAttribute("href", action);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    // 上传之前
    beforeUpload(file) {
      // 判断是否删除过文件
      let delFile = this.delFile;
      let fileLists = [];
      if (delFile) {
        // 删除过
        fileLists = this.oldFiles;
      } else {
        fileLists = this.fileList;
      }
      let fd = new FormData();
      fd.append("file", file);
      fd.append("modelCode", "REIM_APP");
      axios
        .post(option.base_path + "fileUpDownload/upload", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((data) => {
          let fileData = data.data.data;
          for (let k in fileData) {
            if (k === "naming") {
              fileData["name"] = fileData[k];
              fileData["fileName"] = fileData[k];
            }
            if (k === "pkId") {
              fileData["fileId"] = fileData[k];
            }
          }
          //不能传图片 =2
          if (this.fileTypeBool == 2) {
            if (
              fileData.fileName.split(".")[1] != "png" &&
              fileData.fileName.split(".")[1] != "jpg" &&
              fileData.fileName.split(".")[1] != "jpeg"
            ) {
              fileLists.push(fileData);
            } else {
              this.$message.error("不支持的文件类型，请重新上传");
            }
          } else if (this.fileTypeBool == 1) {
            //只能传图片 =1
            if (
              fileData.fileName.split(".")[1] == "png" ||
              fileData.fileName.split(".")[1] == "jpg" ||
              fileData.fileName.split(".")[1] == "jpeg"
            ) {
              fileLists.push(fileData);
            } else {
              this.$message.error("不支持的文件类型，请重新上传");
            }
          } else if (this.fileTypeBool == 3) {
            //只能传PDF =3
            if (
              fileData.fileName.split(".")[1] == "pdf"
            ) {
              fileLists.push(fileData);
            } else {
              this.$message.error("不支持的文件类型，请重新上传");
            }
          } else {
            //无限制 =""或0
            fileLists.push(fileData);
          }
          this.nameList = fileLists;
          console.log("文件上传", fileLists);
          this.$emit("upload", fileLists);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    // 点击列表文件
    handlePreview(file) {
      let files = this.nameList;
      let fileId = "";
      let fileName = "";
      if (files.length !== 0) {
        files.forEach((n) => {
          if (n.fileName === file.fileName) {
            fileId = n.fileId;
            fileName = n.fileName;
          }
        });
        fileName = fileName.substr(-3, 3);
        if (fileName !== "pdf") {
          if (fileName === "jpg" || fileName === "png") {
            let action =
              option.base_path +
              "fileUpDownload/download?pkId=" +
              fileId +
              "&isDownload=false";
            window.open(action, "_blank");
          } else {
            this.$message.success("暂不支持在线预览");
          }
        } else {
          let action =
            option.base_path +
            "db/bidding/attachmentPreview?fileId=" +
            fileId +
            "&isDownload=false";
          window.open(action, "_blank");
        }
      }
    },
    // 移除文件
    handleRemove(file, files) {
      this.oldFiles = [];
      console.log(files);
      this.delFile = true;
      if (files.length !== 0) {
        files.forEach((n) => {
          this.oldFiles.push(n);
        });
      } else {
        this.oldFiles = [];
      }
      // 父组件调用
      let oldList = this.oldFiles;
      this.$emit("delFile", oldList);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`删除该文件?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      });
    },
    /**
     * 启动高拍仪
     */
    startVideo() {
      // 显示高拍仪组件
      this.eaxmpleVisible = true;
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
    isExitsFunction(funcName) {
      try {
        if (typeof eval(funcName) == "function") {
          return true;
        }
      } catch (e) {}
      return false;
    },
    // 图片上传方法
    imgUploading(imgInfo) {
      this.fileList.push({
        name: imgInfo.fileName,
        url:
          option.base_path +
          "fileUpDownload/download?prjId=" +
          imgInfo.pkId +
          "&isDownload=false",
        id: imgInfo.pkId,
      });
      this.balanceClose();
    },
    balanceClose() {
      this.eaxmpleVisible = false;
    },
    // 竞聘上传文件
    // jpSubmit () {
    //   this.$refs.upload.submit()
    // }
    //是否显示按钮（针对方块加号）
    isShowAttr() {
      if (this.oneOrMany && this.nameList.length > 0) {
        
          return false;
        
      }
      return true;
    },
  },
  components: {
    uploadList,
    newEaxmple, // 高拍仪组件
  },
};
</script>

<style scoped>
.image-text-bg {
  position: absolute;
  width: 100%;
  height: 30px;
  bottom: 0;
  background: #000;
  opacity: 0.3;
}

.picture-name{
  position: absolute;
    line-height: 1;
    top: 105px;
    left: 12px;
    color: #999999;
}
</style>

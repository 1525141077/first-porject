<template>
  <transition-group
    tag="ul"
    :class="[
      'el-upload-list',
      'el-upload-list--' + listType,
      { 'is-disabled': disabled },
      { 'invoice-width': listType == 'invoice' }
    ]"
    name="el-list"
    
  >
    <li
      v-for="file in files"
      :class="['el-upload-list__item', 'is-' + file.status, focusing ? 'focusing' : '']"
      :key="file.fileId"
      tabindex="0"
      @keydown.delete="!disabled && $emit('remove', file)"
      @focus="focusing = true"
      @blur="focusing = false"
      @click="focusing = false"
    >
      <slot :file="file" v-if="listType != 'invoice'">
        <img
          class="el-upload-list__item-thumbnail"
          v-if="file.status !== 'uploading' && ['picture-card', 'picture'].indexOf(listType) > -1"
          :src="ifPic(file)"
          alt
        />
        <div v-if="flieIcon" :style="listType == 'picture-card' ? 'text-align: center;' : ''">
          <img
            v-if="fileSplit(file) == 'xlsx' || fileSplit(file) == 'xls'"
            src="../assets/images/common/excel.png"
          />
          <img
            v-else-if="fileSplit(file) == 'doc' || fileSplit(file) == 'docx'"
            src="../assets/images/common/word.png"
          />
          <img
            v-else-if="fileSplit(file) == 'ppt' || fileSplit(file) == 'pptx'"
            src="../assets/images/common/ppt.png"
          />
          <img v-else-if="fileSplit(file) == 'pdf'" src="../assets/images/common/pdf.png" />
          <img v-else src="../assets/images/common/normal.png" />
        </div>
        <!-- v-if="fileSplit(file) !== 'png' && fileSplit(file) !== 'jpg' && fileSplit(file) !== 'jpeg'" -->
        <a class="el-upload-list__item-name" @click="handleClick(file)" 
        :style="listType == 'picture-card' ? 'margin-right: 0px;text-align: center;padding-right: 4px;' : ''"
        >
          <i v-if="listType !== 'picture-card'" class="el-icon-document"></i>
          {{file.fileName}}
        </a>
        <el-button
          type="text"
          @click="$emit('download', file)"
          style="display: block;position: absolute;line-height:inherit;top:0;right:130px; cursor: pointer;color: #42a5f5;font-size:12px;"
          v-if="listType!=='picture-card'"
        >下载</el-button>
        <label class="el-upload-list__item-status-label" v-if="!disabledShow">
          <i
            :class="{
            'el-icon-upload-success': true,
            'el-icon-circle-check': listType === 'text',
            'el-icon-check': ['picture-card', 'picture'].indexOf(listType) > -1
          }"
          ></i>
        </label>
        <i class="el-icon-close" v-if="!disabledShow" @click="remove(file, files)"></i>
        <i class="el-icon-close-tip" style="right: 30px;" v-if="!disabled">{{ t('el.upload.deleteTip') }}</i>
        <!--因为close按钮只在li:focus的时候 display, li blur后就不存在了，所以键盘导航时永远无法 focus到 close按钮上-->
        <el-progress
          v-if="file.status === 'uploading'"
          :type="listType === 'picture-card' ? 'circle' : 'line'"
          :stroke-width="listType === 'picture-card' ? 6 : 2"
          :percentage="parsePercentage(file.percentage)"
        ></el-progress>
        <span class="el-upload-list__item-actions" v-if="listType === 'picture-card'">
          <span
            class="el-upload-list__item-preview"
            v-if="handlePreview && listType === 'picture-card'"
            @click="handlePreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <span
          v-if="!disabled"
          class="el-upload-list__item-delete"
          @click="$emit('download', file)"
        >
          <i class="el-icon-download"></i>
        </span>
          <span v-if="!disabledShow" class="el-upload-list__item-delete" @click="remove(file, files)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </slot>

      <slot :file="file" v-if="listType == 'invoice'">
        <img class="el-upload-list__item-thumbnail" :src="ifPic(file)" @click="handleClick(file)" style="cursor: pointer;" alt />
        <a class="el-upload-list__item-name" @click="handleClick(file)">{{file.fileName}}</a>
        <!-- <el-button
          type="text"
          @click="$emit('download', file)"
          style="display: block;position: absolute;line-height:inherit;top:0;right:80px; cursor: pointer;color: #42a5f5;font-size:12px;"
        >下载</el-button>-->
        <span class="invoice-file-but">
          <span v-if="!disabled" style="margin-right:10px;" @click="$emit('download', file)">
            <i class="el-icon-download"></i>
          </span>
          <span v-if="!disabledShow" @click="remove(file, files)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </slot>
    </li>
  </transition-group>
</template>
<script>
import Locale from "element-ui/src/mixins/locale";
import ElProgress from "element-ui/packages/progress";
//配置文件
import { option } from "../static/config";
export default {
  name: "ElUploadList",

  mixins: [Locale],

  data() {
    return {
      focusing: false
    };
  },
  components: { ElProgress },

  props: {
    files: {
      type: Array,
      default() {
        return [];
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    handlePreview: Function,
    listType: String,
    //是否显示预览大图标
    flieIcon: {
      type: Boolean,
      default() {
        return false;
      }
    },
    //是否是详情或审批
    disabledShow: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  methods: {
    parsePercentage(val) {
      return parseInt(val, 10);
    },
    remove(file, files) {
      console.log("2222");
      let newFiles = [];
      if (files.length !== 0) {
        files.forEach(n => {
          if (n.fileId !== file.fileId) {
            newFiles.push(n);
          }
        });
      }
      this.$emit("remove", file, newFiles);
    },
    handleClick(file) {
      this.handlePreview && this.handlePreview(file);
    },
    ifPic(file) {
      if (file.name) {
        file.fileName = file.name;
      }
      if (file.id) {
        file.fileId = file.id;
      }
      let url = "";
      if (
        file.fileName.split(".")[1] == "jpg" ||
        file.fileName.split(".")[1] == "jpeg" ||
        file.fileName.split(".")[1] == "png"
      ) {
        url =
          option.base_path +
          "fileUpDownload/download?pkId=" +
          file.fileId +
          "&isDownload=false";
      }
      return url;
    },
    //切割后缀
    fileSplit(file) {
      let names = file.fileName.split(".");
      return names[names.length - 1];
    }
  }
};
</script>
<style>
.el-upload-list--invoice .el-upload-list__item {
  overflow: hidden;
  background-color: #fff;
  box-sizing: border-box;
  width: 200px;
  height: 150px;
  margin: 0 8px 8px 0;
  display: inline-block;
  padding-bottom: 30px;
}
.el-upload-list--invoice .el-upload-list__item-thumbnail {
  width: 100%;
  height: 100%;
}
.el-upload-list--invoice .el-upload-list__item-name {
  margin: 0;
  padding: 0;
  text-align: center;
}
.invoice-width {
  min-width: 100%;
}
.invoice-file-but {
  position: absolute;
  right: 3px;
  bottom: 10px;
  width: 100%;
  height: 50px;
  text-align: right;
  font-size: 20px;
}
.invoice-file-but span {
  cursor: pointer;
}
/* .el-upload-list--cube .cube-one .el-upload-list + .el-upload--picture-card{
  display: none;
} */
</style>
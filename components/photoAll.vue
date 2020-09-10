<template>
  <!-- <div class="active-div" style="height: 570px;overflow:auto;">
		<div id="ActiveXDivOne" class=""></div>
		{/* <div class="">
					<input type="button" value=" 放大 " onclick="ZoomOut(1);" />
					<input type="button" value=" 缩小 " onclick="ZoomIn(1);" />
					<input type="button" value=" 左旋 " onclick="RoateL(1);" />
					<input type="button" value=" 右旋 " onclick="RoateR(1);" />
					<input type="button" value=" 适合大小 " onclick="BestSize(1);" />
					<input type="button" value=" 实际大小 " onclick="TrueSize(1);" />
					<input type="button" value=" 隐藏/显示 " onclick="ShowHide(1);" />
				</div> */}
		<div class="active-tip">
			提示：使用高拍仪需要安装驱动，点击<span class="active-sdk">SDK</span>下载安装高拍仪驱动后，刷新页面重试。
			</div>
		<div class="min-but">
			<button class="yt-option-btn" onclick="RoateL(1);">左旋</button>
			<button class="yt-option-btn" onclick="RoateR(1);" style="margin-left: 20px;">右旋</button>
			<button class="yt-option-btn cam-can" id="camCan" style="margin-left: 20px;">拍照上传</button>
			<button class="yt-option-btn cam-cen" id="camCen">取消</button>
		</div>
  </div>-->
  <div>
    <el-button
      type="text"
      @click="dialogVisible = true, uploadImg()"
      class="file-upload-img-btn"
    >点击打开 Dialog</el-button>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <div id="ActiveXDivOne" class></div>
      <div class="active-tip">
        提示：使用高拍仪需要安装驱动，点击
        <span class="active-sdk">SDK</span>下载安装高拍仪驱动后，刷新页面重试。
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false" id="camCen" class="cam-can">拍照上传</el-button>
        <el-button @click="dialogVisible = false" id="camCen" class="cam-can">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<!--高拍仪用-->
<script src="../assets/js/common/photo/WsUtil" type="text/javascript" charset="utf-8"></script>
<script src="../assets/js/common/photo/OcxUtil" type="text/javascript" charset="utf-8"></script>
<script src="../assets/js/common/photo/axCam_Ocx" type="text/javascript" charset="utf-8" for="axCam_Ocx" event="MessageCallback(type,str)"></script>
<script src="../assets/js/common/photo/axCam_Ocx2" type="text/javascript" charset="utf-8" for="axCam_Ocx2" event="MessageCallback(type,str)"></script>
<!--  <script type="text/javascript" for="axCam_Ocx" event="MessageCallback(type,str)"> -->
<script src="../assets/js/common/photo/photo" type="text/javascript" charset="utf-8"></script>
<script src="../assets/js/common/photo/photoAll" type="text/javascript" charset="utf-8"></script>
<script>
//axios接口组件
import axios from "../service/http";
//配置文件
import { option } from "../static/config";
export default {
  data() {
    return {
      dialogVisible: false
    };
  },
  components: {
    axios,
    option
  },
  mounted() {
    //初始化高拍仪参数
    if (this.isExitsFunction("loadActiveX")) {
      loadActiveX();
    }
  },
  methods: {
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    uploadImg() {
      debugger;
      //开始初始化设备
      this.startVideo();
    },
    /**
     * 启动高拍仪
     */
    startVideo() {
      debugger;
      if (this.isExitsFunction("StartVideo")) {
        console.log(hdCamidMain);
        //启动并配置分辨率
        StartVideo(hdCamidMain, 3672, 2856);
        /*for (var i = 1; i<=3; i++) {
                    ZoomIn();
                }*/
        BestSize(1);
        /*StartVideo(hdCamidMain, 5120, 2880);*/
      }
    },
    //判断函数是否存在
    isExitsFunction(funcName) {
      try {
        if (typeof(eval(funcName)) == "function") {
          return true;
        }
      } catch (e) {}
      return false;
    }
  }
};
</script>
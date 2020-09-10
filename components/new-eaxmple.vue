<template>
  <div class="eaxmple">
  	<el-dialog 
  	  :title="title" 
  	  :visible.sync="eaxmpleVisible"
  	  :before-close="balanceClose">
      <!-- 内容区域 -->
      <div>
        <div style="width:100%; height: 450px; border: 1px solid white;">
          <div id="ActiveXDivOne" v-html="innerHTML" style="text-align:center;">
          </div>
          <p align="center" style=" width:100%; height:30px">                  
            <table style="width:100%;" v-show="false">
              <tr>
                <td class="style5" style="font-size: medium">
                设备</td>
                <td class="style1">
                  <select id="DeviceName" name="D1" onchange = "ChangeDevice()">
                  </select>
                </td>
              </tr>
              <tr>
                <td class="style5" style="font-size: medium">
                分辨率</td>
                <td class="style3">
                  <select id="Resolution" name="D2" @change = "ChangeResolution">
                  </select>
                </td>
              </tr>
            </table>
            <!-- <input type = "button" value = " 放大 " onclick = "ZoomOut(1);" />
            <input type = "button" value = " 缩小 " onclick = "ZoomIn(1);" /> -->
            <!-- <input type = "button" value = "左旋" onclick = "RoateL(1);" />
            <input type = "button" value = "右旋" onclick = "RoateR(1);" />
            <input id="Button2" type="button" value="拍照" @click = "Capture"/> -->
            <!-- <input type = "button" value = " 适合大小 " onclick = "BestSize(1);" />
            <input type = "button" value = " 实际大小 " onclick = "TrueSize(1);" />
            <input type = "button" value = " 隐藏/显示 " onclick = "ShowHide(1);" /> -->
            <!-- <input  id="Button2" type="button" value="打开" onclick = "StartVideo();"/>
            <input id="Button2" type="button" value="关闭" onclick = "CloseVideo();"/>
            <input id="Button2" type="button" value="参数设置" onclick = "ShowImageSettingWindow();"/>
            <input id="Button2" type="button" value="自动对焦" onclick = "funAutoFoucs();"/> -->
          </p>
			  </div>
        
        <div style="width: 100%;" v-show="false"> <!--v-show="false"-->
          <textarea id="TextArea1" cols="3" rows="2" style="width: 100%;">
          </textarea> 
        </div>	

			  <img id="img1"  style="width: 99%;height: 100%" v-show="false"/>
        <!-- 待处理 -->
        <!-- <div style="width:220px; height: 550px; background:#C7EDCC; border: 1px solid black;float:left">
          <div style="width: 100%;height: 30%;">

            <img id="img1"  style="width: 99%;height: 100%" />


          </div> 

          <div style="width: 100%;height: 30%;">

            <img id="img2"  style="width: 99%;height: 100%" />


          </div> 
          <div style="width: 100%;height: 40%;">
            <textarea id="TextArea1" cols="20" rows="2" style="width: 100%;height:100%;">
            </textarea> 
          </div>
        </div>
        <div style="width:1200px;height:200px;background:#C7EDCC; border: 1px solid black;clear:both; ">
          <table style="width:100%;">
            <tr>
              <td style="font-size: medium" class="style13">
              保存格式</td>
              <td class="style14">
                <select id = "FileType" onchange = "SetFileType()">
                  <option value="0">jpg</option>
                  <option value="1">png</option>
                  <option value="2">bmp</option>
                  <option value="3">gif</option>
                  <option value="4">tif</option>

                </select></td>

                <td style="font-size: medium" class="style23">
                </td>

                <td style="font-size: medium" class="style13">
                颜色格式</td>
                <td class="style14">
                  <select id = "ColourMode" onchange = "SetImageColorMode()">
                    <option value="0">彩色</option>
                    <option value="1">灰度</option>
                    <option value="2">黑白</option>
                  </select></td>
                  <td style="font-size: medium" class="style23">
                  </td>


                  <td style="font-size: medium" class="style13">
                  裁切模式:</td>
                  <td>
                    <input id="Radio1" checked="checked" name="R1" type="radio" value="V1" onclick="SetCutType()"/>不裁切
                  </td>
                  <td>
                    <input id="Radio2"  name="R1" type="radio" value="V2" onclick="SetCutType()"/>自动裁切
                  </td>
                  <td>
                    <input id="Radio3"  name="R1" type="radio" value="V3" onclick="SetCutType()"/>手动裁切
                  </td>


                  <td style="font-size: medium" class="style13">
                  自动裁切:</td>
                  <td> 
                    <input id="Radio13" checked="checked" name="R11" type="radio" value="V1" onclick="funsetJiubianModel()"/>单图
                  </td>
                  <td>
                    <input id="Radio14"  name="R11" type="radio" value="V2" onclick="funsetJiubianModel()"/>多图
                  </td>
                  <td>
                    <input id="checkbox2" type="checkbox" value="黑边补白" onclick = "funsetBuBai();">补白<br>
                  </td>

                  
                </tr>

          </table>

          <table style="width: 100%;">
            <tr>
              <td style="font-size: medium" class="style13">
              连拍模式:</td>

              <td>
                <input id="Radio10" checked="checked" name="R10" type="radio" value="V1" onclick="SetCaptureModel()"/>无
              </td>
              <td>
                <input id="Radio11"  name="R10" type="radio" value="V2" onclick="SetCaptureModel()"/>智能连拍
              </td>
              <td>
                <input id="Radio12"  name="R10" type="radio" value="V3" onclick="SetCaptureModel()"/>定时连拍
              </td>


              <td style="font-size: medium" class="style23">
              </td>


              <td >
                <input type = "button" value = " 合并PDF " onclick = "funConvertToPDF();" 
                style="width: 69px" />
              </td>
            

              <td>
                <input id="Button7" type="button" value="上传(本地图片)" onclick = "funUpdataFile();"/>
              </td>

              <td>
                <input id="Button7" type="button" value="上传(base64)" onclick = "funUpdataBase64();"/>
              </td>

              <td>
                <input id="ButtonPath" type="button" value="文件路径" onclick = "SetFilePath();"/>
              </td>

              <td>
                <input type = "button" value = " 图片合并 " onclick = "funCombineTwoImage();" />
              </td>
              <td>
                方向:  
                <input id="Radio4" checked="checked" name="R2" type="radio" value="V1" />垂直   
                <input id="Radio5"  name="R2" type="radio" value="V2" />水平        
              </td>
              <td>

              </td>

              <td >
                <input id="checkbox1" type="checkbox" value="去底灰" onclick = "funsetQudise();">去底灰</td>
                <td>
                  <input id="checkboxBase" type="checkbox" value="拍照base64" onclick = "funSetImagebase64();">拍照base64</td> 

                </tr>

          </table>

          <table style="width: 100%;">
            <tr>
              <td style="font-size: medium" class="style13">
              文件命名:</td>
              <td>
                <input id="Radio19" name="R7" type="radio" value="V1" onclick="funSetFileNameModel()"/>自定义
                <input id="Radio20"  checked="checked" name="R7" type="radio" value="V2" onclick="funSetFileNameModel()"/>时间
                <input id="Radio21"  name="R7" type="radio" value="V3" onclick="funSetFileNameModel()"/>固定
              </td>
              <td >
                <td style="font-size: medium" class="style13">
                水印功能:</td>
                <td >
                  <input id="Radio6" type="radio" checked="checked" name="R3"  value="V1" onclick = "SetWaterType();"/>关闭

                  <input id="Radio7" type="radio" name="R3"  value="V2" onclick = "SetWaterType();"/>启动
                </td>

                <td>
                  <input type="button" value="开始Base64编码" onclick = "fungetBase64();"/>
                </td>

                  <td>
                    <input type="button" value="获取曝光与亮度范围" onclick = "funGetCamParameter();"/>
                    <input  type="button" value="设置曝光" onclick = "funSetExposure();"/>
                    <input  type="button" value="设置亮度" onclick = "funSetBrightness();"/>
            自动曝光:  
            <input id="RadioExopen" checked="checked" name="R2" type="radio" value="V1" onclick = "funSetAutoExposure();"/>启动   
            <input id="RadioExclose"  name="R2" type="radio" value="V2" onclick = "funSetAutoExposure();"/>关闭        
            </td>




              </tr>
          </table>

            <table style="width: 100%;">
              <tr>
                <td >

                  <input  type="button" value="获取当期摄像头数量" onclick = "funGetCamNum();"/>

                  <input  type="button" value="建立文件夹" onclick = "funMakeDir();"/>

                  <input  type="button" value="删除文件" onclick = "funDeleteFile();"/>
            
                  <input  type="button" value="设置JPG图像质量" onclick = "funSetJpgQuanlity();"/>

                  <input  type="button" value="设置手动裁边坐标" onclick = "funSetCusCropPlace();"/>

                  <input  type="button" value="设置手动裁边坐标2" onclick = "funSetCusCropPlace2();"/>

                  <input  type="button" value="条码识别(路径)" onclick = "funReadBarCode(0);"/>

                  <input  type="button" value="条码识别(动态)" onclick = "funReadBarCode(1);"/>

                  <input  type="button" value="二维码识别(路径)" onclick = "funReadQrCode(0);"/>

                  <input  type="button" value="二维码识别(动态)" onclick = "funReadQrCode(1);"/>

                </td>



              </tr>



            </table>	

            <table style="width: 100%;">
              <tr>
                <td style="font-size: medium" class="style33">
                身份证功能:</td>

                <td >
                  <input id="ButtonStartID" type="button" value="启动身份证模块" onclick = "funStartIC();"/>



                  <input id="ButtonStartID" type="button" value="自动读卡" onclick = "funStartICWork();"/>

                  <input id="ButtonStartID" type="button" value=" 关闭自动读卡" onclick = "funStopICWork();"/>

                  <input id="ButtonStartID" type="button" value="手动读卡" onclick = "funGetOneIC();"/>

                  <input id="ButtonStartID" type="button" value="获取身份证信息" onclick = "funGetICValues();"/>

                  <input id="ButtonStartID" type="button" value="获取身份证复印件" onclick = "funGetICPictureAll();"/>

                </td>


        

              </tr>

            </table>

            <table style="width: 100%;">
              <tr>
                <td style="font-size: medium" class="style33">
                指纹功能:</td>

                <td >
                  <input id="ButtonStartID" type="button" value="初始化指纹功能" onclick = "InitFinger();"/>

                  <input id="ButtonStartID" type="button" value="启动指纹功能" onclick = "StartFinger();"/>

                  <input id="ButtonStartID" type="button" value="停止指纹功能" onclick = "CloseFinger();"/>
                </td>

                <td style="font-size: medium" class="style33">
                录像功能:</td>

                <td >
                  <input id="ButtonStartID" type="button" value="启动录像主头" onclick = "funBeginVideo();"/>

                  <input id="ButtonStartID" type="button" value="停止录像主头" onclick = "funStopVideo();"/>

                  <input id="ButtonStartID" type="button" value="启动录像副头" onclick = "funBeginVideo2();"/>

                  <input id="ButtonStartID" type="button" value="停止录像副头" onclick = "funStopVideo2();"/>

                  <input id="ButtonStartID" type="button" value="获取声卡名字" onclick = "funGetAudioName();"/>
                </td>

                          </tr>

            </table>

            <table style="width: 100%;">
              <tr>
                <td style="font-size: medium" class="style33">
                人脸识别功能:</td>

                <td >
                  <input id="ButtonStartID" type="button" value="初始化人脸识别" onclick = "FaceCheckInit();"/>

                  <input id="ButtonStartID" type="button" value="启动人脸对比" onclick = "StartFaceCheck();"/>

                  <input id="ButtonStartID" type="button" value="停止人脸对比" onclick = "StopFaceCheck();"/>

                  <input id="ButtonStartID" type="button" value="关闭人脸识别" onclick = "FaceCheckUninit();"/>
                </td>

                <td >
                  <input id="ButtonStartID" type="button" value="初始化人脸识别" onclick = "FaceCheckInitSecond();"/>

                  <input id="ButtonStartID" type="button" value="启动人脸对比" onclick = "StartFaceCheckSecond();"/>

                  <input id="ButtonStartID" type="button" value="停止人脸对比" onclick = "StopFaceCheckSecond();"/>

                  <input id="ButtonStartID" type="button" value="关闭人脸识别" onclick = "FaceCheckUninitSecond();"/>
                </td>

              </tr>

            </table>







        </div>
        <div id="image_container" style="clear:both;">

          <div class="flex">

          </div>
        </div> -->

      </div>
      <div style="padding-top:20px;">
        提示：使用高拍仪需要安装驱动，点击
        <el-button type="text" @click="downloadSDK">SDK</el-button>
        下载安装高拍仪驱动后，刷新页面重试。
      </div>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button type="primary" class="yt-bottom-btn" @click="RoateL(1)">左 旋</el-button>
        <el-button type="primary" class="yt-bottom-btn" @click="RoateR(1)">右 旋</el-button>
        <el-button type="primary" id="Button2" class="yt-bottom-btn" @click="Capture">拍照上传</el-button>
        <el-button class="yt-bottom-btn" @click="balanceClose">取 消</el-button>
        <!-- <el-button class="yt-bottom-btn" type="primary" @click="confirmBtn">返回重新选房</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import $ from '../assets/js/common/jq'
import axios from '../service/http'
import { option } from '../static/config'
import {loadActiveX, Capture, ChangeResolution, RoateL, RoateR, CloseCam, GetBase64FromFile} from '../assets/js/common/photo/new-eaxmple'
// import OcxUtil from '../assets/js/common/photo/OcxUtil.js'
// import WsUtil from '../assets/js/common/photo/WsUtil.js'
// import { axCam_Ocx } from '../assets/js/common/photo/axCam_Ocx.js'
// import { axCam_Ocx2 } from '../assets/js/common/photo/axCam_Ocx2.js'

export default {
  props: {
    fileClickObj: {
      type: Array,
      default () {
        return null
      }
    },
    eaxmpleVisible: false,
    title: {
      type: String,
      default () {
        return ''
      }
    }
  },
  data () {
    return {
      innerHTML: '',
      imgPath: ''
    }
  },
  mounted () {
    window._this = this
    // window._document = document
    loadActiveX()
  },
  methods: {
    ChangeResolution,
    Capture,
    RoateL,
    RoateR,
    CloseCam,
    // 下载SDK
    downloadSDK () {
      window.open('https://share.weiyun.com/50xdaPR');
    },
    /**
     * 根据base64编码上传附件
     * @param {Object} str
     */
    setFileUpLoadDom: function(str) {
      //启动loading
      // $yt_baseElement.showLoading();
      //获取当前点击附件区域
      var ithisParent = this.fileClickObj;
      var imgUlr = '';
      axios.post(option.base_path + 'fileUpDownload/uploadSDK', {sdk: str,modelCode:"PHOTO_APP"}).then(res => {
        if(res.data.flag === 0) {
          this.$nextTick(() => {
            CloseCam()
            this.$emit('imgUploading', res.data.data)
          })
				} else {
          this.$message.warning(data.msg);
        }
			})
    },
    /**
     * 高拍仪附件上传
     * @param {Object} str
     */
    fileUpDataConfig: function(str) {
      if(this.fileClickObj) {
        //给保存的file input赋值文件路径并触发事件
        GetBase64FromFile(str);
      }
    },
    // 点击取消
    balanceClose () {
      this.$nextTick(() => {
        // 关闭高拍仪
        CloseCam()
        this.$emit('balanceClose', false)
      })
    }
  },
  watch: {},
  filters: {}
}
</script>

<style>
  .eaxmple .el-dialog__header {
    padding: 0 10px;
  }
  .eaxmple .el-dialog {
    width: 940px;
    min-height: 450px;
  }
  .eaxmple .el-dialog--small {
    width: 100%;
  }
</style>

<style scoped>
  .eaxmple .fr{
    float: right;
  }
  .eaxmple #ActiveXDivOne #cameraCanvas{
    width: 100%;
  }
</style>

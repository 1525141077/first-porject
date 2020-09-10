import $ from '../jq'
var isIE = true;        //是否IE
var isSecondDev = false; //是否有两个canvas显示视频
var camidMain = 0;    //主头ID
var camidSub = 0;     //副头ID
var ws;
var canvas;
var context;
var canvasSecond;
var contextSecond;
var canvasX;
var canvasY;
var canvasLastX;
var canvasLastY;
var isDragging = false;
var canvasX_manual = 0;
var canvasY_manual = 0;
var recX_manual = 0;
var recY_manual = 0;
var recW_manual = 0;
var recH_manual = 0;
var rec_ww = 0;
var rec_hh = 0;
var CutType = 0;
var imgOrignalW = 0;
var imgOrignalH = 0;
var rorateAngleType = 0;
var cutXCaibian = 0;
var cutYCaibian = 0;
var isDrawMove = false;

var canvasLastX2;
var canvasLastY2;
var isDragging2 = false;
var canvasX_manual2 = 0;
var canvasY_manual2 = 0;
var recX_manual2 = 0;
var recY_manual2 = 0;
var recW_manual2 = 0;
var recH_manual2 = 0;
var rec_ww2 = 0;
var rec_hh2 = 0;
var imgOrignalW2 = 0;
var imgOrignalH2 = 0;
var isDrawMove2 = false;
var cutXCaibian2 = 0;
var cutYCaibian2 = 0;

var faceZuobiao = new Array()
var faceZuobiaoSecond = new Array()
var faceNum = 0;
var faceNumSecond = 0;
var isFaceOpen = false;
var isFaceOpenSecond = false;

var SupportFormat;    //设备支持的视频格式代号：1->MJPG; 2->YUY2 
var OpenFormat;      //打开格式：0->YUY；1->MJPG
var SupportFormat2;    //设备支持的视频格式代号：1->MJPG; 2->YUY2 
var OpenFormat2;      //打开格式：0->YUY；1->MJPG
var base64DecodeChars = new Array(
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
	52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
	-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
	15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
	-1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
	41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

//页面关闭时,停止摄像头,停止身份证读卡
window.onbeforeunload = (event) => {
  StopICWork();
  CloseFinger();
  CloseCam();
  FaceCheckUninit();
  if (isSecondDev) {
    CloseCam2();
    FaceCheckUninitSecond();
  }
}

//加载控件
let loadActiveX = () => {
  //if (navigator.userAgent.indexOf('MSIE') >= 0) {
  if (!!window.ActiveXObject || "ActiveXObject" in window) {
    isIE = true;
    //IE浏览器加载控件
    _this.innerHTML = "<OBJECT id=\"axCam_Ocx\"  classid=\"clsid:D5BD5B4A-4FC0-4869-880B-27EE9869D706\" width=\"500px\" height=\"400px\" ></OBJECT>";
    //document.getElementById("ActiveXDivTwo").innerHTML = "<OBJECT id=\"axCam_Ocx2\"  classid=\"clsid:341014BA-CD4A-4918-A11F-8A33B152915A\" width=\"500px\" height=\"400px\" ></OBJECT>";
    OcxInit();
  }
  else {
    isIE = false;
    if (!window.WebSocket) {
      alert("WebSocket not supported by this browser!");
    }
    //其他浏览器加载控件
    _this.innerHTML = "<canvas id=\"cameraCanvas\" width=\"565px\" height=\"450px\" style=\"border:1px solid #d3d3d3;\"/>";
    // document.getElementById("ActiveXDivTwo").innerHTML =" <canvas id=\"cameraCanvasSecond\" width=\"500px\" height=\"400px\" style=\"border:1px solid #d3d3d3;\">";
    _this.$nextTick(() => {
      WsInit(500, 400, 500, 400, true);
    })
  }

  if (document.addEventListener) {
    document.addEventListener('DOMMouseScroll', scrollFunc, false);
  }//W3C 
  window.onmousewheel = document.onmousewheel = scrollFunc
}



//必需重写---获取设备名称(num为当前摄像头数量,strUsbNamr为摄像头名字数组)
let GetDevName = (num, strUsbNamr) => {
  var obj = document.getElementById("DeviceName");
  obj.options.length = 0;
  for (var i = 0; i < num; i++) {
    var objOption = document.createElement("option");
    objOption.text = strUsbNamr[i];
    objOption.value = i;
    obj.options.add(objOption);
  }
  obj.options[camidMain].selected = true;
  if (num > 0) {
    if (isSecondDev) {

      var obj2 = document.getElementById("DeviceName2");
      obj2.options.length = 0;
      if (num > 1) {


        for (var i = 0; i < num; i++) {
          var objOption = document.createElement("option");
          objOption.text = strUsbNamr[i];
          objOption.value = i;
          obj2.options.add(objOption);
        }
        obj2.options[camidSub].selected = true;
        OcxGetDeviceResolutionSecond();
        //}
      }
    }
  }

}

//必需重写---获取分辨率(data为分辨率数组,每2个为一组,宽高)
let GetDeviceResolution = (data) => {
  var obj = document.getElementById("Resolution");
  var max = 0;
  var maxIndex = 0;
  obj.options.length = 0;
  if (data.length > 0) {
    for (var i = 0; i < data.length / 2; i++) {
      var objOption = document.createElement("option");
      var ww = data[i * 2];
      var hh = data[i * 2 + 1];
      objOption.text = "" + ww + "*" + hh;
      objOption.value = i;
      obj.options.add(objOption);
      if (max < ww) {
        max = ww;
        maxIndex = i;
      }
    }
    obj.options[maxIndex].selected = true;


  }
}

//必需重写---获取分辨率副头(data为分辨率数组,每2个为一组,宽高)
let GetDeviceResolutionSecond = (data) => {
  var obj = document.getElementById("Resolution2");
  var max = 0;
  var maxIndex = 0;
  obj.options.length = 0;
  for (var i = 0; i < data.length / 2 - 1; i++) {
    var objOption = document.createElement("option");
    var ww = data[i * 2];
    var hh = data[i * 2 + 1];
    objOption.text = "" + ww + "*" + hh;
    objOption.value = i;
    obj.options.add(objOption);
    if (max < ww) {
      max = ww;
      maxIndex = i;
    }
  }
  obj.options[maxIndex].selected = true;

}

//设备1初始化完成,可以进行相关操作
let LoadOver = () => {
  StartVideo();
}

//设备2初始化完成,可以进行相关操作
let LoadOver2 = () => {
  StartVideo2();
}



//开启摄像头
let StartVideo = () => {
  var obj = document.getElementById("Resolution");
  var restr = obj[obj.selectedIndex].text;
  var pos = restr.lastIndexOf("*");
  var width = parseInt(restr.substring(0, pos));
  var height = parseInt(restr.substring(pos + 1, restr.length));

  StartCam(camidMain, width, height);
  //StartCam(camidSub,1600,1200);

}

//关闭摄像头
let CloseVideo = () => {
  CloseCam();
}

//抓图拍照
let Capture = () => {
  _this.$message.success('上传成功')
  var type = 0;
  // if (document.getElementById("Radio1").checked) {
  //   //不裁边
  //   type = 0;
  // } else if (document.getElementById("Radio2").checked) {
  //   //自动裁边
  //   type = 1;
  // } else if (document.getElementById("Radio3").checked) {
  //   //手动裁边
  //   type = 2;
  // }
  SetJpgQuanlity(50);
  CaptureImage(type);
  
}

//切换摄像头
let ChangeDevice = () => {
  CloseCam();
  var devObj = document.getElementById("DeviceName");
  camidMain = devObj.selectedIndex;
  ChangeCamDevice(camidMain);
}

//切换分辨率
let ChangeResolution = () => {
  CloseCam();
  var obj = document.getElementById("Resolution");
  var restr = obj[obj.selectedIndex].text;
  var pos = restr.lastIndexOf("*");
  var width = parseInt(restr.substring(0, pos));
  var height = parseInt(restr.substring(pos + 1, restr.length));
  StartCam(camidMain, width, height);

}

//设置图片类型
let SetFileType = () => {
  var type = document.getElementById("FileType").selectedIndex;
  SetImageType(type);
}

//设置图片颜色格式
let SetImageColorMode = () => {
  var type = document.getElementById("ColourMode").selectedIndex;
  SetColorMode(type);
}

//图像设置窗口
let ShowImageSettingWindow = () => {
  ShowSettingWindow();
}

//设置是否裁剪
let SetCutType = () => {
  var type = 0;

  if (document.getElementById("Radio1").checked) {
    type = 0;
  }
  if (document.getElementById("Radio2").checked) {
    type = 1;
  }
  if (document.getElementById("Radio3").checked) {
    type = 2;
  }
  SetCamCutType(type);
  SetCamCutType2(type);
}

//设置智能连拍模式
let SetCaptureModel = () => {
  if (document.getElementById("Radio10").checked) {
    SetWiseCapture(0);
  }
  if (document.getElementById("Radio11").checked) {
    SetWiseCapture(1);
  }
  if (document.getElementById("Radio12").checked) {
    SetTimeCapture(1, 5000);
  }
}

//设置保存的文件路径
let SetFilePath = () => {
  //var path = "C:\\Users\\Administrator\\Desktop"
  var path = "E:\\img"
  SetImagePath(path);
  SetImagePath2(path);

}

//设置拍照时是否只返回base64
let funSetImagebase64 = () => {
  var isCheck = document.getElementById("checkboxBase").checked;
  if (isCheck) {
    SetImagebase64(1);
  } else {
    SetImagebase64(0);
  }

}

//启动身份证模块
let funStartIC = () => {
  StartIC();
}

//启动身份证自动读卡
let funStartICWork = () => {
  StartICWork();
}

//关闭身份证自动读卡
let funStopICWork = () => {
  StopICWork();
}

let funGetOneIC = () => {
  GetOneIC();
}

let funGetICValues = () => {
  GetICValues();
}

//条码识别
let funReadBarCode = (type) => {
  if (type == 0) {
    var imgPath = "D:\\barcode.jpg";
    ReadBarCode(imgPath);
  } else if (type == 1) {
    ReadBarQrcodeD(1);
  }
}

//二维码识别
let funReadQrCode = (type) => {
  if (type == 0) {
    var imgPath = "D:\\qrcode.jpg";
    ReadQrCode(imgPath);
  } else if (type == 1) {
    ReadBarQrcodeD(2);
  }
}

//合并PDF
let funConvertToPDF = () => {
  var pat1 = "D:\\add1.jpg";
  var pat2 = "D:\\add2.jpg";
  var pat3 = "D:\\add3.jpg";
  var pdfpath = "D:\\Convert.pdf";
  AddPDFImageFile(pat1);
  AddPDFImageFile(pat2);
  AddPDFImageFile(pat3);
  SavePDF(pdfpath);

}

//图片合并
let funCombineTwoImage = () => {
  var dir = 1;  // 1->垂直合并  2->水平合并
  if (document.getElementById("Radio4").checked) { dir = 1; }
  if (document.getElementById("Radio5").checked) { dir = 2; }

  var combinePath = "C:\\MyIMG\\CombineImg.jpg";
  var ImgPath1 = "C:\\MyIMG\\add1.jpg";
  var ImgPath2 = "C:\\MyIMG\\add2.jpg";
  CombineTwoImage(combinePath, ImgPath1, ImgPath2, dir);

}

//上传图片
let funUpdataFile = () => {
  UpdataFile("127.0.0.1", 8080, "/FileStreamDemo/servlet/FileSteamUpload?", "D:\\add1.jpg");
}

//上传Base64(js自带功能)
let funUpdataBase64 = () => {
  var strImgBase64 = document.getElementById("img1").src.split(',')[1];
  var $Blob = getBlobBydataURI(strImgBase64, 'image/jpeg');
  var formData = new FormData();
  formData.append("files", $Blob, "file_" + Date.parse(new Date()) + ".jpeg");
  //组建XMLHttpRequest 上传文件       
  var request = new XMLHttpRequest();
  //上传连接地址
  request.open("POST", "http://127.0.0.1:8080/FileStreamDemo/servlet/FileSteamUpload");
  request.onreadystatechange = () => {
    if (request.readyState == 4) {
      if (request.status == 200) {
        console.log("上传成功");
        alert("上传成功");
      } else {
        console.log("上传失败,检查上传地址是否正确");
        alert("上传失败,检查上传地址是否正确");
      }
    }
  }
  request.send(formData);
}

//刷新设备
let RefreshDev = () => {
  CloseCam();
  CloseCam2();
  RefreshDevice();
}

//根据文件路径获取base64
let fungetBase64 = () => {

  var strpath = "D:\\1.jpg";
  GetBase64FromFile(strpath);
}

//设置水印
let SetWaterType = () => {
  if (document.getElementById("Radio6").checked) {
    CloseWaterMark();
  }
  if (document.getElementById("Radio7").checked) {
    var waterinfo = "我的水印";
    var FontSize = 50;
    var FontSytle = 0;
    var xOff = 100;
    var yOff = 100;
    OpenWaterMark(waterinfo, FontSize, FontSytle, 255, 0, 0, xOff, xOff);
  }
}

//设置自动裁边单图与多图
let funsetJiubianModel = () => {
  if (document.getElementById("Radio13").checked) {
    SetJiubianModel(0);
    // axCam_Ocx.CusCrop(0);
  } else if (document.getElementById("Radio14").checked) {
    SetJiubianModel(1);
  }
}

//设置四周补白
let funsetBuBai = () => {
  var isCheck = document.getElementById("checkbox2").checked;
  if (isCheck) {
    SetBuBai(1);
  } else SetBuBai(0);
}

//设置去灰
let funsetQudise = () => {
  var isCheck = document.getElementById("checkbox1").checked;
  if (isCheck) {
    SetQudise(1);
  } else SetQudise(0);
}

let funSetFileNameModel = () => {
  if (document.getElementById("Radio19").checked) {
    //自定义
    var num = 1;
    var name = "IMGAAA";
    SetFileNameCustom(name, num);

    var num2 = 10;
    var name2 = "IMGAAAsub";
    SetFileNameCustom2(name2, num2);
  } else if (document.getElementById("Radio20").checked) {
    //时间
    SetFileNameTime();
    SetFileNameTime2();
  } else if (document.getElementById("Radio21").checked) {
    //固定
    var name = "固定";
    SetFileNameFixed(name);

    var name2 = "固定ssss";
    SetFileNameFixed2(name2);
  }
}

let funSetAutoExposure = () => {
  if (document.getElementById("RadioExopen").checked) {
    SetAutoExposure(1);
  } else if (document.getElementById("RadioExclose").checked) {
    SetAutoExposure(0);
  }
}

let funGetCamParameter = () => {
  GetCamParameter();
}

let funSetExposure = () => {
  SetExposure(0);
}

let funSetBrightness = () => {
  SetBrightness(0);
}

let funGetCamNum = () => {
  GetCamNum();
}

let funDeleteFile = () => {
  var filename = "D:\\1.jpg";
  DeleteFile(filename);
}

let funSetJpgQuanlity = () => {

  SetJpgQuanlity(100);
}

let funGetICPictureAll = () => {

  GetICPictureAll();
}

let funSetCusCropPlace = () => {

  var cutX = 800;
  var cutY = 600;
  var cutW = 800;
  var cutH = 600;


  SetCusCropPlace(cutX, cutY, cutW, cutH);


}

let funSetCusCropPlace2 = () => {

  var cutX = 100;
  var cutY = 100;
  var cutW = 400;
  var cutH = 300;

  SetCusCropPlace2(cutX, cutY, cutW, cutH);


}

let funBeginVideo = () => {
  var filename = "D:\\videoOne.avi";
  BeginVideo(filename, 0, 1);
}

let funStopVideo = () => {
  StopVideo();
}

let funBeginVideo2 = () => {
  var filename = "D:\\videoTwo.avi";
  BeginVideoSecond(filename, 0, 1);
}

let funStopVideo2 = () => {
  StopVideoSecond();
}

let funGetAudioName = () => {
  GetAudioName();
}

let funMakeDir = () => {
  var filename = "D:\\ceshi";
  MakeDir(filename);
}

let funAutoFoucs = () => {
  AutoFoucs();
}


var hide_show = 0;
let ShowHide = () => {

  if (hide_show == 0) {
    hide_show = 1;
    if (isIE) {
      document.getElementById("axCam_Ocx").style.visibility = "hidden";
    } else document.getElementById("cameraCanvas").style.visibility = "hidden";
  }
  else {
    hide_show = 0;
    if (isIE) {
      document.getElementById("axCam_Ocx").style.visibility = "visible";
    } else document.getElementById("cameraCanvas").style.visibility = "visible";
  }

}

let ShowInfo = (op) => {
  var obj = document.getElementById("TextArea1");
  obj.value = op + obj.value;
}
/*****************************副摄像头操作部分*******************************************

*****************************************************************************************/


//打开副摄像头
let StartVideo2 = () => {
  if (camidSub >= 0) {
    var obj = document.getElementById("Resolution2");
    var restr = obj[obj.selectedIndex].text;
    var pos = restr.lastIndexOf("*");
    var width = parseInt(restr.substring(0, pos));
    var height = parseInt(restr.substring(pos + 1, restr.length));
    StartCam2(camidSub, width, height);
  }

}

//关闭副摄像头
let CloseVideo2 = () => {
  CloseCam2();
}

//切换摄像头
let ChangeDevice2 = () => {
  CloseCam2();
  var devObj = document.getElementById("DeviceName2");
  camidSub = devObj.selectedIndex;
  ChangeCamDevice2(camidSub);
}

//切换分辨率
let ChangeResolution2 = () => {
  CloseCam2();
  var obj = document.getElementById("Resolution2");
  var restr = obj[obj.selectedIndex].text;
  var pos = restr.lastIndexOf("*");
  var width = parseInt(restr.substring(0, pos));
  var height = parseInt(restr.substring(pos + 1, restr.length));
  StartCam2(camidSub, width, height);

}


//副头拍照
let Capture2 = () => {
  var type = 0;
  if (document.getElementById("Radio1").checked) {
    //不裁边
    type = 0;
  } else if (document.getElementById("Radio2").checked) {
    //自动裁边
    type = 1;
  } else if (document.getElementById("Radio3").checked) {
    //手动裁边
    type = 2;
  }
  CaptureImage2(type);

}



let InfoCallback = (op) => {

  var text = "";
  if (op == 0) {
    text = "连接成功\r\n";
  } else if (op == 0x01) {
    text = "断开成功\r\n";
  } else if (op == 0x02) {
    text = "设备已经连接\r\n";
  } else if (op == 0x03) {
    text = "设备已经关闭\r\n";
  } else if (op == 0x04) {
    text = "拍照成功\r\n";
  } else if (op == 0x05) {
    text = "pdf添加文件成功\r\n";
  } else if (op == 0x06) {
    text = "pdf保存成功\r\n";
  } else if (op == 0x07) {
    text = "图片合并成功\r\n";
  } else if (op == 0x08) {
    text = "智能连拍启动\r\n";
  } else if (op == 0x09) {
    text = "定时连拍启动\r\n";
  } else if (op == 0x10) {
    text = "定时连拍成功\r\n";
  } else if (op == 0x11) {
    text = "定时连拍关闭\r\n";
  } else if (op == 0x12) {
    text = "文件上传服务器成功\r\n";
  } else if (op == 0x13) {
    text = "水印开启\r\n";
  } else if (op == 0x14) {
    text = "水印关闭\r\n";
  } else if (op == 0x15) {
    text = "此设备属于本公司\r\n";
  } else if (op == 0x16) {
    text = "此设备不属于本公司\r\n";
  } else if (op == 0x17) {
    text = "自动曝光启动\r\n";
  } else if (op == 0x18) {
    text = "自动曝光关闭\r\n";
  } else if (op == 0x19) {
    text = "身份证功能启动成功\r\n";
  } else if (op == 0x1a) {
    text = "身份证功能启动失败\r\n";
  } else if (op == 0x1b) {
    text = "身份证读卡成功\r\n";
  } else if (op == 0x1c) {
    text = "身份证读卡失败\r\n";
  } else if (op == 0x1d) {
    text = "重新操作\r\n";
  } else if (op == 0x1e) {
    text = "未发现模块\r\n";
  } else if (op == 0x1f) {
    text = "未启动身份证功能\r\n";
  } else if (op == 0x20) {
    text = "启动身份证自动读卡\r\n";
  } else if (op == 0x21) {
    text = "关闭身份证自动读卡\r\n";
  } else if (op == 0x22) {
    text = "启动拍照只生成base64\r\n";
  } else if (op == 0x23) {
    text = "关闭拍照只生成base64\r\n";
  } else if (op == 0x25) {
    text = "初始化指纹模块成功\r\n";
  } else if (op == 0x26) {
    text = "初始化指纹模块失败\r\n";
  } else if (op == 0x27) {
    text = "未初始化指纹模块\r\n";
  } else if (op == 0x28) {
    text = "身份证没有指纹数据\r\n";
  } else if (op == 0x29) {
    text = "指纹认证成功\r\n";
  } else if (op == 0x30) {
    text = "开始指纹认证\r\n";
  } else if (op == 0x31) {
    text = "正在指纹认证\r\n";
  } else if (op == 0x32) {
    text = "停止指纹认证\r\n";
  } else if (op == 0x33) {
    text = "指纹认证失败\r\n";
  } else if (op == 0x34) {
    text = "开始录像\r\n";
  } else if (op == 0x35) {
    text = "停止录像\r\n";
  } else if (op == 0x36) {
    text = "正在录像中\r\n";
  } else if (op == 0x37) {
    text = "开始录像副头\r\n";
  } else if (op == 0x38) {
    text = "停止录像副头\r\n";
  } else if (op == 0x39) {
    text = "正在录像中副头\r\n";
  } else if (op == 0x44) {
    text = "建立文件成功\r\n";
  } else if (op == 0x45) {
    text = "建立文件失败\r\n";
  } else if (op == 0x46) {
    text = "人脸识别初始化成功\r\n";
  } else if (op == 0x47) {
    text = "启动人脸对比\r\n";
  } else if (op == 0x48) {
    text = "人脸识别初始化成功\r\n";
  } else if (op == 0x49) {
    text = "主头正在连接中\r\n";
  } else if (op == 0x4a) {
    text = "主头等待连接\r\n";
  } else if (op == 0x4b) {
    text = "副头正在连接中\r\n";
  } else if (op == 0x4c) {
    text = "副头等待连接\r\n";
  }


  else if (op == 0xa0) {
    text = "没有对应分辨率\r\n";
  } else if (op == 0xa1) {
    text = "pdf没有添加任何文件\r\n";
  } else if (op == 0xa2) {
    text = "文件不存在\r\n";
  } else if (op == 0xa3) {
    text = "意外断开\r\n";
  } else if (op == 0xa4) {
    text = "连接不上\r\n";
  } else if (op == 0xa5) {
    text = "pdf添加文件不是jpg格式\r\n";
  } else if (op == 0xa6) {
    text = "没有发现摄像头\r\n";
  } else if (op == 0xa7) {
    text = "camid无效\r\n";
  } else if (op == 0xa8) {
    text = "图片尺寸太小\r\n";
  } else if (op == 0xa9) {
    text = "文件上传服务器失败\r\n";
  } else if (op == 0xaa) {
    text = "该设备没有副头\r\n";
  } else if (op == 0xab) {
    text = "条码识别失败\r\n";
  } else if (op == 0xac) {
    text = "二维码识别失败\r\n";
  } else if (op == 0xad) {
    text = "图片合并失败\r\n";
  } else if (op == 0xae) {
    text = "设置路径失败,路径不存在\r\n";
  } else if (op == 0xaf) {
    text = "摄像头切换太频繁\r\n";
  } else if (op == 0xb1) {
    text = "未发现指纹模块\r\n";
  } else if (op == 0xb2) {
    text = "录像分辨率不能高于1600*1200\r\n";
  } else if (op == 0xb3) {
    text = "副头录像分辨率不能高于1600*1200\r\n";
  } else if (op == 0xb4) {
    text = "没发现麦克风\r\n";
  } else if (op == 0xb8) {
    text = "人脸识别初始化失败\r\n";
  } else if (op == 0xb9) {
    text = "请读取身份证信息\r\n";
  } else if (op == 0xba) {
    text = "请先初始化人脸识别\r\n";
  } else if (op == 0xbb) {
    text = "没有发现合适的人脸\r\n";
  }
//   var obj = document.getElementById("TextArea1");
//   obj.value = text + obj.value;
}

let InfoTextCallback = (type, str) => {
  var text = "";
  if (type == 0) {
    text = "图片路径:" + str + "\r\n";
    _this.fileUpDataConfig(str)
  } else if (type == 1) {
    text = "默认路径:    " + str + "\r\n";

  } else if (type == 2) {
    text = "条码:    " + str + "\r\n";

  } else if (type == 3) {
    text = "文件上传服务器成功:" + str + "\r\n";

  } else if (type == 4) {
    text = "文件上传服务器失败:" + str + "\r\n";

  } else if (type == 5) {
    text = "base64编码成功,请自行处理str\r\n";
    // text ="data:;base64," +str+"\r\n";
    var imgobj1 = document.getElementById("img1");
    imgobj1.src = "data:;base64," + str;
    _this.setFileUpLoadDom(str)
  } else if (type == 6) {
    text = "删除文件成功:" + str + "\r\n";
  } else if (type == 7) {
    text = "二维码:" + str + "\r\n";
  } else if (type == 8) {
    text = "拍照失败:" + str + "\r\n";
  }

  else if (type == 9) {
    text = "身份证名字:" + str + "\r\n";
  } else if (type == 10) {
    text = "身份证号码:" + str + "\r\n";
  } else if (type == 11) {
    text = "身份证性别:" + str + "\r\n";
  } else if (type == 12) {
    text = "身份证民族:" + str + "\r\n";
  } else if (type == 13) {
    text = "身份证生日:" + str + "\r\n";
  } else if (type == 14) {
    text = "身份证地址:" + str + "\r\n";
  } else if (type == 15) {
    text = "身份证签发机关:" + str + "\r\n";
  } else if (type == 16) {
    text = "身份证有效开始日期:" + str + "\r\n";
  } else if (type == 17) {
    text = "身份证有效截至日期:" + str + "\r\n";
  } else if (type == 18) {
    text = "安全模块号:" + str + "\r\n";
  } else if (type == 19) {
    //身份证头像
    text = "身份证头像base64\r\n";
    var imgobj1 = document.getElementById("img1");
    imgobj1.src = "data:;base64," + str;
  } else if (type == 21) {
    text = "base64编码成功,请自行处理str(副头)\r\n";
    //text ="data:;base64," +str+"\r\n";
    var imgobj1 = document.getElementById("img2");
    imgobj1.src = "data:;base64," + str;
  } else if (type == 22) {
    text = "曝光范围:" + str + "\r\n";
  } else if (type == 23) {
    text = "亮度范围:" + str + "\r\n";
  } else if (type == 24) {
    text = "上传服务器返回:" + str + "\r\n";
  } else if (type == 25) {
    var imgobj1 = document.getElementById("img1");
    imgobj1.src = "data:;base64," + str;
    text = "身份证复印件" + "\r\n";
  } else if (type == 26) {
    text = "当前设备数量:" + str + "\r\n";
  } else if (type == 27) {
    text = "麦克风:" + str + "\r\n";
  } else if (type == 28) {
    text = "人脸抓拍base64编码成功,请自行处理str\r\n";
    // text ="data:;base64," +str+"\r\n";
    var imgobj1 = document.getElementById("img1");
    imgobj1.src = "data:;base64," + str;
  }

  
//   var obj = document.getElementById("TextArea1");
//   obj.value = text + obj.value;
}

let WsInit = (orignalCanvasW, orignalCanvasH, orignalCanvasW2, orignalCanvasH2, enableCanvas) => {
	WsInit_ip(orignalCanvasW, orignalCanvasH, orignalCanvasW2, orignalCanvasH2, enableCanvas, "localhost");
}

let WsInit_ip = (orignalCanvasW, orignalCanvasH, orignalCanvasW2, orignalCanvasH2, enableCanvas, ip) => {
	if (enableCanvas) {
    canvas = document.getElementById("cameraCanvas")
	// canvas = $('#cameraCanvas').html()
		context = canvas.getContext("2d");
		if (isSecondDev) {
			canvasSecond = document.getElementById("cameraCanvasSecond");
			contextSecond = canvasSecond.getContext("2d");
			canvasSecond.onmousedown = canvasClick2;
			canvasSecond.onmouseup = stopDragging2;
			canvasSecond.onmouseout = stopDragging2;
			canvasSecond.onmousemove = canvasMove2;
		}
		canvas.onmousedown = canvasClick;
		canvas.onmouseup = stopDragging;
		canvas.onmouseout = stopDragging;
		canvas.onmousemove = canvasMove;
		canvasX = 0;
		canvasY = 0;
		canvasLastX = 0;
		canvasLastY = 0;
	}

	//ws=new WebSocket("ws://localhost:9002"); 
	ws = new WebSocket("ws://" + ip + ":9002");
	ws.binaryType = "arraybuffer";
	ws.onmessage = (event) => {
		var aDataArray = new Uint8Array(event.data);
		if (aDataArray.length > 0) {
			if (aDataArray[0] == 0xef && aDataArray[1] == 0x01) {
				// getDeviceName(aDataArray[3]);
				// getResolution(aDataArray,5);
				getUsbCamareMessage(aDataArray, 5)
			} else if (aDataArray[0] == 0xef && aDataArray[1] == 0x17) {
				var camNum = aDataArray[3];
				//GetDevCount(camNum);
				InfoTextCallback(26, camNum);
			} else if (aDataArray[0] == 0xef && aDataArray[1] == 0x19) {
				getResolution(aDataArray, 5);

			} else if (aDataArray[0] == 0xef && aDataArray[1] == 0x23) {
				//getResolution(aDataArray,4);
				var type = aDataArray[3];
				var len = aDataArray[4];
				var data = new Uint8Array(len);
				for (var i = 0; i < len; i++) {
					data[i] = aDataArray[5 + i];
				}
				var str = byteToString(data)
        var text = decodeURIComponent(str);
				InfoTextCallback(type, text);

			} else if (aDataArray[0] == 0xef && aDataArray[1] == 0x05) {
				var ww = aDataArray[3] * 256 + aDataArray[4];
				var hh = aDataArray[5] * 256 + aDataArray[6];
				context.clearRect(0, 0, canvas.width, canvas.height);
				//sendMsgRefreshCam();
				var imgData = context.createImageData(ww, hh);
				var dataNum = 0;
				for (var i = 0; i < imgData.data.length; i += 4) {
					imgData.data[i + 0] = aDataArray[dataNum];
					imgData.data[i + 1] = aDataArray[dataNum + 1];
					imgData.data[i + 2] = aDataArray[dataNum + 2];
					imgData.data[i + 3] = 255;
					dataNum = dataNum + 3;
				}
				sendMsgRefreshCam();

				if (CutType == 2) {
					rec_ww = ww;
					rec_hh = hh;
					context.putImageData(imgData, canvas.width / 2 - ww / 2, canvas.height / 2 - hh / 2);
					refreshRect();
				} else context.putImageData(imgData, canvas.width / 2 - ww / 2 + canvasX, canvas.height / 2 - hh / 2 + canvasY);


				context.beginPath();
				context.strokeStyle = "rgb(0,255,0)";
				context.lineWidth = 2;
				GetFaceZuobiao(canvas.width / 2 - ww / 2 + canvasX, canvas.height / 2 - hh / 2 + canvasY);


			} else if (aDataArray[0] == 0xef && aDataArray[1] == 0x0c) {
				var ww = aDataArray[3] * 256 + aDataArray[4];
				var hh = aDataArray[5] * 256 + aDataArray[6];
				context.clearRect(0, 0, canvas.width, canvas.height);
				//sendMsgRefreshCam();
				var imgData = context.createImageData(ww, hh);
				var dataNum = 0;
				for (var i = 0; i < imgData.data.length; i += 4) {
					imgData.data[i + 0] = aDataArray[dataNum];
					imgData.data[i + 1] = aDataArray[dataNum + 1];
					imgData.data[i + 2] = aDataArray[dataNum + 2];
					imgData.data[i + 3] = 255;
					dataNum = dataNum + 3;
				}
				sendMsgRefreshCam();
				var Xdis = canvas.width / 2 - ww / 2 + canvasX;
				var Ydis = canvas.height / 2 - hh / 2 + canvasY;
				context.putImageData(imgData, Xdis, Ydis);

				var lenJiubian = aDataArray[7];


				context.beginPath();
				context.strokeStyle = "rgb(0,255,0)";
				context.lineWidth = 2;

				for (var j = 0; j < lenJiubian; j++) {
					for (var i = 0; i < 3; i++) {
						var aa = 1;
						if (aDataArray[8 + i * 6 + j * 24] == 1) {
							aa = -1;
						}
						var bb = 1;
						if (aDataArray[11 + i * 6 + j * 24] == 1) {
							bb = -1;
						}
						var cc = 1;
						if (aDataArray[14 + i * 6 + j * 24] == 1) {
							cc = -1;
						}
						var dd = 1;
						if (aDataArray[17 + i * 6 + j * 24] == 1) {
							dd = -1;
						}
						context.moveTo(aDataArray[9 + i * 6 + j * 24] * 256 * aa + aDataArray[10 + i * 6 + j * 24] * aa + Xdis, aDataArray[12 + i * 6 + j * 24] * 256 * bb + aDataArray[13 + i * 6 + j * 24] * bb + Ydis);
						context.lineTo(aDataArray[15 + i * 6 + j * 24] * 256 * cc + aDataArray[16 + i * 6 + j * 24] * cc + Xdis, aDataArray[18 + i * 6 + j * 24] * 256 * dd + aDataArray[19 + i * 6 + j * 24] * dd + Ydis);
						context.stroke();
					}
					var ee = 1;
					if (aDataArray[26 + j * 24] == 1) {
						ee = -1;
					}
					var ff = 1;
					if (aDataArray[8 + j * 24] == 1) {
						ff = -1;
					}
					context.moveTo(aDataArray[27 + j * 24] * 256 + aDataArray[28 + j * 24] + Xdis, aDataArray[30 + j * 24] * 256 + aDataArray[31 + j * 24] + Ydis);
					context.lineTo(aDataArray[9 + j * 24] * 256 + aDataArray[10 + j * 24] + Xdis, aDataArray[12 + j * 24] * 256 + aDataArray[13 + j * 24] + Ydis);
					context.stroke();
				}
				GetFaceZuobiao(canvas.width / 2 - ww / 2 + canvasX, canvas.height / 2 - hh / 2 + canvasY);
			} else if (aDataArray[0] == 0xef && aDataArray[1] == 0x14) {
				var tmp = aDataArray[3];
				if (tmp == 0x46) {
					isFaceOpen = true;
				} else if (tmp == 0x48) {
					isFaceOpenSecond = true;
				} else if (tmp == 0x5e) {
					isFaceOpen = true;
					isFaceOpenSecond = true;
				} else if (tmp == 0x5f) {
					isFaceOpen = true;
				} else if (tmp == 0x61) {
					isFaceOpenSecond = true;
				}

				InfoCallback(tmp);
			} else if (aDataArray[0] == 0xef && aDataArray[1] == 0x26) {

				if (isSecondDev) {
					var ww = aDataArray[3] * 256 + aDataArray[4];
					var hh = aDataArray[5] * 256 + aDataArray[6];
					contextSecond.clearRect(0, 0, canvasSecond.width, canvasSecond.height);

					var imgData = contextSecond.createImageData(ww, hh);
					var dataNum = 0;
					for (var i = 0; i < imgData.data.length; i += 4) {
						imgData.data[i + 0] = aDataArray[dataNum];
						imgData.data[i + 1] = aDataArray[dataNum + 1];
						imgData.data[i + 2] = aDataArray[dataNum + 2];
						imgData.data[i + 3] = 255;
						dataNum = dataNum + 3;

					}
					sendMsgRefreshCamSecond();


					contextSecond.putImageData(imgData, canvasSecond.width / 2 - ww / 2, canvasSecond.height / 2 - hh / 2);
					if (CutType == 2) {
						rec_ww2 = ww;
						rec_hh2 = hh;
						refreshRect2();
					}

					GetFaceZuobiaoSecond(canvasSecond.width / 2 - ww / 2, canvasSecond.height / 2 - hh / 2)




				}
			} else if (aDataArray[0] == 0xef && aDataArray[1] == 0x30) {
				var type1 = aDataArray[3];
				var ret = 1;
				if (type1 == 0) {
					ret = -1;
				}
				var min = aDataArray[4] * ret;

				var type2 = aDataArray[5];
				ret = 1;
				if (type2 == 0) {
					ret = -1;
				}
				var max = aDataArray[6] * ret;
				var text = "" + min + "*" + max;
				InfoTextCallback(23, text);
				// GetBrightnessRange_ws(min,max);
			} else if (aDataArray[0] == 0xef && aDataArray[1] == 0x32) {
				var type1 = aDataArray[3];
				var ret = 1;
				if (type1 == 0) {
					ret = -1;
				}
				var min = aDataArray[4] * ret;

				var type2 = aDataArray[5];
				ret = 1;
				if (type2 == 0) {
					ret = -1;
				}
				var max = aDataArray[6] * ret;
				var max = aDataArray[6] * ret;
				var text = "" + min + "*" + max;
				InfoTextCallback(22, text);
				// GetExposureRange_ws(min,max);
			} else if (aDataArray[0] == 0xef && aDataArray[1] == 0x36) {
				var len = aDataArray[3] * 65536 + aDataArray[4] * 256 + aDataArray[5];
				var baseDataArray = new Uint8Array(len);
				for (var i = 0; i < len; i++) {
					baseDataArray[i] = aDataArray[6 + i];
				}
				var str = byteToString(baseDataArray);
				var text = decodeURIComponent(str);

				var last = text.substr(str.length - 2, 1);
				var lastSecond = text.substr(str.length - 3, 1);
				if (last == "=" && lastSecond != "=") {
					text = text.substring(0, text.length - 1)
					text = text + "=";
				}
				InfoTextCallback(5, text);
			} else if (aDataArray[0] == 0xef && aDataArray[1] == 0x3b) {
				camidMain = aDataArray[3];
				// if(isSecondDev){
				camidSub = aDataArray[4];
				//}
			} else if (aDataArray[0] == 0xef && aDataArray[1] == 0x3e) {
				var len = aDataArray[3] * 65536 + aDataArray[4] * 256 + aDataArray[5];
				var baseDataArray = new Uint8Array(len);
				for (var i = 0; i < len; i++) {
					baseDataArray[i] = aDataArray[6 + i];
				}
				var str = byteToString(baseDataArray);
				var text = decodeURIComponent(str);

				InfoTextCallback(19, text);

			} else if (aDataArray[0] == 0xef && aDataArray[1] == 0x43) {
				var len = aDataArray[3] * 65536 + aDataArray[4] * 256 + aDataArray[5];
				var baseDataArray = new Uint8Array(len);
				for (var i = 0; i < len; i++) {
					baseDataArray[i] = aDataArray[6 + i];
				}
				var str = byteToString(baseDataArray);
				var text = decodeURIComponent(str);

				var last = text.substr(str.length - 2, 1);
				var lastSecond = text.substr(str.length - 3, 1);
				if (last == "=" && lastSecond != "=") {
					text = text.substring(0, text.length - 1)
					text = text + "=";
				}

				InfoTextCallback(21, text);
			} else if (aDataArray[0] == 0xef && aDataArray[1] == 0x4a) {
				rorateAngleType = aDataArray[3];
			} else if (aDataArray[0] == 0xef && aDataArray[1] == 0x4c) {
				var len = aDataArray[3] * 65536 + aDataArray[4] * 256 + aDataArray[5];
				var baseDataArray = new Uint8Array(len);
				for (var i = 0; i < len; i++) {
					baseDataArray[i] = aDataArray[6 + i];
				}
				var str = byteToString(baseDataArray);
				var text = decodeURIComponent(str);

				var last = text.substr(str.length - 2, 1);
				var lastSecond = text.substr(str.length - 3, 1);
				if (last == "=" && lastSecond != "=") {
					text = text.substring(0, text.length - 1)
					text = text + "=";
				}

				InfoTextCallback(25, text);
			} else if (aDataArray[0] == 0xef && aDataArray[1] == 0x5f) {
				var len = aDataArray[3] * 65536 + aDataArray[4] * 256 + aDataArray[5];
				var baseDataArray = new Uint8Array(len);
				for (var i = 0; i < len; i++) {
					baseDataArray[i] = aDataArray[6 + i];
				}
				var str = byteToString(baseDataArray);
				var text = decodeURIComponent(str);

				var last = text.substr(str.length - 2, 1);
				var lastSecond = text.substr(str.length - 3, 1);
				if (last == "=" && lastSecond != "=") {
					text = text.substring(0, text.length - 1)
					text = text + "=";
				}

				InfoTextCallback(28, text);
			} else if (aDataArray[0] == 0xef && aDataArray[1] == 0x60) {
				faceNum = aDataArray[3];
				for (var j = 0; j < faceNum * 4; j++) {

					var aa = 1;
					if (aDataArray[4 + j * 6] == 1) {
						aa = -1;
					}

					faceZuobiao[j * 2] = aDataArray[5 + j * 6] * 256 * aa + aDataArray[6 + j * 6] * aa;


					var bb = 1;
					if (aDataArray[7 + j * 6] == 1) {
						bb = -1;
					}
					faceZuobiao[j * 2 + 1] = aDataArray[8 + j * 6] * 256 * bb + aDataArray[9 + j * 6] * bb;

				}


			} else if (aDataArray[0] == 0xef && aDataArray[1] == 0x62) {
				faceNumSecond = aDataArray[3];
				for (var j = 0; j < faceNumSecond * 4; j++) {

					var aa = 1;
					if (aDataArray[4 + j * 6] == 1) {
						aa = -1;
					}

					faceZuobiaoSecond[j * 2] = aDataArray[5 + j * 6] * 256 * aa + aDataArray[6 + j * 6] * aa;


					var bb = 1;
					if (aDataArray[7 + j * 6] == 1) {
						bb = -1;
					}
					faceZuobiaoSecond[j * 2 + 1] = aDataArray[8 + j * 6] * 256 * bb + aDataArray[9 + j * 6] * bb;

				}


			} else if (aDataArray[0] == 0xef && aDataArray[1] == 0x67) {
				var tmp = aDataArray[3];
				if (tmp == 0x00) {
					faceNum = 0;
				} else if (tmp == 0x01) {
					faceNumSecond = 0;
				}
			} else if (aDataArray[0] == 0xef && aDataArray[1] == 0x71) {
				//getResolution(aDataArray,4);
				var type = aDataArray[3];
				var len = aDataArray[4] * 256 + aDataArray[5];
				var data = new Uint8Array(len);
				for (var i = 0; i < len; i++) {
					data[i] = aDataArray[6 + i];
				}
				var str = byteToString(data)
        var text = decodeURIComponent(str);
				InfoTextCallback(type, text);

			} else if (aDataArray[0] == 0xef && aDataArray[1] == 0x73) {
				var len = aDataArray[3] * 65536 + aDataArray[4] * 256 + aDataArray[5];
				var baseDataArray = new Uint8Array(len);
				for (var i = 0; i < len; i++) {
					baseDataArray[i] = aDataArray[6 + i];
				}
				var str = byteToString(baseDataArray);
				var text = decodeURIComponent(str);

				var last = text.substr(str.length - 2, 1);
				var lastSecond = text.substr(str.length - 3, 1);
				if (last == "=" && lastSecond != "=") {
					text = text.substring(0, text.length - 1)
					text = text + "=";
				}

				InfoTextCallback(30, text);
			} else if (aDataArray[0] == 0xef && aDataArray[1] == 0x7e) {
				var len = aDataArray[3] * 65536 + aDataArray[4] * 256 + aDataArray[5];
				var baseDataArray = new Uint8Array(len);
				for (var i = 0; i < len; i++) {
					baseDataArray[i] = aDataArray[6 + i];
				}
				var str = byteToString(baseDataArray);
				var text = decodeURIComponent(str);

				var last = text.substr(str.length - 2, 1);
				var lastSecond = text.substr(str.length - 3, 1);
				if (last == "=" && lastSecond != "=") {
					text = text.substring(0, text.length - 1)
					text = text + "=";
				}

				InfoTextCallback(33, text);
			} else if (aDataArray[0] == 0xef && aDataArray[1] == 0x84) {
				var len = aDataArray[3] * 65536 + aDataArray[4] * 256 + aDataArray[5];
				var baseDataArray = new Uint8Array(len);
				for (var i = 0; i < len; i++) {
					baseDataArray[i] = aDataArray[6 + i];
				}
				var str = byteToString(baseDataArray);
				var text = decodeURIComponent(str);

				var last = text.substr(str.length - 2, 1);
				var lastSecond = text.substr(str.length - 3, 1);
				if (last == "=" && lastSecond != "=") {
					text = text.substring(0, text.length - 1)
					text = text + "=";
				}

				InfoTextCallback(36, text);
			} else if (aDataArray[0] == 0xef && aDataArray[1] == 0x80) {
				//getResolution(aDataArray,4);
				var len = aDataArray[3] * 256 + aDataArray[4];
				InfoTextCallback(34, len);

			} else if (aDataArray[0] == 0xef && aDataArray[1] == 0x92) {
				var len = aDataArray[3] * 256 + aDataArray[4];
				InfoTextCallback(37, len);

			}
		}
	};
	ws.onclose = (event) => {
		//WebSocket Status:: Socket Closed
		InfoCallback(0xa3);
		//alert("程序出现异常,请重新启动0x00"); 
	};
	// ´ò¿ªWebSocket
	ws.onopen = (event) => {
		if (enableCanvas) {
			sendMsgGetMainCameraID();
			sendMsgRefreshDev();
			initParameter(orignalCanvasW, orignalCanvasH, orignalCanvasW2, orignalCanvasH2);
		}

		InfoCallback(0x24);

	};
	ws.onerror = (event) => {
		//WebSocket Status:: Error was reported
		InfoCallback(0xa4);
		// alert("程序出现异常,请重新启动0x01"); 
	};
}

let initParameter = (orignalCanvasW, orignalCanvasH, orignalCanvasW2, orignalCanvasH2) => {
	sendMsgBestSize();
	sendMsgSetCutType(0);
	sendMsgSetFileType(0);
	sendMsgSetImageColorMode(0);
	sendMsgSetConntinousShotModel(0);
	sendMsgChangeOrientation(0);
	sendMsgSetCanvasOriginalSize(orignalCanvasW, orignalCanvasH);
	sendMsgSetCanvasSecondOriginalSize(orignalCanvasW2, orignalCanvasH2);

}

let canvasClick = (e) => {
	isDragging = true;
	if (!isDrawMove) {
		canvasLastX = 0;

		canvasLastY = 0;
		canvasX_manual = 0;
		canvasY_manual = 0;

		recX_manual = 0;
		recY_manual = 0;
		recW_manual = 0;
		recH_manual = 0;
	} else {

	}
}

let stopDragging = () => {
	isDragging = false;
	canvasLastX = 0;
	canvasLastY = 0;
	canvasX_manual = 0;
	canvasY_manual = 0;
	if (CutType == 2) {
		bpp = rec_ww / imgOrignalW;
		if (rorateAngleType == 1 || rorateAngleType == 3) {
			bpp = rec_ww / imgOrignalH;
		}
		cutXCaibian = Math.abs(recW_manual) / bpp;
		cutYCaibian = Math.abs(recH_manual) / bpp;
	}
}

let canvasMove = (e) => {
	var mx = e.pageX - canvas.offsetLeft;
	var my = e.pageY - canvas.offsetTop;
	if (CutType == 2) {
		var x1 = recX_manual;
		var x2 = recX_manual + recW_manual;
		if (x1 > x2) {
			x1 = x2;
			x2 = recX_manual;
		}

		var y1 = recY_manual;
		var y2 = recY_manual + recH_manual;
		if (y1 > y2) {
			y1 = y2;
			y2 = recY_manual;
		}

		if (x1 <= mx && mx <= x2 && y1 <= my && my <= y2) {
			isDrawMove = true;
			if (isDragging) {
				if (canvasLastX == 0 && canvasLastY == 0) {
					canvasLastX = mx;
					canvasLastY = my;

				} else {
					recX_manual = recX_manual + (mx - canvasLastX);
					recY_manual = recY_manual + (my - canvasLastY);
					canvasLastX = mx;
					canvasLastY = my;
				}

			}
			return;
		} else if (x1 - 30 <= mx && mx <= x2 + 30 && y1 - 30 <= my && my <= y2 + 30) {
			isDrawMove = true;
			if (isDragging) {
				if (canvasLastX == 0 && canvasLastY == 0) {

					canvasLastX = mx;
					canvasLastY = my;

				} else {

					var tmpX2 = recX_manual + recW_manual;
					if (Math.abs(recX_manual - mx) < Math.abs(tmpX2 - mx)) {
						recX_manual = recX_manual + (mx - canvasLastX);
						recW_manual = recW_manual - (mx - canvasLastX);
					} else recW_manual = recW_manual + (mx - canvasLastX);

					var tmpY2 = recY_manual + recH_manual;
					if (Math.abs(recY_manual - my) < Math.abs(tmpY2 - my)) {
						recY_manual = recY_manual + (my - canvasLastY);
						recH_manual = recH_manual - (my - canvasLastY);
					} else recH_manual = recH_manual + (my - canvasLastY);

					canvasLastX = mx;
					canvasLastY = my;
				}

				return;
			}
		} else isDrawMove = false;
	}

	if (isDragging == true) {
		if (CutType != 2) {
			if (canvasLastX == 0 && canvasLastY == 0) {
				canvasLastX = e.pageX - canvas.offsetLeft;
				canvasLastY = e.pageY - canvas.offsetTop;

			} else {

				canvasX = canvasX + (mx - canvasLastX);
				canvasY = canvasY + (my - canvasLastY);
				canvasLastX = mx;
				canvasLastY = my;
			}
		} else {




			if (canvasLastX == 0 && canvasLastY == 0) {

				canvasLastX = mx;
				canvasLastY = my;
				recX_manual = mx;
				recY_manual = my;
			} else {



				canvasX_manual = canvasX_manual + (mx - canvasLastX);
				canvasY_manual = canvasY_manual + (my - canvasLastY);
				canvasLastX = mx;
				canvasLastY = my;
				recW_manual = canvasX_manual;
				recH_manual = canvasY_manual;
			}

		}
	}
}

let canvasClick2 = (e) => {
	isDragging2 = true;
	if (!isDrawMove2) {
		canvasLastX2 = 0;

		canvasLastY2 = 0;
		canvasX_manual2 = 0;
		canvasY_manual2 = 0;

		recX_manual2 = 0;
		recY_manual2 = 0;
		recW_manual2 = 0;
		recH_manual2 = 0;
	}
}

let stopDragging2 = () => {
	isDragging2 = false;
	canvasLastX2 = 0;
	canvasLastY2 = 0;
	canvasX_manual2 = 0;
	canvasY_manual2 = 0;
	if (CutType == 2) {
		var bpp2 = rec_ww2 / imgOrignalW2;
		cutXCaibian2 = Math.abs(recW_manual2) / bpp2;
		cutYCaibian2 = Math.abs(recH_manual2) / bpp2;
	}
}

let canvasMove2 = (e) => {
	var mx = e.pageX - canvasSecond.offsetLeft;
	var my = e.pageY - canvasSecond.offsetTop;
	if (CutType == 2) {
		var x1 = recX_manual2;
		var x2 = recX_manual2 + recW_manual2;
		if (x1 > x2) {
			x1 = x2;
			x2 = recX_manual2;
		}

		var y1 = recY_manual2;
		var y2 = recY_manual2 + recH_manual2;
		if (y1 > y2) {
			y1 = y2;
			y2 = recY_manual2;
		}

		if (x1 <= mx && mx <= x2 && y1 <= my && my <= y2) {
			isDrawMove2 = true;
			if (isDragging2) {
				if (canvasLastX2 == 0 && canvasLastY2 == 0) {
					canvasLastX2 = mx;
					canvasLastY2 = my;

				} else {
					recX_manual2 = recX_manual2 + (mx - canvasLastX2);
					recY_manual2 = recY_manual2 + (my - canvasLastY2);
					canvasLastX2 = mx;
					canvasLastY2 = my;
				}

			}
			return;

		} else if (x1 - 30 <= mx && mx <= x2 + 30 && y1 - 30 <= my && my <= y2 + 30) {
			isDrawMove2 = true;
			if (isDragging2) {
				if (canvasLastX2 == 0 && canvasLastY2 == 0) {

					canvasLastX2 = mx;
					canvasLastY2 = my;

				} else {

					var tmpX2 = recX_manual2 + recW_manual2;
					if (Math.abs(recX_manual2 - mx) < Math.abs(tmpX2 - mx)) {
						recX_manual2 = recX_manual2 + (mx - canvasLastX2);
						recW_manual2 = recW_manual2 - (mx - canvasLastX2);
					} else recW_manual2 = recW_manual2 + (mx - canvasLastX2);

					var tmpY2 = recY_manual2 + recH_manual2;
					if (Math.abs(recY_manual2 - my) < Math.abs(tmpY2 - my)) {
						recY_manual2 = recY_manual2 + (my - canvasLastY2);
						recH_manual2 = recH_manual2 - (my - canvasLastY2);
					} else recH_manual2 = recH_manual2 + (my - canvasLastY2);

					canvasLastX2 = mx;
					canvasLastY2 = my;
				}

				return;
			}
		} else isDrawMove2 = false;
	}

	if (isDragging2 == true) {
		if (CutType != 2) {

		} else {

			if (canvasLastX2 == 0 && canvasLastY2 == 0) {

				canvasLastX2 = mx;
				canvasLastY2 = my;
				recX_manual2 = mx;
				recY_manual2 = my;
			} else {

				canvasX_manual2 = canvasX_manual2 + (mx - canvasLastX2);
				canvasY_manual2 = canvasY_manual2 + (my - canvasLastY2);
				canvasLastX2 = mx;
				canvasLastY2 = my;
				recW_manual2 = canvasX_manual2;
				recH_manual2 = canvasY_manual2;
			}

		}
	}
}

let getResolution = (arrayData, tmpNum) => {
	var type = arrayData[3]
	var len = arrayData[4];
	var data = new Int32Array(len * 2);
	var num = 0;
	for (var i = 0; i < len; i++) {
		data[num] = arrayData[tmpNum] * 256 + arrayData[tmpNum + 1];
		num++;
		data[num] = arrayData[tmpNum + 2] * 256 + arrayData[tmpNum + 3];
		num++;
		tmpNum += 4;
	}
	if (type == 0) {
		GetDeviceResolution(data);
	} else {
		if (isSecondDev) {
			GetDeviceResolutionSecond(data);
			LoadOver2();
		}
	}

}

let getUsbCamareMessage = (arrayData, tmpNum) => {
	var numCam = arrayData[3];
	var len = arrayData[4];
	var data = new Int32Array(len * 2);
	var num = 0;
	for (var i = 0; i < len; i++) {
		data[num] = arrayData[tmpNum] * 256 + arrayData[tmpNum + 1];
		num++;
		data[num] = arrayData[tmpNum + 2] * 256 + arrayData[tmpNum + 3];
		num++;
		tmpNum += 4;
	}
	GetDeviceResolution(data);
	LoadOver();

	var strUsbNamr = new Array()
	for (var i = 0; i < numCam; i++) {
		var tmpLen = arrayData[tmpNum];
		var tmpData = new Uint8Array(tmpLen);
		tmpNum++;
		for (var j = 0; j < tmpLen; j++) {
			tmpData[j] = arrayData[tmpNum];
			tmpNum++;
		}
		// var arr =       Utf8ToUnicode(tmpData)
		var str = byteToString(tmpData);
		var text = decodeURIComponent(str);
		strUsbNamr[i] = text;
	}
	GetDevName(numCam, strUsbNamr);


}



let sendMsgRefreshCam = () => {
	var aDataArray = new Uint8Array(3);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x04;
	aDataArray[2] = 0x00;
	ws.send(aDataArray.buffer);
}

let sendMsgStartVideo2 = (camId, width, height) => {


	imgOrignalW2 = width;
	imgOrignalH2 = height;
	var aDataArray = new Uint8Array(8);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x25;
	aDataArray[2] = 0x05;
	aDataArray[3] = camId;
	aDataArray[4] = width / 256;
	aDataArray[5] = width % 256;
	aDataArray[6] = height / 256;
	aDataArray[7] = height % 256;
	ws.send(aDataArray.buffer);
}

let sendMsgStartVideo2YUV = (camId, width, height) => {


	imgOrignalW2 = width;
	imgOrignalH2 = height;
	var aDataArray = new Uint8Array(8);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x8b;
	aDataArray[2] = 0x05;
	aDataArray[3] = camId;
	aDataArray[4] = width / 256;
	aDataArray[5] = width % 256;
	aDataArray[6] = height / 256;
	aDataArray[7] = height % 256;
	ws.send(aDataArray.buffer);
}


let sendMsgRefreshCamSecond = () => {
	var aDataArray = new Uint8Array(3);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x27;
	aDataArray[2] = 0x00;
	ws.send(aDataArray.buffer);
}
let sendMsgSetCanvasOriginalSize = (ww, hh) => {
	var aDataArray = new Uint8Array(7);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x15;
	aDataArray[2] = 0x04;
	aDataArray[3] = ww / 256;
	aDataArray[4] = ww % 256;
	aDataArray[5] = hh / 256;
	aDataArray[6] = hh % 256;
	ws.send(aDataArray.buffer);
}
let sendMsgSetCanvasSecondOriginalSize = (ww, hh) => {
	var aDataArray = new Uint8Array(7);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x37;
	aDataArray[2] = 0x04;
	aDataArray[3] = ww / 256;
	aDataArray[4] = ww % 256;
	aDataArray[5] = hh / 256;
	aDataArray[6] = hh % 256;
	ws.send(aDataArray.buffer);
}
let sendMsgRefreshDev = () => {
	var aDataArray = new Uint8Array(3);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x00;
	aDataArray[2] = 0x00;
	ws.send(aDataArray.buffer);
}
let sendMsgStartVideo = (camId, width, height) => {

	if (width == 3672) {
		imgOrignalW = 3264;
		imgOrignalH = 2448;

	} else {
		imgOrignalW = width;
		imgOrignalH = height;
	}
	var aDataArray = new Uint8Array(8);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x02;
	aDataArray[2] = 0x05;
	aDataArray[3] = camId;
	aDataArray[4] = width / 256;
	aDataArray[5] = width % 256;
	aDataArray[6] = height / 256;
	aDataArray[7] = height % 256;
	ws.send(aDataArray.buffer);
}

let sendMsgStartVideoYUV = (camId, width, height) => {

	if (width == 3672) {
		imgOrignalW = 3264;
		imgOrignalH = 2448;

	} else {
		imgOrignalW = width;
		imgOrignalH = height;
	}
	var aDataArray = new Uint8Array(8);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x8a;
	aDataArray[2] = 0x05;
	aDataArray[3] = camId;
	aDataArray[4] = width / 256;
	aDataArray[5] = width % 256;
	aDataArray[6] = height / 256;
	aDataArray[7] = height % 256;
	ws.send(aDataArray.buffer);
}

let sendMsgChangeOrientation = (type) => {
	var aDataArray = new Uint8Array(4);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x06;
	aDataArray[2] = 0x01;
	aDataArray[3] = type;
	ws.send(aDataArray.buffer);
}
let sendMsgSetImageColorMode = (type) => {
	var aDataArray2 = new Uint8Array(4);
	aDataArray2[0] = 0xef;
	aDataArray2[1] = 0x07;
	aDataArray2[2] = 0x01;
	aDataArray2[3] = type;
	ws.send(aDataArray2.buffer);
}

let sendMsgCloseVideo = () => {

	var aDataArray = new Uint8Array(3);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x08;
	aDataArray[2] = 0x00;
	ws.send(aDataArray.buffer);
	context.clearRect(0, 0, canvas.width, canvas.height);
}

let sendMsgCloseVideoSecond = () => {

	var aDataArray = new Uint8Array(3);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x28;
	aDataArray[2] = 0x00;
	ws.send(aDataArray.buffer);
	contextSecond.clearRect(0, 0, canvas.width, canvas.height);
}
let sendMsgChangeResolution = (camId, width, height) => {



	var aDataArray = new Uint8Array(8);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x02;
	aDataArray[2] = 0x05;
	aDataArray[3] = camId;
	aDataArray[4] = width / 256;
	aDataArray[5] = width % 256;
	aDataArray[6] = height / 256;
	aDataArray[7] = height % 256;
	ws.send(aDataArray.buffer);
}

let sendMsgSetFilePath = (pathUnicode) => {
	var path = encodeURI(pathUnicode);
	var pathdata = stringToByte(path);
	var len = path.length;
	var aDataArray = new Uint8Array(3 + len);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x1c;
	aDataArray[2] = len;
	for (var i = 0; i < len; i++) {
		aDataArray[3 + i] = pathdata[i];
	}
	ws.send(aDataArray.buffer);
}

let sendMsgSetFileNameModelCustom = (index, pathUnicode) => {
	var path = encodeURI(pathUnicode);
	var pathdata = stringToByte(path);
	var len = path.length;
	var aDataArray = new Uint8Array(6 + len);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x1d;
	aDataArray[2] = len + 3;
	aDataArray[3] = index / 256;
	aDataArray[4] = index % 256;
	aDataArray[5] = len;
	for (var i = 0; i < len; i++) {
		aDataArray[6 + i] = pathdata[i];
	}
	ws.send(aDataArray.buffer);
}

let sendMsgSetFileNameModelCustomSecond = (index, pathUnicode) => {
	var path = encodeURI(pathUnicode);
	var pathdata = stringToByte(path);
	var len = path.length;
	var aDataArray = new Uint8Array(6 + len);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x46;
	aDataArray[2] = len + 3;
	aDataArray[3] = index / 256;
	aDataArray[4] = index % 256;
	aDataArray[5] = len;
	for (var i = 0; i < len; i++) {
		aDataArray[6 + i] = pathdata[i];
	}
	ws.send(aDataArray.buffer);
}

let sendMsgSetFileNameModelFixed = (pathUnicode) => {
	var path = encodeURI(pathUnicode);
	var pathdata = stringToByte(path);
	var len = path.length;
	var aDataArray = new Uint8Array(3 + len);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x1f;
	aDataArray[2] = len;
	for (var i = 0; i < len; i++) {
		aDataArray[3 + i] = pathdata[i];
	}
	ws.send(aDataArray.buffer);
}

let sendMsgSetFileNameModelFixedSecond = (pathUnicode) => {
	var path = encodeURI(pathUnicode);
	var pathdata = stringToByte(path);
	var len = path.length;
	var aDataArray = new Uint8Array(3 + len);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x48;
	aDataArray[2] = len;
	for (var i = 0; i < len; i++) {
		aDataArray[3 + i] = pathdata[i];
	}
	ws.send(aDataArray.buffer);
}

let sendMsgSetFileNameModelTime = () => {
	var aDataArray = new Uint8Array(3);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x1e;
	aDataArray[2] = 0x00;
	ws.send(aDataArray.buffer);
}

let sendMsgSetFileNameModelTimeSecond = () => {
	var aDataArray = new Uint8Array(3);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x47;
	aDataArray[2] = 0x00;
	ws.send(aDataArray.buffer);
}

let sendMsgSetFileNameModelBarcode = () => {
	var aDataArray = new Uint8Array(3);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x2b;
	aDataArray[2] = 0x00;
	ws.send(aDataArray.buffer);
}

let sendMsgSetFileType = (type) => {
	var aDataArray = new Uint8Array(4);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x20;
	aDataArray[2] = 0x01;
	aDataArray[3] = type;
	ws.send(aDataArray.buffer);
}

let sendMsgSetConntinousShotModel = (type) => {
	var aDataArray = new Uint8Array(4);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x21;
	aDataArray[2] = 0x01;
	aDataArray[3] = type;
	ws.send(aDataArray.buffer);
}

let sendMsgSetConntinousShotModelTime = (len) => {
	var aDataArray = new Uint8Array(5);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x22;
	aDataArray[2] = 0x02;
	aDataArray[3] = len / 256;
	aDataArray[4] = len % 256;
	ws.send(aDataArray.buffer);
}

let sendMsgUploadFile = (uploadSerHead, uploadSerLast, uploadSerFile) => {
	var path = encodeURI(uploadSerHead);
	var pathdata = stringToByte(path);
	var len = path.length;

	var path2 = encodeURI(uploadSerLast);
	var pathdata2 = stringToByte(path2);
	var len2 = path2.length;

	var path3 = encodeURI(uploadSerFile);
	var pathdata3 = stringToByte(path3);
	var len3 = path3.length;

	var aDataArray = new Uint8Array(8 + len + len2 + len3);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x24;
	aDataArray[2] = 5 + len + len2 + len3;
	aDataArray[3] = 0x00;
	aDataArray[4] = 80 % 256;
	aDataArray[5] = len;
	for (var i = 0; i < len; i++) {
		aDataArray[6 + i] = pathdata[i];
	}
	aDataArray[6 + len] = len2;
	for (var i = 0; i < len2; i++) {
		aDataArray[7 + len + i] = pathdata2[i];
	}
	aDataArray[7 + len + len2] = len3;
	for (var i = 0; i < len3; i++) {
		aDataArray[8 + len + len2 + i] = pathdata3[i];
	}
	ws.send(aDataArray.buffer);

}

let sendMsgUploadFilePort = (port, uploadSerHead, uploadSerLast, uploadSerFile) => {
	var path = encodeURI(uploadSerHead);
	var pathdata = stringToByte(path);
	var len = path.length;

	var path2 = encodeURI(uploadSerLast);
	var pathdata2 = stringToByte(path2);
	var len2 = path2.length;

	var path3 = encodeURI(uploadSerFile);
	var pathdata3 = stringToByte(path3);
	var len3 = path3.length;

	var aDataArray = new Uint8Array(8 + len + len2 + len3);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x24;
	aDataArray[2] = 5 + len + len2 + len3;
	aDataArray[3] = port / 256;
	aDataArray[4] = port % 256;
	aDataArray[5] = len;
	for (var i = 0; i < len; i++) {
		aDataArray[6 + i] = pathdata[i];
	}
	aDataArray[6 + len] = len2;
	for (var i = 0; i < len2; i++) {
		aDataArray[7 + len + i] = pathdata2[i];
	}
	aDataArray[7 + len + len2] = len3;
	for (var i = 0; i < len3; i++) {
		aDataArray[8 + len + len2 + i] = pathdata3[i];
	}
	ws.send(aDataArray.buffer);

}

let sendMsgCapture = (type) => {
	if (type != 2) {
		var aDataArray = new Uint8Array(4);
		aDataArray[0] = 0xef;
		aDataArray[1] = 0x0a;
		aDataArray[2] = 0x01;
		aDataArray[3] = 0x00;
		ws.send(aDataArray.buffer);
	} else {
		var x1 = recX_manual;
		if (recX_manual > recX_manual + recW_manual) {
			x1 = recX_manual + recW_manual;

		}
		var y1 = recY_manual;
		if (recY_manual > recY_manual + recH_manual) {
			y1 = recY_manual + recH_manual;

		}


		//   var bpp = rec_ww/imgOrignalW;

		// if(rorateAngleType==1 || rorateAngleType==3){
		//   bpp = rec_hh/imgOrignalH;
		// }

		//var w1 = Math.abs(recW_manual/bpp);
		//  var h1 = Math.abs(recH_manual/bpp);
		var xsend = x1 - (canvas.width / 2 - rec_ww / 2);
		var ysend = y1 - (canvas.height / 2 - rec_hh / 2);


		if (xsend < 0) xsend = 0;
		if (ysend < 0) ysend = 0;
		var aDataArray = new Uint8Array(11);
		aDataArray[0] = 0xef;
		//aDataArray[1] = 0x0f;
		aDataArray[1] = 0x4b;
		aDataArray[2] = 0x08;
		aDataArray[3] = xsend / 256;
		aDataArray[4] = xsend % 256;
		aDataArray[5] = ysend / 256;
		aDataArray[6] = ysend % 256;
		aDataArray[7] = cutXCaibian / 256;
		aDataArray[8] = cutXCaibian % 256;
		aDataArray[9] = cutYCaibian / 256;
		aDataArray[10] = cutYCaibian % 256;
		// aDataArray[7] = recW_manual/256;
		// aDataArray[8] = recW_manual%256;
		// aDataArray[9] = recH_manual/256;
		// aDataArray[10] = recH_manual%256;
		ws.send(aDataArray.buffer);
	}

}

let sendMsgCaptureSecond = () => {
	var aDataArray = new Uint8Array(3);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x29;
	aDataArray[2] = 0x00;
	ws.send(aDataArray.buffer);
}

let sendMsgCaptureSecondCaibian = () => {
	var x1 = recX_manual2;
	if (recX_manual2 > recX_manual2 + recW_manual2) {
		x1 = recX_manual2 + recW_manual2;

	}
	var y1 = recY_manual2;
	if (recY_manual2 > recY_manual2 + recH_manual2) {
		y1 = recY_manual2 + recH_manual2;

	}

	var xsend = x1 - (canvasSecond.width / 2 - rec_ww2 / 2);
	var ysend = y1 - (canvasSecond.height / 2 - rec_hh2 / 2);


	if (xsend < 0) xsend = 0;
	if (ysend < 0) ysend = 0;
	var aDataArray = new Uint8Array(11);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x4c;
	aDataArray[2] = 0x08;
	aDataArray[3] = xsend / 256;
	aDataArray[4] = xsend % 256;
	aDataArray[5] = ysend / 256;
	aDataArray[6] = ysend % 256;
	aDataArray[7] = cutXCaibian2 / 256;
	aDataArray[8] = cutXCaibian2 % 256;
	aDataArray[9] = cutYCaibian2 / 256;
	aDataArray[10] = cutYCaibian2 % 256;

	ws.send(aDataArray.buffer);
}

let sendMsgShowImageSettingWindow = () => {
	var aDataArray = new Uint8Array(3);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x0b;
	aDataArray[2] = 0x00;
	ws.send(aDataArray.buffer);
}

let sendMsgShowImageSettingWindowB = () => {
	var aDataArray = new Uint8Array(3);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x45;
	aDataArray[2] = 0x00;
	ws.send(aDataArray.buffer);
}


let sendMsgZoom = (type) => {
	var aDataArray = new Uint8Array(4);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x0d;
	aDataArray[2] = 0x01;
	aDataArray[3] = type;
	ws.send(aDataArray.buffer);
}

let sendMsgSetCutType = (type) => {
	canvasX = 0;
	canvasY = 0;
	CutType = type;
	var aDataArray = new Uint8Array(4);

	aDataArray[0] = 0xef;
	aDataArray[1] = 0x0e;
	aDataArray[2] = 0x01;
	aDataArray[3] = type;
	ws.send(aDataArray.buffer);

}

let sendMsgSetJiubianModel = (type) => {
	var aDataArray = new Uint8Array(4);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x10;
	aDataArray[2] = 0x01;
	aDataArray[3] = type;
	ws.send(aDataArray.buffer);

}

let sendMsgGetCamNum = () => {
	var aDataArray = new Uint8Array(3);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x16;
	aDataArray[2] = 0x00;
	ws.send(aDataArray.buffer);

}

let sendMsgGetResolution = (camid) => {
	var aDataArray = new Uint8Array(5);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x18;
	aDataArray[2] = 0x02;
	aDataArray[3] = 0x00;
	aDataArray[4] = camid;
	ws.send(aDataArray.buffer);
}

let sendMsgGetResolutionSecond = (camid) => {
	var aDataArray = new Uint8Array(5);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x18;
	aDataArray[2] = 0x02;
	aDataArray[3] = 0x01;
	aDataArray[4] = camid;
	ws.send(aDataArray.buffer);
}

let sednMsgSavePDF = (pathUnicode) => {
	var path = encodeURI(pathUnicode);
	var pathdata = stringToByte(path);
	var len = path.length;
	var aDataArray = new Uint8Array(3 + len);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x11;
	aDataArray[2] = len;
	for (var i = 0; i < len; i++) {
		aDataArray[3 + i] = pathdata[i];
	}
	ws.send(aDataArray.buffer);
}

let sednMsgAddPDF = (pathUnicode) => {
	var path = encodeURI(pathUnicode);
	var pathdata = stringToByte(path);
	var len = path.length;
	var aDataArray = new Uint8Array(3 + len);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x12;
	aDataArray[2] = len;
	for (var i = 0; i < len; i++) {
		aDataArray[3 + i] = pathdata[i];
	}
	ws.send(aDataArray.buffer);
}

let sednMsgSaveTIF = (pathUnicode) => {
	var path = encodeURI(pathUnicode);
	var pathdata = stringToByte(path);
	var len = path.length;
	var aDataArray = new Uint8Array(3 + len);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0xa4;
	aDataArray[2] = len;
	for (var i = 0; i < len; i++) {
		aDataArray[3 + i] = pathdata[i];
	}
	ws.send(aDataArray.buffer);
}

let sednMsgAddTIF = (pathUnicode) => {
	var path = encodeURI(pathUnicode);
	var pathdata = stringToByte(path);
	var len = path.length;
	var aDataArray = new Uint8Array(3 + len);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0xa5;
	aDataArray[2] = len;
	for (var i = 0; i < len; i++) {
		aDataArray[3 + i] = pathdata[i];
	}
	ws.send(aDataArray.buffer);
}

let sednMsgClearTIF = () => {
	var aDataArray = new Uint8Array(3);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0xa6;
	aDataArray[2] = 0x00;
	ws.send(aDataArray.buffer);
}

let sednMsgWaterMarkOpen = (pathUnicode, fontSize, fontStyleIndex, r, g, b, xoffset, yoffset) => {
	var path = encodeURI(pathUnicode);
	var pathdata = stringToByte(path);
	var len = path.length;

	var aDataArray = new Uint8Array(11 + len);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x1a;
	aDataArray[2] = 8 + len;
	aDataArray[3] = fontSize;
	aDataArray[4] = fontStyleIndex;
	aDataArray[5] = r;
	aDataArray[6] = g;
	aDataArray[7] = b;
	aDataArray[8] = xoffset;
	aDataArray[9] = yoffset;
	aDataArray[10] = len;
	for (var i = 0; i < len; i++) {
		aDataArray[11 + i] = pathdata[i];
	}
	ws.send(aDataArray.buffer);
}

let sednMsgWaterMarkClose = () => {
	var aDataArray = new Uint8Array(3);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x1b;
	aDataArray[2] = 0x00;
	ws.send(aDataArray.buffer);
}

let sednMsgBubaiType = (type) => {
	var aDataArray = new Uint8Array(4);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x2c;
	aDataArray[2] = 0x01;
	aDataArray[3] = type;
	ws.send(aDataArray.buffer);
}

let sednMsgQuqudiseType = (type) => {
	var aDataArray = new Uint8Array(4);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x34;
	aDataArray[2] = 0x01;
	aDataArray[3] = type;
	ws.send(aDataArray.buffer);
}

let sendMsgCombineTwoImage = (path1Unicode, path2Unicode, path3Unicode, type) => {
	var path1 = encodeURI(path1Unicode);
	var pathdata1 = stringToByte(path1);
	var len1 = path1.length;

	var path2 = encodeURI(path2Unicode);
	var pathdata2 = stringToByte(path2);
	var len2 = path2.length;

	var path3 = encodeURI(path3Unicode);
	var pathdata3 = stringToByte(path3);
	var len3 = path3.length;

	var aDataArray = new Uint8Array(7 + len1 + len2 + len3);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x13;
	aDataArray[2] = len1 + len2 + len3 + 4;
	aDataArray[3] = type;
	aDataArray[4] = len1;
	for (var i = 0; i < len1; i++) {
		aDataArray[5 + i] = pathdata1[i];
	}
	aDataArray[5 + len1] = len2;
	for (var i = 0; i < len2; i++) {
		aDataArray[6 + len1 + i] = pathdata2[i];
	}

	aDataArray[6 + len1 + len2] = len3;
	for (var i = 0; i < len3; i++) {
		aDataArray[7 + len1 + len2 + i] = pathdata3[i];
	}
	ws.send(aDataArray.buffer);
}

let sendMsgCombineTwoImageBase64 = (path1Unicode, path2Unicode, type) => {
	var path1 = encodeURI(path1Unicode);
	var pathdata1 = stringToByte(path1);
	var len1 = path1.length;

	var path2 = encodeURI(path2Unicode);
	var pathdata2 = stringToByte(path2);
	var len2 = path2.length;


	var aDataArray = new Uint8Array(7 + len1 + len2);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x85;
	aDataArray[2] = len1 + len2 + 3;
	aDataArray[3] = type;
	aDataArray[4] = len1;
	for (var i = 0; i < len1; i++) {
		aDataArray[5 + i] = pathdata1[i];
	}
	aDataArray[5 + len1] = len2;
	for (var i = 0; i < len2; i++) {
		aDataArray[6 + len1 + i] = pathdata2[i];
	}


	ws.send(aDataArray.buffer);
}

let sendMsgCombineTwoImageInside = (path1Unicode, path2Unicode, path3Unicode, xoff, yoff) => {
	var path1 = encodeURI(path1Unicode);
	var pathdata1 = stringToByte(path1);
	var len1 = path1.length;

	var path2 = encodeURI(path2Unicode);
	var pathdata2 = stringToByte(path2);
	var len2 = path2.length;

	var path3 = encodeURI(path3Unicode);
	var pathdata3 = stringToByte(path3);
	var len3 = path3.length;

	var aDataArray = new Uint8Array(11 + len1 + len2 + len3);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x86;
	aDataArray[2] = len1 + len2 + len3 + 7;
	aDataArray[3] = xoff / 256;
	aDataArray[4] = xoff % 256;
	aDataArray[5] = yoff / 256;
	aDataArray[6] = yoff % 256;
	aDataArray[7] = len1;
	for (var i = 0; i < len1; i++) {
		aDataArray[8 + i] = pathdata1[i];
	}
	aDataArray[8 + len1] = len2;
	for (var i = 0; i < len2; i++) {
		aDataArray[9 + len1 + i] = pathdata2[i];
	}

	aDataArray[9 + len1 + len2] = len3;
	for (var i = 0; i < len3; i++) {
		aDataArray[10 + len1 + len2 + i] = pathdata3[i];
	}
	ws.send(aDataArray.buffer);
}

let sendMsgCombineTwoImageInsideBase64 = (path1Unicode, path2Unicode, xoff, yoff) => {
	var path1 = encodeURI(path1Unicode);
	var pathdata1 = stringToByte(path1);
	var len1 = path1.length;

	var path2 = encodeURI(path2Unicode);
	var pathdata2 = stringToByte(path2);
	var len2 = path2.length;


	var aDataArray = new Uint8Array(10 + len1 + len2);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x87;
	aDataArray[2] = len1 + len2 + 6;
	aDataArray[3] = xoff / 256;
	aDataArray[4] = xoff % 256;
	aDataArray[5] = yoff / 256;
	aDataArray[6] = yoff % 256;
	aDataArray[7] = len1;
	for (var i = 0; i < len1; i++) {
		aDataArray[8 + i] = pathdata1[i];
	}
	aDataArray[8 + len1] = len2;
	for (var i = 0; i < len2; i++) {
		aDataArray[9 + len1 + i] = pathdata2[i];
	}

	ws.send(aDataArray.buffer);
}

let sendMsgSetAutoExposure = (type) => {
	var aDataArray = new Uint8Array(4);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x2d;
	aDataArray[2] = 0x01;
	aDataArray[3] = type;
	ws.send(aDataArray.buffer);
}

let sendMsgGetExposureRange = () => {
	var aDataArray = new Uint8Array(3);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x31;
	aDataArray[2] = 0x00;
	ws.send(aDataArray.buffer);
}

let sendMsgGetBrightnessRange = () => {
	var aDataArray = new Uint8Array(3);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x2e;
	aDataArray[2] = 0x00;
	ws.send(aDataArray.buffer);
}

let sendMsgSetBrightness = (temp) => {
	var type;
	if (temp < 0) {
		type = 0;
	} else {
		type = 1;
	}
	temp = Math.abs(temp);
	var aDataArray = new Uint8Array(5);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x2f;
	aDataArray[2] = 0x02;
	aDataArray[3] = type;
	aDataArray[4] = temp;
	ws.send(aDataArray.buffer);
}

let sendMsgSetExposure = (temp) => {
	var type;
	if (temp < 0) {
		type = 0;
	} else {
		type = 1;
	}
	temp = Math.abs(temp);
	var aDataArray = new Uint8Array(5);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x33;
	aDataArray[2] = 0x02;
	aDataArray[3] = type;
	aDataArray[4] = temp;
	ws.send(aDataArray.buffer);
}

let sednMsgGetBase64 = (filename) => {
	var path = encodeURI(filename);
	var pathdata = stringToByte(path);
	var len = path.length;
	var aDataArray = new Uint8Array(3 + len);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x35;
	aDataArray[2] = len;
	for (var i = 0; i < len; i++) {
    aDataArray[3 + i] = pathdata[i];
	}
	ws.send(aDataArray.buffer);
}

let sendMsgDeleteFile = (pathUnicode) => {
	var path = encodeURI(pathUnicode);
	var pathdata = stringToByte(path);
	var len = path.length;
	var aDataArray = new Uint8Array(3 + len);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x38;
	aDataArray[2] = len;
	for (var i = 0; i < len; i++) {
		aDataArray[3 + i] = pathdata[i];
	}
	ws.send(aDataArray.buffer);
}

let sendMsgQrcode = (pathUnicode) => {
	var path = encodeURI(pathUnicode);
	var pathdata = stringToByte(path);
	var len = path.length;
	var aDataArray = new Uint8Array(3 + len);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x39;
	aDataArray[2] = len;
	for (var i = 0; i < len; i++) {
		aDataArray[3 + i] = pathdata[i];
	}
	ws.send(aDataArray.buffer);
}

let sendMsgBarcode = (pathUnicode) => {
	var path = encodeURI(pathUnicode);
	var pathdata = stringToByte(path);
	var len = path.length;
	var aDataArray = new Uint8Array(3 + len);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x44;
	aDataArray[2] = len;
	for (var i = 0; i < len; i++) {
		aDataArray[3 + i] = pathdata[i];
	}
	ws.send(aDataArray.buffer);
}

let sendMsgGetMainCameraID = () => {
	var aDataArray = new Uint8Array(4);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x3a;
	aDataArray[2] = 0x01;
	aDataArray[3] = 0x01;
	ws.send(aDataArray.buffer);
}

let sendMsgStartIDCard = () => {
	var aDataArray = new Uint8Array(4);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x3c;
	aDataArray[2] = 0x01;
	aDataArray[3] = 0x00;
	ws.send(aDataArray.buffer);
}

let sendMsgGetOneIC = () => {
	var aDataArray = new Uint8Array(4);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x3c;
	aDataArray[2] = 0x01;
	aDataArray[3] = 0x01;
	ws.send(aDataArray.buffer);
}

let sendMsgGetICValues = (type) => {
	var aDataArray = new Uint8Array(4);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x3d;
	aDataArray[2] = 0x01;
	aDataArray[3] = type;
	ws.send(aDataArray.buffer);
}

let sendMsgRotateL = () => {
	var aDataArray = new Uint8Array(4);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x40;
	aDataArray[2] = 0x01;
	aDataArray[3] = 0;
	ws.send(aDataArray.buffer);
}

let sendMsgRotateR = () => {
	var aDataArray = new Uint8Array(4);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x40;
	aDataArray[2] = 0x01;
	aDataArray[3] = 1;
	ws.send(aDataArray.buffer);
}

let sendMsgBestSize = () => {
	canvasX = 0;
	canvasY = 0;
	var aDataArray = new Uint8Array(4);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x0d;
	aDataArray[2] = 0x01;
	aDataArray[3] = 2;
	ws.send(aDataArray.buffer);
}

let sendMsgTrueSize = () => {
	canvasX = 0;
	canvasY = 0;
	var aDataArray = new Uint8Array(4);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x0d;
	aDataArray[2] = 0x01;
	aDataArray[3] = 3;
	ws.send(aDataArray.buffer);
}


let sendMsgWorkIDCard = () => {
	var aDataArray = new Uint8Array(4);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x41;
	aDataArray[2] = 0x01;
	aDataArray[3] = 0x01;
	ws.send(aDataArray.buffer);
}

let sendMsgStopWorkIDCard = () => {
	var aDataArray = new Uint8Array(4);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x41;
	aDataArray[2] = 0x01;
	aDataArray[3] = 0x00;
	ws.send(aDataArray.buffer);
}

let sendMsgShotBase64 = (type) => {
	var aDataArray = new Uint8Array(4);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x42;
	aDataArray[2] = 0x01;
	aDataArray[3] = type;
	ws.send(aDataArray.buffer);
}

let sendMsgSetJpgQuanlity = (value) => {
	var aDataArray2 = new Uint8Array(4);
	aDataArray2[0] = 0xef;
	aDataArray2[1] = 0x49;
	aDataArray2[2] = 0x01;
	aDataArray2[3] = value;
	ws.send(aDataArray2.buffer);
}

let sendMsgGetICPictureAll = () => {
	var aDataArray = new Uint8Array(3);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x4d;
	aDataArray[2] = 0x00;
	ws.send(aDataArray.buffer);
}

let sendMsgInitFinger = () => {

	var aDataArray = new Uint8Array(3);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x4f;
	aDataArray[2] = 0x00;
	ws.send(aDataArray.buffer);
}

let sendMsgStartFinger = () => {

	var aDataArray = new Uint8Array(4);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x50;
	aDataArray[2] = 0x01;
	aDataArray[3] = 0x01;
	ws.send(aDataArray.buffer);
}

let sendMsgCloseFinger = () => {

	var aDataArray = new Uint8Array(4);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x50;
	aDataArray[2] = 0x01;
	aDataArray[3] = 0x00;
	ws.send(aDataArray.buffer);
}

let sendMsgBeginVideo = (pathUnicode, id, frame) => {
	var path = encodeURI(pathUnicode);
	var pathdata = stringToByte(path);
	var len = path.length;
	var aDataArray = new Uint8Array(6 + len);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x51;
	aDataArray[2] = len + 3;
	aDataArray[3] = id;
	aDataArray[4] = frame;
	aDataArray[5] = len;
	for (var i = 0; i < len; i++) {
		aDataArray[6 + i] = pathdata[i];
	}
	ws.send(aDataArray.buffer);
}

let sendMsgStopVideo = () => {

	var aDataArray = new Uint8Array(3);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x52;
	aDataArray[2] = 0x00;
	ws.send(aDataArray.buffer);
}

let sendMsgBeginVideoSecond = (pathUnicode, id, frame) => {
	var path = encodeURI(pathUnicode);
	var pathdata = stringToByte(path);
	var len = path.length;
	var aDataArray = new Uint8Array(6 + len);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x53;
	aDataArray[2] = len + 3;
	aDataArray[3] = id;
	aDataArray[4] = frame;
	aDataArray[5] = len;
	for (var i = 0; i < len; i++) {
		aDataArray[6 + i] = pathdata[i];
	}
	ws.send(aDataArray.buffer);
}

let sendMsgStopVideoSecond = () => {

	var aDataArray = new Uint8Array(3);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x54;
	aDataArray[2] = 0x00;
	ws.send(aDataArray.buffer);
}

let sendMsgGetAudioName = () => {

	var aDataArray = new Uint8Array(3);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x55;
	aDataArray[2] = 0x00;
	ws.send(aDataArray.buffer);
}

let sednMsgBarQrcode = (type) => {
	var aDataArray = new Uint8Array(4);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x59;
	aDataArray[2] = 0x01;
	aDataArray[3] = type;
	ws.send(aDataArray.buffer);
}

let sendMsgMakeDir = (pathUnicode) => {
	var path = encodeURI(pathUnicode);
	var pathdata = stringToByte(path);
	var len = path.length;
	var aDataArray = new Uint8Array(3 + len);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x5a;
	aDataArray[2] = len;
	for (var i = 0; i < len; i++) {
		aDataArray[3 + i] = pathdata[i];
	}
	ws.send(aDataArray.buffer);
}

let sendMsgAutoFoucs = () => {

	var aDataArray = new Uint8Array(3);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x5b;
	aDataArray[2] = 0x00;
	ws.send(aDataArray.buffer);
	context.clearRect(0, 0, canvas.width, canvas.height);
}

let sednMsgFaceCheckInit = () => {
	var aDataArray = new Uint8Array(3);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x5c;
	aDataArray[2] = 0x00;
	ws.send(aDataArray.buffer);
}

let sednMsgFaceCheckUninit = () => {
	isFaceOpen = false;
	var aDataArray = new Uint8Array(3);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x5d;
	aDataArray[2] = 0x00;
	ws.send(aDataArray.buffer);
}

let sednMsgStartFaceCheck = () => {
	var aDataArray = new Uint8Array(3);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x5e;
	aDataArray[2] = 0x00;
	ws.send(aDataArray.buffer);
}

let sednMsgStopFaceCheck = () => {
	var aDataArray = new Uint8Array(3);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x61;
	aDataArray[2] = 0x00;
	ws.send(aDataArray.buffer);
}

let sednMsgFaceCheckInitSecond = () => {
	var aDataArray = new Uint8Array(3);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x63;
	aDataArray[2] = 0x00;
	ws.send(aDataArray.buffer);
}

let sednMsgFaceCheckUninitSecond = () => {
	isFaceOpenSecond = false;
	var aDataArray = new Uint8Array(3);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x64;
	aDataArray[2] = 0x00;
	ws.send(aDataArray.buffer);
}

let sednMsgStartFaceCheckSecond = () => {
	var aDataArray = new Uint8Array(3);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x65;
	aDataArray[2] = 0x00;
	ws.send(aDataArray.buffer);
}

let sednMsgStopFaceCheckSecond = () => {
	var aDataArray = new Uint8Array(3);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x66;
	aDataArray[2] = 0x00;
	ws.send(aDataArray.buffer);
}

let sednMsgBankCardFun = (type) => {
	var aDataArray = new Uint8Array(4);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x6b;
	aDataArray[2] = 0x01;
	aDataArray[3] = type;
	ws.send(aDataArray.buffer);
}

let sendMsgInitFingerFunOrCloase = (type) => {
	var aDataArray = new Uint8Array(4);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x6c;
	aDataArray[2] = 0x01;
	aDataArray[3] = type;
	ws.send(aDataArray.buffer);
}

let sendMsgRegisterFinger = () => {
	var aDataArray = new Uint8Array(3);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x6d;
	aDataArray[2] = 0x00;
	ws.send(aDataArray.buffer);
}

let sednMsgStopRegisterFinger = () => {
	var aDataArray = new Uint8Array(3);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x6e;
	aDataArray[2] = 0x00;
	ws.send(aDataArray.buffer);
}

let sendMsgVerifyFinger = (pathUnicode) => {
	var path = encodeURI(pathUnicode);
	var pathdata = stringToByte(path);
	var len = path.length;
	var aDataArray = new Uint8Array(3 + len);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x6f;
	aDataArray[2] = len;
	for (var i = 0; i < len; i++) {
		aDataArray[3 + i] = pathdata[i];
	}
	ws.send(aDataArray.buffer);
}

let sednMsgStopVerifyFinger = () => {
	var aDataArray = new Uint8Array(3);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x70;
	aDataArray[2] = 0x00;
	ws.send(aDataArray.buffer);
}

let sednMsgQFaceStratDoubleOrClose = (type) => {
	var aDataArray = new Uint8Array(4);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x74;
	aDataArray[2] = 0x01;
	aDataArray[3] = type;
	ws.send(aDataArray.buffer);
}

let sednMsgFaceCheckInitDouble = () => {
	var aDataArray = new Uint8Array(3);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x75;
	aDataArray[2] = 0x00;
	ws.send(aDataArray.buffer);
}

let sendMsgSetDpi = (x, y) => {
	var aDataArray = new Uint8Array(7);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x76;
	aDataArray[2] = 0x04;
	aDataArray[3] = x / 256;
	aDataArray[4] = x % 256;
	aDataArray[5] = y / 256;
	aDataArray[6] = y % 256;
	ws.send(aDataArray.buffer);
}

let sednMsgReleaseAll = () => {
	var aDataArray = new Uint8Array(3);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x77;
	aDataArray[2] = 0x00;
	ws.send(aDataArray.buffer);
}

let sendMsgFaceCheck = (type) => {
	if (type == 0) {
		isFaceOpen = false;
	}
	var aDataArray2 = new Uint8Array(4);
	aDataArray2[0] = 0xef;
	aDataArray2[1] = 0x78;
	aDataArray2[2] = 0x01;
	aDataArray2[3] = type;
	ws.send(aDataArray2.buffer);
}

let sendMsgCaptureFace = () => {
	var aDataArray = new Uint8Array(3);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x79;
	aDataArray[2] = 0x00;
	ws.send(aDataArray.buffer);
}

let sendMsgFaceCheckSecond = (type) => {
	if (type == 0) {
		isFaceOpenSecond = false;
	}
	var aDataArray2 = new Uint8Array(4);
	aDataArray2[0] = 0xef;
	aDataArray2[1] = 0x7a;
	aDataArray2[2] = 0x01;
	aDataArray2[3] = type;
	ws.send(aDataArray2.buffer);
}

let sendMsgCaptureFaceSecond = () => {
	var aDataArray = new Uint8Array(3);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x7b;
	aDataArray[2] = 0x00;
	ws.send(aDataArray.buffer);
}

let sendMsgGetFinger = (type) => {
	var aDataArray2 = new Uint8Array(4);
	aDataArray2[0] = 0xef;
	aDataArray2[1] = 0x7f;
	aDataArray2[2] = 0x01;
	aDataArray2[3] = type;
	ws.send(aDataArray2.buffer);
}

let sendMsgVerifyFingerBase64 = (datalen, pathUnicode) => {
	var path = encodeURI(pathUnicode);
	var pathdata = stringToByte(path);
	var len = path.length;
	var aDataArray = new Uint8Array(7 + len);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x81;
	aDataArray[2] = 0x00;
	aDataArray[3] = datalen / 256;
	aDataArray[4] = datalen % 256;
	aDataArray[5] = len / 256;
	aDataArray[6] = len % 256;
	for (var i = 0; i < len; i++) {
		aDataArray[7 + i] = pathdata[i];
	}
	ws.send(aDataArray.buffer);
}

let sendMsgAddFingerBase64 = (datalen, pathUnicode) => {
	var path = encodeURI(pathUnicode);
	var pathdata = stringToByte(path);
	var len = path.length;
	var aDataArray = new Uint8Array(7 + len);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x94;
	aDataArray[2] = 0x00;
	aDataArray[3] = datalen / 256;
	aDataArray[4] = datalen % 256;
	aDataArray[5] = len / 256;
	aDataArray[6] = len % 256;
	for (var i = 0; i < len; i++) {
		aDataArray[7 + i] = pathdata[i];
	}
	ws.send(aDataArray.buffer);
}

let sendMsgClearAllFingerBase64 = () => {
	var aDataArray = new Uint8Array(3);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x95;
	aDataArray[2] = 0x00;
	ws.send(aDataArray.buffer);
}


let sendMsgVerifyFingerAllBase64 = () => {
	var aDataArray = new Uint8Array(3);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x96;
	aDataArray[2] = 0x00;
	ws.send(aDataArray.buffer);
}

let sendMsgCheckCamDev = () => {
	var aDataArray = new Uint8Array(3);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x89;
	aDataArray[2] = 0x00;
	ws.send(aDataArray.buffer);
}

let sendMsgSetFoucs = (value) => {
	var aDataArray = new Uint8Array(5);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0x8c;
	aDataArray[2] = 0x02;
	aDataArray[3] = value / 256;
	aDataArray[4] = value % 256;
	ws.send(aDataArray.buffer);
}

let sendMsgSetDebugModel = () => {
	var aDataArray = new Uint8Array(3);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0xa3;
	aDataArray[2] = 0x00;
	ws.send(aDataArray.buffer);
}

let sendMsgGetALLVidPid = () => {
	var aDataArray = new Uint8Array(3);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0xa7;
	aDataArray[2] = 0x00;
	ws.send(aDataArray.buffer);
}

let sendMsgSetFaceCheckImg = (pathUnicode) => {
	var path = encodeURI(pathUnicode);
	var pathdata = stringToByte(path);
	var len = path.length;
	var aDataArray = new Uint8Array(3 + len);
	aDataArray[0] = 0xef;
	aDataArray[1] = 0xa8;
	aDataArray[2] = len;
	for (var i = 0; i < len; i++) {
		aDataArray[3 + i] = pathdata[i];
	}
	ws.send(aDataArray.buffer);
}




let GetFaceZuobiao = (Xdis, Ydis) => {
	if (isFaceOpen) {
		for (var j = 0; j < faceNum; j++) {
			for (var i = 0; i < 3; i++) {

				context.moveTo(faceZuobiao[2 * i + j * 8] + Xdis, faceZuobiao[2 * i + j * 8 + 1] + Ydis);
				context.lineTo(faceZuobiao[2 * i + j * 8 + 2] + Xdis, faceZuobiao[2 * i + j * 8 + 3] + Ydis);
				context.stroke();
			}

			context.moveTo(faceZuobiao[6 * i + j * 8] + Xdis, faceZuobiao[6 * i + j * 8 + 1] + Ydis);
			context.lineTo(faceZuobiao[0 + j * 8] + Xdis, faceZuobiao[1 + j * 8] + Ydis);
			context.stroke();
		}
	}
}

let GetFaceZuobiaoSecond = (Xdis, Ydis) => {
	if (isFaceOpenSecond) {
		contextSecond.beginPath();
		contextSecond.strokeStyle = "rgb(0,255,0)";
		contextSecond.lineWidth = 2;
		for (var j = 0; j < faceNumSecond; j++) {
			for (var i = 0; i < 3; i++) {

				contextSecond.moveTo(faceZuobiaoSecond[2 * i + j * 8] + Xdis, faceZuobiaoSecond[2 * i + j * 8 + 1] + Ydis);
				contextSecond.lineTo(faceZuobiaoSecond[2 * i + j * 8 + 2] + Xdis, faceZuobiaoSecond[2 * i + j * 8 + 3] + Ydis);
				contextSecond.stroke();
			}

			contextSecond.moveTo(faceZuobiaoSecond[6 * i + j * 8] + Xdis, faceZuobiaoSecond[6 * i + j * 8 + 1] + Ydis);
			contextSecond.lineTo(faceZuobiaoSecond[0 + j * 8] + Xdis, faceZuobiaoSecond[1 + j * 8] + Ydis);
			contextSecond.stroke();
		}
	}
}





let SetCusCropPlaceWs = (cutX, cutY, cutW, cutH) => {

	var bpp = rec_ww / imgOrignalW;
	if (rorateAngleType == 1 || rorateAngleType == 3) {
		bpp = rec_ww / imgOrignalH;
	}
	recX_manual = cutX * bpp + (canvas.width / 2 - rec_ww / 2);
	recY_manual = cutY * bpp + (canvas.height / 2 - rec_hh / 2);
	recW_manual = cutW * bpp;
	recH_manual = cutH * bpp;
	cutXCaibian = cutW;
	cutYCaibian = cutH;


}

let SetCusCropPlaceWs2 = (cutX, cutY, cutW, cutH) => {

	var bpp = rec_ww2 / imgOrignalW2;
	recX_manual2 = cutX * bpp + (canvasSecond.width / 2 - rec_ww2 / 2);
	recY_manual2 = cutY * bpp + (canvasSecond.height / 2 - rec_hh2 / 2);
	recW_manual2 = cutW * bpp;
	recH_manual2 = cutH * bpp;
	cutXCaibian2 = cutW;
	cutYCaibian2 = cutH;


}



//手动裁边时的长方形
let refreshRect = () => {
	context.beginPath();
	context.rect(recX_manual, recY_manual, recW_manual, recH_manual);
	context.lineWidth = 2;
	context.strokeStyle = "#0000ff";
	context.stroke();
}

let refreshRect2 = () => {
	contextSecond.beginPath();
	contextSecond.rect(recX_manual2, recY_manual2, recW_manual2, recH_manual2);
	contextSecond.lineWidth = 2;
	contextSecond.strokeStyle = "#0000ff";
	contextSecond.stroke();
}

let stringToByte = (str) => {
	var bytes = new Array();
	var len, c;
	len = str.length;
	for (var i = 0; i < len; i++) {
		c = str.charCodeAt(i);
		if (c >= 0x010000 && c <= 0x10FFFF) {
			bytes.push(((c >> 18) & 0x07) | 0xF0);
			bytes.push(((c >> 12) & 0x3F) | 0x80);
			bytes.push(((c >> 6) & 0x3F) | 0x80);
			bytes.push((c & 0x3F) | 0x80);
		} else if (c >= 0x000800 && c <= 0x00FFFF) {
			bytes.push(((c >> 12) & 0x0F) | 0xE0);
			bytes.push(((c >> 6) & 0x3F) | 0x80);
			bytes.push((c & 0x3F) | 0x80);
		} else if (c >= 0x000080 && c <= 0x0007FF) {
			bytes.push(((c >> 6) & 0x1F) | 0xC0);
			bytes.push((c & 0x3F) | 0x80);
		} else {
			bytes.push(c & 0xFF);
		}
	}
	return bytes;
}

let byteToString = (arr) => {
	if (typeof arr === 'string') {
		return arr;
	}
	var str = '',
		_arr = arr;
	for (var i = 0; i < _arr.length; i++) {
		var one = _arr[i].toString(2),
			v = one.match(/^1+?(?=0)/);
		if (v && one.length == 8) {
			var bytesLength = v[0].length;
			var store = _arr[i].toString(2).slice(7 - bytesLength);
			for (var st = 1; st < bytesLength; st++) {
				store += _arr[st + i].toString(2).slice(2);
			}
			str += String.fromCharCode(parseInt(store, 2));
			i += bytesLength - 1;
		} else {
			str += String.fromCharCode(_arr[i]);
		}
	}
	return str;
}

let base64Encode = (input) => {
	var rv;
	rv = encodeURIComponent(input);
	rv = unescape(rv);
	rv = window.btoa(rv);
	return rv;
}

let isIeFunction = () => {
	if (!!window.ActiveXObject || "ActiveXObject" in window)
		return true;
	else
		return false;
}

// --------------------------------






let base64decode = (str) => {
	var c1, c2, c3, c4;
	var i, len, out;

	len = str.length;
	i = 0;
	out = "";
	while (i < len) {
		/* c1 */
		do {
			c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
		} while (i < len && c1 == -1);
		if (c1 == -1)
			break;

		/* c2 */
		do {
			c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
		} while (i < len && c2 == -1);
		if (c2 == -1)
			break;

		out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

		/* c3 */
		do {
			c3 = str.charCodeAt(i++) & 0xff;
			if (c3 == 61)
				return out;
			c3 = base64DecodeChars[c3];
		} while (i < len && c3 == -1);
		if (c3 == -1)
			break;

		out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

		/* c4 */
		do {
			c4 = str.charCodeAt(i++) & 0xff;
			if (c4 == 61)
				return out;
			c4 = base64DecodeChars[c4];
		} while (i < len && c4 == -1);
		if (c4 == -1)
			break;
		out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
	}
	return out;
}

let getBlobBydataURI = (dataURI, type) => {
	//var binary = atob(dataURI.split(',')[1]);  
	var binary = base64decode(dataURI);
	var array = [];
	for (var i = 0; i < binary.length; i++) {
		array.push(binary.charCodeAt(i));
	}
	return new Blob([new Uint8Array(array)], { type: type });
}

let OcxInit = () => {
	var strUsbNamr = new Array();
	var numCam = axCam_Ocx.GetDevCount();
	for (var i = 0; i < numCam; i++) {
		strUsbNamr[i] = axCam_Ocx.GetDevFriendName(i);
	}
	camidMain = axCam_Ocx.GetMainCameraID(1);
	camidSub = axCam_Ocx.GetSecondCameraID();
	GetDevName(numCam, strUsbNamr);

	var FormatSum = axCam_Ocx.GetFormatCount(camidMain);
	switch (FormatSum) {
		case 1:   //（设备只支持MJPG格式）
			OpenFormat = 1;     //打开格式为MJPG
			SupportFormat = 1;
			break;
		case 2:   //（设备只支持YUY2格式）
			OpenFormat = 0;     //打开格式为YUY
			SupportFormat = 2;
			break;
		case 3:   //（设备支持MJPG与YUY2两种格式）
			OpenFormat = 1;     //默认打开格式为MJPG
			SupportFormat = 1;
			break;

	}

	OcxGetDeviceResolution();
}

//获取分辨率
let OcxGetDeviceResolution = () => {
	var resCount = axCam_Ocx.GetResolutionCount(camidMain, SupportFormat);
	var dataResolution = new Array();
	var num = 0;
	for (var i = 0; i < resCount; i++) {
		var restr = axCam_Ocx.GetResolution(i);
		var pos = restr.lastIndexOf("*");
		var width = parseInt(restr.substring(0, pos));
		var height = parseInt(restr.substring(pos + 1, restr.length));
		dataResolution[num] = width;
		num++;
		dataResolution[num] = height;
		num++;
	}
	GetDeviceResolution(dataResolution);
}

let OcxGetDeviceResolutionSecond = () => {
	if (isIE) {
		//camidSub = axCam_Ocx.GetSecondCameraID();
		if (camidSub >= 0) {
			var FormatSum = axCam_Ocx2.GetFormatCount(camidSub);
			switch (FormatSum) {
				case 1:   //（设备只支持MJPG格式）
					OpenFormat2 = 1;     //打开格式为MJPG
					SupportFormat2 = 1;
					break;
				case 2:   //（设备只支持YUY2格式）
					OpenFormat2 = 0;     //打开格式为YUY
					SupportFormat2 = 2;
					break;
				case 3:   //（设备支持MJPG与YUY2两种格式）
					OpenFormat2 = 1;     //默认打开格式为MJPG
					SupportFormat2 = 1;
					break;

			}

			var resCount = axCam_Ocx2.GetResolutionCount(camidSub, SupportFormat2);
			var dataResolution = new Array();
			var num = 0;
			for (var i = 0; i < resCount; i++) {
				var restr = axCam_Ocx2.GetResolution(i);
				var pos = restr.lastIndexOf("*");
				var width = parseInt(restr.substring(0, pos));
				var height = parseInt(restr.substring(pos + 1, restr.length));
				dataResolution[num] = width;
				num++;
				dataResolution[num] = height;
				num++;
			}
			GetDeviceResolutionSecond(dataResolution);
		}

	} else {
		sendMsgGetResolutionSecond(camidSub);
	}
}

//
let StartCam = (CamID, width, height) => {
	if (isIE) {
		var i = axCam_Ocx.CAM_Open(CamID, OpenFormat, width, height);
		if (i == 0) InfoCallback(0x00);
		else if (i == -1) InfoCallback(0x16);
		else InfoCallback(0x02);
	} else {
		sendMsgStartVideo(CamID, width, height);
	}
}

let StartCamYUV = (CamID, width, height) => {
	if (isIE) {
		var i = axCam_Ocx.CAM_Open(CamID, 0, width, height);
		if (i == 0) InfoCallback(0x00);
		else if (i == -1) InfoCallback(0x16);
		else InfoCallback(0x02);
	} else {
		sendMsgStartVideoYUV(CamID, width, height);
	}
}

let StartCam2 = (CamID, width, height) => {
	if (isIE) {
		var i = axCam_Ocx2.CAM_Open(CamID, OpenFormat2, width, height);
		if (i == 0) InfoCallback(0x00);
		else if (i == -1) InfoCallback(0x16);
		else InfoCallback(0x02);
	} else {
		sendMsgStartVideo2(CamID, width, height);
	}
}

let StartCam2YUV = (CamID, width, height) => {
	if (isIE) {
		var i = axCam_Ocx2.CAM_Open(CamID, 0, width, height);
		if (i == 0) InfoCallback(0x00);
		else if (i == -1) InfoCallback(0x16);
		else InfoCallback(0x02);
	} else {
		sendMsgStartVideo2YUV(CamID, width, height);
	}
}

let CloseCam = () => {
	if (isIE) {
		axCam_Ocx.CAM_Close();
		InfoCallback(0x01);
	} else sendMsgCloseVideo();
}

let CloseCam2 = () => {
	if (isSecondDev) {
		if (isIE) {
			axCam_Ocx2.CAM_Close();
			InfoCallback(0x01);
		} else sendMsgCloseVideoSecond();
	}
}

let CaptureImage = (type) => {
	if (isIE) {
		axCam_Ocx.CaptureImage();
	} else {
		sendMsgCapture(type);
	}
}

let CaptureImage2 = (type) => {
	if (isIE) {
		axCam_Ocx2.CaptureImage();
	} else {
		if (type != 2) {
			sendMsgCaptureSecond();
		} else sendMsgCaptureSecondCaibian();
	}
}

let ChangeCamDevice = (CamID) => {

	if (isIE) {
		var FormatSum = axCam_Ocx.GetFormatCount(CamID);
		switch (FormatSum) {
			case 1:   //（设备只支持MJPG格式）
				OpenFormat = 1;     //打开格式为MJPG
				SupportFormat = 1;
				break;
			case 2:   //（设备只支持YUY2格式）
				OpenFormat = 0;     //打开格式为YUY
				SupportFormat = 2;
				break;
			case 3:   //（设备支持MJPG与YUY2两种格式）
				OpenFormat = 1;     //默认打开格式为MJPG
				SupportFormat = 1;
				break;

		}
		OcxGetDeviceResolution();
	} else {
		sendMsgGetResolution(CamID);
	}
}

let ChangeCamDevice2 = (CamID) => {

	if (isIE) {
		var FormatSum = axCam_Ocx2.GetFormatCount(CamID);
		switch (FormatSum) {
			case 1:   //（设备只支持MJPG格式）
				OpenFormat = 1;     //打开格式为MJPG
				SupportFormat = 1;
				break;
			case 2:   //（设备只支持YUY2格式）
				OpenFormat = 0;     //打开格式为YUY
				SupportFormat = 2;
				break;
			case 3:   //（设备支持MJPG与YUY2两种格式）
				OpenFormat = 1;     //默认打开格式为MJPG
				SupportFormat = 1;
				break;

		}
		OcxGetDeviceResolutionSecond();
	} else {
		sendMsgGetResolutionSecond(CamID);
	}
}

let SetColorMode = (type) => {
	if (isIE) {
		axCam_Ocx.SetImageColorMode(type);
	} else {
		sendMsgSetImageColorMode(type);
	}
}

let ShowSettingWindow = () => {
	if (isIE) {
		axCam_Ocx.ShowImageSettingWindow();
	} else {
		sendMsgShowImageSettingWindow();
	}
}

let SetCamCutType = (type) => {
	if (isIE) {
		if (type == 2) {
			axCam_Ocx.CusCrop(1);
		} else axCam_Ocx.SetAutoCut(type);
	} else sendMsgSetCutType(type);

}

let SetCamCutType2 = (type) => {
	if (isIE) {
		if (type == 2) {
			axCam_Ocx2.CusCrop(1);
		} else axCam_Ocx2.SetAutoCut(0);
	}

}

let SetImageType = (type) => {
	if (isIE) {
		axCam_Ocx.SetFileType(type);
	} else {
		if (type > 2) type++;
		sendMsgSetFileType(type);
	}
}

//放大
let ZoomOut = () => {
	if (isIE) {
		axCam_Ocx.CAM_ZoomOut();
	} else sendMsgZoom(1);
}

//缩小
let ZoomIn = () => {
	if (isIE) {
		axCam_Ocx.CAM_ZoomIn();
	} sendMsgZoom(0);
}

//左旋
let RoateL = () => {
	if (isIE) {
		axCam_Ocx.CAM_RotateL();
	} else sendMsgRotateL();

}

//右旋
let RoateR = () => {
	if (isIE) {
		axCam_Ocx.CAM_RotateR();
	} else sendMsgRotateR();
}

//适合大小
let BestSize = () => {
	if (isIE) {
		axCam_Ocx.BestSize();
	} else {
		sendMsgBestSize();
	}
}

//实际大小
let TrueSize = () => {
	if (isIE) {
		axCam_Ocx.TrueSize();
	} else {
		sendMsgTrueSize();
	}
}

let SetWiseCapture = (type) => {
	if (isIE) {
		axCam_Ocx.WiseCapture(type);

	} else {
		sendMsgSetConntinousShotModel(type);
	}
}

let SetTimeCapture = (type, time) => {
	if (isIE) {
		axCam_Ocx.TimeCapture(type, time);
	} else {
		time = time / 10;
		sendMsgSetConntinousShotModelTime(time);
	}
}

let SetImagePath = (path) => {
	if (isIE) {
		var ret = axCam_Ocx.setFilePath(path);
		if (ret == 0) {
			InfoTextCallback(1, path);
		} else InfoCallback(0xae);
	} else {
		sendMsgSetFilePath(path);
	}
}

let SetImagePath2 = (path) => {
	if (isIE) {
		var ret = axCam_Ocx2.setFilePath(path);
		if (ret == 0) {
			InfoTextCallback(1, path);
		} else InfoCallback(0xae);
	}
}

let RefreshDevice = () => {
	if (isIE) {
		OcxInit();
	} else {

		sendMsgRefreshDev();
	}
}

let SetImagebase64 = (type) => {
	if (isIE) {
		axCam_Ocx.IsImageBase64(type);
		if (isSecondDev) {
			axCam_Ocx2.IsImageBase64(type);
		}
	} else {
		sendMsgShotBase64(type);
	}
}

let StartIC = () => {
	if (isIE) {
		axCam_Ocx.StartIDCard();
		InfoCallback(0x19);
	} else {
		sendMsgStartIDCard();
	}
}

let StartICWork = () => {
	if (isIE) {
		var ret = axCam_Ocx.WorkIDCard(1);
		if (ret == 0) {
			InfoCallback(0x20);
		} else if (ret == -2) {
			InfoCallback(0x1f);
		} else if (ret == -3) {
			InfoCallback(0x1e);
		}
	} else {
		sendMsgWorkIDCard();
	}
}

let StopICWork = () => {
	if (isIE) {
		var ret = axCam_Ocx.WorkIDCard(0);
		if (ret == 0) {
			InfoCallback(0x21);
		} else if (ret == -2) {
			InfoCallback(0x1f);
		} else if (ret == -3) {
			InfoCallback(0x1e);
		}
	} else {
		sendMsgStopWorkIDCard();
	}
}

let GetOneIC = () => {
	if (isIE) {
		var ret = axCam_Ocx.GetOneIC();
		if (ret == 0) {
			InfoCallback(0x1b);
		} else if (ret == -1) {
			InfoCallback(0x1d);
		} else if (ret == -2) {
			InfoCallback(0x1c);
		} else if (ret == -3) {
			InfoCallback(0x1e);
		} else if (ret == -4) {
			InfoCallback(0x1f);
		}
	} else {
		sendMsgGetOneIC();
	}
}

let GetICValues = () => {
	if (isIE) {
		var name = axCam_Ocx.GetICValues("NAME");
		if (name.length > 0) {
			InfoTextCallback(9, name);

			var IC = axCam_Ocx.GetICValues("IC");
			InfoTextCallback(10, IC);

			var SEX = axCam_Ocx.GetICValues("SEX");
			InfoTextCallback(11, SEX);

			var NATION = axCam_Ocx.GetICValues("NATION");
			InfoTextCallback(12, NATION);

			var BIRTHDAY = axCam_Ocx.GetICValues("BIRTHDAY");
			InfoTextCallback(13, BIRTHDAY);

			var ADDRESS = axCam_Ocx.GetICValues("ADDRESS");
			InfoTextCallback(14, ADDRESS);

			var SIGNDEPT = axCam_Ocx.GetICValues("SIGNDEPT");
			InfoTextCallback(15, SIGNDEPT);

			var VALIDSTARTDATE = axCam_Ocx.GetICValues("VALIDSTARTDATE");
			InfoTextCallback(16, VALIDSTARTDATE);

			var VALIDENDDATE = axCam_Ocx.GetICValues("VALIDENDDATE");
			InfoTextCallback(17, VALIDENDDATE);

			var SAMID = axCam_Ocx.GetICValues("SAMID");
			InfoTextCallback(18, SAMID);


			var picBase64 = axCam_Ocx.GetICPicture();
			InfoTextCallback(19, picBase64);
		}

	} else {
		for (var i = 0; i < 11; i++) {
			sendMsgGetICValues(i);
		}
	}
}

let ReadBarCode = (imgPath) => {
	if (isIE) {
		var CodeStr = axCam_Ocx.GetBarcodeContent(imgPath);
		if (CodeStr.length > 0) {
			InfoTextCallback(2, CodeStr);
		} else {
			InfoCallback(0xab);
		}
	} else {
		sendMsgBarcode(imgPath);
	}

}

let ReadQrCode = (imgPath) => {
	if (isIE) {
		var CodeStr = axCam_Ocx.GetQRcodeContent(imgPath);
		InfoTextCallback(7, CodeStr);
	} else {
		sendMsgQrcode(imgPath);
	}
}

let AddPDFImageFile = (imgPath) => {
	if (isIE) {
		var ret = axCam_Ocx.AddPDFImageFile(imgPath, "", 0);
		if (ret == 0) {
			InfoCallback(0x05);
		} else if (ret == -1) {
			InfoCallback(0xa5);
		}
	} else {
		sednMsgAddPDF(imgPath);
	}
}

let SavePDF = (path) => {
	if (isIE) {
		var ret = axCam_Ocx.Convert2PDF(path);
		if (ret == 0) {
			InfoCallback(0x06);
		} else if (ret == -1) {
			InfoCallback(0xa1);
		}
	} else {
		sednMsgSavePDF(path);
	}
}

let AddTIFImageFile = (imgPath) => {
	if (isIE) {
		var ret = axCam_Ocx.AddTIFImageFile(imgPath);
		if (ret == 0) {
			InfoCallback(0x05);
		} else if (ret == -1) {
			InfoCallback(0xa5);
		}
	} else {
		sednMsgAddTIF(imgPath);
	}
}

let SaveTIF = (path) => {
	if (isIE) {
		var ret = axCam_Ocx.Convert2TIF(path);
		if (ret == 0) {
			InfoCallback(0x06);
		} else if (ret == -1) {
			InfoCallback(0xa1);
		}
	} else {
		sednMsgSaveTIF(path);
	}
}

let ClearTIF = () => {
	if (isIE) {
		axCam_Ocx.ClearTIF();
	} else {
		sednMsgClearTIF();
	}
}



let CombineTwoImage = (combinePath, ImgPath1, ImgPath2, dir) => {
	if (isIE) {
		var ret = axCam_Ocx.CombineTwoImage(combinePath, ImgPath1, ImgPath2, dir);
		if (ret == 0) {
			InfoCallback(0x07);
		} else {
			InfoCallback(0xad);
		}
	} else {
		if (dir != 1) dir = 0;
		sendMsgCombineTwoImage(ImgPath1, ImgPath2, combinePath, dir);
	}
}

let CombineTwoImageBase64 = (ImgPath1, ImgPath2, dir) => {
	if (isIE) {
		var ret = axCam_Ocx.CombineTwoImageBase64(ImgPath1, ImgPath2, dir);
		if (ret.length > 0) {
			InfoTextCallback(5, ret);
		} else {
			InfoCallback(0xad);
		}
	} else {
		if (dir != 1) dir = 0;
		sendMsgCombineTwoImageBase64(ImgPath1, ImgPath2, dir);
	}
}

let CombineTwoImageInside = (combinePath, ImgPath1, ImgPath2, xoff, yoff) => {
	if (isIE) {
		var ret = axCam_Ocx.CombineTwoImageInside(combinePath, ImgPath1, ImgPath2, xoff, yoff);
		if (ret == 0) {
			InfoCallback(0x07);
		} else {
			InfoCallback(0xad);
		}
	} else {
		sendMsgCombineTwoImageInside(ImgPath1, ImgPath2, combinePath, xoff, yoff);
	}
}

let CombineTwoImageInsideBase64 = (ImgPath1, ImgPath2, xoff, yoff) => {
	if (isIE) {
		var ret = axCam_Ocx.CombineTwoImageInsideBase64(ImgPath1, ImgPath2, xoff, yoff);
		if (ret.length > 0) {
			InfoTextCallback(5, ret);
		} else {
			InfoCallback(0xad);
		}
	} else {
		sendMsgCombineTwoImageInsideBase64(ImgPath1, ImgPath2, xoff, yoff);
	}
}

let UpdataFile = (ip, port, method, imgPath) => {
	if (isIE) {
		var ret = axCam_Ocx.UpdataFile(ip, port, method, imgPath);
		if (ret == 0) {
			InfoCallback(0x12);
		} else {
			InfoCallback(0xa9);
		}
	} else {
		sendMsgUploadFilePort(port, ip, method, imgPath);
	}
}

let GetBase64FromFile = (path) => {
  _this.imgPath = path
	if (isIE) {
		var basestr = axCam_Ocx.GetBase64FromFile(path);
		InfoTextCallback(5, basestr);
	} else {
		sednMsgGetBase64(path);
	}
}

let CloseWaterMark = () => {
	if (isIE) {
		axCam_Ocx.SetAddMark(0);
	} else {
		sednMsgWaterMarkClose();
	}
}

let OpenWaterMark = (waterinfo, FontSize, FontSytle, r, g, b, xOff, yOff) => {
	if (isIE) {
		axCam_Ocx.SetAddMark(1);
		axCam_Ocx.SetWaterMark(waterinfo, FontSize, FontSytle, r, g, b, xOff, yOff);
	} else {
		sednMsgWaterMarkOpen(waterinfo, FontSize, FontSytle, r, g, b, xOff, yOff);
	}
}

let SetJiubianModel = (type) => {
	if (isIE) {
		axCam_Ocx.setJiubianModel(type);
	} else {
		sendMsgSetJiubianModel(type);
	}
}

let SetBuBai = (type) => {
	if (isIE) {
		axCam_Ocx.setBuBai(type);
	} else {
		sednMsgBubaiType(type);
	}
}

let SetQudise = (type) => {
	if (isIE) {
		axCam_Ocx.setQudise(type);
	} else {
		sednMsgQuqudiseType(type);
	}
}

let SetFileNameCustom = (str, index) => {

	if (isIE) {
		axCam_Ocx.setFileNameCustom(str, index);
	} else {
		sendMsgSetFileNameModelCustom(index, str);
	}

}

let SetFileNameCustom2 = (str, index) => {

	if (isIE) {
		axCam_Ocx2.setFileNameCustom(str, index);
	} else {
		sendMsgSetFileNameModelCustomSecond(index, str);
	}

}

let SetFileNameFixed = (str) => {
	if (isIE) {
		axCam_Ocx.setFileNameFixed(str);
	} else {
		sendMsgSetFileNameModelFixed(str);
	}

}

let SetFileNameFixed2 = (str) => {
	if (isIE) {
		axCam_Ocx2.setFileNameFixed(str);
	} else {
		sendMsgSetFileNameModelFixedSecond(str);
	}

}

let SetFileNameTime = () => {
	if (isIE) {
		axCam_Ocx.setFileNameTime();
	} else {
		sendMsgSetFileNameModelTime();
	}
}

let SetFileNameTime2 = () => {
	if (isIE) {
		axCam_Ocx2.setFileNameTime();
	} else {
		sendMsgSetFileNameModelTimeSecond();
	}
}

let SetAutoExposure = (type) => {

	if (isIE) {
		axCam_Ocx.SetAutoExposure(type);
		if (type == 1) {
			InfoCallback(0x17);

		} else if (type == 0) {
			InfoCallback(0x18);
		}
	} else {
		sendMsgSetAutoExposure(type);
	}

}

let GetCamParameter = () => {
	if (isIE) {
		var brightnessValue = axCam_Ocx.GetBrightnessRange();
		InfoTextCallback(23, brightnessValue);
		var exposureValue = axCam_Ocx.GetExposureRange();
		InfoTextCallback(22, exposureValue);

	} else {
		sendMsgGetExposureRange();
		sendMsgGetBrightnessRange();

	}
}

let SetExposure = (value) => {
	if (isIE) {
		axCam_Ocx.SetExposure(value);
	} else {
		sendMsgSetExposure(value);
	}

}

let SetBrightness = (value) => {
	if (isIE) {
		axCam_Ocx.SetBrightness(value)
	} else {
		sendMsgSetBrightness(value);
	}

}

let GetCamNum = () => {
	if (isIE) {
		var num = axCam_Ocx.GetDevCount();
		//GetDevCount(num);
		InfoTextCallback(26, num);
	} else {
		sendMsgGetCamNum();
	}
}

let DeleteFile = (path) => {
	if (isIE) {
		var ret = axCam_Ocx.DeleteFileImage(path);
		if (ret == 1) {
			InfoTextCallback(6, path);
		} else {
			InfoCallback(0xa2);

		}
	} else {
		sendMsgDeleteFile(path);
	}
}

let SetJpgQuanlity = (value) => {
	if (isIE) {
		axCam_Ocx.SetJpgQuanlity(value);
	} else {
		sendMsgSetJpgQuanlity(value);
	}
}

let SetJpgQuanlity2 = (value) => {
	if (isIE) {
		axCam_Ocx2.SetJpgQuanlity(value);
	} else {

	}
}

let SetCusCropPlace = (cutX, cutY, cutW, cutH) => {
	if (isIE) {
		axCam_Ocx.SetCusCropPlace(cutX, cutY, cutW, cutH);
	} else {
		SetCusCropPlaceWs(cutX, cutY, cutW, cutH);
	}

}

let SetCusCropPlace2 = (cutX, cutY, cutW, cutH) => {
	if (isIE) {
		axCam_Ocx2.SetCusCropPlace(cutX, cutY, cutW, cutH);
	} else {
		SetCusCropPlaceWs2(cutX, cutY, cutW, cutH);
	}

}

let GetICPictureAll = () => {
	if (isIE) {
		var picBase64 = axCam_Ocx.GetICPictureAll();
		InfoTextCallback(25, picBase64);
	} else {
		sendMsgGetICPictureAll();
	}
}

let InitFinger = () => {
	if (isIE) {
		var ret = axCam_Ocx.InitFinger();
		if (ret == 1) {
			InfoCallback(0x25);
		} else InfoCallback(0x26);
	} else {
		sendMsgInitFinger();
	}
}

let StartFinger = () => {
	if (isIE) {
		var ret = axCam_Ocx.StartFinger();
		if (ret == 1) {
			InfoCallback(0x30);
		} else if (ret == -1) {
			InfoCallback(0x27);
		} else if (ret == -2) {
			InfoCallback(0x28);
		} else if (ret == -3) {
			InfoCallback(0xb1);
		} else if (ret == -4) {
			InfoCallback(0x31);
		}
	} else {
		sendMsgStartFinger();
	}
}

let CloseFinger = () => {
	if (isIE) {
		axCam_Ocx.CloseFinger();
		InfoCallback(0x32);
	} else {
		sendMsgCloseFinger();
	}
}

let BeginVideo = (filename, id, frameModel) => {
	var frame = 4;
	if (frameModel == 1) {
		frame = 8;
	} else if (frameModel == 2) {
		frame = 12;
	}
	if (isIE) {
		var ret = axCam_Ocx.BeginVideoID(filename, id, frame);
		if (ret == 1) {
			InfoCallback(0x34);
		} else if (ret == -1) {
			InfoCallback(0xb2);

		} else if (ret == -2) {
			InfoCallback(0x36);

		}
	} else {
		sendMsgBeginVideo(filename, id, frame);
	}


}

let StopVideo = () => {
	if (isIE) {
		axCam_Ocx.StopVideo();
	} else {
		sendMsgStopVideo();
	}
}

let BeginVideoSecond = (filename, id, frameModel) => {
	var frame = 4;
	if (frameModel == 1) {
		frame = 8;
	} else if (frameModel == 2) {
		frame = 12;
	}
	if (isIE) {
		var ret = axCam_Ocx2.BeginVideoID(filename, id, frame);
		if (ret == 1) {
			InfoCallback(0x37);
		} else if (ret == -1) {
			InfoCallback(0xb3);

		} else if (ret == -2) {
			InfoCallback(0x39);

		}
	} else {
		sendMsgBeginVideoSecond(filename, id, frame);
	}


}

let StopVideoSecond = () => {
	if (isIE) {
		axCam_Ocx2.StopVideo();
	} else {
		sendMsgStopVideoSecond();
	}
}

let GetAudioName = () => {
	if (isIE) {
		var str = axCam_Ocx.GetAudioName();
		if (str == "-1") {
			InfoCallback(0x36);
		} else if (str == "0") {
			InfoCallback(0xb4);
		} else InfoTextCallback(27, str);
	} else {
		sendMsgGetAudioName();
	}

}

let ReadBarQrcodeD = (type) => {
	if (isIE) {
		var code = axCam_Ocx.ReadBarQrcodeD(type);
		if (type == 1) {
			InfoTextCallback(2, code);
		} else if (type == 2) {
			InfoTextCallback(7, code);
		}
	} else {
		sednMsgBarQrcode(type);
	}

}

let MakeDir = (path) => {
	if (isIE) {
		var ret = axCam_Ocx.MakeDir(path);
		if (ret == 1) {
			InfoCallback(0x44);
		} else InfoCallback(0x45);

	} else {
		sendMsgMakeDir(path);
	}

}

let AutoFoucs = () => {
	if (isIE) {
		axCam_Ocx.AutoFoucs();

	} else {
		sendMsgAutoFoucs();
	}

}

let FaceCheckInit = () => {
	if (isIE) {
		var ret = axCam_Ocx.FaceCheckInit();
		if (ret == 1) {
			InfoCallback(0x46);
		} else InfoCallback(0xb8);

	} else {
		sednMsgFaceCheckInit();
	}

}

let FaceCheckUninit = () => {
	if (isIE) {
		axCam_Ocx.FaceCheckUninit();

	} else {
		sednMsgFaceCheckUninit();
	}

}

let StartFaceCheck = () => {
	if (isIE) {
		var ret = axCam_Ocx.StartFaceCheck();
		if (ret == 1) {
			InfoCallback(0x47);
		} else if (ret == -1) {
			InfoCallback(0xb9);
		} else if (ret == -2) {
			InfoCallback(0xba);
		}

	} else {
		sednMsgStartFaceCheck();
	}
}

let StopFaceCheck = () => {
	if (isIE) {
		axCam_Ocx.StopFaceCheck();

	} else {
		sednMsgStopFaceCheck();
	}
}

let FaceCheckInitSecond = () => {
	if (isIE) {
		var ret = axCam_Ocx2.FaceCheckInit();
		if (ret == 1) {
			InfoCallback(0x46);
		} else InfoCallback(0xb8);

	} else {
		sednMsgFaceCheckInitSecond();
	}

}

let FaceCheckUninitSecond = () => {
	if (isIE) {
		axCam_Ocx2.FaceCheckUninit();

	} else {
		sednMsgFaceCheckUninitSecond();
	}

}

let StartFaceCheckSecond = () => {
	if (isIE) {
		var ret = axCam_Ocx2.StartFaceCheck();
		if (ret == 1) {
			InfoCallback(0x47);
		} else if (ret == -1) {
			InfoCallback(0xb9);
		} else if (ret == -2) {
			InfoCallback(0xba);
		}

	} else {
		sednMsgStartFaceCheckSecond();
	}
}

let StopFaceCheckSecond = () => {
	if (isIE) {
		axCam_Ocx2.StopFaceCheck();

	} else {
		sednMsgStopFaceCheckSecond();
	}
}

let UninitBankCard = () => {
	if (isIE) {
		axCam_Ocx.UninitBankCard();

	} else {
		sednMsgBankCardFun(0);
	}
}

let InitBankCard = () => {
	if (isIE) {
		var ret = axCam_Ocx.InitBankCard();
		if (ret == 1) {
			InfoCallback(0x4d);
		} else {
			InfoCallback(0xbc);
		}

	} else {
		sednMsgBankCardFun(1);
	}
}

let GetBankCardNo = () => {
	if (isIE) {
		var ret = axCam_Ocx.GetBankCardNo();
		if (ret.length > 10) {
			InfoTextCallback(29, ret);
		} else if (ret == "-1") {
			InfoCallback(0xbd);
		} else if (ret == "-2") {
			InfoCallback(0xbe);
		} else if (ret == "-3") {
			InfoCallback(0xbf);
		} else if (ret == "-5") {
			InfoCallback(0xc0);
		} else {
			InfoCallback(0xc1);
		}

	} else {
		sednMsgBankCardFun(2);
	}
}


let InitFingerFun = () => {
	if (isIE) {
		var ret = axCam_Ocx.InitFingerFun();
		if (ret == 1) {
			InfoCallback(0x4e);
		} else {
			InfoCallback(0x4f);
		}

	} else {
		sendMsgInitFingerFunOrCloase(1);
	}
}

let CloseFingerFun = () => {
	if (isIE) {
		axCam_Ocx.CloseFingerFun();

	} else {
		sendMsgInitFingerFunOrCloase(0);
	}
}

let RegisterFinger = () => {
	if (isIE) {
		var ret = axCam_Ocx.RegisterFingerData();
		if (ret == 1) {
			InfoCallback(0x56);
		} else if (ret == -1) {
			InfoCallback(0x57);
		} else if (ret == -2) {
			InfoCallback(0x58);
		} else if (ret == -3) {
			InfoCallback(0x59);
		}
	} else {
		sendMsgRegisterFinger();
	}
}

let StopRegisterFinger = () => {
	if (isIE) {
		axCam_Ocx.StopRegisterFinger();

	} else {
		sednMsgStopRegisterFinger();
	}
}

let VerifyFinger = (fingerLen, fingerBase64) => {
	if (isIE) {
		var ret = axCam_Ocx.VerifyFingerBase64(fingerBase64, fingerLen);
		if (ret == 1) {
			InfoCallback(0x5d);
		} else if (ret == -1) {
			InfoCallback(0x57);
		} else if (ret == -2) {
			InfoCallback(0x5a);
		} else if (ret == -3) {
			InfoCallback(0x5b);
		} else if (ret == -4) {
			InfoCallback(0x5c);
		}
	} else {
		sendMsgVerifyFingerBase64(fingerLen, fingerBase64);
	}
}

let StopVerifyFinger = () => {
	if (isIE) {
		axCam_Ocx.StopVerifyFinger();
	} else {
		sednMsgStopVerifyFinger();

	}
}

let GetFingerDataLen = () => {
	if (isIE) {
		var len = axCam_Ocx.GetFingerDataLen();
		InfoTextCallback(34, len);
	} else {
		sendMsgGetFinger(0);
	}

}

let GetFingerBase64 = () => {
	if (isIE) {
		var str = axCam_Ocx.GetFingerBase64();
		InfoTextCallback(33, str);
	} else {
		sendMsgGetFinger(1);
	}
}

let GetFingerImgBase64 = () => {
	if (isIE) {
		var str = axCam_Ocx.GetFingerImgBase64();
		if (str.length > 0) {
			InfoTextCallback(36, str);
		} else InfoCallback(0x66);

	} else {
		sendMsgGetFinger(2);
	}
}



let FaceStratDouble = () => {
	if (isIE) {
		axCam_Ocx.FaceStratDouble();
		axCam_Ocx2.FaceStratDouble();

	} else {
		sednMsgQFaceStratDoubleOrClose(1);
	}
}

let FaceCloseDouble = () => {
	if (isIE) {
		axCam_Ocx.FaceCloseDouble();
		axCam_Ocx2.FaceCloseDouble();

	} else {
		sednMsgQFaceStratDoubleOrClose(0);
	}
}

let FaceCheckInitDouble = () => {
	if (isIE) {
		FaceCheckInit();
		FaceCheckInitSecond();

	} else {
		sednMsgFaceCheckInitDouble();
	}

}

let SetDpi = (xdpi, ydpi) => {
	if (isIE) {
		axCam_Ocx.SetDpi(xdpi, ydpi);
	} else {
		sendMsgSetDpi(xdpi, ydpi);
	}

}

let ReleaseAll = () => {
	if (isIE) {

	} else {
		sednMsgReleaseAll();
	}

}

let SetDebugModel = () => {
	if (isIE) {

	} else {
		sendMsgSetDebugModel();
	}
}

let InitFaceCheck = () => {
	if (isIE) {
		var ret = axCam_Ocx.InitFaceCheck();
		if (ret == 1) {
			InfoCallback(0x5f);
		} else {
			InfoCallback(0x60);
		}

	} else {
		sendMsgFaceCheck(1);
	}
}

let DeInitFaceCheck = () => {
	if (isIE) {
		axCam_Ocx.DeInitFaceCheck();

	} else {
		sendMsgFaceCheck(0);
	}
}

let CaptureFace = () => {
	if (isIE) {
		axCam_Ocx.CaptureFace();

	} else {
		sendMsgCaptureFace();
	}
}

let CaptureFaceStr = () => {
	if (isIE) {
		axCam_Ocx.CaptureFaceStr();

	} else {

	}
}

let InitFaceCheckSecond = () => {
	if (isIE) {
		var ret = axCam_Ocx2.InitFaceCheck();
		if (ret == 1) {
			InfoCallback(0x61);
		} else {
			InfoCallback(0x62);
		}

	} else {
		sendMsgFaceCheckSecond(1);
	}
}

let DeInitFaceCheckSecond = () => {
	if (isIE) {
		axCam_Ocx2.DeInitFaceCheck();

	} else {
		sendMsgFaceCheckSecond(0);
	}
}

let CaptureFaceSecond = () => {
	if (isIE) {
		axCam_Ocx2.CaptureFace();

	} else {
		sendMsgCaptureFaceSecond();
	}
}

let CaptureFaceStrSecond = () => {
	if (isIE) {
		axCam_Ocx2.CaptureFaceStr();

	} else {

	}
}

let AddFingerBase64 = (fingerLen, fingerBase64) => {
	if (isIE) {
		var ret = axCam_Ocx.AddFingerBase64(fingerBase64, fingerLen);
		if (ret == 1) {
			InfoCallback(0x6e);
		} else {
			InfoCallback(0x6f);
		}

	} else {
		sendMsgAddFingerBase64(fingerLen, fingerBase64);
		// sendMsgVerifyFingerBase64(fingerLen,fingerBase64);
	}
}

let ClearAllFingerBase64 = () => {
	if (isIE) {
		axCam_Ocx.ClearAllFingerBase64();

	} else {
		sendMsgClearAllFingerBase64();
	}
}

let VerifyFingerAllBase64 = () => {
	if (isIE) {
		var ret = axCam_Ocx.VerifyFingerAllBase64();
		if (ret == 1) {
			InfoCallback(0x5d);
		} else if (ret == -1) {
			InfoCallback(0x57);
		} else if (ret == -2) {
			InfoCallback(0x5a);
		} else if (ret == -3) {
			InfoCallback(0x5b);
		} else if (ret == -4) {
			InfoCallback(0x5c);
		}
	} else {
		sendMsgVerifyFingerAllBase64();
	}
}

let CheckCamDev = () => {
	if (isIE) {
		var ret = axCam_Ocx.CheckCamDev();
		if (ret == 1) {
			InfoCallback(0x67);
		} else {
			InfoCallback(0x68);
		}

	} else {
		sendMsgCheckCamDev();
	}
}

let SetFoucs = (value) => {
	if (isIE) {
		axCam_Ocx.SetFoucs(0, value);

	} else {
		sendMsgSetFoucs(value);
	}
}

let GetALLVidPid = () => {
	if (isIE) {
		var num = axCam_Ocx.GetDevCount();
		var strall = num + "";
		for (var i = 0; i < num; i++) {
			var strTemp = axCam_Ocx.GetDeviceVidPid(i);
			strall = strall + "**" + strTemp
		}
		InfoTextCallback(43, strall);
	} else {
		sendMsgGetALLVidPid();
	}
}

let SetFaceCheckImg = (path) => {

	if (isIE) {
		var ret = axCam_Ocx.SetFaceCheckImg(path);
		if (ret == 1) {
			InfoCallback(0x7d);
		} else {
			InfoCallback(0xa2);
		}

	} else {
		sendMsgSetFaceCheckImg(path);
	}

}

let SetFaceCheckImg2 = (path) => {

	if (isIE) {
		var ret = axCam_Ocx2.SetFaceCheckImg(path);
		if (ret == 1) {
			InfoCallback(0x7d);
		} else {
			InfoCallback(0xa2);
		}

	} else {
		sendMsgSetFaceCheckImg(path);
	}

}



let getCanvasPos = (canvas, e) => {//获取鼠标在canvas上的坐标  

	var rect = canvas.getBoundingClientRect();

	if (e.clientX > rect.left && e.clientX < rect.right && e.clientY > rect.top && e.clientY < rect.bottom) {
		return true;
	} else return false;
}


var scrollFunc = (e) => {
	e = e || window.event;

	var ret = false;
	if (isIE) {
		ret = getCanvasPos(axCam_Ocx, e);
	} else ret = getCanvasPos(canvas, e);

	//console.log("测试测试测试y:"+yyyy);  
	if (ret) {
		if (e.wheelDelta) {//IE/Opera/Chrome 

			if (e.wheelDelta > 100) {
				ZoomOut();
			} else if (e.wheelDelta < -100) {
				ZoomIn();
				if (!isIE) {
					canvasX = 0;
					canvasY = 0;
				}

			}
		} else if (e.detail) {//Firefox 
			//t2.value=e.detail; 
			if (e.detail >= 3) {
				ZoomIn();
				if (!isIE) {
					canvasX = 0;
					canvasY = 0;
				}
			} else if (e.detail <= -3) {
				ZoomOut();

			}
		}
		if (e.stopPropagation) e.stopPropagation();
		else e.cancelBubble = true;

		if (e.preventDefault) e.preventDefault();
		else e.returnValue = false;
		return false;
	} else return true;
}

export {loadActiveX, Capture, ChangeResolution, RoateL, RoateR, CloseCam, GetBase64FromFile}
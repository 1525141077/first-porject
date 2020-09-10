<template>
    <div class="yt-dome-container">
    
    <!-- 头部信息 -->
    <el-row style="padding-top:20px;">
        <el-col :span="10">
          <span class="yt-read-text" style="font-size: 25px;font-weight: bold;margin-left:20px">{{form.compName}}</span>
        </el-col>
        <el-col :span="14">
             <el-link type="primary" v-show="!show" style="float:right;margin-right: 20px;" @click='show=true' >编辑</el-link>
            <el-link type="primary"  v-show="show" style="float:right;margin-right: 20px;" @click="submitFormTwo('form')">保存</el-link>
          </el-col>
      </el-row>
      <!-- 头部信息输入框 -->
    <el-form style="margin-top: 20px;margin-left: -10px;" :model="form" ref="form"  v-show="show">
        <el-row>
            <el-col :span="6">
                <el-form-item label="公 司 简 称 ：" prop="forShort" label-width="120px" 
                :rules="[
                { required: true, message: '请输入公司简称'},
              ]">
                    <el-input v-model="form.forShort"  placeholder="请输入公司简称"></el-input>
                  </el-form-item>
            </el-col>
            <div>
                <el-col :span="6">
                    <el-form-item label="法定代表人 ：" prop="compPerson" label-width="120px"
                    :rules="[
                { required: true, message: '请输入法定代表人'},
              ]" >
                        <el-input v-model="form.compPerson" placeholder="请输入法定代表人"></el-input>
                      </el-form-item>
                </el-col>
              </div>
              <el-col :span="6">
                <el-form-item label="注 册 资 金 ：" prop="registeredCapital" label-width="120px"
                :rules="[
                { required: true, message: '请输入注册资金'},
              ]" >
              <finmoneyinput v-model="form.registeredCapital" :tail="'元'"></finmoneyinput>
                  </el-form-item>
            </el-col>
            <div>
                <el-col :span="6">
                    <el-form-item label="成 立 日 期 ：" prop="establishmentTime" label-width="120px" 
                    :rules="[
                { required: true, message: '请选择日期'},
              ]">
                        <div class="block">
                            <el-date-picker
                            style="width: 140px;"
                              v-model="form.establishmentTime"
                              value-format="yyyy-MM-dd"
                              type="date"
                              placeholder="选择日期">
                            </el-date-picker>
                          </div>
                      </el-form-item>
                </el-col>
              </div>
          </el-row>
          <!-- <el-row>
            <el-col :span="6">
                <el-form-item label="注 册 资 金 ：" prop="registeredCapital" label-width="120px"
                :rules="[
                { required: true, message: '请输入注册资金'},
              ]" >
              <finmoneyinput v-model="form.registeredCapital" :tail="'元'"></finmoneyinput>
                  </el-form-item>
            </el-col>
            <div>
                <el-col :span="6">
                    <el-form-item label="成 立 日 期 ：" prop="establishmentTime" label-width="120px" 
                    :rules="[
                { required: true, message: '请选择日期'},
              ]">
                        <div class="block">
                            <el-date-picker
                              v-model="form.establishmentTime"
                              value-format="yyyy-MM-dd"
                              type="date"
                              placeholder="选择日期">
                            </el-date-picker>
                          </div>
                      </el-form-item>
                </el-col>
              </div>
          </el-row> -->
          <el-row >
            <el-col :span="6">
              <el-form-item label="办 公 地 址 ：" prop="compAddress" label-width="120px" 
              :rules="[
                    { required: true, message: '请输入办公地址'},
                  ]">
                <el-input v-model="form.compAddress"  placeholder="请输入办公地址"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="企 业 类 型 ：" prop="compType" label-width="120px" 
                :rules="[
                { required: true, message: '请输入企业类型'},
              ]">
                    <el-input v-model="form.compType" placeholder="请输入企业类型"></el-input>
                  </el-form-item>
            </el-col>
            <div>
                <el-col :span="6">
                    <el-form-item label="联 系 电 话 ：" prop="contactInformation" label-width="120px"
                    :rules="[
                { required: true, message: '请输入联系电话'},
              ]" >
                        <el-input v-model="form.contactInformation" placeholder="请输入联系电话"></el-input>
                      </el-form-item>
                </el-col>
              </div>
          </el-row>
          <!-- <el-form-item label="办 公 地 址 ：" prop="compAddress" label-width="120px" 
          :rules="[
                { required: true, message: '请输入办公地址'},
              ]">
            <el-input v-model="form.compAddress"  placeholder="请输入办公地址"></el-input>
          </el-form-item> -->
          <el-form-item label="经 营 范 围 ：" prop="compRemarks" label-width="120px"
          :rules="[
                { required: true, message: '请输入经营范围'},
              ]">
            <el-input type="textarea" v-model="form.compRemarks" placeholder="请输入经营范围"></el-input>
          </el-form-item>
    </el-form>
      <el-row style="margin-top:20px"  v-show="!show">
        <el-col :span="6">
          <span class="yt-read-text" style="letter-spacing:5px;margin-left:20px">公司简称：</span>
          <span>{{form.forShort}}</span>
        </el-col>
        <div>
            <el-col :span="6">
              <span class="yt-read-text" style="letter-spacing:5px">法定代表人：</span>
              <span>{{form.compPerson}}</span>
            </el-col>
          </div>
          <el-col :span="6">
            <span class="yt-read-text" style="letter-spacing:5px; margin-left:20px">注册资金：</span>
            <span>{{form.registeredCapital}}</span>
          </el-col>
          <div>
            <el-col :span="6">
              <span class="yt-read-text" style="letter-spacing:5px">成立日期：</span>
              <span>{{form.establishmentTime}}</span>
            </el-col>
          </div>
      </el-row>
      <!-- <el-row style="margin-top:20px" v-show="!show">
        <el-col :span="6">
          <span class="yt-read-text" style="letter-spacing:5px; margin-left:20px">注册资金：</span>
          <span>{{form.registeredCapital}}</span>
        </el-col>
        <div>
          <el-col :span="6">
            <span class="yt-read-text" style="letter-spacing:5px">成立日期：</span>
            <span>{{form.establishmentTime}}</span>
          </el-col>
        </div>
      </el-row> -->
      <el-row style="margin-top:20px" v-show="!show">
        <el-col :span="12">
          <span class="yt-read-text" style="letter-spacing:5px;margin-left:20px">办公地址：</span>
          <span>{{form.compAddress}}</span>
        </el-col>
        <el-col :span="6">
          <span class="yt-read-text" style="letter-spacing:5px;margin-left:20px">企业类型：</span>
          <span>{{form.compType}}</span>
        </el-col>
        <div>
          <el-col :span="6">
            <span class="yt-read-text" style="letter-spacing:5px;letter-spacing:5px">联系电话：</span>
            <span>{{form.contactInformation}}</span>
          </el-col>
        </div>
      </el-row>
      <!-- <el-row style="margin-top:20px" v-show="!show">
        <el-col :span="15">
          <span class="yt-read-text" style="letter-spacing:5px;margin-left:20px">办公地址：</span>
          <span>{{form.compAddress}}</span>
        </el-col>
      </el-row> -->
      <el-row style="margin-top:20px" v-show="!show">
          <div >
          <span style="float: left;padding-top: 3px;margin-left:20px;letter-spacing:5px">经营范围：</span>
            <span style="display: inline-block;font-weight: normal;padding: 0;width:80%;line-height: 25px;">{{form.compRemarks}}</span >
      </div>
      </el-row>
        <!-- 公司资质证书START -->
    <topTip>
        <template>
          <el-row>
            <el-col :span="13" class="top-tip" style="text-align: left;">
              <div>
                <span style="color: #417095;font-size: 16px;font-weight: bolder;">公司资质证书</span>
              </div>
            </el-col>
          </el-row>
        </template>
      </topTip>
      <!-- 公司资质证书END -->
      <el-row >
        <el-col :span="6">
            <el-button style="margin-left: 30px;" type="primary" @click="journal('popup')">新增资质证书</el-button>
        </el-col>
        <el-col :span="8"  style="float: right;margin-right: 20px;">
              <el-input v-model="formTwo.param" class placeholder="请输入资质证书名称">
                <el-button slot="append" icon="el-icon-search" @click="getCertificateInfo()"></el-button>
            </el-input>
          </el-col>
      </el-row>
      <!-- 资质证书框 -->
      <!-- <template slot-scope="scope"><template/> -->
      <div v-for="(item,index) in edit"  style="height: 210px;width: 540px;border: 1px solid rgb(204, 204, 204);margin: 25px 0px 0px 20px;float: left;">
        <div style="height: 150px;width: 150px;margin:30px 0px 0px 10px ;float: left;">
         <!-- <img src="http://192.168.1.120:8080/projectDb/fileUpDownload/download?pkId=1582&isDownload=false" alt=""> -->
         <!-- <span>{{item.attId}}</span> -->
          <img :src="item.url"alt="" style="height: 150px;width: 150px;">
        </div>
        <div style="height: 175px;width: 300px;margin:30px 0px 0px 10px;float: left;">
            <!-- 编辑输入框 -->
            <el-form style="margin-left: -20px;margin-top: -20px;"  v-show="item.showTwo">
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="资质证书名称：" prop="content" label-width="120px" >
                            <el-input size="small" v-model="item.certificationName"  placeholder="请输入资质证书名称"></el-input>
                          </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row >
                    <el-col :span="20" style="margin-top: -20px;">
                        <el-form-item label="资质证书编号：" prop="content" label-width="120px" >
                            <el-input size="small" v-model="item.certificationNum" placeholder="请输入资质证书编号"></el-input>
                          </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="20" style="margin-top: -20px;">
                        <el-form-item style="margin-left: -15px;" label="获  得  日  期：" prop="content" label-width="120px" >
                            <div class="block">
                                <el-date-picker
                                v-model="item.gitTime"
                                value-format="yyyy-MM-dd"
                                  type="date"
                                  size="small"
                                  placeholder="选择日期">
                                </el-date-picker>
                              </div>
                          </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="20" style="margin-top: -20px;">
                        <el-form-item style="margin-left: -15px;" label="有效期截止：" prop="content" label-width="120px" >
                            <div class="block">
                                <el-date-picker
                                v-model="item.effectiveTime"
                                value-format="yyyy-MM-dd"
                                  type="date"
                                  size="small"
                                  placeholder="选择日期">
                                </el-date-picker>
                              </div>
                          </el-form-item>
                    </el-col>
                  </el-row>
            </el-form>
            <el-row  v-show="!item.showTwo" style="margin-top: 8px;" show-overflow-tooltip>
                <el-col :span="18" >
                  <span class="yt-read-text"  >资质证书名称：</span> <el-tooltip placement="bottom" effect="light"><div slot="content">{{item.certificationName}}</div><span  style="overflow: hidden;width: 160px;" >{{item.certificationName | ellipsisTwo}}</span></el-tooltip>
                </el-col>
                <el-col :span="6" style="float: right;">
                    <div  v-if="item.style==2" style="background-color:rgb(255,102,51);width: 65px;text-align: center;border-radius: 5px;margin-left: 70px;">
                        <span class="yt-read-text" style="color: white;">即将到期</span>
                    </div>
                    <div v-else-if="item.style==1" style="background-color:rgb(0,157,218);width: 65px;text-align: center;border-radius: 5px;margin-left: 70px;">
                      <span class="yt-read-text" style="color: white;">使用中</span>
                  </div>
                  <div v-else-if="item.style==3" style="background-color:rgb(204,204,204);width: 65px;text-align: center;border-radius: 5px;margin-left: 70px;">
                    <span class="yt-read-text" style="color: white;">已过期</span>
                </div>
                  </el-col>
              </el-row>
              <el-row style="margin-top: 15px;"  v-show="!item.showTwo">
                <el-col :span="17" style="overflow: hidden;">
                  <span class="yt-read-text">资质证书编号：</span><el-tooltip placement="bottom" effect="light"><div slot="content">{{item.certificationNum}}</div><span >{{item.certificationNum | ellipsisTwo}}</span></el-tooltip>
                  <!-- <span >{{item.certificationNum | ellipsisTwo}}</span> -->
                </el-col>
              </el-row>
              <el-row style="margin-top: 15px;"  v-show="!item.showTwo">
                <el-col :span="15">
                  <span class="yt-read-text" style="letter-spacing: 5px;" >获得日期：</span><span>{{item.gitTime}}</span>
                </el-col>
              </el-row>
              <el-row style="margin-top: 15px;"  v-show="! item.showTwo">
                <el-col :span="15">
                  <span class="yt-read-text">有效期截止：</span><span v-if="item.effectiveTime==''">--</span><span v-else>{{item.effectiveTime}}</span>
                </el-col>
              </el-row>
              <el-row style="margin-top: 0px;float: right;"v-show="!item.showTwo">
                <el-col :span="6"style="float: right;" >
                    <el-button style="margin-left:90px;" type="text" @click="deletes(item,index)">删除</el-button>
                </el-col>
                <el-col :span="6" style="float: right;">
                  <!-- <template slot-scope="scope"> -->
                    <el-button style="margin-left: 120px;"  type="text" @click="editTwo(item,index)">编辑</el-button>
                  <!-- </template> -->
                  </el-col>
              </el-row>
              <el-row style="margin-top: -12px;float: right;"v-show="item.showTwo">
                <el-col :span="6"style="float: right;" >
                    <el-button style="margin-left: 90px;" type="text" @click="deletes(item,index)">删除</el-button>
                </el-col>
                <el-col :span="6" style="float: right;">
                    <el-button style="margin-left: 120px;"  type="text" @click="Modify(item,index)">保存</el-button>
                </el-col>
              </el-row>
        </div>
      </div>
      
      <div style="text-align: center;clear: both;">
      <el-button class="yt-bottom-btn" type="info" style="margin-top: 30px;" @click="print">关闭</el-button>
    </div>
      <!-- 弹出框信息start -->
      <el-dialog title="新增资质证书" style="width:1350px;" :visible.sync="dialogVisible">
   <el-form style="margin-left: -20px;" class="demo-ruleForm" :model="popup" ref="popup">
    <el-form-item label="资质证书名称 ：" prop="certificationName" label-width="120px" 
    :rules="[
      { required: true, message: '请输入资质证书名称'},
    ]">
        <el-input v-model="popup.certificationName" placeholder="请输入资质证书名称"></el-input>
      </el-form-item>
      <el-form-item label="资质证书编号 ：" prop="certificationNum" label-width="120px" 
      :rules="[
      { required: true, message: '请输入资质证书编号'},
    ]">
        <el-input v-model="popup.certificationNum" placeholder="请输入资质证书编号"></el-input>
      </el-form-item>
      <el-row style="margin-left: 7px;">
        <el-col :span="10">
    <el-form-item label="获  得  日  期 ：" prop="gitTime" label-width="100px" 
    :rules="[
      { required: true, message: '请选择日期'},
    ]" >
        <div class="block">
            <el-date-picker
              v-model="popup.gitTime"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </div>
      </el-form-item>
    </el-col>
    <el-col :span="10" style="margin-left: 70px;">
      <el-form-item label="有效期截止 ：" prop="content" label-width="90px"  >
        <div class="block">
            <el-date-picker
              v-model="popup.effectiveTime"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </div>
      </el-form-item>
    </el-col>
      </el-row>
  </el-form>
  <el-form style="margin-left: -13px;" >
      <el-row style="margin-left: -5px;">
        <el-col :span="10">
          <!-- //弹出框上传图片 -->
          <div style="color: #F56C6C;font-size: 15px;line-height: 1;padding-top: 0px;position: absolute;top:7%;left: 1%;">*</div>
    <el-form-item label="资质证书附件 ：" prop="content" label-width="120px"  >
      <upload
      style="font-size: 60px;"
      @upload="uploadPicture"
      @delFile="delFileBtnPicture"
      :fileList="formUp.fileList"
      :listType="'picture-card'"
      :fileTypeBool="1"
      :disabled="false"
      :photoUpload="'2'"
      :oneOrMany="true"
    ></upload>
    <div  v-show="haveCustomerName" style="color: #F56C6C;font-size: 12px;line-height: 1;padding-top: 0px;position: absolute;top: 90%;left: 0;">请上传资质证书附件</div>
<el-dialog :visible.sync="imgVisible">
    <img width="100%" :src="dialogImageUrl" alt="">
  </el-dialog>
      </el-form-item>
    </el-col>
      </el-row>
    </el-form>
      <div style="text-align:center;padding-top:20px">
        <el-button type="primary" @click="submitForm('popup')">保存</el-button>
        <el-button type="info" :visible.sync="dialogVisible" @click="journalTwo('popup')">关闭</el-button>
      </div>
 </el-dialog>
   <!-- 弹出框信息end -->
    </div>
  </template>
  <script>
  //一级标题
  import topTip from "../../components/topTip";
  //金额输入框组件
  import finmoneyinput from "../../components/fin-money-input";
  //提交附件
  import upload from "../../components/upload";
  //查看附件
  import lookFiles from "../../components/lookFiles.vue";
  //axios接口组件
  import axios from "../../service/http";
  //配置文件
  import { option } from "../../static/config";
  export default {
    data() {
      return {
        haveCustomerName:false,//资质证书图片上传验证
        Expired:false,//已过期
        InUse:false,//使用中
        AboutExpire:false,//即将过期
        Data:"",
        beforeData:[],
        dialogVisible: false, //弹出框
        // 是否禁用上传
        hideUpload:false　,
　　　　limitCount:1,
        dialogImageUrl: '',
        imgVisible: false,
        value1: '',
        value2: '',
        show:false,
        showTwo:'',
        getID:'',
        popup:{
          certificationName:'',//资质证书名称
          certificationNum:'',//资质证书编号
          gitTime:'',//获得日期
          effectiveTime:'--'//有效期截止
            
        },
        edit:[],
        tableData: {
      // type: Array,
      default() {
        return [];
      }
    },
        tableDataTwo:[],
        form: {
          compId:"",//公司id
          compName:"",//公司名称
          forShort:"",//公司简称
          compPerson:"",//法定代表人
          registeredCapital:0,//注册资金
          establishmentTime:"",//成立日期
          compType:"",//企业类型
          contactInformation:"",//联系方式
          compAddress:"",//公司地址
          compRemarks:""//经营范围
        // queryStateParams: "WF_SUSPENDING_QUERY_SQL_PARAMS",
        // // queryStateParams:"WF_SOLVED_QUERY_SQL_PARAMS",
        // // queryStateParams:"WF_COMPLETED_QUERY_SQL_PARAMS",
        // queryParams: "",
        // pageIndex: 1,
        // pageNum: 15,
        // yitianSSODynamicKey: "",
        // dynamicKey: "",
        // processInstanceId:''
      },
      formTwo:{
        param:"",
        // systemCode:"",
        // dynamicKey:"", 
      },
      formUp: {
        fileList: [],
      },
      };
    },
    components: {
      topTip,
      upload,
      lookFiles,
      finmoneyinput
    },
    mounted() {
      this.format();
      // this.DateDiff(Data, beforeData);
      if (this.$route.query.compId) {
       this.compId = this.$route.query.compId;
       this.getList();
    }
    },
    //过滤器
    filters: {
      //资质证书名称部分 超出的字段用 "..." 来显示 
    ellipsis (value) {
      if (!value) return ''
      if (value.length > 3) {
        return value.slice(0,3) + '...'
      }
      return value
    },
    //资质证书编号部分 超出的字段用 "..." 来显示 
    ellipsisTwo (value) {
      if (!value) return ''
      if (value.length > 8) {
        return value.slice(0,8) + '...'
      }
      return value
    },
  },
    methods: {
         // 上传发票附件
    uploadPicture(file) {
      // var data = eval("(" + file + ")");
      this.formUp.fileList = this.forSetPage(file);
      console.log("assac不是",this.formUp.fileList)
    },
    // 删除发票附件
    delFileBtnPicture(fileList) {
      this.formUp.fileList = this.forSetPage(fileList);
    },
    //附件循环设置
    forSetPage(list) {
      let newList = [];
      list.forEach(n => {
        newList.push({
          fileId: n.fileId,
          fileName: n.fileName,
          name: n.fileName
        });
      });
      return newList;
    },
    //根据截止日期判断状态变化
    format(){
      var date = new Date();
  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate;
  this.Data=currentdate;
console.log(this.Data)
  // return currentdate;
  console.log(currentdate)
    },
//两日期相减
    DateDiff(){    //sDate1和sDate2是2006-12-18格式  
       var  aDate,  oDate1,  oDate2,  iDays  
       let Data=this.Data
       let beforeData = JSON.parse(JSON.stringify(this.beforeData));
       beforeData.forEach((item,index)=>{
        //  console.log("但是撒阿尔法全球",item.effectiveTime.split("-"))
        aDate   =  Data.split("-")  
	     oDate1 = new Date(aDate[0] , aDate[1] ,aDate[2])    //转换为12-18-2006格式  当前日期
	     aDate   =  item.effectiveTime.split("-")  
	     oDate2 = new Date(aDate[0] , aDate[1] , aDate[2])  //截止日期
       iDays   =  parseInt(Math.abs(oDate2  -  oDate1)  /  1000  /  60  /  60  /24)    //把相差的毫秒数转换为天数
       console.log(iDays) 
             if(iDays>30 && oDate1<oDate2){
            // this.Expired=false,//使用中
            // this.InUse=true,
            // this.AboutExpire=false
            item.style=1
          }else if(iDays<=30 && oDate1<=oDate2){
                    // console.log("sddsds是多少")
            // this.Expired=false,//即将过期
            // this.InUse=false,
            // this.AboutExpire=true
            item.style=2
          }else if(oDate1>oDate2){
            // this.Expired=true,//已过期
            // this.InUse=false,
            // this.AboutExpire=false
            item.style=3
          }else if(item.effectiveTime==''){
            item.style=1
          }
          console.log("算得上是多多所",item.style)
       })
       this.edit=beforeData
      // // return  iDays
      // console.log(iDays)
      //       if(iDays>30 && oDate1<oDate2){
      //       this.Expired=false,//使用中
      //       this.InUse=true,
      //       this.AboutExpire=false
      //     }else if(iDays<=30 && oDate1<=oDate2){
      //               // console.log("sddsds是多少")
      //       this.Expired=false,//即将过期
      //       this.InUse=false,
      //       this.AboutExpire=true
      //     }else if(oDate1>oDate2){
      //       this.Expired=true,//已过期
      //       this.InUse=false,
      //       this.AboutExpire=false
      //     }

  },
  //跳转到列表页面
  print(){
      this.$router.push('./informationList')
    },
//获取附件id
getId(){
  
  if (this.formUp.fileList.length==0) {
    this.getID=""
  }else{
    
    this.getID=this.formUp.fileList[0].fileId
  }
},
    // 接口获取数据
    //获取表单信息
    getList(){
        this.getHumanInfo();
        this.getCertificateInfo();
        // this.getImgSrc();
      },
      // 获取表单头部数据
      getHumanInfo(){
        //调用axios.post方法
        axios.post(option.base_path + 'manpower/comp/getCompByCompId', {compId:this.compId}).then(data => {
           this.form = data.data.data;
           console.log('0002222会哈是的ss',this.tableData)
        })
        .catch(function (error) {
          console.log(error);
        });
      },
      // 获取资质证书数据
      getCertificateInfo(){
        //调用axios.post方法
        axios.post(option.base_path + 'manpower/comp/getCompAttMappingByCompId', {compId:this.compId,param:this.formTwo.param}).then(data => {
           this.edit = data.data.data;
           this.edit.forEach(n => {
             if (n.attId) {
               n.url = option.base_path + "fileUpDownload/download?pkId="+ n.attId +"&isDownload=false"
             }
           });
          //  console.log('0002222会哈是的ss',this.tableData)
        })
        .then(res => {
          this.edit.forEach((item, i, arr) => {
            arr[i].showTwo = false;
            arr[i].style = 0;
            console.log("返回值",arr);
          });
          // this.edit.forEach((item, index) => {
          //   console.log("离拉萨市",item.effectiveTime);
          //   this.beforeData.push(item.effectiveTime)
          //   console.log("是多少",this.beforeData[0]);
          // });
          this.beforeData=this.edit
          this.DateDiff()//调用日期相减的方法
          console.log("返回值阿发",this.beforeData );
        })
        .catch(function (error) {
          console.log(error);
        });
      },
 //点击触发弹出框事件
    journal(formName) {
      
      
      // this.popup={
      //     certificationName:'',//资质证书名称
      //     certificationNum:'',//资质证书编号
      //     gitTime:'',//获得日期
      //     effectiveTime:''//有效期截止
      // },
      this.popup.effectiveTime="" //绑定弹窗框中的截止日期，（不能动！！！！！！）
      
    //   this.journalInfo(row);
      this.dialogVisible = true;
      this.formUp.fileList=[];
      // console.log("asc刹车",this.formUp.fileList)
      
      // this.$refs.popup.resetFields();
      // this.popup.effectiveTime=""
      // console.log(this.dialogVisible)
    //   this.journalInfo(row);
    },
     //点击关闭弹出框事件
     journalTwo(formName) {
      this.dialogVisible = false;
      this.popup={
          certificationName:'',//资质证书名称
          certificationNum:'',//资质证书编号
          gitTime:'',//获得日期
          effectiveTime:''//有效期截止
      }
      this.$refs[formName].resetFields();
      this.haveCustomerName =false;
    },
    //点击修改
    editTwo(item,index){
      let edit = JSON.parse(JSON.stringify(this.edit));
      // let a=this.edit[index]
      // a.showTwo=true
      edit[index].showTwo=true
      this.edit=edit
    // console.log("爱仕达奥所",this.edit[index].showTwo)
    // console.log("爽肤水是个",this.showTwo)
    },
    //点击保存 修改资质证书部分
    Modify(item,index) {
      
            axios
        .post(
          option.base_path +
            "manpower/comp/saveCompAttMappingByCompId",
          {
            compId:this.compId,
              compAttId:this.edit[index].compAttId,
              attId:this.edit[index].attId,
              attName:this.edit[index].attName,
              certificationName:this.edit[index].certificationName,
              certificationNum:this.edit[index].certificationNum,
              gitTime:this.edit[index].gitTime,
              effectiveTime:this.edit[index].effectiveTime,
            // yitianSSODynamicKey:'',
            // systemCode:'',
            // dynamicKey:''
          }
        )
        .then(res => {
          let edit = JSON.parse(JSON.stringify(this.edit));
      // let a=this.edit[index]
      // a.showTwo=true
      edit[index].showTwo=false
      this.edit=edit
      this.DateDiff();
      this.getCertificateInfo();
        })
        .catch(err => err);
        
      },
  //新增弹出框部分
    submitForm(formName) {
      this.getId()
      
        this.$refs[formName].validate((valid) => {
          if (valid&&this.formUp.fileList.length!=0) {
            axios
        .post(
          option.base_path +
            "manpower/comp/saveCompAttMappingByCompId",
          {
              compId:this.compId,
              attId:this.getID,
              attName:this.popup.attName,
              certificationName:this.popup.certificationName,
              certificationNum:this.popup.certificationNum,
              gitTime:this.popup.gitTime,
              effectiveTime:this.popup.effectiveTime,
            // yitianSSODynamicKey:'',
            // systemCode:'',
            // dynamicKey:''
          },
        )
        .then(res => {
          // console.log('sdsdvsdvsdv 胜多负少ds',this.tableData)
          this.getCertificateInfo();
          this.$refs.popup.resetFields();
          this.haveCustomerName =false;
        })
        .catch(err => err);
            this.dialogVisible =false;
            
          } else {
            console.log('error submit!!');
            this.haveCustomerName =true;
            return false;
          }
        });
        
      },
      //修改头部表单信息
      submitFormTwo(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            axios
        .post(
          option.base_path +
            "manpower/comp/updateCompByCompId",
          {
            compId: this.form.compId,
            compName: this.form.compName,
            forShort: this.form.forShort,
            compPerson:this.form.compPerson,
            registeredCapital: this.form.registeredCapital,
            establishmentTime:this.form.establishmentTime,
            compType: this.form.compType,
            contactInformation: this.form.contactInformation,
            compAddress: this.form.compAddress,
            compRemarks: this.form.compRemarks,
            // yitianSSODynamicKey:'',
            // systemCode:'',
            // dynamicKey:''
          }
        )
        .then(res => {
          // console.log('sdsdvsdvsdv 胜多负少ds',this.tableData)
          // this.getCertificateInfo();
        })
        .catch(err => err);
            this.show=false
            
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 删除资质证书部分
      deletes(item,index){
        axios
        .post(
          option.base_path +
            "manpower/comp/updateCompAttMappingDelectState",
          {
              compAttId:this.edit[index].compAttId,
            // yitianSSODynamicKey:'',
            // systemCode:'',
            // dynamicKey:''
          }
        )
        .then(res => {
          this.getCertificateInfo();
        })
        .catch(err => err);
      },
    }
  };
  </script>
  
  <style >
      .el-upload {
    text-align: center;
}
.upload-demo{
  display: inline-block;
}
  </style>
  
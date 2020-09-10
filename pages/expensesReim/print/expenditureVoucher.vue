<template>
  <div ref="InvoicePasting"  class="yt-dome-container" >
    <el-form
      ref="form"
      :model="form"
      label-width="120px"
      :label-position="labelposition"
      size="small">
        <input  type="hidden" class="code-inpu"/>
        <div style="position: absolute;left: 40px;top: 50px;"><!--acl-code="displayComp" -->
          <span>付款公司：</span>
          <span>{{form.compName}}</span>
        </div>
        <div style="text-align: right; padding:10px 15px;width:1022px;">
          <el-button type="primary" style="margin-left: 5px;" @click="printBtn">打印</el-button>
        </div>
        <div style="height:625px;">
          <!--startInvoicePasting-->
          <section ref="print">
          <table width="1022px" style="margin: 10px 20px;" class="print-table">
            <tbody class="yt-tbody" style="">
              <tr>
                <td colspan="7" style="text-align:left;border:1px solid #FFF;">
                  <!--表格头部-->
                  <div style="text-align: center;text-decoration:underline;font-size: 26px;">
                    <span style="letter-spacing:5px;margin-left: 180px;">支出凭单</span>
                  </div>
                </td>
                <td style="border:1px solid #FFF;text-align: right;padding: 0;">
                  <img :src="imgSrc" class="qr-code" style="width: 125px;"/>
                </td>
              </tr>
              <tr>
                <td colspan="6" style="text-align: center;border:1px solid #FFF;border-bottom: 1px solid #000;padding-left: 260px;">
                  <div style="display: inline-block; vertical-align: middle;">
                    <div style="float: left;width: 100px;"><span>{{form.printYear}}</span>年</div>
                    <div style="float: left;width: 100px;"><span>{{form.printMonth}}</span>月</div>
                    <div style="float: left;width: 100px;"><span>{{form.printDay}}</span>日</div>
                  </div>
                </td>
                <td colspan="2" style="text-align: center;border:1px solid #FFF;border-bottom: 1px solid #000">
                  支出申请编号：<span>{{form.expenditureAppNum}}</span>
                </td>
              </tr>
              <tr>
                <td style="width: 100px;min-width: 100px;font-weight: bold;">支出事由</td>
                <td colspan="7" style="">
                  <div style="width:100%;text-align: left;">{{form.expenditureAppName}}</div>
                </td>
              </tr>
              <tr>
                <!--<td colspan="5" style="border-bottom:1px solid transparent"></td>-->
                <td style="width: 80px;min-width: 80px;font-weight: bold;">申请人</td>
                <td style="width: 100px;min-width: 100px" class=""><span class="apply-user">{{form.applicantUserName}}</span></td>
                <td style="width: 50px;min-width: 50px;font-weight: bold;">职务</td>
                <td style="width: 100px;min-width: 100px" class=""><span class="post-apply">{{form.applicantUserPositionName}}</span></td>
                <td style="width: 150px;min-width: 150px;font-weight: bold;">申请部门</td>
                <td style="width: 100px;min-width: 100px" class=""><span class="apply-department">{{form.applicantUserDeptName}}</span></td>
                <td style="width: 50px;min-width: 50px;font-weight: bold;">电话</td>
                <td style="width: 100px;min-width: 100px" class=""><span class="apply-phone">{{form.applicantUserPhone}}</span></td>
              </tr>
              <tr>
                <td style="font-weight: bold;">所属项目：</td>
                <td colspan="3" class="costTypeNameOne">{{form.specialName}}</td>
                <td style="font-weight: bold;">项目名称：</td>
                <td colspan="3"><span class="costTypeNameTwo">{{form.prjName  || '--'}}</span></td>
              </tr>
              <tr>
                <td rowspan="2" style="width: 80px;min-width: 80px;font-weight: bold;">费用信息</td>
                <td colspan="7" style="height: 80px;text-align: left;">
                  <span id="costTypeName">{{form.costTypeName}}</span><br />
                </td>
              </tr>
              <tr>
                <td style="font-weight: bold;">人民币（大写）</td>
                <td colspan="3" class="paymen-amount-chinese">{{form.totalAmountChinese}}</td>
                <td style="font-weight: bold;">金额（元）</td>
                <td colspan="2"><span class="paymen-amount">{{form.totalAmount}}</span></td>
              </tr>
            </tbody>
          </table>
          </section>
          <el-row style="margin: 10px 20px;width:1022px;" class="print-table">
            <el-col :span="6">
              <el-form-item label="（领）借款人：">
                  <span>{{form.applicantUserName || ''}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="项目/部门经理：" style="font-weight: bold;">
                  <span>{{form.xmjlApply || ''}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="财务：" style="font-weight: bold;">
                  <span>{{form.cwApply || ''}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="总经办：" style="font-weight: bold;">
                  <span>{{form.xmjlApply || ''}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <!--endInvoicePasting-->
        </div>
    </el-form>
    <div style="text-align: center;padding-bottom:20px;">
      <button type="button" class="el-button yt-bottom-btn el-button--default" @click='closeClick'>
        <span>关闭</span>
      </button>
    </div>
		</div>
</template>

<script>
import Vue from 'vue';
import axios from '../../../service/http';
import { option } from '../../../static/config';
// import {Print} from '../../../plugins/print'
// Vue.use(Print) // 注册
export default {
  // 数据源
  data () {
    return {
      labelposition: "right",
      pkId: '',
      imgSrc:'',
      form: {
        compName:'', //付款公司
        printYear:'', //年
        printMonth:'', //月
        printDay:'', //日
        expenditureAppNum:'', //支出编号
        expenditureAppName:'', //支出事由
        applicantUserName:'', //申请人
        applicantUserPositionName:'', //职务
        applicantUserDeptName:'', //申请部门
        applicantUserPhone:'',//电话
        specialName:'',//所属项目
        prjName:'', //项目名称
        costTypeName:'', //费用明细
        totalAmount:'',//金额
        totalAmountChinese:'', //金额大写
        xmjlApply:'', //项目经理
        cwApply:'', //财务
        xmjlApply:'', //总经办
        processInstanceId:''
      }
    }
  },
  // 初始化执行
  mounted () {
    if (this.$route.query) {
      this.pkId = this.$route.query.expenditureAppId;
    }
    if (this.pkId) {
      this.getExpenseList();
      // this.rzState();
    }
  },
  // 方法声明
  methods: {
     // 点击关闭按钮关闭页面
     closeClick(){
      if(this.$route.query.jump == '1'){
        // this.$router.replace('/expensesReim/expenseAppDetail')
        this.$router.replace({
        path: "/expensesReim/expenseAppDetail",
        query: {
          pkId:this.$route.query.expenditureAppId,
          approvalState:2,
          // expenditureAppId: this.$route.query.pkId,
          costType: this.$route.query.costType,
          jump:'1'
        }
      });
      }else{
        this.$router.replace('/priorApp/expenditureApp')
      }

    },
      //获取支出单信息
      getExpenseList(){
        this.getExpenseInfo();
        this.getImgSrc();
      },
      getExpenseInfo(){
        //调用axios.post方法
        axios.post(option.base_path + 'sz/expenditureApp/printSpendingFormByExpenditureAppId', {expenditureAppId:this.pkId}).then(data => {
          if(data.data.flag==0){
            this.form =  data.data.data;
            this.form.totalAmountChinese = this.arabiaToChinese(data.data.data.totalAmount);
            this.getWorkFlowLog();
          }
          console.log('返回值', data.data.flag);
        })
        .catch(function (error) {
          console.log(error);
        });
      },
      //获取二维码路径
      getImgSrc(){
        var data = {
          context : option.base_path + 'barCode/expDetail.html?appId='+this.pkId
        }
        //调用axios.post方法
        axios.post(option.base_path + 'fileUpDownload/createQrCode', data).then(data => {
          if(data.data.flag==0){
            var url = option.base_path + 'fileUpDownload/downloadFile?storePath=' + data.data.data + '&isDownload=false';
            this.imgSrc = url;
          }
          console.log('返回值', data.data.flag);
        })
        .catch(function (error) {
          console.log(error);
        })
      },
      //获取审批流信息
      getWorkFlowLog(){
        //调用axios.post方法
        axios.post(option.base_path + 'basicconfig/workFlow/getWorkFlowLog', {processInstanceId:this.form.processInstanceId}).then(data => {
         if(data.data.flag==0){
            var arr =  data.data.data;
            for (var i=0;i<arr.length;i++){
              if(arr[i].tastKey=='activitiStartTask'){
                return false;
              }
              if(arr[i].taskName=='财务审批'&&arr[i].operationState.indexOf('待')==-1){
                this.form.cwApply =  arr[i].userName;
              }else if(arr[i].taskName=='总经办审批'&&arr[i].operationState.indexOf('待')==-1){
                this.form.zjbApply =  arr[i].userName;
              }else if((arr[i].taskName=='项目经理' || arr[i].taskName=='部门经理审批' || arr[i].taskName=='项目经理审批')&&arr[i].operationState.indexOf('待')==-1){
                this.form.xmjlApply =  arr[i].userName;
              }
            }
          }
          console.log('返回值', data.data.flag);
        })
        .catch(function (error) {
          console.log(error);
        });
      },
      //打印信息
      printBtn(){
        //调用执行打印的方法
        this.doPrint();
        //window.print();
        //this.$print(this.$refs.print) // 调用方法使用
      },
      /**
       *
       * 执行打印操作
       *
       */
      doPrint() {
        let bdhtml = this.$refs.print.innerHTML; //获取当前页的html代码
		    // let startInvoicePasting = "<!--startInvoicePasting-->"; //设置打印开始区域
		    // let endInvoicePasting = "<!--endInvoicePasting-->"; //设置打印结束区域
		    // let prnhtml = bdhtml.substr(bdhtml.indexOf(startInvoicePasting)); //从开始代码向后取html
		    // prnhtml = prnhtml.substring(0, prnhtml.indexOf(endInvoicePasting)); //从结束代码向前取html
		    window.document.body.innerHTML = bdhtml;

       // window.focus();
        if(this.isIE()){
          document.body.className += ' ext-ie';
          document.execCommand('print', false, null);
        }else{
          window.print();
        }
        window.document.body.innerHTML = bdhtml; //还原页面
        window.location.reload();
    },
    isIE() {
      if (!!window.ActiveXObject || "ActiveXObject" in window)
        return true;
      else
        return false;
    },
    /**
     *金额转换成中文大写方法
    * @param {Object} Num 金额数字
    */
    arabiaToChinese(Num) {
      Num = Num+"";
      var i = 0;
      for(i = Num.length - 1; i >= 0; i--) {
        Num = Num.replace(",", "") //替换tomoney()中的“,”
        Num = Num.replace(" ", "") //替换tomoney()中的空格
      }
      Num = Num.replace("￥", "") //替换掉可能出现的￥字符
      if(isNaN(Num)) { //验证输入的字符是否为数字
        this.$message('请检查小写金额是否正确');
        return;
      }
      //---字符处理完毕，开始转换，转换采用前后两部分分别转换---//
      var part = String(Num).split(".");
      var newchar = "";
      //小数点前进行转化
      for(i = part[0].length - 1; i >= 0; i--) {
        if(part[0].length > 10) { this.$message('位数过大，无法计算'); return ""; } //若数量超过拾亿单位，提示
        var tmpnewchar = ""
        var perchar = part[0].charAt(i);
        switch(perchar) {
          case "0":
            tmpnewchar = "零" + tmpnewchar;
            break;
          case "1":
            tmpnewchar = "壹" + tmpnewchar;
            break;
          case "2":
            tmpnewchar = "贰" + tmpnewchar;
            break;
          case "3":
            tmpnewchar = "叁" + tmpnewchar;
            break;
          case "4":
            tmpnewchar = "肆" + tmpnewchar;
            break;
          case "5":
            tmpnewchar = "伍" + tmpnewchar;
            break;
          case "6":
            tmpnewchar = "陆" + tmpnewchar;
            break;
          case "7":
            tmpnewchar = "柒" + tmpnewchar;
            break;
          case "8":
            tmpnewchar = "捌" + tmpnewchar;
            break;
          case "9":
            tmpnewchar = "玖" + tmpnewchar;
            break;
        }
        switch(part[0].length - i - 1) {
          case 0:
            tmpnewchar = tmpnewchar + "元";
            break;
          case 1:
            if(perchar != 0) tmpnewchar = tmpnewchar + "拾";
            break;
          case 2:
            if(perchar != 0) tmpnewchar = tmpnewchar + "佰";
            break;
          case 3:
            if(perchar != 0) tmpnewchar = tmpnewchar + "仟";
            break;
          case 4:
            tmpnewchar = tmpnewchar + "万";
            break;
          case 5:
            if(perchar != 0) tmpnewchar = tmpnewchar + "拾";
            break;
          case 6:
            if(perchar != 0) tmpnewchar = tmpnewchar + "佰";
            break;
          case 7:
            if(perchar != 0) tmpnewchar = tmpnewchar + "仟";
            break;
          case 8:
            tmpnewchar = tmpnewchar + "亿";
            break;
          case 9:
            tmpnewchar = tmpnewchar + "拾";
            break;
        }
        newchar = tmpnewchar + newchar;
      }
      //小数点之后进行转化
      if(Num.indexOf(".") != -1) {
        if(part[1].length > 2) {
          this.$message('小数点之后只能保留两位,系统将自动截段');
          part[1] = part[1].substr(0, 2)
        }
        for(i = 0; i < part[1].length; i++) {
          tmpnewchar = ""
          perchar = part[1].charAt(i)
          switch(perchar) {
            case "0":
              tmpnewchar = "零" + tmpnewchar;
              break;
            case "1":
              tmpnewchar = "壹" + tmpnewchar;
              break;
            case "2":
              tmpnewchar = "贰" + tmpnewchar;
              break;
            case "3":
              tmpnewchar = "叁" + tmpnewchar;
              break;
            case "4":
              tmpnewchar = "肆" + tmpnewchar;
              break;
            case "5":
              tmpnewchar = "伍" + tmpnewchar;
              break;
            case "6":
              tmpnewchar = "陆" + tmpnewchar;
              break;
            case "7":
              tmpnewchar = "柒" + tmpnewchar;
              break;
            case "8":
              tmpnewchar = "捌" + tmpnewchar;
              break;
            case "9":
              tmpnewchar = "玖" + tmpnewchar;
              break;
          }
          if(i == 0) tmpnewchar = tmpnewchar + "角";
          if(i == 1) tmpnewchar = tmpnewchar + "分";
          newchar = newchar + tmpnewchar;
        }
      }
      //替换所有无用汉字
      while(newchar.search("零零") != -1)
        newchar = newchar.replace("零零", "零");
      newchar = newchar.replace("零亿", "亿");
      newchar = newchar.replace("亿万", "亿");
      newchar = newchar.replace("零万", "万");
      newchar = newchar.replace("零元", "元");
      newchar = newchar.replace("零角", "");
      newchar = newchar.replace("零分", "");
      if(newchar.charAt(newchar.length - 1) == "元" || newchar.charAt(newchar.length - 1) == "角")
        newchar = newchar + "整";
        //处理如果是无内容的给出--
        if(newchar == "元整"){
          newchar = "--";
        }
      //  document.write(newchar);
      return newchar;
    }
  },
  // 组件注册
  components: {
  }
}
</script>
import axios from '../../../service/http';
import { option } from '../../../static/config';
import '../../../components/money';
<style>
.print-table tr td {
  border: 1px solid #333;
}
#InvoicePasting {
  position: relative;
}
</style>

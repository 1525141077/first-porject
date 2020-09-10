<template>
  <div class="yt-dome-container">
    <!-- 借款单 -->
    <div id="InvoicePasting">
        <el-form
      ref="form"
      :model="form"
      label-width="120px"
      :label-position="labelposition"
      size="small">
			<div style="text-align: left;padding:10px 15px;" acl-code="displayComp">
				<span class="">付款公司：</span>
				<!-- <span class="companyName"></span> -->
			</div>
			<div style="text-align: right;margin:10px 15px;">
				<el-button type="primary" @click="printBtn">打印</el-button>
				<!--<button class="yt-option-btn yt-reset-btn" id="closeBtn" style="margin-left: 15px;">关闭 </button>-->
			</div>
			<div style="height:625px;">
        <section ref="print">
				<!--startInvoicePasting-->
				<table width="1022px" style="margin: 10px 20px;" class="print-table">
					<tbody class="yt-tbody" style="">
						<tr>
							<td colspan="7" style="text-align:left;border:1px solid #FFF;">
								<!--表格头部-->
								<div style="text-align: center;text-decoration:underline;font-size: 26px;">
									<span style="letter-spacing:5px;margin-left: 180px;">（领）借款单</span>
								</div>
							</td>
							<td style="border:1px solid #FFF;text-align: right;padding: 0;">
							<img :src="imgSrc" class="qr-code" style="width: 125px;"/>
							</td>
						</tr>
						<tr>
							<td colspan="6" style="text-align: center;border:1px solid #FFF;border-bottom: 1px solid #000;padding-left: 260px;">
								<div style="display: inline-block; vertical-align: middle;">
									<div style="float: left;width: 100px;"><span class="year">{{form.applicantTime[0]}}{{form.applicantTime[1]}}{{form.applicantTime[2]}}{{form.applicantTime[3]}}</span>年</div>
									<div style="float: left;width: 100px;"><span class="month">{{form.applicantTime[5]}}{{form.applicantTime[6]}}</span>月</div>
									<div style="float: left;width: 100px;"><span class="day">{{form.applicantTime[8]}}{{form.applicantTime[9]}}</span>日</div>
								</div>
							</td>
							<td colspan="2" style="text-align: center;border:1px solid #FFF;border-bottom: 1px solid #000">
								借款单编号：<span id="loanAppNum">{{form.loanAppNum}}</span>
							</td>
						</tr>
						<tr>
							<!--<td style="width: 50px;min-width: 50px;">部门</td>
							<td style="width: 100px;min-width: 100px" class="bill-department"></td>
							<td style="width: 80px;min-width: 80px">经办人</td>
							<td style="width: 120px;min-width: 120px" class="bill-agent"></td>-->
							<td style="width: 100px;min-width: 100px;font-weight: bold;">借款事由</td>
							<td colspan="7" style="">
								<div class="loan-cause" style="width:100%;text-align: left;">{{form.loanAppName}}</div>
							</td>
						</tr>
						<tr>
							<!--<td colspan="5" style="border-bottom:1px solid transparent"></td>-->
							<td style="width: 80px;min-width: 80px;font-weight: bold;">申请人</td>
							<td style="width: 100px;min-width: 100px" class=""><span class="loan-people">{{form.applicantUserName}}</span></td>
							<td style="width: 50px;min-width: 50px;font-weight: bold;">职务</td>
							<td style="width: 100px;min-width: 100px" class=""><span class="loan-post">{{form.applicantUserPositionName}}</span></td>
							<td style="width: 150px;min-width: 150px;font-weight: bold;">申请部门</td>
							<td style="width: 100px;min-width: 100px" class=""><span class="loan-depa">{{form.applicantUserDeptName}}</span></td>
							<td style="width: 50px;min-width: 50px;font-weight: bold;">电话</td>
							<td style="width: 100px;min-width: 100px" class=""><span class="loan-phone">{{form.applicantUserPhone}}</span></td>
							<!--<td style="width: 150px;">单据类别</td>
							<td style="width: 50px;">张数</td>
							<td style="width: 150px;">金额（元）</td>-->
						</tr>
						<tr>
							<td style="font-weight: bold;">所属项目：</td>
							<td colspan="3" class="costTypeNameOne" id="prjType">{{form.type}}</td>
							<td style="font-weight: bold;">项目名称：</td>
							<td colspan="3"><span class="costTypeNameTwo" id="prjName">测试</span></td>
						</tr>
						<tr>
							<td rowspan="2" style="width: 80px;min-width: 80px;font-weight: bold;">借款信息</td>
							<td colspan="7" style="height: 80px;text-align: left;">
								<span class="loanTerm">{{form.loanTerm}}</span><br>
								<span id="specialName">
									
								</span>
							</td>
						</tr>
						<tr>
							<td style="font-weight: bold;">人民币（大写）</td>
							<td colspan="3" class="loan-moeny-chinese">{{form.totalAmountChinese}}</td>
							<td style="font-weight: bold;">金额（元）</td>
							<td colspan="2"><span class="loan-amount">{{form.loanAmount}}</span></td>
						</tr>
					</tbody>
				</table>
            
				<div style="margin-left: 20px;margin-top: 20px;">
					<span>（领）借款人：</span>
					<span class="write-text" id="applicantUserName" >{{form.applicantUserName}}</span>
					<span class="font-wieght-bold" style="margin-left:140px">项目/部门经理：</span>
					<span class="write-text" id="xmjlApply" ></span>
					<span class="font-wieght-bold" style="margin-left:140px">总经办：</span>
					<span class="write-text" id="zjbApply" ></span>
					<span class="font-wieght-bold" style="margin-left:140px">财务：</span>
					<span class="write-text" id="cwApply"></span>
				</div>
				<!--endInvoicePasting-->
        </section> 
			</div>
            </el-form>
		</div>
  </div>
</template>

<script>
import axios from '../../service/http';
import { option } from '../../static/config';
export default {
  // 数据源
  data () {
     return {
        labelposition: "right",
      loanAppId: '',
      imgSrc:'',
      form: {
        
        loanAppName:'', //借款事由
        type:'',//所属项目
        applicantUserName:'',//申请人
        applicantTime:'',//日期
        applicantUserPositionName:'',//职务
        applicantUserPositionCode:'',//职务
        applicantUserDeptName:'',//申请部门
        applicantUserPhone:'',//电话
        printYear:'20', //年
        printMonth:'', //月
        printDay:'', //日
        isSettleInfo:'',
        type:'',//所属项目
        prjName:'',//项目名称
        //借款信息
        loanTerm:'',//停滞时间
        loanAmount:'',//金额
         totalAmountChinese:'', //金额大写
         processInstanceId:''

      },
      formTwo: {
        processInstanceId:'',
        // compName:'', //付款公司
        // printYear:'', //年
        // printMonth:'', //月
        // printDay:'', //日
        // expenditureAppNum:'', //支出编号
        // expenditureAppName:'', //支出事由
        // applicantUserName:'', //申请人
        // applicantUserPositionName:'', //职务
        // applicantUserDeptName:'', //申请部门
        // applicantUserPhone:'',//电话
        // specialName:'',//所属项目
        // prjName:'', //项目名称
        // costTypeName:'', //费用明细
        // totalAmount:'',//金额
        // totalAmountChinese:'', //金额大写
        // xmjlApply:'', //项目经理
        // cwApply:'', //财务
        // xmjlApply:'', //总经办
        // processInstanceId:''
      }
      };
  },
  // 初始化执行
  mounted () {
      if (this.$route.query) {
      this.loanAppId = this.$route.query.loanAppId;
    }
    if (this.loanAppId) {
      this.getExpenseList();
      // this.rzState();
    }
  },
  // 方法声明
  methods: {
      //获取支出单信息
      getExpenseList(){
        this.getExpenseInfo();
        // this.getExpenseInfoTwo();
        this.getImgSrc();
      },
       getExpenseInfo(){
        //调用axios.post方法
        axios.post(option.base_path + 'sz/loanApp/getLoanAppInfoDetailByLoanAppId', {loanAppId:this.loanAppId}).then(data => {
          if(data.data.flag==0){
            this.form =  data.data.data;
            this.form.totalAmountChinese = this.arabiaToChinese(data.data.data.loanAmount);
            this.getWorkFlowLog();
          }
          console.log('返回值', data.data.flag);
        })
        .catch(function (error) {
          console.log(error);
        });
      },
      // getExpenseInfoTwo(){
      //   //调用axios.post方法
      //   axios.post(option.base_path + 'index/getCurrentUserInfo', {loanAppId:this.loanAppId}).then(data => {
      //     if(data.data.flag==0){
      //       this.formTwo =  data.data.data;
      //       // this.form.totalAmountChinese = this.arabiaToChinese(data.data.data.totalAmount);
      //       this.getWorkFlowLog();
      //     }
      //     console.log('返回值', data.data.flag);
      //   })
      //   .catch(function (error) {
      //     console.log(error);
      //   });
      // },
      //获取二维码路径
      getImgSrc(){
        var data = {
          context : option.base_path + 'barCode/expDetail.html?appId='+this.processInstanceId
        }
        //调用axios.post方法
        axios.post(option.base_path + 'fileUpDownload/createQrCode', data).then(data => {
          if(data.data.flag==0){
            var url = option.base_path + 'fileUpDownload/downloadFile?storePath=' + data.data.data + '&isDownload=false';
            this.imgSrc = url;
            //$('.qr-code').attr('src',url);
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
            this.formTwo = data.data.data;
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
            $.each(data.data,function(i,n){
              //如果遇到被打回申请人则后边的数据不做判断
              if(n.tastKey=='activitiStartTask'){
                return false;
              }
              if(n.taskName=='财务审批'&&n.operationState.indexOf('待')==-1){
                $('#cwApply').text(n.userName);
              }else if(n.taskName=='总经办审批'&&n.operationState.indexOf('待')==-1){
                $('#zjbApply').text(n.userName);
              }else if((n.taskName=='项目经理' || n.taskName=='部门经理审批' || n.taskName=='项目经理审批')&&n.operationState.indexOf('待')==-1){
                $('#xmjlApply').text(n.userName);
              }
            });
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
        // window.print();
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
        // this.$message('请检查小写金额是否正确');  
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
  filters:{
moneyFormat (num) {
      if (num) {
        num = Number(num)
        num = (num.toFixed(2) + '').replace(
          /\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,
          '$&,'
        )
      }
      return num || '0.00'
    }
  },
  // 组件注册
  components: {
  }
}
</script>
<style lang="stylus" scoped>

</style>

<template>
  <div class="yt-dome-container">
    <!-- 打印单 -->
    <div id="InvoicePasting">
        <el-form
      ref="form"
      :model="form"
      label-width="120px"
      :label-position="labelposition"
      size="small">
			<div style="text-align: right;margin:10px 15px;">
				<el-button type="primary" style="margin-top:20px"  @click="printBtn">打印</el-button>
				<!--<button class="yt-option-btn yt-reset-btn" id="closeBtn" style="margin-left: 15px;">关闭 </button>-->
			</div>
      <section ref="print">
			<!--startInvoicePasting-->
			<div style="height:625px;padding-left: 10px;">
				<table class="print-table">
					<tbody class="yt-tbody">
						<tr>
							<td colspan="20" style="padding-left:20px;text-align:left;border:1px solid #FFF;border-bottom: 1px solid #000;">
								<!--表格头部-->
								<div>
									<div style="text-align: center;text-decoration:underline;font-size: 26px;">
										<span style="letter-spacing:10px;">单据粘贴</span>单
									</div>
									<div>
										<div style="display: inline-block; margin-left: 380px; vertical-align: middle;">
											<label style="text-align: right;margin:0 100px 15px 0;">支出单据编号：<span id="expenditureAppNum">{{form.expenditureAppNum}}</span></label>
											<div style="float: left;width: 100px;"><span class="year">{{form.printYear}}</span>年</div>
											<div style="float: left;width: 100px;"><span class="month">{{form.printMonth}}</span>月</div>
											<div style="float: left;width: 100px;"><span class="day">{{form.printDay}}</span>日</div>
										</div>
									</div>
								</div>
							</td>
						</tr>
						<tr>
							<td style="width: 50px;min-width: 50px;">部门</td>
							<td style="width: 100px;min-width: 100px" class="bill-department">{{form.applicantUserDeptName}}</td>
							<td style="width: 80px;min-width: 80px">经办人</td>
							<td style="width: 120px;min-width: 120px" class="bill-agent">{{form.applicantUserName}}</td>
							<td style="width: 100px;min-width: 100px">支出事由</td>
							<td colspan="4" style="">
								<div class="bill-cause" style="width: 516px;text-align: left;">
									<span>{{form.expenditureAppName}}</span>
								</div>
							</td>
						</tr>
						<tr>
							<td colspan="6" style="border-bottom:1px solid transparent"></td>
							<td style="width: 150px;">单据类别</td>
							<td style="width: 50px;">张数</td>
							<td style="width: 150px;">金额（元）</td>
						</tr>
						<tr class="travel" v-for="item in form.costData.costNormalList">
              <!-- <div v-for="item2 in item" style="display:inline-block;"> -->
							<td colspan="6" style="border-bottom:1px solid transparent"></td>
							<td class="travelName" v-if="">{{item.typeOfExpenditureName}}</td>
							<td></td>
							<td class="travelMoney">{{item.normalAmount | moneyFormat}}</td>
              <!-- </div> -->
            </tr>
            <tr class="travel" v-for="item in form.costData.costCarfareList">
              <!-- <div v-for="item2 in item" style="display:inline-block;"> -->
							<td colspan="6" style="border-bottom:1px solid transparent"></td>
							<td class="travelName" v-if="item.costCarfareList!=''">城市间交通费</td>
							<td></td>
							<td class="travelMoney">{{item.carfare}}</td>
              <!-- </div> -->
            </tr>
						<tr class="travel"  >
							<td colspan="6" style="border-bottom:1px solid transparent;text-align: left;">说明：</td>
							<td class="travelName"  >
                  <div v-if="form.costData.costHotelList!=''">
                    <span >住宿费</span>
                    </div>
              </td>
							<td></td>
							<td class="travelMoney">
                <div v-if="form.costData.costHotelList!=''">
                    <span >{{add | moneyFormat}}</span>
                    </div>
              </td>
						</tr>
						<tr class="travel" >
							<td colspan="6" style="border-bottom:1px solid transparent;text-align: left;">1.粘贴原始单据是从右至左，先粘贴小张的后粘贴大张的</td>
							<td class="travelName"  >
                <div v-if="form.costData.costOtherList!=''">
                <span >其他</span>
                </div>
              </td>
							<td></td>
							<td class="travelMoney">
                <div v-if="form.costData.costOtherList!=''">
                    <span >{{addTwo | moneyFormat}}</span>
                    </div>
              </td>
						</tr>
						<tr class="travel">
							<td colspan="6" style="border-bottom:1px solid transparent;text-align: left;">2.把原始单据大小相同，票面金额相同的粘贴在一起</td>
							<td class="travelName"></td>
							<td></td>
							<td class="travelMoney"></td>
						</tr>
						<tr class="travel">
							<td colspan="6" style="border-bottom:1px solid transparent;text-align: left;">3.薄纸型原始单据只粘贴左方的票头，一粘贴牢固为妥</td>
							<td class="travelName"></td>
							<td></td>
							<td class="travelMoney"></td>
						</tr>
						<tr class="travel">
							<td colspan="6" style="border-bottom:1px solid transparent;text-align: left;">4.本粘贴单中的说明文字处可以被原始单据粘贴覆盖</td>
							<td class="travelName"></td>
							<td></td>
							<td class="travelMoney"></td>
						</tr>
						<tr class="travel" style="height:35px">
							<td colspan="6" style="border-bottom:1px solid transparent;text-align: left;"></td>
							<td class="travelName"></td>
							<td></td>
							<td class="travelMoney"></td>
						</tr>
						<tr class="travel" style="height:35px">
							<td colspan="6" style="border-bottom:1px solid transparent;text-align: left;"></td>
							<td class="travelName"></td>
							<td></td>
							<td class="travelMoney"></td>
						</tr>
						<tr>
							<td colspan="6"></td>
							<td>合计</td>
							<td class="invoiceNum" >
                <span v-if="form.invoiceNum==''">0</span>
                 <span v-else>{{form.invoiceNum}}</span>
              </td>
							<td class="totalAmount">{{form.totalAmount | moneyFormat}}</td>
						</tr>
					</tbody>
				</table>
			</div>
      </section>
			<!--endInvoicePasting-->
            </el-form>
         </section>
    </div>
    <div style="text-align: center;padding-bottom:20px;">
      <button type="button" class="el-button yt-bottom-btn el-button--default" @click='closeClick'>
        <span>关闭</span>
      </button>
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
      tableData:[],
      add:0,
      addTwo:0,
      form: {
        applicantUserDeptName:'', //部门
        applicantUserName:'',//经办人
        expenditureAppName:'',//支出事由
        totalAmount:'',//金额
        expenditureAppNum:'',//单据编号
        printDay:'',
        printMonth:'',
        printYear:'',
        costData: ''

      },
      };
  },
  // 初始化执行
  mounted () {
      if (this.$route.query) {
      this.expenditureAppId = this.$route.query.expenditureAppId;
    }
    if (this.expenditureAppId) {
      this.getExpenseList();
      // this.rzState();
    }
  },
  // 方法声明
  methods: {
    // 点击关闭按钮关闭页面
    closeClick(){
      if(this.$route.query.jump == '1'){
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
        this.getExpenseInfoTwo();
        this.getImgSrc();
      },
       getExpenseInfo(){
        //调用axios.post方法
        axios.post(option.base_path + 'sz/expenditureApp/printInvoicePastingByExpenditureAppId', {expenditureAppId:this.expenditureAppId}).then(data => {
           this.tableData = data.data.data;
           console.log('0002222会哈是的ss',this.tableData.costData.costHotelList)
           this.tableData.costData.costHotelList.forEach((item,i)=>{
              console.log("颠三倒四多所多",item.hotelExpense)
              // this.add=item.hotelExpense[i]
              //  console.log("撒的发生深V",this.add)
              var money=Number(item.hotelExpense)
              this.add+=money

           })
           this.tableData.costData.costOtherList.forEach((item,i)=>{
              // console.log("颠三倒四多所多",item.hotelExpense)
              // this.add=item.hotelExpense[i]
              //  console.log("撒的发生深V",this.add)
              var money=parseInt(item.reimAmount)
              this.addTwo+=money

           })

          if(data.data.flag==0){
            this.form =  data.data.data;
            this.form.totalAmountChinese = this.arabiaToChinese(data.data.data.loanAmount);
            this.getWorkFlowLog();

          }
          console.log('返回值555666', data.data.flag);
        })
        .catch(function (error) {
          console.log(error);
        });
      },
      getExpenseInfoTwo(){
        //调用axios.post方法
        axios.post(option.base_path + 'index/getCurrentUserInfo', {expenditureAppId:this.expenditureAppId}).then(data => {
          if(data.data.flag==0){
            this.formTwo =  data.data.data;
            // this.form.totalAmountChinese = this.arabiaToChinese(data.data.data.totalAmount);
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
        axios.post(option.base_path + 'basicconfig/workFlow/getWorkFlowLog', {expenditureAppId:this.form.expenditureAppId}).then(data => {
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

<template>
  <div style="background-color: white;min-height: 100%;min-width: 1050px;">

      <div id="InvoicePasting">
        <input type="text" class="code-inpu" style="display: none;">
        <div style="text-align: right;margin:10px 15px;">
          <el-button type="primary" style="margin-top: 10px;" @click="printBtn">打印</el-button>
          <!--<button class="yt-option-btn yt-reset-btn" id="closeBtn" style="margin-left: 15px;">关闭 </button>-->
        </div>
        <!--startInvoicePasting-->
        <section ref="print">
          <!-- 表头 -->
        <table width="1022px" style="margin: 10px 20px;" class="expenditure-receivables">
          <tbody class="yt-tbody">
            <tr style="border-right: 0px;">
              <td colspan="5" style="padding-left:20px;text-align:left;border:1px solid #FFF;">
                <!--表格头部-->
                <div style="text-align: center;text-decoration:underline;font-size: 26px;">
                  <span style="letter-spacing:5px;width: 190px;margin-left: 325px;">支出凭单(明细)</span>
                </div>
              </td>
              <td colspan="2" style="border:1px solid #FFF;text-align: right;padding: 0;">
                <img :src="imgSrc" class="qr-code" style="width: 125px;"/>
              </td>
            </tr>
            <tr style="border-right: 0px;">
              <td colspan="5" style="text-align: center;border:1px solid #FFF;border-bottom: 1px solid #000;padding-left: 345px;">
                <div style="display: inline-block; vertical-align: middle;">
                  <div style="float: left;width: 100px;"><span class="year">{{form.printYear}}</span>年</div>
                  <div style="float: left;width: 100px;"><span class="month">{{form.printMonth}}</span>月</div>
                  <div style="float: left;width: 100px;"><span class="day">{{form.printDay}}</span>日</div>
                </div>
              </td>
              <td colspan="2" style="border:1px solid #FFF;border-bottom: 1px solid #000;text-align: right;">
                <label style="text-align: right;margin:0 0px 15px 0;">支出申请编号：<span id="expenditureAppNum">{{form.expenditureAppNum}}</span></label>
              </td>
            </tr>
            <tr>
              <td colspan="7" style="width: 100px;min-width: 100px;text-align: left;font-weight: bold;">
                支出收款方总金额:<span >{{form.expTotalAmount | moneyFormat }}</span>
              </td>
            </tr>
            <tr>
              <td rowspan="5" style="width: 10px;font-weight: bold;" class="receivables-detailed">
                收款方明细
              </td>
              <td style="font-weight: bold;">
                收款方名称
              </td>
              <td style="font-weight: bold;">
                支付<br>方式
              </td>
              <td style="font-weight: bold;">
                金额（元）
              </td>
              <td style="font-weight: bold;">
                银行名称
              </td>
              <td style="font-weight: bold;">
                账户
              </td>
            </tr>
            <tr v-for='item in form.expReceivablesList'>
              <td>{{item.receivablesName}}</td>
              <td>{{item.receivablesType}}</td>
              <td>{{item.amount}}</td>
              <td>{{item.openBank}}</td>
              <td>{{item.accounts}}</td>
            </tr>
          </tbody>
        </table>
        <!--用户基本信息-->
        <table width="1022px" style="margin: 10px 20px;" class="">
          <tbody class="yt-tbody">
            <tr>
              <td rowspan="2" width="100px" style="font-weight: bold;">基本信息</td>
              <td width="100px" style="font-weight: bold;">申请人</td>
              <td><span class="applicantUserName">{{form.applicantUserName}}</span></td>
              <td width="100px" style="font-weight: bold;">电话</td>
              <td><span class="applicantUserPhone">{{form.applicantUserPhone}}</span></td>
              <td width="100px" style="font-weight: bold;">单据样式</td>
              <td><span class="costTypeName">{{form.costTypeName}}</span></td>
            </tr>
            <tr>
              <td style="font-weight: bold;">所属项目</td>
              <td><span class="specialName">{{form.specialName}}</span></td>
              <td style="font-weight: bold;">项目名称</td>
              <td colspan="3"><span class="prjName">{{form.prjName}}</span></td>
            </tr>
          </tbody>
        </table>
        <!--普通-->
        <table width="1022px" v-if="form.costType == 'NORMAL_APPLY' " style="margin: 10px 20px;" class="cost-detailed-table">
          <tbody class="yt-tbody">
            <tr>
              <td colspan="4" style="border-left:1px solid transparent; border-right:1px solid transparent; border-top:1px solid transparent;text-align: left;">
                <label style="font-weight: bold;">支出费用总金额：<span>{{form.totalAmount| moneyFormat }}</span></label>
              </td>
            </tr>
            <tr>
              <td rowspan="10" style="font-weight: bold;width: 100px;" class="cost-detailed">
                费用明细
              </td>
              <td style="font-weight: bold;">
                支出类型
              </td>
              <td style="font-weight: bold;">
                支出费用内容
              </td>
              <td style="font-weight: bold;width: 150px;">
                金额（元）
              </td>
              <td style="font-weight: bold;">
                特殊说明
              </td>
            </tr>
            <tr v-for='item in form2.normalDetailsList'>
              <td>
                {{item.typeOfExpenditureName}}
              </td>
              <td>{{item.normalName}}</td>
              <td><span>{{item.amount| moneyFormat }}</span></td>
              <td>{{item.remarks}}</td>
            </tr>
          </tbody>
        </table>
        <!--差旅-->
        <table width="1022px" v-else-if="form.costType =='TRAVEL_APPLY' " style="margin: 10px 20px;" >
          <tbody class="yt-tbody">
            <tr>
              <td colspan="4" style="border-left:1px solid transparent; border-right:1px solid transparent; border-top:1px solid transparent;text-align: left;">
                <label style="font-weight: bold;">支出费用总金额：<span>{{form.totalAmount| moneyFormat }}</span></label>
              </td>
            </tr>
            <!-- v-for='item in form.travelInfoList' -->
            <tr v-for='item in form.travelInfoList'>
              <td colspan="2" style="font-weight: bold;width: 100px;">
                出差行程信息
              </td>
                <td style="text-align: left;" colspan="8">
                    {{item.startTime}}
                    &nbsp;至&nbsp;
                    {{item.endTime}}
                    &nbsp;
                    出差地点：
                    {{item.travelAddressName}}
                    &nbsp;出差人：
                    {{item.travelPersonnelsName}}
                </td>
            </tr>
            <tr>
              <td colspan="2" style="font-weight: bold;">
                起止地点
              </td>
              <td rowspan="2" style="font-weight: bold;">
                出差人数
              </td>
              <td rowspan="2" style="font-weight: bold;">
                城市间交通费
              </td>
              <td rowspan="2" style="font-weight: bold;">
                住宿费
              </td>
              <!--<td rowspan="2" style="font-weight: bold;">
                补助
              </td>-->
              <td colspan="2" style="font-weight: bold;">
                其他费用
              </td>
            </tr>
            <tr>
              <td style="font-weight: bold;">
                起
              </td>
              <td style="font-weight: bold;">
                止
              </td>
              <td style="font-weight: bold;">
                项目
              </td>
              <td style="font-weight: bold;">
                金额
              </td>
            </tr>
            <tr v-for='item in list'>
              <td>{{item.goAddressName}}</td>
              <td>{{item.arrivalAddressName}}</td>
              <td>{{item.personNum}}</td>
              <td style="text-align: right;"><span>{{item.crafare| moneyFormat2 }}</span></td>
              <td style="text-align: right;"><span>{{item.hotelAmount| moneyFormat2 }}</span></td>
              <td style="font-weight: bold;">{{item.projectName}}</td>
              <td id="cityFare" style="text-align: right;"><span>{{item.cityFare| moneyFormat }}</span></td>
            </tr>
          </tbody>
        </table>
        <!--财务-->
        <table width="1022px" v-else-if="form.costType =='FINANCIAL_ADMINISTRATION' " style="margin: 10px 20px;" class="financial-detailed-table">
          <tbody class="yt-tbody">
            <tr>
              <td colspan="4" style="border-left:1px solid transparent; border-right:1px solid transparent; border-top:1px solid transparent;text-align: left;">
                <label style="font-weight: bold;">支出费用总金额：<span>{{form.totalAmount| moneyFormat }}</span></label>
              </td>
            </tr>
            <tr>
              <td rowspan="10" style="font-weight: bold;width: 100px;" class="financial-detailed">
                费用明细
              </td>
              <td style="font-weight: bold;">
                支出类型
              </td>
              <td style="font-weight: bold;">
                支出费用内容
              </td>
              <td style="font-weight: bold;width: 150px;">
                金额（元）
              </td>
              <td style="font-weight: bold;">
                特殊说明
              </td>
              <td style="font-weight: bold;">
                是否报销
              </td>
            </tr>
            <tr v-for = 'item in form.normalDetailsList'>
              <td>{{item.typeOfExpenditureName}}</td>
              <td>{{item.normalName}}</td>
              <td>{{item.amount}}</td>
              <td>{{item.remarks}}</td>
              <td>
                <span v-if="item.isReimburse == '1' ">是</span>
                <span v-else-if="item.isReimburse == 'undefined' ">否</span>
              </td>
            </tr>
          </tbody>
        </table>
        <!--培训-->
        <!-- <table width="1022px" style="margin: 10px 20px;display: none;" class="train-detailed-table">
          <tbody class="yt-tbody">
            <tr>
              <td colspan="7" style="border-left:1px solid transparent; border-right:1px solid transparent; border-top:1px solid transparent;text-align: left;">
                <label style="font-weight: bold;">支出费用总金额：<span class="train-total-amount">￥3,200.00</span></label>
              </td>
            </tr>
            <tr style="border-top:1px solid #000 ;">
              <td class="payment-detail-tby" style="width: 10px;font-weight: bold;" rowspan="19">支出费用明细</td>
              <td style="text-align: left" colspan="6">
                师资费总金额￥<span id="teachersAmount">15,900.00</span>
              </td>
            </tr>
            <tr>
              <td style="font-weight: bold;">讲师名称</td>
              <td style="font-weight: bold;">税前课酬金额（元）</td>
              <td style="font-weight: bold;">税后课酬金额（元）</td>
              <td style="font-weight: bold;">住宿费（元）</td>
              <td style="font-weight: bold;">城市间交通费（元）</td>
              <td style="font-weight: bold;">伙食费（元）</td>
            </tr>

            <tr class="train-all-money">
              <td style="text-align: left;font-weight: bold;" colspan="6">
                培训费其他总金额￥<span class="train-other-money"></span>
              </td>
            </tr>
            <tr class="train-other">
              <td style="font-weight: bold;" colspan="2">支出费用内容</td>
              <td style="font-weight: bold;" colspan="2">金额（元）</td>
              <td style="font-weight: bold;" colspan="2">特殊说明</td>
            </tr>

          </tbody>
        </table> -->
        <!--会议-->
        <!-- <table width="1022px" style="margin: 10px 20px;display: none;" class="meeting-table">
          <tbody class="yt-tbody">
            <tr>
              <td colspan="4" style="border-left:1px solid transparent; border-right:1px solid transparent; border-top:1px solid transparent;text-align: left;">
                <label style="font-weight: bold;">支出费用总金额：<span class="meeting-total-amount"></span></label>
              </td>
            </tr>
            <tr>
              <td style="font-weight: bold;width: 100px;">会议名称</td>
              <td colspan="5" class="meeting-name" style="text-align: left;"></td>
            </tr>
            <tr>
              <td style="font-weight: bold;width: 100px;">会议分类</td>
              <td style="width: 100px;" class="meeting-type"></td>
              <td style="font-weight: bold;width: 100px;">会议起止日期</td>
              <td colspan="3" class="meeting-data"></td>
            </tr>
            <tr>
              <td style="font-weight: bold;width: 100px;">会议地点</td>
              <td class="meeting-place"></td>
              <td style="font-weight: bold;width: 100px;">参会人数</td>
              <td class="meeting-number"></td>
              <td style="font-weight: bold;width: 100px;">工作人员数量</td>
              <td class="job-number"></td>
            </tr>
            <tr>
              <td style="font-weight: bold;width: 100px;" colspan="2">住宿费（元）</td>
              <td style="font-weight: bold;width: 100px;" colspan="2">伙食费（元）</td>
              <td style="font-weight: bold;width: 100px;" colspan="2">其他费用（元）</td>
            </tr>
            <tr>
              <td style="text-align: right;" colspan="2" class="hotel-expense"></td>
              <td style="text-align: right;" colspan="2" class="food-expense"></td>
              <td style="text-align: right;" colspan="2" class="other-expense"></td>
            </tr>
            <tr>
              <td style="font-weight: bold;" colspan="3">人均日均费用金额（元/人·天）</td>
              <td style="text-align: right;" colspan="3" class="average-expense"></td>
            </tr>
          </tbody>
        </table> -->
        <!--公务接待-->
        <!-- <table width="1022px" style="margin: 10px 20px;display: none;" class="reception-table">
          <tbody class="yt-tbody">
            <tr>
              <td colspan="4" style="border-left:1px solid transparent; border-right:1px solid transparent; border-top:1px solid transparent;text-align: left;">
                <label style="font-weight: bold;">支出费用总金额：<span class="reception-total-amount"></span></label>
              </td>
            </tr>
            <tr>
              <td rowspan="2" style="width: 10px;font-weight: bold;" class="expenditure-receivables-detailed">
                支出费用明细
              </td>
              <td style="font-weight: bold;" colspan="2">
                接待对象人数
              </td>
              <td colspan="3" class="recipients-number"></td>
            </tr>
            <tr>
              <td style="font-weight: bold;">公务活动项目</td>
              <td style="font-weight: bold;">日期</td>
              <td style="font-weight: bold;">费用明细</td>
              <td style="font-weight: bold;">金额（元）</td>
              <td style="font-weight: bold;">陪同人数</td>
            </tr>
          </tbody>
        </table> -->
        <!--流程-->
        <table width="1022px" style="margin: 20px 20px;" class="approval-record-table">
          <tbody class="yt-tbody">
            <tr>
              <td width="20px" rowspan="15" class="approval-record" style="font-weight: bold;">
                审<br>批<br>记<br>录
              </td>
              <td style="width: 30px;font-weight: bold;">序号</td>
              <td style="font-weight: bold;">审批人</td>
              <td style="font-weight: bold;">审批信息</td>
            </tr>
            <!-- v-if="form.recordOfApprovalList==undefined" -->
            <tr v-for='(item,index) in tabledata'>
              <td>{{index + 1}}</td>
              <td style="text-align: left;">【{{item.nodeName}}】<br/>——{{item.nodeUserName}}</td>
              <td style="text-align: left;">{{item.approvaDate}}&nbsp;&nbsp;&nbsp;{{item.approvaState}}，意见：{{item.approvaRemarks?item.approvaRemarks:"无"}}</td>
            </tr>
          </tbody>
        </table>
        <!--endInvoicePasting-->
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
import {option} from '../../static/config.js'
import {cloneData} from '../../static/commonTool.js'
export default {
  // 数据源
  data () {
    return {
      labelposition: "right",
      pkId: '',
      item:'',
      imgSrc:'',
      dataTwo:'',
      approvaState:'',
      form: {
        compName:'', //付款公司
        applicantUserDeptName: '',//部门
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
        expTotalAmount: '',//支出收款总金额
        normalTotalAmount: '',//支出费用总金额
        xmjlApply:'', //项目经理
        cwApply:'', //财务
        xmjlApply:'', //总经办
        processInstanceId:'',
        expReceivablesList: [],//收款方明细
        normalDetailsList: [],//费用明细
        recordOfApprovalList: [],//审批日志
        travelInfoList: [],
        travelCostList: [],
        meetOther: '',
        costType:'',
        tranvelPersonneleName:'',
      },

      form2:{
        normalDetailsList:[]
      },
      list:[{
        code: 'cityFare',
        projectName: '市内车费',
        cityFare: 0,
      },
      {
        code: 'postFee',
        projectName: '邮电费',
        cityFare: 0
      },
      {
        code: 'officeSupplies',
        projectName: '办公用品费',
        cityFare: 0
      },
      {
        code: 'unSleeperSubsidy',
        projectName: '不买卧铺的补贴',
        cityFare: 300
      },
      {
        code: 'accidentFee',
        projectName: '交通意外险',
        cityFare: 300
      },
      {
        code: 'mealFee',
        projectName: '餐费',
        cityFare: 300
      },
      {
        code: 'other',
        projectName: '其他',
        cityFare: 300
      }
    ],
    tabledata:[
      // {},
      // {},
      // {},
      // {}
    ],
    tabledata1:[],
    aaa:[]
    }
  },
  beforeCreate() {
    console.log('正在初始化组件')
  },
  created() {
    console.log('开始初始化')
  },
  // 初始化执行
  mounted () {
    console.log('mounted')
    if (this.$route.query) {
      this.pkId = this.$route.query.expenditureAppId;
      this.costType=this.$route.query.costType;
      console.log(this.form);
    }
    if (this.pkId) {
        this.getImgSrc();
        this.getExpenseInfo();
        this.getExpenseInfotwo();
        console.log(this.form);
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
      getExpenseInfo(){
        let that =this
        //调用axios.post方法
        // sz/expenditureApp/printSpendingFormDetailsFinanceByExpenditureAppId
        // sz/expenditureApp/printSpendingFormDetailsByExpenditureAppId
        // sz/expenditureApp/printTravelExpensesByExpenditureAppId
        axios.post(option.base_path + 'sz/expenditureApp/printTravelExpensesByExpenditureAppId',
        {expenditureAppId:this.pkId}).then(data => {
          if(data.data.flag==0){
            let datas = data.data.data;
            that.form = data.data.data;
            let list = cloneData(this.list)
            // 流程显示
            let a = datas.recordOfApprovalList[0].approvaInfoList
            console.log(a)
            that.tabledata = []
            datas.recordOfApprovalList.forEach((n,i) => {
              // debugger
              that.aaa = n.approvaInfoList
              that.tabledata.push({
                approvaDate : that.aaa[0].approvaDate,
                approvaState: that.aaa[0].approvaState,
                approvaRemarks: that.aaa[0].approvaRemarks,
                nodeName : n.nodeName,
                nodeUserName : n.nodeUserName
              })
            })
            that.tabledata = datas.recordOfApprovalList;
            //获取差率费
            list.forEach(n => {
              n.cityFare = datas[n.code]
            });
            datas.travelCostList.forEach((n,i) => {
              list[i].goAddressName = n.goAddressName
              list[i].arrivalAddressName = n.arrivalAddressName
              list[i].personNum = n.personNum
              list[i].crafare = n.crafare
              list[i].cityFare = n.cityFare
            })
            list[0].hotelAmount = datas.hotelAmount
            this.list = list
            this.getWorkFlowLog();
          }

          console.log('返回值', data.data.flag);
        })
        .catch(function (error) {
          console.log(error);
        });
      },
      getExpenseInfotwo(){
        axios.post(option.base_path + 'sz/expenditureApp/printSpendingFormDetailsByExpenditureAppId',
        {expenditureAppId:this.pkId}).then(data => {
          console.log('返回值ASas',this.pkId);
          if(data.data.flag==0){
            this.form2 =data.data.data;
            console.log( this.form2.normalDetailsList.isReimburse,"asdasdasdadasdadasdas")

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
        let data = {
          context : option.base_path + 'expensesReim/expenseAppDetail.vue?appId='+this.pkId
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
      // //获取审批流信息
      // getWorkFlowLog(){
      //   //调用axios.post方法
      //   axios.post(option.base_path + 'basicconfig/workFlow/getWorkFlowLog', {processInstanceId:this.form.processInstanceId}).then(data => {
      //    if(data.data.flag==0){
      //       var arr =  data.data.data;
      //       for (var i=0;i<arr.length;i++){
      //         if(arr[i].tastKey=='activitiStartTask'){
      //           return false;
      //         }
      //         if(arr[i].taskName=='财务审批'&&arr[i].operationState.indexOf('待')==-1){
      //           this.form.cwApply =  arr[i].userName;
      //         }else if(arr[i].taskName=='总经办审批'&&arr[i].operationState.indexOf('待')==-1){
      //           this.form.zjbApply =  arr[i].userName;
      //         }else if((arr[i].taskName=='项目经理' || arr[i].taskName=='部门经理审批' || arr[i].taskName=='项目经理审批')&&arr[i].operationState.indexOf('待')==-1){
      //           this.form.xmjlApply =  arr[i].userName;
      //         }
      //       }
      //       $.each(data.data,function(i,n){
      //         //如果遇到被打回申请人则后边的数据不做判断
      //         if(n.tastKey=='activitiStartTask'){
      //           return false;
      //         }
      //         if(n.taskName=='财务审批'&&n.operationState.indexOf('待')==-1){
      //           $('#cwApply').text(n.userName);
      //         }else if(n.taskName=='总经办审批'&&n.operationState.indexOf('待')==-1){
      //           $('#zjbApply').text(n.userName);
      //         }else if((n.taskName=='项目经理' || n.taskName=='部门经理审批' || n.taskName=='项目经理审批')&&n.operationState.indexOf('待')==-1){
      //           $('#xmjlApply').text(n.userName);
      //         }
      //       });
      //     }
      //     console.log('返回值', data.data.flag);
      //   })
      //   .catch(function (error) {
      //     console.log(error);
      //   });
      // },
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
      if (!!window.ActiveXObject || "ActiveXObject" in window){
        return true;
      }else{
        return false;
      }
    },
  },
   filters:{
    moneyFormat (num) {
      if (num) {
        num = Number(num)
        num = (num.toFixed(2) + '').replace(
          /\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,
          '$&,'
        )
      }
      return num || '0.00'
    },
    moneyFormat2 (num) {
          if (num) {
            num = Number(num)
            num = (num.toFixed(2) + '').replace(
              /\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,
              '$&,'
            )
          }
          return num
        }
  },
  // 组件注册
  components: {
  }
}
</script>
<style scoped>
.print-table tr td{
  border: 1px solid #333;
}
</style>

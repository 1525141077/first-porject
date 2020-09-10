<template>
  <div class="cbm">
      <top-tip>
          <div class="title">项目工时概览</div>
      </top-tip>
      <el-table
      ref="dataTable"
        :data="costList"
        border
        highlight-current-row
        @row-click="rowClick"
        style="width: 100%">
        <el-table-column
        prop="projectForshot"
        label="项目简称"
        align="center"
        show-overflow-tooltip
        width="180">
        </el-table-column>
        <el-table-column
        prop="projectManager"
        label="项目经理"
        align="center"
        width="180">
        </el-table-column>
        <!-- <el-table-column
        prop="budgetMoney"
        align="right"
        label="项目预算（元）">
        <template slot-scope="scope">
            {{scope.row.budgetMoney | moneyFilter}}
        </template>
        </el-table-column>
        <el-table-column
        prop="recognizedPersonnelCosts"
        align="right"
        label="已确认人员成本（元）">
        <template slot-scope="scope">
            {{scope.row.recognizedPersonnelCosts | moneyFilter}}
        </template>
        </el-table-column> -->
        <el-table-column
        prop="workAverage"
        align="left"
        label="已确认工作量（人天）">
            <template slot-scope="scope">
                {{scope.row.workAverage | conversion}}
            </template>
        </el-table-column>
        <el-table-column
        prop="confirmedSumWorkHours"
        align="left"
        label="已确认工时（小时）">
        </el-table-column>
        <el-table-column
        prop="notConfirmedSumWorkHours"
        align="center"
        label="未确认工时（小时）">
        </el-table-column>
        <el-table-column
        prop="toBeConfirmedSumWorkHours"
        align="center"
        label="待确认工时（小时）">
        </el-table-column>
    </el-table>
    <div class="yt-sec-title">
        <label class="yt-sec-title-line"></label>
        <!--可手动修改标题名称,不可修改引用的类名-->
        <label class="yt-sec-title-text">待确认工时明细：</label>
    </div>
    <el-table
        :data="timeList"
        border
        style="width: 100%">
        <el-table-column
        prop="workDate"
        label="日期"
        align="center"
        width="150">
        </el-table-column>
        <el-table-column
        prop="realName"
        label="填报人"
        align="center"
        width="120">
        </el-table-column>
        <el-table-column
        prop="projectWork"
        align="center"
        width="130"
        label="工作项">
        </el-table-column>
        <el-table-column
        prop="projectForshot"
        align="center"
        show-overflow-tooltip
        label="项目简称">
        </el-table-column>
        <el-table-column
        prop="reportHour"
        align="left"
        width="130"
        label="上报工时(小时)">
        <template slot-scope="scope">
                {{scope.row.reportHour | conversion}}
            </template>
        </el-table-column>
        <el-table-column
        prop="confirmHours"
        align="left"
        width="130"
        label="确认工时(小时)">
        <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.workHours"></el-input>
        </template>
        </el-table-column>
        <el-table-column
        prop="description"
        show-overflow-tooltip
        label="工作内容">
        </el-table-column>
    </el-table>
    <div style="text-align:center;margin:20px 0;">
        <el-button @click="ConfirmHour"  class="yt-bottom-btn" type="primary" :loading="btnLoading">确认当前工时</el-button>
        <el-button class="yt-bottom-btn" type="info" style="margin-top: 30px;" @click="print">返回</el-button>
    </div>
  </div>
</template>

<script>
import topTip from '@/components/topTip'
import req from '@/service/http'
export default {
    data(){
        return{
            projectId: '',
            btnLoading: false,
            costList:[],
            timeList: [],
            rowNum: 0
        }
    },
    mounted () {
        let queryParams = this.$route.query
        this.projectId = queryParams.projectId
        // 页面数据初始化
        this.getListAll('')
    },
    created(){
    },
    methods:{
        print(){
        this.$router.push({ 
            path: '/projectManagerOperating/projectManagerPage',
            // query: params
            })
        },
        // 点击列表行
        rowClick (row, column, event) {
            let rowNum = this.rowNum
            if (row.indexType) {
                // 显示当前项目
                this.getList(row.projectCode)
                this.rowNum = row.index
                this.costList[row.index - 1].indexType = false
                if (rowNum !== 0) {
                    this.costList[rowNum - 1].indexType = true
                }
            } else {
                this.getListAll('')
                this.costList[row.index - 1].indexType = true
            }
        },
        // 页面数据初始化
        getListAll(projectId){
            let param = {
                projectId: projectId
            }
            req({
                url: 'ims/workHours/getProjectManagerWorkHours',
                params: param
            }).then((result) => {
                // 无值
                this.costList = result.data.data.costList
                if (this.costList.length !== 0) {
                    this.costList.forEach((n, i) => {
                        this.$set(n, 'index', i + 1)
                        this.$set(n, 'indexType', true)
                    })
                }
                this.timeList = result.data.data.timeList
                if (this.timeList.length !== 0) {
                    this.timeList.forEach(n => {
                        n['reportHour'] = n.workHours
                    })
                }
                this.costList.some(n => {
                    if (n.projectCode == this.projectId) {
                        this.$refs.dataTable.setCurrentRow(n)
                        return true
                    }
                })
                if (this.projectId && this.projectId !== '') {
                    this.getList(this.projectId)
                }
            }).catch((err) => {

            });
        },
        // 选中行过滤
        getList(projectId){
            let param = {
                projectId: projectId
            }
            req({
                url: 'ims/workHours/getProjectManagerWorkHours',
                params: param
            }).then((result) => {
                if (projectId === '') {
                    // 无值
                    this.costList = result.data.data.costList
                    if (this.costList.length !== 0) {
                        this.costList.forEach((n, i) => {
                            this.$set(n, 'index', i + 1)
                            this.$set(n, 'indexType', true)
                        })
                    }
                }
                this.timeList = result.data.data.timeList
                if (this.timeList.length !== 0) {
                    this.timeList.forEach(n => {
                        n['reportHour'] = n.workHours
                    })
                }
                this.projectId = ''
            }).catch((err) => {

            });
        },
        ConfirmHour() {
            this.btnLoading = true
            let workHourStateJson = []
            this.timeList.map(item=>{
                workHourStateJson.push({
                    code: item.id,
                    confirmHours: item.workHours.toString()
                })
            })
            req({
                url: 'ims/workHours/updateWorkHoursStateByIds',
                data: {
                    workHourStateJson:JSON.stringify(workHourStateJson)
                },
                method: 'post'
            }).then(result=>{
                this.btnLoading = false
                this.$message({
                    message: '信息保存成功',
                    type: 'success'
                })
                this.getList('')
            }).catch(error=>{
                this.$message({
                    message: '网络或系统异常，请联系相关负责人！',
                    type: 'error'
                })
            })
        }
    },
    filters:{
        // 格式化金额
        moneyFilter (s, n) {
            let lose = ''; //负号
            // 判断是否是数字
            if (typeof s !== 'number' && isNaN(s)) {
                return ''
            }
            if(s != undefined && s != "") {
                if(s < 0) { //判断是否是负数
                    s = (s + '').substring(1); //截取-号
                    lose = '-';
                }
                n = n > 0 && n <= 20 ? n : 2;
                s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
                let l = s.split(".")[0].split("").reverse(),
                    r = s.split(".")[1];
                let t = "";
                for(let i = 0; i < l.length; i++) {
                    t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
                }
                return lose + '' + t.split("").reverse().join("") + "." + r; //拼接
            }else if (s == '') {
                return "";
            } else if(s == 0){
                return "0.00"; //拼接
            }
        },
        // conversion(val) {
        //     return parseInt(val)
        // }
    },
    components:{
        topTip
    }
}
</script>

<style scoped>
.el-tooltip__popper {
  max-width: 1000px;
}
.cbm{
    background-color: #fff;
    min-height: 100%;
    padding-bottom: 20px;
}
.title{
    position: absolute;
    left: 35px;
    color: #417095;
    font-size: 16px;
    font-weight: bold;
}
.yt-sec-title {
    padding-top: 10px;
    position: relative;
    padding-bottom: 20px;
}
.yt-sec-title-line {
    border-left: 5px solid #244972;
    border-radius: 10px;
    vertical-align: middle;
}
.yt-sec-title-text {
    margin-left: 10px;
    color: #003465;
    font-size: 16px;
    font-weight: bold;
    vertical-align: middle;
}
.defaultBtn{
    background-color: #417095;
    color: #fff;
    height: 40px;
    line-height: 40px;
    padding: 0 30px;
    font-size: 18px;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    outline: none;
}
.defaultBtn:hover{
    opacity: 0.8;
	filter: alpha(opacity=80);
}
</style>

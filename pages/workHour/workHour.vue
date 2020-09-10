<template>
  <div class="workHour">
      <div class="header">
            <div class="calendarDiv">
              <Calendar
              :nowDate = "nowDate"
              :sundayStart = "sundayStart"
              :markDateMore = "monthHoliday"
              @choseDay="chooseDay"
              @changeMonth="changeMonth"
              :versionGroup = "versionGroup"
              ref="calendar"></Calendar>
            </div>
            <div class="warnInfo">
                <div class="warn_text1">本月填写情况(小时)</div>
                <div class="warn_text2">
                    已填<label class="current_work_hours">{{currentWorkHours}}</label>/应填<label class="not_time">{{notTime}}</label>
                </div>
                <div class="yt-three-title">
                    工时填报规则
                </div>
                <ul class="ul-box">
                    <li>
                        <span class="round">●</span>下方带有“<span style="color: red;">_____</span>”为未填写工时或未写满8小时
                    </li>
                    <li>
                        <span class="round">●</span>未在项目上的任务或学习不允许填报工时
                    </li>
                    <li>
                        <span class="round">●</span>只允许补填前三天的工时,超时不允许修改
                    </li>
                    <li>
                        <span class="round">●</span>点击日期，可查看当天填报信息
                    </li>
                </ul>
            </div>
      </div>
      <div class="editDIv">
            <top-tip>
              <div class="title">
                  请选择工作项并填写工时信息：
              </div>
            </top-tip>
            <div class="div_edit">
                <el-row>
                    <el-col :span="24">
                        <label class="red">*</label>
                        <label class="readText"><label style="letter-spacing: 15px;">工作</label>项：</label>
                        <div class="font-box" :class="{'active-div':item.isShow}" v-for="(item,index) in workPro" :key="index" @click="workProClick(item)">{{item.name}}</div>
                    </el-col>
                </el-row>
                <el-row style="margin-top:20px;">
                    <el-col :span="24">
                        <label class="readText"><label>主要工作内</label>容：</label>
                        <label class="readText">{{workDescription}}</label>
                    </el-col>
                </el-row>
                <el-row style="margin-top:20px;text-align:center;">
                    <el-col :span="24">
                        <el-button class="defaultBtn"  :disabled="!tableIsUpdate" @click="addWorkList">加入列表</el-button>
                    </el-col>
                </el-row>
                <el-row style="margin-top:20px;">
                    <el-col :span="24">
                        <el-table
                        :data="tableDate"
                        border
                        style="width: 100%">
                            <el-table-column
                                prop="projectWork"
                                label="工作项"
                                width="80">
                            </el-table-column>
                            <el-table-column
                                prop="projectForshot"
                                label="*项目简称"
                                width="180">
                                <template slot-scope="scope">
                                    <el-select filterable v-model="scope.row.projectCode" placeholder="请选择" size="small" v-if="tableIsUpdate">
                                        <el-option
                                        v-for="(item,index) in projectArr"
                                        :key="index+item.projectCode"
                                        :label="item.projectName"
                                        :value="item.projectCode">
                                        </el-option>
                                    </el-select>
                                    <div v-else>{{scope.row.projectName}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="workHours"
                                label="*工作时间"
                                width="100">
                                <template slot-scope="scope">
                                    <el-input 
                                    v-model.number="scope.row.workHours"
                                    size = "small"
                                    :blur="hourFun"
                                    placeholder="请输入内容"
                                    v-if="tableIsUpdate"
                                    ></el-input>
                                    <div v-else>{{scope.row.workHours}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="description"
                                label="*工作内容">
                                <template slot-scope="scope">
                                    <el-input
                                        type="textarea"
                                        :rows="1"
                                        maxlength="200"
                                        size="small"
                                        placeholder="请输入内容"
                                        v-if="tableIsUpdate"
                                        v-model="scope.row.description">
                                    </el-input>
                                    <div v-else>{{scope.row.description}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="address"
                                label="操作"
                                v-if="tableIsUpdate"
                                width="80">
                                <template slot-scope="scope">
                                    <div style="text-align:center;" @click="delHourWork(scope.row)">
                                        <i class="el-icon-delete-solid"></i>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
                <el-row style="margin-top:20px;text-align:center;">
                    <el-button class="defaulLargetBtn" :disabled="!tableIsUpdate"  @click="saveBtn">保存</el-button>
                </el-row>
            </div>
      </div>
      <el-dialog
        title="提示"
        :visible.sync="centerDialogVisible"
        width="20%"
        center>
            <span>确认删除？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="centerDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogSure">确 定</el-button>
            </span>
        </el-dialog>
  </div>
</template>

<script>
import Calendar from '@/components/calendar/calendar'
import topTip from '@/components/topTip'
import req from '@/service/http'
import calendarJs from '@/components/calendar/calendarJs'
export default {
    name: 'workHour',
    data(){
        return{
            // 列表中的值
            tableDate: [],
            // 下拉框数据
            projectArr:[],
            // 当前日期
            nowDate: new Date(),
            // 工作项
            workPro: [],
            // 当前选中的工作项
            workProArr: {
                name: '',
                code: ''
            },
            // 工作项描述
            workDescription: '',
            // 饱和工时8小时
            hourFull: 8,
            // 弹窗显隐
            centerDialogVisible: false,
            // 获取全年节假日
            holiday: [],
            // 当年月的节假日
            monthHoliday: [],
            // 是否从周日开始
            sundayStart: true,
            // 已填报工时
            currentWorkHours: 0,
            // 未填报工时
            notTime: 184,
            // 获取已填报工时
            versionGroup: [],
            // 定义列表是否能修改
            tableIsUpdate: false
        }
    },
    created(){
        this.getnowDate()
        this.getWorkPro()
        this.getProject()
        this.initWorkStateInfoByCurrentYear(this.nowDate)
    },
    methods:{
        // 调用切换月份的方法
        changeMonth (val) {
            let value = this.dateFormat(val)
        },
        // format日期
        dateFormat(date) {
            date = typeof date === 'string' ? new Date(date.replace(/\//g, '-')) : date;
            return date.getFullYear() + '-' + ((date.getMonth()+1)>9?(date.getMonth()+1):'0'+(date.getMonth()+1)) + '-'+(date.getDate()>9?date.getDate():'0'+date.getDate());
        },
        // 点击日历某一天的回调
        chooseDay(val){
            let value = this.dateFormat(val)
            this.nowDate = value
            this.initProjectSelect(value)
        },
        // 获取本年度节假日
        getHoliday(nowDate){
            req({
                url: 'ims/workHours/getViewVersionQuery',
                params:{
                    year: new Date(nowDate).getFullYear()
                }
            }).then((result) => {
                // 保存本年度每月份假期
                let hdnWwdata = result.data.data
                // 调用方法
                this.initHoliday(hdnWwdata,nowDate)
            }).catch((err) => {
                
            });
        },
        // 保存假期
        initHoliday(hdnWwdata,thisDate){
            let newHoliday = []
            let oneMonth = []
            for(let i =1;i< 13;i++){
                newHoliday.push(hdnWwdata['hdnWwdata'+i])
            }
            
            for(let i =0;i<newHoliday.length;i++){
                newHoliday[i].split(',').map((item,index)=>{
                    oneMonth.push({
                        date:new Date(thisDate).getFullYear()+'-'+(i+1)+'-'+item,
                        className: 'greyDay'
                    })
                })
                this.holiday.push(oneMonth)
                oneMonth = []
            }
            this.changeHoliday(thisDate)
        },
        // 根据当前年度和月份渲染假期
        changeHoliday(dateTop){
            this.monthHoliday = this.holiday[new Date(dateTop).getMonth()]
        },
        // 或许当前日期项目下拉框
        getnowDate(){
            req({
                url: 'ims/workHours/getCurrentDateTime'
            }).then((result) => {
                let nowDate = result.data.data
                let newDate = new Date(nowDate)
                let year = newDate.getFullYear()
                let month = (newDate.getMonth()+1)>9?(newDate.getMonth()+1):'0'+(newDate.getMonth()+1)
                let day = newDate.getDate()>9?newDate.getDate():'0'+newDate.getDate()
                let dateStr = year+'-'+month+'-'+day
                this.nowDate = dateStr
                this.initProjectSelect(dateStr)
            }).catch((err) => {
                
            });
        },
        // 获取已填报工时
        initWorkStateInfoByCurrentYear(nextMonth){
            let calendarList = calendarJs.getMonthList(new Date(nextMonth))
            let date = new Date(nextMonth)
            req({
                url: 'ims/workHours/getWorkStateInfoByCurrentYear',
                method: 'post',
                data:{
                    date: date.getFullYear() + '-' + ((date.getMonth()+1)>9?(date.getMonth()+1):'0'+(date.getMonth()+1)),
                    startDate: this.dateFormat(calendarList[0].date),
                    endDate: this.dateFormat(calendarList[calendarList.length-1].date)
                }
            }).then((result) => {
                this.versionGroup = result.data.data.data
                this.currentWorkHours = result.data.data.currentWorkHours
                this.notTime = result.data.data.notTime
            }).catch((err) => {
                
            })
        },
        // 初始今日签到详情
        initProjectSelect(newData){
            req({
                url: 'ims/workHours/getWorkHoursListInfoByDate',
                params:{
                    workDate: newData
                }
            }).then((result) => {
                this.tableDate = result.data.data.projectWorkHoursInfo
                this.tableIsUpdate = true
                if (result.data.data.projectWorkHoursInfo == undefined) {
                    this.tableDate = result.data.data.noProjectWorkHoursInfo
                    this.tableIsUpdate =false
                }
            }).catch((err) => {
                
            });
        },
        getProject(){
            // 项目下拉框
            req({url: 'ims/workHours/getProject'})
            .then((result) => {
                this.projectArr = result.data.data
            }).catch((err) => {
                
            });
        },
        // 获取工作项
        getWorkPro(){
            req({
                url: 'ims/workHours/getWorkType',
                params:{
                    parentTypeCode: 'WORK_CODE'
                }
            }).then((result) => {
                this.workPro = result.data.data
                this.workPro.map(item=>{
                    item.isShow = false
                })
            }).catch((err) => {
                
            });
        },
        // 绑定工作项点击事件
        workProClick(obj){
            // 把值传给绑定值
            this.workProArr.code = obj.code
            this.workProArr.name = obj.name
            // 重置工作项
            this.workPro.map(item=>{
                item.isShow = false
            })
            obj.isShow = true
            // 获取工作向描述
                req({
                    url: 'ims/workHours/getWorkType',
                    params:{
                        parentTypeCode: this.workProArr.code
                    }
                }).then((result) => {
                    this.workDescription = result.data.data[0].name
                }).catch((err) => {
                    
                });
            // 刷新试图
            this.$forceUpdate()
        },
        // 点击加入列表
        addWorkList () {
            if (this.workProArr.code) {
                if (this.tableDate == undefined) {
                    this.tableDate = []
                }
                // 添加一列
                this.tableDate.push({
                    workHoursId: '',
                    // 工作项code  name
                    projectWorkCode: this.workProArr.code,
                    projectWork: this.workProArr.name,
                    // 项目code   name
                    projectCode: '',
                    projectForshot: '',
                    // 工时
                    workHours: '',
                    // 工作内容
                    description: ''
                })
            } else {
                this.$message({
                    message: '请选择工作项',
                    type: 'warning'
                })
            }
        },
        // 点击保存按钮
        saveBtn (){
            req({
                url: 'ims/workHours/addWorkHoursInfo',
                params:{
                    workHourInfoJson: JSON.stringify(this.tableDate),
                    workDate: this.nowDate
                }
            }).then((result) => {
                if (result.data.flag == 0) {
                    this.$message({
                        message: '提交成功',
                        type: 'success'
                    })
                    this.initWorkStateInfoByCurrentYear(this.nowDate)
                }
            }).catch((err) => {
                this.$message({
                    message: '提交失败',
                    type: 'error'
                })
            });
        },
        // 饱和工时方法
        hourFun(value){
            console.log(value);
        },
        // 刷新可用工时
        reshHour(){
            return this.hourFull = 8 - this.tableDate.reduce((total,currentValue)=>total.workHours+currentValue.workHours)
        },
        // 删除工时
        delHourWork(item){
            this.centerDialogVisible = true
        },
        // 确定删除工时
        dialogSure(){
            this.tableDate.map((currentValue, indedx, arr)=>{
                this.tableDate.splice(indedx,1)
                this.centerDialogVisible = false
            })
        }
    },
    components:{
        Calendar,
        topTip
    }
}
</script>

<style scoped>
.workHour{
    min-height: 100%;
}
.calendarDiv{
    width: 400px;
    height: 300px;
    background-color: #ffffff;
}
.header{
    height: 300px;
    display: flex;
    width: 100%;
}

.calendar{
    flex:1;
}

.warnInfo{
    margin-left: 10px;
    padding: 10px 30px;
    flex: 1;
    background-color: #ffffff;
}
.warn_text1{
    font-weight: bold;
    color: #111111;
    line-height: 35px;
    font-size: 16px;
    height: 35px;
}
.warn_text2{
    font-size: 18px;
    padding: 10px 10px;
}
.current_work_hours{
    color: rgb(71,154,207);
    font-size: 30px;
    letter-spacing: 1px;
    padding: 0px 5px;
}
.not_time{
    color: rgb(203,13,13);
    font-size: 30px;
    letter-spacing: 1px;
    padding: 0px 5px;
}
.yt-three-title{
    font-size: 16px;
    height: 35px;
    line-height: 35px;
    font-weight: bold;
    color: #111111;
}
.ul-box{
    padding: 10px 0px;
}
.ul-box li {
    padding: 5px 0px;
    font-size: 16px;
}
.round{
    width: 20px;
    height: 16px;
    display: inline-block;
    font-size: 10px;
    line-heigth: 16px;
    text-align: center;
    color: rgb(51,164,241);
    text-decoration: none;
}
.editDIv{
    background-color: #ffffff;
    margin-top: 10px;
    padding-bottom:20px;
}
.title{
    position: absolute;
    left: 35px;
    color: #417095;
    font-size: 16px;
    font-weight: bold;
}
.red{
    color: red;
}
.readText{
    color: #003465;
    font-weight: bold;
}
.div_edit{
    padding-left: 20px;
}
.font-box{
    margin-right: 10px;
    display: inline-block;
    padding: 5px 8px;
    border: 1px solid #DFE6F3;
    border-radius: 4px;
    cursor: pointer;
}
.active-div{
    font-weight: bold;
    color: #003465;
    border: 1px solid #003465;
}
.defaultBtn{
    background-color: #417095;
    color: #fff;
    padding: 0 10px 1px;
    height: 30px;
    line-height: 30px;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    outline: none;
}
.defaultBtn:hover,.defaulLargetBtn:hover{
    opacity: 0.8;
	filter: alpha(opacity=80);
}
.defaulLargetBtn{
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
</style>
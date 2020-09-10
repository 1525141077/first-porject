<template>
  <div class="yt-project-manager-add">
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
                        <span class="round">●</span>下方带有“<span style="color: red;">_____</span>”为未填写工时或未写满8小时,填写的总数应小于或等于8小时
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
                  工时填报
              </div>
            </top-tip>
            <div class="div_edit">
                <!-- 表格 -->
                <el-form :model="tableDateMap" ref="tableForm">
                    <el-table
                        border
                        :data="tableDate"
                        style="width: 100%">
                        <el-table-column
                            prop="projectCodeName"
                            label=""
                            width="250">
                            <template slot="header">
                                <span class="x-tip">*</span>
                                <span>项目编号/简称</span>
                            </template>
                            <template scope="scope">
                                <div v-if="scope.row.isEditAuth === 1">
                                    <el-form-item label="" :prop="`tableDate.${scope.$index}.projectName`" :rules="changeList">
                                    <el-autocomplete
                                    style="width: 100%;"
                                        class="inline-input"
                                        v-model="tableDateMap.tableDate[scope.$index].projectName"
                                        :fetch-suggestions="querySearch"
                                        placeholder="请输入内容"
                                        :trigger-on-focus="true"
                                        @select="handleSelect($event, scope.$index, 1)">
                                        <i slot="suffix" class="el-input__icon el-icon-search" style="cursor: pointer;" @click="visleProject(scope.$index)"></i>
                                    </el-autocomplete>
                                </el-form-item>
                                </div>
                                <span v-else>{{scope.row.projectName}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="name"
                            label=""
                            width="200">
                            <template slot="header">
                                <span class="x-tip">*</span>
                                <span>工作项</span>
                            </template>
                            <template scope="scope">
                            <div v-if="scope.row.isEditAuth === 1">
                                <el-form-item label="" :prop="`tableDate.${scope.$index}.workName`" :rules="changeList">
                                    <el-autocomplete
                                    style="width: 100%;"
                                        class="inline-input"
                                        v-model="tableDateMap.tableDate[scope.$index].workName"
                                        :fetch-suggestions="querySearchWork"
                                        placeholder="请输入内容"
                                        :trigger-on-focus="true"
                                        @select="handleSelect($event, scope.$index, 2)">
                                        <i slot="suffix" class="el-input__icon el-icon-search" style="cursor: pointer;" @click="visleWork(scope.$index)"></i>
                                    </el-autocomplete>
                                </el-form-item>
                            </div>
                            <span v-else>{{scope.row.workName}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="workHours"
                            width="150"
                            label="">
                            <template slot="header">
                                <span class="x-tip">*</span>
                                <span>工作时间</span>
                            </template>
                            <template scope="scope">
                                <div v-if="scope.row.isEditAuth === 1">
                                <el-form-item label="" :prop="`tableDate.${scope.$index}.workHours`" :rules="checkList">
                                    <el-input v-model.number="tableDateMap.tableDate[scope.$index].workHours" placeholder="请输入数字"></el-input>
                                </el-form-item>
                                </div>
                                <span v-else>{{scope.row.workHours}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="description"
                            label="">
                            <template slot="header">
                                <span class="x-tip">*</span>
                                <span>工作内容</span>
                            </template>
                            <template scope="scope">
                                <div v-if="scope.row.isEditAuth === 1">
                                <el-form-item label="" :prop="`tableDate.${scope.$index}.description`" :rules="checkList">
                                <el-input
                                    type="textarea"
                                    autosize
                                    placeholder="请输入内容"
                                    v-model="tableDateMap.tableDate[scope.$index].description">
                                </el-input>
                                </el-form-item>
                                </div>
                                <span v-else>{{scope.row.description}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                         v-if="tableIsUpdate"
                            width="90"
                            align="center"
                            label="操作">
                            <template scope="scope">
                                <label class="delete-icon" @click="delHourWork(scope.$index)"></label>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form>
                <el-row  v-if="tableIsUpdate">
                  <el-col :span="24" style="text-align:center;padding:5px 0px;">
                      <label class="list-add" @click="addTabList"></label>
                  </el-col>
                </el-row>
                <el-row style="margin-top:20px;text-align:center;">
                    <el-button class="yt-bottom-btn" type="primary" v-if="tableIsUpdate"  @click="saveBtn" :loading="btnLoading">保存工时</el-button>
                </el-row>
            </div>
      </div>
      <!-- 项目弹窗START -->
      <div v-if="centerDialogVisible">
        <projectInfoDialog 
        :key="1"
        :placeholder="'项目编号/项目名称/项目经理'"
        :total="projectTotal"
        :projectInfo="'项目信息'" 
        @handleSizeChange="handleSizeChange($event, 1)"
        @handleCurrentChange="handleCurrentChange($event, 1)"
        @inputBtn="inputBtn($event, 1)"
        :centerDialogVisible="centerDialogVisible" 
        :projectArr="projectArr" 
        @canelBtn="canelBtn(1)" 
        @sureBtn="sureBtn($event, 1)">
            <template slot="tab-list">
                <el-table-column prop="pkId" label="项目编号" align="center" width="150"></el-table-column>
                <el-table-column prop="projectName" label="项目简称" show-overflow-tooltip></el-table-column>
                <el-table-column prop="businessType" label="业务类型" align="center" width="150"></el-table-column>
                <el-table-column prop="projectPersonName" label="项目经理" align="center" width="150"></el-table-column>
            </template>
        </projectInfoDialog>
      </div>
      <!-- 项目弹窗END -->
      <!-- 工作项弹窗START -->
      <div v-if="workVisible">
        <projectInfoDialog 
        :key="2"
        :placeholder="'工作项/主要内容'"
        :total="workTotal"
        :projectInfo="'工作项'" 
        @handleSizeChange="handleSizeChange($event, 2)"
        @handleCurrentChange="handleCurrentChange($event, 2)"
        @inputBtn="inputBtn($event, 2)"
        :centerDialogVisible="workVisible" 
        :projectArr="workList" 
        @canelBtn="canelBtn(2)" 
        @sureBtn="sureBtn($event, 2)">
            <template slot="tab-list">
                <el-table-column prop="workName" label="工作项" align="center" width="150"></el-table-column>
                <el-table-column prop="workContentName" label="主要工作内容" show-overflow-tooltip></el-table-column>
            </template>
        </projectInfoDialog>
      </div>
      <!-- 工作项弹窗END -->
  </div>
</template>

<script>
// 弹窗
import projectInfoDialog from '@/components/projectInfoDialog'
import Calendar from '@/components/calendar/calendar'
import topTip from '@/components/topTip'
import req from '@/service/http'
import axios from '../../service/http';
import { option } from '../../static/config';
import calendarJs from '@/components/calendar/calendarJs'
export default {
    data(){
        let formChecked = (rule, value, callback) => {
            if (value === '') {
                callback(new Error())
            } else {
                // 判断工作时间
                if (rule.field.indexOf('workHours') !== -1) {
                    value = value + ''
                    if (value.indexOf('-') !== -1) {
                        callback(new Error())
                    }
                    // 工作时间
                    let index = Number(rule.field.split('.')[1])
                    value = Number(value)
                    if (value > 8) {
                        value = ''
                        this.tableDateMap.tableDate[index].workHours = value
                        callback(new Error())
                    }
                }
                callback()
            }
        }
        return{
            // 按钮loading
            btnLoading: false,
            // 当前点击的行
            rowIndex: 0,
            tableDateMap: {
                tableDate:[{
                    projectName: '',
                    projectCode: '',
                    workName: '',
                    projectWorkCode: '',
                    workHours: '',
                    description: ''
                }]
            },
            projectColType: false,
            workColType: false,
            // 已收藏的项目
            collectionProject: [],
            collectionWork: [],
            workVisible: false,
            workTotal: 0,
            projectTotal: 0,
            workList: [],
            // 列表中的值
            tableDate: [],
            // 项目数据
            projectArr:[],
            // 当前日期
            nowDate: new Date(),
            // 工作项
            workPro: [],
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
            tableIsUpdate: true,
            changeList: { required: true, validator: formChecked, trigger: 'change' },
            checkList: { required: true, validator: formChecked, trigger: 'blur' }
        }
    },
    created(){
        // this.getProject()
    },
    mounted () {
        this.getnowDate()
        this.initWorkStateInfoByCurrentYear(this.nowDate)
        this.getCollectionProject()
        this.getCollectionWork()
        this.getProjectWork()
    },
    methods:{
        // 获取项目，工作项
        getProjectWork () {
            let project = {
                pageSize: '99999999',
                pageNum: 1,
                selectParam: ''
            }
            let work = {
                pageSize: '99999999',
                pageNum: 1,
                selectParam: '',
                parentTypeCode: 'WORK_CODE'
            }
            this.getProjectList(project, 1)
            this.getWorkInfo(work, 1)
        },
        // 添加一条空数据
        addTabList () {
            this.getCollectionProject()
            this.getCollectionWork()
            this.getProjectWork()
            let map = {
                projectName: '',
                projectCode: '',
                workName: '',
                projectWorkCode: '',
                workHours: '',
                description: ''
            }
            this.tableDate.push(map)
            this.tableDate.forEach(n => {
                this.$set(n, 'isEditAuth', 1)
            })
            this.tableDateMap.tableDate.push(map)
        },
        // 当前页条数改变
        handleSizeChange (param, type) {
            if (type === 1) {
                this.getProjectList(param, 2)
            } else {
                let params = {
                    pageSize: param.pageSize,
                    pageNum: param.pageNum,
                    selectParam: param.selectParam,
                    parentTypeCode: 'WORK_CODE'
                }
                this.getWorkInfo(params, 2)
            }
        },
        // 当前页
        handleCurrentChange (param, type) {
            if (type === 1) {
                this.getProjectList(param, 2)
            } else {
                let params = {
                    pageSize: param.pageSize,
                    pageNum: param.pageNum,
                    selectParam: param.selectParam,
                    parentTypeCode: 'WORK_CODE'
                }
                this.getWorkInfo(params, 2)
            }
        },
        // 输入框
        inputBtn (param, type) {
            if (type === 1) {
                this.getProjectList(param, 2)
            } else {
                let params = {
                    pageSize: param.pageSize,
                    pageNum: param.pageNum,
                    selectParam: param.selectParam,
                    parentTypeCode: 'WORK_CODE'
                }
                this.getWorkInfo(params, 2)
            }
        },
        // 取消按钮
        canelBtn (type) {
            this.getCollectionProject()
            this.getCollectionWork()
            this.getProjectWork()
            if (type === 1) {
                this.centerDialogVisible = false
            } else {
                this.workVisible = false
            }
        },
        // 确定按钮
        sureBtn (row, type) {
            let index = this.rowIndex
            this.getCollectionProject()
            this.getCollectionWork()
            this.getProjectWork()
            if (type === 1) {
                // 项目
                this.tableDateMap.tableDate[index].projectName = row.pkId + ' ' +row.projectName
                this.tableDateMap.tableDate[index].projectCode = row.pkId
                this.centerDialogVisible = false
            } else {
                // 工作项
                this.tableDateMap.tableDate[index].workName = row.workName
                this.tableDateMap.tableDate[index].projectWorkCode = row.workCode
                this.workVisible = false
            }
        },
        // 点击项目放大镜
        visleProject (index) {
            let param = {
              pageSize: 15,
              pageNum: 1,
              selectParam: ''
            }
            this.getProjectList(param, 2)
            this.rowIndex = index
        },
        // 点击工作项放大镜
        visleWork (index) {
            let param = {
                pageSize: 15,
                pageNum: 1,
                selectParam: '',
                parentTypeCode: 'WORK_CODE'
            }
            this.getWorkInfo(param, 2)
            this.rowIndex = index
        },
         // 返回输入建议方法（项目）
        querySearch (queryString, cb) {
            let projectColType = this.projectColType
            let restaurants = []
            if (projectColType && queryString === '') {
                // 有收藏
                restaurants = this.collectionProject
            } else if (!projectColType && queryString === '') {
                restaurants = []
            } else {
                // 没有收藏
                restaurants = this.projectArr
            }
            console.log(queryString)
            let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
            cb(results)
            // setTimeout(() => {
            // }, 500)
        },
        // 返回输入建议方法(工作项)
        querySearchWork (queryString, cb) {
            let workColType = this.workColType
            let restaurants = []
            if (workColType && queryString === '') {
                // 有收藏
                restaurants = this.collectionWork
            } else if (!workColType && queryString === '') {
                restaurants = []
            } else {
                // 没有收藏
                restaurants = this.workList
            }
            console.log(queryString)
            let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
            cb(results)
        },
      // 筛选匹配的项目数据
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
        }
      },
    //   获取收藏的项目信息
    getCollectionProject () {
        axios.post(option.base_path + 'db/workHours/getCollectionProjects')
            .then(res => {
                this.collectionProject = res.data.data
                if (this.collectionProject.length !== 0) {
                    this.projectColType = true
                    this.collectionProject.forEach(n => {
                        this.$set(n, 'value', n.pkId + ' ' + n.projectName)
                    })
                } else {
                    // this.projectColType = false
                }
                this.$forceUpdate()
            })
    },
     //   获取收藏的工作项信息
    getCollectionWork () {
        let param = {
            parentTypeCode: 'WORK_CODE'
        }
        axios.post(option.base_path + 'db/workHours/getCollectionWorkTypes', param)
            .then(res => {
                this.collectionWork = res.data.data
                if (this.collectionWork.length !== 0) {
                    this.workColType = true
                    this.collectionWork.forEach(n => {
                        this.$set(n, 'value', n.workName)
                    })
                } else {
                    // this.workColType = false
                }
                this.$forceUpdate()
            })
    },
    // 选中之后
        handleSelect (item, index, type) {
            if (type === 1) {
                // 项目信息
                this.tableDateMap.tableDate[index].projectName = item.pkId + ' ' +item.projectName
                this.tableDateMap.tableDate[index].projectCode = item.pkId
            } else {
                // 工作项信息
                this.tableDateMap.tableDate[index].workName = item.workName
                this.tableDateMap.tableDate[index].projectWorkCode = item.workCode
            }
        },
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
            }).then((res) => {
                this.tableDate = []
                this.tableDateMap.tableDate = []
                if (res.data.data.isEditAuth === 1) {
                        // 可以填写工时
                    this.tableIsUpdate = true
                    if (res.data.data.projectWorkHoursInfo.length === 0) {
                        let map = {
                            projectName: '',
                            projectCode: '',
                            workName: '',
                            projectWorkCode: '',
                            workHours: '',
                            description: ''
                        }
                        this.tableDate.push(map)
                        this.tableDate.forEach(n => {
                            this.$set(n, 'isEditAuth', res.data.data.isEditAuth)
                        })
                        this.tableDateMap.tableDate.push(map)
                    } else {
                        this.tableDate = res.data.data.projectWorkHoursInfo
                        this.tableDateMap.tableDate = []
                        this.tableDate.forEach(n => {
                            let map = {
                                projectName: n.projectName,
                                projectCode: n.projectCode,
                                workName: n.projectWork,
                                projectWorkCode: n.projectWorkCode,
                                workHours: n.workHours,
                                description: n.description
                            }
                            this.$set(n, 'isEditAuth', res.data.data.isEditAuth)
                            this.tableDateMap.tableDate.push(map)
                        })
                    }
                } else {
                    // 不可填工时
                    if (res.data.data.noProjectWorkHoursInfo.length !== 0) {
                        this.tableDate = res.data.data.noProjectWorkHoursInfo
                        this.tableDate.forEach(n => {
                            this.$set(n, 'isEditAuth', res.data.data.isEditAuth)
                        })
                    }
                    this.tableIsUpdate = false
                }
            }).catch((err) => {
            });
        },
        // 获取项目信息
        getProjectList (param, type) {
            axios.post(option.base_path + 'db/workHours/getAllProjects', param)
            .then(res => {
                if (type === 2) {
                    this.centerDialogVisible = true
                    this.projectArr = res.data.data.rows
                    let imgSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABbklEQVQ4T5WSP0vDUBTFz33xD7ShS3lWXEQQaZKK4KR+AN0cHSo6OLuISBdB0MVBRXBxty4iOOsn0MGlkrQ4OWnT4mBtENHmSqutaW1i+8Z3zvlx33mXEHDKtr5OAk5YWsd+NvITyvn4OITIVHWh8HQomr1u5/UH2NoBiNZqIUJaldZSx4C3R2240kMP3oD7qWiRobtcK+TPBKVifEywSAFYaTIz0q5wdyIyd++9p5KdmFGoknRBOgEagMGgYgHkGcgKsOVW+Jycgn7EwOo/obYygy7o/dnQP1w+A8PoCkIwewUt1DroGvIT7o+aVqPEjiGe8PcPe07ZTsyC3MvAp7A7p8ZyV3VPM6BgpADeDQZgQ41Ze+0BRT0NxmIggOhEleayzwT6LYDJhki4AYMZmGpAmTNqLDvhB3AAhECobtu2Kq3TqrGcN5IQvF9fMnXgt/ymDpyivkWgl5A0D1uf8fo0KqH0bQrCSFha83X9C8i3hUT/u7o8AAAAAElFTkSuQmCC'
                    if (this.projectArr.length !== 0) {
                        this.projectArr.forEach((n, i) => {
                            if (n.isCollection === "1") {
                                // 已收藏
                                this.$set(n, 'iconType', true)
                                this.$set(n, 'imgSrc', imgSrc)
                            } else {
                                this.$set(n, 'iconType', false)
                                this.$set(n, 'imgSrc', '')
                            }
                            this.$set(n, 'indexd', i)
                        })
                    }
                    this.projectTotal = res.data.data.total
                } else {
                    // 联想输入框
                    this.projectArr = res.data.data.rows
                    if (this.projectArr.length !== 0) {
                        this.projectArr.forEach((n, i) => {
                            this.$set(n, 'value', n.pkId + ' ' + n.projectName)
                        })
                    }
                }
            })
        },
        // 获取工作项信息
        getWorkInfo (param, type) {
             axios.post(option.base_path + 'db/workHours/getWorkType', param)
            .then(res => {
                if (type === 2) {
                    this.workVisible = true
                    this.workList = res.data.data.rows
                    let imgSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABbklEQVQ4T5WSP0vDUBTFz33xD7ShS3lWXEQQaZKK4KR+AN0cHSo6OLuISBdB0MVBRXBxty4iOOsn0MGlkrQ4OWnT4mBtENHmSqutaW1i+8Z3zvlx33mXEHDKtr5OAk5YWsd+NvITyvn4OITIVHWh8HQomr1u5/UH2NoBiNZqIUJaldZSx4C3R2240kMP3oD7qWiRobtcK+TPBKVifEywSAFYaTIz0q5wdyIyd++9p5KdmFGoknRBOgEagMGgYgHkGcgKsOVW+Jycgn7EwOo/obYygy7o/dnQP1w+A8PoCkIwewUt1DroGvIT7o+aVqPEjiGe8PcPe07ZTsyC3MvAp7A7p8ZyV3VPM6BgpADeDQZgQ41Ze+0BRT0NxmIggOhEleayzwT6LYDJhki4AYMZmGpAmTNqLDvhB3AAhECobtu2Kq3TqrGcN5IQvF9fMnXgt/ymDpyivkWgl5A0D1uf8fo0KqH0bQrCSFha83X9C8i3hUT/u7o8AAAAAElFTkSuQmCC'
                    if (this.workList.length !== 0) {
                        this.workList.forEach((n, i) => {
                            if (n.isCollection === "1") {
                                // 已收藏
                                this.$set(n, 'iconType', true)
                                this.$set(n, 'imgSrc', imgSrc)
                            } else {
                                this.$set(n, 'iconType', false)
                                this.$set(n, 'imgSrc', '')
                            }
                            this.$set(n, 'indexd', i)
                        })
                    }
                    this.workTotal = res.data.data.total
                } else {
                    this.workList = res.data.data.rows
                    if (this.workList.length !== 0) {
                        this.workList.forEach((n, i) => {
                            this.$set(n, 'value', n.workName)
                        })
                    }
                }
            })
        },
        // 点击保存按钮
        saveBtn (){
            let num = 0
            this.nowDate = this.dateFormat(this.nowDate)
            let tabList = this.tableDateMap.tableDate
            if (tabList.length !== 0) {
                tabList.forEach(n => {
                    if (n.workHours !== '') {
                        n.workHours = Number(n.workHours)
                        num += n.workHours
                    }
                })
            }
            this.$refs.tableForm.validate(n => {
                if (n) {
                    if (num <= 8) {
                        let params = {
                            workHourInfoJson: JSON.stringify(tabList),
                            workDate: this.nowDate
                        }
                        this.btnLoading = true
                        axios.post(option.base_path + 'ims/workHours/addWorkHoursInfo', params)
                        .then(res => {
                            this.btnLoading = false
                            if (res.data.flag == 0) {
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
                        })
                    } else {
                        this.$message.warning('填写总工时不能超过8小时')
                    }
                } else {
                    this.$message.warning('请填写完整')
                }
            })
        },
        // 饱和工时方法
        // hourFun(value){
        //     console.log(value);
        // },
        // 刷新可用工时
        // reshHour(){
        //     return this.hourFull = 8 - this.tableDate.reduce((total,currentValue)=>total.workHours+currentValue.workHours)
        // },
        // 删除工时
        delHourWork(item){
            this.$confirm('确定删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    this.dialogSure(item)
                }).catch(() => {
            })
        },
        // 确定删除工时
        dialogSure(item){
            this.tableDate.splice(item, 1)
            this.tableDateMap.tableDate.splice(item,1)
        }
    },
    components:{
        Calendar,
        topTip,
        projectInfoDialog
    }
}
</script>

<style>
.div_edit .el-form-item {
    margin: 0px;
}
.el-dialog__header {
    padding: 0px !important;
    padding-left: 20px !important;
}
.dialog-footer {
    display: block;
    text-align: center !important;
}
.work-hour{
    min-height: 100%;
}
.work-hour .el-textarea__inner {
 height: 43px !important;
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
.x-tip {
    color: red;
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
.div_edit{
    padding-left: 20px;
}
.delete-icon {
    cursor: pointer;
    background: url(../../assets/images/common/form-icons.png) no-repeat -82px -44px;
    width: 24px;
    height: 25px;
    display: inline-block;
}
.list-add {
    cursor: pointer;
    background: url(../../assets/images/common/form-icons.png) no-repeat -11px -47px;
    width: 24px;
    height: 25px;
    display: inline-block;
}
</style>
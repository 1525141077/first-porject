<template>
  <div class="yt-project-manager-add">
    <topTip>
      <template>
          <el-col :span="18" style="text-align: left;" class="top-tip">
            <span style="color: #417095;font-size: 16px;font-weight: bolder;">项目人员管理</span>
            </el-col>
            <el-col :span="5" style="text-align: left;" class="top-tip">
            <span style="color: #417095;font-size: 13px;font-weight: bolder;">登录人：</span>
            <span>{{userInfo}}</span>
            </el-col>
        </template>
    </topTip>
    <!-- 内部信息START -->
    <div>
      <el-form :model="project" ref="ruleForm" class="demo-ruleForm">
        <el-form-item label="项目名称/编号：" prop="" label-width="135px">
          <el-autocomplete
            style="width:70%;"
            class="inline-input"
            v-model="selectProjects"
            :fetch-suggestions="querySearch"
            :placeholder="placeholder"
            :trigger-on-focus="false"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="项目成员：" prop="" label-width="100px" class="form-center">
          <div style="text-align:right;padding-right:10px;">
            <span>
                项目成员竞聘开关：
              </span>
            <el-tooltip :content="'关闭则内部竞聘列表不能查看成员'" placement="top">
              <el-switch
              class="demo"
                v-model="project.memberSwitch"
                inactive-color="#ff4949"
                :active-text="'开'"
                :inactive-text="'关'"
                :active-value="'1'"
                :inactive-value="'2'">
              </el-switch>
            </el-tooltip>
            <span>项目组人数：<span>{{memberNum}}</span>人</span>
          </div>
        </el-form-item>
      </el-form>
      <!-- 表格START -->
      <div style="padding: 5px 0px 20px 0px;">
        <el-table
        ref="multipleTable"
            border
              :data="memberData"
              @selection-change="selectManList"
              :cell-class-name="getCellClassName"
              style="width: 100%">
              <el-table-column
              v-model="checkAll"
                :selectable="checkboxInit"
                type="selection"
                 align="center"
                width="55">
              </el-table-column>
                <el-table-column
                prop="memberName"
                label="姓名"
                 align="center"
                width="180">
                <template scope="scope">
                  <span v-if="scope.row.memberName">{{scope.row.memberName}}</span>
                    <selectMan :selectName="scope.row.memberName"
                    v-else
                    :oldNameList="oldNameList"
                    @choseMan="choseMan($event, scope.row,scope.$index)">
                    </selectMan>
                </template>
              </el-table-column>
              <el-table-column
                prop="memberPhone"
                label="联系电话"
                 align="center"
                width="120">
                <template scope="scope">
                  <span :class="{'tip-text': !scope.row.memberName}">{{scope.row.memberPhone}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="memberEmail"
                label="邮箱"
                 align="center"
                 show-overflow-tooltip
                width="150">
                <template scope="scope">
                  <span :class="{'tip-text': !scope.row.memberName}">{{scope.row.memberEmail}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="memberSelfDescript"
                show-overflow-tooltip
                label="自我描述">
                <template scope="scope">
                  <!-- <el-tooltip class="item" effect="dark" placement="bottom-start">
                    <div slot="content" style="padding: 0px 20px;">
                      <div style="width:500px;">
                        {{scope.row.memberSelfDescript}}
                      </div>
                    </div>
                  </el-tooltip> -->
                      <span style="text-overflow: ellipsis;white-space: nowrap;" :class="{'tip-text': !scope.row.memberName}">{{scope.row.memberSelfDescript}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="sourceName"
                label="来源"
                align="center"
                width="90">
                <template scope="scope">
                  <span :class="{'tip-text': !scope.row.memberName}">{{scope.row.sourceName}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop=""
                label="操作"
                 align="center"
                width="90">
                <template scope="scope">
                  <el-button type="text" 
                  v-if="scope.$index !== 0"
                  :class="{'delete-btn': !scope.row.btnType,
                          'sure-btn': scope.row.btnType}"
                    @click="btnClick(scope.row, scope.$index)">
                    {{scope.row.btnName}}
                  </el-button>
                  <span v-else>--</span>
                </template>
              </el-table-column>
            </el-table>
      </div>
      <!-- 表格END -->
      <!-- 底部按钮START -->
      <div style="text-align:center;">
        <el-button type="primary" class="yt-bottom-btn" @click="formSureBtn">确定</el-button>
        <el-button class="yt-bottom-btn" type="info" style="margin-top: 30px;" @click="print">返回</el-button>
        <!-- <el-button  class="yt-bottom-btn">取消</el-button> -->
      </div>
      <!-- 底部按钮END -->
    </div>
    <!-- 内部信息END -->
  </div>
</template>

<script>
// 选人组件
import selectMan from "../../components/selectMan.vue"
import topTip from '../../components/topTip.vue'
import axios from '../../service/http'
import { option } from '../../static/config'
export default {
  data() {
    return {
      placeholder: '请输入',
      checkAll:true,
      // 项目集合
      projectList: [],
      projectId: '',
      // 以有的姓名集合
      oldNameList: [],
      selectProjects: '',
      userInfo: '',
      memberNum: 0,
      // 删除数据的id
      deleteList: [],
      // 勾选数据
      checkedList: [],
      // 新增数据
      addMemberList: [],
      project: {
        memberSwitch: '1'
      },
      // 成员集合
      memberData: []
    }
  },
  mounted() {
    let queryParams = this.$route.query;
    this.projectId = queryParams.projectId
    this.getUserInfo()
    this.getProjectList()
  },
  methods: {
    // 获取当前登录人
    getUserInfo () {
      axios.post(option.base_path + 'index/getCurrentUserInfo').then(res => {
        this.userInfo = res.data.data.realName + ' ' + res.data.data.userPhone
      })
    },
    print(){
      this.$router.push({ 
          path: '/projectManagerOperating/projectManagerPage',
          // query: params
        })
    },
    // 获取项目列表
    getProjectList () {
      axios.post(option.base_path + 'db/member/getProjectList').then(data => {
        
        if (data.data.data.length === 1) {
          data.data.data.forEach(n => {
            n['value'] = n.projectName
            // 获取项目名
            this.selectProjects = n.projectName
            // 成员开关
            this.project.memberSwitch = n.memberOnOff
            this.projectId = n.pkId
            this.getMemberList(n.pkId)
            this.projectList.push(n)
          })
        } else if (data.data.data.length > 1){
          data.data.data.forEach(n => {
            if (n.pkId === this.projectId) {
              // 获取项目名
              this.selectProjects = n.projectName
              this.project.memberSwitch = n.memberOnOff
              this.projectId = n.pkId
              this.getMemberList(n.pkId)
            }
            n['value'] = n.projectName
            this.projectList.push(n)
          })
        } else if (data.data.data.length === 0) {
          this.placeholder = '暂无可管理的项目'
        }
      })
      .catch(function (error) {
        console.log(error);
      })
    },
    // 获取成员
    getMemberList (pkId) {
      let map = {
        pkId: pkId
      }
      axios.post(option.base_path + 'db/member/getMemberListByMainId', map).then(res => {
        debugger
        this.memberNum = res.data.data.rows.length-1
        // this.checkAll=true
        console.log("撒大V公司",res.data.data.rows.length)
        this.memberData = res.data.data.rows
        if (this.memberData.length !== 0) {
            this.memberData.forEach((n, i) => {
              let code = {
                code: n.memberCode
              }
              this.oldNameList.push(code)
              for (const k in n) {
                if (n[k] === '') {
                  n[k] = '--'
                }
              }
              if (i !== 0) {
                if (n.source === '1') {
                  n['sourceName'] = '竞聘'
                } else {
                  n['sourceName'] = '自选'
                }
                this.$set(n, 'btnType', false)
                this.$set(n, 'btnName', '删除')
              } else {
                n['sourceName'] = '--'
              }
            })
             let nameMap = {
              pkId: '',
              memberCode: '',
              memberName: '',
              memberPhone: '请选择人员',
              memberEmail: '请选择人员',
              memberSelfDescript: '--',
              source: '',
              sourceName: '请选择人员',
              memberState: '2',
              btnType: false,
              btnName: ''
            }
            this.memberData.push(nameMap)
              this.memberData.forEach(n => {
                if (n.memberState === '2') {
                  this.$nextTick(() => {
                    this.$refs.multipleTable.toggleRowSelection(n, true)
                  })
                }
              })
            
        }
      })
      .catch(function (error) {
        console.log(error);
      })
    },
    // 第一行多选框不显示
    getCellClassName(scope) {
      return scope.rowIndex === 0 && scope.columnIndex === 0 ? 'hide-selection' : 'show-selection';
    },
    // 禁用多选框
    checkboxInit(row, index) {
      if (row.memberName === '') {
        return 0
      } else {
        return index === 0 ? 0 : 1;
      }
    },
    // 确定按钮
    formSureBtn () {
      if (this.projectId) {
          let del = ''
        if (this.deleteList.length !== 0) {
          this.deleteList.forEach(n => {
            if (del === '') {
              del += n.id
            } else {
              del += ',' + n.id
            }
          })
        }
        // 获取新增信息
        this.addMemberList = []
        let addList = this.memberData
        if (addList.length !== 0) {
          addList.forEach(n => {
            if (n.pkId === '' && n.memberCode !== '') {
              let name = {
                memberCode: n.memberCode,
                memberName: n.memberName,
                memberPhone: n.memberPhone,
                memberEmail: n.memberEmail,
                memberState: n.memberState
              }
              this.addMemberList.push(name)
            }
          })
        }
        let sureMap = {
          pkId: this.projectId,
          checkMemberList: this.checkedList,
          insertMember: this.addMemberList,
          deleteIds: del,
          memberOnOff: this.project.memberSwitch
        }
        axios.post(option.base_path + 'db/member/updateMemberTeam', sureMap).then(data => {
          // let checkAll = JSON.parse(JSON.stringify(this.checkAll));
          // checkAll=true
          // this.checkAll=checkAll
          this.$message.success('保存成功')
          this.getMemberList(this.projectId)
          console.log("深啡网",checkAll)
        })
        .catch(function (error) {
          console.log(error);
        })
      } else {
        this.$message.warning('请选择项目')
      }
    },
    // 列表删除按钮
    btnClick (manList, index) {
      if (this.oldNameList.length !== 0) {
        this.oldNameList.forEach((n, i) => {
          if (n.code === manList.memberCode) {
            this.oldNameList.splice(i, 1)
          }
        })
      }
      if (manList.pkId !== '') {
        let deleteMap = {
          id: manList.pkId,
          code: manList.memberCode
        }
        this.deleteList.push(deleteMap)
      }
      this.memberData.splice(index, 1)
      console.log('删除数据', this.oldNameList)
      console.log('列表', manList)
    },
    // 多选
    selectManList (selectList) {
      this.memberNum = 0 //+ 1
       this.checkedList = []
      if (selectList.length !== 0) {
        this.memberNum = this.memberNum + selectList.length
        this.memberData.forEach(b => {
          b.memberState = '1'
        })
         this.memberData.forEach(n => {
          // 改变列表的勾选状态
          selectList.forEach(b => {
            if (n.memberCode === b.memberCode) {
              n.memberState = '2'
            }
          })
        })
        console.log('选人', this.checkedList)
      } else {
        this.memberData.forEach(b => {
          b.memberState = '1'
        })
      }
      this.memberData.forEach((a, i) => {
        if (i !== 0) {
          if (a.pkId !== '') {
            // 勾选已有数据
            let checked = {
              pkId: a.pkId,
              memberState: a.memberState
            }
            this.checkedList.push(checked)
          }
        }
      })
    },
    // 选人
    choseMan (manMap, list, index) {
      // 判断新增的人员是否在删除中
      if (this.deleteList.length !== 0) {
        this.deleteList.forEach((n, i) => {
          if (n.code === manMap.userItcode) {
            this.deleteList.splice(i, 1)
          }
        })
      }
      let name = {
        'code': manMap.userItcode
      }
      this.oldNameList.push(name)
      this.memberData[index].memberName = manMap.userName
      this.memberData[index].memberCode = manMap.userItcode
      this.memberData[index].pkId = ''
      this.memberData[index].btnName = '删除'
      this.memberData[index].memberPhone = manMap.userPhone
      this.memberData[index].memberEmail = manMap.userEmail
      this.$set(this.memberData[index], 'sourceName', '自选')
      let nameMap = {
        pkId: '',
        memberCode: '',
        memberName: '',
        memberPhone: '请选择人员',
        memberEmail: '请选择人员',
        memberSelfDescript: '--',
        source: '',
        sourceName: '请选择人员',
        memberState: '1',
        btnType: false,
        btnName: ''
      }
      this.memberData.push(nameMap)
    },
      // 返回输入建议方法
      querySearch (queryString, cb) {
        console.log("无法为",queryString)
        let restaurants = this.projectList
        let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
        cb(results)
      },
      // 筛选匹配项目的数据
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
        }
      },
      // 选项目
      handleSelect (item) {
        // 获取项目id
        this.projectId = item.pkId
        // 获取项目名
        this.selectProjects = item.projectName
        // 成员开关
        this.project.memberSwitch = item.memberOnOff
        this.getMemberList(item.pkId)
      }
  },
  components: {
    topTip,
    selectMan
  }
};
</script>
<style>
.el-tooltip__popper {
  max-width: 1000px;
}
.demo .el-switch__label {
   display: none;
   color: #fff;
 }
 /*打开时文字位置设置*/
 .demo .el-switch__label--right {
   position: absolute;
   z-index: 1;
   right: 25px;
 }
 /*关闭时文字位置设置*/
 .demo .el-switch__label--left {
   position: absolute;
   z-index: 1;
   left: -10px;
 }
 /*显示文字*/
 .demo .el-switch__label.is-active {
   display: block;
 }
 .demo.el-switch .el-switch__core,
 .el-switch .el-switch__label {
   width: 50px !important;
 }
.yt-project-manager-add {
    min-width: 1024px;
    min-height: 97%;
    background: #fff;
}
.yt-project-manager-add .tip-text {
    color: #afbcc1;
    font-size: 12px;
}
.yt-project-manager-add .el-table .hide-selection .el-checkbox__input {
      display: none
}
.yt-project-manager-add .form-center {
  margin-bottom: 0px !important;
}
.delete-btn {
  color: #FF0000;
}
.sure-btn {
  color: #409EFF;
  
}
</style>

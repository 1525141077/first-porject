<template>
  <div class="yt-dome-container">
    <!-- <addPageComponets :popList="dataMap" :lookType="'2'" :needBtn ="false"></addPageComponets> -->
    <detailsPageComponets :popList="dataMap" :lookType="'3'" :needBtn ="false"></detailsPageComponets>
    <!-- 上传竞聘方案START -->
    <div v-if="isShow">
    <div>
      <!-- 顶部信息START -->
      <topTip>
        <template>
          <el-col :span="23" style="text-align: left;" class="top-tip">
            <span style="color: #417095;font-size: 16px;font-weight: bolder;">竞聘信息</span>
            </el-col>
        </template>
      </topTip>
      <!-- 顶部信息END -->
    <div>
      <el-form ref="subInfo" :model="subInfo">
        <el-row>
          <el-col :span="8">
            <el-form-item label="竞聘人："  label-width="110px" prop="competitor" :rules="{ required: true, message: '请选择竞聘人', trigger: 'change' }">
           <selectMan :selectName="competitorData" @choseMan="handleSelect"> 
           </selectMan>
        </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="竞聘岗位："  label-width="140px">
              <span v-if="listType === '1'">项目负责人</span>
              <span v-else>项目成员</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="更新时间："  label-width="140px" >
              <span>{{memberUpdate}}</span>
            </el-form-item>
          </el-col>
        </el-row>
          <el-form-item v-if="listType === '1'" label="上传竞聘方案："  label-width="110px" prop="competeFileList" :rules="{ required: true, message: '请上传竞聘方案', trigger: 'blur' }">
            <upload @upload="jpUpload" @delFile="delFileBtn" :fileList="subInfo.competeFileList" style="">
                <!-- <template>(命名规则：【项目名称】竞聘方案-XX（姓名），仅支持PDF格式文件上传)</template> -->
            </upload>
            <span style="position: absolute;top: 0px;left: 76px;font-size:12px;color: #aeaeae">(命名规则：【项目名称】竞聘方案-XX（姓名），仅支持PDF格式文件上传)</span>
          </el-form-item>
          <el-form-item v-if="listType === '3'" label="自我描述："  label-width="110px" prop="memberSelfDescript" :rules="{ required: false, message: '请上传竞聘方案', trigger: 'blur' }">
              <el-input
              v-model="member.memberSelfDescript"
              type="textarea"
              autosize
              placeholder="请输入">
              </el-input>
          </el-form-item>
      </el-form>
    </div>
    </div>
    <!-- 底部按钮 START -->
    <div style="text-align: center;">
      <el-button class="yt-bottom-btn" type="primary" :loading="subLoading" @click="submit">提交</el-button>
      <el-button class="yt-bottom-btn" @click="backBtn">返回</el-button>
    </div>
    <!-- 底部按钮END -->
    </div>
    <!-- 上传竞聘方案END -->
    <!-- 竞聘方案信息START -->
    <div v-if="!isShow && isJp === true">
    <div>
      <!-- 顶部信息START -->
      <topTip>
        <template>
          <el-col :span="23" style="text-align: left;" class="top-tip">
            <span style="color: #417095;font-size: 16px;font-weight: bolder;">竞聘方案信息</span>
            </el-col>
        </template>
      </topTip>
      <!-- 顶部信息END -->
    <div>
      <div style="margin: 0px 0px 10px 20px;">
        <el-button class="yt-bottom-btn" type="primary" @click="bjBtn">标记中选</el-button>
        <el-button class="yt-bottom-btn" type="primary" @click="downloadAll">批量下载</el-button>
      </div>
      <div>
        <el-table
        border
        :data="tableData"
        style="width: 100%">
        <el-table-column
          label=""
          width="50">
           <template scope="scope">
              <el-radio-group v-model="checkedId">
               <el-radio class="radio" :label="scope.row.biddingId + ''">
                 &nbsp
                </el-radio>
             </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column
          prop="competitorName"
          align="center"
          label="竞聘人"
          width="120">
        </el-table-column>
        <el-table-column
          prop="operator"
          align="center"
          label="操作人"
          width="120">
        </el-table-column>
        <el-table-column
          prop="nameList"
          label="竞聘方案">
          <template scope="scope">
            <el-button style="padding: 0px;" v-for=" item in scope.row.nameList" type="text" 
            @click="lookfilesBtn(item)">
              {{item.fileName}}
              </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="isWinning"
          align="center"
          label="中选标记"
          width="100">
        </el-table-column>
      </el-table>
      </div>
    </div>
    </div>
    <!-- 底部按钮 START -->
    <div style="text-align: center;margin: 10px 0px;">
      <el-button class="yt-bottom-btn" type="primary" @click="sendEndResult">公布竞聘结果</el-button>
      <el-button class="yt-bottom-btn" @click="backBtn">取消</el-button>
    </div>
    <!-- 底部按钮END -->
    </div>
    <!-- 竞聘方案信息END -->
    <!-- 中选人信息弹框 -->
    <div v-if="dialogSta"> 
      <winDialog :name="name" :dialogSta="dialogSta" @canelBtn="canelBtn" @sureBtn="sureBtn"></winDialog>
    </div>
  </div>
</template>

<script>
// 中选组件
import winDialog from "../../components/winDialog.vue"
// 选人组件
import selectMan from "../../components/selectMan.vue"
import topTip from '../../components/topTip.vue'
import upload from '../../components/upload.vue'
// import addPageComponets from "../../components/addPageComponets.vue"
import detailsPageComponets from '../../components/detailsPageComponets.vue'
import axios from '../../service/http'
import { option } from '../../static/config'
export default {
  data() {
    return {
      // 更新时间
      memberUpdate: '--',
      // 提交成员信息 
      member: {
        pkId: '',
        mainId: '',
        memberCode: '',
        memberName: '',
        memberPhone: '',
        memberEmail: '',
        memberSelfDescript: ''
      },
      // 当前列表点击按钮
      listType: this.$route.query.type,
      // 中选弹框的状态
      dialogSta: false,
      subLoading: false,
      // 竞聘人数据
      jpManList: [],
      // 登录人信息
      userInfo: {},
      // 标记中选的id
      checkedId: '',
      bjBtnType: false,
      checks: false,
      // 列表数据
      tableData: [],
      // 提交信息
      subInfo: {
        pkId: '',
        mainId: '',
        competitor: '',
        competitorName: '',
        competitorPhone: '',
        competeFileList: []
      },
      competitorData: '',
      // 详情信息
      dataMap: {
        projectName: '',
        customerName: '',
        customerContacts: '',
        customerContactInformation: '',
        customerPost: '',
        businessSource: '',
        businessType: '',
        feedbackDate: '',
        projectEstimate: '',
        projectSurvey: '',
        demandExpansion: '',
        resourceMatching: '',
        projectFlieList: [],
        isCompete: '1',
        closingDate: '',
        projectPerson: '',
        projectBudget: '',
        competeFileList: [],
        projectPersonRemak: ''
      },
      isShow: true,
      isJp: false,
      name: ''
    };
  },
  mounted() {
    // 查看详情
    this.lookDetails()
    // 当前登录用户
    this.getUserInfo()
    if (this.$route.query.type.toString() === '3') {
      this.lookMemberInfo()
    } else {
      this.lookJpDetails()
    }
    if (this.$route.query.type.toString() === '1' || this.$route.query.type.toString() === '3') {
      this.isShow = true
    } else {
      this.isShow = false
    }
  },
  methods: {
    // 获取当前登录人信息
    getUserInfo () {
      let mainId = this.subInfo.pkId
      axios.post(option.base_path + 'index/getCurrentUserInfo', {
        page: 1
      }).then(res => {
        this.userInfo = res.data.data;
        if (res.data.data.rodNames.indexOf(',竞聘管理员,') !== -1) {
          this.isJp = true
        }
        // 初次进入
        if (mainId === '') {
          if (this.listType === '1') {
            this.subInfo.competitor = res.data.data.userName
            this.subInfo.competitorName = res.data.data.realName
            this.subInfo.competitorPhone = res.data.data.userPhone
          } else {
            this.member.memberEmail = res.data.data.userEmail
            this.member.memberCode = res.data.data.userName
            this.member.memberName = res.data.data.realName
            this.member.memberPhone = res.data.data.userPhone
          }
        }
          this.competitorData = res.data.data.realName + res.data.data.userPhone
      })
    },
    // 预览文件
    lookfilesBtn (item) {
      let fielName = item.fileName.substr(-3, 3)
      if (item.fileName.substr(-3, 3) !== 'pdf') {
        if (item.fileName.substr(-3, 3) === 'jpg' || item.fileName.substr(-3, 3) === 'png' || item.fileName.substr(-3, 3) === 'pdf') {
          let action = option.base_path + 'fileUpDownload/download?pkId=' + item.fileId + '&isDownload=false'
          window.open(action, '_blank');
        } else {
          this.$message.warning('暂不支持在线预览')
        }
      } else {
        let action = option.base_path + 'db/bidding/attachmentPreview?fileId=' + item.fileId + '&isDownload=false'
        window.open(action, '_blank');
      }
    },
    // 查看公共详情
    lookDetails () {
      this.subInfo.mainId = this.$route.query.mainId
      let mainId  = this.$route.query.mainId
      if (mainId) {
        let data = {
          mainId: mainId
        }
        axios.post(option.base_path + 'db/project/getProjectDetails', data).then(res => {
          if (res.data.flag === 0) {
            this.dataMap = res.data.data
          }
        })
      }
    },
    // 查看成员信息
    lookMemberInfo () {
      let pkId = this.$route.query.mainId
      let data = {
        pkId: pkId
      }
      axios.post(option.base_path + 'db/member/getMemberDetails', data).then(res => {
        if (res.data.flag === 0) {
          if (res.data.data) {
            this.memberUpdate = res.data.data.updateTime
            this.member.pkId = res.data.data.pkId
            this.member.mainId = this.$route.query.mainId
            this.member.memberEmail = res.data.data.memberEmail
            this.member.memberSelfDescript = res.data.data.memberSelfDescript
            this.member.memberCode = res.data.data.memberCode
            this.member.memberName = res.data.data.memberName
            this.member.memberPhone = res.data.data.memberPhone
            this.competitorData = res.data.data.memberName + res.data.data.memberPhone
          }
        }
      })
    },
    // 查看竞聘方案信息
    lookJpDetails () {
      let listType = this.listType
      listType = listType === '1' || listType === '3' ? '1' : listType
      let details = {
        mainId: this.$route.query.mainId,
        type: listType
      }
      this.tableData = []
      axios.post(option.base_path + 'db/bidding/getProjectBiddingDetails', details).then(res => {
        if (res.data.flag === 0) {
          // this.subInfo.updateTime = res.data.data.updateTime
          if (this.$route.query.type === '2') {
            if (res.data.data.competeFileList.length !== 0) {
                // 记录上一个人的姓名
                let lastName = ''
                // 记录附件信息
                let nameList = []
                res.data.data.competeFileList.forEach((n, i) => {
                  if (n.isWinning === 1) {
                    n.isWinning = '中选'
                    this.name = n.competitorName
                    this.checkedId = n.biddingId.toString()
                  } else {
                    n.isWinning = '未中选'
                  }
                  // 重写附件
                  if (lastName === n.competitorName) {
                    // 相等
                    // if (nameList === '') {
                    //   nameList += n.fileName
                    // } else {
                    //   nameList += '，' + n.fileName
                    // }
                    let fileMap = {
                      fileId: n.fileId,
                      fileName: n.fileName
                    }
                    nameList.push(fileMap)
                    this.$set(this.tableData[this.tableData.length - 1], 'nameList', nameList)
                  } else {
                    nameList = []
                    // 不相等
                    let fileMap = {
                      fileId: n.fileId,
                      fileName: n.fileName
                    }
                    nameList.push(fileMap)
                    this.$set(n, 'nameList', nameList)
                    this.tableData.push(n)
                  }
                  lastName = n.competitorName
                })
              }
          } else {
            if (res.data.data) {
              this.memberUpdate = res.data.data.updateTime
              this.subInfo.competitor = res.data.data.competitor
              this.subInfo.competitorName = res.data.data.competitorName
              this.subInfo.competitorPhone = res.data.data.competitorPhone
              this.competitorData = res.data.data.competitorName + res.data.data.competitorPhone
              if (res.data.data.competeFileList.length !== 0) {
                res.data.data.competeFileList.forEach(n => {
                  for (let k in n) {
                    if (k === 'fileName') {
                      n['name'] = n[k]
                    }
                  }
                  this.subInfo.competeFileList.push(n)
                })
              }
              this.subInfo.pkId = res.data.data.pkId
            }
          }
        }
      })
    },
    // 中选标记
    bjBtn () {
      let checkedId = this.checkedId
      if (checkedId !== '') {
        let map = {
          pkId: checkedId
        }
        this.tableData.forEach(n => {
          if (n.biddingId.toString() === this.checkedId) {
            this.name = n.competitorName
          }
        })
        axios.post(option.base_path + 'db/bidding/updateProjectBiddingDetails', map).then(res => {
          if (res.data.flag === 0) {
            this.$message.success('标记中选成功')
            this.lookJpDetails()
            // this.backBtn()
          }
        })
        this.bjBtnType = true
      } else {
        this.$message.warning('请先选中')
      }
    },
    // 批量下载
    downloadAll () {
      let action = option.base_path + 'db/bidding/attachmentDownload?pkId=' + this.$route.query.mainId
      let link = document.createElement('a')
      link.setAttribute('href',action)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      // axios.get(option.base_path + 'db/bidding/attachmentDownload?pkId=' + this.$route.query.mainId).then(res => {
      //   if (res.data.flag === 0) {
      //     this.tableData = res.data.competeFileList
      //     this.tableData.forEach(n => {
      //       if (n.isWinning === '1') {
      //         this.$set(n, 'isWinningString', '是')
      //       } else {
      //         this.$set(n, 'isWinningString', '否')
      //       }
      //     })
      //   }
      // })
    },
    // 上传
    jpUpload (file) {
      this.subInfo.competeFileList = this.forSet(file)
      // this.subInfo.competeFileList = JSON.stringify(this.subInfo.competeFileList)
      console.log(this.subInfo.competeFileList)
    },
    // 删除文件
    delFileBtn (file) {
      this.subInfo.competeFileList = this.forSet(file)
    },
    // 循环设置
    forSet (list) {
      let newList = []
      list.forEach(n => {
        let map = {
          fileId: n.fileId,
          fileName: n.fileName,
          name: n.fileName
        }
        newList.push(map)
      })
      return newList
    },
    // 选中
    handleSelect (item) {
      let type = this.listType
      if (type === '1') {
        this.subInfo.competitor = item.userItcode
        this.subInfo.competitorName = item.userName
        this.subInfo.competitorPhone = item.userPhone
      } else {
        debugger
        this.member.memberEmail = item.userEmail
        this.member.memberCode = item.userItcode
        this.member.memberName = item.userName
        this.member.memberPhone = item.userPhone
        this.member.mainId =  this.$route.query.mainId
      }
      this.competitorData = item.userName + item.userPhone
      console.log(item)
    },
    // 提交
    submit () {
      let type = this.listType
      if (type === '1') {
        // 判断状态是否可修改
        let thisState = {
          pkId: this.$route.query.mainId,
          state: this.$route.query.state
        }
        let data = this.subInfo
        this.$refs.subInfo.validate(n => {
          if (n) {
            this.$confirm('请确认是否提交', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.subLoading = true
              axios.post(option.base_path + 'db/bidding/getProjectBiddingState', thisState).then(res => {
                this.subLoading = false
                if (res.data.flag === 0) {
                  if (res.data.data=== 1) {
                    axios.post(option.base_path + 'db/bidding/updateProjectBiddingList', data).then(res => {
                      if (res.data.flag === 0) {
                        this.$message.success('提交成功')
                        this.backBtn()
                      }
                    })
                  } else {
                    this.$message.success('提交失败，当前信息状态已改变')
                  }
                }
              })
            }).catch(() => {
            })
          }
        })
      } else {
        this.submitMember()
      }
    },
    // 提交成员
    submitMember () {
      this.member.mainId = this.$route.query.mainId
      let member = this.member
      axios.post(option.base_path + 'db/member/saveOrUpdateMember', member).then(res => {
        if (res.data.flag === 0) {
          this.$message.success('提交成功')
          this.backBtn()
        }
      })
    },
    // 公布竞聘结果
    sendEndResult () {
      debugger
      if (this.checkedId === '') {
        this.$alert('请在竞聘者中选择中选人。如需另选他人，请在项目信息页面修改立项信息，直接指定项目负责人', '提示', {
          confirmButtonText: '关闭',
          type: 'warning',
          callback: action => {
          }
        })
      } else {
        if (!this.bjBtnType) {
          this.$alert('当前未标记中选人！请点击“标记中选”按钮进行标记', '提示', {
            confirmButtonText: '关闭',
            type: 'warning',
            callback: action => {
            }
          })
        } else {
          this.dialogSta = true
        }
      }
    },
    // 中选弹框取消按钮
    canelBtn () {
      this.dialogSta = false
    },
    // 中选弹框确定按钮
    sureBtn () {
      let pkId = this.$route.query.mainId
          let map = {
            pkId: pkId
          }
          axios.post(option.base_path + 'db/bidding/emailProjectBiddingDetails', map).then(res => {
            if (res.data.flag === 0) {
              this.$message.success('公布竞聘结果成功')
              this.backBtn()
            }
          })
    },
    // 返回
    backBtn () {
      this.$router.replace({
        path: '/internalProjectTender/internalProjectTenderList'
      })
    }
  },
  components: {
    upload,
    topTip,
    selectMan,
    detailsPageComponets,
    winDialog
  }
};
</script>

<style>
  .jp-man {
    display: unset;
  }
</style>

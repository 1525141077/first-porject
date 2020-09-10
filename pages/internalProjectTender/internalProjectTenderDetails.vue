<template>
  <div class="yt-dome-container">
    <detailsPageComponets  :popList="dataMap" :lookType="'2'" :needBtn ="false"></detailsPageComponets>
    <!-- 竞聘方案信息START -->
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
      <!-- 项目负责人 START -->
      <div style="margin: 0px 0px 20px 0px;">
        <div style="position: relative;">
          <span class="jp-icon"></span>
        <div class="jp-title" style="">项目负责人</div>
        </div>
        <el-table
        border
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="competitorName"
          label="竞聘人"
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="operator"
          label="操作人"
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          label="竞聘方案">
          <template scope="scope">
            <div v-if="lookState === '10' && isJp || lookState === '50'">
              <el-button style="padding: 0px;"
              v-for=" (item, i) in scope.row.nameList" type="text"
              :key="i"
              @click="lookfilesBtn(item)">
                {{item.fileName}}
                </el-button>
            </div>
              <span v-else>
                暂未公布
              </span>
          </template>
        </el-table-column>
         <el-table-column
          prop="updateTime"
          label="更新时间"
          align="center"
          width="140">
        </el-table-column>
        <el-table-column
          prop="isWinningString"
          label="中选标记"
          align="center"
          width="140">
          <template scope="scope">
            <span v-if="lookState === '10' && isJp || lookState === '50'">{{scope.row.isWinningString}}</span>
            <span v-else>暂未公布</span>
          </template>
        </el-table-column>
      </el-table>
      </div>
      <!-- 项目负责人END -->
      <!-- 项目成员 START -->
      <div>
        <div style="position: relative;">
          <span class="jp-icon"></span>
        <div class="jp-title">项目成员</div>
        </div>
        <el-table
        border
        :data="projectMember"
        style="width: 100%">
        <el-table-column
          prop="memberName"
          label="竞聘人"
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="createUserName"
          label="操作人"
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="memberSelfDescript"
          show-overflow-tooltip
          label="自我描述">
          <template scope="scope">
                  <!-- <el-tooltip class="item" effect="dark" placement="top">
                    <div slot="content" style="padding: 0px 20px;">
                      <div>
                        {{scope.row.memberSelfDescript}}
                      </div>
                    </div>
                  </el-tooltip> -->
                      <span style="text-overflow: ellipsis;white-space: nowrap;">{{scope.row.memberSelfDescript}}</span>
                </template>
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="更新时间"
          align="center"
          width="140">
        </el-table-column>
      </el-table>
      </div>
      <!-- 项目成员END -->
    </div>
    </div>
    <!-- 底部按钮 START -->
    <div style="text-align: center;margin:10px 0px;">
      <el-button class="yt-bottom-btn" @click="backBtn">关闭</el-button>
    </div>
    <!-- 底部按钮END -->
    <!-- 竞聘方案信息END -->
  </div>
</template>

<script>
import topTip from '../../components/topTip.vue'
import upload from '../../components/upload.vue'
import detailsPageComponets from "../../components/detailsPageComponets.vue"
import axios from '../../service/http'
import { option } from '../../static/config'
export default {
  data() {
    return {
      // 当前查看状态
      lookState: this.$route.query.state,
      isJp: false,
      // 列表数据
      tableData: [],
      projectMember: [],
      dataMap: {
        projectName: '上东金茂府-C2 地块',
        customerName: '天津市滨海万新投资开发建设有限公司',
        customerContacts: '赵芳',
        customerContactInformation: '13789089093',
        customerPost: '--',
        businessSource: '招标信息',
        businessType: '造价审核',
        feedbackDate: '2020-06-17',
        projectEstimate: '3,000,000.00',
        projectSurvey: '天津市滨海万新投资开发建设有限公司',
        demandExpansion: '打豆豆',
        resourceMatching: '打豆豆',
        projectFlieList: [],
        isCompete: '2',
        closingDate: '打豆豆',
        projectPerson: '打豆豆',
        projectBudget: '打豆豆',
        competeFileList: [],
        projectPersonRemak: '等等'
      }
    };
  },
  mounted() {
    // 查看详情
    this.getUserInfo()
    this.lookDetails()
    this.lookProjectMemeber()
    this.lookJpDetails()
  },
  methods: {
    // 查看当前登录人
    getUserInfo () {
      axios.post(option.base_path + 'index/getCurrentUserInfo', {
        page: 1
      }).then(res => {
        if (res.data.data.rodNames.indexOf(',竞聘管理员,') !== -1) {
          this.isJp = true
        }
      })
    },
    // 查看公共详情
    lookDetails () {
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
    // 预览文件
    lookfilesBtn (item) {
      let fielName = item.fileName.substr(-3, 3)
      if (fielName !== 'pdf') {
        if (fielName === 'jpg' || fielName === 'png' || fielName === 'pdf') {
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
    // 查看竞聘方案信息
    lookJpDetails () {
      let details = {
        mainId: this.$route.query.mainId,
        type: this.$route.query.type
      }
      axios.post(option.base_path + 'db/bidding/getProjectBiddingDetails', details).then(res => {
        if (res.data.flag === 0) {
          this.tableData = res.data.data.competeFileList
          let newTableData = []
          if (this.tableData.length !== 0) {
            // 记录上一个人的姓名
            let lastName = ''
            // 记录附件信息
            let nameList = []
            this.tableData.forEach((n, i) => {
              debugger
              if (n.isWinning === 1) {
                this.$set(n, 'isWinningString', '中选')
              } else {
                this.$set(n, 'isWinningString', '未中选')
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
                this.$set(newTableData[newTableData.length - 1], 'nameList', nameList)
              } else {
                nameList = []
                // 不相等
                let fileMap = {
                  fileId: n.fileId,
                  fileName: n.fileName
                }
                nameList.push(fileMap)
                this.$set(n, 'nameList', nameList)
                newTableData.push(n)
              }
              lastName = n.competitorName
            })
            this.tableData = newTableData
          }
        }
      })
    },
    // 查看项目成员
    lookProjectMemeber () {
      let map = {
        pkId: this.$route.query.mainId
      }
      axios.post(option.base_path + 'db/member/getMemberList', map).then(res => {
          if (res.data.flag === 0) {
            this.projectMember = res.data.data
          }
        })
    },
    // 关闭
    backBtn  () {
      this.$router.replace({
        path: '/internalProjectTender/internalProjectTenderList'
      })
    }
  },
  components: {
    detailsPageComponets,
    upload,
    topTip
  }
};
</script>

<style>
.el-tooltip__popper {
  max-width: 1000px;
}
  .jp-man {
    display: unset;
  }
  .jp-icon {
    display: inline-block;
    width: 4px;
    top: -2px;
    left: 4px;
    height: 23px;
    position: absolute;
    margin-left: 28px;
    background: #244972;
  }
  .jp-title {
    padding:0px 0px 16px 50px;
    display: inline-block;
    color: rgb(65, 112, 149);
    font-weight: bolder;
  }
</style>

<template>
  <div class="yt-dome-container">
    <addPageComponets :assembly="'2'" :lookType="'1'" :repair="repair" :btnLoading="btnLoading" @check="check" :popList="popList" @resetForm="closeBtn"></addPageComponets>
    <journalList :pkId="mainMap.mainId"></journalList>
  </div>
</template>

<script>
import addPageComponets from "../../components/addPageComponets.vue";
// import topTip from "../../components/topTip.vue";
// 日志组件
import journalList from "../../components/journalList.vue";
import upload from "../../components/upload.vue";
import axios from '../../service/http';
import { option } from '../../static/config';
export default {
  data() {
    return {
      btnLoading: false,
      // 判断是新增还行修改
      repair: '',
      checks: false,
      jpInfo: {
        jpMan: "",
        fileList: []
      },
      popList: {
        pkId: '', //项目编号
        projectName: '', //项目名称
        customerName: '', //客户名称
        customerContacts: '', //客户联系人
        customerContactInformation: '', //客户联系方式
        customerPost: '', //客户职务
        businessSource: '', //业务来源
        businessType: '', //业务类型
        feedbackDate: '', //最晚反馈日期
        projectEstimate: '', //项目估算
        projectSurvey: '', //项目概况
        demandExpansion: '', //需求扩展
        resourceMatching: '', //资源匹配
        projectFlieList: [], //项目附件list
        isCompete: '1', //是否需要竞聘 1是2否
        closingDate: '', //竞聘截止时间
        projectPerson: '', //项目负责人
        projectBudget: '', //项目预算
        competeFileList: [], //竞聘附件list
        customerLinkmanStr: [{
          pkId:'',
          customerContacts:'',
          customerContactsDept:'',
          customerPost:'',
          customerContactsInformation:'',
          customerContactsEmail:'',
        }],
        projectPersonRemak: '', //项目负责人说明
        //state: '' //状态 0待立项、10已立项&竞聘中、20暂不立项
      },
      mainMap:{
        mainId: ''
      },
      journalList:[]
    };
  },
  mounted() {
    if (this.$route.query) {
      this.popList.pkId = this.$route.query.mainId;
      this.mainMap.mainId = this.$route.query.mainId;
      this.repair = this.$route.query.state
    }
    if (this.popList.pkId) {
      this.getProjectDetails();
      // this.rzState();
    }
  },
  methods: {
    // 验证信息
    check(list) {
      
      this.checks = list.check;
      var form = list.form;
      var formInfo = list.formInfo;
      var pkId = list.pkId;
      this.popList = {};
      Object.assign(this.popList,form);
      Object.assign(this.popList,formInfo);
      this.popList.state = list.type;
      this.popList.pkId = list.pkId;
      if (this.popList.pkId) {
        //修改接口
        this.updateProjectList();
      } else {
        //提交接口
        this.addProjectList();
      }
      console.log(this.popList);
    },
    // 返回输入建议方法
    querySearch(queryString, cb) {},
    // 选中
    handleSelect() {},
    // 关闭
    closeBtn () {
      this.$router.replace({
        path: '/projectApproval/projectApprovalList'
      })
    },
    //提交接口
    addProjectList(){
      if (this.popList.state === '10') {
        this.$confirm('立项后将发送邮件通知全部人员！', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确认并发送邮件',
          type: 'warning'
        }).then(() => {
          this.addProjectData()
        }).catch(() => {
        })
      } else {
        this.addProjectData()
      }
    },
    addProjectData() {
      this.btnLoading = true
      var me = this;
      //调用axios.post方法
      //"CASPARAMS":"OFF_INDEX"
      axios.post(option.base_path + 'db/project/addProjectList', this.popList).then(data => {
        this.btnLoading = false
        // this.peopleList.push(man)
        console.log('返回值', data.data.data)
        this.closeBtn();
      })
      .catch(function (error) {
        console.log(error);
      })

      axios
        .post(
          option.base_path + "db/customer/saveOrUpdateCustomer",{
        customerName:this.popList.customerName,
        customerLinkmanStr: JSON.stringify([{
          pkId:'',
          customerContacts:this.popList.customerContacts,
          customerContactsDept:'',
          customerPost:this.popList.customerPost,
          customerContactsInformation:this.popList.customerContactInformation,
          customerContactsEmail:'',
        }]),
          }
        )
        .then(res => {
          // if (res.data.flag == 0) {
          //   this.$router.push({ path: "/customer/customerList" });
          // } else {
          //   this.$message.error(data.data.message);
          // }
        })
        .catch(err => err);
    },
    //修改接口
    updateProjectList(){
      if (this.popList.state === '10') {
        this.$confirm('立项后将发送邮件通知全部人员！', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确认并发送邮件',
          type: 'warning'
        }).then(() => {
          this.btnLoading = true
          var me = this;
          //调用axios.post方法
          //"CASPARAMS":"OFF_INDEX"
            axios.post(option.base_path + 'db/project/updateProjectList', this.popList).then(data => {
              this.btnLoading = false
              // this.peopleList.push(man)
              console.log('返回值', data.data.data)
              this.closeBtn();
            })
            .catch(function (error) {
              console.log(error);
            })
        }).catch(() => {
        })
      } else {
        this.btnLoading = true
        var me = this;
        //调用axios.post方法
        //"CASPARAMS":"OFF_INDEX"
          axios.post(option.base_path + 'db/project/updateProjectList', this.popList).then(data => {
            this.btnLoading = false
            // this.peopleList.push(man)
            console.log('返回值', data.data.data)
            this.closeBtn();
          })
          .catch(function (error) {
            console.log(error);
          })
      }
    },
    //获取详情
    getProjectDetails(){
      var me = this;
      //调用axios.post方法
      //"CASPARAMS":"OFF_INDEX"
        axios.post(option.base_path + 'db/project/getProjectDetails', this.mainMap).then(data => {
          // this.peopleList.push(man)
          this.popList = data.data.data;
          console.log('返回值', data.data.data)
        })
        .catch(function (error) {
          console.log(error);
        })
    }
  },
  components: {
    addPageComponets,
    // topTip,
    upload,
    journalList
  }
};
</script>

<style >
.table-span {
    text-overflow: ellipsis;
    display: inline-block;
    overflow: hidden;
}
.row-div {
  padding-left: 20px;
  padding-right: 20px;
}
.yt-dome-container {
  padding-bottom: 20px;
}
.rz-tab {
  border: none;
}
.rz-tab table td {
  border-right:none;
  border-bottom:1px dashed #999!important;
}
/* .rz-tab table td  {
  border-left:1px dashed #999!important;
}
.rz-tab table td:first-child  {
  border-left:none !important;
} */
.rz-tab table td div.cell {
  border-left:1px dashed #999!important;
}
.rz-tab table td:first-child div {
  border-left:none !important;
}
.rz-tab::before {
  height: 1px;
  background: #ffffff;
}
.rz-tab:after {
  width: 1px;
   background: #ffffff;
}
</style>

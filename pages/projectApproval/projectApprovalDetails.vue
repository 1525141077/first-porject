<template>
  <div class="yt-dome-container">
    <detailsPageComponets  :popList="dataMap" :lookType="'2'" :needBtn ="true" @close="closeBtn"></detailsPageComponets>
    <!-- 竞聘方案信息END -->
    <journalList :pkId="mainMap.mainId"></journalList>
  </div>
</template>

<script>
import journalList from '../../components/journalList.vue'
import detailsPageComponets from "../../components/detailsPageComponets.vue";
import axios from '../../service/http';
import { option } from '../../static/config';
export default {
  data() {
    return {
      journalList: [],
     
      dataMap: {
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
        projectPersonRemak: '', //项目负责人说明
        //state: '' //状态 0待立项、10已立项&竞聘中、20暂不立项
      },
      mainMap:{
        mainId: ''
      }
    };
  },
  mounted() {
    this.mainMap.mainId = this.$route.query.mainId;
    this.getProjectDetails();
  },
  methods: {
    
    // 关闭
    closeBtn  () {
      this.$router.replace({
        path: '/projectApproval/projectApprovalList'
      })
    },
    //获取详情
    getProjectDetails(){
      var me = this;
      //调用axios.post方法
      //"CASPARAMS":"OFF_INDEX"
        axios.post(option.base_path + 'db/project/getProjectDetails', this.mainMap).then(data => {
          // this.peopleList.push(man)
          this.dataMap = data.data.data;
          console.log('返回值', data.data.data)
        })
        .catch(function (error) {
          console.log(error);
        })
    }
  },
  components: {
    detailsPageComponets,
    journalList
  }
};
</script>

<style>
  .jp-man {
    display: unset;
  }
  .rz-tab {
  border: none;
}
.rz-tab table td {
  border-right:none;
  border-bottom:1px dashed #999!important;
}
.rz-tab table td div {
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

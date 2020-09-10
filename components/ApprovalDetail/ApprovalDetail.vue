<template>
  <div class="approvalDetail">
    <div class="flow-div flow-log">
      <div class="flow-item" v-for="(item, index) in detailData" :key="index">
        <div class="log-icon-border" v-show="index != (detailData.length-1)"></div>
        <div class="flow-icon">
          <img :src="item.icon" />
          <div class="log-icon-num">{{item.count}}<div></div>
          </div>
        </div>
        <div class="flow-detail clearfix">
          <div class="flow-detail-left">
            <div class="log-details">
              <label class="log-task-name">【{{item.taskName}}】</label>
              <label class="log-name">{{item.userName}}</label>
              <img class="log-img" :src="item.img" />
            </div>
            <div class="log-title">
              <label class="log-title-state">操作状态：</label>
              <label class="log-title-approval">{{item.operationState}}</label>
            </div>
            <div class="log-title" v-if="item.comment==''?false:true">
              <label class="log-title-state">操作意见：</label>
              <label class="log-title-approval">{{item.comment}}</label>
            </div>
          </div>
          <div class="flow-detail-right">
            <label>{{item.commentTime}}</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Message } from "element-ui";
import req from "../../service/http";
import topTip from "@/components/topTip";
import config from "../../static/config";

export default {
  name: "approvalDetail",
  data() {
    return {
      detailData: []
    };
  },
  created() {
    this.getDetailInfo();
  },
  methods: {
    async getDetailInfo() {
      try {
        await req({
          url: "basicconfig/workFlow/getWorkFlowLog",
          params: {
            processInstanceId: this.processInstanceId
          }
        })
          .then(result => {
            let detailData = result.data.data;
            for (let j = 0; j < detailData.length; j++) {
              detailData[j].count = detailData.length - j;
              detailData[
                j
              ].icon = require("../../assets/images/flow-detail/log-num-first.png");
              detailData[
                j
              ].img = require("../../assets/images/flow-detail/log-info-border.png");
            }
            detailData[
              detailData.length - 1
            ].icon = require("../../assets/images/flow-detail/log-num.png");
            detailData[
              detailData.length - 1
            ].img = require("../../assets/images/flow-detail/log-border-color.png");
            this.detailData = detailData;
          })
          .catch(err => {});
      } catch (error) {
        Message.error({
          message: "获取后台数据出错"
        });
      }
    }
  },
  props: {
    processInstanceId: String
  }
};
</script>

<style scoped>
.log-img {
  position: absolute;
  left: 70px;
  top: 20px;
  z-index: 99999;
}
.log-name {
  margin-left: 5px;
}
.log-icon-num {
  position: absolute;
  top: 7px;
  height: 39px;
  width: 60px;
  text-align: center;
  line-height: 40px;
  font-size: 30px;
  color: #417095;
  font-weight: bold;
  z-index: 5;
}
.log-icon-num div {
  position: absolute;
  top: 5px;
  left: 9px;
  width: 20px;
  height: 30px;
  background: #fff;
  opacity: 0.7;
  filter: alpha(opacity=30);
  z-index: 3;
  -webkit-border-radius: 50% 0 0 50%;
  -moz-border-radius: 50% 0 0 50%;
  border-radius: 50% 0 0 50%;
}
.flow-item:nth-last-child(1) .log-icon-num {
  top: 12px;
}
.flow-item {
  position: relative;
  padding: 0 8px 20px 78px;
  min-height: 60px;
}
.flow-detail {
  padding-bottom: 20px;
  padding-top: 8px;
  border: 1px solid #dfe6f3;
  z-index: 1;
}
.flow-item:nth-of-type(1) .flow-detail {
  box-shadow: 0 0 6px #96d6f4;
}
.log-details {
  font-size: 18px;
}
.flow-icon {
  position: absolute;
  left: 6px;
  right: 0;
  width: 60px;
  text-align: center;
}
.flow-detail-left {
  float: left;
}
.log-title {
  margin-top: 5px;
  margin-left: 8px;
}
.flow-log {
  padding-top: 20px;
}
.clearfix:after {
  visibility: hidden;
  display: block;
  font-size: 0;
  content: " ";
  clear: both;
  height: 0;
}
.clearfix {
  *zoom: 1;
}
.approvalDetail {
  background-color: #fff;
}
.flow-detail-right {
  float: right;
  margin-right: 20px;
}
.log-title-state {
  color: #417095;
  font-weight: bold;
}
.log-title {
  font-size: 14p;
}
.log-icon-border {
  position: absolute;
  top: 0;
  left: 6px;
  height: 100%;
  width: 28px;
  border-right: 3px solid #dfe6f3;
}
</style>
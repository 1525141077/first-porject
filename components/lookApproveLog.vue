<template>
  <div class="log-container">
       <!-- 有数据 -->
        <el-popover
            ref="dcPopover"
            placement="left-start"
            :width="400"
            trigger="hover"
            @show="showLog"
            :popper-options="{ boundariesElement: 'viewport', removeOnDestroy: true }"
            v-show="toggleLog">
            <el-timeline>
                <el-timeline-item
                v-for="(item, index) in logList"
                :key="index">
                    <div>
                        <div>
                            【{{item.taskName}}】
                            {{item.userName}}
                        </div>
                        <div class="log-row">
                            <span class="log-txt">操作状态：</span>{{item.operationState}}
                        </div>
                        <div  class="log-row">
                            <span class="log-txt">操作时间：</span>{{item.commentTime}}
                        </div>
                        <div class="log-line"></div>
                    </div>
                </el-timeline-item>
            </el-timeline>
            <el-link type="primary" slot="reference">日志</el-link>
        </el-popover>
        <!-- 暂无数据 -->
        <el-popover
            ref="dcPopover"
            placement="left-start"
            :width="150"
            trigger="hover"
            @show="showLog"
            :popper-options="{ boundariesElement: 'viewport', removeOnDestroy: true }"
            v-show="!toggleLog">
            <el-timeline>
                <div>暂无数据 </div>
            </el-timeline>
            <el-link type="primary" slot="reference">日志</el-link>
        </el-popover>
  </div>
</template>

<script>
import axios from '../service/http';
import { option } from '../static/config';
export default {
    data() {
        return {
            //是否显示暂无数据
            toggleLog:true,
            //弹出框数据
            logList: [],
      }  
    },
    props:{
        processInstanceId: {
            type: String,
            default() {
                return '';
            },
            required:true,
        }
    },
    methods:{
        //获取日志信息
        showLog(){
            var that=this;
            axios
                .post(option.base_path+"basicconfig/workFlow/getWorkFlowLog",{
                    processInstanceId: this.processInstanceId
                })
                .then(function(res){
                    if (res.data.flag == 0) {            
                        that.toggleLog=true;
                        that.logList = res.data.data;
                        that.$refs.dcPopover.updatePopper();
                    }else{
                         that.toggleLog=false;
                         that.logList = [];
                         that.$refs.dcPopover.updatePopper();
                    }
                })
        },
    }
}
</script>

<style scoped>
    .log-container{
        display: inline-block;
        position: relative;
    }
    .log-row{
        height: 30px;
        line-height: 30px;
    }
    .log-txt{
        color: #417095;
        font-weight: bold;
    }
    .log-line{
        border: 0.5px #417095 solid;
        margin-bottom: 0px;
    }
</style>
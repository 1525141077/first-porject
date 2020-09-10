<template>
    <div class="approvalSelect">
        <topTip>
            <div class="title">审批流程</div>
        </topTip>
        <el-form :model="approvalForm" ref="approvalSel">
            <el-row>
                <el-col :span="12">
                    <el-form-item
                    label="选择操作流程："
                    label-width="135px"
                    prop="nextCode"
                    :rules="{ required: true, message: '请选择操作流程', trigger: 'change' }">
                        <el-select 
                            v-model="approvalForm.nextCode" 
                            no-match-text="无匹配数据" 
                            filterable
                            default-first-option
                            size="small" 
                            @change="getApproveUsersByFlow">
                                <el-option
                                v-for="(item,index) in dataList"
                                :key="index+item.nextName"
                                :label="item.nextName"
                                :value="item.nextCode">
                                </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                    label="选择审批人："
                    label-width="135px"
                    v-show="approvalUserSelect"
                    prop="nextOperCode"
                    :rules="{ required: approvalUserSelect, message: '请选择审批人', trigger: 'change' }">
                        <el-select 
                            v-model="approvalForm.nextOperCode"
                            no-match-text="无匹配数据" 
                            filterable 
                            default-first-option
                            size="small"
                            @change="operaApprovalChange">
                                <el-option
                                v-for="(item,index) in nextOperList"
                                :key="index+item.userName"
                                :label="item.userName"
                                :value="item.userCode">
                                </el-option>
                            </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item
                    label="操作意见："
                    label-width="135px"
                    prop="textarea"
                    :rules="{ required: refusedToApproval, message: '请输入操作意见', trigger: 'blur' }">
                        <el-input
                        type="textarea"
                        placeholder="请输入意见"
                        v-model="approvalForm.textarea"
                        maxlength="200"
                        show-word-limit
                        @blur="textareaBlur"
                        >
                        </el-input>
                        </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script>
import {
  Message
} from 'element-ui'
import req from '../../service/http'
import topTip from '@/components/topTip'
export default {
    name: 'approvalSelect',
    data(){
        return {
            // 表单数据
            approvalForm:{
                // 下一步操作code
                nextCode: '',
                // 下一步操作人code
                nextOperCode: '',
                // 操作意见
                textarea: '',
            },
            // 操作流程数据
            dataList: [],
            // 操作人数据
            nextOperList: [],
            // 操作意见必填*是否显示
            refusedToApproval: false,
            // 下一步审批人是否显示
            approvalUserSelect: true
        }
    },
    created(){
        this.getApprovalData()
    },
    methods:{
        async getApprovalData(){
            try {
                await req({
                    url: 'basicconfig/workFlow/getSubmitPageData',
                    params:{
                        processInstanceId: this.params.processInstanceId,
                        parameters: this.params.parameters,
                        businessCode: this.params.businessCode,
                        projectNumber: this.params.projectNumber
                    },
                    method: 'post'
                }).then((result) => {
                    let datas = result.data.data;
                    let dataObj = {};
                    if(datas.length > 0){
                        datas.map(n=>{
                            for(var k in n){
                                dataObj = eval("(" + k + ")");
                                dataObj["approveUsers"] = n[k];
                                this.dataList.push(dataObj);
                            }
                        });
                        console.log(this.dataList)
                        this.approvalForm.nextCode = this.dataList[0].nextCode;
                        
                        this.getApproveUsersByFlow(this.approvalForm.nextCode);
                    }
                }).catch((err) => {
                    Message.warning({
                        message: '工作流【获取审批步骤和下一步审批人】失败！'
                    })
                });
            } catch (error) {
                
            }
        },
        // 操作change
        getApproveUsersByFlow(thisValue){
            this.$emit('flowChange',thisValue);
            this.nextOperList = []
            this.dataList.map(item=>{
                if (item.nextCode == thisValue) {
                    if (item.approveUsers.length>0) {
                        this.nextOperList = item.approveUsers
                        this.approvalUserSelect = true
                    } else {
                        this.approvalUserSelect = false
                    }
                }
            })
            if (thisValue == 'returnedSubmit' || thisValue == 'returnedTask' || thisValue == 'returnedUp' || thisValue == 'refusedToApproval') {
                this.refusedToApproval = true
            } else {
                this.refusedToApproval = false
            }
        },
        // 审批人change
        operaApprovalChange(value){
            this.$emit('operaChange',value);
        },
        // 意见
        textareaBlur () {
            this.$emit('textareaBlur',this.textarea);
        },
        //效验方法
        approvalValid (){
            let flag = null
            this.$refs['approvalSel'].validate((valid)=>{
                if (valid) {
                    flag = true
                } else {
                    flag = false
                }
            })
            return flag
        }
    },
     props:{
        params: Object
    },
    components:{
        topTip
    }
}
</script>

<style scoped>
    .approvalBox{
        margin-left: 30px;
        width: 800px;
        display: flex;
    }
    .title{
        position: absolute;
        left: 35px;
        color: #417095;
        font-size: 16px;
        font-weight: bold;
    }
</style>
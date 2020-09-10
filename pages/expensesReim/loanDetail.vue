<template>
   <div class="loanDetail">
       <approval-detail :processInstanceId="processInstanceId"></approval-detail>
   </div>
</template>

<script>
import approvalDetail from '@/components/ApprovalDetail/ApprovalDetail'
export default {
    name: 'loanDetail',
    data(){
        return {
            processInstanceId: '65259'
        }
    },
    components:{
        approvalDetail
    }
}
</script>

<style>

</style>
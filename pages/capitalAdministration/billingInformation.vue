<template>
  <div class="yt-dome-container">
    <div>
      <el-row>
        <el-col :span="12" v-for="item in this.dataList" :key="item.pkId">
          <div class="box-card">
            <div class="card-hearder">
              <span>{{item.companyFullName}}</span>
            </div>
            <div class="card-body">
              <el-row class="card-body-item">
                <el-col>
                  <span>纳税人识别号：</span>
                  <span>{{item.taxpayerNumber}}</span>
                </el-col>
              </el-row>
              <el-row class="card-body-item">
                <el-col>
                  <span style="letter-spacing: 3px;">地址、电话</span>：
                  <span>{{item.registerAddress}}</span><br>
                  <span style="display: inline-block;margin-left: 105px;margin-top: 20px;">{{item.registerPhone}}</span>
                </el-col>
              </el-row>
              <el-row class="card-body-item">
                <el-col>
                  <span>开户行及账号：</span>
                  <span>{{item.depositBank}}</span>
                  <span style="margin-left:20px;">{{item.bankAccount}}</span>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
//一级标题
import topTip from "@/components/topTip";
//提交附件
import upload from "@/components/upload";
//查看附件
import lookFiles from "@/components/lookFiles.vue";
//axios接口组件
import axios from "@/service/http";
//配置文件
import { option } from "@/static/config";
export default {
  data() {
    return {
      dataList:[],
    };
  },
  components: {
    topTip,
    upload,
    lookFiles,
  },
  mounted() {
    this.getCompanyInvoiceList();
  },
  methods: {
    //获取开票信息
    getCompanyInvoiceList(){
      axios
        .post(
          option.base_path + "db/income/getCompanyInvoiceList",{
            commissionedParty:"",
          }
        )
        .then(res => {
          this.dataList=res.data.data;
        })
        .catch(err => err);
    },
  },
};
</script>

<style scoped>
.box-card {
  margin: 20px;
  border: 1px solid #ebeef5;
  background-color: #fff;
  color: #303133;
  border-radius: 20px;
  height: 240px;
  overflow: hidden;
}
.card-hearder {
  color: #fff;
  background: #475c6d;
  padding: 10px 20px;
  border-bottom: 1px solid #ebeef5;
  box-sizing: border-box;
  border-radius: 20px 20px 0px 0px;
}
.card-body-item{
  margin: 20px;
}
</style>

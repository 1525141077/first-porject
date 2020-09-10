<template>
  <div class="yt-dome-container income-received-add">
    <!-- <addPageComponets :popList="dataMap" :lookType="'2'" :needBtn ="false"></addPageComponets> -->
    <!-- 上传竞聘方案START -->
    <div>
      <div>
        <!-- 顶部信息START -->
        <topTip>
          <template>
            <el-col :span="17" style="text-align: left;" class="top-tip">
              <span style="color: #417095;font-size: 16px;font-weight: bolder;">基础信息</span>
            </el-col>
            <!-- <el-col :span="5" style="text-align: left;" class="top-tip">
            <span style="color: #417095;font-size: 14px;font-weight: bolder;">到账单编号：</span>
            <span style="font-size: 14px;">{{cardNum}}</span>
            </el-col>-->
          </template>
        </topTip>
        <!-- 顶部信息END -->
        <div>
          <el-form ref="subInfo" :model="subInfo" style="padding-right:20px;">
            <el-row>
              <el-col :span="16" style="padding-right:20px;">
                <el-form-item
                  label="客户名称："
                  label-width="110px"
                  prop="customerName"
                  :rules="{ required: true, message: '请输入客户名称', trigger: 'blur' }"
                >
                  <el-input
                    v-model="subInfo.customerName"
                    placeholder="请输入内容"
                    @change="getCustomerName"
                  ></el-input>
                  <div
                    v-show="haveCustomerName"
                    style="color: #F56C6C;font-size: 12px;line-height: 1;padding-top: 4px;position: absolute;top: 100%;left: 0;"
                  >该客户已存在，请勿重复添加</div>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="客户行业：" label-width="110px">
                  <!-- :rules="{ required: true, message: '请输入客户行业', trigger: 'blur' }" -->
                  <el-input v-model="subInfo.customerTrade" placeholder="请输入内容"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" style="padding-right:20px;">
                <el-form-item label="所属地区：" label-width="110px">
                  <!-- :rules="{ required: true, message: '请输入所属地区', trigger: 'change' }" -->
                  <el-cascader
                    :options="this.regionName"
                    v-model="subInfo.regionCode"
                    filterable
                    change-on-select
                    @change="getCity"
                  ></el-cascader>
                  <!-- <el-select v-model="subInfo.regionName" filterable placeholder="请选择" @change="getCity">
                    <el-option
                      v-for="item in regionName"
                      :key="item.value"
                      :label="item.regionName"
                      :value="item.regionCode">
                    </el-option>
                  </el-select>-->
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="16" style="padding-right:20px;">
                <el-form-item label="开票名称：" label-width="110px">
                  <!-- :rules="{ required: true, message: '请输入开票名称', trigger: 'blur' }" -->
                  <el-input v-model="subInfo.invoiceRise" placeholder="请输入内容"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="纳税人识别号：" label-width="110px">
                  <!-- :rules="{ required: true, message: '请输入纳税人识别号', trigger: 'blur' }" -->

                  <el-input v-model="subInfo.taxpayerNumber" placeholder="请输入内容"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="16">
                <el-form-item label="开户银行：" label-width="110px">
                  <el-input v-model="subInfo.accountBank" placeholder="请输入内容"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="账号：" label-width="110px">
                  <el-input v-model="subInfo.accountNumber" placeholder="请输入内容"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="16">
                <el-form-item label="开票地址：" label-width="110px">
                  <el-input v-model="subInfo.contactAddress" placeholder="请输入内容"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="开票电话：" label-width="110px">
                  <el-input v-model="subInfo.contactPhone" placeholder="请输入内容"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <topTip>
            <template>
              <el-col :span="18" style="text-align: left;" class="top-tip">
                <span style="color: #417095;font-size: 16px;font-weight: bolder;">客户联系人信息</span>
              </el-col>
            </template>
          </topTip>
          <div>
            <el-form>
              <div
                v-for="(item, index) in subInfo.customerLinkmanStr"
                :key="index"
                class="customerList"
              >
                <el-row style="margin-top:20px;">
                  <el-col :span="6">
                    <!-- :rules="{required: true,message: '请输入姓名',trigger: 'blur'}" -->
                    <el-form-item
                      label="姓名："
                      label-width="55px"
                      :prop="'customerLinkmanStr.'+ index +'.customerContacts'"
                    >
                      <el-input
                        v-model="item.customerContacts"
                        placeholder="请输入内容"
                        style="width:60%;display: inline-block;"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item
                      label="部门："
                      :prop="'customerLinkmanStr.'+ index +'.customerContactsDept'"
                    >
                      <el-input
                        v-model="item.customerContactsDept"
                        placeholder="请输入内容"
                        style="width:50%;display: inline-block;"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="职务：" :prop="'customerLinkmanStr.'+ index +'.customerPost'">
                      <el-input
                        v-model="item.customerPost"
                        placeholder="请输入内容"
                        style="width:50%;display: inline-block;"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <span style="display: inline-block;vertical-align: top;font-size: 16px;">删除联系人信息</span>
                    <i
                      class="el-icon-delete"
                      style="font-size: 24px;cursor: pointer;"
                      @click="delCustomer(index)"
                    ></i>
                  </el-col>
                </el-row>
                <el-row style="margin:20px 0px;">
                  <el-col :span="6" style="margin-left: 25%;">
                    <el-form-item
                      label="手机号："
                      :prop="'customerLinkmanStr.'+ index +'.customerContactsInformation'"
                    >
                      <el-input
                        v-model="item.customerContactsInformation"
                        placeholder="请输入内容"
                        style="width:50%;display: inline-block;"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item
                      label="电邮："
                      :prop="'customerLinkmanStr.'+ index +'.customerContactsEmail'"
                    >
                      <el-input
                        v-model="item.customerContactsEmail"
                        placeholder="请输入内容"
                        style="width:50%;display: inline-block;"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </el-form>
            <div style="padding: 10px 30px;width: 120px;" @click="addcustomer('subInfo')">
              <i class="el-icon-circle-plus-outline" style="font-size: 24px;"></i>
              <span style="display: inline-block;vertical-align: top;font-size: 16px;">添加联系人</span>
            </div>
          </div>
        </div>
        <div>
          <topTip>
            <template>
              <el-col :span="18" style="text-align: left;" class="top-tip">
                <span style="color: #417095;font-size: 16px;font-weight: bolder;">合作项目</span>
              </el-col>
            </template>
          </topTip>
          <div>
            <el-table :data="cooperateProjectList" border>
              <el-table-column label="项目编号" prop="projectNum" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.projectNum||"--"}}</span>
                </template>
              </el-table-column>
              <el-table-column label="项目名称" prop="projectName" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.projectName||"--"}}</span>
                </template>
              </el-table-column>
              <el-table-column label="项目经理" prop="projectPersonName" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.projectPersonName||"--"}}</span>
                </template>
              </el-table-column>
              <el-table-column label="联系方式" prop="projectPersonPhone" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.projectPersonPhone||"--"}}</span>
                </template>
              </el-table-column>
              <el-table-column label="项目方向" prop="businessType" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.businessType||"--"}}</span>
                </template>
              </el-table-column>
              <el-table-column label="项目金额(元)" prop="projectBudget" align="right">
                <template slot-scope="scope">
                  <span>{{scope.row.projectBudget | moneyFormat}}</span>
                </template>
              </el-table-column>
              <el-table-column label="回款率" prop="remittanceRate" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.remittanceRate + "%"||"--"}}</span>
                </template>
              </el-table-column>
              <el-table-column label="项目实施公司" prop="commissionedParty" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.commissionedParty||"--"}}</span>
                </template>
              </el-table-column>
              <el-table-column label="联系人" prop="customerContacts" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.customerContacts||"--"}}</span>
                </template>
              </el-table-column>
              <el-table-column label="是否结项" prop="isConclusion" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.isConclusion||"--"}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div>
          <topTip>
            <template>
              <el-col :span="18" style="text-align: left;" class="top-tip">
                <span style="color: #417095;font-size: 16px;font-weight: bolder;">合作前景分析</span>
              </el-col>
            </template>
          </topTip>
          <div style="margin:0px 20px 20px 20px">
            <el-input
              type="textarea"
              :rows="5"
              placeholder="请输入内容"
              v-model="subInfo.cooperateProspect"
            ></el-input>
          </div>
        </div>
      </div>
      <!-- 底部按钮 START -->
      <div style="text-align: center;padding-bottom: 20px;margin-top: 50px;">
        <el-button
          class="yt-bottom-btn"
          type="primary"
          :loading="subLoading"
          @click="submitRlInfo()"
        >保存</el-button>
        <el-button class="yt-bottom-btn" @click="backBtn">取消</el-button>
      </div>
      <!-- 底部按钮END -->
      <!-- 日志信息 START -->
      <journalList :pkId="ids"></journalList>
      <!-- 日志信息 END -->
    </div>
  </div>
</template>

<script>
// 日志
import journalList from "../../components/journalList.vue";
// 选人组件
import selectMan from "../../components/selectMan.vue";
import topTip from "../../components/topTip.vue";
import axios from "../../service/http";
import { option } from "../../static/config";
export default {
  data() {
    return {
      subLoading: false,
      ids: "",
      cooperateProjectList: [],
      subInfo: {
        pkId: "",
        customerName: "",
        customerTrade: "",
        regionCode: "",
        regionName: "",
        invoiceRise: "",
        taxpayerNumber: "",
        accountBank: "",
        accountNumber: "",
        contactAddress: "",
        contactPhone: "",
        cooperateProspect: "",
        customerLinkmanStr: [
          {
            pkId: "",
            customerContacts: "",
            customerContactsDept: "",
            customerPost: "",
            customerContactsInformation: "",
            customerContactsEmail: "",
          },
        ],
      },
      regionName: [],
      val: [],
      vals: [],
      regionCode: [],
      regionNames: [],
      haveCustomerName: false,
    };
  },
  mounted() {
    this.lookDetails();
    this.getRegionCiTyList();
  },
  methods: {
    // 修改查看详情
    lookDetails() {
      if (this.$route.query.pkId != undefined) {
        axios
          .post(option.base_path + "db/customer/getCustomerDetails", {
            pkId: this.$route.query.pkId,
          })
          .then((res) => {
            this.subInfo = res.data.data;
            let City = res.data.data.regionCode;
            this.subInfo.regionCode = City.split("/");
            this.subInfo.customerLinkmanStr = this.subInfo.customerLinkmanList;
            if (this.subInfo.customerName != "") {
              this.getCooperateProject();
            }
          });
      }
    },
    //获取客户名称是否存在
    getCustomerName(value) {
      var that = this;
      if (value != "") {
        axios
          .post(option.base_path + "db/customer/getCustomerName", {
            customerName: this.subInfo.customerName,
          })
          .then((res) => {
            if (res.data.data == null) {
              this.haveCustomerName = false;
            } else {
              this.haveCustomerName = true;
            }
          });
      } else {
        this.haveCustomerName = false;
      }

      if (this.haveCustomerName == false) {
        // this.subInfo.customerLinkmanStr.forEach((item,index)=>{
        axios
          .post(option.base_path + "db/customer/getCooperateProjectList", {
            customerName: this.subInfo.customerName,
          })
          .then((res) => {
            this.cooperateProjectList = this.cooperateProjectList.concat(
              res.data.data
            );
          })
          .catch((err) => err);
        // })
      }
    },
    // //获取省份
    //获取所有省市区
    getRegionCiTyList() {
      axios.post(option.base_path + "db/area/getProAreaInfo").then((res) => {
        if (res.data.flag == 0) {
          this.regionName = res.data.data;
        }
      });
    },
    getCascaderObj(val, opt) {
      if (val && val.length > 0) {
        return val.map((value, index, array) => {
          for (var itm of opt) {
            if (itm.value == value) {
              opt = itm.children;
              return itm;
            }
          }
          return null;
        });
      } else {
        return null;
      }
    },
    // getRegionCiTyList(){
    //   var that=this;
    //   axios
    //     .post(
    //       option.base_path + "db/customer/getRegionCiTyList",{
    //         regionLevel:'CITY'
    //       }
    //     )
    //     .then(res => {
    //       that.regionName=res.data.data
    //     })
    //     .catch(err => err);
    // },
    //保存按钮
    submitRlInfo() {
      this.$refs.subInfo.validate((valid) => {
        if (valid) {
          if (this.haveCustomerName) {
            console.log("asdfghjkl");
          } else {
            this.saveOrUpdateCustomer();
          }
        } else {
          console.log("aaa");
        }
      });
    },
    //新增/修改客户接口
    saveOrUpdateCustomer() {
      this.vals = this.getCascaderObj(this.subInfo.regionCode, this.regionName);
      let city = [];
      let cityName = [];
      debugger;
      if (this.vals && this.vals.length > 0) {
        this.vals.forEach((i) => {
          if (i != null) {
            //城市value
            city.push(i.value);
            //城市名字
            cityName.push(i.label);
          }
        });
      }
      let Code = city.join("/");
      axios
        .post(option.base_path + "db/customer/saveOrUpdateCustomer", {
          pkId: this.$route.query.pkId || "",
          customerName: this.subInfo.customerName,
          customerTrade: this.subInfo.customerTrade,
          regionCode: Code,
          regionName: this.subInfo.regionName,
          invoiceRise: this.subInfo.invoiceRise,
          taxpayerNumber: this.subInfo.taxpayerNumber,
          accountBank: this.subInfo.accountBank,
          accountNumber: this.subInfo.accountNumber,
          contactAddress: this.subInfo.contactAddress,
          contactPhone: this.subInfo.contactPhone,
          cooperateProspect: this.subInfo.cooperateProspect,
          customerLinkmanStr: JSON.stringify(this.subInfo.customerLinkmanStr),
        })
        .then((res) => {
          if (res.data.flag == 0) {
            this.$router.push({ path: "/customer/customerList" });
          } else {
            this.$message.error(data.data.message);
          }
        })
        .catch((err) => err);
    },
    // //获取合作项目
    getCooperateProject(value) {
      // this.subInfo.customerLinkmanStr.forEach((item,index)=>{
      axios
        .post(option.base_path + "db/customer/getCooperateProjectList", {
          customerName: this.subInfo.customerName,
        })
        .then((res) => {
          this.cooperateProjectList = this.cooperateProjectList.concat(
            res.data.data
          );
        })
        .catch((err) => err);
      // })
    },
    // 返回
    backBtn() {
      this.$router.replace({
        path: "/customer/customerList",
      });
    },
    //添加联系人
    addcustomer(formName) {
      this.subInfo.customerLinkmanStr.push({
        pkId: "",
        customerContacts: "",
        customerContactsDept: "",
        customerPost: "",
        customerContactsInformation: "",
        customerContactsEmail: "",
      });
    },
    //删除联系人
    delCustomer(index) {
      this.$confirm("此操作删除联系人信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.subInfo.customerLinkmanStr.splice(index, 1);
          this.$message.success("删除成功");
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    //所属地区改变事件
    getCity(val) {
      //   var obj = {}
      //   obj = this.regionName.find(function(item){
      //       return item.regionCode === value
      //   })
      //   this.subInfo.regionCode=obj.regionCode;
      //   this.subInfo.regionName=obj.regionName;
      // },
      this.vals = this.getCascaderObj(val, this.regionName);
      let city = [];
      let cityName = [];
      this.vals.forEach((i) => {
        //城市value
        city.push(i.value);
        //城市名字
        cityName.push(i.label);
      });
      console.log(this.vals, "vals");
      this.regionCode = city.join("/");

      //  this.ruleForm.nativePlace= val;

      this.subInfo.regionName = cityName.join("/");
      this.subInfo.regionCode = val;
      // this.ruleForm.nativePlace = val;
    },
  },
  filters: {
    moneyFormat(num) {
      if (num) {
        num = Number(num);
        num = (num.toFixed(2) + "").replace(
          /\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,
          "$&,"
        );
      }
      return num || "0.00";
    },
  },
  components: {
    topTip,
    selectMan,
    journalList,
  },
};
</script>

<style>
.list-add {
  cursor: pointer;
  background: url(../../assets/images/common/form-icons.png) no-repeat -11px -47px;
  width: 24px;
  height: 25px;
  display: inline-block;
  position: absolute;
  top: -15px;
}
.income-received-add .el-table .hide-selection .el-checkbox__input {
  display: none;
}
.income-received-add td.check-box-add .el-checkbox {
  margin-left: 9px;
}
.lab-name {
  text-align: justify;
  color: #417095;
  font-weight: 700;
}
.money-input .el-input__inner,
.look-fils .el-input__inner {
  text-align: right;
}
.el-table__footer-wrapper tbody td,
.el-table__header-wrapper tbody td {
  background-color: #ffffff;
}
.customerList {
  border-bottom: 1px dashed black;
  margin: 0px 30px;
}
</style>

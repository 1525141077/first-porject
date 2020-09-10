<template>
  <!--
    @addTrip: 行程明细 新增按钮
    @addCost: 费用明细 新增按钮
  -->
  <div class="travel-div">
    <!-- 支出事项信息START -->
    <div>
      <topTip>
        <template>
          <el-col :span="8" style="text-align: left;" class="top-tip">
            <span style="color: #417095;font-size: 16px;font-weight: bolder;">支出事项信息</span>
          </el-col>
        </template>
      </topTip>
      <secondLevel>
        <template v-slot:textTitle>行程明细</template>
        <template v-slot:buttonTitle>
          <el-button
            class="assTripBtn"
            type="primary"
            @click="addTrip('tripForm')"
            v-if="lookType === '1'"
          >新增</el-button>
        </template>
      </secondLevel>
      <el-table :data="travelList" border style="width: 100%">
        <el-table-column prop="startingPoint" header-align="center" align="center" label="出发地点"></el-table-column>
        <el-table-column prop="startTime" header-align="center" align="center" label="开始日期"></el-table-column>
        <el-table-column prop="endTime" header-align="center" align="center" label="结束日期"></el-table-column>
        <el-table-column prop="busDay" header-align="center" align="center" label="出差天数"></el-table-column>
        <el-table-column prop="travelAddressName" header-align="center" align="center" label="出差地点"></el-table-column>
        <el-table-column prop="travelPersonnels" header-align="center" align="center" label="出差人"></el-table-column>
        <el-table-column prop="busNum" header-align="center" align="center" label="出差人数"></el-table-column>
        <el-table-column
          prop
          header-align="center"
          align="center"
          label="操作"
          width="120px"
          v-if="lookType === '1'"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              style="padding:0px"
              @click="tripUpdate(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              size="small"
              style="padding:0px"
              @click="tripDel(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 支出事项信息END -->
    <div
      style="height: 5px;background-color: #f3f3f3;border-top: 1px solid #dfe6f3;border-bottom: 1px solid #dfe6f3;margin-top: 20px;"
    ></div>
    <!-- 支出费用信息START -->
    <div>
      <topTip>
        <template>
          <el-col :span="8" style="text-align: left;" class="top-tip">
            <span style="color: #417095;font-size: 16px;font-weight: bolder;">支出费用信息</span>
          </el-col>
        </template>
      </topTip>
      <secondLevel>
        <template v-slot:textTitle>费用明细</template>
        <template v-slot:buttonTitle>
          <el-button class="addCostBtn" type="primary" @click="addCost" v-if="lookType === '1'">新增</el-button>
        </template>
      </secondLevel>
      <el-row class="cost-list-title">
        <label class="cost-list-label">城市间交通费</label>
      </el-row>
      <el-table
        :data="costCarfareList"
        border
        style="width: 100%"
        :summary-method="getTrafficCostSum"
        show-summary
      >
        <el-table-column
          prop="travelPersonnelName"
          header-align="center"
          align="center"
          label="出差人"
        ></el-table-column>
        <el-table-column
          prop="travelPersonnelsJobName"
          header-align="center"
          align="center"
          label="职位"
        ></el-table-column>
        <el-table-column prop="goTime" header-align="center" align="center" label="出发日期"></el-table-column>
        <el-table-column prop="goAddressName" header-align="center" align="center" label="出发地点"></el-table-column>
        <el-table-column
          prop="arrivalAddressName"
          header-align="center"
          align="center"
          label="到达地点"
        ></el-table-column>
        <el-table-column prop="vehicleName" header-align="center" align="center" label="交通工具"></el-table-column>
        <el-table-column prop="crafare" header-align="center" align="right" label="城市间交通费">
          <template slot-scope="scope">
            <span>{{scope.row.crafare |moneyFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="returnFee" header-align="center" align="right" label="退改签费用(元)">
          <template slot-scope="scope">
            <span>{{scope.row.returnFee |moneyFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="trafficAccidentInsurancePremium"
          header-align="center"
          align="right"
          label="交通意外保险费(元)"
        >
          <template slot-scope="scope">
            <span>{{scope.row.trafficAccidentInsurancePremium |moneyFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="bookingFee" header-align="center" align="right" label="订票费(元)">
          <template slot-scope="scope">
            <span>{{scope.row.bookingFee |moneyFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remarks" header-align="center" align="center" label="特殊说明"></el-table-column>
        <el-table-column
          prop
          header-align="center"
          align="center"
          label="操作"
          width="120px"
          v-if="lookType === '1'"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              style="padding:0px"
              @click="trafficUpdate(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              size="small"
              style="padding:0px"
              @click="trafficpDel(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row class="cost-list-title">
        <label class="cost-list-label">住宿费</label>
      </el-row>
      <el-table
        :data="costHotelList"
        border
        style="width: 100%"
        :summary-method="getHotelCostSum"
        show-summary
      >
        <el-table-column
          prop="travelPersonnelName"
          header-align="center"
          align="center"
          label="出差人"
        ></el-table-column>
        <el-table-column
          prop="travelPersonnelsJobName"
          header-align="center"
          align="center"
          label="职位"
        ></el-table-column>
        <el-table-column prop="genderName" header-align="center" align="center" label="性别"></el-table-column>
        <el-table-column prop="hotelCostDay" header-align="center" align="right" label="人均花销(人/晚)"></el-table-column>
        <el-table-column prop="hotelTime" header-align="center" align="center" label="入住日期"></el-table-column>
        <el-table-column prop="leaveTime" header-align="center" align="center" label="离开日期"></el-table-column>
        <el-table-column prop="hotelDays" header-align="center" align="center" label="住宿天数"></el-table-column>
        <el-table-column prop="hotelExpense" header-align="center" align="right" label="住宿费(元)">
          <template slot-scope="scope">
            <span>{{scope.row.hotelExpense |moneyFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="hotelAddressName" header-align="center" align="center" label="住宿地点"></el-table-column>
        <el-table-column prop="remarks" header-align="center" align="center" label="特殊说明"></el-table-column>
        <el-table-column
          prop
          header-align="center"
          align="center"
          label="操作"
          width="120px"
          v-if="lookType === '1'"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              style="padding:0px"
              @click="hotelUpdate(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              size="small"
              style="padding:0px"
              @click="hotelDel(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row class="cost-list-title">
        <label class="cost-list-label">其他费用</label>
      </el-row>
      <el-table
        :data="costOtherList"
        border
        style="width: 100%"
        :summary-method="getOtherCostSum"
        show-summary
      >
        <el-table-column prop="costTypeName" header-align="center" align="center" label="其他费用明细"></el-table-column>
        <el-table-column prop="trafficTypeName" header-align="center" align="center" label="交通类型"></el-table-column>
        <el-table-column prop="reimAmount" header-align="center" align="center" label="费用金额">
          <template slot-scope="scope">
            <span>{{scope.row.reimAmount |moneyFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remarks" header-align="center" align="center" label="特殊说明"></el-table-column>
        <el-table-column
          prop
          header-align="center"
          align="center"
          label="操作"
          width="120px"
          v-if="lookType === '1'"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              style="padding:0px"
              @click="otherUpdate(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              size="small"
              style="padding:0px"
              @click="otherDel(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 支出费用信息END -->
    <!-- 行程详细信息弹出框START -->
    <el-dialog
      title="行程详细信息"
      :visible.sync="tripDialog"
      :close-on-click-modal="false"
      :showClose="false"
    >
      <el-form
        :model="tripForm"
        :rules="tripRules"
        ref="tripForm"
        label-width="100px"
        :label-position="labelPosition"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="出发地点：" prop="startingPoint">
              <el-select
                :filter-method="dataFilter"
                filterable
                v-model="tripForm.startingPoint"
                placeholder="请输入"
                @change="getGoAddresVal"
              >
                <el-option
                  v-for="item in hotCityList"
                  :key="item.regionCode"
                  :label="item.regionName + '/' + item.regionMergerName"
                  :value="item.regionCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出差地点：" prop="travelAddressName">
              <el-select
                :filter-method="dataFilter"
                filterable
                v-model="tripForm.travelAddressName"
                placeholder="请输入"
                @change="getBusAddresVal"
              >
                <el-option
                  v-for="(item,index) in hotCityList"
                  :key="index"
                  :label="item.regionName + '/' + item.regionMergerName"
                  :value="item.regionCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="行程日期：" prop="busDate">
              <el-date-picker
                v-model="tripForm.busDate"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                unlink-panels
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="出差人：" prop="travelPersonnels">
            <el-select
              v-model="tripForm.travelPersonnels"
              multiple
              placeholder="请选择姓名"
              @change="busNameVal"
              filterable
            >
              <el-option
                v-for="(item,index) in usersList"
                :key="index"
                :label="item.userName + '/' + item.deptName"
                :value="item.userName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="出差人数：" prop>
            <span>{{tripForm.busNum}}</span>
          </el-form-item>
        </el-row>
        <el-row type="flex" justify="center">
          <el-button type="primary" @click="saveTrip('tripForm')">保存</el-button>
          <el-button @click="closeTrip('tripForm')">关闭</el-button>
        </el-row>
      </el-form>
    </el-dialog>
    <!-- 行程详细信息弹出框END -->
    <!-- 费用明细信息弹出框START -->
    <el-dialog
      title="费用明细信息"
      :visible.sync="costDialog"
      class="costDialog"
      :close-on-click-modal="false"
      :showClose="false"
    >
      <el-tabs
        type="border-card"
        class="border-card"
        @tab-click="getTabPane"
        v-model="costTabIndex"
      >
        <el-tab-pane label="城市间交通费用" :disabled="trafficTab" name="0">
          <el-form
            :model="trafficForm"
            :rules="trafficRules"
            ref="trafficForm"
            label-width="125px"
            :label-position="labelPosition"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item label="出差人：" prop="travelPersonnelName">
                  <el-select
                    v-model="trafficForm.travelPersonnelName"
                    placeholder="请选择"
                    @change="getPersonnelinfo"
                  >
                    <el-option
                      v-for="(item,index) in busPeopleInfo"
                      :key="index"
                      :label="item.userName"
                      :value="item.userName"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="出发日期：" prop="goTime">
                  <el-date-picker
                    type="date"
                    placeholder="请选择日期"
                    v-model="trafficForm.goTime"
                    style="width: 77%;"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="出发地点：" prop="goAddressName">
                  <el-select
                    :filter-method="dataFilter"
                    filterable
                    v-model="trafficForm.goAddressName"
                    placeholder="请输入"
                    @change="getStartAddress"
                  >
                    <el-option
                      v-for="(item,index) in hotCityList"
                      :key="index"
                      :label="item.regionName + '/' + item.regionMergerName"
                      :value="item.regionCode"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="到达地点：" prop="arrivalAddressName">
                  <el-select
                    :filter-method="dataFilter"
                    filterable
                    v-model="trafficForm.arrivalAddressName"
                    placeholder="请输入"
                    @change="getEndAddress"
                  >
                    <el-option
                      v-for="(item,index) in hotCityList"
                      :key="index"
                      :label="item.regionName + '/' + item.regionMergerName"
                      :value="item.regionCode"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item label="交通工具：" prop="vehicleFatherName">
                <el-select
                  v-model="trafficForm.vehicleFatherName"
                  placeholder="请选择"
                  @change="getvechicleList"
                >
                  <el-option
                    v-for="(item,index) in vehicleList"
                    :key="index"
                    :label="item.disvalue"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <span v-if="vechicleChild">-</span>
                <el-select
                  v-if="vechicleChild"
                  v-model="trafficForm.vehicleChildName"
                  placeholder="请选择"
                  @change="getvehicleChildList"
                >
                  <el-option
                    v-for="(item,index) in vehicleChildList"
                    :key="index"
                    :label="item.disvalue"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="城市间交通费：" prop="crafare">
                  <finMoneyInput v-model="trafficForm.crafare" :tail="'元'"></finMoneyInput>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="退改签费用：" prop>
                  <finMoneyInput v-model="trafficForm.returnFee" :tail="'元'"></finMoneyInput>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="交通意外保险费：" prop>
                  <finMoneyInput v-model="trafficForm.trafficAccidentInsurancePremium" :tail="'元'"></finMoneyInput>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="订票费：" prop>
                  <finMoneyInput v-model="trafficForm.bookingFee" :tail="'元'"></finMoneyInput>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item label="特殊说明：">
                <el-input type="textarea" v-model="trafficForm.remarks" placeholder="最多填写100字"></el-input>
              </el-form-item>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="住宿费" :disabled="hotelTab" name="1">
          <el-form
            :model="hotelForm"
            :rules="hotelRules"
            ref="hotelForm"
            label-width="100px"
            :label-position="labelPosition"
          >
            <el-row>
              <el-col :span="9">
                <el-form-item label="出差人：" prop="travelPersonnelName">
                  <el-select
                    v-model="hotelForm.travelPersonnelName"
                    placeholder="请输入"
                    @change="getHPersonnelinfo"
                  >
                    <el-option
                      v-for="(item,index) in busPeopleInfo"
                      :key="index"
                      :label="item.userName"
                      :value="item.userName"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="9">
                <el-form-item label="性别：" prop="genderName">
                  <el-select v-model="hotelForm.genderName" placeholder="请输入" @change="getGender">
                    <el-option label="男" value="1"></el-option>
                    <el-option label="女" value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="18">
                <el-form-item label="住宿日期：" prop="hotelDate">
                  <el-date-picker
                    v-model="hotelForm.hotelDate"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="入住日期"
                    end-placeholder="离开日期"
                    :clearable="false"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd"
                    @input="getHotelDay"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <div style="height: 40px;line-height: 40px;">
                  <span>住宿天数：</span>
                  <span>{{hotelForm.hotelDays==undefined?"自动计算":hotelForm.hotelDays+"天"}}</span>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item label="住宿地点：" prop="hotelAddressName">
                <el-select
                  :filter-method="dataFilter"
                  filterable
                  v-model="hotelForm.hotelAddressName"
                  placeholder="请选择"
                  @change="getHotelAddressName"
                >
                  <el-option
                    v-for="(item,index) in hotCityList"
                    :key="index"
                    :label="item.regionName + '/' + item.regionMergerName"
                    :value="item.regionCode"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-row>
            <el-row>
              <el-col :span="18">
                <el-form-item label="住宿费：" prop="hotelExpense">
                  <finMoneyInput
                    v-model="hotelForm.hotelExpense"
                    style="width: 38%;"
                    :tail="'元'"
                    @change="getHotelCost"
                  ></finMoneyInput>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <div style="height: 40px;line-height: 40px;">
                  <span>住宿费：</span>
                  <span>{{this.hotelForm.hotelCostDay==undefined ? '0.00元/人*天':this.hotelForm.hotelCostDay+'元/人*天'}}</span>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item label="特殊说明：" prop="remarks">
                <el-input type="textarea" v-model="hotelForm.remarks" style="width: 90%;"></el-input>
              </el-form-item>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="其他费用" :disabled="otherTab" name="2">
          <el-form
            :model="otherForm"
            :rules="otherRules"
            ref="otherForm"
            label-width="100px"
            :label-position="labelPosition"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item label="费用类型：" prop="costTypeName">
                  <el-select
                    v-model="otherForm.costTypeName"
                    placeholder="请选择"
                    @change="getCostTypeval"
                  >
                    <el-option
                      v-for="(item,index) in costTypeList"
                      :key="index"
                      :label="item.disvalue"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item label="交通类型：" prop="trafficTypeName" v-if="otherBusType">
                <el-select
                  v-model="otherForm.trafficTypeName"
                  placeholder="请输入"
                  @change="getTrafficTypeval"
                >
                  <el-option
                    v-for="(item,index) in otherBusTypeList"
                    :key="index"
                    :label="item.disvalue"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="报销金额：" prop="reimAmount">
                <finMoneyInput v-model="otherForm.reimAmount" style="width: 40%;" :tail="'元'"></finMoneyInput>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="特殊说明：" prop="remarks">
                <el-input type="textarea" v-model="otherForm.remarks"></el-input>
              </el-form-item>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-row type="flex" justify="center" style="padding:10px">
          <el-button type="primary" @click="saveCost('trafficForm')">保存</el-button>
          <el-button @click="closeCost('costTabIndex')">关闭</el-button>
        </el-row>
      </el-tabs>
    </el-dialog>
    <!-- 费用明细信息弹出框END -->
  </div>
</template>

<script>
import axios from "../service/http";
import { option } from "../static/config";
import topTip from "./topTip.vue";
import secondLevel from "./secondLevel.vue";
import finMoneyInput from "./fin-money-input.vue";

import { mapGetters } from "vuex";
export default {
  props: {
    // 判断是新增还是查看（1：新增；2：查看）默认新增
    lookType: {
      type: String,
      default() {
        return "1";
      },
    },
  },
  data() {
    return {
      // 行程明细列表数据
      travelList: [],
      //行程明细列表(传参)数据
      travelRouteList: [],
      //城市间交通费列表(传参)数据
      costCarfareList: [],
      //住宿费列表(传参)数据
      costHotelList: [],
      //其他费用列表(传参)数据
      costOtherList: [],
      //弹出框表单域标签的位置
      labelPosition: "left",
      //行程明细弹出框是否显示
      tripDialog: false,
      //行程明细弹出框表单
      tripForm: {},
      //行程明细列表index值
      tripListIndex: null,
      //行程明细列表编辑
      editTripList: false,
      //行程明细弹出框表单必填验证
      tripRules: {
        startingPoint: [
          { required: true, message: "请选择出发地点", trigger: "change" },
        ],
        travelAddressName: [
          { required: true, message: "请选择出差地点", trigger: "change" },
        ],
        busDate: [
          { required: true, message: "请选择行程日期", trigger: "change" },
        ],
        startTime: [
          { required: true, message: "请选择开始日期", trigger: "change" },
        ],
        endTime: [
          { required: true, message: "请选择结束日期", trigger: "change" },
        ],
        travelPersonnels: [
          { required: true, message: "请选择出差人", trigger: "blur" },
        ],
      },
      //费用明细弹出框是否显示
      costDialog: false,
      //费用明细弹出框tab页签下标
      costTabIndex: 0,
      //交通费tab是否禁用
      trafficTab: false,
      //住宿费tab是否禁用
      hotelTab: false,
      //其他费tab是否禁用
      otherTab: false,
      //交通费列表编辑
      editTrafficList: false,
      //住宿费列表编辑
      editHotelList: false,
      //其他费列表编辑
      editOtherList: false,
      //交通费用列表index值
      trafficListIndex: null,
      //住宿费列表index值
      hotelCostListIndex: null,
      //其他费用列表index值
      otherCostListIndex: null,
      //费用明细弹出框城市间交通费用表单
      trafficForm: {},
      //费用明细弹出框城市间交通费用表单必填验证
      trafficRules: {
        travelPersonnelName: [
          { required: true, message: "请选择出差人", trigger: "change" },
        ],
        goTime: [
          { required: true, message: "请选择出发日期", trigger: "blur" },
        ],
        goAddressName: [
          { required: true, message: "请输入出发地点", trigger: "change" },
        ],
        arrivalAddressName: [
          { required: true, message: "请输入到达地点", trigger: "change" },
        ],
        vehicleFatherName: [
          { required: true, message: "请选择交通工具", trigger: "change" },
        ],
        crafare: [{ required: true, message: "请输入金额", trigger: "blur" }],
      },
      //费用明细弹出框住宿费表单
      hotelForm: {},
      //费用明细弹出框住宿费表单必填验证
      hotelRules: {
        travelPersonnelName: [
          { required: true, message: "请选择出差人", trigger: "change" },
        ],
        genderName: [
          { required: true, message: "请选择性别", trigger: "change" },
        ],
        hotelDate: [
          { required: true, message: "请选择住宿日期", trigger: "change" },
        ],
        hotelTime: [
          { required: true, message: "请选择入住日期", trigger: "change" },
        ],
        leaveTime: [
          { required: true, message: "请选择离开日期", trigger: "change" },
        ],
        hotelAddressName: [
          { required: true, message: "请选择省份", trigger: "change" },
        ],
        hotelExpense: [
          { required: true, message: "请输入住宿费", trigger: "blur" },
        ],
      },
      //费用明细弹出框其他费用表单
      otherForm: {},
      //费用明细弹出框其他费用表单必填验证
      otherRules: {
        costTypeName: [
          { required: true, message: "请选择费用类型", trigger: "change" },
        ],
        trafficTypeName: [
          { required: true, message: "请选择交通类型", trigger: "change" },
        ],
        reimAmount: [
          { required: true, message: "请输入报销金额", trigger: "blur" },
        ],
      },
      //热门城市数据
      hotCityList: {},
      //人员选择数据
      usersList: {},
      //出差人可搜索下拉框加载获取数据图标
      busNameLoading: false,
      //获取一级交通工具
      vehicleList: [],
      //根据一级交通工具获取二级交通工具
      vehicleChildList: {},
      //二级交通工具显示隐藏
      vechicleChild: false,
      //出差人姓名、性别职务
      busPeopleInfo: [],
      //暂存出差人信息
      peopleInfo: [],
      //其他费用 费用类型
      costTypeList: [],
      //其他费用 交通类型
      otherBusTypeList: false,
      //其他费用 交通类型显示隐藏
      otherBusType: false,
      //行程明细 对应id绑定表格(新增)
      listId: 0,
      //行程明细 对应id绑定表格(编辑)
      editListId: 0,
      //暂存交通费列表数据
      costCareList: [],
      regionList: [], //所有城市
    };
  },
  components: {
    topTip,
    secondLevel,
    finMoneyInput,
  },
  created: function () {
    var that = this;
    //获取热门城市数据
    axios.get(option.websit_ip + "json/hotCityList.json").then(function (res) {
      that.hotCityList = res.data;
    });
    //获取所有城市
    axios.get(option.websit_ip + "json/regionList.json").then(function (res) {
      that.regionList = res.data;
    });
    //获取人员选择数据
    axios
      .post(option.base_path + "user/userInfo/getAllUserInfoToPage", {
        params: "",
        pageIndex: 1,
        pageNum: 99999, //每页显示条数
      })
      .then(function (res) {
        that.usersList = res.data.data.rows;
      });
    //获取城市间交通费用-一级交通工具 其他费用-费用类型
    axios
      .post(option.base_path + "basicconfig/dictInfo/getDictInfoByTypeCode", {
        dictTypeCode: "VEHICIE_CODE,COST_TYPE",
      })
      .then(function (res) {
        var list = res.data.data || [];
        list.forEach((item) => {
          if (item.dictTypeCode == "VEHICIE_CODE") {
            that.vehicleList.push(item);
          } else if (item.dictTypeCode == "COST_TYPE") {
            that.costTypeList.push(item);
          }
        });
      });
  },
  watch: {
    //监控行程明细列表对象
    travelList(newVal, oldVal) {
      this.editListId = 0;
      newVal.forEach((item) => {
        //添加ID
        // 获取出差人
        var Personnels = item.travelPersonnels;
        if (typeof item.travelPersonnels == "string") {
          this.busNameVal(Personnels.split("、"));
        } else {
          this.busNameVal(Personnels);
        }
        //储存出差人数据
        if (this.busPeopleInfo.length != 0) {
          this.peopleInfo.forEach((item) => {
            this.busPeopleInfo.push(item);
          });
          const res = new Map();
          var arr = this.busPeopleInfo;
          this.busPeopleInfo = arr.filter(
            (arr) => !res.has(arr.userName) && res.set(arr.userName, 1)
          );
        } else {
          this.busPeopleInfo = this.peopleInfo;
        }
        //设置行程日期
        var data = [item.startTime, item.endTime];
        item.busDate = data;
        //计算出差天数
        var sArr = item.startTime.split("-");
        var eArr = item.endTime.split("-");
        var sRDate = new Date(sArr[0], sArr[1], sArr[2]);
        var eRDate = new Date(eArr[0], eArr[1], eArr[2]);
        var days = (eRDate - sRDate) / (24 * 60 * 60 * 1000);
        if (sArr[1] != eArr[1]) {
          item.busDay = days;
        } else {
          item.busDay = days + 1;
        }

        //计算出差人
        if (typeof item.travelPersonnels == "string") {
          item.busNum = item.travelPersonnels.split("、").length;
        } else {
          item.busNum = item.travelPersonnels.length;
        }
        this.editListId = ++this.editListId;
      });
    },
    //监控城市间交通费对象
    costCarfareList(newVal, oldVal) {
      newVal.forEach((item) => {
        //费用转成数字类型
        if (item.carfare != undefined) {
          item.crafare = Number(item.carfare);
        }
        item.returnFee = Number(item.returnFee);
        item.trafficAccidentInsurancePremium = Number(
          item.trafficAccidentInsurancePremium
        );
        item.bookingFee = Number(item.bookingFee);
        if (item.vehicleName != undefined && item.vehicleName != "") {
          item.vehicleName = item.vehicleName.split("-").join("/");
        }
      });
    },
    //监控住宿费列表对象
    costHotelList(newVal, oldVal) {
      newVal.forEach((item) => {
        if (item.gender == "1") {
          item.genderName = "男";
        } else {
          item.genderName = "女";
        }
        //住宿费转成数字类型
        item.hotelExpense = Number(item.hotelExpense);
        //计算人均花销
        item.hotelCostDay = (
          Number(item.hotelExpense / item.hotelDays).toFixed(2) + ""
        ).replace(/\d(?=(?:\d{3})+\b)/g, "$&,");
      });
    },
    //监控其他费用列表对象
    costOtherList(newVal, oldVal) {},
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
  methods: {
    dataFilter(val) {
      if (val) {
        //val存在
        this.hotCityList = this.regionList.filter((item) => {
          if (
            !!~item.regionName.indexOf(val) ||
            !!~item.regionName.toUpperCase().indexOf(val.toUpperCase())
          ) {
            return true;
          }
        });
      }
    },
    // 获取出差人信息数据
    async getData(value) {
      var res = await axios.post(
        option.base_path + "user/userInfo/getAllUserInfoToPage",
        {
          params: "",
          pageIndex: 1,
          pageNum: 99999, //每页显示条数
        }
      );
      this.usersList = res.data.data.rows;
      this.usersList.forEach((item) => {
        value.forEach((i) => {
          if (item.userName == i) {
            this.peopleInfo.push({
              userName: item.userName, //	出差人姓名
              sex: item.sex, //性别
              userItcode: item.userItcode, //出差人code
              deptName: item.deptName, //	出差人部门名称
              jobCode: item.jobCode, //	出差人职务code
              jobName: item.jobName, //	出差人职务名称
              jobLevelCode: item.jobLevelCode, //	出差人职务级别code
              jobLevelName: item.jobLevelName, //	出差人职务级别名称
            });
          }
        });
      });
    },
    //行程明细新增
    addTrip(formName) {
      this.tripForm = {};
      this.tripDialog = true;
      this.editTripList = false;
      if (this.tripForm.travelPersonnels == undefined) {
        this.tripForm.busNum = "自动计算";
      } else {
        this.tripForm.busNum = this.tripForm.travelPersonnels.length;
      }
      if (this.$refs.tripForm !== undefined) {
        this.$refs.tripForm.resetFields();
      }
    },
    //行程明细弹出框保存按钮
    saveTrip(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.tripDialog = false;
          var sRDate = this.tripForm.busDate[0];
          var eRDate = this.tripForm.busDate[1];
          this.tripForm.startTime = sRDate;
          this.tripForm.endTime = eRDate;
          //计算出差天数
          var sArr = sRDate.split("-");
          var eArr = eRDate.split("-");
          var sRDate = new Date(sArr[0], sArr[1], sArr[2]);
          var eRDate = new Date(eArr[0], eArr[1], eArr[2]);
          var days = (eRDate - sRDate) / (24 * 60 * 60 * 1000);
          this.tripForm.busDay = days;

          //获取出差人
          var travelPersonnels = this.tripForm.travelPersonnels.join("、");
          //新增还是修改
          if (this.editTripList == true) {
            this.editTripList = false;
            //行程明细列表显示数据
            this.travelList.splice(this.tripListIndex, 1);
            this.travelList.splice(this.tripListIndex, 0, {
              listId: this.tripForm.listId, //对应ID
              busPeopleInfo: this.peopleInfo, //出差人信息集合
              goAddress: this.tripForm.goAddress, //出发地点
              startingPoint: this.tripForm.startingPoint, //出发地点
              startTime: this.tripForm.startTime, //开始时间
              endTime: this.tripForm.endTime, //结束时间
              busDay: this.tripForm.busDay, //出差天数
              travelAddress: this.tripForm.travelAddress, //出差地点
              travelAddressName: this.tripForm.travelAddressName, //出差地点中文名称
              travelPersonnels: travelPersonnels, //出差人
              busNum: this.tripForm.busNum, //出差人数
              busDate: this.tripForm.busDate, //出差起止时间集合
              receptionCostItem: "", //接待方承担费用项
              setMethod: "", //结算方式
            });
            //行程明细列表传参数据
            this.travelRouteList.splice(this.tripListIndex, 1);
            this.travelRouteList.splice(this.tripListIndex, 0, {
              travelType: "", //出差类型
              startingPoint: this.tripForm.startingPoint, //出发地点
              travelAddress: this.tripForm.travelAddress, //出差地点
              travelAddressName: this.tripForm.travelAddressName, //出差地点中文名称
              startTime: this.tripForm.startTime, //开始时间
              endTime: this.tripForm.endTime, //结束时间
              travelPersonnels: travelPersonnels, //出差人
              receptionCostItem: "", //接待方承担费用项
              setMethod: "", //结算方式
            });
            //删除对应id交通费列表数据
            var newCarArr = [];
            this.costCarfareList.forEach((item, index) => {
              if (item.listId != this.tripForm.listId) {
                newCarArr.push(item);
              }
            });
            this.costCarfareList = newCarArr;
            //删除对应id住宿费列表数据
            var newHotelArr = [];
            this.costHotelList.forEach((item, index) => {
              if (item.listId != this.tripForm.listId) {
                newHotelArr.push(item);
              }
            });
            this.costHotelList = newHotelArr;
            this.busNameVal(this.tripForm.travelPersonnels);
            //修改的数据重新添加列表
            this.peopleInfo.forEach((item, index) => {
              //获取交通费数据方法
              this.costCarfareList.push({
                listId: this.tripForm.listId, //对应ID
                travelPersonnel: item.userItcode, //出差人
                goTime: this.tripForm.startTime, //出发时间 （往)
                arrivalTime: "", //到达时间
                goAddress: this.tripForm.goAddress, //出发地点 （往)
                goAddressName: this.tripForm.startingPoint, //出发地点出发地点中文名称 （往)
                arrivalAddress: this.tripForm.travelAddress, //到达地点 (返)
                arrivalAddressName: this.tripForm.travelAddressName, //到底地点中文名称 (返)
                vehicle: "..", //交通工具
                crafare: 0.0, //城市间交通费
                returnFee: 0.0, //退改签费用
                trafficAccidentInsurancePremium: 0.0, //交通意外保险
                bookingFee: 0.0, //订票费
                remarks: "无", //特殊说明
                setMethod: "", //结算方式

                //非传参字段
                // travelPersonnel:item.userItcode,//出差人
                travelPersonnelName: item.userName, //	出差人姓名
                travelPersonnelsDept: item.deptName, //	出差人部门名称
                travelPersonnelsJobCode: item.jobCode, //	出差人职务code
                travelPersonnelsJobName: item.jobName, //	出差人职务名称
                travelPersonnelsJobLevelCode: item.jobLevelCode, //	出差人职务级别code
                travelPersonnelsJobLevelName: item.jobLevelName, //	出差人职务级别名称
              });
              this.costCarfareList.push({
                listId: this.tripForm.listId, //对应ID
                travelPersonnel: item.userItcode, //出差人
                goTime: this.tripForm.endTime, //出发时间 (返)
                arrivalTime: "", //到达时间
                goAddress: this.tripForm.travelAddress, //出发地点 (返)
                goAddressName: this.tripForm.travelAddressName, //出发地点出发地点中文名称 (返)
                arrivalAddress: this.tripForm.goAddress, //到达地点 （往）
                arrivalAddressName: this.tripForm.startingPoint, //到底地点中文名称（往)
                vehicle: "..", //交通工具
                crafare: 0.0, //城市间交通费
                returnFee: 0.0, //退改签费用
                trafficAccidentInsurancePremium: 0.0, //交通意外保险
                bookingFee: 0.0, //订票费
                remarks: "无", //特殊说明
                setMethod: "", //结算方式

                //非传参字段
                // travelPersonnel:item.userItcode,//出差人
                travelPersonnelName: item.userName, //	出差人姓名
                travelPersonnelsDept: item.deptName, //	出差人部门名称
                travelPersonnelsJobCode: item.jobCode, //	出差人职务code
                travelPersonnelsJobName: item.jobName, //	出差人职务名称
                travelPersonnelsJobLevelCode: item.jobLevelCode, //	出差人职务级别code
                travelPersonnelsJobLevelName: item.jobLevelName, //	出差人职务级别名称
              });
              //获取住宿费数据方法
              this.costHotelList.push({
                listId: this.tripForm.listId, //对应ID
                travelPersonnel: item.userItcode, //出差人
                travelPersonnelName: item.userName, //	出差人姓名
                travelPersonnelsJobName: item.jobName, //	出差人职务名称
                hotelDays: this.tripForm.busDay, //住宿天数
                hotelAddress: this.tripForm.travelAddress, //住宿地点code
                hotelAddressName: this.tripForm.travelAddressName, //住宿地点中文名称
                hotelTime: this.tripForm.startTime, //入住日期
                leaveTime: this.tripForm.endTime, //离开日期
                hotelExpense: 0, //住宿费
                remarks: "无", //特殊说明
                setMethod: "", //结算方式

                //非传参字段
                // travelPersonnel:item.userItcode,//出差人
                // travelPersonnelName:item.userName,//	出差人姓名
                // travelPersonnelsDept:item.deptName,//	出差人部门名称
                // travelPersonnelsJobCode:item.jobCode,//	出差人职务code
                // travelPersonnelsJobName:item.jobName,//	出差人职务名称
                // travelPersonnelsJobLevelCode:item.jobLevelCode,//	出差人职务级别code
                // travelPersonnelsJobLevelName:item.jobLevelName,//	出差人职务级别名称
                // jobName:item.jobName,
                gender: item.sex,
                genderName: item.sex == 1 ? "男" : "女",
                hotelCostDay: 0.0,
              });
            });
          } else {
            //行程明细列表显示数据
            this.travelList.push({
              listId: this.listId, //对应ID
              busPeopleInfo: this.peopleInfo, //出差人信息集合
              goAddress: this.tripForm.goAddress, //出发地点
              startingPoint: this.tripForm.startingPoint, //出发地点
              startTime: this.tripForm.startTime, //开始时间
              endTime: this.tripForm.endTime, //结束时间
              busDay: this.tripForm.busDay, //出差天数
              travelAddress: this.tripForm.travelAddress, //出差地点
              travelAddressName: this.tripForm.travelAddressName, //出差地点中文名称
              travelPersonnels: travelPersonnels, //出差人
              busNum: this.tripForm.busNum, //出差人数
              busDate: this.tripForm.busDate, //出差起止时间集合
              receptionCostItem: "", //接待方承担费用项
              setMethod: "", //结算方式
            });
            //行程明细列表传参数据
            this.travelRouteList.push({
              listId: this.listId, //对应ID
              travelType: "", //出差类型
              startingPoint: this.tripForm.startingPoint, //出发地点
              travelAddress: this.tripForm.travelAddress, //出差地点
              travelAddressName: this.tripForm.travelAddressName, //出差地点中文名称
              startTime: this.tripForm.startTime, //开始时间
              endTime: this.tripForm.endTime, //结束时间
              travelPersonnels: travelPersonnels, //出差人
              receptionCostItem: "", //接待方承担费用项
              setMethod: "", //结算方式
            });
            this.peopleInfo.forEach((item, index) => {
              //获取交通费数据方法
              this.costCarfareList.push({
                listId: this.listId, //对应ID
                travelPersonnel: item.userItcode, //出差人
                goTime: this.tripForm.startTime, //出发时间
                arrivalTime: "", //到达时间
                goAddress: this.tripForm.goAddress, //出发地点
                goAddressName: this.tripForm.startingPoint, //出发地点出发地点中文名称
                arrivalAddress: this.tripForm.travelAddress, //到达地点
                arrivalAddressName: this.tripForm.travelAddressName, //到底地点中文名称
                vehicle: "..", //交通工具
                crafare: 0.0, //城市间交通费
                returnFee: 0.0, //退改签费用
                trafficAccidentInsurancePremium: 0.0, //交通意外保险
                bookingFee: 0.0, //订票费
                remarks: "无", //特殊说明
                setMethod: "", //结算方式

                //非传参字段
                // travelPersonnel:item.userItcode,//出差人
                travelPersonnelName: item.userName, //	出差人姓名
                travelPersonnelsDept: item.deptName, //	出差人部门名称
                travelPersonnelsJobCode: item.jobCode, //	出差人职务code
                travelPersonnelsJobName: item.jobName, //	出差人职务名称
                travelPersonnelsJobLevelCode: item.jobLevelCode, //	出差人职务级别code
                travelPersonnelsJobLevelName: item.jobLevelName, //	出差人职务级别名称
              });
              this.costCarfareList.push({
                listId: this.listId, //对应ID
                travelPersonnel: item.userItcode, //出差人
                goTime: this.tripForm.endTime, //出发时间 (返)
                arrivalTime: "", //到达时间
                goAddress: this.tripForm.travelAddress, //出发地点 (返)
                goAddressName: this.tripForm.travelAddressName, //出发地点出发地点中文名称 (返)
                arrivalAddress: this.tripForm.goAddress, //到达地点 （往）
                arrivalAddressName: this.tripForm.startingPoint, //到底地点中文名称（往)
                vehicle: "..", //交通工具
                crafare: 0.0, //城市间交通费
                returnFee: 0.0, //退改签费用
                trafficAccidentInsurancePremium: 0.0, //交通意外保险
                bookingFee: 0.0, //订票费
                remarks: "无", //特殊说明
                setMethod: "", //结算方式

                //非传参字段
                // travelPersonnel:item.userItcode,//出差人
                travelPersonnelName: item.userName, //	出差人姓名
                travelPersonnelsDept: item.deptName, //	出差人部门名称
                travelPersonnelsJobCode: item.jobCode, //	出差人职务code
                travelPersonnelsJobName: item.jobName, //	出差人职务名称
                travelPersonnelsJobLevelCode: item.jobLevelCode, //	出差人职务级别code
                travelPersonnelsJobLevelName: item.jobLevelName, //	出差人职务级别名称
              });
              //获取住宿费数据方法
              this.costHotelList.push({
                listId: this.listId, //对应ID
                travelPersonnel: item.userItcode, //出差人
                travelPersonnelName: item.userName, //	出差人姓名
                travelPersonnelsJobName: item.jobName, //	出差人职务名称
                hotelDays: this.tripForm.busDay, //住宿天数
                hotelAddress: this.tripForm.travelAddress, //住宿地点code
                hotelAddressName: this.tripForm.travelAddressName, //住宿地点中文名称
                hotelTime: this.tripForm.startTime, //入住日期
                leaveTime: this.tripForm.endTime, //离开日期
                hotelExpense: 0, //住宿费
                remarks: "无", //特殊说明
                setMethod: "", //结算方式

                //非传参字段
                // travelPersonnel:item.userItcode,//出差人
                // travelPersonnelName:item.userName,//	出差人姓名
                // travelPersonnelsDept:item.deptName,//	出差人部门名称
                // travelPersonnelsJobCode:item.jobCode,//	出差人职务code
                // travelPersonnelsJobName:item.jobName,//	出差人职务名称
                // travelPersonnelsJobLevelCode:item.jobLevelCode,//	出差人职务级别code
                // travelPersonnelsJobLevelName:item.jobLevelName,//	出差人职务级别名称
                // jobName:item.jobName,
                gender: item.sex,
                genderName: item.sex == 1 ? "男" : "女",
                hotelCostDay: 0.0,
              });
            });
            this.$message({
              showClose: true,
              message: "填写的信息已成功加入到列表",
              type: "success",
            });
          }
          //储存出差人数据
          if (this.busPeopleInfo.length != 0) {
            this.peopleInfo.forEach((item) => {
              this.busPeopleInfo.push(item);
            });
            const res = new Map();
            var arr = this.busPeopleInfo;
            this.busPeopleInfo = arr.filter(
              (arr) => !res.has(arr.userName) && res.set(arr.userName, 1)
            );
          } else {
            this.busPeopleInfo = this.peopleInfo;
          }
          //列表绑定ID增加
          this.listId = ++this.listId;
        } else {
          return false;
        }
      });
    },
    //行程明细弹出框关闭按钮
    closeTrip(formName) {
      this.tripDialog = false;
      if (this.editTripList == false) {
        this.$refs[formName].resetFields();
      } else {
        this.editTripList == false;
      }
    },
    //行程明细列表修改
    tripUpdate(index, row) {
      const res = new Map();
      var arr = this.peopleInfo;
      this.peopleInfo = arr.filter(
        (arr) => !res.has(arr.userName) && res.set(arr.userName, 1)
      );
      this.tripDialog = true;
      this.editTripList = true;
      this.tripForm = {
        listId: 0,
        endTime: "",
        startTime: "",
        startingPoint: "",
        travelAddress: "",
        travelAddressName: "",
        travelAppId: 0,
        travelPersonnels: "",
        travelPersonnelsList: [],
        travelPersonnelsName: "",
        travelTypeName: "",
        busDate: [],
        busDay: 0,
        busNum: 0,
      };
      this.$nextTick(() => {
        this.$refs.tripForm.clearValidate();
      });
      // this.tripForm=row;
      this.tripForm.listId = row.listId;
      this.tripForm.busPeopleInfo = row.busPeopleInfo;
      this.tripForm.goAddress = row.goAddress;
      this.tripForm.startingPoint = row.startingPoint;
      this.tripForm.startTime = row.startTime;
      this.tripForm.busDay = row.busDay;
      this.tripForm.travelAddress = row.travelAddress;
      this.tripForm.travelAddressName = row.travelAddressName;
      if (typeof row.travelPersonnels == "string") {
        this.tripForm.travelPersonnels = row.travelPersonnels.split("、");
      }
      this.tripForm.busNum = row.busNum;
      this.tripForm.listId = row.listId;
      this.tripForm.startingPoint = row.startingPoint;
      this.tripForm.travelAddressName = row.travelAddressName;
      this.tripForm.busDate = row.busDate;
      this.tripListIndex = index;
    },
    //行程明细列表删除
    tripDel(index, row) {
      this.$confirm(`确定删除吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      }).then(() => {
        this.travelList.splice(index, 1);
        //重新获取交通费列表
        let newCarArr = [];
        var nCarArr = [];
        this.costCarfareList.forEach((i, n) => {
          if (i.listId != row.listId) {
            newCarArr.push(i);
          }
        });
        newCarArr.forEach((item) => {
          if (item.listId != undefined) {
            nCarArr.push(item);
          }
        });
        this.costCarfareList = nCarArr;
        //重新获取住宿费列表
        var newHotelArr = [];
        var nHotelArr = [];
        this.costHotelList.forEach((i, n) => {
          if (i.listId != row.listId) {
            newHotelArr.push(i);
          }
        });
        newHotelArr.forEach((item) => {
          if (item.listId != undefined) {
            nHotelArr.push(item);
          }
        });
        this.costHotelList = nHotelArr;
        //重新获取出差人信息
        if (this.travelList.length != 0) {
          this.busPeopleInfo = [];
          this.travelList.forEach((item) => {
            item.busPeopleInfo.forEach((i) => {
              this.busPeopleInfo.push(i);
            });
          });
          const res = new Map();
          var arr = this.busPeopleInfo;
          this.busPeopleInfo = arr.filter(
            (arr) => !res.has(arr.userName) && res.set(arr.userName, 1)
          );
        } else {
          this.busPeopleInfo = [];
        }
      });
    },
    //费用明细信息新增
    addCost() {
      this.vechicleChild = false;
      //费用明细弹出框默认选中第一个页签
      this.costTabIndex = 0 + "";
      this.costDialog = true;
      this.editTrafficList == false;
      this.trafficTab = false;
      this.hotelTab = false;
      this.otherTab = false;
      this.trafficForm = {
        arrivalAddress: "",
        arrivalAddressName: "",
        bookingFee: 0,
        carfare: 0,
        goAddress: "",
        goAddressName: "",
        goTime: "",
        id: 0,
        remarks: "",
        returnFee: 0,
        setMethod: "",
        trafficAccidentInsurancePremium: 0,
        travelPersonnel: "",
        travelPersonnelName: "",
        travelPersonnelsDept: "",
        travelPersonnelsJobCode: "",
        travelPersonnelsJobLevelCode: "",
        travelPersonnelsJobLevelName: "",
        travelPersonnelsJobName: "",
        vehicle: "",
        vehicleName: "",
        vehicleChildName: "",
        crafare: 0,
      };
      this.hotelForm = {};
      this.otherForm = {};
      // this.hotelForm ={
      //     gender: "",
      //     hotelAddress: "",
      //     hotelAddressName: "",
      //     hotelDays: 1,
      //     hotelExpense: 0,
      //     hotelTime: "",
      //     leaveTime: "",
      //     remarks: "",
      //     setMethod: "",
      //     travelPersonnel: "",
      //     travelPersonnelName: "",
      //     travelPersonnelsDept: "",
      //     travelPersonnelsJobCode: "",
      //     travelPersonnelsJobLevelCode: "",
      //     travelPersonnelsJobLevelName: "",
      //     travelPersonnelsJobName: "",
      //     genderName: "",
      //     hotelCostDay: "",
      // };
      // this.otherForm ={
      //     costType: "",
      //     costTypeName: "",
      //     reimAmount: 0,
      //     remarks: "",
      //     setMethod: "",
      //     trafficType: "",
      //     trafficTypeName: "",
      // };
      this.$nextTick(() => {
        this.$refs.trafficForm.clearValidate();
      });
    },
    //获取费用明细信息弹出框显示的tab
    getTabPane(e) {
      this.costTabIndex = e.index;
      if (this.costTabIndex == 0 && this.$refs.trafficForm !== undefined) {
        this.$refs.trafficForm.clearValidate();
        this.trafficForm = {};
        this.hotelForm = {};
        this.otherForm = {};
      } else if (this.costTabIndex == 1 && this.$refs.hotelForm !== undefined) {
        this.$refs.hotelForm.clearValidate();
        this.trafficForm = {};
        this.hotelForm = {};
        this.otherForm = {};
      } else if (this.costTabIndex == 2 && this.$refs.otherForm !== undefined) {
        this.$refs.otherForm.clearValidate();
        this.trafficForm = {};
        this.hotelForm = {};
        this.otherForm = {};
      }
    },
    //费用明细信息弹出框保存按钮
    saveCost(formName) {
      if (this.costTabIndex == 0) {
        formName = "trafficForm";
      } else if (this.costTabIndex == 1) {
        formName = "hotelForm";
      } else if (this.costTabIndex == 2) {
        formName = "otherForm";
      }
      if (this.costTabIndex == 0) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.costDialog = false;
            //新增还是修改
            if (this.editTrafficList == true) {
              this.costCarfareList.splice(this.trafficListIndex, 1);
              this.costCarfareList.splice(this.trafficListIndex, 0, {
                listId: this.trafficForm.listId, //对应ID
                travelPersonnel: this.trafficForm.travelPersonnel, //出差人
                travelPersonnelName: this.trafficForm.travelPersonnelName, //	出差人姓名
                travelPersonnelsJobName: this.trafficForm
                  .travelPersonnelsJobName, //职位
                goTime: this.trafficForm.goTime, //出发时间
                arrivalTime: "", //到达时间
                goAddress: this.trafficForm.goAddress, //出发地点
                goAddressName: this.trafficForm.goAddressName, //出发地点中文
                arrivalAddress: this.trafficForm.arrivalAddress, //到达地点
                arrivalAddressName: this.trafficForm.arrivalAddressName, //到达地点中文
                vehicle: this.trafficForm.vehicle, //交通工具code
                vehicleName:
                  this.trafficForm.vehicleFatherName +
                  (this.trafficForm.vehicleChildName == ""
                    ? ""
                    : "/" + this.trafficForm.vehicleChildName), //交通工具名称
                vehicleChildName: this.trafficForm.vehicleChildName, //交通工具二级名称
                crafare: this.trafficForm.crafare, //城市间交通费
                returnFee: this.trafficForm.returnFee, //退改签费用(元)
                trafficAccidentInsurancePremium: this.trafficForm
                  .trafficAccidentInsurancePremium, //交通意外保险费(元)
                bookingFee: this.trafficForm.bookingFee, //订票费(元)
                remarks: this.trafficForm.remarks || "无", //特殊说明
                setMethod: "", //结算方式

                // travelPersonnel:this.trafficForm.travelPersonnel,//出差人
                // travelPersonnelName:this.trafficForm.travelPersonnelName,//	出差人姓名
                // travelPersonnelsDept:this.trafficForm.travelPersonnelsDept,//	出差人部门名称
                // travelPersonnelsJobCode:this.trafficForm.travelPersonnelsJobCode,//	出差人职务code
                // travelPersonnelsJobName:this.trafficForm.travelPersonnelsJobName,//	出差人职务名称
                // travelPersonnelsJobLevelCode:this.trafficForm.travelPersonnelsJobLevelCode,//	出差人职务级别code
                // travelPersonnelsJobLevelName:this.trafficForm.travelPersonnelsJobLevelName,//	出差人职务级别名称
              });
              this.editTrafficList = false;
            } else {
              //获取交通费数据方法
              this.costCarfareList.push({
                travelPersonnel: this.trafficForm.travelPersonnel, //出差人
                travelPersonnelName: this.trafficForm.travelPersonnelName, //	出差人姓名
                travelPersonnelsJobName: this.trafficForm.jobName, //职位
                goTime: this.trafficForm.goTime, //出发时间
                arrivalTime: "", //到达时间
                goAddress: this.trafficForm.goAddress, //出发地点
                goAddressName: this.trafficForm.goAddressName, //出发地点中文
                arrivalAddress: this.trafficForm.arrivalAddress, //到达地点
                arrivalAddressName: this.trafficForm.arrivalAddressName, //到达地点中文
                vehicle: this.trafficForm.vehicle, //交通工具code
                vehicleName:
                  this.trafficForm.vehicleFatherName +
                  (this.trafficForm.vehicleChildName == ""
                    ? ""
                    : "/" + this.trafficForm.vehicleChildName), //交通工具名称
                vehicleChildName: this.trafficForm.vehicleChildName, //交通工具二级名称
                crafare: this.trafficForm.crafare, //城市间交通费
                returnFee: this.trafficForm.returnFee, //退改签费用(元)
                trafficAccidentInsurancePremium: this.trafficForm
                  .trafficAccidentInsurancePremium, //交通意外保险费(元)
                bookingFee: this.trafficForm.bookingFee, //订票费(元)
                remarks: this.trafficForm.remarks || "无", //特殊说明
                setMethod: "", //结算方式

                // travelPersonnel:this.trafficForm.travelPersonnel,//出差人
                // travelPersonnelName:this.trafficForm.travelPersonnelName,//	出差人姓名
                // travelPersonnelsDept:this.trafficForm.travelPersonnelsDept,//	出差人部门名称
                // travelPersonnelsJobCode:this.trafficForm.travelPersonnelsJobCode,//	出差人职务code
                // travelPersonnelsJobName:this.trafficForm.travelPersonnelsJobName,//	出差人职务名称
                // travelPersonnelsJobLevelCode:this.trafficForm.travelPersonnelsJobLevelCode,//	出差人职务级别code
                // travelPersonnelsJobLevelName:this.trafficForm.travelPersonnelsJobLevelName,//	出差人职务级别名称
              });
            }
          } else {
            return false;
          }
        });
      }
      if (this.costTabIndex == 1) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.costDialog = false;
            var sRDate = this.hotelForm.hotelDate[0];
            var eRDate = this.hotelForm.hotelDate[1];
            this.hotelForm.hotelTime = sRDate;
            this.hotelForm.leaveTime = eRDate;
            //计算住宿天数
            var sArr = sRDate.split("-");
            var eArr = eRDate.split("-");
            var sRDate = new Date(sArr[0], sArr[1], sArr[2]);
            var eRDate = new Date(eArr[0], eArr[1], eArr[2]);
            var days = (eRDate - sRDate) / (24 * 60 * 60 * 1000);
            this.hotelForm.hotelDays = days;
            //新增还是修改
            if (this.editHotelList == true) {
              this.hotelForm.hotelCostDay = (
                Number(
                  this.hotelForm.hotelExpense / this.hotelForm.hotelDays
                ).toFixed(2) + ""
              ).replace(/\d(?=(?:\d{3})+\b)/g, "$&,");
              this.costHotelList.splice(this.hotelCostListIndex, 1);
              this.costHotelList.splice(this.hotelCostListIndex, 0, {
                listId: this.hotelForm.listId, //对应ID
                travelPersonnel: this.hotelForm.travelPersonnel, //出差人
                travelPersonnelName: this.hotelForm.travelPersonnelName, //	出差人姓名
                travelPersonnelsJobName: this.hotelForm.travelPersonnelsJobName, //	出差人职务名称
                gender: this.hotelForm.gender, //性别
                genderName: this.hotelForm.gender == 1 ? "男" : "女",
                jobName: this.hotelForm.jobName, //职别
                hotelCostDay: this.hotelForm.hotelCostDay, //人均花销
                hotelTime: this.hotelForm.hotelTime, //入住时间
                leaveTime: this.hotelForm.leaveTime, //离开时间
                hotelDays: this.hotelForm.hotelDays, //住宿天数
                // hotelDate: this.hotelForm.hotelDate,//住宿时间集合
                hotelExpense: this.hotelForm.hotelExpense, //住宿费
                hotelAddress: this.hotelForm.hotelAddress, //住宿地点code
                hotelAddressName: this.hotelForm.hotelAddressName, //住宿地点中文名称
                remarks: this.hotelForm.remarks || "无", //特殊说明
                setMethod: "", //结算方式

                //非传参字段
                // travelPersonnel:this.hotelForm.travelPersonnel,//出差人
                // travelPersonnelName:this.hotelForm.travelPersonnelName,//	出差人姓名
                // travelPersonnelsDept:this.hotelForm.travelPersonnelsDept,//	出差人部门名称
                // travelPersonnelsJobCode:this.hotelForm.travelPersonnelsJobCode,//	出差人职务code
                // travelPersonnelsJobName:this.hotelForm.travelPersonnelsJobName,//	出差人职务名称
                // travelPersonnelsJobLevelCode:this.hotelForm.travelPersonnelsJobLevelCode,//	出差人职务级别code
                // travelPersonnelsJobLevelName:this.hotelForm.travelPersonnelsJobLevelName,//	出差人职务级别名称
              });
              this.editHotelList = false;
            } else {
              //获取住宿费数据方法
              this.costHotelList.push({
                travelPersonnel: this.hotelForm.travelPersonnel, //出差人
                travelPersonnelName: this.hotelForm.travelPersonnelName, //	出差人姓名
                travelPersonnelsJobName: this.hotelForm.travelPersonnelsJobName, //出差人职务名称
                gender: this.hotelForm.gender, //性别
                genderName: this.hotelForm.gender == 1 ? "男" : "女",
                jobName: this.hotelForm.jobName, //职别
                hotelCostDay: this.hotelForm.hotelCostDay, //人均花销
                hotelTime: this.hotelForm.hotelTime, //入住时间
                leaveTime: this.hotelForm.leaveTime, //离开时间
                hotelDays: this.hotelForm.hotelDays, //住宿天数
                hotelDate: this.hotelForm.hotelDate, //住宿时间集合
                hotelExpense: this.hotelForm.hotelExpense, //住宿费
                hotelAddress: this.hotelForm.hotelAddress, //住宿地点code
                hotelAddressName: this.hotelForm.hotelAddressName, //住宿地点中文名称
                remarks: this.hotelForm.remarks || "无", //特殊说明
                setMethod: "", //结算方式

                //非传参字段
                // travelPersonnel:this.hotelForm.travelPersonnel,//出差人
                // travelPersonnelName:this.hotelForm.travelPersonnelName,//	出差人姓名
                // travelPersonnelsDept:this.hotelForm.travelPersonnelsDept,//	出差人部门名称
                // travelPersonnelsJobCode:this.hotelForm.travelPersonnelsJobCode,//	出差人职务code
                // travelPersonnelsJobName:this.hotelForm.travelPersonnelsJobName,//	出差人职务名称
                // travelPersonnelsJobLevelCode:this.hotelForm.travelPersonnelsJobLevelCode,//	出差人职务级别code
                // travelPersonnelsJobLevelName:this.hotelForm.travelPersonnelsJobLevelName,//	出差人职务级别名称
              });
            }
          } else {
            return false;
          }
        });
      }
      if (this.costTabIndex == 2) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.costDialog = false;
            if (this.otherForm.trafficType == "") {
              var trafficType = "";
            } else {
              var trafficType = this.otherForm.trafficType;
            }
            if (this.otherForm.trafficTypeName == "") {
              var trafficTypeName = "";
            } else {
              var trafficTypeName = this.otherForm.trafficTypeName;
            }
            //新增还是修改
            if (this.editOtherList == true) {
              this.costOtherList.splice(this.otherCostListIndex, 1);
              this.costOtherList.splice(this.otherCostListIndex, 0, {
                costType: this.otherForm.costType, //费用类型
                costTypeName: this.otherForm.costTypeName, //费用类型名称
                trafficType: trafficType, //交通类型
                trafficTypeName: this.otherForm.trafficTypeName, //交通类型名称
                reimAmount: this.otherForm.reimAmount, //报销金额
                remarks: this.otherForm.remarks || "无", //特殊说明
                setMethod: "", //结算方式
              });
              this.editOtherList = false;
            } else {
              this.costOtherList.push({
                costType: this.otherForm.costType, //费用类型
                costTypeName: this.otherForm.costTypeName, //费用类型名称
                trafficType: trafficType, //交通类型
                trafficTypeName: trafficTypeName, //交通类型名称
                reimAmount: this.otherForm.reimAmount, //报销金额
                remarks: this.otherForm.remarks || "无", //特殊说明
                setMethod: "", //结算方式
              });
            }
          } else {
            return false;
          }
        });
      }
      this.$emit("sumTotal", {
        travelList: this.travelList,
        costCarfareList: this.costCarfareList,
        costHotelList: this.costHotelList,
        costOtherList: this.costOtherList,
      });
    },
    //费用明细信息弹出框关闭按钮
    closeCost(formName) {
      this.costDialog = false;
      this.editTrafficList = false;
      this.editHotelList = false;
      this.editOtherList = false;
      if (this.costTabIndex == 0) {
        formName = "trafficForm";
        // if(this.editTrafficList==false){
        //     // this.$refs[formName].resetFields();
        // }
      } else if (this.costTabIndex == 1) {
        formName = "hotelForm";
        // if(this.editHotelList==false){
        //     this.$refs[formName].resetFields();
        // }
      } else if (this.costTabIndex == 2) {
        formName = "otherForm";
        // if(this.editOtherList==false){
        //     this.$refs[formName].resetFields();
        // }
      }
    },
    //计算住宿天数
    getHotelDay(value) {
      debugger;
      var sRDate = value[0];
      var eRDate = value[1];
      var sArr = sRDate.split("-");
      var eArr = eRDate.split("-");
      var sRDate = new Date(sArr[0], sArr[1], sArr[2]);
      var eRDate = new Date(eArr[0], eArr[1], eArr[2]);
      var days = (eRDate - sRDate) / (24 * 60 * 60 * 1000);
      this.hotelForm.hotelDays = days;
      if (
        this.hotelForm.hotelExpense != undefined &&
        this.hotelForm.hotelDays != 0
      ) {
        this.hotelForm.hotelCostDay = (
          Number(
            this.hotelForm.hotelExpense / this.hotelForm.hotelDays
          ).toFixed(2) + ""
        ).replace(/\d(?=(?:\d{3})+\b)/g, "$&,");
      }
    },
    //计算住宿费
    getHotelCost(value) {
      if (value != "") {
        this.hotelForm.hotelCostDay = (
          Number(value / this.hotelForm.hotelDays).toFixed(2) + ""
        ).replace(/\d(?=(?:\d{3})+\b)/g, "$&,");
      } else {
        this.hotelForm.hotelCostDay = "0.00";
      }
    },
    //交通费列表修改
    trafficUpdate(index, row) {
      this.costCareList = row;
      this.trafficForm = {
        arrivalAddress: "",
        arrivalAddressName: "",
        bookingFee: 0,
        carfare: 0,
        goAddress: "",
        goAddressName: "",
        goTime: "",
        id: 0,
        remarks: "",
        returnFee: 0,
        setMethod: "",
        trafficAccidentInsurancePremium: 0,
        travelPersonnel: "",
        travelPersonnelName: "",
        travelPersonnelsDept: "",
        travelPersonnelsJobCode: "",
        travelPersonnelsJobLevelCode: "",
        travelPersonnelsJobLevelName: "",
        travelPersonnelsJobName: "",
        vehicle: "",
        vehicleName: "",
        vehicleChildName: "",
        crafare: 0,
      };
      this.$nextTick(() => {
        this.$refs.trafficForm.clearValidate();
      });
      this.costTabIndex = 0 + "";
      this.costDialog = true;
      this.editTrafficList = true;
      this.hotelTab = true;
      this.otherTab = true;
      // this.trafficForm=row;
      this.trafficForm.listId = row.listId;
      this.trafficForm.goTime = row.goTime;
      this.trafficForm.goAddress = row.goAddress;
      this.trafficForm.goAddressName = row.goAddressName;
      this.trafficForm.arrivalAddress = row.arrivalAddress;
      this.trafficForm.arrivalAddressName = row.arrivalAddressName;
      this.trafficForm.vehicle = row.vehicle;
      this.trafficForm.crafare = row.crafare;
      this.trafficForm.returnFee = row.returnFee;
      this.trafficForm.trafficAccidentInsurancePremium =
        row.trafficAccidentInsurancePremium;
      this.trafficForm.bookingFee = row.bookingFee;
      this.trafficForm.remarks = row.remarks;
      this.trafficForm.travelPersonnel = row.travelPersonnel;
      this.trafficForm.travelPersonnelName = row.travelPersonnelName;
      this.trafficForm.travelPersonnelsDept = row.travelPersonnelsDept;
      this.trafficForm.travelPersonnelsJobCode = row.travelPersonnelsJobCode;
      this.trafficForm.travelPersonnelsJobName = row.travelPersonnelsJobName;
      this.trafficForm.travelPersonnelsJobLevelCode =
        row.travelPersonnelsJobLevelCode;
      this.trafficForm.travelPersonnelsJobLevelName =
        row.travelPersonnelsJobLevelName;
      if (row.vehicleName != undefined && row.vehicleName != "") {
        let trafficArr = row.vehicleName.split("/");
        if (trafficArr.length == 2) {
          this.trafficForm.vehicleFatherName = trafficArr[0];
          this.trafficForm.vehicleChildName = trafficArr[1];
        } else if (trafficArr.length == 3) {
          this.trafficForm.vehicleFatherName = trafficArr[0];
          this.trafficForm.vehicleChildName =
            trafficArr[1] + "/" + trafficArr[2];
        } else {
          this.trafficForm.vehicleFatherName = trafficArr[0];
        }
      } else {
        this.trafficForm.vehicleName = "";
      }
      if (
        this.trafficForm.vehicleChildName != undefined &&
        this.trafficForm.vehicleChildName != ""
      ) {
        let vehicle = this.trafficForm.vehicle.split(".")[1];
        var that = this;
        this.vechicleChild = true;
        axios
          .post(
            option.base_path + "basicconfig/dictInfo/getDictInfoByTypeCode",
            {
              dictTypeCode: vehicle,
            }
          )
          .then(function (res) {
            that.vehicleChildList = res.data.data;
          });
      } else {
        this.vechicleChild = false;
      }
      this.trafficListIndex = index;
    },
    //交通费列表删除
    trafficpDel(index, row) {
      this.$confirm(`确定删除吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      }).then(() => {
        this.costCarfareList.splice(index, 1);
        this.$emit("sumTotal", {
          travelList: this.travelList,
          costCarfareList: this.costCarfareList,
          costHotelList: this.costHotelList,
          costOtherList: this.costOtherList,
        });
      });
    },
    //住宿费列表修改
    hotelUpdate(index, row) {
      this.costTabIndex = 1 + "";
      this.costDialog = true;
      this.editHotelList = true;
      this.trafficTab = true;
      this.otherTab = true;
      this.hotelForm = {
        gender: "",
        hotelAddress: "",
        hotelAddressName: "",
        hotelDays: 1,
        hotelExpense: 0,
        hotelTime: "",
        leaveTime: "",
        remarks: "",
        setMethod: "",
        travelPersonnel: "",
        travelPersonnelName: "",
        travelPersonnelsDept: "",
        travelPersonnelsJobCode: "",
        travelPersonnelsJobLevelCode: "",
        travelPersonnelsJobLevelName: "",
        travelPersonnelsJobName: "",
        genderName: "",
        hotelCostDay: "",
      };
      this.$nextTick(() => {
        this.$refs.hotelForm.clearValidate();
      });
      // this.hotelForm=row;
      if (row.gender == "男" || row.gender == "1") {
        this.hotelForm.genderName = "男";
      } else if (row.gender == "女" || row.gender == "2") {
        this.hotelForm.genderName = "女";
      }
      this.hotelForm.listId = row.listId;
      this.hotelForm.gender = row.gender;
      this.hotelForm.jobName = row.jobName;
      this.hotelForm.hotelCostDay = row.hotelCostDay;
      this.hotelForm.hotelTime = row.hotelTime;
      this.hotelForm.leaveTime = row.leaveTime;
      this.hotelForm.hotelDays = row.hotelDays;
      this.hotelForm.hotelExpense = row.hotelExpense;
      this.hotelForm.hotelAddress = row.hotelAddress;
      this.hotelForm.hotelAddressName = row.hotelAddressName;
      this.hotelForm.remarks = row.remarks;
      this.hotelForm.travelPersonnel = row.travelPersonnel;
      this.hotelForm.travelPersonnelName = row.travelPersonnelName;
      this.hotelForm.travelPersonnelsDept = row.travelPersonnelsDept;
      this.hotelForm.travelPersonnelsJobCode = row.travelPersonnelsJobCode;
      this.hotelForm.travelPersonnelsJobName = row.travelPersonnelsJobName;
      this.hotelForm.travelPersonnelsJobLevelCode =
        row.travelPersonnelsJobLevelCode;
      this.hotelForm.travelPersonnelsJobLevelName =
        row.travelPersonnelsJobLevelName;
      this.hotelCostListIndex = index;
      var hotelDate = [];
      hotelDate.push(this.hotelForm.hotelTime);
      hotelDate.push(this.hotelForm.leaveTime);
      this.hotelForm.hotelDate = hotelDate;
    },
    //住宿费列表删除
    hotelDel(index, row) {
      this.$confirm(`确定删除吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      }).then(() => {
        this.costHotelList.splice(index, 1);
        this.$emit("sumTotal", {
          travelList: this.travelList,
          costCarfareList: this.costCarfareList,
          costHotelList: this.costHotelList,
          costOtherList: this.costOtherList,
        });
      });
    },
    //其他费列表修改
    otherUpdate(index, row) {
      this.costTabIndex = 2 + "";
      this.costDialog = true;
      this.editOtherList = true;
      this.trafficTab = true;
      this.hotelTab = true;
      this.otherCostListIndex = index;
      this.otherForm = {
        costType: "",
        costTypeName: "",
        reimAmount: 0,
        remarks: "",
        setMethod: "",
        trafficType: "",
        trafficTypeName: "",
      };
      this.$nextTick(() => {
        this.$refs.otherForm.clearValidate();
      });
      // this.otherForm=row;
      this.otherForm.costType = row.costType;
      this.otherForm.costTypeName = row.costTypeName;
      this.otherForm.trafficType = row.trafficType;
      this.otherForm.trafficTypeName = row.trafficTypeName;
      this.otherForm.reimAmount = Number(row.reimAmount);
      this.otherForm.remarks = row.remarks;
      if (row.trafficType == undefined || row.trafficType == "") {
        this.otherBusType = false;
      } else {
        this.otherBusType = true;
      }
      this.getCostTypeval(this.otherForm.costType);
    },
    //其他费列表删除
    otherDel(index, row) {
      this.$confirm(`确定删除吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      }).then(() => {
        this.costOtherList.splice(index, 1);
        this.$emit("sumTotal", {
          travelList: this.travelList,
          costCarfareList: this.costCarfareList,
          costHotelList: this.costHotelList,
          costOtherList: this.costOtherList,
        });
      });
    },
    //行程程详细出差人下拉框事件
    busNameVal(value) {
      this.peopleInfo = [];
      //获取出差人职务
      if (JSON.stringify(this.usersList) != "{}") {
        this.usersList.forEach((item) => {
          value.forEach((i) => {
            if (item.userName == i) {
              this.peopleInfo.push({
                userName: item.userName, //	出差人姓名
                sex: item.sex, //性别
                userItcode: item.userItcode, //出差人code
                deptName: item.deptName, //	出差人部门名称
                jobCode: item.jobCode, //	出差人职务code
                jobName: item.jobName, //	出差人职务名称
                jobLevelCode: item.jobLevelCode, //	出差人职务级别code
                jobLevelName: item.jobLevelName, //	出差人职务级别名称
              });
            }
          });
        });
      } else {
        this.getData(value);
      }
      const res = new Map();
      var arr = this.peopleInfo;
      this.peopleInfo = arr.filter(
        (arr) => !res.has(arr.userName) && res.set(arr.userName, 1)
      );
      this.tripForm.busNum = this.peopleInfo.length;
    },
    //城市间交通费用 交通工具改变事件
    getvechicleList(value) {
      var that = this;
      var obj = {};
      obj = this.vehicleList.find(function (item) {
        return item.value === value;
      });
      //获取二级交通工具
      if (value != "" && value != "VEHICIE_CODE_5") {
        //VEHICIE_CODE_5为其他交通工具
        that.vechicleChild = true;
        axios
          .post(
            option.base_path + "basicconfig/dictInfo/getDictInfoByTypeCode",
            {
              dictTypeCode: value,
            }
          )
          .then(function (res) {
            that.vehicleChildList = res.data.data;
            that.trafficForm.vehicleChildName =
              that.vehicleChildList[0].disvalue;
            that.trafficForm.vehicle =
              "." + value + "." + that.vehicleChildList[0].value + ".";
            that.trafficForm.vehicleName =
              obj.disvalue + "/" + that.trafficForm.vehicleChildName;
            that.trafficForm.vehicleFatherName = obj.disvalue;
          });
      } else {
        this.vechicleChild = false;
        this.trafficForm.vehicle = "." + value + ".";
        this.trafficForm.vehicleName = obj.disvalue;
        this.trafficForm.vehicleFatherName = obj.disvalue;
        this.trafficForm.vehicleChildName = "";
      }
    },
    //城市间交通费用 二级交通工具改变事件
    getvehicleChildList(value) {
      // 传进来的val是select组件选中的value值
      var obj = {};
      obj = this.vehicleChildList.find(function (item) {
        return item.value === value;
      });
      let arr = this.trafficForm.vehicle.split(".");
      this.trafficForm.vehicle = "." + arr[1] + "." + value + ".";
      this.trafficForm.vehicleChildName = obj.disvalue;
    },
    //其他费用费用类型 COST_TYPE_2为市内车费
    getCostTypeval(value) {
      var that = this;
      if (value == "COST_TYPE_2") {
        //获取其他费用 交通类型
        axios
          .post(
            option.base_path + "basicconfig/dictInfo/getDictInfoByTypeCode",
            {
              dictTypeCode: "TRAFFIC_TYPE",
            }
          )
          .then(function (res) {
            that.otherBusTypeList = res.data.data;
          });
        this.otherBusType = true;
      } else {
        this.otherBusType = false;
        this.otherForm.trafficType = "";
        this.otherForm.trafficTypeName = "";
      }
      var obj = {};
      obj = that.costTypeList.find(function (item) {
        return item.value === value;
      });
      that.otherForm.costType = obj.value;
      that.otherForm.costTypeName = obj.disvalue;
    },
    //计算城市间交通费列表总和
    getTrafficCostSum(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        }
      });
      sums[1] = undefined;
      sums[2] = undefined;
      sums[3] = undefined;
      sums[4] = undefined;
      sums[5] = undefined;
      sums[6] = (
        Number(sums[6]) +
        Number(sums[7]) +
        Number(sums[8]) +
        Number(sums[9])
      )
        .toFixed(2)
        .replace(/\d(?=(?:\d{3})+\b)/g, "$&,");
      sums[7] = undefined;
      sums[8] = undefined;
      sums[9] = undefined;
      return sums;
    },
    //计算住宿费列表总和
    getHotelCostSum(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (index == 7) {
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }
          }, 0);
        }
      });
      sums[7] = Number(sums[7])
        .toFixed(2)
        .replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
      return sums;
    },
    //计算其他费用列表总和
    getOtherCostSum(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (index == 2) {
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }
          }, 0);
        }
      });
      sums[2] = Number(sums[2])
        .toFixed(2)
        .replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
      return sums;
    },
    //获取行程明细出发地点
    getGoAddresVal(val) {
      // 传进来的val是select组件选中的value值
      var obj = {};

      obj = this.hotCityList.find(function (item) {
        return item.regionCode === val;
      });
      this.tripForm.goAddress = val;
      this.tripForm.startingPoint = obj.regionName + "/" + obj.regionMergerName;
      this.initHotCityList();
    },
    //初始化热门城市
    initHotCityList() {
      var that = this;
      axios
        .get(option.websit_ip + "json/hotCityList.json")
        .then(function (res) {
          that.hotCityList = res.data;
        });
    },
    //获取行程明细出差地点
    getBusAddresVal(val) {
      // 传进来的val是select组件选中的value值
      var obj = {};
      obj = this.hotCityList.find(function (item) {
        return item.regionCode === val;
      });
      this.tripForm.travelAddress = val;
      this.tripForm.travelAddressName =
        obj.regionName + "/" + obj.regionMergerName;
      this.initHotCityList();
    },
    //获取费用明细 其他费用交通类型
    getTrafficTypeval(value) {
      // 传进来的val是select组件选中的value值
      var obj = {};
      obj = this.otherBusTypeList.find(function (item) {
        return item.value === value;
      });
      this.otherForm.trafficType = obj.value;
      this.otherForm.trafficTypeName = obj.disvalue;
      this.initHotCityList();
    },
    //获取费用明细 城市间交通费用出发地点
    getStartAddress(value) {
      // 传进来的val是select组件选中的value值
      var obj = {};
      obj = this.hotCityList.find(function (item) {
        return item.regionCode === value;
      });
      this.trafficForm.goAddress = value;
      this.trafficForm.goAddressName =
        obj.regionName + "/" + obj.regionMergerName;
      this.initHotCityList();
    },
    //获取费用明细 城市间交通费用到达地点
    getEndAddress(value) {
      // 传进来的val是select组件选中的value值
      var obj = {};
      obj = this.hotCityList.find(function (item) {
        return item.regionCode === value;
      });
      this.trafficForm.arrivalAddress = value;
      this.trafficForm.arrivalAddressName =
        obj.regionName + "/" + obj.regionMergerName;
      this.initHotCityList();
    },
    //获取交通费出差人信息
    getPersonnelinfo(value) {
      // 传进来的val是select组件选中的value值
      var obj = {};
      obj = this.busPeopleInfo.find(function (item) {
        return item.userName === value;
      });
      this.trafficForm.jobName = obj.jobName;
      this.trafficForm.travelPersonnel = obj.userItcode;
      this.initHotCityList();
    },
    //获取住宿费出差人信息
    getHPersonnelinfo(value) {
      // 传进来的val是select组件选中的value值
      var obj = {};
      obj = this.busPeopleInfo.find(function (item) {
        return item.userName === value;
      });
      this.hotelForm.travelPersonnelName = obj.userName;
      this.hotelForm.travelPersonnelsJobName = obj.jobName;
      this.hotelForm.travelPersonnel = obj.userItcode;
      this.initHotCityList();
    },
    //获取住宿费住宿地点信息
    getHotelAddressName(value) {
      // 传进来的val是select组件选中的value值
      var obj = {};
      obj = this.hotCityList.find(function (item) {
        return item.regionCode === value;
      });
      this.hotelForm.hotelAddress = value;
      this.hotelForm.hotelAddressName =
        obj.regionName + "/" + obj.regionMergerName;
      this.initHotCityList();
    },
    //获取住宿费性别
    getGender(value) {
      this.hotelForm.gender = value;
    },
  },
};
</script>

<style>
.travel-div {
  background-color: #ffffff;
}
.top-tip {
  margin-left: 0px;
}
.assTripBtn,
.addCostBtn {
  margin-left: 20px;
}
.count-box {
  padding: 10px 10px;
  margin-left: 20px;
}
.count-title {
  color: #003465;
  font-weight: bold;
  font-size: 15px;
}
.form-label {
  position: relative;
  width: 49%;
  display: inline-block;
}
.cost-list-title {
  padding-left: 20px;
  font-size: 16px;
  height: 50px;
  /* line-height: 35px; */
  border-left: 0;
  border-right: 0;
  padding-top: 20px;
}
.cost-list-label {
  font-weight: bold;
  color: #111111;
}
.costDialog .el-dialog__body {
  padding: 0px;
}
.costDialog .el-form {
  padding: 20px;
}
</style>
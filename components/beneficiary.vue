<template>
  <div class="beneficiary-div">
    <!-- 一级标题 -->
    <topTip>
      <template>
        <el-col :span="8" style="text-align: left;" class="top-tip">
          <span style="color: #417095;font-size: 16px;font-weight: bolder;">付款信息</span>
        </el-col>
      </template>
    </topTip>
    <!-- 二级标题 -->
    <secondLevel v-if="lookType === '1' || gatheringUnitListLenght > 0 || gatheringPersonListLength > 0 || gatheringOtherListLenght > 0">
      <template v-slot:textTitle>收款方信息</template>
      <template v-slot:buttonTitle>
        <el-button type="primary" @click="dialogFormVisible = true; addType = 0; tableType=1; disabledTabs = false;" style="margin-left: 20px" v-if="lookType === '1'">新增</el-button>
      </template>
    </secondLevel>

    <!-- 收款方为单位 -->
    <label class="cost-list-label" v-if="lookType === '1' || gatheringUnitListLenght > 0">收款方为单位</label>
    <el-table :data="payReceivablesData.gatheringUnitList" border show-summary style="width: 100%; margin-bottom: 20px;" :summary-method="getSummaries"
      v-if="lookType === '1' || gatheringUnitListLenght > 0">
      <el-table-column prop="unitName" label="单位名称" width="180" align="center"></el-table-column>
      <el-table-column prop="totalAmountOfReceivables" label="应收款总金额（元）" align="right">
        <template scope="scope">
          <span>{{scope.row.totalAmountOfReceivables | moneyFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="reverseTheWay" label="冲销方式" align="center">
        <template scope="scope">
          <span v-if="scope.row.reverseTheWay == 'LOAN_REVERSE'">借款单冲销</span>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column prop="reverseTheAmountOfTheLoan" label="冲销借款金额（元）" align="right">
        <template scope="scope">
          <span>{{scope.row.reverseTheAmountOfTheLoan | moneyFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="replenishmentAmountAfterReversal" label="冲销后补领金额（元）" align="right">
        <template scope="scope">
          <span>{{scope.row.replenishmentAmountAfterReversal | moneyFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cashOfCollectionMethod" label="收款方式：现金（元）" width="180" align="right">
        <template scope="scope">
          <span>{{scope.row.cashOfCollectionMethod | moneyFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="transferOfCollectionMethod" label="收款方式：转账（元）" align="right">
        <template scope="scope">
          <span>{{scope.row.transferOfCollectionMethod | moneyFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column prop label="账户信息" align="center">
        <template scope="scope">
          <el-button type="text" size="small" style="padding:0px" @click="detailsAlert(scope.$index,'gatheringUnitList')">详情</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="remarks" label="特殊说明" align="center">
        <template scope="scope">
          <span v-if="scope.row.remarks == ''">无</span>
          <span v-else>{{scope.row.remarks}}</span>
        </template>
      </el-table-column>
      <el-table-column prop label="操作" align="center" v-if="lookType === '1'">
        <template scope="scope">
          <el-button type="text" size="small" style="padding:0px" @click="updateTr(scope.$index,'gatheringUnitList')">编辑</el-button>
          <el-button type="text" size="small" style="padding:0px" @click="removeTr(scope.$index,'gatheringUnitList')">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 收款方为个人 -->
    <label class="cost-list-label" v-if="lookType === '1' || gatheringPersonListLength > 0">收款方为个人</label>
    <el-table :data="payReceivablesData.gatheringPersonList" border show-summary style="width: 100%; margin-bottom: 20px;" :summary-method="getSummaries"
      v-if="lookType === '1' || gatheringPersonListLength > 0">
      <el-table-column prop="personalName" label="收款人姓名" width="180" align="center"></el-table-column>
      <el-table-column prop="amount" label="个人应收款总金额（元）" align="right">
        <template scope="scope">
          <span>{{scope.row.amount | moneyFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="reverseTheWay" label="冲销方式" align="center">
        <template scope="scope">
          <span v-if="scope.row.reverseTheWay == 'LOAN_REVERSE'">借款单冲销</span>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column prop="writeOffAmount" label="冲销借款金额（元）" align="right">
        <template scope="scope">
          <span>{{scope.row.writeOffAmount | moneyFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="replaceAmount" label="个人冲销后补领金额（元）" align="right">
        <template scope="scope">
          <span>{{scope.row.replaceAmount | moneyFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cash" label="收款方式：现金（元）" width="180" align="right">
        <template scope="scope">
          <span>{{scope.row.cash | moneyFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="transfer" label="收款方式：转账（元）" align="right">
        <template scope="scope">
          <span>{{scope.row.transfer | moneyFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column prop label="账户信息" align="center">
        <template scope="scope">
          <el-button type="text" size="small" style="padding:0px" @click="detailsAlert(scope.$index,'gatheringPersonList')">详情</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="remarks" label="特殊说明" align="center">
        <template scope="scope">
          <span v-if="scope.row.remarks">{{scope.row.remarks}}</span>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column prop label="操作" align="center" v-if="lookType === '1'">
        <template scope="scope">
          <el-button type="text" size="small" style="padding:0px" @click="updateTr(scope.$index,'gatheringPersonList')">编辑</el-button>
          <el-button type="text" size="small" style="padding:0px" @click="removeTr(scope.$index,'gatheringPersonList')">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 收款方为其他 -->
    <label class="cost-list-label" v-if="lookType === '1' || gatheringOtherListLenght > 0">收款方为其他</label>
    <el-table :data="payReceivablesData.gatheringOtherList" border show-summary style="width: 100%; margin-bottom: 20px;" :summary-method="getSummaries"
      v-if="lookType === '1' || gatheringOtherListLenght > 0">
      <el-table-column prop="otherName" label="其他付款" width="180" align="center"></el-table-column>
      <el-table-column prop="amount" label="金额（元）" align="right">
        <template scope="scope">
          <span>{{scope.row.amount | moneyFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remarks" label="特殊说明" align="center"></el-table-column>
      <el-table-column prop label="操作" align="center" v-if="lookType === '1'">
        <template scope="scope">
          <el-button type="text" size="small" style="padding:0px" @click="updateTr(scope.$index,'gatheringOtherList')">编辑</el-button>
          <el-button type="text" size="small" style="padding:0px" @click="removeTr(scope.$index,'gatheringOtherList')">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗内容 -->
    <el-dialog title="收款方信息" :visible.sync="dialogFormVisible" :close-on-click-modal="false" @closed="resetForm(activeName)">
      <!-- @tab-click="handleClick" -->
      <el-tabs v-model="activeName" type="card" @tab-click="tabClick(activeName)">
        <el-tab-pane label="对单位" name="formUnit" :disabled="disabledTabs">
          <el-form :model="formUnit" :rules="rulesUnit" ref="formUnit">
            <el-form-item label="单位全称：" :label-width="formLabelWidth" prop="unitName">
              <el-input v-model="formUnit.unitName" autocomplete="off" placeholder="请输入" v-if="tableType == 1"></el-input>
              <span v-else>{{formUnit.unitName}}</span>
            </el-form-item>
            <el-form-item label="应收款总金额：" :label-width="formLabelWidth" prop="totalAmountOfReceivables">
              <!-- <money
                v-if="lookType === '1'"
                style="width:100% ;"
                :moneys="form.totalAmountOfReceivables"
                :type="1"
                @blurMoney="blurMoney"
                :tail="'元'"
              ></money>-->
              <finmoneyinput v-model="formUnit.totalAmountOfReceivables" :tail="'元'" @blur="computeTotleUnit" v-if="tableType == 1"></finmoneyinput>
              <span v-else>{{formUnit.totalAmountOfReceivables | moneyFormat}}</span>
            </el-form-item>
            <el-row>
              <el-col :span="11">
                <el-form-item label="冲销方式：" :label-width="formLabelWidth">
                  <el-select v-model="formUnit.reverseTheWay" placeholder="请选择" v-if="tableType == 1">
                    <el-option v-for="item in reverseList" :key="item.val" :label="item.name" :value="item.val"></el-option>
                  </el-select>
                  <span v-else>{{formUnit.reverseTheWay=='LOAN_REVERSE'?"借款单冲销":"--"}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="11" v-if="formUnit.reverseTheWay == 'LOAN_REVERSE'">
                <el-form-item label="选择借款单：" :label-width="formLabelWidth">
                  <el-select v-model="formUnit.loanAppNum" placeholder="请选择" @change="setLoanSelectUnit" v-if="tableType == 1">
                    <el-option v-for="item in loanList" :key="item.loanAppId" :label="item.loanAppNum" :value="item.loanAppNum"></el-option>
                  </el-select>
                  <span v-else>{{formUnit.loanAppNum}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="formUnit.reverseTheWay == 'LOAN_REVERSE'">
              <el-col :span="11">
                <el-form-item label="借款单欠款金额：" :label-width="formLabelWidth">
                  <span>{{arrearsMoneyUnit | moneyFormat}}元</span>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="冲销借款金额：" :label-width="formLabelWidth">
                  <span>{{formUnit.reverseTheAmountOfTheLoan | moneyFormat}}元</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="冲销后补领金额：" :label-width="formLabelWidth">
              <span style="color: #003465;font-weight: bold;">{{formUnit.replenishmentAmountAfterReversal | moneyFormat}}元</span>
            </el-form-item>
            <!-- 二级标题 -->
            <secondLevel>
              <template v-slot:textTitle>收款方式</template>
            </secondLevel>
            <el-row>
              <el-col :span="11">
                <el-form-item label="现金：" :label-width="formLabelWidth">
                  <!-- <money
                    v-if="lookType === '1'"
                    style="width:100% ;"
                    :moneys="form.cashOfCollectionMethod"
                    :type="2"
                    @blurMoney="blurMoney"
                    :tail="'元'"
                  ></money>-->
                  <finmoneyinput v-model="formUnit.cashOfCollectionMethod" :tail="'元'" v-if="tableType == 1"></finmoneyinput>
                  <span v-else>{{formUnit.cashOfCollectionMethod | moneyFormat}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="转账：" :label-width="formLabelWidth">
                  <!-- <money
                    v-if="lookType === '1'"
                    style="width:100% ;"
                    :moneys="form.transferOfCollectionMethod"
                    :type="3"
                    @blurMoney="blurMoney"
                    :tail="'元'"
                  ></money>-->
                  <finmoneyinput v-model="formUnit.transferOfCollectionMethod" :tail="'元'" v-if="tableType == 1"></finmoneyinput>
                  <span v-else>{{formUnit.transferOfCollectionMethod | moneyFormat}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 二级标题 -->
            <secondLevel>
              <template v-slot:textTitle>账户信息</template>
            </secondLevel>
            <el-row>
              <el-col :span="11">
                <el-form-item label="开户银行：" :label-width="formLabelWidth">
                  <el-input v-model="formUnit.openBank" autocomplete="true" placeholder="请输入" v-if="tableType == 1"></el-input>
                  <span v-else>{{formUnit.openBank || "--"}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="账号：" :label-width="formLabelWidth">
                  <el-input onkeyup="value=value.replace(/[^\d.]/g,'')" v-model="formUnit.accounts" autocomplete="true" placeholder="请输入" v-if="tableType == 1"></el-input>
                  <span v-else>{{formUnit.accounts || "--"}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="特殊说明：" :label-width="formLabelWidth">
              <el-input v-model="formUnit.remarks" type="textarea" autocomplete="off" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入" resize="none" v-if="tableType == 1"></el-input>
              <span v-else>{{formUnit.remarks || "--"}}</span>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="对个人" name="formPersonal" :disabled="disabledTabs">
          <el-form :model="formPersonal" ref="formPersonal" :rules="rulesPersonal">
            <el-row>
              <el-col :span="8">
                <el-form-item label="收款人姓名：" :label-width="formLabelWidth" prop="personalCode">
                  <el-select v-model="personCodeNew" filterable placeholder="请选择" @change="setSelectData" v-if="tableType == 1">
                    <el-option v-for="item in jpManList" :key="item.userItcode" :label="item.value" :value="item"></el-option>
                  </el-select>
                  <span v-else>{{formPersonal.personalName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="2" v-if="!formPersonal.personalCode">
                <el-form-item label>
                  <!-- <el-radio v-model="formPersonal.radio" label="1">收款人为本人</el-radio> -->
                  <el-checkbox v-model="radioPersonal" @change="selectPayee()" v-if="tableType == 1">收款人为本人</el-checkbox>
                </el-form-item>
              </el-col>
              <el-col :span="7" v-if="formPersonal.personalCode">
                <el-form-item label="部门：" :label-width="formLabelWidth">
                  <span>{{formPersonal.personalDept || "--"}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="7" v-if="formPersonal.personalCode">
                <el-form-item label="职务：" :label-width="formLabelWidth">
                  <span>{{formPersonal.personalJobName || "--"}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="个人应收款总金额：" label-width="160px" prop="amount">
              <finmoneyinput v-model="formPersonal.amount" :tail="'元'" @blur="computeTotlePersonal()" v-if="tableType == 1"></finmoneyinput>
              <span v-else>{{formPersonal.amount | moneyFormat}}</span>
            </el-form-item>
            <el-row>
              <el-col :span="11">
                <el-form-item label="冲销方式：" :label-width="formLabelWidth">
                  <el-select v-model="formPersonal.reverseTheWay" placeholder="请选择" v-if="tableType == 1">
                    <el-option v-for="item in reverseList" :key="item.val" :label="item.name" :value="item.val"></el-option>
                  </el-select>
                  <span v-else>{{formPersonal.reverseTheWay=="LOAN_REVERSE"?"借款单冲销":"--"}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="11" v-if="formPersonal.reverseTheWay == 'LOAN_REVERSE'">
                <el-form-item label="选择借款单：" :label-width="formLabelWidth">
                  <el-select v-model="loanInvoice" placeholder="请选择" @change="setLoanSelectPersonal" v-if="tableType == 1">
                    <el-option v-for="item in loanList" :key="item.loanAppNum" :label="item.loanAppNum" :value="item.loanAppNum"></el-option>
                  </el-select>
                  <span v-else>{{loanInvoice}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="formPersonal.reverseTheWay == 'LOAN_REVERSE'">
              <el-col :span="11">
                <el-form-item label="借款单欠款金额：" :label-width="formLabelWidth">
                  <span>{{arrearsMoneyPersonal | moneyFormat}}元</span>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="本次冲销金额：" :label-width="formLabelWidth">
                  <span>{{formPersonal.writeOffAmount | moneyFormat}}元</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="个人冲销后补领总金额：" label-width="160px">
              <span style="color: #003465;font-weight: bold;">{{formPersonal.replaceAmount | moneyFormat}}元</span>
            </el-form-item>
            <!-- 二级标题 -->
            <secondLevel>
              <template v-slot:textTitle>收款方式</template>
            </secondLevel>
            <el-row>
              <el-col :span="11">
                <el-form-item label="现金：" :label-width="formLabelWidth">
                  <!-- <money
                    v-if="lookType === '1'"
                    style="width:100% ;"
                    :moneys="form.cashOfCollectionMethod"
                    :type="2"
                    @blurMoney="blurMoney"
                    :tail="'元'"
                  ></money>-->
                  <finmoneyinput v-model="formPersonal.cash" :tail="'元'" v-if="tableType == 1"></finmoneyinput>
                  <span v-else>{{formPersonal.cash | moneyFormat}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="转账：" :label-width="formLabelWidth">
                  <!-- <money
                    v-if="lookType === '1'"
                    style="width:100% ;"
                    :moneys="form.transferOfCollectionMethod"
                    :type="3"
                    @blurMoney="blurMoney"
                    :tail="'元'"
                  ></money>-->
                  <finmoneyinput v-model="formPersonal.transfer" :tail="'元'" v-if="tableType == 1"></finmoneyinput>
                  <span v-else>{{formPersonal.transfer | moneyFormat}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 二级标题 -->
            <secondLevel>
              <template v-slot:textTitle>账户信息</template>
            </secondLevel>
            <el-row>
              <el-col :span="11">
                <el-form-item label="开户银行名称：" :label-width="formLabelWidth">
                  <el-input v-model="formPersonal.openBank" autocomplete="true" placeholder="请输入" v-if="tableType == 1"></el-input>
                  <span v-else>{{formPersonal.openBank || "--"}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="银行卡号：" :label-width="formLabelWidth">
                  <el-input onkeyup="value=value.replace(/[^\d.]/g,'')" v-model="formPersonal.accounts" autocomplete="true" placeholder="请输入" v-if="tableType == 1"></el-input>
                  <div v-else>
                    <span>{{formPersonal.accounts || "--"}}</span>
                    <button v-if="showPersonBtn" @click="showAccounts" type="button" class="el-button el-button--primary" style="margin-left:5px"><span>显示</span></button>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="特殊说明：" :label-width="formLabelWidth">
              <el-input v-model="formPersonal.remarks" type="textarea" autocomplete="off" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入" resize="none" v-if="tableType == 1"></el-input>
              <span v-else>{{formPersonal.remarks || "--"}}</span>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="对其他" name="formOther" :disabled="disabledTabs">
          <el-form :model="formOther" ref="formOther" :rules="rulesOther">
            <el-form-item label="其他付款：" :label-width="formLabelWidth" prop="otherName">
              <el-input v-model="formOther.otherName" autocomplete="off" placeholder="请输入" v-if="tableType == 1"></el-input>
              <span v-else>{{formOther.otherName}}</span>
            </el-form-item>
            <el-form-item label="金额：" :label-width="formLabelWidth">
              <finmoneyinput v-model="formOther.amount" :tail="'元'" v-if="tableType == 1"></finmoneyinput>
              <span v-else>{{formOther.amount | moneyFormat}}</span>
            </el-form-item>
            <el-form-item label="特殊说明：" :label-width="formLabelWidth">
              <el-input v-model="formOther.remarks" type="textarea" autocomplete="off" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入" resize="none" v-if="tableType == 1"></el-input>
              <span v-else>{{formOther.amount || "--"}}</span>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm(activeName)" v-if="tableType == 1">保存</el-button>
        <el-button @click="dialogFormVisible = false,resetForm(activeName)">关闭</el-button>
      </div>
    </el-dialog>
  </div>

  <!-- <div class="look-fils">
    <el-input placeholder="请输入" v-model="newMoneys" @focus="focusMoney"  @blur="blurMoney"></el-input>
  </div>-->
</template>

<style>
.beneficiary-div .cost-list-label {
  font-weight: bold;
  color: #111111;
  font-size: 16px;
  padding-left: 20px;
}

.beneficiary-div .el-dialog__body {
  padding: 0px 20px 0px 0px;
}

.beneficiary-div .dialog-footer {
  text-align: center;
}
</style>
<script>
import topTip from "./topTip";
import secondLevel from "./secondLevel";
import axios from "../service/http";
import { option } from "../static/config";
import { cloneData } from "../static/commonTool";
// 金额组件
import money from "./money.vue";
import finmoneyinput from "./fin-money-input.vue";
export default {
  props: {
    moneys: {
      type: String,
      default() {
        return "";
      },
    },
    // 判断是新增还是查看（1：新增；2：查看）默认新增
    lookType: {
      type: String,
      default() {
        return "1";
      },
    },
  },
  data() {
    //校验应收款总金额不为0
    var checkMoney = (rule, value, callback) => {
      if (value == 0) {
        return callback(new Error("请输入金额"));
      } else {
        callback();
      }
    };
    return {
      gatheringPersonListLength: 0,
      gatheringUnitListLenght: 0,
      gatheringOtherListLenght: 0,
      newMoneys: this.moneys,
      formUnit: {
        unitName: "", //unitName 单位名称
        totalAmountOfReceivables: 0, //应收款总金额
        openBank: "", //openBank 开户银行
        accounts: "", //accounts 账户 银行卡号
        reverseTheWay: "", //reverseMethod	冲销方式
        loanAppId: "", //借款单ID
        loanAppNum: "", //借款单号
        reverseTheAmountOfTheLoan: 0, //冲销借款金额
        replenishmentAmountAfterReversal: 0, //冲销后补领金额
        cashOfCollectionMethod: 0, //收款方式：现金
        transferOfCollectionMethod: 0, //收款方式：转账
        //					isContract: tr.attr('contractradio'), //isContract 是否有合同协议(1 是, 2 否)
        //reverseTheWayName: tr.find('td').eq(1).text(), //reverseTheWayName	冲销方式名称
        remarks: "", //remarks 特殊说明
      },
      formOther: {
        otherName: "", //otherName 其他付款名称
        amount: 0, //amount 金额
        //					isContract: tr.attr('otherradio'), //isContract 是否有合同协议(1 是, 2 否)
        //					reverseTheWay: tr.attr('witeoffother'), //reverseTheWay 收款方式
        remarks: "", //remarks 特殊说明
      },
      jpManList: [],
      reverseList: [
        {
          name: "无",
          val: "",
        },
        {
          name: "借款单冲销",
          val: "LOAN_REVERSE",
        },
      ],
      loanInvoice: [],
      radioPersonal: false,
     
      // jobname: "",
      showPersonBtn: false, //判断对个人显示卡号按钮
      formPersonal: {
         personalDept: "",
         personalJobName:"",
        personalType: 2, //personalType 人员类型(1 外部 2 内部)
        personalCode: "", //personalCode 人员code
        personalName: "", //personalName 人员名称
        idCard: "", //idCard 身份证号
        phoneNum: "", //phoneNum 手机号
        openBank: "", //openBank 开户银行
        accounts: "", //accounts 银行卡号
        writeOffAmount: 0, //冲销金额
        offOpenBank: "", //offOpenBank 公务卡 - 开户银行
        offAccounts: "", //offAccounts 公务卡 - 银行卡号
        amount: 0, //amount 个人应收款总金额
        loanAppId: "", //loanAppId 借款单Id
        replaceAmount: 0, //replaceAmount 补领金额
        cash: 0, //cash 收款方式 - 现金
        officialCard: "", //officialCard 收款方式 - 公务卡
        transfer: 0, //transfer 收款方式 - 转账
        isContract: 2, //isContract 是否有合同协议(1 是, 2 否)
        reverseTheWay: "", //reverseTheWay 冲销方式
        remarks: "", //remarks 特殊说明
      },
      arrearsMoneyUnit: 0,
      arrearsMoneyPersonal: 0,
      activeName: "formUnit",
      formLabelWidth: "120px",
      dialogFormVisible: false,
      rulesUnit: {
        unitName: {
          required: true,
          message: "请输入单位全称",
          trigger: "blur",
        },
        totalAmountOfReceivables: [
          {
            required: true,
            message: "请输入金额",
            trigger: "blur",
            validator: checkMoney,
          },
          {
            type: "number",
            message: "输入内容必须是数字",
            trigger: "blur",
          },
        ],
      },
      rulesOther: {
        otherName: {
          required: true,
          message: "请输入其他付款",
          trigger: "blur",
        },
      },
      rulesPersonal: {
        personalCode: [{ required: true, message: "请选择收款人姓名" }],
        amount: [
          {
            required: true,
            message: "请输入金额",
            trigger: "blur",
            validator: checkMoney,
          },
          {
            type: "number",
            message: "输入内容必须是数字",
            trigger: "blur",
          },
        ],
      },
      loanList: [],
      //修改时 行index
      tableIndex: "",
      //新增还是修改 0新增 1修改
      addType: 0,
      //当前登录人code
      loginUser: "",
      //点击的是新增修改还是详情
      tableType: "1",
      //三个表集合
      payReceivablesData: {
        //收款方数据
        gatheringUnitList: [], //对单位
        gatheringPersonList: [], //对个人
        gatheringOtherList: [], //对其他
      },
      //收款人显示值
      personCodeNew: "",
      //tabs是否禁用标识
      disabledTabs: false,
    };
  },
  watch: {
    payReceivablesData: {
      deep: true, //深度监听设置为 true
      handler(newVal, oldVal) {
        this.gatheringUnitListLenght = newVal.gatheringUnitList.length;
        this.gatheringPersonListLength = newVal.gatheringPersonList.length;
        this.gatheringOtherListLenght = newVal.gatheringOtherList.length;
        console.log("---------------------", newVal);
      },
    },
  },
  mounted() {
    //获取所有人
    this.getAllPeople();
    //获取借款单
    this.getLoanAppInfo();
    //当前登录人
    this.getUserInfo();
  },
  methods: {
    //显示个人银行卡号
    showAccounts() {
      var personAccount = this.payReceivablesData.gatheringPersonList[
        this.tableIndex
      ];
      this.formPersonal.accounts = personAccount.accounts;
    },
    //弹窗保存事件
    submitForm(formName) {
      let payReceivablesData = cloneData(this.payReceivablesData);
      // var moneyBool = true;
      // if (formName == "formUnit") {
      //   moneyBool = this.countUnit();
      // } else if (formName == "formPersonal") {
      //   moneyBool = this.countPerson();
      // }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var moneyBool = true;
          if (formName == "formUnit") {
            moneyBool = this.countUnit();
          } else if (formName == "formPersonal") {
            moneyBool = this.countPerson();
          }
          if (moneyBool) {
            //保存状态等于0 则为新增
            if (this.addType == 0) {
              //alert("submit!");
              switch (formName) {
                case "formUnit":
                  payReceivablesData.gatheringUnitList.push(this.formUnit);
                  break;
                case "formPersonal":
                  payReceivablesData.gatheringPersonList.push(
                    this.formPersonal
                  );
                  break;
                case "formOther":
                  payReceivablesData.gatheringOtherList.push(this.formOther);
                  break;

                default:
                  break;
              }
              //保存状态等于1 贼为修改
            } else if (this.addType == 1) {
              switch (formName) {
                case "formUnit":
                  payReceivablesData.gatheringUnitList[
                    this.tableIndex
                  ] = this.formUnit;
                  break;
                case "formPersonal":
                  payReceivablesData.gatheringPersonList[
                    this.tableIndex
                  ] = this.formPersonal;
                  break;
                case "formOther":
                  payReceivablesData.gatheringOtherList[
                    this.tableIndex
                  ] = this.formOther;
                  break;

                default:
                  break;
              }
            }
            this.payReceivablesData = payReceivablesData;
            this.dialogFormVisible = false;
            this.resetForm();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      console.log("现金" + this.formUnit.cashOfCollectionMethod);
      console.log("转账" + this.formUnit.transferOfCollectionMethod);
    },
    //重置表单
    resetForm(formName) {
      //this.$refs[formName].resetFields();
      this.formUnit = {};
      this.formPersonal = {
        personalCode: "",
      };
      this.formOther = {};
      this.arrearsMoneyPersonal = 0;
      //重置修改index
      this.tableIndex = "";
      //重置收款人
      this.personCodeNew = "";
      this.radioPersonal = false;
      //重置数字类型
      this.resetNum();
      this.$refs.formUnit.clearValidate();
      this.$refs.formPersonal.clearValidate();
      this.$refs.formOther.clearValidate();
    },
    // 获取所有人
    getAllPeople() {
      let map = {
        pageIndex: 1,
        pageNum: 99999,
      };
      axios
        .post(option.base_path + "user/userInfo/getAllUserInfoToPage", map)
        .then((data) => {
          //赋值全局变量数据
          let dataList = data.data.data.rows;
          let newList = [];
          dataList.forEach((n) => {
            if (n.userItcode !== "") {
              for (let key in n) {
                if (key === "userName") {
                  if (n["deptName"] && n["jobLevelName"]) {
                    n["value"] =
                      n[key] + "/" + n["deptName"] + "/" + n["jobLevelName"];
                  } else {
                    n["value"] = n[key];
                  }
                }
              }
              newList.push(n);
            }
          });
          this.jpManList = newList;
          console.log("2", this.jpManList);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    // 获取借款单
    getLoanAppInfo() {
      let map = {
        queryParams: "", //queryParams 查询条件(编号, 事由)
        userCode: this.formPersonal.userItcode, //userCode 人员code
        pageIndex: 1, //pageIndex 分页页数
        pageNum: 99999, //pageNum 分页条数
      };
      axios
        .post(
          option.base_path + "sz/loanApp/getLoanAppInfoListToPageByParams",
          map
        )
        .then((data) => {
          //赋值全局变量数据
          let dataList = data.data.data.rows;
          this.loanList = [];
          dataList.forEach((n) => {
            this.loanList.push(n);
          });
          console.log("借款单:", this.loanList);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    //选择人员后赋值
    setSelectData(obj) {
      this.formPersonal.personalDept = obj.deptName;
      this.formPersonal.personalJobName = obj.jobName;
      this.formPersonal.personalName = obj.userName;
      this.formPersonal.personalCode = obj.userItcode;
      this.getLoanAppInfo();
      console.log("名字" + this.formPersonal.personalName);
    },

    //切换tab方法
    tabClick(activeName) {
      this.resetForm(activeName);
      this.getLoanAppInfo();
    },
    //对单位计算欠款和冲销借款
    setLoanSelectUnit(value) {
      console.log(value);
      // //欠款
      // this.arrearsMoneyUnit = obj.arrearsAmount;
      // //冲销借款
      // this.formUnit.reverseTheAmountOfTheLoan =
      //   this.formUnit.totalAmountOfReceivables <= obj.arrearsAmount
      //     ? this.formUnit.totalAmountOfReceivables
      //     : obj.arrearsAmount;
      // //借款单id
      // this.formUnit.loanAppId = obj.loanAppId;
      // this.computeTotleUnit();

      //循环对比拿到金额和借款id
      this.loanList.forEach((v) => {
        if (v.loanAppNum == value) {
          //欠款
          this.arrearsMoneyUnit = v.arrearsAmount;
          //冲销借款
          this.formUnit.reverseTheAmountOfTheLoan =
            this.formUnit.totalAmountOfReceivables <= v.arrearsAmount
              ? this.formUnit.totalAmountOfReceivables
              : v.arrearsAmount;
          // //借款单id
          this.formUnit.loanAppId = v.loanAppId;
          this.computeTotleUnit();
        }
      });
    },
    //对个人计算欠款和冲销借款
    setLoanSelectPersonal(value) {
      //欠款
      // this.arrearsMoneyPersonal = obj.arrearsAmount;
      // //冲销借款
      // this.formPersonal.writeOffAmount =
      //   this.formPersonal.amount <= obj.arrearsAmount
      //     ? this.formPersonal.amount
      //     : obj.arrearsAmount;
      // //借款单id
      // this.formPersonal.loanAppId = obj.loanAppId;
      // this.computeTotlePersonal();
      this.loanList.forEach((v) => {
        if (v.loanAppNum == value) {
          //欠款
          this.arrearsMoneyPersonal = v.arrearsAmount;
          // //冲销借款
          this.formPersonal.writeOffAmount =
            this.formPersonal.amount <= v.arrearsAmount
              ? this.formPersonal.amount
              : v.arrearsAmount;
          // //借款单id
          this.formPersonal.loanAppId = v.loanAppId;
          this.computeTotlePersonal();
        }
      });
    },
    //赋值冲销后补领金额 单位
    computeTotleUnit() {
      //计算冲销部金额
      this.formUnit.replenishmentAmountAfterReversal =
        this.formUnit.totalAmountOfReceivables - this.arrearsMoneyUnit;
      //小于0显示0
      this.formUnit.replenishmentAmountAfterReversal =
        this.formUnit.replenishmentAmountAfterReversal < 0
          ? 0
          : this.formUnit.replenishmentAmountAfterReversal;
    },
    //赋值冲销后补领金额 个人
    computeTotlePersonal() {
      this.formPersonal.replaceAmount =
        this.formPersonal.amount - this.arrearsMoneyPersonal;
      this.formPersonal.replaceAmount =
        this.formPersonal.replaceAmount < 0
          ? 0
          : this.formPersonal.replaceAmount;
    },
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
    //金额格式化
    rmoney(s) {
      //转成string类型
      s = s + "";
      return parseFloat(s.replace(/[^\d\.-]/g, ""));
    },
    //计算合计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (index == 1) {
          if (!values.every((value) => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                // return prev + curr;
                return this.moneyFormat(this.rmoney(prev) + this.rmoney(curr));
              } else {
                return prev;
              }
            }, 0);
            // sums[index] += " 元";
          } else {
            sums[index] = "";
          }
        }
      });

      return sums;
    },
    //删除行方法
    removeTr(index, tableName) {
      this.$confirm(`确定删除吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      }).then(() => {
        //判断传参的名字
        switch (tableName) {
          //单位
          case "gatheringUnitList":
            this.payReceivablesData.gatheringUnitList.splice(index, 1);
            break;
          //个人
          case "gatheringPersonList":
            this.payReceivablesData.gatheringPersonList.splice(index, 1);
            break;
          //其他
          case "gatheringOtherList":
            this.payReceivablesData.gatheringOtherList.splice(index, 1);
            break;
          default:
            break;
        }
      });
    },
    updateTr(index, tableName) {
      //显示 弹窗
      this.dialogFormVisible = true;
      //赋值为修改状态
      this.addType = 1;
      //赋值修改行index
      this.tableIndex = index;
      //赋值弹窗查看状态
      this.tableType = 1;
      //赋值tabs禁用
      this.disabledTabs = true;
      //判断传参的名字
      switch (tableName) {
        //单位
        case "gatheringUnitList":
          this.formUnit = cloneData(
            this.payReceivablesData.gatheringUnitList[index]
          );
          this.activeName = "formUnit";
          console.log(
            "单位" + this.payReceivablesData.gatheringUnitList[index]
          );
          break;
        //个人
        case "gatheringPersonList":
          this.formPersonal = cloneData(
            this.payReceivablesData.gatheringPersonList[index]
          );
          this.personCodeNew=this.formPersonal.personalName
          console.log(
            "俺师傅说我" , this.formPersonal.personalName
          );
          console.log(
            "人员" + this.payReceivablesData.gatheringUnitList[index]
          );
          this.activeName = "formPersonal";
          break;
        //其他
        case "gatheringOtherList":
          this.formOther = cloneData(
            this.payReceivablesData.gatheringOtherList[index]
          );
          console.log(
            "其他" + this.payReceivablesData.gatheringUnitList[index]
          );
          this.activeName = "formOther";
          break;
        default:
          break;
      }
    },
    // 获取当前登录人
    getUserInfo() {
      axios.post(option.base_path + "index/getCurrentUserInfo").then((res) => {
        this.loginUser = res.data.data;
      });
    },
    //选择收款人
    selectPayee() {
      this.formPersonal.personalName = this.loginUser.realName;
      this.formPersonal.personalCode = this.loginUser.userName;
      this.personCodeNew =this.loginUser.realName;  
       this.formPersonal.personalDept = this.loginUser.deptName;
      this.formPersonal.personalJobName = this.loginUser.positionName;
    },
    //点击详情显示弹窗
    detailsAlert(index, tableName) {
      //显示 弹窗
      this.dialogFormVisible = true;
      //重置为新增状态
      this.addType = 1;
      //赋值修改行index
      this.tableIndex = index;
      //赋值弹窗查看状态
      this.tableType = 0;
      //赋值tabs禁用
      this.disabledTabs = true;
      //判断传参的名字
      switch (tableName) {
        //单位
        case "gatheringUnitList":
          this.formUnit = cloneData(
            this.payReceivablesData.gatheringUnitList[index]
          );
          this.activeName = "formUnit";
          console.log(
            "详情单位" + this.payReceivablesData.gatheringUnitList[index]
          );
          break;
        //个人
        case "gatheringPersonList":
          this.formPersonal = cloneData(
            this.payReceivablesData.gatheringPersonList[index]
          );
          console.log(
            "详情人员" + this.payReceivablesData.gatheringUnitList[index]
          );
          this.activeName = "formPersonal";
          //银行卡号显示*
          if (
            this.formPersonal.accounts &&
            this.formPersonal.accounts.length > 4
          ) {
            this.showPersonBtn = true;
            let accounts = "";
            let str = this.formPersonal.accounts.substring(
              this.formPersonal.accounts.length - 4,
              this.formPersonal.accounts.length
            );
            for (var i = 0; i < this.formPersonal.accounts.length - 4; i++) {
              accounts += "*";
            }
            accounts += str;
            this.formPersonal.accounts = accounts;
          } else {
            this.showPersonBtn = false;
          }

          break;
        //其他
        case "gatheringOtherList":
          this.formOther = cloneData(
            this.payReceivablesData.gatheringOtherList[index]
          );
          console.log(
            "详情其他" + this.payReceivablesData.gatheringUnitList[index]
          );
          this.activeName = "formOther";
          break;
        default:
          break;
      }
    },
    //重置数字和金额值
    resetNum(formName) {
      //单位
      this.formUnit.totalAmountOfReceivables = 0; //应收款总金额
      // (this.formUnit.unitName = ""), //单位名称
      this.formUnit.reverseTheAmountOfTheLoan = 0; //冲销借款金额
      this.formUnit.replenishmentAmountAfterReversal = 0; //冲销后补领金额
      this.formUnit.cashOfCollectionMethod = 0; //收款方式：现金
      this.formUnit.transferOfCollectionMethod = 0; //收款方式：转账
      //其他
      this.formOther.amount = 0; //amount 金额
      //个人
      this.formPersonal.personalType = 2; //personalType 人员类型(1 外部 2 内部)
      this.formPersonal.writeOffAmount = 0; //冲销金额
      this.formPersonal.amount = 0; //amount 个人应收款总金额
      this.formPersonal.replaceAmount = 0; //replaceAmount 补领金额
      this.formPersonal.cash = 0; //cash 收款方式 - 现金
      this.formPersonal.transfer = 0; //transfer 收款方式 - 转账
      this.formPersonal.isContract = 2; //isContract 是否有合同协议(1 是, 2 否)
    },
    //计算单位现金和转账必须等于应收款
    countUnit() {
      //父组件的支出总金额
      let fatherTotal = this.$parent.$parent.total;
      //应收款
      // let total = this.formUnit.totalAmountOfReceivables;
      //冲销后补领金额
      let total = this.formUnit.replenishmentAmountAfterReversal;
      //现金
      let cash = this.formUnit.cashOfCollectionMethod;
      //转账
      let tranfs = this.formUnit.transferOfCollectionMethod;
      if (total != cash + tranfs) {
        this.$message.warning("收款方式金额合计必须等于个人冲销后补领总金额");
        //重置现金
        // this.$set(this.formUnit, "cashOfCollectionMethod", 0);
        //重置转账
        // this.$set(this.formUnit, "transferOfCollectionMethod", 0);
        return false;
        console.log(this.formUnit.cashOfCollectionMethod);
      } else {
        if (total > fatherTotal) {
          this.$message.warning("应收款总金额不能大于支出总金额");
          return false;
        }
      }
      return true;
    },
    //计算个人现金和转账必须等于应收款
    countPerson() {
      //应收款
      let total = this.formPersonal.amount;
      //现金
      let cash = this.formPersonal.cash;
      //转账
      let tranfs = this.formPersonal.transfer;
      if (total != cash + tranfs) {
        this.$message.warning("收款方式金额合计必须等于应收款总金额");
        //重置现金
        this.$set(this.formPersonal, "cash", 0);
        //重置转账
        this.$set(this.formPersonal, "transfer", 0);
        return false;
      }
      return true;
    },
  },
  components: {
    topTip,
    secondLevel,
    money,
    finmoneyinput,
  },
  filters: {
    // 转换算法主函数
    numberToChinese(n) {
      if (n) {
        let fraction = ["角", "分"];
        let digit = [
          "零",
          "壹",
          "贰",
          "叁",
          "肆",
          "伍",
          "陆",
          "柒",
          "捌",
          "玖",
        ];
        let unit = [
          ["元", "万", "亿"],
          ["", "拾", "佰", "仟"],
        ];
        let head = n < 0 ? "欠" : "";
        n = Math.abs(n);
        let s = "";
        for (let i = 0; i < fraction.length; i++) {
          s += (
            digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]
          ).replace(/零./, "");
        }
        s = s || "整";
        n = Math.floor(n);
        for (let i = 0; i < unit[0].length && n > 0; i++) {
          let p = "";
          for (let j = 0; j < unit[1].length && n > 0; j++) {
            p = digit[n % 10] + unit[1][j] + p;
            n = Math.floor(n / 10);
          }
          s = p.replace(/(零.)*零$/, "").replace(/^$/, "零") + unit[0][i] + s;
        }
        return (
          head +
          s
            .replace(/(零.)*零元/, "元")
            .replace(/(零.)+/g, "零")
            .replace(/^整$/, "零元整")
        );
      } else {
      }
    },
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
};
</script>

<style scoped>
</style>

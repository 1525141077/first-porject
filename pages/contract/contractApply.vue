<template>
  <div class="yt-dome-container">
    <topTip>
      <template>
        <el-row>
          <el-col :span="15" class="top-tip" style="text-align: left;">
            <div>
              <span style="color: #417095;font-size: 16px;font-weight: bolder;">合同基本信息</span>
            </div>
          </el-col>
          <el-col :span="8" style="text-align: right;">
            <div>
              <label style="margin-right:20px">
                <span style="color:#003465;letter-spacing:4px">合同编号：</span>
                <span>{{contractForm.contractNum || "提交后自动生成"}}</span>
              </label>
            </div>
          </el-col>
        </el-row>
      </template>
    </topTip>
    <el-form
      ref="contractForm"
      :model="contractForm"
      label-position="right"
      label-width="110px"
      style="padding: 0px 20px;"
      :rules="rules"
    >
      <el-row>
        <el-col :span="11">
          <el-form-item
            label="合同文本："
            label-width="120px"
            :class="lookType != 0 ? required + 'blueText' : required"
          >
            <upload
              @upload="uploadText"
              @delFile="delFileBtnText"
              :fileList="contractForm.textAttList"
              :listType="'picture-card'"
              :fileTypeBool="3"
              :flieIcon="true"
              :disabled="lookType == 1"
              :addText="'点击这里上传文件<br>文件仅支持PDF格式'"
            ></upload>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item
            label="合同用印页："
            label-width="120px"
            :class="lookType != 0 ? required + 'blueText' : required"
          >
            <upload
              @upload="uploadPicture"
              @delFile="delFileBtnPicture"
              :fileList="contractForm.pageAttList"
              :listType="'picture-card'"
              :fileTypeBool="1"
              :disabled="lookType == 1"
              :addText="'点击这里上传文件<br>文件仅支持图片格式'"
            ></upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        label="合同名称："
        label-width="120px"
        prop="contractName"
        :class="lookType != 0 ? 'blueText' : ''"
      >
        <span v-if="lookType == 1">{{contractForm.contractName || "--"}}</span>
        <el-input v-model="contractForm.contractName" autocomplete="true" placeholder="请输入" v-else></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="11">
          <el-form-item label="合同类型：" label-width="120px" :class="lookType != 0 ? 'blueText' : ''">
            <span v-if="lookType == 1">{{contractTypeName}}</span>
            <el-select v-model="contractForm.contractType" placeholder="请选择" v-else>
              <el-option
                v-for="item in contractTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-tooltip
              class="item"
              effect="dark"
              content="更多合同类型，后续会在系统继续完善"
              placement="top"
              v-if="lookType != 1"
            >
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="合同状态：" label-width="120px" :class="lookType != 0 ? 'blueText' : ''">
            <span v-if="lookType == 1">{{contractStateName}}</span>
            <el-select v-model="contractForm.contractState" placeholder="请选择" v-else>
              <el-option
                v-for="item in contractStateList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-tooltip
              class="item"
              effect="dark"
              content="更多合同状态，后续会在系统继续完善"
              placement="top"
              v-if="lookType != 1"
            >
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        label="委托方：（甲方）"
        label-width="120px"
        prop="entrustingParty"
        :class="lookType != 0 ? 'blueText entrust-item' : 'entrust-item'"
      >
        <span slot="label">
          委托方：
          <br />（甲方）
        </span>
        <span v-if="lookType == 1">{{contractForm.entrustingParty}}</span>
        <el-input
          v-model="contractForm.entrustingParty"
          autocomplete="true"
          placeholder="请输入"
          v-else
        ></el-input>
      </el-form-item>
      <el-form-item
        label="受托方：（乙方）"
        label-width="120px"
        prop="commissionedParty"
        :class="lookType != 0 ? 'blueText entrust-item' : 'entrust-item'"
      >
        <span slot="label">
          受托方：
          <br />（乙方）
        </span>
        <span v-if="lookType == 1">{{contractForm.commissionedParty}}</span>
        <el-select
          v-model="contractForm.commissionedParty"
          placeholder="请选择"
          style="width:100%"
          filterable
          v-else
        >
          <el-option
            v-for="item in entrustingPartyBList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item
            label="是否有明确的合同金额："
            label-width="170px"
            :class="lookType != 0 ? 'blueText' : ''"
          >
            <span v-if="lookType == 1">{{contractForm.isContractAmount == 1 ? "是" : "否"}}</span>
            <el-radio-group v-model="contractForm.isContractAmount" @change="radioChange" v-else>
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col
          :span="8"
          v-if="contractForm.isContractAmount == '1'"
          :class="lookType != 0 ? 'blueText' : ''"
        >
          <el-form-item label="合同金额：" label-width="150px" prop="contractAmount">
            <span v-if="lookType == 1">{{contractForm.contractAmount | moneyFormat}} 元</span>
            <finmoneyinput v-model="contractForm.contractAmount" :tail="'元'" v-else></finmoneyinput>
          </el-form-item>
        </el-col>
        <el-col
          :span="8"
          v-if="contractForm.isContractAmount == '1'"
          :class="lookType != 0 ? 'blueText' : ''"
        >
          <el-form-item label="人民币：" label-width="120px">
            <span>{{contractForm.contractAmount | numberToChinese}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        label="合同费用收取说明："
        label-width="170px"
        prop="contractAmountExplain"
        v-if="contractForm.isContractAmount == '0'"
        :class="lookType != 0 ? 'blueText' : ''"
      >
        <span v-if="lookType == 1" v-html="contractForm.contractAmountExplain"></span>
        <!-- <el-input
          v-model="contractForm.contractAmountExplain"
          type="textarea"
          autocomplete="off"
          :autosize="{ minRows: 4, maxRows: 6}"
          placeholder="请输入"
          resize="none"
          v-else
        ></el-input>-->
        <quill-editor
          v-model="contractForm.contractAmountExplain"
          ref="myQuillEditor"
          style="height: 100px;"
          :options="editorOption"
          v-else
        >
          <!-- 自定义toolar -->
          <div id="toolbar" slot="toolbar" style="display:none">
            <!-- Add a bold button -->
            <button class="ql-bold" title="加粗">Bold</button>
            <button class="ql-italic" title="斜体">Italic</button>
            <button class="ql-underline" title="下划线">underline</button>
            <button class="ql-strike" title="删除线">strike</button>
            <button class="ql-blockquote" title="引用"></button>
            <button class="ql-code-block" title="代码"></button>
            <button class="ql-header" value="1" title="标题1"></button>
            <button class="ql-header" value="2" title="标题2"></button>
            <!--Add list -->
            <button class="ql-list" value="ordered" title="有序列表"></button>
            <button class="ql-list" value="bullet" title="无序列表"></button>
            <!-- Add font size dropdown -->
            <select class="ql-header" title="段落格式">
              <option selected>段落</option>
              <option value="1">标题1</option>
              <option value="2">标题2</option>
              <option value="3">标题3</option>
              <option value="4">标题4</option>
              <option value="5">标题5</option>
              <option value="6">标题6</option>
            </select>
            <select class="ql-size" title="字体大小">
              <option value="10px">10px</option>
              <option value="12px">12px</option>
              <option value="14px">14px</option>
              <option value="16px" selected>16px</option>
              <option value="18px">18px</option>
              <option value="20px">20px</option>
            </select>
            <select class="ql-font" title="字体">
              <option value="SimSun">宋体</option>
              <option value="SimHei">黑体</option>
              <option value="Microsoft-YaHei">微软雅黑</option>
              <option value="KaiTi">楷体</option>
              <option value="FangSong">仿宋</option>
              <option value="Arial">Arial</option>
            </select>
            <!-- Add subscript and superscript buttons -->
            <select class="ql-color" value="color" title="字体颜色"></select>
            <select class="ql-background" value="background" title="背景颜色"></select>
            <select class="ql-align" value="align" title="对齐"></select>
            <button class="ql-clean" title="还原"></button>
            <!-- You can also add your own -->
          </div>
        </quill-editor>
      </el-form-item>
    </el-form>
    <label class="cost-list-label">支付方式</label>
    <el-table border :data="contractForm.paymentList" style="width: 100%; margin-top: 20px;">
      <el-table-column type="index" label="序号" width="150" align="center"></el-table-column>
      <el-table-column prop="termsOfPayment" label="付款条件说明">
        <template scope="scope">
          <span v-if="lookType == 1">{{scope.row.termsOfPayment}}</span>
          <el-input v-model="scope.row.termsOfPayment" autocomplete="true" placeholder="请输入" v-else></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="预计付款日期" width="250" align="center">
        <template scope="scope">
          <span v-if="lookType == 1">{{scope.row.paymentDate}}</span>
          <el-date-picker
            v-model="scope.row.paymentDate"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            v-else
          ></el-date-picker>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="预计付款金额（元）" width="200" align="right">
        <template scope="scope">
          <span v-if="lookType == 1">{{scope.row.paymentAmount | moneyFormat}}</span>
          <finmoneyinput v-model="scope.row.paymentAmount" :tail="'元'" v-else></finmoneyinput>
        </template>
      </el-table-column>
      <el-table-column prop label="操作" width="80" align="center" v-if="lookType != 1">
        <template scope="scope">
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            @click="delTr(scope.$index, 'payWay')"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div
      style="width: 100%; border: 1px solid #DFE6F3; text-align: center;height:40px;line-height:40px;"
      v-if="lookType != 1"
    >
      <el-button icon="el-icon-plus" circle size="small" @click="addTr"></el-button>
    </div>
    <topTip>
      <template>
        <el-row>
          <el-col :span="15" class="top-tip" style="text-align: left;">
            <div>
              <span style="color: #417095;font-size: 16px;font-weight: bolder;">与此关联项目信息</span>
            </div>
          </el-col>
        </el-row>
      </template>
    </topTip>
    <el-form style="padding: 0px 20px 20px 20px;">
      <el-row>
        <el-col :span="11">
          <el-button type="primary" @click="showAlert" v-if="lookType != 1">新增</el-button>
        </el-col>
        <el-col :span="lookType != 1 ? 11 : 24" align="right">
          <span :style="lookType != 0 ? 'color: #475c6d;font-weight: bold;' : ''">金额合计（元）：</span>
          <span>{{total | moneyFormat}}</span>
        </el-col>
      </el-row>
    </el-form>
    <el-table border :data="contractForm.projectList" style="width: 100%">
      <el-table-column prop="projectNum" label="项目编号" align="center" width="150"></el-table-column>
      <el-table-column prop="projectName" label="项目名称"></el-table-column>
      <el-table-column prop="projectPersonName" label="项目经理" align="center" width="250"></el-table-column>
      <el-table-column prop="projectAmount" label="项目分配金额" width="200" align="right">
        <template scope="scope">
          <span v-if="lookType == 1">{{scope.row.projectAmount | moneyFormat}}</span>
          <finmoneyinput v-model="scope.row.projectAmount" :tail="'元'" @blur="objTotal" v-else></finmoneyinput>
        </template>
      </el-table-column>
      <el-table-column prop label="操作" align="center" width="80" v-if="lookType != 1">
        <template scope="scope">
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            @click="delTr(scope.$index, 'relatedObj')"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: center;padding:20px" v-if="lookType != 1">
      <button
        type="button"
        class="el-button yt-bottom-btn el-button--primary"
        @click="submitForm('contractForm')"
      >
        <span>保存</span>
      </button>
      <button
        type="button"
        class="el-button yt-bottom-btn el-button--default"
        @click="clearPage(1)"
      >
        <span>取消</span>
      </button>
    </div>
    <div style="text-align: center;padding:20px" v-else>
      <button
        type="button"
        class="el-button yt-bottom-btn el-button--default"
        @click="clearPage(2)"
      >
        <span>关闭</span>
      </button>
      <el-button class="yt-bottom-btn" type="info" style="margin-top: 30px;" @click="print">返回</el-button>
    </div>
    <!-- 弹窗开始 -->
    <el-dialog title="选择项目" :visible.sync="dialogTableVisible">
      <el-form style>
        <el-row>
          <el-col :span="18" align="right">
            <el-form-item label="关键字：" label-width="80px">
              <el-input
                v-model="objTable.queryParam"
                autocomplete="true"
                placeholder="请输入项目编号、项目名称或项目经理"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" align="right">
            <el-button type="primary" @click="getProjectInfoList()">查询</el-button>
            <el-button @click="objTable.queryParam = '', getProjectInfoList()">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        border
        :data="gridData"
        @selection-change="handleSelectionChange"
        ref="multipleTable"
        :row-key="getRowKeys"
      >
        <el-table-column type="selection" width="55" align="center" :reserve-selection="true"></el-table-column>
        <el-table-column property="projectNum" label="项目编号" width="150" align="center"></el-table-column>
        <el-table-column property="projectName" label="项目名称" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column property="projectPersonName" label="项目经理" align="center"></el-table-column>
      </el-table>
      <el-pagination
        background
        :current-page="currentPage"
        :page-sizes="[5, 15, 30, 50, 100, 200, 500]"
        :page-size="5"
        layout="total, prev, pager, next, sizes"
        :total="pageTotal"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addObjTable">确定</el-button>
        <el-button @click="canlceObjTable">取消</el-button>
      </div>
    </el-dialog>
    <!-- 弹窗结束 -->
    <log :pkId="pkId" :axiosUrl="axiosUrl"></log>
  </div>
</template>
<style>
.cost-list-label {
  font-weight: bold;
  color: #111111;
  font-size: 16px;
  padding-left: 20px;
}
.dialog-footer {
  text-align: center;
}
/* 图片上传附件去边框 */
.el-upload-list--picture .el-upload-list__item {
  border: none;
}

.ql-container.ql-snow {
  border: 1px solid #ccc !important;
}

.el-upload {
  text-align: center;
}

.el-upload-list__item-name {
  color: #475c6d;
  font-weight: bold;
}

.entrust-item .el-form-item__label,
.entrust-item .el-form-item__content {
  line-height: 1;
}

.blueText .el-form-item__label {
  color: #475c6d;
  font-weight: bold;
}
</style>
<script>
//一级标题
import topTip from "../../components/topTip";
//提交附件
import upload from "../../components/upload";
//查看附件
import lookFiles from "../../components/lookFiles";
//axios接口组件
import axios from "../../service/http";
//配置文件
import { option } from "../../static/config";
// 金额组件
import finmoneyinput from "../../components/fin-money-input";
// 日志组件
import log from "../../components/log.vue";
//copy组件
import { cloneData } from "../../static/commonTool";
//富文本编辑器相关
import { Quill, quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

//引入font.css
import "../../assets/css/font.css";

// 自定义字体大小
let Size = Quill.import("attributors/style/size");
Size.whitelist = ["10px", "12px", "14px", "16px", "18px", "20px"];
Quill.register(Size, true);

// 自定义字体类型
var fonts = [
  "SimSun",
  "SimHei",
  "Microsoft-YaHei",
  "KaiTi",
  "FangSong",
  "Arial",
  "Times-New-Roman",
  "sans-serif",
  "宋体",
  "黑体",
];
var Font = Quill.import("formats/font");
Font.whitelist = fonts;
Quill.register(Font, true);
export default {
  name: "FuncFormsEdit",
  data() {
    return {
      contractForm: {
        //合同文本附件
        textAttList: [],
        //textAttId 附件id
        //textAttName 附件名称
        //合同页附件:
        pageAttList: [],
        //pageAttId 附件id
        //pageAttName 附件名称
        contractName: "", //合同名称
        contractNum: "", //合同编号
        contractType: "1", // 合同类型 1收入合同 2 支出合同
        contractState: "1", // 合同状态 1 履行中 2 已完成
        entrustingParty: "", // 委托方(甲方)
        commissionedParty: "", // 委托方(乙方)
        isContractAmount: "1", //合同是否为固定金额 1.是 0.否
        contractAmount: 0, // 合同金额
        contractAmountExplain: "", // 非固定金额支付说明
        //支付方式:
        paymentList: [],
        //termsOfPayment 付款条件说明
        //paymentDate 预计付款日期
        //paymentAmount 预计付款金额
        //关联项目信息:
        projectList: [],
        //projectNum 项目编号
        //projectName 项目名称
        //projectPersonName 项目经理
        //projectAmount 项目分配金额
      },
      //大写
      chineseNum: "--",
      //合同类型
      contractTypeList: [
        {
          value: "1",
          label: "收入合同",
        },
        // {
        //   value: "2",
        //   label: "支出合同"
        // }
      ],
      //合同状态
      contractStateList: [
        {
          value: "1",
          label: "履行中",
        },
        {
          value: "2",
          label: "已完成",
        },
      ],
      //合同状态
      entrustingPartyBList: [
        {
          value: "天津倚天会计师事务所有限公司",
          label: "天津倚天会计师事务所有限公司",
        },
        {
          value: "天津中正和资产评估有限公司",
          label: "天津中正和资产评估有限公司",
        },
        {
          value: "天津倚天工程咨询有限公司",
          label: "天津倚天工程咨询有限公司",
        },
        {
          value: "天津倚天房地产土地评估有限公司",
          label: "天津倚天房地产土地评估有限公司",
        },
        {
          value: "天津倚天管理咨询有限公司",
          label: "天津倚天管理咨询有限公司",
        },
        {
          value: "天津倚天税务师事务所有限公司",
          label: "天津倚天税务师事务所有限公司",
        },
        {
          value: "中科倚天（北京）信息科技有限公司",
          label: "中科倚天（北京）信息科技有限公司",
        },
        {
          value: "中联倚天（北京）管理咨询有限责任公司",
          label: "中联倚天（北京）管理咨询有限责任公司",
        },
        {
          value: "天津倚天会计师事务所有限公司北京分所",
          label: "天津倚天会计师事务所有限公司北京分所",
        },
      ],
      //乙方
      //entrustingPartyBList: [],
      //序号
      indexMethod: 1,
      //合计
      total: 0,
      //弹窗显示
      dialogTableVisible: false,
      //弹窗表格
      gridData: [],
      //必填验证
      rules: {
        contractName: [
          { required: true, message: "请输入合同名称", trigger: "blur" },
        ],
        entrustingParty: [
          { required: true, message: "请输入委托方", trigger: "blur" },
        ],
        commissionedParty: [
          { required: true, message: "请输入选择受托方", trigger: "change" },
        ],
        contractAmount: [
          {
            required: true,
            message: "请输入合同金额",
            trigger: "blur",
          },
        ],
        contractAmountExplain: [
          {
            required: true,
            message: "请输入合同费用收取说明",
            trigger: "blur",
          },
        ],
      },
      //表格条数总计
      pageTotal: 0,
      //从第一页开始
      currentPage: 1,
      //弹窗表格已选择的行
      multipleSelection: [],
      //获取显示类型
      lookType: this.$route.query.lookType,
      //类型name
      contractTypeName: "",
      //状态name
      contractStateName: "",
      //获取查询id
      pkId: { contractId: this.$route.query.pkId },
      //日志接口地址
      axiosUrl: option.base_path + "contract/getContractLogInfoList",
      //关联项目分页参数
      objTable: {
        pageIndex: 1,
        pageNum: 5,
        queryParam: "",
      },
      //星号类
      required: "is-required",
      //符文编辑器相关
      editorOption: {
        placeholder: "请输入",
        theme: "snow", // or 'bubble'
        modules: {
          toolbar: {
            container: "#toolbar",
          },
        },
      },
      showBack: false,
    };
  },
  components: {
    topTip,
    upload,
    lookFiles,
    finmoneyinput,
    log,
    quillEditor,
  },
  mounted() {
    this.getProjectInfoList();
    //获取详情
    if (this.lookType == 1 || this.lookType == 2) {
      this.getContractByContractId();
    }
    if (this.$route.query.entrustingParty) {
      this.contractForm.projectList = this.$route.query.list;
      this.contractForm.entrustingParty = this.$route.query.entrustingParty;
    }
    console.log("路由", this.$route);
  },
  watch: {
    contractForm: {
      handler() {
        //金额变量
        let money = 0;
        this.contractForm.projectList.forEach((item) => {
          if (item.projectAmount) {
            money += Number(item.projectAmount);
          }
        });
        //赋值合计
        this.total = money;
        //判断如果合同是固定金额选择是，金额合计不等于合同金额时提示“付款金额应等于合同金额”
        if (
          this.contractForm.contractAmount != money &&
          this.contractForm.isContractAmount == 1
        ) {
          //this.$message("项目合计金额不能大于合同金额");
        }
        console.log(this.total);
      },
      deep: true,
    },
  },
  methods: {
    print() {
      if (this.$route.query.showBack) {
        this.$router.push({
          path: "/projectManagerOperating/projectManagerPage",
          // query: params
        });
      } else {
        //跳转列表页
        this.$router.push({ path: "./contractList" });
      }
      // this.$router.go(-1)
    },
    // 上传图片附件
    uploadText(file) {
      // var data = eval("(" + file + ")");
      this.contractForm.textAttList = this.forSetText(file);
    },
    // 删除文本附件
    delFileBtnText(fileList) {
      this.contractForm.textAttList = this.forSetText(fileList);
    },
    // 上传图片附件
    uploadPicture(file) {
      // var data = eval("(" + file + ")");
      this.contractForm.pageAttList = this.forSetPage(file);
    },
    // 删除图片附件
    delFileBtnPicture(fileList) {
      this.contractForm.pageAttList = this.forSetPage(fileList);
    },
    //文本循环设置
    forSetText(list) {
      let newList = [];
      list.forEach((n) => {
        newList.push({
          fileId: n.fileId,
          fileName: n.fileName,
          name: n.fileName,
          textAttMappingId: n.textAttMappingId || "",
        });
      });
      return newList;
    },
    //图片循环设置
    forSetPage(list) {
      let newList = [];
      list.forEach((n) => {
        newList.push({
          fileId: n.fileId,
          fileName: n.fileName,
          name: n.fileName,
          pageAttMappingId: n.pageAttMappingId || "",
        });
      });
      return newList;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file, this.pageAttList);
    },
    //单选事件
    radioChange() {
      if (this.contractForm.isContractAmount == "1") {
        this.rules.contractAmount = [
          {
            required: true,
            message: "请输入合同金额",
            trigger: "blur",
          },
        ];
      } else {
        this.rules.contractAmount = [
          {
            required: false,
            message: "请输入合同金额",
            trigger: "blur",
          },
        ];
        this.contractForm.contractAmount = 0;
      }
    },
    //添加一行
    addTr() {
      this.contractForm.paymentList.push({
        termsOfPayment: "",
        paymentDate: "",
        paymentAmount: 0,
      });
      console.log(this.contractForm.paymentList);
    },
    //删除一行
    delTr(index, tableName) {
      this.$confirm(`确定删除吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      }).then(() => {
        this.objTotal();
        //判断传参的名字
        switch (tableName) {
          //支付方式
          case "payWay":
            this.contractForm.paymentList.splice(index, 1);
            break;
          //关联项目
          case "relatedObj":
            this.contractForm.projectList.splice(index, 1);
            //反向赋值关联表
            //this.multipleSelection = this.contractForm.projectList;
            console.log("f阿发", this.multipleSelection);

            break;
          default:
            break;
        }
      });
    },
    //手动切换每页条数
    handleSizeChange(val) {
      this.objTable.pageNum = val;
      console.log(`每页 ${val} 条`);
      //刷新
      this.getProjectInfoList();
    },
    //手动切换页数
    handleCurrentChange(val) {
      this.objTable.pageIndex = val;
      console.log(`当前页: ${val}`);
      console.log("切换页码", this.multipleSelection);
      //刷新
      this.getProjectInfoList();
    },
    //支付方式表格输入框校验
    payTableValid() {
      //标识
      let valid = true;
      //固定验证付款条件说明
      this.contractForm.paymentList.forEach((n) => {
        if (n.termsOfPayment == "") {
          valid = false;
          this.$message.error("付款条件说明不能为空");
          return;
        }
      });
      //如果有明确金额判断支付方式金额合计必须等于合同金额
      //合计
      let total = 0;
      if (
        this.contractForm.isContractAmount == "1" &&
        this.contractForm.paymentList.length > 0
      ) {
        //固定验证付款条件说明
        this.contractForm.paymentList.forEach((n) => {
          total += n.paymentAmount;
        });
        if (this.contractForm.contractAmount != total) {
          valid = false;
          this.$message.error("付款金额应等于合同金额");
        }
      } else if (this.contractForm.paymentList.length == 0) {
        this.$message.error("请填写付款条件说明");
      }
      return valid;
    },

    //验证附件必填
    attListValid() {
      //标识
      let valid = true;
      //如果合同文本附件为空 提示并返回false
      if (this.contractForm.textAttList.length == 0) {
        valid = false;
        this.$message.error("请上传合同文本附件");
      } else if (this.contractForm.pageAttList.length == 0) {
        //如果合同页附件为空 提示并返回false
        valid = false;
        this.$message.error("请上传合同页附件");
      }
      return valid;
    },

    //提交
    submitForm(formName) {
      //支付方式表格输入框校验
      let tableVisible = this.payTableValid();
      //附件校验
      let attListValid = this.attListValid();
      //关联项目合计校验
      let subObjTotalValid = this.subObjTotal();
      //复制出一份form
      let conForm = cloneData(this.contractForm);
      //日期
      conForm.paymentList.forEach((item) => {
        if (item.paymentDate == "") {
          item.paymentDate = null;
        }
      });
      //转JSON
      conForm.textAttList = JSON.stringify(this.contractForm.textAttList);
      conForm.pageAttList = JSON.stringify(this.contractForm.pageAttList);
      conForm.paymentList = JSON.stringify(this.contractForm.paymentList);
      conForm.projectList = JSON.stringify(this.contractForm.projectList);
      //必填验证
      this.$refs[formName].validate((valid) => {
        if (valid && tableVisible && attListValid && subObjTotalValid) {
          axios
            .post(option.base_path + "contract/saveContract", conForm)
            .then((data) => {
              if (data.data.flag == 0) {
                this.$message({
                  message: "提交成功",
                  type: "success",
                });
                this.$router.push({ path: "./contractList" });
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      });
    },

    //退出页面
    clearPage(goType) {
      if (goType == 1) {
        this.$confirm(`合同信息尚未保存，确定离开？`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "error",
        }).then(() => {
          //跳转列表页
          this.$router.push({ path: "./contractList" });
        });
      } else {
        //跳转列表页
        this.$router.push({ path: "./contractList" });
      }
    },

    // 关联项目信息
    getProjectInfoList() {
      if (this.objTable.queryParam != "") {
        this.objTable.pageIndex = 1;
        this.objTable.pageNum = 5;
      }
      console.log(this.multipleSelection);
      axios
        .post(option.base_path + "contract/getProjectInfoList", this.objTable)
        .then((data) => {
          let datas = data.data.data.rows;
          this.gridData = datas;
          this.pageTotal = data.data.data.total;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    //选择的行
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    },

    //选择关联项目信息
    addObjTable() {
      this.multipleSelection.forEach((n) => {
        //赋值关联表
        this.contractForm.projectList.push(n);
      });
      //去重
      //工具数组
      let array = [];
      this.contractForm.projectList.forEach((n) => {
        //循环去重
        if (array.indexOf(n) === -1) {
          array.push(n);
        }
      });
      //赋值关联表
      this.contractForm.projectList = array;
      //关闭弹窗
      this.canlceObjTable();
    },

    //显示弹窗
    showAlert() {
      //显示
      this.dialogTableVisible = true;
      //清空选择项
      this.multipleSelection = [];
    },
    canlceObjTable() {
      this.$refs.multipleTable.clearSelection();
      this.dialogTableVisible = false;
    },
    //判断类型
    contractTypeBool() {
      if (this.contractForm.contractType == 1) {
        this.contractTypeName = "收入合同";
      } else if (this.contractForm.contractType == 2) {
        this.contractTypeName = "支出合同";
      } else {
        this.contractTypeName = "--";
      }
    },
    //判断状态
    contractStateBool() {
      if (this.contractForm.contractState == 1) {
        this.contractStateName = "履行中";
      } else if (this.contractForm.contractState == 2) {
        this.contractStateName = "已完成";
      } else {
        this.contractStateName = "--";
      }
    },

    // 关联项目信息
    getContractByContractId() {
      axios
        .post(option.base_path + "contract/getContractByContractId", this.pkId)
        .then((data) => {
          let datas = data.data.data;
          this.contractForm = datas;
          this.contractTypeBool();
          this.contractStateBool();
          this.objTotal();
          if (this.lookType == 1) {
            //置空必填
            this.rules = {};
            //星号类清空
            this.required = "";
          }
          //this.pageTotal = data.data.data.total;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    //计算关联项目金额合计
    objTotal() {
      //金额变量
      let money = 0;
      this.contractForm.projectList.forEach((item) => {
        if (item.projectAmount) {
          money += Number(item.projectAmount);
        }
      });
      //赋值合计
      this.total = money;
      //判断如果合同是固定金额选择是，金额合计不等于合同金额时提示“付款金额应等于合同金额”
      if (
        this.contractForm.contractAmount != money &&
        this.contractForm.isContractAmount == 1
      ) {
        //this.$message("项目合计金额不能大于合同金额");
      }
    },
    //校验关联项目合计
    subObjTotal() {
      //标识
      let bool = true;

      if (
        this.total > this.contractForm.contractAmount &&
        this.contractForm.isContractAmount == 1 &&
        this.contractForm.projectList.length > 0
      ) {
        bool = false;
        this.$message.error("项目合计金额不能大于合同金额");
      }
      return bool;
    },
    getRowKeys(row) {
      return row.projectNum;
    },
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
        return "--";
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

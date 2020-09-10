<template>
  <div class="dome-container">
    <!-- 页面表头START -->
    <div style="padding: 20px;border: 1px solid rgb(228, 228, 228);border-radius: 3px;">
      <el-row>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <div style="font-size: 24px;">{{as.deptName}}</div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple-light" style="text-align: right;" v-show="organfirst">
            <div style="color: #417095;cursor: pointer;" v-show="zuzhitype" @click='headerEdit()'>编辑</div>
            <div style="color: #417095;cursor: pointer;" v-show="!zuzhitype" @click='headerprese()'>保存</div>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px;">
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <div>
              <span>状态：</span>
              <!-- == '1' ? "启用" : "停用" -->
              <span>{{as.stateName}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple-light" style="text-align: right;">
            <div>
              <span>成员人数：</span>
              <span><span style="color: #417095;">{{as.deptPersonnelCount}}</span>人</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 页面表头END -->
    <!-- 切换按钮START -->
    <div style="overflow: hidden;padding: 20px;width: 600px;margin: 0 auto;">
      <div class="organization" @click="qiehuan($event),getMessage(),getMessagegang()">组织信息</div>
      <div class="organization" @click="qiehuan($event),getMessage2(),getMessage()">组织成果</div>
      <div class="organization" @click="qiehuan($event),getMessage3(),getMessage()">操作记录</div>
    </div>
    <!-- 切换按钮END -->
    <!-- 切换内容START -->
    <!-- 组织信息内容START -->
    <div style="border-top: 1px solid #999999;" v-show="organfirst">
      <!-- 二级标题 -->
      <secondLevel>
        <template v-slot:textTitle>基本信息</template>
      </secondLevel>
      <div style="margin-left: 20px;width: 750px;margin-bottom: 10px;">
        <el-row style="display: inline-block;">
          <label style="margin-right:20px;width: 300px;">
            <span>组织名称：</span>
            <span v-show="zuzhi">{{as.deptName}}</span>
            <el-input v-show="!zuzhi" v-model="as.deptName" class="text-input"></el-input>
          </label>
          <label style="float: right;width: 300px;">
            <span>组织类型：</span>
            <span v-if="zuzhitype" >{{as.deptTypeName}}</span>
            <el-select v-else="!zuzhitype" v-model="as.deptTypeName" @change='onJob' placeholder="请选择" clearable>
              <el-option
                v-for="item in positionList"
                :key="item.value"
                :label="item.disvalue"
                :value="item.value"
              ></el-option>
              <!-- <el-option v-for='item in positionList' label="item.deptTypeName" value=""></el-option> -->
            </el-select>
          </label>
        </el-row>
        <el-row style="padding-top: 20px;">
          <div style="overflow: hidden;">
            <span style="float: left;padding-top: 3px;">组织职能：</span>
            <span v-show="zuzhitext" v-html='as.deptRemarks' style="display: inline-block;font-weight: normal;padding: 0;width: 580px;line-height: 25px;">
            </span>
              <!--  -->
              <quill-editor
                v-model="as.deptRemarks"
                ref="myQuillEditor"
                style="height: 100px;"
                :options="editorOption"
                v-show="!zuzhitext"
              >
          <!-- 自定义toolar -->
          <div id="toolbar" slot="toolbar" style="display:none;">
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
            <!-- <el-input v-show="!zuzhitext" style="width: 650px !important;" :rows="5" type="textarea" v-model="as.deptRemarks" placeholder='请输入组织职能'></el-input> -->
          </div>
        </el-row>
      </div>
      <!-- 二级标题 -->
      <secondLevel>
        <template v-slot:textTitle>组织内岗位</template>
      </secondLevel>
      <el-button type="primary" @click='addPost' style="margin-bottom: 20px;margin-left: 20px;">新增岗位</el-button>
      <!-- //表格 -->
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="positionName" label="岗位" align="center" width="120px"></el-table-column>
        <el-table-column prop="positionCount" label="在岗人数" align="center"></el-table-column>
        <el-table-column prop="positionRemarks" label="岗位职责"></el-table-column>
        <el-table-column prop label="操作" align="center" width="150px">
          <template slot-scope="scope">
            <el-button size="mini" @click="edit(scope.$index,scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="remove(scope.row.positionId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 组织信息内容END -->
    <!-- 组织成果内容START -->
    <div style="border-top: 1px solid #999999;" v-show="organsecond">
      <span style="float: right;height: 50px;padding-top: 10px;">
        <!-- <upload @upload="upload" @delFile="delFileBtn" :fileList="form.expenseFlieList"></upload> -->
        <upload @upload="upload" style="margin-right: 20px;" @delFile="delFileBtn" :fileList="achievetables">
        </upload>

      </span>
      <!-- //表格 -->
      <el-table :data="achievetable" border style="width: 100%">
        <el-table-column prop="attName" label="成果名称" align="center"></el-table-column>
        <el-table-column prop="createTime" label="上传日期" align="center">
          <template slot-scope="scope">
            <span >{{scope.row.createTime|formatDate}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createUserName" label="上传人" align="center"></el-table-column>
        <el-table-column prop label="操作" align="center" width="150px">
          <template slot-scope="scope">
            <el-button size="mini" @click="toPage(scope.row)">下载</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row.deptAttId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 组织成果内容END -->
    <!-- 操作记录内容START -->
    <div style="border-top: 1px solid #999999;" v-show="organthird">
      <div  v-for="(item,index) in textList" :key="index"
        style="border-bottom: 1px solid;overflow: hidden;padding-top: 15px;">
        <p style="display: inline-block;width: 480px;">{{item.operation}}</p>
        <div style="display: inline-block;float: right;margin-right: 20px;">
          <span>{{item.createUserName}}</span>
          <span>{{item.createTime}}</span>
        </div>
      </div>
    </div>
    <!-- 操作记录内容END -->
    <!-- 切换内容END -->
    <!-- 底部按钮START -->
    <div style="width: 100px;margin: 0 auto;margin-top: 20px;">
      <el-row>
        <el-button @click='closeYe'>关闭</el-button>
      </el-row>
    </div>
    <!-- 底部按钮END -->
    <!-- 新增弹出框 -->
    <el-dialog title="新增岗位" :visible.sync="dialogVisible" width="50%" >
      <div>
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
             <el-form-item label="岗位名称：" :rules="{required: true,message: '请输入岗位名称',trigger: 'blur'}" prop="positionName">
               <el-input v-model="ruleForm.positionName"  placeholder="请输入组织名称"></el-input>
             </el-form-item>
             <el-form-item label="岗位职责：" prop="positionRemarks">
               <el-input type="textarea" :rows="5" v-model="ruleForm.positionRemarks"></el-input>
             </el-form-item>
        </el-form>
              <div class="footer-bottom">
                  <el-button type="primary" @click="save1">保存</el-button>
                  <el-button @click="exit">关闭</el-button>
                </div>
      </div>
    </el-dialog>
    <!-- 编辑弹出框 -->
    <el-dialog title="编辑岗位" :visible.sync="dialogVisible2" width="50%">
      <div>
         <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
             <el-form-item label="岗位名称：" :rules="{required: true,message: '请输入岗位名称',trigger: 'blur'}" prop="positionName">
                <el-input v-model="ruleForm.positionName" placeholder="请输入组织名称"></el-input>
             </el-form-item>
             <el-form-item label="岗位职责：" prop="positionRemarks">
               <el-input type="textarea" :rows="5" v-model="ruleForm.positionRemarks"></el-input>
             </el-form-item>
          </el-form>
          <div class="footer-bottom">
            <el-button type="primary" @click="save()">保存</el-button>
            <el-button @click="dialogVisible2= false">关闭</el-button>
          </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import secondLevel from "../../components/secondLevel"
  import topTip from "../../components/topTip";
  import axios from '../../service/http';
  import {option} from '../../static/config.js'
  import upload from "../../components/upload.vue";
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
    // 数据源
    data() {
      return {
        form:{
          personnelId:'',
          queryParams: '',
          fileList:[]
          // pageIndex:1,
          // pageNum:15,
          // expenseFlieList:[],
        },
        positionList:[],
        as:{
          attId:"",//附件id
          deptId:'',//组织id
          deptAttId:'',//组织成果id
          positionId:'',
          state:'',
          deptPersonnelCount: '',
          deptName:'',
          deptType:'',
          deptRemarks:'',
          positionName:'',
          positionRemarks:'',
        },
        dataName:'',
        deptId:'',
        getID:'',
        // disvalue:'',
        // value:'',
        tableData: [],
        achievetable: [],
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
          ],
            positionName:[
              {required: true, message: '请输入岗位名称', trigger: 'blur' }
            ]
        },
        organfirst: true,
        organsecond: false,
        organthird: false,
        textList: [],
        ruleForm: {
          positionName: "",
          positionRemarks: ""
        },
        dialogVisible: false,
        dialogVisible2: false,
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
          ],
        },
        zuzhi: true,
        zuzhitype: true,
        zuzhitext: true,
        achievetables:[],
        a: [],//编辑表头
        formData: [],//编辑表格
        // currentPage:1,
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
      }
    },
    // 初始化执行
    mounted() {
      if (this.$route.query.deptId) {
       this.deptId = this.$route.query.deptId;
        this.getMessage();
        this.getMessagegang();
        this.getMessage2();
        this.getMessage3();
      }
    },
    filters: {
            formatDate(value) {// 时间戳转换日期格式方法
                if (value == null) {
                    return '';
                } else {
                    let date = new Date(value);
                    let y = date.getFullYear();// 年
                    let MM = date.getMonth() + 1;// 月
                    MM = MM < 10 ? ('0' + MM) : MM;
                    let d = date.getDate();// 日
                    d = d < 10 ? ('0' + d) : d;
                    let h = date.getHours();// 时
                    h = h < 10 ? ('0' + h) : h;
                    let m = date.getMinutes();// 分
                    m = m < 10 ? ('0' + m) : m;
                    let s = date.getSeconds();// 秒
                    s = s < 10 ? ('0' + s) : s;
                    return y + '-' + MM + '-' + d ;
                }
            }
        },
    // 方法声明
    methods: {
      //关闭
    exit(){
        this.dialogVisible = false
        this.$refs.ruleForm.resetFields();
    },
      // 上传发票附件
    upload(file) {
      // var data = eval("(" + file + ")");
      this.achievetables = this.forSetPage(file);
      console.log(this.achievetables,"this",file)
      file.map(item=>{
        this.achievetable.push({
          attName:item.fileName,
          createTime:item.createTime,
          createUserName:item.createUser,
          attId:item.attId
        })
      })
      console.log(this.achievetable,"thisaaaaaaaaaaaa")
      // 调用新增上传附件的接口
      let attId = this.achievetables.map((v) => v.fileId).join(",");
        axios.post(option.base_path+'manpower/dept/saveDeptPositionAttMappingList',{
          // deptId:
          deptId:this.as.deptId,
          attId:attId,
        }).then(res => {
              // this.achievetable =
              // console.log(res,"asaaa")
        })

    },
    // 删除发票附件
    delFileBtn(fileList) {
      this.achievetable = this.forSetPage(fileList);
    },
    //附件循环设置
    forSetPage(list) {
      let newList = [];
      list.forEach(n => {
        newList.push({
          fileId: n.fileId,
          fileName: n.fileName,
          name: n.fileName
        });
      });
      return newList;
    },
    // 获取下拉列表
    getDropDown(){
       axios
        .post(option.base_path + "manpower/personnel/getDictInfoListByDictTypeCode",{
            dictTypeCode: "deptType"
          })
        .then((res) => {
          if (res.data.flag == 0) {
            this.positionList = res.data.data;
            console.log(this.positionList, "bumen23");
          }
        });
    },
    //岗位
    onJob(val) {
      this.positionList.forEach((item) => {
        if (item.value == val) {
          this.as.deptTypeName = item.disvalue;
          this.as.deptType = item.value;
        }
      });
    },
      // 获取这组织信息数据
      getMessage(){
        let that =this;
        debugger
        axios.post(option.base_path+'manpower/dept/getDeptByDeptId',{deptId:that.deptId}).then( res => {
          that.as = res.data.data
            console.log("rengong",res.data.data)
            // this.tableData = res.data.data.rows;
            // this.total = res.data.data.total;
        }).catch((error) => {
          console.log('异常',error)
        })
      },
      // 获取组织岗位信息列表数据
      getMessagegang(){
        axios.post(option.base_path+'manpower/dept/getDeptPositionListByDeptId',{deptId:this.deptId}).then( res => {
            // console.log(this.data.data.rows)
            // this.form = res.data.data
            this.as = res.data.data
            console.log("rengong",res)
            this.tableData = res.data.data;
            // this.total = res.data.data;
        }).catch((error) => {
          console.log('异常',error)
        })
      },
      // 获取组织成果附件列表数据
      getMessage2(){
        let that =this;
        axios.post(option.base_path+'manpower/dept/getDeptAttMappingByDeptId',{deptId:this.deptId}).then(res => {
            // console.log(this.data.data.rows)
            that.as = res.data.data
            that.achievetable = res.data.data
            console.log("rengong",res)
        }).catch((error) => {
          console.log('异常',error)
        })
      },
      // 获取日志信息
      getMessage3(){
        axios.post(option.base_path+'manpower/dept/getDeptLogList',{deptId:this.deptId}).then(res => {
            // console.log(this.data.data.rows)
            this.form = res.data.data
            this.textList = res.data.data
            console.log("rengong",res)
        }).catch((error) => {
          console.log('异常',error)
        })
      },
      // 组织成果表格中点击下载按钮
      toPage(row){
        console.log("asd",row)
        // row.attId=
         window.location.href = option.base_path +"fileUpDownload/download?pkId=" +row.attId+"&isDownload=true"
      },
      // 点击切换显示(组织信息/组织成果/操作记录)表格数据
      qiehuan(e) {
        if (e.target.innerHTML == '组织信息') {
          this.organfirst = true;
          this.organsecond = false;
          this.organthird = false;
        } else if (e.target.innerHTML == '组织成果') {
          this.organfirst = false;
          this.organsecond = true;
          this.organthird = false;
        } else if (e.target.innerHTML == '操作记录') {
          this.organfirst = false;
          this.organsecond = false;
          this.organthird = true;
        }
      },
      // 新增弹出框
      addPost() {
        this.dialogVisible = true;
      },
      // 监听对话框的关闭事件
      handleClose() {
        // this.$refs.tableData.resetFields();

      },
      //编辑弹框
      save() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log(this.ruleForm, "asdasdasdasdasda");
          axios
            .post(
              option.base_path + "manpower/dept/saveDeptPositionList",
              {
                  deptId: this.deptId,
                  positionId:this.as.positionId,
                  positionName: this.ruleForm.positionName,
                  positionRemarks: this.ruleForm.positionRemarks,
              })
            .then((res) => {
              this.dialogVisible2 =false
              this.getMessagegang();
            });
          // this.$refs.ruleForm.resetFields();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
      save1() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log(this.ruleForm, "asdasdasdasdasda");
          axios
            .post(
              option.base_path + "manpower/dept/saveDeptPositionList",{
                  deptId: this.deptId,
                  positionName: this.ruleForm.positionName,
                  positionRemarks: this.ruleForm.positionRemarks,
              },
              // this.ruleForm
            )
            .then((res) => {
              if (res.data.flag == 0) {
                this.getMessage()
                this.getMessagegang()
                this.dialogVisible =false
                // this.$refs.ruleForm.resetFields();
              }

            });
          // this.$refs.ruleForm.resetFields();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
      edit(index, row) {
        this.dialogVisible2 = true;
        this.formData = index;
        this.ruleForm.positionName = row.positionName
        this.ruleForm.positionRemarks = row.positionRemarks
        this.as.positionId = row.positionId
      },
      //编辑
      headerEdit() {
        this.zuzhi = false;
        this.zuzhitype = false;
        this.zuzhitext = false;
        // this.a = this.as;
        this.getDropDown()
        // if (this.a) {
        //   console.log(this.a, "as")
        //   this.as.deptName = this.a.deptName;
        //   this.as.deptType = this.a.deptType;
        //   this.as.deptRemarks = this.a.deptRemarks;
        // }
        console.log()
      },
      //保存
      headerprese() {
        this.zuzhitype = true;
        this.zuzhi = true;
        this.zuzhitext = true;
        axios.post(option.base_path + "manpower/dept/saveDeptByDeptId",{
            deptId: this.deptId,
            positionId: this.as.positionId,
            deptName: this.as.deptName,
            deptType: this.as.deptType,
            deptTypeName:this.as.deptTypeName,
            deptRemarks: this.as.deptRemarks,
            // deptId: this.deptId,
            disvalue:this.as.deptTypeName,
            value:this.as.deptType,

        })
        .then(res => {

      })
      },
// 删除
      //删除当前行
      remove(id) {
        let that =this;
          that.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.post(option.base_path + "manpower/dept/updateDeptPositionDelectState", {
            positionId:id,
          }).then(res => {
            if (res.data.flag == 0) {
                  this.getMessage()
                  this.getMessagegang()
                  // this.dialogVisible =false
                  // this.$refs.ruleForm.resetFields();
                }
          })
          that.$message.success('删除成功')
        }).catch(() => {
            that.$message.info('已取消删除')
            })
      },
      // 删除操作
      handleDelete(id){
        let that =this;
        that.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
         axios.post(option.base_path + "manpower/dept/delectDeptAttMappingById", {
          deptAttId:id,
         }).then(res => {
          this.getMessage2()
          this.getMessage()
          this.getMessagegang()
         })
      that.$message.success('删除成功')
      }).catch(() => {
          that.$message.info('已取消删除')
          })
      },
      // 关闭当前页
      closeYe(){
        this.$router.push({ path: "/personnelArchives/organization" });
      }
    },
    // 组件注册
    components: {
      secondLevel,
      topTip,
      upload,
      quillEditor
    }
  }
</script>
<style scoped>
  .organization {
    width: 130px;
    height: 35px;
    margin: 0 auto;
    border: 1px solid rgb(37, 125, 185);
    line-height: 35px;
    text-align: center;
    border-radius: 20px;
    cursor: pointer;
    float: left;
    margin-left: 40px;
  }

  .footer-bottom {
    text-align: center;
    width: 100%;
  }

  .text-input {
    width: 150px !important;
  }

  .el-textarea {
    width: 99% !important;
  }
  .quill-editor{
    margin-left: 75px;
    border-top: 1px solid rgb(228, 228, 228);
  }
</style>

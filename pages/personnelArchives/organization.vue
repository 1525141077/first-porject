<template>
  <div class="yt-dome-container">
    <div class="btn">
      <el-button type="primary" @click="add">新增组织</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%" border highlight-current-row>
      <el-table-column prop="deptName" label="组织名称" width="180" align="center">
        <template slot-scope="scope">
          <a style="color:#417095;cursor: pointer;" @click="deptNames(scope.row.deptId)">{{scope.row.deptName}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="deptTypeName" label="组织类型" width="180" align="center"></el-table-column>
      <el-table-column prop="deptPersonnelCount" label="成员人数" width="100" align="center"></el-table-column>
      <el-table-column prop="deptPosition" label="组织内岗位" align="left"></el-table-column>
      <el-table-column prop="state" label="状态" width="200">
        <template slot-scope="scope">
          <div class="nav" >
            <div @click="states(scope.row.deptId,scope.row.state)" style="display: contents;">
            <a class="go" v-show="scope.row.state==1"  >启动</a>
            <a class="stop" v-show="scope.row.state==2">停用</a>
            </div>
             <span>|</span>
            <a class="del" @click="removeID(scope.row.deptId)">删除</a>
          </div>
          <div>
          </div>

        </template>
      </el-table-column>
    </el-table>
    <!-- 新增弹窗 -->
    <el-dialog title="当前状态" :visible.sync="dialogVisible" width="50%" >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
      <el-form-item label="组织名称：" prop="deptName" :rules="[
        { required: true, message: '请输入组织名称'},
      ]" >
          <el-input v-model="ruleForm.deptName" placeholder="请输入组织名称"></el-input>
        </el-form-item>
        <el-form-item label="组织类型：" prop="deptTypeName">
          <el-select v-model="ruleForm.deptTypeName" @change="onSelect" placeholder="请选择">
            <el-option
              v-for="item in theirItems"
              :key="item.value"
              :label="item.disvalue"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组织职能：" prop="deptRemarks">
          <el-input type="textarea" :rows="5" v-model="ruleForm.deptRemarks"  placeholder="请输入组织职能"></el-input>
        </el-form-item>
      </el-form>
      <div class="footer-bottom">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="exit">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//axios接口组件
import axios from "../../service/http";
//配置文件
import { option } from "../../static/config";
export default {
  data() {
    return {
      tableData: [],
      dialogVisible: false, //弹框
      ruleForm: {
        deptName: "",
        deptType: "",
        deptRemarks: "",
        deptTypeName: "",
      },
      rules: {
        name: [{ required: true, message: "请输入组织名称", trigger: "blur" }],
        deptTypeName: [
          { required: true, message: "请选择", trigger: "change" },
        ],
      },
      //弹框下拉
      theirItems: [],
    };
  },
  components: {},
  mounted() {
    this.getDeptList();
    this.getDictInfoListByDictTypeCode();
  },
  methods: {
    //新增弹框
    add() {
      this.dialogVisible = true;
    },
    //关闭
    exit(){
      this.dialogVisible = false
       this.$refs.ruleForm.resetFields();
    },
    //弹框下拉
    onSelect(val) {
      this.theirItems.forEach((v) => {
        if (v.value == val) {
          this.ruleForm.deptTypeName = v.disvalue;
          this.ruleForm.deptType = v.value;
        }
      });
      console.log(this.ruleForm.deptType, this.ruleForm.deptTypeName);
    },
    //获取新增下拉数据
    getDictInfoListByDictTypeCode() {
      axios
        .post(
          option.base_path +
            "manpower/personnel/getDictInfoListByDictTypeCode?dictTypeCode=deptType"
        )
        .then((res) => {
          if (res.data.flag == 0) {
            this.theirItems = res.data.data;
            console.log(this.theirItems, "asd");
          }
        });
    },
    //保存弹框
    save() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log(this.ruleForm, "asdasdasdasdasda");
          axios
            .post(
              option.base_path + "manpower/dept/saveDeptByDeptId",
              this.ruleForm
            )
            .then((res) => {
              if (res.data.flag == 0) {
                this.tableData.push({
                  deptName: this.ruleForm.deptName,
                  deptTypeName: this.ruleForm.deptType,
                  deptRemarks: this.ruleForm.deptRemarks,
                });
              }
              this.getDeptList();
            });
          // this.$refs.ruleForm.resetFields();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //表格数据
    getDeptList() {
      axios.post(option.base_path + "manpower/dept/getDeptList").then((res) => {
        if (res.data.flag == 0) {
          this.tableData = res.data.data;
          console.log(res);
        }
      });
    },
    //跳转组织详情
    deptNames(id){
      this.$router.replace({
        path:"/personnelArchives/viewOrganDetail",
          query: {
          deptId: id,
        }
      })
    },
    //状态1启动2停用
    states(id,states) {

      axios
        .post(option.base_path + "manpower/dept/updateDeptStateByDeptId",{
            deptId:id,
            state:states==1?2:1
        })
        .then((res) => {
          if (res.data.flag == 0) {
             this.getDeptList()
            console.log(this.deptId,this.state);
             this.$message.success('状态更新成功')
          }
        }).catch(() => {
          this.$message.info('更新失败')
          })
    },
    //删除当前行
    removeID(id) {
      let that =this;
        that.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
         axios.post(option.base_path + "manpower/dept/updateDeptDelectState", {
              deptId:id,
         }).then(res => {
        this.getDeptList()
         })
      that.$message.success('删除成功')

      }).catch(() => {
          that.$message.info('已取消删除')
          })
    },
  },
};
</script>

<style scoped>
.btn {
  padding: 10px;
}
.del {
  /* width: 90px; */
  text-align: center;
  color: #409eff;
  cursor: pointer;
}
.go {
  /* width: 90px; */
  text-align: center;
  color: #07c160;
  cursor: pointer;
}
.stop {
  /* width: 90px; */
  text-align: center;
  color: red;
  cursor: pointer;
}
.nav {
  text-align: center;
}
.footer-bottom {
  width: 100%;
  text-align: center;
  margin-top: 20px;
}
</style>

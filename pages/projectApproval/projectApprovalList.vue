<template>
  <div class="yt-dome-container">
    <!-- :style="publicHeight" -->
    <el-container>
      <!-- 页面头部 -->
      <el-header class="yt-header">
        <el-form
          ref="form"
          :model="form"
          label-width="120px"
          :label-position="labelposition"
          size="small"
        >
          <el-row>
            <el-col :span="10">
              <el-form-item label="请输入关键字：">
                <el-input
                  v-model="form.selectParam"
                  class
                  placeholder="项目编号/项目名称/客户名称/申请人"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="立项状态：">
                <el-select v-model="form.state" placeholder="请选择" clearable>
                  <el-option label="全部" value></el-option>
                  <el-option label="待立项" value="0"></el-option>
                  <el-option label="已立项" value="10"></el-option>
                  <el-option label="暂不立项" value="20"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" style="text-align: right;">
              <el-button type="primary" @click="getProjectList()">查询</el-button>
              <el-button type="info" @click="resetForm('form')">重置</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6" style="text-align: left;margin: 0px 0px 5px -15px;">
              <el-button type="primary" @click="toPage('/projectApproval/projectApproval','')">新增项目</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <div
        style="height: 5px;background-color: #f3f3f3;border-top: 1px solid #dfe6f3;border-bottom: 1px solid #dfe6f3;"
      ></div>
      <!-- 页面主体 -->
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="pkId" label="项目编号" align="center" width="120px"></el-table-column>
        <el-table-column
          prop="projectName"
          label="项目名称" 
          ref="filterName"
          header-align="center"
          align="left">
           <template scope="scope">
             <el-Tooltip :content="scope.row.projectName" :disabled="scope.row.disabled" placement="top">
              <span>{{scope.row.projectName | ellipsis(that)}}</span>
            </el-tooltip>
          </template>
          </el-table-column>
        <el-table-column
          prop="customerName"
          label="客户名称"
          header-align="center"
          show-overflow-tooltip0
        ></el-table-column>
        <el-table-column prop="createUserName" label="申请人" align="center" width="120px"></el-table-column>
        <el-table-column prop="" label="立项状态" align="center" width="100px">
          <template scope="scope">
            <span v-if="scope.row.state == 0">待立项</span>
            <span v-else-if="scope.row.state == 10">已立项</span>
            <span v-else-if="scope.row.state == 20">暂不立项</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" align="center" width="160px">
        </el-table-column>
        <el-table-column prop label="操作" align="center" width="120px">
          <template scope="scope">
            <el-button
              type="text"
              size="small"
              style="padding:0px"
              @click="toPage('/projectApproval/projectApproval',scope.row)"
            >编辑</el-button>
            <span class="center-line">|</span>
            <el-button
              type="text"
              size="small"
              style="padding:0px"
              @click="toPage('/projectApproval/projectApprovalDetails',scope.row)"
            >查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- @size-change="handleSizeChange"
      @current-change="handleCurrentChange"-->
      <el-pagination
        background
        :current-page="currentPage"
        :page-sizes="[15, 30, 50, 100, 200, 500]"
        :page-size="15"
        layout="total, prev, pager, next, sizes"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </el-container>
  </div>
</template>

<script>
import axios from '../../service/http';
import { option } from '../../static/config';
export default {
  // 数据源
  data() {
    return {
      disabled: false,
      that: this,
      form: {
        selectParam: "",
        state: "",
        pageSize: 15,
        pageNum: 1
      },
      total: 0,
      currentPage: 1,
      labelposition: "right",
      tableData: []
    };
  },
  watch: {
    disabled: {
      handler (newVal, oldVal) {
        
        this.disabled = newVal
      }
    }
  },
  // 初始化执行
  mounted() {
    this.getProjectList();
  },
  // 方法声明
  methods: {
    toPage(path, row) {
      this.$router.replace({
        path: path,
        query: {
          mainId: row.pkId,
          state: row.state
        }
      });
    },
    resetForm(form) {
      this.form = {
        selectParam: "",
        state: "",
        pageSize: 15,
        pageNum: 1
      };
      this.getProjectList();
    },
    getProjectList() {
      var me = this;
      //调用axios.post方法
      //"CASPARAMS":"OFF_INDEX"
      axios
        .post(option.base_path + "db/project/getProjectList", this.form)
        .then(data => {
          // this.peopleList.push(man)
          this.tableData = data.data.data.rows;
          if (this.tableData.length !== 0) {
            this.tableData.forEach(n => {
              for(let k in n) {
                if (n[k] === '') {
                  n[k] = '--'
                }
              }
              this.$set(n, 'disabled', false)
            })
          }
          this.total = data.data.data.total;
          console.log("返回值", data.data.data.rows);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //手动切换每页条数
    handleSizeChange(val) {
      this.form.pageSize = val;
      console.log(`每页 ${val} 条`);
      //刷新
      this.getProjectList();
    },
    //手动切换页数
    handleCurrentChange(val) {
      this.form.pageNum = val;
      console.log(`当前页: ${val}`);
      //刷新
      this.getProjectList();
    }
  },
  // 过滤器
  filters: {
  ellipsis (value, that) {
    
    // // 列总长度像素
    // let domNameLength = (Number(that.$refs.filterName.$parent.bodyWidth.substring(0,that.$refs.filterName.$parent.bodyWidth.indexOf('px'))) - 620) / 2
    // console.log('长度', domNameLength)
    // // 文字总长度像素
    // let fontLength = value.length * 14
    // //文字总长度
    // let len = value.length / 2
    // if (!value) return ''
    // if (fontLength > domNameLength) {
    //   // 超出多少文字
    //   let outWord = (len - 1 + (fontLength - domNameLength) / 14).toFixed()
    //   // that.disabled = true
    //   return value.substring(0, len - 2) + '...' +value.substring(outWord,value.length)
    // }
    // return value
    // 列总长度像素
      let domNameLength = (Number(that.$refs.filterName.$parent.bodyWidth.substring(0,that.$refs.filterName.$parent.bodyWidth.indexOf('px'))) - 620) / 2
      console.log('长度', domNameLength)
      // 能接受的总长度
      let fontLength = Number((domNameLength /14).toFixed())
      //文字总长度的一半
      let len = fontLength / 2 - 1
      let n = value.length - len
      if (!value) return ''
      if (value.length > fontLength) {
        // 超出多少文字
        // let outWord = Number(value.length - fontLength).toFixed()
        // that.disabled = true
        return value.substring(0, len) + '...' +value.substring(n+1,value.length)
      }
      return value
    }
  },
  // 组件注册
  components: {}
};
</script>

<style>
.name-farst {
    text-overflow: ellipsis;
    width: 34px;
    display: inline-block;
    overflow: hidden;
}
.center-line {
  color: #417095;
}
</style>
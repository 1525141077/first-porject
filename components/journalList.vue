<template>
  <div class="journa-list" v-if="journalList.length > 0">
    <topTip>
      <template>
        <el-col :span="8" style="text-align: left;" class="top-tip">
          <span style="color: #417095;font-size: 16px;font-weight: bolder;">日志信息</span>
        </el-col>
      </template>
    </topTip>
    <div class="row-div">
            <el-table border
            class="rz-tab"
            :data="journalList"
            :show-header="false">
              <el-table-column
                :key="Math.random()"
                prop="updateUserName"
                align="center"
                width="100px"
              ></el-table-column>
              <el-table-column
                :key="Math.random()"
                prop="updateTime"
                label=""
                align="center"
                width="180px"
              ></el-table-column>
              <el-table-column
                :key="Math.random()"
                prop=""
                label=""
                align="left"
                show-overflow-tooltip
                >
                <template scope="scope">
                  <!-- <el-tooltip class="item" effect="dark" placement="top">
                    <div slot="content" style="padding: 0px 20px;">
                      <div v-for="item in scope.row.tooltipList">
                        {{item}}
                      </div>
                    </div>
                      <span style="text-overflow: ellipsis;white-space: nowrap;">{{scope.row.operation}}</span>
                  </el-tooltip> -->
                  <span style="text-overflow: ellipsis;white-space: nowrap;">{{scope.row.operation}}</span>
           </template>
              </el-table-column>
          </el-table>
    </div>
    </div>
  </div>
</template>

<script>
import topTip from "./topTip.vue"
import axios from '../service/http'
import { option } from '../static/config'
export default {
  props: {
    // 调用的接口信息
    interFace: {
      type: String,
      default () {
        return 'db/project/getProjectJournalList'
      }
    },
    pkId: ''
  },
  data () {
    return {
      journalList: [],
      mainMap:{
        mainId: this.pkId
      }
    }
  },
  watch: {
    pkId: {
      handler (newVal, oldVal) {
        this.mainMap.mainId = newVal
      }
    },
    interFace: {
      handler (newVal, oldVal) {
        this.interFace = newVal
      }
    }
  },
  mounted () {
    this.getProjectJournalList()
  },
  methods: {
    //项目立项修改记录查询
    getProjectJournalList(){
      let tooltipList = []
      let interFace = this.interFace
      var me = this;
      //调用axios.post方法
      //"CASPARAMS":"OFF_INDEX"
        axios.post(option.base_path + interFace, this.mainMap).then(data => {
          // this.peopleList.push(man)
          this.journalList = data.data.data;
          if (this.journalList.length !== 0) {
            this.journalList.forEach(n => {
              tooltipList = n.operation.split('；')
              this.$set(n, 'tooltipList', tooltipList)
            })
          }
          console.log('返回值', data.data.data)
        })
        .catch(function (error) {
          console.log(error);
        })
    }
  },
  components: {
    topTip
  }
}
</script>

<style>
.el-tooltip__popper {
  max-width: 1000px;
}
.rz-tab {
  border: none;
}
.rz-tab table td {
  border-right:none;
  border-bottom:1px dashed #999!important;
}
/* .rz-tab table td  {
  border-left:1px dashed #999!important;
}
.rz-tab table td:first-child  {
  border-left:none !important;
} */
.rz-tab table td div.cell {
  border-left:1px dashed #999!important;
}
.rz-tab table td:first-child div {
  border-left:none !important;
}
.rz-tab::before {
  height: 1px;
  background: #ffffff;
}
.rz-tab:after {
  width: 1px;
   background: #ffffff;
}
</style>

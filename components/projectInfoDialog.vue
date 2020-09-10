<template>
  <div class="porject-info-dialog">
      <!-- 弹窗START -->
      <el-dialog 
      width="80%"
      :title="projectInfo" 
      destroy-on-close
      :visible.sync="dialogType"
      :before-close="canelBtn"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-row>
        <el-col :span="8" style="padding-bottom:10px;">
           <el-input
            :placeholder="placeholder"
            v-model="selectParam">
            <i slot="suffix" class="el-input__icon el-icon-search" style="cursor: pointer;" @click="inputBtn"></i>
          </el-input>
        </el-col>
      </el-row>
        <el-table :data="tableList"
        border
        highlight-current-row
        @row-click="rowClick"
        @cell-mouse-enter="hoverTab"
        @cell-mouse-leave="leaveTab">
          <slot name="tab-list"></slot>
            <el-table-column prop="" label="" align="center" width="80">
                <template scope="scope">
                    <img :src="scope.row.imgSrc" alt="" style="display:none;cursor: pointer;width:25px;height:25px;position: absolute;top: 13px;left: 29px;" :class="{'open-icon': scope.row.iconType}" @click="imgClick(scope.$index, scope.row)">
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
        background
        :current-page="currentPage"
        :page-sizes="[15, 30, 50, 100, 200, 500]"
        :page-size="pageSize"
        layout="total, prev, pager, next, sizes"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
        <span slot="footer" class="dialog-footer">
            <el-button  @click="canelBtn">取 消</el-button>
            <el-button type="primary"  @click="sureBtn">确 定</el-button>
        </span>
        </el-dialog>
      <!-- 弹窗END -->
      <popContainer v-if="popType" :message="popInfo"></popContainer>
      <!-- <div class='popContainer' v-if="popType">
        <div class="pop-info">{{popInfo}}</div>
      </div> -->
  </div>
</template>

<script>
import popContainer from './popContainer.vue'
import axios from '../service/http';
import { option } from '../static/config';
export default {
  props: {
    // 弹窗名
    projectInfo: {
      type: String,
      default () {
        return ''
      }
    },
    // 输入框提示文字
    placeholder: {
      type: String,
      default () {
        return ''
      }
    },
    // 数据总条数
    total: {
      type: Number,
      default () {
        return 0
      }
    },
    // 列表数据源
    projectArr: {
      type: Array,
      default () {
        return []
      }
    },
    // 是否显示弹窗
    centerDialogVisible: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
    data(){
        return{
          // 是否弹出遮罩层
          popType: false,
          popInfo: '',
          // 点击一行获取的数据
          rowMap: {},
          // 是否点击了一行
          rowType: false,
          currentPage: 1,
          pageSize: 15,
          selectParam: '',
          // 列表数据
          tableList: [],
          dialogType: false,
          // 标记收藏
          imgOpen: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABbklEQVQ4T5WSP0vDUBTFz33xD7ShS3lWXEQQaZKK4KR+AN0cHSo6OLuISBdB0MVBRXBxty4iOOsn0MGlkrQ4OWnT4mBtENHmSqutaW1i+8Z3zvlx33mXEHDKtr5OAk5YWsd+NvITyvn4OITIVHWh8HQomr1u5/UH2NoBiNZqIUJaldZSx4C3R2240kMP3oD7qWiRobtcK+TPBKVifEywSAFYaTIz0q5wdyIyd++9p5KdmFGoknRBOgEagMGgYgHkGcgKsOVW+Jycgn7EwOo/obYygy7o/dnQP1w+A8PoCkIwewUt1DroGvIT7o+aVqPEjiGe8PcPe07ZTsyC3MvAp7A7p8ZyV3VPM6BgpADeDQZgQ41Ze+0BRT0NxmIggOhEleayzwT6LYDJhki4AYMZmGpAmTNqLDvhB3AAhECobtu2Kq3TqrGcN5IQvF9fMnXgt/ymDpyivkWgl5A0D1uf8fo0KqH0bQrCSFha83X9C8i3hUT/u7o8AAAAAElFTkSuQmCC',
          // 未标记收藏
          imgClose: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABq0lEQVQ4T6WTsUtbURTGv3PzWjXvBQeTPN0c603BpRUUBAMdHIKD4C5Egv+B0MV0av+BUkpth26lg+AiYiQuYnUSNS86OUpeWpC8lxZb7z3lpRpeQhpTesZ7v+93v3Muh/CfRd38NVdOC4GHVtzZ+ZuuK8CvygIz+mJJZ/qfAb6bWgH41a3xpZV0nneCdExQ/5p6ypoPmfEiMBFhVWmeHBwuf2mHNAF8Mdrvm2aGoDMAZQA+sZLldGDw3bEiQOMAtgFsmonBT0T7Pxpw15XWAPCegHkABoBTEBUeCLzrGyo5gej6W0r+YuTA/AyMFMCKQOvRyM9sI0Gt8nhKkN4LIsdsJ9/tZ7yKzActgWnWsktbzRbqVbnMjDdEyJsJp9F7e92Zww+1DNGryACwzEqnYyNnu2GAd/lohiKiSAIfzLiTvbtrBdyKwGrcss+Pw4Dvl3JCR3DQDu8IMK9r0SvDsg0hFgNIxDDWfHVzFQW8ngDM2CDCXDgBAZ8ZWOgJ8MdIH5Xi14ahldYiR4RccHo/QIgnplBvKXHuhROwK6068RLf8FF4wF2XqZdN/w13i7gvDzivUwAAAABJRU5ErkJggg=='
        }
    },
    watch: {
      projectArr: {
        handler (newVal, oldVal) {
          this.tableList = newVal
        }
      }
    },
    mounted () {
      this.tableList = this.projectArr
      this.dialogType = this.centerDialogVisible
    },
    methods:{
      // 点击列表某一行
      rowClick (row, column, event) {
        this.rowMap = row
        this.rowType = true
      },
      // 分页
      handleSizeChange (num) {
        this.padeSize = num
        let params = {
          pageSize: num,
          pageNum: this.currentPage,
          selectParam: this.selectParam
        }
        this.$emit('handleSizeChange', params)
      },
      handleCurrentChange (num) {
        this.currentPage = num
        let params = {
          pageSize: this.padeSize,
          pageNum: num,
          selectParam: this.selectParam
        }
        this.$emit('handleCurrentChange', params)
      },
      // 输入框事件
      inputBtn () {
        let params = {
          pageSize: this.pageSize,
          pageNum: this.currentPage,
          selectParam: this.selectParam
        }
        this.$emit('inputBtn', params)
      },
      // 点击图标前显示弹窗
      // iconDialog (index, row) {
      //   let tip = ''
      //   if (this.tableList[index].isCollection === '1') {
      //     tip = '确定取消收藏吗?'
      //   } else {
      //     tip = '确定收藏吗?'
      //   }
      //   this.$confirm(tip, '提示', {
      //           confirmButtonText: '确定',
      //           cancelButtonText: '取消',
      //           type: 'warning'
      //           }).then(() => {
      //               this.imgClick(index, row)
      //           }).catch(() => {
      //       })
      // },
      // 图标点击
      imgClick (index, row) {
        let titleInfo = this.projectInfo
        let imgOpen = this.imgOpen
        console.log(index, imgOpen)
        if (this.tableList.length !== 0) {
          if (this.tableList[index].isCollection === '2') {
            // 未收藏变已收藏
            this.tableList[index].iconType = true
            this.tableList[index].imgSrc = imgOpen
            this.tableList[index].isCollection = '1'
          } else {
            this.tableList[index].iconType = true
            this.tableList[index].imgSrc = this.imgClose
            this.tableList[index].isCollection = '2'
          }
          if (titleInfo === '项目信息') {
            let param = {
              mainId: row.pkId,
              collectionType: '1',
              isCollection: row.isCollection
            }
            this.collection(param)
          } else if (titleInfo === '工作项') {
            let param = {
              mainId: row.workCode,
              collectionType: '2',
              isCollection: row.isCollection
            }
            this.collection(param)
          }
        }
      },
      // 收藏
      collection (param) {
        axios.post(option.base_path + 'db/workHours/saveCollectionProjectsOrWork', param)
            .then(res => {
              this.popType = true
              this.popInfo = res.data.message
              setTimeout(() => {
                this.popType = false
                this.popInfo = ''
              }, 1000)
              // layer.alert('收藏')
              // this.$alert(res.data.message, '提示', {
              // type:'warning',
              // center: true,
              //   confirmButtonText: '关闭',
              //   callback: action => {
              //   }
              // })
                // this.$message.success(res.data.message)
            })
      },
      // 单元格悬浮时
      hoverTab (row, column, cell, event) {
        if (this.tableList.length !== 0) {
          this.tableList.forEach(n => {
            if (n.indexd === row.indexd && n.isCollection === '2') {
              n['iconType'] = true
              n['imgSrc'] = this.imgClose
            }
          })
        }
        this.$forceUpdate()
      },
      // 单元格离开时
      leaveTab (row, column, cell, event) {
        if (this.tableList.length !== 0) {
          this.tableList.forEach(n => {
            if (n.indexd === row.indexd && n.isCollection === '2') {
              n['iconType'] = false
              n['imgSrc'] = ''
            }
          })
        }
        this.$forceUpdate()
      },
      // 取消按钮
      canelBtn (done) {
        this.rowMap = {}
        this.$emit('canelBtn')
      },
      // 确定按钮
      sureBtn () {
        // let id = this.rowMap.pkId
        if (!this.rowType) {
          this.popType = true
          this.popInfo = '未选择数据'
          setTimeout(() => {
            this.popType = false
            this.popInfo = ''
          }, 1000)
        } else {
          this.$emit('sureBtn', this.rowMap)
        }
      }
    },
    components:{
      popContainer
    }
}
</script>

<style>
.el-message-box {
  width: 330px;
}
.el-message-box--center .el-message-box__title {
  justify-content: end;
}
.porject-info-dialog .el-dialog__body {
  padding: 10px 20px;
}
.open-icon {
  display: inline-block !important;
}
</style>
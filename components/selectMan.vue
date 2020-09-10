<template>
  <div class="chose-man">
        <el-autocomplete
        class="inline-input jp-man"
        :validate-event="inputType"
        v-model="selectNames"
        :fetch-suggestions="querySearch"
        placeholder="请输入内容"
        :trigger-on-focus="false"
        @select="handleSelect"
      >
      <!-- <template slot-scope="{ item }">
        <div style="text-overflow: ellipsis;white-space: nowrap;width:100px">{{ item.value }}</div>
      </template> -->
      </el-autocomplete>
      <!-- <el-select v-model="selectName" 
      class="jp-man"
      filterable
      @change="changeMan"
       placeholder="请选择">
    <el-option
      v-for="(item, i) in jpManList"
      :key="i"
      :label="item.userName"
      :value="item.userItcode">
    </el-option>
  </el-select> -->
  </div>
</template>

<script>
import axios from '../service/http'
import { option } from '../static/config'
  export default {
    props: {
      // 页面显示的值
      selectName: {
        type: String,
        default () {
          return ''
        }
      },
      inputType: {
        type: Boolean,
        default () {
          return false
        }
      },
      // 需要去掉的数组（有去掉已选择姓名的需求可以加）
      oldNameList: {
        type:Array,
        default () {
          return []
        }
      }
    },
    data () {
      return {
        selectNames: this.selectName,
        jpManList: [],
        nameMap: {
          userName: '',
          userItcode: '',
          userPhone: ''
        }
      }
    },
    watch: {
      selectName: {
        handler (newVal, oldVal) {
          this.selectNames = newVal
        }
      }
    },
    mounted () {
      this.getAllPeople()
    },
    methods: {
      // 获取所有人
      getAllPeople () {
        let map = {
          pageIndex: 1,
          pageNum: 99999
        }
        axios.post(option.base_path + 'user/userInfo/getAllUserInfoToPage', map).then(data => {
          //赋值全局变量数据
          let dataList = data.data.data.rows
          // 是否有已选择的姓名
          let oldNameList = this.oldNameList
          let newNameLists = []
          // 筛选之后的
          let newNameList = []
          dataList.forEach(n => {
            if (n.userItcode !== '') {
              for (let key in n) {
                if (key === 'userName') {
                  n['value'] = n[key] + ' ' + n['cellPhone']
                }
              }
              newNameList.push(n)
            }
          })
          // 判断是否需要去掉以添加的
          if (oldNameList.length !== 0) {
            let code = oldNameList.map(n => {return n.code})
            newNameLists = newNameList.filter(li => {
               return !code.includes(li.userItcode)
             })
            this.jpManList = newNameLists
          } else {
            this.jpManList = newNameList
          }
        })
        .catch(function (error) {
          console.log(error);
        })
      },
        // 返回输入建议方法
      querySearch (queryString, cb) {
        console.log(queryString)
        let restaurants = this.jpManList
        let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
        cb(results)
      },
      // 筛选匹配的姓名数据
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }
      },
      // 选人
      handleSelect (item) {
        let manList = this.jpManList
        manList.forEach(n => {
          if (n.userName === item.userName) {
            this.nameMap.userName = n.userName
            this.nameMap.userItcode = n.userItcode
            this.nameMap.userPhone = n.cellPhone
            this.nameMap.userEmail = n.userEmail
          }
        })
        this.$emit('choseMan', this.nameMap)
      },
      // 输入
      inputVal (item) {
        console.log('输入', item)
        let manList = this.jpManList
        manList.forEach(n => {
          if (n.userName === item) {
            this.nameMap.userName = n.userName
            this.nameMap.userItcode = n.userItcode
            this.nameMap.userPhone = n.cellPhone
          }
        })
        this.$emit('choseMan', this.nameMap)
      }
      // 选择
      // changeMan (item) {
      //   let manList = this.jpManList
      //   manList.forEach(n => {
      //     if (n.userItcode === item) {
      //       this.nameMap.userName = n.userName
      //       this.nameMap.userItcode = n.userItcode
      //     }
      //   })
      //   this.$emit('choseMan', this.nameMap)
      // }
    }
  }
</script>

<style >
.chose-man {
  width: 100%;
}
.el-autocomplete-suggestion.el-popper {
  min-width: 182px !important;
}
.chose-man .jp-man {
  width: 100%;
}
</style>

<template>
  <div class="look-fils">
    <el-input placeholder="请输入" v-model="newMoneys" @focus="focusMoney"  @blur="blurMoney">
      <!-- <template slot="append">{{tail}}</template> -->
    </el-input>
  </div>
</template>

<script>
export default {
  props: {
    moneys: {
      type: String,
      default () {
        return ''
      }
    },
    type: {
      type:Number,
      default () {
        return 1
      }
    }
  },
  data () {
    return {
      newMoneys: this.moneys
    }
  },
  watch: {
    moneys: {
      handler (newVal, oldVal) {
        this.newMoneys = this.moneyFilter(newVal)
      }
    }
  },
  mounted () {
  },
  methods: {
    // 格式化金额
    moneyFilter (money) {
      let newMoney = ''
      let numList
      // 判断是否输入的数字
      let testMoney = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g
      if (testMoney.test(money)) {
        // 金额格式正确
        money = Number(money)
        money = (money.toFixed(2) + '').replace(
        /\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,
        '$&,'
        )
        if (money.indexOf('.') !== -1) {
          // 有小数
          numList = money.split('.')
          numList[1] = numList[1].replace(/\,/g, '')
          newMoney = numList[0] + '.' + numList[1]
          return newMoney
        } else {
          return money
        }
      } else {
        return newMoney
      }
    },
    // 金额格式化(获得焦点)
    focusMoney () {
      this.newMoneys = this.moneys
      // this.newMoneys = this.newMoneys.replace(/[^(\-?\d+\d+)\\.]/g, '').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
      // this.$emit('focusMoney', money)
    },
    // 金额格式化(失去焦点)
    blurMoney () {
      this.newMoneys = this.moneyFilter(this.newMoneys)
      let money = this.newMoneys
      money = money.replace(/[^(\-?\d+\d+)\\.]/g, '').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
      let moneyMap = {
          money: money,
          type: this.type
        }
      this.$emit('blurMoney', moneyMap)
      
    }
  }
}
</script>

<style scoped>
</style>

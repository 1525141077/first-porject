<template>
  <div class="">
  	<el-input v-model="inputValue" placeholder="" @focus="toNumber" @blur="toMoney" :disabled="disabled" :readonly="readonly" :name="name" :class="tail === '元' || tail === '￥' ? 'money-input-r': ''">
      <template slot="append" v-if="tail !== '' && tail !== '￥'">{{tail}}</template>
    </el-input>
  </div>
</template>

<script>
import {rmoney, finMoneyformat} from '../assets/js/util/expensesUtils'
export default {
  props: {
    value: {
      type: Number,
      default () {
        return 0
      }
    },
    name: {
      type:String,
      default () {
        return ""
      }
    },
    disabled: false,
    readonly: false,
    tail: {
      type:String,
      default () {
        return ""
      }
    }
  },
  data () {
    return {
      inputValue: ''
    }
  },
  mounted () {
    this.inputValue = this.finMoneyformat(this.value, 2, '.', ',', 'round')
  },
  watch: {
    value (val) {
      this.inputValue = this.finMoneyformat(val, 2, '.', ',', 'round')
    }
  },
  methods: {
    rmoney,
    finMoneyformat,
    toMoney () {
      this.inputValue = this.finMoneyformat(this.inputValue, 2, '.', ',', 'round')
      this.$emit("update:value", this.rmoney(this.inputValue));
    },
    toNumber () {
      // this.inputValue = this.finMoneyReplace(this.value)
      this.inputValue = this.rmoney(this.value)
    }
  },
  filters: {}
}
</script>

<style>
.money-input-r input{
  text-align: right;
}
</style>
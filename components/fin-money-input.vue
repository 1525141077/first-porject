<template>
  <div class="">
    <el-input ref="moneyCheck" class="right-input" onkeyup="value=value.replace(/[^\d.]/g,'')" v-model="inputValue" placeholder="" @change="changeEvent" @focus="toNumber" @blur="toMoney" :disabled="disabled"
      :readonly="readonly" :name="name">
      <template slot="append">{{tail}}</template>
    </el-input>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default() {
        return 0;
      }
    },
    name: "",
    disabled: false,
    readonly: false,
    tail: {
      type: String,
      default() {
        return "";
      }
    }
  },
  data() {
    return {
      inputValue: ""
    };
  },
  mounted() {
    this.inputValue = this.finMoneyformat(this.value, 2, ".", ",", "round");
  },
  watch: {
    value(val) {
      this.inputValue = this.finMoneyformat(val, 2, ".", ",", "round");
    }
  },
  /*  directives: {
    select: {
      //默认选中
      inserted: function(el, binding) {
        el.querySelector("input").select();
        //因为el-input在input标签外面还包了其他标签，所以要通过querySelector选中input框
      }
    }
  }, */
  methods: {
    toMoney() {
      this.$emit(
        "input",
        Math.round((this.inputValue ? +this.inputValue : 0) * 100) / 100
      );
      this.inputValue = this.finMoneyformat(
        this.inputValue,
        2,
        ".",
        ",",
        "round"
      );
      this.$emit("blur", false);
    },
    toNumber() {
      this.inputValue = this.finMoneyReplace(this.value);
      this.$nextTick(() => {
        this.$refs.moneyCheck.select(); //自动选中
      });
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
    finMoneyformat(number, decimals, decpoint, thousandssep, roundtag) {
      // 数字千分位格式化
      /*
       * 参数说明：
       * number：要格式化的数字
       * decimals：保留几位小数
       * decpoint：小数点符号
       * thousandssep：千分位符号
       * roundtag:舍入参数，默认 "ceil" 向上取,"floor"向下取,"round" 四舍五入
       * */
      number = (number + "").replace(/[^0-9+-Ee.]/g, "");
      roundtag = roundtag || "ceil"; // "ceil","floor","round"
      let n = !isFinite(+number) ? 0 : +number;
      let prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
      let sep = typeof thousandssep === "undefined" ? "," : thousandssep;
      let dec = typeof decpoint === "undefined" ? "." : decpoint;
      let s = "";
      // let toFixedFix = this.toFixedFix(n, prec, roundtag)
      s = (prec
        ? this.toFixedFix(n, prec, roundtag)
        : "" + Math.round(n)
      ).split(".");
      var re = /(-?\d+)(\d{3})/;
      while (re.test(s[0])) {
        s[0] = s[0].replace(re, "$1" + sep + "$2");
      }
      if ((s[1] || "").length < prec) {
        s[1] = s[1] || "";
        s[1] += new Array(prec - s[1].length + 1).join("0");
      }
      return s.join(dec);
    },
    toFixedFix(n, prec, roundtag) {
      var k = Math.pow(10, prec);
      console.log();
      return (
        "" +
        parseFloat(
          Math[roundtag](parseFloat((n * k).toFixed(prec * 2))).toFixed(
            prec * 2
          )
        ) /
          k
      );
    },
    // 去除金额格式
    finMoneyReplace(num) {
      if (!num || num === undefined || num === null || num === "") return 0.0;
      return num.toString().replace(/[^\d.]/g, "");
    },
    changeEvent() {
      this.$emit("change", this.inputValue);
    }
  },
  filters: {}
};
</script>

<style>
.right-input .el-input__inner {
  text-align: right;
}
</style>
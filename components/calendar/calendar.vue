<style scoped>
@media screen and (min-width: 460px) {
  .wh_item_date:hover {
    background: #71c7a5;
    cursor: pointer;
  }
}
* {
  margin: 0;
  padding: 0;
}

.wh_container {
  max-width: 410px;
  margin: auto;
}

li {
  list-style-type: none;
}
.wh_top_changge {
  display: flex;
}

.wh_top_changge li {
  cursor: pointer;
  display: flex;
  color: #fff;
  font-size: 18px;
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 47px;
}

.wh_top_changge .wh_content_li {
  cursor: auto;
  flex: 2.5;
  color: #000;
}
.wh_content_all {
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC",
    "Helvetica Neue", STHeiti, "Microsoft Yahei", Tahoma, Simsun, sans-serif;
  background-color: #fff;
  width: 100%;
  overflow: hidden;
  padding-bottom: 8px;
}

.wh_content {
  display: flex;
  flex-wrap: wrap;
  padding: 0 3% 0 3%;
  width: 100%;
}

.wh_content:first-child .wh_content_item_tag,
.wh_content:first-child .wh_content_item {
  color: #000;
  font-size: 16px;
}

.wh_content_item,
wh_content_item_tag {
  font-size: 15px;
  width: 13.4%;
  text-align: center;
  color: #000;
  position: relative;
}
.wh_content_item {
  height: 40px;
}

.wh_top_tag {
  width: 40px;
  height: 40px;
  line-height: 40px;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.wh_item_date {
  width: 40px;
  height: 40px;
  line-height: 40px;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.wh_jiantou1 {
  width: 12px;
  height: 12px;
  border-top: 2px solid #ffffff;
  border-left: 2px solid #ffffff;
  transform: rotate(-45deg);
}

.wh_jiantou1:active,
.wh_jiantou2:active {
  border-color: #ddd;
}

.wh_jiantou2 {
  width: 12px;
  height: 12px;
  border-top: 2px solid #ffffff;
  border-right: 2px solid #ffffff;
  transform: rotate(45deg);
}
.wh_preMonth,.wh_nextMonth{
  color: #5fb8fe;
}
.wh_content_item > .wh_isMark {
  margin: auto;
  border-radius: 100px;
  background: blue;
  z-index: 2;
}
.wh_content_item .wh_other_dayhide {
  color: #bfbfbf;
}
.wh_content_item .wh_want_dayhide {
  color: #bfbfbf;
}
.wh_content_item .wh_isToday {
  background-color: rgb(73, 176, 247);
  border-radius: 100px;
  color: #fff;
}
.wh_content_item .wh_chose_day {
  background-color: rgb(180,180,180);
  border-radius: 100px;
  color: #fff;
}
.version_grouop{
  width: 20px;
  height: 3px;
  position: relative;
  bottom: 8px;
  left: 18px;
  background-color: #ff0000;
}
.greyDay{
  color: #b3b3b3;
}
</style>
<template>
  <section class="wh_container">
    <div class="wh_content_all">
      <div class="wh_top_changge">
        <li @click="PreMonth(myDate,false)">
          <div class="wh_preMonth">上个月</div>
          <div class="wh_jiantou1"></div>
        </li>
        <li class="wh_content_li">{{dateTop}}</li>
        <li @click="NextMonth(myDate,false)">
          <div class="wh_nextMonth">下个月</div>
          <div class="wh_jiantou2"></div>
        </li>
      </div>
      <div class="wh_content">
        <div class="wh_content_item" v-for="(tag,index) in textTop" :key="index">
          <div class="wh_top_tag">{{tag}}</div>
        </div>
      </div>
      <div class="wh_content">
        <div class="wh_content_item" v-for="(item,index) in list" :key="index" @click="clickDay(item,index)">
          <div
            class="wh_item_date"
            v-bind:class="[{ wh_isMark: item.isMark},{wh_other_dayhide:item.otherMonth!=='nowMonth'},{wh_want_dayhide:item.dayHide},{wh_isToday:item.isToday},{wh_chose_day:item.chooseDay},setClass(item)]"
          >{{item.id}}</div>
          <div class="version_grouop" v-show="item.version"></div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import timeUtil from "./calendarJs";
export default {
  name: 'wh_container',
  data() {
    return {
      myDate: new Date(),
      list: [],
      historyChose: [],
      dateTop: ""
    };
  },
  props: {
    markDate: {
      type: Array,
      default: () => []
    },
    markDateMore: {
      type: Array,
      default: () => []
    },
    textTop: {
      type: Array,
      default: () => ["日","一", "二", "三", "四", "五", "六"]
    },
    sundayStart: {
      type: Boolean,
      default: () => false
    },
    agoDayHide: {
      type: String,
      default: `0`
    },
    futureDayHide: {
      type: String,
      default: `2554387200`
    },
    nowDate:{
      default: () => new Date()
    },
    versionGroup:{
      type: Array,
      default: () => []
    }
  },
  created() {
    this.intStart();
    this.myDate = this.nowDate
  },
  methods: {
    // 初始化开始的星期
    intStart() {
      timeUtil.sundayStart = this.sundayStart;
    },
    setClass(data) {
      let obj = {};
      obj[data.markClassName] = data.markClassName;
      return obj;
    },
    // 点击某一天时触发
    clickDay: function(item, index) {
      if (item.otherMonth === "nowMonth" && !item.dayHide) {
        this.getList(this.myDate, item.date);
      }
      if (item.otherMonth !== "nowMonth") {
        item.otherMonth === "preMonth"
          ? this.PreMonth(item.date)
          : this.NextMonth(item.date);
      }
    },
    // 没有被调用过
    ChoseMonth: function(date, isChosedDay = true) {
      date = timeUtil.dateFormat(date);
      this.myDate = new Date(date);
      this.$emit("changeMonth", timeUtil.dateFormat(this.myDate));
      if (isChosedDay) {
        this.getList(this.myDate, date, isChosedDay);
      } else {
        this.getList(this.myDate);
      }
    },
    // 点击上个月
    PreMonth: function(date, isChosedDay = true) {
      date = timeUtil.dateFormat(date);
      this.myDate = timeUtil.getOtherMonth(this.myDate, "preMonth");
      this.$emit("changeMonth", timeUtil.dateFormat(this.myDate));
      if (isChosedDay) {
        this.getList(this.myDate, date, isChosedDay);
      } else {
        this.getList(this.myDate);
      }
    },
    // 点击下个月
    NextMonth: function(date, isChosedDay = true) {
      date = timeUtil.dateFormat(date);
      this.myDate = timeUtil.getOtherMonth(this.myDate, "nextMonth");
      this.$emit("changeMonth", timeUtil.dateFormat(this.myDate));
      if (isChosedDay) {
        this.getList(this.myDate, date, isChosedDay);
      } else {
        this.getList(this.myDate);
      }
    },
    // 将传进来的日期规范化
    forMatArgs: function() {
      let markDate = this.markDate;
      let markDateMore = this.markDateMore;
      let versionGroup = this.versionGroup
      markDate = markDate.map(k => {
        return timeUtil.dateFormat(k);
      });
      markDateMore = markDateMore.map(k => {
        k.date = timeUtil.dateFormat(k.date);
        return k;
      });
      versionGroup = versionGroup.map(k=>{
        k.date = timeUtil.dateFormat(k.workDays)
        return k
      })
      return [markDate, markDateMore,versionGroup];
    },
    // 初始化全局数据
    getList: function(date, chooseDay, isChosedDay = true) {
      // 转换称标准的yyyy/MM/DD格式
      const [markDate, markDateMore,versionGroup] = this.forMatArgs();
      // 设置顶部年月
      this.dateTop = `${date.getFullYear()}年${date.getMonth() + 1}月`;
      let arr = timeUtil.getMonthList(this.myDate);
      for (let i = 0; i < arr.length; i++) {
        let markClassName = "";
        let k = arr[i];
        k.version = true
        k.chooseDay = false;
        const nowTime = k.date;
        const t = new Date(nowTime).getTime() / 1000;
        //看每一天的class
        for (const c of markDateMore) {
          if (c.date === nowTime) {
            markClassName = c.className || "";
            k.version = false
          }
        }
        // 判断是否是周六日
        if (new Date(nowTime).getDay() == 0 || new Date(nowTime).getDay() == 6) {
          k.version = false
        }
        // 判断是否是今天以后
        if (new Date()<new Date(nowTime)) {
          k.version = false
        }
        // 对未添加工时添加下方的红线
        for(const a of versionGroup){
          if (a.date === nowTime && a.workHours == '8') {
             k.version = false
          }
        }
        //标记选中某些天 设置class
        k.markClassName = markClassName;
        k.isMark = markDate.indexOf(nowTime) > -1;
        //无法选中某天
        k.dayHide = t < this.agoDayHide || t > this.futureDayHide;
        if (k.isToday) {
          this.$emit("isToday", nowTime);
        }
        let flag = !k.dayHide && k.otherMonth === "nowMonth";
        if (chooseDay && chooseDay === nowTime && flag) {
          this.$emit("choseDay", nowTime);
          this.historyChose.push(nowTime);
          k.chooseDay = true;
        } else if (
          this.historyChose[this.historyChose.length - 1] === nowTime &&
          !chooseDay &&
          flag
        ) {
          k.chooseDay = true;
        }
      }
      this.list = arr;
    }
  },
  // 在页面渲染前初始化列表
  mounted() {
    this.getList(this.myDate);
  },
  watch: {
    // 当被标记的日期改变时
    markDate: {
      handler(val, oldVal) {
        this.getList(this.myDate);
      },
      deep: true
    },
    // 当更多的标记被改变时
    markDateMore: {
      handler(val, oldVal) {
        this.getList(this.myDate);
      },
      deep: true
    },
    // 当某个日期之前不能点击改变
    agoDayHide: {
      handler(val, oldVal) {
        this.getList(this.myDate);
      },
      deep: true
    },
    // 某个日期之后不允许改变
    futureDayHide: {
      handler(val, oldVal) {
        this.getList(this.myDate);
      },
      deep: true
    },
    // 每月初始true周一开始 false周日开始
    sundayStart: {
      handler(val, oldVal) {
        this.intStart();
        this.getList(this.myDate);
      },
      deep: true
    },
    myDate:{
      handler(val,oldVal){
        let oldYear = new Date(oldVal).getFullYear()
        let oldMonth = new Date(oldVal).getMonth()
        let newYear = new Date(val).getFullYear()
        let newMonth = new Date(val).getMonth()
        if (oldYear == newYear) {
          if (oldMonth != newMonth) {
            this.$parent.changeHoliday(val)
          }
        } else {
          this.$parent.getHoliday(val)
        }
        this.getList(val);
      },
      deep: true
    },
    versionGroup: {
      handler(val,oldVal){
        this.getList(this.myDate)
      },
      deep: true,
      immediate: true
    }
  }
};
</script>
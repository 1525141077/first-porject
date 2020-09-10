<template>
  <div style="min-width:1024px">
    <!-- 左侧 -->
    <div style="display:inline-block;vertical-align: top;width: 23%">
      <div class="box-div you-what">
        <!-- <div style="margin-bottom:30px">
          <span
            style="margin-left:20px;margin-top:20px; color: #417095;width:70%;font-size:18px"
          >你可能要...</span>
          <button
            @click="goSystem"
            type="button"
            class="el-button el-button--primary home-btn"
            style="margin-top:15px;"
          >主页面</button>
          
        </div>-->
        <div>
          <el-form>
            <el-row>
              <el-col
                style="color: #417095;font-size:18px;padding-left:20px;padding-top:20px;"
                :span="12"
              >
                你可能要...
                <div style="border-bottom: 1px solid #417095;width:110px;"></div>
              </el-col>
              <el-col
                style="color: #417095;font-size:18px;padding-top:15px;padding-bottom:30px;text-align: right;padding-right: 5%;"
                :span="12"
              >
                <button
                  @click="goSystem"
                  type="button"
                  class="el-button el-button--primary home-btn"
                >主页面</button>
              </el-col>
              <el-col
                :span="8"
                style="text-align: center;margin-bottom: 20px"
                v-for="item in btnData"
              >
                <el-button class="white-btn">
                  {{item.name}}
                  <div style="border-bottom: 1px solid #417095;width:70px;"></div>
                </el-button>
              </el-col>
              <!-- <el-col :span="8" style="text-align: center;">
                <el-button class="white-btn">默认按钮</el-button>
              </el-col>
              <el-col :span="8" style="text-align: center;">
                <el-button class="white-btn">默认按钮</el-button>
              </el-col>-->
            </el-row>
          </el-form>
        </div>
      </div>
      <div class="box-div personal-job"></div>
    </div>
    <!-- 中间 -->
    <div style="display:inline-block;vertical-align: top;margin-left:5px;width: 43%;">
      <div class="box-div project-div">
        <div style="text-align: center;padding-top:20px;max-height: 740px;overflow: auto;">
          <span style="color: #417095;font-size:20px;">项目市集</span>
          <div
            style="border-bottom: 1px solid #417095;width:250px;margin:auto;margin-top: 20px;margin-bottom:30px"
          ></div>
          <el-row
            style="font-size:14px;width:98%;height:110px;border: 1px solid #ebebeb;border-radius: 3px;
            box-shadow: 0 0 8px 0 rgba(232, 237, 250, 0.6), 0 2px 4px 0 rgba(232, 237, 250, 0.5);margin:auto;background: #66b1ff2b;margin-bottom:20px"
            v-for="item in  projectMarket"
            v-bind:key="item.id"
          >
            <el-col :span="4" class="data-col">
              <div>{{item.data}}</div>
              <div>{{item.time}}</div>
            </el-col>
            <el-col :span="16" class="content-col">
              <div style="text-align:left;max-height:60px">{{item.content}}</div>
            </el-col>
            <el-col :span="4">
              <img
                src="../../assets/images/common/isOk.png"
                style="width:80px;height:80px"
                v-if="item.overOrOk == 2"
              />
              <img
                src="../../assets/images/common/isOver.png"
                style="width:80px;height:80px"
                v-else-if="item.overOrOk == 1"
              />
            </el-col>
            <el-col
              :span="24"
              style="text-align:right;padding-right:20px;"
            >￥{{item.moneyR | moneyFormat}}</el-col>
          </el-row>
        </div>
        <div
          style="font-size:16px;color:#336699;font-weight:bold;text-align:center;margin-top:10px"
        >
          <span style="cursor: pointer;">加载更多</span>
        </div>
      </div>
    </div>
    <!-- 右侧 -->
    <div style="display:inline-block;vertical-align: top;margin-left:5px;width: 32%;">
      <div class="box-div over-this">
        <el-row>
          <el-col
            style="color: #417095;font-size:18px;padding-left:20px;padding-top:20px;"
            :span="24"
          >
            你可能需要处理这些...
            <div style="border-bottom: 1px solid #417095;width:200px;"></div>
          </el-col>
          <el-col :span="2" style="display: flex;flex-direction: column;justify-content: center;align-items: center;height: 200px;">
            <img
              src="../../assets/images/common/arrowLeft.png"
              style="height:60px;"
            />
          </el-col>
          <el-col :span="20">
            <el-row>
              <el-col
                :span="8"
                style="padding-top:20px;text-align: center;"
                v-for="item in applyButton"
                v-bind:key="item.id"
              >
                <el-badge :value="12" class="item" style="margin: auto;">
                  <div class="prototype-div">
                    <label style="width: 35px;">{{item.name}}</label>
                  </div>
                </el-badge>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="2" style="display: flex;flex-direction: column;justify-content: center;align-items: center;height: 200px;">
            <img
              src="../../assets/images/common/arrowRight.png"
              style="height:60px;"
            />
          </el-col>
        </el-row>
      </div>
      <div class="box-div overProject-this">
        <el-row style="height:145px">
          <el-col
            style="color: #417095;font-size:18px;padding-left:20px;padding-top:20px;"
            :span="24"
          >
            你可能需要处理这些立项...
            <div style="border-bottom: 1px solid #417095;width:236px;"></div>
          </el-col>
          <el-col :span="12" style="padding-top:20px;text-align: center;">
            <div
              style="width:50px;
                height:50px;
                border: 1px solid #ebebeb;
                border-radius: 3px;
                box-shadow: 0 0 8px 0 rgba(232, 237, 250, 0.6), 0 2px 4px 0 rgba(232, 237, 250);
                margin: auto;
                font-weight: bold;
                text-align:center;
                line-height: 50px;"
            >{{beApproved}}</div>
            <span style="font-size:12px;color:rgb(65, 112, 149)">待立项</span>
          </el-col>
          <el-col :span="12" style="padding-top:20px;text-align: center;">
            <div
              style="width:50px;
                height:50px;
                border: 1px solid #ebebeb;
                border-radius: 3px;
                box-shadow: 0 0 8px 0 rgba(232, 237, 250, 0.6), 0 2px 4px 0 rgba(232, 237, 250);
                margin: auto;
                font-weight: bold;
                text-align:center;
                line-height: 50px;"
            >{{noApproved}}</div>
            <span style="font-size:12px;color:rgb(65, 112, 149)">暂不立项</span>
          </el-col>
        </el-row>
      </div>
      <div class="box-div top-ten">
        <el-form>
          <el-row>
            <el-col
              style="color: #417095;font-size:18px;padding-left:20px;padding-top:20px;"
              :span="24"
            >
              高价项目TOP10
              <div style="border-bottom: 1px solid #417095;width:155px;"></div>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
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
      btnData: [
        {
          name: "我要立项",
          urlGo: "",
        },
        {
          name: "我要竞聘",
          urlGo: "",
        },
        {
          name: "我要出差",
          urlGo: "",
        },
        {
          name: "我要报销",
          urlGo: "",
        },
        {
          name: "我要借款",
          urlGo: "",
        },
        {
          name: "我要开票",
          urlGo: "",
        },
        {
          name: "登记合同",
          urlGo: "",
        },
        {
          name: "新增到账",
          urlGo: "",
        },
      ],
      projectMarket: [
        {
          id: "1",
          data: "9月01日",
          time: "0:00",
          content:
            "河北区小王庄、河北区国印新村、河东区阳光里、河西区小海地小二楼和红桥区铃铛阁棚户区项目改造工程财务费用分摊审计",
          overOrOk: "",
          moneyR: "2600000",
        },
        {
          id: "2",
          data: "8月21日",
          time: "12:00",
          content: "某医院RFID资产管理系统",
          overOrOk: "1",
          moneyR: "0",
        },
        {
          id: "3",
          data: "8月18日",
          time: "17:00",
          content:
            "天津市滨海新区财政投资幼儿园建设、绿色生态屏障建设项目全过程跟踪评审咨询服务项目（工程咨询和会计师联合体项目）",
          overOrOk: "1",
          moneyR: "966000",
        },
        {
          id: "4",
          data: "8月18日",
          time: "12:00",
          content:
            "海泰博爱等五家项目公司清产核资、财务审计等工作和资产评估聘请中介机构项目",
          overOrOk: "2",
          moneyR: "1080000",
        },
        {
          id: "5",
          data: "8月11日",
          time: "17:00",
          content: "委托会计事务所尽职调查审计和债权价值分析咨询服务项目",
          overOrOk: "1",
          moneyR: "800000",
        },
      ],
      beApproved: "33",
      noApproved: "5",
      applyButton: [
        {
          id: "1",
          name: "报销申请",
          url: "",
        },
        {
          id: "2",
          name: "出差申请",
          url: "",
        },
        {
          id: "3",
          name: "发票申请",
          url: "",
        },
        {
          id: "4",
          name: "借款申请",
          url: "",
        },
        {
          id: "5",
          name: "待确认中选人",
          url: "",
        },
      ],
    };
  },
  components: {},
  mounted() {},
  methods: {
    goSystem() {},
  },
  filters: {
    // 转换算法主函数
    numberToChinese(n) {
      if (n) {
        let fraction = ["角", "分"];
        let digit = [
          "零",
          "壹",
          "贰",
          "叁",
          "肆",
          "伍",
          "陆",
          "柒",
          "捌",
          "玖",
        ];
        let unit = [
          ["元", "万", "亿"],
          ["", "拾", "佰", "仟"],
        ];
        let head = n < 0 ? "欠" : "";
        n = Math.abs(n);
        let s = "";
        for (let i = 0; i < fraction.length; i++) {
          s += (
            digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]
          ).replace(/零./, "");
        }
        s = s || "整";
        n = Math.floor(n);
        for (let i = 0; i < unit[0].length && n > 0; i++) {
          let p = "";
          for (let j = 0; j < unit[1].length && n > 0; j++) {
            p = digit[n % 10] + unit[1][j] + p;
            n = Math.floor(n / 10);
          }
          s = p.replace(/(零.)*零$/, "").replace(/^$/, "零") + unit[0][i] + s;
        }
        return (
          head +
          s
            .replace(/(零.)*零元/, "元")
            .replace(/(零.)+/g, "零")
            .replace(/^整$/, "零元整")
        );
      } else {
        return "--";
      }
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
  },
};
</script>

<style>
.el-main {
  padding: 10px;
  background: #ffffff;
}

.box-div {
  border: 1px solid #ebebeb;
  border-radius: 3px;
  box-shadow: 0 0 8px 0 rgba(232, 237, 250, 0.6),
    0 2px 4px 0 rgba(232, 237, 250, 0.5);
}

.you-what {
  /* width: 365px; */
  height: 260px;
  margin-bottom: 10px;
}

.personal-job {
  /* width: 365px; */
  height: 395px;
}

.project-div {
  /* width: 480px; */
  height: 815px;
}

.over-this {
  /* width: 400px; */
  height: 245px;
  margin-bottom: 10px;
}

.overProject-this {
  /* width: 400px; */
  height: 145px;
  margin-bottom: 10px;
}

.top-ten {
  /* width: 400px; */
  height: 400px;
}

.white-btn {
  width: 90px;
  height: 40px;
}

.home-btn {
  width: 90px;
  height: 40px;
}

.data-col {
  display: flex;
  align-items: center;
  height: 80px;
  justify-content: center;
  flex-direction: column;
}

.content-col {
  display: flex;
  align-items: center;
  height: 80px;
}

.prototype-div {
  cursor: pointer;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  border: 1px solid #dcdfe6;
  font-size: 12px;
  color: rgb(65, 112, 149);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.el-badge__content.is-fixed {
  top: 10px;
  right: 20px;
}
</style>

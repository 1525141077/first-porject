import {
    Message
  } from 'element-ui'
export default{
    /*
    *params: s:所传入的金额  n:保留几位小数 大于0 小于20 default 2
    */
    moneyFilter(s, n) {
        let lose = ""; //负号
        // 判断是否是数字
        if (typeof s !== "number" && isNaN(s)) {
            return "";
        }
        if (s != undefined && s != "") {
            if (s < 0) {
            //判断是否是负数
            s = (s + "").substring(1); //截取-号
            lose = "-";
            }
            n = n > 0 && n <= 20 ? n : 2;
            s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
            let l = s
                .split(".")[0]
                .split("")
                .reverse(),
            r = s.split(".")[1];
            let t = "";
            for (let i = 0; i < l.length; i++) {
            t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? "," : "");
            }
            return (
            lose +
            "" +
            t
                .split("")
                .reverse()
                .join("") +
            "." +
            r
            ); //拼接
        } else if (s === "") {
            return "";
        } else if (s === 0) {
            return "0.00"; //拼接
        }
    },
    // 将金额化字符传转化为number类型
    reMoney(s){
      if (s != "" && s != undefined) {
        //转成string类型
        s = s + "";
        return parseFloat(s.replace(/[^\d\.-]/g, ""));
      } else {
        return ''
      }
    },
    // 将数字转为大写
    NumToChinese(Num) {
        Num = Num + "";
        for (let i = Num.length - 1; i >= 0; i--) {
            Num = Num.replace(",", ""); //替换tomoney()中的“,”
            Num = Num.replace(" ", ""); //替换tomoney()中的空格
        }
        Num = Num.replace("￥", ""); //替换掉可能出现的￥字符
        if (isNaN(Num)) {
            //验证输入的字符是否为数字
            this.$message({
            message: '请检查小写金额是否正确',
            type: 'warning'
            })
            return;
        }
        //---字符处理完毕，开始转换，转换采用前后两部分分别转换---//
        let part = String(Num).split(".");
        let newchar = "";
        //小数点前进行转化
        for (let i = part[0].length - 1; i >= 0; i--) {
            if (part[0].length > 10) {
            this.$message({
            message: '位数过大无法计算',
            type: 'warning'
            })
            return "";
            } //若数量超过拾亿单位，提示
            let tmpnewchar = "";
            let perchar = part[0].charAt(i);
            switch (perchar) {
            case "0":
                tmpnewchar = "零" + tmpnewchar;
                break;
            case "1":
                tmpnewchar = "壹" + tmpnewchar;
                break;
            case "2":
                tmpnewchar = "贰" + tmpnewchar;
                break;
            case "3":
                tmpnewchar = "叁" + tmpnewchar;
                break;
            case "4":
                tmpnewchar = "肆" + tmpnewchar;
                break;
            case "5":
                tmpnewchar = "伍" + tmpnewchar;
                break;
            case "6":
                tmpnewchar = "陆" + tmpnewchar;
                break;
            case "7":
                tmpnewchar = "柒" + tmpnewchar;
                break;
            case "8":
                tmpnewchar = "捌" + tmpnewchar;
                break;
            case "9":
                tmpnewchar = "玖" + tmpnewchar;
                break;
            }
            switch (part[0].length - i - 1) {
            case 0:
                tmpnewchar = tmpnewchar + "元";
                break;
            case 1:
                if (perchar != 0) tmpnewchar = tmpnewchar + "拾";
                break;
            case 2:
                if (perchar != 0) tmpnewchar = tmpnewchar + "佰";
                break;
            case 3:
                if (perchar != 0) tmpnewchar = tmpnewchar + "仟";
                break;
            case 4:
                tmpnewchar = tmpnewchar + "万";
                break;
            case 5:
                if (perchar != 0) tmpnewchar = tmpnewchar + "拾";
                break;
            case 6:
                if (perchar != 0) tmpnewchar = tmpnewchar + "佰";
                break;
            case 7:
                if (perchar != 0) tmpnewchar = tmpnewchar + "仟";
                break;
            case 8:
                tmpnewchar = tmpnewchar + "亿";
                break;
            case 9:
                tmpnewchar = tmpnewchar + "拾";
                break;
            }
            newchar = tmpnewchar + newchar;
        }
        //小数点之后进行转化
        if (Num.indexOf(".") != -1) {
            if (part[1].length > 2) {
            $yt_alert_Model.prompt("小数点之后只能保留两位,系统将自动截段", 2000);
            part[1] = part[1].substr(0, 2);
            }
            for (let i = 0; i < part[1].length; i++) {
            let tmpnewchar = "";
            let perchar = part[1].charAt(i);
            switch (perchar) {
                case "0":
                tmpnewchar = "零" + tmpnewchar;
                break;
                case "1":
                tmpnewchar = "壹" + tmpnewchar;
                break;
                case "2":
                tmpnewchar = "贰" + tmpnewchar;
                break;
                case "3":
                tmpnewchar = "叁" + tmpnewchar;
                break;
                case "4":
                tmpnewchar = "肆" + tmpnewchar;
                break;
                case "5":
                tmpnewchar = "伍" + tmpnewchar;
                break;
                case "6":
                tmpnewchar = "陆" + tmpnewchar;
                break;
                case "7":
                tmpnewchar = "柒" + tmpnewchar;
                break;
                case "8":
                tmpnewchar = "捌" + tmpnewchar;
                break;
                case "9":
                tmpnewchar = "玖" + tmpnewchar;
                break;
            }
            if (i == 0) tmpnewchar = tmpnewchar + "角";
            if (i == 1) tmpnewchar = tmpnewchar + "分";
            newchar = newchar + tmpnewchar;
            }
        }
        //替换所有无用汉字
        while (newchar.search("零零") != -1)
            newchar = newchar.replace("零零", "零");
        newchar = newchar.replace("零亿", "亿");
        newchar = newchar.replace("亿万", "亿");
        newchar = newchar.replace("零万", "万");
        newchar = newchar.replace("零元", "元");
        newchar = newchar.replace("零角", "");
        newchar = newchar.replace("零分", "");
        if (
            newchar.charAt(newchar.length - 1) == "元" ||
            newchar.charAt(newchar.length - 1) == "角"
        )
            newchar = newchar + "整";
        //处理如果是无内容的给出--
        if (newchar == "元整") {
            newchar = "--";
        }
        //  document.write(newchar);
        return newchar;
    },
    /*
     *date：想要转换的事件
     *fmt：想要转换的格式 default yyyy-MM-dd
     */
    dateFormat(date,fmt = 'yyyy-MM-dd') {
        if (typeof date === 'string') {
            if (new Date(date) == 'Invalid Date') {
                Message({
                    message: '日期格式错误',
                    type: 'warning'
                })
                return date
            } else {
                date = new Date(date)
            }
        }
        var o = { 
            "M+" : date.getMonth()+1,                 //月份 
            "d+" : date.getDate(),                    //日 
            "h+" : date.getHours(),                   //小时 
            "m+" : date.getMinutes(),                 //分 
            "s+" : date.getSeconds(),                 //秒 
            "q+" : Math.floor((date.getMonth()+3)/3), //季度 
            "S"  : date.getMilliseconds()             //毫秒 
        }; 
        if(/(y+)/.test(fmt)) {
                fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length)); 
        }
         for(var k in o) {
            if(new RegExp("("+ k +")").test(fmt)){
                 fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
             }
         }
         return  fmt
    },
}
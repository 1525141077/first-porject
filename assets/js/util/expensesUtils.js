import { finadd, finsubtract } from './arithmetic.js' // 四则运算工具类

let timer // 函数防抖用计时

/**
 * 判空函数，val为null、空字符串、undefined时返回false；有值时返回true
 * @param {*} val  需要判断的值
 */
export const checkValIsEmpty = (val) => {
  return !(val === null || val === '' || val === undefined)
}


/**
 * 去除金额格式
 * @param {*} num 带千分位符号的金额，符号也会被去除
 */
export const finMoneyReplace = (num) => {
  if (!num || num === undefined || num === null || num === '') return 0.00
  return num.toString().replace(/[^\d.]/g, '')
}

/**
 * 去除金额格式
 * @param {*} num 带千分位符号的金额，符号也会被去除
 */
export const rmoney =  (num) => {
  num += ''
  return (num && num !== '0.00' && num !== 0) ? parseFloat(num.replace(/[^\d\.-]/g, '')) : '';
}

/**
 * 数字千分位格式化
 * @param {*} number 要格式化的数字
 * @param {*} decimals 保留几位小数
 * @param {*} decpoint 小数点符号
 * @param {*} thousandssep 千分位符号
 * @param {*} roundtag 舍入参数，默认 "ceil" 向上取,"floor"向下取,"round" 四舍五入
 */
export const finMoneyformat = (number, decimals, decpoint, thousandssep, roundtag) => {
  number = (number + '').replace(/[^0-9+-Ee.]/g, '')
  roundtag = roundtag || 'ceil' // "ceil","floor","round"
  let n = !isFinite(+number) ? 0 : +number
  let prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
  let sep = (typeof thousandssep === 'undefined') ? ',' : thousandssep
  let dec = (typeof decpoint === 'undefined') ? '.' : decpoint
  let s = ''
  s = (prec ? toFixedFix(n, prec, roundtag) : '' + Math.round(n)).split('.')
  var re = /(-?\d+)(\d{3})/
  while (re.test(s[0])) {
    s[0] = s[0].replace(re, '$1' + sep + '$2')
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || ''
    s[1] += new Array(prec - s[1].length + 1).join('0')
  }
  return s.join(dec)
}

/**
 * 小数截取
 * @param {*} n
 * @param {*} prec
 * @param {*} roundtag
 */
export const toFixedFix = (n, prec, roundtag) => {
  var k = Math.pow(10, prec)
  return '' + parseFloat(Math[roundtag](parseFloat((n * k).toFixed(prec * 2))).toFixed(prec * 2)) / k
}

/**
 * 对象深拷贝
 * @param {*} obj 要拷贝的对象
 */
export const cloneObjectFn = (obj) => {
  return JSON.parse(JSON.stringify((obj && obj !== undefined) ? obj : {}))
}

/**
 * 关键信息星号隐藏
 * @param { String } val 需要处理的值
 */
export const secretNum = (val) => {
  if (!val || val === undefined || val === '') return
  if (val.length <= 8) {
    return val
  } else {
    return val.substr(0, 4) + ' **** ****' + val.substr(-4)
  }
}

/**
 * 手机号星号隐藏
 * @param { String } val 需要处理的值
 */
export const phoneNumber = (val) => {
  if (!val || val === undefined) {
    return ''
  } else if (val.length < 11) {
    return val
  } else {
    return val.substr(0, 3) + ' **** ' + val.substr(-4)
  }
}

/**
 * 文本长度128 校验
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export const checkTextLenght = (rule, value, callback) => {
  if (value === null || value === undefined || value === '') {
    return callback(new Error(' ')) // new Error('请填写事由')
  } else if (value.length > 128) {
    return callback(new Error('事由长度不能超过128')) // new Error('事由长度超过128')
  } else {
    callback()
  }
}

/**
 * 正整数 校验
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export const checkNumIntNum = (rule, value, callback) => {
  const reg = /(^[+]{0,1}(\d+)$)/
  if (value === null || value === undefined || value === '') {
    return callback(new Error(' ')) // new Error('请填写数字')
  } else if (isNaN(value)) {
    return callback(new Error(' ')) // 不是数字
  } else if (!reg.test(value)) {
    return callback(new Error(' ')) // new Error('请填写正整数数字')
  } else {
    callback()
  }
}

/**
 * 一维数组 计算合计
 * @param {*} tableData 表格数据
 * @param {*} key 合计的字段
 */
export const calculationTableDataTotal = (tableData, key) => {
  let total = 0
  for (let i = 0; i < tableData.length; i++) {
    if (!isNaN(parseFloat(finMoneyReplace(tableData[i][key])))) {
      total = finadd(total, parseFloat(finMoneyReplace(tableData[i][key])))
    }
  }
  return total
}


// 防抖
export const debounce = (fn, that, delay, key) => {
  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(function () {
    console.log('输入')
    timer = fn(key)
  }, delay)
}

/**
 * 获取2个数组的交集
 * @param {Array} arr1 要查询的数组1
 * @param {Array} arr2 要查询的数组2
 * @returns {number} 返回交集数组
 */
export const intersect = (arr1, arr2) => {
  let sb = new Set(arr2)
  return arr1.filter(x => sb.has(x))
}

/**
 * 去除字符串空格
 * @param {String} str 需要处理的字符串
 * @param {String} trimType 处理的方式 left（去除左侧）/ right（去除右侧）/ all（去除两侧）
 * @returns {String} 处理完成的字符串
 */
export const replaceTrim = (str, trimType) => {
  if (!str) return ''
  let type = (checkValIsEmpty(trimType) ? trimType : 'all')
  if (type === 'left') return str.replace(/^\s*/, '')
  else if (type === 'right') return str.replace(/(\s*$)/g, '')
  else if (type === 'all') return str.replace(/^\s*|\s*$/g, '')
}


/**
 * 导出excel文件
 * @param data 需导出的流数据
 * @param fileName 文件名
 */
export const getExcel = (data, fileName) => {
  let blob = new Blob([data], {type: 'application/vnd.ms-excel'})
  let link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.download = fileName
  link.click()
}

/**
 * 从后台导出（下载）文件
 * @param action 文件下载路径   例：`${option.base_path}financialDetail/exportLotteryList?prjId=${prjId}&compMode=2`
 */
export const getExportFile = (action) => {
  let link = document.createElement('a')
  link.setAttribute('href', action)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}


/*
  *date：想要转换的事件
  *fmt：想要转换的格式 default yyyy-MM-dd
  */
 export const dateFormat = (date, fmt = 'yyyy-MM-dd') => {
  if (typeof date === 'string') {
    if (new Date(date) == 'Invalid Date') {
      this.$message.warning('日期格式错误')
      return date
    } else {
      date = new Date(date)
    }
  }
  var o = {
    "M+": date.getMonth() + 1,                 //月份 
    "d+": date.getDate(),                    //日 
    "h+": date.getHours(),                   //小时 
    "m+": date.getMinutes(),                 //分 
    "s+": date.getSeconds(),                 //秒 
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
    "S": date.getMilliseconds()             //毫秒 
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt
}

// 将数字转为大写
export const NumToChinese = (Num) => {
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
}

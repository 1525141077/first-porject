/*
 * 判断obj是否为一个整数
 */
let isInteger = obj => {
  return Math.floor(obj) === obj
}
/**
 * 将一个浮点数转成整数，返回整数和倍数。如 3.14 >> 314，倍数是 100
 * @param {*} floatNum
 * @return {object}
 *  {times:100, num: 314}
 */
let toInteger = floatNum => {
  var ret = {times: 1, num: 0}
  if (isInteger(floatNum)) {
    ret.num = floatNum
    return ret
  }
  var strfi = floatNum + ''
  var dotPos = strfi.indexOf('.')
  var len = strfi.substr(dotPos + 1).length
  var times = Math.pow(10, len)
  var intNum = Number(floatNum.toString().replace('.', ''))
  ret.times = times
  ret.num = intNum
  return ret
}
/**
 * 核心方法，实现加减乘除运算，确保不丢失精度
 * 思路：把小数放大为整数（乘），进行算术运算，再缩小为小数（除）
 *
 * @param {number} a 运算数1
 * @param {number} b 运算数2
 * @param {number} digits 精度，保留的小数点数，比如 2, 即保留为两位小数
 * @param {string} op 运算类型，有加减乘除（add/subtract/multiply/divide）
 */
let operation = (a, b, digits, op) => {
  var o1 = toInteger(a)
  var o2 = toInteger(b)
  var n1 = o1.num
  var n2 = o2.num
  var t1 = o1.times
  var t2 = o2.times
  var max = t1 > t2 ? t1 : t2
  var result = null
  switch (op) {
    case 'add':
      if (t1 === t2) { // 两个小数位数相同
        result = n1 + n2
      } else if (t1 > t2) { // o1 小数位 大于 o2
        result = n1 + n2 * (t1 / t2)
      } else { // o1 小数位 小于 o2
        result = n1 * (t2 / t1) + n2
      }
      return Number((result / max).toFixed(digits))
    case 'subtract':
      if (t1 === t2) {
        result = n1 - n2
      } else if (t1 > t2) {
        result = n1 - n2 * (t1 / t2)
      } else {
        result = n1 * (t2 / t1) - n2
      }
      return Number((result / max).toFixed(digits))
    case 'multiply':
      result = (n1 * n2) / (t1 * t2)
      return Number(result.toFixed(digits))
    case 'divide':
      result = (n1 / n2) * (t2 / t1)
      return Number(result.toFixed(digits))
  }
}
// 加减乘除的四个接口
let finadd = (a, b) => {
  return operation(Number(a), Number(b), 2, 'add')
}
let finsubtract = (a, b) => {
  return operation(Number(a), Number(b), 2, 'subtract')
}
let finmultiply = (a, b) => {
  return operation(Number(a), Number(b), 2, 'multiply')
}
let findivide = (a, b) => {
  return operation(Number(a), Number(b), 2, 'divide')
}

// 加减乘除的四个接口(自定义小数位)
let finaddDigits = (a, b, digits) => {
  return operation(Number(a), Number(b), digits, 'add')
}
let finsubtractDigits = (a, b, digits) => {
  return operation(Number(a), Number(b), digits, 'subtract')
}
let finmultiplyDigits = (a, b, digits) => {
  return operation(Number(a), Number(b), digits, 'multiply')
}
let findivideDigits = (a, b, digits) => {
  return operation(Number(a), Number(b), digits, 'divide')
}
export {isInteger, toInteger, operation, finadd, finsubtract, finmultiply, findivide, finaddDigits, finsubtractDigits, finmultiplyDigits, findivideDigits}

/* eslint-disable prefer-const */
// agileBPM 特定的一些过滤器

/**
 * 日期格式化。
 * 日期格式：
 * yyyy，yy 年份
 * MM 大写表示月份
 * dd 表示日期
 * HH 表示小时
 * mm 表示分钟
 * ss 表示秒
 * q  表示季度
 * 实例如下：
 * var now = new Date();
 * var nowStr = now.format("yyyy-MM-dd HH:mm:ss");
 * 注意：扩展属性时prototype，一定要用prototype["字段"]的形式，如果用prototype.字段ts会报错，NND
 */
Date.prototype['format'] = function (format: string) {
  let o = {
    'M+': this.getMonth() + 1, //month
    'd+': this.getDate(), //day
    'H+': this.getHours(), //hour
    'm+': this.getMinutes(), //minute
    's+': this.getSeconds(), //second
    'q+': Math.floor((this.getMonth() + 3) / 3), //quarter
    S: this.getMilliseconds(), //millisecond
  }

  if (/(y+)/.test(format)) {
    format = format.replace(
      RegExp.$1,
      `${this.getFullYear()}`.substr(4 - RegExp.$1.length)
    )
  }

  for (let k in o) {
    if (new RegExp(`(${k})`).test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length)
      )
    }
  }
  return format
}

// 日期格式化过滤器
export function ab_dateFormat(val: any, format: any) {
  if (!val) return ''

  if (typeof val == 'string') {
    val = strToDate(val, format)
  }
  return val.format(format)
}

const strToDate = function (dateStr: string, format: string) {
  if (!format) {
    format = 'yyyy-MM-dd'
  }
  const year =
    format.indexOf('yyyy') == -1
      ? 1
      : Number(dateStr.substr(format.indexOf('yyyy'), 4))
  const month =
    format.indexOf('MM') == -1
      ? 1
      : Number(dateStr.substr(format.indexOf('MM'), 2))
  const day =
    format.indexOf('dd') == -1
      ? 1
      : Number(dateStr.substr(format.indexOf('dd'), 2))
  const hour =
    format.indexOf('HH') == -1
      ? 1
      : Number(dateStr.substr(format.indexOf('HH'), 2))
  const minth =
    format.indexOf('mm') == -1
      ? 1
      : Number(dateStr.substr(format.indexOf('mm'), 2))
  const second =
    format.indexOf('ss') == -1
      ? 1
      : Number(dateStr.substr(format.indexOf('ss'), 2))
  const date = new Date(0)
  date.setFullYear(year || 1)
  date.setMonth(month - 1)
  date.setDate(day || 1)
  date.setHours(hour || 0)
  date.setMinutes(minth || 0)
  date.setSeconds(second || 0)
  return date
}

// 驼峰
String.prototype['tuoFeng'] = function () {
  return this.replace(/(_|-)(\w)/g, function (x) {
    return x.slice(1).toUpperCase()
  })
}

// 首字母大写的驼峰
String.prototype['tuoFengCap'] = function () {
  let tempStr = this['tuoFeng']()
  return (
    tempStr.substring(0, 1).toUpperCase() + tempStr.substring(1, tempStr.length)
  )
}

// 首字母小写
String.prototype['lowerFirst'] = function () {
  return this.charAt(0).toLowerCase() + this.slice(1)
}

// 首字母大写
String.prototype['upperFirst'] = function () {
  return this.charAt(0).toUpperCase() + this.slice(1)
}

// 驼峰转下划线
String.prototype['toUnderlineCase'] = function () {
  return (
    this.charAt(0).toLowerCase() +
    this.slice(1)
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase()
  )
}

/**
 * 多个参数，通过参数索引替换，
 * "{0} > {1} ".abArgFormat('A','B');  返回：A > B
 * 数组一个参数，通过数组索引替换，
 * "{0} > {1} ".abArgFormat(['A','B']); 返回：A > B
 * 一个对象参数，通过对象key替换
 * "{a} > {b} ".abArgFormat({a:'A',b:'B'}); 返回：A > B
 */
String.prototype['abArgFormat'] = function (args: any) {
  if (arguments.length == 0) {
    return this
  }
  let resultStr = this
  if (arguments.length == 1 && Array.isArray(args)) {
    for (let i = 0; i < args.length; i++) {
      resultStr = resultStr.replace(
        new RegExp(`\\{${i}\\}`, 'g'),
        // eslint-disable-next-line prefer-rest-params
        args[i]
      )
    }
    return resultStr
  }

  if (arguments.length == 1 && typeof args == 'object') {
    for (let key in args) {
      if (args[key] != undefined) {
        let reg = new RegExp(`({${key}})`, 'g')
        resultStr = resultStr.replace(reg, args[key])
      }
      // if (args[key].length <= 0) {
      //   resultStr = ''
      // }
    }
  }

  for (let i = 0; i < arguments.length; i++) {
    resultStr = resultStr.replace(
      new RegExp(`\\{${i}\\}`, 'g'),
      // eslint-disable-next-line prefer-rest-params
      arguments[i]
    )
  }
  return resultStr
}

//转换单位大小
export function renderSize(fileSize: string) {
  const unitArr = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  let index = 0
  let srcSize = parseFloat(fileSize)
  index = Math.floor(Math.log(srcSize) / Math.log(1024))
  let size = srcSize / Math.pow(1024, index)
  let val = size.toFixed(2) //保留的小数位数
  return val + unitArr[index]
}

import { abT } from '@/i18n'
// 通用的工具类,不能包含 平台 如element，路由 等js 工具类
// 如果涉及平台的工具类，请放在ab-tools
/**
 * 利用JSON深克隆对象
 * const a = AbUtil.clone(xxx)
 * @param obj
 * @returns
 */
export function clone(obj: any) {
  if (!obj) return null
  return JSON.parse(JSON.stringify(obj))
}

/**
 * 对象浅拷贝
 * @param src 拷贝源对象
 * @param dest 拷贝目标对象
 */
export function easyClone(src: object, dest = {}) {
  if (!src) {
    return dest
  }
  if (src instanceof Array) {
    console.warn(
      '请检查 浅copy类型，不支持数组，请直接使用 arr.slice(); 或者[...arr] 浅copy！'
    )
  }

  for (const propertyName in src) {
    dest[propertyName] = src[propertyName]
  }
  return dest
}

/**
 * 数组操作
 */
const AbHashCode = '$$abHashCode'
export const Arrays = {
  /**
   *  上移到顶部
   * @param idx
   * @param list
   * @returns
   */
  top: (idx: number, list: Array<any>) => {
    if (idx < 1) {
      return
    }
    const t = list[0]
    list[0] = list[idx]
    list[idx] = t
  },
  /**
   *  下移到底部
   * @param idx
   * @param list
   * @returns
   */
  bottom: (idx: number, list: Array<any>) => {
    if (idx >= list.length - 1) {
      return
    }
    const t = list[list.length - 1]
    list[list.length - 1] = list[idx]
    list[idx] = t
  },

  /**
   *上移一位
   * @param idx
   * @param list
   * @returns
   */
  up: (idx: number, list: Array<any>) => {
    if (idx < 1) {
      return
    }
    const t = list[idx - 1]
    list[idx - 1] = list[idx]
    list[idx] = t
  },
  /**
   *下移一位
   * @param idx
   * @param list
   * @returns
   */
  down: (idx: number, list: Array<any>) => {
    if (idx >= list.length - 1) {
      return
    }
    const t = list[idx + 1]
    list[idx + 1] = list[idx]
    list[idx] = t
  },
  /**
   * 删除
   * @param idx
   * @param list
   */
  del: (idx: number, list: Array<any>) => {
    list.splice(idx, 1)
  },
  /**
   * 删除指定对象
   * @param obj
   * @param list
   */
  remove: (obj: any, list: Array<any>) => {
    const idx = list.indexOf(obj)
    if (idx == -1) {
      return
    }
    list.splice(idx, 1)
  },
  /**
   * 计算出数组下一个递增sn的方法
   * 通常用于循环时的key标记（预防vue遍历时没唯一标识而渲染失误）
   * @param list
   * @param snName  ：字段
   */
  getNextSn(list: Array<any>, snName = 'sn') {
    let maxSn = 0
    list.forEach((c: any) => {
      maxSn = c[snName] > maxSn ? c[snName] : maxSn
    })
    return maxSn + 1
  },
  newAbSubList() {
    return new Proxy([], {
      set: (target, key, value) => {
        if (key != 'length' && value && !value[AbHashCode]) {
          if (target.length == 0) {
            value[AbHashCode] = `${AbRandom.GetRandomStr(3)}1`
          } else {
            let maxSn = 0
            let randomCode
            target.forEach((c: any) => {
              randomCode = c[AbHashCode].substring(0, 3)
              const num = Number.parseInt(c[AbHashCode].substring(3))
              maxSn = num > maxSn ? num : maxSn
            })
            randomCode = randomCode || AbRandom.GetRandomStr(3)
            value[AbHashCode] = randomCode + (maxSn + 1)
          }
        }
        return Reflect.set(target, key, value)
      },
    })
  },
}

/**
 *
 * @param x 把String 转成number
 * @returns
 */
export function toNumber(x: string) {
  if (x === null || x === undefined || x === '') return ''
  if (typeof x === 'string') {
    x = x.replace(/,/g, '')
  }
  const match = x.toString().match(/([$|￥])\d+\.?\d*/)
  if (match) {
    x = x.replace(match[1], '')
  }
  const val = Number(x)
  if (Number.isNaN(val)) return x
  return val
}

// 转成千分位。
export function comdify(v: string) {
  if (!v) return v
  const n = `${v}`
  const re = /\d{1,3}(?=(\d{3})+$)/g
  const n1 = n.trim().replace(/^(\d+)((\.\d+)?)$/, function (s, s1, s2) {
    return s1.replace(re, '$&,') + s2
  })
  return n1
}
/**
 * @param data list 转 树 结构，数据要有父子关系
 * @param root 根节点的标志
 * @param parentKey 父节点的字段
 * @param key key 子段
 * @returns
 */
export function listToTree(
  data: any,
  root: string,
  parentKey: string,
  key: string
) {
  if (!data || data.length < 0) {
    return []
  }
  const copyedData = data
  return copyedData.filter((parent: any) => {
    const child = copyedData.filter((item: any) => {
      return parent[key] == item[parentKey]
    })
    if (child.length > 0) {
      parent.children = child
    } else {
      parent.children = []
    }
    return parent[parentKey] == root
  })
}

export function timeLag(difference: number, level: number) {
  if (difference === 0) {
    return
  }
  let r = '',
    ////计算出相差天数
    days = Math.floor(difference / (24 * 3600 * 1000)),
    //计算出小时数
    leave1 = difference % (24 * 3600 * 1000), //计算天数后剩余的毫秒数
    hours = Math.floor(leave1 / (3600 * 1000)),
    //计算相差分钟数
    leave2 = leave1 % (3600 * 1000), //计算小时数后剩余的毫秒数
    minutes = Math.floor(leave2 / (60 * 1000)),
    //计算相差秒数
    leave3 = leave2 % (60 * 1000), //计算分钟数后剩余的毫秒数
    seconds = Math.round(leave3 / 1000)

  if (!level) {
    level = 2
  }
  if (days > 0) {
    level--
    r += `${days}${abT('page.common.day', '天')}`
    if (level == 0) return r
  }
  if (hours > 0) {
    level--
    r += `${hours}${abT('page.common.hour', '时')}`
    if (level == 0) return r
  }
  if (minutes > 0) {
    level--
    r += `${minutes}${abT('page.common.minute', '分')}`
    if (level == 0) return r
  }
  if (seconds > 0) {
    level--
    r += `${seconds}${abT('page.common.second', '秒')}`
    if (level == 0) return r
  }

  if (r) {
    return r
  }

  if (leave3) {
    return `${difference}${abT('page.common.millisecond', '毫秒')}`
  }

  return ''
}

export const AbRandom = {
  /**
   *  获取六位的随机数
   * @returns
   */
  randomNum6: function () {
    return this.GetRandomNum(100000, 900000)
  },
  GetRandomNum: (Min: number, Max: number) => {
    const Range = Max - Min
    const Rand = Math.random()
    return Min + Math.round(Rand * Range)
  },
  GetRandomList: (list: Array<any>) => {
    if (!list || list.length == 0) return ''

    const v = list[AbRandom.GetRandomNum(0, list.length - 1)]
    return v
  },
  GetRandomStr: (len: number) => {
    len = len || 32
    const $chars = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefhijklmnoprstuvwxyz'
    const maxPos = $chars.length
    let pwd = ''
    for (let i = 0; i < len; i++) {
      pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
    }
    return pwd
  },
}

/**
 * 金额过滤器 ： 可以把数字转成 大写金额
 */
export function convertCurrency(currencyDigits: string) {
  const MAXIMUM_NUMBER = 99999999999.99
  const CN_ZERO = '零'
  const CN_ONE = '壹'
  const CN_TWO = '贰'
  const CN_THREE = '叁'
  const CN_FOUR = '肆'
  const CN_FIVE = '伍'
  const CN_SIX = '陆'
  const CN_SEVEN = '柒'
  const CN_EIGHT = '捌'
  const CN_NINE = '玖'
  const CN_TEN = '拾'
  const CN_HUNDRED = '佰'
  const CN_THOUSAND = '仟'
  const CN_TEN_THOUSAND = '万'
  const CN_HUNDRED_MILLION = '亿'
  const CN_SYMBOL = ''
  const CN_DOLLAR = '元'
  const CN_TEN_CENT = '角'
  const CN_CENT = '分'
  const CN_INTEGER = '整'
  let integral
  let decimal
  let outputCharacters
  let parts
  let digits, radices, bigRadices, decimals
  let zeroCount
  let i, p, d
  let quotient, modulus
  if (!currencyDigits) {
    return ''
  }
  currencyDigits = currencyDigits.toString()
  if (currencyDigits == '') {
    return ''
  }
  if (currencyDigits.match(/[^,.\d]/) != null) {
    return ''
  }
  if (
    currencyDigits.match(
      /^((\d{1,3}(,\d{3})*(.((\d{3},)*\d{1,3}))?)|(\d+(.\d+)?))$/
    ) == null
  ) {
    return ''
  }
  currencyDigits = currencyDigits.replace(/,/g, '')
  currencyDigits = currencyDigits.replace(/^0+/, '')

  if (Number(currencyDigits) > MAXIMUM_NUMBER) {
    return ''
  }

  parts = currencyDigits.split('.')
  if (parts.length > 1) {
    integral = parts[0]
    decimal = parts[1]

    decimal = decimal.substr(0, 2)
  } else {
    integral = parts[0]
    decimal = ''
  }

  digits = [
    CN_ZERO,
    CN_ONE,
    CN_TWO,
    CN_THREE,
    CN_FOUR,
    CN_FIVE,
    CN_SIX,
    CN_SEVEN,
    CN_EIGHT,
    CN_NINE,
  ]
  radices = ['', CN_TEN, CN_HUNDRED, CN_THOUSAND]
  bigRadices = ['', CN_TEN_THOUSAND, CN_HUNDRED_MILLION]
  decimals = [CN_TEN_CENT, CN_CENT]

  outputCharacters = ''

  if (Number(integral) > 0) {
    zeroCount = 0
    for (i = 0; i < integral.length; i++) {
      p = integral.length - i - 1
      d = integral.substr(i, 1)
      quotient = p / 4
      modulus = p % 4
      if (d == '0') {
        zeroCount++
      } else {
        if (zeroCount > 0) {
          outputCharacters += digits[0]
        }
        zeroCount = 0
        outputCharacters += digits[Number(d)] + radices[modulus]
      }
      if (modulus == 0 && zeroCount < 4) {
        outputCharacters += bigRadices[quotient]
      }
    }
    outputCharacters += CN_DOLLAR
  }

  if (decimal != '') {
    for (i = 0; i < decimal.length; i++) {
      d = decimal.substr(i, 1)
      if (d != '0') {
        outputCharacters += digits[Number(d)] + decimals[i]
      }
    }
  }

  if (outputCharacters == '') {
    outputCharacters = CN_ZERO + CN_DOLLAR
  }
  if (decimal == '') {
    outputCharacters += CN_INTEGER
  }
  outputCharacters = CN_SYMBOL + outputCharacters
  return outputCharacters
}

/**
 * 处理流程中的人员信息
 *
 * @param assignInfo  user-用户名-用户id,org-组织名-组织id
 * @param separator 分隔符
 * @returns  （用户）用户名,(组织)组织名
 */
export function handleAssignInfo(assignInfo: string, separator: string) {
  if (!assignInfo || assignInfo.length == 0) {
    return
  }
  if (!separator) {
    separator = '-'
  }
  const assignInfoList = assignInfo.split(',')
  const resultList = []
  for (const item in assignInfoList) {
    const result = assignInfoList[item].split(separator)
    let type
    if (result[0] === 'role') {
      type = '角色'
    } else if (result[0] === 'org') {
      type = '组织'
    } else if (result[0] === 'group') {
      type = '小组'
    } else if (result[0] === 'post') {
      type = '岗位'
    } else if (result[0] === 'user') {
      type = '用户'
    }
    if (type) {
      resultList.push(`(${type})${result[1]}`)
    } else {
      resultList.push(result)
    }
  }
  return resultList.join(',')
}

/**
 * 树形结构数据默认展开两级
 *
 * @param treeData  树结构数据
 * @param nodeKey  树节点 唯一标识的属性
 */
export function expandTwoLevels(treeData: any, nodeKey: any) {
  const defaultExpanded: any = []
  treeData.forEach((item: any) => {
    if (item.children && item.children.length > 0) {
      item.children.forEach((itemChild: any) => {
        defaultExpanded.push(itemChild[nodeKey])
      })
    } else {
      defaultExpanded.push(item[nodeKey])
    }
  })
  return defaultExpanded
}

/**
 * 拼装get请求需要的url格式
 * eg：url:http://test.agilebpm.cn | data : {a:1,b:2}
 * 拼装成：http://test.agilebpm.cn?a=1&b=2
 * @param url
 * @returns
 */
export function assembleGetUrl(url: string, data: any = undefined) {
  if (data) {
    const p: string[] = []
    Object.keys(data).forEach((k) => {
      if (data[k]) {
        p.push(`${k}=${data[k]}`)
      }
    })
    if (!url.includes('?')) {
      url = `${url}?`
    }
    url = `${url}&${p.join('&')}`
  }
  return url.replace('\\?\\&', '?')
}

/**
 * 判断是否为外部资源
 */
export function isExternal(path: string): boolean {
  return /^(https?:|mailto:|tel:)/.test(path)
}

import { gp } from '@gp'
import { ElMessage } from 'element-plus'
function clipboardSuccess(text: any, showMsg = true) {
  if (showMsg) {
    ElMessage({
      message: abT('page.common.successCopy','拷贝成功') +"："+ text,
      type: 'success',
    })
  }
}

function clipboardError(text: any, showMsg = true) {
  if (showMsg) {
    ElMessage({
      message: abT('page.common.copyFailed','拷贝失败') +"："+ text,
      type: 'error',
    })
  }
}

/**
 * @description 复制数据
 * @param text
 */
export function handleClipboard(text: string, showMsg = true) {
  if (navigator.clipboard) {
    const { isSupported, copy } = useClipboard()
    if (!isSupported) {
      usePermission('clipboard-write')
    }
    copy(text)
      .then(() => {
        clipboardSuccess(text, showMsg)
      })
      .catch((err: any) => {
        console.log(err)
        clipboardError(text, showMsg)
      })
  } else {
    // 创建一个临时的textarea元素
    const textarea = document.createElement('textarea')
    textarea.value = text
    // 将textarea元素添加到DOM中
    document.body.appendChild(textarea)
    // 选中textarea中的文本
    textarea.select()
    // 执行复制命令
    document.execCommand('copy')
    // 移除临时的textarea元素
    document.body.removeChild(textarea)
    clipboardSuccess(text, showMsg)
  }
}

/**
 * AgileBPM 公网，不记名演示环境中，部分功能不开放测试权限，这里用代码提示联系商务体验
 * 域名为 demoa5.tongzhouyun.com 的地址会屏蔽部分功能
 * @returns
 */
export function checkIsPublicProject(isJustCheck?: boolean) {
  if (window?.location?.origin?.indexOf('demoa5.tongzhouyun.com') != -1) {
    if (isJustCheck) return true

    const confim = confirm('体验高级功能需要技术指导，即将跳转客服联系页...')
    if (confim) {
      window.location.href = 'https://www.tongzhouyun.com/contact'
    } else {
      window.location.href = '/index'
    }
    return true
  }

  return false
}

/**
 * 分离文件字符串的信息
 * eg：/path/to/file.txt
 * 分离出 {
 *  name:'file'
 *  ext:'txt'
 * }
 * @param filePath
 * @returns
 */
export function getFileInfo(filePath: any) {
  const fileName = filePath.substring(
    filePath.lastIndexOf('/') + 1,
    filePath.lastIndexOf('.')
  )
  const fileExtension = filePath.substring(filePath.lastIndexOf('.') + 1)
  return {
    name: fileName,
    ext: fileExtension,
  }
}

import JsBarcode from 'jsbarcode'
import QRCode from 'qrcode'

/**
 * 生成二维码
 * @param canvas  //二维码的存放位置
 * @param text    // 二维码的内容
 * @param options //二维码生成的配置
 * @param errorCallBack // 生成失败的回调
 */
export function generateQrCode(
  canvas: HTMLCanvasElement,
  text: string,
  errorCallBack: any = (error: any) => {},
  options: any = {
    margin: 1,
    color: {
      dark: '#000', //二维码的暗色（前景色）的颜色值（CSS颜色)
      light: '#fff', //二维码的亮色（背景色）的颜色值（CSS颜色）
    },
    errorCorrectionLevel: 'M', //二维码的纠错级别，可选值为"L"、“M”、“Q”、“H”，级别越高，纠错能力越强，但二维码尺寸也会变大
    type: 'canvas',
    background: 'white', //二维码的背景颜色
    width: 100, //二维码的宽度
    height: 100, //二维码的高度
  }
) {
  QRCode.toCanvas(canvas, text, options, (error: any) => {
    if (error) {
      errorCallBack(error)
    }
  })
}

/**
 * 生成条形码
 * @param canvas  //条形码的存放位置,在页面中存放的位置
 * @param text    //条形码的内容
 * @param options //条形码生成的配置
 */
export function generateBarCode(
  canvas: HTMLCanvasElement,
  text: string,
  options: any = {
    format: 'CODE128',
    height: 40,
    width: 1.3, //线宽
    lineColor: '#000', //线条颜色
    displayValue: false, //是否显示文字
    margin: 1, //设置条形码周围的空白区域
    //fontOptions: 'bold italic', //使文字加粗体或变斜体
    // font: 'fantasy', //设置文本的字体
    // textAlign: 'left', //设置文本的水平对齐方式
    // textPosition: 'top', //设置文本的垂直位置
    // textMargin: 5, //设置条形码和文本之间的间距
    // fontSize: 15, //设置文本的大小
    background: '#eee', //设置条形码的背景
  }
) {
  JsBarcode(canvas, text, options)
}

/**
 * 字符串对比忽略大小写
 * @param str1  //字符串1
 * @param str2  //字符串2
 */
export function compareStrings(str1: string, str2: string) {
  // 将两个字符串都转换为小写
  const lowerStr1 = str1.toLowerCase()
  const lowerStr2 = str2.toLowerCase()

  // 比较转换后的字符串
  return lowerStr1 === lowerStr2
}

/**
 * 一个对象 如果字段可能是大写或小写 环境区分
 * @param obj  // 对象
 * @param fieldName  // 字段名
 */
export function getPropertyIgnoreCase(obj: any, fieldName: any) {
  // 将字段名转换为小写，以忽略大小写
  const lowerFieldName = fieldName.toLowerCase()

  // 检查对象中是否存在大写或小写的属性
  if (obj.hasOwnProperty(fieldName) || obj.hasOwnProperty(lowerFieldName)) {
    // 根据属性名的大小写返回相应的属性值
    return obj[fieldName] || obj[lowerFieldName]
  }

  // 如果属性不存在，则返回undefined或错误信息
  return undefined
}

export function uuid() {
  const { v4: uuidv4 } = require('uuid');
  return  uuidv4()
}

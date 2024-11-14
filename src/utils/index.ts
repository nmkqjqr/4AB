/**
 * @description 格式化时间
 * @param time
 * @param cFormat
 * @returns {string|null}
 */
export function parseTime(time: any, cFormat: string) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj: any = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  }
  return format.replace(/{([ymdhisa])+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = `0${value}`
    }
    return value || 0
  })
}
/**
 * @description 格式化时间
 * @param time
 * @param option
 * @returns {string}
 */
export function formatTime(time: any, option: any) {
  if (`${time}`.length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d: Date = new Date(time)
  const now: number = Date.now()

  // @ts-ignore
  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return `${Math.ceil(diff / 60)}分钟前`
  } else if (diff < 3600 * 24) {
    return `${Math.ceil(diff / 3600)}小时前`
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return `${
      d.getMonth() + 1
    }月${d.getDate()}日${d.getHours()}时${d.getMinutes()}分`
  }
}

/**
 * @description 将url请求参数转为json格式
 * @param url
 * @returns {{}|any}
 */
export function paramObj(url: string) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    `{"${decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"')
      .replace(/\+/g, ' ')}"}`
  )
}

/**
 * @description 父子关系的数组转换成树形结构数据
 * @param data
 * @returns {*}
 */
export function translateDataToTree(data: any[]) {
  const parent = data.filter(
    (value) => value.parentId === 'undefined' || value.parentId === null
  )
  const children = data.filter(
    (value) => value.parentId !== 'undefined' && value.parentId !== null
  )
  const translator = (parent: any[], children: any[]) => {
    parent.forEach((_parent: any) => {
      children.forEach((current: any, index: number) => {
        if (current.parentId === _parent.id) {
          const temp = JSON.parse(JSON.stringify(children))
          temp.splice(index, 1)
          translator([current], temp)
          typeof _parent.children !== 'undefined'
            ? _parent.children.push(current)
            : (_parent.children = [current])
        }
      })
    })
  }
  translator(parent, children)
  return parent
}

/**
 * @description 树形结构数据转换成父子关系的数组
 * @param data
 * @returns {[]}
 */
export function translateTreeToData(data: any) {
  const result: any[] = []
  data.forEach((item: any) => {
    const loop = (data: any) => {
      result.push({
        id: data.id,
        name: data.name,
        parentId: data.parentId,
      })
      const child = data.children
      if (child) {
        for (let i = 0; i < child.length; i++) {
          loop(child[i])
        }
      }
    }
    loop(item)
  })
  return result
}

/**
 * @description 10位时间戳转换
 * @param time
 * @returns {string}
 */
export function tenBitTimestamp(time: number) {
  const date = new Date(time * 1000)
  const y = date.getFullYear()
  let m: string | number = date.getMonth() + 1
  m = m < 10 ? `${m}` : m
  let d: string | number = date.getDate()
  d = d < 10 ? `${d}` : d
  let h: string | number = date.getHours()
  h = h < 10 ? `0${h}` : h
  let minute: string | number = date.getMinutes()
  let second: string | number = date.getSeconds()
  minute = minute < 10 ? `0${minute}` : minute
  second = second < 10 ? `0${second}` : second
  return `${y}年${m}月${d}日 ${h}:${minute}:${second}` //组合
}

/**
 * @description 13位时间戳转换
 * @param time
 * @returns {string}
 */
export function thirteenBitTimestamp(time: number) {
  const date = new Date(time / 1)
  const y = date.getFullYear()
  let m: string | number = date.getMonth() + 1
  m = m < 10 ? `${m}` : m
  let d: string | number = date.getDate()
  d = d < 10 ? `${d}` : d
  let h: string | number = date.getHours()
  h = h < 10 ? `0${h}` : h
  let minute: string | number = date.getMinutes()
  let second: string | number = date.getSeconds()
  minute = minute < 10 ? `0${minute}` : minute
  second = second < 10 ? `0${second}` : second
  return `${y}年${m}月${d}日 ${h}:${minute}:${second}` //组合
}

/**
 * @description 获取随机id
 * @param length
 * @returns {string}
 */
export function uuid(length = 32) {
  const num = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
  let str = ''
  for (let i = 0; i < length; i++) {
    str += num.charAt(Math.floor(Math.random() * num.length))
  }
  return str
}

/**
 * @description m到n的随机数
 * @param m
 * @param n
 * @returns {number}
 */
export function random(m: number, n: number) {
  return Math.floor(Math.random() * (m - n) + n)
}

/**
 * @description addEventListener
 * @type {function(...[*]=)}
 */
export const on = (function () {
  return function (element: any, event: any, handler: any, useCapture = false) {
    if (element && event && handler) {
      element.addEventListener(event, handler, useCapture)
    }
  }
})()

/**
 * @description removeEventListener
 * @type {function(...[*]=)}
 */
export const off = (function () {
  return function (element: any, event: any, handler: any, useCapture = false) {
    if (element && event) {
      element.removeEventListener(event, handler, useCapture)
    }
  }
})()

/**
 * @description 数组打乱
 * @param array
 * @returns {*}
 */
export function shuffle(array: any[]) {
  let m = array.length,
    t,
    i
  while (m) {
    i = Math.floor(Math.random() * m--)
    t = array[m]
    array[m] = array[i]
    array[i] = t
  }
  return array
}

// 日期格式化
export function dateFormat(
  date: string | number | Date,
  fmt = 'yyyy-MM-dd hh:mm:ss'
) {
  date = new Date(date)
  const o = {
    'M+': date.getMonth() + 1, //月份
    'd+': date.getDate(), //日
    'h+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds(), //毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      `${date.getFullYear()}`.substr(4 - RegExp.$1.length)
    )
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length)
      )
    }
  }
  return fmt
}

import { sysApi } from '~/agilebpm'
// 下载文件
export function downFile(file: any) {
  const link = document.createElement('a')
  //创建一个a标签
  link.style.display = 'none'
  //将a标签隐藏
  link.href = sysApi.sysFile.getViewFileUrl(file.id)
  //给a标签添加下载链接  "域名+接口"  safe是一个动态的域名  后面的接口替换成你自己的下载接口
  link.setAttribute('download', file.name)
  // link.setAttribute('target', '_blank')
  // 此处注意，要给a标签添加一个download属性，属性值就是文件名称 否则下载出来的文件是没有属性的，空白白
  document.body.appendChild(link)
  //将上面创建的a标签加入到body的尾部
  link.click()
}

// 下载文件
export function downImgFile(file_name: any, content: any) {
  const csvData = new Blob([content])
  const a = document.createElement('a')
  document.body.appendChild(a)
  const url = window.URL.createObjectURL(csvData)
  a.href = url
  a.download = file_name
  a.click()
  a.remove()
  window.URL.revokeObjectURL(url)
}

// 下载文件
export function downLoadFile(fileName: any, content: any, contType: any) {
  const url = window.URL.createObjectURL(
    new Blob([content], { type: contType })
  )

  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link) // 下载完成移除元素
  window.URL.revokeObjectURL(url) // 释放掉blob对象
}

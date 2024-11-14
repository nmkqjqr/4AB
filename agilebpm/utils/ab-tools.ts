import { sysApi, abStoreAdaptor, request } from '../api'
import { abT } from '@/i18n'
import CryptoJS from 'crypto-js'
import { leEncryptionKey, storage } from '@/config'

// 平台的公共 JS ，可以涉及路由引用，
// 不同于 util，util 是可以与移动端公用的，不能包含 平台 如element，路由 等js 工具类

// 导出关闭tab的方法
export function closeTab(path: string) {
  const { closeTab } = abStoreAdaptor()
  closeTab(path)
}

/**
 * 表单校验
 * eg:
 * AbUtil.formValidate(formRef.value)?.then((data) => {
      console.info(data)
    })
 */
import { ElMessage, FormInstance } from 'element-plus'
export function formValidate(formEl: FormInstance | undefined) {
  if (!formEl) return
  return new Promise((resolve, reject) => {
    formEl.validate((valid, fields) => {
      if (valid) {
        resolve('表单校验成功!')
      } else {
        ElMessage({
          message: abT('page.common.completeForm', '请完善表单！'),
          type: 'warning',
        })
        reject('表单校验失败')
      }
    })
  })
}

import { ComponentInternalInstance, getCurrentInstance } from 'vue'
import { isJson } from '@/utils/validate'
export function useCurrentInstance() {
  const { appContext, refs } = getCurrentInstance() as ComponentInternalInstance
  const proxy = appContext.config.globalProperties
  return {
    proxy,
    refs,
  }
}
/**
 * 获取经过路由转换的url
 * @param url
 * @param proxy
 */
export function getResolveUrl(url: string, proxy: any) {
  const paramUrl = url.includes('?') ? url.substring(url.indexOf('?')) : '' //参数部分
  if (!url.startsWith('http')) {
    const routeData = proxy.$router.resolve({
      path: url,
      query: {},
    })
    url = routeData.href + paramUrl
  }
  return url
}

export function get(table: string) {
  let data = localStorage.getItem(table)
  try {
    data = JSON.parse(data || '0')
  } catch (err) {
    return null
  }
  return data
}

// 下载文件（在部分情况容易出问题，不建议使用）
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

// 下载文件（非Bolb方式，解决某些服务器下载不出来得问题）
export function downFile(file: any) {
  const link = document.createElement('a')
  //创建一个a标签
  link.style.display = 'none'
  //将a标签隐藏
  link.href = sysApi.sysFile.getViewFileUrl(file.id)
  //给a标签添加下载链接  "域名+接口"  safe是一个动态的域名  后面的接口替换成你自己的下载接口
  link.setAttribute('download', file.name) //跨域会导致文件名赋值失败，以id作为名称
  link.setAttribute('target', '_blank')
  // 此处注意，要给a标签添加一个download属性，属性值就是文件名称 否则下载出来的文件是没有属性的，空白白
  document.body.appendChild(link)
  //将上面创建的a标签加入到body的尾部
  link.click()
  document.body.removeChild(link)
}

//表单方式下载（不推荐使用）
export function downFileByFrom(file: any) {
  const url = window.location.origin
  // 获取页面（'?'前边的URL）链接
  const params = {
    // 参数
    Path: sysApi.sysFile.getViewFileUrl(file.id),
    FileName: file.name,
  }
  // 创建form
  const form = document.createElement('form')
  form.id = 'form'
  form.name = 'form'
  document.body.appendChild(form)
  // 循环创建input框
  for (const obj in params) {
    if (params.hasOwnProperty(obj)) {
      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = obj
      input.value = params[obj]
      form.appendChild(input)
    }
  }
  form.method = 'post' //请求方式
  form.action = url // 请求（下载）路径
  form.submit() // form表单提交
  document.body.removeChild(form) // 移除创建的元素
}

//下载2，先下载下来，然后用流创建标签下载 （*推荐用）
export async function downFileBySteam(file: any) {
  downBySteam(file.id, file.name)
}

//下载3，先下载下来，然后用流创建标签下载 参数更简单 （*推荐用）
export async function downBySteam(id: string, name: string) {
  try {
    let blob = await sysApi.sysFile.getDownload(id)
    // 在不同服务端有问题，有的会多包一层data，有的不包，此判断为了兼容所有服务端
    if (blob.data) {
      blob = blob.data
    }
    const downloadURL = (window.URL || window.webkitURL).createObjectURL(blob)
    const link = document.createElement('a')
    // 下载后文件的名字
    link.download = name
    link.href = downloadURL
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    //判断是否成功下载的标识，可以调用方自由判断并提示信息
    return true
  } catch (xhr: any) {
    // 从响应头中获取异常信息,如果包含中文的话会乱码因此 后台URLEncoder.encode() + 前台decodeURIComponent() 防止乱码
    const errorInfo = decodeURIComponent(xhr.getResponseHeader('errorInfo'))
    // 对错误信息进行打印
    console.log('下载失败：', errorInfo)
    //判断是否成功下载的标识，可以调用方自由判断并提示信息
    return false
  }
}
//加密存储类型
const cfg = {
  mode: CryptoJS.mode.ECB,
  padding: CryptoJS.pad.Pkcs7,
}

/**
 * 加密对象
 * @param data 需要加密的对象
 */
export function encrypt(data: string) {
  return CryptoJS.AES.encrypt(
    data,
    CryptoJS.enc.Utf8.parse(leEncryptionKey),
    cfg
  ).toString()
}

/**
 * 解密对象
 * @param data 需要解密的对象
 */
export function decrypt(data: any) {
  return CryptoJS.AES.decrypt(
    data,
    CryptoJS.enc.Utf8.parse(leEncryptionKey),
    cfg
  ).toString(CryptoJS.enc.Utf8)
}

/**
 * 加密对象（自定义key）
 * @param data 需要加密的对象
 */
export function encryptKey(data: string, key: any) {
  return CryptoJS.AES.encrypt(
    data,
    CryptoJS.enc.Utf8.parse(key),
    cfg
  ).toString()
}

/**
 * 加密对象（自定义key）
 * @param data 需要解密的对象
 */
export function decryptKey(data: any, key: any) {
  return CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(key), cfg).toString(
    CryptoJS.enc.Utf8
  )
}

/**
 *
 *  根据key从LocalStorage获取数据
 */
export function getEncryLocalStorage(key: string) {
  const value: string | null = decrypt(localStorage.getItem(key))
  return value && isJson(value) ? JSON.parse(value) : value
}
/**
 *
 *  加密数据后 放入LocalStorage
 */
export function setEncryLocalStorage(key: string, data: string) {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.setItem(key, encrypt(data))
    }
  }
}

/**
 * 解析 含有 freeMarker 变量的字符串eg：{userId$VIN: '${currentUserId}'}
 * 返回 解析后的字符串 eg：{userId$VIN:'1547622146554'}
 * @param str
 * @returns
 */
export async function parseStrByFreeMarker(str: string) {
  if (!str) {
    return str
  }
  const res = await sysApi.tools.parseStrByFreeMarker(str)
  if (res.data) {
    return res.data
  }
  return str
}

/**
 * 获取窗口大小
 */
export function getClientHeight() {
  let clientHeight = 0
  if (document.body.clientHeight && document.documentElement.clientHeight) {
    clientHeight =
      document.body.clientHeight < document.documentElement.clientHeight
        ? document.body.clientHeight
        : document.documentElement.clientHeight
  } else {
    clientHeight =
      document.body.clientHeight > document.documentElement.clientHeight
        ? document.body.clientHeight
        : document.documentElement.clientHeight
  }
  return clientHeight
}

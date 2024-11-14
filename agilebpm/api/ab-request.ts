// request 方法，只做请求的数据的输出和错误拦截提示，不要牵扯系统业务，例如路由的回调,store的注入等
//【适配点 1 request 封装】
import request from './ab-request-axios'
export default request
//【适配点 2 后端服务地址获取】

import {
  baseURL as abBaseUrl,
  leEncryptionKey,
  isEncrySign,
} from './../../src/config'
export { abBaseUrl }
import { getToken } from '@/utils/token'
import CryptoJS from 'crypto-js'

/**
 * 发post请求
 * eg:AbUtil.postData(URL,{a:1,b:2}).then((data)=>{})
 * @param url
 * @param data
 * @returns
 */
export function postData(url: string, data: any = {}) {
  return request({
    url: url,
    method: 'post',
    data,
  })
}

/**
 * 发送Form表单请求
 *
 * @param url 请求地址
 * @param data 请求数据
 * @returns request
 */
export function postForm(url: string, data: any = {}) {
  return request({
    url: url,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  })
}

/**
 * 发get请求
 * eg1:
 * let url = `${URL}?a=${a}&b=${b}`
 * AbUtil.getData(this.url).then((data)=>{})
 * eg2:
 * let url = `${URL}`
 * let data = {a:1,b:2}
 * AbUtil.getData(this.url,data).then((data)=>{})
 * @param url
 * @returns
 */
export function getData(url: string, data: any = undefined) {
  return request({
    url: getDataUrl(url, data),
    method: 'get',
  })
}
export function getDataUrl(url: string, data: any = undefined) {
  if (data) {
    const p: string[] = []
    Object.keys(data).forEach((k) => {
      if (data[k] || data[k] == false) {
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

const getEncryptStr = (data: string, url: string) => {
  if (isEncrySign) {
    const token = getToken()
    if (token && url) {
      const timeStr = new Date().getTime()
      const sign = CryptoJS.MD5(
        url.split('?')[0] + token + timeStr + leEncryptionKey + data
      ).toString()
      return timeStr + sign
    }
  }
  return ''
}

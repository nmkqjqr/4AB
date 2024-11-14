// 引入配置文件
import {
  // 后台地址
  baseURL,
  // 配后端数据的接收方式application/json;charset=UTF-8
  contentType,
  debounce,
  messageName,
  requestTimeout,
  statusName,
  successCode,
  storage,
  tokenTableName,
  tokenName,
  tokenPrex,
  loginTimeOutIsJumpLoginPage,
  leEncryptionKey,
  isEncrySign,
} from './../../src/config'
import useAbStoreAdapter from './ab-store'

import qs from 'qs'
import { gp } from '@gp'
import { ElMessage } from 'element-plus'
import cookie from 'js-cookie'
import CryptoJS from 'crypto-js'

let loadingInstance: any
const whiteList = [
  '/ab-org/auth/login',
  '/ab-bpm/sys/quickLogin/qywx',
  '/ab-org/auth/authToken',
]
const CODE_MESSAGE: any = {
  200: '服务器成功返回请求数据',
  201: '新建或修改数据成功',
  202: '一个请求已经进入后台排队(异步任务)',
  204: '删除数据成功',
  400: '发出信息有误',
  401: '登录超时',
  402: '令牌过期',
  403: '用户得到授权，但是访问是被禁止的',
  404: '访问资源不存在',
  406: '请求格式不可得',
  410: '请求资源被永久删除，且不会被看到',
  500: '服务器发生错误',
  502: '服务器通信异常，请稍后再试',
  503: '服务不可用，服务器暂时过载或维护',
  504: '网关超时',
}

/**
 * axios响应拦截器
 * @param config 请求配置
 * @param data response数据
 * @param status HTTP status
 * @param statusText HTTP status text
 * @returns {Promise<*|*>}
 */
const handleData = async ({ config, data, status, statusText }: any) => {
  if (loadingInstance) loadingInstance.close()
  // 若data.code存在，覆盖默认code
  let code = data && data[statusName] ? data[statusName] : status
  // 若code属于操作正常code，则status修改为200
  if (successCode.indexOf(data[statusName]) + 1) code = 200
  if (data.scriptLog) {
    console.info('服务脚本日志：')
    console.info(data.scriptLog)
  }
  switch (code) {
    case 200:
      // 业务层级错误处理，以下是假定restful有一套统一输出格式(指不管成功与否都有相应的数据格式)情况下进行处理
      // 例如响应内容：
      // 错误内容：{ code: 1, msg: '非法参数' }
      // 正确内容：{ code: 200, data: {  }, msg: '操作正常' }
      // return data
      return data
    case 401:
      // 跳转路由
      break
    case 403:
      // 跳转无权限
      break
  }
  // 异常处理
  // 若data.msg存在，覆盖默认提醒消息
  if (whiteList.indexOf(config.url) !== -1 && code != 500 && code != 404) {
    return Promise.reject(data)
  }
  const errMsg = `${
    data && data[messageName]
      ? data[messageName]
      : CODE_MESSAGE[code]
      ? CODE_MESSAGE[code]
      : statusText
  }`
  // 是否显示高亮错误(与errorHandler钩子触发逻辑一致)

  if (errMsg === '登录超时') {
    const token = getToken()
    resetAllToken()
    window.setTimeout(() => {
      // 如果登录超时，或者重新免登后了则不提示异常
      if (token != getToken()) {
        return
      }

      ElMessage({
        dangerouslyUseHTMLString: true,
        message: errMsg,
        type: 'error',
      })
    }, 500)
  } else {
    ElMessage({
      dangerouslyUseHTMLString: true,
      message: errMsg ? errMsg.replaceAll('\n', '<br/>') : '',
      type: 'error',
    })
  }
  return Promise.reject(data)
}

/**
 * @description axios初始化
 */
const instance = axios.create({
  baseURL,
  timeout: requestTimeout,
  headers: {
    'Content-Type': contentType,
  },
  withCredentials: true,
})

function sortObject(jsonObj: any) {
  return Object.keys(jsonObj)
    .filter(
      (key) =>
        jsonObj[key] !== null &&
        jsonObj[key] !== '' &&
        typeof jsonObj[key] !== 'object'
    )
    .sort()
    .reduce((sortedObj, key) => {
      sortedObj[key] = jsonObj[key]
      return sortedObj
    }, {})
}

const sortJsonObjectAndExtract = (jsonObj: any) => {
  let values = []
  //数组
  if (Array.isArray(jsonObj)) {
    values = jsonObj
      .filter(
        (key) =>
          typeof key !== 'object' &&
          typeof key !== 'function' &&
          key !== null &&
          key !== 'null' &&
          key !== ''
      )
      .sort()
      .slice(0, 10)
  } else if (typeof jsonObj === 'object') {
    //对象
    values = Object.keys(jsonObj)
      .filter(
        (key) =>
          typeof jsonObj[key] !== 'object' &&
          typeof jsonObj[key] !== 'function' &&
          /[\r\n\t"'[\]{}()=]/.test(jsonObj[key]) == false &&
          jsonObj[key] !== undefined &&
          jsonObj[key] !== null &&
          jsonObj[key] !== 'null' &&
          jsonObj[key] !== ''
      )
      .sort()
      .map((key) => jsonObj[key])
      .slice(0, 10)
  }

  //处理boolean类型
  values = values.map((item) => {
    return typeof item === 'boolean' ? item.toString() : item
  })
  //处理number类型
  values = values.map((item) => {
    return typeof item === 'number' ? item.toString() : item
  })
  return values.join(', ')
}
const dealGetUrlParams = (url: string, param: Object) => {
  const urlObj = new URL(url, window.location.href)
  const searchParams = new URLSearchParams(urlObj.search)
  param = param == undefined ? {} : param
  if (searchParams.toString()) {
    // 遍历查询参数并填充对象
    for (const [key, value] of searchParams) {
      if (!(key in param)) {
        param[key] = value
      }
    }
  }
  return param
}

/**
 * @description axios请求拦截器
 */
instance.interceptors.request.use(
  (config: any) => {
    const token = getToken() ? getToken() : '' //  最新写法（解决打开多个页签未获取到最新token）
    if (isEncrySign) {
      if (config.url) {
        const timeStr = new Date().getTime()
        let paramsStr = ''
        if (config.method == 'get') {
          paramsStr = sortJsonObjectAndExtract(
            dealGetUrlParams(config.url.replace('\\?\\&', '?'), config.params)
          )
        }
        if (config.method == 'post' && config.data) {
          paramsStr = sortJsonObjectAndExtract(config.data)
        }

        const sign = CryptoJS.MD5(
          config.url.split('?')[0] +
            token +
            timeStr +
            leEncryptionKey +
            paramsStr
        ).toString()
        config.headers['Encrypt-Sign'] = timeStr + sign
      } else {
        config.headers['Encrypt-Sign'] = ''
      }
    }

    const language = useAbStoreAdapter().getLanguage

    // 不规范写法 可根据setting.config.js tokenName配置随意自定义headers
    // if (token) config.headers[tokenName] = token
    // 规范写法 不可随意自定义
    if (token) config.headers[tokenName] = `${tokenPrex}${token}`
    // 设置请求语言
    if (language) config.headers['Accept-Language'] = language

    if (
      config.data &&
      config.headers['Content-Type'] ===
        'application/x-www-form-urlencoded;charset=UTF-8'
    )
      config.data = qs.stringify(config.data)
    if (debounce.some((item) => config.url.includes(item)))
      loadingInstance = gp.$baseLoading()
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * @description axios响应拦截器
 */
instance.interceptors.response.use(
  (response) => handleDataBefore(response),
  (error) => {
    const { response } = error
    if (response === undefined) {
      if (loadingInstance) loadingInstance.close()
      ElMessage({
        message:
          '连接后台接口失败，可能由以下原因造成：后端不支持跨域CORS、接口地址不存在、请求超时等，请联系管理员排查后端接口问题 ',
        type: 'error',
      })
      return Promise.reject(error)
    } else return handleData(response)
  }
)

const handleDataBefore = (response: any) => {
  if (isExportFile(response)) {
    return response
  }
  licenceInfoIntercept(response)
  return response.config['skipHandleData']
    ? response.data
    : handleData(response)
}

const isExportFile = (response: any) => {
  if (response.headers['content-disposition']) {
    const fileSetting = decodeURIComponent(
      response.headers['content-disposition'].split('=')[0]
    )
    if (fileSetting && fileSetting.startsWith('attachment;filename')) {
      return true
    }
  }
  return false
}
const licenceInfoIntercept = (response: any) => {
  if (
    Object.keys(response.headers).some(
      (headerName) => headerName.toUpperCase() === 'AB-PRODUCT-PAST'
    )
  ) {
    ;(window as any).abPast = true
    // eslint-disable-next-line no-prototype-builtins
  } else if (window.hasOwnProperty('abPast')) {
    delete window['abPast']
  }
}

export default instance

function resetAllToken() {
  // 登录不退出则不清楚
  if (!loginTimeOutIsJumpLoginPage) return

  if (storage) {
    if ('localStorage' === storage) {
      localStorage.removeItem('refreshToken')
      localStorage.removeItem(tokenTableName)
    } else if ('sessionStorage' === storage) {
      sessionStorage.removeItem(tokenTableName)
    } else if ('cookie' === storage) {
      cookie.remove(tokenTableName)
    } else {
      localStorage.remove(tokenTableName)
    }
  } else {
    localStorage.remove(tokenTableName)
  }
}

function getToken() {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.getItem(tokenTableName)
    } else if ('sessionStorage' === storage) {
      return sessionStorage.getItem(tokenTableName)
    } else if ('cookie' === storage) {
      return cookie.get(tokenTableName)
    } else {
      return localStorage.getItem(tokenTableName)
    }
  } else {
    return localStorage.getItem(tokenTableName)
  }
}

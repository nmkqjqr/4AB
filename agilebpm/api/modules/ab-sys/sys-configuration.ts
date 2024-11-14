import { getData, postData } from './../../ab-request'
import request from './../../ab-request'

const servicePrefix = '/ab-bpm/sys/sysConfiguration'

// 登录页面获取公司信息
export const getCompanyConfig = `${servicePrefix}/getConfByCode/companyConfig`
export function getCompanyConfigInfo() {
  return request({
    url: `${servicePrefix}/getConfByCode/companyConfig`,
    method: 'get',
  })
}

//获取企业微信配置
export function getQywxConf() {
  return request(`${servicePrefix}/getConfByCode/qywx`)
}

//获取钉钉系统配置
export function getDDConf() {
  return request(`${servicePrefix}/getConfByCode/dd`)
}

//根据code获取对应配置
export function getConfByCode(code: string) {
  return request(`${servicePrefix}/getConfByCode/${code}`)
}

export function getSysConfObj(code: string) {
  return getData(`${servicePrefix}/getConfObjByCode/${code}`)
}

export function getSysConfig(code: string) {
  return getData(`${servicePrefix}/getSysConfig/${code}`)
}

export function saveSysConfObj(param: any) {
  return postData(`${servicePrefix}/save`, param)
}

//获取流程相关配置
export function getFlowConf() {
  return request(`${servicePrefix}/getConfByCode/flowConf`)
}

//根据code获取对应配置
export function getSysProperties(codes: string) {
  return request({
    url:`${servicePrefix}/getSysProperties`,
    method: 'get',
    params: {
      codes: codes,
    }
  })
}

//根据code启用禁用
export function changeEnableByCode(code: string) {
  return getData(`${servicePrefix}/changeEnableByCode?code=`+code)
}

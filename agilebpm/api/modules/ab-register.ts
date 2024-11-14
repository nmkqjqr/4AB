import request from './../../api/ab-request'
import { orgServicePrefix } from './../ab-api-prefix'
const servicePrefix = '/ab-bpm/sys'

export async function login(data: any) {
  return request({
    url: `/ab-org/auth/login`,
    method: 'post',
    data,
  })
}

// 企业微信获取jsapi Signature
export function quickLoginInfo() {
  return request(`${servicePrefix}/quickLogin/quickLoginInfo`)
}

// 企业微信获取jsapi Signature
export function qywxGetJsapiSignature(code: string) {
  return request(`${servicePrefix}/quickLogin/qywxGetJsapiSignature`)
}

// 企业微信扫码登录
export function qywxLogin(code: string) {
  return request(`${servicePrefix}/quickLogin/qywx?code=${code}`)
}
//钉钉自动登录
export function ddAutoLogin(code: string) {
  return request(`${servicePrefix}/quickLogin/dd?code=${code}`)
}

//钉钉扫码登录
export function ddScanLogin(code: string) {
  return request(`${servicePrefix}/quickLogin/ddScanLogin?code=${code}`)
}
//同步钉钉配置
export function sycnDdData(isAdd: boolean, isSycnOrg: boolean) {
  return request({
    url: `${servicePrefix}/thirdService/ddSycnOrg?isAdd=${isAdd}&isSycnOrg=${isSycnOrg}`,
    method: 'post',
  })
}

//同步钉钉配置
export function verificationCode(
  sendType: boolean,
  number: string,
  encryption: string
) {
  return request({
    url: `${servicePrefix}/thirdService/verificationCode`,
    method: 'post',
    data: {
      sendType: sendType,
      number: number,
      encryption: encryption,
    },
  })
}

//校验token是否有效
export function authToken() {
  return request(`/ab-org/auth/authToken`)
}

export async function refreshToken(data: any) {
  return request({
    url: `/ab-org/auth/refreshToken`,
    method: 'post',
    // headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    // },
    data,
  })
}

export async function socialLogin(data: any) {
  return request({
    url: '/socialLogin',
    method: 'post',
    data,
  })
}

export function getUserInfo() {
  return request({
    url: '/ab-bpm/sys/userResource/userMsg',
    method: 'get',
  })
}

export function getIsExpire() {
  return request({
    url: '/ab-bpm/sys/userResource/getIsExpire',
    method: 'get',
  })
}

export const getUserAvatar =  '/ab-bpm/sys/userResource/getUserAvatar?id='

export const changeSystemUrl = '/ab-bpm/sys/userResource/switchApp/'

export const changeOrgUrl = '/ab-bpm/sys/userResource/changeOrg?id='

export function logout() {
  return request({
    url: `/ab-org/auth/logout`,
    method: 'get',
  })
}

export function exitSystem() {
  return request({
    url: `/ab-org/auth/exitSystem`,
    method: 'get',
  })
}

export function register(data: any) {
  return request({
    url: `${orgServicePrefix}/user/register`,
    method: 'post',
    data,
  })
}

export function getPhoneVerifyCode(phoneNumber: String) {
  return request({
    url: `${orgServicePrefix}/user/sendCaptchaPhone?phone=${phoneNumber}`,
    method: 'get',
  })
}

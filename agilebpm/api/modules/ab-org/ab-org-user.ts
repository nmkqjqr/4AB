import request, { postData } from './../../ab-request'
import { orgServicePrefix as servicePrefix } from '../../ab-api-prefix'

// 用户-列表
export const OrgUserListUrl = servicePrefix + '/user/listJson'

// 用户-移除
export const OrgUserRemoveUrl = servicePrefix + '/user/remove?id='

// 用户-获取
export const OrgUserGetUrl = servicePrefix + '/user/getUserVO?id='

// 用户-保存
export const OrgUserSaveUrl = servicePrefix + '/user/saveUserDto'

// 用户-重置密码
export const OrgUserResetPwdUrl = servicePrefix + '/user/resetUserPassword?id='

// 用户-修改状态
export const OrgUserUpdateStatusUrl =
  servicePrefix + '/user/updateUserStatus?id='

// 用户-登录
export async function login(data: any) {
  return request({
    url: servicePrefix + '/auth/login/valid',
    method: 'post',
    data,
  })
}

// 用户-登录-获取验证码
export async function getCode(uuid: string) {
  return request({
    url: servicePrefix + '/auth/login/getCode',
    method: 'get',
    responseType: 'blob',
    params: {uuid : uuid},
  })
}

// 用户-登录-获取验证码开关
export async function queryCaptchaSwitch() {
  return request({
    url: servicePrefix + '/auth/login/queryCaptchaSwitch',
    method: 'get',
  })
}

//导入用户
export const OrgUserImport = servicePrefix + '/user/import'

//导出模版
export function OrgUserExportTemplate() {
  return request({
    url: `${servicePrefix}/user/exportTemplate`,
    method: 'POST',
    responseType: 'blob',
  })
}

//获取个人中心
export const getUserInfo = servicePrefix + '/user/getUserInfo'

//保存个人中心
export const saveUserInfo = servicePrefix + '/user/saveUserInfo'

export const getPwdCheckRule = servicePrefix + '/user/getPwdCheckRule'

export const updatePwdIsLogOut = servicePrefix + '/user/updatePwdIsLogOut'

export const sendCaptcha = servicePrefix + '/user/sendCaptcha'

export const forgotPassword = servicePrefix + '/user/forgotPassword'

export const updateUserPassWorldUrl =
  servicePrefix + '/user/updateUserPassWorld'

export const resetUserPassWorldUrl = servicePrefix + '/user/resetUserPassWorld'

export const getUserByGroupUrl = servicePrefix + '/user/getUserByGroup'

export async function getUserByGroup(data: any) {
  return request({
    url: getUserByGroupUrl,
    method: 'get',
    params: data,
  })
}

export async function register(data: any) {
  return request({
    url: servicePrefix + '/user/register',
    method: 'post',
    data,
  })
}

/**
 * 绑定子帐户
 * @param bossUserId 主帐户ID
 * @param userIds 子帐户ID集
 */
export async function bindSubAccount(
  bossUserId: string,
  userIds: Array<string>
) {
  return request({
    url: servicePrefix + '/user/bindSubAccount',
    method: 'POST',
    data: { bossUserId, userIds },
  })
}

/**
 * 切换子用户
 * @param userId 用户ID
 */
export async function switchSubUser(userId: string) {
  return request({
    url: `${servicePrefix}/auth/switchSubUser/${userId}`,
    method: 'GET',
  })
}

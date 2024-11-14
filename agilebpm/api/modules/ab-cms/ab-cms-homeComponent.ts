import { getData } from './../../ab-request'
const servicePrefix = '/ab-bpm/cms'

// 首页组件 列表接口
export const cmsHomeListUrl = servicePrefix + '/cmsHome/listJson'
// 首页组件 get详情接口
export const cmsHomeGetUrl = servicePrefix + '/cmsHome/getHome?id='
// 首页组件 修改状态接口
export const cmsHomeSaveOrUpdateUrl = servicePrefix + '/cmsHome/saveOrUpdate'
// 首页组件 删除接口
export const cmsHomeRemoveUrl = servicePrefix + '/cmsHome/remove?id='
// 首页获取自定义模块内容
export const getCmsUserConfig = servicePrefix + '/cmsUserConfig/getConfig'
// 首页保存自定义模块内容
export const saveOrUpdateCmsUserConfig =
  servicePrefix + '/cmsUserConfig/saveOrUpdate'

//  获取当前用户能看到的组件集合
export function getComponents() {
  return getData(servicePrefix + '/cmsUserConfig/getComponents')
}
//  获取当前用户能看到的组件集合
export function getCmsUserConfigAndHomeList(getHomeList: boolean) {
  return getData(getCmsUserConfig, { getHomeList: getHomeList })
}
// 启用禁用
export const cmsHomeEnable = servicePrefix + '/cmsHome/changeEnable?id='

//  获取当前用户能看到的组件集合
export function getHomeComponentList() {
  return getData(servicePrefix + '/cmsHome/homeComponentList')
}

//  获取当前首页组件得详情
export function cmsHomeGetFn(id: any) {
  return getData(cmsHomeGetUrl + id)
}

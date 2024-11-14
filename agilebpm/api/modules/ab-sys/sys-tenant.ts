import request from './../../ab-request'
import { sysServicePrefix as servicePrefix } from '../../ab-api-prefix'

/**
 * 租户应用保存URL
 */
export const appSaveUrl = `${servicePrefix}/tenantApp/save`

/**
 * 租户应用列表URL
 */
export const appListUrl = `${servicePrefix}/tenantApp/listJson`

/**
 * 租户应用删除
 */
export const appRemoveUrl = `${servicePrefix}/tenantApp/remove`

/**
 * 租户应用获取
 */
export const appGetUrl = `${servicePrefix}/tenantApp/get`

/**
 * 租户列表
 */
export const listUrl = `${servicePrefix}/tenant/listJson`

/**
 * 租户获取
 */
export const getUrl = `${servicePrefix}/tenant/get`

/**
 * 租户删除
 */
export const removeUrl = `${servicePrefix}/tenant/remove`

/**
 * 租户保存
 */
export const saveUrl = `${servicePrefix}/tenant/save`

/**
 * 租户安装应用
 */
export const appInstallUrl = `${servicePrefix}/tenant/installApp`

/**
 * 租户状态切换
 */
export const updateStatusUrl = `${servicePrefix}/tenant/updateStatus`

/**
 * 租户应用列表
 */
export const appstoreAppListUrl = `${servicePrefix}/tenantAppstore/appList`

/**
 * 租户应用市场应用获取
 */
export const appstoreGetAppUrl = `${servicePrefix}/tenantAppstore/getApp`

/**
 * 租户应用市场添加APP
 */
export const appstoreAddAppUrl = `${servicePrefix}/tenantAppstore/addApp`

/**
 * 租户应用市场移除APP
 */
export const appstoreRemoveAppUrl = `${servicePrefix}/tenantAppstore/removeApp`

/**
 * 租户切换
 *
 * @param toTenantAlias 目标租户别名
 * @returns { Promise }
 */
export async function switchTo(toTenantAlias: string) {
  return request({
    url: `${servicePrefix}/tenant/switchTo/${toTenantAlias}`,
  })
}

/**
 *
 * 租户切换退出
 *
 * @returns { Promise }
 */
export async function switchExit() {
  return request({
    url: `${servicePrefix}/tenant/switchExit`,
  })
}

import request, { getData, postData } from '../../ab-request'
import { appstoreServicePrefix as servicePrefix } from '../../ab-api-prefix'

/**
 * 用户安装url
 */
// export const installUrl = `${servicePrefix}/userApp/install`

/**
 * 用户安装url
 */
export function installUrl(saveData: any) {
  return request({
    url: `${servicePrefix}/userApp/install`,
    method: 'POST',
    data: saveData,
    timeout: 5 * 60 * 1000,
  })
}

/**
 * 用户试用安装url
 */
//  export const trialUrl = `${servicePrefix}/userApp/trial`

/**
 * 用户试用安装url
 */
export function trialUrl(saveData: any) {
  return request({
    url: `${servicePrefix}/userApp/trial`,
    method: 'POST',
    data: saveData,
    timeout: 5 * 60 * 1000,
  })
}

/**
 * 用户卸载url
 */
export const uninstallUrl = `${servicePrefix}/userApp/uninstall`

/**
 * 我已购买
 */
export const purchasedUrl = `${servicePrefix}/userApp/purchased`

/**
 * 用户升级url
 */
export const upgradeUrl = `${servicePrefix}/userApp/upgrade`

/**
 * 获取用户授权信息
 */
export const getLicenseUrl = `${servicePrefix}/userApp/getLicense`

/**
 * 本地获取已卸载的应用id集合
 */
export const getUninstallAppIdsUrl = `${servicePrefix}/userApp/getUninstallAppIds`

/**
 * 获取应用市场的url
 */

export const getAppStoretUrlStr = `${servicePrefix}/userApp/getAppStoreUrl`
export const getAppStoretUrl = () => {
  return getData(getAppStoretUrlStr)
}

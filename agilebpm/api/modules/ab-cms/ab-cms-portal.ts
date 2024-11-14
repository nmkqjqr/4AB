import { getData } from './../../ab-request'
const servicePrefix = '/ab-bpm/cms/cmsPortal/'

// 门户管理 列表接口
export const cmsPortalListUrl = `${servicePrefix}listJson`
// 门户管理 get详情接口
export const cmsPortalGetUrl = `${servicePrefix}get?id=`
// 门户管理 修改状态接口
export const cmsPortalSaveOrUpdateUrl = `${servicePrefix}save`
// 门户管理 删除接口
export const cmsPortalRemoveUrl = `${servicePrefix}remove?id=`
// 门户管理 删除方法
export function removePortal(id: string) {
  return getData(cmsPortalRemoveUrl + id)
}

// 启用禁用
export const cmsPortalChangeStatus = `${servicePrefix}changeStatus?id=`
//  门户管理 获取指定门户
export function getPortalById(id: any) {
  return getData(`${servicePrefix}getPortal?id=${id}`)
}

export function getVoByCode(code: any) {
  return getData(`${servicePrefix}getVoByCode?code=${code}`)
}
export function getDynamicPortal() {
  return getData(`${servicePrefix}getDynamicPortal?type=pc`)
}

//批量删除的方法
export function cmsPortalRemoveFn(ids: string) {
  return getData(`${servicePrefix}remove?id=${ids}`)
}

export function getList() {
  return getData(`${servicePrefix}getList`)
}

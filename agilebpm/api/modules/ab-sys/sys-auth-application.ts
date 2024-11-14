import { getData } from './../../ab-request'
const servicePrefix = '/ab-bpm/sys/application'

// 应用管理-分页查询
export const applicationListJson = `${servicePrefix}/listJson`
// 应用管理-通过ID查询
export const applicationGet = `${servicePrefix}/getJson?id=`
// 应用管理-新增或修改
export const applicationSaveOrUpdate = `${servicePrefix}/save`
// 应用管理-删除
export const applicationRemove = `${servicePrefix}/remove?id=`
// 应用管理-国际化
export const internation = `${servicePrefix}/internation`
// 应用管理-查询移动端应用
export function mobileApplication() {
  return getData(`${servicePrefix}/mobileApplication`)
}

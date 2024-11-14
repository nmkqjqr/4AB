import { getData, postData } from './../../ab-request'

const servicePrefix = '/ab-bpm/cms/cmsNotify'

// 公告列表 列表接口
export const cmsNotifyListUrl = servicePrefix + '/listJson'
// 公告列表get id接口
export const cmsNotifyGetUrl = servicePrefix + '/getOne?id='
// 公告列表保存接口
export const cmsNotifySaveUrl = servicePrefix + '/saveDto'
// 公告列表更新接口
export const cmsNotifyUpdateUrl = servicePrefix + '/updateDto'
// 公告列表删除接口
export const cmsNotifyRemoveUrl = servicePrefix + '/remove?id='
// 公告列表发布接口
export const cmsNotifyreleaseNotifyUrl = servicePrefix + '/releaseNotify?id='
// 公告列表下架接口
export const cmsNotifywithdrawNotifyUrl = servicePrefix + '/withdrawNotify?id='
// 公告列表获 关联的公告列表 固定数量
export function getNotifyList() {
  return postData(servicePrefix + '/getNotifyPage')
}

// 公告列表获 关联的公告列表分页
export function getNotifyPage(page: any) {
  return postData(servicePrefix + '/getNotifyPage', page)
}

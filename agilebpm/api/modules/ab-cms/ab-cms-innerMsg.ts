import { getData, postData } from './../../ab-request'
const servicePrefix = '/ab-bpm/cms/cmsInnerMsg'

// 消息 列表接口
export const cmsInnerMsgListUrl = servicePrefix + '/listJson'
// 消息 get详情接口
export const cmsInnerMsgGetUrl = servicePrefix + '/get?id='
// 消息 删除接口
export const cmsInnerMsgRemoveUrl = servicePrefix + '/remove?id='
// 消息 请求公告/待办数据（首页公告小组件）
export function cmsInnerAllDetails(
  type: number,
  currentPage: number,
  pageSize: number
) {
  return postData(servicePrefix + '/getAllDetails', {
    pageSize: pageSize,
    currentPage: currentPage,
    type: type,
  })
}

// 消息 修改状态接口(未读改为已读)
export function cmsupdateReadFn(id: string) {
  return getData(servicePrefix + '/updateRead?id=' + id)
}

// 消息 修改状态接口(未读改为已读)
export function cmsupdateReadByIdsFn(ids: string[]) {
  return postData(servicePrefix + '/updateRead', ids)
}

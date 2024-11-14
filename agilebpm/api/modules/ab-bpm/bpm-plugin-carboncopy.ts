import request from './../../ab-request'
import { bpmServicePrefix as servicePrefix } from '../../ab-api-prefix'

//流程--我的抄送/传阅列表
export const bpmMyReceiveListUrl = `${servicePrefix}/carbonCopy/receiveList`

//流程--抄送更改已读状态
export const bpmCarbonCopyUpdateReadUrl = `${servicePrefix}/carbonCopy/updateRead?id=`

export function updateReadStatus(row: any) {
  if (row.status != 'unread') {
    return
  }
  return request({
    url: bpmCarbonCopyUpdateReadUrl + row.id,
    method: 'GET',
  })
}
//获取抄送记录
export function getCarbonCopyRecord(recordId: string) {
  return request({
    url: `${servicePrefix}/carbonCopy/getRecord?recordId=${recordId}`,
    method: 'GET',
  })
}

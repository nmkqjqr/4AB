import request from './../../ab-request'
import { bpmServicePrefix as servicePrefix } from '../../ab-api-prefix'

// 保存接口
export const bpmOpenFlowSaveUrl = `${servicePrefix}/bpmOpenFlow/save`

//分页查询
export const bpmOpenFlowListUrl = `${servicePrefix}/bpmOpenFlow/listJson`

// 获取接口
export const bpmOpenFlowGetUrl = `${servicePrefix}/bpmOpenFlow/get?id=`

// 流程定义删除接口
export const bpmOpenFlowRemoveUrl = `${servicePrefix}/bpmOpenFlow/remove?id=`

export function updateQrCode(id: string, qrCode: string) {
  return request({
    url: `${servicePrefix}/bpmOpenFlow/updateQrCode`,
    method: 'get',
    params: { id: id, qrCode: qrCode },
  })
}

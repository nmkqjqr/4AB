import { bpmServicePrefix as servicePrefix } from '../../ab-api-prefix'
import request from './../../ab-request'
//获取代理列表
export const bpmAgentListUrl = servicePrefix + '/userAgencyConfig/listJson'
export const bpmAdminAgentListUrl =
  servicePrefix + '/userAgencyConfig/adminListJson'
//删除流程代理
export const bpmAgentDeleteUrl = servicePrefix + '/userAgencyConfig/delete?id='
//禁用流程代理
export const bpmAgentDisableUrl = servicePrefix + '/userAgencyConfig/disable'
//代理记录历史
export const bpmAgentLogListUrl = servicePrefix + '/userAgencyLog/listJson'

//新增修改流程代理
export const saveAgentUrl = servicePrefix + '/userAgencyConfig/save'
//获取流程代理记录
export const getAgentUrl = servicePrefix + '/userAgencyConfig/get'

export const adminSaveAgentUrl = servicePrefix + '/userAgencyConfig/adminSave'

export const recoverTaskUrl = servicePrefix + '/userAgencyLog/recoverTask?id='

/**
 * 任务回收
 * @param agencyId 代理日志id
 * @returns
 */
export function recoverTask(agencyId: string) {
  if (!agencyId) {
    return Promise.reject(new Error('无效的任务ID'))
  }
  return request({
    url: `${servicePrefix}/userAgencyLog/recoverTask`,
    method: 'get',
    params: { id: agencyId },
  })
}

export function getDesc(configId: any) {
  return request({
    url: `${servicePrefix}/userAgencyConfig/getDesc`,
    method: 'get',
    params: { id: configId },
  })
}

import request from './../../ab-request'
import { postData, postForm, getData } from './../../ab-request'
import { bpmServicePrefix as servicePrefix } from '../../ab-api-prefix'

//流程实例--分页查询
export const bpmInstanceListUrl = `${servicePrefix}/instance/listJson`
//流程实例 --详情
export const bpmInstanceDetailUrl = `${servicePrefix}/instance/getInstanceData`
//流程实例 --删除
export const bpmInstanceDeleteUrl = `${servicePrefix}/instance/remove?id=`
//流程实例 --禁用
export function toForbidden(instanceId: string, forbidden: boolean) {
  return request({
    url: `${servicePrefix}/instance/toForbidden`,
    method: 'GET',
    params: { id: instanceId, forbidden: forbidden },
  })
}

//获取审批历史
export function bpmInstanGetOpinion(
  instanceId: string,
  taskId = '',
  opId = ''
) {
  return request({
    url: `${servicePrefix}/instance/getOpinion`,
    method: 'POST',
    data: { instanceId: instanceId, taskId: taskId, opId: opId },
  })
}

/**
 * 获取流程图 信息
 * @param getFlowImageDTO
 * @returns
 */
export function getFlowImagInfo(getFlowImageDTO: any) {
  return request({
    url: `${servicePrefix}/instance/getFlowImageInfo`,
    method: 'post',
    data: getFlowImageDTO,
  })
}
/**
 * 获取子任务
 * @param getFlowImageDTO
 * @returns
 */
export function getInstanceAndChildren(getFlowImageDTO: any) {
  return request({
    url: `${servicePrefix}/instance/getInstanceAndChildren`,
    method: 'post',
    data: getFlowImageDTO,
  })
}

/**
 * 复制业务数据
 * @param boCode 业务对象code
 * @param instanceId 实例id
 * @returns
 */
export function cloneBizData(instanceId: any, boCode: any) {
  return request({
    url: `${servicePrefix}/instance/cloneBizData`,
    method: 'GET',
    params: { instanceId, boCode },
  })
}

export function remove(id: any, isData = true) {
  return getData(`${servicePrefix}/instance/delete`, {
    id: id,
    isData: isData,
  })
}

import request from './../../ab-request'
import { bpmServicePrefix as servicePrefix } from '../../ab-api-prefix'

// 任务相关接口定义
export const bpmTaskListUrl = servicePrefix + '/task/listJson'

export function handleNodeFreeSelectUser(params: any) {
  return request({
    url: servicePrefix + '/task/handleNodeFreeSelectUser',
    method: 'post',
    data: params,
  })
}

/**
 * 任务指派
 * @param taskId
 * @param userId
 * @returns
 */
export function assignTask(taskId: string, userId: string) {
  return request({
    url: servicePrefix + '/task/assignTask',
    method: 'POST',
    params: { taskId, userId },
  })
}

/**
 * 取消指派
 */
export const cancelAssignURL = servicePrefix + '/task/cancelAssign?taskId='
export function cancelAssign(taskId: string) {
  return request({
    url: servicePrefix + '/task/cancelAssign',
    method: 'POST',
    params: { taskId },
  })
}

//获取驳回页面需要信息
export function getRejectInfo(taskId: any) {
  return request({
    url: servicePrefix + '/task/getRejectInfo',
    method: 'get',
    params: { taskId: taskId },
  })
}

/**
 * 通过流程实例id获取所有用户节点信息：名称，key，候选人
 * @param instanceId
 * @returns
 */
export function getAllUserTaskNode(instanceId: any) {
  return request({
    url: servicePrefix + '/task/getAllUserTaskNode',
    method: 'get',
    params: { instanceId: instanceId },
  })
}

/**
 * 获取任务候选人
 * @param taskId 任务ID
 */
export function getIdentityLink(taskId: any) {
  return request({
    url: servicePrefix + '/task/getIdentityLink',
    method: 'GET',
    params: { taskId },
  })
}

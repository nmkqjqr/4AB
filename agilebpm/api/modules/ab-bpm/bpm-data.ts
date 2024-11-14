import request from './../../ab-request'
import { bpmServicePrefix as servicePrefix } from '../../ab-api-prefix'

// 获取流程页面数据接口
export function getBpmData(params: any) {
  if (params.taskId) {
    return request({
      url: `${servicePrefix}/task/getTaskData`,
      method: 'post',
      data: params,
    })
  }
  return request({
    url: `${servicePrefix}/instance/getInstanceData`,
    method: 'post',
    data: params,
  })
}

// doAction 任务动作通用接口
export function doAction(params: any) {
  if (params.taskId) {
    return request({
      url: `${servicePrefix}/task/doAction`,
      method: 'post',
      data: params,
    })
  }
  return request({
    url: `${servicePrefix}/instance/doAction`,
    method: 'post',
    data: params,
  })
}

export function externalEventDoAction(params: any) {
  return request({
    url: `${servicePrefix}/task/externalEventDoAction`,
    method: 'post',
    data: params,
  })
}

export const getExternalEventStartFlowData = (
  defKey: any,
  isMobile = false,
  bizId = null
) => {
  return request({
    url: `${servicePrefix}/instance/getExternalEventStartFlowData`,
    method: 'get',
    params: {
      defKey: defKey,
      isMobile: isMobile,
      bizId: bizId,
    },
  })
}

export const getStartFlowData = (
  defKey: any,
  isMobile = false,
  bizId = null
) => {
  return request({
    url: `${servicePrefix}/instance/getStartFlowData`,
    method: 'get',
    params: {
      defKey: defKey,
      isMobile: isMobile,
      bizId: bizId,
    },
  })
}

export const getDraftData = (instId: any, isMobile = false) => {
  return request({
    url: `${servicePrefix}/instance/getDraftData`,
    method: 'get',
    params: {
      instId: instId,
      isMobile: isMobile,
    },
  })
}

export const getTaskData = (taskId: any, isMobile = false) => {
  return request({
    url: `${servicePrefix}/task/getTaskData`,
    method: 'get',
    params: {
      taskId: taskId,
      isMobile: isMobile,
    },
  })
}

export const getExternalEventTaskData = (taskId: any, isMobile = false) => {
  return request({
    url: `${servicePrefix}/task/getExternalEventTaskData`,
    method: 'get',
    params: {
      taskId: taskId,
      isMobile: isMobile,
    },
  })
}

/**
 * 获取实例详情数据，改方法已经废弃，不在维护，请使用 getInstDataNew
 */
export const getInstData = (
  instId: any = '',
  opId: any = '',
  bizId: any = '',
  nodeKey: any = '',
  carbonId: any = '',
  isMobile = false,
  isStart = true,
  isPrintForm = false,
  taskId = ''
) => {
  console.log('isPrintForm', isPrintForm)
  return request({
    url: `${servicePrefix}/instance/getInstData`,
    method: 'post',
    data: {
      instId: instId,
      opId: opId,
      bizId: bizId,
      nodeKey: nodeKey,
      isMobile: isMobile,
      carbonId: carbonId,
      isStart: isStart,
      isPrintForm: isPrintForm,
      taskId: taskId,
    },
  })
}

/**
 * 获取 实例详情表单数据
 * @param id  各种id
 * @param type id 的类型  业务id：bizId，抄送Id：carbonId，实例id：instId,开始节点+实例Id：instIdStart，审批历史Id：opId，任务：taskId
 * @param isPrintForm 是否是打印表单
 * @returns
 */

export const getInstDataNew = (
  id: any = '',
  type: any = '',
  isPrintForm = false
) => {
  return request({
    url: `${servicePrefix}/instance/getInstDataNew`,
    method: 'post',
    data: {
      id: id,
      type: type,
      isPrintForm: isPrintForm,
    },
  })
}

/**
 * 流程实例列表查看实例详情专用接口，没有鉴权
 * 其他查看实例详情的数据请使用 getInstData 有鉴权
 * @param id
 */
export const getInstDataById = (id: any, nodeKey: any = '') => {
  return request({
    url: `${servicePrefix}/instance/getInstDataById?id=${id}&nodeKey=${nodeKey}`,
    method: 'GET',
  })
}
export const getInstDataByKey = (defKey: any, id: any) => {
  return request({
    url: `${servicePrefix}/instance/getInstDataByKey/${defKey}?id=${id}`,
    method: 'GET',
  })
}

export const getInstPrintData = (id: any, nodeKey: any = '') => {
  return request({
    url: `${servicePrefix}/instance/getInstPrintData?id=${id}&nodeKey=${nodeKey}`,
    method: 'GET',
  })
}

/**
 * 流程启动测试
 * @param actionData 操作数据
 */
export const startTest = (actionData: any) => {
  return request({
    url: `${servicePrefix}/instance/startTest`,
    method: 'POST',
    data: actionData,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  })
}

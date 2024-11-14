import request, { postData, getData } from './../../ab-request'
import { bpmServicePrefix as servicePrefix } from '../../ab-api-prefix'

//流程--我的代办
export const bpmMyTaskTodoListUrl = `${servicePrefix}/my/todoTaskList`
//流程--我的审批历史
export const bpmMyApproveListUrl = `${servicePrefix}/my/approveList`
//流程--我可以发起申请的流程列表
export function bpmMydefinitionListUrl(param: any) {
  return request({
    url: `${servicePrefix}/my/definitionList`,
    method: 'POST',
    data: { pageSize: 500, currentPage: 1, queryParam: param },
  })
}
//流程--我的申请历史
export const bpmMyApplyTaskListUrl = `${servicePrefix}/my/applyTaskList`
//流程--我的草稿
export const bpmMyDraftTaskListUrl = `${servicePrefix}/my/draftList`

/**
 * 获取流程分类数据包含统计数据
 * @param treeUrl
 * @returns
 */
export function getTreeData(treeUrl: string) {
  return request({
    url: treeUrl,
    method: 'POST',
    data: {},
  })
}
/**
 * 我的代办分类url
 */
export const todoListTypeTreeUrl = `${servicePrefix}/my/todoTaskListTypeTree`

/**
 * 任务列表分类树Url
 */
export const taskListTypeTreeUrl = `${servicePrefix}/my/taskListTypeTree`
/**
 * 我的办理历史分类Url
 */
export const approveListTypeTreeUrl = `${servicePrefix}/my/approveListTypeTree`
/**
 * 我的申请历史分类Url
 */
export const applyListTypeTreeUrl = `${servicePrefix}/my/applyTaskListTypeTree`

/**
 * 实例列表分类树Url
 */
export const instanceListTypeTreeUrl = `${servicePrefix}/my/instanceListTypeTree`

//获取待办、已办、驳回、审阅等数量
export function getMyFlowCounts(condition?: string) {
  return request({
    url: `${servicePrefix}/my/getMyFlowCounts?typeCode=${condition || ''}`,
    method: 'get',
  })
}

//流程--我的申请历史
export function bpmMyApplyPage(param: any) {
  return postData(bpmMyApplyTaskListUrl, param)
}

//流程--我的代办分页
export function bpmMyTaskTodoPage(typeCode: string | null, pageSize: number) {
  return postData(`${servicePrefix}/my/todoTaskList`, {
    pageSize: pageSize,
    queryParam: typeCode
      ? {
          'def.typeCode$VIN': typeCode,
        }
      : {},
  })
}

//流程--我的办理历史分页
export function bpmMyApprovePage(typeCode: string | null, pageSize: number) {
  return postData(`${servicePrefix}/my/approveList`, {
    pageSize: pageSize,
    queryParam: typeCode
      ? {
          'def.typeCode$VIN': typeCode,
        }
      : {},
  })
}

//流程--我的抄送/传阅分页
export function bpmMyCarbonCopyPage(typeCode: string | null, pageSize: number) {
  return postData(`${servicePrefix}/carbonCopy/receiveList`, {
    pageSize: pageSize,
    queryParam: typeCode
      ? {
          'inst.typeCode$VIN': typeCode,
        }
      : {},
  })
}

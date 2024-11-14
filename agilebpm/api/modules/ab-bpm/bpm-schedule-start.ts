import request from './../../ab-request'
import { bpmServicePrefix as servicePrefix } from '../../ab-api-prefix'

// 流程定时启动-分页接口
export const bpmScheduleStartListUrl = `${servicePrefix}/scheduleStart/listJson`
// 流程定时启动-获取接口
export const bpmScheduleStartGetUrl = `${servicePrefix}/scheduleStart/get`
// 流程定时启动-保存接口
export const bpmScheduleStartSaveUrl = `${servicePrefix}/scheduleStart/save`
// 流程定时启动-删除接口
export const bpmScheduleStartRemoveUrl = `${servicePrefix}/scheduleStart/remove?id=`
// 流程定时启动-启动日志列表
export const bpmScheduleStartLogsUrl = `${servicePrefix}/scheduleStart/logs`

/**
 * 获取流程定时启动日志异常堆栈
 * @param id 日志ID
 * @returns 接口响应
 */
export async function getBpmScheduleStartLogExceptionStack(id: string) {
  return request({
    url: `${servicePrefix}/scheduleStart/log/exceptionStack`,
    method: 'get',
    params: { id },
  })
}

// 流程定时启动-流程分类树
export async function getBpmDefTypeTree() {
  return request({
    url: `${servicePrefix}/scheduleStart/getBpmDefTypeTree`,
  })
}

/**
 * 流程定时启动变更状态
 * @param id id
 * @param status 状态
 * @returns 请求配置
 */
export async function bpmScheduleStartChangeStatus(id: string, status: string) {
  return request({
    url: `${servicePrefix}/scheduleStart/changeStatus`,
    method: 'get',
    params: {
      id,
      status,
    },
  })
}

import request from './../../ab-request'
import { bpmServicePrefix as servicePrefix } from '../../ab-api-prefix'

const controllerPrefix = `${servicePrefix}/instanceTest`

/**
 * 运行中任务
 * @param instId 实例ID
 */
export async function getNextRunningTaskId(instId: any) {
  return request({
    url: `${controllerPrefix}/getNextRunningTaskId`,
    method: 'GET',
    params: { instId },
  })
}

export function getStartFlowData(
  defKey: any,
  isMobile = false,
  bizId = null,
  submitUserId = ''
) {
  return request({
    url: `${controllerPrefix}/getStartFlowData`,
    method: 'get',
    params: {
      defKey,
      isMobile,
      bizId,
      submitUserId,
    },
  })
}

export function getTaskData(
  taskId: any,
  isMobile = false,
  submitUserId: string | null = ''
) {
  return request({
    url: `${controllerPrefix}/getTaskData`,
    method: 'get',
    params: {
      taskId,
      isMobile,
      submitUserId,
    },
  })
}

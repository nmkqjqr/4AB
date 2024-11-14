import request from './../../ab-request'
import { bpmServicePrefix as servicePrefix } from '../../ab-api-prefix'

/**
 * 获取动态广场节点信息
 * @param instanceId 实例id
 * @returns
 */
export function getDiscussNodeInfo(instanceId: string) {
  return request({
    url: servicePrefix + '/task/discuss/getNodeList',
    method: 'GET',
    params: { instanceId: instanceId },
  })
}

export function saveDiscussData(discussData: any) {
  return request({
    url: servicePrefix + '/task/discuss/saveData',
    method: 'POST',
    data: discussData,
  })
}

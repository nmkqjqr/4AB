import request from './../../ab-request'
import { sysServicePrefix as servicePrefix } from '../../ab-api-prefix'
// 获取系统树
export function getTreeData(params: any) {
  return request({
    url: servicePrefix + '/resource/getTreeData',
    method: 'get',
    params,
  })
}

// 获取系统树通过code
export function getTreeDataByCode(code: any) {
  let params = { systemCode: code }
  return request({
    url: servicePrefix + '/resource/getTreeDataByCode',
    method: 'get',
    params,
  })
}

// 系统资源明细页面
export function getJson(params: any) {
  return request({
    url: servicePrefix + '/resource/getJson',
    method: 'get',
    params,
  })
}

// 保存子系统资源信息
export function saveResource(data: any) {
  return request({
    url: servicePrefix + '/resource/save',
    method: 'post',
    data,
  })
}
// 保存树形
export const saveTreeUrl = servicePrefix + '/resource/saveTree'

// 保存树形
export const updateTreeUrl = servicePrefix + '/resource/updateTree'

// 更新
export function updateResByParentId(params: any) {
  return request({
    url: servicePrefix + '/resource/updateResByParentId',
    method: 'get',
    params,
  })
}
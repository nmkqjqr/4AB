import request from './../../ab-request'
import { orgServicePrefix as servicePrefix } from '../../ab-api-prefix'

// 组织-组织树
export function getOrgTreeData() {
  return request({
    url: servicePrefix + '/group/getOrgTree',
    method: 'post',
    data: {},
  })
}
export const OrgGetTreeDataUrl = servicePrefix + '/group/getOrgTree'

// 组织-移除
export const removeOrgGroupUrl = servicePrefix + '/group/remove?id='

// 组织-获取
export const getOrgGroupUrl = servicePrefix + '/group/getGroupVo?id='

// 组织-保存
export const saveOrgGroupUrl = servicePrefix + '/group/saveGroup'


//编辑组织用户岗位
export function saveGroupUserRole(data: any) {
  return request({
    url: servicePrefix + '/group/saveGroupUserRole',
    method: 'post',
    data,
  })
}




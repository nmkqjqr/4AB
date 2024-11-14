import request from './../../ab-request'
import { orgServicePrefix as servicePrefix } from '../../ab-api-prefix'

// 角色-用户列表
export const roleUserList = servicePrefix + '/orgRelation/roleJson'

// 组织-移除关联
export const orgRelationRemove = servicePrefix + '/orgRelation/remove?id='

/**
 * 保存角色用户
 * @param roleId 角色ID
 * @param userIds 用户ID集
 */
export async function saveRoleUsers(roleId: string, userIds: [string]) {
  return request({
    url: servicePrefix + '/orgRelation/saveRoleUsers',
    method: 'POST',
    data: { roleId: roleId, userIds: userIds },
  })
}

// 组织-获取组织岗位
export const getOrgPostUrl = servicePrefix + '/orgRelation/getGroupPost?groupId='

// 组织-保存组织岗位
export const saveOrgPostUrl = servicePrefix + '/orgRelation/saveGroupUserRel'

// 组织-删除校验
export const removeCheckGroupUrl = servicePrefix + '/orgRelation/removeRelCheck'

// 组织-删除用户
export const removeGroupUserUrl = servicePrefix + '/orgRelation/remove?id='

// 组织-查询用户
export const queryGroupUserUrl = servicePrefix + '/orgRelation/queryGroupUser'

// 组织-批量添加岗位
export const groupBatchSaveUrl = servicePrefix + '/orgRelation/batchSave'

// 组织-禁用启用
export const updateGroupUserStatusUrl = servicePrefix + '/orgRelation/updateStatus?id='

//组织--禁用
export function updateGroupUserStatus(id: string, status: boolean) {
  return request({
    url: servicePrefix + '/orgRelation/updateStatus',
    method: 'GET',
    params: { id: id, status: status },
  })
}

//设置主组织
export function updateGroupUserMaster(id: string, isMaster: boolean) {
  return request({
    url: servicePrefix + '/orgRelation/setMaster',
    method: 'GET',
    params: { id: id, isMaster: isMaster },
  })
}

export function removeGroupUser(id: string) {
  return request({
    url: servicePrefix + '/orgRelation/remove',
    method: 'GET',
    params: { id: id},
  })
}

//设置主组织
export const updateGroupUserMasterUrl = servicePrefix + '/orgRelation/setMaster?id='


export async function queryGroupUser(data: any) {
  return request({
    url: queryGroupUserUrl,
    method: 'post',
    data: data,
  })
}


export async function saveOrgPost(data: any) {
  return request({
    url: saveOrgPostUrl,
    method: 'post',
    data: data,
  })
}


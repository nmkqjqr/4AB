import request, { getData, postData } from '../../ab-request'
import { lcProjectServicePrefix } from '../../ab-api-prefix'

const servicePrefix = `${lcProjectServicePrefix}/auth`

const getProjectAuthUrl = `${servicePrefix}/projectAuths`
const authorisationUrl = `${servicePrefix}/authorisation`

const getAuthResourcesUrl = `${servicePrefix}/resources`
const allocateResourcesUrl = `${servicePrefix}/allocateResources`

const deleteUrl = `${servicePrefix}/remove`

const saveUrl = `${servicePrefix}/save`

const saveAndGrandUrl = `${servicePrefix}/saveAndGrant`

const getDataPrivilegeUrl = `${servicePrefix}/getDataPrivilege`
const dataPrivilegeUrl = `${servicePrefix}/dataPrivilege`

/**
 * 获取项目权限组
 * @param projectId
 * @returns
 */
export function getProjectAuth(projectId: any) {
  return getData(`${getProjectAuthUrl}?projectId=${projectId}`)
}

/**
 * 为权限组授权
 * @param saveData
 * @returns
 */
export function authorisation(authId: any, identityList: any) {
  return postData(authorisationUrl, {
    authGroupId: authId,
    identities: identityList,
  })
}

/**
 * 获取项目权限组
 * @param projectId
 * @returns
 */
export function getAuthResources(authGroupId: any, projectId: any) {
  return getData(
    `${getAuthResourcesUrl}?id=${authGroupId}&projectId=${projectId}`
  )
}

/**
 * 获取项目权限组
 * @param projectId
 * @returns
 */
export function allocateResources(authGroupId: any, resourceIds: any) {
  return postData(allocateResourcesUrl, {
    authGroupId,
    resourceIds,
  })
}

/**
 * 保存授权组基本信息
 * @param data
 * @returns
 */
export function saveAuthGroup(data: any) {
  return postData(saveUrl, data)
}

/**
 * 保存并授权
 * @param data 包含授权信息和基本信息
 * @returns
 */
export function saveAndGrand(data: any) {
  return postData(saveAndGrandUrl, data)
}

export function deleteAuthGroup(authGroupId: any) {
  return getData(`${deleteUrl}?id=${authGroupId}`)
}

export function getDataPrivilege(authGroupId: any) {
  return getData(`${getDataPrivilegeUrl}?authId=${authGroupId}`)
}

export function dataPrivilege(data: any) {
  return postData(dataPrivilegeUrl, data)
}

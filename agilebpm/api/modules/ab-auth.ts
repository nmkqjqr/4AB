import request, { getData, postData } from './../../api/ab-request'
import * as abTools from '~/agilebpm/utils/ab-tools'
const servicePrefix = '/ab-bpm/sys'

// 获取系统树
export function getTreeData(params: any) {
  return request({
    url: `${servicePrefix}/resource/getTreeData`,
    method: 'get',
    params,
  })
}
// 获取当前用户可用应用
export function getUserSystem(data: any) {
  return request({
    url: `${servicePrefix}/application/getUserSystem`,
    method: 'post',
    data,
  })
}

// 系统资源明细页面
export function getJson(params: any) {
  return request({
    url: `${servicePrefix}/resource/getJson`,
    method: 'get',
    params,
  })
}

// 保存子系统资源信息
export function saveResource(data: any) {
  return request({
    url: `${servicePrefix}/resource/saveSysResource`,
    method: 'post',
    data,
  })
}
export function saveBatchResource(list: any[]) {
  return postData(`${servicePrefix}/resource/saveBatchResource`, list)
}

// 保存子系统资源信息
export function saveTreeUrl(data: any) {
  return request({
    url: `${servicePrefix}/resource/saveTree`,
    method: 'post',
    data,
  })
}

// 保存子系统资源信息链接
export const saveUrl = `${servicePrefix}/resource/save`

// 保存树形
// export const saveTreeUrl = servicePrefix + '/resource/saveTree'

// 批量删除子系统资源记录
export function removeResource(params: any) {
  return request({
    url: `${servicePrefix}/resource/remove`,
    method: 'get',
    params,
  })
}

// 通过Code批量删除子系统资源记录
export function removeResourceByCode(code: string) {
  return getData(`${servicePrefix}/resource/removeByCode`, {
    code: code,
  })
}

// 通过code获取资源对象
export function getByCode(code: string) {
  return getData(`${servicePrefix}/resource/getByCode?code=` + code)
}

// 批量资源
export function removeResourceList(data: any) {
  return request({
    url: `${servicePrefix}/resource/removeResourceList`,
    method: 'post',
    data,
  })
}

/**
 * 获取角色资源TREE
 * @param roleId 角色ID
 * @param appCode 应用编码
 */
export async function getRoleResTreeData(roleId: string, appCode: string) {
  return request({
    url: `${servicePrefix}/resRole/getRoleResTreeData`,
    method: 'GET',
    params: { roleId: roleId, code: appCode },
  })
}

/**
 * 导出资源到JSON文件
 * @param row
 */
export async function exportResource(row: any) {
  return postData(`${servicePrefix}/resource/export?id=${row.id}`).then(
    (res: any) => {
      if (!res.data) {
        return
      }
      let name = res.data.resource[0].name
      if (res.data.resource.length > 1) {
        name = `${name}等${res.data.resource.length}个菜单资源`
      }
      abTools.downLoadFile(
        `${name}.menu`,
        JSON.stringify(res.data),
        'application/json'
      )
    }
  )
}

/**
 * 导入JSON文件到资源管理
 * @param appId 资源ID
 */
export const importResource = `${servicePrefix}/resource/import?appId=`

/**
 * 角色资源分配
 * @param roleId 角色ID
 * @param appId 应用ID
 * @param resIds 资源ID
 * @param halfResIds 半选中资源ID
 */
export async function grantRoleResource(
  roleId: string,
  appId: string,
  resIds: [string],
  halfResIds: [string]
) {
  return request({
    url: `${servicePrefix}/resRole/grantRoleResource`,
    method: 'POST',
    data: {
      roleId: roleId,
      appId: appId,
      resIds: resIds,
      halfResIds: halfResIds,
    },
  })
}

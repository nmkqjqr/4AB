import request, { getData, postData } from '../../ab-request'
import { lcProjectServicePrefix } from '../../ab-api-prefix'
// 保存资源
export const saveResourceUrl = `${lcProjectServicePrefix}/resource/save`
// 删除我的资源
export const removeResourceUrl = `${lcProjectServicePrefix}/resource/remove?id=`
// 获取资源
export const getResourceUrl = `${lcProjectServicePrefix}/resource/get?id=`
// 拖拽保存资源
export const saveResourcesUrl = `${lcProjectServicePrefix}/resource/saveResources`
// 保存资源数据
export const saveResourceDataUrl = `${lcProjectServicePrefix}/resource/saveResourceData`
// 获取我的资源（访问）
export const myResourceUrl = `${lcProjectServicePrefix}/resource/myResource?projectId=`
// 获取我的资源（设计）
export const projectResourceUrl = `${lcProjectServicePrefix}/resource/projectResource/`


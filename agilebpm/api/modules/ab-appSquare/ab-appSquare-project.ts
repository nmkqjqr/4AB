import request, { getData, postData } from '../../ab-request'
import { lcProjectServicePrefix } from '../../ab-api-prefix'
// 保存应用
export const saveProjectUrl = `${lcProjectServicePrefix}/project/save`
// 获取应用详情
export const getProjectUrl = `${lcProjectServicePrefix}/project/get?id=`
// 删除我应用
export const removeProjectUrl = `${lcProjectServicePrefix}/project/remove?id=`
// 获取当前用户可见的应用列表
export const myProjectUrl = `${lcProjectServicePrefix}/project/myProject`
import request from './../../ab-request'
import { sysServicePrefix as servicePrefix } from '../../ab-api-prefix'

// 语言管理-分页查询
export const languageList = `${servicePrefix}/sysLanguage/listJson`
// 语言管理-通过ID查询
export const getLanguage = `${servicePrefix}/sysLanguage/get?id=`
// 语言管理-新增及修改
export const saveLanguage = `${servicePrefix}/sysLanguage/saveOrUpdate`
// 语言管理-删除
export const removeLanguage = `${servicePrefix}/sysLanguage/remove?id=`

/**
 * 变更启用
 * @param id id
 * @param enabled 启用(1/0)
 * @returns request
 */
export async function changeEnable(id: string, enabled: number) {
  return request({
    url: `${servicePrefix}/sysLanguage/changeEnable`,
    method: 'POST',
    data: { id, enabled },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  })
}

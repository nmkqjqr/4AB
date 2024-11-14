import { getCacheData } from '~/agilebpm/utils/ab-cache'
import { bizServicePrefix } from '../../ab-api-prefix'
import { getData, postData } from './../../ab-request'

const servicePrefix = bizServicePrefix + '/bizCustDialog/'

//获取自定义对话框列表
export const bizCustDialogUrl = `${servicePrefix}listJson`
//删除自定义对话框列表
export const bizCustDialogremoveUrl = `${servicePrefix}remove?id=`
//保存
export const bizCustDialogSave = `${servicePrefix}saveOrUpdate`
//通过id查询
export const bizCustDialogGet = `${servicePrefix}get?id=`
//通过code查询系统数
export const listDataByCodeUrl = `${servicePrefix}listData/`
//通过id查询树数据
export const treeDataByIdUrl = `${servicePrefix}treeData/`
//通过CODE查询
export const getByCode = `${servicePrefix}getByCode/`
//获取表/视图/或其他来源类型的详细信息
export const bizCustDialogGetTable = `${servicePrefix}getTable`
export function getDialogByCode(code: string) {
  return getData(getByCode + code)
}
//通过ID预览对话框
export const listDataByIdUrl = `${servicePrefix}listData/`

//点击预览查询
export const listSimpleData = `${servicePrefix}listSimpleData/`

// 同步对话框相关的国际化翻译
export const internation = `${servicePrefix}internation`

export function getDialogDataList(dialogKey: string, queryParam: any) {
  const cacheCode = `listSimpleData_${dialogKey}_${JSON.stringify(queryParam)}`
  return getCacheData(cacheCode, async () => {
    return postData(listSimpleData + dialogKey, queryParam)
  })
}

export function listDataByCode(dialogKey: string, queryParam: any) {
  return postData(`${listDataByCodeUrl}${dialogKey}`, queryParam)
}

export function treeDataByCode(dialogKey: string, queryParam: any) {
  const cacheCode = `treeDataByCode_${dialogKey}_${JSON.stringify(queryParam)}`
  return getCacheData(cacheCode, async () => {
    return await postData(`${treeDataByIdUrl}${dialogKey}`, queryParam)
  })
}

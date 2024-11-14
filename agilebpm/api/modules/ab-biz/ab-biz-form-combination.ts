import { bizServicePrefix as servicePrefix } from '../../ab-api-prefix'
import { getData, postData } from './../../ab-request'
import * as abTools from './../../../utils/ab-tools'

//业务表单列表
export const BizFormListJson = `${servicePrefix}/bizFormCombination/listJson`
//业务表单保存
export const BizFormSave = `${servicePrefix}/bizFormCombination/save`
//业务表单删除
export const BizFormDel = `${servicePrefix}/bizFormCombination/remove?id=`
//业务表单删除（方法形式）
export function removeForm(id: string) {
  return getData(BizFormDel + id)
}

//业务表单获取
export const BizFormGet = `${servicePrefix}/bizFormCombination/get?id=`
//业务表单生成
export const BizFormGenerateHtml = `${servicePrefix}/bizFormCombination/generateHtml`
//导入
export const importBizFormCombinationUrl = `${servicePrefix}/bizFormCombination/import`

/**
 * 表单设计保存Json
 * @param json
 * @returns
 */
export const saveDesignJson = (json: any) => {
  return postData(`${servicePrefix}/bizFormCombination/save`, json)
}

export function getByCode(code: any) {
  return getData(`${servicePrefix}/bizFormCombination/getByCode?code=${code}`)
}

export const getDesign = (id: string) => {
  return getData(`${servicePrefix}/bizFormCombination/get`, { id: id })
}

export const getDesignJson = (code: string, params: any) => {
  return postData(`${servicePrefix}/bizFormCombination/design/${code}`, params)
}

export const frashSqlParam = (code: string, params: any) => {
  return postData(
    `${servicePrefix}/bizFormCombination/frashSqlParam/${code}`,
    params
  )
}
export const doFrashGlobalParam = (code: string, params: any) => {
  return postData(
    `${servicePrefix}/bizFormCombination/frashGlobalParam`,
    params
  )
}

/**
 * 导出组联应用
 * @param codes
 * @returns
 */
export function exportBizFormCombination(codes: string, callBcak: any) {
  getData(`${servicePrefix}/bizFormCombination/export?codes=${codes}`).then(
    (res: any) => {
      if (!res.data || !res.data.dataList || res.data.dataList.length === 0) {
        return
      }
      let name = res.data.dataList[0].name
      if (res.data.dataList.length > 1) {
        name = `${name}等${res.data.dataList.length}个组联引用`
      }
      abTools.downLoadFile(
        `${name}.chart`,
        JSON.stringify(res.data),
        'application/json'
      )
      callBcak()
    }
  )
}

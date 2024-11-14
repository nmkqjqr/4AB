import { getCacheData } from '~/agilebpm/utils/ab-cache'
import * as abTools from '~/agilebpm/utils/ab-tools'
import { bizServicePrefix } from '../../ab-api-prefix'
import request, { getData, postData } from './../../ab-request'

//业务表单列表
export const BizFormListJson = `${bizServicePrefix}/bizForm/listJson`
//业务表单保存
export const BizFormSave = `${bizServicePrefix}/bizForm/save`
//业务表单获取
export const BizFormGet = `${bizServicePrefix}/bizForm/get?id=`

//业务表单设计列表
export const BizFormDesignListVOJson = `${bizServicePrefix}/bizFormDesign/listVOJson`
//业务表单设计删除
export const BizFormDesignRemove = `${bizServicePrefix}/bizFormDesign/remove?id=`
//业务表单设计导入
export const BizFormDesignImportXml = `${bizServicePrefix}/bizFormDesign/importXml`
//子表数据导入
export const BizFormColumnsImport = `${bizServicePrefix}/bizForm/importExcel`

//获取当前用户有权限看到的图表
export const getForm = (formCode: string) => {
  return getData(`${bizServicePrefix}/bizForm/getForm`, { code: formCode })
}

export const getFormData = (code: string, dataId = '', isReadOnly = false) => {
  return getData(`${bizServicePrefix}/bizForm/get/${code}`, {
    code: code,
    dataId: dataId,
    isReadOnly: isReadOnly,
  })
}

export const getFormDataEncrypt = (code: string, id: string) => {
  return postData(`${bizServicePrefix}/bizForm/getFormDataEncrypt`, {
    code: code,
    encryptId: abTools.encrypt(id),
    version: 'v1',
  })
}

export const loadChildren = (
  data: object,
  boCode: string,
  tableCode: string,
  permissionType: string,
  permissionValue: string
) => {
  return postData(`${bizServicePrefix}/bizForm/loadChildren`, {
    data: data,
    boCode: boCode,
    tableCode: tableCode,
    permissionType: permissionType,
    permissionValue: permissionValue,
  })
}

export const removeFormData = (code: string, dataId = '') => {
  return getData(`${bizServicePrefix}/bizForm/remove/${code}`, {
    code: code,
    dataId: dataId,
  })
}

export const saveFormData = (formCode: string, data: any) => {
  return postData(`${bizServicePrefix}/bizForm/save/${formCode}`, {
    formCode: formCode,
    data: data,
  })
}

export const saveCode = (
  code: string,
  html: string,
  js: string,
  rev: number
) => {
  return postData(`${bizServicePrefix}/bizForm/saveCode`, {
    code: code,
    html: html,
    js: js,
    rev: rev,
  })
}

/**
 * 表单设计保存Json
 * @param json
 * @returns
 */
export const saveDesignJson = (json: any, mbJson: any) => {
  return postData(`${bizServicePrefix}/bizFormDesign/saveJson`, {
    json: json,
    mbJson: mbJson,
  })
}

/**
 * 表单设计生成表单
 * @param json
 * @returns
 */
export const createForm = (json: any, mbJson: any) => {
  return postData(`${bizServicePrefix}/bizFormDesign/createForm`, {
    json: json,
    mbJson: mbJson,
  })
}

export const getDesign = (id: string, copyId = '') => {
  return getData(`${bizServicePrefix}/bizFormDesign/getVO`, {
    id: id,
    copyId: copyId,
  })
}

export const getDesignCode = (formCode: string) => {
  return getData(`${bizServicePrefix}/bizFormDesign/getVO`, {
    formCode: formCode,
  })
}

//通过code获取字典项，数据为树形结构（不包含父）
export function getDesignCodeCache(formCode: string) {
  const cacheCode = `getDesignCodeCache_${formCode}}`
  return getCacheData(cacheCode, async () => getDesignCode(formCode))
}

export const exportXml = (codes: string) => {
  return postData(`${bizServicePrefix}/bizFormDesign/exportXml?codes=${codes}`)
}

export const fomatData = (data: any) => {
  return postData(`${bizServicePrefix}/bizFormDesign/fomatData`, data)
}

export const queryFomatData = (formCode: string) => {
  return getData(`${bizServicePrefix}/bizFormDesign/queryFomatData`, {
    formCode: formCode,
  })
}

export const exportExcel = (code: any, formData: any) => {
  return request({
    url: `${bizServicePrefix}/bizForm/exportExcel/${code}`,
    method: 'POST',
    responseType: 'blob',
    data: formData,
    timeout: 1000 * 60,
  })
}

export const genCode = (param: any) => {
  return postData(`${bizServicePrefix}/bizFormDesign/genCode`, param)
}

export async function downloadGenCode(selectedData: any[]) {
  const response = await request({
    url: `${bizServicePrefix}/bizFormDesign/genCode`,
    method: 'POST',
    data: selectedData,
    responseType: 'blob',
  })
  const fileName = decodeURIComponent(
    response.headers['content-disposition'].split('=')[1]
  )
  abTools.downImgFile(fileName, response.data)
  return response.status
}

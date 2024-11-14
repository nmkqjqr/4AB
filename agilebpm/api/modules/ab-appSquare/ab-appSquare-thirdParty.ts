import request, { getData, postData } from '../../ab-request'
import { lcProjectServicePrefix } from '../../ab-api-prefix'
// 平替
// 获取表单详情
export const getDesignThirdParty = (resourceId: string) => {
  return getData(`${lcProjectServicePrefix}/thirdParty/bizFormDesign/getVO`, {
    resourceId: resourceId,
  })
}
// 表单详情预览
export const getFormDataThirdParty = (resourceId: string) => {
  return postData(`${lcProjectServicePrefix}/thirdParty/bizForm/getFormData`, {
    dataId: '',
    isReadOnly: false,
    resourceId: resourceId,
  })
}
// 获取应用列表(预览getVo)
export const bizCustGridgetVoThirdParty = (resourceId: string) => {
  return getData(
    `${lcProjectServicePrefix}/thirdParty/bizCustGrid/view/getVo`,
    {
      resourceId: resourceId,
    }
  )
}
// 获取应用列表(预览列表)
export const listDataThirdParty = (resourceId:string,data: object) => {
  return postData(
    `${lcProjectServicePrefix}/thirdParty/bizCustGrid/view/listData/` + resourceId,
    data
  )
}
// 获取应用列表(设计getByCode)
export const getBizCustGridThirdParty = (resourceId: string) => {
  return getData(
    `${lcProjectServicePrefix}/thirdParty/bizCustGrid/get`,
    {
      resourceId: resourceId,
    }
  )
}
// 自定义列表parseSql
export const parseSqlThirdPartyUrl = `${lcProjectServicePrefix}/thirdParty/bizCustGrid/parseSql/`

// 获取组联表单详情
export const getBizFormCombinationDesignThirdParty = (resourceId: string,data:object) => {
  return postData(
    `${lcProjectServicePrefix}/thirdParty/bizFormCombination/getDesign/` + resourceId,
    data
  )
}

// 获取refreshParam
export const refreshParamThirdParty = (resourceId: string,data:object) => {
  return postData(
    `${lcProjectServicePrefix}/thirdParty/bizFormCombination/refreshParam/` + resourceId,
    data
  )
}

// 获取getDesign
export const bpmDefGetDesignThirdParty = (resourceId: string) => {
  return getData(
    `${lcProjectServicePrefix}/thirdParty/bpmDef/getDesign`,
    {
      resourceId: resourceId,
    }
  )
}

import { getData, postData } from './../ab-request'
const servicePrefix = '/ab-bpm/bpm/simpleDefinition'

//保存
export const saveUrl = `${servicePrefix}/publish`

//获取数据
export const getUrl = `${servicePrefix}/get?id=`

export function simpleFlowSave(simpleWorkflowDefinitionData: any) {
  return postData(saveUrl, simpleWorkflowDefinitionData)
}

export function getsimpleFlowJson(id: String) {
  return getData(getUrl + id)
}

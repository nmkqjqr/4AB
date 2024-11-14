import request from './../../ab-request'
import * as abTools from './../../../utils/ab-tools'
import { ElMessage } from 'element-plus'

import { bpmServicePrefix as servicePrefix } from '../../ab-api-prefix'

// 流程-分页查询
export const bpmDefinitionListUrl = `${servicePrefix}/definition/listJson`
// 流程定义删除接口
export const bpmDefinitionRemoveUrl = `${servicePrefix}/definition/remove?id=`
// 流程定义设置主版本接口
export const bpmDefinitionSetMainUrl = `${servicePrefix}/definition/setMain?id=`

// 流程定义保存接口
export const bpmDefinitionSaveUrl = `${servicePrefix}/definition/save`
// 流程定义获取接口
export const bpmDefinitionGetUrl = `${servicePrefix}/definition/get?id=`

// 根据候选人查询相关流程定义
export const queryBpmDefByIdentityUrl = `${servicePrefix}/definition/queryBpmDefByIdentity`
//获取所有流程定义所有的用户节点
export function bpmDefinitionGetAllUserTaskNode(defId: string) {
  return request({
    url: `${servicePrefix}/definition/getAllUserTaskNode`,
    method: 'get',
    params: {
      defId,
    },
  })
}
// 根据候选人查询相关流程定义
export function queryBpmDefByIdentity(type: string, name: string) {
  return request({
    url: queryBpmDefByIdentityUrl,
    method: 'get',
    params: {
      type,
      name,
    },
  })
}

export function saveBpmDefByIdentity(updateBpmIdentityDTO: any) {
  return request({
    url: `${servicePrefix}/definition/batchUpdateBpmIdentity`,
    method: 'post',
    data: updateBpmIdentityDTO,
  })
}
// 流程设计器 VO 获取接口
export function getBpmDefinitionDesign(id: string) {
  return request({
    url: `${servicePrefix}/definition/getDesign`,
    method: 'get',
    params: {
      id,
    },
  })
}
// 流程设计器 VO 获取接口
export function getBpmDefaultButtons(type: string, isDefault: boolean) {
  return request({
    url: `${servicePrefix}/processDef/getDefaultButtons`,
    method: 'get',
    params: {
      type,
      isDefault,
    },
  })
}

// 流程设计器保存
export function saveBpmDefinitionDesign(bpmDefinitionVo: any) {
  return request({
    url: `${servicePrefix}/definition/saveDesign`,
    method: 'post',
    data: bpmDefinitionVo,
  })
}

//流程导入导出

/**
 * 获取流程定义配置
 * @param defId
 * @returns
 */
export function getDefSetting(defId: string) {
  return request({
    url: `${servicePrefix}/overView/getDefSetting?defId=${defId}`,
    method: 'GET',
  })
}

/**
 * 导出流程
 * @param defId
 * @returns
 */
export function exportBpmDef(defId: string, callBcak: any) {
  request({
    url: `${servicePrefix}/overView/export?defId=${defId}`,
    method: 'GET',
    responseType: 'blob',
  }).then((res: any) => {
    if (!res.data) {
      const reader = new FileReader()
      reader.readAsText(res, 'utf-8')
      reader.onload = () => {
        const t = JSON.parse(reader.result as string)
        ElMessage.error(`${t.message}`)
      }
      return
    }
    const fileName = decodeURIComponent(
      res.headers['content-disposition'].split('=')[1]
    )
    abTools.downLoadFile(fileName, res.data, 'application/zip')
    callBcak()
  })
}

/**
 * 导入预览
 */
export function importPreview(fileData: any) {
  return request({
    url: `${servicePrefix}/overView/importPreview`,
    method: 'POST',
    data: fileData,
    timeout: 2 * 60 * 1000,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

/**
 * 导入保存
 */
export function importSave(saveData: any) {
  return request({
    url: `${servicePrefix}/overView/importSave`,
    method: 'POST',
    data: saveData,
    timeout: 2 * 60 * 1000,
  })
}

/**
 * 流程复制
 * @param data 数据
 * @return Promise
 */
export function bpmDuplicate(data: {
  originKey: string
  newKey: string
  newName: string
  newTypeCode: string
  newDesc: string
}) {
  return request({
    url: `${servicePrefix}/definition/duplicate`,
    method: 'POST',
    data: data,
  })
}

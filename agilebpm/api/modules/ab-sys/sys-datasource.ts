//审计日志
import request from './../../ab-request'
import { sysServicePrefix as servicePrefix } from '../../ab-api-prefix'
// 数据源管理
export const dataSourceList = `${servicePrefix}/dataSource/listJson`
export const dataSourceSave = `${servicePrefix}/dataSource/saveDataSource`
export const dataSourceRemove = `${servicePrefix}/dataSource/remove?id=`
import { ElMessage } from 'element-plus'
export function dataSourceCheck(alias: string) {
  request({
    url: `${servicePrefix}/dataSource/checkConnection?alias=${alias}`,
    method: 'get',
  }).then((result: any) => {
    ElMessage({
      message: result.msg,
      type: 'success',
    })
  })
}

export const dataSourceGet = `${servicePrefix}/dataSource/getObject?id=`

//获取所有的数据源模板
export function getDataSourceTemplateList() {
  return request({
    url: dataSourceDefList,
    method: 'post',
    data: { pageSize: 99, currentPage: 1 },
  })
}

//获取数据源模板的属性列表
export function getTemplateAttrList(templateId: string) {
  return request({
    url: dataSourceDefGet + templateId,
    method: 'GET',
  })
}

//数据源模板管理
export const dataSourceDefList = `${servicePrefix}/dataSourceDef/listJson`
export const dataSourceDefSave = `${servicePrefix}/dataSourceDef/saveDef`
export const dataSourceDefRemove = `${servicePrefix}/dataSourceDef/remove?id=`
export const dataSourceDefGet = `${servicePrefix}/dataSourceDef/getObject?id=`

export function initAttributeList(classPath: string) {
  return request({
    url: `${servicePrefix}/dataSourceDef/initAttributes?classPath=${classPath}`,
    method: 'get',
  })
}

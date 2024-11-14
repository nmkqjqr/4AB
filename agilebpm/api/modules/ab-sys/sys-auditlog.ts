//审计日志
import request from './../../ab-request'
import { sysServicePrefix as servicePrefix } from '../../ab-api-prefix'

export const auditLogList = `${servicePrefix}/auditLog/listJson`
export const auditLogDetail = `${servicePrefix}/auditLog/get?id=`
export const auditLogRemove = `${servicePrefix}/auditLog/remove?id=`

//日志定义
export const logMetadataList = `${servicePrefix}/auditLogMetadata/listJson`
export const logMetadataSave = `${servicePrefix}/auditLogMetadata/save`
export const logMetadataGet = `${servicePrefix}/auditLogMetadata/get?id=`
export const logMetadataRemove = `${servicePrefix}/auditLogMetadata/remove?id=`
export function logMetadataUpdateEnable(id: string, status: boolean) {
  return request({
    url: `${servicePrefix}/auditLogMetadata/updateEnabled`,
    method: 'get',
    params: { id: id, enabled: status },
  })
}
export const logMetadataTestExpressionUrl = `${servicePrefix}/auditLogMetadata/testExpression`

export const logMetadataTestExpression = (expressionData: any) => {
  return request({
    url: logMetadataTestExpressionUrl,
    method: 'POST',
    data: expressionData,
  })
}

export const getDetail = (id: string) => {
  return request({
    url: `${servicePrefix}/auditLog/getDetail?id=${id}`,
    method: 'GET',
  })
}

//获取日志列表左侧树
export function logMetadataTree() {
  return request({
    url: `${servicePrefix}/auditLogMetadata/getTypeTree`,
    method: 'get',
  })
}

//异常日志定义
export const logErrorSave = `${servicePrefix}/logErr/save`
export const logErrorGet = `${servicePrefix}/logErr/get?id=`
export const logErrorRemove = `${servicePrefix}/logErr/remove?id=`
export const logErrorList = `${servicePrefix}/logErr/listJson`

export function logErrorlistJson(param: any) {
  return request({
    url: logErrorList,
    method: 'post',
    data: { queryParam: param },
  })
}

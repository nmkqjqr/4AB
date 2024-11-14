import request from './../../ab-request'
import { sysServicePrefix as servicePrefix } from '../../ab-api-prefix'

// 流水号列表接口
export const BpmSerialNoListUrl = `${servicePrefix}/serialNo/listJson`
// 流水号删除接口
export const removeserialNo = `${servicePrefix}/serialNo/remove?id=`
// 流水号保存接口
export const saveserialNo = `${servicePrefix}/serialNo/save`
// 获取流水号详情接口
export const getserialNo = `${servicePrefix}/serialNo/get?id=`
// 获取下一个流水号
export const getNextNoURL = `${servicePrefix}/serialNo/getNextNo`

// 预览流水号
export function previewserialNo(params: any) {
  return request({
    url: `${servicePrefix}/serialNo/preview`,
    method: 'post',
    data: params,
  })
}
//获取流水号配置
export function getSerialConfigByCode(code: string) {
  return request({
    url: `${servicePrefix}/serialNo/getConfigByCode/${code}`,
    method: 'get',
  })
}
//获取流水号
export function getNextNo(params: any) {
  return request({
    url: getNextNoURL,
    method: 'post',
    data: params ,
  })
}

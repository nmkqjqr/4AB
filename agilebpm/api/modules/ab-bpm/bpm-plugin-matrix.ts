import request from './../../ab-request'
import * as abTools from './../../../utils/ab-tools'

import { bpmServicePrefix as servicePrefix } from '../../ab-api-prefix'

//业务矩阵--分页查询
export const matrixListUrl = `${servicePrefix}/busMatrix/listJson`
//业务矩阵--查询详情
export const matrixGetUrl = `${servicePrefix}/busMatrix/getData`
//业务矩阵--删除数据
export const matrixDeleteUrl = `${servicePrefix}/busMatrix/remove?id=`
//业务矩阵--保存数据
export const matrixSaveUrl = `${servicePrefix}/busMatrix/saveData`
//业务矩阵汇报线设置--分页查询
export const matrixDirectorListUrl = `${servicePrefix}/busMatrixDirectors/queryData`
//业务矩阵汇报线设置--查询详情
export const matrixDirectorGetUrl = `${servicePrefix}/busMatrixDirectors/getData`
//业务矩阵汇报线设置--删除数据
export const matrixDirectorDeleteUrl = `${servicePrefix}/busMatrixDirectors/remove?id=`
//业务矩阵汇报线设置--保存数据
export const matrixDirectorSaveUrl = `${servicePrefix}/busMatrixDirectors/saveData`
//业务矩阵条目--分页查询
export const matrixEntryListUrl = `${servicePrefix}/busMatrixEntry/listJson`
//业务矩阵条目--详情
export const matrixEntryGetUrl = `${servicePrefix}/busMatrixEntry/get`
//业务矩阵条目--删除
export const matrixEntryDeleteUrl = `${servicePrefix}/busMatrixEntry/remove?id=`

//业务矩阵汇报线设置--导出模板
export function matrixDirectorExportTemplate(matrixId: string) {
  request({
    url: `${servicePrefix}/busMatrixDirectors/exportTemplate`,
    method: 'GET',
    params: { matrixId },
    responseType: 'blob',
  }).then((response) => {
    const fileName = decodeURIComponent(
      response.headers['content-disposition'].split('=')[1]
    )
    abTools.downLoadFile(fileName, response.data, 'application/vnd.ms-excel')
  })
}

//业务矩阵汇报线设置--导出数据
export function matrixDirectorExportData(directorIds: string, callBcak: any) {
  request({
    url: `${servicePrefix}/busMatrixDirectors/export`,
    method: 'GET',
    params: { directorIds },
    responseType: 'blob',
  }).then((response) => {
    const fileName = decodeURIComponent(
      response.headers['content-disposition'].split('=')[1]
    )
    abTools.downLoadFile(fileName, response.data, 'application/vnd.ms-excel')
    callBcak()
  })
}
//业务矩阵汇报线设置--导出数据
export function matrixDirectorImportData(data: any, callBcak: any) {
  return request({
    url: `${servicePrefix}/busMatrixDirectors/import`,
    method: 'POST',
    data: data,
    responseType: 'blob',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then((response) => {
    const fileName = decodeURIComponent(
      response.headers['content-disposition'].split('=')[1]
    )
    abTools.downLoadFile(fileName, response.data, 'application/vnd.ms-excel')
    callBcak()
  })
}

export function batchSaveData(dataList: any) {
  return request({
    url: `${servicePrefix}/busMatrixEntry/batchSaveData`,
    method: 'POST',
    data: dataList,
  })
}

//获取矩阵信息
export function getMatrixInfo(matrixId: string) {
  return request({
    url: matrixGetUrl,
    method: 'get',
    params: { id: matrixId },
  })
}

import CryptoJS from 'crypto-js'
import { sysServicePrefix as servicePrefix } from '../../ab-api-prefix'
import useAbStoreAdapter from '../../ab-store'
import request, { abBaseUrl as baseURL, getData } from './../../ab-request'
//  上传接口
export const uploadUrl = `${servicePrefix}/sysFile/upload`
//  文件下载接口
export const downloadUrl = `${servicePrefix}/sysFile/download`

/**
 * 获取浏览文件地址
 * @param fileId 文件ID，也可以是一个浏览地址
 * @returns 浏览文件地址
 */
export function getViewFileUrl(fileId: string): string {
  if (!fileId) {
    return ''
  }
  // 外链直接返回
  if (fileId.startsWith('http')) {
    return fileId
  }
  return `${baseURL + servicePrefix}/sysFile/view/${fileId}`
}

/**
 * 获取在线文档打开地址
 * @param 文档生成的路径参数
 * @returns 在线文件地址
 */
export function getOnlineDocUrl(path: string): string {
  if (!path) {
    return ''
  }
  // 外链直接返回
  if (path.startsWith('http')) {
    return path
  }
  return `${baseURL}/onlineDoc${path}`
}

//使用token对文件ID进行加密
export function getDownload(id: string) {
  return request({
    url: downloadUrl,
    method: 'post',
    data: {
      id: id,
    },
    responseType: 'blob',
  })
}
// export function getDownload(id: string) {
//   return postBlobEncryptData(
//     downloadUrl,
//     {
//       id: id,
//     },
//     id
//   )
// }

//  后台文件下载接口
/* export function downloadFile(id: string) {
  return request({
    url: downloadUrl,
    method: 'post',
    data: getEncryptKey(id),
  })
} */

//  后台文件下载接口
export function downloadFile(id: string) {
  return getData(downloadUrl + '?fileId=' + id)
}

export function getEncryptKey(id: string) {
  const userId = useAbStoreAdapter()?.getAbUser?.userId
  //必须有文件id和token才能下载
  if (!userId || !id) {
    return null
  }
  //由于后端的加密中key的长度有要求，因此前端按照16的长度标准加密
  const userIdStr = CryptoJS.MD5(userId + id).toString()
  return {
    id: id,
    key: userIdStr,
  }
}

//  文件详情接口
export const getUrl = `${servicePrefix}/sysFile/get?id=`

//  文件删除接口
export const delUrl = `${servicePrefix}/sysFile/del?fileId=`

// 文件列表
export const sysFileListUrl = `${servicePrefix}/sysFile/listJson`

//  后台文件下载接口
export function deleteFile(id: string) {
  return request({
    url: delUrl + id,
    method: 'get',
  })
}

// 获取打开文档的地址
export function openFile(param: any) {
  return request({
    url: `${servicePrefix}/sysFile/open`,
    method: 'POST',
    data: param,
  })
}

// 获取打开文档的地址
export function closeFile(param: any) {
  return request({
    url: `${servicePrefix}/sysFile/close`,
    method: 'POST',
    data: param,
  })
}

// 创建并打开文档，获取文件的url 和 id
export function createAndOpen(param: any) {
  return request({
    url: `${servicePrefix}/sysFile/createAndOpen`,
    method: 'POST',
    data: param,
  })
}

export function getFileInfo(fileIds: any) {
  const param = {
    offset: 0,
    limit: 99,
    queryParam: {
      id$VIN: fileIds,
    },
  }
  return request({
    url: `${servicePrefix}/sysFile/listJson`,
    method: 'POST',
    data: param,
  })
}

export function redModel(fileId: any, templateId: any) {
  return getData(`${servicePrefix}/sysFile/redModel`, {
    fileId: fileId,
    templateId: templateId,
  })
}

export function ocr(fileId: string, type: string) {
  return getData(`${servicePrefix}/baiduAi/ocr`, {
    fileId: fileId,
    type: type,
  })
}

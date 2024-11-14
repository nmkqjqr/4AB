import * as abTools from './../../../utils/ab-tools'
import request, { getData, postData } from './../../ab-request'
const servicePrefix = '/ab-bpm/cms/cmsDocument/'
const borrowPrefix = '/ab-bpm/cms/cmsDocumentBorrow/'

// 知识库 文档分页
export const cmsDocumentListUrl = `${servicePrefix}listJson`

// 知识库 超管分页
export const superListJsonUrl = `${servicePrefix}superListJson`

// 知识库 我的文档分页
export const myDocPageUrl = `${servicePrefix}myDocListJson`

// 知识库 审批借阅分页
export const cmsApprovalDocumentListUrl = `${borrowPrefix}approvalListJson`

// 知识库 借阅历史分页
export const cmsHistoricalListUrl = `${borrowPrefix}historicalListJson`

//  知识库 删除接口
export const cmsDocumentRemoveUrl = `${servicePrefix}remove?id=`

// 知识库 增加或修改文档
export const cmsDocumentSaveUrl = `${servicePrefix}saveOrUpdate`

//  知识库 获取指定文档
export const cmsDocumentGetUrl = `${servicePrefix}getById?id=`

// 更新下载数量
export function updateReadNum(id: string) {
  return getData(`${servicePrefix}updateReadNum`, { id: id })
}

// 下载多个文件zip压缩包
export async function downloadZip(selectedData: any[]) {
  const response = await request({
    url: `${servicePrefix}download`,
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

// 借阅
export function borrowDoc(document: any) {
  return postData(`${servicePrefix}borrow`, document)
}

// 收藏
export function favoriteDoc(id: string, favorite: number) {
  return getData(`${servicePrefix}favorite`, {
    id: id,
    favoriteFlag: favorite,
  })
}

// 同意借阅
export function agreeBorrow(id: string) {
  return getData(`${borrowPrefix}agree`, { id: id })
}

// 驳回借阅
export function rejectBorrow(id: string) {
  return getData(`${borrowPrefix}reject`, { id: id })
}

// 归还借阅
export function revertBorrow(id: string) {
  return getData(`${borrowPrefix}revert`, { id: id })
}

// 知识库 获取指定目录或文档
export function getById(id: string) {
  return getData(`${servicePrefix}getById`, { id: id })
}

// 知识库 收藏/取消收藏文档
export function updateFavorite(id: string, flag: number) {
  return getData(`${servicePrefix}favorite`, {
    id: id,
    favoriteFlag: flag,
  })
}

// 知识库 获取目录树
export function fieldListJson(isSuper: boolean) {
  return getData(
    `${servicePrefix}fieldListJson` + (isSuper ? '?isSuper=true' : '')
  )
}

// 知识库 新增目录
export function saveField(field: any) {
  return postData(`${servicePrefix}saveField`, field)
}

// 知识库 修改目录目录
export function updateField(fieldDto: any) {
  return postData(`${servicePrefix}updateField`, fieldDto)
}

// 知识库 修改目录的排序
export function updateFieldSort(node: any) {
  return postData(`${servicePrefix}updateFieldSort`, node)
}

// 知识库 删除目录
export function deleteField(id: string) {
  return getData(`${servicePrefix}deleteField`, { id: id })
}

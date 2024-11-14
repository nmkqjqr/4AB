import { getData, postData } from './../../ab-request'

const servicePrefix = '/ab-bpm/cms/cmsNews'

// 新闻列表 列表接口
export const cmsNewsListUrl = servicePrefix + '/listJson'
// 新闻列表 get详情接口
export const cmsNewsUrl = servicePrefix + '/getOne?id='
// 新闻列表 新增或修改接口
export const cmssaveOrUpdateUrl = servicePrefix + '/saveOrUpdate'
// 新闻列表 发布接口
export const releaseNewsUrl = servicePrefix + '/releaseNews?id='
// 新闻列表 下架接口
export const withdrawNewsUrl = servicePrefix + '/withdrawNews?id='
// 新闻列表 删除接口
export const removeNewsUrl = servicePrefix + '/remove?id='

// 获取两条新闻组件数据
export function getNewsList() {
  return postData(servicePrefix + '/getNewsPage', { pageSize: 2 })
}
// 获取新闻组件分页数据
export function getNewsPage(page: any) {
  return postData(servicePrefix + '/getNewsPage', page)
}

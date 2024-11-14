import request from './../../ab-request'
import { postData } from './../../ab-request'
import { sysServicePrefix as servicePrefix } from '../../ab-api-prefix'

// 翻译管理-分页查询
export const translationList = `${servicePrefix}/sysInternation/listJson`
// 翻译管理-新增
export const saveOrUpdate = `${servicePrefix}/sysInternation/saveOrUpdate`
// 翻译管理-删除
export const removeTranslation = `${servicePrefix}/sysInternation/remove?id=`

/**
 * 获取包
 * @returns {Promise}
 */
export async function getPackages() {
  return request({
    url: `${servicePrefix}/sysInternation/getPackages`,
  })
}

/**
 * 自动翻译
 * @param chineseText 中文文本
 * @param toLanguages 翻译目标语言
 * @returns {Promise}
 */
export async function autoTranslate(
  chineseText: string,
  toLanguages: string[]
) {
  return request({
    url: `${servicePrefix}/sysInternation/autoTranslate`,
    method: 'POST',
    data: { chineseText, toLanguages },
  })
}

/**
 * 获取指定前缀的翻译
 * @param prefix
 * @returns
 */
export function getLangs(prefix: any = '') {
  let params = []
  //兼容单一字符串入参方式
  if (typeof prefix == 'string') {
    params.push(prefix)
  } else {
    params = prefix
  }
  return postData(`${servicePrefix}/sysInternation/getLangs`, params)
}

export function getLanguageList() {
  return request({
    url: `${servicePrefix}/sysInternation/getLanguageList`,
    method: 'get',
  })
}

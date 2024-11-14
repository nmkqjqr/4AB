//系统工具类
import request from './../../ab-request'
import { sysServicePrefix as servicePrefix } from '../../ab-api-prefix'

//拼音请求
export const PinyinUrl = `${servicePrefix}/tools/pinyin`
//接口实现类获取
export function InterFaceImpls(classPath: string) {
  return request({
    url: `${servicePrefix}/tools/getInterFaceImpls`,
    method: 'GET',
    params: { classPath },
  })
}

// 系统工具-查看枚举类型
export const sysToolsGetEnum = `${servicePrefix}/tools/getEnum?listMode=1&path=`

export const SysToolsGetEnumUrl = `${servicePrefix}/tools/getEnum`

// 获取icon接口
export const getIcon = `${servicePrefix}/tools/getIcon`

/**
 * 查询枚举
 * eg1：let enumObj = await AbUtil.getEnum(val)
 * eg2：AbUtil.getEnum('com.dstz.jdbc.api.enums.ColumnType').then((resp) => {
    info.ColumnType = resp.data
  })
 * @param path
 * @param listMode
 * @param key 在非list模式下，以枚举中的指定key来构建map
 */
export function getEnum(path: string, listMode = false, key = '') {
  const url = `${SysToolsGetEnumUrl}?path=${path}&listMode=${listMode}&key=${key}`
  return request({
    url: url,
    method: 'GET',
  })
}

/**
 * 获取当前数据源信息
 * @returns
 */
export function getCurrentDataSource() {
  const url = `${servicePrefix}/tools/getCurrentDataSource`
  return request({
    url: url,
    method: 'GET',
  })
}

/**
 * 解析含有freeMark 变量 的字符串的方法
 * @param str
 * @returns
 */
export function parseStrByFreeMarker(str: string) {
  const url = `${servicePrefix}/tools/parseStrByFreeMarker`
  return request({
    url: url,
    method: 'POST',
    data: { str: str },
  })
}

/**
 * 获取用户Scode
 * @returns
 */
export function getScode() {
  const url = `${servicePrefix}/tools/getScode`
  return request({
    url: url,
    method: 'GET',
  })
}

import { getCacheData } from '~/agilebpm/utils/ab-cache'
import { sysServicePrefix as servicePrefix } from '../../ab-api-prefix'
import request, { getData, postData } from './../../ab-request'

// 获取字典树
export function getDictTreeUrl(data: any) {
  return request({
    url: `${servicePrefix}/dataDict/getDictTree`,
    method: 'post',
    data,
  })
}
// 分页获取字典列表
export const getDictListUrl = `${servicePrefix}/dataDict/getDictList`
// 自定义对话框请求数据字典接口
export const getDictTypeTreeUrl = `${servicePrefix}/dataDict/getDictTypeTree`
// 删除字典
export const removeDataDictUrl = `${servicePrefix}/dataDict/remove?id=`
// 保存数据字典
export const saveDataDictUrl = `${servicePrefix}/dataDict/save`
// 批量保存字典项
export const saveBatchDataDictUrl = `${servicePrefix}/dataDict/saveBatch`

// 同步字典相关的国际化翻译
export const internation = `${servicePrefix}/dataDict/internation`

//通过code获取字典项，数据为列表结构（不包含父）
export function getDictListByCode(dictCode: string) {
  const cacheCode = `getDictListByCode_${dictCode}}`
  return getCacheData(cacheCode, async () => {
    return Promise.resolve({
      then: function (resolve: any, reject: any) {
        if (!dictCode) {
          resolve()
        }
        //如果数据为空， 或者数据中找不到此code 则赋值
        getData(`${servicePrefix}/dataDict/getDictNodeList`, {
          dictKey: dictCode,
        }).then((rel) => {
          resolve(rel.data)
        })
      },
    })
  })
}

//通过code获取字典项，数据为树形结构（不包含父）
export function getDictTreeByCodeNoRoot(dictCode: string) {
  const cacheCode = `getDictTreeNoRoot_${dictCode}}`
  return getCacheData(cacheCode, async () => getDictTree(dictCode, false, null))
}

//通过code获取字典项  数据为树形结构 自己传参
export function getDictDataUrl(params: any) {
  return postData(`${servicePrefix}/dataDict/getDictData`, params)
}

//表单组件获取所有字典分类接口 包含不包含父 都共用一个map， 不包含父的多取一层返回
const getDictTree = (dictCode: string, hasRoot: boolean, rootName: any) => {
  return Promise.resolve({
    then: function (resolve: any, reject: any) {
      if (!dictCode) {
        resolve()
      }
      //如果数据为空， 或者数据中找不到此code 则赋值
      return postData(`${servicePrefix}/dataDict/getDictData`, {
        dictKey: dictCode,
        hasRoot: hasRoot,
        rootName: rootName,
      }).then((rel) => {
        if (rel.data && rel.data.length > 0) {
          resolve(rel.data)
        }
      })
    },
  })
}
//通过code获取字典项  数据为树形结构 (包含父)   (无缓存的，对于部分请求不需要缓存)
export function getDictTreeByCodeNoCache(dictCode: string) {
  return postData(`${servicePrefix}/dataDict/getDictData`, {
    dictKey: dictCode,
    hasRoot: true,
  })
}

//表单组件获取所有字典分类接口
export function getDictList() {
  return request({
    url: getDictListUrl,
    method: 'post',
    data: {
      pageSize: 999,
      currentPage: 1,
    },
  })
}

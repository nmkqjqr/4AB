import { bizServicePrefix } from '../../ab-api-prefix'

//业务表保存
export const BizTableSave = `${bizServicePrefix}/bizTable/saveAndCreate`
//业务表获取
export const BizTableGet = `${bizServicePrefix}/bizTable/getTable?fill=1&id=`
//业务表获取
export const BizSimTableGet = `${bizServicePrefix}/bizTable/getTable`
//业务表列表
export const BizTableListJson = `${bizServicePrefix}/bizTable/listJson`
//业务表删除
export const BizTableRemove = `${bizServicePrefix}/bizTable/remove?id=`
//业务表生成表
export const BizTableCreateTable = `${bizServicePrefix}/bizTable/createTable`
//业务表查询表/视图信息
export const BizTableSearchObjName = `${bizServicePrefix}/bizTable/searchObjName`

//  获取当前首页组件得详情
export function BizTableGetById(id: any) {
  return getData(BizTableGet + id)
}

//根据表名获取
export function bizSimTableGetFun(code: string) {
  return getData(BizSimTableGet, {
    code: code,
    fill: 1,
  })
}

import { getData, getDataUrl } from './../../ab-request'
/**
 * 查询库中名称跟objName相似的表/视图
 * eg:
 * AbUtil.searchObjName(info.data.dsKey, info.objName).then((resp: any) => {
 *  info.tableMap = resp.data
 * })
 * @param dsKey 数据源别名
 * @param objName 名称
 * @param objType table：表；view：视图
 * @returns
 */
export function searchObjName(
  dsKey: string,
  objName: string,
  objType = 'table'
) {
  return getData(BizTableSearchObjName, {
    dsKey: dsKey,
    objName: objName,
    objType: objType,
  })
}

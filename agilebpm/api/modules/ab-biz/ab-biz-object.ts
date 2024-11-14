import { bizServicePrefix } from '../../ab-api-prefix'
import { getData, postData } from './../../ab-request'

//业务对象保存
export const BizObjectSave = `${bizServicePrefix}/bizObject/save`
//业务对象获取
export const BizObjectGet = `${bizServicePrefix}/bizObject/getBo?fill=1&id=`
//业务对象获取
export const BizObjectGets = `${bizServicePrefix}/bizObject/getBos?fill=1`
//业务对象列表
export const BizObjectListJson = `${bizServicePrefix}/bizObject/listJson`
//业务对象删除
export const BizObjectRemove = `${bizServicePrefix}/bizObject/remove?id=`

//获取业务对象
export function getBizObject(boCode: any) {
  return new Promise((resolve) => {
    getData(BizObjectGet, {
      code: boCode,
    }).then((resp) => {
      const getRel = (tableCode: any, rel: any) => {
        rel = rel || resp.data.rel
        if (rel.tableCode == tableCode) return rel
        let result
        rel.children.forEach((c: any) => {
          result = getRel(tableCode, c)
        })
        return result
      }
      resp.data.getRel = getRel
      resolve(resp)
    })
  })
}

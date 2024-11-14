import { bizServicePrefix } from '../../ab-api-prefix'

//获取全部业务校验列表
export const GetAllBizValidatorUrl = `${bizServicePrefix}/bizPattern/getAllBizValidator`
//获取业务校验列表
export const BizPatternListJson = `${bizServicePrefix}/bizPattern/listJson`
//业务校验删除
export const BizPatternRemove = `${bizServicePrefix}/bizPattern/remove?id=`
//校验java正则的结果
export const BizPatternTestJava = `${bizServicePrefix}/bizPattern/testJava`
//业务校验获取
export const BizPatternGet = `${bizServicePrefix}/bizPattern/get?id=`
//业务校验保存
export const BizPatternSave = `${bizServicePrefix}/bizPattern/save`

import { getData } from './../../ab-request'
/**
 * 获取系统支持的内置全部校验器（elemnt form需要的格式）
 */
export function getAllBizValidator() {
  return new Promise((resolve) => {
    getData(GetAllBizValidatorUrl).then((resp) => {
      Object.values(resp.data).forEach((val: any) => {
        try {
          val.rule = {
            pattern: eval(`/${val.uiInfo}/`),
            message: val.message,
          }
          val.check = (obj: any) => {
            return val.rule.pattern.test(obj)
          }
        } catch (e) {
          console.error(
            `业务校验【${val.name}（${val.key}）】配置不合法，请修改配置：${val.uiInfo}`
          )
        }
      })
      resolve(resp.data)
    })
  })
}

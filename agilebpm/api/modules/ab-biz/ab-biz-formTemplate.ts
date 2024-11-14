import { bizServicePrefix } from '../../ab-api-prefix'
const servicePrefix = `${bizServicePrefix}/bizFormTemplate`
import { getData, postData } from './../../ab-request'

// 表单模版管理-分页查询
export const bizFormTemplateListJson = `${servicePrefix}/listJson`
// 表单模版管理-通过ID查询
export const bizFormTemplateGet = `${servicePrefix}/get?id=`
// 表单模版管理-通过ID查询
export const bizFormTemplateInitTemplate = `${servicePrefix}/initTemplate`
// 表单模版管理-新增或修改
export const bizFormTemplateSaveOrUpdate = `${servicePrefix}/saveOrUpdate`
// 表单模版管理-删除
export const bizFormTemplateRemove = `${servicePrefix}/remove?id=`
//获取所有模板
export const getAll = () => {
  return postData(bizFormTemplateListJson, {
    limit: 100,
    offset: 0,
  })
}

export const getSql = () => {
  return getData(`${servicePrefix}/getSql`)
}

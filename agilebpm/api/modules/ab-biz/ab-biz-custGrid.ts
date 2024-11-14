import * as abTools from '~/agilebpm/utils/ab-tools'
import { bizServicePrefix as servicePrefix } from '../../ab-api-prefix'
import request, { getData, postData } from './../../ab-request'

//获取自定义列表
export const bizCustGridListUrl = `${servicePrefix}/bizCustGrid/listJson`

export function custGridList(code: string, param: any) {
  if (param) {
    param.pageSize = 999
  } else {
    param = { pageSize: 999 }
  }
  return postData(`${servicePrefix}/bizCustGrid/view/list_` + code, param)
}

//自定义列表启用
export const publishUrl = `${servicePrefix}/bizCustGrid/publish?ids=`
//自定义列表禁用
export const disabledUrl = `${servicePrefix}/bizCustGrid/disabled?ids=`
//导出
export function exportbizCustGridUrl(id: any) {
  return postData(`${servicePrefix}/bizCustGrid/export`, { id: id }).then(
    (res: any) => {
      if (!res.data || !res.data.dataList || res.data.dataList.length === 0) {
        return
      }
      let name = res.data.dataList[0].name
      if (res.data.dataList.length > 1) {
        name = `${name}等${res.data.dataList.length}个应用`
      }
      abTools.downLoadFile(
        `${name}.grid`,
        JSON.stringify(res.data),
        'application/json'
      )
    }
  )
}

//列表导出
export function exportCodeUrl(code: any, data: any) {
  return request({
    url: `${servicePrefix}/bizCustGrid/view/export_${code}`,
    method: 'POST',
    responseType: 'blob',
    data: data,
    timeout: 1000 * 60,
  })
}

//模板下载
export function exportTemplateUrl(code: any, data: any) {
  return request({
    url: `${servicePrefix}/bizCustGrid/view/exportTemplate_${code}`,
    method: 'POST',
    data: data,
    responseType: 'blob',
  })
}

// 导出测试
export function testExport(data: any) {
  return request({
    url: `${servicePrefix}/bizCustGrid/view/export_testview_2`,
    method: 'POST',
    data: data,
    responseType: 'blob',
  })
}

//自定义列表导入
export const importbizCustGridUrl = `${servicePrefix}/bizCustGrid/import`
//删除自定义列表
export const bizCustGridRemoveUrl = `${servicePrefix}/bizCustGrid/remove?ids=`
//通过Sql查询主键名称
export const parseSqlUrl = `${servicePrefix}/bizCustGrid/parseSql`
//自定义列表处理sql别名
export const addAliasesUrl = `${servicePrefix}/bizCustGrid/addAliases`
//自定义列表保存
export const saveCustUrl = `${servicePrefix}/bizCustGrid/saveCust`
//自定义编辑详情
export const custGetByCodeUrl = `${servicePrefix}/bizCustGrid/getByCode?code=`
//自定义详情批量
export const custGetGetByCodesUrl = `${servicePrefix}/bizCustGrid/getByCodes?codes=`
//根据表单key查询出关联业务对象的主表
export const getTableNameByFormKeyUrl = `${servicePrefix}/bizForm/getTableNameByFormKey?code=`
//应用获取BOcode
export const getFormUrl = `${servicePrefix}/bizForm/getForm?code=`
//根据别名获取自定义sql对象
export const voUrl = `${servicePrefix}/bizCustGrid/view/vo_`
//加入菜单成功保存id
export const editResourceIdUrl = `${servicePrefix}/bizCustGrid/editResourceId`
//根据别名获取列表
export const listUrl = `${servicePrefix}/bizCustGrid/view/list_`
// 调试sql
export const debuggerUrl = `${servicePrefix}/bizCustGrid/view/sql_`
// 事件按钮方法（旧配置）
export const changeDataStatus = `${servicePrefix}/bizCustGrid/view/changeData`
// 保存子表
export const tableJoinUrl = `${servicePrefix}/bizCustGrid/tableJoin`

// 同步对话框相关的国际化翻译
export const internation = `${servicePrefix}/bizCustGrid/internation`

//获取自定义列表的配置
export const getCustGridVo = (code: string) => {
  return getData(`${servicePrefix}/bizCustGrid/view/vo_${code}`)
}

//获取自定义列表的数据列表
export const getCustGridList = (code: string, obj: any) => {
  return postData(`${servicePrefix}/bizCustGrid/view/list_${code}`, obj)
}

//获取BOcode
export const getFormInfoByDefKey = (defKey: string) => {
  return getData(`/ab-bpm/bpm/definition/getFormInfoByDefKey`, {
    defKey: defKey,
  })
}

//消息模板
import request from './../../ab-request'
import { sysServicePrefix as servicePrefix } from '../../ab-api-prefix'


// import { dataSourceDefList } from  "~/agilebpm/api/modules/ab-sys/sys-datasource";

//消息模板-数据列表
export const messageTemplateListUrl = `${servicePrefix}/messageTemplate/listJson`

//消息模板-获取数据
export const messageTemplateGetUrl = `${servicePrefix}/messageTemplate/get`

//消息模板-删除数据
export const messageTemplateDelUrl = `${servicePrefix}/messageTemplate/remove?id=`

//消息模板-保存数据
export const messageTemplateSaveUrl = `${servicePrefix}/messageTemplate/save`



//查询可用消息模板列表
export function getMessageTemplateEnableList() {
  return request({
    url: `${servicePrefix}/messageTemplate/getEnabledTemplate`,
    method: 'POST',
  })
}


//查询可用消息模板列表
export function getTemplateByCode(code: string) {
  return request({
    url: `${servicePrefix}/messageTemplate/getTemplateByCode?code=${code}`,
    method: 'POST',
  })
}

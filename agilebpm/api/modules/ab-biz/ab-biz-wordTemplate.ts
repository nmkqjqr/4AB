import { bizServicePrefix } from '../../ab-api-prefix'

//保存
export const BizWordTemplateSave = `${bizServicePrefix}/bizWordTemplate/save`
//获取
export const BizWordTemplateGet = `${bizServicePrefix}/bizWordTemplate/get?id=`
//列表
export const BizWordTemplateListJson = `${bizServicePrefix}/bizWordTemplate/listJson`
//删除
export const BizWordTemplateRemove = `${bizServicePrefix}/bizWordTemplate/remove?id=`

import request, { getData, postData } from '../../ab-request'

export const printFormData = (
  wordCode: string,
  data: any,
  type: string,
  immediate = false,
  isMb = false,
  bpmTask = null,
  bpmInstance = null
) => {
  return request({
    url: `${bizServicePrefix}/bizWordTemplate/printFormData`,
    method: 'post',
    responseType: 'blob',
    data: {
      wordCode: wordCode,
      data: data,
      type: type,
      immediate: immediate,
      isMb: isMb,
      bpmTask: bpmTask,
      bpmInstance: bpmInstance,
    },
  })
}

export const getByCode = (code: string) => {
  return getData(`${bizServicePrefix}/bizWordTemplate/getWord`, {
    code: code,
  })
}

export const getWordXml = (fileId: string) => {
  return getData(`${bizServicePrefix}/bizWordTemplate/getWordXml`, {
    fileId: fileId,
  })
}

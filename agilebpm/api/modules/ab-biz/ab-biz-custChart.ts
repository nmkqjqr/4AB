import { bizServicePrefix } from '../../ab-api-prefix'
import { postData } from '../../ab-request'
const servicePrefix = bizServicePrefix + '/bizCustChart/'

//通过类型和code获取数据
export function custDataByCode(code: string, type: string) {
  return custGridDataByCode(code, type, null, null)
}

//通过类型和code获取数据
export function custGridDataByCode(
  code: string,
  type: string,
  condition: any,
  limit: any
) {
  return postData(
    `${servicePrefix}custDataByCode?code=${code}&type=${type}${
      limit ? `&limit=${limit}` : ''
    }`,
    condition && Array.isArray(condition) ? condition : []
  )
}

//通过数据获取表单数据
export function custFormDataByCode(formDto: any) {
  return postData(`${servicePrefix}custFormDataByCode`, formDto)
}

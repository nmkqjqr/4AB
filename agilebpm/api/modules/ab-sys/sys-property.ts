//审计日志
import { getData, postData } from './../../ab-request'
import { sysServicePrefix as servicePrefix } from '../../ab-api-prefix'

export const propertyList = `${servicePrefix}/properties/listJson`
export const propertyRemove = `${servicePrefix}/properties/remove?id=`
export const propertySave = `${servicePrefix}/properties/save`
export const propertyGet = `${servicePrefix}/properties/get?id=`

export const getByCode = (code: string) => {
  return getData(`${servicePrefix}/properties/getByCode`, {
    code: code,
  })
}

export const getMobileUrl = async () => {
  const data = await getByCode('mobileUrl')
  return data.data || `${location.origin}/app`
}

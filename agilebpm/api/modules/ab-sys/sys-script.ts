import request from './../../ab-request'
import { sysServicePrefix as servicePrefix } from '../../ab-api-prefix'

export const scriptList = `${servicePrefix}/script/listJson`
export const scriptRemove = `${servicePrefix}/script/remove?id=`
export const scriptSave = `${servicePrefix}/script/save`
export const scriptGet = `${servicePrefix}/script/get?id=`
export function scriptTest(key: string, script: string) {
  return request.postForm(`${servicePrefix}/script/executeScript`, {
    key,
    script,
  })
}

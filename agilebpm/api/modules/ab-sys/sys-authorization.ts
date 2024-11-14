import { getData, postData } from './../../ab-request'

const servicePrefix = '/ab-bpm/sys/authorization'

//获取授权
export function getAuthorization(authorization: Authorization) {
  return postData(`${servicePrefix}/getAuthorizations`, authorization)
}

//保存授权
export function saveAuthorization(authorization: Authorization) {
  return postData(`${servicePrefix}/saveAuthorization`, authorization)
}

//授权对象泛型
interface Authorization {
  rightsTarget: string
  rightsObject: string
  authorizationList: Array<{
    rightsType: string
    rightsIdentity: string
    rightsIdentityName: string
  }>
}

import request from './../../ab-request'
import { sysServicePrefix as servicePrefix } from '../../ab-api-prefix'

//根据组织id查询所属用户
export async function queryGroupUserById(data: any) {
  return request({
    url: servicePrefix + '/userOrg/queryGroupUserById',
    method: 'GET',
    params: data,
  })
}

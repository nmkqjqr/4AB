import request from './../../ab-request'
import { bizServicePrefix } from '../../ab-api-prefix'

const servicePrefix = `${bizServicePrefix}/dialogDataSource`

export const getUserByGroupUrl = servicePrefix + '/getUserByGroup'

export async function getUserByGroup(data: any) {
  return request({
    url: getUserByGroupUrl,
    method: 'get',
    params: data,
  })
}

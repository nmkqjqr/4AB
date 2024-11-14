import { request } from '~/agilebpm'

export function getList() {
  return request({
    url: '/router/getList',
    method: 'get',
  })
}

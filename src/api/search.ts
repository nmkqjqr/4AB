import { request } from '~/agilebpm'

export function getList() {
  return request({
    url: '/search/getList',
    method: 'get',
  })
}

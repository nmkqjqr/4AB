//公共资源，白订单设置
import request from './../../ab-request'
const servicePrefix = '/ab-bpm/sys/resourceAuth'

//公共资源列表
export const publicResourceList = `${servicePrefix}/listJson`

//公共资源保存
export const publicResourceSave = `${servicePrefix}/save`

//公共资源获取
export const publicResourceGet = `${servicePrefix}/get?id=`

//公共资源删除
export const publicResourceDel = `${servicePrefix}/remove?id=`

//公共资源删除
export const publicResourceUpdateStatusUrl = `${servicePrefix}/updateStatus`

// 应用管理-国际化
export const internation = `/ab-bpm/sys/resource/internation`

export function publicResourceUpdateStatus(id: string, type: number) {
  return request({
    url: publicResourceUpdateStatusUrl,
    method: 'get',
    params: { id: id, type: type },
  })
}

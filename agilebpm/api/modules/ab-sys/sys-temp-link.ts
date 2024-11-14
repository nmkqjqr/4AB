import request from './../../ab-request'
import { sysServicePrefix as servicePrefix } from '../../ab-api-prefix'

export const openLinkUrl = `${servicePrefix}/tempLink/open/`
export const tempLinkListUrl = `${servicePrefix}/tempLink/listJson`

export const tempLinkLogListUrl = `${servicePrefix}/tempLink/logListJson`

export const tempLinkRemove = `${servicePrefix}/tempLink/remove?id=`

export function openLink(code: any) {
  return request({
    url: `${openLinkUrl}${code}`,
    method: 'GET',
  })
}

export function sendLogDetail(id: any) {
  return request({
    url: `${servicePrefix}/tempLink/getLogDetail?id=${id}`,
    method: 'GET',
  })
}

export function sendLogMsg(id: any) {
  return request({
    url: `${servicePrefix}/tempLink/getLogMsg?id=${id}`,
    method: 'GET',
  })
}

export function getTempLinkUrl(bizId: string, bizType: string) {
  return request({
    url: `${servicePrefix}/tempLink/getTempLinkUrl?bizId=${bizId}&bizType=${bizType}`,
    method: 'GET',
  })
}

export function renewal(params: any) {
  return request({
    url: `${servicePrefix}/tempLink/renewal`,
    method: 'POST',
    data: params,
  })
}

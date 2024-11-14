import { getData } from '../../ab-request'
const servicePrefix = '/ab-bpm/cms/cmsPortal/'

export function getList() {
  return getData(servicePrefix + 'getVoByCode?code=')
}

//批量删除的方法
export function cmsPortalRemoveFn(ids: string) {
  return getData(servicePrefix + 'remove?id=' + ids)
}

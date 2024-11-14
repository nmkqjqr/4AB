import { getData } from '../../ab-request'
const servicePrefix = '/ab-bpm/cms/cmsChart/'

//通过首页组件code获取所有数据
export function allDataByCode(homeCode: string) {
  return getData(`${servicePrefix}allDataByCode`, { homeCode: homeCode })
}

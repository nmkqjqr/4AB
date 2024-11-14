import request from './../../ab-request'
import { sysServicePrefix as servicePrefix } from '../../ab-api-prefix'
import { abTools } from '~/agilebpm'

/**
 * 获取产品授权信息
 */
export const getProductLicenceInfo = () => {
  return new Promise<any>((resolve, reject) => {
    //@ts-ignore
    request({
      url: `${servicePrefix}/licenceInfo`,
      skipHandleData: true,
    })
      .then((text) => {
        const apiResponse = JSON.parse(abTools.decrypt(text))
        resolve(apiResponse)
      })
      .then(reject)
  })
}

export const getDailyPhrases = () => {
  return request({
    url: `${servicePrefix}/sysDailyPhrases/list`,
    method: 'GET',
  })
}

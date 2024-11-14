import request from './../../ab-request'
import { bpmServicePrefix as servicePrefix } from '../../ab-api-prefix'

//获取流程指引
export function getNodeExplain(param: any) {
  return request({
    url: `${servicePrefix}/bpmPluginBotton/getNodeExplain`,
    method: 'POST',
    data: param,
  })
}

import { bpmServicePrefix } from '../../ab-api-prefix'
import { getData, postData } from './../../ab-request'

//获取会签管理按钮弹框需要的信息
export function getManageInfo(taskId: any) {
  return getData(`${bpmServicePrefix}/bpmPluginSign/getManageInfo`, {
    taskId: taskId,
  })
}

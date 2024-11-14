import { postData } from './../../ab-request'
import request from './../../ab-request'
import { sysServicePrefix as servicePrefix } from '../../ab-api-prefix'

// 定时计划
export const crontabList = `${servicePrefix}/crontab/listJson`
export const crontabSave = `${servicePrefix}/crontab/save`
export const crontabGet = `${servicePrefix}/crontab/get`
export const crontabRemove = `${servicePrefix}/crontab/remove`
export const crontabAtOnce = `${servicePrefix}/crontab/atOnceTask`
export const crontabChangeEnable = `${servicePrefix}/crontab/changeEnable`

/**
 * 获取定时计划下次触发时间
 * @param cronExpress cron表达式
 */
export function getCrontabNextTriggerTimes(cronExpress: string) {
  return request({
    url: `${servicePrefix}/crontab/nextTriggerTimes`,
    method: 'get',
    params: {
      cronExpression: cronExpress,
    },
  })
}

export function crontabSaveOrUpdate(param: any) {
  return postData(`${servicePrefix}/crontab/save`, param)
}

export function getCrontab(id: any) {
  return request({
    url: `${servicePrefix}/crontab/get?id=${id}`,
    method: 'get',
  })
}

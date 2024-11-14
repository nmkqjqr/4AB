import request from './../../ab-request'
import { sysServicePrefix as servicePrefix } from '../../ab-api-prefix'

//节假日配置
export const holidayList = `${servicePrefix}/calendar/holidayConf/listJson`
export const holidayRemove = `${servicePrefix}/calendar/holidayConf/remove?id=`
export const holidaySave = `${servicePrefix}/calendar/holidayConf/save`
export const holidayGet = `${servicePrefix}/calendar/holidayConf/get?id=`

export function holidayTest(testData: any) {
  return request({
    url: `${servicePrefix}/calendar/holidayConf/test`,
    method: 'POST',
    data: testData,
  })
}

export function getHolidayDays(param: any) {
  return request({
    url: `${servicePrefix}/calendar/holidayConf/getHolidayDays`,
    method: 'POST',
    data: param,
  })
}

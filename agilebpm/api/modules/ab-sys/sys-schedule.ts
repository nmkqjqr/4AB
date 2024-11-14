import { sysServicePrefix as servicePrefix } from '../../ab-api-prefix'

// 日程列表接口
export const scheduleList = `${servicePrefix}/calendar/schedule/listJson`
// 删除日程接口
export const removeSchedule = `${servicePrefix}/calendar/schedule/remove?id=`
// 保存日程接口
export const saveSchedule = `${servicePrefix}/calendar/schedule/saveSchedule`
// 获取日程详情接口
export const getSchedule = `${servicePrefix}/calendar/schedule/getById?id=`
// 删除参与者
export const itemDelete = `${servicePrefix}/calendar/schedule/itemDelete?id=`
// 获取日程
export const schedulegetEvents = `${servicePrefix}/calendar/schedule/getEvents`
// 完成日程
export const completeTask = `${servicePrefix}/calendar/schedule/completeTask`

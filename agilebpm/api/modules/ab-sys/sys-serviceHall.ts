import { getData } from './../../ab-request'
const servicePrefix = '/ab-bpm/sys/serviceHall'

// 办事大厅
export const getAll = `${servicePrefix}/getAll`
// 办事大厅-详情
export const detail = `${servicePrefix}/detail`

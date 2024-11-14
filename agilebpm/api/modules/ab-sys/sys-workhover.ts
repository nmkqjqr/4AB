import { getData, postData } from './../../ab-request'
import { sysServicePrefix as servicePrefix } from '../../ab-api-prefix'

const apiPrefix = `${servicePrefix}/workHandover`

export const listJsonUrl = `${apiPrefix}/listJson`
export const deleteUrl = `${apiPrefix}/remove?id=`
export const saveUrl = `${apiPrefix}/save`
export const getUrl = `${apiPrefix}/get?id=`
export const removeHandoverIdUrl = `${apiPrefix}/removeByHandoverId?handoverId=`

export const personalList = (userId: string) => {
  return getData(`${apiPrefix}/personalList?userId=${userId}`)
}

export const edit = (data: any) => {
  return postData(`${apiPrefix}/edit`, data)
}

export const getReceiverList = (userId: string) => {
  return getData(`${apiPrefix}/receiverList?userId=${userId}`)
}

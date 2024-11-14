//权限转移
import request from './../../ab-request'
import { getData, postData } from './../../ab-request'
const servicePrefix = '/ab-bpm/sys/authTransfer'

export const queryTransferLogUrl = `${servicePrefix}/listJson`

export const queryTransferUrl = `${servicePrefix}/queryTransfer`

export const authTransferUrl = `${servicePrefix}/authTransfer`

export function queryTransfer(transferQueryDTO: any) {
  return postData(queryTransferUrl, transferQueryDTO)
}

export function authTransfer(authTransferDTO: any) {
  return postData(authTransferUrl, authTransferDTO)
}

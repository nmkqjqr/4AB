import { storage } from '@/config'
import { setByConf, getByConf, removeByConf } from '@/utils/tool'
/**
 * @description 获取refreshToken
 */
export function getRefreshToken() {
  getByConf('refreshToken')
}

/**
 * @description 设置refreshToken
 */
export function setRefreshToken(refreshToken: string) {
  setByConf('refreshToken', refreshToken)
}

/**
 * @description 删除refreshToken
 */
export function removeRefreshToken() {
  removeByConf('refreshToken')
}

/**
 * @description 设置失效时间
 */
export function setRefreshTime(refreshTime: any) {
  setByConf('refreshTime', refreshTime)
}

/**
 * @description 获取失效时间
 */
export function getRefreshTime() {
  getByConf('refreshTime')
}

/**
 * @description 删除失效时间
 */
export function removeRefreshTime() {
  removeByConf('refreshTime')
}

/**
 * @description 删除refreshToken
 */
export function removeGrid() {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.removeItem('grid')
    }
  }
}
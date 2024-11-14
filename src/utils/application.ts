import { storage } from '@/config'
/**
 * @description 获取application (用于判断当前用户登录的哪个应用系统)
 */
export function getApplication() {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.getItem('application')
    }
  }
}

/**
 * @description 设置application
 */
export function setApplication(applicationStr: string) {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.setItem('application', applicationStr)
    }
  }
}

/**
 * @description 删除application
 */
export function removeApplication() {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.removeItem('application')
    }
  }
}

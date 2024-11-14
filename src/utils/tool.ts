import { storage, tokenTableName } from '@/config'
import cookie from 'js-cookie'

export function set(table: string, settings: any) {
  const _set = JSON.stringify(settings)
  return localStorage.setItem(table, _set)
}

export function get(table: string) {
  let data = localStorage.getItem(table)
  try {
    data = JSON.parse(data || '0')
  } catch (err) {
    return null
  }
  return data
}

export function remove(table: string) {
  return localStorage.removeItem(table)
}

export function clear() {
  return localStorage.clear()
}

export function setByConf(table: string, settings: any) {
  const _set = JSON.stringify(settings)
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.setItem(table, _set)
    } else if ('sessionStorage' === storage) {
      return sessionStorage.setItem(table, _set)
    } else if ('cookie' === storage) {
      return cookie.set(table, _set)
    } else {
      return localStorage.setItem(table, _set)
    }
  } else {
    return localStorage.setItem(table, _set)
  }
}

export function getByConf(table: string) {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.getItem(table)
    } else if ('sessionStorage' === storage) {
      return sessionStorage.getItem(table)
    } else if ('cookie' === storage) {
      return cookie.get(table)
    } else {
      return localStorage.getItem(table)
    }
  } else {
    return localStorage.getItem(table)
  }
}

export function removeByConf(table: string) {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.removeItem(table)
    } else if ('sessionStorage' === storage) {
      return sessionStorage.clear()
    } else if ('cookie' === storage) {
      return cookie.remove(table)
    } else {
      return localStorage.removeItem(table)
    }
  } else {
    return localStorage.removeItem(table)
  }
}

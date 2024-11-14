import { VabRouteMeta, VabRouteRecord } from '/#/router'

declare interface AclModuleType {
  admin: boolean
  role: string[]
  permission: string[]
  buttonPermission: any
  userMenuList: any
}

declare interface ErrorLogModuleType {
  errorLogs: any[]
}

declare interface RoutesModuleType {
  tab: {
    data: string | undefined
  }
  tabMenu: string | undefined
  activeMenu: {
    data: string | undefined
  }
  routes: VabRouteRecord[]
  defaultOpenNames: any[]
}

declare type DeviceType = 'mobile' | 'desktop'
declare type LanguageType = string

declare interface SettingsModuleType {
  theme: ThemeType
  device: DeviceType
  collapse: boolean
  language: LanguageType
  lock: boolean
  logo: string
  lightLogo: string
  darkLogo: string
  systemName: string
  waterMark: Number
  custom: string
  configuration: string['username']
  comName: string
  title: string
  echartsGraphic1: string[]
  echartsGraphic2: string[]
}

declare interface TabsModuleType {
  visitedRoutes: VabRouteRecord[]
}

declare interface OptionType {
  fullPath: string | undefined
  name?: string
  title?: string
  meta: VabRouteMeta
}

declare interface UserModuleType {
  token: string | boolean
  username: string
  abUser: AbUser
  avatar: string
}

declare interface AbUser {
  // 用户ID
  userId?: string
  // 用户名
  fullName?: string
  // 用户账户
  username?: string
}

declare interface I18nModuleType {
  // 用户ID
  languageList: language[]
  langs: any
}

declare interface language {
  name: string
  key: string
}

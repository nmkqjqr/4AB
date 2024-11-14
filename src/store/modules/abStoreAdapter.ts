/**
 * AgileBPM 模块依赖的状态管理，需要自行实现关键接口
 */
// 引入已有功能，如果在自行平台，可引入自身的，或者实现相关接口
import { useAclStore } from './acl'
import { useTabsStore } from './tabs'
import { useUserStore } from './user'
import { useSettingsStore } from './settings'

export const useAbStoreAdapter = defineStore('abStoreAdapter', {
  getters: {
    //获取按钮权限，用于权限控制指令
    getButtonPermission: (state) => {
      const aclStore = useAclStore()
      return aclStore.buttonPermission
    },
    getUserMenuList: (state) => {
      const aclStore = useAclStore()
      return aclStore.userMenuList
    },
    getAbUser: (state) => {
      return useUserStore().abUser
    },
    getCurrentOrg: (state) => {
      return useUserStore().currentOrg
    },
    getLanguage: (state) => {
      return useSettingsStore().language
    },
  },
  actions: {
    // 如果没有的情况下，建议自己实现
    setTest(test: boolean) {
      //this.admin = admin
    },
    // 修改路由的名字
    changeTabsMeta: (info: TabEditInfo) => {
      const tabsStore = useTabsStore()
      tabsStore.changeTabsMeta(info)
    },
    // 关闭指定TAB
    closeTab: (fullPath: string) => {
      const tabsStore = useTabsStore()
      tabsStore.delVisitedRoute(fullPath)
    },
  },
})

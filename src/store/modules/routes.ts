/**
 * @description 路由拦截状态管理，目前两种模式：all模式与intelligence模式，其中partialRoutes是菜单暂未使用
 */
import { asyncRoutes, constantRoutes, resetRouter } from '@/router'
import { convertRouter, filterRoutes } from '@/utils/routes'
import { authentication, rolesControl } from '@/config'
import { OptionType, RoutesModuleType } from '/#/store'
import { isArray } from '@/utils/validate'
import { getList } from '@/api/router'
import { gp } from '@gp'
import { VabRouteRecord } from '/#/router'

export const useRoutesStore = defineStore('routes', {
  state: (): RoutesModuleType => ({
    /**
     * 一级菜单值
     */
    tab: {
      data: undefined,
    },
    /**
     * 一级菜单
     */
    tabMenu: undefined,
    /**
     * 自定义激活菜单
     */
    activeMenu: {
      data: undefined,
    },
    /**
     * 一级菜单
     */
    routes: [],
    /**
     * 默认展开的菜单
     */
    defaultOpenNames: [],
  }),
  getters: {
    getTab: (state) => state.tab,
    getDefaultOpenNames: (state) => state.defaultOpenNames,
    getTabMenu: (state) =>
      state.tab.data
        ? state.routes.find((route) => route.name === state.tab.data)
        : { meta: { title: '' }, redirect: '404' },
    getActiveMenu: (state) => state.activeMenu,
    getRoutes: (state) =>
      state.routes.filter((_route) => _route.meta.hidden !== true),
    getPartialRoutes: (state) =>
      state.routes.find((route) => route.name === state.tab.data)?.children ||
      [],
  },
  actions: {
    clearRoutes() {
      this.routes = []
    },
    /**
     * @description 多模式设置路由
     * @param mode
     * @returns
     */
    async setRoutes(mode = 'none') {
      // 默认前端路由
      let routes = [...asyncRoutes]
      // 设置游客路由关闭路由拦截(不需要可以删除)
      const control = mode === 'visit' ? false : rolesControl
      // 设置后端路由(不需要可以删除)
      if (authentication === 'all') {
        const {
          data: { list },
        } = await getList()
        if (!isArray(list))
          gp.$baseMessage(
            '路由格式返回有误！',
            'error',
            'vab-hey-message-error'
          )
        if (list[list.length - 1].path !== '*')
          list.push({
            path: '/:pathMatch(.*)*',
            redirect: '/404',
            name: 'NotFound',
            meta: { hidden: true },
          })
        routes = convertRouter(list)
      }
      // 根据权限和rolesControl过滤路由
      const accessRoutes = filterRoutes([...constantRoutes, ...routes], control)
      // 设置菜单所需路由
      //this.routes = JSON.parse(JSON.stringify(accessRoutes))
      // 根据可访问路由重置Vue Router
      await resetRouter(accessRoutes)
    },
    changeMenuMeta(options: OptionType) {
      function handleRoutes(routes: VabRouteRecord[]) {
        return routes.map((route) => {
          if (route.name === options.name)
            Object.assign(route.meta, options.meta)
          if (route.children && route.children.length)
            route.children = handleRoutes(route.children)
          return route
        })
      }
      this.routes = handleRoutes(this.routes)
    },
    /**
     * @description 修改 activeName
     * @param activeMenu 当前激活菜单
     */
    changeActiveMenu(activeMenu: string) {
      this.activeMenu.data = activeMenu
    },
    /**
     * 根据后台的菜单，转换成前端工程需要的路由。AGILEBPM 扩展部分
     * 具体转换过程
     * @param {*} { commit }
     * @param menus 后台菜单根据预设路由配置转成路由
     */
    async setMenus(menus: any) {
      const routers: never[] = []
      handleMenus(routers, menus, asyncRoutes, '')
      this.setOpenNamesByMenu(routers)
      this.routes = routers
    },
    setOpenNamesByMenu(routers: any) {
      routers.forEach((item: any) => {
        if (item.path && item.isopen) {
          this.defaultOpenNames.push(item.path)
        }
        if (item.children) {
          this.setOpenNamesByMenu(item.children)
        }
      })
    },
  },
})

/**
 * 如果不存在child 且不存在对应路由，则返回404页面
 * 如果存在child则根据菜单配置，生成个父路由
 * 如果能映射上，则以菜单覆盖路由的形式生成路由
 * @param routers
 * @param menu
 * @param asyncRoutes
 */
const handleMenus = (
  routers: any,
  menu: any,
  asyncRoutes: VabRouteRecord[],
  topMenuCode: string
) => {
  let returnChildPathList: any[] = []
  menu.forEach(
    (item: {
      openWith: any
      children: any[]
      name: string
      url: string
      code: string
      icon: string
      enable: number
      opened: number
    }) => {
      const relRouterMenu = getRouterByMenu(item.code, item.url, asyncRoutes)

      let routerMenu = JSON.parse(
        `{"path":"${item.url || item.code}","name":"${
          item.code
        }","meta":{"title":"${item.name}","icon":"${item.icon}","hidden":${
          item.enable === 0
        }}}`
      )

      const topMenuCodeStr = topMenuCode || routerMenu.name
      // 匹配不上的,且无child的，返回一个404的路由
      if (
        relRouterMenu == null &&
        (!item.children || item.children.length === 0)
      ) {
        //console.debug(" 未匹配到的前端资源"routerMenu)
      }
      // 匹配上 则将菜单 覆盖路由配置并返回
      else if (relRouterMenu != null) {
        const tempMenu = Object.assign({}, relRouterMenu)
        delete tempMenu.children
        routerMenu = Object.assign(tempMenu, routerMenu)
        // 如果没有ICON 则使用旧ICON配置
        if (relRouterMenu.meta.icon && !routerMenu.meta.icon) {
          routerMenu.meta.icon = relRouterMenu.meta.icon
        }
      }
      routerMenu.topMenuCode = topMenuCodeStr
      routerMenu.isopen = item.opened == 1
      routerMenu.openWith = item.openWith

      // 存在child 说明是有子集的，这里处理子集
      if (item.children && item.children.length > 0) {
        const children: never[] = []
        const childPathList = handleMenus(
          children,
          item.children,
          asyncRoutes,
          topMenuCodeStr
        )
        routerMenu.children = children
        routerMenu.childrenPathList = childPathList
      } else {
        // 最后一级默认给他一个childPathList
        routerMenu.childrenPathList = [routerMenu.path]
      }
      // 设置 childrenPathList
      returnChildPathList = returnChildPathList.concat(
        routerMenu.childrenPathList
      )
      routers.push(routerMenu)
    }
  )
  return returnChildPathList
}

const getRouterByMenu = (
  menuCode: string,
  menuPath: string,
  asyncRoutes: VabRouteRecord[]
) => {
  let theRouter: any

  for (let i = 0; i < asyncRoutes.length; i++) {
    const item = asyncRoutes[i]
    if (menuPath && menuPath === item.fullPath) {
      return item
    }
    if (menuCode && menuCode === item.name) {
      return item
    }
    if (item.children && item.children.length > 0) {
      theRouter = getRouterByMenu(menuCode, menuPath, item.children)
      if (theRouter) {
        return theRouter
      }
    }
  }

  return null
}

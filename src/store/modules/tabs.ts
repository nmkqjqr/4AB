/**
 * @description tabsBar标签页逻辑，如无必要请勿修改
 */
import { OptionType, TabsModuleType } from '/#/store'
import { VabRouteRecord } from '/#/router'
import { abUtil } from '~/agilebpm'

const router = useRouter()

export const useTabsStore = defineStore('tabs', {
  state: (): TabsModuleType => ({
    visitedRoutes: [],
  }),
  getters: {
    getVisitedRoutes: (state) =>
      state.visitedRoutes.filter(
        (route: VabRouteRecord) => route.name !== 'Login'
      ),
  },
  actions: {
    /**
     * @description 添加标签页
     * @param {*} route
     * @returns
     */
    addVisitedRoute(route: VabRouteRecord, oldPath: String) {
      //获取目标路由是否存在
      const target = this.visitedRoutes.find(
        (item: VabRouteRecord) => item.path === route.path
      )
      //如果目标路由存在就直接跳转即可
      if (target && !route.meta.dynamicNewTab) {
        let obj = abUtil.clone(route)
        //必须把头信息删除，否则会覆盖掉自定义应用、组联表单、门户等的动态标题
        delete obj.meta
        Object.assign(target, obj)
      } else if (!target) {
        if (
          this.visitedRoutes &&
          this.visitedRoutes.length > 0 &&
          this.visitedRoutes[0]?.openWith
        ) {
          //如果是新窗口打开，就直接跳过不在处理
          if (this.visitedRoutes[0]?.openWith == 2) {
            return
          }
          //如果只有一个页签，就不用找上个路由，直接覆盖即可
          if (this.visitedRoutes && this.visitedRoutes.length == 1) {
            this.visitedRoutes[0] = Object.assign({}, route)
          } else {
            if (!oldPath) {
              this.visitedRoutes.push(Object.assign({}, route))
            }
            //将上个路由覆盖为新路由
            const index = this.visitedRoutes.findIndex(
              (item: VabRouteRecord) => item.path === oldPath
            )
            //找到上个路由就覆盖，找不到就添加
            if (index >= 0) {
              this.visitedRoutes[index] = Object.assign({}, route)
            } else {
              this.visitedRoutes.push(Object.assign({}, route))
            }
          }
        } else {
          this.visitedRoutes.push(Object.assign({}, route))
        }
        if (!this.visitedRoutes.find((route: any) => route.meta.noClosable)) {
          this.visitedRoutes[0].meta.noClosable = true
        }
      }
      //应对极特殊情况：没有配置noClosable的情况，默认使当前tab不可关闭
      if (!this.visitedRoutes.find((route: any) => route.meta.noClosable)) {
        this.visitedRoutes[0].meta.noClosable = true
      }
    },
    /**
     * @description 删除当前标签页
     * @param {*} path
     * @returns
     */
    delVisitedRoute(path: string) {
      console.log('delVisitedRoute方法执行了', this.visitedRoutes, path)
      this.visitedRoutes = this.visitedRoutes.filter(
        (route) => route.path !== path && route.fullPath !== path
      )
    },
    /**
     * @description 删除当前标签页以外其它全部标签页
     * @param {*} path
     * @returns
     */
    delOthersVisitedRoutes(path: string) {
      this.visitedRoutes = this.visitedRoutes.filter(
        (route: VabRouteRecord) => route.meta.noClosable || route.path === path
      )
    },
    /**
     * @description 删除当前标签页左边全部标签页
     * @param {*} path
     * @returns
     */
    delLeftVisitedRoutes(path: string) {
      let found = false
      this.visitedRoutes = this.visitedRoutes.filter(
        (route: VabRouteRecord) => {
          if (route.path === path) found = true
          return route.meta.noClosable || found
        }
      )
    },
    /**
     * @description 删除当前标签页右边全部标签页
     * @param {*} path
     * @returns
     */
    delRightVisitedRoutes(path: string) {
      let found = false
      this.visitedRoutes = this.visitedRoutes.filter(
        (route: VabRouteRecord) => {
          const close = found
          if (route.path === path) found = true
          return route.meta.noClosable || !close
        }
      )
    },
    /**
     * @description 删除全部标签页
     * @returns
     */
    delAllVisitedRoutes() {
      this.visitedRoutes = this.visitedRoutes.filter(
        (route: VabRouteRecord) => route.meta.noClosable
      )
    },
    /**
     * @description 修改 meta
     * @param options
     */
    changeTabsMeta(options: OptionType) {
      function handleVisitedRoutes(visitedRoutes: VabRouteRecord[]) {
        console.info('TODO 菜单支持fullPath 计算')
        return visitedRoutes.map((route: VabRouteRecord) => {
          if (
            route.fullPath === options.fullPath ||
            route.name === options.name ||
            route.meta.title === options.title
          )
            Object.assign(route.meta, options.meta)
          if (route.children && route.children.length)
            route.children = handleVisitedRoutes(route.children)
          return route
        })
      }
      this.visitedRoutes = handleVisitedRoutes(this.visitedRoutes)
    },
  },
})

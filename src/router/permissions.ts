/**
 * @description 路由守卫，目前两种模式：all模式与intelligence模式
 */
import { useUserStore } from '@/store/modules/user'
import { useRoutesStore } from '@/store/modules/routes'
import { useSettingsStore } from '@/store/modules/settings'
import VabProgress from 'nprogress'
import 'nprogress/nprogress.css'
import getPageTitle from '@/utils/pageTitle'
import { toLoginRoute } from '@/utils/routes'
import { setToken, getToken } from '@/utils/token'

import {
  tokenTableName,
  authentication,
  loginInterception,
  routesWhiteList,
  supportVisit,
  loginTimeOutIsJumpLoginPage,
} from '@/config'
import { Router } from 'vue-router'

export function setupPermissions(router: Router) {
  VabProgress.configure({
    easing: 'ease',
    speed: 500,
    trickleSpeed: 200,
    showSpinner: false,
  })
  router.beforeEach(async (to: any, from: any, next: any) => {
    const {
      getTheme: { showProgressBar },
      getCompanyConfigInfo,
    } = useSettingsStore()
    const { routes, setRoutes } = useRoutesStore()
    const { token, getUserInfo, setVirtualRoles, resetAll } = useUserStore()
    if (showProgressBar) VabProgress.start()

    let hasToken = getToken()
    if (to.query[tokenTableName]) {
      setToken(to.query[tokenTableName])
      // logo 系统名称 公司名称等信息
      await getCompanyConfigInfo()
      // loginInterception 为true时 设置了登录拦截
      if (loginInterception) await getUserInfo()
      next()
      return
    }
    if (
      routesWhiteList.includes(to.path) ||
      routesWhiteList.includes(to.name)
    ) {
      // 设置游客路由(不需要可以删除)
      if (supportVisit && !routes.length) {
        await setRoutes('visit')
        next({ path: to.path, replace: true })
      } else next()
      return
    }
    // 当Iframe时，全部Iframe传递
    if (from.query.abIframeType) {
      to.query.abIframeType = from.query.abIframeType
    }

    // @ts-ignore
    if (!loginInterception) hasToken = true
    if (hasToken) {
      if (routes.length) {
        // 禁止已登录用户返回登录页
        if (to.path === '/login') {
          if (to.query.redirect && to.query.redirect.length > 0) {
            next(to.query.redirect)
          } else {
            next({ path: '/' })
          }
          if (showProgressBar) VabProgress.done()
        } else {
          if (to.query.redirect && to.query.redirect.length > 0) {
            next(to.query.redirect)
          } else {
            next()
          }
        }
      } else {
        try {
          // logo 系统名称 公司名称等信息
          await getCompanyConfigInfo()
          if (loginInterception) await getUserInfo()
          // config/setting.config.js loginInterception为false(关闭登录拦截时)时，创建虚拟角色
          else await setVirtualRoles()
          // 根据路由模式获取路由并根据权限过滤
          await setRoutes(authentication)

          next({ ...to, replace: true })
        } catch (err) {
          if (err === 'noResource') {
            next({
              path: '/405',
              replace: true,
            })
          }
          console.error('AgileBPM 错误拦截:', err)
          await resetAll()

          if ('/dd' == to.path) {
            next(to.fullPath)
          } else {
            loginTimeOutIsJumpLoginPage
              ? next(toLoginRoute(to.fullPath))
              : next()
          }
        }
      }
    } else {
      // next(toLoginRoute(to.fullPath))
      // 退出登录不带历史记录
      // 跳转网上办事大厅
      if (
        to.path == '/serviceHall' ||
        to.path == '/serviceHallList' ||
        to.path == '/workGuide' ||
        to.path == '/dd' ||
        to.path == '/forgotPwd' ||
        to.path == '/resetPwd' ||
        to.path == '/appstoreAppList'
      ) {
        next()
      } else {
        let path = ''
        if (to.query && to.query.redirect && to.query.redirect.length > 0) {
          path = to.query.redirect
        } else if (
          to.path == '/appstore/appManage/orderConfirm' ||
          to.path == '/appstore/appManage/tryApp'
        ) {
          path = to.fullPath
        } else {
          path = '/'
        }
        loginTimeOutIsJumpLoginPage ? next(toLoginRoute(path)) : next()
      }
    }
  })
  router.afterEach((to: any) => {
    document.title = getPageTitle(to.meta.title, to.name)
    if (VabProgress.status) VabProgress.done()
  })
}

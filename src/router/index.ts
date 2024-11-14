import { createApp } from 'vue'
/**
 * @description router全局配置，如有必要可分文件抽离，其中asyncRoutes只有在intelligence模式下才会用到，pro版只支持remixIcon图标，具体配置请查看vip群文档
 */
import type { RouteRecordName, RouteRecordRaw } from 'vue-router'
import type { VabRouteRecord } from '/#/router'
import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router'
import Layout from '@vab/layouts/index.vue'
import { setupPermissions } from './permissions'
import { authentication, isHashRouterMode, publicPath } from '@/config'

// 组织模块的 路由配置
import Org from './modules/org'
import BPM from './modules/bpm'
import Sys from './modules/sys'
import Cms from './modules/cms'
import Biz from './modules/biz'
import Salary from './modules/salary'
import UserAppstore from './modules/appstore'
import { AppsoteRoute } from '../../agilebpm/build/appstore'

export const constantRoutes: VabRouteRecord[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      hidden: true,
    },
  },
  {
    path: '/dd',
    name: 'DD',
    component: () => import('@/views/login/dd.vue'),
    meta: {
      hidden: true,
    },
  },
  {
    path: '/writeToken',
    name: 'WriteToken',
    component: () => import('@/views/login/writeToken.vue'),
    meta: {
      hidden: true,
    },
  },
  {
    path: '/forgotPwd',
    name: 'ForgotPwd',
    component: () => import('@/views/login/loginPolicy/forgotPwd.vue'),
    meta: {
      title: '找回密码',
      hidden: true,
    },
  },
  {
    path: '/resetPwd',
    name: 'ResetPwd',
    component: () => import('@/views/login/loginPolicy/resetPwd.vue'),
    meta: {
      title: '重置密码',
      hidden: true,
    },
  },

  {
    path: '/layoutDesigner',
    name: 'layoutDesigner',
    component: () => import('@/views/biz/bizFormCombination/layout-design.vue'),
    meta: {
      hidden: true,
      title: '布局设计器',
      tabHidden: true,
      noKeepAlive: true,
    },
  },
  {
    path: '/formCombIfreamTest',
    name: 'FormCombIfreamTest',
    component: () => import('@/views/test/formCombIfreamTest.vue'),
    meta: {
      hidden: true,
      title: '测试组件',
      tabHidden: true,
      noKeepAlive: true,
    },
  },
  {
    path: '/formDesigner',
    name: 'FormDesigner',
    component: () => import('@/views/form-designer/index.vue'),
    meta: {
      title: '表单设计器',
      noKeepAlive: true,
    },
  },
  {
    path: '/bpmDesigner',
    name: 'BpmDesigner',
    component: () => import('@/views/bpm/definition/bpmDesign.vue'),
    meta: {
      title: '流程设计器',
      noKeepAlive: true,
    },
  },
  {
    path: '/bizFormCode',
    name: 'BizFormCode',
    component: () => import('@/views/biz/bizForm/bizFormCode.vue'),
    meta: {
      title: '表单源码',
      icon: 'dashboard-line',
    },
  },
  {
    path: '/bizForm/preview/:code',
    name: 'BizFormPreview',
    component: () => import('@/views/biz/bizForm/formPreview.vue'),
    meta: {
      title: '表单预览',
      icon: 'dashboard-line',
    },
  },
  {
    path: '/tempLink/:code',
    name: 'TempLink',
    component: () => import('@/views/sys/tempLink/tempLink.vue'),
    meta: {
      title: '临时链接',
      icon: 'dashboard-line',
    },
  },
  {
    path: '/simpleWF',
    name: 'SimpleWF',
    component: () => import('@/views/bpm/definition/simpleWf.vue'),
    meta: {
      title: '一站式流程',
      noKeepAlive: true,
    },
  },
  {
    path: '/demo',
    name: 'demo',
    component: () => import('@/views/demo/demoPage.vue'),
    meta: {
      hidden: true,
    },
  },
  {
    path: '/demo/urlFormDemo',
    name: 'urlFormDemo',
    component: () => import('@/views/demo/urlFormDemo.vue'),
    meta: {
      hidden: true,
      noKeepAlive: true,
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/register/index.vue'),
    meta: {
      hidden: true,
    },
  },
  /*   {
    path: '/bizLogicProgram',
    name: 'BizLogicProgram',
    component: () => import('@/libs/bizLogicProgram/index/index.vue'),
    meta: {
      hidden: true,
      title: '测试组件',
      tabHidden: true,
      noKeepAlive: true,
    },
  }, */
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/403.vue'),
    meta: {
      hidden: true,
    },
  },
  {
    path: '/405',
    name: '405',
    component: () => import('@/views/405.vue'),
    meta: {
      hidden: true,
    },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404.vue'),
    meta: {
      hidden: true,
    },
  },
  {
    path: '/bpmInstancePrint',
    name: 'BpmInstancePrintHome',
    component: () => import('@/views/bpm/instance/bpmInstancePrint.vue'),
    meta: {
      title: '流程打印',
      noKeepAlive: false,
    },
  },
  {
    path: '/bizForm/bizDetail/:code',
    name: 'bizDetail',
    component: () => import('@/views/biz/bizForm/formPreview.vue'),
    meta: {
      title: '表单详情',
      icon: 'dashboard-line',
      dynamicNewTab: true,
    },
  },
  {
    path: '/externalEvent/bpmTaskComplete',
    name: 'BpmExternalEventTaskComplete',
    component: () => import('@/views/bpm/externalEvent/bpmTaskComplete.vue'),
    meta: {
      title: '外部事项任务处理',
      icon: 'dashboard-line',
    },
  },
  {
    path: '/externalEvent/flowStart/:defKey',
    name: 'BpmExternalEventFlowStart',
    component: () => import('@/views/bpm/externalEvent/flowStart.vue'),
    meta: {
      title: '公开流程启动',
      icon: 'dashboard-line',
    },
  },
  {
    path: '/tempLinkResultPage',
    name: 'TempLinkResultPage',
    component: () => import('@/views/sys/tempLink/resultPage.vue'),
    meta: {
      title: '临时链接状态',
      icon: 'dashboard-line',
    },
  },
  {
    path: '/serviceHall',
    name: 'ServiceHall',
    component: () => import('@/views/serviceHall/index.vue'),
    meta: {
      title: '网上办事大厅',
      hidden: true,
    },
  },
  {
    path: '/serviceHallList',
    name: 'ServiceHallList',
    component: () => import('@/views/serviceHall/list.vue'),
    meta: {
      title: '网上办事大厅',
      hidden: true,
    },
  },
  {
    path: '/workGuide',
    name: 'WorkGuide',
    component: () => import('@/views/serviceHall/workGuide.vue'),
    meta: {
      title: '网上办事大厅',
      hidden: true,
    },
  },
  // 测试流程实例或者任务处理页面 增加调用函数
  {
    path: '/taskIframeTest',
    name: 'TaskIframeTest',
    component: () => import('@/views/bpm/taskIframeTest/index.vue'),
    meta: {
      title: '处理',
      hidden: true,
    },
  },
  // 下面是应用
  {
    path: '/appstoreAppList',
    name: 'AppstoreAppList',
    component: () => import('@/views/appstore/publicAppList.vue'),
    meta: {
      title: '应用列表',
      hidden: true,
    },
  },
  {
    path: '/appSquare',
    name: 'AppSquare',
    meta: {
      title: '应用广场',
      icon: 'edit-line',
      noKeepAlive: true,
    },
    component: () => import('@/views/app-square/index.vue'),
  },
  {
    path: '/createAppSquare/app/:projectId/:resourceType?/:id?',
    name: 'CreateAppSquare',
    meta: {
      title: '创建应用',
      icon: 'edit-line',
      noKeepAlive: true,
    },
    component: () => import('@/views/app-square/createApp.vue'),
  },
  {
    path: '/createForm/app/:projectId/:resourceType/:resourceId/:formDesignId?/:custGridId?',
    name: 'CreateForm',
    meta: {
      title: '表单设计',
      icon: 'edit-line',
      noKeepAlive: true,
    },
    component: () => import('@/views/app-square/createForm.vue'),
  },
  {
    path: '/createProcess/app/:projectId/:resourceType/:resourceId/:formDesignId?/:flowId?',
    name: 'CreateProcess',
    meta: {
      title: '流程设计',
      icon: 'edit-line',
      noKeepAlive: true,
    },
    component: () => import('@/views/app-square/createProcess.vue'),
  },
  {
    path: '/createLayout/app/:projectId/:resourceType/:resourceId/:formDesignId?',
    name: 'CreateLayout',
    meta: {
      title: '组联式表单设计',
      icon: 'edit-line',
      noKeepAlive: true,
    },
    component: () => import('@/views/app-square/createLayout.vue'),
  },
  {
    path: '/visitPage/:projectId/:id?',
    name: 'VisitPage',
    meta: {
      title: '访问页面',
      icon: 'edit-line',
      noKeepAlive: true,
    },
    component: () => import('@/views/app-square/visitPage.vue'),
  },
]

export const asyncRoutes: VabRouteRecord[] = [
  Org,
  BPM,
  Sys,
  Cms,
  Biz,
  Salary,
  AppsoteRoute,
  UserAppstore,
  {
    path: '/',
    name: 'Root',
    component: Layout,
    meta: {
      title: '首页',
      icon: 'home-2-line',
      breadcrumbHidden: true,
    },
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/index/index.vue'),
        meta: {
          title: '首页',
          icon: 'home-2-line',
          noClosable: true,
        },
      },
      {
        path: 'dashboard/monitor',
        name: 'Monitor',
        component: () => import('@/views/index/dashboard/index.vue'),
        meta: {
          title: '监控页',
          icon: 'home-2-line',
          noClosable: true,
        },
      },
      {
        path: 'dashboard/workplace',
        name: 'Workplace',
        component: () => import('@/views/index/workbench/index.vue'),
        meta: {
          title: '主控页',
          icon: 'home-2-line',
          noClosable: true,
        },
      },
      {
        path: 'dashboard/user/userInfo',
        name: 'UserInfo',
        component: () =>
          import('@/views/index/dashboard/components/user/userInfo.vue'),
        meta: {
          title: '个人中心',
          icon: 'user-line',
        },
      },
      {
        path: 'dashboard/user/userInfoEdit',
        name: 'userInfoEdit',
        meta: {
          title: '编辑个人信息',
          icon: 'edit-line',
        },
        component: () =>
          import('@/views/index/dashboard/components/user/userInfoEdit.vue'),
      },
      {
        path: 'dashboard/user/updatePassword',
        name: 'updatePassword',
        meta: {
          title: '修改密码',
          icon: 'edit-line',
        },
        component: () =>
          import('@/views/index/dashboard/components/user/updatePassword.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'NotFound',
    meta: {
      hidden: true,
    },
  },
]

const router = createRouter({
  history: isHashRouterMode
    ? createWebHashHistory(publicPath)
    : createWebHistory(publicPath),
  routes: constantRoutes as RouteRecordRaw[],
})

function fatteningRoutes(routes: VabRouteRecord[]): VabRouteRecord[] {
  return routes.flatMap((route: VabRouteRecord) => {
    return route.children ? fatteningRoutes(route.children) : route
  })
}

function addRouter(routes: VabRouteRecord[]) {
  routes.forEach((route: VabRouteRecord) => {
    if (!router.hasRoute(route.name)) router.addRoute(route as RouteRecordRaw)
    if (route.children) addRouter(route.children)
  })
}

export function resetRouter(routes: VabRouteRecord[] = constantRoutes) {
  routes.map((route: VabRouteRecord) => {
    if (route.children) route.children = fatteningRoutes(route.children)
  })
  router.getRoutes().forEach(({ name }) => {
    router.hasRoute(<RouteRecordName>name) &&
      router.removeRoute(<RouteRecordName>name)
  })
  addRouter(routes)
}

export function setupRouter(app: any) {
  if (authentication === 'intelligence') addRouter(asyncRoutes)
  setupPermissions(router)
  app.use(router)
  return router
}

export default router

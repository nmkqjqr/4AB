import Layout from '@vab/layouts/index.vue'
export default {
  path: '/appstore',
  name: 'APPSTORE',
  component: Layout,
  meta: {
    title: '应用市场',
    icon: 'home-2-line',
    breadcrumbHidden: true,
  },

  children: [
    {
      path: 'appManage/appList',
      name: 'AppMList',
      component: () => import('./empty.vue'),
      meta: {
        title: '应用列表',
        icon: 'home-2-line',
      },
    },
    {
      path: 'appManage/appEdit',
      name: 'AppMEdit',
      component: () => import('./empty.vue'),
      meta: {
        title: '应用编辑',
        icon: 'home-2-line',
      },
    },

    {
      path: 'appManage/appAdd',
      name: 'AppMAdd',
      component: () => import('./empty.vue'),
      meta: {
        title: '新增应用',
        icon: 'home-2-line',
      },
    },

    {
      path: 'appManage/versionEdit',
      name: 'AppVersionEdit',
      component: () => import('./empty.vue'),
      meta: {
        title: '应用版本编辑',
        icon: 'home-2-line',
      },
    },
    {
      path: 'appManage/versionList',
      name: 'AppVersionList',
      component: () => import('./empty.vue'),
      meta: {
        title: '应用版本列表',
        icon: 'home-2-line',
      },
    },
    {
      path: 'appManage/orderConfirm',
      name: 'OrderConfirm',
      component: () => import('./empty.vue'),
      meta: {
        title: '订单确认',
        icon: 'home-2-line',
      },
    },
    {
      path: 'appManage/tryApp',
      name: 'TryApp',
      component: () => import('./empty.vue'),
      meta: {
        title: '试用协议',
        icon: 'home-2-line',
      },
    },

    {
      path: 'appManage/orderList',
      name: 'OrderList',
      component: () => import('./empty.vue'),
      meta: {
        title: '订单列表',
        icon: 'home-2-line',
      },
    },

    {
      path: 'appManage/myOrder',
      name: 'MyOrder',
      component: () => import('./empty.vue'),
      meta: {
        title: '我的订单',
        icon: 'home-2-line',
      },
    },
    {
      path: 'store/appList',
      name: 'AppList',
      component: () => import('./empty.vue'),
      meta: {
        title: '应用列表',
        icon: 'home-2-line',
      },
    },
    {
      path: 'store/appDetails',
      name: 'AppDetails',
      component: () => import('./empty.vue'),
      meta: {
        title: '应用详情',
        icon: 'home-2-line',
      },
    },
    {
      path: 'store/myApp',
      name: 'MyApp',
      component: () => import('./empty.vue'),
      meta: {
        title: '我的应用',
        icon: 'home-2-line',
      },
    },
  ],
}

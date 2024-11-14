import Layout from '@vab/layouts/index.vue'
export default {
  path: '/userAppstore',
  name: 'USERAPPSTORE',
  component: Layout,
  meta: {
    title: '应用市场',
    icon: 'home-2-line',
    breadcrumbHidden: true,
  },
  children: [
    {
      path: 'user/userApp',
      name: 'UserApp',
      component: () => import('@/views/appstore/userApp.vue'),
      meta: {
        title: '用户应用',
        icon: 'home-2-line',
      },
    },
    {
      path: 'user/appList',
      name: 'UserAppList',
      component: () => import('@/views/appstore/appList.vue'),
      meta: {
        title: '我的应用',
        icon: 'home-2-line',
      },
    },
    {
      path: 'user/orderList',
      name: 'UserOrderList',
      component: () => import('@/views/appstore/orderList.vue'),
      meta: {
        title: '我的订单',
        icon: 'home-2-line',
      },
    },
  ],
}

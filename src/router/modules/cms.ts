import Layout from '@vab/layouts/index.vue'
export default {
  path: '/cms',
  name: 'CMS',
  component: Layout,
  meta: {
    title: 'CMS',
    icon: 'home-2-line',
    breadcrumbHidden: true,
  },
  children: [
    {
      path: 'notice/noticeList',
      name: 'NoticeList',
      component: () => import('@/views/cms/notice/noticeList.vue'),
      meta: {
        title: '公告列表',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'notice/noticeEdit',
      name: 'NoticeEdit',
      component: () => import('@/views/cms/notice/noticeEdit.vue'),
      meta: {
        title: '编辑公告列表',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'notice/noticeDetails',
      name: 'NoticeDetails',
      component: () => import('@/views/cms/notice/noticeDetails.vue'),
      meta: {
        title: '公告列表详情',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'notice/noticeIndexList',
      name: 'NoticeIndexList',
      component: () => import('@/views/cms/notice/noticeIndexList.vue'),
      meta: {
        title: '公告预览',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'news/newsList',
      name: 'NewsList',
      component: () => import('@/views/cms/news/newsList.vue'),
      meta: {
        title: '新闻列表',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'news/newsIndexList',
      name: 'NewsIndexList',
      component: () => import('@/views/cms/news/newsIndexList.vue'),
      meta: {
        title: '新闻预览',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'news/newsEdit',
      name: 'NewsEdit',
      component: () => import('@/views/cms/news/newsEdit.vue'),
      meta: {
        title: '新闻编辑',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'news/newsDetails',
      name: 'NewsDetails',
      component: () => import('@/views/cms/news/newsDetails.vue'),
      meta: {
        title: '新闻详情',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'innerMsg/innerMsgList',
      name: 'InnerMsgList',
      component: () => import('@/views/cms/innerMsg/innerMsgList.vue'),
      meta: {
        title: '消息列表',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'homeComponent/homeComponentList',
      name: 'HomeComponentList',
      component: () =>
        import('@/views/cms/homeComponent/homeComponentList.vue'),
      meta: {
        title: '首页组件',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'homeComponent/homeComponentEdit',
      name: 'HomeComponentEdit',
      component: () =>
        import('@/views/cms/homeComponent/homeComponentEdit.vue'),
      meta: {
        title: '首页组件编辑',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'document/documentList',
      name: 'DocumentList',
      component: () => import('@/views/cms/document/documentList.vue'),
      meta: {
        title: '文档库',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'document/superDocumentList',
      name: 'SuperDocumentList',
      component: () => import('@/views/cms/document/superDocumentList.vue'),
      meta: {
        title: '文档超管',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'document/documentEdit',
      name: 'DocumentEdit',
      component: () => import('@/views/cms/document/documentEdit.vue'),
      meta: {
        title: '文档库编辑',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'document/myDocumentList',
      name: 'MyDocumentList',
      component: () => import('@/views/cms/document/myDocumentList.vue'),
      meta: {
        title: '我的文档',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'document/approvalDocumentList',
      name: 'ApprovalDocumentList',
      component: () => import('@/views/cms/document/approvalDocumentList.vue'),
      meta: {
        title: '审批借阅',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'document/approvalHistoricalList',
      name: 'ApprovalHistoricalList',
      component: () =>
        import('@/views/cms/document/approvalHistoricalList.vue'),
      meta: {
        title: '借阅历史',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'portal/portalList',
      name: 'PortalList',
      component: () => import('@/views/cms/portal/portalList.vue'),
      meta: {
        title: '门户管理',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'portal/portalEdit',
      name: 'PortalEdit',
      component: () => import('@/views/cms/portal/portalEdit.vue'),
      meta: {
        title: '门户管理编辑',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'portal/portal/:code',
      name: 'Portal',
      component: () => import('@/views/cms/portal/portal.vue'),
      meta: {
        title: '门户预览',
        icon: 'dashboard-line',
        dynamicNewTab: true,
      },
    },

    {
      path: 'customIframe/:code',
      name: 'CustomIframe',
      component: () => import('@/views/cms/iframe/customIframe.vue'),
      meta: {
        title: '外部页面',
        icon: 'dashboard-line',
        dynamicNewTab: true,
      },
    },
  ],
}

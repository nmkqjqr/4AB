import Layout from '@vab/layouts/index.vue'
export default {
  path: '/biz',
  name: 'BIZ',
  component: Layout,
  meta: {
    title: '表单管理',
    icon: 'home-2-line',
    breadcrumbHidden: true,
  },
  children: [
    {
      path: 'bizTable/bizTableEdit',
      name: 'BizTableEdit',
      component: () => import('@/views/biz/bizTable/bizTableEdit.vue'),
      meta: {
        title: '业务实体编辑页',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'bizTable/bizTableList',
      name: 'BizTableList',
      component: () => import('@/views/biz/bizTable/bizTableList.vue'),
      meta: {
        title: '业务实体列表页',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'bizPattern/bizPatternList',
      name: 'BizPatternList',
      component: () => import('@/views/biz/bizPattern/bizPatternList.vue'),
      meta: {
        title: '业务校验列表页',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'bizPattern/bizPatternEdit',
      name: 'BizPatternEdit',
      component: () => import('@/views/biz/bizPattern/bizPatternEdit.vue'),
      meta: {
        title: '业务校验编辑页',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'bizPattern/test',
      name: 'BizPatternTest',
      component: () => import('@/views/biz/bizPattern/test.vue'),
      meta: {
        title: '测试',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'bizFormTemplate/bizFormTemplateList',
      name: 'BizFormTemplateList',
      component: () =>
        import('@/views/biz/bizFormTemplate/bizFormTemplateList.vue'),
      meta: {
        title: '表单模版',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'bizFormTemplate/bizFormTemplateEdit',
      name: 'BizFormTemplateEdit',
      component: () =>
        import('@/views/biz/bizFormTemplate/bizFormTemplateEdit.vue'),
      meta: {
        title: '编辑表单模版',
        icon: 'dashboard-line',
        noKeepAlive: true,
      },
    },
    {
      path: 'custom/customDialogList',
      name: 'CustomDialogList',
      component: () => import('@/views/biz/custom/customDialogList.vue'),
      meta: {
        title: '自定义对话框',
        icon: 'dashboard-line',
        keepAlive: true,
      },
    },
    {
      path: 'custom/customDemo',
      name: 'CustomDemo',
      component: () => import('@/views/biz/custom/customDemo.vue'),
      meta: {
        title: '对话框demo',
        icon: 'dashboard-line',
        keepAlive: true,
      },
    },
    {
      path: 'custom/customDialogEdit',
      name: 'CustomDialogEdit',
      component: () => import('@/views/biz/custom/customDialogEdit.vue'),
      meta: {
        title: '编辑自定义对话框',
        icon: 'dashboard-line',
        keepAlive: true,
      },
    },
    {
      path: 'formCustSql/formCustSqlList',
      name: 'FormCustSqlList',
      component: () => import('@/views/biz/formCustSql/formCustSqlList.vue'),
      meta: {
        title: '应用列表',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'formCustSql/formCustSqlEdit',
      name: 'FormCustSqlEdit',
      component: () => import('@/views/biz/formCustSql/formCustSqlEdit.vue'),
      meta: {
        title: '应用列表编辑',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'formCustSql/formCustSqlView/:code',
      name: 'FormCustSqlView',
      component: () => import('@/views/biz/formCustSql/formCustSqlView.vue'),
      meta: {
        title: '自定义列表',
        icon: 'dashboard-line',
        dynamicNewTab: true,
        noKeepAlive: false,
      },
    },
    {
      path: 'formCustSql/formCustSqlPreView/:code',
      name: 'FormCustSqlPreView',
      component: () => import('@/views/biz/formCustSql/formCustSqlPreView.vue'),
      meta: {
        title: '列表预览',
        icon: 'dashboard-line',
        dynamicNewTab: true,
        noKeepAlive: false,
      },
    },
    {
      path: 'bizObject/bizObjectList',
      name: 'BizObjectList',
      component: () => import('@/views/biz/bizObject/bizObjectList.vue'),
      meta: {
        title: '业务对象列表页',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'bizObject/bizObjectEdit',
      name: 'BizObjectEdit',
      component: () => import('@/views/biz/bizObject/bizObjectEdit.vue'),
      meta: {
        title: '业务对象编辑页',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'bizObject/bizPermission',
      name: 'BizPermission',
      component: () => import('@/views/biz/bizObject/bizPermission.vue'),
      meta: {
        title: '业务对象权限',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'bizForm/mbPreview/:code',
      name: 'BizFormMbPreview',
      component: () => import('@/views/biz/bizForm/mbFormPreview.vue'),
      meta: {
        title: '表单预览_移动端',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'bizForm/formViewAdd/:code',
      name: 'FormViewAdd',
      component: () => import('@/views/biz/bizForm/formPreview.vue'),
      meta: {
        title: '表单新增',
        icon: 'dashboard-line',
        dynamicNewTab: true,
      },
    },
    {
      path: 'bizForm/formViewEdit/:code',
      name: 'FormViewEdit',
      component: () => import('@/views/biz/bizForm/formPreview.vue'),
      meta: {
        title: '表单编辑',
        icon: 'dashboard-line',
        dynamicNewTab: true,
      },
    },
    {
      path: 'bizForm/formViewDetail/:code',
      name: 'FormViewDetail',
      component: () => import('@/views/biz/bizForm/formPreview.vue'),
      meta: {
        title: '表单详情',
        icon: 'dashboard-line',
        dynamicNewTab: true,
      },
    },
    /* {
      path: '/bizFormCode',
      name: 'BizFormCode',
      component: () => import('@/views/biz/bizForm/bizFormCode.vue'),
      meta: {
        title: '表单源码',
        icon: 'dashboard-line',
      },
    }, */
    {
      path: 'bizForm/bizFormDesignList',
      name: 'BizFormDesignList',
      component: () => import('@/views/biz/bizForm/bizFormDesignList.vue'),
      meta: {
        title: '业务表单设计列表页',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'bizFormCombination/bizFormCombinationList',
      name: 'BizFormCombinationList',
      component: () =>
        import('@/views/biz/bizFormCombination/bizFormCombinationList.vue'),
      meta: {
        title: '组联式表单',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'bizFormCombinationView/:code',
      name: 'BizFormCombinationView',
      component: () =>
        import('@/views/biz/bizFormCombination/bizFormCombinationView.vue'),
      meta: {
        title: '组联式表单',
        dynamicNewTab: true,
        icon: 'dashboard-line',
      },
    },
    {
      path: 'bizWordTemplate/bizWordTemplateList',
      name: 'BizWordTemplateList',
      component: () =>
        import('@/views/biz/bizWordTemplate/bizWordTemplateList.vue'),
      meta: {
        title: 'word模板列表页',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'bizWordTemplate/bizWordTemplateEdit',
      name: 'BizWordTemplateEdit',
      component: () =>
        import('@/views/biz/bizWordTemplate/bizWordTemplateEdit.vue'),
      meta: {
        title: 'word模板编辑页',
        icon: 'dashboard-line',
      },
    },
  ],
}

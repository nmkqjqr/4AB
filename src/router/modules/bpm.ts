import Layout from '@vab/layouts/index.vue'

export default {
  path: '/bpm',
  name: 'BPM',
  component: Layout,
  meta: {
    title: '流程管理',
    icon: 'home-2-line',
    breadcrumbHidden: true,
  },
  children: [
    {
      path: 'bpm/definitionList',
      name: 'BpmDefinitionList',
      component: () => import('@/views/bpm/definition/bpmDefinitionList.vue'),
      meta: {
        title: '专业流程设计',
        icon: 'grid-fill',
        noKeepAlive: false,
      },
    },
    {
      path: '/bpm/definitionEdit',
      name: 'BpmDefinitionEdit',
      component: () => import('@/views/bpm/definition/bpmDefinitionEdit.vue'),
      meta: {
        title: '流程编辑',
      },
    },
    {
      path: '/bpm/definitionUserEdit',
      name: 'BpmDefinitionUserEdit',
      component: () =>
        import('@/views/bpm/definition/bpmDefinitionUserEdit.vue'),
      meta: {
        title: '批量修改流程候选人',
      },
    },
    {
      path: 'bpm/instanceList',
      name: 'BpmInstanceList',
      component: () => import('@/views/bpm/instance/bpmInstanceList.vue'),
      meta: {
        title: '实例列表',
        icon: 'grid-fill',
        noKeepAlive: false,
      },
    },
    {
      path: 'bpm/reportInstanceDetail/:defKey',
      name: 'ReportInstanceDetail',
      component: () => import('@/views/bpm/instance/bpmInstanceDetail.vue'),
      meta: {
        title: '流程实例详情',
        dynamicNewTab: true,
        icon: 'grid-fill',
        noKeepAlive: false,
      },
    },
    {
      path: 'bpm/instanceDetail',
      name: 'BpmInstanceDetail',
      component: () => import('@/views/bpm/instance/bpmInstanceDetail.vue'),
      meta: {
        title: '流程实例详情',
        dynamicNewTab: true,
        icon: 'grid-fill',
        noKeepAlive: false,
      },
    },
    {
      path: 'bpm/bpmInstanceListDetail',
      name: 'BpmInstanceListDetail',
      component: () => import('@/views/bpm/instance/bpmInstanceListDetail.vue'),
      meta: {
        title: '流程实例详情',
        dynamicNewTab: true,
        icon: 'grid-fill',
        noKeepAlive: false,
      },
    },
    {
      path: 'bpm/bpmInstanceListDetail/:defKey',
      name: 'BpmInstanceListDetailByKey',
      component: () => import('@/views/bpm/instance/bpmInstanceListDetail.vue'),
      meta: {
        title: '流程实例详情',
        dynamicNewTab: true,
        icon: 'grid-fill',
        noKeepAlive: false,
      },
    },
    {
      path: '/bpm/flowStart/:defKey',
      name: 'FlowStart',
      component: () => import('@/views/bpm/instance/flowStart.vue'),
      meta: {
        title: '流程启动',
        icon: 'grid-fill',
        noKeepAlive: false,
      },
    },
    {
      path: '/bpm/flowStartTest/:defKey',
      name: 'FlowStartTest',
      component: () => import('@/views/bpm/instance/flowStartTest.vue'),
      meta: {
        title: '流程启动测试',
        icon: 'grid-fill',
        noKeepAlive: false,
      },
    },
    {
      path: '/bpm/draftStart',
      name: 'DraftStart',
      component: () => import('@/views/bpm/instance/draftStart.vue'),
      meta: {
        title: '草稿启动',
        icon: 'grid-fill',
        noKeepAlive: false,
      },
    },
    {
      path: 'bpm/taskList',
      name: 'BpmTaskList',
      component: () => import('@/views/bpm/task/bpmTaskList.vue'),
      meta: {
        title: '流程任务列表',
        icon: 'grid-fill',
      },
    },
    {
      path: 'bpm/flowChart',
      name: 'BpmFlowChart',
      component: () => import('@/views/bpm/task/bpmFlowChart.vue'),
      meta: {
        title: '流程图',
        icon: 'grid-fill',
      },
    },
    {
      path: 'bpm/taskComplate',
      name: 'BpmTaskComplate',
      component: () => import('@/views/bpm/task/bpmTaskComplate.vue'),
      meta: {
        title: '流程任务处理',
        icon: 'grid-fill',
        noKeepAlive: true,
      },
    },
    {
      path: 'bpm/busMatrixList',
      name: 'BusMatrixList',
      component: () => import('@/views/bpm/busMatrix/matrix/matrixList.vue'),
      meta: {
        title: '业务权责矩阵',
        icon: 'grid-fill',
        noKeepAlive: false,
      },
    },
    {
      path: 'matrix/busMatrixEdit',
      name: 'BusMatrixEdit',
      component: () => import('@/views/bpm/busMatrix/matrix/matrixEdit.vue'),
      meta: {
        title: '业务矩阵详情',
        icon: 'grid-fill',
        noKeepAlive: false,
      },
    },
    {
      path: 'matrix/busMatrixDirectorList',
      name: 'BusMatrixDirectorList',
      component: () =>
        import('@/views/bpm/busMatrix/directors/directorList.vue'),
      meta: {
        title: '业务矩阵汇报线设置列表',
        icon: 'grid-fill',
        noKeepAlive: false,
      },
    },
    {
      path: 'matrix/busMatrixDirectorEdit',
      name: 'BusMatrixDirectorEdit',
      component: () =>
        import('@/views/bpm/busMatrix/directors/directorEdit.vue'),
      meta: {
        title: '业务矩阵汇报线设置编辑',
        icon: 'grid-fill',
        noKeepAlive: false,
      },
    },
    {
      path: 'matrix/busMatrixEntryEdit',
      name: 'BusMatrixEntryEdit',
      component: () => import('@/views/bpm/busMatrix/entry/entryEdit.vue'),
      meta: {
        title: '业务矩阵条目编辑',
        icon: 'grid-fill',
        noKeepAlive: false,
      },
    },
    {
      path: 'matrix/busMatrixEntryList',
      name: 'BusMatrixEntryList',
      component: () => import('@/views/bpm/busMatrix/entry/entryList.vue'),
      meta: {
        title: '业务矩阵条目列表',
        icon: 'grid-fill',
        noKeepAlive: false,
      },
    },
    {
      path: 'my/todoList',
      name: 'BpmMyTaskTodoList',
      component: () => import('@/views/bpm/myTask/todoList.vue'),
      meta: {
        title: '我的待办列表',
        icon: 'grid-fill',
        noKeepAlive: false,
      },
    },
    {
      path: 'my/approveList',
      name: 'BpmMyApproveList',
      component: () => import('@/views/bpm/myTask/approveList.vue'),
      meta: {
        title: '我的审批历史',
        icon: 'grid-fill',
        noKeepAlive: false,
      },
    },
    {
      path: 'my/definitionList',
      name: 'BpmMyDefinitionList',
      component: () => import('@/views/bpm/myTask/definitionList.vue'),
      meta: {
        title: '可申请流程列表',
        icon: 'grid-fill',
        noKeepAlive: false,
      },
    },
    {
      path: 'my/applyList',
      name: 'BpmMyApplyList',
      component: () => import('@/views/bpm/myTask/applyList.vue'),
      meta: {
        title: '申请历史',
        icon: 'grid-fill',
        noKeepAlive: false,
      },
    },
    {
      path: 'my/draftList',
      name: 'BpmMyDraftList',
      component: () => import('@/views/bpm/myTask/draftList.vue'),
      meta: {
        title: '草稿',
        icon: 'grid-fill',
        noKeepAlive: false,
      },
    },
    {
      path: 'my/receiveList',
      name: 'BpmMyReceiveList',
      component: () => import('@/views/bpm/myTask/receiveList.vue'),
      meta: {
        title: '抄送/传阅',
        icon: 'grid-fill',
        noKeepAlive: false,
      },
    },
    {
      path: 'agency/agencyList',
      name: 'BpmAgencyList',
      component: () => import('@/views/bpm/agency/agencyList.vue'),
      meta: {
        title: '流程代理管理',
        icon: 'grid-fill',
        noKeepAlive: false,
      },
    },
    {
      path: 'agency/agencyEdit',
      name: 'AgencyEdit',
      component: () => import('@/views/bpm/agency/agencyEdit.vue'),
      meta: {
        title: '代理编辑',
        icon: 'grid-fill',
        noKeepAlive: false,
      },
    },
    {
      path: 'my/agentList',
      name: 'BpmMyAgentList',
      component: () => import('@/views/bpm/myTask/agentList.vue'),
      meta: {
        title: '流程代理',
        icon: 'grid-fill',
        noKeepAlive: false,
      },
    },

    {
      path: 'my/agentLogList',
      name: 'BpmMyAgentLogList',
      component: () => import('@/views/bpm/myTask/agentLogList.vue'),
      meta: {
        title: '代理记录',
        icon: 'grid-fill',
        noKeepAlive: true,
      },
    },
    {
      path: 'my/agentEdit',
      name: 'AgentEdit',
      component: () => import('@/views/bpm/myTask/agentEdit.vue'),
      meta: {
        title: '代理编辑',
        icon: 'grid-fill',
        noKeepAlive: false,
      },
    },
    {
      path: 'bpm/definitionVersionList',
      name: 'BpmDefinitionVersionList',
      component: () =>
        import('@/views/bpm/definition/overView/bpmDefinitionVersionList.vue'),
      meta: {
        title: '流程版本列表',
        icon: 'grid-fill',
        noKeepAlive: true,
      },
    },
    {
      path: 'bpm/importPreview',
      name: 'ImportPreview',
      component: () =>
        import(
          '@/views/bpm/definition/overView/bpmDefinitionOverViewImport.vue'
        ),
      meta: {
        title: '流程版本列表',
        icon: 'grid-fill',
        noKeepAlive: false,
      },
    },
    {
      path: '/bpm/scheduleStart/list',
      name: 'BpmScheduleStartList',
      component: () =>
        import('@/views/bpm/definition/scheduleStart/bpmScheduleStartList.vue'),
      meta: {
        title: '流程定时启动',
        icon: 'grid-fill',
        noKeepAlive: false,
      },
    },
    {
      path: '/bpm/scheduleStart/edit',
      name: 'BpmScheduleStartEdit',
      component: () =>
        import('@/views/bpm/definition/scheduleStart/bpmScheduleStartEdit.vue'),
      meta: {
        title: '流程定时启动编辑',
      },
    },
    {
      path: '/bpm/scheduleStart/logs',
      name: 'BpmScheduleStartLogList',
      component: () =>
        import(
          '@/views/bpm/definition/scheduleStart/bpmScheduleStartLogList.vue'
        ),
      meta: {
        title: '流程定时启动任务列表',
      },
    },
    {
      path: 'simDefinitionList',
      name: 'BpmSimpleDefinitionList',
      component: () =>
        import('@/views/bpm/definition/bpmSimpleDefinitionList.vue'),
      meta: {
        title: '简式流程设计',
      },
    },
    {
      path: 'bpm/openFlowList',
      name: 'BpmOpenFlowList',
      component: () => import('@/views/bpm/openFlow/list.vue'),
      meta: {
        title: '流程公开分享',
        icon: 'grid-fill',
        noKeepAlive: false,
      },
    },
    {
      path: '/bpm/openFlowEdit',
      name: 'BpmOpenFlowEdit',
      component: () => import('@/views/bpm/openFlow/edit.vue'),
      meta: {
        title: '公开流程编辑',
      },
    },
    {
      path: '/bpm/instanceTest/list',
      name: 'BpmInstanceTestList',
      component: () => import('@/views/bpm/instanceTest/instanceTestList.vue'),
      meta: {
        title: '测试实例列表',
      },
    },
    {
      path: '/bpm/instanceTest/taskList',
      name: 'BpmInstanceTestTaskList',
      component: () =>
        import('@/views/bpm/instanceTest/instanceTestTaskList.vue'),
      meta: {
        title: '测试实例任务列表',
      },
    },
    {
      path: '/bpm/instanceTest/:defKey/start',
      name: 'BpmInstanceTestStart',
      component: () => import('@/views/bpm/instanceTest/instanceTestStart.vue'),
      meta: {
        title: '测试实例启动',
      },
    },
    {
      path: '/bpm/instanceTest/taskComplete',
      name: 'BpmInstanceTestTaskComplete',
      component: () =>
        import('@/views/bpm/instanceTest/instanceTestTaskComplete.vue'),
      meta: {
        title: '测试实例任务审批',
      },
    },
  ],
}

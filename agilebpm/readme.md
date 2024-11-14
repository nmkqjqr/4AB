# 说明

因为很多客户需要在已有项目 前端整合 agilebpm 流程个人办公的功能，所以我们底层组件全面做了按需引入，

这样就可以按需引入需要的组件到自己工程中，然后针对部分功能进行适配，达到整合目的。

# 开发注意事项
在 agilebpm 目录 不得直接 通过 ~/agilebpm 或者 @agilebpm 形式引入模块，该方式是在src view 目录使用的引入方式
引入api，或者其他模块方式 `import { orgApi } from '~/agilebpm/api'`
 `import { * } from '@ab-core'`
引入 util 方式 如 ab-format ,ab-util,ab-tools,相对引入 `~/agilebpm/utils/ab-util`

如果某个组件引入其他组件文件了。这时候都相对目录引入


## 依赖关系
- ab-api , abUtil，资源  为文件引入
- ab-core -> ab-api 、ab-util

- ab-bpm -> ab-form -> ab-core
- ab-formDesign -> ab-core
- ab-bpmDesign -> ab-core
- ab-layoutDesign -> ab-form -> ab-core

- `~/agilebpm` 依赖以上所有模块


## 目录介绍

```
├─api                         // 接口定义
│  └─modules
│      ├─ab-biz
│      ├─ab-bpm
│      ├─ab-cms
│      ├─ab-org
│      └─ab-sys
├─package
│  ├─ab-bpm                   // 流程处理所需的组件
│  ├─ab-core                  // 核心组件组件
│  │  ├─components
│  │  │  ├─ab-authorization
│  │  │  ├─ab-choose-svg
│  │  │  ├─ab-column
│  │  │  ├─ab-countup
│  │  │  ├─ab-cust-dialog
│  │  │  ├─ab-dict-tree
│  │  │  ├─ab-ds-selector
│  │  │  ├─ab-load
│  │  │  ├─ab-msg-type
│  │  │  ├─ab-multi-select
│  │  │  ├─ab-pinyin
│  │  │  ├─ab-rich-editor
│  │  │  ├─ab-save
│  │  │  ├─ab-select-tree
│  │  │  ├─ab-table
│  │  │  ├─ab-test
│  │  │  ├─ab-times
│  │  │  ├─ab-tree
│  │  │  ├─ab-upload-dialog
│  │  │  ├─ab-upload-file
│  │  │  ├─ab-weather
│  │  │  ├─choose-icon
│  │  │  ├─choose-icon-new
│  │  │  └─svg-icon
│  │  └─directives
│  ├─ab-form                 // 在线表单组件
│  │  └─components
│  │      ├─ab-calculate
│  │      ├─ab-cascader
│  │      ├─ab-checkbox-group
│  │      ├─ab-custom-dialog
│  │      ├─ab-date
│  │      ├─ab-dynamic-select
│  │      ├─ab-flow-quote
│  │      ├─ab-input
│  │      ├─ab-multiple-date
│  │      ├─ab-number
│  │      ├─ab-quill
│  │      ├─ab-radio-group
│  │      ├─ab-rate
│  │      ├─ab-select
│  │      ├─ab-serial-no
│  │      ├─ab-signature
│  │      ├─ab-sn
│  │      ├─ab-switch
│  │      ├─ab-table-plugins
│  │      ├─ab-times
│  │      ├─ab-tree-select
│  │      ├─ab-upload
│  │      ├─form-base
│  │      │  ├─form-group
│  │      │  └─sub-table
│  │      └─form-theme
│  ├─avue-form-design                // 在线设计器
│  ├─bizLogicProgram                 // 布局组件设计器
│  ├─bpmn-design                     // 流程设计器
│  ├─bpmn-js                         // bpmnjs 原生设计器
│  ├─form-design
│  └─layout-design                   // 布局组件设计器
├─style                               // 特色需要的全局样式
├─types                               // 类型定义
└─utils                               // 工具类

```

## 如整合个人办公的思路如下：

1. 迁移 `~/agilebpm` 目录所有组件到 目标前端框架（建议同样是 vue3，ts,elementplugs 技术栈的）

如果 UI 框架不同，那要接受多引入 element 的成本，或者单独对 agilebpm 部分组件进行二开，即把 用到的 agilebpm 的组件由 element 引用改成其他 ui 框架。 agilebpm 在线表单源码不直接应用 elementplugs，所以可以先用后改造。

- 修改 tsconfig.json 配置, "include": 中新增 一下配置

```
    "agilebpm/**/*.vue",
    "agilebpm/**/*.ts",
    "agilebpm/types/**/*.d.ts",

```

- 关闭 agilebpm 格式化因为大家格式化习惯可能不同，防止因为自动格式化导致升级困难

修改 .eslintignore 文件,对部分组件忽略 eslint 格式化, 可以直接对 agilebpm 目录进行 eslint 格式化忽略

也可以按需对部分组件忽略

```
// 这些第三方组件，不是agilebpm从开始研发的，不建议格式化，防止二开后无法升级
agilebpm/package/bpmn-js
agilebpm/package/avue-form-design
agilebpm/package/layout-design
```

- main.js 加载 agilebpm 组件

```

// 引入
import { setupAbCore } from '~/agilebpm'

// 安装 核心依赖，会自动安装最基础通用的部分组件，以及指令，其他组件均需要在页面按需引入
setupAbCore(app)

```

2. 适配 request 等

- request 请求封装类 `agilebpm\api\ab-request.ts`
- 微服务请求前缀（如果微服务有特殊请求前缀，在这边改） `agilebpm\api\ab-api-prefix.ts`
- 部分组件依赖状态管理，到这边适配下 `agilebpm\api\ab-store.ts`

3. 迁移页面代码到自己项目（为了方便迁移，我们这边用的纯粹原生的 element-plugs 组件）

- 复制以下目录代码到你们项目中

  `src\views\bpm\myTask` 目录
  `src\views\bpm\task` 目录
  `src\views\bpm\instance` 目录

- 配置路由，参考以下内容

```
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
      path: 'bpm/instanceApprovalHistory',
      name: 'BpmInstanceApprovalHistory',
      component: () =>
        import('@/views/bpm/instance/bpmInstanceApprovalHistory.vue'),
      meta: {
        title: '流程实例详情',
        dynamicNewTab: true,
        icon: 'grid-fill',
        noKeepAlive: false,
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
        noKeepAlive: false,
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

```

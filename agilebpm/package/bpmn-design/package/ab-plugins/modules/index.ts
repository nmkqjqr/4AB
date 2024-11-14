import NodeSkip from './nodeSkip.vue'
import NodeExplain from './nodeExplain.vue'
import NodeMessage from './nodeMessage.vue'
import ExternalNodeMessage from './externalNodeMessage.vue'
import ReminderPlugin from './reminderPlugin.vue'
import CarbonCopyPlugin from './carbonCopy.vue'
import EnsureCandidate from './ensureCandidate.vue'
import Sign from './node/sign.vue'
import GlobalEvent from './globalEvent.vue'
import NodeEvent from './nodeEvent.vue'
import StartEvent from './startEvent.vue'
import EndEvent from './endEvent.vue'
import InstanceEndEvent from './instanceEndEvent.vue'
import BpmVariables from './bpmVariables.vue'
import * as serviceTask from './serviceTask/index'
import NodeInit from './nodeInit.vue'
import ExternalEvent from './externalEvent.vue'
import WordTemplate from './wordTemplate.vue'
import MultiInst from './multiInst.vue'

import {
  Position,
  Message,
  Promotion, // 传阅
  Bell, // 催办
  Connection, // 自定义任务
  DataAnalysis, //分析
  QuestionFilled, // 说明文档
  Present,
  Camera, // 事件
  Postcard,
  Share, //外部事项
  Printer,
} from '@element-plus/icons-vue'

//抄送描述 预定义抄送规则，在流程指定节点抄送任务给指定用户
export const flowPlugins = [
  {
    name: '自动跳过插件',
    desc: '用于测试流程，或者指定跳转规则',
    key: 'nodeSkip',
    component: markRaw(NodeSkip),
    icon: Position,
    initJson: {},
  },
  {
    name: '流程指引插件',
    key: 'nodeExplain',
    desc: '用于展示流程指导性文档',
    icon: QuestionFilled,
    component: markRaw(NodeExplain),
    initJson: [],
  },
  {
    name: '节点通知消息',
    key: 'nodeMessage',
    desc: '用于自定义流程待办，办结等消息通知',
    component: markRaw(NodeMessage),
    icon: Message,
    initJson: [],
  },
  {
    name: '外部人员通知',
    key: 'externalNodeMessage',
    desc: '用于非系统人员的消息通知',
    component: markRaw(ExternalNodeMessage),
    icon: Message,
    initJson: [],
  },
  {
    name: '任务催办配置',
    key: 'reminder',
    desc: '针对流程或者节点设置任务限时，并周期催办',
    icon: Bell,
    component: markRaw(ReminderPlugin),
    initJson: [],
  },
  {
    name: '流程抄送配置',
    key: 'carbonCopy',
    desc: '针对流程或者节点设置抄送',
    icon: Bell,
    component: markRaw(CarbonCopyPlugin),
    initJson: [],
  },
  {
    name: '节点初始化',
    key: 'nodeInit',
    desc: '节点初始化',
    icon: Camera,
    component: markRaw(NodeInit),
    initJson: [],
  },
  {
    name: '动态广场',
    key: 'ensureCandidate',
    desc: '启动时可以明确流程走向，实现跳过相同任务，用于流程预测，发起人指定候选人',
    icon: DataAnalysis,
    component: markRaw(EnsureCandidate),
    initJson: {
      //可针对无责任节点 设置候选人
      emptyNodeSettingUser: true,
      //如果时事计算，则分支会随着数据变化而时事计算，否则只会在走到分支时才会校验是否与预期的一致，若不一致，则计算并修正流程走向
      isTimelyCalGateWay: false,
      //候选人是否可为空
      userCanEmpty: false,
      //跳前不跳后
      skiptBeforMyTask: true,
      enable: true,
    },
  },
  {
    name: '全局事件',
    key: 'globalEvent',
    desc: '流程运行过程中事件，可用于触发业务逻辑调用',
    icon: Camera,
    component: markRaw(GlobalEvent),
    initJson: {
      model: '',
      script: {
        script: '',
        desc: '',
      },
      // http配置
      httpArr: [
        {
          id: 1,
          url: '',
          isAsync: false,
        },
      ],
    },
  },
  {
    name: '实例结束事件',
    key: 'instanceEndEvent',
    desc: '流程运行过程中事件，可用于触发业务逻辑调用',
    icon: Camera,
    component: markRaw(InstanceEndEvent),
    initJson: {
      PROCESS_COMPLETED: {
        model: '',
        script: {
          script: '',
          desc: '',
        },
        // http配置
        httpArr: [
          {
            id: 1,
            url: '',
            isAsync: false,
          },
        ],
      },
      PROCESS_MANUALEND: {
        model: '',
        script: {
          script: '',
          desc: '',
        },
        httpArr: [
          {
            id: 1,
            url: '',
            isAsync: false,
          },
        ],
      },
    },
  },
  {
    name: '流程变量',
    key: 'bpmVariable',
    desc: '对流程中所使用的流程变量进行定义描述和约定',
    icon: Postcard,
    component: markRaw(BpmVariables),
    initJson: {
      variables: [],
    },
  },
  {
    name: '外部事项',
    key: 'externalEvent',
    desc: '让系统外部人员对流程节点进行事项办理',
    component: markRaw(ExternalEvent),
    icon: Share,
    initJson: [],
  },
  {
    name: 'word模板',
    key: 'word',
    desc: 'word模板',
    icon: Printer,
    component: markRaw(WordTemplate),
    initJson: [],
  },
  {
    name: '多实例配置',
    key: 'multiInst',
    desc: '多实例配置',
    icon: Printer,
    component: markRaw(MultiInst),
    initJson: [],
  },
]

const nodePlugins = [
  {
    name: '节点会签',
    key: 'sign',
    desc: '用于多人投票，签批',
    icon: 'Present',
    component: markRaw(Sign),
    initJson: {
      open: false,
      approvalType: 'parallel',
      countType: 'number',
      number: 1,
      percent: 1,
      endType: 'all',
      followUp: 'next',
      opposeAction: 'oppose',
    },
  },
  {
    name: '节点事件',
    key: 'nodeEvent',
    desc: '节点前后置事件',
    icon: Camera,
    component: markRaw(NodeEvent),
    initJson: {
      TASK_CREATED: {
        model: '',
        script: {
          script: '',
          desc: '',
        },
        // http配置
        httpArr: [
          {
            id: 1,
            url: '',
            isAsync: false,
          },
        ],
      },
      TASK_COMPLETED: {
        model: '',
        script: {
          script: '',
          desc: '',
        },
        httpArr: [
          {
            id: 1,
            url: '',
            isAsync: false,
          },
        ],
      },
    },
  },
]

// 启动事件插件
const startEventPlugins = [
  {
    name: '开始事件',
    key: 'nodeEvent',
    desc: '开始事件',
    icon: Camera,
    component: markRaw(StartEvent),
    initJson: {
      TASK_COMPLETED: {
        model: '',
        script: {
          script: '',
          desc: '',
        },
        httpArr: [
          {
            id: 1,
            url: '',
            isAsync: false,
          },
        ],
      },
    },
  },
]

// 结束事件插件
const endEventPlugins = [
  {
    name: '结束事件',
    key: 'nodeEvent',
    desc: '结束事件',
    icon: Camera,
    component: markRaw(EndEvent),
    initJson: {
      TASK_COMPLETED: {
        model: '',
        script: {
          script: '',
          desc: '',
        },
        // http配置
        httpArr: [
          {
            id: 1,
            url: '',
            isAsync: false,
          },
        ],
      },
    },
  },
]

/**
 * 节点类型获取插件
 * @param nodeType 节点类型
 */
export const getPluginsByNodeType = (nodeType: string): Array<any> => {
  switch (nodeType) {
    // 用户任务
    case 'UserTask':
      return nodePlugins
    // 开始事件
    case 'StartEvent':
      return startEventPlugins
    // 结束事件
    case 'EndEvent':
      return endEventPlugins
    // 服务任务
    case 'ServiceTask':
      return serviceTask.plugins
    default:
      return []
  }
}

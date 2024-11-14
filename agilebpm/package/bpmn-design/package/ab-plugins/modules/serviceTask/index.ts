import { Camera } from '@element-plus/icons-vue'
import NodeEvent from './nodeEvent.vue'

// 服务任务插件
const plugins = [
  {
    name: '节点事件',
    key: 'nodeEvent',
    desc: '服务执行时产生的事件',
    icon: Camera,
    component: markRaw(NodeEvent),
    initJson: {
      TASK_COMPLETED: {
        // 默认事件http
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

export { plugins }

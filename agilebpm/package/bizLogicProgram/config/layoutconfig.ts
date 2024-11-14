export const layoutComponents = [
  {
    type: 'collapse',
    label: '条件控件',
    icon: 'collapse',
    expand: [],
    span: 24,
    key: '',
    columns: [
      {
        name: '条件A',
        key: 'collapse',
        list: [],
        showCondition: '',
      },
    ],
    control: {},
  },
  {
    type: 'card',
    label: '数组循环',
    icon: 'card',
    key: '',
    span: 24,
    list: [],
    control: {},
  },
]

export const customCompon = [
  {
    label: '获取业务对象',
    type: 'BizObjectGet',
    key: null,
    icon: '',
    span: 24,
    control: {},
    component: 'BizObjectGet',
  },
  {
    label: '业务对象保存',
    type: 'BizObjectSave',
    key: null,
    icon: '',
    span: 24,
    component: 'BizObjectSave',
  },
  {
    label: '业务实体删除',
    type: 'BizEntityDel',
    key: null,
    icon: '',
    control: {},
    span: 24,
    component: 'BizEntityDel',
  },
  {
    label: '业务实体属性赋值',
    type: 'BizEntityPropSet',
    key: null,
    icon: '',
    control: {},
    span: 24,
    component: 'BizEntityPropSet',
  },
]

import collapseConfig from './collapseConfig.vue'
import bizObjectGet from '../components/bizObjectGet/index.vue'
import bizObjectSave from '../components/bizObjectSave/index.vue'

// 组件配置页面 配置
export const componentConfigPage = {
  // Ifream 组件配置页面
  collapse: markRaw(collapseConfig),
  bizObjectGet: markRaw(bizObjectGet),
  BizEntitySave: markRaw(bizObjectSave),
  BizEntityPropSet: markRaw(bizObjectGet),
}

import { RuleItem } from 'async-validator'
import { PropType } from 'vue'

export const docProps = {
  // 用户默认会定义为Object any ，如果指定类型则： type: Object as PropType<User>,
  modelValue: {
    type: String || Array, //(可以是json字符串, 也可以是对象)
    required: true,
  },
  //是否禁用: true/false  默认false
  disabled: {
    type: Boolean,
    default: false,
  },
  //权限:w/r/n/b(编辑/只读/无权限/必填)   默认值 W （与element内置是否只读属性readonly绑定， 无需自己实现）
  permission: {
    type: String,
    default: 'w',
  },

  rules: {
    type: Object as PropType<Array<RuleItem> | RuleItem>,
    default: [] as Array<RuleItem>,
  },

  // 描述字段，用于校验提示拼接所在的字段名字
  desc: {
    type: String,
    default: '在线文档组件',
  },

  //是否可以修订文档
  canReview: {
    type: Number,
    default: 1,
  },
  //是否展示水印
  showWatermark: {
    type: Number,
    default: 0,
  },
  //Watermark 水印设置
  watermark: {
    type: Object,
    default: {
      type: 2,
      fontColor: '#409EFF',
    },
  },
  //最大文件个数
  docMax: {
    type: Number,
    default: 1,
  },

  //是否多选
  multiple: {
    type: Number,
    default: 0,
  },

  //文檔类型
  docType: {
    type: String,
    default: '.docx',
  },

  //展示在表单内部（inner）还是 弹框形式（dialog）
  showType: {
    type: String,
    default: 'inner',
  },
  //表单内嵌形式的宽高
  innerStyle: {
    type: Object,
    default: {
      height: 500,
      width: 500,
    },
  },
  columnCode: {
    type: String,
    required: true,
    default: '',
  },
  /**
   * 业务表编码
   */
  tableCode: {
    type: String,
    default: '',
  },
}

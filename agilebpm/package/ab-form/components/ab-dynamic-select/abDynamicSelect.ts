import { RuleItem } from 'async-validator'
import { PropType } from 'vue'
export const abDynamicSelectProps = {
  modelValue: {
    type: String,
    required: true,
    default: '',
  },
  dialogKey: {
    type: String,
    required: true,
    default: null,
  },
  param: {
    type: Object,
    default: {},
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  valueField: {
    type: String,
    required: true,
    default: null,
  },
  labelField: {
    type: String,
    required: true,
    default: null,
  },
  isTimer: {
    type: Boolean,
    default: false,
  },
  //权限
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
    required: true,
  },

  //远程检索的字段
  filterField: {
    type: String,
    default: null,
  },
  /**
   * 字段编码
   */
  columnCode: {
    type: String,
    default: '',
  },
  /**
   * 业务表编码
   */
  tableCode: {
    type: String,
    default: '',
  },
  readShowText: {
    type: Boolean,
    default: null,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  multipleLimit: {
    type: Number,
    default: 0,
  },
}

import { RuleItem } from 'async-validator'
import { PropType } from 'vue'
export const cascaderProps = {
  //权限
  permission: {
    type: String,
    default: 'w',
  },
  placeholder: {
    type: String,
    default: '请选择',
  },
  //是否可选
  disabled: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: String,
    required: true,
    default: null,
  },
  //值字段名称
  valueField: {
    type: String,
    required: true,
    default: null,
  },
  //展示字段名称
  labelField: {
    type: String,
    required: true,
    default: null,
  },
  //对话框的key，数据源查询条件
  dialogKey: {
    type: String,
    default: null,
    required: true,
  },
  param: {
    type: Object,
    default: {},
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
  readonly: {
    type: Boolean,
    default: false,
  },

  multiple: {
    type: Boolean,
    default: false,
  },
  checkStrictly: {
    type: Boolean,
    default: false,
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
}

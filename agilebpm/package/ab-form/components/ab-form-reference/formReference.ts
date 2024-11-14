import { RuleItem } from 'async-validator'
import { PropType } from 'vue'
export const formReferenceProps = {
  dialogKey: {
    type: String,
    required: true,
  },
  modelValue: {
    type: [String],
    required: true,
  },
  //是否禁用
  disabled: {
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
  readonly: {
    type: Boolean,
    default: false,
  },
  searchDesc: {
    type: String,
    default: null,
  },

  formCode: {
    type: String,
    default: null,
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
  showStyle: {
    type: String,
    default: 'tile',
  },
  cardTitle: {
    type: String,
    default: '',
  },
  dialogParam: {
    type: Object,
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
}

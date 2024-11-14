import { RuleItem } from 'async-validator'
import { PropType } from 'vue'
export const abCheckboxGroupProps = {
  // 用户默认会定义为Object any ，如果指定类型则： type: Object as PropType<User>,
  modelValue: {
    required: true,
    default: '',
    type: String,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  permission: {
    type: String,
    default: 'w',
  },
  dicCode: {
    type: String,
    default: '',
  },
  options: {
    type: Array as () => Array<CustFormOptions>,
    default: null,
  },
  rules: {
    type: Object as PropType<Array<RuleItem> | RuleItem>,
    default: [] as Array<RuleItem>,
  },
  // 描述字段，用于校验提示拼接所在的字段名字
  desc: {
    type: String,
    default: '',
  },
  //按钮样式   marquee选择框    button按钮
  buttonStyle: {
    type: String,
    default: 'marquee',
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

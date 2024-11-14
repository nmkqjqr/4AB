import { RuleItem } from 'async-validator'
import { PropType } from 'vue'
export const inputNumberProps = {
  disabled: {
    type: Boolean,
    default: false,
  },
  //是否展示千分位
  comdify: {
    type: Boolean,
    default: false,
  },
  //小数位数
  decimalPlace: {
    type: Number,
    default: 0,
  },
  //金额前缀
  // eslint-disable-next-line vue/require-default-prop
  coinValue: {
    type: String,
    default: null,
  },
  permission: {
    type: String,
    default: 'w',
  },
  // eslint-disable-next-line vue/require-default-prop
  modelValue: {
    type: Number,
    required: true,
  },
  //是否转换大小写
  convertCurrency: {
    type: Boolean,
    default: false,
  },
  rules: {
    type: Object as PropType<Array<RuleItem> | RuleItem>,
    default: [
      {
        pattern: '^-?((\\d{1,3}(,\\d{3})+?|\\d+)(\\.\\d{1,5})?)$',
        message: '只能输入数字',
      },
    ],
  },
  // 描述字段，用于校验提示拼接所在的字段名字
  desc: {
    type: String,
    required: true,
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

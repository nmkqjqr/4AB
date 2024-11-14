// @ts-ignore
import { RuleItem } from 'async-validator'
import { PropType } from 'vue'

export const signatureOpinionProps = {
  //签名配置
  signatureConfig: {
    type: String,
    default: 'moreRepeat',
  },
  //模式
  patternType: {
    type: String,
    default: 'signatureOpinion',
  },
  //签名必填
  signatureRequired: {
    type: String,
    default: 'bt',
  },
  // 字段名字
  columnName: {
    type: String,
    default: '签字',
  },
  // 业务数据
  modelValue: {
    type: String,
  },
  permission: {
    type: String,
    default: 'w',
  },
  //个人信息签名时不展示获取
  onlyWrite: {
    type: Boolean,
    default: false,
  },

  //只读不展示签字按钮
  disabled: {
    type: Boolean,
    default: false,
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

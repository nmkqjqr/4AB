import { RuleItem } from 'async-validator'
import { PropType } from 'vue'

export const abDataSelectorProps = {
  modelValue: {
    required: true,
  },
  dialogKey: {
    type: String,
    required: true,
  },
  //数据查询参数
  param: {
    type: String,
    default: null,
  },

  //对话框的一些配置
  dialogSetting: {
    type: Object,
    default: {},
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
  searchDesc: {
    type: String,
    default: '',
  },
  selectType: {
    type: String,
    default: 'custom',
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
  icon: {
    type: String,
    default: null,
  },
  //映射关系
  valueMapping: {
    type: Object,
    default: null,
  },

  //映射对象
  objectMapping: {
    type: [Object],
    default: null,
  },
  //对话框过滤参数
  dialogParam: {
    type: Object,
    default: null,
  },
  //是否展示详情
  showDetail: {
    type: Boolean,
    default: false,
  },
  //详情表单
  detailFormCode: {
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
}

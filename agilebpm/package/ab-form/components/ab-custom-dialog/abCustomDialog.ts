import { RuleItem } from 'async-validator'
import { PropType } from 'vue'
export const abCustomDialogProps = {
  dialogKey: {
    type: String,
    required: true,
  },
  modelValue: {
    type: [String],
    required: true,
  },
  //对话框的参数
  param: {
    type: Object,
    default: null,
  },
  //映射对象
  objectMapping: {
    type: [Object, Array],
    default: null,
  },
  //映射关系
  valueMapping: {
    type: Object,
    default: null,
  },
  //对话框的一些配置
  dialogSetting: {
    type: Object,
    default: null,
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
  showDetail: {
    type: Boolean,
    default: false,
  },
  detailFormCode: {
    type: String,
    default: null,
  },
  detailKey: {
    type: String,
    default: null,
  },
  mappingInitData: {
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

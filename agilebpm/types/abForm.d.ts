/**
 *  通用类型定义
 */

/**
 *  在线表单 下拉框，checkbox 数据字典的数据结构
 */
declare interface CustFormOptions {
  key: string
  text: string
  disable: any
}

declare interface CustFormData {
  /**
   * 业务对象JSON
   * {
   * 	bo1:{
   *		column1:1,
   *		table1:[...],
   *  }
   * }
   */
  data?: any
  /**
   * 在线表单JSON
   */
  initData?: any
  /**
   * 在线表单权限-字段
   */
  permission?: any
  /**
   * 在线表单权限-表
   */
  tablePermission?: any
  /**
   * 表单源码
   */
  html?: string
  /**
   * 表单js
   */
  js?: string
  /**
   * 联动参数，用于与外部组件 通过数据联动
   */
  combinationParams?: any
  /**
   * 权限类型
   */
  permissionType?: string
  /**
   * 权限值
   */
  permissionValue?: string
  /**
   * 流程实例
   */
  bpmInstance?: any
  /**
   * 流程任务
   */
  bpmTask?: any
  /**
   * actionData
   */
  actionData?: any
}

declare interface CustFormComponent {
  /**
   * 渲染在线表单，需要表单数据来，暂不支持通过 code 渲染在线表单
   */
  getData: function
}

/**
 *
 */
declare interface AbFormProvide {
  // 注册字段到ab-form中
  addField: (abInputField) => void
  // 取消注册字段到ab-form中
  removeField: (abInputField) => void
  // 执行表单校验方法
  doValidate: (isTips: boolean, filter: string) => any
  // 表单是否只读模式下仅展示文字
  readonlyShowText: boolean

  labelWidth: number
  labelSuffix: string
  //提供页面是否需要重新渲染的
  key: number
}

/**
 *  input 控件 所提供到 abForm 校验用的对象
 */
declare interface AbInputField {
  // 校验别名
  name: string
  // 值引用
  modelValue?: Ref<any>
  // 校验规则
  rules: Array<RuleItem> | RuleItem
  // 校验结果
  validateError?: string
  //validate: () => ValidateError[]
  //字段编码
  columnCode: string
  //业务表编码
  tableCode: string
}

declare interface BizLogicProgram {
  id?: string
  // 主业务对象
  boCode?: string
  boName?: string
  desc?: string
  // 生成的最终JSON
  script?: string
  designJson: BizLogicDesignJson
}

declare interface BizLogicDesignJson {
  // 通过后台SQL扩充 params 的可用变量
  paramsExpandSql?: string
  // 布局设计内的组件
  list: Array<LogicComponent>
  // 约定页面用到的参数
  params: Array<BizProgramParams>
}

declare interface LogicComponent {
  // 组件的别名
  key?: string
  // 组件的 排序
  index?: number
  //formId?: string
  /// 子组件
  list?: Array<LogicComponent>
  // 组件分类
  type: string
  // 组件名字
  label: string
  // 组件的配置
  config?: any
  // 是否展开，折叠面板时是数组，card 是 boolean
  expand?: any
  // 子项 collapse 的下个面板，不同与list
  columns?: any
}

declare interface BizProgramParams {
  name: string
  value: string
}

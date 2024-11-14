declare interface FormCombination {
  id?: string
  name: string
  code: string
  desc?: string
  typeCode: string
  designJson: DesignJson
}

declare interface DesignJson {
  // 约定页面用到的参数
  params: Array<formComponentParam>
  // 通过后台SQL扩充 params 的可用变量
  paramsExpandSql?: string
  // SQL 扩充参数的监控参数，当某个参数发生变化时，paramsExpandSql会重新加载。
  watchParam?: string
  designDesc?: string
  // 布局设计内的组件
  list: Array<FormCombinationComponent>
}

declare interface FormCombinationComponent {
  heightAuto?: boolean
  // 组件初始化要支持的加载方法
  relaod?: () => void
  // 组件监控的参数，参数变化，执行重载
  watchParams?: any
  // 展示条件
  showCondition?: string
  // 组件的别名
  key: string
  //formId?: string
  /// 子组件
  list?: Array<FormCombinationComponent>
  // 组件分类
  type: string
  // 组件名字
  label: string
  // 组件的配置
  control: formComponentControl | any
  //是否默认展开 collapse
  expand?: Array<string>
  // 是否默认，tab 是否为默认打开的 tab key
  default?: string
  //标签页s,栏格等
  columns?: Array<any>
  //初始化数据的方法，用于刷新数据
  initFunction: () => void
  // id
  i: number
  // 栏格宽度
  w: number
  h: number

  // x坐标
  x: number
  // y坐标
  y: number
  islayout?: boolean
}

declare interface formComponentControl {
  // 对齐方式 divider', 'title'
  align: 'center' | 'left' | 'right'
}

declare interface formComponentParam {
  name: string
  value: string
}

/**
 * 流程内部可用的数据定义
 */
declare interface FlowSetting {
  flowName: string
  flowDesc: string
  flowStatus: string
  flowVersion: number
  /** 节点配置 */
  nodeMap: Map<string, NodeConfig>
  /** 流程 插件 key, 插件配置 */
  plugins: Map<string, any>
  /** 默认表单 */
  defaultForm: BpmForm
  /** 实例表单 */
  instForm: BpmForm
  /** 打印表单 */
  printForm: BpmForm
  instanceButtonList: Array<BpmButton>
  /** 流程实例信息 */
  bpmProperties: BpmProperties
  // 流程标题规则
  subjectRule: string
  // 流程概要字段
  summary?: Array<string>
  // 是否支持移动端
  supportMobile: 0
  //业务对象信息
  bizModeList: Array<BpmBizModel>
  //节点初始化数据
  nodeInitList: Array<NodeInit>
}

//节点初始化数据
declare interface NodeInit {
  desc: string
  nodeKey?: string
  beforeShow?: string
  whenSave?: string
}

/**
 * 流程业务对象信息
 */
declare interface BpmBizModel {
  name: string
  code: string
}

/**
 * 流程属性配置
 */
declare interface BpmProperties {
  /** 执行人为空策略
   * * "ignore" : "忽略"
   * * "exception" : "执行人不允许为空
   * * "doSKip" : "执行人为空自动通过"
   * * turnAdmin ：执行人为空转交管理员
   */
  emptyUserStrategy: 'ignore' | 'exception' | 'doSKip' | 'turnAdmin'
  /** 是否允许自定义任务限时 */
  custTaskTimeLimit: boolean
  /** 是否紧急任务 */
  isUrgencyTask: boolean
  /** 任务限时 */
  taskTimeLimit: number
  /** 是否允许撤销 */
  allowRevoke: boolean
  /** 是否允许撤回 */
  allowRecall: boolean
  /** 是否必填意见 */
  requiredOpinion: String
  /** 是否自由驳回  */
  allowFreeBack: boolean
  /** 是否前端自定义任务限时,若紧急，则允许用户自定义设置紧急程度 */
  isCustTaskTimeLimit: boolean
  /** 驳回方式预设值 normal：驳回后按流程图，back 驳回后返回 */
  backModel: 'normal' | 'back' //
  /** 驳回后执行人，历史执行人，原始配置人 */
  backUserModel: 'history' | 'normal'
  /** 是否实例表单实时跟进  */
  instFormRealTime: boolean
}

declare interface BpmNodeProperties extends BpmProperties {
  /** 限定可驳回节点 */
  backNodeArr: Array<string>
  /** 自定义分支路线 */
  custGatewayRouter: boolean
  /** 自定义节点人员  不允许自定义，节点人员，所有用户，组下人员选择*/
  custNodeUser: 'no' | 'nodeUser' | 'allUser' | 'groupUser'
  /** 指定节点前允许撤回 */
  allowRecallPreNodeId: string
  /** 指定节点前允许撤销 */
  allowRevokePreNodeId: string
}

/**
 * 流程属性配置
 */
declare interface NodeConfig {
  nodeKey: string
  nodeName: string
  /**  节点类型 */
  nodeType: string
  /** 节点描述 */
  desc: string
  /** 节点ID */
  nodeForm: BpmForm
  /** 打印表单 */
  printForm: BpmForm
  /** 节点属性配置 */
  bpmProperties: BpmNodeProperties
  /** 节点插件 */
  plugins: Map<string, any>
  /** 按钮 */
  buttonList: Array<BpmButton>
}

declare interface GateNodeConfig extends NodeConfig {
  // 分支条件
  outGoingConditions: any
}

/**
 * 外部子流程配置
 */
declare interface CallActivityConfig extends NodeConfig {
  /** 外部子流程KEY */
  defKey: string
  /** 外部子流程名称 */
  defName: string
}

/**
 * 时间事件配置
 */
declare interface TimerEventDefinitionConfig extends NodeConfig {
  /** 时间日期选项  express: 表达式 flowVariable: 流程变量  fix: 指定时间 */
  timeDateOption: string
  /** 时间日期类型 timeCycle:循环时间 timeDuration: 持续时间*/
  timeDateType: string
  /** 开始日期 */
  timeDate: string
  /** 取消活动 */
  cancelActivity: boolean
}

/**
 * TODO
 */
declare interface BpmButton {
  name: string
  actionName: string
  javaScript?: string
  displayGroovy?: string
  uiData?: any
}

/**
 * 流程表单
 */
declare interface BpmForm {
  type: 'inner' | 'url'
  pcCode?: string
  pcName?: string
  mbCode?: string
  mbName?: string
  pcUrl?: string
  mbUrl?: string
  urlHandler?: string
  boCode?: string
}

/**
 * 会签插件对象定义
 */
declare interface Sign {
  open: boolean
  approvalType: 'parallel' | 'serial' | 'vote'
  countType: 'number' | 'percent'
  number: number
  percent: number
  endType: 'all' | 'satisfy'
  opposeAction: 'oppose' | 'reject'
  followUp: 'back' | 'next' | 'stay'
  privilegers: Array<SignPrivileger>
  buttons: Array<any>
}

/**
 * 会签特权人对象定义
 */
declare interface SignPrivileger {
  type: 'user' | 'org' | 'role' | 'post'
  key: string
  name: string
  weight: number
  addRights: boolean
  reduceRights: boolean
}

/**
 * 流程变量
 */
declare interface BpmVariable {
  // 变量KEY
  key: string
  // 变量描述
  desc: string
  // 共享类型  不共享、子流程可回写、子流程可共享
  shareType: '' | 'writeBack' | 'share'
  // 变量类型
  varType: 'double' | 'string' | 'bool' | 'date'
  // 默认值
  defaultValue?: string
  // 启动时是否必须
  startRequired?: boolean
}

/**
 * 流程变量定义
 */
declare interface BpmVariablePluginDef {
  // 流程变量级
  variables: BpmVariable[]
}

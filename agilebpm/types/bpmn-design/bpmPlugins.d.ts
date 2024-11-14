declare interface NodeExplain {
  /** 节点 */
  nodeId?: string
  /** 指引描述 */
  desc: string
  /** 指引文档模板 */
  htmlTemplate: string
  /** 是否自动打开弹框 */
  isAutoPopup: string
  /**指引类型  */
  explainType: string
  /** 文件id */
  fileJson: string
}

declare interface ExternalEvent {
  /** 节点 */
  nodeId?: string
  /** 描述 */
  desc?: string
  /** 手机号码取值信息 */
  phoneInfo?: BoTreeModelType
  /** 邮箱取值类型 */
  emailInfo?: BoTreeModelType

  /** 通知内容 */
  msgContent?: string
  /** 最大访问次数 */
  maxVisits?: number
  /** 有效时长*/
  validDuration?: number
  /** 消息体中模板参数 */
  params?: Object
  url?: string
}
/**
 * 流程变量 表单字段选择 组件 modelValue 类型
 */
declare interface BoTreeModelType {
  type?: string
  value?: string
  desc?: string
}

declare interface NodeMessage {
  /** 节点 */
  nodeId?: string
  /** 描述 */
  desc: string
  /** 执行时机 */
  event: string
  /** 条件脚本 */
  condition?: string
  /** 消息类型 */
  msgType: string
  /** 通知人 */
  userRules?: Array
  /** 消息模板 */
  templateCode: string
  /** 邮箱附件 */
  emailFile: BoTreeModelType
}

declare interface ExternalNodeMessage {
  /** 节点 */
  nodeId?: string
  /** 描述 */
  desc: string
  /** 执行时机 */
  event: string
  /** 条件脚本 */
  condition?: string
  /** 消息类型 */
  msgType: string
  /** 手机号码取值信息 */
  phoneInfo?: BoTreeModelType
  /** 邮箱取值类型 */
  emailInfo?: BoTreeModelType
  /** 邮箱附件 */
  emailFile: BoTreeModelType
  /** 消息模板 */
  templateCode: string
}


declare interface ReminderPlugin {
  /** 节点 */
  nodeId?: string
  /** 描述 */
  desc: string
  /** 催办条件脚本 */
  conditionScript?: string

  /**  完成任务限时 */
  timeLimit?: number
  /** 最少催办次数 */
  maxReminderTimes?: number
  /** 催办周期 */
  reminderCycle?: number
  /** 是否按照工作日计算 */
  isCalcWorkDay?: boolean
  /** 是否加急任务 */
  isUrgent?: boolean
  /** 催办前置脚本，若return false; 则不执行催办 */
  beforeScript?: string
  /** 消息类型 */
  msgType: string
  /** 消息模板 */
  templateCode: string
  /** 到期时间策略 */
  dueTimeStrategy?: string
  /**到期时间指定字段 */
  dueTimeField?: BoTreeModelType
}

declare interface HandScript {
  /** 脚本内容 */
  script: string
  /** 脚本描述 */
  desc: string
}

declare interface BpmEventHttpConfig {
  /** id 用于标识行数据唯一 */
  id: number
  /** 调用URL */
  url: string
  /** 是否异步调用 */
  isAsync: boolean
}

declare interface BpmEventPlugin {
  /** 模式 http，trxMessage，serviceBean，script  */
  model: string
  /** Model === http */
  httpArr?: Array<BpmEventHttpConfig>
  /** Model === trxMessage */
  trxMessageSubscribeKey?: string
  /** Model === serviceBean */
  serviceBean?: string
  /** Model === script */
  script?: HandScript
  /** 订阅数据 */
  passData?: Array<string>
  /** 执行时机 */
  eventKeys?: Array<string>
}

declare interface CarbonCopy {
  /** 节点 */
  nodeId?: string
  /** 描述 */
  desc: string
  /**
   * 抄送表单类型
   * <ol>流程任务表单</ol>
   * <ol>流程实例表单</ol>
   */
  formType: string

  /** 触发时机 */
  event: string
  /** 人员分配 */
  userRules: Array
  /** 消息类型 */
  msgType: string

  /** 富文本模板 */
  templateCode: string
}

/**
 * word模板
 */
declare interface BpmWordTemplate {
  nodeKey?: string
  wordCode?: string
  wordName?: string
  immediate?: boolean
}

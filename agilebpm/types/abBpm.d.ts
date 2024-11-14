/**
 * 流程内部可用的数据定义
 */
declare interface BpmData {
  /**流程定义名称 */
  defName?: string
  /** 流程按钮定义 TODO */
  buttonList?: Array<BpmButton>
  /** 请求后台数据的最终封装 TODO */
  actionData: ActionData
  /** 任务数据 */
  bpmTask?: BpmTask
  /** 流程实例信息 */
  bpmInstance?: BpmInstance
  /** 表单内容 */
  bpmForm?: BpmForm
  /** 表单数据异步方法 */
  getFormDataFn: (BpmButton) => any

  isTabLeave: boolean
  /**
   * 明确候选人配置
   */
  ensureCandidate?: boolean

  /**  节点特殊配置，用于提交时是否支持某种特权的判断 */
  bpmNodeConfig?: {
    /** 是否必填意见 */
    requiredOpinion: String
    /** 驳回方式预设值 normal：驳回后按流程图，back 驳回后返回 */
    backModel: string // 'normal' | 'back'
    /** 是否自由驳回  */
    allowFreeBack: boolean
    /** 是否前端自定义任务限时,若紧急，则允许用户自定义设置紧急程度 */
    custTaskTimeLimit: boolean
    /** 是否加急  */
    isUrgencyTask?: boolean
    /**
     * 驳回指定的节点
     */
    backNodeArr: string[]
    /**
     * 自由分支选择
     */
    custGatewayRouter: boolean
    /**
     * 自由候选人，为‘no’ 的时候不开启
     */
    custNodeUser: string
  }
}

/**
 * 请求后台的ActionData
 */
declare interface ActionData {
  actionName: string
  instanceId?: string
  /** 启动时用 */
  defId?: string
  /** 办理任务时使用 */
  taskId?: string
  bizId?: string
  data?: any
  boLoadMap?: any
  presetDestination?: string
  opinion: string
  /**
   * 前端预设下一节点，节点人员，这里优先级高于后台配置
   * 数据结构如对UserTask1节点设置用户 xx : {userTask1:[{id:xx,name:xx}]}
   */
  identityMap?: any
  extendConf: {
    /**
     *  流程二次确认
     */
    confirm?: boolean
    /** 任务限时 */
    taskTimeLimit?: number
    /** 是否加急  */
    isUrgencyTask?: boolean
    /**
     * 消息类型
     */
    msgType?: string
    /**
     * 消息内容
     */
    msgContent?: string
    /**
     * 驳回方式 normal/back
     */
    backModel?: string
    /**
     * 驳回后执行人
     */
    backUserModel?: string
    /**
     * 消息通知人员列表
     */
    users?: []
    /**
     * 传阅id
     */
    carbonId?: string
    /**
     * 明确候选人插件的节点明确信息
     */
    ensureCandidateInfo?: any
    /**
     * 会签相关数据
     */
    signData?: any
    /**
     * 获取实例详情类型：参考 ab-bpm/index props 中的type
     */
    sourceType?: string
    /**
     * 每个type对应的Id，如：当sourceType == opinionDeta 时，需要设置opinionId
     */
    typeId?: string
    /**
     * 页面的参数信息（透传至后端）
     */
    param?: any
    /**
     * 附件信息
     */
    files?: any
  }
}

declare interface BpmInstance {
  id: string
  title: string
  defId: string
  parentId: string
  defKey: string
  bizId: string
  status: string
  durationMs: number
  createBy: string
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

declare interface BpmTask {
  id: string
  title: string
  name: string
  nodeKey: string
  instId: string
  defId: string
  status: string
  assigneeNames: string
  taskType: string
}

/**
 * 流程按钮
 */
declare interface BpmButton {
  name: string
  actionName: string
  javaScript?: string
}

/**
 * 流程定时启动
 */
interface BpmScheduleStart {
  /**
   * 主键
   */
  id?: string

  /**
   * 流程定义KEY
   */
  defKey?: string

  /**
   * 流程定义名称
   */
  defName?: string

  /**
   * 描述
   */
  desc?: string

  /**
   * 重复次数
   */
  repeatNumber?: number

  /**
   * 状态
   */
  status?: 'running' | 'disabled' | 'finished'

  /**
   * 最大重试次数
   */
  maxRetryTimes?: number

  /**
   * 任务类型
   *
   * <ul>
   *  <li>recycle：周期任务</li>
   *  <li>once：一次性任务</li>
   * </ul>
   */
  taskType?: 'recycle' | 'once' | ''

  /**
   * 只在工作日执行
   */
  onlyWorkday?: 0 | 1

  /**
   * Cron表达式
   */
  cronExp?: string

  /**
   * 发起用户名
   */
  startUsername?: string

  /**
   * 发起人姓名
   */
  startFullname?: string

  /**
   * 发起组织编码
   */
  startOrgCode?: string

  /**
   * 发起组织名
   */
  startOrgName?: string

  /**
   * 发起意见
   */
  startOpinion?: string

  /**
   * 业务数据
   */
  bizData?: string

  /**
   * 流程变量
   */
  flowVariable?: string

  /**
   * 脚本
   */
  script?: string

  /**
   * 下次触发时间
   */
  nextTriggerTime?: string
}

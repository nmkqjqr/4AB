// 全局事件定义
export const eventDefs = [
  { label: '流程启动时', value: 'PROCESS_STARTED' },
  { label: '流程结束时', value: 'PROCESS_COMPLETED' },
  { label: '人工终止时', value: 'PROCESS_MANUALEND' },
  { label: '任务创建后', value: 'TASK_CREATED' },
  { label: '任务创建时-未分配人员', value: 'TASK_CREATE' },
  { label: '任务完成时', value: 'TASK_COMPLETED' },
  { label: '会签任务创建时', value: 'SIGN_TASK_CREATED' },
  { label: '会签任务完成时', value: 'SIGN_TASK_COMPLETED' },
]

/**
 * 获取事件定义名称
 * @param eventKey 事件KEY
 */
export const getEventDefName = (eventKey: string) => {
  return eventDefs.find((ele) => ele.value === eventKey)?.label
}

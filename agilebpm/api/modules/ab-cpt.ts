import request from './../ab-request'
const servicePrefix = '/ab-bpm'

// 事务消息待处理列表
export const trxMessageRedoListUrl = `${servicePrefix}/trxm/trx-message-redo/listJson`

// 事务消息待处理详情
export const trxMessageRedoGetUrl = `${servicePrefix}/trxm/trx-message-redo/get?id=`

// 事务消息待处理-重试
export const trxMessageRedoRetryUrl = `${servicePrefix}/trxm/trx-message-redo/retry?id=`

// 事务消息待处理-删除
export const trxMessageRedoRemoveUrl = `${servicePrefix}/trxm/trx-message-redo/remove?id=`

//事务消息完成记录
export const trxMessageDoneListUrl = `${servicePrefix}/trxm/trx-message-done/listJson`

//事务消息完成记录详情
export const trxMessageDoneGetUrl = `${servicePrefix}/trxm/trx-message-done/get?id=`

// 事务消息完成记录-删除
export const trxMessageDoneRemoveUrl = `${servicePrefix}/trxm/trx-message-done/remove?id=`

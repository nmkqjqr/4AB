import request, { getData, postData } from './../../api/ab-request'
import * as abTools from '~/agilebpm/utils/ab-tools'
import { salaryServicePrefix as servicePrefix } from '../ab-api-prefix'

//薪酬科目-数据列表
export const salaryRuleListUrl = `${servicePrefix}/salaryRule/listJson`

//查询薪酬科目默认数据
export const defListUrl = `${servicePrefix}/salaryRule/defListJson`

//薪酬科目-获取数据
export const salaryRuleGetUrl = `${servicePrefix}/salaryRule/get`

//薪酬科目-删除数据
export const salaryRuleDelUrl = `${servicePrefix}/salaryRule/remove?id=`

//薪酬科目-保存数据
export const salaryRuleSaveUrl = `${servicePrefix}/salaryRule/saveRule`

//薪酬体系-数据列表
export const salaryClassListUrl = `${servicePrefix}/salaryClass/listJson`

//薪酬体系-获取数据
export const salaryClassGetUrl = `${servicePrefix}/salaryClass/getSalaryClass`

//薪酬体系-删除数据
export const salaryClassDelUrl = `${servicePrefix}/salaryClass/remove?id=`

//薪酬体系-保存数据
export const salaryClassSaveUrl = `${servicePrefix}/salaryClass/saveSalaryClass`

//薪酬管理-数据列表
export const salaryManageListUrl = `${servicePrefix}/salaryManage/listJson`

//薪酬管理-获取数据
export const salaryManageGetUrl = `${servicePrefix}/salaryManage/get`

//薪酬管理-删除数据
export const salaryManageDelUrl = `${servicePrefix}/salaryManage/delSalaryManage?id=`

//薪酬管理-保存数据
export const salaryManageSaveUrl = `${servicePrefix}/salaryManage/saveSalaryManage`

//薪酬管理明细-查询数据
export const salaryManageDetailGetUrl = `${servicePrefix}/salaryManageDetail/getSalaryManage`

//薪酬计算-数据列表
export const salaryLogListUrl = `${servicePrefix}/salaryLog/salaryLogList`

//薪酬计算-同步考勤url
export const attendanceCalculateUrl = `${servicePrefix}/salaryLog/attendanceCalculate`

//薪酬计算-工资计算url
export const salaryCalculateUrl = `${servicePrefix}/salaryLog/salaryCalculate`

//薪酬计算-获取单个计算值
export const salaryCalculateGetUrl = `${servicePrefix}/salaryLog/get`

//薪酬计算明细
export const salaryCalculateDetailListUrl = `${servicePrefix}/salaryCalculateDetail/list`

//薪酬计算-推送工资条
export const sendCalculateLogUrl = `${servicePrefix}/salaryLog/sendCalculateLog`

//薪酬计算-获取计算状态
export const getSalaryCalculateStatusUrl = `${servicePrefix}/salaryLog/getSalaryCalculateStatus`

//考勤列表
export const attendanceLogListUrl = `${servicePrefix}/attendanceLog/listJson`

//保存考勤数据
export const attendanceLogSaveUrl = `${servicePrefix}/attendanceLog/save`

//获取考勤数据
export const attendanceLogGetUrl = `${servicePrefix}/attendanceLog/get`

//导入考勤数据
export const attendanceLogImportUrl = `${servicePrefix}/attendanceLog/import`

//删除考勤数据
export const attendanceLogDelUrl = `${servicePrefix}/attendanceLog/remove?id=`


//更新工资条状态
export const batchUpdateStatusUrl = `${servicePrefix}/salaryLog/batchUpdateStatus?id=`

//获取默认规则
export const getDefList = () => {
  return getData(defListUrl)
}

//获取计算状态
export const getSalaryCalculateStatus = (id: string) => {
  return getData(getSalaryCalculateStatusUrl, {
    id: id,
  })
}

//获取考勤数据模板
export function exportTemplateUrl() {
  return request({
    url: `${servicePrefix}/attendanceLog/exportTemplate`,
    method: 'POST',
    responseType: 'blob',
  })
}

//薪酬计算-同步考勤
export const attendanceCalculate = (from: any, userIds: any) => {
  return request({
    url: attendanceCalculateUrl,
    method: 'post',
    data: {
      from: from,
      userIds: userIds,
    },
  })
}

//薪酬计算明细
export const calculateLogDetail = (id: any) => {
  return request({
    url: salaryCalculateDetailListUrl + '?id=' + id,
    method: 'get',
  })
}
//获取考勤数据模板
export function salaryExport(
  salaryMonth: any,
  userType: any,
  userGroup: any,
  userIds: any
) {
  return request({
    url: `${servicePrefix}/salaryLog/salaryExport`,
    method: 'POST',
    data: {
      salaryMonth: salaryMonth,
      userType: userType,
      userGroup: userGroup,
      userIds: userIds,
    },
    responseType: 'blob',
  })
}

//薪酬计算-工资计算
export const salaryCalculate = (
  salaryMonth: any,
  userType: any,
  userGroup: any,
  userIds: any,
  actionType: any
) => {
  if (actionType == 0) {
    return request({
      url: salaryCalculateUrl,
      method: 'post',
      data: {
        salaryMonth: salaryMonth,
        userType: userType,
        userGroup: userGroup,
        userIds: userIds,
      },
    })
  } else {
    return request({
      url: sendCalculateLogUrl,
      method: 'post',
      data: {
        salaryMonth: salaryMonth,
        userType: userType,
        userGroup: userGroup,
        userIds: userIds,
      },
    })
  }
}
export const getSalaryClassGetUrl = (id: string) => {
  return getData(salaryClassGetUrl, {
    id: id,
  })
}

export const getsalaryManageDetail = (id: string) => {
  return getData(salaryManageDetailGetUrl, {
    userId: id,
  })
}


import { sysServicePrefix as servicePrefix } from '../../ab-api-prefix'

// 数据权限-列表地址
export const dataPrivilegeListUrl = `${servicePrefix}/dataPrivilege/listJson`
// 数据权限-删除地址
export const dataPrivilegeRemoveUrl = `${servicePrefix}/dataPrivilege/remove?id=`
// 数据权限-变更启用
export const dataPrivilegeChangeEnabledUrl = `${servicePrefix}/dataPrivilege/changeEnabled`
// 数据权限-保存地址
export const dataPrivilegeSaveUrl = `${servicePrefix}/dataPrivilege/save`
// 数据权限-获取地址
export const dataPrivilegeGetUrl = `${servicePrefix}/dataPrivilege/get`
// 数据权限-获取分配详细
export const dataPrivilegeGivenGetDetailUrl = `${servicePrefix}/dataPrivilege/getGivenDetail`
export const dataPrivilegeGivenUrl = `${servicePrefix}/dataPrivilege/given`
// 数据权限-重置分配
export const dataPrivilegeResetGivenUrl = `${servicePrefix}/dataPrivilege/resetGiven`
// 数据权限-角色分配列表地址
export const authorityDataPrivilegeGivenListJsonUrl = `${servicePrefix}/dataPrivilege/authorityListJson`
// 数据权限-分管角色管理
export const authorityDataPrivilegeMgrUrl = `${servicePrefix}/dataPrivilege/authorityDataPrivilegeMgr`
import Layout from '@vab/layouts/index.vue'
export default {
  path: '/sys',
  name: 'System',
  component: Layout,
  meta: {
    title: '系统管理',
    icon: 'home-2-line',
    breadcrumbHidden: true,
  },
  children: [
    {
      path: 'dataDic/datadicList',
      name: 'DatadicList',
      component: () => import('@/views/sys/dataDic/datadicList.vue'),
      meta: {
        title: '数据字典',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'serial/serialList',
      name: 'SerialList',
      component: () => import('@/views/sys/serial/serialList.vue'),
      meta: {
        title: '流水号',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'serial/serialEdit',
      name: 'SerialEdit',
      component: () => import('@/views/sys/serial/serialEdit.vue'),
      meta: {
        title: '编辑流水号',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'schedule/myschedule',
      name: 'Myschedule',
      component: () => import('@/views/sys/schedule/mysche.vue'),
      meta: {
        title: '我的日程',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'schedule/scheList',
      name: 'ScheList',
      component: () => import('@/views/sys/schedule/scheList.vue'),
      meta: {
        title: '日程管理',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'schedule/scheEdit',
      name: 'ScheEdit',
      component: () => import('@/views/sys/schedule/scheEdit.vue'),
      meta: {
        title: '编辑日程',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'sysResourceList',
      name: 'SysResource',
      component: () => import('@/views/sys/sysResourceList/index.vue'),
      meta: {
        title: '系统资源',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'internation/languageList',
      name: 'LanguageList',
      component: () => import('@/views/sys/internation/languageList.vue'),
      meta: {
        title: '语言管理',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'internation/languageEdit',
      name: 'LanguageEdit',
      component: () => import('@/views/sys/internation/languageEdit.vue'),
      meta: {
        title: '编辑语言',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'internation/translationList',
      name: 'TranslationList',
      component: () => import('@/views/sys/internation/translationList.vue'),
      meta: {
        title: '翻译管理',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'dailyPhrases/dailyPhrasesList',
      name: 'DailyPhrasesList',
      component: () => import('@/views/sys/dailyPhrases/dailyPhrasesList.vue'),
      meta: {
        title: '常用语管理',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'dailyPhrases/dailyPhrasesEdit',
      name: 'DailyPhrasesEdit',
      component: () => import('@/views/sys/dailyPhrases/dailyPhrasesEdit.vue'),
      meta: {
        title: '编辑常用语',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'application/applicationList',
      name: 'ApplicationList',
      component: () => import('@/views/sys/application/applicationList.vue'),
      meta: {
        title: '应用管理',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'application/applicationEdit',
      name: 'ApplicationEdit',
      component: () => import('@/views/sys/application/applicationEdit.vue'),
      meta: {
        title: '编辑应用',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'dataSource/dataSourceList',
      name: 'DataSourceList',
      component: () => import('@/views/sys/dataSource/dataSourceList.vue'),
      meta: {
        title: '数据源列表',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'dataSource/dataSourceEdit',
      name: 'DataSourceEdit',
      component: () => import('@/views/sys/dataSource/dataSourceEdit.vue'),
      meta: {
        title: '数据源编辑',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'dataSource/dataSourceDefList',
      name: 'DataSourceDefList',
      component: () => import('@/views/sys/dataSource/dataSourceDefList.vue'),
      meta: {
        title: '数据源模板列表',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'dataSource/dataSourceDefEdit',
      name: 'DataSourceDefEdit',
      component: () => import('@/views/sys/dataSource/dataSourceDefEdit.vue'),
      meta: {
        title: '数据源模板编辑',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'auditLog/auditLogList',
      name: 'AuditLogList',
      component: () => import('@/views/sys/auditLog/auditLogList.vue'),
      meta: {
        title: '审计日志列表',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'auditLog/auditLogDetail',
      name: 'AuditLogDetail',
      component: () => import('@/views/sys/auditLog/auditLogDetail.vue'),
      meta: {
        title: '审计日志详情',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'auditLog/logMetadataList',
      name: 'LogMetadataList',
      component: () => import('@/views/sys/auditLog/logMetadataList.vue'),
      meta: {
        title: '日志定义列表',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'auditLog/logMetadataEdit',
      name: 'LogMetadataEdit',
      component: () => import('@/views/sys/auditLog/logMetadataEdit.vue'),
      meta: {
        title: '日志定义编辑',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'auditLog/logErrorList',
      name: 'LogErrorList',
      component: () => import('@/views/sys/auditLog/logErrorList.vue'),
      meta: {
        title: '异常日志列表',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'auditLog/logErrorEdit',
      name: 'LogErrorEdit',
      component: () => import('@/views/sys/auditLog/logErrorEdit.vue'),
      meta: {
        title: '异常日志编辑',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'properties/propertyList',
      name: 'PropertyList',
      component: () => import('@/views/sys/properties/propertyList.vue'),
      meta: {
        title: '系统属性列表',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'properties/propertyEdit',
      name: 'PropertyEdit',
      component: () => import('@/views/sys/properties/propertyEdit.vue'),
      meta: {
        title: '系统属性编辑',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'scripts/scriptList',
      name: 'ScriptList',
      component: () => import('@/views/sys/scripts/scriptList.vue'),
      meta: {
        title: '常用脚本列表',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'scripts/scriptEdit',
      name: 'ScriptEdit',
      component: () => import('@/views/sys/scripts/scriptEdit.vue'),
      meta: {
        title: '常用脚本编辑',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'holidayConf/holidayList',
      name: 'HolidayList',
      component: () => import('@/views/sys/holidayConf/holidayList.vue'),
      meta: {
        title: '节假日配置列表',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'holidayConf/holidayEdit',
      name: 'HolidayEdit',
      component: () => import('@/views/sys/holidayConf/holidayEdit.vue'),
      meta: {
        title: '节假日配置编辑',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'trx-message-redo/list',
      name: 'trxmMessageRedoList',
      component: () => import('@/views/sys/trxMessage/trxMessageRedoList.vue'),
      meta: {
        title: '事务消息队列',
        icon: 'home-2-line',
      },
    },
    {
      path: 'trx-message-redo/detail',
      name: 'trxmMessageRedoDetail',
      component: () => import('@/views/sys/trxMessage/trxMessageRedoEdit.vue'),
      meta: {
        title: '事务消息队列详情',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'trx-message-done/list',
      name: 'trxmMessageDoneList',
      component: () => import('@/views/sys/trxMessage/trxMessageDoneList.vue'),
      meta: {
        title: '事务消息日志',
        icon: 'home-2-line',
      },
    },
    {
      path: 'trx-message-done/detail',
      name: 'trxmMessageDoneDetail',
      component: () => import('@/views/sys/trxMessage/trxMessageDoneEdit.vue'),
      meta: {
        title: '事务消息日志详情',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'crontab/list',
      name: 'crontabList',
      component: () => import('@/views/sys/crontab/crontabList.vue'),
      meta: {
        title: '定时计划',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'crontab/edit',
      name: 'crontabEdit',
      component: () => import('@/views/sys/crontab/crontabEdit.vue'),
      meta: {
        title: '定时计划编辑',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'dataPrivilege/list',
      name: 'dataPrivilegeList',
      component: () =>
        import('@/views/sys/dataPrivilege/dataPrivilegeList.vue'),
      meta: {
        title: '分管资源定义',
        icon: 'grid-fill',
        noKeepAlive: false,
      },
    },
    {
      path: 'dataPrivilege/authorityMgr',
      name: 'dataPrivilegeAuthorityMgr',
      component: () =>
        import('@/views/sys/dataPrivilege/authorityDataPrivilegeMgrList.vue'),
      meta: {
        title: '分管角色管理',
        icon: 'grid-fill',
        noKeepAlive: false,
      },
    },
    {
      path: 'dataPrivilege/edit',
      name: 'dataPrivilegeEdit',
      component: () =>
        import('@/views/sys/dataPrivilege/dataPrivilegeEdit.vue'),
      meta: {
        title: '分管资源定义编辑',
        icon: 'grid-fill',
        noKeepAlive: true,
      },
    },
    {
      path: 'productLicence/info',
      name: 'productLicenceInfo',
      component: () => import('@/views/sys/productLicence/licenceInfo.vue'),
      meta: {
        title: '产品授权信息',
        icon: 'grid-fill',
        noKeepAlive: false,
      },
    },
    {
      path: 'messageTemplate/list',
      name: 'messageTemplateList',
      component: () =>
        import('@/views/sys/messageTemplate/messageTemplateList.vue'),
      meta: {
        title: '模板列表',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'messageTemplate/edit',
      name: 'messageTemplateEdit',
      component: () =>
        import('@/views/sys/messageTemplate/messageTemplateEdit.vue'),
      meta: {
        title: '模板详情',
        icon: 'dashboard-line',
        noKeepAlive: true,
      },
    },
    {
      path: 'sysFile/sysFileList',
      name: 'SysFileList',
      component: () => import('@/views/sys/sysFile/sysFileList.vue'),
      meta: {
        title: '系统附件',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'tenantMgr/appList',
      name: 'TenantMgrAppList',
      component: () => import('@/views/sys/tenantManager/tenantAppList.vue'),
      meta: {
        title: '租户应用列表',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'tenantMgr/appEdit',
      name: 'TenantMgrAppEdit',
      component: () => import('@/views/sys/tenantManager/tenantAppEdit.vue'),
      meta: {
        title: '租户应用编辑',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'tenantMgr/appDetail',
      name: 'TenantMgrAppDetail',
      component: () => import('@/views/sys/tenantManager/tenantAppDetail.vue'),
      meta: {
        title: '租户应用详情',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'tenantMgr/list',
      name: 'TenantMgrList',
      component: () => import('@/views/sys/tenantManager/tenantList.vue'),
      meta: {
        title: '租户列表',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'tenantMgr/edit',
      name: 'TenantMgrEdit',
      component: () => import('@/views/sys/tenantManager/tenantEdit.vue'),
      meta: {
        title: '租户编辑',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'tenantMgr/detail',
      name: 'TenantMgrDetail',
      component: () => import('@/views/sys/tenantManager/tenantDetail.vue'),
      meta: {
        title: '租户详情',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'tenantMgr/appstore',
      name: 'TenantMgrAppstore',
      component: () => import('@/views/sys/tenantManager/tenantAppstore.vue'),
      meta: {
        title: '租户应用管理',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'tenantMgr/pvStatisticsPushConfig',
      name: 'TenantMgrPvStatisticsPushConfig',
      component: () =>
        import('@/views/sys/tenantManager/tenantPvStatisticsPushConfig.vue'),
      meta: {
        title: '租户访问量统计推送配置',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'tenantApp/detail',
      name: 'TenantAppDetail',
      component: () => import('@/views/sys/tenant/tenantAppDetail.vue'),
      meta: {
        title: '租户应用详情',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'tenant/appstore',
      name: 'TenantAppstore',
      component: () => import('@/views/sys/tenant/tenantAppstore.vue'),
      meta: {
        title: '应用市场',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'tenant/appDetail',
      name: 'TenantAppDetail',
      component: () => import('@/views/sys/tenant/tenantAppDetail.vue'),
      meta: {
        title: '应用详情',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'sysSecurity/sysConfiguration',
      name: 'SysConfiguration',
      component: () => import('@/views/sys/sysSecurity/sysConfiguration.vue'),
      meta: {
        title: '系统配置',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'sysSecurity/resourceAuthList/:code',
      name: 'ResourceAuthList',
      component: () => import('@/views/sys/sysSecurity/resourceAuthList.vue'),
      meta: {
        title: '系统配置',
        icon: 'dashboard-line',
        dynamicNewTab: true,
        noKeepAlive: false,
      },
    },
    {
      path: 'workHandover/workHandoverList',
      name: 'WorkHandoverList',
      component: () => import('@/views/sys/workHandover/workHandoverList.vue'),
      meta: {
        title: '工作交接列表',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'workHandover/workHandoverEdit',
      name: 'WorkHandoverEdit',
      component: () => import('@/views/sys/workHandover/workHandoverEdit.vue'),
      meta: {
        title: '工作交接编辑',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'tempLink/tempLinkList',
      name: 'TempLinkList',
      component: () => import('@/views/sys/tempLink/tempLinkList.vue'),
      meta: {
        title: '临时链接列表',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'tempLink/tempLinkSenLogList',
      name: 'TempLinkSenLogList',
      component: () => import('@/views/sys/tempLink/tempLinkSenLogList.vue'),
      meta: {
        title: '临时链接推送日志',
        icon: 'dashboard-line',
        noKeepAlive: false,
      },
    },
    {
      path: 'authTransfer/transfer',
      name: 'AuthTransfer',
      component: () => import('@/views/sys/authTransfer/authTransfer.vue'),
      meta: {
        title: '权限转移',
      },
    },
    {
      path: 'authTransfer/transferLog',
      name: 'AuthTransferLog',
      component: () => import('@/views/sys/authTransfer/authTransferLog.vue'),
      meta: {
        title: '权限转移日志',
      },
    },
  ],
}

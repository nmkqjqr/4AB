import { abT } from '@/i18n'
export const selectePorp = {
  expandTrigger: 'hover',
}

export const conditionTypes = [
  {
    value: 'currentNode',
    label: abT('bpm.office.currentNodeKey', '当前任务节点'),
    type: 'currentNode',
  },
  {
    value: 'startUser',
    label: abT('bpm.office.processInitiator', '流程发起者'),
    children: [
      {
        value: 'userId',
        label: abT('page.common.userID', '用户ID'),
        type: 'userId',
      },
      {
        value: 'username',
        label: abT('page.common.userAccount', '用户账户'),
      },
      {
        value: 'role',
        label: abT('page.common.role', '角色'),
        children: [
          {
            value: 'idList',
            label: abT('bpm.office.IDSet', 'ID集合'),
            type: 'roleList',
          },
          {
            value: 'codeList',
            label: abT('bpm.office.codeSet', '编码集合'),
            type: 'List',
          },
          {
            value: 'maxLevelCode',
            label: abT('bpm.office.roleCode', '角色编码（最大）'),
          },
          {
            value: 'maxLevel',
            label: abT('bpm.office.levelMax', '级别（最大）'),
            type: 'number',
          },
        ],
      },
      {
        value: 'orgId',
        label: abT('bpm.office.currentDepartment', '当前部门'),
        type: 'orgId',
      },
      {
        value: 'orgCode',
        label: abT('bpm.office.currentDepartmentCode', '当前部门编码'),
      },
      {
        value: 'orgType',
        label: abT('bpm.office.currentDepartmentType', '当前部门类型'),
      },
      {
        value: 'orgName',
        label: abT('bpm.office.currentDepartmentName', '当前部门名字'),
      },
    ],
  },
]

export const defaultConfig = {
  keyName: ['currentNode'],
  key: 'currentNode',
  keyType: 'currentNode',
  condition: '{0}.equals( {1} )',
  valueType: 'currentNode',
  value: '',
}

export const defaultConditionScript = {
  type: 'config',
  handScript: {
    script: '',
    desc: '',
  },
  configScript: {
    script: '',
    desc: '',
    configs: [
      {
        sn: 1,
        list: [defaultConfig],
      },
    ],
  },
}

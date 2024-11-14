import { abT } from '@/i18n'
export const selectePorp = {
  expandTrigger: 'hover',
}

export const cascaderOptions = [
  {
    value: 'submitActionName',
    label: abT('bpm.office.taskProcessingActions', '任务处理动作'),
    type: 'actionType',
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
  {
    value: 'currentUser',
    label: abT('bpm.office.taskProcessor', '任务处理者'),
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

export const conditionMap = {
  varchar: [
    {
      // 条件名字
      name: abT('bpm.office.equal', '等于'),
      // 表达式
      value: '{0}.equals( {1} )',
    },
    {
      name: abT('bpm.office.notEqual', '不等于'),
      value: '!{0}.equals( {1} )',
    },
    {
      name: abT('bpm.office.isEmpty', '为空'),
      value: "{0} == '' || {0} == null ",
      notNeedParam: true,
    },
    {
      name: abT('bpm.office.notEmpty', '不为空'),
      value: "{0} != '' && {0} != null ",
      notNeedParam: true,
    },

    //  暂时弃用，比较麻烦
    // {
    //   name: '包含2',
    //   value: '({0}.split(",") as Set).intersect({1}.split(",") as Set) ? true : false',
    // },
    {
      name: abT('bpm.office.contain', '包含'),
      value: 'sysScript.abContains({0},{1})',
    },
    {
      name: abT('bpm.office.excluding', '不包含'),
      value: '!sysScript.abContains({0},{1})',
    },
    {
      name: abT('bpm.office.between', '在之中'),
      value: 'sysScript.abContains({1},{0})',
    },
    {
      name: abT('bpm.office.notInTheMiddle', '不在之中'),
      value: '!sysScript.abContains({1},{0})',
    },
    {
      name: `${abT('bpm.office.contain', '包含')}(${abT(
        'page.common.abandoned',
        '弃用'
      )})`,
      value: '{0}.contains({1})',
      disabled: true,
    },
    {
      name: `${abT('bpm.office.excluding', '不包含')}(${abT(
        'page.common.abandoned',
        '弃用'
      )})`,
      value: '!{0}.contains({1})',
      disabled: true,
    },
    {
      name: `${abT('bpm.office.between', '在之中')}(${abT(
        'page.common.abandoned',
        '弃用'
      )})`,
      value: '{1}.contains({0})',
      disabled: true,
    },
    {
      name: `${abT('bpm.office.notInTheMiddle', '不在之中')}(${abT(
        'page.common.abandoned',
        '弃用'
      )})`,
      value: '!{1}.contains({0})',
      disabled: true,
    },
  ],
  number: [
    {
      // 条件名字
      name: abT('bpm.office.equal', '等于'),
      // 表达式
      value: '{0} == {1} ',
    },
    {
      name: abT('bpm.office.notEqual', '不等于'),
      value: '{0} != {1} ',
    },
    {
      // 条件名字
      name: abT('bpm.office.greaterThan', '大于'),
      // 表达式
      value: '{0} > {1} ',
    },
    {
      // 条件名字
      name: abT('bpm.office.GreaterThanOrEqual', '大于等于'),
      value: '{0} >= {1} ',
    },
    {
      name: abT('bpm.office.lessThan', '小于'),
      value: '{0} < {1} ',
    },
    {
      name: abT('bpm.office.lessThanOREqual', '小于等于'),
      value: '{0} <= {1} ',
    },
    {
      name: abT('bpm.office.isEmpty', '为空'),
      value: "{0} == '' || {0} == null ",
      notNeedParam: true,
    },
    {
      name: abT('bpm.office.notEmpty', '不为空'),
      value: "{0} != '' && {0} != null ",
      notNeedParam: true,
    },
    {
      name: abT('bpm.office.contain', '包含'),
      value: 'sysScript.abContains({0},{1})',
    },
    {
      name: abT('bpm.office.excluding', '不包含'),
      value: '!sysScript.abContains({0},{1})',
    },
    {
      name: abT('bpm.office.between', '在之中'),
      value: 'sysScript.abContains({1},{0})',
    },
    {
      name: abT('bpm.office.notInTheMiddle', '不在之中'),
      value: '!sysScript.abContains({1},{0})',
    },
    {
      name: `${abT('bpm.office.contain', '包含')}(${abT(
        'page.common.abandoned',
        '弃用'
      )})`,
      value: '{0}.contains({1})',
      disabled: true,
    },
    {
      name: `${abT('bpm.office.excluding', '不包含')}(${abT(
        'page.common.abandoned',
        '弃用'
      )})`,
      value: '!{0}.contains({1})',
      disabled: true,
    },
    {
      name: `${abT('bpm.office.between', '在之中')}(${abT(
        'page.common.abandoned',
        '弃用'
      )})`,
      value: '{1}.contains({0})',
      disabled: true,
    },
    {
      name: `${abT('bpm.office.notInTheMiddle', '不在之中')}(${abT(
        'page.common.abandoned',
        '弃用'
      )})`,
      value: '!{1}.contains({0})',
      disabled: true,
    },
  ],
  roleList: [
    {
      name: abT('bpm.office.contain', '包含'),
      value: 'sysScript.abContains({0},{1})',
    },
    {
      name: abT('bpm.office.excluding', '不包含'),
      value: '!sysScript.abContains({0},{1})',
    },
    {
      name: abT('bpm.office.between', '在之中'),
      value: 'sysScript.abContains({1},{0})',
    },
    {
      name: abT('bpm.office.notInTheMiddle', '不在之中'),
      value: '!sysScript.abContains({1},{0})',
    },
    {
      name: `${abT('bpm.office.contain', '包含')}(${abT(
        'page.common.abandoned',
        '弃用'
      )})`,
      value: '{0}.contains({1})',
      disabled: true,
    },
    {
      name: `${abT('bpm.office.excluding', '不包含')}(${abT(
        'page.common.abandoned',
        '弃用'
      )})`,
      value: '!{0}.contains({1})',
      disabled: true,
    },
    {
      name: `${abT('bpm.office.between', '在之中')}(${abT(
        'page.common.abandoned',
        '弃用'
      )})`,
      value: '{1}.contains({0})',
      disabled: true,
    },
    {
      name: `${abT('bpm.office.notInTheMiddle', '不在之中')}(${abT(
        'page.common.abandoned',
        '弃用'
      )})`,
      value: '!{1}.contains({0})',
      disabled: true,
    },
  ],
  List: [
    {
      name: abT('bpm.office.contain', '包含'),
      value: 'sysScript.abContains({0},{1})',
    },
    {
      name: abT('bpm.office.excluding', '不包含'),
      value: '!sysScript.abContains({0},{1})',
    },
    {
      name: abT('bpm.office.between', '在之中'),
      value: 'sysScript.abContains({1},{0})',
    },
    {
      name: abT('bpm.office.notInTheMiddle', '不在之中'),
      value: '!sysScript.abContains({1},{0})',
    },
    {
      name: `${abT('bpm.office.contain', '包含')}(${abT(
        'page.common.abandoned',
        '弃用'
      )})`,
      value: '{0}.contains({1})',
      disabled: true,
    },
    {
      name: `${abT('bpm.office.excluding', '不包含')}(${abT(
        'page.common.abandoned',
        '弃用'
      )})`,
      value: '!{0}.contains({1})',
      disabled: true,
    },
  ],
  date: [
    {
      // 条件名字
      name: abT('bpm.office.equal', '等于'),
      // 表达式
      value: '{0}.equals( {1} )',
    },
    {
      name: abT('bpm.office.notEqual', '不等于'),
      value: '!{0}.equals( {1} )',
    },
    {
      name: abT('bpm.office.isEmpty', '为空'),
      value: "{0} == '' || {0} == null ",
      notNeedParam: true,
    },
    {
      name: abT('bpm.office.notEmpty', '不为空'),
      value: "{0} != '' && {0} != null ",
      notNeedParam: true,
    },
    {
      name: abT('bpm.office.contain', '包含'),
      value: 'sysScript.abContains({0},{1})',
    },
    {
      name: abT('bpm.office.excluding', '不包含'),
      value: '!sysScript.abContains({0},{1})',
    },
    {
      name: abT('bpm.office.between', '在之中'),
      value: 'sysScript.abContains({1},{0})',
    },
    {
      name: abT('bpm.office.notInTheMiddle', '不在之中'),
      value: '!sysScript.abContains({1},{0})',
    },
  ],
}

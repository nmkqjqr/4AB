export const selectePorp = {
  expandTrigger: 'hover',
}

export const cascaderOptions = [
  {
    value: 'submitActionName',
    label: '任务处理动作',
    type: 'actionType',
  } /*
  {
    value: 'order',
    label: '订单信息',
    children: [
      {
        value: 'id',
        label: 'ID',
      },
      {
        value: 'code',
        label: '订单编号',
      },
      {
        value: 'qdjl',
        label: '渠道经理',
      },
      {
        value: 'amount',
        label: '订单总金额',
        type: 'number',
      },
    ],
  }, */,
  {
    value: 'startUser',
    label: '流程发起者',
    children: [
      {
        value: 'userId',
        label: '用户ID',
        type: 'userId',
      },
      {
        value: 'username',
        label: '用户账户',
      },
      {
        value: 'role',
        label: '角色',
        children: [
          {
            value: 'idList',
            label: 'ID集合',
            type: 'roleList',
          },
          {
            value: 'codeList',
            label: '编码集合',
            type: 'List',
          },
          {
            value: 'maxLevelCode',
            label: '角色编码（最大）',
          },
          {
            value: 'maxLevel',
            label: '级别（最大）',
            type: 'number',
          },
        ],
      },
      {
        value: 'orgId',
        label: '当前部门',
        type: 'orgId',
      },
      {
        value: 'orgCode',
        label: '当前部门编码',
      },
      {
        value: 'orgType',
        label: '当前部门类型',
      },
      {
        value: 'orgName',
        label: '当前部门名字',
      },
    ],
  },
  {
    value: 'currentUser',
    label: '任务处理者',
    children: [
      {
        value: 'userId',
        label: '用户ID',
        type: 'userId',
      },
      {
        value: 'username',
        label: '用户账户',
      },
      {
        value: 'role',
        label: '角色',
        children: [
          {
            value: 'idList',
            label: 'ID集合',
            type: 'roleList',
          },
          {
            value: 'codeList',
            label: '编码集合',
            type: 'List',
          },
          {
            value: 'maxLevelCode',
            label: '角色编码（最大）',
          },
          {
            value: 'maxLevel',
            label: '级别（最大）',
            type: 'number',
          },
        ],
      },
      {
        value: 'orgId',
        label: '当前部门',
        type: 'orgId',
      },
      {
        value: 'orgCode',
        label: '当前部门编码',
      },
      {
        value: 'orgType',
        label: '当前部门类型',
      },
      {
        value: 'orgName',
        label: '当前部门名字',
      },
    ],
  },
]

export const conditionMap = {
  varchar: [
    {
      // 条件名字
      name: '等于',
      // 表达式
      value: '{0}.equals( {1} )',
    },
    {
      name: '不等于',
      value: '!{0}.equals( {1} )',
    },
    {
      name: '为空',
      value: "{0} == '' || {0} == null ",
      notNeedParam: true,
    },
    {
      name: '不为空',
      value: "{0} != '' && {0} != null ",
      notNeedParam: true,
    },
    {
      name: '包含',
      value: '{0}.contains({1})',
    },
    {
      name: '不包含',
      value: '!{0}.contains({1})',
    },
    {
      name: '在之中',
      value: '{1}.contains({0})',
    },
    {
      name: '不在之中',
      value: '!{1}.contains({0})',
    },
  ],
  number: [
    {
      // 条件名字
      name: '等于',
      // 表达式
      value: '{0} == {1} ',
    },
    {
      name: '不等于',
      value: '{0} != {1} ',
    },
    {
      // 条件名字
      name: '大于',
      // 表达式
      value: '{0} > {1} ',
    },
    {
      // 条件名字
      name: '大于等于',
      value: '{0} >= {1} ',
    },
    {
      name: '小于',
      value: '{0} < {1} ',
    },
    {
      name: '小于等于',
      value: '{0} <= {1} ',
    },
    {
      name: '为空',
      value: "{0} == '' || {0} == null ",
      notNeedParam: true,
    },
    {
      name: '不为空',
      value: "{0} != '' && {0} != null ",
      notNeedParam: true,
    },
    {
      name: '包含',
      value: '{0}.contains({1})',
    },
    {
      name: '不包含',
      value: '!{0}.contains({1})',
    },
    {
      name: '在之中',
      value: '{1}.contains({0})',
    },
    {
      name: '不在之中',
      value: '!{1}.contains({0})',
    },
  ],
  roleList: [
    {
      name: '包含',
      value: '{0}.contains({1})',
    },
    {
      name: '不包含',
      value: '!{0}.contains({1})',
    },
  ],
  List: [
    {
      name: '包含',
      value: '{0}.contains({1})',
    },
    {
      name: '不包含',
      value: '!{0}.contains({1})',
    },
  ],
  date: [
    {
      name: '为空',
      value: "{0} == '' || {0} == null ",
      notNeedParam: true,
    },
    {
      name: '不为空',
      value: "{0} != '' && {0} != null ",
      notNeedParam: true,
    },
  ],
}

import Layout from '@vab/layouts/index.vue'
export default {
  path: '/org',
  name: 'ORG',
  component: Layout,
  meta: {
    title: '组织',
    icon: 'home-2-line',
    breadcrumbHidden: true,
  },
  children: [
    {
      path: 'user/userList',
      name: 'UserList',
      component: () => import('@/views/org/user/userList.vue'),
      meta: {
        title: '用户管理',
        icon: 'home-2-line',
      },
    },
    {
      path: 'user/userEdit',
      name: 'userEdit',
      component: () => import('@/views/org/user/userEdit.vue'),
      meta: {
        title: '编辑用户',
        icon: 'dashboard-line',
        noKeepAlive: true,
      },
    },
    {
      path: 'group/groupList',
      name: 'GroupList',
      component: () => import('@/views/org/group/groupList.vue'),
      meta: {
        title: '组织管理',
      },
    },
    {
      path: 'group/batchOperation',
      name: 'BatchOperation',
      component: () => import('@/views/org/group/batchOperation.vue'),
      meta: {
        title: '批量添加岗位用户',
      },
    },
    {
      path: 'group/batchAddExtGroupRel',
      name: 'BatchAddExtGroupRel',
      component: () => import('@/views/org/group/batchAddExtGroupRel.vue'),
      meta: {
        title: '批量分配角色权限',
      },
    },
    {
      path: 'group/groupUserList',
      name: 'GroupUserList',
      component: () => import('@/views/org/group/groupUserList.vue'),
      meta: {
        title: '组织人员管理',
        icon: 'grid-fill',
      },
    },
    {
      path: 'role/list',
      name: 'RoleList',
      component: () => import('@/views/org/role/roleList.vue'),
      meta: {
        title: '角色管理',
        icon: 'grid-fill',
      },
    },
    {
      path: 'role/edit',
      name: 'RoleEdit',
      component: () => import('@/views/org/role/roleEdit.vue'),
      meta: {
        title: '角色编辑',
        icon: 'grid-fill',
        noKeepAlive: true,
      },
    },
    {
      path: 'role/users',
      name: 'RoleUserList',
      component: () => import('@/views/org/role/roleUserList.vue'),
      meta: {
        title: '角色用户管理',
        icon: 'grid-fill',
      },
    },
    {
      path: 'role/dataPrivilegeGiven',
      name: 'RoleDataPrivilegeGiven',
      component: () => import('@/views/org/role/roleDataPrivilegeGiven.vue'),
      meta: {
        title: '分配数据权限',
        icon: 'grid-fill',
        noKeepAlive: true,
      },
    },
  ],
}

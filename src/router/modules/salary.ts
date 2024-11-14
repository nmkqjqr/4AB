import Layout from '@vab/layouts/index.vue'
export default {
  path: '/salary',
  name: 'SALARY',
  component: Layout,
  meta: {
    title: '系统管理',
    icon: 'home-2-line',
    breadcrumbHidden: true,
  },
  children: [
    {
      path: 'salaryRuleList',
      name: 'SalaryRuleList',
      component: () => import('@/views/salary/salaryRuleList.vue'),
      meta: {
        title: '薪酬科目列表',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'salaryRuleEdit',
      name: 'SalaryRuleEdit',
      component: () => import('@/views/salary/salaryRuleEdit.vue'),
      meta: {
        title: '薪酬科目编辑',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'salaryClassList',
      name: 'SalaryClassList',
      component: () => import('@/views/salary/salaryClassList.vue'),
      meta: {
        title: '薪酬体系列表',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'salaryClassEdit',
      name: 'SalaryClassEdit',
      component: () => import('@/views/salary/salaryClassEdit.vue'),
      meta: {
        title: '薪酬体系编辑',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'salaryManageList',
      name: 'SalaryManageList',
      component: () => import('@/views/salary/salaryManageList.vue'),
      meta: {
        title: '薪酬管理列表',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'salaryManageEdit',
      name: 'SalaryManageEdit',
      component: () => import('@/views/salary/salaryManageEdit.vue'),
      meta: {
        title: '薪酬管理编辑',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'salaryCalculateLogList',
      name: 'SalaryCalculateLogList',
      component: () => import('@/views/salary/salaryCalculateLogList.vue'),
      meta: {
        title: '薪酬计算列表',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'salaryCalculateLogDetail',
      name: 'SalaryCalculateLogDetail',
      component: () => import('@/views/salary/salaryCalculateLogDetail.vue'),
      meta: {
        title: '薪酬计算列表',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'attendanceLogEdit',
      name: 'AttendanceLogEdit',
      component: () => import('@/views/salary/attendanceLogEdit.vue'),
      meta: {
        title: '考勤明细页',
        icon: 'dashboard-line',
      },
    },
    {
      path: 'attendanceLogList',
      name: 'AttendanceLogList',
      component: () => import('@/views/salary/attendanceLogList.vue'),
      meta: {
        title: '考勤列表',
        icon: 'dashboard-line',
      },
    },
  ],
}

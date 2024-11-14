<template>
  <div
    v-loading="info.calculateIng"
    :element-loading-text="info.loadingText"
    style="width: 100%; height: 100%"
  >
  <el-container>
  <el-aside class="left-tree">
        <ab-dict-tree
          v-model="query['salaryManage.type$VEQ']"
          type-code="xcgllx"
          @node-click="searchResetPage()"
        />
      </el-aside>
      <el-main>
    <div class="comprehensive-table-container" style="margin-left: 20px">
      <div ref="titleForm">
        <el-row class="vab-query-form">
          <el-col class="top-panel" style="margin-top: 18px">
            <el-form
              ref="queryForm"
              :inline="true"
              label-width="90px"
              :model="query"
              @submit.prevent
            >
              <el-form-item label="用户名称" prop="salaryLog.userName$VLK">
                <el-input
                  v-model="query['salaryLog.userName$VLK']"
                  placeholder="请输入用户名"
                />
              </el-form-item>

              <el-form-item label="所属月份" prop="salaryLog.salary_month$VLK">
                <el-date-picker
                  v-model="query['salaryLog.salary_month$VLK']"
                  format="YYYY-MM"
                  placeholder="选择一个月份"
                  type="month"
                  value-format="YYYY-MM"
                />
              </el-form-item>

              <el-form-item label="审批状态" prop="salaryLog.status$VLK">
                <ab-select-tree
                  v-model="query['salaryLog.status$VLK']"
                  :has-root="false"
                  type-code="gztzt"
                />
              </el-form-item>

              <el-form-item>
                <el-button :icon="Search" type="primary" @click="search()">
                  查询
                </el-button>
                <el-button :icon="RefreshRight" @click="reset()">
                  重置
                </el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col class="left-panel">
            <el-button
              v-ab-btn-rights:salary_calculate
              :disabled="info.calculateIng"
              icon="Plus"
              style="margin-right: 8px"
              type="primary"
              @click="openSalaryCalculate(0)"
            >
              计算工资
            </el-button>
            <!--@click="sendCalculateLog('')"-->
            <el-button
              v-ab-btn-rights:salary_calculate
              :disabled="info.calculateIng"
              style="margin-right: 8px"
              type="primary"
              @click="openSalaryCalculate(1)"
            >
              一键推送工资条
            </el-button>
            <el-button
              v-ab-btn-rights:salary_calculate
              :disabled="info.calculateIng"
              style="margin-right: 8px"
              type="primary"
              @click="openSalaryCalculate(2)"
            >
              导出
            </el-button>
            <el-button
              v-ab-btn-rights:attendanceLog_del
              :disabled="!selectedData || selectedData.length == 0"
              type="primary"
              @click="
                delBySeletedIds(
                  salaryApi.batchUpdateStatusUrl,
                  '请确认将选中记录更新为【薪资已确认】状态吗？'
                )
              "
            >
              批量确认薪资
            </el-button>
          </el-col>
        </el-row>
      </div>

      <ab-table
        ref="abTable"
        v-model="selectedData"
        :checkable="true"
        :default-sort="{ order: 'desc', prop: 'update_time_' }"
        :height="tableHeight"
        :query-param="query"
        row-key="id"
        :url="salaryApi.salaryLogListUrl"
      >
        <ab-column label="用户名" min-width="130" prop="userName" fixed="left" />
        <ab-column label="工资所属月份" min-width="120" prop="salaryMonth" fixed="left" />
        <ab-column
          ab-text-formatter="1-计算错误-danger-dark|2-计算完成-warning-dark|3-员工确认中-draft-dark|4-薪资已确认-success-dark|"
          label="状态"
          min-width="138"
          prop="status"
        />

        <ab-column label="实发工资总额" min-width="120" prop="totalSalary" />
        <ab-column label="总额备注" min-width="100" prop="salaryRemarks" />
        <ab-column
          label="基本工资合计"
          min-width="120"
          prop="baseSalaryTotal"
        />
        <ab-column label="绩效" min-width="100" prop="performanceTotal" />
        <ab-column label="补贴/奖金" min-width="100" prop="subsidyTotal" />
        <ab-column label="扣款" min-width="100" prop="deductTotal" />
        <ab-column label="个税抵扣" min-width="90" prop="taxDeductTotal" />
        <ab-column label="个税" min-width="90" prop="taxTotal" />

        <ab-column label="补充值" min-width="100" prop="supplementValue" />
        <ab-column label="补充说明" min-width="100" prop="supplementary" />

        <ab-column
          ab-date-formatter="yyyy-MM-dd HH:mm"
          label="更新时间"
          min-width="150"
          prop="updateTime"
        />
        <ab-column ab-template="edit" fixed="right" label="操作" width="360" />
        <template #edit="{ scope }">
          <el-button
            v-if="scope.row.status == 1 || scope.row.status == 2"
            v-ab-btn-rights:salary_calculate
            :disabled="info.calculateIng"
            text
            type="primary"
            @click="salaryCalculate(scope.row.userId, scope.row.salaryMonth, 0)"
          >
            重新计算
          </el-button>
          <el-button
            v-if="scope.row.status == 2"
            v-ab-btn-rights:salary_calculate
            :disabled="info.calculateIng"
            text
            type="primary"
            @click="salaryCalculate(scope.row.userId, scope.row.salaryMonth, 1)"
          >
            推送工资条
          </el-button>
          <router-link
            v-ab-btn-rights:salaryCalculateLogDetail
            :to="{
              name: 'SalaryCalculateLogDetail',
              query: { id: scope.row.id },
            }"
          >
            <el-button text type="primary">详情</el-button>
          </router-link>
          <el-button
            v-if="
              scope.row.status == 1 ||
              scope.row.status == 2 ||
              scope.row.status == 3
            "
            v-ab-btn-rights:attendanceLog_del
            text
            type="primary"
            @click="
              sendAction(
                salaryApi.batchUpdateStatusUrl + scope.row.id,
                `确定把【 ${scope.row.userName}】${scope.row.salaryMonth} 月的工资条改为已确认状态吗?`
              )
            "
          >
            手动确认
          </el-button>
        </template>
      </ab-table>

      <el-dialog
        v-model="info.dialogVisible"
        :before-close="handleClose"
        :title="info.title"
        width="788px"
      >
        <el-form
          ref="formRef"
          label-suffix="："
          label-width="120px"
          :model="info.userType"
        >
          <el-form-item label="选择月份" placeholder="请选择要计算薪资的月份">
            <el-date-picker
              v-model="info.time"
              format="YYYY-MM"
              placeholder="选择一个月份"
              type="month"
              value-format="YYYY-MM"
            />
          </el-form-item>

          <el-form-item label="人员方式" prop="info.userType">
            <el-radio-group v-model="info.userType" class="clear">
              <el-radio-button label="all">全部人员</el-radio-button>
              <el-radio-button label="group">选择团队</el-radio-button>
              <el-radio-button label="person">选择人员</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="info.userType === 'group'"
            label="选择团队"
            prop="info.userGroup"
          >
            <ab-select-tree
              v-model="info.userGroup"
              :has-root="false"
              type-code="xcgllx"
            />
          </el-form-item>
          <el-form-item
            v-if="info.userType === 'person'"
            label="选择人员"
            prop="info.userIds"
          >
            <ab-cust-dialog
              dialog-key="xzxcglry"
              :extra-data="info.users"
              style="margin-bottom: 5px; margin-left: 8px"
              @ok="setUser"
            >
              选择用户
            </ab-cust-dialog>
            <el-tag
              v-for="user in info.users"
              :key="user.id"
              closable
              style="margin-bottom: 6px; margin-left: 6px"
              type="success"
              @close="removeUser(user, info)"
            >
              {{ user.name }}
            </el-tag>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button text @click="info.dialogVisible = false">取消</el-button>
            <el-button
              :disabled="info.calculateIng"
              type="primary"
              @click="salaryCalculate(null, null, info.actionType)"
            >
              {{ info.title }}
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
      </el-main>
  </el-container>
  </div>
</template>

<script lang="ts">
  import { reactive, defineComponent, getCurrentInstance } from 'vue'
  import { abTableMix, salaryApi, abTools,abDictTree } from '~/agilebpm'
  import {
    Delete,
    Edit,
    Search,
    Plus,
    RefreshRight,
  } from '@element-plus/icons-vue'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import * as abUtil from '~/agilebpm/utils/ab-util'

  export default defineComponent({
    name: 'SalaryLogList',
    components: { abDictTree },
    mixins: [abTableMix],

    setup() {
      // 查询条件定义，如果ts 需要定义所有参数，这里覆盖父类，不是的话可以不用设置，父类已经定义了query 对象
      const query = reactive({
        'salaryLog.userName$VLK': '',
        'salaryLog.salary_month$VLK': '',
        'salaryManage.type$VEQ': '',
      })

      const info: any = reactive({
        calculateIng: false,
        dialogVisible: false,
        time: '',
        userType: 'all', //计算用户类型
        userGroup: '',
        userIds: '', //具体id
        users: [], //对话框选择的用户
        loadingText: '',
        actionType: 0, //动作类型0 计算薪资 1推送薪资
        title: '',
        btnName: '',
      })

      let timer = null as any

      const setUser = (users: any, row: any) => {
        users.forEach((user: any) => {
          let b = false
          info.users.forEach((u: any) => {
            if (u.id == user.userId) {
              b = true
            }
          })
          if (b) return

          row.push({
            id: user.userId,
            name: user.userName,
          })
        })
      }
      const calaryCalculateKey = 'calaryCalculateKey'
      const sendCalculateLogKey = 'sendCalculateLogKey'
      const removeUser = (user: any, row: any) => {
        abUtil.Arrays.remove(user, row.users)
      }
      // @ts-ignore
      const { proxy } = getCurrentInstance()
      const openSalaryCalculate = (actionType: number) => {
        info.userType = 'all'
        info.time = null
        info.dialogVisible = true
        info.userGroup = ''
        info.userIds = ''
        info.users = []
        info.actionType = actionType
        if (actionType == 0) {
          info.title = '计算工资配置'
          info.btnName = '开始计算'
        }
        if (actionType == 1) {
          info.title = '推送工资条配置'
          info.btnName = '开始推送'
        }
        if (actionType == 2) {
          info.title = '导出工资条配置'
          info.btnName = '导出'
        }
      }

      const salaryExport = () => {
        if (!info.time) {
          ElMessage.error('请选择一个导出薪资的月份')
          return
        }
        if (info.userType == 'group' && !info.userGroup) {
          ElMessage.error('请选择一个团队')
          return
        }
        if (info.userType == 'person' && info.users.length == 0) {
          ElMessage.error('请选择具体人员')
          return
        }
        const userIdStr = info.users.map((a: any) => a.id).join(',')
        salaryApi
          .salaryExport(info.time, info.userType, info.userGroup, userIdStr)
          .then((result: any) => {
            abTools.downImgFile(`${info.time}月工资发放表.xls`, result)
          })
      }

      const salaryCalculate = (userId: any, salaryMonth: any, type: number) => {
        if (type == 2) {
          salaryExport()
          info.dialogVisible = false
          return
        }
        info.actionType = type != null ? type : info.actionType
        let actionTypeStr = '计算'
        if (info.actionType == 1) {
          actionTypeStr = '推送'
        }
        if (!info.time && !salaryMonth) {
          ElMessage.error(`请选择一个${actionTypeStr}薪资的月份`)
          return
        }
        if (info.userType == 'group' && !info.userGroup && !userId) {
          ElMessage.error('请选择一个团队')
          return
        }
        if (info.userType == 'person' && info.users.length == 0 && !userId) {
          ElMessage.error('请选择具体人员')
          return
        }

        const loadingTextTime = info.time ? info.time : salaryMonth
        info.loadingText = `正在 ${actionTypeStr}${loadingTextTime} 月份薪资，请稍等...`
        let userIdStr = info.users.map((a: any) => a.id).join(',')
        if (userId) {
          userIdStr = userId
          info.userType = 'person'
        }
        const at = info.actionType
        info.calculateIng = true
        salaryApi
          .salaryCalculate(
            userId ? salaryMonth : info.time,
            info.userType,
            info.userGroup,
            userIdStr,
            at
          )
          .then((result: any) => {
            if (result.isOk && result.data) {
              //if (result.data && result.data === '全部计算成功!') {
              localStorage.setItem(calaryCalculateKey, result.data)
            } else {
              ElMessage.error(result.msg)
            }
            info.dialogVisible = false
          })
          .catch(() => {
            info.calculateIng = false
          })
      }

      const calculateIngFn = () => {
        const taskId = localStorage.getItem(calaryCalculateKey)
        const sendKey = localStorage.getItem(sendCalculateLogKey)

        if (taskId) {
          queryStatus(taskId, calaryCalculateKey)
        } else if (sendKey) {
          queryStatus(sendKey, sendCalculateLogKey)
        } else {
          info.calculateIng = false
        }
      }

      const queryStatus = (id: any, type: any) => {
        info.calculateIng = true
        salaryApi.getSalaryCalculateStatus(id).then((result: any) => {
          if (result.isOk && result.data) {
            if (
              result.data === '全部计算成功!' ||
              result.data === '全部推送成功！'
            ) {
              localStorage.removeItem(type)
              ElMessage.success(result.data)
              proxy.search()
              info.calculateIng = false
            } else if (result.data != 'runing') {
              localStorage.removeItem(type)
              ElMessage.error(result.data)
              proxy.search()
              info.calculateIng = false
            }
          }
        })
      }
      onMounted(() => {
        calculateIngFn()
        timer = setInterval(() => {
          calculateIngFn()
        }, 2800)
      })

      onBeforeUnmount(() => {
        clearInterval(timer)
      })

      return {
        query,
        Delete,
        Edit,
        Search,
        Plus,
        salaryApi,
        RefreshRight,
        salaryCalculate,
        openSalaryCalculate,
        removeUser,
        setUser,
        info,
        salaryExport,
      }
    },
  })
</script>

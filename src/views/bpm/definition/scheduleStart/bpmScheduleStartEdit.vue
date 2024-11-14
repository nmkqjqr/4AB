<template>
  <el-container class="layout-container-demo">
    <el-header height="80px">
      <ab-save
        back-name="BpmScheduleStartList"
        :before-save-fn="beforeSaveFn"
        :form-ref="formRef"
        :save-data="info.bpmScheduleStart"
        :url="bpmApi.scheduleStart.bpmScheduleStartSaveUrl"
      />
      <ab-load
        v-model="info.bpmScheduleStart"
        :url="bpmApi.scheduleStart.bpmScheduleStartGetUrl"
        @after-fn="abLoadAfterFn"
      />
    </el-header>
    <el-divider class="dividermar" />
    <el-main>
      <el-form
        ref="formRef"
        label-suffix="："
        label-width="180px"
        :model="info.bpmScheduleStart"
        :status-icon="false"
      >
        <el-form-item
          :label="$abT('page.wfDesign.wfName', '流程名称')"
          prop="defKey"
          :rules="[{ required: true, message: $abT('rules.required', '必填') }]"
        >
          <el-tag
            v-if="info.bpmScheduleStart.defKey"
            style="margin-right: 10px"
          >
            {{ info.bpmScheduleStart.defName }}
          </el-tag>
          <ab-cust-dialog
            dialog-key="bpmDefinitionSelector"
            :dialog-setting="{ multiple: 0 }"
            type="primary"
            @ok="bpmDefinitionSelectorOk"
          >
            {{ $abT('bpm.office.selectProcess', '请选择流程') }}
          </ab-cust-dialog>
        </el-form-item>
        <el-form-item
          :label="$abT('page.common.desc', '描述')"
          prop="desc"
          :rules="[{ required: true, message: $abT('rules.required', '必填') }]"
        >
          <el-input v-model="info.bpmScheduleStart.desc" />
        </el-form-item>
        <el-form-item :label="$abT('page.common.status', '状态')" prop="status">
          <el-radio-group v-model="info.bpmScheduleStart.status" size="large">
            <el-radio-button
              v-for="item in systemEmums.bpmScheduleStartStatus"
              :key="item.key"
              :label="item.key"
            >
              {{ item.desc }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          :label="$abT('page.flowTimingStart.taskType', '任务类型')"
          prop="taskType"
        >
          <el-radio-group
            v-model="info.bpmScheduleStart.taskType"
            size="large"
            @change="switchTaskType"
          >
            <el-radio-button
              v-for="item in systemEmums.bpmScheduleStartTaskType"
              :key="item.key"
              :label="item.key"
            >
              {{ item.desc }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          v-if="info.bpmScheduleStart.taskType === 'once'"
          :label="
            $abT('page.flowTimingStart.executionTime', '执行时间/Cron表达式')
          "
          prop="nextTriggerTime"
          :rules="[{ required: true, message: $abT('rules.required', '必填') }]"
        >
          <el-date-picker
            v-model="info.bpmScheduleStart.nextTriggerTime"
            :placeholder="
              $abT(
                'page.flowTimingStart.enterExecutionTime	',
                '请输入执行时间/Cron表达式'
              )
            "
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>

        <!-- 周期任务 :Begin -->
        <el-form-item
          v-if="info.bpmScheduleStart.taskType === 'recycle'"
          :label="$abT('page.flowTimingStart.onWeekdays', '工作日执行')"
          prop="onlyWorkday"
        >
          <el-switch
            v-model="info.bpmScheduleStart.onlyWorkday"
            :active-value="1"
            :inactive-value="0"
            :active-text="$abT('page.common.yes', '是')"
            :inactive-text="$abT('page.common.no', '否')"
            inline-prompt
          />
        </el-form-item>
        <el-form-item
          v-if="info.bpmScheduleStart.taskType === 'recycle'"
          :label="$abT('page.flowTimingStart.cronExpression', 'Cron表达式')"
          prop="cronExp"
          :rules="[{ required: true, message: $abT('rules.required', '必填') }]"
        >
          <el-input v-model="info.bpmScheduleStart.cronExp" />
          <el-popover placement="right" trigger="click" :width="650">
            <template #reference>
              <el-button
                :icon="Edit"
                style="margin-right: 16px"
                type="primary"
              />
            </template>
            <crontab v-model="info.bpmScheduleStart.cronExp" />
          </el-popover>
        </el-form-item>
        <el-form-item
          v-if="info.bpmScheduleStart.taskType === 'recycle'"
          :label="$abT('page.flowTimingStart.taskCycle', '任务周期')"
          prop="repeatNumber"
        >
          <template #label>
            <span>
              {{ $abT('page.flowTimingStart.taskCycle', '任务周期') }}
              <el-tooltip
                :content="
                  $abT(
                    'page.flowTimingStart.taskCycleMsg',
                    '用于指定周期内任务执行次数，达到指定次数后状态将会标记为已完成；-1：表示无限制'
                  )
                "
                effect="dark"
                placement="right"
              >
                <el-icon :size="20" style="vertical-align: middle">
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
            </span>
          </template>
          <el-input-number
            v-model="info.bpmScheduleStart.repeatNumber"
            :min="-1"
          />
        </el-form-item>
        <!-- 周期任务 :End -->
        <el-form-item
          :label="$abT('page.flowTimingStart.retryCount', '出错重试次数')"
          prop="maxRetryTimes"
        >
          <el-input-number
            v-model="info.bpmScheduleStart.maxRetryTimes"
            :min="0"
          />
        </el-form-item>
        <el-form-item
          :label="$abT('page.common.Initiator', '发起人')"
          prop="startUsername"
          :rules="[{ required: true, message: $abT('rules.required', '必填') }]"
        >
          <ab-cust-dialog
            dialog-key="userSelector"
            :dialog-setting="{ multiple: 1 }"
            type="primary"
            @ok="userSelectorOk"
          >
            {{ $abT('page.groupList.selectUser', '选择用户') }}
          </ab-cust-dialog>
          <el-space v-if="info.startUserList" style="margin-left: 10px" wrap>
            <el-tag
              v-for="(item, index) in info.startUserList"
              :key="item.account"
              closable
              @close="removeStartUser(index)"
            >
              {{ item.fullname }}
            </el-tag>
          </el-space>
        </el-form-item>
        <el-form-item
          :label="$abT('page.flowTimingStart.initiatorOrg', '发起人组织')"
          prop="startOrgCode"
        >
          <ab-cust-dialog
            dialog-key="orgSelector"
            :dialog-setting="{ multiple: 0 }"
            type="primary"
            @ok="orgSelectorOk"
          >
            {{ $abT('page.groupList.selectOrg', '选择组织') }}
          </ab-cust-dialog>
          <el-tag
            v-if="info.bpmScheduleStart.startOrgCode"
            closable
            style="margin-left: 10px"
            @close="info.bpmScheduleStart.startOrgCode = ''"
          >
            {{ info.bpmScheduleStart.startOrgName }}
          </el-tag>
        </el-form-item>
        <el-form-item
          :label="$abT('page.flowTimingStart.initiatorOpinions', '发起意见')"
          prop="startOpinion"
        >
          <el-input v-model="info.bpmScheduleStart.startOpinion" />
        </el-form-item>
      </el-form>
      <el-divider content-position="left">
        {{ $abT('page.flowTimingStart.defaultData', '启动默认数据') }}
      </el-divider>
      <el-row>
        <el-col :span="24">
          <el-tabs type="border-card">
            <el-tab-pane
              :label="$abT('page.flowTimingStart.launchForm', '启动表单')"
            >
              <ab-url-form
                v-if="info.startFlowData?.bpmForm?.type === 'url'"
                ref="bpmFormRef"
                :bpm-form="info.startFlowData.bpmForm"
              />
              <cust-form
                v-if="info.startFlowData?.bpmForm?.type === 'inner'"
                ref="bpmFormRef"
                :form-data="info.innerFormData"
              />
            </el-tab-pane>

            <!-- 流程变量 :Begin -->
            <el-tab-pane
              :label="$abT('page.flowTimingStart.ProcessVariables', '流程变量')"
            >
              <el-form ref="flowVariableFormRef" :model="info.flowVariables">
                <el-table :data="info.flowVariables" table-layout="fixed">
                  <el-table-column width="60">
                    <template #default="scope">
                      <el-row style="padding-bottom: 18px">
                        <el-button
                          circle
                          :icon="Delete"
                          type="danger"
                          @click="info.flowVariables.splice(scope.$index, 1)"
                        />
                      </el-row>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$abT('page.flowTimingStart.fieldName', '字段名')"
                    prop="key"
                  >
                    <template #default="scope">
                      <el-form-item
                        :prop="scope.$index + '.key'"
                        :rules="[
                          {
                            required: true,
                            message: $abT('rules.required', '必填'),
                            trigger: 'blur',
                          },
                        ]"
                      >
                        <el-input v-model="scope.row.key" />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$abT('page.flowTimingStart.fieldDesc', '字段描述')"
                    prop="desc"
                  >
                    <template #default="scope">
                      <el-row style="padding-bottom: 18px">
                        <el-input v-model="scope.row.desc" />
                      </el-row>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$abT('page.flowTimingStart.fieldType', '字段类型')"
                    prop="varType"
                    width="150"
                  >
                    <template #default="scope">
                      <el-row style="padding-bottom: 18px">
                        <el-select
                          v-model="scope.row.varType"
                          @change="scope.row.defaultValue = null"
                        >
                          <el-option
                            v-for="dataType in systemEmums.flowVariableDataTypes"
                            :key="dataType.type"
                            :label="dataType.desc"
                            :value="dataType.type"
                          />
                        </el-select>
                      </el-row>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$abT('page.flowTimingStart.fieldValue', '字段值')"
                    prop="defaultValue"
                  >
                    <template #default="scope">
                      <el-form-item
                        :prop="scope.$index + '.defaultValue'"
                        :rules="[
                          {
                            required: true,
                            message: $abT('rules.required', '必填'),
                            trigger: 'blur',
                          },
                        ]"
                      >
                        <el-col
                          v-if="scope.row.varType === 'varchar'"
                          :span="24"
                        >
                          <el-input v-model="scope.row.defaultValue" />
                        </el-col>
                        <el-col
                          v-else-if="scope.row.varType === 'double'"
                          :span="24"
                        >
                          <el-input-number v-model="scope.row.defaultValue" />
                        </el-col>
                        <el-col
                          v-else-if="scope.row.varType === 'bool'"
                          :span="24"
                        >
                          <el-switch
                            v-model="scope.row.defaultValue"
                            :active-text="$abT('page.common.true', '真')"
                            :inactive-text="$abT('page.common.false', '假')"
                            inline-prompt
                          />
                        </el-col>
                        <el-col
                          v-else-if="scope.row.varType === 'date'"
                          :span="24"
                        >
                          <el-date-picker
                            v-model="scope.row.defaultValue"
                            :placeholder="
                              $abT(
                                'page.flowTimingStart.selectDataTime',
                                '请选择日期时间'
                              )
                            "
                            type="datetime"
                            value-format="YYYY-MM-DD HH:mm:ss"
                          />
                        </el-col>
                      </el-form-item>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form>
              <el-button
                class="mt-6"
                style="width: 100%"
                @click="addFlowVariable"
              >
                {{ $abT('page.common.add', '添加') }}
              </el-button>
            </el-tab-pane>
            <!-- 流程变量 :End -->

            <!-- Groovy脚本：Begin-->
            <el-tab-pane
              :label="$abT('page.flowTimingStart.groovyScript', 'Groovy脚本')"
            >
              <el-collapse>
                <el-collapse-item
                  :title="
                    $abT('page.flowTimingStart.referenceExample', '参考示例')
                  "
                >
                  <h3>
                    {{
                      $abT('page.flowTimingStart.builtVariables', '内置变量')
                    }}
                  </h3>
                  <h4>com.dstz.bpm.engine.action.ActionCmd actionCmd</h4>
                  <h5>{{ $abT('page.flowTimingStart.Code', '代码') }}</h5>
                  <pre
                    style="
                      padding: 18px 24px;
                      margin-bottom: 25px;
                      font-size: 12px;
                      line-height: 1.8;
                      background-color: #fafafa;
                      border: 1px solid #eaeefb;
                      border-radius: 4px;
                    "
                  >
// 设置业务数据
def orderData = actionCmd.getData().computeIfAbsent("order", k -> new HashMap&lt;&gt;())
orderData['orderNo'] = "xxxx"
orderData['createTime'] = new Date()

// 设置流程变量
actionCmd.getPresetVariable()['orderNo'] = "xxxx"

// 设置跳转节点
actionCmd.setPresetDestination("UserTask1")

// 设置节点候选人
actionCmd.setIdentityMap("UserTask1", [new com.dstz.base.common.identityconvert.SysIdentity("1", "管理员", com.dstz.base.common.enums.IdentityType.USER.getKey())])

// 设置关联业务ID
actionCmd.setBizId("xxxxxx")

// 设置意见
actionCmd.setOpinion("流程定时启动")
</pre
                  >
                </el-collapse-item>
              </el-collapse>
              <codemirror
                v-model="info.bpmScheduleStart.script"
                :autofocus="true"
                :extensions="[javascript()]"
                :indent-with-tab="true"
                placeholder=""
                :style="{
                  height: `100%`,
                  minHeight: `200px`,
                  border: `1px solid #e4e7ed`,
                  width: '100%',
                }"
              />
            </el-tab-pane>
            <!-- Groovy脚本：End -->
          </el-tabs>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
  import { FormInstance } from 'element-plus'
  import { Edit, Delete, QuestionFilled } from '@element-plus/icons-vue'
  import Crontab from '@/views/sys/crontab/components/Crontab/index.vue'
  import {
    abForm as custForm,
    abUrlForm,
    bpmTools,
    bpmApi,
    abUtil,
    bizApi,
    sysApi,
  } from '~/agilebpm'

  import { Codemirror } from 'vue-codemirror'
  import { javascript } from '@codemirror/lang-javascript'

  abUtil.checkIsPublicProject()

  const formRef = ref<FormInstance>()

  const flowVariableFormRef = ref<FormInstance>()

  // url表单 或 在线表单引用
  const bpmFormRef = ref()

  const vueContext = getCurrentInstance()

  const info = reactive<{
    flowVariables: BpmVariable[]
    innerFormData: any
    bpmScheduleStart: BpmScheduleStart
    startFlowData: any
    startUserList: any[]
  }>({
    flowVariables: [],
    innerFormData: {
      html: '',
    },
    bpmScheduleStart: {
      taskType: 'recycle',
      cronExp: '',
      status: 'disabled',
      maxRetryTimes: 0,
      repeatNumber: -1,
    },
    // 启动流程数据
    startFlowData: {},
    startUserList: [],
  })

  // 系统枚举
  const systemEmums = reactive<{
    flowVariableDataTypes: any[]
    bpmScheduleStartTaskType: any[]
    bpmScheduleStartStatus: any[]
    initLoad(): void
  }>({
    // 流程变量数据类型
    flowVariableDataTypes: [],
    // 定时启动任务类型
    bpmScheduleStartTaskType: [],
    // 定时启动状态
    bpmScheduleStartStatus: [],
    // 初始化加载
    initLoad() {
      sysApi.tools
        .getEnum('com.dstz.base.common.enums.DataType', true, 'type')
        .then(({ data }) => (systemEmums.flowVariableDataTypes = data))

      sysApi.tools
        .getEnum('com.dstz.bpm.api.enums.BpmScheduleStartTaskType', true, 'key')
        .then(({ data }) => (systemEmums.bpmScheduleStartTaskType = data))

      sysApi.tools
        .getEnum('com.dstz.bpm.api.enums.BpmScheduleStartStatus', true, 'key')
        .then(({ data }) => (systemEmums.bpmScheduleStartStatus = data))
    },
  })

  onMounted(() => {
    systemEmums.initLoad()
  })

  async function fetchStartFlowData(defKey: string) {
    const { data: startFlowData } = await bpmApi.bpmData.getStartFlowData(
      defKey
    )
    info.startFlowData = startFlowData
    if (
      startFlowData.bpmForm.type === 'inner' &&
      info.bpmScheduleStart.bizData
    ) {
      startFlowData.innerFormData.data = JSON.parse(
        info.bpmScheduleStart.bizData
      )
    }
    bpmTools.initBpmDataAndFormData(
      startFlowData,
      vueContext,
      {} as BpmData,
      info.innerFormData
    )
  }

  /**
   * 用户选择对话框确定操作
   * @param dataList 数据列表
   */
  function userSelectorOk(dataList: any[]) {
    if (dataList && dataList.length) {
      const startUserList = []
      for (const item of dataList) {
        startUserList.push({
          account: item.account,
          fullname: item.name,
        })
      }
      info.startUserList = startUserList
    }
    formRef.value?.validateField('startUsername')
  }

  /**
   * 移除发起用户
   *
   * @param index 索引
   */
  function removeStartUser(index: number) {
    abUtil.Arrays.del(index, info.startUserList)
    formRef.value?.validateField('startUsername')
  }

  /**
   * 组织选择对话框确定操作
   * @param dataList 数据列表
   */
  function orgSelectorOk(dataList: any[]) {
    if (dataList && dataList.length) {
      const { key, name } = dataList[0]
      info.bpmScheduleStart.startOrgCode = key
      info.bpmScheduleStart.startOrgName = name
    }
    formRef.value?.validateField('startOrgCode')
  }

  /**
   * 流程定义选择对话框器确定操作
   *
   * @param dataList 数据列表
   */
  function bpmDefinitionSelectorOk(dataList: any[]) {
    if (dataList && dataList.length) {
      const { key, name } = dataList[0]
      info.bpmScheduleStart.defKey = key
      info.bpmScheduleStart.defName = name
      info.bpmScheduleStart.bizData = ''
      fetchStartFlowData(key)
    }
    formRef.value?.validateField('defKey')
  }

  function addFlowVariable() {
    if (!info.flowVariables) {
      info.flowVariables = []
    }
    info.flowVariables.push({
      varType: 'varchar',
      key: '',
      defaultValue: '',
      desc: '',
    } as BpmVariable)
  }

  /**
   * 保存前执行函数
   */
  async function beforeSaveFn() {
    const flowVariableFormValid = await flowVariableFormRef!.value?.validate()
    // 校验表单
    if (!flowVariableFormValid) return false
    // 获取表单数据
    const formData = await bpmFormRef!.value.getData(false)

    const bpmScheduleStart = info.bpmScheduleStart

    // 表单数据转换为字符串
    bpmScheduleStart.bizData = JSON.stringify(formData)
    // 流程变量配置转换为字符串
    bpmScheduleStart.flowVariable = JSON.stringify(info.flowVariables)
    if (info.startUserList) {
      // 发起人用户名
      bpmScheduleStart.startUsername = info.startUserList
        .map((ele) => ele.account)
        .join(',')
      // 发起人姓名
      bpmScheduleStart.startFullname = info.startUserList
        .map((item) => item.fullname)
        .join(',')
    }
    return true
  }

  /**
   * ab-load 加载后回掉函数
   *
   * @param data 数据
   */
  function abLoadAfterFn(data: BpmScheduleStart) {
    if (data.startUsername) {
      bizApi.customDialog
        .getDialogDataList('userSelector', {
          currentPage: 1,
          pageSize: 1000,
          queryParam: { account$VIN: data.startUsername },
        })
        .then(({ data: dataList }) => {
          const startUserList = []
          for (const item of dataList) {
            startUserList.push({ account: item.account, fullname: item.name })
          }
          info.startUserList = startUserList
        })
    }
    if (data.defKey) fetchStartFlowData(data.defKey)
    if (data.flowVariable) info.flowVariables = JSON.parse(data.flowVariable)
  }

  /**
   * 切换任务类型
   */
  function switchTaskType() {
    if (info.bpmScheduleStart.taskType === 'once') {
      info.bpmScheduleStart.cronExp = ''
      info.bpmScheduleStart.nextTriggerTime = ''
      info.bpmScheduleStart.onlyWorkday = 0
      info.bpmScheduleStart.maxRetryTimes = -1
      info.bpmScheduleStart.repeatNumber = -1
    } else if (info.bpmScheduleStart.taskType === 'recycle') {
      info.bpmScheduleStart.nextTriggerTime = ''
    }
  }
</script>

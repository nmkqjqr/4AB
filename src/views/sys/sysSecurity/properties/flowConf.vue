<template>
  <el-dialog
    v-model="props.showDialog"
    title="流程全局配置"
    width="50%"
    draggable="true"
    overflow="true"
    @close="closeFn(false)"
  >
    <el-form
      ref="ruleFormRef"
      label-suffix="："
      label-width="230px"
      :model="info.data"
      :status-icon="false"
    >
      <el-form-item
        label="流程定时启动任务间隔"
        prop="bpmScheduleStartTaskInterval"
        :rules="[{ required: true, message: '必填' }]"
      >
        <el-input-number
          v-model="info.data.bpmScheduleStartTaskInterval"
          :max="999999"
          :min="0"
        />
        <el-tooltip
          class="box-item"
          content="定时计划中流程定时启动任务间隔，单位（分钟），默认10分钟"
          effect="dark"
          placement="right"
        >
          <el-icon size="14" style="margin-left: 6px">
            <InfoFilled />
          </el-icon>
        </el-tooltip>
      </el-form-item>

      <el-form-item
        label="催办最大重试次数"
        prop="reminder_max_retries"
        :rules="[{ required: true, message: '必填' }]"
      >
        <el-input-number
          v-model="info.data.reminder_max_retries"
          :max="999999"
          :min="0"
        />
        <el-tooltip
          class="box-item"
          content="如果催办操作失败重新尝试催办的次数(并非流程设计中的催办次数)，默认5次"
          effect="dark"
          placement="right"
        >
          <el-icon size="14" style="margin-left: 6px">
            <InfoFilled />
          </el-icon>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="连续处理任务" prop="doTaskSuccessional">
        <el-switch
          v-model="info.data.doTaskSuccessional"
          active-text="开启"
          :active-value="true"
          inactive-text="关闭"
          :inactive-value="false"
        />
        <el-tooltip
          class="box-item"
          content="在任务处理页面当前任务下面一个节点还是自己任务时，点击同意按钮会直接加载出下一个节点处理页面 而非跳转到待办列表，默认是 true"
          effect="dark"
          placement="right"
        >
          <el-icon size="14" style="margin-left: 6px">
            <InfoFilled />
          </el-icon>
        </el-tooltip>
      </el-form-item>

      <el-form-item
        label="任务删除是否推送消息"
        prop="task_remove_message_push"
      >
        <el-switch
          v-model="info.data.task_remove_message_push"
          active-text="开启"
          :active-value="true"
          inactive-text="关闭"
          :inactive-value="false"
        />
        <el-tooltip
          class="box-item"
          content="任务删除是否推送消息，默认是不推送（false）"
          effect="dark"
          placement="right"
        >
          <el-icon size="14" style="margin-left: 6px">
            <InfoFilled />
          </el-icon>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="流程非默认按钮" prop="bpmNotDefaultButtonsList">
        <el-checkbox-group v-model="info.bpmNotDefaultButtonsList">
          <el-checkbox
            v-for="item in info.ActionType"
            :key="item.key"
            :label="item.key"
          >
            {{ item.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item
        label="任务默认耗时(小时)"
        prop="taskDefaultDurationHour"
        :rules="[{ required: true, message: '必填' }]"
      >
        <el-input-number
          v-model="info.data.taskDefaultDurationHour"
          :max="999999"
          :min="0"
        />
        <el-tooltip
          class="box-item"
          content="任务默认耗时，单位小时，用来评估流程节点预计完成时间，默认是24小时"
          effect="dark"
          placement="right"
        >
          <el-icon size="14" style="margin-left: 6px">
            <InfoFilled />
          </el-icon>
        </el-tooltip>
      </el-form-item>

      <el-form-item
        label="流程左侧树统计分类数据开关"
        prop="flowLeftTreeTypeSwitch"
      >
        <el-switch
          v-model="info.data.flowLeftTreeTypeSwitch"
          active-text="开启"
          :active-value="true"
          inactive-text="关闭"
          :inactive-value="false"
        />
        <el-tooltip
          class="box-item"
          content="待办，申请历史，办理历史，左侧分离树，是否展示每个分类下的数量"
          effect="dark"
          placement="right"
        >
          <el-icon size="14" style="margin-left: 6px">
            <InfoFilled />
          </el-icon>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="每日任务提醒" prop="taskRemind">
        <el-switch
          v-model="info.data.taskRemind"
          active-text="开启"
          :active-value="true"
          inactive-text="关闭"
          :inactive-value="false"
        />
        <el-tooltip
          class="box-item"
          content="可以设置在某个时间提醒用户剩余代办任务统计"
          effect="dark"
          placement="right"
        >
          <el-icon size="14" style="margin-left: 6px">
            <InfoFilled />
          </el-icon>
        </el-tooltip>
      </el-form-item>
      <el-form-item
        v-if="info.data.taskRemind == true"
        label="任务提醒时间"
        prop="taskRemindTime"
        :rules="[
              {
                required: info.data.taskRemind == true ? true : false,
                message: '必填',
              },
            ]"
      >
        <el-time-select
          v-model="info.data.taskRemindTime"
          end="20:00"
          start="07:00"
          step="00:01"
        />
      </el-form-item>
      <el-form-item
        v-if="info.data.taskRemind == true"
        label="任务提醒方式"
        prop="taskRemindMsgType"
      >
        <ab-msg-type v-model="info.data.msgType" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeFn(false)">取消</el-button>
        <el-button @click="resetForm()">重置</el-button>
        <el-button type="primary" @click="onSubmit(ruleFormRef)">提交</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { abTools, sysApi } from '~/agilebpm'
import { Edit, Back, Plus } from '@element-plus/icons-vue'
import { abRichEditor, abUtil } from '~/agilebpm'
import { Codemirror } from 'vue-codemirror'
import { number } from 'echarts'
import { ElMessage, FormInstance } from 'element-plus'
import { abMsgType } from '~/agilebpm'

const ruleFormRef = ref<FormInstance>()

//引入 当前实例
const { proxy } = abTools.useCurrentInstance()
const id = proxy.$route.params.id

const props = defineProps({
  showDialog :{
    type: Boolean,
    required: true,
    default:false,
  },
  modelValue :{
    type: Object,
    required: true,
  }
})


const initData = {
  bpmScheduleStartTaskInterval: 10,
  reminder_max_retries: 5,
  doTaskSuccessional: true,
  task_remove_message_push: false,
  bpmNotDefaultButtons:
    'oppose,reject2Start,custMultiExecution,addSign,manualEnd,skip',
  bpmNotDefaultButtonsList: [
    'oppose',
    'reject2Start',
    'custMultiExecution',
    'addSign',
    'manualEnd',
    'skip',
  ],
  taskDefaultDurationHour: 24,
  flowLeftTreeTypeSwitch: true,
  taskRemind: false,
  taskRemindTime: '09:00',
  cronData: {
    jobKey: 'flowConfTaskJob',
    // 执行器类型：bean
    executorType: 'bean',
    // 执行器
    executor: 'bpmTaskServiceImpl@taskStatisticsSendMsg',
    // 是否启用
    enable: 1,
    // 执行器参数
    executorParams: '',
    // cron表达式
    cron: '',
    // 描述
    description: '每日任务提醒自动生成任务',
    // 分类
    typeCode: 'lcxg',
  },
}

const code = 'flowConf'
const info: any = reactive({
  id: '',
  code: code,
  isEnable: 1,
  data: {},
  ActionType: [],
  bpmNotDefaultButtonsList: [],
  cronData: {},
})

sysApi.tools
  .getEnum('com.dstz.bpm.api.enums.ActionType', true)
  .then((resp) => {
    info.ActionType = resp.data
  })

//初始化数据
const initTableData = () => {
  sysApi.configuration.getSysConfig(code).then(({ data }) => {
    if (!data) {
      //初始化值
      info.data = abUtil.clone(initData)
      info.cronData = initData.cronData
      info.bpmNotDefaultButtonsList = initData.bpmNotDefaultButtons.split(',')
    } else {
      info.data = JSON.parse(data.json)
      info.bpmNotDefaultButtonsList =
        info.data.bpmNotDefaultButtons.split(',')
      info.id = data.id
      info.isEnable = data.isEnable
      //加载定时卡片数据
      if (info.data.crontabId) {
        sysApi.crontab.getCrontab(info.data.crontabId).then((res: any) => {
          if (res.data) {
            info.cronData = res.data
          } else {
            info.cronData = initData.cronData
          }
        })
      } else {
        info.cronData = initData.cronData
      }
    }
  })
}
initTableData()

const emit = defineEmits([
  'closeFn',
])

const closeFn = (flg : any) => {
  emit('closeFn',flg)
}

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (info.data.taskRemind == true && !info.data.msgType) {
        ElMessage.error('请至少选择一种消息类型!')
        return
      }
      info.data.bpmNotDefaultButtons = info.bpmNotDefaultButtonsList.join(',')
      const param = {
        id: info.id,
        code: info.code,
        isEnable: info.isEnable,
        json: JSON.stringify(info.data),
      }

      const times = info.data.taskRemindTime.split(':')
      debugger
      const min = times[1]
      const hour = times[0]

      const blank = ' '
      const cronStr = `0 ${min}${blank}${hour} ? * MON-FRI`
      info.cronData.cron = cronStr
      info.cronData.enable = info.data.taskRemind == true ? 1 : 0

      sysApi.crontab.crontabSaveOrUpdate(info.cronData).then((cronRes) => {
        if (cronRes.isOk && cronRes.data) {
          info.data.crontabId = cronRes.data
          param.json = JSON.stringify(info.data)
          saveConf(param)
        }
      })
    }
  })
}
const saveConf = (data: any) => {
  sysApi.configuration.saveSysConfObj(data).then(({ msg }) => {
      info.loading = false
      ElMessage.success(`${msg}，即将刷新页面`)
      closeFn(true)
    },
    () => (info.loading = false)
  )
}

const resetForm = () => {
  info.data = abUtil.clone(initData)
  info.bpmNotDefaultButtonsList = initData.bpmNotDefaultButtons.split(',')
}

const type = getCurrentInstance()?.proxy?.$route.query.type
</script>

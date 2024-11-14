<template>
  <el-dialog
    :append-to-body="true"
    :before-close="dialogCancel"
    :model-value="props.isShow"
    :title="props.title"
    width="80%"
  >
    <approve-history-table
      :instance-id="historyParam.instId"
      :opinion-id="historyParam.opId"
      :task-id="historyParam.taskId"
    />
    <template #footer>
      <el-button type="primary" @click="dialogCancel">
        {{ $abT('page.common.ok', '确定') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue'
  import ApproveHistoryTable from './componets/approve-history-table.vue'

  const props = defineProps({
    bpmData: { required: true, type: Object as PropType<BpmData> },
    /** 是否展示对话框 */
    isShow: { required: true, type: Boolean },
    title: { required: false, type: String, default: '意见' },
  })
  // callback 为 对话框处理完数据后返回事件
  const emit = defineEmits(['dialogCancel', 'callback'])

  if (!props.bpmData.bpmInstance) {
    alert($abT('bpm.office.instanceLost', '流程实例丢失'))
  }

  const historyParam = computed(() => {
    const param = {
      instId: props.bpmData.bpmInstance?.id,
      taskId: props.bpmData.bpmTask?.id,
    }
    const type = props.bpmData.actionData.extendConf?.param?.type

    if (!type) {
      return param
    }
    if (type == 'opId') {
      param.opId = props.bpmData.actionData.extendConf?.param?.id
    } else if (type == 'taskId') {
      param.taskId = props.bpmData.actionData.extendConf?.param?.id
    }
    return param
  })

  // 关闭对话框
  const dialogCancel = () => {
    emit('dialogCancel', false)
  }
</script>

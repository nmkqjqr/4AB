<template>
  <el-dialog
    :append-to-body="true"
    :before-close="dialogCancel"
    fullscreen
    :model-value="props.isShow"
  >
    <ab-url-form
      v-if="info.bpmForm.formType == 'url'"
      ref="url"
      :bpm-form="info.bpmForm"
    />
    <div v-if="info.bpmForm.formType == 'inner'" ref="inner"></div>
    <approve-history-table
      v-show="info.showApproveHistory"
      :instance-id="info.instanceId"
    />

    <template #footer>
      <div class="noprint">
        <el-button
          type="primary"
          @click="info.showApproveHistory ? false : true"
        >
          {{ $abT('constant.ActionType.taskOpinion', '审批历史') }}
        </el-button>
        <el-button text type="default" @click="dialogCancel">
          {{ $abT('page.common.cancel', '取消') }}
        </el-button>
        <el-button type="primary" @click="print">
          {{ $abT('constant.ActionType.printed', '打印') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue'
  import { ElMessage, FormInstance } from 'element-plus'
  import { abForm as custForm } from '~/agilebpm'
  import { abUrlForm } from '@ab-bpm'
  import ApproveHistoryTable from './componets/approve-history-table.vue'
  const formRef = ref<FormInstance>()

  const props = defineProps({
    bpmData: { required: true, type: Object as PropType<BpmData> },
    /** 是否展示对话框 */
    isShow: { required: true, type: Boolean },
    title: { required: false, type: String, default: '意见' },
  })
  // callback 为 对话框处理完数据后返回事件
  const emit = defineEmits(['dialogCancel', 'callback'])

  const info: any = reactive({
    bpmForm: props.bpmData.bpmForm,
    showApproveHistory: false,
    instanceId: props.bpmData.bpmInstance?.id,
  })

  // 关闭对话框
  const dialogCancel = () => {
    emit('dialogCancel', false)
  }
  const print = () => {
    window.print()
  }
</script>
<style lang="scss">
  .printHeightStyle {
    .el-dialog__body {
      height: calc(100% - 130px);
    }
  }
</style>

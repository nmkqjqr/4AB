<template>
  <span v-bind="$attrs" style="cursor: pointer" @click="openDetail">
    <slot></slot>
  </span>
  <el-dialog
    v-model="info.dialogVisable"
    append-to-body
    :before-close="closeDialog"
    destroy-on-close
    :title="$abT('bpm.office.processDetails', '流程详情')"
    width="80%"
  >
    <ab-url-form
      v-if="info.bpmData.bpmForm.type == 'url'"
      ref="url"
      :bpm-form="info.bpmData.bpmForm"
    />
    <cust-form v-else ref="inner" :form-data="info.formData" />
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="info.showApproveHistory = true">
          {{ $abT('bpm.office.approvalHistory', '审批历史') }}
        </el-button>
        <el-button type="primary" @click="info.showImageDialog = true">
          {{ $abT('bpm.office.flowChart', '流程图') }}
        </el-button>
        <el-button type="primary" @click="closeDialog">
          {{ $abT('page.common.ok', '确定') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog
    v-model="info.showApproveHistory"
    append-to-body
    :before-close="() => (info.showApproveHistory = false)"
    :title="$abT('bpm.office.approvalHistory', '审批历史')"
    width="80%"
  >
    <approve-history-table :instance-id="info.instanceId" />
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="info.showApproveHistory = false">
          {{ $abT('page.common.ok', '确定') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
  <bpm-image-dialog
    v-if="info.showImageDialog"
    :bpm-data="info.bpmData"
    :is-show="info.showImageDialog"
    :title="$abT('bpm.office.flowChart', '流程图')"
    @dialog-cancel="info.showImageDialog = false"
  />
</template>
<script setup lang="ts">
  import { PropType, getCurrentInstance } from 'vue'
  import { bpmApi } from '~/agilebpm/api'
  import custForm from '../../../ab-form/components/index.vue'
  import abUrlForm from '../../ab-url-form.vue'
  import * as bpmTools from '../../bpm-tools'
  import * as abTools from '~/agilebpm/utils/ab-tools'

  import approveHistoryTable from './approve-history-table.vue'
  import bpmImageDialog from '../bpm-flow-image/bpm-image-dialog.vue'

  const props = defineProps({
    instanceId: {
      type: String,
      required: true,
    },
  })

  const info: any = reactive({
    bpmData: {},
    formData: {},
    instanceId: '',
    flowList: [] as any[],
    dialogVisable: false,
    showApproveHistory: false,
    showImageDialog: false,
  })

  const vueContext = getCurrentInstance()

  const openDetail = async () => {
    const id = abTools.encrypt(props.instanceId)
    //const id = props.instanceId

    await bpmApi.bpmData.getInstDataNew(id, 'encryptId').then(({ data }) => {
      bpmTools.initBpmDataAndFormData(
        data,
        vueContext,
        info.bpmData,
        info.formData
      )
      info.bpmData.actionData.instanceId = props.instanceId
      info.instanceId = props.instanceId
      info.dialogVisable = true
    })
  }

  const closeDialog = () => {
    info.dialogVisable = false
    info.bpmData = {}
    info.formData = {}
    info.instanceId = ''
  }
</script>

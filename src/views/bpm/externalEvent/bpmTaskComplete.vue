<template>
  <div
    v-loading="!info.bpmData.defName"
    style="overflow: auto; background-color: white"
  >
    <div class="leftBox" style="width: 100%">
      <div
        v-if="info.bpmData.defName && info.buttonList.length > 0"
        class="header-fix-top"
      >
        <bpm-button
          v-if="info.bpmData.buttonList.length"
          :bpm-data="info.bpmData"
          class="print-hidden"
        />
      </div>

      <div
        v-if="info.bpmData.defName"
        class="leftContent"
        :style="{ height: info.height }"
      >
        <ab-url-form
          v-if="info.bpmData.bpmForm.type == 'url'"
          ref="url"
          :bpm-form="info.bpmData.bpmForm"
        />
        <cust-form v-else ref="inner" :form-data="info.formData" />
      </div>
    </div>
    <footer class="vab-footer">
      Copyright
      <vab-icon icon="copyright-line" />
      {{ fullYear }} {{ comName }}
    </footer>
  </div>
</template>

<script lang="ts" setup>
  import { getCurrentInstance, Ref } from 'vue'
  import bpmButton from './bpmButton.vue'
  import {
    abForm as custForm,
    abUrlForm,
    bpmTools,
    bpmApi,
    abTools,
  } from '~/agilebpm'
  import { abT } from '@/i18n'
  import { ElMessageBox } from 'element-plus'

  const { proxy } = abTools.useCurrentInstance()
  const vueContext = getCurrentInstance()
  const taskId = vueContext?.proxy?.$route.query.id
  const info: any = reactive({
    bpmData: {} as Ref<BpmData>,
    formData: {},
    height: `${window.innerHeight - 130}px`,
    buttonList: [],
  })

  const buttonList = [
    {
      name: abT('page.common.submit', '提交'),
      actionName: 'externalEventSubmit',
    },
    {
      name: abT('bpm.office.storageTemporary', '暂存'),
      actionName: 'externalEventSave',
    },
  ]

  const initFormData = (res: any, taskId: any, buttonList: any) => {
    info.buttonList = buttonList
    bpmTools.initBpmDataAndFormData(
      res.data,
      vueContext,
      info.bpmData,
      info.formData
    )
    info.bpmData.actionData.taskId = taskId
    info.bpmData.buttonList = buttonList
  }

  bpmApi.bpmData.getExternalEventTaskData(taskId).then((res: any) => {
    if (!res.isOk && res.code === 'bpmConfirm') {
      ElMessageBox.confirm(res.msg, abT('page.common.prompt', '提示'), {
        confirmButtonText: abT('page.common.ok', '确定'),
        showCancelButton: false,
        type: 'warning',
      }).then(() => {
        if (res.data) {
          initFormData(res, taskId, [])
        } else {
          proxy.$router.push({
            path: '/tempLinkResultPage',
            query: {
              status: '0',
              action: 'done',
            },
          })
        }
      })
    }
    if (res.isOk) {
      initFormData(res, taskId, buttonList)
    }
  })

  import { useSettingsStore } from '@/store/modules/settings'

  const fullYear = new Date().getFullYear()
  const settingsStore = useSettingsStore()
  const { comName } = storeToRefs(settingsStore)
</script>
<style lang="scss" scoped>
  .leftBox {
    float: left;
    width: calc(100% - 400px);
    padding: 20px;
    .leftContent {
      padding: 12px;
      overflow: auto;
      border-top: 1px dashed #ccc;
    }
  }
  .vab-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 55px;
    padding: 0 $base-padding 0 $base-padding;
    color: rgba(0, 0, 0, 0.45);
    background: var(--el-color-white);
    border-top: 1px dashed $base-border-color;

    i {
      margin: 0 5px;
    }
  }
</style>

<template>
  <el-container v-loading="!info.bpmData.defName">
    <el-header v-if="info.bpmData.defName">
      <bpm-buttons
        v-if="info.bpmData.buttonList.length"
        :bpm-data="info.bpmData"
        class="print-hidden"
      />
    </el-header>
    <el-divider class="dividermar" />
    <el-main v-if="info.bpmData.defName" :style="{ height: info.height }">
      <ab-url-form
        v-if="info.bpmData.bpmForm.type == 'url'"
        ref="url"
        :bpm-form="info.bpmData.bpmForm"
      />
      <cust-form v-else ref="inner" :form-data="info.formData" />
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
  import { useTabsStore } from '@/store/modules/tabs'
  import {
    abForm as custForm,
    bpmButtons,
    abUrlForm,
    bpmTools,
    bpmApi,
    abTools,
  } from '~/agilebpm'

  import { getCurrentInstance, Ref } from 'vue'
  const { proxy } = abTools.useCurrentInstance()
  const vueContext = getCurrentInstance()
  const { changeTabsMeta } = useTabsStore()
  const defKey = vueContext?.proxy?.$route.params.defKey
  const info: any = reactive({
    bpmData: {} as Ref<BpmData>,
    formData: {},
    height: proxy.$route.query.abIframeType == 'iframe' ? 'auto' : `${window.innerHeight - 315}px`,
  })

  const bizId = vueContext?.proxy?.$route.query.bizId

  onMounted(() => {
    bpmApi.bpmData.getStartFlowData(defKey, false, bizId).then(({ data }) => {
      bpmTools.initBpmDataAndFormData(
        data,
        vueContext,
        info.bpmData,
        info.formData
      )
      changeTabsMeta({
        fullPath: proxy.$route.fullPath,
        meta: { title: `流程启动-${data.defName}` },
      })
    })
  })
</script>

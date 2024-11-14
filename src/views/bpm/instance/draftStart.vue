<template>
  <el-container
    v-loading="!info.bpmData.defName"
    class="layout-container-demo"
    style="display: block; overflow: auto"
  >
    <el-aside
      v-if="
        info.bpmData.ensureCandidate &&
        info.bpmData.bpmInstance &&
        info.bpmData.bpmInstance.status != 'draft'
      "
      style="float: right; width: 400px; height: 100%; overflow: hidden"
    >
      <bpm-task-dynamic :instance="info.bpmData.bpmInstance" />
    </el-aside>

    <el-main style="padding:0;">
      <el-container>
        <el-header v-if="info.bpmData.defName">
          <bpm-buttons
            v-if="info.bpmData.buttonList.length"
            :bpm-data="info.bpmData"
            class="print-hidden"
          />
        </el-header>
        <el-divider class="dividermar" />
        <el-main v-if="info.bpmData.defName" style="padding:12px;">
          <ab-url-form
            v-if="info.bpmData.bpmForm.type == 'url'"
            ref="url"
            :bpm-form="info.bpmData.bpmForm"
          />
          <cust-form v-else ref="inner" :form-data="info.formData" />
        </el-main>
      </el-container>
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
    abTools,
    bpmApi,
  } from '~/agilebpm'
  import { getCurrentInstance, Ref } from 'vue'
  import bpmTaskDynamic from '../myTask/components/task-dynamic.vue'

  const { proxy } = abTools.useCurrentInstance()
  const vueContext = getCurrentInstance()
  const { changeTabsMeta } = useTabsStore()
  const instId = vueContext?.proxy?.$route.query.instId
  const info: any = reactive({
    bpmData: {},
    formData: {},
  })

  onMounted(() => {
    bpmApi.bpmData.getDraftData(instId).then(({ data }) => {
      bpmTools.initBpmDataAndFormData(
        data,
        vueContext,
        info.bpmData,
        info.formData
      )
      info.bpmData.actionData.instanceId = instId

      changeTabsMeta({
        fullPath: proxy.$route.fullPath,
        meta: { title: `草稿启动-${data.bpmInstance.title}` },
      })
    })
  })
</script>

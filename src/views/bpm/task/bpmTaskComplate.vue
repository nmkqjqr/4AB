<template>
  <div
    v-loading="!info.bpmData.defName"
    ref="bpmInstanceBox"
    :style="{
      transformOrigin: 'top left',
      transform:
        proxy.$route.query.abIframeType == 'iframe'
          ? `scale(${info.scale}) translate(${info.translateX}px,${info.translateY}px)`
          : '',
    }"
  >
    <div :class="showTaskDynamic(info.bpmData) ? 'leftBoxDyminc' : 'leftBox'">
      <div v-if="info.bpmData.defName" class="header-fix-top">
        <bpm-buttons
          v-if="info.bpmData.buttonList.length"
          :bpm-data="info.bpmData"
          class="print-hidden"
        />
      </div>

      <div
        v-if="info.bpmData.defName"
        class="leftContent"
        :style="{
          height: info.height,
          overflow: info.bpmData.bpmForm.type == 'url' ? '' : 'auto',
        }"
      >
        <ab-url-form
          v-if="info.bpmData.bpmForm.type == 'url'"
          ref="url"
          :bpm-form="info.bpmData.bpmForm"
        />
        <cust-form v-else ref="inner" :form-data="info.formData" />
      </div>
    </div>
    <div v-if="showTaskDynamic(info.bpmData)" class="rightBox">
      <bpm-task-dynamic :instance="info.bpmData.bpmInstance" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useTabsStore } from '@/store/modules/tabs'
  import { getCurrentInstance, Ref } from 'vue'
  import {
    abForm as custForm,
    bpmButtons,
    abUrlForm,
    bpmTools,
    bpmApi,
    abTools,
  } from '~/agilebpm'
  import bpmTaskDynamic from '../myTask/components/task-dynamic.vue'
  import { showTaskDynamic } from '../myTask/components/myTaskConfig'
  import { ElMessageBox } from 'element-plus'
  import { abT } from '@/i18n'

  const { proxy } = abTools.useCurrentInstance()
  const vueContext = getCurrentInstance()
  const { changeTabsMeta } = useTabsStore()

  const taskId = vueContext?.proxy?.$route.query.id
  vueContext.proxy.$route.query.type = 'taskId'
  const info: any = reactive({
    bpmData: {} as Ref<BpmData>,
    formData: {},
    height:
      proxy.$route.query.abIframeType == 'iframe'
        ? 'auto'
        : `${window.innerHeight - 279}px`,
    scale: 1,
    translateX: 0,
    translateY: 0,
  })

  const bpmInstanceBox = ref()

  bpmApi.bpmData.getTaskData(taskId).then((res: any) => {
    if (!res.isOk && res.code === 'bpmConfirm') {
      ElMessageBox.confirm(res.msg, '提示', {
        confirmButtonText: '确定',
        showCancelButton: false,
        type: 'warning',
      }).then(() => {
        //跳转到任务待办页
        proxy.$router.push({
          name: 'BpmMyTaskTodoList',
        })
      })
    }
    if (res.isOk) {
      bpmTools.initBpmDataAndFormData(
        res.data,
        vueContext,
        info.bpmData,
        info.formData
      )
      info.bpmData.actionData.taskId = taskId

      changeTabsMeta({
        fullPath: proxy.$route.fullPath,
        meta: {
          newTitle: `${abT('menu.ProcessingTasks', '处理任务')}-${
            res.data.bpmInstance.title
          }`,
        },
      })
    }
  })

  const changeEnlargeScale = (scale: any) => {
    info.scale += scale
  }
  const changeEnsmallScale = (scale: any) => {
    info.scale = info.scale - scale
  }
  const rightFn = (diatance: any) => {
    info.translateX += diatance // 更新元素的left值
  }
  const leftFn = (diatance: any) => {
    const boxWidth = bpmInstanceBox.value.offsetWidth // 获取元素宽度
    const containerWidth = bpmInstanceBox.value.parentNode.offsetWidth // 获取容器宽度
    const newLeft = info.translateX + boxWidth // 计算新的left值
    if (newLeft > containerWidth || newLeft == containerWidth) {
      // 如果超出容器边界，则回到原位置
      info.translateX = 0
    } else {
      info.translateX += diatance // 更新元素的left值
    }
  }
  const upFn = (diatance: any) => {
    const boxHeight = bpmInstanceBox.value.offsetHeight // 获取元素高度
    const containerHeight = bpmInstanceBox.value.parentNode.offsetHeight // 获取容器高度
    const newTop = info.translateY + boxHeight // 计算新的up值
    if (newTop > containerHeight || newTop == containerHeight) {
      // 如果超出容器边界，则回到原位置
      info.translateY = 0
    } else {
      info.translateY += diatance // 更新元素的up值
    }
  }
  const downFn = (diatance: any) => {
    info.translateY += diatance
  }

  onMounted(() => {
    if (proxy.$route.query.abIframeType == 'iframe') {
      window.onmessage = (e) => {
        if (e.data.type == 'changeEnlargeScale') {
          if (e.data.scale) {
            changeEnlargeScale(e.data.scale)
          }
        }
        if (e.data.type == 'changeEnsmallScale') {
          if (e.data.scale) {
            changeEnsmallScale(e.data.scale)
          }
        }
        if (e.data.type == 'rightFn') {
          if (e.data.diatance) {
            rightFn(e.data.diatance)
          }
        }
        if (e.data.type == 'leftFn') {
          if (e.data.diatance) {
            leftFn(e.data.diatance)
          }
        }
        if (e.data.type == 'upFn') {
          if (e.data.diatance) {
            upFn(e.data.diatance)
          }
        }
        if (e.data.type == 'downFn') {
          if (e.data.diatance) {
            downFn(e.data.diatance)
          }
        }
      }
    }
  })
</script>
<style lang="scss" scoped>
  @import '../myTask/components/taskDynamic.scss';
</style>

<template>
  <ab-url-form
    v-if="bpmData.bpmForm?.type == 'url'"
    ref="url"
    :bpm-form="bpmData.bpmForm"
  />
  <div v-if="bpmData.bpmForm?.type == 'inner'" ref="inner"></div>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue'
  import { bpmApi } from '@agilebpm/api'
  import abUrlForm from './ab-url-form.vue'
  import { abT } from '@/i18n'

  const vueContext = getCurrentInstance()
  //引入 当前实例
  const props = defineProps<{
    taskId?: any //任务id
    id?: any // 各种id
    /**
     * startFlow:  流程启动时通过defId获取实例数据,
     * instanceDetail: 通过instanceId流程实例数据,
     * opinionDetail: 审批历史进入详情页，通过bpmTaskOpinionId获取实例数据,
     * bizDetail: 通过bizId获取实例数据,
     * draftStart: 实例是从草稿状态启动是通过instanceId获取实例数据
     * applyDetail：申请历史进入详情页，通过instanceId获取实例数据
     */
    type?: any // 详情类型
    nodeKey?: any //节点标识
    carbonId?: any //抄送id
    modelValue: BpmData
    defKey: any
  }>()

  const bpmData: BpmData = reactive({
    isTabLeave: false,
    extendConf: { sourceType: props.type, typeId: props.id },
    actionData: {
      actionName: '',
      data: {},
      presetDestination: '',
      opinion: '',
      extendConf: {},
    },
    getFormDataFn: (button: BpmButton) => {
      // 客户表单自定义 fn:custValid 校验
      const validateForm =
        'start,agree,oppose,signOppose,signAgree,signWaive'.indexOf(
          button.actionName
        ) != -1
      const formRef: any = vueContext?.refs[bpmData.bpmForm?.type || 'url']
      if (formRef == null)
        console.error(
          abT('bpm.office.formNotExist', '在线表单，或者URL表单不存在！')
        )
      return formRef.getData(validateForm)
    },
  })
  const emit = defineEmits(['update:modelValue'])
  bpmApi.bpmData.getBpmData(props).then(({ data }) => {
    if (data.bpmTask && data.bpmTask.id) {
      bpmData.actionData.taskId = data.bpmTask.id
      bpmData.bpmTask = data.bpmTask
      bpmData.actionData.instanceId = data.bpmTask.instId
    } else if (data.bpmInstance && data.bpmInstance.id) {
      bpmData.actionData.instanceId = data.bpmInstance.id
      bpmData.actionData.defId = data.bpmInstance.defId
    } else {
      bpmData.actionData.defId = data.defId
    }
    bpmData.defName = data.defName
    bpmData.actionData.data = data.data
    bpmData.bpmInstance = data.bpmInstance
    bpmData.buttonList = data.buttonList
    bpmData.bpmForm = data.bpmForm
    bpmData.bpmNodeConfig = data.bpmNodeConfig
    bpmData.ensureCandidate = data.ensureCandidate
    if (props.carbonId) {
      bpmData.actionData.extendConf.carbonId = props.carbonId
    }
    emit('update:modelValue', bpmData)
  })
</script>

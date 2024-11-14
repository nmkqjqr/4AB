<template>
  <el-dialog
    :append-to-body="true"
    :before-close="dialogCancel"
    :model-value="props.isShow"
    :title="props.title"
    width="80%"
  >
    <bpm-image-block v-if="data.imageInfoLoaded" :image-info="data.imageInfo" />
    <template #footer>
      <el-button type="primary" @click="dialogCancel()">
        {{ $abT('page.common.ok', '确定') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
  import { bpmApi } from '@agilebpm/api'
  import BpmImageBlock from './bpm-image-block.vue'

  const props = defineProps({
    bpmData: { required: true, type: Object },
    /** 是否展示对话框 */
    isShow: { required: true, type: Boolean },
    title: { required: false, type: String, default: '意见' },
  })

  const data = reactive({
    imageInfo: {},
    imageInfoLoaded: false,
  })

  const imageParam = () => {
    const param = {
      instanceId: props.bpmData.actionData?.instanceId,
      defId: props.bpmData.actionData?.defId,
      taskId: props.bpmData.actionData?.taskId,
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
  }

  const initialImageInfo = () => {
    bpmApi.instance.getFlowImagInfo(imageParam()).then((res) => {
      data.imageInfo = res.data
      data.imageInfo.bpmInstance = props.bpmData.bpmInstance
      data.imageInfoLoaded = true
    })
  }

  onMounted(() => initialImageInfo())

  // callback 为 对话框处理完数据后返回事件
  const emit = defineEmits(['dialogCancel', 'callback'])

  // 关闭对话框
  const dialogCancel = () => {
    emit('dialogCancel', false)
  }
</script>
<style>
  .opinionStatus {
    margin-top: 20px;
    margin-left: 30px;
  }

  .popperContent {
    max-height: 400px;
    overflow-y: scroll;
  }
  .bottonDiv {
    position: absolute;
    bottom: 0px;
    left: 0px;
  }
</style>

<template>
  <el-dialog
    :append-to-body="false"
    :before-close="dialogCancel"
    class="dialogClassStyle"
    :model-value="props.isShow"
    :title="props.title"
  >
    {{ data.explainType }}
    <div
      v-if="data.explainType != 'file'"
      class="grid-content bg-purple-dark"
      v-html="data.htmlTemplate"
    ></div>
    <ab-upload-file
      v-if="data.explainType == 'file'"
      v-model="data.fileJson"
      dic-code="word"
      is-auto-popup="true"
      :multiple="false"
      show-button:false
      size="small"
      type="docx,pdf"
      @on-file-close="dialogCancel"
    />
    <template #footer>
      <el-button text type="default" @click="dialogCancel">
        {{ $abT('page.common.cancel', '取消') }}
      </el-button>
      <el-button type="primary" @click="dialogCancel">
        {{ $abT('page.common.ok', '确定') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue'
  import { bpmApi } from '@agilebpm/api'

  import { abUploadFile } from '@ab-core'
  const props = defineProps({
    bpmData: { required: true, type: Object as PropType<BpmData> },
    /** 是否展示对话框 */
    isShow: { required: true, type: Boolean },
    title: { required: false, type: String, default: '流程指引' },
    htmlTemplate: { type: String, default: '' },
  })
  // callback 为 对话框处理完数据后返回事件
  const emit = defineEmits(['dialogCancel', 'callback'])

  const data = reactive({
    explainType: '',
    htmlTemplate: '',
    fileJson: '',
    isAutoPopup: '',
  })
  //请求流程指引数据
  const param = {
    defId: props.bpmData?.actionData?.defId,
    nodeId: props.bpmData?.bpmTask?.nodeKey,
    taskId: props.bpmData?.bpmTask?.id,
    instanceId: props.bpmData?.bpmTask?.id,
  }
  bpmApi.bpmPlugins.getNodeExplain(param).then((result: any) => {
    data.htmlTemplate = result.data?.htmlTemplate
    data.explainType = result.data?.explainType
    data.fileJson = result.data?.fileJson
    data.isAutoPopup = result.data?.isAutoPopup
  })

  // 关闭对话框
  const dialogCancel = () => {
    emit('dialogCancel', false)
  }
</script>
<style lang="scss">
  .dialogClassStyle {
    img {
      width: 100%;
    }
  }
</style>

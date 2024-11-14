<template>
  <el-dialog
    :append-to-body="true"
    :before-close="dialogCancel"
    :close-on-click-modal="false"
    destroy-on-close
    :model-value="props.isShow"
    :title="props.title"
    top="10px"
    width="90%"
  >
    <div
      v-loading="info.loading"
      :element-loading-text="
        $abT(
          'bpm.office.loadPdfSlow',
          '初次加载pdf可能会有点缓慢，请耐心等候……'
        )
      "
    >
      <iframe
        v-if="info.src"
        ref="previewFrame"
        :src="info.src"
        :style="{ width: '100%', height: info.height }"
      />
    </div>
    <template #footer>
      <el-button v-if="!info.loading" type="primary" @click="downloadWord">
        {{ $abT('bpm.office.downloadWordFile', '下载Word文件') }}
      </el-button>
      <el-button text type="default" @click="dialogCancel">
        {{ $abT('page.common.cancel', '取消') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue'
  import { bpmApi, bizApi } from '@agilebpm/api'
  import * as abUtil from '~/agilebpm/utils/ab-util'
  import * as abTools from '~/agilebpm/utils/ab-tools'
  import { FormInstance } from 'element-plus'
  import { abT } from '@/i18n'
  const formRef = ref<FormInstance>()

  const props = defineProps({
    bpmData: { required: true, type: Object as PropType<BpmData> },
    /** 是否展示对话框 */
    isShow: { required: true, type: Boolean },
    title: {
      required: false,
      type: String,
      default: abT('bpm.office.commentsRemarks', '意见/备注'),
    },
    uiData: {
      required: true,
      type: Object,
    },
  })

  const info: any = reactive({
    actionData: {} as PropType<ActionData>,
    rejectInfo: {},
    src: '',
    downloading: false,
    height: `${window.innerHeight - 250}px`,
    wordTemplate: null,
    loading: true,
  })

  //初始化逻辑
  onMounted(() => {
    //复制bpmData数据达到数据隔离
    info.actionData = abUtil.clone(props.bpmData).actionData
    const wordCode = props.uiData.word.wordCode

    bizApi.wordTemplate.getByCode(wordCode).then((resp: any) => {
      info.wordTemplate = resp.data
      bizApi.wordTemplate
        .printFormData(
          wordCode,
          info.actionData.data,
          'pdf',
          props.uiData.word.immediate,
          false,
          props.bpmData.bpmTask,
          props.bpmData.bpmInstance
        )
        .then((resp: any) => {
          info.loading = false
          if (!resp.data) {
            ElMessage({
              type: 'error',
              message: abT(
                'bpm.office.downloadWordFileErrorMsg',
                '下载pdf失败：详情请移步系统中的异常日志'
              ),
            })
            return
          }
          const blobUrl = URL.createObjectURL(resp.data)
          // 在iframe中加载Blob URL
          info.src = blobUrl
          info.dialogVisible = true
        })
    })
  })

  // callback 为 对话框处理完数据后返回事件
  const emit = defineEmits(['dialogCancel', 'callback'])
  // 关闭对话框
  const dialogCancel = () => {
    emit('dialogCancel', false)
  }

  const downloadWord = () => {
    const wordCode = info.wordTemplate.code
    const fileName = JSON.parse(info.wordTemplate.file)[0].name

    bizApi.wordTemplate
      .printFormData(
        wordCode,
        info.actionData.data,
        'word',
        props.uiData.word.immediate
      )
      .then((resp: any) => {
        if (!resp.data) {
          ElMessage({
            type: 'error',
            message: abT('bpm.office.downloadWordFileFail', '下载word文档失败'),
          })
          return
        }

        const blobUrl = URL.createObjectURL(resp.data)
        const a = document.createElement('a') // 创建a标签
        a.download = `${fileName}` // 下载后文件的名字
        a.href = blobUrl
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      })
  }
</script>

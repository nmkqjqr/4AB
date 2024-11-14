<template>
  <el-dialog
    v-model="info.dialogVisible"
    :close-on-click-modal="false"
    destroy-on-close
    :show-close="false"
    top="10px"
    width="90%"
  >
    <template #header>
      <span style="float: right">
        <el-button
          v-if="info.wordTemplate"
          :icon="Download"
          :loading="info.downloading"
          type="primary"
          @click="downloadWord"
        >
          下载Word文件
        </el-button>
        <el-button
          :icon="CircleClose"
          type="danger"
          @click="info.dialogVisible = false"
        >
          关闭
        </el-button>
      </span>
    </template>

    <iframe
      v-if="info.src"
      ref="previewFrame"
      :src="info.src"
      :style="{ width: '100%', height: info.height }"
    />
  </el-dialog>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'
  import { Back } from '@element-plus/icons-vue'
  import { useTabsStore } from '@/store/modules/tabs'
  import { bizApi, abUtil } from '~/agilebpm'
  import { Download, CircleClose } from '@element-plus/icons-vue'

  const props = defineProps({
    dialogVisible: {
      type: Boolean,
      required: false,
      defualt: false,
    },
  })

  //页面用到的双向绑定的信息
  const info: any = reactive({
    dialogVisible: false,
    src: '',
    downloading: false,
    height: `${window.innerHeight - 150}px`,
    wordTemplate: null,
    formData: null,
  })

  onMounted(() => {})

  const previewFrame = ref()
  const open = (wordTemplate: any, formData: any) => {
    info.wordTemplate = wordTemplate
    const wordCode = wordTemplate.code
    info.formData = formData

    bizApi.wordTemplate
      .printFormData(wordCode, formData, 'pdf', true)
      .then((resp) => {
        if (!resp.data) {
          ElMessage({
            type: 'error',
            message: `下载pdf失败：详情请移步系统中的异常日志`,
          })
          return
        }
        const blobUrl = URL.createObjectURL(resp.data)
        // 在iframe中加载Blob URL
        info.src = blobUrl
        info.dialogVisible = true
      })
  }

  const downloadWord = () => {
    const wordCode = info.wordTemplate.code
    const fileName = JSON.parse(info.wordTemplate.file)[0].name
    const fileInfo = abUtil.getFileInfo(fileName)

    bizApi.wordTemplate
      .printFormData(wordCode, info.formData, 'word', true)
      .then((resp) => {
        if (!resp.data) {
          ElMessage({
            type: 'error',
            message: '下载word文档失败',
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

  // 将外部允许调用的方法
  defineExpose({ open })
</script>

<style lang="scss" scoped></style>

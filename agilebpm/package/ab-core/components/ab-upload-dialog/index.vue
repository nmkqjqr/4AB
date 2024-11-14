<template>
  <!-- v-ab-btn-rights="props.alias" -->
  <el-button
    v-if="props.joinBtnRight == 1"
    v-ab-btn-rights="props.alias"
    v-bind="$attrs"
    type="primary"
    @click="dialogVisible = true"
  >
    {{ data.btnText }}
  </el-button>
  <el-button
    v-else
    type="primary"
    v-bind="$attrs"
    @click="dialogVisible = true"
  >
    {{ data.btnText }}
  </el-button>
  <el-dialog
    v-model="dialogVisible"
    :append-to-body="true"
    :title="$abT('page.common.import','导入')"
    width="30%"
  >
    <el-upload
      ref="upload"
      :accept="props.accept"
      action="upload"
      :auto-upload="false"
      class="upload-demo"
      :http-request="uploadFile"
      :limit="1"
      :on-exceed="handleExceed"
    >
      <template #trigger>
        <el-button type="">{{ $abT('page.common.selectFile','选择文件') }}</el-button>
        <div
          class="el-upload__tip text-red"
          style="margin-top: 1px; margin-left: 14px"
        >
          {{ data.tip }}
        </div>
      </template>
    </el-upload>
    <template #footer>
      <span class="dialog-footer">
        <el-button text type="primary" @click="dialogVisible = false">
          {{ $abT('page.common.close','关闭') }}
        </el-button>
        <el-button :loading="btnLoading" type="primary" @click="submitUpload">
          {{ $abT('page.common.affirm','确认') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
  export default { name: 'AbUploadDialog' }
</script>
<script lang="ts" setup>
  import { abT } from '@/i18n'
  import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
  import { ElMessage, genFileId } from 'element-plus'
  import { ref } from 'vue'
  import { request } from '~/agilebpm/api'
  const props = defineProps({
    // 用户默认会定义为Object any ，如果指定类型则： type: Object as PropType<User>,
    data: {
      type: Object,
      required: true,
    },
    search: { type: Function, default: () => {} },
    joinBtnRight: {
      type: Number,
      default: 0,
    },
    alias: {
      type: String,
      default: '',
    },
    afterSave: { type: Function, default: null },
    afterSaveNeedDownload: {
      type: Boolean,
      default: false,
    },
    timeout: {
      type: Number,
      default: null,
    },
    accept: {
      type: String,
      default: '',
    },
  })
  const dialogVisible = ref(false)
  watch(
    () => dialogVisible.value,
    (value) => {
      if (value) {
        // 打开时清除
        nextTick(() => {
          upload.value!.clearFiles()
        })
      }
    }
  )

  const btnLoading = ref(false)

  const upload = ref<UploadInstance>()

  const handleExceed: UploadProps['onExceed'] = (files) => {
    upload.value!.clearFiles()
    const file = files[0] as UploadRawFile
    file.uid = genFileId()
    upload.value!.handleStart(file)
  }
  const uploadFile = (item: any) => {
    btnLoading.value = true
    const formData = new FormData()
    formData.append('file', item.file)
    if (
      props.data.customImport &&
      props.data.alias &&
      props.data.alias.length > 0
    ) {
      formData.append('btnCode', props.data.alias)
    }
    const param = {
      url: props.data.url,
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
    const response = props.afterSaveNeedDownload
      ? { responseType: 'blob', timeout: 1000 * 60 }
      : props.timeout
      ? { timeout: props.timeout }
      : {}
    request({ ...param, ...response }).then(
      (result) => {
        if (props.afterSave) {
          props.afterSave(result)
        } else {
          if (result.code == 'Success') {
            ElMessage({
              message: abT('page.common.importFailed','导入成功'),
              type: 'success',
            })
          } else {
            ElMessage({
              message: abT('page.common.importSuccessfully','导入失败'),
              type: 'error',
            })
          }
        }
        btnLoading.value = false
        dialogVisible.value = false
        props.search()
      },
      () => {
        btnLoading.value = false
      }
    )
  }

  const submitUpload = () => {
    upload.value!.submit()
  }
</script>
<style scoped></style>

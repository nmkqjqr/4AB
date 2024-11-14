<template>
  <el-upload
    v-show="isOnlyUpload"
    accept="image/png, image/jpeg"
    action="uploadUrl"
    :file-list="fileList"
    :http-request="uploadFn"
    list-type="picture-card"
    :on-change="handleImageChange"
    :on-preview="handlePictureCardPreview"
    :on-remove="handleRemove"
    :before-upload="beforeUpload"
  >
    <el-icon><Plus /></el-icon>
  </el-upload>
  <el-dialog v-model="dialogVisible">
    <img alt="" :src="dialogImageUrl" style="width: 100%" />
  </el-dialog>

  <el-upload
    v-show="!isOnlyUpload"
    accept="image/png, image/jpeg"
    action="uploadUrl"
    :file-list="fileList"
    :http-request="uploadFn"
    :on-change="handleImageChange"
    :show-file-list="isOnlyUpload"
    :before-upload="beforeUpload"
  >
    <el-button :icon="Upload" type="primary">上传</el-button>
  </el-upload>
</template>
<script lang="ts" setup>
  import { sysApi, postData, request } from '~/agilebpm'
  import { ref, onMounted } from 'vue'
  import { Plus, Upload } from '@element-plus/icons-vue'
  import type { UploadFile, UploadUserFile } from 'element-plus'
  import {ElMessage} from "element-plus";
  import * as abFormat from "~/agilebpm/utils/ab-format";
  const emit = defineEmits(['updateFileList'])
  const props = defineProps({
    isOnlyUpload: {
      type: Boolean,
      required: true,
    },
    // 用户默认会定义为Object any ，如果指定类型则： type: Object as PropType<User>,
    images: {
      type: Array as () => Array<string>, //(string也可以是其他你自定义的接口)
      required: false,
    },
    // 文件类型数据字典的key，方便对文件归属哪个模块进行分类。（必传）
    dicCode: {
      type: String,
      required: true, //必传
    },
  })
  const fileList = ref<UploadUserFile[]>([])

  const dialogImageUrl = ref('')
  const dialogVisible = ref(false)

  const uploadFn = (item: any) => {
    const formData = new FormData()
    formData.append('file', item.file)
    formData.append('dicCode', props.dicCode)
    request({
      url: sysApi.sysFile.uploadUrl,
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(
        (result: any) => {
          fileList.value.splice(0)
          fileList.value.push({
            url: sysApi.sysFile.getViewFileUrl(result.data),
          } as any)
          emit('updateFileList', result.data)
        },
        () => {}
      )
      .catch((err: any) => {
        if (err) {
          console.log(err)
          item.onError()
          item.message = '上传失败'
        }
      })
  }
  const handleRemove = () => {
    emit('updateFileList', [])
  }

  const handlePictureCardPreview = (file: UploadFile) => {
    dialogImageUrl.value = file.url!
    dialogVisible.value = true
  }

  const handleImageChange = () => {
    fileList.value = fileList.value.slice(-1)
  }

  const handleFileChange = () => {
    fileList.value = fileList.value.splice(0)
  }

  //校验文件大小和类型,,同时筛选文件,如果没有类型则报错
  const beforeUpload = (file: File) => {
      //获取上传文件大小
      if (file.size > 1024 * 1024 *5) {
        ElMessage.warning(
          `文件大小为${abFormat.renderSize(
            `${file.size}`
          )}, 不能超过${abFormat.renderSize(`${1024 * 1024 *5}`)}，请重新上传`
        )
        return false
      }
    return true
  }

  onMounted(() => {
    if (props.images) {
      const elementId: string = props.images.join('')
      if (elementId) {
        fileList.value.push({
          url: sysApi.sysFile.getViewFileUrl(elementId),
        } as any)
      }
    }
  })
</script>

<style lang="scss" scoped>
  .upload-content .el-upload-list__item .el-icon-close-tip {
    display: none !important;
  }
</style>

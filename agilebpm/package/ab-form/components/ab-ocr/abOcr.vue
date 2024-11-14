<template>
  <div v-if="permission !== 'n'">
    <el-upload
      v-bind="$attrs"
      accept="image/*"
      class="upload-demo"
      :disabled="loadingRef || permission === 'r'"
      :file-list="fileList"
      :http-request="uploadFn"
      :list-type="listType"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
    >
      <el-icon
        v-if="listType === 'picture-card'"
        class="avatar-uploader-icon"
        v-bind="$attrs"
        :disabled="permission === 'r'"
      >
        <Plus />
      </el-icon>
      <el-button
        v-else
        :disabled="permission === 'r'"
        v-bind="$attrs"
        :icon="FullScreen"
        :loading="loadingRef"
        type="primary"
      >
        {{ getShowName() }}
      </el-button>
    </el-upload>
    <div class="preview">
      <el-image-viewer
        v-if="imgDialogVisible"
        :teleported="true"
        :url-list="[sysApi.sysFile.getViewFileUrl(fileId)]"
        @close="() => (imgDialogVisible = false)"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
  // import { CustFormBaseImportsUse } from '../custFormBaseImports'
  import { abT } from '@/i18n'
  import { FullScreen } from '@element-plus/icons-vue'
  import { ElButton, ElUpload, UploadUserFile } from 'element-plus'
  import { toRefs } from 'vue'
  import { request, sysApi } from '~/agilebpm/api'
  const props = defineProps({
    modelValue: {
      required: true,
    },
    //选中项绑定值:
    //权限:w/r/n/b(编辑/只读/无权限/必填)   默认值 W （与element内置是否只读属性readonly绑定， 无需自己实现）
    permission: {
      type: String,
      default: 'w',
    },
    //映射对象（用来扫描发送信息字段绑定的值使用）
    objectMapping: {
      type: Object as any,
      default: null,
    },
    // 默认展示是图片还是文件
    listType: {
      type: String as () => 'text' | 'picture-card', //(文件或图片两种展示形式)
      default: 'text',
    },
    ocrType: {
      type: String,
      default: '',
    },
    uploadType: {
      type: String,
      default: 'mrfl',
    },
    //文字识别的配置
    param: {
      type: Array<OcrParam>,
      required: true,
    },
  })

  // emit 事件定义
  const emit = defineEmits(['update:modelValue'])

  //将data内的属性转为响应式数据
  const { ocrType, uploadType, param, objectMapping } = toRefs(props)

  const fileList: any = ref<UploadUserFile[]>([])
  //图片预览img地址中getViewFileUrl方法所需的ID变量
  const fileId = ref('')
  //预览图片类型时的弹窗开关
  const imgDialogVisible = ref(false)
  const loadingRef = ref(false)
  let tempFileStr = ''
  const getShowName = () => {
    if (loadingRef.value) {
      return abT('abform.scanTrans.Identifying', '正在识别')
    }
    if (ocrType.value == 'ID_CARD') {
      return abT('abform.scanTrans.IdentifyingIDBack', '识别身份证人像面')
    }
    if (ocrType.value == 'ID_CARD_BACK') {
      return abT('abform.scanTrans.IdentifyingID', '识别身份证国徽面')
    }
    if (ocrType.value == 'RECEIPT') {
      return abT('abform.scanTrans.IdentifyInvoices', '识别发票')
    }
    if (ocrType.value == 'BUSINESS_LICENSE') {
      return abT('abform.scanTrans.IdentifyBusiness', '识别营业执照')
    }
    return abT('abform.scanTrans.IdentifyText', '识别文字')
  }

  //授权对象泛型
  interface OcrParam {
    key: string
    value: string
  }

  //自定义的上传操作
  const uploadFn = (item: any) => {
    const formData = new FormData()
    formData.append('file', item.file)
    formData.append('dicCode', uploadType.value)
    loadingRef.value = true

    // 返回一个 Promise 对象
    return new Promise(() => {
      request({
        url: sysApi.sysFile.uploadUrl,
        method: 'post',
        data: formData,
        timeout: 60000,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then((result: any) => {
          item.onSuccess()
          const obj = [
            { id: result.data, name: item.file.name, size: item.file.size },
          ]
          fileList.value = obj
          tempFileStr = transformation(obj)
          emit('update:modelValue', tempFileStr)
          sysApi.sysFile
            .ocr(result.data, ocrType.value)
            .then((s) => {
              try {
                console.log('ocr', s.data)
                if (s.data) {
                  ocrProcessor(s.data)
                }
                loadingRef.value = false
              } catch {
                loadingRef.value = false
                ElMessage.error(
                  abT(
                    'abform.scanTrans.IdentifyTip',
                    '解析异常，请检查返回格式！'
                  )
                )
              }
            })
            .catch(() => {
              loadingRef.value = false
            })
        })
        .catch((err: any) => {
          if (err) {
            console.log(err)
            item.onError()
            item.message = abT(
              'page.common.uploadFailed',
              '文件上传失败,请稍后再试'
            )
          }
          loadingRef.value = false
        })
    })
  }

  const handlePreview = (fileObj: any) => {
    fileId.value = fileObj.id
    imgDialogVisible.value = true
  }

  const ocrProcessor = (item: any) => {
    param.value.forEach((ocrParam: OcrParam) => {
      if (item[ocrParam.key]) {
        objectMapping.value[ocrParam.value] = item[ocrParam.key]
      }
    })
    loadingRef.value = false
  }

  const handleRemove = () => {
    emit('update:modelValue', '')
  }

  const init = () => {
    if (props.modelValue) {
      fileList.value = JSON.parse(props.modelValue)
    } else {
      fileList.value = []
    }
  }

  init()

  watch(
    () => props.modelValue,
    () => {
      if (tempFileStr != props.modelValue) {
        init()
      }
    }
  )

  const transformation = (fileArray: any[]) => {
    return JSON.stringify(
      fileArray.map((s) => ({
        name: s.name,
        id: s.id,
        size: s.size,
      }))
    )
  }
</script>

<style lang="scss" scoped>
  :deep(.el-upload-list) {
    width: 100%;
    min-width: 150px;
    max-width: 350px;
  }
</style>

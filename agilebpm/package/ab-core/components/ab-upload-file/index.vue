<template>
  <!-- template下只能有一个根节点，所以用div包一下，div内必须给宽度100%，才能使 :deep(.el-upload-list)的100%宽度生效 -->
  <span style="width: 100%">
    <el-upload
      :accept="getAccept()"
      :before-upload="beforeUpload"
      :class="[
        disabled && hideButton ? 'hideButton' : '',
        { hide: hideUpload },
        { logotype: disabled },
        uploadStyleClass ? 'upload-demo-small' : 'upload-demo',
      ]"
      class="upload-max-width"
      :disabled="disabled"
      :file-list="fileList"
      :http-request="uploadFn"
      :limit="limit"
      :list-type="listType"
      :multiple="multiple"
      :on-change="handleChange"
      :on-error="handleError"
      :on-exceed="handleExceed"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
    >
      <el-icon v-if="listType === 'picture-card'" class="avatar-uploader-icon">
        <Plus />
      </el-icon>
      <el-button
        v-else
        :disabled="disabled"
        :icon="Upload"
        :size="buttonSize"
        type="primary"
      >
        {{ $abT('page.common.upload', '上传') }}
      </el-button>
    </el-upload>

    <div class="preview">
      <el-image-viewer
        v-if="imgDialogVisible"
        :teleported="true"
        :url-list="[sysApi.sysFile.getViewFileUrl(fileId)]"
        @close="() => (imgDialogVisible = false)"
      />
      <file-preview
        v-model="dialogVisible"
        :file="file"
        :file-type="fileType"
        @close="() => (dialogVisible = false)"
      />
    </div>
  </span>
</template>
<script lang="ts">
  export default { name: 'AbUploadFile' }
</script>

<script lang="ts" setup>
  import { abT } from '@/i18n'
  import { Plus, Upload } from '@element-plus/icons-vue'
  import {
    ElMessage,
    ElUpload,
    UploadFile,
    UploadRawFile,
    UploadUserFile,
  } from 'element-plus'
  import { request, sysApi } from '~/agilebpm/api'
  import * as abFormat from '~/agilebpm/utils/ab-format'
  import * as abTools from '~/agilebpm/utils/ab-tools'
  import FilePreview from './FilePreview.vue' // 预览组件；
  const props = defineProps({
    modelValue: {
      type: String || Array, //(可以是json字符串, 也可以是对象)
      required: true,
    },
    //是否禁用: true/false  默认false
    disabled: {
      type: Boolean,
      default: false,
    },
    //是否禁用: true/false  默认false
    readNonDownload: {
      type: Boolean,
      default: false,
    },
    // 只读下隐藏按钮
    hideButton: {
      type: Boolean,
      default: false,
    },
    // 默认展示是图片还是文件
    listType: {
      type: String as () => 'text' | 'picture-card', //('text' 或  'picture-card'  文件或图片两种展示形式)
      default: 'text',
    },
    // 是否多选
    multiple: {
      type: Boolean, //(true:支持多选， false：单选,再选覆盖)
      default: true,
    },
    // 文件大小限制
    max: {
      type: Number, //(0为不限制)
      default: 0,
    },
    // 文件数量限制
    limit: {
      type: Number, //(0为不限制)
      default: 0,
    },
    // 文件自身类型限制
    type: {
      type: String, //(空字符为不限制)
      default: '',
    },
    // 文件类型数据字典的key，方便对文件归属哪个模块进行分类。（必传）
    dicCode: {
      type: String,
      required: true, //必传
    },
    //是否自动打开第一个文件的预览页面
    isAutoPopup: {
      type: Boolean,
      default: false,
    },
    uploadStyleClass: {
      type: Boolean,
      default: false,
    },
    //上传按钮的大小样式
    buttonSize: {
      type: String as () => '' | 'default' | 'small' | 'large',
      default: '',
    },
  })

  watch(
    () => props.hideButton,
    () => {
      console.log('props.hideButton', props.hideButton)
    }
  )
  // emit 事件定义
  const emit = defineEmits(['onFileClose'])
  // 文件上传的对象
  const fileList: any = ref<UploadUserFile[]>([])
  const { disabled, multiple, limit, readNonDownload } = toRefs(props)
  const modelValue: any = useVModel(props, 'modelValue', emit)

  //图片预览img地址中getViewFileUrl方法所需的ID变量
  const fileId = ref('')
  //预览组件所需后缀类型的参数变量
  const fileType = ref('')
  //预览组件需要file文件对象
  const file = ref()
  //预览复杂类型时的弹窗开关
  const dialogVisible = ref(false)
  //预览图片类型时的弹窗开关
  const imgDialogVisible = ref(false)
  //是否隐藏图片得上传图标，默认不隐藏
  const hideUpload = ref(disabled.value)

  let temp = ''

  const getAccept = () => {
    if (props.type && props.type.length > 0) {
      const typeArr = props.type.split(',')
      return typeArr.map((item) => `.${item}`).join(',')
    }
    return props.listType != 'picture-card' ? '*' : 'image/*'
  }
  //自定义的上传操作 (逻辑说明：由于uploadFn并不会更新)
  const uploadFn = (item: any) => {
    item.status = 'uploading' //文件上传状态
    item.percentage = 0 //文件上传进度，这里设为0
    item.name = item.file.name //文件名
    const formData = new FormData()
    formData.append('file', item.file)
    formData.append('dicCode', props.dicCode)
    request({
      url: sysApi.sysFile.uploadUrl,
      method: 'post',
      data: formData,
      timeout: 60000,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent: { loaded: number; total: number }) => {
        const complete = parseInt(
          `${((progressEvent.loaded / progressEvent.total) * 100) | 0}`,
          10
        )
        // 这个方法有一个参数"percent"，给他进度值 complete 即可
        item.onProgress({ percent: complete })
      },
    })
      .then(
        (result: any) => {
          if (result.data) {
            item.onSuccess() //上传成功后将status属性改成success
            if (fileList.value && fileList.value.length > 0) {
              fileList.value.forEach((file: any) => {
                if (item.file.uid == file.uid) {
                  file.id = result.data
                }
              })
            }
            temp = transformation(fileList.value)
            modelValue.value = temp
          }
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

  // 点击文件/预览文件
  const handlePreview = (fileObj: any) => {
    if (
      readNonDownload.value &&
      props.listType != 'picture-card' &&
      disabled.value
    ) {
      ElMessage.warning(abT('page.common.noPermission!', '无下载权限!'))
      return
    }
    fileId.value = fileObj.id
    file.value = fileObj
    fileType.value = fileObj.name
      .substring(fileObj.name.lastIndexOf('.') + 1)
      .toLowerCase()
    if (props.listType === 'picture-card') {
      imgDialogVisible.value = true
    } else {
      if (['txt', 'pdf', 'xlsx', 'xls', 'docx'].includes(fileType.value)) {
        dialogVisible.value = true
      } else if (['png', 'jpg', 'jpeg', 'gif'].includes(fileType.value)) {
        imgDialogVisible.value = true
      } else {
        abTools.downFileBySteam(fileObj)
      }
    }
  }

  //如果是单文件则覆盖操作
  const handleChange = (file: UploadFile, relFileList: UploadFile[]) => {
    // debugger
    if (file.status == 'success') {
      if (!props.multiple) {
        if (relFileList.length > 1) {
          relFileList.splice(0, 1)
        }
      }
      fileList.value = relFileList

      if (
        fileList.value &&
        fileList.value.length > 0 &&
        (!props.multiple ||
          (props.limit != 0 && fileList.value.length == props.limit))
      ) {
        hideUpload.value = true
      }
    }
  }

  const handleRemove = (file: UploadFile, fileListArr: UploadFile[]) => {
    if (fileListArr && fileListArr.length > 0) {
      modelValue.value = transformation(fileListArr)
    } else {
      modelValue.value = ''
    }

    if (
      !fileList.value ||
      fileList.value.length == 0 ||
      (!props.multiple && fileList.value && fileList.value.length >= 1) ||
      (props.limit != 0 && fileList.value.length <= props.limit)
    ) {
      hideUpload.value = false
    }
  }

  // 文件上传时的方法
  const handleExceed = () => {
    if (props.limit)
      ElMessage.warning(
        abT(
          'page.common.uploadMaximum',
          '文件数量超出数量限制, 最大数量为{a} 个',
          { a: props.limit }
        )
      )
  }

  // 文件上传失败
  const handleError = () => {
    ElMessage.warning(
      abT('page.common.uploadFailed', '文件上传失败,请稍后再试')
    )
  }
  //校验文件大小和类型,,同时筛选文件,如果没有类型则报错
  const beforeUpload = (file: UploadRawFile) => {
    if (props.max) {
      //获取上传文件大小
      if (file.size > props.max * 1024) {
        ElMessage.warning(
          t('page.common.uploadMaxSize', {
            a: abFormat.renderSize(`${file.size}`),
            b: props.max * 1024,
          })
        )
        return false
      }
    }
    if (props.type) {
      //获取文件类型
      const fileExtName = file.name
        .substring(file.name.lastIndexOf('.') + 1)
        .toLowerCase()

      if (!props.type.split(',').find((s) => s.toLowerCase() == fileExtName)) {
        ElMessage.warning(
          t('page.common.uploadLimitType', { a: props.type.split(',') })
        )

        return false
      }
    }
    return true
  }

  //判断入参为json字符串还是对象
  const isJSON = (str: any) => {
    if (Array.isArray(str)) {
      return false
    }
    try {
      const obj = JSON.parse(str)
      if (typeof obj == 'object' && obj) {
        return true
      } else {
        return false
      }
    } catch (e) {
      console.log(`error:${str}!!!${e}`)
      return false
    }
  }

  onMounted(() => {
    init()
  })

  const transformation = (fileArray: any[]) => {
    return JSON.stringify(
      fileArray.map((s) => ({
        name: s.name,
        id: s.id,
        size: s.size,
      }))
    )
  }

  const init = () => {
    let fileArray
    if (props.modelValue && props.modelValue.length > 0) {
      if (isJSON(props.modelValue)) {
        fileArray = JSON.parse(props.modelValue)
      } else {
        fileArray = props.modelValue
      }
      const arr = [] as any[]

      fileArray.forEach((element: any, index: any) => {
        if (element.id) {
          element.url = sysApi.sysFile.getViewFileUrl(element.id)
          arr.push(element)
        }
      })
      fileList.value = arr
    } else {
      fileList.value = undefined
    }
    //判断是否自动展开预览对话框，如果是预览第一个文件
    if (props.isAutoPopup && fileArray.length > 0) {
      handlePreview(fileArray[0])
    }
    //1单选下fileList有值时隐藏
    //2只读下隐藏
    //3禁用下隐藏
    //4有最大限制数，并且fileList的数量大于等于最大限制时隐藏
    if (
      (fileList.value && fileList.value.length > 0 && !props.multiple) ||
      props.disabled ||
      (props.limit != 0 &&
        fileList.value &&
        fileList.value.length >= props.limit)
    ) {
      hideUpload.value = true
    }
  }

  watch(
    () => dialogVisible.value,
    (newValue) => {
      if (!newValue && props.isAutoPopup) {
        emit('onFileClose', false)
      }
    }
  )

  watch(
    () => props.modelValue,
    (newValue) => {
      if (!newValue) {
        resetFileList()
      } else if (temp != newValue) {
        init()
      }
      temp = newValue
    }
  )

  watch(
    () => [disabled.value, multiple.value, limit.value],
    () => {
      console.log('disabled.value, multiple.value, limit.value')
      if (
        (fileList.value && fileList.value.length > 0 && !props.multiple) ||
        props.disabled ||
        (props.limit != 0 &&
          fileList.value &&
          fileList.value.length >= props.limit)
      ) {
        hideUpload.value = true
      } else {
        hideUpload.value = false
      }
    }
  )

  const resetFileList = () => {
    fileList.value = []
    hideUpload.value = false
  }

  defineExpose({
    resetFileList,
  })
</script>

<style lang="scss" scoped>
  :deep(.el-upload-list) {
    width: 100%;
    min-width: 150px;
    max-width: 350px;
  }

  :deep(.hide .el-upload--picture-card) {
    display: none;
  }

  :deep(.logotype .el-upload-list__item-status-label) {
    display: none;
  }

  :deep(.hideButton .el-upload) {
    display: none;
    .el-upload--text {
      margin-top: 0;
    }
  }

  :deep(.hideButton .el-upload-list) {
    margin-top: 0;
  }
</style>

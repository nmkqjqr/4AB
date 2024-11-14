<template>
  <div
    v-if="props.permission !== 'n'"
    :class="formField.validateError ? 'ab-is-error' : ''"
    style="width: 100%"
  >
    <el-tooltip v-bind="validateTips">
      <el-upload
        ref="uploadRef"
        v-bind="$attrs"
        :accept="props.docType"
        action="#"
        :before-remove="beforeRemove"
        class="onlineDocUpload"
        :disabled="props.permission === 'r' || props.disabled"
        :file-list="pageData.fileList"
        :http-request="uploadFn"
        :limit="props.docMax"
        list-type="text"
        :multiple="props.multiple === 1"
        :on-error="handleError"
        :on-exceed="handleExceed"
        :on-preview="handlePreview"
        :on-progress="handleProgress"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
      >
        <template #trigger v-if="props.permission !== 'r' && !props.disabled">
          <el-button
            :disabled="disabled"
            v-bind="$attrs"
            :icon="Upload"
            size="small"
            type="primary"
          >
            {{ $abT('abform.onlineDoc.uploadDocuments', '上传文档') }}
          </el-button>
        </template>
        <template #tip v-if="props.permission != 'r' && !props.disabled">
          <el-button
            :disabled="disabled"
            v-bind="$attrs"
            icon="Edit"
            size="small"
            style="margin-bottom: 5px; margin-left: 5px"
            type="primary"
            @click="createAndOpenFile"
          >
            {{ $abT('abform.onlineDoc.createDocuments', '创建新文档') }}
          </el-button>
        </template>
      </el-upload>
    </el-tooltip>
    <el-progress
      v-if="pageData.showProgress"
      :percentage="pageData.loadProgress"
    />
    <div
      v-if="
        pageData.showDocContent && pageData.docUrl && props.showType === 'inner'
      "
    >
      <div>
        <iframe
          v-if="pageData.docUrl"
          :id="webofficeIframeId"
          :src="pageData.docUrl"
          :style="{
            width: `${props.innerStyle.width}px`,
            height: `${props.innerStyle.height}px`,
            margin: '0',
            border: '0',
          }"
        ></iframe>
      </div>
    </div>

    <el-dialog
      v-if="
        pageData.showDocContent &&
        pageData.docUrl &&
        props.showType === 'dialog'
      "
      v-model="pageData.showDocContent"
      :append-to-body="true"
      :destroy-on-close="true"
      :fullscreen="true"
      @closed="closeDoc(pageData.curerntFileId, false)"
    >
      <iframe
        :id="webofficeIframeId"
        :src="pageData.docUrl"
        :style="{
          width: '100%',
          height: '850px',
          margin: '0',
          border: '0',
        }"
      ></iframe>
      <template #footer>
        <el-button
          text
          type="default"
          @click="closeDoc(pageData.curerntFileId, false)"
        >
          {{ $abT('page.common.close', '关闭') }}
        </el-button>

        <el-button
          v-if="props.canReview && props.docType.startsWith('.doc')"
          text
          type="default"
          @click="testHear()"
        >
          {{ $abT('abform.onlineDoc.setRedHead', '套红头') }}
        </el-button>

        <el-button
          v-if="
            props.canReview &&
            pageData.docAppliction &&
            props.docType.startsWith('.doc')
          "
          text
          type="default"
          @click="acceptAllVersion()"
        >
          {{ $abT('abform.onlineDoc.cleanCopy', '清稿') }}
        </el-button>
        <el-button
          text
          type="default"
          @click="closeDoc(pageData.curerntFileId, true)"
        >
          {{ $abT('page.common.saveAndClose', '保存并关闭') }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts">
  export default { name: 'AbUpload' }
</script>
<script lang="ts" setup>
  import { request, sysApi } from '~/agilebpm/api'
  import * as abTools from '~/agilebpm/utils/ab-tools'
  import {
    ElButton,
    ElMessage,
    ElMessageBox,
    ElUpload,
    UploadInstance,
    UploadFiles,
    UploadFile,
  } from 'element-plus'
  import { Upload, Edit } from '@element-plus/icons-vue'
  import * as AbformValidate from '../form-base/ab-form-field-validate'
  import { docProps } from './abOnlineDoc'
  import { abT } from '@/i18n'

  const props = defineProps(docProps)
  const uploadRef = ref<UploadInstance>()

  //双向绑定
  const emit = defineEmits(['update:modelValue'])
  const value = useVModel(props, 'modelValue', emit)

  //表单校验管理对象
  const abFormMananger = inject('abForm') as AbFormProvide

  const pageData = reactive({
    showProgress: false,
    loadProgress: 0,
    userRight: '',
    saveFlag: false,
    docUrl: '',
    showDocContent: false,
    fileList: [] as any[],
    curerntFileId: '',
    docAppliction: null as any,
  })

  const validateTips = computed(() => {
    return AbformValidate.getValidateTips(formField)
  })

  // inputField相关的引用，用于表单abForm
  const formField: AbInputField = reactive({
    rules: props.rules,
    name: props.desc,
    modelValue: value,
    validateError: '',
    columnCode: props.columnCode,
    tableCode: props.tableCode,
  })

  const webofficeIframeId = computed(() => {
    if (pageData.curerntFileId) {
      return `doc${props.columnCode}`
    }
    return 'webofficeIframe'
  })

  //在线文档加载完成后获取 docAppliction
  window.addEventListener('message', (e) => {
    if (e.data === 'weboffice') {
      const docElement = document.getElementById(webofficeIframeId.value)
      if (!docElement) return
      const officeObject = docElement.contentWindow.YozoOffice
      if (!officeObject) return
      pageData.docAppliction = officeObject.Application
    }
  })

  const getFileInfo = (fileIds: string) => {
    if (!fileIds) {
      return
    }
    sysApi.sysFile.getFileInfo(fileIds).then((res: any) => {
      if (res.isOk && res.data && res.data.rows) {
        pageData.fileList.splice(0, pageData.fileList.length)
        res.data.rows.forEach((row: any) => {
          pageData.fileList.push({
            id: row.id,
            name: row.name,
            status: 'success',
          })
        })

        if (props.showType === 'inner') {
          if (
            pageData.curerntFileId &&
            pageData.curerntFileId !== pageData.fileList[0].id
          ) {
            //先关闭当前文档在打开新文档
            closeDoc(pageData.curerntFileId, false)
          }
          openFile(pageData.fileList[0].id)
        }
      }
    })
  }

  // 文件上传超出时的方法
  const handleExceed = (files: File[], fileList: UploadFile[]) => {
    if (props.docMax) {
      ElMessage.warning(
        abT('abform.onlineDoc.maxNum', '文件数量超出数量限制, 最大数量为{a}', {
          a: props.docMax,
        })
      )
    }
  }

  //设置水印
  watch(
    () => pageData.docAppliction,
    async () => {
      if (
        !pageData.docAppliction ||
        !props.showWatermark ||
        props.showWatermark === 0 ||
        !props.docType.startsWith('.doc') ||
        !props.watermark.text
      ) {
        return
      }
      if (!pageData.docAppliction.ActiveDocument) {
        ElMessage.warning(
          abT('abform.onlineDoc.openDocument', '请先打开文档！')
        )
      }

      const doc = pageData.docAppliction.ActiveDocument
      const watermark = doc.Watermark
      watermark.Type = props.watermark.type
      watermark.Text = await abTools.parseStrByFreeMarker(props.watermark.text)
      watermark.FontSize = props.watermark.fontSize

      watermark.Color = props.watermark.fontColor
      //是否倾斜
      watermark.Lean = 1

      document.getElementById(
        webofficeIframeId.value
      ).contentWindow.YozoOffice.Application.ActiveDocument.Watermark =
        watermark
    },
    { deep: true }
  )

  const testHear = async () => {
    //closeDoc(true)
    const res: any = await sysApi.sysFile.redModel(
      pageData.curerntFileId,
      '1671079324897865728'
    )
    if (res.isOk) {
      await sysApi.sysFile.closeFile({
        fileId: pageData.curerntFileId,
        saveFlag: true,
      })
      pageData.docUrl = ''
      //打开文档
      await openFile(pageData.curerntFileId)
      document
        .getElementById(webofficeIframeId.value)
        .contentWindow.location.reload()
    }
  }

  //文件上传
  const uploadFn = (options: any) => {
    const formData = new FormData()
    formData.append('file', options.file)
    formData.append('dicCode', 'default')
    request({
      url: sysApi.sysFile.uploadUrl,
      method: 'post',
      data: formData,
      timeout: 60000,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress(progressEvent) {
        const complete = parseInt(
          `${((progressEvent.loaded / progressEvent.total) * 100) | 0}`,
          10
        )
        options.onProgress({ percent: complete })
      },
    })
      .then(
        (result: { data: any }) => {
          if (result.data) {
            options.onSuccess(result.data)
          }
        },
        () => {
          ElMessage.error(
            abT('page.common.uploadFailed', '文件上传失败,请稍后再试')
          )
        }
      )
      .catch((err: any) => {
        if (err) {
          options.onError(err)
          ElMessage.error(
            abT('page.common.uploadFailed', '文件上传失败,请稍后再试')
          )
        }
      })
  }

  const openFile = (fileId: string) => {
    const right = props.permission === 'w' ? 0 : 1
    const buttonPermission = {
      re_view: props.canReview,
      yozo_WP_showRevision: props.canReview,
      yozo_WP_screening_more: props.canReview,
      yozo_WP_reviseAccept_btn: props.canReview,
      yozo_WP_reviseRefuse_btn: props.canReview,
      yozo_WP_reviseRefuse_more: props.canReview,
      yozo_WP_reviseAccept_more: props.canReview,
      yozo_WP_reviseView: props.canReview,
      download: 0,
    }
    const param = {
      fileId: fileId,
      userRight: right,
      userMenuPermission: JSON.stringify(buttonPermission),
    }

    sysApi.sysFile.openFile(param).then(
      (result: any) => {
        if (result.isOk && result.data) {
          pageData.curerntFileId = fileId
          //pageData.docUrl = sysApi.sysFile.getOnlineDocUrl(result.data)
          pageData.docUrl = result.data
          pageData.showDocContent = true
        } else {
          ElMessage.error(
            `${abT('abform.onlineDoc.openDocumentFail', '打开文档失败！')}${
              result.msg
            }`
          )
        }
      },
      () => {
        ElMessage.error(
          abT('abform.onlineDoc.openDocumentFail', '打开文档失败！')
        )
      }
    )
  }

  // 点击打开文件
  const handlePreview = (uploadFile: any) => {
    if (pageData.curerntFileId && pageData.curerntFileId === uploadFile.id) {
      ElMessage.warning(abT('abform.onlineDoc.documentHasOpen', '文档已经打开'))
      return
    }
    if (pageData.curerntFileId && pageData.curerntFileId !== uploadFile.id) {
      //先关闭当前文档在打开新文档
      closeDoc(pageData.curerntFileId, false)
    }
    openFile(uploadFile.id)
  }

  const createAndOpenFile = () => {
    if (
      (props.multiple === 0 && pageData.fileList.length >= 1) ||
      (props.multiple === 1 && pageData.fileList.length >= props.docMax)
    ) {
      ElMessage.warning(
        abT('abform.onlineDoc.overMaxNum', '文件个数已超出限制')
      )
      return
    }
    ElMessageBox.prompt(
      abT('abform.onlineDoc.enterName', '请输入文件名'),
      abT('abform.onlineDoc.documentInfo', '文件信息'),
      {
        confirmButtonText: abT('page.common.ok', '确定'),
        closeOnClickModal: false,
        cancelButtonText: abT('page.common.cancel', '取消'),
        inputPattern: /\S/,
        inputErrorMessage: abT(
          'abform.onlineDoc.fileNameNotEmpty',
          '文件名不能为空'
        ),
      }
    )
      .then(({ value }) => {
        const right = props.permission === 'w' ? 0 : 1
        const buttonPermission = {
          re_view: props.canReview,
        }
        const param = {
          userRight: right,
          fileName: `${value}${props.docType}`,
          userMenuPermission: JSON.stringify(buttonPermission),
        }
        uploadRef.value.handleStart(new File([''], `${value}${props.docType}`))
        uploadRef.value.submit()
      })
      .catch(() => {})
  }

  //显示进度条
  const handleProgress = (event: any, file: any, fileList: any) => {
    pageData.showProgress = true
    pageData.loadProgress = parseInt(event.percent)
    if (pageData.loadProgress >= 100) {
      pageData.loadProgress = 100
      setTimeout(() => {
        pageData.showProgress = false
      }, 1000)
    }
  }

  //文件删除，删除后台文档
  const handleRemove = (uploadFile: any, uploadFiles: UploadFiles) => {
    const ids = [] as any[]
    uploadFiles.forEach((item: any) => {
      ids.push(item.id)
    })

    //关闭已打开家的文档
    closeDoc(pageData.curerntFileId, false)
    sysApi.sysFile.deleteFile(uploadFile.id)
    emit('update:modelValue', ids.join(','))
  }

  // 文件上传失败
  const handleError = (files: File[], fileList: UploadFile[]) => {
    ElMessage.warning(`文件上传失败,请稍后再试`)
  }

  // 文件删除前,弹出框
  const beforeRemove = (file: UploadFile, fileList: UploadFile[]) => {
    if (file && file.status === 'success') {
      return ElMessageBox.confirm(
        abT('page.common.delMsg', '确定删除 {a} 吗？', { a: file.name }),
        {
          confirmButtonText: abT('page.common.ok', '确定'),
          cancelButtonText: abT('page.common.cancel', '取消'),
        }
      ).then(
        () => true,
        () => false
      )
    }
  }

  const acceptAllVersion = () => {
    const activeDocument = pageData.docAppliction.ActiveDocument
    if (!activeDocument) {
      ElMessage.warning(abT('abform.onlineDoc.openDocument', '请先打开文档！'))
    }
    if (activeDocument.Revisions.Count > 1) {
      activeDocument.AcceptAllRevisions()
    }
  }

  onMounted(() => {
    AbformValidate.addField2Form(formField, props.permission, abFormMananger)
    if (props.modelValue) {
      getFileInfo(props.modelValue)
    }
  })

  // 移除校验
  onBeforeUnmount(() => {
    abFormMananger.removeField(formField)
  })

  watch(
    () => props.modelValue,
    (newValue: any) => {
      if (!newValue) {
        pageData.fileList.splice(0, pageData.fileList.length)
      } else {
        getFileInfo(newValue)
      }
    }
  )

  // 动态权限必填切换后，切换校验
  watch(
    () => props.permission,
    (newValue) => {
      // 如果校验 由非必填修改为了必填，此时修改校验功能
      if (newValue && newValue === 'b') {
        AbformValidate.changeRequired(formField, true)
      } else {
        AbformValidate.changeRequired(formField, false)
      }
    }
  )

  const closeDoc = (fileId: string, saveFlag: boolean) => {
    const param = {
      fileId: fileId,
      saveFlag: saveFlag,
    }
    sysApi.sysFile.closeFile(param).then(
      (result: any) => {
        pageData.showDocContent = false
        pageData.docUrl = ''
        if (!result.isOk || !result.data) {
          ElMessage.error(
            `${abT('abform.onlineDoc.closeDocumentFail', '关闭文档失败!')}${
              result.msg
            }`
          )
        }
        pageData.curerntFileId = ''
      },
      () => {
        ElMessage.error(abT('abform.onlineDoc.closeDocumentFail','关闭文档失败'))
      }
    )
  }

  //文件上传成功
  const handleSuccess = (
    response: any,
    uploadFile: any,
    uploadFiles: UploadFiles
  ) => {
    uploadFile.id = response
    const ids = [] as any[]
    uploadFiles.forEach((item: any) => {
      ids.push(item.id)
    })
    emit('update:modelValue', ids.join(','))
  }
</script>

const

<style lang="scss" scoped>
  .onlineDocUpload {
    width: 200px;
  }

  :deep(.hide .el-upload--picture-card) {
    display: none;
  }
</style>

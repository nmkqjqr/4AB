<template>
  <div v-if="props.permission !== 'n'" @blur="inputBlur">
    <el-image
      v-if="props.modelValue && info.imageUrl && props.permission != 'n'"
      :alt="$abT('abform.signatureOpinion.sign', '签字')"
      :src="info.imageUrl"
      style="width: 300px; height: 150px"
    />

    <el-tooltip v-bind="validateTips">
      <div>
        <el-button
          v-if="props.permission === 'w' || props.permission === 'b'"
          :disabled="props.disabled"
          :icon="EditPen"
          type="primary"
          @click="showMadel()"
        >
          {{ $abT('abform.signatureOpinion.sign', '签字') }}
        </el-button>

        <el-button
          v-if="
            info.imageUrl &&
            (props.permission === 'w' || props.permission === 'b')
          "
          :icon="Delete"
          type="warning"
          @click="remove()"
        >
          {{ $abT('page.common.del', '删除') }}
        </el-button>
      </div>
    </el-tooltip>
    <el-dialog
      :destroy-on-close="true"
      v-model="info.drawing"
      :title="$abT('abform.signatureOpinion.sign', '签字')"
      width="660px"
    >
      <canvas
        v-if="info.drawing"
        :id="canvasId"
        height="360"
        width="600"
      ></canvas>

      <template #footer>
        <el-button
          v-if="!props.onlyWrite"
          type="primary"
          @click="getSignature()"
        >
          {{
            $abT('abform.signatureOpinion.obtainexistSignature', '获取已有签名')
          }}
        </el-button>
        <el-button type="primary" @click="save">
          {{ $abT('page.common.save', '保存') }}
        </el-button>
        <el-button type="warning" @click="info.drawing = false">
          {{ $abT('page.common.cancel', '取消') }}
        </el-button>
        <el-button @click="undo">
          {{ $abT('page.common.revoke', '撤销') }}
        </el-button>
        <el-button @click="clear">
          {{ $abT('page.common.clear', '清除') }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ElMessage } from 'element-plus'
  import SignaturePad from 'signature_pad'
  import { EditPen, Delete } from '@element-plus/icons-vue'
  import { signatureProps, signatureInfo } from './signature'
  import { request, sysApi, abStoreAdaptor } from '@agilebpm/api'
  import * as AbformValidate from '../form-base/ab-form-field-validate'
  import { abUtil } from '~/agilebpm'
  import { abT } from '@/i18n'

  const props = defineProps(signatureProps)
  const info: any = reactive({
    signatureId: '',
    drawing: false,
    imageUrl: '',
    drawHeight: '',
    dialogIndex: '',
    newSignaturePad: null,
    config: {
      penColor: '#000000', //笔刷颜色
      minWidth: 3, //最小宽度
    },
  })
  const canvasId = ref(abUtil.AbRandom.GetRandomStr(6))

  // 是否只读展示纯文本
  const abFormMananger = inject('abForm') as AbFormProvide
  const readonlyShowText =
    props.readShowText != null
      ? props.readShowText
      : abFormMananger?.readonlyShowText

  /**
   * inputField相关的引用，用于表单abForm
   */
  const abInputField: AbInputField = reactive({
    rules: props.rules,
    name: props.desc,
    modelValue: info.signatureId,
    validateError: '',
    columnCode: props.columnCode,
    tableCode: props.tableCode,
  })

  const validateTips = computed(() => {
    return AbformValidate.getValidateTips(abInputField)
  })

  /**
   * 【校验相关】
   */
  const inputBlur = () => {
    AbformValidate.blurValidate(abInputField)
  }

  const emit = defineEmits(['update:modelValue', 'aboutSignature', 'change'])
  const showMadel = () => {
    if (info.newSignaturePad) {
      info.newSignaturePad = null
    }
    info.drawing = true
  }

  //当前用户信息
  const userInfo = abStoreAdaptor().getAbUser

  const getCanvas = () => {
    const canvas = document.querySelector(`#${canvasId.value}`)
    info.newSignaturePad = new SignaturePad(canvas, info.config)
  }
  const remove = () => {
    info.imageUrl = ''
    info.signatureId = ''
    abInputField.modelValue = info.signatureId
    emit('change', '')
    emit('update:modelValue', '')
  }
  const undo = () => {
    // this.$refs.signaturePad.undoSignature();
    const record = info.newSignaturePad.toData()
    if (record) {
      return info.newSignaturePad.fromData(record.slice(0, -1))
    }
  }
  const save = () => {
    const isEmpty = info.newSignaturePad.isEmpty()
    if (isEmpty) {
      ElMessage.warning(abT('abform.signatureOpinion.pleaseSign', '请签字'))
      return
    }

    const form = new window.FormData()
    const blobData = dataURItoBlob(info.newSignaturePad.toDataURL())
    form.append('file', blobData, `${props.columnName}.png`)
    request({
      url: sysApi.sysFile.uploadUrl,
      method: 'post',
      data: form,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then((response: any) => {
      if (response.isOk) {
        info.signatureId = response.data
        emit('aboutSignature', info.signatureId)
        info.drawing = false
        setImageUrl()
        emit('change', info.signatureId)
        emit('update:modelValue', info.signatureId)
      } else {
        ElMessage.warning(
          abT('abform.signature.saveFailed', '保存失败，请联系管理员。')
        )
      }
    })
  }
  const clear = () => {
    // this.$refs.signaturePad.clearSignature();
    info.newSignaturePad.clear()
  }
  const dataURItoBlob = (dataURI: string) => {
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0] // mime类型
    const byteString = atob(dataURI.split(',')[1]) //base64 解码
    const arrayBuffer = new ArrayBuffer(byteString.length) //创建缓冲数组
    const intArray = new Uint8Array(arrayBuffer) //创建视图

    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i)
    }
    return new Blob([intArray], { type: mimeString })
  }
  const setImageUrl = () => {
    if (info.signatureId) {
      abInputField.modelValue = info.signatureId
      info.imageUrl = sysApi.sysFile.getViewFileUrl(info.signatureId)
    }
  }
  const getSignature = () => {
    if (userInfo.signature) {
      setImageUrl()
      emit('change', userInfo.signature)
      emit('update:modelValue', userInfo.signature)
      info.drawing = false
    } else {
      ElMessage.warning(
        abT(
          'abform.signature.noSignatureMsg',
          '您没有个人签名信息，请在个人信息中添加'
        )
      )
    }
  }
  watch(
    () => info.drawing,
    (val) => {
      if (val && !info.newSignaturePad) {
        nextTick(function () {
          getCanvas()
        })
      }
    }
  )
  watch(
    () => props.modelValue,
    (val) => {
      if (val) {
        info.signatureId = val
        abInputField.modelValue = info.signatureId
        setImageUrl()
      }
    },
    { immediate: true, deep: true }
  )

  // 移除校验
  onBeforeUnmount(() => {
    abFormMananger.removeField(abInputField)
    info.imageUrl = null
  })

  onMounted(() => {
    //加入表单校验
    AbformValidate.addField2Form(abInputField, props.permission, abFormMananger)
  })

  // 动态权限必填切换后，切换校验
  watch(
    () => props.permission,
    (newValue) => {
      // 如果校验 由非必填修改为了必填，此时修改校验功能
      if (newValue && newValue === 'b') {
        AbformValidate.changeRequired(abInputField, true)
      } else {
        AbformValidate.changeRequired(abInputField, false)
      }
    }
  )
</script>

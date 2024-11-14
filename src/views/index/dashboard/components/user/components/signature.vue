<template>
  <div>
    <el-image
      v-if="info.imageUrl"
      v-show="props.isShow"
      alt="签字"
      :src="info.imageUrl"
      style="width: 300px; height: 150px"
    />

    <el-button :icon="EditPen" type="primary" @click="showMadel()">
      签名
    </el-button>

    <el-dialog v-model="info.drawing" title="签字" width="50%">
      <div v-if="info.drawing" style="width: 660px; height: 360px">
        <canvas class="canvasId" height="360" width="660"></canvas>
      </div>
      <template #footer>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="warning" @click="info.drawing = false">取消</el-button>
        <el-button @click="undo">撤销</el-button>
        <el-button @click="clear">清除</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { sysApi } from '~/agilebpm'
  import { ElMessage } from 'element-plus'
  import SignaturePad from 'signature_pad'
  import { EditPen, Delete } from '@element-plus/icons-vue'
  import { request } from '~/agilebpm'

  const props = defineProps({
    // 字段名字
    columnName: {
      type: String,
      default: '签字',
    },
    modelValue: {
      type: String,
    },
    isShow: {
      type: Boolean,
      default: false,
    },
  })

  const info: any = reactive({
    signatureId: '',
    drawing: false,
    imageUrl: '',
    drawHeight: '',
    dialogIndex: '',
    imgBaseUrl: sysApi.sysFile.downloadUrl,
    newSignaturePad: null,
    config: {
      penColor: '#000000', //笔刷颜色
      minWidth: 3, //最小宽度
    },
    uploadImgUrl: sysApi.sysFile.uploadUrl,
  })

  const emit = defineEmits(['update:modelValue', 'aboutSignature'])

  const showMadel = () => {
    if (info.newSignaturePad) {
      info.newSignaturePad = null
    }
    info.drawing = true
  }

  const getCanvas = () => {
    const canvas = document.querySelector('.canvasId')
    info.newSignaturePad = new SignaturePad(canvas, info.config)
  }

  const undo = () => {
    const record = info.newSignaturePad.toData()
    if (record) {
      return info.newSignaturePad.fromData(record.slice(0, -1))
    }
  }
  const save = () => {
    const isEmpty = info.newSignaturePad.isEmpty()
    if (isEmpty) {
      ElMessage.warning('请签字')
      return
    }

    const form = new window.FormData()
    const blobData = dataURItoBlob(info.newSignaturePad.toDataURL())
    form.append('file', blobData, `${props.columnName}.png`)
    request({
      url: info.uploadImgUrl,
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
        emit('update:modelValue', info.signatureId)
      } else {
        ElMessage.warning('保存失败，请联系管理员。')
      }
    })
  }

  const clear = () => {
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
      request({
        url: info.imgBaseUrl +'?'+ info.signatureId,
        method: 'get',
        responseType: 'blob',
      }).then(
        (result: any) => {
          const blob = new Blob([result])
          info.imageUrl = window.URL.createObjectURL(blob)
        },
        () => {
          ElMessage.warning('个人签名获取失败，请联系管理员')
        }
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
        setImageUrl()
      }
    },
    { immediate: true, deep: true }
  )
</script>

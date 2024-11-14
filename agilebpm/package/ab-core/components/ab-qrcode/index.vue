<template>
  <el-space direction="vertical" :size="0" v-if="props.text">
    <canvas :id="canvasId"></canvas>
    <span v-if="props.showText" class="text">{{ props.text }}</span>
  </el-space>
</template>
<script setup lang="ts">
  import * as abUtil from '~/agilebpm/utils/ab-util'
  import { ElMessage } from 'element-plus'
  const props = defineProps({
    //二维码的内容
    text: { type: String, required: true },
    //是否显示二维码文本
    showText: { type: Boolean, required: false, default: false },
    //二维码的配置
    codeConfig: { type: Object, required: false, default: () => {} },
  })

  const canvasId = computed(() => {
    return `bar${props.text}` + Math.random()
  })

  const generateCode = () => {
    const docId = canvasId.value
    const canvas = document.getElementById(docId)
    abUtil.generateQrCode(
      canvas,
      props.text,
      (error) => {
        ElMessage.error(`二维码生成失败！${error}}`)
      },
      props.codeConfig
    )
  }

  onMounted(() => {
    nextTick(() => {
      generateCode()
    })
  })

  watch(
    () => props.text,
    () => {
      nextTick(() => {
        generateCode()
      })
    }
  )

  watch(
    () => props.codeConfig,
    () => {
      nextTick(() => {
        generateCode()
      })
    },
    { deep: true }
  )
</script>

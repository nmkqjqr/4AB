<template>
  <el-space direction="vertical" :size="0">
    <canvas :id="canvasId"></canvas>
    <span>{{ props.text }}</span>
  </el-space>
</template>
<script setup lang="ts">
  import * as abUtil from '~/agilebpm/utils/ab-util'
  const props = defineProps({
    //条形码的内容
    text: { type: String, required: true },
    //是否显示条形码文本
    showText: { type: Boolean, required: false, default: false },
    //条形码的配置
    codeConfig: { type: Object, required: false, default: () => {} },
  })

  const generateCode = () => {
    nextTick(() => {
      const docId = canvasId.value
      const canvas = document.getElementById(docId)
      abUtil.generateBarCode(canvas, props.text, props.codeConfig)
    })
  }

  const canvasId = computed(() => {
    return `bar${props.text}` + Math.random()
  })

  onMounted(() => {
    generateCode()
  })

  watch(
    () => props.text,
    () => {
      generateCode()
    }
  )

  watch(
    () => props.codeConfig,
    () => {
      generateCode()
    },
    { deep: true }
  )
</script>

<template>
  <el-button type="primary" @click="open">配置</el-button>
</template>
<script setup lang="ts">
  import { reactive } from 'vue'

  const props = defineProps({
    modelValue: { required: true, type: Object }, // 赋值目标对象
  })

  const info: any = reactive({
    dialogVisible: false,
    options: [],
    BizValidatorMap: null,
  })

  const open = () => {
    info.dialogVisible = true
    alert('待开发')
  }
</script>

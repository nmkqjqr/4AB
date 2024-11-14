<template>
  <div>
    <el-form-item label="common">
      <el-input v-model="config.common" />
    </el-form-item>
    <el-form-item label="脚本">
      <el-input v-model="config.script" />
    </el-form-item>
  </div>
</template>
<script setup lang="ts">
  import { defineProps, PropType, toRefs } from 'vue'
  const props = defineProps({
    config: {
      required: true,
      type: Object as any,
    },
  })
  const { config } = toRefs(props)

  onMounted(() => {
    if (!config.value.control) {
      config.value.control = {}
    }
  })
</script>

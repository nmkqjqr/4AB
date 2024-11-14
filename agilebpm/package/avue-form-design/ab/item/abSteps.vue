<template>
  <el-steps
    :active="activeRef"
    finish-status="success"
    process-status="finish"
    simple
  >
    <el-step v-for="s in item.param" :key="s.value" :title="s.label" />
  </el-steps>
</template>

<script lang="ts">
  export default {
    name: 'abSteps',
  }
</script>

<script lang="ts" setup>
  const props = defineProps({ item: { type: Object, required: true } })
  const { item } = toRefs(props)
  const activeRef = ref(0)
  watch(
    () => item.value.param,
    () => (activeRef.value = item.value.param.findIndex((s: any) => s.default)),
    {
      deep: true,
      immediate: true,
    }
  )
</script>
<style lang="scss" scoped>
  :deep(.el-step.is-simple .el-step__head) {
    font-size: 20px;
  }
</style>

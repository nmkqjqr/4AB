<template>
  <el-row v-bind="$attrs">
    <slot></slot>
  </el-row>
</template>
<script lang="ts" setup>
  // 可以商用 el-row 的属性
  const props = defineProps({})
</script>
<style lang="scss" scoped>
  .marginTop24 {
    margin-top: 24px;
  }
</style>

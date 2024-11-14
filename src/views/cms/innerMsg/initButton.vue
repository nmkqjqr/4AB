<template>
  <el-button @click="detail"><slot></slot></el-button>
</template>

<script lang="ts" setup>
  const props = defineProps({
    search: { type: Function, default: () => {} },
  })
  const emit = defineEmits(['assignment'])
  const detail = () => emit('assignment', props.search)
</script>

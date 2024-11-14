<template>
  <el-button
    v-if="['b', 'w'].includes(permission)"
    class="move-btn"
    :icon="Sort"
    size="small"
    type="primary"
  >
    <slot></slot>
  </el-button>
</template>

<script setup lang="ts">
  import { Sort } from '@element-plus/icons-vue'
  const props = defineProps({
    permission: {
      type: String,
      default: 'w',
    },
  })
</script>

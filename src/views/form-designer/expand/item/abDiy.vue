<template>自定义控件内容：{{ item.zdy }}</template>

<script lang="ts">
  export default {
    name: 'AbDiy',
  }
</script>

<script lang="ts" setup>
  import { PropType, defineProps } from 'vue'
  import { Search } from '@element-plus/icons-vue'
  const props = defineProps({
    item: {
      type: Object,
      required: true,
    },
  })
</script>

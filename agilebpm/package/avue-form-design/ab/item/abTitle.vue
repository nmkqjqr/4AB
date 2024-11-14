<template>
  <p
    :style="{
      margin:'0px',
      width: '100%',
      'font-weight': 700,
      'font-size': `${item.fontSize}px`,
      color: item.fontColor,
      'text-align': item.position,
    }"
  >
    {{ item.text }}
  </p>
</template>

<script lang="ts">
  export default {
    name: 'abTitle',
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

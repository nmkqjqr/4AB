<template>
  <ab-rich-editor
    v-model="item.defaultValue"
    :disabled="item.readOnly"
    :height="item.height"
    :max-height="item.maxHeight"
  />
</template>

<script lang="ts">
  export default {
    name: 'abEditor',
  }
</script>

<script lang="ts" setup>
  import { abRichEditor } from '@ab-core'
  const props = defineProps({ item: { type: Object, required: true } })
  const { item } = toRefs(props)
</script>

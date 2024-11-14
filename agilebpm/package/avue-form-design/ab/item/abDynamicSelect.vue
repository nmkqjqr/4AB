<template>
  <span style="width: 100%">
    <el-select
      v-model="value"
      :disabled="props.item.readOnly"
      :multiple="false"
      class="ab-input"
      :placeholder="placeholder"
    />
  </span>
</template>

<script lang="ts">
  export default {
    name: 'abDynamicSelect',
  }
</script>

<script lang="ts" setup>
  import { defineProps } from 'vue'

  const value = ref('')

  const props = defineProps({ item: { type: Object, required: true } })

  const placeholder = computed(() => {
    let result = '动态选择:'
    if (props.item.dialogName) {
      result = result + props.item.dialogName
    }
    return result
  })
</script>

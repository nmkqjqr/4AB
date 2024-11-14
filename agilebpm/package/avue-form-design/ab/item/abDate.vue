<template>
  <el-date-picker
    v-model="viewValue"
    :disabled="item.readOnly"
    :type="item.dateType"
    class="ab-input"
    :format="item.dateFormat"
    :placeholder="item.placeholder ? item.placeholder : '请输入' + item.label"
  />
</template>

<script lang="ts">
  export default {
    name: 'abDate',
  }
</script>

<script lang="ts" setup>
  import { defineProps } from 'vue'
  const props = defineProps({ item: { type: Object, required: true } })
  const viewValue = ref()

  watch(
    () => props.item.defaultValue,
    () => {
      if (props.item.defaultValue === '${currentDateTime}') {
        viewValue.value = new Date()
      } else {
        viewValue.value = props.item.defaultValue
      }
    },
    { immediate: true }
  )

  watch(
    () => props.item.defaultValue,
    () => {
      if (props.item.defaultValue === '${currentDateTime}')
        viewValue.value = new Date()
    },
    { immediate: true }
  )
</script>

<template>
  <el-select
    :disabled="item.readOnly"
    v-model="modelValue"
    :placeholder="item.placeholder ? item.placeholder : '请输入' + item.label"
    :multiple="'multiSelect' == item.type || item.multiple"
    class="ab-input"
  />
</template>

<script lang="ts">
  export default {
    name: 'abSelect',
  }
</script>

<script lang="ts" setup>
  const props = defineProps({ item: { type: Object, required: true } })
  const { item } = toRefs(props)
  const modelValue = ref()

  onMounted(() => {
    setName(item.value.defaultValueName)
  })

  watch(
    () => item.value.defaultValueName,
    (val) => setName(val)
  )

  watch(
    () => item.value.multiple,
    () => {
      setName(item.value.defaultValueName)
    }
  )

  const setName = (val: string) => {
    if (item.value.multiple || 'multiSelect' == item.value.type) {
      if (val) {
        modelValue.value = val.split(',').filter(Boolean)
      } else {
        modelValue.value = []
      }
    } else {
      if (val) {
        modelValue.value = val
      } else {
        modelValue.value = ''
      }
    }
  }
</script>

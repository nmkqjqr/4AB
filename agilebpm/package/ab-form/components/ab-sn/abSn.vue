<template>
  <span v-show="['b', 'w', 'r'].includes(permission)">
    {{ modelValue }}
  </span>
</template>

<script lang="ts" setup>
  const props = defineProps({
    modelValue: {
      type: Number,
      default: 0,
    },
    //操作权限
    permission: {
      type: String,
      default: 'w',
    },
    index: {
      type: Number,
      default: 0,
    },
    // 子表原数据
    subTable: {
      type: Array,
      default: () => [],
    },
    page: {
      type: Object,
      default: null,
    },
  })

  const emit = defineEmits(['update:modelValue'])

  onMounted(() => {
    emit('update:modelValue', calPageIndex())
  })

  watch(
    [() => props.subTable?.length, () => props.index],
    (newValue, oldValue) => {
      if (props.index + 1 != props.modelValue) {
        emit('update:modelValue', calPageIndex())
      }
    },
    { deep: true }
  )

  const calPageIndex = () => {
    if (!props.page) {
      return props.index + 1
    }
    return (props.page.currentPage - 1) * props.page.pageSize + props.index + 1
  }
</script>

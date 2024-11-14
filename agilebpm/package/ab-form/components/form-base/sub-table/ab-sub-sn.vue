<template>
  <span v-if="page">
    {{ index || 0 }}
  </span>
  <span v-else>{{ props.index + 1 }}</span>
</template>
<script lang="ts" setup>
  import * as abTools from '~/agilebpm/utils/ab-tools'

  const props = defineProps({
    // 子表原数据
    subTable: {
      type: Array,
      default: () => [],
    },
    page: {
      type: Object,
      default: null,
    },
    index: {
      type: Number,
      default: 0,
    },
  })

  const index = ref(1)

  onMounted(() => {
    if (!props.page) {
      return
    }

    // 计算当前页的起始序号 序号 = (当前页数 - 1) * 每页数量 + 数据在当前页的索引
    index.value = calPageIndex(props.index, props.page)

    watch(
      () => props.page,
      (newValue: any, oldValue: any) => {
        index.value = calPageIndex(props.index, props.page)
      },
      { deep: true }
    )

    watch(
      () => props.subTable?.length,
      (newValue: any, oldValue: any) => {
        index.value = calPageIndex(props.index, props.page)
      },
      { deep: true }
    )
  })

  const calPageIndex = (index: number, page: any = null) => {
    if (!page) {
      return index + 1
    }
    return (page.currentPage - 1) * page.pageSize + index + 1
  }
</script>

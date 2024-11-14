<template>
  <el-card shadow="hover">
    <echarts-view
      :code="props.componentCode"
      :height="props.componentHeight"
      :width="props.componentWidth"
    />
  </el-card>
</template>

<script setup lang="ts">
  import echartsView from '~/src/views/cms/homeComponent/components/echartsView.vue'

  const props = defineProps({
    //组件的code
    componentCode: {
      type: String,
      required: true,
    },
    //父组件的容器的宽度，用来实时更新echats宽度
    componentWidth: {
      type: Number,
      required: true,
    },
    //父组件的容器的宽度，用来实时更新echats宽度
    componentHeight: {
      type: Number,
      required: true,
    },
  })

  watch(
    () => props,
    () => {
      console.log(
        props.componentWidth,
        props.componentCode,
        props.componentHeight
      )
    },
    { deep: true }
  )
</script>

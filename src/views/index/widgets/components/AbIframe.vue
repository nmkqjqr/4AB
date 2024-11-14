<template>
  <div>
    <el-card shadow="hover">
      <iframe
        :src="props.componentObjName"
        :style="{
          width: '100%',
          height: 9 * props.componentHeight + 'px',
          margin: '0',
          border: '0',
        }"
      ></iframe>
    </el-card>
  </div>
</template>

<script setup lang="ts">
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
    componentObjName: {
      type: String,
      required: true,
    },
    //父组件的容器的宽度，用来实时更新echats宽度
    componentHeight: {
      type: Number,
      required: true,
    },
  })
</script>

<style scoped></style>

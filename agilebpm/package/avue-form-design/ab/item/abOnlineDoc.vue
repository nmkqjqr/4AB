<template>
  <el-button :icon="Upload" type="primary" :disabled="item.readOnly">
    在线文档
  </el-button>
</template>

<script lang="ts">
  export default {
    name: 'ab-online-doc',
  }
</script>

<script lang="ts" setup>
  import { Plus, Upload } from '@element-plus/icons-vue'
  //继承的属性data
  const props = defineProps({ item: { type: Object, required: true } })
  //将data内的属性转为响应式数据
  const { item } = toRefs(props)
</script>

<style scoped lang="scss"></style>

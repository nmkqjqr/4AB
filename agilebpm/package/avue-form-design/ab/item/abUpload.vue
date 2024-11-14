<template>
  <span>
    <ab-upload-file
      :disabled="item.readOnly"
      :dic-code="item.uploadType"
      v-model="item.defaultValue"
      :list-type="item.listType"
      :limit="item.maxLimit"
      :multiple="item.uploadMultiple ? true : false"
      :type="item.uploadTypeLimit"
      :hideButton="item.readOnly"
    />
  </span>
</template>

<script lang="ts">
  export default {
    name: 'ab-upload',
  }
</script>

<script lang="ts" setup>
  import { abUploadFile } from '@ab-core'
  //继承的属性data
  const props = defineProps({ item: { type: Object, required: true } })
  //将data内的属性转为响应式数据
  const { item } = toRefs(props)
</script>

<style scoped lang="scss">
  .avatar-uploader .el-upload {
    position: relative;
    overflow: hidden;
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    transition: var(--el-transition-duration-fast);
  }

  .avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
  }

  :deep(.el-upload--picture-card) {
    --el-upload-picture-card-size: 100px;
    box-sizing: border-box;
    display: inline-flex;
    justify-content: center;
    width: var(--el-upload-picture-card-size);
    height: var(--el-upload-picture-card-size);
    background-color: var(--el-fill-color-lighter);
    border: 1px dashed var(--el-border-color-darker);
    border-radius: 6px;
  }
</style>

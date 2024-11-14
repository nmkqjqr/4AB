<template>
  <el-form-item label="内容编辑">
    <el-button @click="dialogVisible = true"></el-button>
  </el-form-item>

  <el-dialog v-model="dialogVisible" title="内容编辑" width="90%">
    <ab-rich-editor
      v-model="data.defaultValue"
      :height="data.height"
      content-type="text"
    />
  </el-dialog>
</template>

<script lang="ts">
  export default {
    name: 'ab-content-config',
  }
</script>

<script lang="ts" setup>
  import { abRichEditor } from '@ab-core'
  //继承的属性data
  const props = defineProps({
    data: { type: Object, required: true },
    form: { type: Object, required: true },
  })
  //将data内的属性转为响应式数据
  const { data } = toRefs(props)

  const dialogVisible = ref(false)
</script>

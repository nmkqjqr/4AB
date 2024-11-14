<template>
  <el-form-item
    label="自定义属性"
    prop="zdy"
    :rules="[{ required: true, message: '必填' }]"
  >
    <el-input v-model="data.zdy" clearable placeholder="自定义属性" />
  </el-form-item>
</template>

<script lang="ts">
  export default {
    name: 'AbDiyConfig',
  }
</script>

<script lang="ts" setup>
  import { toRefs, defineProps } from 'vue'
  import { QuestionFilled } from '@element-plus/icons-vue'
  import * as abTools from '~/agilebpm/utils/ab-tools'
  //继承的属性data
  const props = defineProps({
    data: { type: Object, required: true },
    form: { type: Object, required: true },
  })
  //将data内的属性转为响应式数据
  const { data } = toRefs(props)
</script>

<template>
  <el-select
    v-bind="attrs"
    :model-value="props.modelValue ? props.modelValue.split(',') : []"
    multiple
    @change="change($event)"
  >
    <slot></slot>
  </el-select>
</template>

<script lang="ts">
  export default { name: 'AbMultiSelect' }
</script>

<!-- 
  将select多选的v-model是数组：[1,2,3] 转化成字符串"1,2,3"，自动继承父级参数，但默认多选
  eg：
  <ab-multi-select v-model="scope.row.ctrl.validRule">
    <el-option
      v-for="val in list"
      :key="val.key"
      :label="val.name"
      :value="val.key"
    />
  </ab-multi-select> 
-->
<script lang="ts" setup>
  import { useAttrs } from 'vue'

  const attrs = useAttrs()

  const props = defineProps({
    modelValue: {
      type: String,
      default: '',
    },
  })

  const emit = defineEmits(['update:modelValue', 'change'])

  const change = (e: any) => {
    emit('update:modelValue', e.join(','))
    emit('change', e.join(','))
  }
</script>

<template>
  <el-select
    v-model="item.defaultValue"
    :placeholder="placeholder"
    :disabled="item.readOnly"
    class="ab-input"
  >
    <el-option
      v-for="(item, index) in options"
      :key="index"
      :value="item.value"
      :label="item.label"
    ></el-option>
  </el-select>
</template>

<script lang="ts">
  export default {
    name: 'abCascaderSelect',
  }
</script>

<script lang="ts" setup>
  import { defineProps } from 'vue'
  import { bizApi } from '@agilebpm/api'
  import {} from '@element-plus/icons-vue'

  const props = defineProps({ item: { type: Object, required: true } })
  const options = ref([
    {
      value: '',
      label: '请选择',
      disabled: true,
    },
  ])

  const placeholder = computed(() => {
    let result = props.item.type === 'region' ? '区域选择' : '级联选择:'
    if (props.item.dialogName) {
      result = result + props.item.dialogName
    }
    return result
  })
</script>

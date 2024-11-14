<template>
  <el-tooltip
    class="box-item"
    :content="props.modelValue"
    effect="dark"
    placement="top"
    :visible="info.visible"
  >
    <el-input
      v-bind="$attrs"
      :model-value="props.modelValue"
      @input="emit('update:modelValue', $event)"
      @mouseenter="mouseenter"
      @mouseleave="info.visible = false"
    />
  </el-tooltip>
</template>

<script lang="ts">
  export default { name: 'AbTooltipInput' }
</script>

<script lang="ts" setup>
  import { onMounted } from 'vue'

  const props = defineProps({
    modelValue: {
      type: String,
      default: '',
    },
  })

  const emit = defineEmits(['update:modelValue'])

  const info: any = reactive({
    visible: false,
  })

  onMounted(() => {})

  const mouseenter = () => {
    if (props.modelValue) {
      info.visible = true
    }
  }
</script>

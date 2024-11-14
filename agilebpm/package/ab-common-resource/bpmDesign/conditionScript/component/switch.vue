<template>
  <span>
    <el-switch
      v-model="viewValue"
      v-bind="$attrs"
      :inactive-value="inactiveValue"
    />
  </span>
</template>

<script lang="ts" setup>
  const props = defineProps({
    //选中项绑定值:
    modelValue: {
      required: true,
    },
    //父组件传入唯一标识
    code: {
      type: String,
      default: '',
    },
    // 返回值是否是数字
    isNumber: {
      type: Boolean,
      default: false,
    },
    inactiveValue: {
      required: true,
    },
  })

  // emit 事件定义
  const emit = defineEmits(['update:modelValue'])

  const viewValue: any = useVModel(props, 'modelValue', emit)
  watch(
    () => props.code,
    () => {
      emit(
        'update:modelValue',
        props.isNumber ? Number(props.inactiveValue) : props.inactiveValue
      )
    }
  )
</script>

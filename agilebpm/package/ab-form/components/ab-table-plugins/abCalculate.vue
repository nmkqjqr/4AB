<!-- 函数计算组件实例
  计算结果会更新到 v-model上
  <ab-calculate v-model="data.xxx.xx" script="data.xxx + data.name" ></ab-calculate>
-->
<template><span></span></template>
<script lang="ts" setup>
  const props = defineProps({
    // eslint-disable-next-line vue/require-default-prop
    modelValue: {
      type: [Number, String, Date],
      required: true,
    },
    script: {
      type: [Number, String, Date],
      required: true,
    },
    decimals: {
      type: [Number],
      required: true,
    },
  })

  const emit = defineEmits(['update:modelValue'])
  watch(
    () => props.script,
    (value: any, oldvalue) => {
      if (value === 'not calculate') return
      // 计算后的日期无法感知自己是否为旧值，这里判断下，旧值则不赋值，防止触发新一轮计算
      if (
        value &&
        oldvalue &&
        value instanceof Date &&
        oldvalue instanceof Date
      ) {
        if (value.getTime() === oldvalue.getTime() || isNaN(value.getDate())) {
          return
        }
      }
      // 解决精度问题
      if (value && typeof value == 'number') {
        let numberStr = `${value}`

        if (numberStr.indexOf('.') != -1) {
          numberStr = `${parseFloat(numberStr).toFixed(props.decimals)}`
          // 赋值
          value = numberStr
        }
      }
      // 如果不是数字则返回 空
      if (value === Infinity || Number.isNaN(value)) value = ''

      emit('update:modelValue', value)
    },
    {
      immediate: true,
    }
  )
</script>

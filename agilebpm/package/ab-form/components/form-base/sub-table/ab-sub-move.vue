<template>
  <span ref="asm"></span>
</template>

<script setup lang="ts">
  import { Sort } from '@element-plus/icons-vue'
  import Sortable from 'sortablejs'
  import { abUtil } from '~/agilebpm'
  const props = defineProps({
    modelValue: {
      type: Array,
      required: true,
    },
    permission: {
      type: String,
      default: 'w',
    },
  })
  const emit = defineEmits(['update:modelValue'])
  const asm = ref()

  onMounted(() => {
    if (!['b', 'w'].includes(props.permission)) {
      return
    }
    const table = asm.value.parentElement.parentElement.querySelector('tbody')
    Sortable.create(table, {
      animation: 300,
      handle: '.move-btn',
      onEnd: (evt: any) => {
        const t = props.modelValue.splice(evt.oldIndex, 1)[0]
        props.modelValue.splice(evt.newIndex, 0, t)
        emit('update:modelValue', props.modelValue)
      },
    })
  })

  nextTick(() => {})
</script>

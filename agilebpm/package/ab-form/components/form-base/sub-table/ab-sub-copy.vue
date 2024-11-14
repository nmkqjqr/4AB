<template>
  <el-button
    v-if="['b', 'w'].includes(permission)"
    :icon="CopyDocument"
    size="small"
    type="primary"
    @click="copySub"
  >
    <slot></slot>
  </el-button>
</template>

<script setup lang="ts">
  import { CopyDocument } from '@element-plus/icons-vue'
  import * as abUtil from '~/agilebpm/utils/ab-util'

  const props = defineProps({
    // eslint-disable-next-line vue/require-default-prop
    modelValue: {
      type: Array,
    },
    index: {
      type: Number,
      default: null,
    },
    indexObj: {
      type: Object,
      default: null,
    },
    permission: {
      type: String,
      default: 'w',
    },
  })

  const emit = defineEmits(['update:modelValue'])

  const copySub = () => {
    const modelValue = props.modelValue
    if (modelValue && modelValue.length > 0) {
      if (props.index || props.index == 0) {
        const obj = JSON.parse(JSON.stringify(modelValue[props.index]))
        if (obj.hasOwnProperty('id')) {
          delete obj.id
        }
        if (obj.hasOwnProperty('$$abHashCode')) {
          delete obj['$$abHashCode']
        }
        modelValue.push(obj)
      }
      if (props.indexObj) {
        let indexD = 0
        modelValue.forEach((item: any, index: any) => {
          if (
            item === props.indexObj ||
            Object.entries(item).toString() ===
              Object.entries(props.indexObj).toString()
          ) {
            indexD = index
          }
        })
        const obj = JSON.parse(JSON.stringify(modelValue[indexD]))
        if (obj.hasOwnProperty('id')) {
          delete obj.id
        }
        if (obj.hasOwnProperty('$$abHashCode')) {
          delete obj['$$abHashCode']
        }
        modelValue.push(obj)
      }
    }
  }
</script>

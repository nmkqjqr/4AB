<template>
  <el-button
    v-if="['b', 'w'].includes(permission)"
    :icon="Delete"
    size="small"
    type="danger"
    @click="delSub"
  >
    <slot></slot>
  </el-button>
</template>

<script setup lang="ts">
  import { Delete } from '@element-plus/icons-vue'
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
  const delSub = () => {
    const modelValue = props.modelValue
    if (modelValue && modelValue.length > 0) {
      if(props.index || props.index == 0){
        modelValue.splice(props.index, 1)
      }
      if(props.indexObj){
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
        modelValue.splice(indexD, 1)
      } 
      emit('update:modelValue', modelValue)
    }
  }
</script>

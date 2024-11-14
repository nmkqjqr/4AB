<template>
  <el-button
    v-if="['b', 'w'].includes(permission)"
    :icon="Edit"
    size="small"
    type="primary"
    @click="editSub"
  >
    <slot></slot>
  </el-button>
</template>

<script setup lang="ts">
  import { Edit } from '@element-plus/icons-vue'
  import * as abUtil from '~/agilebpm/utils/ab-util'
  const abFormMananger = inject('abForm') as AbFormProvide
  const props = defineProps({
    // eslint-disable-next-line vue/require-default-prop
    modelValue: {
      type: Array,
      default: null,
    },
    indexObj: {
      type: Object,
      default: null,
    },
    index: {
      type: Number,
      default: null,
    },
    subTempData: {
      type: Object,
      required: true,
    },
    tablePath: {
      type: String,
      required: true,
    },
    itemObjStr: {
      type: String,
      required: true,
    },
    page: {
      type: Object,
      default: () => {
        return {}
      },
    },
    // 表校验子表的前缀，用于对弹窗内部的表单进行校验，如果无前缀则不进行校验
    validteSubPre: {
      type: String,
      default: '',
    },
    permission: {
      type: String,
      default: 'w',
    },
  })

  const emit = defineEmits(['update:modelValue'])
  const { subTempData,modelValue } = toRefs(props)
  let indexNumber = props.index

  const editSub = () => {
      const tablePath = props.tablePath
      const itemObjStr = props.itemObjStr
      if(props.page && props.page.currentPage){
        // 计算原始索引
        indexNumber = (props.page.currentPage - 1) * props.page.pageSize + props.index;
      }
      subTempData.value[itemObjStr] = abUtil.clone(modelValue.value[indexNumber])
      subTempData.value[`${tablePath}_Dialog`] = true
      subTempData.value[`${tablePath}_okFn`] = () => {
        // 如果无校验
        if (!props.validteSubPre) {
          setDialogOk(tablePath)
          return
        }
        // 校验 表单内的内容
        abFormMananger
          .doValidate(true, props.validteSubPre)
          .then((result: any) => {
            if (result == true) {
              setDialogOk(tablePath)
            }
          })
      }
  }

  const setDialogOk = (tableKey: string) => {
    // 关闭弹窗
    subTempData.value[`${tableKey}_Dialog`] = false
    // 对表单进行赋值
    for(let key in subTempData.value[props.itemObjStr]) {
      modelValue.value[indexNumber][key] = abUtil.clone(subTempData.value[props.itemObjStr][key])
    }
    emit('update:modelValue', modelValue.value)
  }
</script>

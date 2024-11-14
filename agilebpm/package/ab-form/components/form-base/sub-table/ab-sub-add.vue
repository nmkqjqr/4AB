<template>
  <el-button
    v-if="['b', 'w'].includes(permission)"
    :icon="Plus"
    size="small"
    type="primary"
    @click="addSub"
  >
    <slot></slot>
  </el-button>
</template>
<script setup lang="ts">
  import { Plus } from '@element-plus/icons-vue'
  import * as abUtil from '~/agilebpm/utils/ab-util'
  const abFormMananger = inject('abForm') as AbFormProvide

  const props = defineProps({
    modelValue: {
      type: Array,
      default: null,
    },
    //初始化数据
    initData: {
      type: Object,
      required: true,
    },
    //是否初始化第一条数据
    initFirstRow: {
      type: Boolean,
      default: false,
    },
    subTempData: {
      type: Object,
      required: true,
    },
    isSubtablemode: {
      type: Boolean,
      default: false,
    },
    tablePath: {
      type: String,
      default: '',
    },
    itemObjStr: {
      type: String,
      required: true,
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
  const { subTempData, modelValue } = toRefs(props)
  onMounted(() => {})

  const addSub = () => {
    if (props.isSubtablemode && props.tablePath && props.tablePath.length > 0) {
      const tablePath = props.tablePath
      const itemObjStr = props.itemObjStr
      subTempData.value[itemObjStr] = JSON.parse(JSON.stringify(props.initData)) //深copy
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
    } else {
      let list = props.modelValue
      if (!list) {
        list = abUtil.Arrays.newAbSubList()
        emit('update:modelValue', list)
      }
      const json = JSON.parse(JSON.stringify(props.initData)) //深copy
      list.push(json)
    }
  }

  const setDialogOk = (tableKey: string) => {
    // 关闭弹窗
    subTempData.value[`${tableKey}_Dialog`] = false
    let list = props.modelValue
    if (!list) {
      list = abUtil.Arrays.newAbSubList()
      emit('update:modelValue', list)
    }
    const json = abUtil.clone(subTempData.value[props.itemObjStr])
    list.push(json)
  }
</script>

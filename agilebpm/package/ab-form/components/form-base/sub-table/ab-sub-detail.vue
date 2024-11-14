<template>
  <el-button
    v-show="permission != 'n'"
    v-bind="$attrs"
    :icon="Postcard"
    @click="showSubDetail()"
  >
    <slot></slot>
  </el-button>
</template>
<script setup lang="ts">
  import { Postcard } from '@element-plus/icons-vue'
  import * as abUtil from '~/agilebpm/utils/ab-util'
  // 发布一个 弹窗OK事件
  const emit = defineEmits(['subDialogOk'])

  const props = defineProps({
    modelValue: {
      type: Object,
      required: true,
    },
    // 【0业务对象】.【1父表】.【2子表】 的名字.分隔 用于定位子表
    tableRel: {
      type: String,
      required: true,
    },
    // 表校验子表的前缀，用于对弹窗内部的表单进行校验，如果无前缀则不进行校验
    validteSubPre: {
      type: String,
      default: '',
    },
    subTempData: {
      type: Object,
      required: true,
    },
    permission: {
      type: String,
      default: 'w',
    },
  })

  const abFormMananger = inject('abForm') as AbFormProvide
  const { subTempData, modelValue } = toRefs(props)
  const tableRel = props.tableRel.split('.')
  if (tableRel.length != 3) {
    console.error('子表信息有误，tableRel 必须为 业务对象.父表.子表三层结构')
  }
  //初始化子表
  if (!modelValue.value[`${tableRel[2]}List`]) {
    modelValue.value[`${tableRel[2]}List`] = []
  }

  const showSubDetail = () => {
    subTempData.value[tableRel[1]] = abUtil.clone(props.modelValue)

    // 弹出框 SchoolStudent_Student_Dialog 是否展示
    subTempData.value[`${props.tableRel}_Dialog`] = true
    subTempData.value[`${props.tableRel}_okFn`] = () => {
      // 如果无校验
      if (!props.validteSubPre) {
        setDialogOk(props.tableRel)
        return
      }
      // 校验 表单内的内容
      abFormMananger
        .doValidate(true, props.validteSubPre)
        .then((result: any) => {
          if (result == true) {
            setDialogOk(props.tableRel)
          }
        })
    }
  }

  const setDialogOk = (tableKey: string) => {
    // 关闭弹窗
    subTempData.value[`${tableKey}_Dialog`] = false
    // 对表单进行赋值
    modelValue.value[`${tableRel[2]}List`] =
      subTempData.value[tableRel[1]][`${tableRel[2]}List`]
    modelValue.value['_loadMap'] = subTempData.value[tableRel[1]]['_loadMap']
    emit('subDialogOk', subTempData.value[tableRel[1]][`${tableRel[2]}List`])
  }
</script>

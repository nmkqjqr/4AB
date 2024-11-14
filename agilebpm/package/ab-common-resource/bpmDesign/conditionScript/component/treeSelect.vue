<template>
  {{ viewValue }}
  <el-tree-select
    v-bind="$attrs"
    v-model="viewValue"
    check-strictly
    clearable
    :data="options"
    default-expand-all
    :multiple="props.multiple"
    node-key="code"
    placeholder="请选择固定值"
    :props="defaultProps"
    :render-after-expand="false"
  />
</template>

<script lang="ts" setup>
  import { sysApi } from '~/agilebpm/api'
  //父类传入的属性
  const props = defineProps({
    modelValue: {
      required: true,
    },
    //父组件传入唯一标识
    code: {
      type: String,
      default: '',
    },
    //父组件传入的单选框数据集合
    options: {
      type: Array,
      default: null,
    },
    //父组件传入的数据字典code
    dicCode: {
      type: String,
      default: '',
    },
    //是否多选
    multiple: {
      type: Boolean,
      default: false,
    },
    // 是否包含分类根
    hasRoot: {
      type: Boolean,
      default: false,
    },
  })
  const getDisabled = (data: any) => {
    if (!data.disable) {
      return false
    }
    if (props.multiple) {
      if (viewValue.value.includes(data.code)) {
        return false
      }
    } else {
      if (viewValue.value == data.code) {
        return false
      }
    }
    return true
  }

  //下拉框树的名称 和值的隐射
  const defaultProps = {
    children: 'children',
    label: 'name',
    disabled: getDisabled,
  }
  //多选框的选项数据(父子嵌套结构)
  const options = ref([] as any)
  // // 多选框的选项数据(集合结构)
  // const optionsList = ref([] as any)
  // 数组类型的值提供
  const viewValue = ref()
  // emit 事件定义
  const emit = defineEmits(['update:modelValue'])

  // 逗号分隔数据类型，转成数组类型
  const modelValue2Viewvalue = (modelValue: string) => {
    viewValue.value = props.multiple
      ? modelValue
        ? modelValue.split(',')
        : []
      : props.modelValue
  }

  watch(
    () => viewValue.value,
    () => {
      emit(
        'update:modelValue',
        !viewValue.value || viewValue.value.length == 0
          ? ''
          : viewValue.value instanceof Array
          ? viewValue.value.join(',')
          : viewValue.value
      )
    }
  )

  // modelvalue 发生变化，转成 viewValue
  watch(
    () => props.modelValue,
    () => {
      modelValue2Viewvalue(props.modelValue)
    }
  )

  //初始化方法
  const init = () => {
    modelValue2Viewvalue(props.modelValue)
    // 如果dicCode有值,则获取数据字典的数据
    if (props.dicCode)
      sysApi.dict.getDictTreeByCodeNoRoot(props.dicCode).then((result: any) => {
        if (result && result.length > 0) {
          options.value = result
            .map((tree: any) => filterDisabledNodes(tree))
            .filter(Boolean)
        }
      })
    else {
      options.value = props.options
    }
  }

  const filterDisabledNodes = (tree: any) => {
    // 如果当前节点的 disable 为禁用（0），则返回 null，表示删除该节点
    if (!tree || typeof tree !== 'object') {
      return null
    }
    if (props.multiple) {
      if (!viewValue.value.includes(tree.code) && tree.disable == 1) {
        return null
      }
    } else {
      if (viewValue.value != tree.code && tree.disable == 1) {
        return null
      }
    }
    // 递归处理子节点
    if (tree.children && tree.children.length > 0) {
      tree.children = tree.children
        .map((child: any) => filterDisabledNodes(child))
        .filter(Boolean)
    }
    return tree
  }

  init()

  watch(
    () => props.code,
    () => {
      viewValue.value = undefined
      init()
    }
  )
</script>

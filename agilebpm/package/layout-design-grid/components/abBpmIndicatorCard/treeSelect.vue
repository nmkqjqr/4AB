<template>
  <el-tree-select
    v-bind="$attrs"
    v-model="viewValue"
    check-strictly
    :data="options"
    default-expand-all
    :multiple="props.multiple"
    node-key="code"
    :props="defaultProps"
    :render-after-expand="false"
  />
</template>

<script lang="ts" setup>
  import { sysApi } from '~/agilebpm'
  //父类传入的属性
  const props = defineProps({
    modelValue: {
      type: String,
      required: true,
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

  const getDisabled = (data: any, node: any) => {
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
          : viewValue
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
      sysApi.dict.getDictTreeByCodeNoRoot(props.dicCode).then((result) => {
        // optionsList.value = result.data
        // options.value = list2tree(result.data, props.dicCode)
        options.value = result
      })
    else {
      options.value = props.options
    }
  }

  init()

  //切换字典后更新下拉树配置
  watch(
    () => props.dicCode,
    (newValue) => {
      if (props.dicCode && props.dicCode.length > 0) {
        init()
      }
    }
  )

  // const list2tree = (list: any[], parentCode: string) => {
  //   console.log(list)
  //   const menuObj = {}
  //   let parentId = ''
  //   list.forEach((item) => {
  //     if (item.code == parentCode) {
  //       parentId = item.parentId
  //       item.disabled = true
  //     }
  //     item.children = []
  //     menuObj[item.id] = item
  //   })
  //   const relArr = list.filter((item: { parentId: string | number }) => {
  //     if (item.parentId !== parentId) {
  //       console.log("menuObj",menuObj)
  //       console.log("item.parentId",item.parentId)
  //       console.log("menuObj[item.parentId]",menuObj[item.parentId])
  //       menuObj[item.parentId].children.push(item)
  //       return false
  //     }
  //     return true
  //   })
  //   return props.hasRoot ? relArr : relArr[0].children
  // }
</script>

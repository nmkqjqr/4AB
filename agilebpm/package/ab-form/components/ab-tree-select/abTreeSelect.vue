<template>
  <div
    v-if="permission !== 'n'"
    :class="fromField.validateError ? 'ab-is-error' : ''"
  >
    <!-- 只读，且只读仅展示翻译后的文本,如数据字典，则需要翻译为text文本 -->
    <span v-if="permission === 'r' && readonlyShowText">{{ textValue }}</span>
    <el-tooltip v-else v-bind="validateTips">
      <el-tree-select
        v-bind="$attrs"
        v-model="viewValue"
        check-strictly
        class="ab-input"
        clearable
        :data="options"
        default-expand-all
        :disabled="permission === 'r' || props.disabled"
        :multiple="props.multiple"
        node-key="code"
        :props="defaultProps"
        :render-after-expand="false"
      />
    </el-tooltip>
  </div>
</template>

<script lang="ts" setup>
  import { sysApi } from '@agilebpm/api'
  import { RuleItem } from 'async-validator'
  import { PropType } from 'vue'
  import * as AbformValidate from '../form-base/ab-form-field-validate'
  // // 指定组件命名
  // defineOptions({
  //   name: '',
  // })
  //父类传入的属性
  const props = defineProps({
    modelValue: {
      type: String,
      required: true,
    },
    //权限:w/r/n/b(编辑/只读/无权限/必填)   默认值 W （与element内置是否只读属性readonly绑定， 无需自己实现）
    permission: {
      type: String,
      default: 'w',
    },
    //是否禁用: true/false  默认false
    disabled: {
      type: Boolean,
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
    rules: {
      type: Object as PropType<Array<RuleItem> | RuleItem>,
      default: [] as Array<RuleItem>,
    },
    // 是否包含分类根
    hasRoot: {
      type: Boolean,
      default: false,
    },
    // 描述字段，用于校验提示拼接所在的字段名字
    desc: {
      type: String,
      default: '下拉树组件',
    },
    columnCode: {
      type: String,
      default: '',
    },
    /**
     * 业务表编码
     */
    tableCode: {
      type: String,
      default: '',
    },
    readShowText: {
      type: Boolean,
      default: null,
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
  //只读的文本展示
  const textValue = ref('')
  //表单校验管理对象
  const abFormMananger = inject('abForm') as AbFormProvide
  // 是否只读展示纯文本
  const readonlyShowText =
    props.readShowText != null
      ? props.readShowText
      : abFormMananger?.readonlyShowText
  // emit 事件定义
  const emit = defineEmits(['update:modelValue'])
  //inputField相关的引用，用于表单abForm
  const fromField: AbInputField = reactive({
    rules: props.rules,
    name: props.desc,
    modelValue: props.modelValue,
    validateError: '',
    columnCode: props.columnCode,
    tableCode: props.tableCode,
  })
  //校验相关:获取校验提示
  const validateTips = computed(() => {
    return AbformValidate.getValidateTips(fromField)
  })

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
      fromField.modelValue = props.modelValue
      AbformValidate.blurValidate(fromField)
      fillDescValue(props.modelValue)
      modelValue2Viewvalue(props.modelValue)
    }
  )

  //R权限只展示文本时,抽出数组中的text单独按逗号分割后展示
  const fillDescValue = (arrData: string) => {
    if (arrData) {
      const parmList = props.multiple ? arrData.split(',') : new Array(arrData)
      const arrays = [] as string[]
      treeFind(options.value, parmList, arrays)
      textValue.value = arrays.join(',')
    } else textValue.value = ''
  }

  // 移除校验
  onBeforeUnmount(() => {
    abFormMananger.removeField(fromField)
  })
  // 加入表单校验
  onMounted(() => {
    AbformValidate.addField2Form(fromField, props.permission, abFormMananger)
  })

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

  //初始化方法
  const init = () => {
    modelValue2Viewvalue(props.modelValue)
    // 如果dicCode有值,则获取数据字典的数据
    if (props.dicCode)
      sysApi.dict.getDictTreeByCodeNoRoot(props.dicCode).then((result: any) => {
        // optionsList.value = result.data
        if (result && result.length > 0) {
          options.value = result
            .map((tree: any) => filterDisabledNodes(tree))
            .filter(Boolean)

          // options.value = list2tree(result.data, props.dicCode)
          fillDescValue(props.modelValue)
        }
      })
    else {
      options.value = props.options
      fillDescValue(props.modelValue)
    }
  }

  init()

  // 动态权限必填切换后，切换校验
  watch(
    () => props.permission,
    (newValue) => {
      // 如果校验 由非必填修改为了必填，此时修改校验功能
      if (newValue && newValue === 'b') {
        AbformValidate.changeRequired(fromField, true)
      } else {
        AbformValidate.changeRequired(fromField, false)
      }
    }
  )

  // 动态权限必填切换后，切换校验
  watch(
    () => props.dicCode,
    (newValue) => {
      if (props.dicCode && props.dicCode.length > 0) {
        init()
      }
    }
  )

  const treeFind = (tree: any[], func: string[], nameArr: string[]) => {
    for (const data of tree) {
      if (func.includes(data.code) && !data.disable) nameArr.push(data.name)
      if (data.children) {
        treeFind(data.children, func, nameArr)
      }
    }
  }

  // const list2tree = (list: any[], parentCode: string) => {
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
  //       menuObj[item.parentId].children.push(item)
  //       return false
  //     }
  //     return true
  //   })
  //   return props.hasRoot ? relArr : relArr[0].children
  // }
</script>

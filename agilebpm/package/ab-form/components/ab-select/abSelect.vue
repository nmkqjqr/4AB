<template>
  <div
    v-if="permission !== 'n'"
    :class="fromField.validateError ? 'ab-is-error' : ''"
  >
    <!-- 只读，且只读仅展示翻译后的文本,如数据字典，则需要翻译为text文本 -->
    <span v-if="permission === 'r' && readonlyShowText">{{ textValue }}</span>
    <el-tooltip v-else v-bind="validateTips">
      <el-select
        v-bind="$attrs"
        v-model="viewValue"
        class="ab-input"
        clearable
        :disabled="permission === 'r' || props.disabled"
        :multiple="props.multiple"
        @change="changeSelect"
      >
        <el-option
          v-for="item in options"
          :key="item.key"
          :disabled="
            item.disable == 1 && viewValue && !viewValue.includes(item.key)
          "
          :label="item.text"
          :value="item.key"
        />
      </el-select>
    </el-tooltip>
  </div>
</template>

<script lang="ts" setup>
  import { sysApi } from '@agilebpm/api'
  import { RuleItem } from 'async-validator'
  import { inject, PropType, ref } from 'vue'
  import { formatDictList } from '../componentUtil'
  import * as AbformValidate from '../form-base/ab-form-field-validate'
  // // 指定组件命名
  // defineOptions({
  //   name: 'AbCheckboxGroup',
  // })
  //父类传入的属性
  const props = defineProps({
    modelValue: {
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
      type: Array as () => Array<CustFormOptions>,
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
    // 返回值是否是数字（仅限单选，开启多选则失效）
    isNumber: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: Object as PropType<Array<RuleItem> | RuleItem>,
      default: [] as Array<RuleItem>,
    },
    // 描述字段，用于校验提示拼接所在的字段名字
    desc: {
      type: String,
      required: true,
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

  //多选框的选项数据
  const options = ref([] as any)
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

  //判断OptionMenu是否展示
  // const showOptionMenu = (item: {
  //   key: any
  //   text: string
  //   disable: number
  // }) => {
  //   //如果字段未禁用，则直接返回
  //   if (!item.disable) {
  //     return true
  //   }
  //   if (props.multiple && viewValue.value) {
  //     return viewValue.value.includes(item.key) || !item.disable
  //   } else {
  //     return viewValue.value == item.key || !item.disable
  //   }
  // }

  // 逗号分隔数据类型，转成数组类型
  const modelValue2Viewvalue = (modelValue: any) => {
    if (modelValue || (props.isNumber && modelValue == 0)) {
      let str = modelValue
      if (props.isNumber) {
        str = `${modelValue}`
      }
      viewValue.value = props.multiple ? (str ? str.split(',') : []) : str
    }
  }

  // viewValue 发生变化，转成 逗号分隔给modelValue
  const changeSelect = (value: any) => {
    // if (value instanceof Array) {
    //   const arr = options.value.filter((s) => s.disable).map((s) => s.key)
    //   if (arr && arr.length > 0) {
    //     value = value.filter((s) => !arr.includes(s))
    //   }
    // }
    //如果要求返回值为数字，则不能为多选
    let modelValueTemp
    if (props.isNumber && !props.multiple) {
      if (isNaN(parseFloat(value))) {
        modelValueTemp = 0
      } else {
        modelValueTemp = parseFloat(value)
      }
    } else {
      modelValueTemp =
        !value || value.length == 0
          ? ''
          : value instanceof Array
          ? value.join(',')
          : value
    }
    emit('update:modelValue', modelValueTemp)
    fromField.modelValue = value
    AbformValidate.blurValidate(fromField)
    modelValue2Viewvalue(modelValueTemp)
    fillDescValue(viewValue.value)
  }

  watch(
    () => props.modelValue,
    (newValue) => {
      fillDescValue(newValue)
      modelValue2Viewvalue(newValue)
      //把当前控件的引用赋值给abForm 组件
      fromField.modelValue = newValue
      AbformValidate.blurValidate(fromField)
    }
  )

  //R权限只展示文本时,抽出数组中的text单独按逗号分割后展示
  const fillDescValue = (arrData: string) => {
    if (props.isNumber) {
      arrData = `${arrData}`
    }
    if (!arrData) {
      textValue.value = ''
    } else {
      const parmList = props.multiple ? arrData : arrData.split(',')
      const arrays = options.value
        .filter((item: any) => parmList.includes(item.key))
        .map((item: { text: any }) => item.text)
      textValue.value = arrays.join(',')
    }
  }

  //DOM挂载前
  onBeforeUnmount(() => abFormMananger.removeField(fromField))

  //由于传入值非双向绑定，因此需要实时监听入参
  if (props.dicCode)
    sysApi.dict.getDictListByCode(props.dicCode).then((result) => {
      options.value = formatDictList(result).filter((s) => {
        if (props.multiple) {
          return viewValue.value.includes(s.key) || !s.disable
        } else {
          return viewValue.value == s.key || !s.disable
        }
      })
      fillDescValue(props.modelValue)
    })
  else {
    options.value = props.options
    fillDescValue(props.modelValue)
  }
  modelValue2Viewvalue(props.modelValue)
  //把当前控件的引用赋值给abForm 组件
  AbformValidate.addField2Form(fromField, props.permission, abFormMananger)

  // console.log('modelValue', props.modelValue, '类型', typeof props.modelValue)
  // console.log('viewValue', viewValue.value, '类型', typeof viewValue.value)
  // console.log('textValue', textValue.value, '类型', typeof textValue.value)
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
</script>

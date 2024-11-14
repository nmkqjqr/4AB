<template>
  <div
    v-if="permission !== 'n'"
    :class="abInputField.validateError ? 'ab-is-error' : ''"
  >
    <!-- 只读，且只读仅展示翻译后的文本,如数据字典，则需要翻译为text文本 -->
    <span v-if="permission === 'r' && readonlyShowText">{{ textValue }}</span>
    <el-tooltip v-else v-bind="validateTips">
      <el-checkbox-group
        v-model="viewValue"
        :disabled="permission === 'r' || disabled"
        @change="changeCheckbox"
      >
        <span v-if="buttonStyle && buttonStyle == 'button'">
          <el-checkbox-button
            v-for="item in options"
            :key="item.key"
            :disabled="!viewValue.includes(item.key) && item.disable"
            :label="item.key"
          >
            {{ item.text }}
          </el-checkbox-button>
        </span>
        <span v-else>
          <el-checkbox
            v-for="item in options"
            :key="item.key"
            :disabled="!viewValue.includes(item.key) && item.disable"
            :label="item.key"
          >
            {{ item.text }}
          </el-checkbox>
        </span>
      </el-checkbox-group>
    </el-tooltip>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, inject } from 'vue'
  import { sysApi } from '@agilebpm/api'
  import { abCheckboxGroupProps } from './abCkeckboxGroup'
  import * as AbformValidate from '../form-base/ab-form-field-validate'
  import { formatDictList } from '../componentUtil'

  // // 指定组件命名
  // defineOptions({
  //   name: 'AbCheckboxGroup',
  // })

  //父类传入的属性
  const props = defineProps(abCheckboxGroupProps)
  const { modelValue, permission } = toRefs(props)
  //多选框的选项数据
  const options = ref([] as any)
  // 数组类型的值提供
  const viewValue = ref([] as Array<string>)
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
  const abInputField: AbInputField = reactive({
    rules: props.rules,
    name: props.desc,
    modelValue: modelValue,
    validateError: '',
    columnCode: props.columnCode,
    tableCode: props.tableCode,
  })
  //校验相关:获取校验提示
  const validateTips = computed(() => {
    return AbformValidate.getValidateTips(abInputField)
  })

  //R权限只展示文本时,抽出数组中的text单独按逗号分割后展示
  const fillDescValue = (arrData: string[]) => {
    const arrays = options.value
      .filter((item: any) => arrData.indexOf(item.key) != -1)
      .map((item: { text: any }) => item.text)
    textValue.value = arrays.join(',')
  }

  //R权限只展示文本时,抽出数组中的text单独按逗号分割后展示
  const fillValueNotNull = () => {
    if (modelValue.value) {
      fillDescValue(modelValue.value.split(','))
    } else {
      textValue.value = ''
    }
  }

  // 逗号分隔数据类型，转成数组类型
  const modelValue2Viewvalue = (modelValue: string) => {
    viewValue.value = modelValue ? modelValue.split(',') : []
  }

  //DOM挂载前
  onBeforeUnmount(() => {
    abFormMananger.removeField(abInputField)
  })

  //DOM挂载完
  onMounted(() => {
    modelValue2Viewvalue(props.modelValue)
    //把当前控件的引用赋值给abForm 组件
    AbformValidate.addField2Form(abInputField, props.permission, abFormMananger)
    // 如果dicCode有值,则获取数据字典的数据
    if (props.dicCode)
      sysApi.dict.getDictListByCode(props.dicCode).then((result) => {
        options.value = formatDictList(result).filter(
          (s) => viewValue.value.includes(s.key) || !s.disable
        )
        fillValueNotNull()
      })
    else {
      options.value = props.options
      fillValueNotNull()
    }
  })

  // viewValue 发生变化，转成 逗号分隔给modelValue  相互watch有bug, 因此注释
  // watch(viewValue, (viewValue) => {
  //   emit(
  //     'update:modelValue',
  //     !viewValue || viewValue.length == 0 ? '' : viewValue.join(',')
  //   )
  // })

  // 逗号分隔数据类型，转成数组类型
  const changeCheckbox = (viewValue: any) => {
    console.log('viewValue', viewValue)
    emit(
      'update:modelValue',
      !viewValue || viewValue.length == 0 ? '' : viewValue.join(',')
    )
  }

  // modelvalue 发生变化，转成 viewValue
  watch(modelValue, (modelValue) => {
    AbformValidate.blurValidate(abInputField)
    fillDescValue(viewValue.value)
    modelValue2Viewvalue(modelValue)
  })

  // 动态权限必填切换后，切换校验
  watch(
    () => props.permission,
    (newValue) => {
      // 如果校验 由非必填修改为了必填，此时修改校验功能
      if (newValue && newValue === 'b') {
        AbformValidate.changeRequired(abInputField, true)
      } else {
        AbformValidate.changeRequired(abInputField, false)
      }
    }
  )
</script>

<style lang="scss" scoped>
  ::v-deep
    .el-checkbox-button.is-disabled.is-checked
    .el-checkbox-button__inner {
    background-color: #f2f6fc;
  }
</style>

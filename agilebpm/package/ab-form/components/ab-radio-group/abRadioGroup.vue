<template>
  <span
    v-if="permission === 'n'"
    :class="abInputField.validateError ? 'ab-is-error' : ''"
  ></span>
  <el-tooltip v-else v-bind="validateTips">
    <el-radio-group
      v-if="buttonStyle && buttonStyle == 'button'"
      v-model="viewValue"
      :disabled="permission === 'r' || disabled"
      style="font-size: 14px"
      v-bind="$attrs"
      @change="changeFn"
    >
      <el-radio-button
        v-for="item in options"
        :key="item.key"
        :disabled="item.disable == 1"
        :label="item.key"
        style="font-size: 14px"
      >
        {{ item.text }}
      </el-radio-button>
    </el-radio-group>
    <el-radio-group
      v-else
      v-model="viewValue"
      :disabled="permission === 'r' || disabled"
      style="font-size: 14px"
      v-bind="$attrs"
      @change="changeFn"
    >
      <el-radio
        v-for="item in options"
        :key="item.key"
        :disabled="item.disable == 1"
        :label="item.key"
        style="font-size: 14px"
      >
        {{ item.text }}
      </el-radio>
    </el-radio-group>
  </el-tooltip>
  <slot></slot>
</template>

<script lang="ts" setup>
  import { sysApi } from '@agilebpm/api'
  import { RuleItem } from 'async-validator'
  import { PropType } from 'vue'
  import * as AbformValidate from '../form-base/ab-form-field-validate'
  import { formatDictList } from '../componentUtil'
  // // 指定组件命名
  // defineOptions({
  //   name: 'AbRadioGroup',
  // })

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
      type: Array as () => Array<CustFormOptions>,
      default: null,
    },
    //按钮样式   marquee选择框    button按钮
    buttonStyle: {
      type: String,
      default: 'marquee',
    },
    //父组件传入的数据字典code
    dicCode: {
      type: String,
      default: '',
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
  // emit 事件定义
  const emit = defineEmits(['update:modelValue'])
  //多选框的选项数据
  const options = ref([] as CustFormOptions[])
  //与modelValue双向绑定的响应式对象
  const viewValue: any = useVModel(props, 'modelValue', emit)
  //只读的文本展示
  const textValue = ref('' as any)
  //表单校验管理对象
  const abFormMananger = inject('abForm') as AbFormProvide
  // 是否只读展示纯文本
  const readonlyShowText =
    props.readShowText != null
      ? props.readShowText
      : abFormMananger?.readonlyShowText
  //inputField相关的引用，用于表单abForm
  const abInputField: AbInputField = reactive({
    rules: props.rules,
    name: props.desc,
    modelValue: viewValue,
    validateError: '',
    columnCode: props.columnCode,
    tableCode: props.tableCode,
  })
  //校验相关:获取校验提示
  const validateTips = computed(() => {
    return AbformValidate.getValidateTips(abInputField)
  })

  //只展示文本时,展示名称而非值
  const changeFn = () => {
    AbformValidate.blurValidate(abInputField)
    fillDescValue()
  }

  //R权限只展示文本时,抽出数组中的text单独按逗号分割后展示
  const fillDescValue = () => {
    textValue.value = options.value.find((s) => s.key == viewValue.value)?.text
  }
  // 加入表单校验
  onMounted(() => {
    AbformValidate.addField2Form(abInputField, props.permission, abFormMananger)
    // dicCode有值时，展示数据字典的的数据集合
    if (props.dicCode)
      sysApi.dict.getDictListByCode(props.dicCode).then((result) => {
        options.value = formatDictList(result).filter(
          (s) => s.key == viewValue.value || !s.disable
        )
        fillDescValue()
      })
    else {
      options.value = props.options
      fillDescValue()
    }
  })

  // 移除校验
  onBeforeUnmount(() => {
    abFormMananger.removeField(abInputField)
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

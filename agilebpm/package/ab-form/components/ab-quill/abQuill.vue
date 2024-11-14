<template>
  <div
    v-if="permission !== 'n'"
    class="demo-date-picker"
    :class="formField.validateError ? 'ab-is-error' : ''"
  >
    <el-tooltip v-bind="validateTips">
      <ab-rich-editor
        v-model="viewValue"
        :disabled="permission === 'r' || disabled"
        :height="height"
        :max-height="maxHeight"
        v-bind="$attrs"
      />
    </el-tooltip>
  </div>
</template>
<script lang="ts">
  export default { name: 'AbQuill' }
</script>

<script lang="ts" setup>
  import { abRichEditor } from '@ab-core'
  import { RuleItem } from 'async-validator'
  import { PropType } from 'vue'
  import * as AbformValidate from '../form-base/ab-form-field-validate'
  const props = defineProps({
    modelValue: {
      type: String,
      required: true,
    },
    //是否禁用: true/false  默认false
    disabled: {
      type: Boolean,
      default: false,
    },
    //权限:w/r/n/b(编辑/只读/无权限/必填)   默认值 W （与element内置是否只读属性readonly绑定， 无需自己实现）
    permission: {
      type: String,
      default: 'w',
    },
    rules: {
      type: Object as PropType<Array<RuleItem> | RuleItem>,
      default: [] as Array<RuleItem>,
    },
    // 描述字段，用于校验提示拼接所在的字段名字
    desc: {
      type: String,
      default: '富文本',
    },
    //文本框的高度
    height: {
      type: Number,
      required: true,
    },
    //文本框的高度
    maxHeight: {
      type: Number,
      required: true,
    },
    //替换参数对象集合
    param: {
      type: Array<any>,
      default: null,
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
  })
  const { permission, disabled } = toRefs(props)
  const emit = defineEmits(['update:modelValue'])
  const viewValue = useVModel(props, 'modelValue', emit)
  const showValue = ref()
  //表单校验管理对象
  const abFormMananger = inject('abForm') as AbFormProvide

  const validateTips = computed(() => {
    return AbformValidate.getValidateTips(formField)
  })

  // inputField相关的引用，用于表单abForm
  const formField: AbInputField = reactive({
    rules: props.rules,
    name: props.desc,
    modelValue: viewValue,
    validateError: '',
    columnCode: props.columnCode,
    tableCode: props.tableCode,
  })
  // 移除校验
  onBeforeUnmount(() => {
    abFormMananger.removeField(formField)
  })
  // 加入表单校验
  onMounted(() => {
    replaceValue()
    AbformValidate.addField2Form(formField, props.permission, abFormMananger)
  })

  //通过param替换默认值成变量
  const replaceValue = () => {
    showValue.value = viewValue.value
    if (
      viewValue.value &&
      viewValue.value.length > 0 &&
      props.param &&
      props.param.length > 0
    ) {
      //只读下做映射分离
      if (permission.value === 'r' || disabled.value) {
        const param = props.param.filter((obj) => obj.key)
        if (param && param.length > 0) {
          // 定义一个正则表达式，匹配数组中的所有 key
          const reg = new RegExp(
            param.map((item: any) => item.key).join('|'),
            'g'
          )
          // 定义一个替换函数，根据匹配的 key 返回对应的 value
          const replacer = (match: string) => {
            return param?.find((item: any) => item.key == match).value ?? ''
          }
          // 使用 replace() 方法替换字符串中的内容
          showValue.value = viewValue.value.replace(reg, replacer)
        }
      }
    }
  }

  watch(
    () => props.permission,
    (newValue) => {
      // 如果校验 由非必填修改为了必填，此时修改校验功能
      if (newValue && newValue === 'b') {
        AbformValidate.changeRequired(formField, true)
      } else {
        AbformValidate.changeRequired(formField, false)
      }
    }
  )

  // 动态权限必填切换后，切换校验
  watch(
    () => viewValue.value,
    () => {
      AbformValidate.blurValidate(formField)
    }
  )
</script>

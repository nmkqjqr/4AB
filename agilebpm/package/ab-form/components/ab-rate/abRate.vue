<template>
  <div
    v-if="permission !== 'n'"
    class="demo-date-picker"
    :class="formField.validateError ? 'ab-is-error' : ''"
  >
    <el-tooltip v-bind="validateTips">
      <span>
        <el-rate
          v-bind="$attrs"
          v-model="viewValue"
          :disabled="permission === 'r' || disabled"
          @change="changeFn"
        />
      </span>
    </el-tooltip>
  </div>
</template>

<script lang="ts">
  export default { name: 'AbRate' }
</script>

<script lang="ts" setup>
  import { RuleItem } from 'async-validator'
  import { PropType } from 'vue'
  import * as AbformValidate from '../form-base/ab-form-field-validate'

  const props = defineProps({
    //选中项绑定值:
    modelValue: {
      type: Number,
      required: true,
    },

    //是否禁用: true/false  默认false
    disabled: {
      type: Boolean,
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
  })

  // emit 事件定义
  const emit = defineEmits(['update:modelValue'])
  // rate的值
  const viewValue: any = useVModel(props, 'modelValue', emit)

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

  const changeFn = () => {
    setTimeout(() => AbformValidate.blurValidate(formField), 10)
  }
  // 移除校验
  onBeforeUnmount(() => {
    abFormMananger.removeField(formField)
  })
  // 加入表单校验
  onMounted(() => {
    AbformValidate.addField2Form(formField, props.permission, abFormMananger)
  })

  // 动态权限必填切换后，切换校验
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
</script>

<!-- <style lang="scss">
  .rateStyle {
    .el-rate__item {
      .el-icon {
        cursor: pointer;
      }
    }
  }
</style> -->

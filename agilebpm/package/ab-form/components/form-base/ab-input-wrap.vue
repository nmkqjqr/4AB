<template>
  <div
    v-if="permission !== 'n'"
    :class="abInputField.validateError ? 'ab-is-error' : ''"
    style="width: 100%"
  >
    <!-- 只读，且只读仅展示翻译后的文本,如数据字典，则需要翻译为text文本 -->
    <span v-if="permission === 'r' && readonlyShowText">
      <slot name="readonlyShowText"></slot>
    </span>
    <el-tooltip
      v-else
      :content="abInputField.validateError"
      :disabled="abInputField.validateError === ''"
      effect="ab-error"
      :enterable="false"
      :hide-after="100"
      placement="right"
      popper-class="ab-error"
    >
      <slot
        :disabled="permission === 'r' || props.disabled"
        :do-validate="inputBlur"
      ></slot>
    </el-tooltip>
  </div>
</template>

<script lang="ts" setup>
  import { RuleItem } from 'async-validator'
  import { PropType } from 'vue'
  import * as AbformValidate from '../form-base/ab-form-field-validate'

  const props = defineProps({
    modelValue: {
      type: [String, Number],
      default: '',
    },
    //是否禁用
    disabled: {
      type: Boolean,
      default: false,
    },
    //操作权限
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
    /**
     * 字段编码
     */
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

  //改成响应式的值
  const { modelValue } = toRefs(props)
  const abFormMananger = inject('abForm') as AbFormProvide
  // 是否只读展示纯文本
  const readonlyShowText =
    props.readShowText != null
      ? props.readShowText
      : abFormMananger?.readonlyShowText

  /**
   * inputField相关的引用，用于表单abForm
   */
  const abInputField: AbInputField = reactive({
    rules: props.rules,
    name: props.desc,
    // 这里的值必须是响应式的
    modelValue: modelValue,
    validateError: '',
    columnCode: props.columnCode,
    tableCode: props.tableCode,
  })

  /**
   * 【校验相关】
   */
  const inputBlur = () => {
    AbformValidate.blurValidate(abInputField)
  }

  // 移除校验
  onBeforeUnmount(() => {
    abFormMananger.removeField(abInputField)
  })
  // 加入表单校验
  onMounted(() => {
    AbformValidate.addField2Form(abInputField, props.permission, abFormMananger)
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

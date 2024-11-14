<template>
  <div
    v-if="props.permission !== 'n'"
    :class="abInputField.validateError ? 'ab-is-error' : ''"
  >
    <span v-if="props.permission === 'r' && readonlyShowText">
      {{ showText() }}
    </span>

    <el-tooltip v-else v-bind="validateTips">
      <el-input
        v-model="viewValue"
        v-bind="$attrs"
        :disabled="props.permission === 'r' || props.disabled"
        @blur="changeValue()"
        @input="updateModelData()"
      >
        <template #prepend v-if="props.coinValue">
          {{ props.coinValue }}
        </template>
        <template #append v-if="props.convertCurrency">
          {{ abUtil.convertCurrency(viewValue) }}
        </template>
      </el-input>
    </el-tooltip>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, inject } from 'vue'
  import { inputNumberProps } from './abNumber'
  import * as AbformValidate from '../form-base/ab-form-field-validate'
  import { abUtil } from '~/agilebpm'
  const props = defineProps(inputNumberProps)

  const viewValue = ref('')
  const inputing = ref(false)

  // emit 事件数据更新
  const emit = defineEmits(['update:modelValue', 'input'])

  // 是否只读展示纯文本
  const abFormMananger = inject('abForm') as AbFormProvide
  const readonlyShowText =
    props.readShowText != null
      ? props.readShowText
      : abFormMananger?.readonlyShowText
  // 输入时实时更新modelValue
  const updateModelData = () => {
    inputing.value = true
    emit('update:modelValue', abUtil.toNumber(viewValue.value))
  }

  onMounted(() => {
    viewValue.value = formatNumber(props.modelValue)
    // 动态权限必填切换后，切换校验
    AbformValidate.addField2Form(abInputField, props.permission, abFormMananger)
  })
  //监视modelValue 的变化
  watch(
    () => props.modelValue,
    (value) => {
      abInputField.modelValue = value
      if (inputing.value) return
      viewValue.value = formatNumber(value)
    }
  )

  const rules2 = computed(() => {
    const result = abUtil.clone(props.rules)
    if (!props.rules) {
      return [
        {
          pattern: '^-?((\\d{1,3}(,\\d{3})+?|\\d+)(\\.\\d{1,5})?)$',
          message: '请输入数字',
        },
      ]
    }
    if (Array.isArray(result)) {
      result.push({
        pattern: '^-?((\\d{1,3}(,\\d{3})+?|\\d+)(\\.\\d{1,5})?)$',
        message: '请输入数字',
      })
      return result
    }

    if (Object.keys(props.rules).length === 0) {
      return [
        {
          pattern: '^-?((\\d{1,3}(,\\d{3})+?|\\d+)(\\.\\d{1,5})?)$',
          message: '请输入数字',
        },
      ]
    }
    return props.rules
  })

  /**
   * inputField相关的引用，用于表单abForm
   */
  const abInputField: AbInputField = reactive({
    rules: rules2,
    name: props.desc,
    modelValue: props.modelValue,
    validateError: '',
    columnCode: props.columnCode,
    tableCode: props.tableCode,
  })

  //格式化viewValue，更新modelValue
  const changeValue = () => {
    abInputField.modelValue = abUtil.toNumber(viewValue.value)
    AbformValidate.blurValidate(abInputField)
    //校验
    inputing.value = false
    nextTick(() => {
      const val = abUtil.toNumber(viewValue.value)
      emit('update:modelValue', val)
      viewValue.value = formatNumber(val)
    })
  }

  const validateTips = computed(() => {
    return AbformValidate.getValidateTips(abInputField)
  })
  // 移除校验
  onBeforeUnmount(() => {
    abFormMananger.removeField(abInputField)
  })

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

  const formatNumber = (tempValue: any) => {
    if (typeof tempValue == 'string' && !tempValue) return ''
    if (typeof tempValue == 'number') {
      tempValue = tempValue.toString()
    }
    if (!tempValue) {
      return
    }
    if (props.comdify) {
      tempValue = abUtil.comdify(tempValue)
    }

    if (props.decimalPlace > 0) {
      if (tempValue.indexOf('.') != -1) {
        const ary = tempValue.split('.')
        let temp = ary[ary.length - 1]
        if (temp.length > 0 && temp.length < props.decimalPlace) {
          let zeroLen = ''
          for (let i = 0; i < props.decimalPlace - temp.length; i++) {
            zeroLen = `${zeroLen}0`
          }
          tempValue = tempValue + zeroLen
        } else if (temp.length > 0 && temp.length > props.decimalPlace) {
          temp = temp.substring(0, props.decimalPlace)
          ary[ary.length - 1] = temp
          tempValue = ary.join('.')
        }
      } else {
        let zeroLen = ''
        for (let i = 0; i < props.decimalPlace; i++) {
          zeroLen = `${zeroLen}0`
        }
        tempValue = `${tempValue}.${zeroLen}`
      }
    }

    return tempValue
  }

  const showText = () => {
    let result = ''
    if (!viewValue.value) {
      return result
    }
    result = viewValue.value
    if (props.coinValue) {
      result = `${props.coinValue}${viewValue.value}`
    }
    const zh = props.convertCurrency
      ? `(${abUtil.convertCurrency(viewValue.value)})`
      : ''
    return result + zh
  }
</script>

<style></style>

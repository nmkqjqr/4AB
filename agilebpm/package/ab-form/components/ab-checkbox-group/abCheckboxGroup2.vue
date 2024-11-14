<template>
  <div
    v-if="permission !== 'n'"
    :class="abInputField.validateError ? 'ab-is-error' : ''"
  >
    <!-- <span v-if="permission === 'r' && readonlyShowText">{{ textValue }}</span>
    <el-tooltip v-else v-bind="validateTips">
      <el-checkbox-group
        :disabled="permission === 'r' || disabled"
        :model-value="props.modelValue ? props.modelValue.split(',') : []"
        @change="changeFn"
      >
        <el-checkbox v-for="item in options" :key="item.key" :label="item.key">
          {{ item.text }}
        </el-checkbox>
      </el-checkbox-group>
    </el-tooltip> -->
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

  //多选框的选项数据
  const options = ref([] as any)
  //只读的文本展示
  const textValue = ref('')
  //父类传入的属性
  const props = defineProps(abCheckboxGroupProps)
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
    modelValue: props.modelValue,
    validateError: '',
  })
  //校验相关:获取校验提示
  const validateTips = computed(() => {
    return AbformValidate.getValidateTips(abInputField)
  })

  //多选框变动时,联动更新校验
  const changeFn = (e: any) => {
    emit('update:modelValue', e.join(','))
    abInputField.modelValue = e.join(',')
    fillDescValue(e)
    AbformValidate.blurValidate(abInputField)
  }

  //R权限只展示文本时,抽出数组中的text单独按逗号分割后展示
  const fillDescValue = (arrData: string[]) => {
    const arrays = options.value
      .filter((item: any) => arrData.indexOf(item.key) != -1)
      .map((item: { text: any }) => item.text)
    textValue.value = arrays.join(',')
  }

  //DOM挂载前
  onBeforeUnmount(() => {
    abFormMananger.removeField(abInputField)
  })

  //DOM挂载完
  onMounted(() => {
    //把当前控件的引用赋值给abForm 组件
    AbformValidate.addField2Form(abInputField, props.permission, abFormMananger)
    // 如果dicCode有值,则获取数据字典的数据
    if (props.dicCode)
      sysApi.dict.getDictListByCode(props.dicCode).then((result) => {
        options.value = formatDictList(result)
        fillDescValue(props.modelValue.split(','))
      })
    else {
      options.value = props.options
      fillDescValue(props.modelValue.split(','))
    }
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

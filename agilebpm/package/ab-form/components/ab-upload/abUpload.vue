<template>
  <div
    v-if="permission !== 'n'"
    :class="[
      formField.validateError ? 'ab-is-error' : '',
      props.listType === 'picture-card' ? '' : 'upload-demo',
    ]"
  >
    <el-tooltip v-bind="validateTips">
      <span>
        <ab-upload-file
          v-model="fileList"
          :dic-code="dicCode"
          :disabled="permission === 'r' || disabled"
          :hide-button="permission === 'r' || disabled || readonlyShowText"
          :limit="limit"
          :list-type="listType"
          :max="max"
          :multiple="multiple"
          :read-non-download="readNonDownload || readonlyShowText"
          :type="type"
        />
      </span>
    </el-tooltip>
  </div>
</template>
<script lang="ts">
  export default { name: 'AbUpload' }
</script>
<script lang="ts" setup>
  import { abUploadFile } from '@ab-core'
  import { RuleItem } from 'async-validator'
  import { PropType } from 'vue'
  import * as AbformValidate from '../form-base/ab-form-field-validate'

  const props = defineProps({
    // 用户默认会定义为Object any ，如果指定类型则： type: Object as PropType<User>,
    modelValue: {
      type: String || Array, //(可以是json字符串, 也可以是对象)
      required: true,
    },
    //是否禁用: true/false  默认false
    disabled: {
      type: Boolean,
      default: false,
    },
    //只读下不可下载
    readNonDownload: {
      type: Boolean,
      default: false,
    },
    //权限:w/r/n/b(编辑/只读/无权限/必填)   默认值 W （与element内置是否只读属性readonly绑定， 无需自己实现）
    permission: {
      type: String,
      default: 'w',
    },
    // 默认展示是图片还是文件
    listType: {
      type: String, //('text' 或  'picture-card'  文件或图片两种展示形式)
      default: 'text',
    },
    // 是否多选
    multiple: {
      type: Boolean, //(默认单选,再选覆盖)
      default: false,
    },
    rules: {
      type: Object as PropType<Array<RuleItem> | RuleItem>,
      default: [] as Array<RuleItem>,
    },
    // 文件大小限制
    max: {
      type: Number, //(0为不限制)
      default: 0,
    },
    // 文件数量限制
    limit: {
      type: Number, //(0为不限制)
      default: 0,
    },
    // 文件自身类型限制
    type: {
      type: String, //(空字符为不限制)
      default: '',
    },
    // 文件类型数据字典的key，方便对文件归属哪个模块进行分类。（必传）
    dicCode: {
      type: String,
      required: true, //必传
    },
    // 描述字段，用于校验提示拼接所在的字段名字
    desc: {
      type: String,
      default: '上传组件',
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

  const { modelValue } = toRefs(props)

  // emit 事件定义
  const emit = defineEmits(['update:modelValue'])

  //表单校验管理对象
  const abFormMananger = inject('abForm') as AbFormProvide

  // 是否只读展示纯文本
  const readonlyShowText = abFormMananger?.readonlyShowText

  // 文件上传的对象
  const fileList: any = ref('')

  const validateTips = computed(() => {
    return AbformValidate.getValidateTips(formField)
  })

  // inputField相关的引用，用于表单abForm
  const formField: AbInputField = reactive({
    rules: props.rules,
    name: props.desc,
    modelValue: fileList,
    validateError: '',
    columnCode: props.columnCode,
    tableCode: props.tableCode,
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

  onMounted(() => {
    AbformValidate.addField2Form(formField, props.permission, abFormMananger)
  })

  // 移除校验
  onBeforeUnmount(() => {
    abFormMananger.removeField(formField)
  })

  //联动更新校验字段
  watch(
    () => fileList.value,
    (newValue: any) => {
      if (newValue == '[]') {
        fileList.value = ''
      } else {
        emit('update:modelValue', newValue)
        AbformValidate.blurValidate(formField)
      }
    },
    {
      deep: true,
    }
  )

  //联动更新校验字段
  watch(
    () => modelValue.value,
    (newValue) => (fileList.value = newValue),
    {
      immediate: true,
      deep: true,
    }
  )
</script>

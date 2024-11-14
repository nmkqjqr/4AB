<template>
  <div
    v-if="permission !== 'n'"
    :class="abInputField.validateError ? 'ab-is-error' : ''"
  >
    <span v-if="permission === 'r' && readonlyShowText">{{ textValue }}</span>
    <el-tooltip v-else v-bind="validateTips">
      <span>
        <el-date-picker
          v-model="viewValue"
          class="ab-input"
          v-bind="$attrs"
          clearable
          :disabled="permission === 'r' || disabled"
          :disabled-date="disabledDate"
          :format="format"
          :type="type"
          @change="changetime"
        />
      </span>
    </el-tooltip>
  </div>
</template>

<script lang="ts">
  export default { name: 'AbMultipleDate' }
</script>

<script lang="ts" setup>
  import { RuleItem } from 'async-vallidator'
  import { PropType } from 'vue'
  import * as abFormat from '~/agilebpm/utils/ab-format'
  import * as AbformValidate from '../form-base/ab-form-field-validate'

  const props = defineProps({
    //选中项绑定值:array(DateRangePicker)
    modelValue: {
      type: String,
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
    format: {
      type: String,
      required: false,
      default: 'YYYY-MM-DD',
    },
    //日期选择允许的最小值:
    min: {
      type: String,
      default: '',
    },

    //日期选择允许的最大值:
    max: {
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
    // 描述字段，用于校验提示拼接所在的字段名字
    limit: {
      type: Number,
      default: 0,
    },
    type: {
      type: String as () =>
        | 'dates'
        | 'date'
        | 'year'
        | 'month'
        | 'week'
        | 'datetime'
        | 'datetimerange'
        | 'daterange'
        | 'monthrange',
      default: 'dates',
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
  const emit = defineEmits(['update:modelValue', 'handleCal'])
  //时间选择框的值
  const viewValue = ref()

  const textValue = ref()

  //表单校验管理对象
  const abFormMananger = inject('abForm') as AbFormProvide
  // 是否只读展示纯文本
  const readonlyShowText =
    props.readShowText != null
      ? props.readShowText
      : abFormMananger?.readonlyShowText

  // inputField相关的引用，用于表单abForm
  const abInputField: AbInputField = reactive({
    rules: props.rules,
    name: props.desc,
    modelValue: viewValue,
    validateError: '',
    columnCode: props.columnCode,
    tableCode: props.tableCode,
  })

  const validateTips = computed(() => {
    return AbformValidate.getValidateTips(abInputField)
  })

  //筛选最大时间和最小时间范围
  const disabledDate = (time: Date) => {
    let minflag = false
    let maxflag = false
    if (props.min) {
      if (props.min == '${currentDateTime}') {
        minflag = time.getTime() <= new Date().getTime()
      } else {
        minflag = time.getTime() <= new Date(props.min).getTime()
      }
    }
    if (props.max) {
      if (props.max == '${currentDateTime}') {
        maxflag = time.getTime() >= new Date().getTime()
      } else {
        maxflag = time.getTime() >= new Date(props.max).getTime()
      }
    }
    return minflag || maxflag
  }

  const changetime = () => {
    const limitflag =
      props.limit > 0 &&
      viewValue.value &&
      viewValue.value.length > 0 &&
      viewValue.value.length > props.limit
    if (limitflag) {
      ElMessage({
        showClose: true,
        message: '超出多选数量限制！',
        type: 'warning',
      })
      viewValue.value = viewValue.value.slice(0, props.limit)
    }

    emit('update:modelValue', formatViewValue(viewValue.value))
    AbformValidate.blurValidate(abInputField)
  }

  // 移除校验
  onBeforeUnmount(() => {
    abFormMananger.removeField(abInputField)
  })

  // 加入表单校验
  onMounted(() =>
    AbformValidate.addField2Form(abInputField, props.permission, abFormMananger)
  )

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

  const formatDate = (str: string) => {
    if (str) {
      return str.replaceAll('Y', 'y').replaceAll('D', 'd')
    }
  }

  watch(
    () => props.modelValue,
    (newValue) => {
      if (newValue) {
        viewValue.value = newValue.split(',').map((s) => new Date(s))
        console.log('viewValue.value', viewValue.value)
        const formatStr = props.format
          ? formatDate(props.format)
          : 'yyyy-MM-dd HH:mm:ss'

        const textValueArr = viewValue.value.map((s: any) =>
          abFormat.ab_dateFormat(s, formatStr)
        )
        textValue.value = textValueArr.join(',')
      }
    },
    {
      immediate: true,
    }
  )

  const formatViewValue = (dates: Date[]) => {
    if (dates && dates.length > 0) {
      const datesText = dates.map(
        (s) => `${s.getFullYear()}-${s.getMonth() + 1}-${s.getDate()}`
      )
      return datesText.join(',')
    }
    return ''
  }
</script>

<style scoped>
  .demo-date-picker :last-child {
    border-right: none;
  }

  .demo-date-picker {
    display: block;
    margin-bottom: 20px;
    font-size: 14px;
    color: var(--el-text-color-secondary);
  }
</style>

<template>
  <span>
    <el-date-picker
      v-model="viewValue"
      v-bind="$attrs"
      clearable
      :default-value="defaultTime"
      :format="dateFormat"
      placeholder="请选择固定值"
      :type="type"
      value-format="YYYY-MM-DD HH:mm:ss"
    />
  </span>
</template>

<script lang="ts" setup>
  import * as abFormat from '~/agilebpm/utils/ab-format'

  const props = defineProps({
    //选中项绑定值:array(DateRangePicker)
    modelValue: {
      required: true,
    },
    //父组件传入唯一标识
    code: {
      type: String,
      default: '',
    },
    format: {
      type: String,
      required: false,
      default: 'YYYY-MM-DD',
    },

    type: {
      type: String as () =>
        | 'date'
        | 'datetime'
        | 'year'
        | 'month'
        | 'dates'
        | 'week'
        | 'datetimerange'
        | 'daterange'
        | 'monthrange',
      default: 'date',
    },
  })

  const emit = defineEmits(['update:modelValue', 'handleCal'])

  const viewValue: any = useVModel(props, 'modelValue', emit)

  const { format, type } = toRefs(props)

  const dateFormat = ref()
  const defaultTime = ref()

  // 值修改后, 显示文本按照格式化也联动显示
  watch(
    () => viewValue.value,
    (newValue) => {
      const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/
      if (typeof newValue == 'string' && regex.test(newValue)) {
        /* empty */
      } else {
        viewValue.value = abFormat.ab_dateFormat(
          newValue,
          'yyyy-MM-dd HH:mm:ss'
        )
      }
    },
    {
      immediate: true,
    }
  )

  const init = () => {
    if (props.type == 'datetime') {
      dateFormat.value = 'YYYY-MM-DD HH:mm:ss'
    } else {
      dateFormat.value = format.value
    }
    defaultTime.value = new Date().setMinutes(0, 0)
  }

  init()

  watch(
    () => props.code,
    () => {
      viewValue.value = undefined
      init()
    }
  )
</script>

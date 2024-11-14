<template>
  <span>
    <el-date-picker
      v-model="viewValue"
      v-bind="$attrs"
      clearable
      :format="format"
      placeholder="请选择固定值"
      :type="type"
      @change="changetime"
    />
  </span>
</template>

<script lang="ts">
  export default { name: 'AbMultipleDate' }
</script>

<script lang="ts" setup>
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
  })

  // emit 事件定义
  const emit = defineEmits(['update:modelValue', 'handleCal'])
  //时间选择框的值
  const viewValue = ref()

  const changetime = () => {
    emit('update:modelValue', formatViewValue(viewValue.value))
  }

  const formatViewValue = (dates: Date[]) => {
    if (dates && dates.length > 0) {
      const datesText = dates.map(
        (s) => `${s.getFullYear()}-${s.getMonth() + 1}-${s.getDate()}`
      )
      return datesText.join(',')
    }
    return ''
  }

  if (props.modelValue) {
    viewValue.value = props.modelValue.split(',').map((s: any) => new Date(s))
  }

  watch(
    () => props.code,
    () => {
      viewValue.value = undefined
    }
  )
</script>

<template>
  <div
    v-if="permission !== 'n'"
    :class="abInputField.validateError ? 'ab-is-error' : ''"
  >
    <span v-if="permission === 'r' && readonlyShowText">
      {{ textValue }}
    </span>
    <el-tooltip v-else v-bind="validateTips">
      <span>
        <el-date-picker
          v-model="viewValue"
          class="ab-input"
          clearable
          :default-value="[defaultTime, defaultTime]"
          :disabled="permission === 'r' || disabled"
          :disabled-date="disabledDate"
          :end-placeholder="$abT('abform.date.endTime', '请选择结束日期')"
          v-bind="$attrs"
          :format="format"
          :start-placeholder="$abT('abform.date.startTime', '请选择开始日期')"
          :type="type"
          value-format="YYYY-MM-DD HH:mm:ss"
          @change="changetime"
        />
      </span>
    </el-tooltip>
  </div>
</template>

<script lang="ts">
  export default { name: 'AbRangeDate' }
</script>

<script lang="ts" setup>
  import { sysApi } from '@agilebpm/api'
  import { RuleItem } from 'async-validator'
  import { PropType } from 'vue'
  import { abUtil } from '~/agilebpm'
  import * as abFormat from '~/agilebpm/utils/ab-format'
  import * as AbformValidate from '../form-base/ab-form-field-validate'

  // // 指定组件命名
  // defineOptions({
  //   name: 'AbDate',
  // })
  const props = defineProps({
    //选中项绑定值:array(DateRangePicker)
    modelValue: {
      type: Date,
      required: true,
    },
    //映射对象
    objectMapping: {
      type: Object as any,
      default: null,
    },
    //映射属性字段
    valueMapping: {
      type: Array<string>,
      default: null,
    },
    //是否禁用: true/false  默认false
    disabled: {
      type: Boolean,
    },
    //日期类型
    type: {
      type: String,
      required: true,
    },
    //权限:w/r/n/b(编辑/只读/无权限/必填)   默认值 W （与element内置是否只读属性readonly绑定， 无需自己实现）
    permission: {
      type: String,
      default: 'w',
    },
    format: {
      type: String,
      required: true,
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
    // 天数字段
    dayNumberColumn: {
      type: String,
      default: '',
    },
    // 天数类型
    dayNumberType: {
      type: String,
      default: 'allDay',
    },
    // 节假日天数类型的字典分类（选择那一套系统的节假日）
    dayNumberTypeDict: {
      type: String,
      default: '',
    },
    // 是否开启统计
    isStatistics: {
      type: Boolean,
      default: true,
    },
    // 每天工作时
    dayHourCount: {
      type: String,
      default: '8',
    },
    // 统计类型
    statisticsType: {
      type: String,
      default: 'day',
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

  const date = new Date() // 创建一个 date 对象
  date.setHours(0, 0, 0, 0)
  const defaultTime = date
  // emit 事件定义
  const emit = defineEmits(['update:modelValue'])
  const {
    type,
    objectMapping,
    valueMapping,
    dayNumberColumn,
    dayNumberType,
    dayNumberTypeDict,
    dayHourCount,
    statisticsType,
    isStatistics,
  } = toRefs(props)

  //时间选择框的值
  const viewValue = ref([] as any[])
  //展示值
  const textValue = ref()
  //格式化字符串
  const str = props.format ? props.format : 'yyyy-MM-dd HH:mm:ss'
  //表单校验管理对象
  const abFormMananger = inject('abForm') as AbFormProvide
  // 是否只读展示纯文本
  const readonlyShowText =
    props.readShowText != null
      ? props.readShowText
      : abFormMananger?.readonlyShowText

  const validateTips = computed(() => {
    return AbformValidate.getValidateTips(abInputField)
  })

  let oldValue: any = props.modelValue

  // inputField相关的引用，用于表单abForm
  const abInputField: AbInputField = reactive({
    rules: props.rules,
    name: props.desc,
    modelValue: props.modelValue,
    validateError: '',
    columnCode: props.columnCode,
    tableCode: props.tableCode,
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

  //修改时间时联动修改其他对象数据
  const changetime = (dates: Date[]) => {
    //初始化/添加时触发写入其他字段
    for (const key in valueMapping.value) {
      const str = valueMapping.value[key]
      const dateKey = Number(key) + 1
      if (dates && dates[dateKey]) {
        objectMapping.value[str] = dates[dateKey]
      } else {
        objectMapping.value[str] = ''
      }
    }
    const newDate = dates && dates[0] ? dates[0] : ''
    oldValue = newDate
    emit('update:modelValue', newDate)
    abInputField.modelValue = newDate
    AbformValidate.blurValidate(abInputField)
    updateText()

    //如果开启统计，有填充得天数字段， 选了值，以及选的值为两个时 统计天数
    if (
      isStatistics.value &&
      dayNumberColumn.value &&
      viewValue.value &&
      viewValue.value.length === 2
    ) {
      getDayDifference().then((s) => {
        objectMapping.value[dayNumberColumn.value] = s
        console.log('最终的赋值', s)
      })
    }
  }

  //根据配置统计范围时间差
  const getDayDifference = async () => {
    const start = new Date(viewValue.value[0])
    const end = new Date(viewValue.value[1])
    //两个时间毫秒差
    const diffTime = Math.abs(end.getTime() - start.getTime())

    //如果统计的是月，不考虑假期和工作时间直接统计月返回
    if (statisticsType.value == 'month') {
      // 除以每月的毫秒数，得到月份数
      const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30)
      // 如果月份数小于1，就按1算，否则就向上取整
      return diffMonths < 1 ? 1 : Math.ceil(diffMonths)
    }
    //如果统计的是小时，同时类型为时分秒类型，则也不考虑假期和工作时间直接返回
    if (statisticsType.value == 'hour' && type.value == 'datetimerange') {
      return Math.ceil(diffTime / 1000 / 60 / 60)
    }

    let day: number = Math.floor(diffTime / (24 * 3600 * 1000))
    console.log('计算的天数 （向下取整不足24小时可能为0）', abUtil.clone(day))
    //对于datetimerange类型来说，因为时间为向下取整，并且要计算时间，是做减法，因此需要先加一，此时的数量差是不对的，需要减后才正确
    //对于非时分秒的日期来说， 因为结束那一天也要算一天，因此也需要加一，此时的数量差是对的
    //上方的时间天数定义之所以向下取整，然后+1  也跟此有关，为了同时兼容时分秒的计算以及非时分秒的天数+1，这样后续的逻辑中能少写判断和处理天数
    day += 1
    console.log(
      '计算的天数+1  因时间为向下取整，并且要做减法运算，需要先加一天然后再根据小时减',
      abUtil.clone(day)
    )
    if (type.value == 'datetimerange') {
      //结束时间在早12点前，当天不统计工作日 -1（因占用了上午的上班时间，因此连半天工作日都不算，比如上满半天才能统计0.5天） 在12点后18点前算工作半天，（-0.5）18点后统计当前算一天
      if (start.getHours() > 13) {
        day = day - 1
        console.log(
          '因开始时间在中午上班之后，因此不统计当天为工作有效天',
          abUtil.clone(day)
        )
      } else if (start.getHours() > 7) {
        day = day - 0.5
        console.log(
          '因开始时间在早上上班之后，只计算下午的半天，上午午因不满半天不计算为工作时间。 （-0.5）',
          abUtil.clone(day)
        )
      }

      //结束时间在早12点前，当天不统计工作日 -1（因占用了上午的上班时间，因此连半天工作日都不算，比如上满半天才能统计0.5天） 在12点后18点前算工作半天，（-0.5）18点后统计当前算一天
      if (end.getHours() < 12) {
        day = day - 1
        console.log(
          '因结束时间在中午下班之前，所以统计的计算工作日需要把当天扣除（-1），必须在中午下班后才能统计你工作了半天 ',
          abUtil.clone(day)
        )
      } else if (end.getHours() < 18) {
        day = day - 0.5
        console.log(
          '因结束时间在当天下班之前，只计算上午的半天，下午因不满半天不计算为工作时间。 （-0.5）',
          abUtil.clone(day)
        )
      }

      console.log('扣完结束时间 天数为', abUtil.clone(day))
      if (start.getHours() > end.getHours()) {
        day = day + 1
        console.log(
          '因开始时间大于结束时间因此加一天（向下取整导致的）',
          abUtil.clone(day)
        )
      } else if (start.getHours() == end.getHours()) {
        if (start.getMinutes() > end.getMinutes()) {
          console.log(
            '因开始时间大于结束时间因此加一天（向下取整导致的',
            abUtil.clone(day)
          )
          day = day + 1
        } else if (start.getMinutes() == end.getMinutes()) {
          if (start.getSeconds() > end.getSeconds()) {
            console.log(
              '因开始时间大于结束时间因此加一天（向下取整导致的',
              abUtil.clone(day)
            )
            day = day + 1
          }
        }
      }
    }
    if (dayNumberType.value == 'workDay') {
      const rel = await sysApi.holiday.getHolidayDays({
        startDay: start.getTime(),
        endDay: end.getTime(),
        system: dayNumberTypeDict.value,
        dayHalf: type.value == 'datetimerange',
      })
      console.log('计算的天数差2', abUtil.clone(day))
      console.log('后台返回的假期天数', rel.data)
      let number = day - rel.data
      if (number < 0) {
        number = 0
      }
      return (
        number *
        (statisticsType.value == 'hour' ? Number(dayHourCount.value) : 1)
      )
    } else {
      if (day < 0) {
        day = 0
      }
      return (
        day * (statisticsType.value == 'hour' ? Number(dayHourCount.value) : 1)
      )
    }
  }
  //修正不正确的格式化改（element框架使用的大写改为ab组件支持的小写）
  const formatDate = (str: string) => {
    return str.replaceAll('Y', 'y').replaceAll('D', 'd')
  }

  //联动更新展示文本
  const updateText = () => {
    if (viewValue.value && viewValue.value.length > 0) {
      textValue.value = viewValue.value
        .map((e) => abFormat.ab_dateFormat(e, formatDate(str)))
        .join(',')
    } else {
      textValue.value = ''
    }
  }

  // 移除校验
  onBeforeUnmount(() => {
    abFormMananger.removeField(abInputField)
  })

  // 加入表单校验
  onMounted(() => {
    //首次进入把其他属性的时间戳加入viewValue
    if (props.modelValue) {
      viewValue.value.push(props.modelValue)
      for (const key in valueMapping.value) {
        const val = valueMapping.value[key]
        const date = objectMapping.value[val]
        if (date && date.length > 0) {
          viewValue.value.push(date)
        }
      }
      updateText()
      AbformValidate.addField2Form(
        abInputField,
        props.permission,
        abFormMananger
      )
    }
  })

  // 入参改变时,联动viewValue
  watch(
    () => props.modelValue,
    (newValue) => {
      if (newValue && oldValue != newValue) {
        oldValue = newValue
        viewValue.value = new Array(new Date(newValue))
      }
    }
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

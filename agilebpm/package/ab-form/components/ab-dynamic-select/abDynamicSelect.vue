<template>
  <div
    v-if="props.permission !== 'n'"
    :class="abInputField.validateError ? 'ab-is-error' : ''"
  >
    <span v-if="props.permission === 'r' && readonlyShowText">
      {{ info.descValue }}
    </span>
    <el-tooltip v-else v-bind="validateTips">
      <el-select
        v-bind="$attrs"
        id="dynamicSelectWarp"
        v-model="info.viewValue"
        v-load-more:[props.dialogKey]="loadModelFn"
        class="ab-input"
        clearable
        :disabled="props.permission === 'r' || props.disabled"
        :filter-method="filteMethod"
        :popper-class="props.dialogKey"
        :multiple-limit="props.multiple ? props.multipleLimit : 1"
        multiple
        collapse-tags
        collapse-tags-tooltip
        :max-collapse-tags="3"
        @change="handleChange"
        @visible-change="visibleChange"
      >
        <el-option
          v-for="op in info.options"
          :key="op.value"
          :label="op.label"
          :value="op.value"
        />
      </el-select>
    </el-tooltip>
  </div>
</template>

<script lang="ts">
  import loadMore from './load-more-directive'
  export default {
    directives: {
      loadMore,
    },
  }
</script>

<script setup lang="ts">
  import { abDynamicSelectProps } from './abDynamicSelect'
  import { bizApi } from '@agilebpm/api'
  import { ElMessage } from 'element-plus'
  import * as AbformValidate from '../form-base/ab-form-field-validate'
  import { abT } from '@/i18n'
  const props = defineProps(abDynamicSelectProps)
  const info: any = reactive({
    options: [],
    viewValue: [],
    descValue: '',
    timer: null,
    noPage: false,
  })
  const query = reactive({
    pageSize: 20,
    currentPage: 1,
    queryParam: props.param,
    noMore: false,
    page: true,
  })
  // emit 事件数据更新
  const emit = defineEmits(['update:modelValue'])

  // 是否只读展示纯文本
  const abFormMananger = inject('abForm') as AbFormProvide
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
    modelValue: info.viewValue,
    validateError: '',
    columnCode: props.columnCode,
    tableCode: props.tableCode,
  })

  const validateTips = computed(() => {
    return AbformValidate.getValidateTips(abInputField)
  })

  const initOptions = async () => {
    query.pageSize = 20
    if (info.viewValue.length > 0) {
      query.pageSize = 200
    }
    const result = await bizApi.customDialog.getDialogDataList(
      props.dialogKey,
      query
    )
    if (result.isOk && result.data) {
      info.options.splice(0, info.options.length)
      buildOptions(result.data)
      getDescValue(info.viewValue)
      checkValue()
    } else {
      ElMessage.error(
        abT(
          'abform.cascadeSelect.dialogGetErrorMsg',
          '获取【{a}】对话框失败，请联系管理员！',
          { a: props.dialogKey }
        )
      )
    }
  }

  const buildOptions = (dataList: Array<any>) => {
    dataList.forEach((item: any) => {
      info.options.push({
        value: item[props.valueField].toString(),
        label: item[props.labelField],
      })
    })
  }
  const getDescValue = (viewValue: Array<any>) => {
    if (!viewValue || viewValue.length == 0) {
      info.descValue = ''
      return
    }
    const descValue = []
    info.options.forEach((item: any) => {
      if (viewValue.indexOf(item.value) > -1) {
        descValue.push(item.label)
      }
    })
    info.descValue = descValue.join(',')
  }
  const handleChange = (value: any) => {
    abInputField.modelValue = value
    AbformValidate.blurValidate(abInputField)
    if (value && value.length > 0) {
      emit('update:modelValue', value.join(','))
    } else {
      emit('update:modelValue', '')
    }
  }

  const visibleChange = () => {
    query.currentPage = 1
    query.noMore = info.noPage
    initOptions()
  }

  watch(
    () => info.viewValue.length,
    (val: any) => {
      getDescValue(info.viewValue)
      abInputField.modelValue = info.viewValue
    }
  )

  //参数 ，对话框的key 发生改变则下拉框的内容跟着改变
  watch(
    [() => props.param, () => props.dialogKey],
    (val) => {
      query.queryParam = val[0]
      query.currentPage = 1
      if (info.timer) {
        clearTimeout(info.timer)
      }
      //0.5秒后才执行
      info.timer = setTimeout(() => {
        initOptions()
      }, 1000)
    },
    { deep: true }
  )

  const checkValue = () => {
    if (!info.options || info.options.length === 0) {
      info.viewValue = []
      info.descValue = ''
      return
    }
    const haveValue = info.options.find((item: any) => {
      return info.viewValue.indexOf(item.value) > -1
    })
    if (!haveValue) {
      info.viewValue = []
      info.descValue = ''
    }
  }

  const loadModelFn = async () => {
    if (query.noMore) {
      return
    }
    query.currentPage++
    await bizApi.customDialog
      .getDialogDataList(props.dialogKey, query)
      .then((result: any) => {
        if (!result.data || result.data.length === 0) {
          query.noMore = true
        } else {
          buildOptions(result.data)
        }
      })
  }
  const filteMethod = async (filteVal: any) => {
    info.options.splice(0, info.options.length)
    query.queryParam[props.filterField] = filteVal
    await bizApi.customDialog
      .getDialogDataList(props.dialogKey, query)
      .then((result: any) => {
        info.options.splice(0, info.options.length)
        buildOptions(result.data)
      })
  }

  // 移除校验
  onBeforeUnmount(() => {
    abFormMananger.removeField(abInputField)
  })

  //modelValue变化后，viewValue也变化
  watch(
    () => props.modelValue,
    (val) => {
      if (val) {
        info.viewValue = val.split(',')
      } else {
        info.viewValue = []
      }

      checkValue()
    }
  )
  // 加入表单校验
  onMounted(() => {
    AbformValidate.addField2Form(abInputField, props.permission, abFormMananger)
    if (props.modelValue) {
      info.viewValue = props.modelValue.split(',')
    }
    initOptions()
  })

  //获取对话信息，获取分页配置
  bizApi.customDialog.getDialogByCode(props.dialogKey).then((result: any) => {
    if (!result.isOk || !result.data) {
      return
    }
    //如果不分页则就加载一次就好
    if (!result.data.page || result.data.page === 0) {
      query.noMore = true
      info.noPage = true
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

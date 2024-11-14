<template>
  <div
    v-if="permission !== 'n'"
    :class="abInputField.validateError ? 'ab-is-error' : ''"
  >
    <span v-if="permission === 'r' && readonlyShowText" class="orgName">
      <span v-for="data in pageData.dataList" :key="data.value">
        <select-icon
          class="iconImg"
          :data="data"
          :form-code="props.detailFormCode"
          :icon="props.selectType === 'user' ? data.photo : props.icon"
          :select-type="props.selectType"
          :show-detail="props.showDetail"
        />
      </span>
    </span>

    <el-tooltip v-else v-bind="validateTips">
      <div style="overflow: hidden">
        <span
          v-for="(data, index) in pageData.dataList"
          :key="index"
          class="showStyle"
        >
          <select-icon
            class="iconImg"
            :data="data"
            :form-code="props.detailFormCode"
            :icon="props.selectType === 'user' ? data.photo : props.icon"
            :select-type="props.selectType"
            :show-detail="props.showDetail"
          >
            <template v-if="!props.disabled && props.permission !== 'r'">
              <el-icon
                v-if="!props.disabled && props.permission !== 'r'"
                color="#F56C6C"
                :size="16"
                style="margin: 8px"
                @click.prevent.stop="handleDelete(index)"
              >
                <Close />
              </el-icon>
            </template>
          </select-icon>
        </span>
        <ab-cust-dialog
          v-if="!props.disabled && props.permission !== 'r'"
          v-model="pageData.dataList"
          :dialog-key="props.dialogKey"
          :dialog-setting="props.dialogSetting"
          :disabled="props.disabled || props.permission === 'r'"
          :param="props.dialogParam"
          style="margin-top: 4px; margin-bottom: 2px"
          :value-mapping="valueMapping"
          @ok="handeMappingFn"
        >
          <el-icon style="vertical-align: middle">
            <Search />
          </el-icon>
          <span v-if="props.searchDesc" style="vertical-align: middle">
            {{ props.searchDesc }}
          </span>
        </ab-cust-dialog>
      </div>
    </el-tooltip>
  </div>
</template>

<script lang="ts" setup>
  import { abDataSelectorProps } from './abDataSelector'
  import * as AbformValidate from '../form-base/ab-form-field-validate'
  import { Search, Close } from '@element-plus/icons-vue'
  import { bizApi } from '~/agilebpm/api'
  import selectIcon from './selectIcon.vue'
  import { abT } from '@/i18n'

  const props = defineProps(abDataSelectorProps)

  //双向绑定
  const emit = defineEmits(['update:modelValue', 'input', 'change'])
  const values = useVModel(props, 'modelValue', emit)
  const { objectMapping } = toRefs(props)

  const pageData = reactive({
    dataList: [] as any[],
    param: {},
  })

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
    modelValue: values,
    validateError: '',
    columnCode: props.columnCode,
    tableCode: props.tableCode,
  })

  const valueMapping = computed(() => {
    const result = {}
    result[props.valueField] = 'value'
    result[props.labelField] = 'label'
    if (props.selectType === 'user') {
      result['photo'] = 'photo'
    }
    return result
  })

  /**
   * 【校验相关】
   */
  const inputBlur = () => {
    AbformValidate.blurValidate(abInputField)
  }
  const validateTips = computed(() => {
    return AbformValidate.getValidateTips(abInputField)
  })

  const getData = async (Ids: string) => {
    if (!Ids || !props.dialogKey) {
      return
    }
    //pageData.dataList.splice(0, pageData.dataList.length)
    const dataTemp = [] as any[]
    const queryParam = {}
    queryParam[`${props.param}$VIN`] = Ids

    const result = await bizApi.customDialog.getDialogDataList(
      props.dialogKey,
      {
        pageSize: 200,
        currentPage: 1,
        ignoreCondition: true,
        queryParam: queryParam,
      }
    )

    if (!result.isOk && !result.data) {
      ElMessage.error(
        abT(
          'abform.cascadeSelect.dialogGetErrorMsg',
          '获取【{a}】对话框失败，请联系管理员！',
          { a: props.dialogKey }
        )
      )
      return null
    }

    result.data.forEach((item: any) => {
      const data: any = {}
      data.value = item[props.valueField]
      data.label = item[props.labelField]
      if (props.selectType === 'user') {
        data.photo = item.photo
      }
      dataTemp.push(data)
    })
    pageData.dataList = dataTemp
    handMapping(result.data)
  }

  // 移除校验
  onBeforeUnmount(() => {
    abFormMananger.removeField(abInputField)
  })
  // 加入表单校验
  onMounted(() => {
    if (props.modelValue) {
      //请求接口获取人员信息
      getData(props.modelValue)
    }
    AbformValidate.addField2Form(abInputField, props.permission, abFormMananger)
  })

  // 动态权限必填切换后，切换校验
  watch(
    () => props.permission,
    (newValue) => {
      if (newValue && newValue === 'b') {
        AbformValidate.changeRequired(abInputField, true)
      } else {
        AbformValidate.changeRequired(abInputField, false)
      }
    }
  )

  //父组件的 orgId 改变，查询用户信息
  watch(
    () => values.value,
    (newValue: any) => {
      //获取用户信息
      if (values.value) {
        getData(newValue)
      } else {
        pageData.dataList = []
        handMapping(null)
      }
      emit('change', newValue)
    }
  )

  watch(
    () => pageData.dataList,
    (newValue: any) => {
      if (!newValue || newValue.length === 0) {
        values.value = ''
      } else {
        const valuesTemp: any[] = []
        const labels: any[] = []
        newValue.forEach((item: any) => {
          valuesTemp.push(item.value)
          labels.push(item.label)
        })
        values.value = valuesTemp.join(',')
      }
      inputBlur()
    },
    { deep: true }
  )

  const handMapping = (dataList: any[]) => {
    if (!props.valueMapping || Object.keys(props.valueMapping).length === 0) {
      return
    }

    if (!dataList || dataList.length === 0) {
      Object.keys(props.valueMapping).forEach((key: string) => {
        objectMapping.value[props.valueMapping[key]] = ''
      })
      return
    }

    Object.keys(props.valueMapping).forEach((key: string) => {
      const objValue = [] as any
      dataList.forEach((data: any) => {
        const tempStr = data[key]
        if (tempStr && tempStr !== '') {
          objValue.push(data[key])
        }
      })
      objectMapping.value[props.valueMapping[key]] = objValue.join(',')
    })
  }

  const handeMappingFn = (list: any) => {
    handMapping(list)
  }

  const handleDelete = (index: number) => {
    pageData.dataList.splice(index, 1)
  }
</script>

<template>
  <div
    v-if="props.permission !== 'n'"
    :class="abInputField.validateError ? 'ab-is-error' : ''"
  >
    <span v-show="props.permission === 'r' && readonlyShowText">
      {{ getDescValue() }}
    </span>

    <div v-show="props.permission !== 'r' || !readonlyShowText">
      <el-tooltip v-bind="validateTips">
        <el-cascader
          ref="cascaderRef"
          v-model="viewValue"
          class="ab-input"
          clearable
          collapse-tags
          collapse-tags-tooltip
          :disabled="props.permission === 'r' || props.disabled"
          :max-collapse-tags="3"
          :multiple-limit="3"
          :options="cascadeConfig.options"
          :placeholder="props.placeholder"
          :props="cascadeConfig"
          :show-all-levels="true"
          @change="handleChange"
          @visible-change="handleVisibleChange"
        />
      </el-tooltip>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { cascaderProps } from './abCascader'
  import { bizApi, postData } from '~/agilebpm/api'
  import * as AbformValidate from '../form-base/ab-form-field-validate'
  import { ElMessage } from 'element-plus'
  import { abT } from '@/i18n'
  const props = defineProps(cascaderProps)
  const viewValue = ref([])
  //只读的文本展示

  // emit 事件数据更新
  const emit = defineEmits(['update:modelValue', 'change'])
  // 是否只读展示纯文本
  const abFormMananger = inject('abForm') as AbFormProvide
  const readonlyShowText =
    props.readShowText != null
      ? props.readShowText
      : abFormMananger?.readonlyShowText
  const cascaderRef = ref()
  const hasChange = ref(false)

  /**
   * inputField相关的引用，用于表单abForm
   */
  const abInputField: AbInputField = reactive({
    rules: props.rules,
    name: props.desc,
    modelValue: props.modelValue,
    validateError: '',
    columnCode: props.columnCode,
    tableCode: props.tableCode,
  })

  const dialogInfo = reactive({
    parentKey: '',
    childKey: '',
    parentInitValue: '',
    query: { queryParam: props.param },
  })

  const validateTips = computed(() => {
    return AbformValidate.getValidateTips(abInputField)
  })

  // 移除校验
  onBeforeUnmount(() => {
    abFormMananger.removeField(abInputField)
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
  const handleChange = (value: any) => {
    abInputField.modelValue = value
    AbformValidate.blurValidate(abInputField)
    if (!value || value.length == 0) {
      emit('update:modelValue', '')
      emit('change', '')
      return
    }

    if (props.multiple) {
      const valueTemp = []
      value.forEach((e: any) => {
        valueTemp.push(e.join('/'))
      })
      emit('update:modelValue', valueTemp.join(','))
      emit('change', valueTemp.join(','))
    } else {
      emit('update:modelValue', value.join('/'))
      emit('change', value.join('/'))
    }
  }

  /**
   * 初始化对话框信息
   */
  async function initDialogInfo() {
    const { data: dialog } = await bizApi.customDialog.getDialogByCode(
      props.dialogKey
    )
    const treeConfig = dialog.treeConfig
    if (!treeConfig) {
      ElMessage.error(
        abT(
          'abform.cascadeSelect.dialogErrorMsg',
          '对话框数据不是树形结构，渲染不了级联下拉框'
        )
      )
      return
    }

    dialogInfo.parentInitValue = treeConfig.pidInitVal
    cascadeConfig.lazy = treeConfig.sync
    // 同步加载
    if (!cascadeConfig.lazy) {
      let { data: dataList } = await postData(
        `${bizApi.customDialog.treeDataByIdUrl}${props.dialogKey}`,
        { queryParam: props.param }
      )

      // 如果存在分页，则从分页中解构出列表
      if ('rows' in dataList) dataList = dataList.rows

      const dataMap = {}
      dataList.forEach((item: any) => (dataMap[item[treeConfig.id]] = item))

      // 找出列字段映射
      let labelFieldName = '',
        valueFieldName = ''
      for (const field of dialog.returnFields) {
        if (field.returnName === props.labelField) {
          labelFieldName = field.columnName
        } else if (field.returnName === props.valueField) {
          valueFieldName = field.columnName
        }
        if (labelFieldName && valueFieldName) break
      }

      if (!labelFieldName || !valueFieldName) {
        ElMessage.error(
          abT(
            'abform.cascadeSelect.dialogConfigErrorMsg',
            '对话框配置字段已发生变更，无法映射数据，请联系管理员'
          )
        )
        return
      }

      cascadeConfig.label = labelFieldName
      cascadeConfig.value = valueFieldName

      const rootList: any[] = []

      dataList.forEach((item: any) => {
        // 将其他类型统一转换为字符串类型
        item[valueFieldName] = `${item[valueFieldName]}`
        const parent = dataMap[item[treeConfig.pid]]
        if (parent) {
          parent.children = parent.children || []
          parent.children.push(item)
        } else {
          rootList.push(item)
        }
      })

      cascadeConfig.options = rootList
    }
  }
  const getParentInitValu = async () => {
    await bizApi.customDialog
      .getDialogByCode(props.dialogKey)
      .then((result: any) => {
        const dialog = result.data
        if (!dialog.treeConfig) {
          ElMessage.error(
            abT(
              'abform.cascadeSelect.dialogErrorMsg',
              '对话框数据不是树形结构，渲染不了级联下拉框'
            )
          )
        }
        dialogInfo.parentInitValue = dialog.treeConfig.pidInitVal
      }),
      () => {
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
    const optionsTemp = []
    for (let i = 0, item: any; (item = dataList[i++]); ) {
      const opstion = {
        value: `${item[props.valueField]}`,
        label: item[props.labelField],
        leaf: item.childCount == 0,
        disabled: false,
      }
      optionsTemp.push(opstion)
    }
    return optionsTemp
  }

  // modelvalue 发生变化，转成 viewValue 给 cascader
  watch(
    () => props.modelValue,
    (modelValue) => {
      modelValue2Viewvalue(modelValue)
    }
  )

  // 分隔数据类型，转成数组类型,如果支持多选 以‘/’分割成数组
  const modelValue2Viewvalue = (modelValue: string) => {
    if (!modelValue) {
      viewValue.value = []
      return
    }
    if (props.multiple) {
      const value = []
      modelValue.split(',').forEach((e: any) => {
        value.push(e.split('/'))
      })
      viewValue.value = value
    } else {
      viewValue.value = modelValue.split('/') as any
    }
  }

  const getDescValue = () => {
    const panel = cascaderRef?.value?.cascaderPanelRef
    if (panel && panel.checkedNodes && panel.checkedNodes.length > 0) {
      const texts = []
      panel.checkedNodes.forEach((node) => {
        texts.push(node.text)
      })
      return texts.join(',')
    }
    return ''
  }

  const cascadeConfig = reactive<{
    lazy: boolean
    options: any[]
    lazyLoad: any
    label?: string
    value?: string
    checkStrictly: boolean
    multiple: boolean
  }>({
    lazy: false,
    checkStrictly: props.checkStrictly,
    multiple: props.multiple,
    options: [] as any[],
    async lazyLoad(node: any, resolve: any) {
      const queryParam = { ...props.param }
      queryParam['id'] = node.value
      if (!node.value) {
        queryParam['id'] = dialogInfo.parentInitValue
      }

      bizApi.customDialog
        .getDialogDataList(props.dialogKey, { queryParam: queryParam })
        .then((result) => {
          if (!result.data || !result.data.length) {
            const panel = cascaderRef?.value.cascaderPanelRef
            panel.getFlattedNodes(true).push(node)
            node.data.leaf = true
            node.checked = true
            resolve(null)
            //在页面回显的时候，异步请求，数据展示有点问题，clearCheckedNodes会把选中的数据清掉
            if (hasChange.value) {
              panel.clearCheckedNodes()
            }
          } else {
            resolve(buildOptions(result.data))
          }
        })
    },
  })

  const handleVisibleChange = (value: boolean) => {
    hasChange.value = true
  }
  onMounted(() => {
    //加入表单校验
    AbformValidate.addField2Form(abInputField, props.permission, abFormMananger)
    modelValue2Viewvalue(props.modelValue)
    initDialogInfo()
  })
</script>

<style scoped>
  .example-block {
    margin: 1rem;
  }
  .example-demonstration {
    margin: 1rem;
  }
</style>

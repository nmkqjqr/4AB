<template>
  <span>
    <el-cascader
      ref="cascaderRef"
      v-model="viewValue"
      clearable
      collapse-tags
      collapse-tags-tooltip
      :max-collapse-tags="3"
      :multiple-limit="3"
      :options="cascadeConfig.options"
      placeholder="请选择固定值"
      :props="cascadeConfig"
      :show-all-levels="true"
      @change="handleChange"
      @visible-change="handleVisibleChange"
    />
  </span>
</template>

<script lang="ts" setup>
  import { ElMessage } from 'element-plus'
  import { ref } from 'vue'
  import { bizApi, postData } from '~/agilebpm/api'

  const props = defineProps({
    modelValue: {
      required: true,
    },
    //父组件传入的数据字典code
    code: {
      type: String,
      default: '',
    },
    //值字段名称
    valueField: {
      type: String,
      required: true,
      default: null,
    },
    //展示字段名称
    labelField: {
      type: String,
      required: true,
      default: null,
    },
    //对话框的key，数据源查询条件
    dialogKey: {
      type: String,
      default: null,
      required: true,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    checkStrictly: {
      type: Boolean,
      default: false,
    },
  })

  const viewValue = ref([])
  //只读的文本展示

  // emit 事件数据更新
  const emit = defineEmits(['update:modelValue'])

  const cascaderRef = ref()
  const hasChange = ref(false)

  const dialogInfo = reactive({
    parentKey: '',
    childKey: '',
    parentInitValue: '',
  })

  const handleChange = (value: any) => {
    if (!value || value.length == 0) {
      emit('update:modelValue', '')
      return
    }

    if (props.multiple) {
      const valueTemp = [] as any[]
      value.forEach((e: any) => {
        if (e) {
          valueTemp.push(e.join('/'))
        }
      })
      emit('update:modelValue', valueTemp.join(','))
    } else {
      emit('update:modelValue', value.join('/'))
    }
  }

  /**
   * 初始化对话框信息
   */
  async function initDialogInfo(code: string) {
    const { data: dialog } = await bizApi.customDialog.getDialogByCode(code)
    const treeConfig = dialog.treeConfig
    if (!treeConfig) {
      ElMessage.error('对话框数据不是树形结构，渲染不了级联下拉框')
      return
    }

    dialogInfo.parentInitValue = treeConfig.pidInitVal
    cascadeConfig.lazy = treeConfig.sync
    // 同步加载
    if (!cascadeConfig.lazy) {
      let { data: dataList } = await postData(
        `${bizApi.customDialog.treeDataByIdUrl}${props.dialogKey}`,
        {}
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
        ElMessage.error('对话框配置字段已发生变更，无法映射数据，请联系管理员')
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

  const buildOptions = (dataList: Array<any>) => {
    const optionsTemp = [] as any[]
    for (let i = 0, item: any; (item = dataList[i++]); ) {
      const opstion = {
        value: `${item[props.valueField]}`,
        label: item[props.labelField],
        leaf: item.childCount == 0,
        disabled: false,
      } as any
      optionsTemp.push(opstion)
    }
    return optionsTemp
  }

  // 分隔数据类型，转成数组类型,如果支持多选 以‘/’分割成数组
  const modelValue2Viewvalue = (modelValue: string) => {
    if (!modelValue) {
      viewValue.value = []
      return
    }
    if (props.multiple) {
      const value = [] as any[]
      modelValue.split(',').forEach((e: any) => {
        value.push(e?.split('/'))
      })
      viewValue.value = value
    } else {
      viewValue.value = modelValue.split('/') as any
    }
  }
  let cascadeConfig: any
  const init = () => {
    cascadeConfig = reactive({
      lazy: false,
      checkStrictly: props.checkStrictly,
      multiple: props.multiple,
      options: [] as any[],
      async lazyLoad(node: any, resolve: any) {
        const queryParam = {}
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
    } as any)
  }
  init()
  const handleVisibleChange = (value: boolean) => {
    hasChange.value = true
  }

  onMounted(() => {
    //加入表单校验
    modelValue2Viewvalue(props.modelValue)
    initDialogInfo(props.dialogKey)
  })

  watch(
    () => props.code,
    () => {
      modelValue2Viewvalue(props.modelValue)
      initDialogInfo(props.dialogKey)
      init()
    }
  )
</script>

<style scoped>
  .example-block {
    margin: 1rem;
  }
  .example-demonstration {
    margin: 1rem;
  }
</style>

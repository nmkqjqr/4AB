<template>
  <span>
    <div style="overflow: hidden">
      <span
        v-for="(data, index) in pageData.dataList"
        :key="index"
        class="showStyle"
      >
        <selector-icon
          class="iconImg"
          :data="data"
          :icon="props.selectType === 'user' ? data.photo : props.icon"
          :select-type="props.selectType"
        >
          <template #default>
            <el-icon
              color="#F56C6C"
              :size="16"
              style="margin: 8px"
              @click.prevent.stop="handleDelete(index)"
            >
              <Close />
            </el-icon>
          </template>
        </selector-icon>
      </span>
      <ab-cust-dialog
        v-model="pageData.dataList"
        :dialog-key="props.dialogKey"
        :dialog-setting="{
          multiple: multiple,
        }"
        style="margin-top: 4px; margin-bottom: 2px"
        :value-mapping="valueMapping"
      >
        <el-icon style="vertical-align: middle">
          <Search />
        </el-icon>
        <span v-if="props.searchDesc" style="vertical-align: middle">
          {{ props.searchDesc }}
        </span>
      </ab-cust-dialog>
    </div>
  </span>
</template>

<script lang="ts" setup>
  import { Close, Search } from '@element-plus/icons-vue'
  import { bizApi } from '~/agilebpm/api'
  import selectorIcon from './selectorIcon.vue'

  const props = defineProps({
    modelValue: {
      required: true,
    },
    //父组件传入唯一标识
    code: {
      type: String,
      default: '',
    },
    dialogKey: {
      type: String,
      required: true,
    },
    //数据查询参数
    param: {
      type: String,
      default: null,
    },

    //是否多选
    multiple: {
      type: Number,
      default: 0,
    },

    searchDesc: {
      type: String,
      default: '',
    },
    selectType: {
      type: String,
      default: 'custom',
    },
    valueField: {
      type: String,
      required: true,
      default: null,
    },
    labelField: {
      type: String,
      required: true,
      default: null,
    },
    icon: {
      type: String,
      default: null,
    },
  })

  //双向绑定
  const emit = defineEmits(['update:modelValue', 'input'])
  const values = useVModel(props, 'modelValue', emit)

  const pageData = reactive({
    dataList: [] as any[],
    param: {},
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
        ignoreCondition: true,
        queryParam: queryParam,
      }
    )

    if (!result.isOk && !result.data) {
      ElMessage.error(`获取【${props.dialogKey}】对话框失败，请联系管理员！`)
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
  }

  const valueMapping = computed(() => {
    const result = {}
    result[props.valueField] = 'value'
    result[props.labelField] = 'label'
    if (props.selectType === 'user') {
      result['photo'] = 'photo'
    }
    return result
  })

  // 加入表单校验
  onMounted(() => {
    if (props.modelValue) {
      //请求接口获取人员信息
      getData(props.modelValue)
    }
  })

  watch(
    () => values.value,
    (newValue: any) => {
      //获取用户信息
      if (values.value) {
        getData(newValue)
      }
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
    },
    { deep: true }
  )

  const handleDelete = (index: number) => {
    pageData.dataList.splice(index, 1)
  }

  watch(
    () => props.code,
    () => {
      pageData.dataList = []
    }
  )
</script>

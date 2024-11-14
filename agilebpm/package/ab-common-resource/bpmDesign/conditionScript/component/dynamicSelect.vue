<template>
  <span>
    <el-select
      v-bind="$attrs"
      v-model="info.viewValue"
      v-load-more:[props.dialogKey]="loadModelFn"
      clearable
      :filter-method="filteMethod"
      placeholder="请选择固定值"
      :popper-class="props.dialogKey"
      @change="handleChange"
    >
      <el-option
        v-for="op in info.options"
        :key="op.value"
        :label="op.label"
        :value="op.value"
      />
    </el-select>
  </span>
</template>

<script lang="ts">
  import loadMore from './util'
  export default {
    directives: {
      loadMore,
    },
  }
</script>

<script setup lang="ts">
  import { ElMessage } from 'element-plus'
  import { bizApi } from '~/agilebpm/api'
  const props = defineProps({
    modelValue: {
      required: true,
    },
    dialogKey: {
      type: String,
      required: true,
      default: null,
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
  })
  const info: any = reactive({
    options: [],
    viewValue: '',
    descValue: '',
    timer: null,
  })
  const query = reactive({
    pageSize: 200,
    currentPage: 1,
    noMore: false,
    page: true,
  })
  // emit 事件数据更新
  const emit = defineEmits(['update:modelValue'])

  const initOptions = async () => {
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
      ElMessage.error(`获取【${props.dialogKey}】对话框失败，请联系管理员！`)
    }
  }

  const buildOptions = (dataList: Array<any>) => {
    dataList.forEach((item: any) => {
      info.options.push({
        value: item[props.valueField],
        label: item[props.labelField],
      })
    })
  }
  const getDescValue = (viewValue: Array<any>) => {
    if (!viewValue) {
      info.descValue = ''
      return
    }
    info.options.forEach((item: any) => {
      if (item.value === viewValue) {
        info.descValue = item.label
        return
      }
    })
  }
  const handleChange = (value: any) => {
    emit('update:modelValue', value)
  }

  watch(
    () => info.viewValue,
    (val: any) => {
      getDescValue(val)
    }
  )

  //参数 ，对话框的key 发生改变则下拉框的内容跟着改变
  watch(
    () => props.dialogKey,
    (val) => {
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
      info.viewValue = ''
      info.descValue = ''
      return
    }
    const haveValue = info.options.find((item: any) => {
      return item.value === info.viewValue
    })
    if (!haveValue) {
      info.viewValue = ''
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
    await bizApi.customDialog
      .getDialogDataList(props.dialogKey, query)
      .then((result: any) => {
        info.options.splice(0, info.options.length)
        buildOptions(result.data)
      })
  }

  //modelValue变化后，viewValue也变化
  watch(
    () => props.modelValue,
    (val) => {
      info.viewValue = val
      checkValue()
    }
  )
  // 加入表单校验
  onMounted(() => {
    info.viewValue = props.modelValue
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
    }
  })
</script>

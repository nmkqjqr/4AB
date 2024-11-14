<template>
  <span></span>
</template>
<script setup lang="ts">
  import * as abUtil from '~/agilebpm/utils/ab-util'
  import { bizApi } from '@agilebpm/api'

  const props = defineProps({
    modelValue: {
      type: Object,
      required: true,
    },
    tablePath: {
      type: String,
      required: true,
    },
    boCode: {
      type: String,
      required: true,
    },
    permission: {
      type: String,
      default: 'w',
    },
    permissionType: {
      type: String,
      required: true,
    },
    permissionValue: {
      type: String,
      required: true,
    },
    fk: {
      type: String,
      required: true,
    },
    //是否初始化第一条数据
    initFirstRow: {
      type: Boolean,
      default: false,
    },
    //初始化数据
    initData: {
      type: Object,
      required: true,
    },
  })
  const modelValue = ref(props.modelValue)

  onMounted(() => {
    let tableCode = props.tablePath
    if (tableCode.endsWith('List')) {
      tableCode = tableCode.substring(0, tableCode.length - 4)
    }
    //初始化子表
    if (!modelValue.value[props.tablePath]) {
      modelValue.value[props.tablePath] = abUtil.Arrays.newAbSubList()
    } else {
      //修改成newAbSubList
      modelValue.value[props.tablePath] = handleHashCode(
        modelValue.value[props.tablePath]
      )
    }
    if (
      props.initFirstRow &&
      ['b', 'w'].includes(props.permission) &&
      modelValue.value[props.tablePath].length == 0
    ) {
      //初始化一条
      modelValue.value[props.tablePath].push(
        JSON.parse(JSON.stringify(props.initData))
      )
    }

    //无读以上的权限或者已加载过
    if (
      props.permission == 'n' ||
      !props.modelValue['_loadMap'] ||
      props.modelValue['_loadMap'][tableCode]
    ) {
      return
    }
    const mv = {}
    //只取相关外键
    props.fk.split(',').forEach((k) => {
      mv[k] = props.modelValue[k]
    })
    bizApi.bizForm
      .loadChildren(
        mv,
        props.boCode,
        tableCode,
        props.permissionType,
        props.permissionValue
      )
      .then(({ data }) => {
        modelValue.value['_loadMap'][tableCode] = true
        modelValue.value[props.tablePath] = handleHashCode(
          data[props.tablePath]
        )
      })
  })

  const handleHashCode = (list: any) => {
    const temp: any = abUtil.Arrays.newAbSubList()
    list.forEach((item: any) => temp.push(item))
    return temp
  }

  //watch(modelValue, (newVal, oldVal) => {}, { deep: true })
</script>

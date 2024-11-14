<template>
  <el-button v-if="isHand" v-bind="$attrs" @click="query">
    <slot></slot>
  </el-button>
</template>

<script lang="ts">
  export default {
    name: 'AbCustomQuery',
  }
</script>
<script lang="ts" setup>
  import { defineProps } from 'vue'
  import { ElMessage } from 'element-plus'
  import { bizApi } from '@agilebpm/api'
  import * as abUtil from '~/agilebpm/utils/ab-util'
  import { abT } from '@/i18n'

  const props = defineProps({
    dialogKey: {
      type: String,
      required: true,
    },
    //映射对象
    modelValue: {
      type: [Object, Array],
      required: true,
    },
    //对话框的参数
    param: {
      type: Object,
      default: null,
    },
    //映射关系
    valueMapping: {
      type: Object,
      default: null,
    },
    //页面加载，触发查询
    immediate: {
      type: Boolean,
      default: false,
    },
    //必填参数,没值的时候不触发查询
    requiredParams: {
      type: String,
      default: '',
    },
    mappingInitData: {
      type: Object,
      default: null,
    },
    //手动
    isHand: {
      type: Boolean,
      default: false,
    },
  })
  const emit = defineEmits(['update:modelValue'])

  //自定义对话框查询入参
  const dataInfo = reactive({
    query: {
      queryParam: {},
    },
    timer: null as any,
    dialogData: [] as any,
  })

  const handleDefaultValueList = (dataList: Array[any]) => {
    const result = abUtil.Arrays.newAbSubList()
    if (
      !props.mappingInitData ||
      JSON.stringify(props.mappingInitData) === '{}'
    ) {
      return dataList
    }

    dataList.forEach((data: any) => {
      const json = JSON.parse(JSON.stringify(props.mappingInitData))
      Object.keys(json).forEach((key: string) => {
        if (data[key]) {
          json[key] = data[key]
        }
      })
      result.push(json)
    })
    return result
  }

  const handleMapping = (dataList: Array<any>) => {
    if (!dataList || !props.valueMapping || !props.modelValue) {
      return
    }
    if (Array.isArray(props.modelValue)) {
      //赋值对象是数组
      const list = abUtil.Arrays.newAbSubList()
      if (
        props.valueMapping == null ||
        JSON.stringify(props.valueMapping) === '{}'
      ) {
        //无映射关系则把数据全返回
        list.push(...handleDefaultValueList(dataList))
        emit('update:modelValue', list)
        return
      }

      dataList.forEach((item: any) => {
        const json = props.mappingInitData
          ? JSON.parse(JSON.stringify(props.mappingInitData))
          : {}

        //处理映射关系
        for (const key in props.valueMapping) {
          const val = props.valueMapping[key]
          //如果val是a.b这样的，则需要对json.a初始化，不然直接操作json.a.b会报错
          const strs = val.split('.')
          let exp = 'json'
          for (let i = 0; i < strs.length - 1; i++) {
            exp = `${exp}.${strs[i]}`
            if (eval(`!${exp}`)) {
              //为空则初始化
              eval(`${exp} = {};`)
            }
          }
          if (item[key]) {
            eval(`json.${val} = item[key];`)
          }
        }
        list.push(json)
      })
      emit('update:modelValue', list)
    } else {
      //赋值对象是对象
      Object.keys(props.valueMapping).forEach((key: string) => {
        const val = props.valueMapping[key]

        const list = [] as any[]
        dataList.forEach((item: any) => {
          list.push(item[key])
        })
        props.modelValue[val] = list.join(',')
      })
    }
  }
  const initData = () => {
    if (!props.dialogKey) {
      return
    }
    bizApi.customDialog.getDialogDataList(props.dialogKey, dataInfo.query).then(
      (result: any) => {
        handleMapping(result.data)
      },
      () => {
        ElMessage.error(
          'abform.cascadeSelect.dialogGetErrorMsg',
          '获取【{a}】对话框失败，请联系管理员！',
          { a: props.dialogKey }
        )
      }
    )
  }

  const canImmediateSearch = () => {
    if (!props.requiredParams) {
      return true
    }
    const requiredParams = props.requiredParams.split(',')
    if (requiredParams.length === 0) {
      return true
    }
    const noValue = requiredParams.find((item: string) => {
      const paramValue = props.param[item]
      return !paramValue
    })
    if (noValue) {
      return false
    }
    return true
  }

  //判断页面是否一加载就执行查询赋值操作
  onMounted(() => {
    if (props.immediate && !props.isHand) {
      dataInfo.query.queryParam = !props.param ? {} : props.param
      if (canImmediateSearch()) {
        initData()
      }
    }
  })

  const query = () => {
    dataInfo.query.queryParam = !props.param ? {} : props.param
    initData()
  }

  //参数改变触发查询，时间间隔是1秒
  watch(
    () => props.param,
    (value, oldval) => {
      //手动、空值，无值，新老值的内容相等，不触发查询操作
      if (
        props.isHand ||
        !value ||
        JSON.stringify(value) === '{}' ||
        JSON.stringify(value) === JSON.stringify(oldval)
      ) {
        return
      }
      //检查必填参数是否有值,没值不执行查询
      if (!canImmediateSearch()) {
        return
      }

      dataInfo.query.queryParam = value
      if (dataInfo.timer) clearTimeout(dataInfo.timer)
      dataInfo.timer = setTimeout(initData, 1000)
    },
    { deep: true }
  )
</script>

<style></style>

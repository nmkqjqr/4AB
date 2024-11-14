<template>
  <span>
    <el-select
      v-bind="$attrs"
      v-model="viewValue"
      clearable
      :multiple="props.multiple"
      placeholder="请选择固定值"
      @change="changeSelect"
    >
      <el-option
        v-for="(item, index) in options"
        :key="index"
        :disabled="getDisable(item)"
        :label="item.text"
        :value="item.key"
      />
    </el-select>
  </span>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { sysApi } from '~/agilebpm/api'
  import { formatDictList } from './util'

  // // 指定组件命名
  // defineOptions({
  //   name: 'AbCheckboxGroup',
  // })
  //父类传入的属性
  const props = defineProps({
    modelValue: {
      required: true,
    },
    //父组件传入的数据字典code
    code: {
      type: String,
      default: '',
    },
    //父组件传入的单选框数据集合
    options: {
      type: Array as () => Array<CustFormOptions>,
      default: null,
    },
    //父组件传入的数据字典code
    dicCode: {
      type: String,
      default: '',
    },
    //是否多选
    multiple: {
      type: Boolean,
      default: false,
    },
    //父组件传入的数据字典code
    dicType: {
      type: String,
      required: true,
    },
    // 返回值是否是数字（仅限单选，开启多选则失效）
    isNumber: {
      type: Boolean,
      default: false,
    },
  })

  const options = ref([] as any)

  const viewValue = ref()

  const emit = defineEmits(['update:modelValue'])

  // 逗号分隔数据类型，转成数组类型
  const modelValue2Viewvalue = (modelValue: any) => {
    if (modelValue || (props.isNumber && modelValue == 0)) {
      let str = modelValue
      if (props.isNumber) {
        str = `${modelValue}`
      }
      viewValue.value = props.multiple ? (str ? str.split(',') : []) : str
    }
  }

  const getDisable = (item: any) => {
    if (!viewValue.value || viewValue.value.length == 0) {
      return false
    }
    return !viewValue.value.includes(item.key) && item.disable == 1
  }
  // viewValue 发生变化，转成 逗号分隔给modelValue
  const changeSelect = (value: any) => {
    //如果要求返回值为数字，则不能为多选
    let modelValueTemp
    if (props.isNumber && !props.multiple) {
      if (isNaN(parseFloat(value))) {
        modelValueTemp = 0
      } else {
        modelValueTemp = parseFloat(value)
      }
    } else {
      modelValueTemp =
        !value || value.length == 0
          ? ''
          : value instanceof Array
          ? value.join(',')
          : value
    }
    emit('update:modelValue', modelValueTemp)
    modelValue2Viewvalue(modelValueTemp)
  }

  const init = () => {
    //由于传入值非双向绑定，因此需要实时监听入参
    if (props.dicType == 'dicData' && props.dicCode) {
      sysApi.dict.getDictListByCode(props.dicCode).then((result: any) => {
        options.value = formatDictList(result).filter((s: any) => {
          if (props.multiple) {
            return viewValue.value?.includes(s.code) || !s.disable
          } else {
            return viewValue.value == s.code || !s.disable
          }
        })
      })
    } else {
      options.value = formatDictList(props.options)
    }
    modelValue2Viewvalue(props.modelValue)
  }

  init()

  watch(
    () => props.code,
    () => {
      viewValue.value = undefined
      init()
    }
  )
</script>

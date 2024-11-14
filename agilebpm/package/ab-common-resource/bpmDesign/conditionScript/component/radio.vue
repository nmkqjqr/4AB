<template>
  <span>
    <el-radio-group
      v-if="buttonStyle && buttonStyle == 'button'"
      v-model="viewValue"
      style="font-size: 14px"
      v-bind="$attrs"
    >
      <el-radio-button
        v-for="item in options"
        :key="item.key"
        :disabled="item.disable == 1"
        :label="item.key"
        style="font-size: 14px"
        v-bind="$attrs"
      >
        {{ item.text }}
      </el-radio-button>
    </el-radio-group>
    <el-radio-group
      v-else
      v-model="viewValue"
      style="font-size: 14px"
      v-bind="$attrs"
    >
      <el-radio
        v-for="item in options"
        :key="item.key"
        :disabled="item.disable == 1"
        :label="item.key"
        style="font-size: 14px"
        v-bind="$attrs"
      >
        {{ item.text }}
      </el-radio>
    </el-radio-group>
  </span>
</template>

<script lang="ts" setup>
  import { sysApi } from '~/agilebpm/api'
  import { formatDictList } from './util'

  const props = defineProps({
    modelValue: {
      required: true,
    },
    //父组件传入唯一标识
    code: {
      type: String,
      default: '',
    },
    //父组件传入的单选框数据集合
    options: {
      type: Array as () => Array<CustFormOptions>,
      default: null,
    },
    //按钮样式   marquee选择框    button按钮
    buttonStyle: {
      type: String,
      default: 'marquee',
    },
    //父组件传入的数据字典code
    dicCode: {
      type: String,
      default: '',
    },
    dicType: {
      type: String,
      default: '',
    },
  })
  // emit 事件定义
  const emit = defineEmits(['update:modelValue'])
  //多选框的选项数据
  const options = ref([] as CustFormOptions[])
  //与modelValue双向绑定的响应式对象
  const viewValue: any = useVModel(props, 'modelValue', emit)

  // 加入表单校验
  onMounted(() => {
    init()
  })

  const init = () => {
    // dicCode有值时，展示数据字典的的数据集合
    if (props.dicType == 'dicData' && props.dicCode) {
      sysApi.dict.getDictListByCode(props.dicCode).then((result: any) => {
        options.value = formatDictList(result).filter(
          (s: { key: any; disable: any }) =>
            s.key == viewValue.value || !s.disable
        )
      })
    } else {
      options.value = formatDictList(props.options)
    }
  }

  watch(
    () => props.code,
    () => {
      viewValue.value = ''
      init()
    }
  )
</script>

<template>
  <span>
    <el-checkbox-group v-model="viewValue" @change="changeCheckbox">
      <span v-if="buttonStyle && buttonStyle == 'button'">
        <el-checkbox-button
          v-for="(item, index) in options"
          :key="index"
          :disabled="!viewValue.includes(item.key) && item.disable"
          :label="item.key"
        >
          {{ item.text }}
        </el-checkbox-button>
      </span>
      <span v-else>
        <el-checkbox
          v-for="(item, index) in options"
          :key="index"
          :disabled="!viewValue.includes(item.key) && item.disable"
          :label="item.key"
        >
          {{ item.text }}
        </el-checkbox>
      </span>
    </el-checkbox-group>
  </span>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { sysApi } from '~/agilebpm/api'
  import { formatDictList } from './util'

  //父类传入的属性
  const props = defineProps({
    // 用户默认会定义为Object any ，如果指定类型则： type: Object as PropType<User>,
    modelValue: {
      required: true,
    },
    //父组件传入唯一标识
    code: {
      type: String,
      default: '',
    },
    dicCode: {
      type: String,
      default: '',
    },
    dicType: {
      type: String,
      default: '',
    },
    options: {
      type: Array as () => Array<CustFormOptions>,
      default: null,
    },
    //按钮样式   marquee选择框    button按钮
    buttonStyle: {
      type: String,
      default: 'marquee',
    },
  })

  //多选框的选项数据
  const options = ref([] as any)
  // 数组类型的值提供
  const viewValue = ref([] as Array<string>)
  // emit 事件定义
  const emit = defineEmits(['update:modelValue'])

  // 逗号分隔数据类型，转成数组类型
  const modelValue2Viewvalue = (modelValue: string) => {
    viewValue.value = modelValue ? modelValue.split(',') : []
  }

  const init = () => {
    modelValue2Viewvalue(props.modelValue)
    // 如果dicCode有值,则获取数据字典的数据
    if (props.dicType == 'dicData' && props.dicCode) {
      sysApi.dict.getDictListByCode(props.dicCode).then((result) => {
        options.value = formatDictList(result).filter(
          (s: any) => viewValue.value?.includes(s.key) || !s.disable
        )
      })
    } else {
      options.value = formatDictList(props.options)
    }
  }
  //DOM挂载完
  onMounted(() => {
    init()
  })

  // 逗号分隔数据类型，转成数组类型
  const changeCheckbox = (viewValue: any) => {
    emit(
      'update:modelValue',
      !viewValue || viewValue.length == 0 ? '' : viewValue.join(',')
    )
  }

  watch(
    () => props.code,
    () => {
      viewValue.value = []
      init()
    }
  )
</script>

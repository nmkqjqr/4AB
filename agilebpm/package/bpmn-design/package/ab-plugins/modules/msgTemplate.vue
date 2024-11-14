<template>
  <el-tag v-model="info.selectValue" class="ml-2" type="info">
    {{ info.selectItem }}
  </el-tag>

  <ab-cust-dialog
    dialog-key="xxmbxz"
    size="small"
    style="margin-top: -2px; margin-left: 8px"
    type="primary"
    @ok="chooseresCondition"
  >
    选择消息模板
  </ab-cust-dialog>
</template>
<script lang="ts" setup>
  import { sysApi } from '~/agilebpm/api'

  // update: 需要双向绑定的属性名
  const emit = defineEmits(['update:modelValue'])

  //v-model 默认的值为 value 可以通过 : 自定义
  const props = defineProps({
    modelValue: {
      type: String,
      default: null,
      require: true,
    },
  })

  const info = reactive({
    selectValue: '',
    selectItem: '',
    dataList: [
      {
        code: '',
        name: '',
      },
    ],
  })

  // 条件脚本赋值
  const chooseresCondition = (list: any) => {
    if (list) {
      info.selectItem = list[0].name_
      info.selectValue = list[0].code_
    }
  }

  watch(
    () => props.modelValue,
    (newValue: any) => {
      if (newValue) {
        info.selectValue = newValue
        sysApi.messageTemplate
          .getTemplateByCode(newValue)
          .then((result: any) => {
            info.selectItem = result.data.name
          })
      } else {
        info.selectValue = ''
      }
    },
    {
      immediate: true,
    }
  )
  watch(
    () => info.selectValue,
    (newValue: any) => {
      if (newValue) {
        emit('update:modelValue', newValue)
      } else {
        emit('update:modelValue', '')
      }
    }
  )
</script>

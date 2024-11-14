<template>
  <el-checkbox-group v-model="info.selectValue">
    <el-checkbox
      v-for="msg in info.msgTypeList"
      :key="msg.key"
      :label="msg.key"
    >
      {{ msg.text }}
    </el-checkbox>
  </el-checkbox-group>
</template>

<script lang="ts" setup>
  import { ref, watch, reactive } from 'vue'
  import { sysApi } from '@agilebpm/api'
  // update: 需要双向绑定的属性名
  const emit = defineEmits(['update:modelValue'])
  //v-model 默认的值为 value 可以通过 : 自定义
  const props = defineProps({
    modelValue: {
      type: String,
      default: null,
      require: true,
    },
    notSupportType: {
      type: Array,
      default: () => [],
    },
  })
  const info = reactive({
    selectValue: [],
    msgTypeList: [],
  })
  watch(
    () => props.modelValue,
    (newValue: any) => {
      if (newValue) {
        info.selectValue = newValue.split(',')
      }
    },
    { immediate: true }
  )
  watch(
    () => info.selectValue,
    (newValue: any) => {
      if (newValue) {
        emit('update:modelValue', newValue.join(','))
      } else {
        emit('update:modelValue', '')
      }
    }
  )

  //请求 消息类型数据

  sysApi.tools
    .InterFaceImpls('com.dstz.component.msg.handler.AbsNotifyMessageHandler')
    .then((result: any) => {
      if (result && result.length > 0) {
        const canUseType = []
        if (props.notSupportType.length > 0) {
          result.forEach((e) => {
            if (props.notSupportType.indexOf(e.type) < 0) {
              canUseType.push(e)
            }
          })
        } else {
          canUseType.push(...result)
        }
        const defaultType = []
        for (const index in canUseType) {
          info.msgTypeList.push({
            key: canUseType[index].type,
            text: canUseType[index].title,
          })
          if (canUseType[index].isDefault) {
            defaultType.push(canUseType[index].type)
          }
        }
        if (!props.modelValue) {
          info.selectValue = defaultType
        }
      }
    })
</script>

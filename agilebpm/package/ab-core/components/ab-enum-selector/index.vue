<template>
  <el-select v-bind="attrs" v-model="info.data" @change="change">
    <el-option
      v-for="item in info.enumList"
      :key="item[keyName]"
      :label="item[descName]"
      :value="item[keyName]"
    />
  </el-select>
</template>

<script lang="ts" setup>
  import { onMounted, reactive } from 'vue'
  import { sysApi, postData } from '~/agilebpm/api'
  import { useAttrs } from 'vue'

  const attrs = useAttrs()

  const props = defineProps({
    modelValue: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    keyName: {
      type: String,
      default: 'key',
    },
    descName: {
      type: String,
      default: 'desc',
    },
  })

  const emit = defineEmits(['update:modelValue'])

  const info: any = reactive({
    data: '',
    enumList: [],
  })

  const change = () => {
    emit('update:modelValue', info.data)
  }

  onMounted(() => {
    info.data = props.modelValue
    sysApi.tools.getEnum(props.path, true).then((resp) => {
      info.enumList = resp.data
      console.info(info.enumList)
    })
  })
</script>

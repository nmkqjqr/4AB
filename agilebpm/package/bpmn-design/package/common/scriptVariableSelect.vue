<template>
  <el-space>
    <el-cascader
      v-model="info.scriptVariables"
      clearable
      :options="scriptVariables"
      placeholder="请选择常用流程变量"
      separator="-"
      @change="setVariableScript"
    />
    <ab-cust-dialog
      dialog-key="scriptSelector"
      type="primary "
      @ok="setCommonScript"
    >
      常用脚本
    </ab-cust-dialog>
  </el-space>
</template>

<script setup lang="ts">
  const scriptVariables = inject('scriptVariables') as any

  // modelValue 即 脚本字段
  const props = defineProps({
    modelValue: {
      required: true,
      type: String,
    },
  })

  const emit = defineEmits(['update:modelValue'])
  const value = useVModel(props, 'modelValue', emit)

  const info: any = reactive({
    scriptVariables: [],
  })
  info.scriptVariables = []
  // 设置脚本变量的
  const setVariableScript = () => {
    value.value = `${
      value?.value == undefined ? '' : value?.value
    } ${info.scriptVariables.join('.')}`
    window.setTimeout(() => {
      // 置空
      //info.scriptVariables = []
    }, 100)
  }
  const setCommonScript = (val: any) => {
    value.value = `${value?.value == undefined ? '' : value?.value} ${
      val[0].script
    }`
  }
</script>

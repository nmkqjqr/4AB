<template>
  <el-space>
    <el-cascader
      v-model="info.scriptVariables"
      clearable
      :options="info.scriptVariables_new"
      :placeholder="
        $abT('bpm.office.selectCommonProcessVariables', '请选择常用流程变量')
      "
      separator="-"
      @change="setVariableScript"
    />
    <ab-cust-dialog
      dialog-key="scriptSelector"
      type="primary "
      @ok="setCommonScript"
    >
      {{ $abT('bpm.office.commonScripts', '常用脚本') }}
    </ab-cust-dialog>
  </el-space>
</template>

<script setup lang="ts">
  import { abUtil } from '~/agilebpm'

  let scriptVariables_init = inject('scriptVariables') as any

  // modelValue 即 脚本字段
  const props = defineProps({
    modelValue: {
      required: true,
      type: String,
    },
    isNodeInit: {
      required: false,
      type: Boolean,
      default: false,
    },
    isCloseScriptVariables: {
      required: false,
      type: Boolean,
      default: false,
    },
  })
  const info: any = reactive({
    scriptVariables: [],
    scriptVariables_new: [],
  })

  const dealInitVariables = () => {
    info.scriptVariables_new = []
    if (props.isCloseScriptVariables && scriptVariables_init) {
      info.scriptVariables_new = []
      scriptVariables_init.forEach((item: any) => {
        if (item.type != 'variables') {
          info.scriptVariables_new.push(item)
        }
      })
    } else {
      info.scriptVariables_new = abUtil.clone(scriptVariables_init)
    }
  }
  dealInitVariables()

  watch(
    () => props.isCloseScriptVariables,
    (newValue: any) => {
      dealInitVariables()
    }
  )

  const emit = defineEmits(['update:modelValue'])
  const value = useVModel(props, 'modelValue', emit)

  const dealInitNodeVariables = (variStr: string) => {
    if (variStr) {
      const regex = /\('([^']+)'\)/
      const matches = variStr.match(regex)
      if (matches && matches.length > 1) {
        const variName = matches[1]
        return (
          " bpmScript.getVariableByActInstId(bpmInstance.actInstId,'" +
          variName +
          "')"
        )
      }
    }
    return ''
  }

  // 设置脚本变量的
  const setVariableScript = () => {
    if (
      props.isNodeInit &&
      info.scriptVariables.join('.').indexOf('variableScope') != -1
    ) {
      value.value =
        `${value?.value == undefined ? '' : value?.value} ` +
        dealInitNodeVariables(info.scriptVariables.join('.'))
    } else {
      value.value = `${
        value?.value == undefined ? '' : value?.value
      } ${info.scriptVariables.join('.')}`
    }
  }
  const setCommonScript = (val: any) => {
    value.value = `${value?.value == undefined ? '' : value?.value} ${
      val[0].script
    }`
  }
</script>

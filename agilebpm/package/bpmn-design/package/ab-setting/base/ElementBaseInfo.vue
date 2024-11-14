<template>
  <div class="panel-tab__content">
    <el-form label-width="90px" size="small">
      <el-form-item label="ID">
        <el-input
          v-model="elementBaseInfo.id"
          clearable
          :disabled="idDisabled"
          @change="updateBaseInfo('id')"
        />
      </el-form-item>
      <el-form-item label="名称">
        <el-input
          v-model="elementBaseInfo.name"
          clearable
          @change="updateBaseInfo('name')"
        />
      </el-form-item>
      <el-form-item label="描述">
        <el-input
          v-model="elementBaseInfo.remark"
          clearable
          type="textarea"
          @change="updateBaseInfo('remark')"
        />
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, computed, ref, watch, defineProps } from 'vue'

  const elementBaseInfo: any = reactive({
    id: '',
    name: '',
    remark: '',
  })
  const props = defineProps({
    businessObject: Object,
    type: String,
    idDisabled: {
      type: Boolean,
      default: true,
    },
  })
  watch(
    () => props.businessObject,
    (val, pre) => {
      if (val) {
        resetBaseInfo()
      }
    }
  )
  var bpmnElement: any

  const resetBaseInfo = () => {
    bpmnElement = (window as any)?.bpmnInstances?.bpmnElement || {}
    for (var i in elementBaseInfo) {
      elementBaseInfo[i] =
        bpmnElement.businessObject[i] || bpmnElement.businessObject.$attrs[i]
    }
    if (elementBaseInfo && elementBaseInfo.$type === 'bpmn:SubProcess') {
      elementBaseInfo.isExpanded = elementBaseInfo.di?.isExpanded
    }
  }
  const updateBaseInfo = (key: any) => {
    bpmnElement = (window as any)?.bpmnInstances?.bpmnElement || {}
    if (key === 'id') {
      ;(window as any).bpmnInstances.modeling.updateProperties(bpmnElement, {
        id: elementBaseInfo[key],
        di: { id: `${elementBaseInfo[key]}_di` },
      })
      return
    }
    if (key === 'isExpanded') {
      ;(window as any)?.bpmnInstances?.modeling.toggleCollapse(bpmnElement)
      return
    }
    const attrObj = Object.create(null)
    attrObj[key] = elementBaseInfo[key]
    console.log(attrObj)
    ;(window as any).bpmnInstances.modeling.updateProperties(
      bpmnElement,
      attrObj
    )
  }

  onBeforeUnmount(() => {})
</script>
<script lang="ts">
  export default {
    name: 'ElementBaseInfo',
  }
</script>

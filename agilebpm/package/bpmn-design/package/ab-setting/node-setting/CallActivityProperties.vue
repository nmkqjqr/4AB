<template>
  <ab-cust-dialog
    dialog-key="bpmDefinitionSelector"
    :dialog-setting="{ multiple: false }"
    :icon="Edit"
    type="danger"
    @ok="dialogOk"
  >
    选择子流程
  </ab-cust-dialog>
  <div style="margin-top: 20px">
    <h3>您选择的子流程</h3>
    <el-descriptions border :column="1" size="large">
      <el-descriptions-item label="流程KEY">
        {{ nodeConfig.defKey || '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="流程名称">
        {{ nodeConfig.defName || '-' }}
      </el-descriptions-item>
    </el-descriptions>
  </div>
  <div class="tip">
    <h3>TIP</h3>
    <p>子流程会在当前节点创建时触发，当子流程终止后、主流程会继续向下运行。</p>
    <p>
      子流程如果与主流程数据模型一致，则数据共享。我们推荐子流程配置上主流程的数据模型，这样子流程可以在表单和流程运行时轻易的使用到主流程业务数据
    </p>
  </div>
</template>

<script setup lang="ts">
  import { Edit } from '@element-plus/icons-vue'
  import { PropType } from 'vue'

  const props = defineProps({
    nodeConfig: {
      required: true,
      type: Object as PropType<CallActivityConfig>,
    },
  })

  const { nodeConfig } = toRefs(props)

  const dialogOk = (dataList: [any]) => {
    let defKey = '',
      defName = ''
    if (dataList && dataList.length) {
      defKey = dataList[0].key
      defName = dataList[0].name
    }
    nodeConfig.value.defKey = defKey
    nodeConfig.value.defName = defName

    // 同步修改流程定义XML属性配置
    if (defKey && defKey.trim().length > 0) {
      const bpmnElement = (window as any)?.bpmnInstances?.bpmnElement || {}
      ;(window as any).bpmnInstances.modeling.updateProperties(bpmnElement, {
        calledElement: defKey,
      })
    }
  }
</script>

<style scoped>
  .tip {
    padding: 8px 16px;
    background-color: var(--block-tip-bg-color);
    border-radius: 4px;
    border-left: 5px solid var(--el-color-primary);
    margin: 20px 0;
  }
</style>

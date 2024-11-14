<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>流程节点自动跳过</span>
        <el-button text @click="deletePlugin()">
          <el-icon>
            <Close />
          </el-icon>
        </el-button>
      </div>
    </template>
    <el-checkbox
      v-model="pluginData.firstskip"
      label="流程第一个节点跳过"
      size="small"
    />
    <br />
    <el-checkbox
      v-model="pluginData.nextskip"
      label="下一节点执行人是当前任务处理人跳过"
      size="small"
    />
    <br />
    <el-checkbox
      v-model="pluginData.nullskip"
      label="任务节点执行人为空跳过"
      size="small"
    />
    <br />
    <el-checkbox
      v-model="pluginData.allskip"
      label="所有节点跳过(用于流程测试)"
      size="small"
    />
    <br />
    <el-checkbox
      v-model="pluginData.scriptskip"
      label="脚本跳过"
      size="small"
    />
    <br />
  </el-card>
</template>
<script lang="ts" setup>
import { Close } from '@element-plus/icons-vue'
import { defineProps, PropType } from 'vue'
const props = defineProps({
  pluginData: { required: true, type: Object },
  nodeConfig: { required: true, type: Object as PropType<NodeConfig> },
  flowSetting: { required: true, type: Object as PropType<FlowSetting> },
})

const from = reactive({
  firstskip: false,
  nextskip: false,
  nullskip: false,
  allskip: false,
  scriptskip: false,
})

const { pluginData } = toRefs(props)

const deletePlugin = () => {
  ElMessageBox.confirm('确定删除此插件吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      delete props.flowSetting.plugins['nodeSkip']
    })
    .catch(() => {})
}
</script>
<style scoped lang="scss">
:deep(.el-card__header) {
  padding: 4px 12px !important;
}
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 36px;
  line-height: 36px;
}
</style>

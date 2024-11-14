<template>
  <el-card>
    <template #header>
      <el-row class="card-header">
        <el-col :span="4" style="text-align: left">结束事件</el-col>
        <el-col :span="20" style="text-align: right">
          <el-button text @click="deletePlugin()">
            <el-icon>
              <Close />
            </el-icon>
          </el-button>
        </el-col>
      </el-row>
    </template>
    <el-card>
      <div style="text-align: center">
        <event-description :plugin-data="pluginData.TASK_COMPLETED" />
      </div>
    </el-card>
  </el-card>
</template>
<script lang="ts" setup>
import { Close } from '@element-plus/icons-vue'
import { defineProps, PropType, ref } from 'vue'
import EventDescription from '../../common/eventDescription.vue'

const props = defineProps({
  pluginData: { required: true, type: Object },
  nodeConfig: { required: true, type: Object as PropType<NodeConfig> },
})
const { pluginData, nodeConfig } = toRefs(props)

const deletePlugin = () => {
  ElMessageBox.confirm('确定删除此插件吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      delete nodeConfig.value.plugins['nodeEvent']
    })
    .catch(() => {})
}

const startEventDialogVisible = ref(false)
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

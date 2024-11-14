<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>实例结束事件</span>
        <el-button text @click="deletePlugin()">
          <el-icon>
            <Close />
          </el-icon>
        </el-button>
      </div>
    </template>
    <el-tabs v-model="activeName">
      <el-tab-pane label="正常结束" name="finish">
        <el-card>
          <div style="text-align: center">
            <event-description :plugin-data="pluginData.PROCESS_COMPLETED" />
          </div>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="人工终止" name="manualEnd">
        <el-card>
          <div style="text-align: center">
            <event-description :plugin-data="pluginData.PROCESS_MANUALEND" />
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>
<script lang="ts" setup>
import { Close } from '@element-plus/icons-vue'
import { defineProps, PropType, ref } from 'vue'
// import EventConfigDialog from '../../common/eventConfigDialog.vue'
import eventDescription from '../../common/eventDescription.vue'

const props = defineProps({
  pluginData: { required: true, type: Object },
  flowSetting: { required: true, type: Object as PropType<FlowSetting> },
})
const { pluginData } = toRefs(props)

const deletePlugin = () => {
  ElMessageBox.confirm('确定删除此插件吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      delete props.flowSetting.plugins['instanceEndEvent']
    })
    .catch(() => {})
}

const activeName = ref('finish')
const finishEditDialogVisible = ref(false)
const manualEndEditDialogVisible = ref(false)

const editEventConfig = () => {
  switch (activeName.value) {
    case 'finish':
      finishEditDialogVisible.value = true
      break
    case 'manualEnd':
      manualEndEditDialogVisible.value = true
      break
  }
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

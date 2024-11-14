<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>全局事件</span>
        <el-button text @click="deletePlugin()">
          <el-icon>
            <Close />
          </el-icon>
        </el-button>
      </div>
    </template>
    <el-descriptions border :column="1">
      <el-descriptions-item
        align="center"
        label="时机"
        label-align="right"
        label-class-name="event-description-label"
      >
        <el-tag
          v-for="(item, index) in pluginData.eventKeys"
          :key="index"
          style="margin-top: 5px"
        >
          {{ getEventDefName(item) }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item
        align="center"
        label="事件"
        label-align="right"
        label-class-name="event-description-label"
      >
        <event-description :plugin-data="pluginData" :show-event="true" />
      </el-descriptions-item>
    </el-descriptions>
  </el-card>
</template>
<script lang="ts" setup>
import { Close } from '@element-plus/icons-vue'
import { defineProps, PropType, ref, computed } from 'vue'
import eventDescription from '../../common/eventDescription.vue'
import { getEventDefName } from './globalEvent'

const props = defineProps({
  pluginData: { required: true, type: Object as PropType<BpmEventPlugin> },
  flowSetting: { required: true, type: Object as PropType<FlowSetting> },
})

const { pluginData, flowSetting } = toRefs(props)

const deletePlugin = () => {
  ElMessageBox.confirm('确定删除此插件吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      delete flowSetting.value.plugins['globalEvent']
    })
    .catch(() => {})
}
</script>
<style lang="scss">
.event-description-label {
  width: 51px;
}
</style>
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

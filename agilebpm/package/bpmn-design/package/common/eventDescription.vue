<template>
  <fragment>
    <div v-if="pluginData.model === 'http'">
      <strong>远程HTTP调用</strong>
      <el-button
        size="small"
        style="margin-left: 10px"
        type="primary"
        @click="eventConfigDialogVisible = true"
      >
        编辑
      </el-button>
      <el-divider style="margin-bottom: 10px" />
      <div class="event-description-content">
        接口：{{ pluginData.httpArr[0].url }}
      </div>
      <el-tag>
        {{ pluginData.httpArr[0].isAsync ? '异步调用' : '同步调用' }}
      </el-tag>
    </div>
    <div
      v-else-if="pluginData.model === 'trxMessage'"
      class="event-description-content"
    >
      <strong>事务消息</strong>
      <el-button
        size="small"
        style="margin-left: 10px"
        type="primary"
        @click="eventConfigDialogVisible = true"
      >
        编辑
      </el-button>
      <el-divider />
      <span>SubscribeKey：{{ pluginData.trxMessageSubscribeKey }}</span>
    </div>
    <div
      v-else-if="pluginData.model === 'serviceBean'"
      class="event-description-content"
    >
      <strong>ServiceBean</strong>
      <el-button
        size="small"
        style="margin-left: 10px"
        type="primary"
        @click="eventConfigDialogVisible = true"
      >
        编辑
      </el-button>
      <el-divider />
      <span>ServiceBean：{{ pluginData.serviceBean }}</span>
    </div>
    <div
      v-else-if="pluginData.model === 'script'"
      class="event-description-content"
    >
      <strong>Groovy脚本 {{ pluginData.script?.desc }}</strong>
      <el-button
        size="small"
        style="margin-left: 10px"
        type="primary"
        @click="eventConfigDialogVisible = true"
      >
        编辑
      </el-button>
    </div>
    <div v-else class="event-description-content">
      <strong>未配置</strong>
      <el-button
        size="small"
        style="margin-left: 10px"
        type="primary"
        @click="eventConfigDialogVisible = true"
      >
        编辑
      </el-button>
    </div>
    <!-- 前置事件编辑对话框 -->
    <event-config-dialog
      v-model="eventConfigDialogVisible"
      :before-close="handleClose"
      :event-display="showEvent"
      :plugin-data="pluginData"
      title="事件编辑"
      width="40%"
    />
  </fragment>
</template>

<script setup lang="ts">
  import { defineProps, PropType } from 'vue'
  import EventConfigDialog from './eventConfigDialog.vue'

  const props = defineProps({
    pluginData: { required: true, type: Object as PropType<BpmEventPlugin> },
    showEvent: { require: false, type: Boolean, default: false },
  })

  const eventConfigDialogVisible = ref<boolean>(false)

  const { pluginData } = toRefs(props)
</script>

<style scoped lang="scss">
  .event-description-content {
    margin-bottom: 10px;
    overflow: hidden;
    word-break: break-all;
    white-space: normal;
  }
</style>

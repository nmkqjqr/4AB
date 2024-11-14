<template>
  <el-button
    v-if="item.hideScanValue"
    style="color: #ffffff; background-color: #1890ff"
    :icon="FullScreen"
  >
    扫码
  </el-button>

  <span
    v-if="item.allowModification && !item.hideScanValue"
    class="input-group"
  >
    <el-input class="input-width" v-model="inputVal" />

    <el-button
      style="margin-left: 12px; color: #ffffff; background-color: #1890ff"
      :icon="FullScreen"
    >
      扫码
    </el-button>
  </span>

  <span v-if="!item.allowModification && !item.hideScanValue">
    <el-tag>
      {{ inputVal }}
    </el-tag>
    <el-button
      style="margin-left: 12px; color: #ffffff; background-color: #1890ff"
      :icon="FullScreen"
    >
      扫码
    </el-button>
  </span>
</template>

<script lang="ts">
  export default {
    name: 'abScanTrans',
  }
</script>

<script lang="ts" setup>
  import { FullScreen } from '@element-plus/icons-vue'
  defineProps({ item: { type: Object, required: true } })
  const inputVal = '扫码后此处会展示扫码值'
</script>

<style>
  .input-group {
    display: flex;
    align-items: center;
  }

  .input-width {
    flex: 1; /* 让input宽度自适应 */
    min-width: 40px; /* 设置最小宽度，防止过于窄小 */
  }
</style>

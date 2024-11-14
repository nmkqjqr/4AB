<template>
  <el-card header="进度环" shadow="hover">
    <div class="progress">
      <el-progress :percentage="85.5" type="dashboard" :width="160">
        <template #default="{ percentage }">
          <div class="percentage-value">{{ percentage }}%</div>
          <div class="percentage-label">当前进度</div>
        </template>
      </el-progress>
    </div>
  </el-card>
</template>

<script>
  export default {
    title: '进度环',
    icon: 'el-icon-odometer',
    description: '进度环原子组件演示',
    data() {
      return {}
    },
  }
</script>

<style scoped>
  .progress {
    text-align: center;
  }
  .progress .percentage-value {
    font-size: 28px;
  }
  .progress .percentage-label {
    margin-top: 10px;
    font-size: 12px;
  }
</style>

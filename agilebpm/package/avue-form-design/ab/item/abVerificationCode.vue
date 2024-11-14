<template>
  <el-input v-model="phoneCode" :prefix-icon="EditPen">
    <template #append>
      <el-button class="code-btn">获取验证码</el-button>
    </template>
  </el-input>
</template>

<script lang="ts" setup>
  import { EditPen } from '@element-plus/icons-vue'
  const phoneCode = ref()
</script>
<script lang="ts">
  export default {
    name: 'abVerificationCode',
  }
</script>

<style scoped>
  .code-btn {
    flex-basis: 0; /* 基础宽度设置为0，允许按钮根据内容和其他属性调整大小 */
    flex-grow: 1; /* 按钮可以增长以占据额外空间 */
    min-width: 20px; /* 设置最小宽度，防止按钮过窄 */
    text-align: center; /* 按钮文本居中 */
  }
</style>

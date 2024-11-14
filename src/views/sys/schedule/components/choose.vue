<template>
  <div>
    <!-- <el-dialog v-model="dialogVisible" title="Tips" width="30%">
      <span>This is a message</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="dialogVisible = false">
            Confirm
          </el-button>
        </span>
      </template>
    </el-dialog> -->
  </div>
</template>

<script setup lang="ts">
  import { onMounted, defineProps } from 'vue'
  // 使用
  const props = defineProps({
    // defineProps 接收参数
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    // ... 多个向后加
  })
  // mounted 时机
  onMounted(() => {
    console.log(props.dialogVisible)
    // 外部用不了的
  })
</script>

<template>
  <div class="menuBox">
    <el-menu
      default-active="baseInfo"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      @select="handleSelect"
    >
      <el-menu-item index="baseInfo">
        <el-icon><setting /></el-icon>
        <span>基础设置</span>
      </el-menu-item>
      <el-menu-item index="auth">
        <el-icon><document /></el-icon>
        <span>应用权限</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script lang="ts" setup>
  import {
    Document,
    Menu as IconMenu,
    Location,
    Setting,
  } from '@element-plus/icons-vue'

  const emit = defineEmits(['selectMenu'])
  const handleOpen = (key: string, keyPath: string[]) => {
    console.log('111111111111111', key, keyPath)
  }
  const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
  }

  const handleSelect = (key: string, keyPath: string[]) => {
    emit('selectMenu', key)
  }
</script>
<style lang="scss" scoped></style>

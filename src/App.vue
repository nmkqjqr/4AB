<template>
  <vab-app />
  <!-- style="color: #d0d0d0; background: #222225"  -->
</template>
<script setup lang="ts">
  import { useSettingsStore } from '@/store/modules/settings'
  const settingsStore = useSettingsStore()
  const { updateTheme } = settingsStore
  updateTheme()
</script>

<template>
  <div class="createAppSquareBox">
    <visitPage />
  </div>
</template>
<script lang="ts">
  // 应用广场创建应用
  export default {
    name: 'VisitPage'
  }
</script>
<script setup lang="ts">
  import visitPage from '~/agilebpm/package/ab-app-square/index/visit-page.vue'
</script>
<style lang="scss" scoped>
.createAppSquareBox{
   height: 100%;
 }
</style>
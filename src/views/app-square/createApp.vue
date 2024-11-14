<template>
  <div class="createAppSquareBox">
    <createAppSquare />
  </div>
</template>
<script lang="ts">
  // 应用广场创建应用
  export default {
    name: 'CreateAppSquare'
  }
</script>
<script setup lang="ts">
  import createAppSquare from '~/agilebpm/package/ab-app-square/index/index.vue'
</script>
<style lang="scss" scoped>
.createAppSquareBox{
   height: 100%;
 }
</style>
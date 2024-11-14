<template>
  <div class="createAppSquareBox">
    <simpleWf />
  </div>
</template>
<script lang="ts">
  // 应用广场创建流程
  export default {
    name: 'CreateProcess'
  }
</script>
<script setup lang="ts">
  import simpleWf from '~/agilebpm/build/simplewf'
</script>
<style lang="scss" scoped>
.createAppSquareBox{
   height: 100%;
 }
</style>
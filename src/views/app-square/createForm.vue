<template>
  <div class="createAppSquareBox">
    <createForm />
  </div>
</template>
<script lang="ts">
  // 应用广场创建应用
  export default {
    name: 'CreateForm'
  }
</script>
<script setup lang="ts">
  import createForm from '~/agilebpm/package/ab-app-square/index/create-form.vue'
</script>
<style lang="scss" scoped>
.createAppSquareBox{
   height: 100%;
 }
</style>
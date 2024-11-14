<template>
  <el-select :suffix-icon="LocationFilled">请选择</el-select>
</template>

<script setup>
  import { LocationFilled } from '@element-plus/icons-vue'
</script>

<script>
  export default {
    name: 'abPosition',
    props: ['item'],
  }
</script>

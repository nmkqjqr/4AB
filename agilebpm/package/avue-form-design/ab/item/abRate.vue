<template>
  <el-rate v-model="item.defaultValue" :disabled="item.readOnly" />
</template>

<script>
  export default {
    name: 'abRate',
    props: ['item'],
  }
</script>

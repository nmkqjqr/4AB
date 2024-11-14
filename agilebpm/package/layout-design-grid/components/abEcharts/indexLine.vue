<template>
  <EchartsView v-bind="$attrs" />
</template>

<script lang="ts">
  export default {
    name: 'AbLineEcharts',
  }
</script>

<script setup lang="ts">
  import EchartsView from './index.vue'
</script>

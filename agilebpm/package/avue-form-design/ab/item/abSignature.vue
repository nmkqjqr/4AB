<template>
  <el-button :icon="EditPen" type="primary">
      签名
  </el-button>
</template>

<script lang="ts">
  export default {
      name: "abSignature",
  };
</script>

<script lang="ts" setup>
  import { defineProps } from 'vue'
  import { EditPen } from '@element-plus/icons-vue'
  const props = defineProps({item:{type:Object,required:true},})
</script>

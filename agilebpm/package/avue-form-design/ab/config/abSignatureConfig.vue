<template>
  <label class="el-form-item__label" style="padding: 0">签名配置：</label>
  <el-form-item label="只写">
    <el-switch
    v-model="data.onlyWrite"
    inline-prompt
    active-text="是"
    inactive-text="否"
  />
  </el-form-item>
</template>

<script lang="ts">
  export default {
      name: "ab-signature-config",
  };
</script>

<script lang="ts" setup>
  import { defineProps } from 'vue'
  const props = defineProps({data:{type:Object,required:true},})
</script>

<template>
  <div>
    <el-form-item label="是否隐藏">
      <el-switch
        v-model="data.hide"
        inline-prompt
        active-text="是"
        inactive-text="否"
      />
    </el-form-item>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'ab-sn-config',
  }
</script>

<script lang="ts" setup>
  const props = defineProps({ data: { type: Object, required: true } })
</script>

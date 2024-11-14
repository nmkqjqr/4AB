<template>
  <el-button  type="primary" v-if="item.fromRefConfig">
      <el-icon style="vertical-align: middle">
        <Search />
      </el-icon>
      <span v-if="item.fromRefConfig.searchDesc" style="vertical-align: middle">
        {{ item.fromRefConfig.searchDesc }}
      </span>
      <span v-else style="vertical-align: middle">
        表单引用
      </span>

  </el-button>
</template>

<script lang="ts">
  export default {
      name: "abFormReferenceItem",
  };
  </script>

<script lang="ts" setup>
  import { Search } from '@element-plus/icons-vue'
  const props = defineProps({item:{type:Object,required:true},})

</script>

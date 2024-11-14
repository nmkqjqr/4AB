<template>
  <el-button  type="primary" v-if="item.dataSelectorConfig">
      <el-icon style="vertical-align: middle">
        <Search />
      </el-icon>
      <span v-if="item.dataSelectorConfig.searchDesc" style="vertical-align: middle">
        {{ item.dataSelectorConfig.searchDesc }}
      </span>
      <span v-else style="vertical-align: middle">
        组织选择
      </span>
  </el-button>
</template>

<script lang="ts">
  export default {
      name: "abOrgSelect",
  };
  </script>

<script lang="ts" setup>
  import { Search } from '@element-plus/icons-vue'
  const props = defineProps({item:{type:Object,required:true},})

</script>

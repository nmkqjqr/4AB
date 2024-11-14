<template>
  <div style="width:100%;height: 32px;">
    <el-divider :content-position="item.contentPosition">{{item.text}}</el-divider>
  </div>
</template>

<script lang="ts">
export default {
  name: "abDivider",
};
</script>

<script lang="ts" setup>
import { PropType,defineProps } from 'vue'
import { Search } from '@element-plus/icons-vue'
const props = defineProps({
  item:{
    type:Object,
    required:true
  },
})
</script>
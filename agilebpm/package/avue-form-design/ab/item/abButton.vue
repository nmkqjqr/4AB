<template>
  <span>
    <el-button :type="item.btnType" :round="item.round">{{item.text}}</el-button>
  </span>
</template>

<script lang="ts">
export default {
  name: "abButton",
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
<template>
    <span style="width: 100%;height: 32px;">
      <el-alert :title="item.text" class="alertForm" :type="item.textType" :effect="item.effect" :show-icon="item.showIcon"/>
    </span>
</template>

<script lang="ts">
export default {
  name: "abAlert",
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
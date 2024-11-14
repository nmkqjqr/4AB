<template>
    <span style="width: 100%;">
未带完续
    </span>
</template>

<script lang="ts">
export default {
  name: "abContent",
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

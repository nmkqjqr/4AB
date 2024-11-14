<template>
  <el-tag v-bind="$attrs">
    <el-tooltip
      class="box-item"
      :content="props.text"
      effect="dark"
      placement="top"
    >
      {{ props.text }}
    </el-tooltip>
  </el-tag>
</template>

<script lang="ts">
  export default { name: 'AbTooltipTag' }
</script>

<script lang="ts" setup>
  const props = defineProps({
    text: {
      type: String,
      default: '',
    },
  })
  onMounted(() => {})
</script>

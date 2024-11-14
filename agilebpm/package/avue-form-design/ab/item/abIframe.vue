<template>
  <div>
    <iframe
      v-if="item.tempUrl && item.tempUrl.length > 0"
      :src="item.tempUrl"
      style="width: 100%; border: none"
      :style="{ height: item.height + 'px' }"
    />
    <el-empty
      v-else
      description="未设置URL地址"
      :image-size="item.height / 3 < 50 ? 50 : item.height / 3"
      :style="{ height: item.height + 'px' }"
    />
  </div>
</template>

<script lang="ts">
  export default {
    name: 'abIframe',
  }
</script>

<script lang="ts" setup>
  const props = defineProps({ item: { type: Object, required: true } })
  const { item } = toRefs(props)
</script>

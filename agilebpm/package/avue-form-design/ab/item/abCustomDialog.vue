<template>
  <el-input
    v-if="item"
    :placeholder="item.placeholder"
    :disabled="item.readOnly"
    class="ab-input"
  >
    <template #prepend>数据选择</template>
    <template #append>
      <el-button text type="primary">
        <el-icon style="vertical-align: middle">
          <Search />
        </el-icon>
      </el-button>
    </template>
  </el-input>
</template>

<script lang="ts">
  export default {
    name: 'abCustomDialog',
  }
</script>

<script lang="ts" setup>
  import { PropType, defineProps } from 'vue'
  import { Search } from '@element-plus/icons-vue'
  const props = defineProps({ item: { type: Object, required: true } })
</script>

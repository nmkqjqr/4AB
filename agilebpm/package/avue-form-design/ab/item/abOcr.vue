<template>
  <span style="height: 32px">
    <el-button type="primary" :icon="FullScreen">
      {{ getShowName() }}
    </el-button>
  </span>
</template>

<script lang="ts">
  export default {
    name: 'abOcr',
  }
</script>

<script lang="ts" setup>
  import { FullScreen } from '@element-plus/icons-vue'
  const props = defineProps({ item: { type: Object, required: true } })
  const { item } = toRefs(props)

  const getShowName = () => {
    if (item.value.ocrType == 'BASIC_GENERAL') {
      return '识别文字'
    }
    if (item.value.ocrType == 'ID_CARD') {
      return '识别身份证人像面'
    }
    if (item.value.ocrType == 'ID_CARD_BACK') {
      return '识别身份证国徽面'
    }
    if (item.value.ocrType == 'RECEIPT') {
      return '识别发票'
    }
    if (item.value.ocrType == 'BUSINESS_LICENSE') {
      return '识别营业执照'
    }
    return '请配置识别类型'
  }
</script>

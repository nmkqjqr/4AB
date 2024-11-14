<template>
  <el-col v-if="['b', 'w', 'r'].includes(permission)" :span="props.span">
    <el-form-item
      v-bind="$attrs"
      class="formItem"
      :class="{ 'is-required': permission == 'b', foldLabel: true }"
      :label="label"
      :label-width="relWidth"
    >
      <slot></slot>
    </el-form-item>
  </el-col>
</template>
<script lang="ts" setup>
  const props = defineProps({
    span: {
      type: Number,
      default: 12,
    },
    labelWidth: {
      type: Number,
      default: null,
    },
    permission: {
      type: String,
      default: 'b',
    },
    label: {
      type: String,
      default: '',
    },
  })

  const abFormMananger = inject('abForm') as AbFormProvide
  const relWidth = computed(() => {
    if (props.labelWidth != null) {
      return `${props.labelWidth}`
    }
    return `${abFormMananger?.labelWidth}`
  })
  const label = computed(() => {
    if (props.labelWidth == 0) {
      return ''
    }

    let result = props.label
    if (props.label && abFormMananger?.labelSuffix) {
      result = result + abFormMananger.labelSuffix
    }
    return result
  })
</script>
<style lang="scss" scoped>
  :deep(.foldLabel .el-form-item__label) {
    align-items: center;
    padding: 2px 10px 0 0;
    font-size: 14px;
    line-height: 14px;
  }
</style>

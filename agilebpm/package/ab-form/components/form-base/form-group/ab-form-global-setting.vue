<template>
  <el-row v-bind="$attrs">
    <slot></slot>
  </el-row>
</template>
<script lang="ts" setup>
  // 可以商用 el-row 的属性
  const props = defineProps({
    labelWidth: {
      type: Number,
      default: 0,
    },
    readonlyShowText: {
      type: Boolean,
      default: false,
    },
    labelSuffix: {
      type: String,
      default: '',
    },
  })

  //这里可以成组修改 label 宽度
  const abFormMananger = inject('abForm') as AbFormProvide

  if (props.labelWidth) {
    // eslint-disable-next-line vue/no-setup-props-destructure
    abFormMananger.labelWidth = props.labelWidth
  }
  if (!props.readonlyShowText) {
    abFormMananger.readonlyShowText = false
  }
  if (props.labelSuffix) {
    // eslint-disable-next-line vue/no-setup-props-destructure
    abFormMananger.labelSuffix = props.labelSuffix
  }
</script>

<template>
  <div
    v-if="isExternal"
    class="svg-external-icon svg-icon"
    :class="className"
    :style="styleExternalIcon"
  />
  <svg v-else aria-hidden="true" class="svg-icon" :class="className">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script setup>
  import * as abUtil from '~/agilebpm/utils/ab-util'
  import { defineProps, computed } from 'vue'

  const props = defineProps({
    // icon 图标
    icon: {
      type: String,
      required: true,
    },
    // 图标类名
    className: {
      type: String,
      default: '',
    },
  })

  /**
   * 判断是否为外部图标
   */
  const isExternal = computed(() => abUtil.isExternal(props.icon))
  /**
   * 外部图标样式
   */
  const styleExternalIcon = computed(() => ({
    mask: `url(${props.icon}) no-repeat 50% 50%`,
    '-webkit-mask': `url(${props.icon}) no-repeat 50% 50%`,
  }))
  /**
   * 项目内图标
   */
  const iconName = computed(() => `#icon-${props.icon}`)
</script>

<style scoped>
  .svg-icon {
    width: 40px;
    height: 40px;
  }

  .svg-external-icon {
    display: inline-block;
    background-color: currentColor;
    mask-size: cover !important;
  }
</style>

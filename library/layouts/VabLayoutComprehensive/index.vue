<!--综合布局 -->
<script lang="ts" setup>
  defineProps({
    collapse: {
      type: Boolean,
      default() {
        return false
      },
    },
    fixedHeader: {
      type: Boolean,
      default() {
        return true
      },
    },
    showTabs: {
      type: Boolean,
      default() {
        return true
      },
    },
    device: {
      type: String,
      default() {
        return 'desktop'
      },
    },
    isIframe: {
      type: Boolean,
      default() {
        return false
      },
    },
  })
</script>

<template>
  <div
    class="vab-layout-comprehensive"
    :class="{
      fixed: fixedHeader,
      'no-tabs-bar': !showTabs,
    }"
    v-if="!isIframe"
  >
    <vab-side-bar layout="comprehensive" />
    <div
      class="vab-main"
      :class="{
        'is-collapse-main': collapse,
      }"
    >
      <div
        class="vab-layout-header"
        :class="{
          'fixed-header': fixedHeader,
        }"
      >
        <vab-nav layout="comprehensive" />
        <vab-tabs v-show="showTabs" />
      </div>
      <vab-app-main />
    </div>
  </div>
  <div v-else>
    <vab-app-main />
  </div>
</template>

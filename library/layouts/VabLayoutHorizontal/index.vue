<!-- 横向布局 -->
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
    class="vab-layout-horizontal"
    :class="{
      fixed: fixedHeader,
      'no-tabs-bar': !showTabs,
    }"
    v-if="!isIframe"
  >
    <div
      class="vab-layout-header"
      :class="{
        'fixed-header': fixedHeader,
      }"
    >
      <vab-header layout="horizontal" />
      <div
        v-show="showTabs"
        :class="{
          'vab-tabs-horizontal': showTabs,
        }"
      >
        <div class="vab-main">
          <vab-tabs />
        </div>
      </div>
    </div>
    <div class="vab-main main-padding">
      <vab-app-main />
    </div>
  </div>
  <div v-else>
    <vab-app-main />
  </div>
</template>

<style lang="scss" scoped>
  .vab-layout-horizontal {
    :deep() {
      .vab-main {
        width: 92% !important;
        margin: auto !important;
      }
    }

    .vab-tabs-horizontal {
      background: var(--el-color-white);
      box-shadow: $base-box-shadow;
    }

    .vab-nav {
      .fold-unfold {
        display: none;
      }
    }
  }
</style>

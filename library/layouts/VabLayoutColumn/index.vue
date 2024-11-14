<!--分栏布局 -->
<script lang="ts" setup>
  import { useSettingsStore } from '@/store/modules/settings'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const isIframe = computed(() => {
    if (route.query.abIframeType && route.query.abIframeType == 'iframe' || route.path == '/bpm/bpm/flowChart') {
      return true
    }
    return false
  })
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
  })

  const settingsStore = useSettingsStore()
  const { theme } = storeToRefs(settingsStore)
</script>

<template>
  <div
    v-if="!isIframe"
    class="vab-layout-column"
    :class="{
      fixed: fixedHeader,
      'no-tabs-bar': !showTabs,
    }"
  >
    <vab-column-bar />
    <div
      class="vab-main"
      :class="{
        ['vab-main-' + theme.columnStyle]: true,
        'is-collapse-main': collapse,
      }"
    >
      <div
        class="vab-layout-header"
        :class="{
          'fixed-header': fixedHeader,
        }"
      >
        <vab-nav />
        <vab-tabs v-show="showTabs" />
      </div>
      <vab-app-main />
    </div>
  </div>
  <!-- <div v-else class="nolayout">
    <el-card>
      <vab-app-main />
    </el-card>
  </div> -->
  <div v-else>
    <vab-app-main />
  </div>
</template>

<style lang="scss" scoped>
  .nolayout {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 20px;
  }
  .vab-layout-column {
    .vab-main {
      &.is-collapse-main {
        &.vab-main-horizontal {
          margin-left: $base-left-menu-width-min * 1.3;

          :deep() {
            .fixed-header {
              width: calc(100% - #{$base-left-menu-width-min} * 1.3);
            }
          }
        }
      }
    }
  }
</style>

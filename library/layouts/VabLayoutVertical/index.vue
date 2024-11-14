<!-- 纵向布局 -->
<script lang="ts" setup>
  import { useSettingsStore } from '@/store/modules/settings'

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

  const settingsStore = useSettingsStore()
  const { foldSideBar } = settingsStore
</script>

<template>
  <div
    class="vab-layout-vertical"
    :class="{
      fixed: fixedHeader,
      'no-tabs-bar': !showTabs,
    }"
    v-if="!isIframe"
  >
    <vab-side-bar />
    <div
      v-if="device === 'mobile' && !collapse"
      class="v-modal"
      @click="foldSideBar"
    />
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
        <vab-nav />
        <vab-tabs v-show="showTabs" />
      </div>
      <vab-app-main />
    </div>
  </div>
  <div v-else>
    <vab-app-main />
  </div>
</template>

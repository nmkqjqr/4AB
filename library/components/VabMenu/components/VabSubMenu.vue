<script lang="ts" setup>
  import { abT } from '@/i18n'

  defineProps({
    itemOrMenu: {
      type: Object,
      default() {
        return null
      },
    },
  })
</script>

<template>
  <el-sub-menu :index="itemOrMenu.path" popper-append-to-body>
    <template #title>
      <vab-icon
        v-if="itemOrMenu.meta.icon"
        :icon="itemOrMenu.meta.icon"
        :is-custom-svg="itemOrMenu.meta.isCustomSvg"
        :title="abT('menu.' + itemOrMenu.name, itemOrMenu.meta.title)"
      />
      <span
        :abt="itemOrMenu.name"
        :title="abT('menu.' + itemOrMenu.name, itemOrMenu.meta.title)"
      >
        {{ abT('menu.' + itemOrMenu.name, itemOrMenu.meta.title) }}
      </span>
    </template>
    <slot />
  </el-sub-menu>
</template>

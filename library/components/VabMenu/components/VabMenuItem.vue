<script lang="ts" setup>
  import { useSettingsStore } from '@/store/modules/settings'
  import { isExternal } from '@/utils/validate'
  import { abT } from '@/i18n'
  import { isHashRouterMode } from '@/config'
  import { VabRoute } from '/#/router'
  import { useTabsStore } from '@/store/modules/tabs'
  const tabsStore = useTabsStore()
  const { getVisitedRoutes: visitedRoutes } = storeToRefs(tabsStore)
  const props = defineProps({
    itemOrMenu: {
      type: Object,
      default() {
        return null
      },
    },
  })

  const route: VabRoute = useRoute()
  const router = useRouter()

  const $pub: any = inject('$pub')

  const settingsStore = useSettingsStore()
  const { device } = storeToRefs(settingsStore)
  const { foldSideBar } = settingsStore

  const handleLink = () => {
    const routePath = props.itemOrMenu.path
    const target = props.itemOrMenu.meta.target
    if (target === '_blank' || props.itemOrMenu.openWith === 2) {
      if (isExternal(routePath)) window.open(routePath)
      else if (route.path !== routePath)
        isHashRouterMode
          ? window.open(`/#${routePath}`)
          : window.open(routePath)
    } else {
      visitedRoutes.value[0].openWith = props.itemOrMenu.openWith
      if (route.path == routePath) {
        // 这个导致点击同样路由时页面会刷新
        // $pub('reload-router-view')
      } else if (isExternal(routePath)) {
        router.push({
          path: `/cms/customIframe/${props.itemOrMenu.name}`,
          query: {
            name: encodeURIComponent(props.itemOrMenu.meta.title),
            url: encodeURIComponent(props.itemOrMenu.path),
          },
        })
      } else {
        if (device.value === 'mobile') {
          foldSideBar()
        }
        router.push(props.itemOrMenu.path)
      }
    }
  }
</script>

<template>
  <el-menu-item :index="itemOrMenu.path" @click="handleLink">
    <vab-icon
      v-if="itemOrMenu.meta.icon"
      :icon="itemOrMenu.meta.icon"
      :is-custom-svg="itemOrMenu.meta.isCustomSvg"
      :title="abT('menu.' + itemOrMenu.name, itemOrMenu.meta.title)"
    />
    <span :title="abT('menu.' + itemOrMenu.name, itemOrMenu.meta.title)" class="menuText">
      {{ abT('menu.' + itemOrMenu.name, itemOrMenu.meta.title) }}
    </span>
    <el-tag v-if="itemOrMenu.meta.badge" effect="dark" type="danger">
      {{ itemOrMenu.meta.badge }}
    </el-tag>
    <span v-if="itemOrMenu.meta.dot" class="vab-dot vab-dot-error">
      <span />
    </span>
  </el-menu-item>
</template>

<style lang="scss" scoped>
  @use 'sass:math';
  :deep(.el-tag) {
    position: absolute;
    right: 20px;
    height: 16px;
    padding-right: 4px;
    padding-left: 4px;
    // margin-top: #{math.div($base-menu-item-height - 16, 2)};
    line-height: 16px;
    border: 0;
  }

  .vab-dot {
    position: absolute !important;
    right: 20px;
    // margin-top: #{math.div($base-menu-item-height - 6, 2)};
  }
</style>

<script lang="ts" setup>
  import { useRoutesStore } from '@/store/modules/routes'
  import { handleActivePath } from '@/utils/routes'
  import { VabRoute } from '/#/router'
  import { computed } from 'vue'
  const route: VabRoute = useRoute()

  const isIframe = computed(() => {
    if (route?.query?.abIframeType && route.query.abIframeType == 'iframe' || route.path == '/bpm/bpm/flowChart') {
      return true
    }
    return false
  })
  // BizFormCombinationView 预览页面
  const routeName = computed(() => {
    if (route.name && route.name == 'BizFormCombinationView') {
      return true
    }
    return false
  })

  const routesStore: any = useRoutesStore()
  const { tab, activeMenu, routes } = storeToRefs(routesStore)

  const fullpathTopMenuMap = { init: false }
  const openNames: any[] = []

  const initFullPathTopMenu = () => {
    setPathTopMenuByMenu(routes.value)
    fullpathTopMenuMap.init = true
    if (!fullpathTopMenuMap['/index'] && routes.value[0]) {
      fullpathTopMenuMap['/index'] = routes.value[0].topMenuCode
    }
  }

  const setPathTopMenuByMenu = (routers: any) => {
    routers.forEach((item: any) => {
      if (item.path) {
        fullpathTopMenuMap[item.path] = item.topMenuCode
        if (item.isopen) {
          openNames.push(item.path)
        }
      }
      if (item.children) {
        setPathTopMenuByMenu(item.children)
      }
    })
  }

  watch(
    route,
    () => {
      if (!fullpathTopMenuMap.init) {
        initFullPathTopMenu()
      }

      if (fullpathTopMenuMap[route.fullPath])
        tab.value.data = fullpathTopMenuMap[route.fullPath]

      // 如果 没有tab 菜单，默认给一个首页的
      if (!tab.value.data) tab.value.data = fullpathTopMenuMap['/index']

      activeMenu.value.data = handleActivePath(route)
    },
    { immediate: true }
  )
  onMounted(() => {})
</script>

<template>
  <div v-if="activeMenu.data === '/index'">
    <section>
      <VabRouterView />
    </section>
  </div>
  <!-- <VabRouterView v-else /> -->
  <div v-else class="vab-app-main">
    <section>
      <VabRouterView />
    </section>
    <vab-footer v-if="!isIframe && !routeName" />
  </div>
</template>

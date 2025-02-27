<template>
  <div class="vue-admin-better-wrapper" :class="{ mobile }">
    <component
      :is="'vab-layout-' + theme.layout"
      :class="{ paddingTop0: isIframe }"
      :collapse="collapse"
      :device="device"
      :fixed-header="theme.fixedHeader"
      :is-iframe="isIframe"
      :show-tabs="theme.showTabs"
    />
    <el-backtop target="#app" />
    <!--  主题组件放到layouts下防止主题切换，导致主题组件重新加载 -->
    <vab-theme-drawer />
  </div>
</template>

<script lang="ts">
  import { useSettingsStore } from '@/store/modules/settings'

  const imports = require.context('./', true, /\.vue$/)
  const Components: any = {}
  imports
    .keys()
    .filter((key) => key !== './index.vue')
    .forEach((key) => {
      Components[key.replace(/(\/|\.|index.vue)/g, '')] = imports(key).default
    })

  export default defineComponent({
    name: 'Layouts',
    components: Components,
    setup() {
      const settingsStore = useSettingsStore()
      const { device, collapse, theme } = storeToRefs(settingsStore)
      const { toggleDevice, foldSideBar, openSideBar, updateTheme } =
        settingsStore

      const mobile = ref(false)
      let oldLayout = theme.value.layout

      const resizeBody = () => {
        mobile.value = document.body.getBoundingClientRect().width - 1 < 992
      }

      watch(mobile, (val) => {
        if (val) {
          oldLayout = theme.value.layout
          foldSideBar()
        } else openSideBar()

        theme.value.layout = val ? 'vertical' : oldLayout
        toggleDevice(val ? 'mobile' : 'desktop')
      })

      resizeBody()
      updateTheme()

      const cleanup = useEventListener('resize', () => {
        resizeBody()
      })

      onUnmounted(() => {
        if (mobile) theme.value.layout = oldLayout
        cleanup()
      })

      const route = useRoute()
      const isIframe = computed(() => {
        if (route.query.abIframeType && route.query.abIframeType == 'iframe' || route.path == '/bpm/bpm/flowChart') {
          return true
        }
        return false
      })

      return {
        theme,
        device,
        mobile,
        collapse,
        foldSideBar,
        openSideBar,
        toggleDevice,
        isIframe,
      }
    },
  })
</script>

<style lang="scss" scoped>
  .vue-admin-better-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: auto;

    [class*='vab-layout-'] {
      :deep() {
        .vab-layout-header {
          box-shadow: $base-box-shadow;
        }
      }

      &.fixed {
        padding-top: $base-nav-height + $base-tabs-height;
      }

      &.fixed.no-tabs-bar {
        padding-top: $base-nav-height;
      }
    }

    :deep() {
      .fixed-header {
        position: fixed;
        top: 0;
        right: 0;
        z-index: $base-z-index - 1;
        width: 100%;
      }

      .vab-main {
        position: relative;
        width: auto;
        min-height: 100%;
        margin-left: var(--el-left-menu-width);

        &.is-collapse-main {
          margin-left: $base-left-menu-width-min;

          .fixed-header {
            width: $base-right-content-width-min;
          }
        }

        &:not(.is-collapse-main) {
          .fixed-header {
            width: calc(100% - var(--el-left-menu-width));
          }
        }
      }
    }

    /* 手机端开始 */
    &.mobile {
      :deep() {
        .vab-layout-vertical {
          .el-scrollbar.vab-side-bar.is-collapse {
            width: 0;
          }

          .vab-main {
            .fixed-header {
              width: 100%;
            }

            margin-left: 0;
          }
        }

        /* 隐藏分页和页码跳转 */
        .el-pager,
        .el-pagination__jump {
          display: none;
        }
        .paddingTop0 {
          padding-top: 0 !important;
        }
      }
    }

    /* 手机端结束 */
  }
</style>

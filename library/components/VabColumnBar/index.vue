<script lang="ts" setup>
  import { VabRoute } from '/#/router'
  import { isExternal } from '@/utils/validate'
  import { abT } from '@/i18n'
  import { useRoutesStore } from '@/store/modules/routes'
  import { openFirstMenu, uniqueOpened } from '@/config'
  import { useSettingsStore } from '@/store/modules/settings'
  import variables from '@vab/styles/variables/variables.module.scss'

  const route: VabRoute = useRoute()
  const router = useRouter()

  const settingsStore = useSettingsStore()
  const { theme, collapse } = storeToRefs(settingsStore)
  const { foldSideBar, openSideBar } = settingsStore
  const routesStore = useRoutesStore()
  const {
    getTab: tab,
    getTabMenu: tabMenu,
    getActiveMenu: activeMenu,
    getRoutes: routes,
    getPartialRoutes: partialRoutes,
    getDefaultOpenNames: abDefaultOpenNames,
  }: any = storeToRefs(routesStore)

  const handleTabClick = () => {
    nextTick(() => {
      if (isExternal(tabMenu.value.path)) {
        window.open(tabMenu.value.path)
        setTimeout(() => {
          router.push('/')
        }, 1000)
      } else if (openFirstMenu) {
        if (tabMenu.value.path && tabMenu.value.path.indexOf('/') == 0) {
          router.push(tabMenu.value.path)
        }
      }
    })
  }

  watchEffect(() => {
    const foldUnfold: any = document.querySelector(
      '.fold-unfold'
    ) as HTMLElement
    if (theme.value.layout === 'column' && route.meta.noColumn) {
      foldSideBar()

      if (foldUnfold) foldUnfold.style = 'display:none'
    } else {
      openSideBar()
      if (foldUnfold) foldUnfold.style = ''
    }
  })

  const isChineseChar = (str: any) => {
    const reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/
    return reg.test(str)
  }

  onMounted(() => {
    // 如果仅有一个菜单时，默认进入该菜单的首页
    if (openFirstMenu && routes.value.length == 1) {
      if (tabMenu.value.path && tabMenu.value.path.indexOf('/') == 0) {
        router.push(tabMenu.value.path)
      }
    }
  })
</script>

<template>
  <el-scrollbar
    class="vab-column-bar-container"
    :class="{
      'is-collapse': collapse,
      ['vab-column-bar-container-' + theme.columnStyle]: true,
    }"
  >
    <vab-logo />
    <el-tabs
      v-if="routes && routes.length > 1"
      v-model="tab.data"
      tab-position="left"
      @tab-click="handleTabClick"
    >
      <template v-for="(item, index) in routes" :key="index + item.name">
        <el-tab-pane :name="item.name">
          <template #label>
            <div
              class="vab-column-grid"
              :class="{
                ['vab-column-grid-' + theme.columnStyle]: true,
              }"
              :title="abT('menu.' + item.name, item.meta.title)"
            >
              <div>
                <vab-icon
                  v-if="item.meta.icon"
                  :icon="item.meta.icon"
                  :is-custom-svg="item.meta.isCustomSvg"
                />
                <span
                  :style="{
                    fontSize:
                      isChineseChar(
                        abT('menu.' + item.name, item.meta.title)
                      ) && abT('menu.' + item.name, item.meta.title).length >= 4
                        ? '12px'
                        : '',
                  }"
                >
                  {{ abT('menu.' + item.name, item.meta.title) }}
                </span>
              </div>
            </div>
          </template>
        </el-tab-pane>
      </template>
    </el-tabs>

    <el-menu
      :background-color="variables['column-second-menu-background']"
      :default-active="activeMenu.data"
      :default-openeds="abDefaultOpenNames"
      mode="vertical"
      :unique-opened="uniqueOpened"
    >
      <!-- top 菜单横线删除 <el-divider>
        {{ translate(tabMenu ? tabMenu.meta.title : tabMenu) }}
      </el-divider> -->
      <template v-for="item in partialRoutes" :key="item.path">
        <vab-menu
          v-if="!item.meta.hidden"
          :item="item"
          style="margin-top: 10px"
        />
      </template>
    </el-menu>
  </el-scrollbar>
</template>

<style lang="scss" scoped>
  @use 'sass:math';
  @mixin active {
    &:hover {
      color: var(--el-color-primary);
      background-color: $base-column-second-menu-active !important;

      i,
      svg {
        color: var(--el-color-primary);
      }
    }

    &.is-active {
      color: var(--el-color-primary);
      background-color: $base-column-second-menu-active !important;
    }
  }

  .vab-column-bar-container {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: var(--el-left-menu-width);
    height: 100vh;
    overflow: hidden;
    background: $base-column-second-menu-background;
    box-shadow: $base-box-shadow;

    :deep() {
      * {
        transition: $base-transition;
      }

      .el-tabs {
        box-shadow: $base-box-shadow;
      }
    }

    &-vertical,
    &-card,
    &-arrow {
      :deep() {
        .el-tabs + .el-menu {
          left: $base-left-menu-width-min;
          width: calc(var(--el-left-menu-width) - #{$base-left-menu-width-min});
          border: 0;
        }
      }
    }

    &-horizontal {
      :deep() {
        .logo-container-column {
          .logo {
            width: $base-left-menu-width-min * 1.3 !important;
          }

          .title {
            margin-left: $base-left-menu-width-min * 1.3 !important;
          }
        }

        .el-tabs + .el-menu {
          left: $base-left-menu-width-min * 1.3;
          width: calc(
            var(--el-left-menu-width) - #{$base-left-menu-width-min} * 1.3
          );
          border: 0;
        }
      }
    }

    &-card {
      :deep() {
        .el-tabs {
          .el-tabs__item {
            padding: 5px !important;

            .vab-column-grid {
              width: $base-left-menu-width-min - 10 !important;
              height: $base-left-menu-width-min - 10 !important;
              border-radius: 5px;
            }

            &.is-active {
              background: transparent !important;

              .vab-column-grid {
                background: var(--el-color-primary);
              }
            }
          }
        }

        .el-tabs + .el-menu {
          left: $base-left-menu-width-min + 10;
          width: calc(
            var(--el-left-menu-width) - #{$base-left-menu-width-min} - 20px
          );
        }

        .el-sub-menu .el-sub-menu__title,
        .el-menu-item {
          min-width: 180px;
          margin-bottom: 5px;
          border-radius: 5px;
        }
      }
    }

    &-arrow {
      :deep() {
        .el-tabs {
          .el-tabs__item {
            &.is-active {
              background: transparent !important;

              .vab-column-grid {
                background: transparent !important;

                &:after {
                  position: absolute;
                  right: 0;
                  width: 0;
                  height: 0;
                  overflow: hidden;
                  content: '';
                  border-color: transparent #{var(--el-color-white)} transparent
                    transparent;
                  border-style: solid dashed dashed;
                  border-width: 8px;
                }
              }
            }
          }
        }

        .el-tabs + .el-menu {
          left: $base-left-menu-width-min + 10;
          width: calc(
            var(--el-left-menu-width) - #{$base-left-menu-width-min} - 20px
          );
        }

        .el-sub-menu .el-sub-menu__title,
        .el-menu-item {
          min-width: 180px;
          margin-bottom: 5px;
          border-radius: 5px;
        }
      }
    }

    .vab-column-grid {
      display: flex;
      align-items: center;
      width: $base-left-menu-width-min;
      overflow: hidden;
      text-align: center;
      text-overflow: ellipsis;
      word-break: break-all;
      white-space: nowrap;

      &-vertical,
      &-card,
      &-arrow {
        justify-content: center;
        height: $base-left-menu-width-min;

        > div {
          svg {
            position: relative;
            top: 8px;
            display: block;
            width: $base-font-size-default + 4;
            height: $base-font-size-default + 4;
          }

          [class*='ri-'] {
            display: block;
            height: 20px;
          }
        }
      }

      &-horizontal {
        justify-content: left;
        width: $base-left-menu-width-min * 1.3;
        height: #{math.div($base-left-menu-width-min, 1.3)};
        padding-left: #{math.div($base-padding, 2)};
      }
    }

    :deep() {
      .el-scrollbar__wrap {
        overflow-x: hidden;
      }

      .el-tabs {
        position: fixed;

        .el-tabs__header.is-left {
          margin-right: 0 !important;

          .el-tabs__nav-wrap.is-left {
            margin-right: 0 !important;
            background: $base-column-first-menu-background;

            .el-tabs__nav-scroll {
              height: 100%;
              overflow-y: auto;

              &::-webkit-scrollbar {
                width: 0;
                height: 0;
              }
            }
          }
        }

        .el-tabs__nav {
          height: calc(100vh - #{$base-logo-height});
          background: $base-column-first-menu-background;
        }

        .el-tabs__item {
          height: auto;
          padding: 0;
          color: var(--el-color-white);

          &.is-active {
            background: var(--el-color-primary);
          }
        }
      }

      .el-tabs__active-bar.is-left,
      .el-tabs--left .el-tabs__nav-wrap.is-left::after {
        display: none;
      }

      .el-menu {
        border: 0;

        .el-divider {
          margin: 0 0 $base-margin 0;
          background-color: #f6f6f6;

          &__text {
            color: var(--el-color-black);
          }
        }

        .el-menu-item,
        .el-sub-menu__title {
          display: block;
          height: $base-menu-item-height;

          overflow: hidden;
          line-height: $base-menu-item-height;
          text-overflow: ellipsis;
          white-space: nowrap;
          vertical-align: middle;
          @include active;
        }
      }
    }

    &.is-collapse {
      :deep() {
        width: 0;
      }
    }
  }
</style>

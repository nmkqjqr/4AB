<template>
  <div
    class="logo-container logodiv"
    :class="{
      ['logo-container-' + theme.layout]: true,
    }"
  >
    <router-link to="/">
      <span class="logo">
        <el-image
          v-if="lightLogo && lightLogo.length > 0"
          :src="
            theme.themeName.substring(theme.themeName.lastIndexOf('-') + 1) ==
            'white'
              ? lightLogo
              : darkLogo
          "
          style="
            float: left;
            width: 40px;
            height: 40px;
            margin-top: 10px;
            margin-left: 11px;
          "
        />
        <el-image
          v-else
          :src="require('@/assets/login_images/logo-small.png')"
          style="
            float: left;
            width: 40px;
            height: 40px;
            margin-top: 10px;
            margin-left: 11px;
          "
        />
        <!-- <svg-icon v-else icon="lightLogo" is-custom-svg /> -->
        <!-- 使用自定义svg示例 -->
        <!-- <svg-icon v-if="logo" :icon="logo" is-custom-svg />
        <svg-icon
          v-else
          :icon="
            theme.themeName.substring(theme.themeName.lastIndexOf('-') + 1) ==
            'white'
              ? lightLogo
              : darkLogo
          "
          is-custom-svg
        /> -->
      </span>
      <span
        id="titleId"
        class="title"
        :class="{ 'hidden-xs-only': theme.layout === 'horizontal' }"
      >
        {{ systemName }}
      </span>
    </router-link>
  </div>
</template>

<script setup lang="ts">
  import { useSettingsStore } from '@/store/modules/settings'
  import { svgIcon } from '~/agilebpm'
  const settingsStore = useSettingsStore()
  const { theme, logo, darkLogo, lightLogo, title, systemName } =
    storeToRefs(settingsStore)
</script>

<style lang="scss" scoped>
  .logodiv {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #ebeef5;
  }

  @mixin container {
    position: relative;
    height: $base-header-height;
    overflow: hidden;
    line-height: $base-header-height;
    background: transparent;
  }

  @mixin logo {
    display: inline-block;
    width: 32px;
    height: 32px;
    color: $base-title-color;
    vertical-align: middle;
    fill: currentColor;
  }

  @mixin title {
    display: inline-block;
    margin-right: 0px;
    margin-left: 5px;
    overflow: hidden;
    font-size: 20px;
    line-height: 55px;
    color: $base-title-color;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
  }

  .logo-container {
    &-horizontal,
    &-common {
      @include container;

      .logo {
        svg,
        img {
          @include logo;
        }
      }

      .title {
        @include title;
      }
    }

    &-vertical,
    &-column,
    &-comprehensive,
    &-float {
      @include container;

      height: $base-logo-height;
      line-height: $base-logo-height;
      text-align: center;

      .logo {
        svg,
        img {
          @include logo;
        }
      }

      .title {
        @include title;
        max-width: calc(var(--el-left-menu-width) - 60px);
      }
    }

    &-column {
      background: $base-column-second-menu-background !important;

      .logo {
        position: fixed;
        top: 0;
        display: block;
        width: $base-left-menu-width-min;
        height: $base-logo-height;
        margin: 0;
        background: $base-column-first-menu-background;
      }

      .title {
        padding-right: 5px;
        // padding-left: 15px;
        margin-left: $base-left-menu-width-min !important;
        color: var(--el-color-black) !important;

        background: $base-column-second-menu-background !important;
        @include title;
      }
    }
  }
</style>

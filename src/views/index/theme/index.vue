<template>
  <div>
    <el-form
      ref="form"
      label-position="left"
      label-width="100px"
      :model="theme"
    >
      <el-form-item label-width="0px">
        <!-- <el-button size="small" type="primary" @click="handleSaveTheme">
          {{ translate('保存') }}
        </el-button> -->
        <el-button size="small" @click="setDefaultCom">
          {{ translate('组件恢复默认') }}
        </el-button>
        <el-button size="small" @click="setDefaultTheme">
          {{ translate('主题恢复默认') }}
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" @click="randomTheme">
          <vab-icon icon="apps-line" />
          {{ translate('随机换肤') }}
        </el-button>
      </el-form-item>
      <el-form-item>
        <template #label>
          {{ translate('布局') }}
          <el-tooltip
            :content="
              translate(
                '布局配置仅在电脑视窗下生效，手机视窗时将默认锁定为纵向布局'
              )
            "
            effect="dark"
            placement="top"
          >
            <vab-icon icon="question-line" />
          </el-tooltip>
        </template>
        <el-select
          v-model="theme.layout"
          :disabled="device === 'mobile'"
          placeholder="请选择"
          @change="updateLayout"
        >
          <el-option key="column" :label="translate('分栏')" value="column" />
          <el-option :label="translate('综合')" value="comprehensive" />
          <el-option :label="translate('纵向')" value="vertical" />
          <el-option :label="translate('横向')" value="horizontal" />
          <el-option :label="translate('常规')" value="common" />
          <el-option :label="translate('浮动')" value="float" />
        </el-select>
      </el-form-item>
      <el-form-item :label="translate('主题')">
        <el-select v-model="theme.themeName" @change="updateTheName">
          <el-option :label="translate('蓝白')" value="blue-white" />
          <el-option :label="translate('蓝黑')" value="blue-black" />
          <el-option :label="translate('绿白')" value="green-white" />
          <el-option :label="translate('绿黑')" value="green-black" />
          <el-option :label="translate('紫白')" value="purple-white" />
          <el-option :label="translate('紫黑')" value="purple-black" />
          <el-option :label="translate('红白')" value="red-white" />
          <el-option :label="translate('红黑')" value="red-black" />
          <el-option :label="translate('渐变')" value="ocean" />
        </el-select>
      </el-form-item>
      <!-- // 页面动画 -->
      <!-- <el-form-item :label="translate('黑夜模式')">
        <el-switch v-model="theme.showPageTransition" />
      </el-form-item> -->
    </el-form>
  </div>
</template>
<script lang="ts" setup>
  import { translate } from '@/i18n'
  import { useSettingsStore } from '@/store/modules/settings'

  const $sub: any = inject('$sub')
  const $unsub: any = inject('$unsub')
  const $baseLoading: any = inject('$baseLoading')
  const settingsStore: any = useSettingsStore()
  const { theme, device }: any = storeToRefs(settingsStore)
  const { saveTheme, resetTheme, updateTheme }: any = settingsStore
  const emit = defineEmits(['saveTheme', 'restoreDefault'])
  const state = reactive({
    drawerVisible: false,
  })

  const handleOpenTheme = () => {
    state.drawerVisible = true
  }

  const updateMenuWidth = () => {
    useCssVar('--el-left-menu-width', ref(null)).value = theme.value.menuWidth
  }

  // 恢复默认组件
  const setDefaultCom = async () => {
    emit('restoreDefault')
  }
  // 恢复默认主题
  const setDefaultTheme = async () => {
    resetTheme()
    updateTheme()
    saveTheme()
    emit('saveTheme',theme.value)
  }

  const handleSaveTheme = async () => {
    await saveTheme()
    emit('saveTheme',theme.value)
  }

  const updateTheName = async () => {
    await updateTheme()
    await saveTheme()
    emit('saveTheme',theme.value)
  }

  // 切换布局重新写一个方法  改变布局model 再调update方法
  const updateLayout = async () => {
    const loading = $baseLoading(0)
    updateTheme()
    saveTheme()
    console.log()
    emit('saveTheme',theme.value)
    setTimeout(() => {
      loading.close()
    }, 1000)
  }

  const shuffle = (val: string | boolean, list: (string | boolean)[]) =>
    list.filter((_) => _ !== val)[(Math.random() * (list.length - 1)) | 0]

  const randomTheme = async () => {
    const loading = $baseLoading(0)
    // 随机换肤重置移除主题，防止代码更新影响样式
    resetTheme()

    theme.value.themeName = shuffle(theme.value.themeName, [
      'blue-black',
      'blue-white',
      'green-black',
      'green-white',
      'purple-black',
      'purple-white',
    ])
    theme.value.columnStyle = shuffle(theme.value.columnStyle, [
      'vertical',
      'horizontal',
      'card',
      'arrow',
    ])
    // theme.value.background = shuffle(theme.value.background, [
    //   'none',
    //   'vab-background',
    // ])
    theme.value.tabsBarStyle = shuffle(theme.value.tabsBarStyle, [
      'card',
      'smart',
      'smooth',
    ])
    theme.value.showTabsIcon = shuffle(theme.value.showTabsIcon, [true, false])
    theme.value.layout =
      device.value === 'desktop'
        ? shuffle(theme.value.layout, [
            'horizontal',
            'vertical',
            'column',
            'comprehensive',
            'common',
            'float',
          ])
        : 'vertical'

    updateTheme()
    saveTheme()
    emit('saveTheme',theme.value)
    setTimeout(() => {
      loading.close()
    }, 1000)
  }

  $sub('theme', () => {
    handleOpenTheme()
  })
  $sub('random-theme', () => {
    randomTheme()
  })

  onBeforeUnmount(() => {
    $unsub('theme')
    $unsub('random-theme')
  })
</script>

<style lang="scss">
  @use 'sass:math';
  .vab-drawer {
    .el-drawer__header {
      padding: $base-padding $base-padding 0 $base-padding;
      margin-bottom: 0;
    }

    .el-drawer__body {
      padding-right: 0;

      .el-scrollbar__wrap {
        height: calc(100vh - 80px);
        padding-right: $base-padding;

        .el-divider--horizontal {
          margin: $base-margin * 2 0 $base-margin * 2 0;
        }

        .el-form-item {
          display: flex;
          align-items: center;

          &__label {
            flex: 1 1;
            i {
              cursor: pointer;
            }
          }

          &__content {
            flex: 0 0 auto;
          }

          &.vab-item-custom {
            display: block !important;
            height: 130px;
          }

          .el-radio-button {
            display: block;
            float: left;
            width: 80px;
            height: 80px;
            margin: 10px;
            cursor: pointer;
            border-radius: 5px;

            &.is-disabled {
              cursor: not-allowed;
              opacity: 0.6;
            }

            &.is-active {
              box-shadow: 0 0 2px 2px #1890ff;
            }

            .el-radio-button__orig-radio,
            .el-radio-button__inner {
              display: none;
            }

            &.none {
              font-family: 'remixicon', sans-serif !important;
              font-size: 16px;
              font-weight: 580;
              line-height: 80px;
              text-align: center;
              background: #f7f7f7 none;
              background-size: cover;

              &:before {
                content: '\eace';
              }
            }

            &.vab-background {
              background: url(~@/assets/theme_images/background-1.png);
              background-size: cover;
            }
          }

          .el-input__inner {
            width: 115px;
          }
        }
      }
    }

    .el-drawer__footer {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: $base-z-index + 1;
      padding: math.div($base-padding, 2);
      background: var(--el-color-white);
      border-top: 1px solid $base-border-color;
    }
  }
</style>

<script lang="ts" setup>
  import { useSettingsStore } from '@/store/modules/settings'
  import getPageTitle from '@/utils/pageTitle'
  import { VabRoute } from '/#/router'
  import { useI18nStore } from '@/store/modules/i18n'
  import { Check } from '@element-plus/icons-vue'
  import {
    sysApi,
    getData,
    abApiPrefix,
    authApi,
    orgApi,
    abAvatar,
    registerApi,
  } from '~/agilebpm'
  import { abT } from '~/src/i18n'
  import { ElMessage, ElMessageBox } from 'element-plus'

  const { locale } = useI18n()

  const route: VabRoute = useRoute()

  const settingsStore = useSettingsStore()
  const { theme } = storeToRefs(settingsStore)
  const { changeLanguage } = settingsStore
  const info: any = reactive({
    lanugageList: [],
  })

  onMounted(() => {
    initLang()
    info.lanugageList = useI18nStore().getLanguageList.filter(
      (item) => item['enabled'] == 1
    )
  })

  watch(
    () => useI18nStore().getLanguageList.length,
    (now, old) => {
      info.lanugageList = useI18nStore().getLanguageList.filter(
        (item) => item['enabled'] == 1
      )
    }
  )

  const initLang = async () => {
    const { data } = await registerApi.getUserInfo()
    if (data.language) {
      changeLanguage(data.language)
      locale.value = data.language
    }
  }

  const handleCommand = (language: string) => {
    changeLanguage(language)
    locale.value = language
    document.title = getPageTitle(route.meta.title, route.name)
    switchLang(language)
  }

  /**
   * 持久化选择语音
   *
   * @param lang 切换的组织
   */
  async function switchLang(lang: any) {
    const { isOk, msg } = await getData(
      `${
        abApiPrefix.sysServicePrefix
      }/userResource/switchLang/${lang}?t=${new Date().getTime()}`
    )
    if (isOk) {
      ElMessage({
        message: `${abT('page.common.changeLangSuc', '语言切换成功')}`,
        type: 'success',
      })
    } else {
      ElMessage({
        message: `${abT('page.common.changeLangErr', '语言切换失败')}, ${msg}`,
        type: 'warning',
      })
    }
  }
</script>

<template>
  <el-dropdown v-if="theme && theme.showLanguage" @command="handleCommand">
    <vab-icon icon="translate" />
    <template #dropdown>
      <el-dropdown-menu>
        <template v-for="item in info.lanugageList" :key="item.key">
          <el-dropdown-item v-if="locale != item.key" :command="item.key">
            {{ item.name }}
          </el-dropdown-item>
        </template>
        <template v-for="item in info.lanugageList" :key="item.key">
          <el-dropdown-item
            v-if="locale == item.key"
            :command="item.key"
            :disabled="true"
            :divided="true"
            :icon="Check"
          >
            {{ item.name }}
          </el-dropdown-item>
        </template>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

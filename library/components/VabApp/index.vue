<script lang="ts" setup>
  // @ts-ignore
  import enLocale from 'element-plus/dist/locale/en'
  // @ts-ignore
  import zhLocale from 'element-plus/dist/locale/zh-cn'
  // @ts-ignore
  import zhtwLocale from 'element-plus/dist/locale/zh-tw'
  // @ts-ignore
  import jaLocale from 'element-plus/dist/locale/ja'
  // @ts-ignore
  import ptLocale from 'element-plus/dist/locale/pt'

  import LicenceTips from '@/views/sys/productLicence/licenceTips.vue'
  import { abWaterMark } from '@agilebpm'
  import { useSettingsStore } from '@/store/modules/settings'
  const settingsStore = useSettingsStore()
  const { waterMark, configuration} = storeToRefs(settingsStore)

  const globalWaterMark = reactive({
    visible: waterMark,
    text: configuration,
  })

  const { locale: language } = useI18n()
  const locale = computed(() => {
    return (
      {
        'zh-CN': zhLocale,
        'zh-TW': zhtwLocale,
        'en-US': enLocale,
        'ja-JP': jaLocale,
        'pt-PT': ptLocale,
      }[language.value] || enLocale
    )
  })

</script>
<template>
  <el-config-provider
    :button="{
      autoInsertSpace: true,
    }"
    :locale="locale"
  >
    <router-view v-slot="{ Component }">
      <!-- <keep-alive  :exclude="['BpmDesigner']"> -->
      <component :is="Component" />
      <!-- </keep-alive> -->
    </router-view>
    <ab-water-mark
      v-if="globalWaterMark"
      :text="globalWaterMark.text"
      :visible="globalWaterMark.visible"
    />
    <licence-tips :global-water-mark="globalWaterMark" />
  </el-config-provider>
</template>

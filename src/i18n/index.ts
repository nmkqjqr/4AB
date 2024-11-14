import pinia from '@/store'
import { useSettingsStore } from '@/store/modules/settings'
import { useI18nStore } from '@/store/modules/i18n'
import { createI18n } from 'vue-i18n'
import type { App } from 'vue'

import { LanguageType } from '/#/store'
//import en from './locales/en.json'
// \library\components\VabApp\index.vue
// 这里是element ui 语言引入和适配的位置
// 语言对应
// https://blog.csdn.net/zhenzigis/article/details/129448824

import { sysApi } from '~/agilebpm'

const messages: Record<LanguageType, any> = {}

function getLanguage() {
  const { getLanguage } = useSettingsStore(pinia)
  return getLanguage
}

export const i18n = createI18n({
  legacy: false,
  locale: getLanguage(),
  fallbackLocale: 'zh-CN',
  messages,
  globalInjection: true, // 全局生效 $t
  silentTranslationWarn: true,
  missingWarn: false,
  silentFallbackWarn: false,
  fallbackWarn: false,
})

export function setupI18n(app: App<Element>) {
  app.use(i18n)

  app.config.globalProperties.$abT = abT

  const langs = useI18nStore().langs
  if (langs) {
    for (const key in langs) {
      if (messages[key]) {
        i18n.global.mergeLocaleMessage(key, langs[key])
      } else {
        i18n.global.setLocaleMessage(key, langs[key])
      }
    }
  }

  // 请求后台更新语言库
  sysApi.sysInternation
    .getLangs([
      'page.',
      'abform.',
      'custform.',
      'menu.',
      'rules.',
      'custDialog.',
      'sysDict.',
      'bpm.',
      'constant.InstanceStatus.',
      'constant.OpinionStatus.',
    ]) // @ts-ignore
    .then(({ data }) => {
      for (const key in data) {
        if (messages[key]) {
          i18n.global.mergeLocaleMessage(key, data[key])
        } else {
          i18n.global.setLocaleMessage(key, data[key])
        }
      }
      useI18nStore().setLangs(data)
    })
  // @ts-ignore 设置语言
  sysApi.sysInternation.getLanguageList().then(({ data }) => {
    useI18nStore().getLanguageList.push(...data)
  })

  return i18n
}
const useI18nConfig = true
/**
 *
 * @param key key
 * @param defaultValue 默认值
 * @param params 当模板中有参数时，需要传入一个参数对象eg： 确定删除{a}，参数 {a：1}
 * @returns
 */
export function abT(key: string, defaultValue?: string, params: Object = {}) {
  if (!useI18nConfig && defaultValue) return defaultValue
  const { t } = i18n.global

  if (!defaultValue) {
    defaultValue = key
  }

  const options = {
    default: defaultValue,
    plural: 1,
  }

  if (key.startsWith('$t:')) {
    // @ts-ignore
    return t(key.replace('$t:', ''), params, options)
  }

  // @ts-ignore
  return t(key, params, options)
}

export function translate(message: string | undefined) {
  if (!message) {
    return ''
  }
  return (
    [getLanguage(), 'vabI18n', message].reduce(
      (o, k) => (o || {})[k],
      messages as any
    ) || message
  )
}

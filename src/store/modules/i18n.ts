import { I18nModuleType } from '/#/store'

export const useI18nStore = defineStore('i18n', {
  state: (): I18nModuleType => ({
    languageList: [],
    langs: null,
  }),
  getters: {
    getLanguageList: (state) => state.languageList,
    getLangs: (state) => {
      // 当等于空时，优先取localStorage
      if (!state.langs) {
        const langs = localStorage.getItem('ab-langs')
        if (langs) {
          return JSON.parse(langs)
        }
      }
      return state.langs || {}
    },
  },
  actions: {
    setLanguageList(languageList: any) {
      this.languageList = languageList
    },
    setLangs(langs: any) {
      this.langs = langs
      localStorage.setItem('ab-langs', JSON.stringify(langs))
    },
  },
})

/**
 * @description 所有全局配置的状态管理，如无必要请勿修改
 */
import { SettingsModuleType } from '/#/store'
import { sysApi } from '~/agilebpm'
import { isJson } from '@/utils/validate'
import {
  logo as _logo,
  lightLogo,
  darkLogo,
  title as _title,
  i18n,
  layout,
  themeName,
  background,
  columnStyle,
  fixedHeader,
  foldSidebar,
  menuWidth,
  showProgressBar,
  showTabs,
  showTabsIcon,
  showLanguage,
  showRefresh,
  showTheme,
  showFullScreen,
  showPageTransition,
  showLock,
  tabsBarStyle,
  showSearch,
  showNotice,
} from '@/config'

const defaultTheme: ThemeType = {
  layout,
  themeName,
  background,
  columnStyle,
  fixedHeader,
  foldSidebar,
  menuWidth,
  showProgressBar,
  showTabs,
  showTabsIcon,
  showLanguage,
  showSearch,
  showRefresh,
  showTheme,
  showNotice,
  showFullScreen,
  showPageTransition,
  showLock,
  tabsBarStyle,
}

const getLocalStorage = (key: string) => {
  const value: string | null = localStorage.getItem(key)
  return value && isJson(value) ? JSON.parse(value) : false
}
const theme = getLocalStorage('theme') || { ...defaultTheme }
const { collapse = foldSidebar } = getLocalStorage('collapse')
const { language = i18n } = getLocalStorage('language')
const { lock = false } = getLocalStorage('lock')
const { logo = _logo } = getLocalStorage('logo')
const { title = _title } = getLocalStorage('title')

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsModuleType => ({
    theme,
    device: 'desktop',
    collapse,
    language,
    lock,
    logo,
    lightLogo: '',
    darkLogo: '',
    systemName: 'AgileBPM',
    comName: 'AgileBPM',
    custom: '',
    waterMark: 1,
    configuration: ['username'],
    title,
    echartsGraphic1: ['#3ED572', '#399efd'],
    echartsGraphic2: ['#399efd', '#8cc8ff'],
  }),
  getters: {
    getTheme: (state) => state.theme,
    getDevice: (state) => state.device,
    getCollapse: (state) => state.collapse,
    getLanguage: (state) => state.language,
    getLock: (state) => state.lock,
    getLogo: (state) => state.logo,
    getLightLogo: (state) => state.lightLogo,
    getDarkLogo: (state) => state.darkLogo,
    getSystemName: (state) => state.systemName,
    getComName: (state) => state.comName,
    getWatermark: (state) => state.waterMark,
    getCustom: (state) => state.custom,
    getConfiguration: (state) => state.configuration,
    getTitle: (state) => state.title,
  },
  actions: {
    /**
     * @description 设置浅色logo
     * @param {*} lightLogo
     */
    setLightLogo(lightLogo: any) {
      this.lightLogo = lightLogo
    },
    /**
     * @description 设置深色logo
     * @param {*} darkLogo
     */
    setDarkLogo(darkLogo: any) {
      this.darkLogo = darkLogo
    },
    /**
     * @description 设置系统名称
     * @param {*} systemName
     */
    setSystemName(systemName: any) {
      this.systemName = systemName
    },
    /**
     * @description 设置公司名称
     * @param {*} comName
     */
    setComName(comName: any) {
      this.comName = comName
    },
    /**
     * @description 设置水印
     * @param {*} waterMark
     */
    setWaterMark(waterMark: any) {
      this.waterMark = waterMark
    },
    /**
     * @description 设置自定义
     * @param {*} darkLogo
     */
    setCustom(custom: any) {
      this.custom = custom
    },
    /**
     * @description 设置水印显示
     * @param {*} darkLogo
     */
    setConfiguration(configuration: any) {
      this.configuration = configuration
    },
    /**
     * @description 获取系统名称logo等信息
     * @returns
     */
    async getCompanyConfigInfo() {
      const { data } = await sysApi.configuration.getCompanyConfigInfo()
      /**
       * 检验返回数据是否正常，无对应参数，将使用默认用户名,头像,Roles和Permissions
       * username {String}
       * avatar {String}
       * roles {List}
       * ability {List}
       */
      if (data && data.length > 0) {
        const dataInfo = JSON.parse(data)
        if (dataInfo.systemName && dataInfo.systemName.length > 0) {
          this.setSystemName(dataInfo.systemName)
        }
        if (dataInfo.comName && dataInfo.comName.length > 0) {
          this.setComName(dataInfo.comName)
        }
        if (JSON.parse(dataInfo.whiteLogo)[0]) {
          this.setLightLogo(
            sysApi.sysFile.getViewFileUrl(JSON.parse(dataInfo.whiteLogo)[0].id)
          )
        }
        if (JSON.parse(dataInfo.blackLogo)[0]) {
          this.setDarkLogo(
            sysApi.sysFile.getViewFileUrl(JSON.parse(dataInfo.blackLogo)[0].id)
          )
        }
        this.changeTitle(dataInfo.systemName)
        // 是否显示水印
        this.setWaterMark(dataInfo.waterMark)
        this.setCustom(dataInfo.custom)
        if (dataInfo.configuration && dataInfo.configuration.length > 0) {
          this.setConfiguration(dataInfo.configuration)
        }
      }
    },

    updateState(obj: any) {
      Object.getOwnPropertyNames(obj).forEach((key) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this[key] = obj[key]
        localStorage.setItem(
          key,
          typeof obj[key] == 'string'
            ? `{"${key}":"${obj[key]}"}`
            : `{"${key}":${obj[key]}}`
        )
      })
    },
    saveTheme() {
      localStorage.setItem('theme', JSON.stringify(this.theme))
    },
    resetTheme() {
      this.theme = { ...defaultTheme }
      localStorage.removeItem('theme')
      this.updateTheme()
    },
    updateTheme() {
      const index = this.theme.themeName.indexOf('-')
      const themeName = this.theme.themeName.substring(0, index) || 'blue'
      let variables = require(`@vab/styles/variables/vab-${themeName}-variables.module.scss`)
      if (variables.default) variables = variables.default

      Object.keys(variables).forEach((key) => {
        if (key.startsWith('vab-')) {
          useCssVar(key.replace('vab-', '--el-'), ref(null)).value =
            variables[key]
        }
      })

      this.echartsGraphic1 = [
        variables['vab-color-transition'],
        variables['vab-color-primary'],
      ]

      this.echartsGraphic2 = [
        variables['vab-color-primary-light-5'],
        variables['vab-color-primary'],
      ]

      const menuBackground =
        this.theme.themeName.split('-')[1] || this.theme.themeName
      document.getElementsByTagName(
        'body'
      )[0].className = `vab-theme-${menuBackground}`
      if (this.theme.background !== 'none')
        document
          .getElementsByTagName('body')[0]
          .classList.add(this.theme.background)

      nextTick(() => {
        const el = ref(null)
        if (this.theme.menuWidth && this.theme.menuWidth.endsWith('px'))
          useCssVar('--el-left-menu-width', el).value = this.theme.menuWidth
        else useCssVar('--el-left-menu-width', el).value = '288px'
      })
    },
    loginTheme() {
      this.theme = getLocalStorage('theme')
    },
    defaultTheme() {
      return defaultTheme
    },
    toggleCollapse() {
      this.collapse = !this.collapse
      localStorage.setItem('collapse', `{"collapse":${this.collapse}}`)
    },
    toggleDevice(device: string) {
      this.updateState({ device })
    },
    openSideBar() {
      this.updateState({ collapse: false })
    },
    foldSideBar() {
      this.updateState({ collapse: true })
    },
    changeLanguage(language: string) {
      this.updateState({ language })
    },
    handleLock() {
      this.updateState({ lock: true })
    },
    handleUnLock() {
      this.updateState({ lock: false })
    },
    changeLogo(logo: string) {
      this.updateState({ logo })
    },
    changeTitle(title: string) {
      this.updateState({ title })
    },
  },
})

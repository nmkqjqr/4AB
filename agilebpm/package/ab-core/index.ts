import { defineComponent } from 'vue'
import type { App } from 'vue'

const Components = require.context('./components', true, /\.vue$/)
const Directives = require.context('./directives', false, /\.ts$/)
const Directives2 = require.context('./directives', false, /\.ts$/)

// 基础组件，自动导入的部分
import {
  abColumn,
  abLoad,
  abPinyin,
  abTooltipTag,
  abTooltipInput,
  abSave,
  abTable,
  abTree,
  abTableMix,
  abTest,
  abCustDialog,
  abSelectTree,
  abEnumSelector,
  abCode,
} from './components'

// 仅加载 指令，以及核心组件
export function setupAbCore(app: App<Element>) {
  app.component('AbLoad', abLoad)
  app.component('AbPinyin', abPinyin)
  app.component('AbTooltipTag', abTooltipTag)
  app.component('AbTooltipInput', abTooltipInput)
  app.component('AbSave', abSave)
  app.component('AbTable', abTable)
  app.component('AbTree', abTree)
  app.component('AbTableMix', abTableMix)
  app.component('AbColumn', abColumn)
  app.component('AbTest', abTest)
  app.component('AbCustDialog', abCustDialog)
  app.component('AbSelectTree', abSelectTree)
  app.component('AbEnumSelector', abEnumSelector)
  app.component('AbCode', abCode)

  /**
   * @description: 加载全局指令
   * @param {*} forEach
   * @returns {*}
   */
  Directives.keys().forEach((item: any) => {
    if (Directives(item).default) {
      app.directive(item.replace(/(\.\/|\.ts)/g, ''), Directives(item).default)
    }
  })
  /**
   * @description: 加载基础过滤器，引入是请使用 inject('$filters');  方式引入
   * @param {*}
   * @returns {*}
   */
  // app.config.globalProperties.$filters = {
  //     ab_convertCurrency: ab_convertCurrency,
  //     ab_timeLag: ab_timeLag,
  //     ab_dateFormat: ab_dateFormat,
  // }
}

/**
 * 自动加载全部组件
 * @param app
 */
export function setupAllAbComponent(app: App<Element>) {
  // 加载全部组件
  Components.keys().forEach((item: ReturnType<typeof defineComponent>) => {
    const c = Components(item).default
    //只注册有名字的
    if (c && c.name) {
      app.component(c.name, c)
    }
  })
  // 加载全部指令
  Directives.keys().forEach((item: any) => {
    if (Directives(item).default) {
      app.directive(item.replace(/(\.\/|\.ts)/g, ''), Directives(item).default)
    }
  })
}

export * from './components'

import {
  ElButton,
  ElRadioButton,
  ElCollapse,
  ElSelect,
  ElOption,
  ElOptionGroup,
  ElSpace,
  ElTag,
  ElDivider,
  ElCollapseItem,
  ElCard,
  ElForm,
  ElRadioGroup,
  ElTooltip,
  ElRadio,
  ElFormItem,
  ElInput,
  ElCheckbox,
  ElIcon,
  ElDialog,
  ElContainer,
  ElMain,
  ElHeader,
  ElTable,
  ElTableColumn,
  ElDescriptions,
  ElDescriptionsItem,
  ElPopover,
  ElSwitch,
  ElEmpty,
  ElRow,
  ElCol,
  ElDropdown,
  ElDropdownMenu,
  ElTabs,
  ElTabPane,
  ElInputNumber,
  ElLoading,
  ElRate,
  ElTree,
  ElPagination,
  ElTreeSelect,
  ElDatePicker,
  ElAlert,
  ElScrollbar,
  ElCheckTag,
  ElDrawer,
  ElCascader,
  ElUpload,
  ElSlider,
  ElProgress,
  ElImage,
  ElCarousel,
  ElColorPicker,
  ElStatistic,
  ElAvatar,
  ElSteps,
  ElStep,
  ElLink,
} from 'element-plus'

export function setupElementPlus(app: App<Element>) {
  app.use(ElAlert)
  app.use(ElAvatar)
  app.use(ElButton)
  app.use(ElCard)
  app.use(ElCarousel)
  app.use(ElCascader)
  app.use(ElCheckbox)
  app.use(ElCheckTag)
  app.use(ElCol)
  app.use(ElCollapse)
  app.use(ElCollapseItem)
  app.use(ElColorPicker)
  app.use(ElContainer)
  app.use(ElDatePicker)
  app.use(ElDescriptions)
  app.use(ElDescriptionsItem)
  app.use(ElDialog)
  app.use(ElDivider)
  app.use(ElDrawer)
  app.use(ElDropdown)
  app.use(ElDropdownMenu)
  app.use(ElEmpty)
  app.use(ElForm)
  app.use(ElFormItem)
  app.use(ElHeader)
  app.use(ElIcon)
  app.use(ElImage)
  app.use(ElInput)
  app.use(ElInputNumber)
  app.use(ElLoading)
  app.use(ElMain)
  app.use(ElOption)
  app.use(ElOptionGroup)
  app.use(ElPagination)
  app.use(ElPopover)
  app.use(ElProgress)
  app.use(ElRadio)
  app.use(ElRadioButton)
  app.use(ElRadioGroup)
  app.use(ElRate)
  app.use(ElRow)
  app.use(ElScrollbar)
  app.use(ElSelect)
  app.use(ElSlider)
  app.use(ElSpace)
  app.use(ElStatistic)
  app.use(ElStep)
  app.use(ElSteps)
  app.use(ElSwitch)
  app.use(ElTable)
  app.use(ElTableColumn)
  app.use(ElTabs)
  app.use(ElTabPane)
  app.use(ElTag)
  app.use(ElTooltip)
  app.use(ElTree)
  app.use(ElTreeSelect)
  app.use(ElUpload)
  app.use(ElLink)
}

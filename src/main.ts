import { createApp } from 'vue'
import App from './App.vue'
import { setupVab, setupPrint } from '~/library'
import { setupI18n } from '@/i18n'
import { setupStore } from '@/store'
import { setupRouter } from '@/router'
import { setupAbCore, setupElementPlus } from '~/agilebpm'
import { useZIndex } from 'element-plus'

import { setupFormDesignExp } from '~/src/views/form-designer/expand/setup.js'
import { setupFormDesign } from '~/agilebpm/build/formDesigner.js'
import { setupLayoutComponents } from '~/agilebpm/build/combinationApp'

// 导入 svgIcon
import installIcons from '@/icon'
const app = createApp(App)

// 适配给 agilebpm组件 状态管理使用,为了组件与平台解耦，但是组件又需要这些方法
import { useAbStoreAdapter } from '@/store/modules/abStoreAdapter'
;(window as any).useAbStoreAdapter = useAbStoreAdapter
/**
 * @description 生产环境启用组件初始化，编译，渲染和补丁性能跟踪。仅在开发模式和支持 Performance.mark API的浏览器中工作。
 */
//if (process.env.NODE_ENV === 'development') app.config.performance = true
installIcons(app)
setupVab(app)
setupElementPlus(app)
setupAbCore(app)
setupFormDesignExp(app)
setupFormDesign(app, useZIndex)
setupLayoutComponents(app)
setupI18n(app)
setupPrint(app)
setupStore(app)
setupRouter(app)
  .isReady()
  .then(() => app.mount('#app'))

import AvueFormDesign from './index.vue'
import Ab from './ab/index'

import { getAsVal, deepClone, loadScript } from './utils/index.js'
import { useZIndex } from 'element-plus'
import { watch } from 'vue'
// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'
// import zhCn from 'element-plus/es/locale/lang/zh-cn'

export function setupFormDesign(Vue, rootuseZIndex) {
    // Vue.use(ElementPlus, { local: zhCn }).use(AvueFormDesignConfig)
    Vue.use(Ab)
    Vue.component('ab-form-design', AvueFormDesign)
    Vue.config.globalProperties.getAsVal = getAsVal
    Vue.config.globalProperties.deepClone = deepClone
    Vue.config.globalProperties.loadScript = loadScript
    if (rootuseZIndex) {
        watch(
            [
                () => useZIndex().currentZIndex.value,
                () => rootuseZIndex().currentZIndex.value,
            ],
            ([z1, z2]) => {
               
                if (z1 < z2) {
                    useZIndex().nextZIndex()
                } else if (z1 > z2) {
                    rootuseZIndex().nextZIndex()
                }
            }
        )
    }
}
export {
    useZIndex
}
/**
 * 暴露 agileBPM 提供的所有组件依赖，core、bpm-designer、layout-designer、form-designer
 */

import * as abUtil from './utils/ab-util'
import * as abTools from './utils/ab-tools'
import * as abFormat from './utils/ab-format'

//通用css
import './style/ab-global.scss'

// 所有API
export * from './api'

// 流程组件
export * from './package/ab-bpm'

// 表单组件

// 表单Preview页
import formPreview from './package/ab-form/formPreview.vue'

// 自定义列表组件
export * from './package/custGridView'

// 应用广场
// export * from './package/ab-app-square'

export * from './package/ab-core'

export { abUtil, abTools, abFormat, formPreview }

export * from './package/ab-form'

/* 
export * from '~/agilebpm/build/agilebpm/agilebpm.umd.min.js'
import './style/ab-global.scss'
import './style/form-theme/ab-form-style.scss' */

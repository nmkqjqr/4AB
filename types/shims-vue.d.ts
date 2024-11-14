declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.vue' {
  import type VueDefineOptions from 'unplugin-vue-define-options/webpack'
  const options: VueDefineOptions<{}, {}, any>
  export default options
}

declare module '@agilebpm/build/ab-core/ab-core.umd.min.js' {
  export function setupAbCore(app: vue<Element>)
  export const abTableMix: any
  export const svgIcon: any
  export const abDictTree: any
  export const abAuthorization: any
}

declare module '@agilebpm/build/avue-form-design/avue-form-design.umd.min.js' {
  export function setupFormDesign(app: vue<Element>)
}

declare module '@agilebpm/build/layout-design/layout-designer.umd.min.js' {
  export function setupLayoutComponents(app: vue<Element>)
  export const abLayoutDesigner: any
  export const abFormCombinationPreview: any
}

declare module '~/agilebpm/build/agilebpm/agilebpm.umd.min.js' {
  export function setupElementPlus(app: vue<Element>)
  export const authApi: any
  export const abMsgType: any
  export const abRichEditor: any

  export function setupFormDesign(app: vue<Element>)
  export const abForm: any
  export const svgIcon: any
  export const abDictTree: any
  export const abAuthorization: any

  export function setupAbCore(app: vue<Element>)
  export const abTableMix: any
  export const svgIcon: any
  export const abDictTree: any
  export const abAuthorization: any

  export const registerApi: any
  export const request: any
  export const sysApi: any
  export const bizApi: any
  export const bpmApi: any
  export const abTools: any
  export const abUtil: any
  export const cmsApi: any
  export const getData: any
  export const orgApi: any

  export const abDesigner: any
  export const postData: any
  export const cptApi: any

  export const abTable: any
  export const abUploadDialog: any
  export const salaryApi: any

  export const BpmImageDialog: any
  export const BpmOpinionDialog: any
  export const ApproveHistoryTable: any
}
// 国际化的翻译全文方法
declare module '*.vue' {
  interface ComponentCustomProperties {
    $abT: (key: string, val: string | undefined) => string
  }
}

export * as bpmApi from './modules/ab-bpm'

export * as authApi from './modules/ab-auth'

export * as bizApi from './modules/ab-biz'

export * as sysApi from './modules/ab-sys'

export * as orgApi from './modules/ab-org'

export * as registerApi from './modules/ab-register'

export * as cptApi from './modules/ab-cpt'

export * as cmsApi from './modules/ab-cms'

export * as salaryApi from './modules/ab-salary'

export * as appstoreApi from './modules/ab-appstore'

export * as appsquareApi from './modules/ab-appSquare'

// import {bpmApi} from abApi

export * from './ab-request'

export * as abApiPrefix from './ab-api-prefix'

import request from './ab-request'

import abStoreAdaptor from './ab-store'

export * as abSimWf from './modules/ab-simwf'

export { request, abStoreAdaptor }

import { sysServicePrefix } from './ab-api-prefix'

export function trespass(desc: string) {
  return request({
    url: `${sysServicePrefix}/tools/trespass`,
    method: 'POST',
    params: { desc: desc },
  })
}

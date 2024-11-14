import { defineComponent } from 'vue'
import type { App } from 'vue'
const Components = require.context('./', true, /\.vue$/)

export function setupLayoutComponents(app: App<Element>) {
  Components.keys().forEach((item: ReturnType<typeof defineComponent>) => {
    const c = Components(item).default
    //只注册有名字的
    if (c && c.name) {
      app.component(c.name, c)
    }
  })
}
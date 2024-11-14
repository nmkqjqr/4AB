import MyProcessDesigner from './designer'
import MyProcessPalette from './palette'
import MyProcessPenal from './penal'
import MyProcessPlugin from './plugins'
const components = [
  MyProcessDesigner,
  MyProcessPenal,
  MyProcessPalette,
  MyProcessPlugin,
]

const install = function (Vue) {
  components.forEach((component) => {
    Vue.component(component.name, component)
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  version: '0.0.1',
  install,
  ...components,
}

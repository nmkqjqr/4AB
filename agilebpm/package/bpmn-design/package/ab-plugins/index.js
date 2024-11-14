import AbPlugins from './AbPlugins.vue'

AbPlugins.install = function (Vue) {
  Vue.component(AbPlugins.name, AbPlugins)
}

export default AbPlugins

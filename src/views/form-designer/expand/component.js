const Configs = require.context('./config', true, /\.vue$/)
const Items = require.context('./item', true, /\.vue$/)

const AbExp = {
  install(Vue) {
    if (this.installExped) return
    this.installExped = true

    //注册控件配置
    Configs.keys().forEach((item) => {
      const c = Configs(item).default
      //只注册有名字的
      if (c && c.name) {
        Vue.component(c.name, c)
      }
    })

    //注册控件内容
    Items.keys().forEach((item) => {
      const c = Items(item).default
      //只注册有名字的
      if (c && c.name) {
        Vue.component(c.name, c)
      }
    })
  },
}

export default AbExp

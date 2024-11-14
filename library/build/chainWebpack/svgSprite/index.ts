const { resolve } = require('path')

module.exports = {
  createSvgSprite: (config) => {
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icon'))
      // 结束
      .end()
    config.module
      .rule('vabIcon')
      .test(/\.svg$/)
      .include.add(resolve('src/icon')) // 结束
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({ symbolId: 'icon-[name]' })
      // 结束
      .end()
  },
}

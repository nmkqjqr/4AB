const { createUnPlugin } = require('./unplugins/index.js')
const { createWebpackBar } = require('./webpack' + 'Bar/index.ts')
const { createDefineOptions } = require('./defineOptions/index.ts')
const { createDefinePlugin } = require('./definePlugin/index.ts')
const { createProvidePlugin } = require('./providePlugin/index.ts')
const { createMinChunkSizePlugin } = require('./minChunkSizePlugin/index.ts')
const dev = process.env.NODE_ENV === 'development'
module.exports = {
  createVuePlugin: (islib) => [
    ...createDefineOptions(),
    ...createUnPlugin(false, islib),
    require('unplugin-element-plus/webpack')(),
    ...createWebpackBar(),
    ...createDefinePlugin(),
    ...createProvidePlugin(),
    ...(dev ? [] : createMinChunkSizePlugin()),
  ],
}

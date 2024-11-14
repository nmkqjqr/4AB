/**
 * @description vue.config.js全局配置
 */
const {
  //baseURL,
  //proxyURL,
  title,
  devPort,
  assetsDir,
  outputDir,
  lintOnSave,
  publicPath,
  transpileDependencies,
} = require('./src/config')
const dayjs = require('dayjs')
const pkg = require('./package.json')
const nodeExternals = require('webpack-node-externals')

const { resolve, relative } = require('path')
const { defineConfig } = require('@vue/cli-service')
const {
  createVuePlugin,
  createChainWebpack,
} = require('./library/build/index.ts')
const webpack = require('webpack')
const info = {
  ...pkg,
  lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
}

process.env.VUE_APP_TITLE = title
process.env.VUE_APP_AUTHOR = pkg.author
process.env.VUE_APP_INFO = JSON.stringify(info)
process.env.VUE_APP_UPDATE_TIME = info.lastBuildTime
process.env.VUE_APP_GITHUB_USER_NAME = process.env.VUE_GITHUB_USER_NAME
process.env.VUE_APP_RANDOM = `${info.lastBuildTime}-${process.env.VUE_GITHUB_USER_NAME}`
const islib = process.env.npm_lifecycle_event.indexOf('lib') > -1
console.log(islib)
module.exports = defineConfig({
  publicPath,
  assetsDir,
  outputDir,
  lintOnSave,
  transpileDependencies,
  devServer: {
    compress: true,
    client: {
      progress: false,
      overlay: {
        warnings: false,
        errors: true,
        runtimeErrors: false,
      },
    },
    hot: true,
    open: {
      target: [`http://localhost:${devPort}`],
    },
    port: devPort,
    // setupMiddlewares: require('./mock'),
    // 注释掉的地方是前端配置代理访问后端的示例
    // baseURL必须为/xxx，而不是后端服务器，请先了解代理逻辑，再设置前端代理
    // ！！！一定要注意！！！
    // 1、这里配置了跨域及代理只针对开发环境生效
    // 2、不建议你在前端配置跨域，建议你后端配置Allow-Origin,Method,Headers，放行token字段，一步到位
    // 3、后端配置了跨域，就不需要前端再配置，会发生Origin冲突
    // 4、webpack5版本前端配置代理无法与mock同时使用，如果一定要用前端代理，需注释setupMiddlewares: require('./mock')
    proxy: {
      '/api': {
        target: process.env.VUE_APP_BASE_URL,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/',
        },
      },
    },
  },
  configureWebpack() {
    return {
      resolve: {
        alias: {
          '~': resolve(__dirname, '.'),
          '@': resolve(__dirname, 'src'),
          '@agilebpm': resolve(__dirname, 'agilebpm'),
          '@ab-core': resolve(__dirname, 'agilebpm/package/ab-core'),
          '@ab-form': resolve(__dirname, 'agilebpm/package/ab-form'),
          '@ab-bpm': resolve(__dirname, 'agilebpm/package/ab-bpm'),
          '/#': resolve(__dirname, 'types'),
          '@vab': resolve(__dirname, 'library'),
          '@gp': resolve('library/plugins/vab'),
          'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
        },
        fallback: {
          fs: false,
          path: require.resolve('path-browserify'),
        },
      },
      plugins: createVuePlugin(islib),
      performance: {
        hints: false,
      },
      // 库文件打包 树腰要在package.json 中配置 "sideEffects":false, 优化树摇
      optimization: {
        usedExports: islib,
      },
      externals: islib
        ? [
            'vuedraggable',
            'sortablejs',
            'js-cookie',
            'signature_pad',
            'diagram-js',
            'vue-codemirror',
            'echarts',
            '@codemirror',
            'codemirror',
            'vue',
            '@vue/shared',
            'pinia',
            'crypto-js',
            '@codemirror/view',
            '@codemirror/lang-html',
            '@codemirror/lang-java',
            '@codemirror/lang-javascript',
            '@codemirror/lang-json',
            '@codemirror/theme-one-dark',
            '@codemirror/state',
            'vue-router',
            'qs',
            'quill-blot-formatter',
            'element-plus',
            '@vueuse/core',
            'quill/dist/quill.js',
            'docx-preview',
            '@vueup/vue-quill',
            '@vueup/vue-quill/dist',
            '@vueup/vue-quill/dist/quill.js',
            'xlsx/xlsx.mjs',
            'lodash',
            'axios',
            '@element-plus/icons-vue',
            'crypto-js',
            'jsbarcode',
            'qrcode',
            'core-js',
            '@vue/shared',
            'hammerjs',
            'vue-i18n',
            'vue3-grid-layout-next',
            'dingtalk-h5-remote-debug',
            'dingtalk-jsapi',
          ]
        : [],
      cache: { type: 'filesystem' },
    }
  },
  chainWebpack(config) {
    createChainWebpack(process.env.NODE_ENV, config, islib)
    // 库文件打包开启,开发和打包请注释
    if (islib) {
      config.plugin('optimize').use(webpack.optimize.LimitChunkCountPlugin, [
        {
          maxChunks: 1,
        },
      ])
    }
  },
  runtimeCompiler: true,
  productionSourceMap: false,
  css: {
    sourceMap: false,
    // extract:
    //   process.env.NODE_ENV === 'production'
    //     ? {
    //         ignoreOrder: true,
    //       }
    //     : false,
    // 库文件打包时开启， 不单独输出css文件
    extract: !islib,
    loaderOptions: {
      sass: {
        sassOptions: { outputStyle: 'expanded' },
        additionalData(content, { rootContext, resourcePath }) {
          const relativePath = relative(rootContext, resourcePath)
          if (
            relativePath.replace(/\\/g, '/') !==
            'library/styles/variables/variables.module.scss'
          )
            return `@use "~@vab/styles/variables/variables.module.scss" as *;${content}`
          return content
        },
      },
    },
  },
})

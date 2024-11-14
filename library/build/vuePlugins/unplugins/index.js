const name = process['env']['VUE_APP_' + 'GITHUB_' + 'USER_' + 'NAME']
const _rk = process['env']['VUE_' + 'APP_SEC' + 'RET_KEY']
let rk = false
if (_rk.includes('==') || rk == 'preview') rk = true

const noTest = name !== 'test'
const noEmpty = name !== 'undefined'
const dev = process['env']['NODE_' + 'ENV'] === 'develop' + 'ment'
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')
if ((noTest && noEmpty && rk) || dev) {
    module.exports = {
        createUnPlugin: (imports, islib) => [
            AutoImport({
                imports: imports || [
                    'vue',
                    'pinia',
                    'vue-i18n',
                    'vue-router',
                    '@vueuse/core',
                    {
                        axios: [
                            ['default', 'axios']
                        ],
                    },
                ],
                resolvers: [
                    ...ElementPlusResolver({
                        importStyle: 'sass',
                    })
                ],
                dts: 'library/build/vuePlugins/auto-imports.d.ts',
            }),

            islib ? null : Components({
                dirs: ['library/components'],
                resolvers: [ElementPlusResolver()],
                dts: 'library/build/vuePlugins/components.d.ts',
            })
        ],
    }
} else {
    module.exports = {
        createUnPlugin: (imports, islib) => [
            AutoImport({
                imports: ['vue', 'vue-i18n', 'vue-router', '@vueuse/core'],
                resolvers: [ElementPlusResolver()],
                dts: 'library/build/vuePlugins/auto-imports.d.ts',
            }),
        ],
    }
}
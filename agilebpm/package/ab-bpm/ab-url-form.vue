<template>
  <iframe
    v-if="pageInfo.url"
    id="urlForm__"
    :src="pageInfo.url"
    :style="{ width: '100%', border: 'none', height: pageInfo.height + 'px' }"
    @load="iframeHeight()"
  ></iframe>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue'
  import * as abTools from '~/agilebpm/utils/ab-tools'
  const { proxy } = abTools.useCurrentInstance()

  const props = defineProps({
    bpmForm: { required: true, type: Object as PropType<BpmForm> },
  })

  const pageInfo = reactive({
    // URL 表单的地址
    url: '',
    // 是否存在获取数据事件
    hasGetDataEvent: false,
    height: 100,
  })

  const getData = (isValid: boolean) => {
    return Promise.resolve({
      then: function (resolve: (arg0: any) => void, reject: any) {
        const frmFrame = document.getElementById(
          'urlForm__'
        ) as HTMLIFrameElement
        if (!frmFrame) {
          console.error('urlForm__  Iframe 不存在 ！')
          resolve({
            valid: false,
            errorMsg: '表单缺少 事件监听 ，请发布 获取数据事件！',
          })
          return
        }

        const iframeObj = frmFrame.contentWindow

        // 判断子页面是否有监听事件 , 这里通过window.name == 'subIframeCallback'
        if (!pageInfo.hasGetDataEvent) {
          // 如果没有监听,则直接返回
          console.error(
            ` URL：${pageInfo.url} 表单缺少 事件监听 ，请发布 获取数据事件！`
          )
          resolve({
            valid: true,
            errorMsg: 'URL 表单缺少 事件监听 ，请发布 获取数据事件！',
          })
          return
        }

        const targetUrl = pageInfo.url
        // 1. 当前页面接收子页面的数据事件
        window.onmessage = function (e) {
          e = e || event
          const urlFormData = e.data || {}
          if (urlFormData.type == 'getData' && urlFormData.url == targetUrl) {
            if (!urlFormData.valid && isValid) {
              // 如果校验失败,则提示
              console.info(
                `\`URL 内校验不通过！,异常需要URL表单内部提示错误！${urlFormData.errorMsg}`
              )
              resolve({
                valid: false,
                errorMsg: `URL 内校验不通过：${urlFormData.errorMsg}`,
              })
              return
            }
            const resultData = urlFormData.data
            // 执行成功返回结果
            resolve(resultData)
          }
        }

        // 2. 由当前页面发送获取数据事件消息给子页面
        iframeObj?.postMessage(
          {
            type: 'getDataReady',
            url: document.location.href,
            // 是否需要校验表单
            isValid: isValid,
          },
          targetUrl
        )
      },
    })
  }

  const iframeHeight = () => {
    const height =
      (document.documentElement.clientHeight || document.body.clientHeight) -
      300
    pageInfo.height = height
    const urlFormElement = document.getElementById('urlForm__')
    if (urlFormElement) {
      urlFormElement['height'] = height
    }
  }

  iframeHeight()

  onMounted(() => {
    if (props.bpmForm.type != 'url') return
    let url = props.bpmForm.pcUrl
    // bug待调试
    if (!url.startsWith('http')) {
      // console.info('通过路由打开URL地址')
      // const routeData = proxy.$router.resolve({
      //   path: url,
      //   query: {},
      // })
      // url = routeData.href
      //页面前缀为：pathPrefix
      const pathPrefix = window.location.origin;
      url = pathPrefix + url
    }
    pageInfo.url = url
    const urlFormElement = document.getElementById('urlForm__')

    window.addEventListener('resize', iframeHeight)

    // 外部表单需要 通知BPM 页面存在 交互事件
    window.onmessage = function (e) {
      e = e || event
      const data = e.data || {}
      if (data.type == 'callback' && data.name == 'subIframeCallback') {
        pageInfo.hasGetDataEvent = true
      }
    }
  })

  // 将外部允许调用的方法
  defineExpose({ getData })
</script>

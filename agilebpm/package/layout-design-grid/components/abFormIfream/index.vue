<template>
  <div class="iframe-container" style="padding: 10px">
    <iframe
      v-if="url && url.length > 0"
      id="id"
      ref="iframeRef"
      frameborder="0"
      :src="url"
      style="width: 100%; border: none"
      :style="{ height: props.componentConfig.control.height + 'px' }"
    />
    <el-empty v-else description="暂未设置URL地址" />
  </div>
</template>
<script lang="ts">
  export default {
    name: 'AbFormIfream',
  }
</script>
<script setup lang="ts">
  import { PropType } from 'vue'
  import * as abUtil from '~/agilebpm/utils/ab-util'

  const globalParams = inject('globalParams') as any

  const props = defineProps({
    componentConfig: {
      required: true,
      type: Object as PropType<FormCombinationComponent>,
    },
  })
  const { componentConfig } = toRefs(props)

  const iframeRef = ref()

  const url = computed(() => {
    if (!props.componentConfig || !props.componentConfig.control.url) return ''
    return props.componentConfig.control.url.abArgFormat(globalParams)
  })

  // 1. 当前页面接收子页面的数据事件
  window.onmessage = function (e) {
    const urlFormData = e.data || {}
    if (
      urlFormData.type == 'abFormIfreamEvent' &&
      urlFormData.url &&
      urlFormData.url.endsWith(url.value)
    ) {
      if (urlFormData.isUpdateGlobalParam) {
        abUtil.easyClone(urlFormData.params, globalParams)
      }
    }
  }

  let intervalID: any

  // 在组件销毁前停止定时器
  onBeforeUnmount(() => {
    clearInterval(intervalID)
  })

  watch(
    () => [
      componentConfig.value?.control?.timedRefresh,
      componentConfig.value?.control?.refreshCycle,
    ],
    () => {
      const ct = componentConfig.value?.control
      clearInterval(intervalID)
      if (ct.timedRefresh) {
        intervalID = setInterval(
          function () {
            const iframeElement = iframeRef.value

            // 直接重新设置 iframe 的 src 属性
            iframeElement.src = iframeElement.src
          },
          ct.refreshCycle > 1 ? ct.refreshCycle * 1000 : 1000
        )
      }
    },
    {
      immediate: true,
    }
  )
</script>

<style lang="scss" scoped>
  .iframe-container {
    iframe {
      width: 100%;
      height: $base-keep-alive-height;
    }
  }
</style>

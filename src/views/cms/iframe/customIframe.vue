<template>
  <iframe
    v-if="url"
    frameborder="0"
    :height="currentHeight + 'px'"
    :src="url"
    width="100%"
  ></iframe>
</template>

<script lang="ts">
  export default defineComponent({
    name: 'CustomIframe',
  })
</script>

<script lang="ts" setup>
  import { defineComponent } from 'vue'
  import { abTools } from '~/agilebpm'
  import { useTabsStore } from '@/store/modules/tabs'

  const { changeTabsMeta } = useTabsStore()
  const { proxy } = abTools.useCurrentInstance()

  //获取路由上的name
  const name: any = decodeURIComponent(proxy.$route.query.name)
  //获取路由上的url
  const url: any = decodeURIComponent(proxy.$route.query.url)

  //动态获取当前浏览器视口高度
  const currentHeight = window.innerHeight - 140

  if (name) {
    changeTabsMeta({
      fullPath: proxy.$route.fullPath,
      meta: { title: name },
    })
  }
</script>

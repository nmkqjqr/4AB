<template></template>

<script lang="ts" setup>
  import { tokenTableName, storage } from '@/config'

  import { abTools } from '~/agilebpm'
  const { proxy } = abTools.useCurrentInstance()
  import cookie from 'js-cookie'

  function createTokenStorage() {
    let removeFn: (name: string) => void
    let setFn: (name: string, value: string) => void
    switch (storage.toLowerCase()) {
      case 'sessionstorage':
        removeFn = (name: string) => sessionStorage.removeItem(name)
        setFn = (name: string, value: string) =>
          sessionStorage.setItem(name, value)
        break
      case 'cookie':
        removeFn = (name: string) => cookie.remove(name)
        setFn = (name: string, value: string) => cookie.set(name, value)
        break
      case 'localstorage':
      default:
        removeFn = (name: string) => localStorage.removeItem(name)
        setFn = (name: string, value: string) =>
          localStorage.setItem(name, value)
        break
    }
    return { storage, remove: removeFn, setValue: setFn }
  }

  const tokenStorage = createTokenStorage()

  const urlParams = proxy.$route.query

  const redirectUrl = urlParams['redirect'] ?? '/'

  // 清理掉所有token
  ;[tokenTableName, 'refreshToken', 'refreshTime'].forEach((k) => {
    tokenStorage.remove(k)
    if (urlParams[k]) {
      tokenStorage.setValue(k, urlParams[k] as string)
    }
  })

  // 重定向地址
  window.location.href = redirectUrl as string
</script>

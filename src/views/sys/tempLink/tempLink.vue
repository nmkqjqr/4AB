<template><el-empty v-if="showPage" :description="desc" /></template>
<script lang="ts" setup>
  import cookies from 'js-cookie'
  import { onMounted } from 'vue'
  import { abTools, sysApi } from '~/agilebpm'
  import { useUserStore } from '@/store/modules/user'
  import { removeToken } from '@/utils/token'
  import CryptoJS from 'crypto-js'

  //删除cookie
  cookies.remove('Authorization')
  //删除token
  removeToken()

  const { proxy } = abTools.useCurrentInstance()

  const tempCode = proxy.$route.query.code || proxy.$route.params.code

  const desc = ref('如果长时间没有跳转请联系相关人员进行处理！')

  const userStore = useUserStore()
  const showPage = ref(false)

  window.setTimeout(() => {
    showPage.value = true
  }, 5000)

  const setTempToken = (tokenInfo: any) => {
    userStore.setToken(tokenInfo.accessToken)
    userStore.setRefMsg(tokenInfo.refreshToken, tokenInfo.expiration)
  }

  const jumpMobile = (tempLink: any) => {
    const tp = abTools.encrypt(JSON.stringify(tempLink))
    const encData = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(tp))
    window.location.href = `${tempLink.mobileUrl}/tempLink/${tempLink.code}?tp=${encData}`
  }
  const jumpPc = (tempLinkInfo: any) => {
    const path = tempLinkInfo.url
    if (path.startsWith('http')) {
      window.location.replace(path)
    } else {
      if (tempLinkInfo.params) {
        proxy.$router.push({
          path: path,
          query: JSON.parse(tempLinkInfo.params),
        })
      } else {
        proxy.$router.push({
          path: path,
        })
      }
    }
  }

  const loginAndJump = async () => {
    sysApi.tempLink
      .openLink(tempCode)
      .then((result: any) => {
        if (result.isOk && result.data) {
          //先把token放到缓存中
          setTempToken(result.data)
          //判断链接是否支持手机端，当前是否是手机端，如果是手机端就跳转到手机端，要先获取移动端的地址
          if (
            result.data.supportMobile &&
            result.data.supportMobile === 1 &&
            isMobile()
          ) {
            jumpMobile(result.data)
          } else {
            jumpPc(result.data)
          }
        } else {
          desc.value = result.message
        }
      })
      .catch((err) => {
        if (err.message) {
          desc.value = err.message
        }
      })
  }

  const isMobile = () => {
    const flag = navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    )
    return flag
  }

  const jumpFail = (status: any, action: any) => {
    proxy.$router.push({
      path: '/tempLinkResultPage',
      query: {
        status: status,
        action: action,
      },
    })
  }

  onMounted(() => {
    cookies.remove('Authorization')
    localStorage.removeItem('ab-token')
    //登录并跳转
    loginAndJump()
  })
</script>

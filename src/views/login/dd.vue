<template>
  <div style="position: relative"></div>
</template>

<script lang="ts" setup>
  import * as dd from 'dingtalk-jsapi'
  import { registerApi } from '~/agilebpm'
  import { useUserStore } from '@/store/modules/user'
  import { request, orgApi, cmsApi, sysApi, abTools, abUtil } from '~/agilebpm'
  import { useSettingsStore } from '@/store/modules/settings'
  import { ElNotification } from 'element-plus'
  import { getToken } from '@/utils/token'
  import { initDingH5RemoteDebug } from 'dingtalk-h5-remote-debug'
  initDingH5RemoteDebug()
  const settingsStore = useSettingsStore()
  const { updateTheme, loginTheme } = settingsStore

  const getUrlParams = (key: string) => {
    const query = window.location.search.substring(1)
    const vars = query.split('&')
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split('=')
      if (pair[0] == key) return pair[1]
    }
    return ''
  }
  const { proxy } = abTools.useCurrentInstance()
  registerApi.quickLoginInfo().then((result) => {
    if (result.isOk && result.data && result.data?.corpId) {
      const corpId = result.data?.corpId
      dd.ready(function () {
        if (!proxy.$route.query.authCode) {
          dd.runtime.permission
            .requestAuthCode({
              corpId: corpId, // 企业id
            })
            .then((onSuccess: any) => {
              registerApi
                .authToken()
                .then((result: any) => {
                  if (result.isOk) {
                    dealUrl()
                    router.push('/')
                  }
                })
                .catch((err) => {
                  ddLogin(onSuccess.code)
                })
            }),
            (onFail: any) => {
              alert(`err: ${JSON.stringify(onFail)}`)
            }
        }
      })
    }
  })

  const userStore = useUserStore()
  const router = useRouter()

  const dealError = (error: any) => {
    if ('not_find_user_by_openid' == error.code) {
      error.msg += '请先同步钉钉信息到agilebpm账户'
    }

    if (error?.msg) {
      ElMessageBox.alert(error.msg, '错误提示', {
        confirmButtonText: '确定',
        type: 'error',
      })
    }
    proxy.$router.push({ path: '/login' })
  }
  const ddScanLogin = (code: any) => {
    userStore
      .ddScanLogin(code)
      .then((result) => {
        afterLogin()
      })
      .catch((error) => {
        dealError(error)
      })
  }
  const dealUrl = () => {
    if (proxy.$route.query.cardUrl) {
      const url = atob(proxy.$route.query.cardUrl.toString())
      const layout =
        '{"layout":"float","themeName":"blue-white","background":"none","columnStyle":"card","fixedHeader":true,"foldSidebar":false,"menuWidth":"288px","showProgressBar":true,"showTabs":true,"showTabsIcon":true,"showLanguage":true,"showSearch":false,"showRefresh":true,"showTheme":false,"showNotice":true,"showFullScreen":true,"showPageTransition":true,"showLock":false,"tabsBarStyle":"smooth"}'
      localStorage.setItem('theme', layout)
      loginTheme()
      updateTheme()
      window.location.href = url
    }
  }

  const afterLogin = () => {
    if (abUtil.checkIsPublicProject(true)) {
      ElNotification({
        title: '请注意',
        message:
          '演示环境会定时重置数据，且缺失部分高级功能。<br/>如需完整体验请联系<a href="https://www.tongzhouyun.com/contact" target="_blank">客服</a> 。',
        type: 'warning',
        dangerouslyUseHTMLString: true,
        duration: 0,
      })
    }
    // 登录成功后调用
    localStorage.setItem('loginType', 'dd')
    getuserConfig()
    dealUrl()
    router.push('/')
  }

  const ddLogin = (code: any) => {
    //根据code调用钉钉登录接口
    userStore
      .ddAutoLogin(code)
      .then((result) => {
        afterLogin()
      })
      .catch((error) => {
        dealError(error)
      })
  }

  if (proxy.$route.query.authCode) {
    ddScanLogin(proxy.$route.query.authCode)
  }

  const getuserConfig = () => {
    request({
      url: cmsApi.homeComponent.getCmsUserConfig,
      method: 'get',
    }).then(
      ({ data }) => {
        if (data.layout && data.layout.length > 10) {
          localStorage.setItem('theme', data.layout)
          loginTheme()
          updateTheme()
        } else {
          localStorage.removeItem('theme')
        }
      },
      () => {}
    )
  }
</script>
<style lang="scss" scoped></style>

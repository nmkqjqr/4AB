<template>
  <div style="position: relative">
    <div class="login-container ani-scale"></div>
    <div class="login-box ani-main-in">
      <div class="title-tips">
        <span class="title-logo">
          <el-image
            v-if="state.lightLogo && state.lightLogo.length > 0"
            :src="state.lightLogo"
            style="width: 50px; height: 50px"
          />
          <el-image
            v-else
            :src="require('@/assets/login_images/logo-small.png')"
            style="width: 50px; height: 50px"
          />
          <!-- <svg-icon v-else icon="lightLogo" is-custom-svg /> -->
        </span>
        <span class="title-systemName">
          {{ state.systemName }}
        </span>
      </div>
      <el-form
        ref="formRef"
        class="login-form"
        label-position="left"
        :model="form"
        :rules="rules"
      >
        <div id="ww_login"></div>
        <el-form-item prop="userName">
          <el-input
            v-model.trim="form.userName"
            v-focus
            class="inputLoginWhite"
            :disabled="state.loading"
            :placeholder="translate('请输入账户')"
            tabindex="1"
            type="text"
            @keyup.enter.native="handleLogin"
          >
            <template #prefix>
              <vab-icon icon="user-line" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            :key="passwordType"
            ref="passwordRef"
            v-model.trim="form.password"
            class="inputLoginWhite"
            :disabled="state.loading"
            :placeholder="translate('请输入密码')"
            tabindex="2"
            :type="passwordType"
            @keyup.enter.native="handleLogin"
          >
            <template #prefix>
              <vab-icon icon="lock-line" />
            </template>
            <template v-if="passwordType === 'password'" #suffix>
              <vab-icon
                class="show-password"
                icon="eye-off-line"
                @click="handlePassword"
              />
            </template>
            <template v-else #suffix>
              <vab-icon
                class="show-password"
                icon="eye-line"
                @click="handlePassword"
              />
            </template>
          </el-input>
        </el-form-item>
        <!-- 验证码验证逻辑需自行开发，如不需要验证码功能建议注释 -->
        <el-form-item v-if="state.captchaSwitch" prop="captcha">
          <el-input
            v-model.trim="form.captcha"
            :placeholder="translate('验证码') + previewText"
            tabindex="3"
            type="text"
            @keyup.enter.native="handleLogin"
          >
            <template #prefix>
              <vab-icon icon="barcode-box-line" />
            </template>
          </el-input>
          <el-image class="code" :src="state.captcha" @click="changeCode" />
        </el-form-item>

        <el-form-item>
          <el-button
            class="login-btn"
            :loading="loading"
            type="primary"
            @click="handleLogin"
          >
            {{ translate('登录') }}
          </el-button>
        </el-form-item>

        <el-form-item class="el-form-item-display">

          <span  style="float: right ;margin-right:6px">
            <router-link to="/register">
              {{ translate('注册') }}
            </router-link>
          </span>
          <span  v-if="state.getBackPwdSwitch" style="float: right ;margin-right: 20px">
            <router-link to="/forgotPwd" >
              {{ translate('忘记密码') }}
            </router-link>
          </span>
        </el-form-item>

        <el-form-item
          v-if="state.isSupportQywx || state.isSupportDD"
          class="form-item-last"
        >
          <el-divider>
            <span class="other-login-type-text">其他登录方式</span>
          </el-divider>
          <div
            v-if="state.isSupportQywx"
            class="other-login-type-box"
            @click="qywxLogin"
          >
            <el-image
              :src="require('@/assets/login_images/qywechat.jpg')"
              style="width: 34px; height: 34px; cursor: pointer"
            />
          </div>
          <div
            v-if="state.isSupportDD"
            class="other-login-type-box"
            @click="ddLogin"
          >
            <el-image
              :src="require('@/assets/login_images/dd.jpg')"
              style="width: 34px; height: 34px; cursor: pointer"
            />
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import cookies from 'js-cookie'
  import { request, orgApi, cmsApi, sysApi, abTools, abUtil } from '~/agilebpm'
  import { useSettingsStore } from '@/store/modules/settings'
  import { useUserStore } from '@/store/modules/user'
  import { translate } from '@/i18n'
  import { isPassword } from '@/utils/validate'
  import { onBeforeRouteLeave } from 'vue-router'
  import { ElNotification } from 'element-plus'
  import { registerApi } from '~/agilebpm'
  import * as ww from '@wecom/jssdk'
  import Fingerprint2 from 'fingerprintjs2'
  import { removeToken } from '@/utils/token'
  export default defineComponent({
    name: 'Login',
    directives: {
      focus: {
        mounted(el) {
          el.querySelector('input').focus()
        },
      },
    },
    setup() {
      //删除cookie
      removeToken()
      cookies.remove('Authorization')
      const route = useRoute()
      const router = useRouter()
      const { proxy } = abTools.useCurrentInstance()
      const userStore = useUserStore()
      //删除应用编码
      cookies.remove('APPCODE')
      let quickLoginConf = {}
      // res: true
      registerApi.quickLoginInfo().then((result) => {
        if (result.isOk && result.data) {
          quickLoginConf = result.data

          if (result.data?.pcLoginType && 'qywx' == result.data?.pcLoginType) {
            state.isSupportQywx = true
            //获取企微系统配置
            sysApi.configuration.getQywxConf().then((result) => {
              if (result.isOk && result.data) {
                let appId = ''
                if (result.data?.pcLoginType) {
                  appId = result.data?.appId
                }
                ww.register({
                  corpId: appId, // 必填，当前用户企业所属企业ID
                  jsApiList: ['getExternalContact'], // 必填，需要使用的JSAPI列表
                  getConfigSignature, // 必填，根据url生成企业签名的回调函数
                })
              }
            })
          }
          if (result.data?.pcLoginType && 'dingTalk' == result.data?.pcLoginType) {
            state.isSupportDD = true

            /*  try {
              dd.ready(function () {
                //如果是钉钉环境自动登录
                const res = dd.canIUse('getLocation.object.type')
                alert(res)

                ddLogin()
              })
            } catch (err) {
              console.log('--当前非钉钉环境支持扫码登录')
            } */
          }
        }
      })

      async function getConfigSignature(url) {
        // 根据 url 生成企业签名
        // 生成方法参考 https://developer.work.weixin.qq.com/document/path/90539
        return registerApi.qywxGetJsapiSignature()
      }

      //已经扫码确认，获取code，根据code登录
      const code = proxy?.$route.query.code
      if (code) {
        userStore
          .qywxLogin(code)
          .then((result) => {
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
            getuserConfig()
            router.push(handleRoute())
          })
          .catch((error) => {
            changeCode()
            if ('not_find_user_by_openid' === error.code) {
              error.msg += '请到企业微信应用中绑定agilebpm账户'
            }
            if (error?.msg) {
              ElMessageBox.alert(error.msg, '错误提示', {
                confirmButtonText: '确定',
                type: 'error',
              })
            }
            proxy.$router.push({ path: '/login' })
          })
      }

      const settingsStore = useSettingsStore()
      const { updateTheme, loginTheme, defaultTheme } = settingsStore
      const login = (form) => userStore.login(state.form)

      const ddLogin = () => {
        //获取钉钉系统配置

          if (quickLoginConf) {
            let redirect_uri = ''
            let appKey = ''
            if (quickLoginConf?.pc_redirect_uri) {
              redirect_uri = quickLoginConf?.pc_redirect_uri
            }
            if (quickLoginConf?.appKey) {
              appKey = quickLoginConf?.appKey
            }

            const url = `https://login.dingtalk.com/oauth2/auth?redirect_uri=${redirect_uri}&response_type=code&client_id=${appKey}&scope=openid&state=dddd&prompt=consent`

            if (appKey && redirect_uri) {
              window.location.href = url
            } else {
              ElMessageBox.alert('钉钉缺少配置，请到配置页完善', '错误提示', {
                confirmButtonText: '确定',
                type: 'error',
              })
            }
          }

      }
      const qywxLogin = () => {

          if (quickLoginConf) {
            const appId = quickLoginConf?.appId
            const agentid =quickLoginConf?.agentId
            const redirect_uri = encodeURI(quickLoginConf?.pc_redirect_uri)

            const url = `https://login.work.weixin.qq.com/wwlogin/sso/login?login_type=CorpApp&appid=${appId}&agentid=${agentid}&redirect_uri=${redirect_uri}&state=STATE`

            if (appId && agentid && redirect_uri) {
              window.location.href = url
            } else {
              ElMessageBox.alert(
                '企业微信缺少配置，请到配置页完善',
                '错误提示',
                {
                  confirmButtonText: '确定',
                  type: 'error',
                }
              )
            }
          }

      }

      const validateUsername = (rule, value, callback) => {
        if ('' === value) callback(new Error(translate('账户不能为空')))
        else callback()
      }
      const validatePassword = (rule, value, callback) => {
        if ('' === value) callback(new Error(translate('密码不能为空')))
        else callback()
      }
      const validateCaptcha = (rule, value, callback) => {
        if ('' === value) callback(new Error(translate('验证码不能为空')))
        if (value.length !== 4)
          callback(new Error(translate('验证码长度为4位')))
        else callback()
      }

      // TODO 支持多系统应用切换的时候这里修改为 有限获取本地缓存，再取系统配置
      const state = reactive({
        isSupportQywx: false,
        isSupportDD: false,
        formRef: null,
        passwordRef: null,
        form: {
          userName: '',
          password: '',
          captcha: '',
          uniqueCode: '',
          uuid:'',
          signature: '',
          grantType: 'password',
        },
        rules: {
          userName: [
            {
              required: true,
              trigger: 'blur',
              validator: validateUsername,
            },
          ],
          password: [
            {
              required: true,
              trigger: 'blur',
              validator: validatePassword,
            },
          ],
          captcha: [
            {
              required: false,
              trigger: 'change',
              validator: validateCaptcha,
            },
          ],
        },
        loading: false,
        passwordType: 'password',
        redirect: undefined,
        timer: 0,
        previewText: '',
        captchaSwitch: false,
        getBackPwdSwitch: false,
        lightLogo: '',
        systemName: 'AgileBPM',
        otherTypeIcon: '',
      })

      // 设置浏览器唯一标识
      state.form.uniqueCode = localStorage.getItem('user$id')
      Fingerprint2.get((components) => {
        const values = components.map((component) => component.value)
        const signature = Fingerprint2.x64hash128(values.join(''), 31)
        state.form.signature = signature
        // 设置到cookie 中用于 记录审计日志
        cookies.set('signature', signature)
      })
      // 设置浏览器唯一标识 end

      const handleRoute = () => {
        return state.redirect === '/404' || state.redirect === '/403'
          ? '/'
          : state.redirect
      }
      const handlePassword = () => {
        state.passwordType === 'password'
          ? (state.passwordType = '')
          : (state.passwordType = 'password')
        nextTick(() => {
          state['passwordRef'].focus()
        })
      }

      const handleLogin = async () => {
        state['formRef'].validate(async (valid) => {
          if (valid)
            try {
              state.loading = true
              await login(state.form)
                .then(() => {
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
                  getuserConfig()
                  // getCompanyConf()
                  router.push(handleRoute())
                })
                .catch((error) => {
                  changeCode()
                  //如果开启了初始化密码登录失败挑战到修改密码页面
                  if (error.code === 'password_needs_to_be_changed') {
                    return router.push({
                      name: 'ResetPwd',
                      query: { account: state.form.userName },
                    })
                  }
                  if (error?.msg) {
                    ElMessageBox.alert(error.msg, '错误提示', {
                      confirmButtonText: '确定',
                      type: 'error',
                    })
                  }
                })
            } finally {
              state.loading = false
            }
        })
      }

      const getuserConfig = () => {
        request({
          url: cmsApi.homeComponent.getCmsUserConfig,
          method: 'get',
        }).then(
          ({ data }) => {
            const theme = localStorage.getItem('theme')
              ? JSON.parse(localStorage.getItem('theme'))
              : { ...defaultTheme() }
            if (data.layout && data.layout.length > 0) {
              if (theme) {
                theme.layout = data.layout
              }
            }
            if (data.themeName && data.themeName.length > 0) {
              if (theme) {
                theme.themeName = data.themeName
              }
            }
            localStorage.setItem('theme', JSON.stringify(theme))
            loginTheme()
            updateTheme()
          },
          () => {}
        )
      }

      // 获取资源个性化配置
      const getCompanyConfig = () => {
        request({
          url: sysApi.configuration.getCompanyConfig,
          method: 'get',
        }).then(
          ({ data }) => {
            if (data && data.length > 0) {
              const dataInfo = JSON.parse(data)
              if (JSON.parse(dataInfo.whiteLogo)[0]) {
                state.lightLogo = sysApi.sysFile.getViewFileUrl(
                  JSON.parse(dataInfo.whiteLogo)[0].id
                )
              }
              if (dataInfo.systemName && dataInfo.systemName.length > 0) {
                state.systemName = dataInfo.systemName
              }
            }
          },
          () => {}
        )
      }
      getCompanyConfig()
      const changeCode = () => {
        if (!state.captchaSwitch) return
        state.form.uuid = abUtil.uuid()
        orgApi.user.getCode(state.form.uuid).then((data) => {
          const blob = new Blob([data]) // 返回的文件流数据
          const url = window.URL.createObjectURL(blob) // 将他转化为路径
          state.captcha = url
        })
      }

      const getCaptchaSwitch = () => {
        orgApi.user.queryCaptchaSwitch().then((result) => {
          if (result.data.length > 1) {
            state.captchaSwitch = result.data[0]
            state.getBackPwdSwitch = result.data[1]
            changeCode()
          }
        })
      }

      //监听页面回车事件
      // document.onkeydown = (e) => {
      //   if (e.code === 'Enter') {
      //     handleLogin()
      //   }
      // }

      onBeforeMount(() => {
        state.form.userName = 'admin'
        state.form.password = '1'
        getCaptchaSwitch()
        // 为了演示效果，会在官网演示页自动登录到首页，正式开发可删除
        if (
          document.domain === 'vue-admin-beautiful.com' ||
          document.domain === 'chu1204505056.gitee.io'
        ) {
          state.previewText = '（演示地址验证码可不填）'
          state.timer = setTimeout(() => {
            handleLogin()
          }, 5000)
        }
      })

      watchEffect(() => {
        state.redirect = (route.query && route.query.redirect) || '/'
      })

      onBeforeRouteLeave((to, from, next) => {
        clearInterval(state.timer)
        next()
      })

      return {
        translate: translate,
        ...toRefs(state),
        title: settingsStore.getTitle,
        handlePassword,
        handleLogin,
        changeCode,
        qywxLogin,
        ddLogin,
        state,
      }
    },
  })
</script>
<style></style>
<style lang="scss" scoped>
  .self-defined-classname {
    width: 300px;
    height: 300px;
  }
  :deep(.inputLoginWhite .el-input__inner) {
    -webkit-box-shadow: 0 0 0 1000px #fff inset;
  }
  @-webkit-keyframes ani-scale {
    0% {
      -webkit-transform: scale(1.05); /* opacity: 0;*/
    }
    /*10% { opacity: 1;}*/
    100% {
      -webkit-transform: scale(1);
    }
  }
  @-moz-keyframes ani-scale {
    0% {
      -moz-transform: scale(1.05); /*opacity: 0;*/
    }
    /*10% { opacity: 1;}*/
    100% {
      -moz-transform: scale(1);
    }
  }
  @keyframes ani-scale {
    0% {
      transform: scale(1.05); /*opacity: 0;*/
    }
    /*10% { opacity: 1;}*/
    100% {
      transform: scale(1);
    }
  }
  .ani-scale {
    -webkit-animation-name: ani-scale;
    -moz-animation-name: ani-scale;
    animation-name: ani-scale;
    -webkit-animation-duration: 4000ms;
    -moz-animation-duration: 4000ms;
    animation-duration: 4000ms;
    -webkit-animation-timing-function: linear;
    -moz-animation-timing-function: linear;
    animation-timing-function: linear;
    -webkit-animation-fill-mode: both;
    -moz-animation-fill-mode: both;
    animation-fill-mode: both;
  }

  .ani-main-in {
    -webkit-animation-name: ani-main-in;
    -moz-animation-name: ani-main-in;
    animation-name: ani-main-in;
    -webkit-animation-duration: 3000ms;
    -moz-animation-duration: 3000ms;
    animation-duration: 800ms;
    -webkit-animation-timing-function: linear;
    -moz-animation-timing-function: linear;
    animation-timing-function: linear;
    -webkit-animation-fill-mode: both;
    -moz-animation-fill-mode: both;
    animation-fill-mode: both;
  }
  @-webkit-keyframes ani-main-in {
    0% {
      opacity: 0;
      -webkit-transform: scale(0.9);
    }
    100% {
      opacity: 1;
      -webkit-transform: scale(1);
    }
  }
  @-moz-keyframes ani-main-in {
    0% {
      opacity: 0;
      -moz-transform: scale(0.9);
    }
    100% {
      opacity: 1;
      -moz-transform: scale(1);
    }
  }
  @keyframes ani-main-in {
    0% {
      opacity: 0;
      transform: scale(0.9);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  .login-container {
    height: 100vh;
    background: url('~@/assets/login_images/bg-login-social3.jpg') center center
      fixed no-repeat;
    background-size: 100% 100%;
  }
  .login-box {
    position: absolute;
    top: 50%;
    left: 50%;

    width: 400px;
    margin-top: -160px;
    margin-left: -200px;
    .title-tips {
      position: absolute;
      top: -110px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      font-size: 30px;
      font-weight: 400;
      color: #fff;
      text-align: center;
      .title-logo {
        top: 10px;
        margin-right: 10px;
      }
    }
  }

  .login-form {
    position: relative;
    max-width: 100%;
    padding: 2vh 2vh 0 2vh;
    overflow: hidden;
    background: #fff;
    background-size: 100% 100%;
    border-radius: 10px;

    .title {
      font-size: 54px;
      font-weight: 500;
      color: var(--el-color-white);
    }

    .login-btn {
      display: inherit;
      width: 100%;
      height: 50px;
      background: var(--el-color-primary);
      border: 0;
      border-radius: 5px;
      &:hover {
        opacity: 0.9;
      }
    }
    .form-item-last {
      margin-bottom: 10px !important;
    }
    .other-login-type-text {
      font-weight: 700;
      color: #000;
      letter-spacing: 0.5px;
    }
    .other-login-type-box {
      width: 100%;
      text-align: center;
    }
    .tips {
      margin-bottom: 10px;
      font-size: $base-font-size-default;
      color: var(--el-color-white);

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .title-container {
      position: relative;

      .title {
        margin: 0 auto 40px auto;
        font-size: 34px;
        font-weight: bold;
        color: var(--el-color-primary);
        text-align: center;
      }
    }

    i {
      position: absolute;
      top: 8px;
      left: 15px;
      font-size: 16px;
    }

    .show-password {
      float: right;
      width: 32px;
      height: 32px;
      font-size: 16px;
    }

    :deep() {
      .el-form-item {
        padding-right: 0;
        margin: 0 0 30px 0;
        color: #454545;
        background: transparent;
        border: 1px solid transparent;
        border-radius: 2px;

        &__content {
          min-height: $base-input-height;
          line-height: $base-input-height;
        }

        &__error {
          position: absolute;
          top: 100%;
          left: 18px;
          font-size: $base-font-size-small;
          line-height: 18px;
          color: var(--el-color-error);
        }
        .el-input__wrapper {
          border-radius: 5px;
        }
      }
      .el-form-item-display{
        .el-form-item__content{
          display:block;
        }
      }
      .el-input {
        box-sizing: border-box;

        input {
          height: 48px;
          padding-left: 30px;
          line-height: 48px;
          background: #fff;
          border: 0;
        }

        &__suffix-inner {
          position: absolute;
          right: 65px;
          cursor: pointer;
        }
      }

      .code {
        position: absolute;
        top: 4px;
        right: 4px;
        cursor: pointer;
        border-radius: $base-border-radius;
      }
    }
  }
</style>

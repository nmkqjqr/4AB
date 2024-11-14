<template>
  <div class="register-container">
    <div class="login-container ani-scale"></div>
    <div class="login-box ani-main-in">
      <div class="title-tips">
        <span class="title-logo" style="float: left">
          <el-image
            v-if="lightLogo && lightLogo.length > 0"
            :src="lightLogo"
            style="width: 50px; height: 50px"
          />
          <el-image
            v-else
            :src="require('@/assets/login_images/logo-small.png')"
            style="width: 50px; height: 50px"
          />
        </span>
        <span class="title-systemName" style="float: left; margin-left: 6px">
          欢迎注册
        </span>
      </div>
      <el-form
        ref="registerFormRef"
        class="register-form"
        :model="form"
        :rules="registerRules"
      >
        <el-form-item prop="name">
          <el-input
            v-model.trim="form.name"
            maxlength="64"
            :placeholder="translateTitle('请输入用户名')"
            show-word-limit
            type="text"
          >
            <template #prefix>
              <vab-icon icon="user-line" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="phone">
          <el-input
            v-model.trim="form.phone"
            maxlength="11"
            :placeholder="translateTitle('请输入手机号')"
            show-word-limit
            type="text"
          >
            <template #prefix>
              <vab-icon icon="smartphone-line" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="phoneCode" style="position: relative">
          <el-input
            v-model.trim="form.phoneCode"
            :placeholder="translateTitle('请输入手机验证码')"
            type="text"
          >
            <template #prefix>
              <vab-icon icon="barcode-box-line" />
            </template>
          </el-input>
          <el-button
            class="phone-code"
            :disabled="isGetPhone"
            type="primary"
            @click="getPhoneCode"
          >
            {{ phoneCode }}
          </el-button>
        </el-form-item>
        <el-form-item prop="email">
          <el-input
            v-model.trim="form.email"
            maxlength="100"
            :placeholder="translateTitle('请输入邮箱')"
            type="text"
          >
            <template #prefix>
              <vab-icon icon="message-2-line" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model.trim="form.password"
            autocomplete="new-password"
            :placeholder="translateTitle('请输入密码')"
            type="password"
          >
            <template #prefix>
              <vab-icon icon="lock-line" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            class="register-btn"
            type="primary"
            :disabled="registerBtnDisabled"
            @click.prevent="handleRegister"
          >
            {{ translateTitle('注册') }}
          </el-button>
        </el-form-item>
        <el-form-item>
          <span style="color: #999">已有账号？</span>
          <router-link to="/login">
            {{ translateTitle('请登录') }}
          </router-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import { translate } from '@/i18n'
  import { isPhone, isEmail } from '@/utils/validate'
  import {
    registerApi,
    request,
    postData,
    sysApi,
    abTools,
    orgApi,
  } from '~/agilebpm'
  import { useUserStore } from '@/store/modules/user'
  import { ElMessageBox, ElMessage } from 'element-plus'

  export default defineComponent({
    name: 'Register',
    directives: {
      focus: {
        inserted(el) {
          el.querySelector('input').focus()
        },
      },
    },
    setup() {
      const $baseConfirm = inject('$baseConfirm')

      const router = useRouter()

      const userStore = useUserStore()
      const { setToken } = userStore

      const validateUsername = (rule, value, callback) => {
        if ('' === value) {
          callback(new Error(translate('用户名不能为空')))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (!checkPassword(value)) {
          callback(new Error(translate(state.passwordRegMsg)))
        } else {
          callback()
        }
      }
      const validatePhone = (rule, value, callback) => {
        if (!isPhone(value)) {
          callback(new Error(translate('请输入正确的手机号')))
        } else {
          callback()
        }
      }
      const validateEmail = (rule, value, callback) => {
        if (!isEmail(value)) {
          callback(new Error(translate('请输入正确的邮箱')))
        } else {
          callback()
        }
      }

      const state = reactive({
        registerFormRef: null,
        isGetPhone: false,
        timer: null,
        phoneCode: translate('获取验证码'),
        showRegister: false,
        registerBtnDisabled: false,
        passwordReg: '^[A-Za-z0-9_!@#$%&*]{6,20}$',
        passwordRegMsg: '密码长度在6-20位之间由数字、字母组合',
        form: {},
        registerRules: {
          name: [
            {
              required: true,
              trigger: 'blur',
              message: translate('请输入用户名'),
            },
            { validator: validateUsername, trigger: 'blur' },
          ],
          phone: [
            {
              required: true,
              trigger: 'blur',
              message: translate('请输入手机号'),
            },
            { validator: validatePhone, trigger: 'blur' },
          ],
          email: [
            {
              required: true,
              trigger: 'blur',
              message: translate('请输入邮箱'),
            },
            {
              validator: validateEmail,
              trigger: 'blur',
            },
          ],
          password: [
            {
              required: true,
              trigger: 'blur',
              message: translate('请输入密码'),
            },
            { validator: validatePassword, trigger: 'blur' },
          ],
          phoneCode: [
            {
              required: true,
              trigger: 'blur',
              message: translate('请输入手机验证码'),
            },
          ],
        },
        loading: false,
        passwordType: 'password',
        lightLogo: '',
      })

      const getPhoneCode = () => {
        if (!isPhone(state.form.phone)) {
          state['registerFormRef'].validateField('phone')
          return
        }
        registerApi.getPhoneVerifyCode(state.form.phone).then((res) => {
          if (res.isOk) {
            ElMessage({
              message: translate('验证码发送成功'),
              type: 'success',
            })
          }
        })
        state.isGetPhone = true
        let n = 60
        state.timer = setInterval(() => {
          if (n > 0) {
            n--
            state.phoneCode = `${translate('获取验证码 ') + n}s`
          } else {
            clearInterval(state.timer)
            state.phoneCode = translate('获取验证码')
            state.timer = null
            state.isGetPhone = false
          }
        }, 1000)
      }

      const handleRegister = () => {
        state.registerBtnDisabled = true
        state['registerFormRef'].validate(async (valid) => {
          if (valid) {
            state.form.password = abTools.encrypt(state.form.password)
            const res = await registerApi.register(state.form)
            if (res.isOk) {
              ElMessageBox.confirm(
                '用户已注册，正在审批中，请使用邮箱或者短信查看审批结果',
                '注册成功',
                {
                  confirmButtonText: '确定',
                  type: 'success',
                }
              ).then(() => {
                router.push('/login')
              })
            } else {
              state.registerBtnDisabled = false
            }
          } else {
            state.registerBtnDisabled = false
          }
        })
      }

      const checkPassword = (password) => {
        const reg = new RegExp(state.passwordReg)
        return reg.test(password)
      }

      postData(orgApi.user.getPwdCheckRule).then((res) => {
        if (res && res.data) {
          for (const key in res.data) {
            if (res.data.hasOwnProperty(key)) {
              // 避免遍历原型链上的属性
              state.passwordReg = key
              state.passwordRegMsg = res.data[key]
            }
          }
        }
      })

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
            }
          },
          () => {}
        )
      }
      getCompanyConfig()

      onBeforeRouteLeave((to, from, next) => {
        clearInterval(state.timer)
        next()
      })

      return {
        translateTitle: translate,
        ...toRefs(state),
        getPhoneCode,
        handleRegister,
        getCompanyConfig,
      }
    },
  })
</script>

<style lang="scss" scoped>
  .register-container {
    height: 100vh;
    background: url('~@/assets/login_images/bg-login-social3.jpg') center center
      fixed no-repeat;
    background-size: cover;

    .title-tips {
      position: absolute;
      top: 22%;
      left: 50%;
      margin-left: -106px;
      overflow: hidden;
      font-size: 28px;
      font-weight: 400;
      line-height: 54px;
      color: #fff;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .register-form {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 400px;
      padding: 2vh 2vh 0 2vh;
      margin: calc((100vh - 555px) / 2) 5vw 5vw;
      margin-top: -190px;
      margin-left: -200px;
      overflow: hidden;
      background: #fff;
      border-radius: 10px;

      .register-btn {
        display: inherit;
        width: 100%;
        height: 50px;
        margin-top: 5px;
        background: var(--el-color-primary);
        border: 0;
        border-radius: 5px;
        &:hover {
          opacity: 0.9;
        }
      }

      .phone-code {
        position: absolute;
        top: 8px;
        right: 10px;
        width: 120px;
        height: 32px;
        font-size: 14px;
        color: #fff;
        cursor: pointer;
        user-select: none;
        border-radius: 5px;
      }
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

    :deep() {
      .el-form-item {
        padding-right: 0;
        margin: 20px 0;
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

      .el-input {
        box-sizing: border-box;

        input {
          height: 48px;
          line-height: 48px;
          border: 0;
        }

        &__suffix-inner {
          position: absolute;
          right: 15px;
          cursor: pointer;

          .el-input__count {
            position: absolute;
            top: 25px;
            right: 0px;
          }
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

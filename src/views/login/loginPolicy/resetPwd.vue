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
        </span>
        <span class="title-systemName">
          {{ state.systemName }}
        </span>
      </div>

      <el-form
        ref="formRef"
        :model="state.form"
        :rules="rules"
        class="resetPwd-form"
        label-position="left"
      >
        <ab-form-item :span="24" :label-width="0">
          <p
            style="
              margin: 0;
              width: 100%;
              font-weight: 700;
              font-size: 20px;
              color: #000000;
              text-align: center;
            "
          >
            请修改密码后再登录
          </p>
        </ab-form-item>
        <br />

        <el-form-item prop="account">
          <el-input
            v-model.trim="state.form.account"
            :placeholder="translate('请输入账户')"
            tabindex="1"
            type="text"
          >
            <template #prefix>
              <vab-icon icon="user-line" />
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="currentPassword">
          <el-input
            v-model.trim="state.form.currentPassword"
            :placeholder="translate('请输入原密码')"
            tabindex="2"
            type="password"
          >
            <template #prefix>
              <vab-icon icon="lock-line" />
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="newPassword">
          <el-input
            :key="state.newPasswordType"
            ref="newPasswordRef"
            v-model.trim="state.form.newPassword"
            :placeholder="translate('请输入新密码')"
            :type="state.newPasswordType"
            tabindex="2"
          >
            <template #prefix>
              <vab-icon icon="lock-line" />
            </template>
            <template v-if="state.newPasswordType === 'password'" #suffix>
              <vab-icon
                class="show-password"
                icon="eye-off-line"
                @click="handleNewPassword"
              />
            </template>
            <template v-else #suffix>
              <vab-icon
                class="show-password"
                icon="eye-line"
                @click="handleNewPassword"
              />
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="confirmPassword">
          <el-input
            :key="state.confirmPasswordType"
            ref="confirmPasswordRef"
            v-model.trim="state.form.confirmPassword"
            :placeholder="translate('请再次确认密码')"
            :type="state.confirmPasswordType"
            tabindex="2"
          >
            <template #prefix>
              <vab-icon icon="check-line" />
            </template>
            <template v-if="state.confirmPasswordType === 'password'" #suffix>
              <vab-icon
                class="show-password"
                icon="eye-off-line"
                @click="handleConfirmPassword"
              />
            </template>
            <template v-else #suffix>
              <vab-icon
                class="show-password"
                icon="eye-line"
                @click="handleConfirmPassword"
              />
            </template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button class="login-btn" type="primary" @click="handleSubmit">
            {{ translate('修改密码') }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import { translate } from '@/i18n'
  import { abTools, orgApi, postData, request, sysApi } from '~/agilebpm'
  import type { FormRules } from 'element-plus'
  import { ElMessage } from 'element-plus'

  const router = useRouter()
  //引入 当前实例
  const { proxy } = abTools.useCurrentInstance()
  const formRef = ref()

  const state = reactive({
    newPasswordType: 'password',
    confirmPasswordType: 'password',
    lightLogo: '',
    systemName: 'AgileBPM',
    form: {
      account: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    data: {
      ruleKey: '^[A-Za-z0-9_!@#$%&*]{6,20}$',
      ruleTxt: '密码长度在6-20位之间由数字、字母组合',
    },
  })

  onMounted(() => {
    state.form.account = proxy.$route.query.account
      ? proxy.$route.query.account.toString()
      : ''

    /*密码校验规则*/
    postData(orgApi.user.getPwdCheckRule).then((response) => {
      if (response && response.data) {
        for (const key in response.data) {
          if (response.data.hasOwnProperty(key)) {
            // 避免遍历原型链上的属性
            state.data.ruleKey = key
            state.data.ruleTxt = response.data[key]
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
            if (dataInfo.systemName && dataInfo.systemName.length > 0) {
              state.systemName = dataInfo.systemName
            }
          }
        },
        () => {}
      )
    }
    getCompanyConfig()
  })

  const validateAccount = (rule: any, value: string, callback: any) => {
    if ('' === value) callback(new Error(translate('用户名不能为空')))
    else callback()
  }

  const validatePassword = (rule: any, value: string, callback: any) => {
    const myregex = new RegExp(state.data.ruleKey)
    if (!value) callback()
    if (!myregex.test(value)) {
      callback(new Error(translate(state.data.ruleTxt)))
    } else callback()
  }

  const rules = reactive<FormRules>({
    account: [
      { required: true, message: '必填', trigger: 'blur' },
      { required: true, message: '必填', trigger: 'change' },
      { validator: validateAccount, trigger: 'blur' },
      { validator: validateAccount, trigger: 'change' },
    ],
    newPassword: [
      { required: true, message: '必填', trigger: 'blur' },
      { required: true, message: '必填', trigger: 'change' },
      { validator: validatePassword, trigger: 'blur' },
      { validator: validatePassword, trigger: 'change' },
    ],
    currentPassword: [
      { required: true, message: '必填', trigger: 'blur' },
      { required: true, message: '必填', trigger: 'change' },
    ],
    confirmPassword: [
      { required: true, message: '必填', trigger: 'blur' },
      { required: true, message: '必填', trigger: 'change' },
      { validator: validatePassword, trigger: 'blur' },
      { validator: validatePassword, trigger: 'change' },
    ],
  })

  const handleNewPassword = () => {
    state.newPasswordType === 'password'
      ? (state.newPasswordType = '')
      : (state.newPasswordType = 'password')
  }

  const handleConfirmPassword = () => {
    state.confirmPasswordType === 'password'
      ? (state.confirmPasswordType = '')
      : (state.confirmPasswordType = 'password')
  }

  /*提交方法*/
  const handleSubmit = () => {
    if (state.form.account === '') {
      ElMessage.error('账号不能为空!')
      return
    }
    if (state.form.newPassword === '') {
      ElMessage.error('新密码不能为空!')
      return
    }
    if (state.form.currentPassword === '') {
      ElMessage.error('原密码不能为空!')
      return
    }
    if (state.form.confirmPassword === '') {
      ElMessage.error('确认密码不能为空!')
      return
    }
    const SubmitValues = {
      account: state.form.account,
      password: abTools.encrypt(state.form.newPassword),
      currentPassword: abTools.encrypt(state.form.currentPassword),
      confirmPassword: abTools.encrypt(state.form.confirmPassword),
    }
    if (SubmitValues.password !== SubmitValues.confirmPassword) {
      ElMessage.error('新密码和确认密码不相同!')
      return
    }
    postData(orgApi.user.resetUserPassWorldUrl, SubmitValues).then((result) => {
      if (!result.isOk) {
        ElMessage.error(result.msg)
      } else {
        ElMessage.success(result.msg)
        proxy.$router.replace({ path: '/index' })
      }
    })
  }
</script>

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
    top: 40%;
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

  .resetPwd-form {
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
    }
  }
</style>

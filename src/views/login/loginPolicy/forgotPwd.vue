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
          找回密码
        </span>
      </div>
      <el-form
        ref="formRef"
        :model="state.form"
        :rules="rules"
        class="forgotPwd-form"
        label-position="left"
      >
        <el-form-item prop="account">
          <el-input
            v-model.trim="state.form.account"
            :placeholder="translate('请输入账户')"
            tabindex="1"
            type="text"
          >
            <template #prefix>
              <vab-icon icon="user-line"/>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="road">
          <el-input
            v-model.trim="state.form.road"
            :placeholder="translate(state.form.type === 'email'? '请输入邮箱' : '请输入手机号')"
            tabindex="1"
            type="text"
          >
            <template #prefix>
              <vab-icon v-if="state.form.type === 'email'" icon="mail-line"/>
              <vab-icon v-if="state.form.type === 'mobile'" icon="smartphone-line"/>
            </template>
            <template #append>
              <el-select
                v-model="state.form.type"
                placeholder="手机号"
                class="displayNoneVali"
                style="width: 100px;" >
                <el-option label="手机找回" value="mobile" />
                <el-option label="邮箱找回" value="email" />
              </el-select>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="captcha">
          <el-input
            v-model.trim="state.form.captcha"
            :placeholder="translate('请输入验证码')"
            tabindex="3"
            type="text"
          >
            <template #prefix>
              <vab-icon icon="barcode-box-line"/>
            </template>
          </el-input>

          <el-button
            class="phone-code"
            :disabled="state.isGetPhone"
            type="primary"
            @click="handleGetCaptcha"
          >
            {{ state.phoneCode }}
          </el-button>
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
              <vab-icon icon="lock-line"/>
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
              <vab-icon icon="check-line"/>
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
          <el-button
            :loading="state.loading"
            class="login-btn"
            type="primary"
            @click="handleSubmit"
          >
            {{ translate('提交') }}
          </el-button>
        </el-form-item>

        <el-form-item>
          <span style="color: #999">已有账号？</span>
          <router-link to="/login">
            {{ translate('去登录') }}
          </router-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {reactive, ref} from 'vue'
import {translate} from '@/i18n'
import {abTools, orgApi, postData, request, sysApi} from '~/agilebpm'
import type {FormRules} from 'element-plus'
import  {ElMessage } from 'element-plus'
import {isPhone, isEmail} from '@/utils/validate'

const router = useRouter()
//引入 当前实例
const {proxy} = abTools.useCurrentInstance()
const formRef = ref()

const state = reactive({
  timer: null,
  isGetPhone: false,
  phoneCode: translate('获取验证码'),
  loading:false,
  newPasswordType: 'password',
  confirmPasswordType: 'password',
  lightLogo: '',
  systemName: 'AgileBPM',
  form: {
    account: '',
    road: '',
    captcha: '',
    newPassword: '',
    confirmPassword: '',
    type: "mobile",
  },
  data: {
    ruleKey: '^[A-Za-z0-9_!@#$%&*]{6,20}$',
    ruleTxt: '密码长度在6-20位之间由数字、字母组合',
  },
})


onMounted(() => {
  /*密码校验规则*/
  postData(orgApi.user.getPwdCheckRule).then((response) => {
    if (response && response.data) {
      for (const key in response.data) {
        if (response.data.hasOwnProperty(key)) { // 避免遍历原型链上的属性
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
      ({data}) => {
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
      () => {
      }
    )
  }
  getCompanyConfig()
})

const validateAccount = (rule: any, value: string, callback: any) => {
  if ('' === value) callback(new Error(translate('账号不能为空')))
  else callback()
}

const validateRoad = (rule: any, value: string, callback: any) => {
  if (state.form.type === 'email'){
    if ('' === value) callback(new Error(translate('邮箱不能为空')))
    if (!isEmail(value)) callback(new Error(translate('请输入正确的邮箱')))
    else callback()
  }else {
    if ('' === value) callback(new Error(translate('手机号不能为空')))
    if (!isPhone(value)) callback(new Error(translate('请输入正确的手机号')))
    else callback()
  }
}

const validatePassword = (rule: any, value: string, callback: any) => {
  if ('' === value) {
    callback(new Error(translate('必填')))
  }
  const myregex = new RegExp(state.data.ruleKey)
  if (!value) callback()
  if (!myregex.test(value)) {
    callback(new Error(translate(state.data.ruleTxt)))
  } else callback()
}
const validateCaptcha = (rule: any, value: string, callback: any) => {
  if ('' === value ) {
    if (state.isGetPhone){
      callback(new Error(translate('验证码已发送至您的手机，1分钟内有效')))
    }else{
      callback(new Error(translate('验证码不能为空')))
    }
  }
  if (value.length === 6) {
    callback()
  } else {
    callback(new Error(translate('验证码长度为6位')))
  }
}

const rules = reactive<FormRules>({
  account: [
    {validator: validateAccount, trigger: 'blur'},
    {validator: validateAccount, trigger: 'change'}
  ],
  road: [
    {validator: validateRoad, trigger: 'blur'},
    {validator: validateRoad, trigger: 'change'}
  ],
  captcha: [
    {validator: validateCaptcha, trigger: 'blur'},
    {validator: validateCaptcha, trigger: 'change'}
  ],
  newPassword: [
    {validator: validatePassword, trigger: 'blur'},
    {validator: validatePassword, trigger: 'change'}
  ],
  confirmPassword: [
    {validator: validatePassword, trigger: 'blur'},
    {validator: validatePassword, trigger: 'change'}
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
  if (state.form.captcha === '') {
    ElMessage.error('验证码不能为空!')
    return
  }
  if (state.form.newPassword === '') {
    ElMessage.error('新密码不能为空!')
    return
  }
  if (state.form.confirmPassword === '') {
    ElMessage.error('确认密码不能为空!')
    return
  }
  const SubmitValues = {
    account: state.form.account,
    newPassword: abTools.encrypt(state.form.newPassword),
    captcha: state.form.captcha,
    confirmPassword: abTools.encrypt(state.form.confirmPassword),
  }
  if (SubmitValues.newPassword !== SubmitValues.confirmPassword) {
    ElMessage.error('新密码和确认密码不相同!')
    return
  }
  state.loading = true
  postData(orgApi.user.forgotPassword, SubmitValues).then((result) => {
    if (!result.isOk) {
      ElMessage.error(result.msg)
    } else {
      state.loading = false
      ElMessage.success("已成功找回密码，请重新登陆！")
      proxy.$router.push({path: '/login'})

    }
  })
}

/**
 * @description 获取验证码
 * */
const handleGetCaptcha = () => {
  if (state.form.account === '') {
    ElMessage.error('账号不能为空!')
    return
  }
  if (state.form.road === '') {
    ElMessage.error(state.form.type === 'email' ? '邮箱不能为空!' : '手机号不能为空!')
    return
  }
  const GetCaptchaValues = {
    account: state.form.account,
    road: state.form.road,
    type: state.form.type,
  }
  postData(orgApi.user.sendCaptcha, GetCaptchaValues).then(
    (result) => {
      if (!result.isOk) {
        ElMessage.error(result.msg)
      } else {
        ElMessage.success('验证码已发送成功')
        state.isGetPhone = true
        let n = 60
        state.timer = setInterval(() => {
          if (n > 0) {
            n--
            state.phoneCode =  n+'s后'+ `${translate('重新获取')}`
          } else {
            clearInterval(state.timer)
            state.phoneCode = translate('获取验证码')
            state.timer = null
            state.isGetPhone = false
          }
        }, 1000)
      }
    }
  )

}


</script>
<style lang="scss">
.input-with-select .el-input-group__prepend {
  background-color: #1890ff;
}
.el-input-group--append{
  .el-input-group__append{
    .el-select .el-select__wrapper {
      border-bottom-left-radius: 0;
      border-top-left-radius: 0;
      box-shadow:
          0 1px 0 0 #00000000 inset,
          0 -1px 0 0 #00000000 inset,

  }
}
}

.el-input-group--append>.el-input__wrapper{
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
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

.displayNoneVali{
  .el-select__wrapper{
    .el-select__suffix{
      .el-input__icon{
        display: none !important;
      }
    }
  }
}
</style>
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
  background: url('~@/assets/login_images/bg-login-social3.jpg') center center fixed no-repeat;
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

.forgotPwd-form {
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

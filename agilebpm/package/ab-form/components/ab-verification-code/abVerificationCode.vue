<template>
  <div
    v-if="permission !== 'n'"
    :class="formField.validateError ? 'ab-is-error' : ''"
  >
    <el-tooltip v-bind="validateTips">
      <el-input
        v-model="phoneCode"
        :disabled="disabled || permission == 'r'"
        :placeholder="$abT('abform.verificationCode.enterCode', '请输入验证码')"
        :prefix-icon="EditPen"
        @blur="addField2Form"
      >
        <template #append>
          <el-button
            v-bind="$attrs"
            class="code-btn"
            :disabled="disabled || !show || permission == 'r'"
            :loading="loading"
            @click.prevent="getCode()"
          >
            <span v-show="show">
              {{
                clickCount > 0
                  ? $abT('abform.verificationCode.retrieveAgain', '重新获取')
                  : $abT('abform.verificationCode.obtain', '获取验证码')
              }}
            </span>
            <span v-show="!show">{{ count }} s</span>
          </el-button>
        </template>
      </el-input>
    </el-tooltip>
  </div>
</template>

<script lang="ts" setup>
  import { EditPen } from '@element-plus/icons-vue'
  import { abTools, registerApi } from '~/agilebpm'
  import useAbStoreAdapter from '~/agilebpm/api/ab-store'
  import { abT } from '~/src/i18n'
  import * as AbformValidate from '../form-base/ab-form-field-validate'
  //表单校验管理对象
  const abFormMananger = inject('abForm') as AbFormProvide
  const props = defineProps({
    // 邮箱：0    电话：1
    sendType: {
      type: Number,
      required: true,
    },
    //映射对象（用来读取发送信息字段绑定的值使用）
    objectMapping: {
      type: Object as any,
      default: null,
    },
    //发送信息的字段code 跟objectMapping配合使用才能获取绑定值
    sendSmsColumn: {
      type: String,
      default: '',
    },
    // 描述字段，用于校验时提示拼接所在的字段名字
    desc: {
      type: String,
      required: true,
    },
    columnCode: {
      type: String,
      default: '',
    },
    //是否禁用: true/false  默认false
    disabled: {
      type: Boolean,
    },
    /**
     * 业务表编码
     */
    tableCode: {
      type: String,
      default: '',
    },
    permission: {
      type: String,
      default: 'w',
    },
  })

  const phoneCode = ref()
  const show = ref(true)
  const count = ref(60)
  const timer = ref()
  const loading = ref(false)
  //发送的次验证次数
  let clickCount = 0
  //后端返回的最新加密后的验证码
  let verification: string

  const validateTips = computed(() => {
    return AbformValidate.getValidateTips(formField)
  })

  const checkVerification = () => {
    if (!phoneCode.value) {
      return false
    }
    // const userId = useAbStoreAdapter()?.getAbUser?.userId
    // //必须有文件id和token才能下载
    // if (!userId || !verification) {
    //   return false
    // }
    return verification == phoneCode.value
  }

  const getMsg = () => {
    // const userId = useAbStoreAdapter()?.getAbUser?.userId
    if (!phoneCode.value) {
      return abT('abform.verificationCode.enterCode', '请输入验证码')
    }
    // //必须有文件id和token才能下载
    // if (!verification || !userId) {
    //   return '请先发送验证码！'
    // }

    //由于后端的加密中key的长度有要求，因此前端按照16的长度标准加密
    if (verification != phoneCode.value) {
      return abT('abform.verificationCode.error', '验证码错误！')
    }
    return ''
  }

  //inputField相关的引用，用于表单abForm
  const formField: AbInputField = reactive({
    rules: [
      {
        validator: checkVerification,
        trigger: 'blur',
        message: getMsg,
      },
      { message: '', required: true },
    ],
    name: props.desc,
    modelValue: phoneCode.value,
    validateError: '',
    columnCode: props.columnCode,
    tableCode: props.tableCode,
  })

  // 获取短信验证码
  const getCode = () => {
    loading.value = true
    //如果校验不通过，则不执行发送逻辑
    if (!check()) {
      loading.value = false
      return
    }
    //axios请求
    const number = props.objectMapping[props.sendSmsColumn]
    const userId = useAbStoreAdapter()?.getAbUser?.userId
    const userIdStr = userId.slice(0, 16)
    const key = abTools.encryptKey(number, userIdStr)
    registerApi
      .verificationCode(props.sendType ? true : false, number, key)
      .then((s) => {
        clickCount++
        verification = abTools.decryptKey(s.data, userId.slice(0, 16))
        ElMessage({
          showClose: true,
          message: abT('page.common.operateSuccess', '操作成功'),
          type: 'success',
        })

        // 验证码倒计时,用于让用户看到倒计时
        if (!timer.value) {
          show.value = false
          timer.value = setInterval(() => {
            if (count.value > 1) {
              count.value--
            } else {
              show.value = true
              clearInterval(timer.value)
              timer.value = null
              count.value = 60
            }
          }, 1000)
        }
      })
      .catch((error) => {
        if (!error.msg) {
          ElMessage({
            showClose: true,
            message: abT(
              'abform.verificationCode.timeout',
              '发送超时！发送状态未知，若未收到请稍后再试！'
            ),
            type: 'warning',
          })
        }
      })
      .finally(() => (loading.value = false))
  }

  //校验输入的验证码是否正确
  const check = () => {
    if (
      !props.objectMapping ||
      !props.sendSmsColumn ||
      !props.objectMapping[props.sendSmsColumn]
    ) {
      ElMessage({
        showClose: true,
        message: abT(
          'abform.verificationCode.errorTip',
          `${props.sendType ? '手机号' : '邮箱'}不能为空！请输入后再试`
        ),
        type: 'warning',
      })
      return false
    }
    const sendSms = props.objectMapping[props.sendSmsColumn]
    const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/
    const telPattern =
      /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/
    // 使用test()方法进行校验
    if (props.sendType) {
      if (!telPattern.test(sendSms)) {
        ElMessage({
          showClose: true,
          message: abT(
            'abform.verificationCode.failedTip',
            '手机号校验不通过，请输入正确的手机号后重试！'
          ),
          type: 'warning',
        })
        return false
      }
    } else {
      if (!emailPattern.test(sendSms)) {
        ElMessage({
          showClose: true,
          message: abT(
            'abform.verificationCode.emailFail',
            '邮箱校验不通过，请输入正确的邮箱后重试！'
          ),
          type: 'warning',
        })
        return false
      }
    }
    return true
  }

  // 移除校验
  onBeforeUnmount(() => {
    abFormMananger.removeField(formField)
  })

  // 失焦事件提示错误
  const addField2Form = () => {
    formField.modelValue = phoneCode.value
    AbformValidate.blurValidate(formField)
  }

  // 加入表单校验
  onMounted(() => {
    AbformValidate.addField2Form(formField, 'b', abFormMananger)
  })
</script>

<style scoped>
  .code-btn {
    min-width: 120px;
    max-width: 120px;
  }
</style>

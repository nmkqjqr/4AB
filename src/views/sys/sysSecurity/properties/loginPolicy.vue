<template>
  <el-dialog
    v-model="props.showDialog"
    title="登录安全策略"
    width="50%"
    draggable="true"
    overflow="true"
    @close="closeFn(false)"
  >

    <el-form
      ref="ruleFormRef"
      :model="form"
      label-suffix="："
      style="margin-top: 0">

      <el-form-item label="登录验证码" label-width="180px" style="margin-top: inherit" prop="loginCheck">
        <el-switch v-model="form.loginCheck" active-text="开启" inactive-text="关闭"   active-value='true' inactive-value='false' />
        <el-tooltip
          class="box-item"
          content="登录页面验证码开关，打开后登录系统需要输入验证码，默认关闭。"
          effect="dark"
          placement="right"
        >
          <el-icon size="16" style="margin-left: 6px">
            <InfoFilled />
          </el-icon>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="最大连续登陆失败次数" label-width="180px" prop="attemptLoginMax">
        <el-input-number v-model="form.attemptLoginMax" :max="9" :min="1"/>
        <el-tooltip
          class="box-item"
          content="最大连续登录失败次数，值范围1-9，超过最大值后将锁定账户ip禁止登录，默认5次。"
          effect="dark"
          placement="right"
        >
          <el-icon size="16" style="margin-left: 6px">
            <InfoFilled />
          </el-icon>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="登录失败锁定账户时长" label-width="180px" prop="lockDuration">
        <el-select v-model="form.lockDuration">
          <el-option
            v-for="item in lockDuration"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-tooltip
          class="box-item"
          content="登录失败锁定账户时长，达到最大连续失败次数后锁定登录的时长，默认0.5天。"
          effect="dark"
          placement="right"
        >
          <el-icon size="16" style="margin-left: 6px">
            <InfoFilled />
          </el-icon>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="允许找回密码" label-width="180px" prop="retrievePassword">
        <el-switch v-model="form.retrievePassword" active-text="是" inactive-text="否" active-value='true' inactive-value='false' />
        <el-tooltip
          class="box-item"
          content="登录页找回密码开关，打开后即可通过用户邮箱获取验证码找回密码，默认关闭。"
          effect="dark"
          placement="right"
        >
          <el-icon size="16" style="margin-left: 6px">
            <InfoFilled />
          </el-icon>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="初始化密码需修改后登录" label-width="180px" prop="compelUpdatePassword">
        <el-switch v-model="form.compelUpdatePassword" active-text="是" inactive-text="否" active-value='true' inactive-value='false' />
        <el-tooltip
          class="box-item"
          content="初始化密码需修改后登录，打开后初始化密码需要先修改后才能登录，默认关闭。"
          effect="dark"
          placement="right"
        >
          <el-icon size="16" style="margin-left: 6px">
            <InfoFilled />
          </el-icon>
        </el-tooltip>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeFn(false)">取消</el-button>
        <el-button type="primary" @click="onSubmit(ruleFormRef)">
          提交
        </el-button>
      </div>
    </template>

  </el-dialog>
</template>

<script lang="ts" setup>
import {reactive} from 'vue'
import {sysApi} from '~/agilebpm'
import {ElMessage, FormInstance} from 'element-plus'
import {
  InfoFilled
} from '@element-plus/icons-vue'

const ruleFormRef = ref<FormInstance>()
const id = ref('')
const info = reactive({
  loading: false,
})
const name = 'loginPolicy'
const props = defineProps({
  showDialog :{
    type: Boolean,
    required: true,
    default:false,
  },
  modelValue :{
    type: Object,
    required: true,
  }
})

const lockDuration = reactive([
  {
    value: 12,
    label: '0.5天',
  },
  {
    value: 24,
    label: '1天',
  },
  {
    value: 48,
    label: '2天',
  },
  {
    value: 72,
    label: '3天',
  },
  {
    value: 120,
    label: '5天',
  },
])

const form = reactive({
  lockDuration: 12,
  attemptLoginMax: 5,
  retrievePassword: 'false',
  loginCheck: 'false',
  compelUpdatePassword: 'false',
})

const getCompanyConf = () => {
  sysApi.configuration.getSysConfig(name).then(({data}) => {
    if (data && data.json) {
      const confJson = JSON.parse(data.json)
      form.lockDuration = confJson.lockDuration ? confJson.lockDuration : ''
      form.attemptLoginMax = confJson.attemptLoginMax ? confJson.attemptLoginMax : ''
      form.retrievePassword = confJson.retrievePassword ? confJson.retrievePassword : ''
      form.loginCheck = confJson.loginCheck ? confJson.loginCheck : ''
      form.compelUpdatePassword = confJson.compelUpdatePassword ? confJson.compelUpdatePassword : ''
    }
    if ( data.id) {
      id.value = data.id
    }
  })
}
getCompanyConf()

const emit = defineEmits([
  'closeFn',
])

const closeFn = (flg : any) => {
  emit('closeFn',flg)
}

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      info.loading = true
      let formData = {
        code: name,
        json: JSON.stringify(form),
        name: props.modelValue.name,
        desc: props.modelValue.desc,
      }
      if (id.value && id.value.length > 0) {
        formData = { ...formData, ...{ id: id.value } }
      }
      id.value=''
      sysApi.configuration
        .saveSysConfObj(formData)
        .then(
          ({msg}) => {
            info.loading = false
            ElMessage.success(`${msg}，即将刷新页面`)
            closeFn(true)
          },
          () => (info.loading = false)
        )
        .catch(() => (info.loading = false))
    } else {
      console.log('提交失败!', fields)
    }
  })
}
</script>

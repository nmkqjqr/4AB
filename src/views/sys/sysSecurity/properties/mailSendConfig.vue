<template>
  <el-dialog
    v-model="props.showDialog"
    title="邮件发送配置"
    width="50%"
    draggable="true"
    overflow="true"
    @close="closeFn(false)"
  >

    <el-form
      ref="ruleFormRef"
      :model="form"
      label-suffix="："
      style="margin-top: 0"
    >
      <el-form-item :rules="[{ required: true, message: '必填' }]" label="服务器域名" label-width="180px" prop="host">
        <el-input v-model="form.host" style="overflow: inherit" placeholder="请输入服务器域名"/>
        <el-tooltip
          class="box-item"
          content="host：SMTP服务器域名。"
          effect="dark"
          placement="right"
        >
          <el-icon size="16" style="margin-left: 6px">
            <InfoFilled />
          </el-icon>
        </el-tooltip>
      </el-form-item>

      <el-form-item :rules="[{ required: true, message: '必填' }]" label="服务端口" label-width="180px" prop="port">

        <el-input v-model="form.port" placeholder="请输入服务端口"/>
        <el-tooltip
          class="box-item"
          content="port：SMTP服务器端口。"
          effect="dark"
          placement="right"
        >
          <el-icon size="16" style="margin-left: 6px">
            <InfoFilled />
          </el-icon>
        </el-tooltip>

      </el-form-item>

      <el-form-item :rules="[{ required: true, message: '必填' }]" label="发送方" label-width="180px" prop="address">
        <el-input v-model="form.address" placeholder="请输入邮件服务发送方"/>
        <el-tooltip
          class="box-item"
          content="address：邮件服务发送方邮箱账户。"
          effect="dark"
          placement="right"
        >
          <el-icon size="16" style="margin-left: 6px">
            <InfoFilled />
          </el-icon>
        </el-tooltip>
      </el-form-item>

      <el-form-item :rules="[{ required: true, message: '必填' }]" label="用户名称" label-width="180px" prop="nickname">
        <el-input v-model="form.nickname" placeholder="请输入邮箱用户名称"/>
        <el-tooltip
          class="box-item"
          content="nickname：邮箱用户名称。"
          effect="dark"
          placement="right"
        >
          <el-icon size="16" style="margin-left: 6px">
            <InfoFilled />
          </el-icon>
        </el-tooltip>
      </el-form-item>

      <el-form-item :rules="[{ required: true, message: '必填' }]" label="邮箱密码" label-width="180px" prop="password">
        <el-input v-model="form.password" placeholder="******(已加密)"/>
        <el-tooltip
          class="box-item"
          content="password：邮箱账户登录密码，已加密存储。"
          effect="dark"
          placement="right"
        >
          <el-icon size="16" style="margin-left: 6px">
            <InfoFilled />
          </el-icon>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="开启安全连接" label-width="180px" prop="ssl">
        <el-switch v-model="form.ssl" active-text="是" inactive-text="否" active-value='true' inactive-value='false' />
        <el-tooltip
          class="box-item"
          content="SSL：安全连接开关，默认开启。"
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
import {abTools, sysApi} from '~/agilebpm'

import {ElMessage, FormInstance} from 'element-plus'

const name = 'mailSendConfig'
const ruleFormRef = ref<FormInstance>()
const id = ref('')
const info = reactive({
  loading: false,
})

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

const form = reactive({
  host: '',
  port: '',
  address: '',
  nickname: '',
  password: '',
  ssl: true
})


//请求数据回显
const getCompanyConf = () => {
  if (props.modelValue.isOpen) {
    sysApi.configuration.getSysConfig(name).then(({data}) => {
      if (data && data.json) {
        const confJson = JSON.parse(data.json)
        form.host = confJson.host ? confJson.host : ''
        form.port = confJson.port ? confJson.port : ''
        form.address = confJson.address ? confJson.address : ''
        form.nickname = confJson.nickname ? confJson.nickname : ''
        form.ssl = confJson.ssl ? confJson.ssl : ''
      }
      if (data.id) {
        id.value = data.id
      }
    })
  }
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
      form.password = abTools.encrypt(form.password)
      let formData = {
        code: name,
        json: JSON.stringify(form),
        name: props.modelValue.name,
        desc: props.modelValue.desc,
      }
      if (id.value && id.value.length > 0) {
        formData = { ...formData, ...{ id: id.value } }
      }
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



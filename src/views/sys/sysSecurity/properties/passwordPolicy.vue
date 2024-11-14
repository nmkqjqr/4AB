<template>

  <el-dialog
    v-model="props.showDialog"
    title="密码安全策略"
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
      <el-form-item label="密码有效期" label-width="180px" prop="serviceLife">
        <el-select
          v-model="form.serviceLife"
        >
          <el-option
            v-for="item in serviceLife"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-tooltip
          class="box-item"
          content="密码有效期，修改密码后新密码有效时长，默认180天。"
          effect="dark"
          placement="right"
        >
          <el-icon size="16" style="margin-left: 6px">
            <InfoFilled />
          </el-icon>
        </el-tooltip>
      </el-form-item>
      <el-form-item :rules="[{ required: true, message: '必填' }]" label="密码校验正则" label-width="180px"
                    prop="validateRules">
        <el-input v-model="form.validateRules" placeholder="请输入密码校验正则"/>
        <el-tooltip
          class="box-item"
          content="密码校验正则，系统内修改密码校验正则表达式。"
          effect="dark"
          placement="right"
        >
          <el-icon size="16" style="margin-left: 6px">
            <InfoFilled />
          </el-icon>
        </el-tooltip>
      </el-form-item>
      <el-form-item :rules="[{ required: true, message: '必填' }]" label="密码校验提示" label-width="180px"
                    prop="validateText">
        <el-input v-model="form.validateText" placeholder="请输入密码校验提示"/>
        <el-tooltip
          class="box-item"
          content="密码校验提示，系统内密码校验正则对应的提示说明。"
          effect="dark"
          placement="right"
        >
          <el-icon size="16" style="margin-left: 6px">
            <InfoFilled />
          </el-icon>
        </el-tooltip>
      </el-form-item>


      <el-form-item label="修改密码退出登录" label-width="180px" prop="changePwdIsLogOut">
        <el-switch v-model="form.changePwdIsLogOut" active-text="是" inactive-text="否" active-value='true' inactive-value='false' />
        <el-tooltip
          class="box-item"
          content="修改密码退出登录，修改密码成功后退出当前浏览器的该用户登录状态，默认关闭。"
          effect="dark"
          placement="right"
        >
          <el-icon size="16" style="margin-left: 6px">
            <InfoFilled />
          </el-icon>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="修改密码退出系统" label-width="180px" prop="changePwdIsExitSystem">
        <el-switch v-model="form.changePwdIsExitSystem" active-text="是" inactive-text="否" active-value='true' inactive-value='false' />
        <el-tooltip
          class="box-item"
          content="修改密码退出系统，修改密码成功后退出所有浏览器的该用户登录状态，默认关闭。"
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

const name = 'passwordPolicy'
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

const serviceLife = reactive([
  {
    value: 30,
    label: '30天',
  },
  {
    value: 60,
    label: '60天',
  },
  {
    value: 90,
    label: '90天',
  },
  {
    value: 180,
    label: '180天',
  },
])

const form = reactive({
  serviceLife: 180,
  validateRules: "^[A-Za-z0-9_!@#$%&*]{6,20}$",
  validateText: "密码长度在6-20位之间由数字、字母组合",
  changePwdIsLogOut: '',
  changePwdIsExitSystem: '',
})


const getCompanyConf = () => {
  //请求数据回显
  sysApi.configuration.getSysConfig(name).then(({data}) => {
    if (data && data.json) {
      const confJson = JSON.parse(data.json)
      form.serviceLife = confJson.serviceLife ? confJson.serviceLife : ''
      form.validateRules = confJson.validateRules ? confJson.validateRules : ''
      form.validateText = confJson.validateText ? confJson.validateText : ''
      form.changePwdIsLogOut = confJson.changePwdIsLogOut ? confJson.changePwdIsLogOut : ''
      form.changePwdIsExitSystem = confJson.changePwdIsExitSystem ? confJson.changePwdIsExitSystem : ''
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
      id.value = ''
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

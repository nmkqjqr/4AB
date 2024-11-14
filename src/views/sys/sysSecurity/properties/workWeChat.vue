<template>
  <el-dialog
    v-model="props.showDialog"
    title="企业微信对接"
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
      <el-form-item :rules="[{ required: true, message: '必填' }]" label="应用唯一标识" label-width="180px" prop="agentId">
        <el-input v-model="form.agentId" placeholder="请输入应用唯一标识"/>
        <el-tooltip
          class="box-item"
          content="agentId：企业微信应用编号"
          effect="dark"
          placement="right"
        >
          <el-icon size="16" style="margin-left: 6px">
            <InfoFilled />
          </el-icon>
        </el-tooltip>
      </el-form-item>
      <el-form-item :rules="[{ required: true, message: '必填' }]" label="PC端回调地址" label-width="180px" prop="pc_redirect_uri">
        <el-input v-model="form.pc_redirect_uri" placeholder="请输入PC端回调地址"/>
        <el-tooltip
          class="box-item"
          content="pc_redirect_uri：PC端系统登录页"
          effect="dark"
          placement="right"
        >
          <el-icon size="16" style="margin-left: 6px">
            <InfoFilled />
          </el-icon>
        </el-tooltip>
      </el-form-item>
      <el-form-item :rules="[{ required: true, message: '必填' }]" label="移动端回调地址" label-width="180px" prop="redirect_uri">
        <el-input v-model="form.redirect_uri"    placeholder="请输入移动端回调地址"/>
        <el-tooltip
          class="box-item"
          content="redirect_uri：企业微信应用的应用主页"
          effect="dark"
          placement="right"
        >
          <el-icon size="16" style="margin-left: 6px">
            <InfoFilled />
          </el-icon>
        </el-tooltip>
      </el-form-item>
      <el-form-item :rules="[{ required: true, message: '必填' }]" label="公匙" label-width="180px" prop="appId">
        <el-input v-model="form.appId" placeholder="请输入公匙"/>
        <el-tooltip
          class="box-item"
          content="appId：企业唯一标识，企业微信的企业id （在企业微信 我的企业-企业信息-企业id）"
          effect="dark"
          placement="right"
        >
          <el-icon size="16" style="margin-left: 6px">
            <InfoFilled />
          </el-icon>
        </el-tooltip>
      </el-form-item>
      <el-form-item :rules="[{ required: true, message: '必填' }]" label="私钥" label-width="180px" prop="appSecret">
        <el-input v-model="form.appSecret"    placeholder="******(已加密)"/>
        <el-tooltip
          class="box-item"
          content="appSecret：应用唯一标识，企业微信应用的密匙：在 我的企业 - 应用管理 - 找到自己的具体应用打开如下红框位置"
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

const name = 'qywx'
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
  pc_redirect_uri:'',//回调地址
  agentId: '',//应用唯一标识
  appId: '',//公匙
  appSecret: '',//私钥
  redirect_uri:'',//回调地址
})

//请求数据回显
const getCompanyConf = () => {
  if (props.modelValue.isOpen){
    sysApi.configuration.getSysConfig(name).then(({data}) => {
      if (data && data.json) {
        const confJson = JSON.parse(data.json)
        form.pc_redirect_uri = confJson.pc_redirect_uri ? confJson.pc_redirect_uri : ''
        form.agentId = confJson.agentId ? confJson.agentId : ''
        form.appId = confJson.appId ? confJson.appId : ''
        form.redirect_uri = confJson.redirect_uri ? confJson.redirect_uri : ''
      }
      if ( data.id) {
        id.value = data.id
      }
    })
  }
}
getCompanyConf()

const emit = defineEmits(['closeFn'])

const closeFn = (flg : any) => {emit('closeFn',flg)}



const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      info.loading = true
      form.appSecret = abTools.encrypt(form.appSecret)
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
            ElMessage.success(`${msg}，即将刷新页面`)
            info.loading = false
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



<template>
  <el-dialog
    v-model="props.showDialog"
    title="钉钉对接"
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

      <el-form-item :rules="[{ required: true, message: '必填' }]" label="企业唯一标识" label-width="180px" prop="corpId">
        <el-input v-model="form.corpId" placeholder="请输入企业唯一标识"/>
        <el-tooltip
          class="box-item"
          content="corpId：企业唯一标识（登录钉钉开发者后台右上角查看CorpId）。"
          effect="dark"
          placement="right"
        >
          <el-icon size="16" style="margin-left: 6px">
            <InfoFilled />
          </el-icon>
        </el-tooltip>
      </el-form-item>
      <el-form-item :rules="[{ required: true, message: '必填' }]" label="应用唯一标识" label-width="180px" prop="agentId">
        <el-input v-model="form.agentId" placeholder="请输入应用唯一标识"/>
        <el-tooltip
          class="box-item"
          content="agentId：应用唯一标识（钉钉开发者后台-企业内部应用-点击具体应用-基础信息-凭证与基础信息）。"
          effect="dark"
          placement="right"
        >
          <el-icon size="16" style="margin-left: 6px">
            <InfoFilled />
          </el-icon>
        </el-tooltip>
      </el-form-item>
      <el-form-item :rules="[{ required: true, message: '必填' }]" label="公匙" label-width="180px" prop="appKey">
        <el-input v-model="form.appKey" placeholder="请输入公匙"/>
        <el-tooltip
          class="box-item"
          content="appKey：应用公匙（钉钉开发者后台-企业内部应用-点击具体应用-基础信息-凭证与基础信息钉钉应用唯一标识）。"
          effect="dark"
          placement="right"
        >
          <el-icon size="16" style="margin-left: 6px">
            <InfoFilled />
          </el-icon>
        </el-tooltip>
      </el-form-item>
      <el-form-item :rules="[{ required: true, message: '必填' }]" label="私钥" label-width="180px" prop="appSecret">
        <el-input v-model="form.appSecret" placeholder="******(已加密)"/>
        <el-tooltip
          class="box-item"
          content="appSecret：应用私钥（钉钉开发者后台-企业内部应用-点击具体应用-基础信息-凭证与基础信息，加密存储）。"
          effect="dark"
          placement="right"
        >
          <el-icon size="16" style="margin-left: 6px">
            <InfoFilled />
          </el-icon>
        </el-tooltip>
      </el-form-item>
      <el-form-item :rules="[{ required: true, message: '必填' }]" label="回调地址" label-width="180px" prop="pc_redirect_uri">
        <el-input v-model="form.pc_redirect_uri" placeholder="请输入回调地址"/>
        <el-tooltip
          class="box-item"
          content="pc_redirect_uri：钉钉扫码登录回调地址。"
          effect="dark"
          placement="right"
        >
          <el-icon size="16" style="margin-left: 6px">
            <InfoFilled />
          </el-icon>
        </el-tooltip>
      </el-form-item>
      <el-form-item :rules="[{ required: true, message: '必填' }]" label="卡片消息模板" label-width="180px" prop="tmpId">
        <el-input v-model="form.tmpId" placeholder="请输入卡片消息模板"/>
        <el-tooltip
          class="box-item"
          content="tmpId：钉钉卡片平台的模板编码，在钉钉卡片平台-卡片列表管理卡片(如不使用消息推送 无需配置此项)。"
          effect="dark"
          placement="right"
        >
          <el-icon size="16" style="margin-left: 6px">
            <InfoFilled />
          </el-icon>
        </el-tooltip>
      </el-form-item>
      <el-form-item :rules="[{ required: true, message: '必填' }]" label="回调密钥" label-width="180px" prop="callBackSecret">
        <el-input v-model="form.callBackSecret" placeholder="******(已加密)"/>
        <el-tooltip
          class="box-item"
          content="callBackSecret：钉钉卡片交互动作调用agilebpm接口时的接口数据加密密钥(如不使用消息推送 无需配置此项)，加密存储"
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

const name = 'dingTalk'
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
  corpId: '',//企业唯一标识
  agentId: '',//应用唯一标识
  appKey: '',//公匙
  appSecret: '',//私钥
  tmpId: '',//卡片消息模板标识
  callBackSecret: '',//回调密钥
  pc_redirect_uri:'',//回调地址
})


//请求数据回显
const getCompanyConf = () => {
  if (props.modelValue.isOpen) {
    sysApi.configuration.getSysConfig(name).then(({data}) => {
      if (data && data.json) {
        const confJson = JSON.parse(data.json)
        form.corpId = confJson.corpId ? confJson.corpId : ''
        form.agentId = confJson.agentId ? confJson.agentId : ''
        form.appKey = confJson.appKey ? confJson.appKey : ''
        form.tmpId = confJson.tmpId ? confJson.tmpId : ''
        form.pc_redirect_uri = confJson.pc_redirect_uri ? confJson.pc_redirect_uri : ''
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
      form.appSecret = abTools.encrypt(form.appSecret)
      form.callBackSecret = abTools.encrypt(form.callBackSecret)
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



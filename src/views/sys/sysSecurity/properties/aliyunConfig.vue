<template>
  <el-dialog
    v-model="props.showDialog"
    title="阿里云配置"
    width="50%"
    :draggable=true
    :overflow=true
    @close="closeFn(false)"
  >

    <el-form
      ref="ruleFormRef"
      :model="form"
      label-suffix="："
      style="margin-top: 0">
      <el-form-item :rules="[{ required: true, message: '必填' }]" label="地区编号" label-width="180px" prop="regionId">
        <el-input v-model="form.regionId" placeholder="请输入地区编号"/>
        <el-tooltip
          class="box-item"
          content="regionId：地区编号。"
          effect="dark"
          placement="right"
        >
          <el-icon size="16" style="margin-left: 6px">
            <InfoFilled />
          </el-icon>
        </el-tooltip>
      </el-form-item>
      <el-form-item :rules="[{ required: true, message: '必填' }]"  label="产品域名" label-width="180px" prop="sysDomain">
        <el-input v-model="form.sysDomain" placeholder="请输入产品域名"/>
        <el-tooltip
          class="box-item"
          content="sysDomain：产品域名。"
          effect="dark"
          placement="right"
        >
          <el-icon size="16" style="margin-left: 6px">
            <InfoFilled />
          </el-icon>
        </el-tooltip>
      </el-form-item>
      <el-form-item :rules="[{ required: true, message: '必填' }]"  label="签名" label-width="180px" prop="signName">
        <el-input v-model="form.signName" placeholder="请输入签名"/>
        <el-tooltip
          class="box-item"
          content="signName：签名。"
          effect="dark"
          placement="right"
        >
          <el-icon size="16" style="margin-left: 6px">
            <InfoFilled />
          </el-icon>
        </el-tooltip>
      </el-form-item>
      <el-form-item :rules="[{ required: true, message: '必填' }]"  label="模板编码" label-width="180px" prop="templateCode">
        <el-input v-model="form.templateCode" placeholder="请输入模板编码"/>
        <el-tooltip
          class="box-item"
          content="templateCode：模板编码。"
          effect="dark"
          placement="right"
        >
          <el-icon size="16" style="margin-left: 6px">
            <InfoFilled />
          </el-icon>
        </el-tooltip>
      </el-form-item>
      <el-form-item :rules="[{ required: true, message: '必填' }]" label="用户标识" label-width="180px" prop="accessKeyId">
        <el-input v-model="form.accessKeyId" placeholder="请输入用户标识"/>
        <el-tooltip
          class="box-item"
          content="accessKeyId：用户标识。"
          effect="dark"
          placement="right"
        >
          <el-icon size="16" style="margin-left: 6px">
            <InfoFilled />
          </el-icon>
        </el-tooltip>
      </el-form-item>
      <el-form-item :rules="[{ required: true, message: '必填' }]" label="用户秘钥" label-width="180px" prop="accessSecret">
        <el-input v-model="form.accessSecret"  placeholder="******(已加密)"/>
        <el-tooltip
          class="box-item"
          content="accessSecret：用户秘钥，加密存储。"
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
import {sysApi,abTools} from '~/agilebpm'
import {ElMessage, FormInstance} from 'element-plus'

const name = 'aliyunConfig'
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
  regionId: '',//地区编号
  sysDomain: '',//产品域名
  signName: '',//签名
  templateCode: '',//模板编码
  accessKeyId: '',//用户标识
  accessSecret: '',//用户秘钥

})

//请求数据回显
const getCompanyConf = () => {
  if (props.modelValue.isOpen){
    sysApi.configuration.getSysConfig(name).then(({data}) => {
      if (data && data.json) {
        const confJson = JSON.parse(data.json)
        form.regionId = confJson.regionId ? confJson.regionId : ''
        form.sysDomain = confJson.sysDomain ? confJson.sysDomain : ''
        form.signName = confJson.signName ? confJson.signName : ''
        form.templateCode = confJson.templateCode ? confJson.templateCode : ''
        form.accessKeyId = confJson.accessKeyId ? confJson.accessKeyId : ''
      }
      if (data.id) {
        id.value = data.id
      }
    })
  }
}
getCompanyConf()

const emit = defineEmits(['closeFn',])

const closeFn = (flg : any) => {
  emit('closeFn',flg)
}

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      info.loading = true
      form.accessSecret = abTools.encrypt(form.accessSecret)
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



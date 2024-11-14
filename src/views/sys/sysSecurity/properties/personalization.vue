<template>
  <el-dialog
    v-model="props.showDialog"
    title="系统个性化"
    width="50%"
    draggable="true"
    overflow="true"
    @close="closeFn(false)"
  >

    <el-form
      ref="ruleFormRef"
      label-width="120px"
      :model="form"
      :rules="rules"
      style="margin-top: 0"
    >
      <el-form-item :rules="[{ required: true, message: '必填' }]"   label="系统名称：" prop="systemName">
        <el-input v-model="form.systemName" placeholder="请输入系统名称" />
        <el-tooltip
          class="box-item"
          content="当前系统名称。"
          effect="dark"
          placement="right"
        >
          <el-icon size="16" style="margin-left: 6px">
            <InfoFilled />
          </el-icon>
        </el-tooltip>
      </el-form-item>

      <el-form-item
        label="深色模式logo："
        prop="blackLogo"
        :rules="[{ required: true, message: '请上传深色模式logo' }]"
      >
        <ab-upload-file
          v-if="show"
          ref="blackLogoRef"
          v-model="form.blackLogo"
          accept=".jpg,.png,.svg"
          dic-code="property"
          :limit="1"
          list-type="picture-card"
          size="small"
        />
      </el-form-item>

      <el-form-item
        label="白色模式logo："
        prop="whiteLogo"
        :rules="[{ required: true, message: '请上传白色模式logo' }]"
      >
        <ab-upload-file
          v-if="show"
          ref="whiteLogoRef"
          v-model="form.whiteLogo"
          accept=".jpg,.png,.svg"
          dic-code="property"
          :limit="1"
          list-type="picture-card"
          size="small"
        />
      </el-form-item>

      <el-form-item :rules="[{ required: true, message: '必填' }]"  label="公司名称：" prop="comName">
        <el-input v-model="form.comName" placeholder="请输入公司名称" />
        <el-tooltip
          class="box-item"
          content="公司名称。"
          effect="dark"
          placement="right"
        >
          <el-icon size="16" style="margin-left: 6px">
            <InfoFilled />
          </el-icon>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="水印：" prop="waterMark">
        <el-switch
          v-model="form.waterMark"
          active-text="显示"
          :active-value="1"
          inactive-text="隐藏"
          :inactive-value="0"
        />
        <el-tooltip
          class="box-item"
          content="系统水印开关，打开后系统页面会显示公司名称+配置项内容的水印，默认关闭。"
          effect="dark"
          placement="right"
        >
          <el-icon size="16" style="margin-left: 6px">
            <InfoFilled />
          </el-icon>
        </el-tooltip>
      </el-form-item>

      <el-form-item
        v-if="form.waterMark"
        label="配置显示项："
        prop="configuration"
      >
        <el-input v-model="form.custom" placeholder="请输入" style="width:255px;margin-right:20px;"/>
        <el-checkbox-group v-model="form.configuration">
          <el-checkbox label="username">用户名</el-checkbox>
          <el-checkbox label="department">部门</el-checkbox>
          <el-checkbox label="date">时间</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeFn(false)">取消</el-button>
        <el-button
          :loading="info.loading"
          type="primary"
          @click="onSubmit(ruleFormRef)"
        >
          提交
        </el-button>
      </div>
    </template>

  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { Check, RefreshRight } from '@element-plus/icons-vue'
import { sysApi, request } from '~/agilebpm'
import { abUploadFile } from '~/agilebpm'
import {ElMessage, FormInstance, FormRules } from 'element-plus'
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

const name = 'companyConfig'
const form = reactive({
  systemName: '',
  blackLogo: '',
  whiteLogo: '',
  comName: '',
  custom:'',
  waterMark: 1,
  configuration: ['username'],
})
const id = ref('')
const show = ref(false)
const blackLogoRef = ref()
const whiteLogoRef = ref()
const ruleFormRef = ref<FormInstance>()

//请求数据回显
const getCompanyConf = () => {
  sysApi.configuration.getSysConfig(name).then(({data}) => {
    show.value = true
    if (data && data.json) {
      const confJson = JSON.parse(data.json)
      form.systemName = confJson.systemName ? confJson.systemName : ''
      form.comName = confJson.comName ? confJson.comName : ''
      form.blackLogo = confJson.blackLogo ? confJson.blackLogo : ''
      form.whiteLogo = confJson.whiteLogo ? confJson.whiteLogo : ''
      form.custom = confJson.custom ? confJson.custom : ''
      form.waterMark = confJson.waterMark
      form.configuration = confJson.configuration
        ? confJson.configuration
        : ['username']
    }
    if (data && data.id) {
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
      if (form.blackLogo.length <= 0 || !JSON.parse(form.blackLogo)[0]) {
        ElMessage.error('请上传深色模式logo.')
        return false
      }
      if (form.whiteLogo.length <= 0 || !JSON.parse(form.whiteLogo)[0]) {
        ElMessage.error('请上传白色模式logo.')
        return false
      }
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
      sysApi.configuration
        .saveSysConfObj(formData)
        .then(
          ({ msg }) => {
            info.loading = false
            ElMessage.success(`${msg}，即将刷新页面`)
            closeFn(true)
          },
          () => (info.loading = false)
        )
        .catch(() => (info.loading = false))
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>

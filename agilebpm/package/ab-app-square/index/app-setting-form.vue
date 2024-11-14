<template>
  <el-card shadow="never" class="infoBox">
    <p class="title">基础信息</p>
    <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="ruleForm"
      :rules="rules"
      label-width="auto"
      :size="formSize"
      status-icon
    >
      <el-form-item label="应用名称" prop="name">
        <ab-pinyin
          v-model="ruleForm.name"
          v-model:to="ruleForm.code"
        />
      </el-form-item>
      <el-form-item label="应用图标" prop="icon">
        <ab-choose-svg v-model="ruleForm.icon" style="width:86%;"/>
        <svg-icon
          :icon="ruleForm.icon"
          style="width: 30px; height: 30px; margin-left: 12px"
        />
      </el-form-item>
      <!-- <el-form-item label="应用编码" prop="code">
        <ab-code
          v-model="ruleForm.code"
          style="width:100%;"
          placeholder="请输入应用编码"
        />
      </el-form-item> -->
      <el-form-item label="应用描述" prop="desc">
        <el-input v-model="ruleForm.desc" type="textarea" placeholder="请输入" show-word-limit  maxlength="100"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="info.saveLoading" @click="submitForm(ruleFormRef)">
          保存
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'
import { postData,getData } from '~/agilebpm/api/ab-request'
import { saveProjectUrl,getProjectUrl } from '~/agilebpm/api/modules/ab-appSquare/ab-appSquare-project'
import { abUtil,abTools } from '~/agilebpm'
import { abChooseSvg, svgIcon } from '@ab-core'
const { proxy } = abTools.useCurrentInstance()

const props = defineProps({
  // eslint-disable-next-line vue/require-default-prop
  modelValue: {
    type: Object,
  },
})
const { modelValue } = toRefs(props)
const emit = defineEmits(['update:modelValue'])

const info = reactive({
  saveLoading:false
})

interface RuleForm {
  icon: string
  name: string
  code: string
  desc: string
}

const formSize = ref<ComponentSize>('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  icon: 'document',
  name: '',
  code:'',
  desc: '',
})

const locationOptions = ['Home', 'Company', 'School']

const rules = reactive<FormRules<RuleForm>>({
  icon: [
    { required: true, message: '请选择', trigger: 'change' },
  ],
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
  ],
  code: [
    { required: true, message: '请输入编码', trigger: 'blur' },
  ]
})

onMounted(()=>{
  ruleForm.name = abUtil.clone(modelValue.value).name
  ruleForm.icon = abUtil.clone(modelValue.value).icon
  ruleForm.desc = abUtil.clone(modelValue.value).desc
  ruleForm.id = abUtil.clone(modelValue.value).id
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      info.saveLoading = true
      postData(saveProjectUrl, ruleForm)
        .then(
          ({ msg,data }) => {
            ElMessage({
              showClose: true,
              message: msg,
              type: 'success',
            })
            info.saveLoading = false
            getData(getProjectUrl + proxy.$route.params.projectId).then(
              ({ data }) => {
                emit('update:modelValue',data)
              },
              () => {}
            )
            .catch(() => {
            })
          },
          () => {}
        )
        .catch(() => {
          info.saveLoading = false
        })
    } else {
      console.log('error submit!', fields)
    }
  })
}

const options = Array.from({ length: 10000 }).map((_, idx) => ({
  value: `${idx + 1}`,
  label: `${idx + 1}`,
}))
</script>
<style lang="scss" scoped>
.infoBox{
  margin:20px;
  .title{
    margin-top:4px;
    font-size:18px;
  }
}
</style>

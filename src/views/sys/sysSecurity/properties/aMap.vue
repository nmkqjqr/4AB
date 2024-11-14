<template>
  <el-dialog
    v-model="props.showDialog"
    :draggable="true"
    :overflow="true"
    title="高德配置"
    width="40%"
    @close="closeFn(false)"
  >
    <el-form
      ref="ruleFormRef"
      label-suffix="："
      :model="form"
      style="margin-top: 0; margin-top: 50px; margin-bottom: 50px"
    >
      <el-form-item
        label="应用key"
        label-width="120px"
        prop="key"
        :rules="[{ required: true, message: '必填' }]"
      >
        <el-input v-model="form.key" placeholder="请输入应用key" />
      </el-form-item>

      <el-form-item
        label="安全密匙"
        label-width="120px"
        prop="securityJsCode"
        :rules="[{ required: true, message: '必填' }]"
      >
        <el-input v-model="form.securityJsCode" placeholder="******(已加密)" />
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
  import { reactive } from 'vue'
  import { sysApi, abTools } from '~/agilebpm'
  import { ElMessage, FormInstance } from 'element-plus'

  const name = 'aMap'
  const ruleFormRef = ref<FormInstance>()
  const id = ref('')
  const info = reactive({
    loading: false,
  })

  const props = defineProps({
    showDialog: {
      type: Boolean,
      required: true,
      default: false,
    },
    modelValue: {
      type: Object,
      required: true,
    },
  })

  const form = reactive({
    key: '', //key
    securityJsCode: '', //安全密匙
  })

  //请求数据回显
  const getCompanyConf = () => {
    if (props.modelValue.isOpen) {
      sysApi.configuration.getSysConfig(name).then(({ data }) => {
        if (data && data.json) {
          const confJson = JSON.parse(data.json)
          form.key = confJson.key ? confJson.key : ''
        }
        if (data.id) {
          id.value = data.id
        }
      })
    }
  }
  getCompanyConf()

  const emit = defineEmits(['closeFn'])

  const closeFn = (flg: any) => {
    emit('closeFn', flg)
  }

  const onSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
      if (valid) {
        info.loading = true
        form.securityJsCode = abTools.encrypt(form.securityJsCode)

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

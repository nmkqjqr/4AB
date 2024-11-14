<template>
  <el-dialog
    v-model="props.showDialog"
    :draggable="true"
    :overflow="true"
    title="百度Ai配置"
    width="50%"
    @close="closeFn(false)"
  >
    <el-form
      ref="ruleFormRef"
      label-suffix="："
      :model="form"
      style="margin-top: 0"
    >
      <el-form-item
        label="应用标识"
        label-width="220px"
        prop="appID"
        :rules="[{ required: true, message: '必填' }]"
      >
        <el-input v-model="form.appID" placeholder="请输入百度应用标识" />
        <el-tooltip
          class="box-item"
          content="appID：百度应用ID。"
          effect="dark"
          placement="right"
        >
          <el-icon size="16" style="margin-left: 6px">
            <InfoFilled />
          </el-icon>
        </el-tooltip>
      </el-form-item>
      <el-form-item
        label="公钥"
        label-width="220px"
        prop="apiKey"
        :rules="[{ required: true, message: '必填' }]"
      >
        <el-input v-model="form.apiKey" placeholder="请输入百度API的公钥" />
        <el-tooltip
          class="box-item"
          content="apiKey：百度API的公钥apiKey。"
          effect="dark"
          placement="right"
        >
          <el-icon size="16" style="margin-left: 6px">
            <InfoFilled />
          </el-icon>
        </el-tooltip>
      </el-form-item>
      <el-form-item
        label="私钥"
        label-width="220px"
        prop="secretKey"
        :rules="[{ required: true, message: '必填' }]"
      >
        <el-input v-model="form.secretKey" placeholder="******(已加密)" />
        <el-tooltip
          class="box-item"
          content="secretKey：百度API的私钥secretKey，加密存储。"
          effect="dark"
          placement="right"
        >
          <el-icon size="16" style="margin-left: 6px">
            <InfoFilled />
          </el-icon>
        </el-tooltip>
      </el-form-item>
      <el-form-item
        label="连接超时时间(单位:秒)"
        label-width="220px"
        prop="connectionTimeoutInMillis"
        :rules="[{ required: true, message: '必填' }]"
      >
        <el-input-number
          v-model="form.connectionTimeoutInMillis"
          :max="600"
          :min="1"
        />
        <el-tooltip
          class="box-item"
          content="connectionTimeoutInMillis：建立连接的超时时间（单位：秒），最小值1，最大值600，默认值3。"
          effect="dark"
          placement="right"
        >
          <el-icon size="16" style="margin-left: 6px">
            <InfoFilled />
          </el-icon>
        </el-tooltip>
      </el-form-item>
      <el-form-item
        label="传输超时时间(单位:秒)"
        label-width="220px"
        prop="socketTimeoutInMillis"
        :rules="[{ required: true, message: '必填' }]"
      >
        <el-input-number
          v-model="form.socketTimeoutInMillis"
          :max="600"
          :min="1"
        />
        <el-tooltip
          class="box-item"
          content="socketTimeoutInMillis：通过打开的连接传输数据的超时时间（单位：秒），最小值1，最大值600，默认值60。"
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
  import { reactive } from 'vue'
  import { sysApi, abTools } from '~/agilebpm'
  import { ElMessage, FormInstance } from 'element-plus'

  const name = 'baiduAi'
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
    appID: '', //百度应用标识
    apiKey: '', //百度API的公钥
    secretKey: '', //百度API的私钥
    connectionTimeoutInMillis: 3, //连接超时时间（单位：秒）
    socketTimeoutInMillis: 60, //传输超时时间（单位：秒）
  })

  //请求数据回显
  const getCompanyConf = () => {
    if (props.modelValue.isOpen) {
      sysApi.configuration.getSysConfig(name).then(({ data }) => {
        if (data && data.json) {
          const confJson = JSON.parse(data.json)
          form.appID = confJson.appID ? confJson.appID : ''
          form.apiKey = confJson.apiKey ? confJson.apiKey : ''
          form.connectionTimeoutInMillis = confJson.connectionTimeoutInMillis
            ? Number.parseInt(confJson.connectionTimeoutInMillis) / 1000
            : 3
          form.socketTimeoutInMillis = confJson.socketTimeoutInMillis
            ? Number.parseInt(confJson.socketTimeoutInMillis) / 1000
            : 60
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
        form.secretKey = abTools.encrypt(form.secretKey)
        form.socketTimeoutInMillis = form.socketTimeoutInMillis * 1000
        form.connectionTimeoutInMillis = form.connectionTimeoutInMillis * 1000
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

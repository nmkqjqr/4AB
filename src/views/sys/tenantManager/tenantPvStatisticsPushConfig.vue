<template>
  <el-container class="layout-container-demo">
    <el-header>
      <el-button
        :icon="Check"
        :loading="info.loading"
        type="primary"
        @click="onSubmit(ruleFormRef)"
      >
        保存
      </el-button>
      <!-- <el-button :icon="RefreshRight" @click="resetForm(ruleFormRef)">
        重置
      </el-button> -->
    </el-header>
    <el-divider />
    <el-main>
      <el-scrollbar>
        <el-form
          ref="ruleFormRef"
          label-width="120px"
          :model="info.data"
          style="margin-top: 0"
        >
          <el-form-item label="启用：" prop="enable">
            <el-checkbox v-model="info.data.enable" />
          </el-form-item>
          <el-form-item label="消息类型" prop="msgType">
            <ab-msg-type v-model="info.data.msgType" />
          </el-form-item>
          <el-form-item label="通知人员">
            <div>
              <div>
                <el-select
                  v-model="info.identityType"
                  class="m-2"
                  placeholder=""
                  size="large"
                  @change="
                    info.identityDialogKey = `${info.identityType}Selector`
                  "
                >
                  <el-option label="用户" value="user" />
                  <el-option label="角色" value="role" />
                  <el-option label="组织" value="org" />
                  <el-option label="岗位" value="post" />
                </el-select>
                <ab-cust-dialog
                  :dialog-key="info.identityDialogKey"
                  style="margin-left: 10px"
                  type="primary"
                  @ok="identityDialogOk"
                >
                  选择
                </ab-cust-dialog>
                <el-button
                  style="margin-left: 10px"
                  type="primary"
                  @click="info.data.receivers = []"
                >
                  清空
                </el-button>
              </div>
              <div style="margin-top: 10px">
                <el-space wrap>
                  <el-tag
                    v-for="(receover, index) in info.data.receivers"
                    :key="`${receover.code}-${receover.id}`"
                    closable
                    @close="info.data.receivers.splice(index, 1)"
                  >
                    {{ getIdentityDesc(receover) }}
                  </el-tag>
                </el-space>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="通知HTML模板">
            <codemirror
              v-model="info.data.htmlTemplate"
              :autofocus="true"
              :indent-with-tab="true"
              placeholder=""
              :style="{
                height: `100%`,
                minHeight: `200px`,
                border: `1px solid #e4e7ed`,
                width: '100%',
                maxWidth: `500px`,
              }"
            />
          </el-form-item>
          <el-form-item label="通知Card模板">
            <codemirror
              v-model="info.data.cardTemplate"
              :autofocus="true"
              :indent-with-tab="true"
              placeholder=""
              :style="{
                height: `100%`,
                minHeight: `200px`,
                border: `1px solid #e4e7ed`,
                width: '100%',
                maxWidth: `500px`,
              }"
            />
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue'
  import { Check, RefreshRight } from '@element-plus/icons-vue'
  import { sysApi, abMsgType } from '~/agilebpm'
  import type { FormInstance } from 'element-plus'
  import { Codemirror } from 'vue-codemirror'

  const ruleFormRef = ref<FormInstance>()

  const info = reactive({
    loading: false,
    identityType: 'user',
    identityDialogKey: 'userSelector',
    data: {
      enable: false,
      msgType: '',
      receivers: [] as any[],
      htmlTemplate: '',
      cardTemplate: '',
    },
    sysConfiguration: {
      id: '',
      name: '租户访问量统计推送配置',
      code: 'tenantPvStatisticsPush',
      isEncrypt: 0,
      isEnable: 1,
      json: '',
      env: '',
    },
  })

  const fetchData = () => {
    //请求数据回显
    sysApi.configuration
      .getSysConfObj(info.sysConfiguration.code)
      .then(({ data }) => {
        if (data) {
          info.sysConfiguration = data
          if (info.sysConfiguration.json) {
            info.data = JSON.parse(info.sysConfiguration.json)
          }
        }
      })
  }

  const getIdentityDesc = (identity: any) => {
    switch (identity.type) {
      case 'user':
        return `用户-${identity.name}`
      case 'org':
        return `组织-${identity.name}`
      case 'role':
        return `角色-${identity.name}`
      case 'post':
        return `岗位-${identity.name}`
    }
  }

  const identityDialogOk = (dataList: any[]) => {
    const existsIdenties = new Set(
      info.data.receivers.map((item) => `${item.type}:${item.id}`)
    )
    dataList.forEach((data) => {
      const identity = { type: info.identityType, id: '', name: '' }
      if (info.identityType === 'post') {
        identity.id = data['key']
      } else {
        identity.id = data['id']
      }
      identity.name = data['name']
      if (!existsIdenties.has(`${identity.type}:${identity.id}`)) {
        info.data.receivers.push(identity)
      }
    })
  }

  onMounted(() => {
    fetchData()
  })

  const onSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
      if (valid) {
        info.loading = true
        info.sysConfiguration.json = JSON.stringify(info.data)
        sysApi.configuration
          .saveSysConfObj({ ...info.sysConfiguration })
          .then(() => {
            ElMessage.success('保存成功')
            fetchData()
          })
          .finally(() => (info.loading = false))
      } else {
        console.log('error submit!', fields)
      }
    })
  }

  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    ElMessageBox.confirm('确定清空设置吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        formEl.resetFields()
      })
      .catch(() => {})
  }
</script>

<template>
  <el-container class="layout-container-demo">
    <el-header>
      <ab-save
        back-name="crontabList"
        :form-ref="formRef"
        :save-data="info.data"
        :url="sysApi.crontab.crontabSave"
      />
      <ab-load
        v-model="info.data"
        :url="sysApi.crontab.crontabGet"
        @afterFn="loadAfterFn"
      />
    </el-header>
    <el-divider class="dividermar" />
    <el-main>
      <el-scrollbar>
        <el-form
          ref="formRef"
          label-suffix="："
          label-width="120px"
          :model="info.data"
          :status-icon="false"
        >
          <el-form-item
            label="分类"
            prop="typeCode"
            :rules="[{ required: true, message: '必填' }]"
          >
            <ab-select-tree
              v-model="info.data.typeCode"
              :operation="false"
              type-code="crontab"
            />
          </el-form-item>
          <el-form-item
            label="任务标识"
            prop="jobKey"
            :rules="[{ required: true, message: '必填' }]"
          >
            <el-input v-model="info.data.jobKey" placeholder="请输入任务标识" />
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input
              v-model="info.data.description"
              :autosize="{ minRows: 2, maxRows: 5 }"
              placeholder="任务描述"
              type="textarea"
            />
          </el-form-item>

          <el-form-item label="执行器类型" prop="executorType">
            <el-radio-group
              v-model="info.data.executorType"
              placeholder="请选择执行器类型"
              @change="changeExecutorType"
            >
              <el-radio-button label="annotation">注解</el-radio-button>
              <el-radio-button label="bean">Bean</el-radio-button>
              <el-radio-button label="groovyScript">脚本</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="
              info.data.executorType === 'bean' ||
              info.data.executorType === 'groovyScript'
            "
            label="执行器"
            prop="executor"
            :rules="[{ required: true, message: '必填' }]"
          >
            <codemirror
              v-if="info.data.executorType === 'groovyScript'"
              v-model="info.data.executor"
              :autofocus="true"
              :extensions="javascript()"
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
            <el-input
              v-if="info.data.executorType === 'bean'"
              v-model="info.beanId"
              placeholder="bean id"
              style="width: 200px"
              type="text"
            >
              <template #append>@</template>
            </el-input>
            <el-input
              v-if="info.data.executorType === 'bean'"
              v-model="info.beanMethod"
              placeholder="method name"
              style="width: 250px"
              type="text"
            />
          </el-form-item>
          <el-form-item
            v-if="
              info.data.executorType === 'bean' ||
              info.data.executorType === 'annotation'
            "
            label="执行器参数"
          >
            <el-input
              v-model="info.data.executorParams"
              :autosize="{ minRows: 2, maxRows: 5 }"
              placeholder="执行器参数"
              type="textarea"
            />
          </el-form-item>
          <el-form-item label="启用" prop="enabled">
            <el-switch
              v-model="info.data.enable"
              :active-value="1"
              :inactive-value="0"
              :rules="[{ required: true, message: '必填' }]"
            />
          </el-form-item>
          <el-form-item
            label="Cron"
            prop="cron"
            :rules="[{ required: true, message: '必填' }]"
          >
            <el-input
              v-model="info.data.cron"
              placeholder="cron表达式..."
              type="text"
            />
            <el-popover placement="right" trigger="click" :width="650">
              <template #reference>
                <el-button
                  :icon="Edit"
                  style="margin-right: 16px"
                  type="primary"
                />
              </template>
              <Crontab v-model="info.data.cron" />
            </el-popover>
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
  import { Edit } from '@element-plus/icons-vue'
  import { sysApi, abTools } from '~/agilebpm'
  import { Codemirror } from 'vue-codemirror'
  import { javascript } from '@codemirror/lang-javascript'
  import Crontab from './components/Crontab/index.vue'

  const { proxy } = abTools.useCurrentInstance()
  const formRef = ref()
  const info: any = reactive({
    data: {
      // 执行器类型：bean、annotation、groovyScript
      executorType: 'bean',
      // 执行器
      executor: '',
      // 是否启用
      enable: 1,
      // 执行器参数
      executorParams: '',
      // cron表达式
      cron: '',
      // 描述
      description: '',
      // 分类
      typeCode: '',
    },
    beanId: '',
    beanMethod: '',
  })

  const loadAfterFn = (data: any) => {
    if (data && data.executorType === 'bean') {
      const [beanId, beanMethod] = data.executor?.split('@')
      info.beanId = beanId
      info.beanMethod = beanMethod
    }
  }

  const changeExecutorType = () => {
    info.data.executor = ''
    info.beanId = ''
    info.beanMethod = ''
  }

  watchEffect(() => {
    switch (info.data.executorType) {
      case 'bean':
        if (info.beanId && info.beanMethod) {
          info.data.executor = `${info.beanId}@${info.beanMethod}`
        }
        break
    }
  })

  onMounted(() => {
    info.data.typeCode = proxy.$route?.params?.typeCode
  })
</script>
<style scoped></style>

<template>
  <div>
    <el-tabs
      v-model="info.tabsActiveName"
      :style="{ minHeight: info.height }"
      type="border-card"
      @tab-change="tabChange"
    >
      <el-tab-pane label="测试配置" name="testConfig">
        <el-container>
          <el-main>
            <el-form>
              <el-form-item label="发起人" prop="startUser">
                <ab-cust-dialog
                  dialog-key="userSelector"
                  :dialog-setting="{ multiple: 0 }"
                  :icon="Search"
                  @ok="setTestConfigStartUser"
                >
                  选择
                </ab-cust-dialog>
                <el-tag
                  v-if="info.testConfig.startUser.userId"
                  closable
                  size="large"
                  style="margin-left: 10px"
                  @close="clearTestConfigStartUser"
                >
                  {{ info.testConfig.startUser.fullName }}
                </el-tag>
              </el-form-item>
              <el-form-item label="禁用消息" prop="disableMessage">
                <el-switch v-model="info.testConfig.disableMessage" />
              </el-form-item>
              <el-form-item label="禁用事件" prop="disableEvent">
                <el-switch v-model="info.testConfig.disableEvent" />
              </el-form-item>
            </el-form>
          </el-main>
        </el-container>
      </el-tab-pane>
      <el-tab-pane label="启动实例" name="startInstance">
        <div
          v-if="!info.bpmDataLoaded"
          v-loading="true"
          :style="{ height: info.height }"
        ></div>
        <el-container v-else>
          <el-header>
            <bpm-buttons
              v-if="info.bpmData.buttonList && info.bpmData.buttonList.length"
              ref="bpmButtonsR"
              back-router-name="BpmInstanceTestList"
              :bpm-data="info.bpmData"
              class="print-hidden"
            />
            <el-divider class="dividermar" />
          </el-header>
          <el-main>
            <div>
              <ab-url-form
                v-if="info.bpmData?.bpmForm?.type == 'url'"
                ref="url"
                :bpm-form="info.bpmData.bpmForm"
              />
              <cust-form
                v-if="info.bpmData?.bpmForm?.type == 'inner'"
                ref="inner"
                :form-data="info.formData"
              />
            </div>
          </el-main>
        </el-container>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
  import { getCurrentInstance, Ref } from 'vue'
  import { Search } from '@element-plus/icons-vue'
  import {
    abForm as custForm,
    bpmButtons,
    abUrlForm,
    bpmTools,
    bpmApi,
    abTools,
    request,
  } from '~/agilebpm'
  import { abT } from '@/i18n'
  import { ElMessageBox } from 'element-plus'
  import { useTabsStore } from '@/store/modules/tabs'

  const { proxy } = abTools.useCurrentInstance()
  const vueContext = getCurrentInstance()
  const { changeTabsMeta } = useTabsStore()

  const bpmButtonsR = ref(null)
  const requestInterceptorId = ref()

  const info = reactive({
    defKey: '',
    tabsActiveName: 'testConfig',
    testConfig: {
      startUser: {
        userId: '',
        username: '',
        fullName: '',
      },
      disableMessage: true,
      disableEvent: true,
    },
    bpmDataLoaded: false,
    bpmData: {} as Ref<BpmData>,
    formData: {},
    height:
      proxy.$route.query.abIframeType == 'iframe'
        ? 'auto'
        : `${window.innerHeight - 315}px`,
  })

  const setTestConfigStartUser = (data: any) => {
    const startUser = info.testConfig.startUser
    if (data && data.length) {
      const user = data[0]
      startUser.userId = user.id
      startUser.fullName = user.name
      startUser.username = user.account
    }
  }

  const clearTestConfigStartUser = () => {
    const startUser: any = info.testConfig.startUser
    Object.keys(startUser).forEach((k: string) => (startUser[k] = null))
  }

  const bpmButtonBind = () => {
    if (!info.bpmData?.buttonList && !info.bpmData.buttonList.length) {
      return
    }

    const buttonList: any[] = []

    info.bpmData.buttonList
      .filter((button: any) => button.actionName !== 'draft')
      .forEach((button: any) => {
        //修改按钮名称，支持没有修改过的按钮名称翻译
        if (!button.isModifiedName) {
          button.name = button.translate
        }

        if (button.actionName === 'start') {
          button.doAction = startDoAction
        }
        buttonList.push(button)
      })

    info.bpmData.buttonList = buttonList
  }

  const startDoAction = async (actionData: any, button: any) => {
    // 封装扩展参数
    const extendConf = actionData.extendConf || (actionData.extendConf = {})
    const instanceTest =
      extendConf.instanceTest || (extendConf.instanceTest = {})

    const testConfig = info.testConfig
    instanceTest.userId = testConfig.startUser.userId
    instanceTest.disableMessage = testConfig.disableMessage
    instanceTest.disableEvent = testConfig.disableEvent

    await bpmApi.bpmData.doAction(actionData)
    try {
      await ElMessageBox.alert(
        `${abT(button.name)} ${abT('page.common.operateSuccess', '操作成功')}!`,
        abT('page.common.promptInformation', '提示信息'),
        {
          confirmButtonText: abT('page.common.ok', '确定'),
        }
      )
    } catch (error) {
      // 忽略错误处理
    } finally {
      bpmButtonsR.value.back('close')
    }
  }

  const fetchStartFlowData = async (defKey: any) => {
    const { data: startFlowData } = await bpmApi.instanceTest.getStartFlowData(
      defKey,
      false,
      null,
      info.testConfig?.startUser?.userId ?? ''
    )
    bpmTools.initBpmDataAndFormData(
      startFlowData,
      vueContext,
      info.bpmData,
      info.formData
    )
    bpmButtonBind()
    changeTabsMeta({
      fullPath: proxy.$route.fullPath,
      meta: {
        newTitle: `${startFlowData.defName}-启动测试实例`,
      },
    })
  }

  const tabChange = () => {
    info.bpmDataLoaded = false
    info.bpmData = {} as BpmData
    info.formData = {}
    if (info.tabsActiveName == 'startInstance') {
      try {
        fetchStartFlowData(info.defKey)
      } finally {
        info.bpmDataLoaded = true
      }
    }
  }

  onMounted(() => {
    info.defKey = proxy?.$route.params.defKey as string
  })
</script>

<style lang="scss" scoped></style>

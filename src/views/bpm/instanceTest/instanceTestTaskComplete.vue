<template>
  <div v-loading="info.loading">
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
              <el-form-item label="处理人" prop="submitUser">
                <el-cascader
                  ref="submitUserCascaderRef"
                  v-model="submitUserCascader.modelValue"
                  :clearable="true"
                  :options="submitUserCascader.options"
                  :props="submitUserCascader.props"
                  :show-all-levels="false"
                />
                <ab-cust-dialog
                  dialog-key="userSelector"
                  :dialog-setting="{ multiple: 0 }"
                  :icon="Search"
                  type="primary"
                  @ok="setTestConfigSubmitUser"
                >
                  选择
                </ab-cust-dialog>
              </el-form-item>
            </el-form>
          </el-main>
        </el-container>
      </el-tab-pane>
      <el-tab-pane
        :label="`${abT('menu.ProcessingTasks', '处理任务')}${
          info.taskName ? '-' + info.taskName : ''
        }`"
        name="taskComplete"
      >
        <div
          v-if="!info.bpmDataLoaded"
          v-loading="true"
          :style="{ height: info.height }"
        ></div>
        <el-container v-else>
          <el-header>
            <bpm-buttons
              v-if="info.bpmData?.buttonList"
              ref="bpmButtonsR"
              back-router-name="BpmInstanceTestTaskList"
              :bpm-data="info.bpmData"
              class="print-hidden"
            />
            <el-divider class="dividermar" />
          </el-header>
          <el-main>
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
          </el-main>
        </el-container>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
  import { getCurrentInstance } from 'vue'
  import { Search } from '@element-plus/icons-vue'
  import {
    abForm as custForm,
    bpmButtons,
    abUrlForm,
    bpmTools,
    bpmApi,
    sysApi,
    abTools,
  } from '~/agilebpm'
  import { abT } from '@/i18n'
  import { ElMessageBox } from 'element-plus'
  import { useTabsStore } from '@/store/modules/tabs'

  const { proxy } = abTools.useCurrentInstance()
  const vueContext = getCurrentInstance()
  const { changeTabsMeta } = useTabsStore()

  const bpmButtonsR = ref(null)

  const submitUserCascaderRef = ref(null)

  const submitUserCascader = reactive({
    modelValue: [] as any[],
    getUserId() {
      return submitUserCascader.modelValue &&
        submitUserCascader.modelValue.length
        ? submitUserCascader.modelValue[
            submitUserCascader.modelValue.length - 1
          ]
        : ''
    },
    options: [] as any[],
    props: {
      lazy: true,
      lazyLoad(node: any, resolve: any) {
        const { value, level } = node
        // 初次加载
        if (!value && level == 0) {
          bpmApi.task
            .getIdentityLink(info.taskId)
            .then(({ data }) => {
              const nodes = data.map((ele: any) => ({
                label: ele.assign,
                type: ele.type,
                value: ele.id,
                leaf: ele.type === 'user',
              }))
              resolve(nodes)
            })
            .finally(() => (node.loading = false))
        } else {
          sysApi.sysUser
            .queryGroupUserById({
              groupType: node.data.type,
              groupId: value,
            })
            .then(({ data }) => {
              const nodes: any[] = data.map((ele: any) => ({
                label: ele.assign,
                type: ele.type,
                value: ele.id,
                leaf: true,
              }))
              resolve(nodes)
            })
            .finally(() => (node.loading = false))
        }
      },
    },
    clear() {
      const cascaderPanelRef = submitUserCascaderRef!.value!.cascaderPanelRef
      // 清理选中
      cascaderPanelRef.clearCheckedNodes()
      submitUserCascader.modelValue = []
      submitUserCascader.options = []
    },
  })

  const info = reactive({
    loading: false,
    taskId: proxy?.$route.params.id || proxy?.$route.query.id,
    taskName: '',
    instId: '',
    tabsActiveName: 'testConfig',
    bpmDataLoaded: false,
    bpmData: {} as Ref<BpmData>,
    formData: {},
    height:
      proxy.$route.query.abIframeType == 'iframe'
        ? 'auto'
        : `${window.innerHeight - 315}px`,
  })

  const submitAfterClear = () => {
    submitUserCascader.clear()
    info.bpmData = {}
    info.formData = {}
    info.tabsActiveName = 'testConfig'
  }

  const setTestConfigSubmitUser = (dataList: any[]) => {
    if (!dataList || !dataList.length) return

    const [data] = dataList

    const cascaderPanelRef = submitUserCascaderRef!.value!.cascaderPanelRef
    // 清理选择
    cascaderPanelRef.clearCheckedNodes()

    // 新的选项
    const newOptions: any[] = []

    const recursionNode = (node: any, pushList: any[]) => {
      if (node.value == data.id) {
        nextTick(() => (submitUserCascader.modelValue = node.pathValues))
        throw new Error('Already Exists')
      }
      pushList.push(node.data)
      if (node.children) {
        node.data.children = []
        node.children.forEach((child: any) =>
          recursionNode(child, node.data.children)
        )
      }
    }

    try {
      cascaderPanelRef.menus
        .flat()
        .forEach((node: any) => recursionNode(node, newOptions))
    } catch (error: any) {
      if (error.message == 'Already Exists') return
      throw error
    }

    newOptions.push({
      label: `(用户)${data.name}`,
      value: data.id,
      type: 'user',
      leaf: true,
    })

    nextTick(() => {
      submitUserCascader.modelValue = [data.id]
      submitUserCascader.options = newOptions
    })
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
        // 劫持按钮处理
        button.doAction = buttonDoAction
        buttonList.push(button)
      })

    info.bpmData.buttonList = buttonList
  }

  const buttonDoAction = async (actionData: any, button: any) => {
    const submitUserId = submitUserCascader.getUserId()
    // 绑定处理人
    const extendConf = actionData.extendConf || (actionData.extendConf = {})
    if (submitUserId) {
      extendConf.instanceTest = { userId: submitUserId }
    } else {
      extendConf.instanceTest = {}
    }

    const instanceTest =
      extendConf.instanceTest || (extendConf.instanceTest = {})

    if (submitUserCascader.modelValue && submitUserCascader.modelValue.length) {
      instanceTest.userId =
        submitUserCascader.modelValue[submitUserCascader.modelValue.length - 1]
    }

    const { data } = await bpmApi.bpmData.doAction(actionData)

    // 这类按钮发送请求不连续任务处理
    if (['signManage', 'carbonCopy', 'reminder'].includes(button.actionName)) {
      await ElMessageBox.alert(
        `${abT(button.name)} ${abT('page.common.operateSuccess', '操作成功')}!`,
        abT('page.common.promptInformation', '提示信息'),
        {
          confirmButtonText: abT('page.common.ok', '确定'),
        }
      )
      return
    }

    // 处理下步任务
    await doNextTask(data?.id, button)
  }

  const doNextTask = async (nextTaskId: any, button: any) => {
    if (!nextTaskId) {
      const { data: taskId } = await bpmApi.instanceTest.getNextRunningTaskId(
        info.instId
      )
      nextTaskId = taskId
    }

    // 有任务继续处理
    if (nextTaskId) {
      const boxAnswer = await (async function () {
        try {
          return await ElMessageBox.confirm(
            '任务处理成功，是否连续处理下一步任务？',
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }
          )
        } catch (error) {
          return 'cancel'
        }
      })()
      bpmButtonsR.value.back('close')
      if (boxAnswer == 'confirm') {
        submitAfterClear()
        info.taskId = nextTaskId
        proxy.$router.push({
          name: 'BpmInstanceTestTaskComplete',
          query: { id: nextTaskId },
          replace: true,
        })
      }
      await fetchTaskData()
    } else {
      try {
        await ElMessageBox.alert(
          `${abT(button.name)} ${abT(
            'page.common.operateSuccess',
            '任务处理成功'
          )}!`,
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
  }

  const fetchTaskData = async () => {
    try {
      info.loading = true
      const { data: taskData } = await bpmApi.instanceTest.getTaskData(
        info.taskId,
        false,
        submitUserCascader.getUserId()
      )
      bpmTools.initBpmDataAndFormData(
        taskData,
        vueContext,
        info.bpmData,
        info.formData
      )
      info.bpmData.actionData.taskId = info.taskId
      info.instId = taskData.bpmInstance.id
      info.taskName = taskData.bpmTask.name

      changeTabsMeta({
        fullPath: proxy.$route.fullPath,
        meta: {
          newTitle: `${abT('menu.ProcessingTasks', '处理任务')}-${
            taskData.bpmInstance.title
          }`,
        },
      })
    } finally {
      info.loading = false
    }
    bpmButtonBind()
  }

  const tabChange = () => {
    info.bpmDataLoaded = false
    info.bpmData = {}
    info.formData = {}
    if (info.tabsActiveName == 'taskComplete') {
      try {
        fetchTaskData()
      } finally {
        info.bpmDataLoaded = true
      }
    }
  }

  onMounted(() => {
    if (!info.taskId) {
      bpmButtonsR.value.back('close')
    }
  })
</script>

<style lang="scss" scoped></style>

<template>
  <el-container v-loading="!info.bpmData.defName">
    <el-header v-if="info.bpmData.defName">
      <bpm-buttons :bpm-data="info.bpmData" class="print-hidden" />
    </el-header>
    <el-row v-if="info.bpmData.defName">
      <el-alert
        description="页面所操作的数据不会保存，仅做为流程临时测试！"
        show-icon
        title="操作须知"
        type="info"
      />
    </el-row>
    <el-divider class="dividermar" />
    <el-main
      v-if="info.bpmData.defName"
      v-loading="info.formLoading"
      :style="{ height: info.height }"
    >
      <el-tabs v-if="info.startTestComplete">
        <el-tab-pane label="表单">
          <ab-url-form
            v-if="info.bpmData.bpmForm.type == 'url'"
            ref="url"
            :bpm-form="info.bpmData.bpmForm"
          />
          <cust-form v-else ref="inner" :form-data="info.formData" />
        </el-tab-pane>
        <el-tab-pane label="审批历史">
          <el-table
            id="pagetable"
            border
            :data="info.approvalHistoryList"
            stripe
            style="width: 100%"
          >
            <el-table-column label="任务名称" prop="taskName" width="120" />
            <el-table-column label="创建时间" prop="createTime" width="160" />
            <el-table-column
              label="候选人"
              max-width="200"
              prop="assign"
              width="200"
            />
            <el-table-column label="处理人" prop="approverName" width="120" />
            <el-table-column label="用时" width="90">
              <template #default="scope">
                {{ abUtil.timeLag(scope.row.durationMs, 2) }}
              </template>
            </el-table-column>
            <el-table-column
              label="处理意见"
              max
              min-width="120"
              prop="opinion"
            />
            <el-table-column label="处理状态" prop="statusValue" width="100">
              <template #default="scope">
                <el-tag disable-transitions :type="scope.row.statusLabelCss">
                  {{ scope.row.statusValue }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column label="附件" prop="attachment" width="200">
              <template #default="scope">
                <ab-upload-file
                  v-if="scope.row.attachment"
                  v-model="scope.row.attachment"
                  disabled
                  hide-button
                />
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="流程图">
          <bpm-image-block
            :get-sub-flow-image-info="getSubFlowImageInfo"
            :image-info="info.flowImageInfo"
          />
        </el-tab-pane>
      </el-tabs>
      <div v-else>
        <ab-url-form
          v-if="info.bpmData.bpmForm.type == 'url'"
          ref="url"
          :bpm-form="info.bpmData.bpmForm"
        />
        <cust-form v-else ref="inner" :form-data="info.formData" />
      </div>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
  import { useTabsStore } from '@/store/modules/tabs'
  import { abT } from '@/i18n'
  import {
    abTools,
    abUrlForm,
    abUtil,
    bpmApi,
    bpmButtons,
    BpmImageBlock,
    bpmTools,
    abForm as custForm,
  } from '~/agilebpm'

  import { getCurrentInstance, Ref } from 'vue'
  const { proxy } = abTools.useCurrentInstance()
  const vueContext = getCurrentInstance()
  const { changeTabsMeta } = useTabsStore()
  const defKey = vueContext?.proxy?.$route.params.defKey
  const info: any = reactive({
    bpmData: {} as Ref<BpmData>,
    formData: {},
    height: `${window.innerHeight - 315}px`,
    formLoading: false,
    startTestComplete: false,
    approvalHistoryList: [],
    flowImageInfo: {},
    subFlowImageInfos: {},
  })

  const bizId = vueContext?.proxy?.$route.query.bizId

  const onStartTest = async (actionData: ActionData, button: BpmButton) => {
    info.formLoading = true
    // 调用接口流程启动测试
    const { data } = await bpmApi.bpmData.startTest(actionData).finally(() => {
      info.formLoading = false
    })

    ElMessage({
      message: abT('page.office.StartOperationSuccessful', '启动操作成功！'),
      type: 'success',
    })

    // 填充表单
    abUtil.easyClone(data.bpmForm, info.bpmData.bpmForm)
    // 填充表单数据
    abUtil.easyClone(data.innerFormData, info.formData)
    // 启动成功后，清理按钮列表
    info.bpmData.buttonList = []
    // 设置审批历史
    info.approvalHistoryList = data.approvalHistoryList
    // 流程图绘制
    info.flowImageInfo = data.flowImageInfo
    // 将流程实例赋值给流程图信息
    info.flowImageInfo.bpmInstance = data.bpmInstance
    info.subFlowImageInfos = data.subFlowImageInfos
    // 标记完成
    info.startTestComplete = true
  }

  // 获取子流程图信息
  const getSubFlowImageInfo = async (
    instanceId: any,
    defId: any,
    taskId: any
  ) => {
    const subFlowImageInfo = info.subFlowImageInfos.find(
      (item: any) => item.bpmInstance.id === instanceId
    )
    return { data: subFlowImageInfo.flowImageInfo }
  }

  // 获取流程启动数据
  const fetchStartFlowData = () => {
    bpmApi.bpmData.getStartFlowData(defKey, false, bizId).then(({ data }) => {
      bpmTools.initBpmDataAndFormData(
        data,
        vueContext,
        info.bpmData,
        info.formData
      )
      // 筛选出启动按钮
      const startBtn: any = info.bpmData.buttonList.find(
        (btn: any) => btn.actionName === 'start'
      )
      info.bpmData.buttonList = [{ ...startBtn, doAction: onStartTest }]
      changeTabsMeta({
        fullPath: proxy.$route.fullPath,
        meta: { title: `流程启动-${data.defName}` },
      })
    })
  }

  onMounted(() => {
    fetchStartFlowData()
  })
</script>

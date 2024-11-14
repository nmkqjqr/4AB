<template>
  <div class="comprehensive-table-container">
    <div ref="titleForm">
      <el-row class="vab-query-form" v-if="gloabDesc">
        <el-page-header :icon="ArrowLeft" @back="goBack">
          <template #content>
            <el-tooltip placement="top">
              <template #content>
                {{ gloabDesc }}
              </template>
              <span class="text-sm mr-2">
                {{ shotDesc }}
              </span>
            </el-tooltip>
          </template>
        </el-page-header>
        <el-divider />
      </el-row>
      <el-row class="vab-query-form">
        <el-col class="top-panel">
          <el-form
            ref="queryForm"
            :inline="true"
            :model="query"
            @submit.prevent
          >
            <el-form-item
              :label="$abT('bpm.office.processTitle', '流程标题')"
              prop="title$VLK"
            >
              <el-input
                v-model="query.title$VLK"
                :placeholder="
                  $abT('bpm.office.enterProcessTitle', '请输入流程标题')
                "
              />
            </el-form-item>
            <el-form-item>
              <el-button :icon="Search" type="primary" @click="search()">
                {{ $abT('page.common.search', '查询') }}
              </el-button>
              <el-button :icon="RefreshRight" @click="reset()">
                {{ $abT('page.common.reset', '重置') }}
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <!-- 关键字段设置minwith，特定枚举字段设置with（管理列、日期、状态、字典等），
         不重要字段放最后，管理列设置 fixed="right"
    -->
    <ab-table
      ref="abTable"
      v-model="selectedData"
      :checkable="false"
      :height="tableHeight"
      :query-param="query"
      row-key="id"
      :url="bpmApi.bpmPluginAgent.bpmAgentLogListUrl"
    >
      <ab-column
        :label="$abT('bpm.office.processName', '流程名称')"
        min-width="120"
        prop="flowInstanceName"
      />
      <ab-column
        :label="$abT('bpm.office.proxyNode', '代理节点')"
        min-width="90"
        prop="taskName"
      />
      <ab-column
        :label="$abT('bpm.office.agent', '代理人')"
        min-width="80"
        prop="targetUserNames"
      />
      <ab-column
        :ab-text-formatter="`0-${$abT(
          'bpm.office.agentStatus0',
          '代理'
        )}-success|1-${$abT('bpm.office.agentStatus1', '已追回')}-danger`"
        :label="$abT('bpm.office.agentStatus', '代理状态')"
        prop="status"
        width="120"
      />
      <ab-column
        :label="$abT('page.common.desc', '描述')"
        min-width="200"
        prop="desc"
      />
      <ab-column
        :label="$abT('bpm.office.approvedBy', '审批人')"
        prop="approverName"
        width="120"
      />
      <ab-column
        :label="$abT('bpm.office.approvalTime', '审批时间')"
        prop="approveTime"
        width="180"
      />
      <ab-column
        ab-tag-type="approveStatusLabelCss"
        :label="$abT('bpm.office.approveResult', '处理结果')"
        prop="approveStatusValue"
        width="150"
      />
      <ab-column
        :label="$abT('page.common.createTime', '创建时间')"
        prop="createTime"
        width="180"
      />
      <ab-column
        ab-template="edit"
        fixed="right"
        :label="$abT('page.common.operate', '操作')"
        width="200"
      />
      <template #edit="{ scope }">
        <el-button
          text
          type="primary"
          @click="openImageDialog(scope.row.flowInstanceId)"
        >
          {{ $abT('bpm.office.flowChart', '流程图') }}
        </el-button>
        <el-button
          v-if="
            scope.row.status === 0 && scope.row.approveStatus === 'processing'
          "
          text
          type="primary"
          @click="
            sendAction(
              bpmApi.bpmPluginAgent.recoverTaskUrl + scope.row.id,
              $abT('bpm.office.confirmRecoverTask', '确定追回 {a} 吗?', {
                a: scope.row.taskName,
              })
            )
          "
        >
          {{ $abT('bpm.office.recoverTask', '追回') }}
        </el-button>
      </template>
    </ab-table>
    <bpm-image-dialog
      v-if="flowImageInfo.showImageDialog"
      :bpm-data="flowImageInfo.bpmData"
      :is-show="flowImageInfo.showImageDialog"
      :title="$abT('bpm.office.flowChart', '流程图')"
      @dialog-cancel="dialogCancel"
    />
  </div>
</template>

<script lang="ts">
  // eslint-disable-next-line no-unused-vars
  import { reactive, defineComponent } from 'vue'
  import { abTableMix, bpmApi, abTools, BpmImageDialog } from '~/agilebpm'
  import { ElPageHeader } from 'element-plus'
  import {
    Delete,
    Edit,
    Search,
    Plus,
    RefreshRight,
    ArrowLeft,
  } from '@element-plus/icons-vue'

  export default defineComponent({
    name: 'BpmMyAgentLogList',
    components: { BpmImageDialog },
    mixins: [abTableMix],
    setup() {
      const query = reactive({
        title$VLK: '',
        'bual.configId$VLK': '',
      })
      const { proxy } = abTools.useCurrentInstance()
      query['bual.configId$VLK'] = proxy.$route.query.configId as string

      const flowImageInfo = reactive({
        showImageDialog: false,
        bpmData: {
          actionData: {
            instanceId: '',
          },
        } as BpmData,
      })

      const openImageDialog = (instaceId: string) => {
        flowImageInfo.showImageDialog = true
        flowImageInfo.bpmData.actionData.instanceId = instaceId
      }

      const dialogCancel = (isShow: boolean) => {
        flowImageInfo.showImageDialog = false
      }
      const assignInfo = (str: string) => {
        const result = []
        const strList = str.split(',')
        for (const index in strList) {
          result.push(strList[index].split('/')[1])
        }
        return result.join(',')
      }

      const gloabDesc = ref('')
      const shotDesc = ref('')

      if (proxy.$route.query.configId) {
        bpmApi.bpmPluginAgent
          .getDesc(proxy.$route.query.configId)
          .then((res: any) => {
            gloabDesc.value = res.data
            shotDesc.value = res.data
            if (gloabDesc.value && gloabDesc.value.length > 30) {
              shotDesc.value = gloabDesc.value.substr(0, 30) + '...'
            }
          })
      }

      const goBack = () => {
        abTools.closeTab(proxy.$route.fullPath)
        proxy.$router ? proxy.$router.back() : window.history.back()
      }
      return {
        query,
        bpmApi,
        Delete,
        Edit,
        Search,
        Plus,
        ArrowLeft,
        RefreshRight,
        flowImageInfo,
        openImageDialog,
        dialogCancel,
        assignInfo,
        gloabDesc,
        shotDesc,
        goBack,
      }
    },
  })
</script>

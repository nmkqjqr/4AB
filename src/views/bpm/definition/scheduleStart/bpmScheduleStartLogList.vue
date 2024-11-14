<template>
  <div class="comprehensive-table-container">
    <div ref="titleForm">
      <el-row class="vab-query-form">
        <el-col class="top-panel">
          <el-form
            ref="queryForm"
            :inline="true"
            label-width="160px"
            :model="queryParams"
            @submit.prevent
          >
            <el-form-item :label="$abT('page.flowTimingStart.executionSuccess','执行成功')" prop="bssl.successful$NEQ">
              <el-select v-model="queryParams['bssl.successful$NEQ']" :placeholder="$abT('page.common.all', '全部')" clearable>
                <el-option :label="$abT('page.common.yes','是')" value="1" />
                <el-option :label="$abT('page.common.no','否')" value="0" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$abT('page.flowTimingStart.initiationTime','发起时间')" prop="bssl.createTime$DBT">
              <el-date-picker
                v-model="createTimeRange"
                :default-time="[
                  new Date(0, 0, 0, 0, 0, 0),
                  new Date(0, 0, 0, 23, 59, 59),
                ]"
                end-placeholder="End Date"
                start-placeholder="Start Date"
                type="datetimerange"
                value-format="YYYY-MM-DD HH:mm:ss"
                @change="createTimeRangeChange"
              />
            </el-form-item>
            <el-form-item>
              <el-button :icon="Search" type="primary" @click="search()">
                {{ $abT('page.common.search',  '查询' ) }}
              </el-button>
              <el-button :icon="RefreshRight" @click="resetQueryParams">
                {{ $abT('page.common.reset','重置') }}
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-space direction="vertical">
        <el-button :icon="Back" type="primary" @click="back">{{ $abT('page.common.back','返回') }}</el-button>
      </el-space>
    </div>

    <ab-table
      ref="abTable"
      :height="tableHeight"
      :query-param="queryParams"
      row-key="id"
      :url="bpmApi.scheduleStart.bpmScheduleStartLogsUrl"
    >
      <ab-column
        :default-sort="{ order: 'ascending', prop: 'bssl.create_time_' }"
        :label="$abT('page.flowTimingStart.initiationTime','发起时间')"
        prop="createTime"
        width="190"
      />
      <ab-column :label="$abT('page.common.Initiator','发起人')" prop="creator" width="150" />
      <ab-column
        :label="$abT('page.flowTimingStart.executionSuccess','执行成功')"
        width="120"
        ab-template="successful"
      />
      <template #successful="{ scope }">
        <el-tag v-if="scope.row.successful === 0" type="danger">{{ $abT('page.common.no','否') }}</el-tag>
        <el-tag  v-if="scope.row.successful === 1" type="success">{{ $abT('page.common.yes','是') }}</el-tag>
      </template>
      <ab-column :label="$abT('page.insList.processTitle','流程标题')" min-width="250" prop="title" />
      <ab-column ab-template="status" :label="$abT('bpm.office.processStatus','流程状态')" width="120" />
      <template #status="{ scope }">
        <el-tag
          v-if="scope.row.status"
          :effect="light"
          :type="scope.row.statusCss"
        >
          {{ scope.row.statusDesc }}
        </el-tag>
      </template>
      <ab-column ab-template="edit" fixed="right" :label="$abT('page.common.manage','管理')" width="290" />
      <template #edit="{ scope }">
        <router-link
          v-if="scope.row.successful"
          v-ab-btn-rights:scheduleStart_details
          :to="{
            name: 'BpmInstanceDetail',
            query: { instId: scope.row.instId },
          }"
        >
          <el-button text type="primary">{{ $abT('page.common.details','详情') }}</el-button>
        </router-link>
        <el-button
          v-if="scope.row.successful"
          v-ab-btn-rights:scheduleStart_ImageInfo
          text
          type="primary"
          @click="openImageDialog(scope.row.instId)"
        >
          {{ $abT('bpm.office.flowChart','流程图') }}
        </el-button>
        <el-button
          v-if="!scope.row.successful"
          v-ab-btn-rights:scheduleStart_exceptionStack
          text
          type="primary"
          @click="showExceptionMessage(scope.row)"
        >
          {{ $abT('page.flowTimingStart.errorMsg','异常信息') }}
        </el-button>
      </template>
    </ab-table>
    <bpm-image-dialog
      v-if="flowImageInfo.showImageDialog"
      :bpm-data="flowImageInfo.bpmData"
      :is-show="flowImageInfo.showImageDialog"
      :title="$abT('bpm.office.flowChart','流程图')"
      @dialog-cancel="flowImageInfo.showImageDialog = false"
    />
    <el-dialog
      v-model="exceptionMessageDialogOptions.visiable"
      append-to-body
      :title="$abT('page.flowTimingStart.errorMsg','异常信息')"
      width="50%"
    >
      <el-row style="max-height: 60vh; overflow: scroll">
        <el-col :span="24">
          <pre>{{ exceptionMessageDialogOptions.content }}</pre>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script lang="ts">
  import { abTableMix, bpmApi, abTools, BpmImageDialog } from '~/agilebpm'

  export default { mixins: [abTableMix] }
</script>

<script lang="ts" setup>
  import { useTabsStore } from '@/store/modules/tabs'
  import { getCurrentInstance } from 'vue'

  const { proxy, refs } = abTools.useCurrentInstance()
  const currentInstance = getCurrentInstance()

  const { delVisitedRoute } = useTabsStore()
  const route = useRoute()

  const exceptionMessageDialogOptions = reactive({
    visiable: false,
    content: '',
  })

  const queryParams = reactive({
    'bssl.startId$VEQ': proxy.$route.query.id,
    'bssl.createTime$DLE': '',
    'bssl.createTime$DGE': '',
    'bssl.successful$NEQ': '',
  })

  const createTimeRange = ref([])

  /**
   * 流程图信息
   */
  const flowImageInfo = reactive({
    showImageDialog: false,
    bpmData: {
      actionData: {
        instanceId: '',
      },
    } as BpmData,
  })

  /**
   * 打开流程图对话框
   *
   * @param instId 流程实例ID
   */
  function openImageDialog(instId: string) {
    flowImageInfo.showImageDialog = true
    flowImageInfo.bpmData.actionData.instanceId = instId
  }

  /**
   * 创建时间范围变更
   */
  function createTimeRangeChange() {
    const [startTime, endTime] = createTimeRange.value
    queryParams['bssl.createTime$DGE'] = startTime
    queryParams['bssl.createTime$DLE'] = endTime
  }

  /**
   * 重置查询参数
   */
  function resetQueryParams() {
    createTimeRange.value = []
    Object.keys(queryParams)
      .filter((key) => key !== 'bssl.startId$VEQ')
      .forEach((key) => (queryParams[key] = ''))
    currentInstance?.proxy.reset()
  }

  /**
   * 回退
   */
  function back() {
    delVisitedRoute(route.path)
    proxy.$router.push({
      name: 'BpmScheduleStartList',
    })
  }

  /**
   * 显示异常数据
   * @param rowData 行数据
   */
  async function showExceptionMessage(rowData: any) {
    if (!rowData.exceptionStack) {
      const { data } =
        await bpmApi.scheduleStart.getBpmScheduleStartLogExceptionStack(
          rowData.id
        )
      rowData.exceptionStack = data
    }
    exceptionMessageDialogOptions.content = rowData.exceptionStack || ''
    exceptionMessageDialogOptions.visiable = true
  }
</script>

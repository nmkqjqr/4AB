<template>
  <el-table
    id="pagetable"
    border
    class="pagetable"
    :data="tableData"
    style="width: 100%"
  >
    <el-table-column
      :label="$abT('bpm.office.taskName', '任务名称')"
      prop="taskName"
      width="150"
    />
    <el-table-column
      :label="$abT('page.common.createTime', '创建时间')"
      prop="createTime"
      width="160"
    />
    <el-table-column
      :label="$abT('bpm.office.candidate', '候选人')"
      max-width="200"
      prop="assign"
      width="160"
    >
      <template #default="scope">
        <ab-identity-detail
          :approver-name="scope.row.assign"
          :assign-info="scope.row.assignInfo"
          :type="assign"
        />
      </template>
    </el-table-column>
    <el-table-column
      :label="$abT('bpm.office.approvedBy', '审批人')"
      prop="approverName"
      width="120"
    >  
    </el-table-column>
    <el-table-column
      :label="$abT('bpm.office.timeConsuming', '处理用时')"
      width="150"
    >
      <template #default="scope">
        {{ abUtil.timeLag(scope.row.durationMs, 2) }}
      </template>
    </el-table-column>
    <el-table-column
      :label="$abT('bpm.office.HandlingOpinions', '处理意见')"
      min-width="240"
      prop="opinion"
    >
      <template #default="scope">
        <!-- <span>{{ scope.row.opinion }}</span> -->
        <el-tooltip
          v-if="scope.row.opinion && scope.row.opinion.length > 20"
          :content="scope.row.opinion"
          placement="top"
        >
          <el-text line-clamp="2">
            {{ scope.row.opinion }}
          </el-text>
        </el-tooltip>
        <el-text v-else line-clamp="2" :title="scope.row.opinion">
          {{ scope.row.opinion }}
        </el-text>
      </template>
    </el-table-column>
    <el-table-column
      :label="$abT('bpm.office.processingStatus', '处理状态')"
      prop="statusValue"
      width="150"
    >
      <template #default="scope">
        <el-tag disable-transitions :type="scope.row.statusLabelCss">
          {{ scope.row.statusValue }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
      :label="$abT('page.common.attachment', '附件')"
      prop="attachment"
      min-width="140"
    >
      <template #default="scope">
        <ab-upload-file
          v-if="scope.row.attachment"
          v-model="scope.row.attachment"
          disabled
          hide-button
          style="width:100%;"
        />
      </template>
    </el-table-column>
  </el-table>
  <div class="bottomBox"></div>
</template>

<script lang="ts" setup>
  import { bpmApi } from '@agilebpm/api'
  import * as abUtil from '@agilebpm/utils/ab-util'
  import { abUploadFile } from '@ab-core'
  import { abIdentityDetail } from '@ab-core'
  const emit = defineEmits(['toParentData'])
  const props = defineProps({
    instanceId: {
      type: String,
      default: null,
      required: true,
    },
    taskId: {
      type: String,
      default: null,
    },
    opinionId: {
      type: String,
      default: null,
    },
  })
  const tableData = ref([])
  //请求审批历史
  bpmApi.instance
    .bpmInstanGetOpinion(props.instanceId, props.taskId, props.opinionId)
    .then((result: any) => {
      tableData.value = result.data
      emit('toParentData', tableData.value)
    })

  const handleAssignInfo = (assignInfo: string) => {
    if (!assignInfo || assignInfo.length == 0) {
      return
    }
    return abUtil.handleAssignInfo(assignInfo, '-')
  }
</script>
<style lang="scss" scoped>
  // :deep(table) {
  //   table-layout: auto !important;
  // }
  .bottomBox {
    height: 50px;
  }
  :deep(.el-table__header-wrapper .el-table__header) {
    width: 100% !important;
  }
  :deep(.el-table__body-wrapper .el-table__body) {
    width: 100% !important;
  }
</style>

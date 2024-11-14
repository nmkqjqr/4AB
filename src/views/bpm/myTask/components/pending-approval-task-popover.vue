<template>
  <el-popover
    placement="left"
    :width="600"
    trigger="click"
    v-if="data && data.length"
  >
    <template #reference>
      <el-link type="primary" :underline="true">
        {{ data[0].nodeName }}
      </el-link>
    </template>
    <el-table :data="data">
      <el-table-column
        prop="nodeName"
        :label="$abT('bpm.office.currentNode', '当前环节')"
      />
      <el-table-column
        prop="assignNames"
        :label="$abT('bpm.office.candidate', '候选人')"
      >
        <template #default="scope">
          <ab-identity-detail
            :approver-name="scope.row.assignNames"
            :assign-info="scope.row.assignInfo"
            :type="assign"
          />
        </template>
      </el-table-column>
    </el-table>
  </el-popover>
</template>
<script lang="ts">
  // @ts-ignore
  import { abIdentityDetail } from '~/agilebpm'

  export default {
    name: 'PendingApprovalTaskPopover',
  }
</script>
<script setup lang="ts">
  const props = defineProps({
    // 接收数据：
    data: { required: true, type: Array<any> },
  })

  const { data } = toRefs(props)
</script>

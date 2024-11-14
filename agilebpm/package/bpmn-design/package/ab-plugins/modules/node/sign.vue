<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>节点会签</span>
        <el-button text @click="deletePlugin()">
          <el-icon>
            <Close />
          </el-icon>
        </el-button>
      </div>
    </template>
    <el-form label-suffix="：" label-width="120px" :model="pluginData">
      <el-form-item label="是否开启">
        <el-switch
          v-model="pluginData.open"
          active-text="是"
          inactive-text="否"
          inline-prompt
        />
      </el-form-item>
      <span v-show="pluginData.open">
        <el-form-item label="审批方式">
          <el-radio-group v-model="pluginData.approvalType">
            <el-tooltip
              content="根据配置的节点人员进行串行逐个审批"
              effect="dark"
              placement="top-start"
            >
              <el-radio-button label="serial">串行</el-radio-button>
            </el-tooltip>
            <el-tooltip
              content="根据配置的节点人员进行并行同时审批"
              effect="dark"
              placement="top-start"
            >
              <el-radio-button label="parallel">并行</el-radio-button>
            </el-tooltip>
            <el-tooltip
              content="根据配置的节点人员进行并行审批投票"
              effect="dark"
              placement="top-start"
            >
              <el-radio-button label="vote">投票</el-radio-button>
            </el-tooltip>
          </el-radio-group>
        </el-form-item>
        <span v-show="pluginData.approvalType == 'vote'">
          <el-form-item label="同意策略">
            <el-radio-group v-model="pluginData.countType">
              <el-radio-button label="percent">百分比</el-radio-button>
              <el-radio-button label="number">投票数</el-radio-button>
            </el-radio-group>
            <el-input-number
              v-show="pluginData.countType == 'percent'"
              v-model="pluginData.percent"
              :max="100"
              :min="1"
              placeholder="百分比"
              style="margin-left: 10px"
            />
            <span v-show="pluginData.countType == 'percent'">%</span>
            <el-input-number
              v-show="pluginData.countType == 'number'"
              v-model="pluginData.number"
              :min="1"
              placeholder="投票数"
              style="margin-left: 10px"
            />
            <span v-show="pluginData.countType == 'number'">票</span>
          </el-form-item>
          <el-form-item label="结束策略">
            <el-radio-group v-model="pluginData.endType">
              <el-radio-button label="all">所有人都需要投票</el-radio-button>
              <el-radio-button label="satisfy">
                满足同意策略后不再等待剩下人员投票
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="投票不通过时">
            <el-radio-group v-model="pluginData.opposeAction">
              <el-radio-button label="oppose">标记结果为反对</el-radio-button>
              <el-radio-button label="reject">执行驳回操作</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </span>
        <el-form-item label="特权人">
          <sign-privileger-dialog
            v-model="pluginData.privilegers"
            :approval-type="pluginData.approvalType"
          />
        </el-form-item>
        <el-form-item label="按钮配置">
          <sign-btn-dialog v-model="pluginData.buttons" />
        </el-form-item>
      </span>
    </el-form>
  </el-card>
</template>
<script lang="ts" setup>
  import { Close } from '@element-plus/icons-vue'
  import { defineProps, PropType } from 'vue'
  import SignPrivilegerDialog from '~/agilebpm/package/ab-common-resource/bpmDesign/signPrivilegerDialog.vue'
  import SignBtnDialog from '~/agilebpm/package/ab-common-resource/bpmDesign/signBtnDialog.vue'

  const props = defineProps({
    pluginData: { required: true, type: Object as PropType<Sign> },
    nodeConfig: { required: true, type: Object as PropType<NodeConfig> },
    flowSetting: { required: true, type: Object as PropType<FlowSetting> },
  })

  const { pluginData } = toRefs(props)

  const deletePlugin = () => {
    delete props.nodeConfig.plugins['sign']
  }
</script>
<style scoped lang="scss">
  :deep(.el-card__header) {
    padding: 4px 12px !important;
  }
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 36px;
    line-height: 36px;
  }
</style>

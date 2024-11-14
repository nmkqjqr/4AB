<template>
  <el-form label-width="110px">
    <el-divider content-position="center">下一步的操作设定</el-divider>
    <el-form-item label="自由分支选择：">
      <el-switch
        v-model="bpmProperties.custGatewayRouter"
        active-text="允许"
        inactive-text="不允许"
      />
    </el-form-item>
    <el-form-item label="自由人员选择：">
      <el-select
        v-model="bpmProperties.custNodeUser"
        clearable
        placeholder="不允许"
      >
        <el-option label="不允许" value="no" />
        <el-option label="节点预置人员选择-必选" value="nodeUserRequired" />
        <el-option label="节点预置人员选择-非必选" value="nodeUser" />
        <el-option label="所有用户选择" value="allUser" />
      </el-select>
    </el-form-item>
    <el-form-item label="无候选人策略：">
      <el-select
        v-model="bpmProperties.emptyUserStrategy"
        clearable
        placeholder="默认使用全局配置"
      >
        <el-option label="忽略" value="ignore" />
        <el-option label="任务无候选人抛出异常" value="exception" />
        <el-option label="为空时跳过当前任务" value="doSKip" />
        <el-option label="转交给系统管理员" value="turnAdmin" />
      </el-select>
    </el-form-item>
    <el-form-item label="是否弹意见窗：">
      <el-select
        v-model="bpmProperties.requiredOpinion"
        clearable
        placeholder="默认使用全局配置"
      >
        <el-option label="弹" value="true" />
        <el-option label="不弹" value="false" />
        <el-option label="意见必填" value="trueAndRequired" />
      </el-select>
    </el-form-item>
    <el-divider v-show="!isStartNode" content-position="center">
      驳回策略
    </el-divider>
    <el-form-item v-show="!isStartNode" label="驳回后流转方式">
      <el-select
        v-model="bpmProperties.backModel"
        clearable
        placeholder="默认使用全局配置"
      >
        <el-option label="按流程图运行" value="normal" />
        <el-option label="返回驳回节点" value="back" />
      </el-select>
    </el-form-item>
    <el-form-item v-show="!isStartNode" label="驳回后执行人：">
      <el-select
        v-model="bpmProperties.backUserModel"
        clearable
        placeholder="默认使用全局配置"
      >
        <el-option label="历史执行人" value="history" />
        <el-option label="节点配置人" value="normal" />
      </el-select>
    </el-form-item>
    <el-form-item v-show="!isStartNode" label="限定可驳回节点">
      <el-select
        v-model="bpmProperties.backNodeArr"
        clearable
        collapse-tags
        collapse-tags-tooltip
        multiple
        placeholder="默认驳回前一节点"
      >
        <el-option
          v-for="(val, key) in flowSetting.nodeMap"
          v-show="val.nodeType != 'StartEvent'"
          :key="key"
          :label="val.nodeName"
          :value="val.nodeKey"
        />
      </el-select>
    </el-form-item>
    <el-form-item v-show="!isStartNode" label="允许自由驳回：">
      <el-switch
        v-model="bpmProperties.allowFreeBack"
        active-text="允许"
        inactive-text="不允许"
      />
    </el-form-item>
    <el-divider content-position="center">撤回</el-divider>
    <el-form-item label="是否允许撤回：">
      <el-select
        v-model="bpmProperties.allowRecall"
        clearable
        placeholder="默认使用全局配置"
      >
        <el-option label="允许" :value="true" />
        <el-option label="不允许" :value="false" />
      </el-select>
    </el-form-item>
    <el-form-item
      v-show="
        (bpmProperties.allowRecall && isStartNode) ||
        bpmProperties.allowRecallPreNodeId
      "
      label="允许撤回范围"
    >
      <el-select
        v-model="bpmProperties.allowRecallPreNodeId"
        clearable
        placeholder="发起人随时可撤回"
      >
        <el-option
          v-for="node in userNodeList"
          :key="node.nodeKey"
          :label="node.nodeName + '-之前'"
          :value="node.nodeKey"
        />
      </el-select>
    </el-form-item>
    <el-form-item v-show="isStartNode" label="是否允许撤销：">
      <el-select
        v-model="bpmProperties.allowRevoke"
        clearable
        placeholder="默认使用全局配置"
      >
        <el-option label="允许" :value="true" />
        <el-option label="不允许" :value="false" />
      </el-select>
    </el-form-item>
    <el-form-item
      v-show="
        (bpmProperties.allowRevoke && isStartNode) ||
        bpmProperties.allowRevokePreNodeId
      "
      label="允许撤销范围"
    >
      <el-select
        v-model="bpmProperties.allowRevokePreNodeId"
        clearable
        placeholder="发起人随时可撤销"
      >
        <el-option
          v-for="node in userNodeList"
          :key="node.nodeKey"
          :label="node.nodeName + '-之前'"
          :value="node.nodeKey"
        />
      </el-select>
    </el-form-item>
    <el-divider content-position="center">任务紧急设定</el-divider>
    <el-form-item label="是否紧急任务：">
      <el-select
        v-model="bpmProperties.isUrgencyTask"
        clearable
        placeholder="默认使用全局配置"
      >
        <el-option label="是" :value="true" />
        <el-option label="否" :value="false" />
      </el-select>
    </el-form-item>
    <el-form-item label="任务限时：">
      <span
        v-show="
          !bpmProperties.taskTimeLimit || bpmProperties.taskTimeLimit == 0
        "
      >
        默认使用全局配置
      </span>
      <ab-times v-model="bpmProperties.taskTimeLimit" />
    </el-form-item>
    <el-form-item label="自定义任务时效">
      <el-select
        v-model="bpmProperties.custTaskTimeLimit"
        clearable
        placeholder="默认使用全局配置"
      >
        <el-option label="允许用户自定义下一步时效" :value="true" />
        <el-option label="禁止用户自定义下一步时效" :value="false" />
      </el-select>
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
  import { PropType } from 'vue'
  import { abTimes } from '@ab-core'
  const props = defineProps({
    bpmProperties: {
      required: true,
      type: Object as PropType<BpmNodeProperties>,
    },
    isStartNode: Boolean,
  })
  const { bpmProperties } = toRefs(props)

  const flowSetting = inject('flowSetting') as any
  const userNodeList = inject('userNodeList') as Array<NodeConfig>
</script>

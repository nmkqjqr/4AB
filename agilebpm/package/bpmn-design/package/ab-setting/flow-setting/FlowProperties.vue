<template>
  <el-form label-width="110px">
    <el-form-item label="无候选人策略：">
      <el-select v-model="bpmProperties.emptyUserStrategy">
        <el-option label="忽略" value="ignore" />
        <el-option label="任务无候选人抛出异常" value="exception" />
        <el-option label="为空时跳过当前任务" value="doSKip" />
        <el-option label="转交给系统管理员" value="turnAdmin" />
      </el-select>
    </el-form-item>
    <el-form-item label="是否允许撤回：">
      <el-switch
        v-model="bpmProperties.allowRecall"
        active-text="允许"
        inactive-text="不允许"
      />
    </el-form-item>
    <el-form-item label="是否允许撤销：">
      <el-switch
        v-model="bpmProperties.allowRevoke"
        active-text="允许"
        inactive-text="不允许"
      />
    </el-form-item>
    <el-form-item label="是否弹意见窗：">
      <el-radio-group v-model="bpmProperties.requiredOpinion">
        <el-radio-button label="不弹" value="false" />
        <el-radio-button label="弹" value="true" />
        <el-radio-button label="意见必填" value="trueAndRequired" />
      </el-radio-group>
    </el-form-item>
    <el-form-item label="驳回后流转方式">
      <el-radio-group v-model="bpmProperties.backModel">
        <el-radio-button label="normal">按流程图运行</el-radio-button>
        <el-radio-button label="back">返回驳回节点</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="驳回后执行人：">
      <el-radio-group v-model="bpmProperties.backUserModel">
        <el-radio-button label="history">历史执行人</el-radio-button>
        <el-radio-button label="normal">节点配置人</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="允许自由驳回：">
      <el-switch
        v-model="bpmProperties.allowFreeBack"
        active-text="允许"
        inactive-text="不允许"
      />
    </el-form-item>
    <el-form-item label="是否紧急任务：">
      <el-switch
        v-model="bpmProperties.isUrgencyTask"
        active-text="是"
        inactive-text="否"
      />
    </el-form-item>
    <el-form-item label="任务限时：">
      <span v-show="bpmProperties.taskTimeLimit < 1">无限时</span>
      <ab-times v-model="bpmProperties.taskTimeLimit" />
    </el-form-item>
    <el-form-item label="自定义任务时效">
      <el-switch
        v-model="bpmProperties.custTaskTimeLimit"
        active-text="允许"
        inactive-text="不允许"
      />
    </el-form-item>
    <el-form-item label="实例表单">
      <el-switch
        v-model="bpmProperties.instFormRealTime"
        active-text="实时跟进"
        class="ml-2"
        inactive-text="非实时"
        inline-prompt
        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
      />
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
  import { PropType } from 'vue'
  import { abTimes } from '@ab-core'
  const props = defineProps({
    bpmProperties: { required: true, type: Object as PropType<BpmProperties> },
  })
  const { bpmProperties } = toRefs(props)
</script>

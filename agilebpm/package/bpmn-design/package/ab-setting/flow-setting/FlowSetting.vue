<template>
  <div>
    <el-card shadow="never">
      <el-form label-width="120">
        <el-form-item label="流程名称：">
          <el-input v-model="flowSetting.flowName" type="input" />
        </el-form-item>
        <el-form-item label="流程描述：">
          <el-input v-model="flowSetting.flowDesc" type="textarea" />
        </el-form-item>
        <el-form-item label="流程状态：">
          <el-radio-group v-model="flowSetting.flowStatus">
            <el-radio label="draft">草稿</el-radio>
            <el-tooltip
              content="发布状态的流程不允许修改"
              effect="dark"
              placement="top"
            >
              <el-radio label="deploy">发布</el-radio>
            </el-tooltip>
            <el-tooltip
              content="禁用状态的流程，相关的实例、任务均临时无法操作。"
              effect="dark"
              placement="top"
            >
              <el-radio label="forbidden">禁用</el-radio>
            </el-tooltip>
          </el-radio-group>
        </el-form-item>
        <!--     <el-form-item label="信号定义：">
          <span>没有信号定义</span>
        </el-form-item> -->
      </el-form>
    </el-card>
    <el-collapse v-model="data.activeNames">
      <el-collapse-item name="form" title="全局默认表单配置">
        <el-card shadow="never">
          <bpm-form
            :bpm-form="flowSetting.defaultForm"
            :flow-setting="flowSetting"
            form-name="默认表单"
            permission-type="flow"
            :permission-value="`${flowKey}-default`"
          />
        </el-card>
      </el-collapse-item>
      <el-collapse-item name="printForm" title="流程实例，打印表单">
        <el-card shadow="never">
          <bpm-form
            :bpm-form="flowSetting.printForm"
            :flow-setting="flowSetting"
            form-name="打印表单"
            permission-type="flow"
            :permission-value="`${flowKey}-print`"
          />
          <el-divider />
          <bpm-form
            :bpm-form="flowSetting.instForm"
            :flow-setting="flowSetting"
            form-name="实例表单"
            permission-type="flow"
            :permission-value="`${flowKey}-inst`"
          />
        </el-card>
      </el-collapse-item>
      <el-collapse-item name="bo" title="业务对象">
        <el-card shadow="never">
          <bpm-bo :flow-setting="flowSetting" />
        </el-card>
      </el-collapse-item>
      <el-collapse-item name="button" title="流程实例详情按钮">
        <el-card shadow="never">
          <el-space wrap>
            <el-tag
              v-for="(btn, key) in instanceButtonList"
              :key="key"
              closable
              plain
              size="large"
              @close="abUtil.Arrays.remove(btn, instanceButtonList)"
            >
              {{ btn.name }}
            </el-tag>
            <ButtonConfig
              :button-list="instanceButtonList"
              :node-type="'instance_'"
            />
          </el-space>
        </el-card>
      </el-collapse-item>
      <el-collapse-item name="property" title="全局默认流程属性">
        <el-card shadow="never">
          <bpm-properites :bpm-properties="bpmProperties" />
        </el-card>
      </el-collapse-item>
      <el-collapse-item name="subject" title="标题、概要设置">
        <el-card shadow="never">
          <el-form label-position="top">
            <el-form-item label="流程标题：">
              <el-select
                v-model="data.rules"
                placeholder="标题参数"
                @change="flowSetting.subjectRule += data.rules"
              >
                <el-option-group label="标题通用变量">
                  <el-option
                    label="流程名"
                    value="{{bpmDefinition.name:流程名}}"
                  />
                  <el-option
                    label="发起人"
                    value="{{currentUser.fullName:发起人}}"
                  />
                  <el-option label="发起日" value="{{currentDate:发起日}}" />
                  <el-option
                    label="发起时间"
                    value="{{currentDateTime:发起时间}}"
                  />
                </el-option-group>
                <el-option-group
                  v-for="bo in boList"
                  :key="bo.code"
                  :label="bo.name + ' - 字段选择'"
                >
                  <el-option
                    v-for="column in bo.rel.table.columns"
                    :key="column.name"
                    :label="bo.name + '-' + column.comment"
                    :value="`{{bizData.${bo.code}.${column.code}:${column.comment}}}`"
                  />
                </el-option-group>
              </el-select>
              <flow-title v-model="flowSetting.subjectRule" />
            </el-form-item>
            <el-form-item label="流程概要：">
              <el-select
                v-model="flowSetting.summary"
                multiple
                placeholder="默认前三个字段为流程概要"
              >
                <el-option-group
                  v-for="bo in boList"
                  :key="bo.code"
                  :label="bo.name + ' - 字段选择'"
                >
                  <el-option
                    v-for="column in bo.rel.table.columns"
                    :key="column.name"
                    :label="bo.name + '-' + column.comment"
                    :value="`${bo.code}-${column.code}`"
                  />
                </el-option-group>
                <el-option-group label="只有一个空则不设置概要">
                  <el-option label="空" value="" />
                </el-option-group>
              </el-select>
            </el-form-item>
          </el-form>
        </el-card>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script setup lang="ts">
  import { PropType } from 'vue'
  import BpmProperites from './FlowProperties.vue'
  import BpmForm from './BpmFormConfig.vue'
  import BpmBo from './BpmBoConfig.vue'
  import * as abUtil from '~/agilebpm/utils/ab-util'
  import ButtonConfig from '../flow-setting/ButtonConfig.vue'
  import FlowTitle from './FlowTitle.vue'
  const boList = inject('boList') as any

  const props = defineProps({
    flowSetting: { required: true, type: Object as PropType<FlowSetting> },
  })
  const { bpmProperties, instanceButtonList } = toRefs(props.flowSetting)
  const { flowSetting } = toRefs(props)
  const data = reactive({
    activeNames: ['property', 'form', 'button', 'subject', 'bo'],
    rules: '',
  })
  const flowKey = inject('flowKey') as string
</script>
<style lang="scss" scoped>
  :deep(.el-form-item__label) {
    font-weight: 600 !important;
    color: #333;
  }
</style>

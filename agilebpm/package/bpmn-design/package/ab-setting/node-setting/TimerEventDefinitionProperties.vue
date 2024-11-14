<template>
  <el-card>
    <el-row>
      <el-divider content-position="left">开始时间（ISO-8601）</el-divider>
    </el-row>
    <el-row class="row-item">
      <el-radio-group
        v-model="nodeConfig.timeDateOption"
        size="small"
        @change="timeDateOptionChange"
      >
        <el-radio label="fix">指定时间</el-radio>
        <el-radio label="flowVariable">流程变量</el-radio>
        <el-radio label="express">时间表达式</el-radio>
      </el-radio-group>
      <el-divider />
      <el-date-picker
        v-if="nodeConfig.timeDateOption === 'fix'"
        v-model="nodeConfig.timeDate"
        :editable="false"
        format="YYYY-MM-DD HH:mm:ss"
        placeholder="开始时间（ISO-8601）"
        size="large"
        type="datetime"
        value-format="YYYY-MM-DDTHH:mm:ss"
        @change="changeTimeDate"
      />
      <el-row v-if="nodeConfig.timeDateOption === 'flowVariable'">
        <el-col :span="8">
          <el-select v-model="nodeConfig.timeDateType" @change="changeTimeDate" style="width:120px">
            <el-option label="循环时间" value="timeCycle" />
            <el-option label="持续时间" value="timeDuration" />
          </el-select>
        </el-col>
        <el-col :span="16">
          <el-select v-model="nodeConfig.timeDate" @change="changeTimeDate" style="width:240px">
            <el-option
              v-for="flowVar in info.flowVariables"
              :key="flowVar.value"
              :label="flowVar.label"
              :value="flowVar.value"
            />
          </el-select>
        </el-col>
      </el-row>
      <div v-if="nodeConfig.timeDateOption === 'express'">
        <el-input v-model="nodeConfig.timeDate" @blur="changeTimeDate">
          <template #prepend>
            <el-select
              style="width:120px"
              v-model="nodeConfig.timeDateType"
              @change="changeTimeDate"
            >
              <el-option label="循环时间" value="timeCycle" />
              <el-option label="持续时间" value="timeDuration" />
            </el-select>
          </template>
        </el-input>
      </div>
    </el-row>
    <el-row v-if="nodeConfig.nodeType === 'BoundaryTimerEvent'">
      <el-divider content-position="left">
        <el-checkbox
          v-model="nodeConfig.cancelActivity"
          label="取消活动"
          size="large"
          @change="changeTimeDate"
        />
      </el-divider>
    </el-row>
  </el-card>
</template>
<script setup lang="ts">
  import { defineProps, toRefs } from 'vue'

  const props = defineProps<{
    nodeConfig: TimerEventDefinitionConfig
  }>()

  const { nodeConfig } = toRefs(props)

  const scriptVariables = inject('scriptVariables') as any

  const info = reactive({
    flowVariables: [] as any[],
  })

  const bpmnInstances = (window as any)?.bpmnInstances

  const changeTimeDate = () => {
    const bpmnElement = bpmnInstances.bpmnElement
    const nodeConfigLocal = nodeConfig.value!

    if (nodeConfigLocal.nodeType === 'BoundaryTimerEvent') {
      // 更新取消事件
      bpmnInstances.modeling.updateProperties(bpmnElement, {
        cancelActivity: nodeConfigLocal.cancelActivity ? 'true' : 'false',
      })
    }
    const eventDefinition = bpmnElement.businessObject.eventDefinitions[0]
    ;['timeCycle', 'timeDuration', 'timeDate'].forEach(
      (key: string) => delete eventDefinition[key]
    )

    let expressField
    if (
      nodeConfigLocal.timeDateOption === 'fix' ||
      nodeConfigLocal.timeDateType === 'timeDuration'
    ) {
      expressField = 'timeDate'
    } else if (nodeConfigLocal.timeDateType === 'timeCycle') {
      expressField = 'timeCycle'
    }

    if (expressField && nodeConfigLocal.timeDate) {
      eventDefinition.set(
        expressField,
        bpmnInstances.moddle.create('bpmn:Expression', {
          body: nodeConfigLocal.timeDate,
        })
      )
    }
    bpmnInstances.modeling.updateProperties(eventDefinition, {})
  }

  const timeDateOptionChange = () => {
    const nodeConfigLocal = nodeConfig!.value

    // 变更-清空字段值
    nodeConfigLocal.timeDate = ''
    nodeConfigLocal.timeDateType = ''

    // 同步XML
    changeTimeDate()
  }

  /**
   * 读取BPMN配置赋值给nodeConfig
   */
  const uopgr = () => {
    const nodeConfigLocal = nodeConfig!.value
    // 当前选中元素
    const businessObject = bpmnInstances.bpmnElement.businessObject
    // 取消活动
    nodeConfigLocal.cancelActivity =
      businessObject.cancelActivity == undefined ||
      businessObject.cancelActivity == true
  }

  const initializeConfig = () => {
    const nodeConfigLocal = nodeConfig!.value
    // 如果选项为空，配置初始值
    if (!nodeConfigLocal.timeDateOption) {
      nodeConfigLocal.timeDateOption = 'fix'
    }
    if (
      nodeConfigLocal.nodeType === 'BoundaryTimerEvent' &&
      nodeConfigLocal.cancelActivity === undefined
    ) {
      nodeConfigLocal.cancelActivity = true
    }
    info.flowVariables = scriptVariables
      .filter((o: any) => o.value === 'variableScope')
      .flatMap((o: any) => o.children)
      .map((child: any) => ({
        label: `${child.key}（${child.label}）`,
        value: `#{${child.key}}`,
      }))

    // 初始化后同步一次XML
    changeTimeDate()
  }

  onMounted(initializeConfig)
</script>
<style lang="scss" scoped>
  .row-item {
    margin-bottom: 20px;
  }
</style>

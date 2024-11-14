<template>
  <el-card>
    <div v-for="condition in pageInfo.conditionList" :key="condition.targetRef">
      <el-divider content-position="left">
        {{ condition.targetName.substring(0, 13)
        }}{{ condition.targetName.length > 13 ? '...' : '' }}

        <condition-script-dialog
          v-if="condition.scriptRule"
          ref="script"
          v-model="condition.scriptRule"
          width="80%"
          @dialog-ok="dialogOk(condition)"
        />
      </el-divider>
      <pre
        >{{ AbFlowUtil.getScriptDesc(condition.scriptRule) }}
      </pre>
      <br />
    </div>
  </el-card>
</template>

<script setup lang="ts">
  import { PropType, toRaw } from 'vue'
  import conditionScriptDialog from '../../common/conditionScriptDialog.vue'
  import * as AbFlowUtil from '~/agilebpm/package/ab-common-resource/ab-flow-util'

  const props = defineProps({
    nodeConfig: { required: true, type: Object as PropType<GateNodeConfig> },
  })
  const { nodeConfig } = toRefs(props)

  const pageInfo = reactive({
    conditionList: [] as any,
    currentCondition: {} as any,
    gateWayObject: {} as any,
  })

  const dialogOk = (condition: any) => {
    // 赋值配置
    nodeConfig.value.outGoingConditions[condition.targetRef] =
      condition.scriptRule
    // 赋值BPMN XML
    const groovyScript = AbFlowUtil.getScriptScript(condition.scriptRule)
    const bpmnExeression = (window as any)?.bpmnInstances.moddle.create(
      'bpmn:FormalExpression',
      { body: groovyScript }
    )
    ;(window as any)?.bpmnInstances.modeling.updateProperties(
      toRaw(condition.sequenceFlow),
      {
        conditionExpression: bpmnExeression,
      }
    )
  }

  watch(
    () => props.nodeConfig.nodeKey,
    (newValue, oldValue) => {
      initNodeCondition()
    }
  )
  onMounted(() => {
    window.setTimeout(() => {
      initNodeCondition()
    }, 100)
  })
  // 不需要从流程中取脚本。而是存与配置中，每次脚本框确认时，设置到bpmnxml中， 单向的，该方法只用于初始化新增的分支路线
  const initNodeCondition = () => {
    if (!nodeConfig.value.outGoingConditions) {
      nodeConfig.value.outGoingConditions = {}
    }

    // 第一进来时设置为空
    pageInfo.conditionList.length = 0
    console.info((window as any)?.bpmnInstances?.bpmnElement)
    ;(window as any)?.bpmnInstances?.bpmnElement.outgoing.forEach(
      (element: any) => {
        const nodeKey = element.businessObject.targetRef.id
        const nodeName = element.businessObject.targetRef.name
        if (nodeName) {
          if (
            nodeConfig.value.outGoingConditions[nodeName] &&
            !nodeConfig.value.outGoingConditions[nodeKey]
          ) {
            nodeConfig.value.outGoingConditions[nodeKey] =
              nodeConfig.value.outGoingConditions[nodeName]
          }
          // 默认以nodeKey 为标识，修复旧数据错误使用nodename 作为标识了
          else if (!nodeConfig.value.outGoingConditions[nodeKey]) {
            nodeConfig.value.outGoingConditions[nodeKey] = {}
          }

          const condition = {
            targetName: nodeName,
            targetRef: nodeKey,
            scriptRule: nodeConfig.value.outGoingConditions[nodeKey],
            sequenceFlow: element,
          }
          pageInfo.conditionList.push(condition)
        }
      }
    )
  }
</script>
<style>
  pre {
    display: block;
    padding: 9.5px;
    margin: 0 0 10px;
    font-size: 13px;
    line-height: 1.42857143;
    color: #333;
    word-break: break-all;
    word-wrap: break-word;
    background-color: #f8f8f9;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
</style>

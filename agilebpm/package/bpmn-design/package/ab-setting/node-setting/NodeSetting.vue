<template>
  <el-card shadow="never">
    <el-form label-width="110px">
      <el-form-item label="节点KEY：">
        <el-input
          v-model="NodeId"
          type="input"
          @change="(val) => updateShape('id', val)"
          @click="nodeIdFoucs()"
        />
      </el-form-item>
      <el-form-item label="节点名字：">
        <el-input
          v-model="nodeConfig.nodeName"
          type="input"
          @input="updateShape('name')"
        />
      </el-form-item>
      <el-form-item label="节点描述：">
        <el-input v-model="nodeConfig.desc" type="textarea" />
      </el-form-item>
    </el-form>
  </el-card>
  <el-collapse v-model="data.activeNames">
    <el-collapse-item
      v-if="
        'InclusiveGateway,ExclusiveGateway'.indexOf(nodeConfig.nodeType) != -1
      "
      name="form"
      title="分支条件配置"
    >
      <exclusive-setting :node-config="nodeConfig" />
    </el-collapse-item>
    <el-collapse-item
      v-if="nodeConfig.nodeForm && isUserTask"
      name="form"
      title="节点任务表单"
    >
      <el-card shadow="never">
        <bpm-form
          :bpm-form="nodeConfig.nodeForm"
          :flow-setting="flowSetting"
          form-name="任务表单"
          permission-type="flowNode"
          :permission-value="`${flowKey}-${nodeConfig.nodeKey}-default`"
        />
      </el-card>
    </el-collapse-item>
    <el-collapse-item
      v-if="
        nodeConfig.nodeForm && isUserTask && nodeConfig.nodeType != 'StartEvent'
      "
      name="printForm"
      title="节点打印表单"
    >
      <el-card shadow="never">
        <bpm-form
          :bpm-form="nodeConfig.printForm"
          :flow-setting="flowSetting"
          form-name="打印表单"
          permission-type="flowNode"
          :permission-value="`${flowKey}-${nodeConfig.nodeKey}-print`"
        />
      </el-card>
    </el-collapse-item>
    <el-collapse-item
      v-if="isUserTask && nodeConfig.nodeType !== 'StartEvent'"
      name="user"
      title="节点人员"
    >
      <el-card>
        <node-user
          v-model="nodeConfig.plugins['nodeUser']"
          :current-nodekey="nodeConfig.nodeKey"
        />
      </el-card>
    </el-collapse-item>
    <el-collapse-item v-if="isUserTask" name="button" title="节点按钮">
      <el-card shadow="never">
        <el-space wrap>
          <el-tag
            v-for="(btn, key) in nodeConfig.buttonList"
            :key="key"
            closable
            plain
            size="large"
            @close="abUtil.Arrays.remove(btn, nodeConfig.buttonList)"
          >
            {{ btn.name }}
          </el-tag>
          <ButtonConfig
            :button-list="nodeConfig.buttonList"
            :node-type="nodeConfig.nodeType"
          />
        </el-space>
      </el-card>
    </el-collapse-item>

    <el-collapse-item
      v-if="isUserTask"
      name="property"
      title="节点属性配置信息"
    >
      <el-card>
        <node-properties
          :bpm-properties="nodeConfig.bpmProperties"
          :is-start-node="nodeConfig.nodeType == 'StartEvent'"
        />
      </el-card>
    </el-collapse-item>
    <!-- 外部子流程属性配置 -->
    <el-collapse-item
      v-if="nodeConfig.nodeType === 'CallActivity'"
      name="callActivityProperties"
      title="外部子流程配置"
    >
      <el-card>
        <call-activity-properties :node-config="nodeConfig" />
      </el-card>
    </el-collapse-item>
    <!-- 等待边界事件配置 -->
    <el-collapse-item
      v-if="
        'IntermediateCatchEvent,StartTimerEvent,BoundaryTimerEvent'.indexOf(
          nodeConfig.nodeType
        ) !== -1
      "
      name="intermediateCatchEvent"
      title="等待边界事件配置"
    >
      <timer-event-definition-properties :node-config="nodeConfig" />
    </el-collapse-item>
  </el-collapse>
</template>
<script setup lang="ts">
  import { PropType, watch } from 'vue'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import BpmForm from '../flow-setting/BpmFormConfig.vue'
  import NodeProperties from './NodeProperties.vue'
  import * as abUtil from '~/agilebpm/utils/ab-util'
  import NodeUser from './node-user/nodeUser.vue'
  import ExclusiveSetting from './exclusive-setting.vue'
  import ButtonConfig from '../flow-setting/ButtonConfig.vue'
  import CallActivityProperties from './CallActivityProperties.vue'
  import TimerEventDefinitionProperties from './TimerEventDefinitionProperties.vue'

  const date1 = new Date()
  onMounted(() => {
    const times = new Date().getTime() - date1.getTime()
    console.info(`----------------------节点属性渲染耗时 ${times} `)

    // 如果配置过打印表单，则默认展开打印tab
    if (nodeConfig.value.printForm && nodeConfig.value.printForm.pcFormKey) {
      data.activeNames.push('printForm')
    }
  })

  const props = defineProps({
    nodeConfig: { required: true, type: Object as PropType<NodeConfig> },
    flowSetting: {
      type: Object as PropType<FlowSetting>,
      required: true,
    },
  })
  watch(
    () => props.nodeConfig,
    (newValue, oldValue) => {
      if (!nodeConfig) return
      NodeId.value = nodeConfig.value.nodeKey
      if (
        nodeConfig.value.nodeKey ===
        (window as any).bpmnInstances.bpmnElement.businessObject.id
      ) {
        nodeConfig.value.nodeName = (
          window as any
        ).bpmnInstances.bpmnElement.businessObject.name
      }
    },
    { immediate: true }
  )

  /*   watch(
    () => (window as any).bpmnInstances.bpmnElement.businessObject.name,
    (newValue, oldValue) => {
      debugger
    },
    { deep: true }
  ) */

  const { nodeConfig } = toRefs(props)
  const NodeId = ref(nodeConfig.value.nodeKey)
  const data = reactive({
    tipNodeIdchange: false,
    activeNames: [
      'property',
      'user',
      'form',
      'button',
      'callActivityProperties',
      'intermediateCatchEvent',
    ],
  })
  const flowKey = inject('flowKey') as string

  const emits = defineEmits(['changeNodeId'])

  const nodeIdFoucs = () => {
    if (!data.tipNodeIdchange) {
      ElMessageBox.confirm(
        '修改节点KEY 可能对当前版本正运行的该任务产生影响，请确认是否存在运行中任务！',
        '警告',
        {
          confirmButtonText: '已确任该节点无任务',
          autofocus: true,
          closeOnClickModal: false,
          cancelButtonText: '不修改',
          type: 'warning',
        }
      )
        .then(() => {
          data.tipNodeIdchange = true
          return
        })
        .catch(() => {})
    }
  }

  const isUserTask = computed(() => {
    return ['UserTask', 'StartEvent'].indexOf(nodeConfig.value.nodeType) != -1
  })

  const updateShape = (key: string, val?: any) => {
    console.log(val)
    const bpmnElement = (window as any)?.bpmnInstances?.bpmnElement || {}
    if (key === 'id') {
      if (data.tipNodeIdchange) {
        if (val) {
          const back = (result) => {
            if (result) {
              ;(window as any).bpmnInstances.modeling.updateProperties(
                bpmnElement,
                {
                  id: val,
                  di: { id: `${val}_di` },
                }
              )
            } else {
              NodeId.value = nodeConfig.value['nodeKey']
            }
          }
          emits('changeNodeId', val, back)
          return
        } else {
          NodeId.value = nodeConfig.value.nodeKey
          ElMessage.warning('请输入有效值')
        }
      }
    }
    if (key === 'name') {
      ;(window as any).bpmnInstances.modeling.updateProperties(bpmnElement, {
        name: nodeConfig.value['nodeName'],
      })
      return
    }
  }
</script>
<style lang="scss" scoped>
  :deep(.el-form-item__label) {
    font-weight: 600 !important;
    color: #333;
  }
</style>

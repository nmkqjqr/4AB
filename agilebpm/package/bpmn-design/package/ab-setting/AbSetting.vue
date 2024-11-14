<template>
  <transition>
    <div class="process-panel__container" :style="{ width: `${width}px` }">
      <resizebar
        type="col"
        :width="width"
        @set-width="(val) => (width += val)"
      />
      <div v-if="width > 30" style="height: 100%; overflow: auto">
        <div class="process-panel__container_header">
          <span>属性设置</span>
          <el-icon :size="14" style="cursor: pointer" @click="width = 30">
            <DArrowRight />
          </el-icon>
        </div>
        <div style="width: 100%; height: 36px; background: #fff"></div>
        <div>
          <div v-if="currentNode?.nodeKey">
            <node-setting
              :flow-setting="flowSetting"
              :node-config="currentNode"
              @change-node-id="changeNodeId"
            />
          </div>
          <div v-if="!currentNode?.nodeKey">
            <flow-setting
              :element-object="elementBusinessObject"
              :flow-setting="flowSetting"
            />
          </div>
        </div>
      </div>
      <div v-else class="process-panel__container_header">
        <el-icon :size="14" style="cursor: pointer" @click="width = 380">
          <DArrowLeft />
        </el-icon>
      </div>
    </div>
  </transition>
</template>
<script>
  import { DArrowRight, DArrowLeft } from '@element-plus/icons-vue'
  import ElementBaseInfo from './base/ElementBaseInfo'
  import SignalAndMassage from './signal-message/SignalAndMessage'
  import FlowSetting from './flow-setting/FlowSetting'
  import NodeSetting from './node-setting/NodeSetting'
  import { ElMessage } from 'element-plus'
  import Log from '../Log'
  import resizebar from './../resizebar'

  /**
   * 侧边栏
   * @Author MiyueFE
   * @Home https://github.com/miyuesc
   * @Date 2021年3月31日18:57:51
   */
  export default {
    name: 'AbSetting',
    components: {
      NodeSetting,
      FlowSetting,
      // FlowCondition,
      // ElementBaseInfo,
      DArrowRight,
      DArrowLeft,
      resizebar,
    },
    componentName: 'AbSetting',
    provide() {
      return {
        prefix: this.prefix,
      }
    },
    props: {
      bpmnModeler: Object,
      prefix: {
        type: String,
        default: 'activiti',
      },
      // width: {
      //   type: Number,
      //   default: 400,
      // },
      currentNode: {
        type: Object,
        required: true,
      },
      flowSetting: {
        type: Object,
        required: true,
      },
    },
    emits: ['changeCurrentNode'],
    data() {
      return {
        activeTab: 'base',
        elementId: '',
        elementType: '',
        elementBusinessObject: {}, // 元素 businessObject 镜像，提供给需要做判断的组件使用
        conditionFormVisible: false, // 流转条件设置
        formVisible: false, // 表单配置
        width: 400,
      }
    },
    watch: {
      elementId: {
        handler() {
          this.activeTab = 'base'
        },
      },
    },
    created() {
      this.initModels()
    },
    methods: {
      widthChange() {
        if (this.width > 0) {
          this.width = 0
          return
        }
        this.width = 480
      },
      changeNodeId(val, back) {
        if (!this.flowSetting.nodeMap[val]) {
          back(true)
          this.$emit('changeCurrentNode', val)
        } else {
          back(false)
          ElMessage.warning('此Id已存在')
        }
      },
      initModels() {
        // 初始化 modeler 以及其他 moddle
        if (!this.bpmnModeler) {
          // 避免加载时 流程图 并未加载完成
          this.timer = setTimeout(() => this.initModels(), 10)
          return
        }
        if (this.timer) clearTimeout(this.timer)
        window.bpmnInstances = {
          modeler: this.bpmnModeler,
          modeling: this.bpmnModeler.get('modeling'),
          moddle: this.bpmnModeler.get('moddle'),
          eventBus: this.bpmnModeler.get('eventBus'),
          bpmnFactory: this.bpmnModeler.get('bpmnFactory'),
          elementFactory: this.bpmnModeler.get('elementFactory'),
          elementRegistry: this.bpmnModeler.get('elementRegistry'),
          replace: this.bpmnModeler.get('replace'),
          selection: this.bpmnModeler.get('selection'),
        }
        this.getActiveElement()
      },
      getActiveElement() {
        // 初始第一个选中元素 bpmn:Process
        this.initFormOnChanged(null)
        // 2023-10-8  不清楚这是啥意思，莫非是导入后吗？
        /*   this.bpmnModeler.on('import.done', (e) => {
          this.initFormOnChanged(null)
        }) */
        // 监听选择事件，修改当前激活的元素以及表单
        this.bpmnModeler.on('selection.changed', ({ newSelection }) => {
          this.initFormOnChanged(newSelection[0] || null)
        })
        this.bpmnModeler.on('element.changed', ({ element }) => {
          // 保证 修改 "默认流转路径" 类似需要修改多个元素的事件发生的时候，更新表单的元素与原选中元素不一致。
          if (element && element.id === this.elementId) {
            this.initFormOnChanged(element)
          }
        })
      },
      // 初始化数据
      initFormOnChanged(element) {
        let activatedElement = element
        if (!activatedElement) {
          activatedElement =
            window.bpmnInstances.elementRegistry.find(
              (el) => el.type === 'bpmn:Process'
            ) ??
            window.bpmnInstances.elementRegistry.find(
              (el) => el.type === 'bpmn:Collaboration'
            )
        }
        if (!activatedElement) return
        /* Log.printBack(
          `select element changed: id: ${activatedElement.id} , type: ${activatedElement.businessObject.$type}`
        ) */
        //  Log.prettyInfo('businessObject', activatedElement.businessObject)
        window.bpmnInstances.bpmnElement = activatedElement
        this.bpmnElement = activatedElement
        this.elementId = activatedElement.id
        this.elementType = activatedElement.type.split(':')[1] || ''
        this.elementBusinessObject = JSON.parse(
          JSON.stringify(activatedElement.businessObject)
        )
        // 服務任務
        if (
          this.elementType == 'ServiceTask' &&
          !activatedElement.businessObject['activiti:delegateExpression']
        ) {
          activatedElement.businessObject['activiti:delegateExpression'] =
            '${serviceTaskJavaDelegate}'

          window.bpmnInstances.modeling.updateProperties(activatedElement, {
            'activiti:delegateExpression': '${serviceTaskJavaDelegate}',
          })
        }
      },
      beforeDestroy() {
        window.bpmnInstances = null
      },
    },
  }
</script>
<style scoped lang="scss">
  :deep(.el-collapse-item__header) {
    height: 36px;
    padding-left: 8px;
    line-height: 36px;
    color: #ffffff;
    background-color: #57a3f3;
  }
</style>

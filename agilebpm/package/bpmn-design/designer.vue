<template>
  <div v-if="bpmDefinitionVO.setting" id="designer">
    <div class="design_left">
      <div class="design_left_grid">
        <!--右侧可拖拽元素部分-->
        <my-process-palette />
        <!--设计器-->
        <my-process-designer
          :key="`designer-${reloadIndex}`"
          v-bind="controlForm"
          ref="processDesigner"
          v-model="bpmDefinitionVO.bpmnXml"
          :be-in-save-status="beInSaveStatus"
          keyboard
          :options="{
            taskResizingEnabled: true,
            eventResizingEnabled: true,
            minimap: {
              open: false,
            },
          }"
          @close="close"
          @element-click="elementClick"
          @element-contextmenu="elementContextmenu"
          @init-finished="initModeler"
          @save-design-info="saveDesignInfo"
          @shape-added="shapeAdded"
          @shape-move-end="shapeMoveEnd"
          @shape-removed="shapeDelete"
        />
      </div>
      <!--流程插件-->
      <ab-plugins
        v-if="currentNode"
        :bo-list="boList"
        :flow-setting="bpmDefinitionVO.setting"
        :node-config="currentNode"
      />
    </div>
    <!--测边栏-->
    <ab-setting
      v-show="currentNode"
      :key="`penal-${reloadIndex}`"
      :bpmn-modeler="modeler"
      class="process-panel"
      :current-node="currentNode"
      :flow-setting="bpmDefinitionVO.setting"
      :prefix="controlForm.prefix"
      @change-current-node="changeCurrentNode"
    />
  </div>
  <scriptVariableInit
    v-if="bpmDefinitionVO?.setting"
    :bo-list="boList"
    :bpm-setting="bpmDefinitionVO.setting"
    :script-variables="scriptVariables"
  />
</template>

<script>
  // 自定义渲染
  // 自定义元素选中时的弹出菜单（修改 默认任务 为 用户任务）
  import CustomContentPadProvider from './package/designer/plugins/content-pad'
  // 自定义左侧菜单（修改 默认任务 为 用户任务）
  import CustomPaletteProvider from './package/designer/plugins/palette'
  import Log from './package/Log'
  import { ElMessage, ElMessageBox } from 'element-plus'

  // 流程设计器部分
  import MyProcessDesigner from './package/designer'
  import MyProcessPalette from './package/palette'
  import AbSetting from './package/ab-setting'
  import minimapModule from 'diagram-js-minimap'
  import { getUserNodes } from '~/agilebpm/package/ab-common-resource/ab-flow-util.ts'
  import { saveResourceDataUrl } from '~/agilebpm/api/modules/ab-appSquare/ab-appSquare-resource'
  // 插件部分
  import AbPlugins from './package/ab-plugins'
  import { checkIsPublicProject } from '~/agilebpm/utils/ab-util'
  import { bpmApi, trespass,postData,appsquareApi } from '@agilebpm/api'
  import {
    getDefaultNodeJson,
    getDefaultFlowJson,
    defaultBpmnXml,
  } from './package/defaultConfigJson.js'
  import scriptVariableInit from '~/agilebpm/package/ab-common-resource/bpmDesign/conditionScript/scriptVariableInit.vue'

  export default {
    name: 'BpmDesigner',
    directives: {},
    components: {
      MyProcessDesigner,
      MyProcessPalette,
      AbSetting,
      AbPlugins,
      scriptVariableInit,
    },
    provide() {
      return {
        // 流程的配置JSON
        flowSetting: computed(() => {
          return this.bpmDefinitionVO?.setting
        }),
        // 流程的当前节点
        currentNode: computed(() => {
          return this.currentNode
        }),
        // 可用的任务节点
        userNodeList: computed(() => {
          return getUserNodes(this.bpmDefinitionVO?.setting?.nodeMap)
        }),
        //流程key
        flowKey: computed(() => {
          return this.bpmDefinitionVO?.key
        }),
        scriptVariables: this.scriptVariables,
        boList: this.boList,
      }
    },
    inject: ['$pub'],
    // eslint-disable-next-line vue/require-prop-types
    emits: ['close','saveLoadingTrue','saveLoadingFalse'],
    data() {
      return {
        defId: '',
        designShow: false,
        modeler: null,
        reloadIndex: 0,
        controlDrawerVisible: false,
        infoTipVisible: false,
        pageMode: false,
        currentNode: {},
        scriptVariables: [],
        boList: [],
        bpmDefinitionVO: {},
        controlForm: {
          processId: '',
          processName: '',
          simulation: true,
          labelEditing: false,
          labelVisible: false,
          prefix: 'activiti',
          headerButtonSize: 'default',
          events: [
            'element.click',
            'element.contextmenu',
            'shape.added',
            'shape.removed',
            'shape.move.end',
          ],
          additionalModel: [
            CustomContentPadProvider,
            CustomPaletteProvider,
            minimapModule,
          ],
        },
        beInSaveStatus: false,
      }
    },
    created() {
      //this.$route.params.custGridId 路由设置了动态custGridId 目前不知道咋改 先用custGridId
      this.defId = this.$route.query.defId || this.$route.params.custGridId

      this.getDesignInfo(this.defId)
    },
    methods: {
      initModeler(modeler) {
        setTimeout(() => {
          this.modeler = modeler
          const canvas = modeler.get('canvas')
          const rootElement = canvas.getRootElement()
          //Log.prettyPrimary('Process Name:', rootElement.businessObject.name)
          // this.getDesignInfo()
        }, 10)
      },
      changeCurrentNode(val) {
        this.bpmDefinitionVO.setting.nodeMap[val] = {
          ...this.currentNode,
          nodeKey: val,
        }
        delete this.bpmDefinitionVO.setting.nodeMap[this.currentNode.nodeKey]
        this.currentNode = this.bpmDefinitionVO.setting.nodeMap[val]
      },
      saveDesignInfo(isPublish) {
        const aaa = '变量'
        if (isPublish) {
          this.bpmDefinitionVO.isPublish = true
        }
        // 设置下流程名字
        this.bpmDefinitionVO.name = this.bpmDefinitionVO.setting.flowName
        this.bpmDefinitionVO.desc = this.bpmDefinitionVO.setting.flowDesc
        // 描述控件会错误name，这里特殊处理下先。后面再研究
        for (let index = 0; index < 20; index++) {
          this.bpmDefinitionVO.bpmnXml =
            this.bpmDefinitionVO.bpmnXml.replaceAll(
              `name="undefined${index}"`,
              ''
            )
        }

        if (
          this.bpmDefinitionVO.status === 'deploy' &&
          this.bpmDefinitionVO.setting.flowStatus === 'deploy'
        ) {
          ElMessage({
            message: '发布状态的流程不允许修改，请切换至草稿状态再做操作!',
            type: 'warning',
          })
          return
        }
        this.bpmDefinitionVO.status = this.bpmDefinitionVO.setting.flowStatus

        this.beInSaveStatus = true

        if(this.$route.name !== "CreateForm"){
          bpmApi.bpmDefinition.saveBpmDefinitionDesign(this.bpmDefinitionVO).then(
          (res) => {
            this.setSuccessDesign(res,isPublish)
          },
          () => {
            this.beInSaveStatus = false
          }
        )
        }
        if(this.$route.name == "CreateForm"){
          this.$emit('saveLoadingTrue',isPublish)
          let paramsData = {
            projectId:this.$route.params.projectId,
            resourceType:this.$route.params.resourceType,
            resourceId:this.$route.params.resourceId,
            data:this.bpmDefinitionVO
          }
          postData(saveResourceDataUrl,paramsData)
          .then(
            (res) => {
             this.setSuccessDesign(res,isPublish)
            },
            () => {
              this.$emit('saveLoadingFalse',isPublish)
              this.beInSaveStatus = false
            }
          ).catch(() => {
            this.$emit('saveLoadingFalse',isPublish)
          })
        }
      },
      setSuccessDesign(res,isPublish){
        this.beInSaveStatus = false
        //3this.bpmDefinitionVO.rev = this.bpmDefinitionVO.rev + 1
        // 2部分配置二次保存会丢失，这次销毁掉dom 重新渲染
        // this.bpmDefinitionVO = null
        // 1获取最新的，处理乐观锁revId，因为后台存在多次更新
        //this.getDesignInfo(res.data.defId)
        if(this.$route.name !== "CreateForm"){
          bpmApi.bpmDefinition
          .getBpmDefinitionDesign(res.data.defId)
          .then((res) => {
            this.bpmDefinitionVO.rev = res.data.rev
          })
        }
        if(this.$route.name == "CreateForm"){
          this.$emit('saveLoadingFalse',isPublish)
          this.$router.replace({ params: {...this.$route.params,...{custGridId:res.data.defId}},query:{
            mode:'diyBo'
          }});
          appsquareApi.thirdParty.bpmDefGetDesignThirdParty(this.$route.params.resourceId).then((res) => {
            this.bpmDefinitionVO.rev = res.data.rev
          })
        }

        // 校验信息
        const validateMessage = []
        if (res.data.validateMessage) {
          for (const key in res.data.validateMessage) {
            validateMessage.push(...res.data.validateMessage[key])
          }
        }
        if (validateMessage && validateMessage.length) {
          const html = ['<div style="max-height: 70vh;overflow: auto;">']
          validateMessage.forEach((item, index) =>
            html.push(
              `<p style="color: var(--el-color-danger)${
                index > 0 ? ';margin-top: 10px' : ''
              }">${index + 1}.${item}</p>`
            )
          )
          html.push('</div>')
          ElMessageBox.alert(html.join(''), '保存成功，配置提示信息', {
            confirmButtonText: '确定',
            dangerouslyUseHTMLString: true,
            type: 'warning',
            center: true,
          })
        } else {
          ElMessage({
            message: '保存成功！',
            type: 'success',
          })
        }
      },
      getDesignInfo(defId) {
        const id = defId || this.$route.query.id || ''
        if(this.$route.name == "CreateForm" && !id){
          this.bpmDefinitionVO.setting = getDefaultFlowJson()
          this.bpmDefinitionVO.bpmnXml = defaultBpmnXml
          return
        }
        if (!id) {
          return
        }
        bpmApi.bpmDefinition.getBpmDefinitionDesign(id).then((res) => {
          if (!res.data.setting) {
            res.data.setting = getDefaultFlowJson()
            res.data.bpmnXml = defaultBpmnXml
          }
          this.controlForm.processId = res.data.key
          this.controlForm.processName = res.data.name
          this.oldDataHandler(res.data)
          res.data.setting.flowName = res.data.name || ''
          res.data.setting.flowDesc = res.data.desc || ''
          res.data.setting.flowStatus = res.data.status || ''
          res.data.setting.flowVersion = res.data.version
          this.bpmDefinitionVO = res.data
          window.setTimeout(() => {
            checkIsPublicProject()
          }, 100)
        })
      },
      oldDataHandler(data) {
        if (!data.setting.bpmProperties) {
          data.setting.bpmProperties = {}
        }
        if (!data.setting.defaultForm) {
          data.setting.defaultForm = { type: 'inner' }
          data.setting.instForm = { type: 'inner' }
          data.setting.printForm = { type: 'inner' }
        }
        if (!data.setting.instanceButtonList) {
          data.setting.instanceButtonList =
            getDefaultFlowJson().instanceButtonList
        }
      },
      elementClick(element) {
        // 请忽略该逻辑
        if (checkIsPublicProject(true)) {
          trespass('绕过confim的非法访问！')
          return
        }

        const { id, type } = element
        if (type != 'bpmn:Process') {
          this.currentNode = this.bpmDefinitionVO.setting.nodeMap[id]
        } else {
          this.currentNode = {}
        }

        Log.prettyPrimary(
          `选中元素为 ${type}`,
          JSON.stringify(this.currentNode)
        )
      },

      shapeMoveEnd(element, eventObj) {
        const { shape, type } = eventObj
        if (type != 'bpmn:Process') {
          this.currentNode = this.bpmDefinitionVO.setting.nodeMap[shape.id]
        } else {
          this.currentNode = {}
        }
      },
      // 节点删除逻辑，全部nodemaps内容更新
      shapeDelete(element, eventObj) {
        const { id, type } = element
        delete this.bpmDefinitionVO.setting.nodeMap[id]
        this.currentNode = {}
      },
      // 节点新增事件初始化nodemap
      shapeAdded(element) {
        const { id, type } = element
        const nodeMap = this.bpmDefinitionVO.setting.nodeMap
        if (!nodeMap[id] && type != 'label' && type != 'bpmn:TextAnnotation') {
          const bpmnType = type.replace('bpmn:', '')
          const nodeJson = getDefaultNodeJson(bpmnType)
          if (nodeJson == null) return
          nodeJson.nodeName = element.businessObject.name || ''
          // 用于支持高级节点，先从扩展值中获取
          nodeJson.nodeType = element.businessObject.di?.nodeType ?? bpmnType
          nodeJson.nodeKey = id
          nodeMap[id] = nodeJson
          console.log(nodeMap)
          this.currentNode = nodeMap[id]
        }
      },
      elementContextmenu(element) {
        console.log('elementContextmenu:', element)
      },
      close() {
        try {
          if (window.opener && window.opener.abTableSearch) {
            window.opener.abTableSearch()
          }
        } finally {
          window.close()
        }
      },
    },
  }
</script>
<style scoped>
  #designer :deep(svg.new-parent) {
    background: unset !important;
  }

  .el-dialog__header {
    padding: 0px;
    padding-bottom: 0px;
    margin-right: 0px;
    word-break: break-all;
  }
</style>
<style lang="scss">
  .dialog_body_nopadding > .el-dialog__body {
    padding: 0px !important;
  }

  .dialog_no_header > .el-dialog__header {
    display: none;
  }
  @import './package/theme/index.scss';

  body {
    box-sizing: border-box;
    margin: 0;
    overflow: hidden;
  }
  #designer {
    position: absolute;
    box-sizing: border-box;
    display: grid;
    grid-template-rows: 100%;
    grid-template-columns: auto max-content;
    width: 100%;
    height: 100%;
  }
  .design_left {
    box-sizing: border-box;
    display: grid;
    flex-direction: column;
    grid-template-rows: auto max-content;
    grid-template-columns: 100%;
    width: 100%;
    height: 100%;
  }
  .design_left_grid {
    box-sizing: border-box;
    display: grid;
    grid-template-rows: 100%;
    grid-template-columns: 160px auto;
    width: 100%;
    overflow: hidden;
  }
  .plugins {
    width: 100%;
    height: 50px;
    background: #000;
  }
  .demo-info-bar {
    position: fixed;
    right: 8px;
    bottom: 108px;
    z-index: 1;
  }
  .demo-control-bar {
    position: fixed;
    right: 8px;
    bottom: 48px;
    z-index: 1;
  }
  .open-model-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    font-size: 32px;
    color: #ffffff;
    cursor: pointer;
    background: rgba(64, 158, 255, 1);
    border-radius: 4px;
  }
  .zoom-in-right-enter-active,
  .zoom-in-right-leave-active {
    opacity: 1;
    transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);
    transform: scaleY(1) translateY(-48px);
    transform-origin: right center;
  }
  .zoom-in-right-enter,
  .zoom-in-right-leave-active {
    opacity: 0;
    transform: scaleX(0) translateY(-48px);
  }
  .info-tip {
    position: absolute;
    top: 0;
    right: 64px;
    z-index: 10;
    box-sizing: border-box;
    width: 480px;
    padding: 0 16px;
    color: #333333;
    background: #f2f6fc;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    transform: translateY(-48px);
    &::before,
    &::after {
      position: absolute;
      top: 50%;
      right: -15px;
      width: 0;
      height: 0;
      content: '';
      border-style: solid;
      border-width: 8px;
    }
    &::before {
      z-index: 10;
      border-color: transparent transparent transparent #f2f6fc;
    }
    &::after {
      right: -16px;
      z-index: 1;
      border-color: transparent transparent transparent #ebeef5;
    }
  }
  .control-form {
    .el-radio {
      width: 100%;
      line-height: 32px;
    }
  }
  .element-overlays {
    box-sizing: border-box;
    padding: 8px;
    color: #fafafa;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 4px;
  }

  body,
  body * {
    /* 滚动条 */
    &::-webkit-scrollbar-track-piece {
      background-color: #fff; /*滚动条的背景颜色*/
      -webkit-border-radius: 0; /*滚动条的圆角宽度*/
    }
    &::-webkit-scrollbar {
      width: 6px; /*滚动条的宽度*/
      height: 6px; /*滚动条的高度*/
    }
    &::-webkit-scrollbar-thumb:vertical {
      /*垂直滚动条的样式*/
      height: 50px;
      background-color: rgba(153, 153, 153, 0.5);
      border: 2px solid #fff;
      -webkit-border-radius: 4px;
      outline: 2px solid #fff;
      outline-offset: -2px;
    }
    &::-webkit-scrollbar-thumb {
      /*滚动条的hover样式*/
      background-color: rgba(159, 159, 159, 0.3);
      -webkit-border-radius: 4px;
    }
    &::-webkit-scrollbar-thumb:hover {
      /*滚动条的hover样式*/
      background-color: rgba(159, 159, 159, 0.5);
      -webkit-border-radius: 4px;
    }
  }
</style>

<template>
  <div class="my-process-designer">
    <div class="my-process-designer__header">
      <slot name="control-header"></slot>
      <template v-if="!$slots['control-header']">
        <!-- <el-button-group key="file-control">
          <el-button :size="headerButtonSize" :type="headerButtonType" :icon="FolderOpened" @click="$refs.refFile.click()">打开文件</el-button>
          <el-tooltip effect="light">
            <template #content>
              <br />
              <el-button :size="headerButtonSize" text @click="downloadProcessAsSvg()">下载为SVG文件</el-button>
              <br />
              <el-button :size="headerButtonSize" text @click="downloadProcessAsBpmn()">下载为BPMN文件</el-button>
            </template>
            <el-button :size="headerButtonSize" :type="headerButtonType" :icon="Download">下载文件</el-button>
          </el-tooltip>
          <el-button :size="headerButtonSize" :type="headerButtonType" @click="previewProcessXML" :icon="View">预览</el-button>
        </el-button-group> -->
        <el-popover v-model:visible="visible" trigger="hover" :width="190">
          <p>
            <el-icon color="#626AEF">
              <InfoFilled />
            </el-icon>
            请确认是否保存
            <br />
            <br />
            保存会影响当前版本下运行的流程实例 !
          </p>
          <div style="margin: 0; text-align: right">
            <el-button size="small" text @click="visible = false">
              取消
            </el-button>
            <el-button size="small" type="primary" @click="saveDesignInfo()">
              确定
            </el-button>
          </div>
          <template #reference>
            <el-button
              v-if="!isAppSquare"
              :icon="Check"
              :loading="beInSaveStatus"
              style="margin-left: 10px"
              type="primary"
              @click="visible = true"
            >
              保存
            </el-button>
          </template>
        </el-popover>
        <el-button
          v-if="!isAppSquare"
          :icon="DocumentCopy"
          :loading="beInSaveStatus"
          plain
          :size="headerButtonSize"
          type="success"
          @click="publishDesignInfo()"
        >
          发布新版本
        </el-button>
        <el-button :icon="Back" :size="headerButtonSize" @click="back()" v-if="!isAppSquare">
          返回
        </el-button>
        <el-button
          :size="headerButtonSize"
          text
          @click="downloadProcessAsXml()"
        >
          &nbsp;&nbsp;&nbsp;
        </el-button>
        <el-button-group key="file-control">
          <el-button
            class="align align-left"
            :size="headerButtonSize"
            @click="toolsClick('handTool')"
          >
            <div
              class="entry bpmn-icon-hand-tool"
              draggable="true"
              title="激活抓手工具"
            ></div>
          </el-button>
          <el-button
            class="align align-left"
            :size="headerButtonSize"
            @click="toolsClick('lassoTool')"
          >
            <div
              class="entry bpmn-icon-lasso-tool"
              draggable="true"
              title="激活套索工具"
            ></div>
          </el-button>
          <el-button
            class="align align-left"
            :size="headerButtonSize"
            @click="toolsClick('spaceTool')"
          >
            <div
              class="entry bpmn-icon-space-tool"
              draggable="true"
              title="激活创建/删除空间工具"
            ></div>
          </el-button>
          <el-button
            class="align align-left"
            :size="headerButtonSize"
            @click="toolsClick('globalConnect')"
          >
            <div
              class="entry bpmn-icon-connection-multi"
              draggable="true"
              title="激活全局连接工具"
            ></div>
          </el-button>
        </el-button-group>
        <!--  <el-button-group key="align-control">
          <el-tooltip content="向左对齐" effect="light">
            <el-button
              class="align align-left"
              :icon="Histogram"
              :size="headerButtonSize"
              @click="elementsAlign('left')"
            />
          </el-tooltip>
          <el-tooltip content="向右对齐" effect="light">
            <el-button
              class="align align-right"
              :icon="Histogram"
              :size="headerButtonSize"
              @click="elementsAlign('right')"
            />
          </el-tooltip>
          <el-tooltip content="向上对齐" effect="light">
            <el-button
              class="align align-top"
              :icon="Histogram"
              :size="headerButtonSize"
              @click="elementsAlign('top')"
            />
          </el-tooltip>
          <el-tooltip content="向下对齐" effect="light">
            <el-button
              class="align align-bottom"
              :icon="Histogram"
              :size="headerButtonSize"
              @click="elementsAlign('bottom')"
            />
          </el-tooltip>
          <el-tooltip content="水平居中" effect="light">
            <el-button
              class="align align-center"
              :icon="Histogram"
              :size="headerButtonSize"
              @click="elementsAlign('center')"
            />
          </el-tooltip>
          <el-tooltip content="垂直居中" effect="light">
            <el-button
              class="align align-middle"
              :icon="Histogram"
              :size="headerButtonSize"
              @click="elementsAlign('middle')"
            />
          </el-tooltip>
        </el-button-group> -->
        <el-button-group key="scale-control">
          <el-tooltip content="缩小视图" effect="light">
            <el-button
              :disabled="defaultZoom < 0.2"
              :icon="ZoomOut"
              :size="headerButtonSize"
              @click="processZoomOut()"
            />
          </el-tooltip>
          <el-button :size="headerButtonSize">
            {{ Math.floor(defaultZoom * 10 * 10) + '%' }}
          </el-button>
          <el-tooltip content="放大视图" effect="light">
            <el-button
              :disabled="defaultZoom > 4"
              :icon="ZoomIn"
              :size="headerButtonSize"
              @click="processZoomIn()"
            />
          </el-tooltip>
          <el-tooltip content="重置视图并居中" effect="light">
            <el-button
              :icon="ScaleToOriginal"
              :size="headerButtonSize"
              @click="processReZoom()"
            />
          </el-tooltip>
        </el-button-group>
        <el-button-group key="stack-control">
          <el-tooltip content="撤销" effect="light">
            <el-button
              :disabled="!revocable"
              :icon="RefreshLeft"
              :size="headerButtonSize"
              @click="processUndo()"
            />
          </el-tooltip>
          <el-tooltip content="恢复" effect="light">
            <el-button
              :disabled="!recoverable"
              :icon="RefreshRight"
              :size="headerButtonSize"
              @click="processRedo()"
            />
          </el-tooltip>
          <el-tooltip content="重新绘制" effect="light">
            <el-button
              :icon="Refresh"
              :size="headerButtonSize"
              @click="processRestart"
            />
          </el-tooltip>
        </el-button-group>
      </template>
      <input
        id="files"
        ref="refFile"
        accept=".xml, .bpmn"
        style="display: none"
        type="file"
        @change="importLocalFile"
      />
    </div>
    <div class="my-process-designer__container">
      <div ref="bpmn-canvas" class="my-process-designer__canvas"></div>
    </div>
  </div>
</template>

<script>
  import BpmnModeler from '~/agilebpm/package/bpmn-js/lib/Modeler'
  import DefaultEmptyXML from './plugins/defaultEmpty'
  // 翻译方法
  import customTranslate from './plugins/translate/customTranslate'
  import translationsCN from './plugins/translate/zh'

  // 标签解析 Moddle
  import camundaModdleDescriptor from './plugins/descriptor/camundaDescriptor.json'
  import activitiModdleDescriptor from './plugins/descriptor/activitiDescriptor.json'
  import flowableModdleDescriptor from './plugins/descriptor/flowableDescriptor.json'
  // 标签解析 Extension
  import camundaModdleExtension from './plugins/extension-moddle/camunda'
  import activitiModdleExtension from './plugins/extension-moddle/activiti'
  import flowableModdleExtension from './plugins/extension-moddle/flowable'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import {
    ZoomOut,
    ZoomIn,
    Histogram,
    View,
    ScaleToOriginal,
    RefreshLeft,
    RefreshRight,
    Refresh,
    FolderOpened,
    Download,
    Check,
    Back,
    DocumentCopy,
    InfoFilled,
  } from '@element-plus/icons-vue'
  import { markRaw } from 'vue'
  export default {
    name: 'MyProcessDesigner',
    componentName: 'MyProcessDesigner',
    components: {
      InfoFilled,
    },
    props: {
      modelValue: {
        type: String,
        default: '',
      }, // xml 字符串
      processId: {
        type: String,
        default: '',
      },
      processName: {
        type: String,
        default: '',
      },
      translations: Object,
      options: {
        type: Object,
        default: () => ({}),
      }, // 自定义的翻译文件
      additionalModel: [Object, Array], // 自定义model
      moddleExtension: Object, // 自定义moddle
      onlyCustomizeAddi: {
        type: Boolean,
        default: false,
      },
      onlyCustomizeModdle: {
        type: Boolean,
        default: false,
      },
      simulation: {
        type: Boolean,
        default: true,
      },
      keyboard: {
        type: Boolean,
        default: true,
      },
      prefix: {
        type: String,
        default: 'camunda',
      },
      events: {
        type: Array,
        default: () => ['element.click', 'element.delete'],
      },
      headerButtonSize: {
        type: String,
        default: 'small',
        validator: (value) =>
          ['default', 'large', 'small'].indexOf(value) !== -1,
      },
      headerButtonType: {
        type: String,
        default: 'primary',
        validator: (value) =>
          ['primary', 'success', 'warning', 'danger', 'info'].indexOf(value) !==
          -1,
      },
      beInSaveStatus: {
        type: Boolean,
        default: false,
      },
    },
    emits: [
      'saveDesignInfo',
      'close',
      'shape-added',
      'init-finished',
      'element-click',
    ],
    // watch: {
    //    modelValue() {
    //      this.createNewDiagram(this.modelValue)
    //    },
    // },
    data() {
      return {
        Refresh: markRaw(Refresh),
        RefreshLeft: markRaw(RefreshLeft),
        RefreshRight: markRaw(RefreshRight),
        ZoomOut: markRaw(ZoomOut),
        ZoomIn: markRaw(ZoomIn),
        Histogram: markRaw(Histogram),
        View: markRaw(View),
        FolderOpened: markRaw(FolderOpened),
        ScaleToOriginal: markRaw(ScaleToOriginal),
        Download: markRaw(Download),
        Check: markRaw(Check),
        Back: markRaw(Back),
        DocumentCopy: markRaw(DocumentCopy),
        defaultZoom: 1,
        previewModelVisible: false,
        simulationStatus: false,
        previewResult: '',
        previewType: 'xml',
        recoverable: false,
        revocable: false,
        visible: false,
        isAppSquare: this.$route.name == "CreateForm" ? true : false,
      }
    },
    computed: {
      additionalModules() {
        const Modules = []
        // 仅保留用户自定义扩展模块
        if (this.onlyCustomizeAddi) {
          if (
            Object.prototype.toString.call(this.additionalModel) ===
            '[object Array]'
          ) {
            return this.additionalModel || []
          }
          return [this.additionalModel]
        }

        // 插入用户自定义扩展模块
        if (
          Object.prototype.toString.call(this.additionalModel) ===
          '[object Array]'
        ) {
          Modules.push(...this.additionalModel)
        } else {
          this.additionalModel && Modules.push(this.additionalModel)
        }

        // 翻译模块
        const TranslateModule = {
          translate: [
            'value',
            customTranslate(this.translations || translationsCN),
          ],
        }

        Modules.push(TranslateModule)

        // 根据需要的流程类型设置扩展元素构建模块
        // if (this.prefix === 'bpmn') {
        //   Modules.push(bpmnModdleExtension)
        // }
        // if (this.prefix === 'camunda') {
        //   Modules.push(camundaModdleExtension)
        // }
        // if (this.prefix === "flowable") {
        //   Modules.push(flowableModdleExtension);
        // }
        // if (this.prefix === 'activiti') {
        //   Modules.push(activitiModdleExtension)
        // }
        return Modules
      },
      moddleExtensions() {
        const Extensions = {}
        // 仅使用用户自定义模块
        if (this.onlyCustomizeModdle) {
          return this.moddleExtension || null
        }

        // 插入用户自定义模块
        if (this.moddleExtension) {
          for (const key in this.moddleExtension) {
            Extensions[key] = this.moddleExtension[key]
          }
        }

        // 根据需要的 "流程类型" 设置 对应的解析文件
        // if (this.prefix === 'activiti') {
        //   Extensions.activiti = activitiModdleDescriptor
        // }
        // if (this.prefix === 'flowable') {
        //   Extensions.flowable = flowableModdleDescriptor
        // }
        // if (this.prefix === 'camunda') {
        //   Extensions.camunda = camundaModdleDescriptor
        // }

        return Extensions
      },
    },
    mounted() {
      this.initBpmnModeler()
      this.createNewDiagram(this.modelValue)
    },
    methods: {
      saveDesignInfo() {
        this.visible = false
        this.$emit('saveDesignInfo')
      },
      publishDesignInfo() {
        ElMessageBox.confirm(
          '发布新版本不会影响运行中流程实例,<br>新发起的流程会默认使用当前新发布的主版本配置。<br>保存则会立即更新当前版本的流程配置，同样也影响当前版本运行中的流程实例。',
          '请注意 ！',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            dangerouslyUseHTMLString: true,
            type: 'warning',
          }
        ).then(() => {
          this.$emit('saveDesignInfo', true)
        })
      },
      back() {
        this.$emit('close')
      },
      initBpmnModeler() {
        if (this.bpmnModeler) return
        // console.log(BpmnModeler)
        this.bpmnModeler = new BpmnModeler({
          container: this.$refs['bpmn-canvas'],
          keyboard: this.keyboard ? { bindTo: document } : null,
          additionalModules: this.additionalModules,
          // moddleExtensions: this.moddleExtensions,
          ...this.options,
        })
        this.$emit('init-finished', this.bpmnModeler)
        this.initModelListeners()
      },

      initModelListeners() {
        const EventBus = this.bpmnModeler.get('eventBus')
        const that = this
        // 注册需要的监听事件, 将. 替换为 - , 避免解析异常
        this.events.forEach((event) => {
          EventBus.on(event, function (eventObj) {
            const eventName = event.replace(/\./g, '-')
            const element = eventObj ? eventObj.element : null
            that.$emit(eventName, element, eventObj)
          })
        })
        // 监听图形改变返回xml
        EventBus.on('commandStack.changed', async (event) => {
          try {
            this.recoverable = this.bpmnModeler.get('commandStack').canRedo()
            this.revocable = this.bpmnModeler.get('commandStack').canUndo()
            const { xml } = await this.bpmnModeler.saveXML({ format: true })
            this.$emit('commandStack-changed', event)
            this.$emit('update:modelValue', xml)
            this.$emit('change', xml)
          } catch (e) {
            console.error(`[Process Designer Warn]: ${e.message || e}`)
          }
        })
        // 监听视图缩放变化
        this.bpmnModeler.on('canvas.viewbox.changed', ({ viewbox }) => {
          this.$emit('canvas-viewbox-changed', { viewbox })
          const { scale } = viewbox
          this.defaultZoom = Math.floor(scale * 100) / 100
        })
      },
      toolsClick(type) {
        if (this.bpmnModeler) {
          this.bpmnModeler.get(type).toggle()
        }
      },
      /* 创建新的流程图 */
      async createNewDiagram(xml) {
        // 将字符串转换成图显示出来
        const newId = this.processId || `Process_${new Date().getTime()}`
        const newName = this.processName || `业务流程_${new Date().getTime()}`
        const xmlString = xml || DefaultEmptyXML(newId, newName, this.prefix)
        try {
          const { warnings } = await this.bpmnModeler.importXML(xmlString)
          if (warnings && warnings.length) {
            warnings.forEach((warn) => console.warn(warn))
          }
        } catch (e) {
          console.error(`[Process Designer Warn]: ${e?.message || e}`)
        }
      },

      // 下载流程图到本地
      /**
       * @param {string} type
       * @param {*} name
       */
      async downloadProcess(type, name) {
        try {
          const _this = this
          // 按需要类型创建文件并下载
          if (type === 'xml' || type === 'bpmn') {
            const { err, xml } = await this.bpmnModeler.saveXML()
            // 读取异常时抛出异常
            if (err) {
              console.error(`[Process Designer Warn ]: ${err.message || err}`)
            }
            const { href, filename } = _this.setEncoded(
              type.toUpperCase(),
              name,
              xml
            )
            downloadFunc(href, filename)
          } else {
            const { err, svg } = await this.bpmnModeler.saveSVG()
            // 读取异常时抛出异常
            if (err) {
              return console.error(err)
            }
            const { href, filename } = _this.setEncoded('SVG', name, svg)
            downloadFunc(href, filename)
          }
        } catch (e) {
          console.error(`[Process Designer Warn ]: ${e.message || e}`)
        }
        // 文件下载方法
        function downloadFunc(href, filename) {
          if (href && filename) {
            const a = document.createElement('a')
            a.download = filename //指定下载的文件名
            a.href = href //  URL对象
            a.click() // 模拟点击
            URL.revokeObjectURL(a.href) // 释放URL 对象
          }
        }
      },

      // 根据所需类型进行转码并返回下载地址
      setEncoded(type, filename = 'diagram', data) {
        const encodedData = encodeURIComponent(data)
        return {
          filename: `${filename}.${type}`,
          href: `data:application/${
            type === 'svg' ? 'text/xml' : 'bpmn20-xml'
          };charset=UTF-8,${encodedData}`,
          data: data,
        }
      },

      // 加载本地文件
      importLocalFile() {
        const that = this
        const file = this.$refs.refFile.files[0]
        const reader = new FileReader()
        reader.readAsText(file)
        reader.onload = function () {
          const xmlStr = this.result
          that.createNewDiagram(xmlStr)
        }
      },
      /* ------------------------------------------------ refs methods ------------------------------------------------------ */
      downloadProcessAsXml() {
        this.downloadProcess('xml')
      },
      downloadProcessAsBpmn() {
        this.downloadProcess('bpmn')
      },
      downloadProcessAsSvg() {
        this.downloadProcess('svg')
      },
      processSimulation() {
        this.simulationStatus = !this.simulationStatus
        this.simulation && this.bpmnModeler.get('toggleMode').toggleMode()
      },
      processRedo() {
        this.bpmnModeler.get('commandStack').redo()
      },
      processUndo() {
        this.bpmnModeler.get('commandStack').undo()
      },
      processZoomIn(zoomStep = 0.1) {
        const newZoom =
          Math.floor(this.defaultZoom * 100 + zoomStep * 100) / 100
        if (newZoom > 4) {
          throw new Error(
            '[Process Designer Warn ]: The zoom ratio cannot be greater than 4'
          )
        }
        this.defaultZoom = newZoom
        this.bpmnModeler.get('canvas').zoom(this.defaultZoom)
      },
      processZoomOut(zoomStep = 0.1) {
        const newZoom =
          Math.floor(this.defaultZoom * 100 - zoomStep * 100) / 100
        if (newZoom < 0.2) {
          throw new Error(
            '[Process Designer Warn ]: The zoom ratio cannot be less than 0.2'
          )
        }
        this.defaultZoom = newZoom
        this.bpmnModeler.get('canvas').zoom(this.defaultZoom)
      },
      processZoomTo(newZoom = 1) {
        if (newZoom < 0.2) {
          throw new Error(
            '[Process Designer Warn ]: The zoom ratio cannot be less than 0.2'
          )
        }
        if (newZoom > 4) {
          throw new Error(
            '[Process Designer Warn ]: The zoom ratio cannot be greater than 4'
          )
        }
        this.defaultZoom = newZoom
        this.bpmnModeler.get('canvas').zoom(newZoom)
      },
      processReZoom() {
        this.defaultZoom = 1
        this.bpmnModeler.get('canvas').zoom('fit-viewport', 'auto')
      },
      processRestart() {
        this.recoverable = false
        this.revocable = false
        this.createNewDiagram(null)
      },
      elementsAlign(align) {
        const Align = this.bpmnModeler.get('alignElements')
        const Selection = this.bpmnModeler.get('selection')
        const SelectedElements = Selection.get()
        if (!SelectedElements || SelectedElements.length <= 1) {
          ElMessage({
            message: '请按住 Shift 键, 选择需要对齐的元素',
            type: 'warning',
          })
          return
        }
        ElMessageBox.confirm('自动对齐可能造成图形变形，是否继续？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => Align.trigger(SelectedElements, align))
      },
      /*-----------------------------    方法结束     ---------------------------------*/
      previewProcessXML() {
        this.bpmnModeler.saveXML({ format: true }).then(({ xml }) => {
          // console.log(xml)
          // this.previewResult = xml
          // this.previewType = 'xml'
          // this.previewModelVisible = true
        })
      },
      // previewProcessJson() {
      //   const newConvert = new X2JS()
      //   this.bpmnModeler.saveXML({ format: true }).then(({ xml }) => {
      //     const { definitions } = newConvert.xml2js(xml)
      //     if (definitions) {
      //       this.previewResult = JSON.stringify(definitions, null, 4)
      //     } else {
      //       this.previewResult = ''
      //     }
      //     this.previewType = 'json'
      //     this.previewModelVisible = true
      //   })
      // },
    },
  }
</script>
<style lang="scss" scoped>
  .entry {
    font-size: 18px;
    color: #333;
  }
  @import '~/agilebpm/package/bpmn-js/dist/assets/diagram-js.css';
  @import '~/agilebpm/package/bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
  @import '~/agilebpm/package/bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
</style>

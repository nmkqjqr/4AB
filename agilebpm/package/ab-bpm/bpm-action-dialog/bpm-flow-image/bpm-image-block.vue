<template>
  <span
    class="hide"
    :title="
      $abT('bpm.office.flowChartNotDeleteMsg', '这个不能删掉,否则会出问题')
    "
  ></span>
  <el-button
    v-if="info.bpmInstance && info.bpmInstance.parentId"
    @click="
      clickNode({
        fn: info.imageInfo.flowFn,
        type: 'parentFlow',
        instId: info.bpmInstance.parentId,
      })
    "
  >
    {{ $abT('bpm.office.viewParentFlowChart', '查看父流程') }}
  </el-button>
  <div style="overflow: auto">
    <div style="position: relative">
      <canvas id="flowImageCanvas"></canvas>
      <!-- 流程图 div 文案展示部分 -->
      <image-popover :draw-fn="info.drawFn" :image-info="info.imageInfo" />
    </div>
  </div>
  <div></div>
  <el-dialog
    v-model="info.subImageInfo.show"
    :append-to-body="true"
    :show-close="false"
    :title="info.subImageInfo.title"
    width="70%"
  >
    <div style="overflow: auto">
      <div class="pa">
        <el-button
          v-for="opinion in info.selectedOpinions"
          :key="opinion.id"
          class="btn mr10 pointer"
          :class="{
            'el-button el-button--primary is-plain':
              opinion.id == info.selectedOpinion.id,
          }"
          @click="
            clickNode({
              node: opinion.node,
              fn: info.imageInfo.flowFn,
              type: 'opinion',
              opinion: opinion,
            })
          "
        >
          {{ opinion.taskName + ' - ' + getName(opinion.assign) }}
        </el-button>
        <el-button
          v-for="subInst in info.selectedSubInstanceList"
          :key="subInst.id"
          class="btn mr10 pointer"
          :class="{ '': subInst.id == info.selectedSubInst.id }"
          @click="
            clickNode({
              node: info.imageInfo.selectNode,
              fn: info.imageInfo.flowFn,
              type: 'subInst',
              subInst: subInst,
            })
          "
        >
          {{ subInst.title }}
        </el-button>
      </div>
      <div style="position: relative; display: block; max-height: 600px">
        <div id="subFlowImageCanvas"></div>
        <image-popover :draw-fn="info.drawFn" :image-info="info.subImageInfo" />
      </div>
    </div>
    <template #footer>
      <el-button text type="default" @click="subImageClose()">
        {{ $abT('page.common.cancel', '取消') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
  import flowCanvas from './flow-image/flowCanvas.js'
  import imagePopover from './image-popover.vue'

  const props = defineProps({
    imageInfo: { required: true, type: Object },
    // 获取子流程图信息，默认通过远程接口获取 入参：instanceId, defId, taskId，返回：async function
    getSubFlowImageInfo: { required: false, type: Function },
    /** 是否展示对话框 */
  })

  const info = reactive({
    imageInfo: {},
    hasChange: false,
    subImageInfo: { show: false },
    selectedOpinions: {},
    selectedOpinion: {},
    selectedSubInstanceList: [],
    selectedSubInst: {},
    bpmInstance: {},
    drawFn: {},
  })

  const initialFlowImageInfo = () => {
    info.imageInfo = props.imageInfo
    info.bpmInstance = info.imageInfo.bpmInstance
    const flowImageCanvas = new flowCanvas(
      info,
      'flowImageCanvas',
      info.imageInfo
    )
    // 覆盖获取字流程图信息方法
    if (props.getSubFlowImageInfo) {
      flowImageCanvas.fetchInstanceFlowImageInfo = props.getSubFlowImageInfo
    }
    info.drawFn = flowImageCanvas.initDraw()
    info.drawFn.drawFlowImage() // 重构后的代码
  }

  onMounted(() => initialFlowImageInfo())

  const clickNode = (params) => {
    info.drawFn.clickNode(params)
  }

  const subImageClose = () => {
    info.hasChange = !info.hasChange
    info.subImageInfo.show = false
  }

  const getName = (name) => {
    if (!name) return ''
    return name.replace('[用户]', '')
  }
</script>
<style>
  .opinionStatus {
    margin-top: 20px;
    margin-left: 30px;
  }

  .popperContent {
    max-height: 400px;
    overflow-y: scroll;
  }
  .bottonDiv {
    position: absolute;
    bottom: 0px;
    left: 0px;
  }
</style>

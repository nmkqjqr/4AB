/* eslint-disable no-var */
/* eslint-disable prefer-spread */
/* eslint-disable no-redeclare */
import drawFlowImg from './drawCanvas.js'
import { bpmApi, abUtil } from '~/agilebpm'

// 定义流程画布以及数据
window.flowCanvas = function (scope, id, imageInfo, createCanvas) {
  for (const i in flowCanvasFn) {
    this[i] = flowCanvasFn[i]
  }
  this.id = id
  this.scope = scope
  this.imageInfo = imageInfo
  if (!this.imageInfo.preId) {
    this.imageInfo.preId = abUtil.AbRandom.GetRandomStr()
  }
  this.createCanvas = createCanvas // 是否创建canvas
}

window.flowCanvasFn = {
  // 初始化
  initDraw: function () {
    this.initData()
    console.info('initData')
    this.initCanvas()
    console.info('initCanvas')

    const flowFn = new drawFlowImg(this)
    this.imageInfo.flowFn = flowFn

    return flowFn
  },
  // 初始化流程图数据
  initData: function () {
    this.nodeMap = this.imageInfo.nodeMap
    this.flowLocation = this.imageInfo.flowLocation
    this.stacks = this.imageInfo.stacks || []
    this.flowElements = this.imageInfo.flowElements
    this.imageInfo.opinionMap = this.imageInfo.opinionMap || {}
    this.opinionMap = this.imageInfo.opinionMap

    this.xoffset = this.imageInfo.xoffset || -10
    this.yoffset = this.imageInfo.yoffset || -25
    this.domxoffset = this.xoffset
    this.domyoffset = this.yoffset
    if (this.createCanvas) {
      this.xoffset = -55
      this.yoffset = -50

      this.domxoffset = -55
      this.domyoffset = -50
    }

    this.initFlowData(this.flowElements)
    this.initStatck()
    this.initNodeInfo()
    this.initNodeRelation()
    this.initNodeOpitions()
    this.initNodeType()
  },
  // 初始化画布
  initCanvas: function () {
    this.canvas = document.getElementById(this.id)
    if (this.createCanvas) {
      const canvas = document.createElement('canvas')
      canvas.id = this.id
      this.canvas = canvas
    }
    this.cxt = this.canvas.getContext('2d')
    this.ctx = this.cxt

    // 设置画布宽高
    let minX = 10000
    let minY = 10000
    let maxX = 0
    let maxY = 0
    for (var i in this.nodeMap) {
      const xyz = this.nodeMap[i]
      minX = Math.min(minX, xyz.x)
      minY = Math.min(minY, xyz.y)
      maxX = Math.max(maxX, xyz.x + xyz.width)
      maxY = Math.max(maxY, xyz.y + xyz.height)
    }

    for (var i in this.flowLocation) {
      const flows = this.flowLocation[i]
      for (let j = 0; j < flows.length; j++) {
        const flowFrom = flows[j]
        minX = Math.min(minX, flowFrom.x)
        minY = Math.min(minY, flowFrom.y)
        maxX = Math.max(maxX, flowFrom.x + flowFrom.width)
        maxY = Math.max(maxY, flowFrom.y + flowFrom.height)
      }
    }

    // 流程图画布大小修改
    /*  this.canvas.width = maxX + minX + 300
    this.canvas.height = maxY + minY + 200 */
    this.canvas.width = maxX + 50
    this.canvas.height = maxY + 100

    // test
    //	    this.canvas.width = 10000;
    //	    this.canvas.height = 10000;

    // 画背景白色,否则复制出来是透明的
    this.cxt.fillStyle = 'white'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  },
  initDialogs: function () {
    const imageInfo = this.imageInfo
    const scope = this.scope
    window.setTimeout(function () {
      scope.initPopper(imageInfo)
    }, 300)
  },
  // 初始化栈数据
  initStatck: function () {
    const stacks = this.stacks
    const stackJson = {}
    const nodeTypeJson = {}
    const flowColorJson = {}
    const nodeActionJson = {}
    for (let i = 0; i < stacks.length; i++) {
      const stack = stacks[i]
      stackJson[stack.taskDefKey] = stack
      nodeTypeJson[stack.taskDefKey] = stack.nodeType
      let actionName = stack.actionName
      if ('sequenceFlow' == stack.nodeType) {
        // 线集合，线的颜色应该跟父颜色一致
        if (actionName == 'create') {
          actionName = 'start'
        }
      }
      nodeActionJson[stack.taskDefKey] = actionName
      flowColorJson[stack.taskDefKey] = this.getColor(actionName)
    }
    this.flowColorJson = flowColorJson
    this.nodeTypeJson = nodeTypeJson
    this.stackJson = stackJson
    this.nodeActionJson = nodeActionJson
  },
  // 初始化节点名称
  initNodeInfo: function () {
    const imageInfo = this.imageInfo
    // 注释相关
    const pools = imageInfo.pools || []
    const lanes = imageInfo.lanes || []
    const artifacts = imageInfo.artifacts || []
    const boundaryEvents = imageInfo.boundaryEvents || []

    pools.push.apply(pools, lanes)
    pools.push.apply(pools, artifacts)
    pools.push.apply(pools, boundaryEvents)
    const nodeNameJson = {}
    for (var i = 0; i < pools.length; i++) {
      let p = pools[i]
      if (p['$ref']) {
        const $ = {
          data: imageInfo,
        }
        p = eval(`(${p['$ref']})`)
      }
      nodeNameJson[p.id] = p
    }

    this.nodeNameJson = nodeNameJson
    const flowElementJson = this.imageInfo.flowElementJson
    const flowColorJson = this.flowColorJson
    const nodeMap = this.nodeMap
    for (var i in nodeMap) {
      const xyz = nodeMap[i]
      // 绑定ID
      xyz.id = i

      const flowElement =
        flowElementJson[i] || nodeNameJson[i] || flowElementJson[xyz.oldId]
      const nodeName = flowElement.name || flowElement.text
      xyz.nodeName = nodeName
      xyz.flowElement = flowElement
      xyz.actionName = this.nodeActionJson[i]

      const color = flowColorJson[i] || Color.MAIN
      xyz.color = color
      xyz.domxoffset = this.domxoffset
      xyz.domyoffset = this.domyoffset
    }
  },
  // 级联初始化流程节点数据
  initFlowData: function (flowElements) {
    if (!flowElements) {
      return
    }
    const imageInfo = this.imageInfo
    const flowElementJson = imageInfo.flowElementJson || {}
    const boundaryEvents = imageInfo.boundaryEvents || []

    for (let i = 0; i < flowElements.length; i++) {
      const flow = flowElements[i]
      flowElementJson[flow.id] = flow

      boundaryEvents.push.apply(boundaryEvents, flow.boundaryEvents || [])
      imageInfo.boundaryEvents = boundaryEvents
      imageInfo.flowElementJson = flowElementJson
      const subFlowElements = flow.flowElements
      if (subFlowElements && subFlowElements.length > 0) {
        this.initFlowData(subFlowElements)
      }
    }
  },
  // 原始的nodeType转成前端的
  nodeTypeMap: {
    BoundaryEvent: 'boundaryTimer',
    IntermediateCatchEvent: 'catchTimer',
    EndEvent: 'endEvent',
    EndEvent1: 'endEvent',
    ExclusiveGateway: 'exclusiveGateway',
    ParallelGateway: 'parallelGateway',
    StartEvent: 'startEvent',
    ThrowEvent: 'throwSignal',
    UserTask: 'userTask',
    ScriptTask: 'serviceTask',

    InclusiveGateway: 'inclusiveGateway',
  },
  // 获取节点类型
  getNodeType: function (oldNodeType, i) {
    let nodeType = ''
    if (i.indexOf('Pool') >= 0) {
      nodeType = 'pool'
    }
    if (i.indexOf('Lane') >= 0) {
      nodeType = 'lane'
    }
    if (i.indexOf('StartNoneEvent') >= 0) {
      nodeType = 'startEvent'
    }
    if (i.indexOf('TextAnnotation') >= 0) {
      nodeType = 'textAnnotation'
    }
    if (i.indexOf('EndNoneEvent') >= 0) {
      nodeType = 'endEvent'
    }
    if (i.indexOf('SubProcess') >= 0) {
      nodeType = 'subProcess'
    }
    if (i.indexOf('CallActivity') >= 0) {
      nodeType = 'callActivity'
    }
    if (i.indexOf('UserTask') >= 0) {
      nodeType = 'userTask'
    }
    if (i.indexOf('ServiceTask') >= 0) {
      nodeType = 'serviceTask'
    }
    if (i.indexOf('ExclusiveGateway') >= 0) {
      nodeType = 'exclusiveGateway'
    }
    if (i.indexOf('ParallelGateway') >= 0) {
      nodeType = 'parallelGateway'
    }
    if (i.indexOf('InclusiveGateway') >= 0) {
      nodeType = 'inclusiveGateway'
    }

    if (i.indexOf('StartTimer') >= 0) {
      nodeType = 'startTimer'
    }
    if (i.indexOf('BoundaryTimer') >= 0) {
      nodeType = 'boundaryTimer'
    }
    if (i.indexOf('CatchTimer') >= 0) {
      nodeType = 'catchTimer'
    }
    if (i.indexOf('StartSignal') >= 0) {
      nodeType = 'startSignal'
    }
    if (i.indexOf('BoundarySignal') >= 0) {
      nodeType = 'boundarySignal'
    }
    if (i.indexOf('CatchSignal') >= 0) {
      nodeType = 'catchSignal'
    }
    if (i.indexOf('ThrowSignal') >= 0) {
      nodeType = 'throwSignal'
    }
    if (i.indexOf('EndError') >= 0) {
      nodeType = 'endError'
    }
    if (i.indexOf('BoundaryError') >= 0) {
      nodeType = 'boundaryError'
    }
    if (i.indexOf('EndTerminate') >= 0) {
      nodeType = 'endTerminate'
    }

    if (nodeType) {
      return nodeType
    }

    return this.nodeTypeMap[oldNodeType] || oldNodeType
  },

  // 获取颜色
  getColor: function (action) {
    if (!action) {
      return Color.success
    }
    switch (action) {
      case 'start':
        return Color.success
      //			    return Color.DEFAULT;
      case 'default':
        return Color.DEFAULT
      case 'agree':
        return Color.success
      case 'signAgree':
        return Color.success
      case 'oppose':
        return Color.PINK
      case 'signOppose':
        return Color.PINK
      case 'reject':
        return Color.PINK
      case 'reject2Start':
        return Color.PINK
      case 'recover':
        return Color.PINK
      case 'dispense':
        return Color.BLUE
      case 'manualEnd':
        return Color.DARK_GRAY
      case 'recall':
        return Color.DARK_GRAY
      case 'create':
        return Color.todo
      case 'end':
        return Color.success
      case 'taskCancelled':
        return Color.cancelled
      case 'success':
        return Color.success
      case 'failed':
        return Color.RED
      default:
        return Color.success
    }
  },
  // 初始化节点类型
  initNodeType: function () {
    const nodeMap = this.imageInfo.nodeMap
    const nodeTypeJson = this.nodeTypeJson
    for (const i in nodeMap) {
      const xyz = nodeMap[i]
      let nodeType = xyz.type || nodeTypeJson[i]
      nodeType = this.getNodeType(nodeType, i)
      if (xyz.signTask == 1) {
        nodeType = 'mutiUserTask'
      }
      if (xyz.multInst == 'start') {
        nodeType = 'mutiInstTaskStart'
      }

      if (xyz.multInst == 'end') {
        nodeType = 'mutiInstTaskEnd'
      }

      if (xyz.dynamicTask == '1') {
        nodeType = 'dynamicTask'
      }

      xyz.nodeType = nodeType
    }
  },
  // 初始化节点和意见的关系
  initNodeOpitions: function () {
    const nodeMap = this.imageInfo.nodeMap
    const opinionMap = this.opinionMap
    for (const i in nodeMap) {
      const opinions = opinionMap[i] || []
      if (!nodeMap[i].opinions || nodeMap[i].opinions.length == 0) {
        nodeMap[i].opinions = opinions
      }

      for (let oi = 0; oi < opinions.length; oi++) {
        opinions[oi].node = nodeMap[i]
      }
    }
  },
  // 初始化节点的前后关系
  initNodeRelation: function () {
    const imageInfo = this.imageInfo
    if (this.createCanvas) {
      // 不需要再关联的,因为之前已经关联过了
      return
    }
    const flowElementJson = this.imageInfo.flowElementJson
    const flowElements = this.imageInfo.flowElements
    const nodeMap = this.imageInfo.nodeMap
    const flowLocation = this.flowLocation

    const newNodeMap = {}
    const newFlowLocation = {}

    const startNodeId = flowElements[0].id
    const startNode = flowElementJson[startNodeId]

    // 起始节点
    newNodeMap[startNodeId] = abUtil.easyClone(nodeMap[startNodeId])
    let hasFilterFirstLine = true
    const startNodeMap = newNodeMap[startNodeId]
    let tempCurrentNodeMap = startNodeMap
    let deep = 0
    const loadedIdList = []
    const that = this

    function getNextNodeAndLines(node) {
      if (loadedIdList.indexOf(node.id) >= 0) {
        return
      }
      loadedIdList.push(node.id)

      if (deep++ > 200) {
        console.error('有问题啦,可能是无限递归')
        return
      }

      const outgoingFlows = node.outgoingFlows || []

      if (outgoingFlows.length == 0) {
        return
      }

      for (let i = 0; i < outgoingFlows.length; i++) {
        let outgoingFlow = outgoingFlows[i]
        let id = outgoingFlow.id
        if (!id) {
          const $ = {
            data: imageInfo,
          }
          outgoingFlow = eval(`(${outgoingFlow.$ref})`)
          id = outgoingFlow.id
        }
        let outgoingFlowNode = flowElementJson[id]
        if (
          outgoingFlow.targetRef == node.id ||
          outgoingFlow.targetRef == node.oldId
        ) {
          continue
        }
        // 判断类型
        if (!outgoingFlowNode || outgoingFlowNode.type == 'SequenceFlow') {
          if (hasFilterFirstLine) {
            newFlowLocation[id] = [...flowLocation[id]]
          } else {
            hasFilterFirstLine = true
          }
          id = outgoingFlow.targetRef
          outgoingFlowNode = flowElementJson[outgoingFlow.targetRef]
        }

        if (loadedIdList.indexOf(id) >= 0) {
          continue
        }

        newNodeMap[id] = abUtil.easyClone(nodeMap[id])
        tempCurrentNodeMap.nextNodeMap = newNodeMap[id]
        newNodeMap[id].preNodeMap = tempCurrentNodeMap
        tempCurrentNodeMap = newNodeMap[id]

        that.setOpinionsByStack(newNodeMap[id])

        // 判断子流程
        const hasEndNode = false
        if (newNodeMap[id].type == 'SubProcess') {
          // eslint-disable-next-line no-inner-declarations
          function getSubProcessNodes(subFlows) {
            if (!subFlows || subFlows.length == 0) {
              return
            }
            const flowElements = subFlows
            const subStartNodeId = flowElements[0].id
            newNodeMap[subStartNodeId] = abUtil.easyClone(
              nodeMap[subStartNodeId]
            )
            if (!tempCurrentNodeMap.nextNodeMap) {
              tempCurrentNodeMap.nextNodeMap = newNodeMap[subStartNodeId]
              newNodeMap[subStartNodeId].preNodeMap = tempCurrentNodeMap
              tempCurrentNodeMap = newNodeMap[subStartNodeId]
            }

            for (let k = 0; k < flowElements.length; k++) {
              if (flowElements[k].id) {
                const subId = flowElements[k].id
                let isSub = nodeMap[subId].type == 'SubProcess'
                // 由于多层的子流程中后端没有返回类型,所以还需要再判断一次
                if (
                  !isSub &&
                  !nodeMap[subId].type &&
                  subId.indexOf('SubProcess') >= 0
                ) {
                  isSub = true
                }

                if (isSub) {
                  getSubProcessNodes(flowElements[k].flowElements)
                }

                getNextNodeAndLines(flowElements[k])
              }
            }
          }

          getSubProcessNodes(outgoingFlowNode.flowElements)
        }

        // 判断是否是结束节点
        getNextNodeAndLines(outgoingFlowNode)
      }
    }

    getNextNodeAndLines(startNode)

    for (const i in imageInfo.nodeMap) {
      if (newNodeMap[i]) {
        imageInfo.nodeMap[i] = newNodeMap[i]
      }
    }
    imageInfo.flowLocation = newFlowLocation
  },
  setOpinionsByStack: function (currentNode) {
    currentNode.opinions = this.opinionMap[currentNode.id]
  },
  // 获取两个节点间的流程信息 [镜像的]
  getFLowImageInfo: function (startNodeId, endNodeId) {
    var imageInfo = this.imageInfo
    const flowElementJson = this.imageInfo.flowElementJson
    const nodeMap = this.imageInfo.nodeMap
    const flowLocation = this.flowLocation

    if (!nodeMap[startNodeId]) {
      //
      let hasNode = false
      for (var i in nodeMap) {
        if (nodeMap[i].oldId == startNodeId) {
          hasNode = true
          startNodeId = nodeMap[i].id
          break
        }
      }
      if (!hasNode) {
        console.error(`找不到开始节点信息:${startNodeId}`)
        return
      }
    }

    if (!nodeMap[endNodeId]) {
      console.error(`找不到结束节点信息:${endNodeId}`)
      return
    }

    const newNodeMap = {}
    const newFlowLocation = {}

    const startNode = flowElementJson[startNodeId]

    // 起始节点
    newNodeMap[startNodeId] = abUtil.easyClone(nodeMap[startNodeId])

    newNodeMap[startNodeId].type = 'StartEvent'
    startNode.type = 'StartEvent'
    newNodeMap[startNodeId].icon = 'mutiInstIcon'
    newNodeMap[startNodeId].reg = -90

    const tempStartNodeId = 'StartNoneEvent_muti'

    startNode.id = tempStartNodeId
    newNodeMap[startNodeId].id = tempStartNodeId
    newNodeMap[tempStartNodeId] = newNodeMap[startNodeId]

    // 将第一个节点改成一个圈圈
    const startNodeMap = newNodeMap[tempStartNodeId]
    startNodeMap.multInst = ''
    startNodeMap.multInstEnd = ''
    startNodeMap.oldId = startNodeId

    const oldW = startNodeMap.width
    const oldH = startNodeMap.height
    startNodeMap.width = 30
    startNodeMap.height = 30
    startNodeMap.x = startNodeMap.x + oldW / 2 + 20
    startNodeMap.y = startNodeMap.y + oldH / 2 + this.yoffset

    startNode.oldId = startNodeId
    delete newNodeMap[startNodeId]

    let hasFilterFirstLine = true
    let isFirstLine = false

    function getNextNodeAndLines(node) {
      const outgoingFlows = node.outgoingFlows || []
      // 判断目标节点是否含有最终节点
      let hasEnd = false
      for (var i = 0; i < outgoingFlows.length; i++) {
        var outgoingFlow = outgoingFlows[i]
        var id = outgoingFlow.id
        var outgoingFlowNode = flowElementJson[id]
        if (outgoingFlow.targetRef == endNodeId) {
          hasEnd = true
          break
        }
      }
      for (var i = 0; i < outgoingFlows.length; i++) {
        var outgoingFlow = outgoingFlows[i]
        var id = outgoingFlow.id
        if (!id) {
          const $ = {
            data: imageInfo,
          }
          outgoingFlow = eval(`(${outgoingFlow.$ref})`)
          id = outgoingFlow.id
        }
        var outgoingFlowNode = flowElementJson[id]
        if (
          outgoingFlow.targetRef == node.id ||
          outgoingFlow.targetRef == node.oldId ||
          (hasEnd && outgoingFlow.targetRef != endNodeId)
        ) {
          continue
        }
        // 判断类型
        if (!outgoingFlowNode || outgoingFlowNode.type == 'SequenceFlow') {
          if (!isFirstLine) {
            isFirstLine = true
            // 设置第一个节点的坐标
            startNodeMap.x = flowLocation[id][0].x - startNodeMap.width + 3
            startNodeMap.y = flowLocation[id][0].y - startNodeMap.height + 3
          }

          if (hasFilterFirstLine) {
            newFlowLocation[id] = [...flowLocation[id]]
          } else {
            hasFilterFirstLine = true
          }
          id = outgoingFlow.targetRef
          outgoingFlowNode = flowElementJson[outgoingFlow.targetRef]
        }

        newNodeMap[id] = abUtil.easyClone(nodeMap[id])
        // 判断子流程
        var hasEndNode = false
        if (newNodeMap[id].type == 'SubProcess') {
          // eslint-disable-next-line no-inner-declarations
          function getSubProcessNodes(subFlows) {
            if (!subFlows || subFlows.length == 0) {
              return
            }
            const flowElements = subFlows
            const subStartNodeId = flowElements[0].id
            newNodeMap[subStartNodeId] = abUtil.easyClone(
              nodeMap[subStartNodeId]
            )

            for (let k = 0; k < flowElements.length; k++) {
              if (flowElements[k].id) {
                const subId = flowElements[k].id
                let isSub = nodeMap[subId].type == 'SubProcess'
                // 由于多层的子流程中后端没有返回类型,所以还需要再判断一次
                if (
                  !isSub &&
                  !nodeMap[subId].type &&
                  subId.indexOf('SubProcess') >= 0
                ) {
                  isSub = true
                }

                if (subId == endNodeId) {
                  hasEndNode = true
                  return hasEndNode
                }

                if (isSub) {
                  const isEnd = getSubProcessNodes(flowElements[k].flowElements)
                  if (isEnd) {
                    return true
                  }
                }

                getNextNodeAndLines(flowElements[k])
              }
            }
          }

          getSubProcessNodes(outgoingFlowNode.flowElements)
        }

        // 判断是否是结束节点
        if (id != endNodeId && !hasEndNode) {
          getNextNodeAndLines(outgoingFlowNode)
        }
      }
    }

    getNextNodeAndLines(startNode)
    var imageInfo = {}

    for (var i in this.imageInfo) {
      if (i != 'flowFn') {
        const item = this.imageInfo[i]
        imageInfo[i] =
          item instanceof Array ? [...item] : abUtil.easyClone(item)
      }
    }

    imageInfo.nodeMap = newNodeMap
    imageInfo.flowLocation = newFlowLocation
    imageInfo.startNodeId = tempStartNodeId
    imageInfo.flowElementJson = flowElementJson

    return imageInfo
  },
  Point: function (x, y) {
    return {
      x: x,
      y: y,
    }
  },
  Rect: function (x, y, w, h) {
    return {
      x: x,
      y: y,
      w: w,
      h: h,
      width: w,
      height: h,
    }
  },
  closeFlow: function () {
    // 超过多层
    if (!window.hisSubFlow || window.hisSubFlow.length == 0) {
      return
    }

    if (window.hisSubFlow.length > 1) {
      const parentFlow = window.hisSubFlow[window.hisSubFlow.length - 2]
      // 打开上一层流程
      const scope = parentFlow.scope
      scope.openCallActivity(
        parentFlow.node,
        parentFlow.subInst,
        parentFlow.type
      )
      window.hisSubFlow.splice(window.hisSubFlow.length - 1, 1)
    }
    window.hisSubFlow.splice(window.hisSubFlow.length - 1, 1)
  },
  /**
   * 获取实例流程图信息
   * @param instanceId 流程实例ID
   * @param defId 流程定义ID
   * @param taskId 任务ID
   * @returns {(function(*): *)|*}
   */
  fetchInstanceFlowImageInfo(instanceId, defId, taskId) {
    return bpmApi.instance.getFlowImagInfo({ instanceId, defId, taskId })
  },
}

window.Color = {
  GREEN: 'rgb(0, 255, 0)', // 绿色
  //		success:"rgb(26, 179, 148)",// 统一
  success: 'rgb(111 167 255)', // 统一
  PINK: 'rgb(255, 175, 175)', // 粉色
  //		PINK:"rgb(255, 175, 175)",// 粉色
  BLUE: 'rgb(0, 0, 255)', // 蓝色
  DARK_GRAY: 'rgb(64, 64, 64)', //
  todo: 'rgb(237, 85, 101)', // 待处理
  cancelled: 'rgb(28, 132, 198)', // 已取消
  RED: 'rgb(255, 0, 0)', // 已处理
  DEFAULT: '#2d7fff', // rgb(103, 106, 108)
  //		MAIN:"#2d7fff",
  MAIN: '#B3BCD0', // 主色调
  LINE: '#B3BCD0', // 线条颜色
  TXT: '#B3BCD0', // 节点文字颜色
}

export default flowCanvas

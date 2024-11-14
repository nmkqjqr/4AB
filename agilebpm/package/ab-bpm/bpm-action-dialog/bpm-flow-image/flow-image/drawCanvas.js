/* eslint-disable no-var */
/* eslint-disable no-self-assign */
/* eslint-disable no-redeclare */
import Arrow from './arrow.js'
import flowCanvas from './flowCanvas.js'
import UserTask from './imags/UserTask.png'
import UserTask_gray from './imags/UserTask_gray.png'

import ServiceTask from './imags/ServiceTask.png'
import ServiceTask_gray from './imags/ServiceTask_gray.png'

import BoundaryErrorEvent_gray from './imags/BoundaryErrorEvent_gray.png'
import BoundaryErrorEvent from './imags/BoundaryErrorEvent.png'
import BoundarySignalEvent_gray from './imags/BoundarySignalEvent_gray.png'
import BoundarySignalEvent from './imags/BoundarySignalEvent.png'
import BoundaryTimerEvent_gray from './imags/BoundaryTimerEvent_gray.png'
import BoundaryTimerEvent from './imags/BoundaryTimerEvent.png'
import CallActivity_gray from './imags/CallActivity_gray.png'
import CallActivity from './imags/CallActivity.png'
import CatchSignalEvent_gray from './imags/CatchSignalEvent_gray.png'
import CatchSignalEvent from './imags/CatchSignalEvent.png'
import CatchTimerEvent_gray from './imags/CatchTimerEvent_gray.png'
import CatchTimerEvent from './imags/CatchTimerEvent.png'
import DynamicTask_gray from './imags/DynamicTask_gray.png'
import DynamicTask from './imags/DynamicTask.png'
import EndErrorEvent_gray from './imags/EndErrorEvent_gray.png'
import EndErrorEvent from './imags/EndErrorEvent.png'
import EndNoneEvent_gray from './imags/EndNoneEvent_gray.png'
import EndNoneEvent from './imags/EndNoneEvent.png'
import EndTerminateEvent_gray from './imags/EndTerminateEvent_gray.png'
import EndTerminateEvent from './imags/EndTerminateEvent.png'

import ExclusiveGateway_gray from './imags/ExclusiveGateway_gray.png'
import ExclusiveGateway from './imags/ExclusiveGateway.png'
import InclusiveGateway_gray from './imags/InclusiveGateway_gray.png'
import InclusiveGateway from './imags/InclusiveGateway.png'
import IntermediateCatchEvent_gray from './imags/IntermediateCatchEvent_gray.png'
import IntermediateCatchEvent from './imags/IntermediateCatchEvent.png'
import MutiInstTaskEnd_gray from './imags/MutiInstTaskEnd_gray.png'
import MutiInstTaskEnd from './imags/MutiInstTaskEnd.png'
import MutiInstTaskStart_gray from './imags/MutiInstTaskStart_gray.png'
import MutiInstTaskStart from './imags/MutiInstTaskStart.png'

import myStyle_gray from './imags/myStyle_gray.png'
import myStyle from './imags/myStyle.png'
import oppose from './imags/oppose.png'
import ParallelGateway_gray from './imags/ParallelGateway_gray.png'
import ParallelGateway from './imags/ParallelGateway.png'
import SignTask_gray from './imags/SignTask_gray.png'

import SignTask from './imags/SignTask.png'
import StartNoneEvent_gray from './imags/StartNoneEvent_gray.png'
import StartNoneEvent from './imags/StartNoneEvent.png'
import StartNoneEvent_muti_gray from './imags/StartNoneEvent_muti_gray.png'
import StartNoneEvent_muti from './imags/StartNoneEvent_muti.png'
import StartSignalEvent_gray from './imags/StartSignalEvent_gray.png'
import StartSignalEvent from './imags/StartSignalEvent.png'
import StartTimerEvent_gray from './imags/StartTimerEvent_gray.png'
import StartTimerEvent from './imags/StartTimerEvent.png'
import SubProcess from './imags/SubProcess.png'
import ThrowSignalEvent_gray from './imags/ThrowSignalEvent_gray.png'
import ThrowSignalEvent from './imags/ThrowSignalEvent.png'
import tongyi from './imags/tongyi.png'

// 可以删掉，只是测试图片
import custAir from './imags/custAir.png'
import custAnt from './imags/custAnt.png'
import custMachine from './imags/custMachine.png'
import custRobot from './imags/custRobot.png'

//

const flowImages = {
  custAir_gray: custAir,
  custAir: custAir,
  custAnt_gray: custAnt,
  custAnt: custAnt,
  custMachine: custMachine,
  custMachine_gray: custMachine,
  custRobot: custRobot,
  custRobot_gray: custRobot,

  BoundaryErrorEvent_gray: BoundaryErrorEvent_gray,
  BoundaryErrorEvent: BoundaryErrorEvent,

  BoundarySignalEvent_gray: BoundarySignalEvent_gray,
  BoundarySignalEvent: BoundarySignalEvent,
  BoundaryTimerEvent_gray: BoundaryTimerEvent_gray,
  BoundaryTimerEvent: BoundaryTimerEvent,
  CallActivity_gray: CallActivity_gray,
  CallActivity: CallActivity,
  CatchSignalEvent_gray: CatchSignalEvent_gray,
  CatchSignalEvent: CatchSignalEvent,
  CatchTimerEvent_gray: CatchTimerEvent_gray,
  CatchTimerEvent: CatchTimerEvent,
  DynamicTask_gray: DynamicTask_gray,
  DynamicTask: DynamicTask,
  EndErrorEvent_gray: EndErrorEvent_gray,
  EndErrorEvent: EndErrorEvent,
  EndNoneEvent_gray: EndNoneEvent_gray,
  EndNoneEvent: EndNoneEvent,
  EndTerminateEvent_gray: EndTerminateEvent_gray,
  EndTerminateEvent: EndTerminateEvent,
  ExclusiveGateway_gray: ExclusiveGateway_gray,
  ExclusiveGateway: ExclusiveGateway,
  InclusiveGateway_gray: InclusiveGateway_gray,
  InclusiveGateway: InclusiveGateway,
  IntermediateCatchEvent_gray: IntermediateCatchEvent_gray,
  IntermediateCatchEvent: IntermediateCatchEvent,
  MutiInstTaskEnd_gray: MutiInstTaskEnd_gray,
  MutiInstTaskEnd: MutiInstTaskEnd,
  MutiInstTaskStart_gray: MutiInstTaskStart_gray,
  MutiInstTaskStart: MutiInstTaskStart,
  myStyle_gray: myStyle_gray,
  myStyle: myStyle,
  oppose: oppose,
  ParallelGateway_gray: ParallelGateway_gray,
  ParallelGateway: ParallelGateway,
  ServiceTask_gray: ServiceTask_gray,
  ServiceTask: ServiceTask,
  SignTask_gray: SignTask_gray,
  SignTask: SignTask,
  StartNoneEvent_gray: StartNoneEvent_gray,
  StartNoneEvent: StartNoneEvent,
  StartNoneEvent_muti_gray: StartNoneEvent_muti_gray,
  StartNoneEvent_muti: StartNoneEvent_muti,
  StartSignalEvent_gray: StartSignalEvent_gray,
  StartSignalEvent: StartSignalEvent,
  StartTimerEvent_gray: StartTimerEvent_gray,
  StartTimerEvent: StartTimerEvent,
  SubProcess: SubProcess,
  ThrowSignalEvent_gray: ThrowSignalEvent_gray,
  ThrowSignalEvent: ThrowSignalEvent,
  tongyi: tongyi,
  UserTask_gray: UserTask_gray,
  UserTask: UserTask,
}

// 定义绘制函数
function drawFlowImg(flowCanvasFn) {
  for (const i in drawFn) {
    this[i] = drawFn[i]
  }
  for (const j in flowCanvasFn) {
    this[j] = flowCanvasFn[j]
  }
}

var drawFn = {
  drawFlowImage: function () {
    this.hasDrawedLineId = {}
    // 测试用的node,非测试时要注释掉
    //    	this.initTestNode();

    // 绘制线条
    this.drawLine()

    // 绘制节点
    this.drawNode()

    // 绘制驳回线条 , 在支持虚线的浏览器中才绘制驳回线条
    if (this.cxt.setLineDash) {
      this.drawBohui()
    }
  },
  // 节点点击事件
  clickNode: function (params) {
    const node = params.node
    const opinion = params.opinion
    const subInst = params.subInst
    const flowFn = params.fn
    const type = params.type

    if (node) {
      this.imageInfo.selectNode = node
    }

    if (type == 'parentFlow') {
      flowFn.openParent(params, type)
      return
    }
    // 绘制多实例
    flowFn.drawMutiInstFlow(node, opinion, type)

    // 打开外部子流程
    flowFn.openCallActivity(node, subInst, type)

    // 打开动态任务节点
    flowFn.drawDynamicNodeFlow(node)
  },
  openParent: function (params, type) {
    // debugger
    const instId = params.instId

    // 获取流程节点坐标
    // const defer1 = this.scope.abHttpUtil.postForm(
    //   '/bpm/instance/getFlowImageInfo',
    //   {
    //     instanceId: instId,
    //   }
    // )

    // const that = this
    // this.scope.abTools.getResultData(defer1, function (data) {
    //   that.openSubFlow(data, instId, '父流程')
    // })

    this.fetchInstanceFlowImageInfo(instId).then((res) => {
      this.openSubFlow(res.data, instId, '父流程')
    })
  },
  // 绘制节点
  drawNodeFn: function (nodeTypes) {
    const nodeMap = this.imageInfo.nodeMap
    const nodeTypeJson = this.nodeTypeJson
    const flowElementJson = this.imageInfo.flowElementJson
    const opinionMap = this.imageInfo.opinionMap || {}
    const nodeNameJson = this.nodeNameJson
    const stackJson = this.stackJson
    const flowColorJson = this.flowColorJson
    const flowLocation = this.flowLocation
    const xoffset = this.xoffset
    const yoffset = this.yoffset

    // 绘制节点
    for (const i in nodeMap) {
      const xyz = nodeMap[i]
      const nodeType = xyz.nodeType
      const nodeName = xyz.nodeName || xyz.taskName || ''
      //		    nodeName = nodeName+nodeName+nodeName
      const flowElement = xyz.flowElement
      const color = xyz.color
      // color = "white";
      if (nodeTypes.indexOf(nodeType) < 0) {
        continue
      }

      xyz.marginTop = '10px'
      if (nodeName.length >= 8) {
        xyz.marginTop = '4px'
      }

      // 调试用的
      if (nodeName != '多实例结束') {
        //		    	continue;
      }
      if (i != 'UserTask3') {
        //		    	continue;
      }
      //		    debugger

      this.drawTaskBackgroudImg(
        xyz,
        xyz.x - xoffset,
        xyz.y - yoffset,
        xyz.width,
        xyz.height
      )
      // 绘制线条上的文字,顺序不能放在后面,否则会被覆盖
      this.drawLineTxt(xoffset, yoffset, flowElement)
      switch (nodeType) {
        case 'startEvent':
        case 'endEvent':
          // color = Color.MAIN;
          //				    this.drawCircle ( xyz.x - xoffset , xyz.y - yoffset , xyz.width , xyz.height , color , '' , xyz.icon , xyz.reg );//
          this.drawCircleTxt(
            xyz.x - xoffset,
            xyz.y - yoffset,
            xyz.width,
            xyz.height,
            color,
            nodeName,
            xyz.icon
          ) //
          break
        case 'subProcess': // 子流程
          this.drawSubProcess(
            xyz.x - xoffset,
            xyz.y - yoffset,
            xyz.width,
            xyz.height,
            nodeName,
            '',
            color
          ) //
          break
        case 'callActivity': // 外部子流程
          this.drawCallActivity(
            xyz.x - xoffset,
            xyz.y - yoffset,
            xyz.width,
            xyz.height,
            nodeName,
            '',
            color
          )
          break
        case 'textAnnotation':
          this.drawTextAnnotation(
            xyz.x - xoffset,
            xyz.y - yoffset,
            xyz.width,
            xyz.height,
            nodeName,
            color
          ) //
          break
        case 'serviceTask': // 服务
          this.drawTaskNode(
            xyz.x - xoffset,
            xyz.y - yoffset,
            xyz.width,
            xyz.height,
            nodeName,
            'serviceIcon',
            color,
            0,
            xyz
          ) //
          break
        case 'exclusiveGateway': // 分支网关
          this.drawExclusiveGateway(
            xyz.x - xoffset + 5,
            xyz.y - yoffset,
            nodeName,
            Color.MAIN
          )
          break
        case 'parallelGateway': // 并行网关
          this.drawParallelGateway(
            xyz.x - xoffset,
            xyz.y - yoffset,
            nodeName,
            Color.MAIN
          )

          break
        case 'inclusiveGateway': // 并行条件网关
          this.drawInclusiveGateway(
            xyz.x - xoffset,
            xyz.y - yoffset,
            nodeName,
            Color.MAIN
          )

          break
        case 'startTimer': // 定时开始节点
        case 'boundaryTimer': // 定时事件边界
        case 'catchTimer': // 定时等待节点
          this.drawBoundaryTimer(
            xyz.x - xoffset,
            xyz.y - yoffset,
            xyz.width,
            xyz.height,
            color,
            nodeName
          ) //
          break
        case 'startSignal': // 信号开始事件
        case 'boundarySignal': // 信号边界事件
        case 'catchSignal': // 信号等待节点
          this.drawStartSignalEvent(
            xyz.x - xoffset,
            xyz.y - yoffset,
            xyz.width,
            xyz.height,
            color,
            nodeName
          ) //
          break
        case 'throwSignal': // 信号抛出节点
          this.drawBoundarySignalEvent(
            xyz.x - xoffset,
            xyz.y - yoffset,
            xyz.width,
            xyz.height,
            Color.MAIN,
            nodeName
          ) //
          break
        case 'endError': // 结束错误事件
          this.drawEndErrorEvent(
            xyz.x - xoffset,
            xyz.y - yoffset,
            xyz.width,
            xyz.height,
            Color.MAIN,
            nodeName
          ) //
          break
        case 'boundaryError': // 错误边界事件
          this.drawBoundaryErrorEvent(
            xyz.x - xoffset,
            xyz.y - yoffset,
            xyz.width,
            xyz.height,
            Color.MAIN,
            nodeName
          ) //
          break
        case 'endTerminate': // 结束终止事件
          this.drawEndTerminateEvent(
            xyz.x - xoffset,
            xyz.y - yoffset,
            xyz.width,
            xyz.height,
            Color.MAIN,
            nodeName
          ) //
          break
        case 'pool': // 池
        case 'lane': //
          xyz.hideDiv = true
          this.drawPool(
            xyz.x - xoffset,
            xyz.y - yoffset,
            xyz.width,
            xyz.height,
            nodeName,
            '',
            color
          ) //
          break
        case 'mutiUserTask': // 会签任务
          this.drawTaskNode(
            xyz.x - xoffset,
            xyz.y - yoffset,
            xyz.width,
            xyz.height,
            nodeName,
            'mutiUserIcon',
            color,
            0,
            xyz
          ) //
          break
        case 'mutiInstTaskStart': // 多实例任务
          // 绘制多实例之间的线条
          if (xyz.opinions.length > 0) {
            this.drawDuoshili(xyz.preNodeMap, xyz, xyz.opinions.length)
          }
          this.drawTaskNode(
            xyz.x - xoffset,
            xyz.y - yoffset,
            xyz.width,
            xyz.height,
            nodeName,
            'mutiInstIcon',
            color,
            -90,
            xyz
          ) //
          break
        case 'mutiInstTaskEnd': // 多实例任务
          this.drawTaskNode(
            xyz.x - xoffset,
            xyz.y - yoffset,
            xyz.width,
            xyz.height,
            nodeName,
            'mutiInstIcon',
            color,
            90,
            xyz
          ) //
          break
        case 'dynamicTask': // 动态任务
          // 获取动态任务节点的执行情况
          if (stackJson[i] && stackJson[i].actionName == 'create') {
            xyz.dynamicTaskCounts = `${
              stackJson[i].taskName.split('-')[
                stackJson[i].taskName.split('-').length - 1
              ]
            }/${xyz.dynamicTaskCounts}`
          }
          //				    this.drawDynamicNode ( xyz.x - xoffset , xyz.y - yoffset , xyz.width , xyz.height , nodeName , "dynamicTaskIcon" , color , xyz.dynamicTaskCounts );//
          this.drawTaskNode(
            xyz.x - xoffset,
            xyz.y - yoffset,
            xyz.width,
            xyz.height,
            nodeName,
            'userIcon',
            color,
            '',
            xyz
          ) //
          break
        case 'userTask': // 用户任务
        default: //
          this.drawTaskNode(
            xyz.x - xoffset,
            xyz.y - yoffset,
            xyz.width,
            xyz.height,
            nodeName,
            'userIcon',
            color,
            '',
            xyz
          )
          break
      }
    }
  },
  drawDynamicNodeFlow: function (node) {
    let dynamicTaskCounts = node.dynamicTaskCounts || ''
    dynamicTaskCounts = `${dynamicTaskCounts}`
    if (!node || !dynamicTaskCounts) {
      return
    }

    // 获取意见列表
    const opinions = node.opinions
    if (!opinions) {
      return
    }
    const taskDefKey = node.id

    const opJson = {}
    let idx = 0
    for (var i = 0; i < opinions.length; i++) {
      const oldOp = opJson[opinions[i].taskName] || {
        opIdx: idx++,
      }
      const oldIdx = oldOp.opIdx
      opJson[opinions[i].taskName] = opinions[i]
      opJson[opinions[i].taskName].opIdx = oldIdx
    }
    const opinionMap = {}
    for (var i in opJson) {
      var op = opJson[i]
      opinionMap[`${taskDefKey}_${op.opIdx}`] = [op]
    }

    const dynamicTaskCountsSplit = dynamicTaskCounts.split('/')
    const count = parseInt(
      dynamicTaskCountsSplit[dynamicTaskCountsSplit.length - 1]
    )

    const startX = 100
    const startY = 100
    const lineWidth = 80
    const width = 100
    const height = 80

    const newNodeMap = {}
    const newFlowLocation = {}
    for (var i = 0; i < count; i++) {
      // 创建节点
      let id = `${taskDefKey}_${i}`
      var op = (opinionMap[id] && opinionMap[id][0]) || {}
      const tempNode = {
        id: id,
        height: height,
        width: width,
        x: startX + width * i + lineWidth * i,
        y: startY,
        taskName: op.taskName || node.nodeName,
        op: op,
      }
      // nodeName 可能不对
      newNodeMap[id] = tempNode

      // 创建连线
      if (i < count - 1) {
        id = `${taskDefKey}_line_${i}`
        const tempLine = [
          {
            id: id,
            height: 0,
            width: 0,
            x: startX + width * i + lineWidth * i + width,
            y: startY + height / 2,
          },
          {
            id: id,
            height: 0,
            width: 0,
            x: startX + width * i + lineWidth * i + width + lineWidth,
            y: startY + height / 2,
          },
        ]
        newFlowLocation[id] = tempLine
      }
    }
    const newNodeList = []
    const newFlowLocationList = []
    for (var i in newNodeMap) {
      newNodeList.push(newNodeMap[i])
    }
    for (var i in newFlowLocation) {
      newFlowLocationList.push(newFlowLocation[i])
    }

    // 创建flowElements和stacks
    const flowElements = []
    const stacks = []
    for (var i = 0; i < newNodeList.length; i++) {
      var node = newNodeList[i]
      const tempNodeFlowElements = {
        id: node.id,
        name: node.taskName,
        status: node.op.status || 'default',
        type: 'UserTask',
      }
      flowElements.push(tempNodeFlowElements)
      stacks.push({
        actionName: node.op.status || 'default',
        taskDefKey: node.id,
        nodeType: 'userTask',
        nodeName: node.taskName,
      })

      if (i < newNodeList.length - 1) {
        const line = newFlowLocationList[i][0]
        const tempLineFlowElements = {
          id: line.id,
          sourceRef: newNodeList[i].id,
          targetRef: newNodeList[i + 1].id,
          status: node.op.status || 'default',
          type: 'SequenceFlow',
        }
        flowElements.push(tempLineFlowElements)
        stacks.push({
          actionName: node.op.status || 'default',
          taskDefKey: line.id,
          nodeType: 'sequenceFlow',
        })
        tempNodeFlowElements.outgoingFlows = [tempLineFlowElements]
      }
    }

    const imageInfo = {}

    imageInfo.nodeMap = newNodeMap
    imageInfo.flowLocation = newFlowLocation
    imageInfo.flowElements = flowElements
    imageInfo.opinionMap = opinionMap
    imageInfo.stacks = stacks

    this.openSubFlow(imageInfo, taskDefKey, `${node.taskName}-动态任务流程图`)
  },
  openSubFlow: function (subImageInfo, taskDefKey, title) {
    this.scope.subImageInfo = subImageInfo
    const flowImageCanvas = new flowCanvas(
      this.scope,
      `${taskDefKey}_flowImageCanvas`,
      subImageInfo,
      true
    )
    const drawFn = flowImageCanvas.initDraw()
    flowImageCanvas.fetchInstanceFlowImageInfo = this.fetchInstanceFlowImageInfo

    this.scope.subImageInfo.title = title
    this.scope.subImageInfo.show = true
    window.setTimeout(() => {
      const el = document.getElementById('subFlowImageCanvas')
      el.innerHTML = ''
      el.append(flowImageCanvas.canvas)
      drawFn.drawFlowImage() // 重构后的代码
    }, 100)
  },
  // 绘制多实例
  drawMutiInstFlow: function (node, opinion, type) {
    if (node.multInst != 'start') {
      return
    }

    if (this.createCanvas) {
      // 不再打开二级多实例
      return false
    }

    let opinionNodeId = ''
    const scope = this.scope
    const taskDefKey = node.preNodeMap.id

    // 获取nodeId 与 回收节点之间的节点信息
    let imageInfo = {}
    let startNodeId = taskDefKey
    if (node.multInst == 'start') {
      imageInfo = this.getFLowImageInfo(taskDefKey, node.multInstEnd)
    } else {
      startNodeId = node.multInstStart
      imageInfo = this.getFLowImageInfo(node.multInstStart, taskDefKey)
    }

    if (!imageInfo) {
      return
    }

    if (!opinionNodeId) {
      opinionNodeId = imageInfo.nodeMap[imageInfo.startNodeId].nextNodeMap.id
    }

    const nodeOpinions = imageInfo.opinionMap[opinionNodeId]
    if (!nodeOpinions) {
      // 如果还没有到这个节点,就直接绘制
      this.drawDynamicFlow(node)
      return
    }

    this.scope.selectedOpinions = nodeOpinions

    this.openOpinionFlow(
      opinion || nodeOpinions[nodeOpinions.length - 1],
      imageInfo
    )
  },
  // 定义接口，实际由flowCanvas传递过来
  fetchInstanceFlowImageInfo(instanceId, defId, taskId) {
    return { data: {} }
  },
  openOpinionFlow: function (nodeOpinion, imageInfo) {
    const scope = this.scope
    scope.selectedOpinion = nodeOpinion
    let instanceId = ''
    const defId = ''
    let taskId = ''
    let name = ''
    instanceId = nodeOpinion.instId
    // defId = nodeOpinion.mainDefId;
    taskId = nodeOpinion.taskId
    name = `${nodeOpinion.taskName} 分发任务-${nodeOpinion.trace}`

    // 获取流程节点坐标
    // const defer1 = this.scope.abHttpUtil.postForm(
    //   '/bpm/instance/getFlowImageInfo',
    //   {
    //     instanceId: instanceId,
    //     defId: defId,
    //     taskId: taskId,
    //   }
    // )

    // const that = this

    // this.scope.abTools.getResultData(defer1, function (data) {
    //   data.nodeMap = imageInfo.nodeMap
    //   data.flowLocation = imageInfo.flowLocation

    //   that.openSubFlow(data, imageInfo.startNodeId, name)
    // })

    this.fetchInstanceFlowImageInfo(instanceId, defId, taskId).then((res) => {
      const data = res.data
      data.nodeMap = imageInfo.nodeMap
      data.flowLocation = imageInfo.flowLocation
      this.openSubFlow(data, imageInfo.startNodeId, name)
    })
  },
  // 打开外部子流程
  openCallActivity: function (node, subInst, type) {
    if (!node || node.type != 'CallActivity') {
      return
    }
    if (type && type != 'subInst') {
      return
    }

    if (type != 'subInst') {
      window.hisSubFlow = window.hisSubFlow || []
      window.hisSubFlow.push({
        scope: this,
        node: node,
        subInst: subInst,
        type: type,
      })
    }

    const scope = this.scope
    const taskDefKey = node.id
    let instanceId = ''
    let defId = ''
    let taskId = ''
    let name = ''

    const subDefinition = node.subDefinition
    if (subDefinition) {
      instanceId = subDefinition.instanceId
      defId = subDefinition.id
      taskId = subDefinition.taskId
      name = subDefinition.name
    }
    const subInstanceList = node.subInstanceList
    if (subInstanceList && subInstanceList.length > 0) {
      let selectedSubInst = subInst
      if (!selectedSubInst) {
        selectedSubInst = subInstanceList[subInstanceList.length - 1]
      }

      this.scope.selectedSubInstanceList = subInstanceList
      this.scope.selectedSubInst = selectedSubInst
      instanceId = selectedSubInst.id
      defId = selectedSubInst.defId
      taskId = selectedSubInst.taskId
      name = selectedSubInst.defName
    }

    // 获取流程节点坐标
    this.fetchInstanceFlowImageInfo(instanceId, defId, taskId).then((res) => {
      this.openSubFlow(res.data, taskDefKey, name)
    })
  },
  // 绘制多实例动态流程图
  drawDynamicFlow: function (node) {
    if (!node || !node.multInst) {
      return
    }

    const scope = this.scope
    const taskDefKey = node.id
    // 获取nodeId 与 回收节点之间的节点信息
    let imageInfo = {}
    if (node.multInst == 'start') {
      imageInfo = this.getFLowImageInfo(taskDefKey, node.multInst_end)
    } else {
      imageInfo = this.getFLowImageInfo(node.multInst_start, taskDefKey)
    }

    this.openSubFlow(
      imageInfo,
      taskDefKey,
      `${this.imageInfo.flowElementJson[taskDefKey].name}-多实例分发流程图`
    )
  },
  drawNode: function () {
    // 先绘制子流程,泳道池
    this.drawNodeFn(['subProcess', 'callActivity', 'pool', 'lane'])

    // 再绘制其他节点
    this.drawNodeFn([
      'startEvent',
      'endEvent',
      'serviceTask',
      'exclusiveGateway', //
      'parallelGateway',
      'inclusiveGateway',
      'startTimer',
      'startSignal', //
      'endError',
      'endTerminate',
      'userTask',
      'ServiceTask',
      UserTask, //
      'catchTimer', // 任务定时
      'mutiUserTask',
      'mutiInstTaskStart',
      'mutiInstTaskEnd',
      'dynamicTask', //
    ])
    // 最后绘制 边界事件
    this.drawNodeFn([
      'boundaryTimer',
      'throwSignal',
      'textAnnotation',
      'catchSignal',
      'boundaryError',
      'boundarySignal',
    ])
  },

  // 用来测试用的,
  initTestNode: function () {
    this.imageInfo.nodeMap = []
    const stackJson = this.stackJson
    var n1 = {
      id: 'UserTask1',
      x: 500,
      y: 500,
      width: 100,
      height: 80,
      nodeType: 'userTask',
      nodeName: '驳回中心',
      color: 'rgb(26, 179, 148)',
      type: 'UserTask',
      nextNodeMap: n2,
      preNodeMap: n1,
    }

    const xof = 300
    const yof = 200

    var n2 = {
      id: 'UserTask2',
      x: n1.x - xof,
      y: n1.y - yof,
      width: 100,
      height: 80,
      nodeType: 'userTask',
      nodeName: '驳回到2',
      color: 'rgb(26, 179, 148)',
      type: 'UserTask',
      //        		nextNodeMap : n2,
      preNodeMap: n1,
    }

    const n3 = {
      id: 'UserTask3',
      x: n1.x - xof,
      y: n1.y - yof,
      width: 100,
      height: 80,
      nodeType: 'userTask',
      nodeName: '驳回到3',
      color: 'rgb(26, 179, 148)',
      type: 'UserTask',
      //        		nextNodeMap : n2,
      preNodeMap: n1,
    }

    const n4 = {
      id: 'UserTask4',
      x: n1.x + xof,
      y: n1.y - yof,
      width: 100,
      height: 80,
      nodeType: 'userTask',
      nodeName: '驳回到4',
      color: 'rgb(26, 179, 148)',
      type: 'UserTask',
      //        		nextNodeMap : n2,
      preNodeMap: n1,
    }

    const n5 = {
      id: 'UserTask5',
      x: n1.x + xof,
      y: n1.y + yof,
      width: 100,
      height: 80,
      nodeType: 'userTask',
      nodeName: '驳回到5',
      color: 'rgb(26, 179, 148)',
      type: 'UserTask',
      //        		nextNodeMap : n2,
      preNodeMap: n1,
    }

    const n6 = {
      id: 'UserTask6',
      x: n1.x + xof,
      y: n1.y,
      width: 100,
      height: 80,
      nodeType: 'userTask',
      nodeName: '驳回到6',
      color: 'rgb(26, 179, 148)',
      type: 'UserTask',
      //        		nextNodeMap : n2,
      preNodeMap: n1,
    }

    const n7 = {
      id: 'UserTask7',
      x: n1.x - xof,
      y: n1.y,
      width: 100,
      height: 80,
      nodeType: 'userTask',
      nodeName: '驳回到7',
      color: 'rgb(26, 179, 148)',
      type: 'UserTask',
      //        		nextNodeMap : n2,
      preNodeMap: n1,
    }

    const n8 = {
      id: 'UserTask8',
      x: n1.x,
      y: n1.y + yof,
      width: 100,
      height: 80,
      nodeType: 'userTask',
      nodeName: '驳回到8',
      color: 'rgb(26, 179, 148)',
      type: 'UserTask',
      //        		nextNodeMap : n2,
      preNodeMap: n1,
    }

    const n9 = {
      id: 'UserTask9',
      x: n1.x,
      y: n1.y - yof,
      width: 100,
      height: 80,
      nodeType: 'userTask',
      nodeName: '驳回到9',
      color: 'rgb(26, 179, 148)',
      type: 'UserTask',
      //        		nextNodeMap : n2,
      preNodeMap: n1,
    }

    const n10 = {
      id: 'UserTask10',
      x: n1.x - xof,
      y: n1.y + yof,
      width: 100,
      height: 80,
      nodeType: 'userTask',
      nodeName: '驳回到10',
      color: 'rgb(26, 179, 148)',
      type: 'UserTask',
      //        		nextNodeMap : n2,
      preNodeMap: n1,
    }

    stackJson.back = {
      nodeName: `${n1.id}-》${n2.id}`,
      color: 'rgb(0, 255, 0)',
    }

    stackJson.back1 = {
      nodeName: `${n1.id}-》${n3.id}`,
      color: 'rgb(0, 255, 255)',
    }
    stackJson.back2 = {
      nodeName: `${n1.id}-》${n4.id}`,
      color: 'rgb(255, 255, 255)',
    }
    stackJson.back3 = {
      nodeName: `${n1.id}-》${n5.id}`,
      color: 'rgb(26, 179, 148)',
    }
    stackJson.back4 = {
      nodeName: `${n1.id}-》${n6.id}`,
      color: 'rgb(26, 179, 148)',
    }
    stackJson.back5 = {
      nodeName: `${n1.id}-》${n7.id}`,
      color: 'rgb(26, 179, 148)',
    }
    stackJson.back6 = {
      nodeName: `${n1.id}-》${n8.id}`,
      color: 'rgb(26, 179, 148)',
    }
    stackJson.back7 = {
      nodeName: `${n1.id}-》${n9.id}`,
      color: 'rgb(26, 179, 148)',
    }
    stackJson.back8 = {
      nodeName: `${n1.id}-》${n10.id}`,
      color: 'rgb(26, 179, 148)',
    }

    this.imageInfo.nodeMap[n1.id] = n1
    this.imageInfo.nodeMap[n2.id] = n2
    this.imageInfo.nodeMap[n3.id] = n3
    this.imageInfo.nodeMap[n4.id] = n4
    this.imageInfo.nodeMap[n5.id] = n5
    this.imageInfo.nodeMap[n6.id] = n6
    this.imageInfo.nodeMap[n7.id] = n7
    this.imageInfo.nodeMap[n8.id] = n8
    this.imageInfo.nodeMap[n9.id] = n9
    this.imageInfo.nodeMap[n10.id] = n10
  },
  // 绘制驳回的效果 - 这种是以两个矩形计算出四个点来连线
  drawBohui: function () {
    const nodeMap = this.imageInfo.nodeMap
    const nodeTypeJson = this.nodeTypeJson
    const flowElementJson = this.imageInfo.flowElementJson
    const opinionMap = this.imageInfo.opinionMap || {}
    const nodeNameJson = this.nodeNameJson
    const stacks = this.imageInfo.stacks || []
    const flowColorJson = this.flowColorJson
    const flowLocation = this.flowLocation
    const xoffset = this.xoffset
    const yoffset = this.yoffset
    for (let i = 0; i < stacks.length; i++) {
      if (stacks[i].actionName == 'reject' && stacks[i].taskDefKey == 'back') {
        //  "UserTask4-》UserTask3"
        const stack = stacks[i]
        const startNode = nodeMap[stack.taskName.split('-》')[0]]
        const endNode = nodeMap[stack.taskName.split('-》')[1]]
        if (!startNode || !endNode) {
          continue
        }

        const startPoint = {
          x: startNode.x,
          y: startNode.y,
          w: startNode.width,
          h: startNode.height,
        }
        const endPoint = {
          x: endNode.x,
          y: endNode.y,
          w: endNode.width,
          h: endNode.height,
        }

        const points = this.getPointFromTwoBox(startNode, endNode)
        for (let pi = 0; pi < points.length - 1; pi++) {
          const flowFrom = points[pi]
          const flowTo = points[pi + 1]

          const arrow = new Arrow(
            flowFrom.x - xoffset,
            flowFrom.y - yoffset,
            flowTo.x - xoffset,
            flowTo.y - yoffset
          )
          arrow.setColor(Color.PINK)
          arrow.setLineWidth(1)
          arrow.setDash(true) // 虚线
          // 线段的最后一条折线才需要箭头
          if (pi == points.length - 2) {
            arrow.setHead(true)
          }
          arrow.draw(this.cxt)
        }
      }
    }
  },
  //  绘制驳回的效果 - 这种是用定点的方式连线
  drawBohui_back: function () {
    const nodeMap = this.imageInfo.nodeMap
    const nodeTypeJson = this.nodeTypeJson
    const flowElementJson = this.imageInfo.flowElementJson
    const opinionMap = this.imageInfo.opinionMap || {}
    const nodeNameJson = this.nodeNameJson
    const stackJson = this.stackJson
    const flowColorJson = this.flowColorJson
    const flowLocation = this.flowLocation
    const xoffset = this.xoffset
    const yoffset = this.yoffset
    for (const i in stackJson) {
      if (i == 'back') {
        //  "UserTask4-》UserTask3"
        const stack = stackJson[i]
        const startNode = nodeMap[stack.taskName.split('-》')[0]]
        const endNode = nodeMap[stack.taskName.split('-》')[1]]
        const startPoint = {
          x: startNode.x,
          y: startNode.y,
          w: startNode.width,
          h: startNode.height,
        }
        const endPoint = {
          x: endNode.x,
          y: endNode.y,
          w: endNode.width,
          h: endNode.height,
        }

        const minDist = this.getMinDistancePoint(
          [
            { x: startPoint.x, y: startPoint.y },
            { x: startPoint.x + startPoint.w, y: startPoint.y },
            { x: startPoint.x, y: startPoint.y + startPoint.h },
            { x: startPoint.x + startPoint.w, y: startPoint.y + startPoint.h },
          ],
          [
            { x: endPoint.x, y: endPoint.y },
            { x: endPoint.x + endPoint.w, y: endPoint.y },
            { x: endPoint.x, y: endPoint.y + endPoint.h },
            { x: endPoint.x + endPoint.w, y: endPoint.y + endPoint.h },
          ]
        )
        const flowFrom = minDist.s
        const flowTo = minDist.e
        const deg = this.getAngle(flowFrom.x, flowFrom.y, flowTo.x, flowTo.y)

        const arrow = new Arrow(
          flowFrom.x - xoffset,
          flowFrom.y - yoffset,
          flowTo.x - xoffset,
          flowTo.y - yoffset
        )
        arrow.setColor(Color.PINK)
        arrow.setHead(true)
        arrow.setDash(true) // 虚线
        arrow.draw(this.cxt)
        break
      }
    }
  },
  // 绘制多实例的效果 - 后来决定只写到原来的线
  drawDuoshili: function (startNode, endNode, count) {
    const flow =
      this.imageInfo.flowLocation[startNode.flowElement.outgoingFlows[0].id]
    const xoffset = this.xoffset
    const yoffset = this.yoffset
    const color = Color.success
    const flowFrom = flow[0]
    const flowTo = flow[1]
    // 让分发数字写在最后一个点的边边
    this.drawTxt(
      flowTo.x - 36 - xoffset,
      flowTo.y - yoffset,
      flowTo.x - xoffset,
      flowTo.y - yoffset,
      count,
      color
    )
  },
  // 绘制多实例的效果 - 矩形的方式
  drawDuoshili_back2: function (startNode, endNode, count) {
    const nodeMap = this.imageInfo.nodeMap
    const nodeTypeJson = this.nodeTypeJson
    const flowElementJson = this.imageInfo.flowElementJson
    const opinionMap = this.imageInfo.opinionMap || {}
    const nodeNameJson = this.nodeNameJson
    const stackJson = this.stackJson
    const flowColorJson = this.flowColorJson
    const flowLocation = this.flowLocation
    const xoffset = this.xoffset
    const yoffset = this.yoffset

    const points = this.getPointFromTwoBox(startNode, endNode)
    for (let pi = 0; pi < points.length - 1; pi++) {
      var flowFrom = points[pi]
      var flowTo = points[pi + 1]

      const arrow = new Arrow(
        flowFrom.x - xoffset,
        flowFrom.y - yoffset,
        flowTo.x - xoffset,
        flowTo.y - yoffset
      )
      arrow.setColor(stackJson.color || Color.PINK)
      arrow.setDash(true) // 虚线
      // 线段的最后一条折线才需要箭头
      if (pi == points.length - 2) {
        arrow.setHead(true)
      }
      arrow.draw(this.cxt)
    }

    const color = Color.todo
    var flowFrom = points[1]
    var flowTo = points[2]
    this.drawTxt(
      flowFrom.x - xoffset,
      flowFrom.y - yoffset,
      flowTo.x - xoffset,
      flowTo.y - yoffset,
      count,
      color
    )
  },
  // 绘制多实例的效果 -- 两个点的方式
  drawDuoshili_back: function (startNode, endNode, count) {
    const nodeMap = this.imageInfo.nodeMap
    const nodeTypeJson = this.nodeTypeJson
    const flowElementJson = this.imageInfo.flowElementJson
    const opinionMap = this.imageInfo.opinionMap || {}
    const nodeNameJson = this.nodeNameJson
    const stackJson = this.stackJson
    const flowColorJson = this.flowColorJson
    const flowLocation = this.flowLocation
    const xoffset = this.xoffset
    const yoffset = this.yoffset

    const startPoint = {
      x: startNode.x,
      y: startNode.y,
      w: startNode.width,
      h: startNode.height,
    }
    const endPoint = {
      x: endNode.x,
      y: endNode.y,
      w: endNode.width,
      h: endNode.height,
    }

    const minDist = this.getMinDistancePoint(
      [
        { x: startPoint.x, y: startPoint.y },
        { x: startPoint.x + startPoint.w, y: startPoint.y },
        { x: startPoint.x, y: startPoint.y + startPoint.h },
        { x: startPoint.x + startPoint.w, y: startPoint.y + startPoint.h },
      ],
      [
        { x: endPoint.x, y: endPoint.y },
        { x: endPoint.x + endPoint.w, y: endPoint.y },
        { x: endPoint.x, y: endPoint.y + endPoint.h },
        { x: endPoint.x + endPoint.w, y: endPoint.y + endPoint.h },
      ]
    )
    const flowFrom = minDist.s
    const flowTo = minDist.e
    const deg = this.getAngle(flowFrom.x, flowFrom.y, flowTo.x, flowTo.y)

    const color = Color.todo
    const arrow = new Arrow(
      flowFrom.x - xoffset,
      flowFrom.y - yoffset,
      flowTo.x - xoffset,
      flowTo.y - yoffset
    )
    arrow.setColor(color)
    arrow.setHead(true)
    arrow.setDash(true) // 虚线
    arrow.draw(this.cxt)

    this.drawTxt(
      flowFrom.x - xoffset,
      flowFrom.y - yoffset,
      flowTo.x - xoffset,
      flowTo.y - yoffset,
      count,
      color
    )
  },
  // 绘制线条
  drawLine: function () {
    //debugger
    const flowLocation = this.flowLocation
    const xoffset = this.xoffset
    const yoffset = this.yoffset
    // 绘制线条
    for (const i in flowLocation) {
      const stack = this.stackJson[i]
      const flows = flowLocation[i]
      const color = this.flowColorJson[i] || Color.LINE
      for (let j = 0; j < flows.length - 1; j++) {
        const flowFrom = flows[j]
        const flowTo = flows[j + 1]

        const arrow = new Arrow(
          flowFrom.x - xoffset,
          flowFrom.y - yoffset,
          flowTo.x - xoffset,
          flowTo.y - yoffset
        )
        arrow.setColor(color)
        // 线段的最后一条折线才需要箭头
        if (j == flows.length - 2) {
          arrow.setHead(true)
        }
        //			    arrow.setDash ( true );
        arrow.draw(this.cxt)
      }
    }
  },
  // 绘制圆形
  drawCircle: function (x, y, w, h, color, lineWidth, icon, revertIconReg) {
    var r = h / 2

    const cxt = this.cxt
    var r = h / 2
    cxt.beginPath()
    cxt.moveTo(x + r, y)
    cxt.arcTo(x + w, y, x + w, y + h, r)
    cxt.arcTo(x + w, y + h, x, y + h, r)
    cxt.arcTo(x, y + h, x, y, r)
    cxt.arcTo(x, y, x + w, y, r)
    cxt.closePath()
    cxt.strokeStyle = color || 'black'
    cxt.lineWidth = lineWidth || 2
    cxt.stroke()

    if (icon) {
      // cxt.font = "normal 14px 微软雅黑";
      cxt.fillStyle = color
      const iconEl = document.getElementById(icon)
      if (iconEl) {
        icon = document.getElementById(icon).textContent
        cxt.font = 'bold 18px FontAwesome'
      } else {
        cxt.font = 'bold 12px FontAwesome'
      }

      // 设置图标旋转角度
      if (revertIconReg) {
        let centerX = x + 25
        let centerY = y + 10
        if (revertIconReg == -90) {
          centerX = x + 20
          centerY = y + 25
        } else if (revertIconReg == 90) {
          centerX = x + 10
          centerY = y + 10
        }
        const ang = (revertIconReg * Math.PI) / 180
        cxt.translate(centerX, centerY)
        cxt.rotate(ang)
        cxt.fillText(icon, 0, 0) // 绘制文字 这里的0和0 搞了我好久

        cxt.rotate(-ang)
        cxt.translate(-centerX, -centerY)
      } else {
        cxt.fillText(icon, x + 5, y + 19, 100) // 绘制文字
      }
    }
  },
  // 绘制圆形的文字
  drawCircleTxt: function (x, y, w, h, color, txt, icon) {
    color = Color.TXT
    if (txt) {
      const cxt = this.cxt
      cxt.font = 'bold 12px 微软雅黑'
      // 测量宽度
      let txtWidth = cxt.measureText(txt).width
      txtWidth = txtWidth / 2 - 18
      cxt.fillStyle = color
      cxt.fillText(txt, x - txtWidth, y - 4, 100)
    }
  },
  // 绘制带有图标的圆形
  drawIconCircle: function (x, y, w, h, color, txt, icon) {
    const cxt = this.cxt
    this.drawCircle(x, y, w, h, color, 4)
    cxt.fillStyle = '#fff'
    cxt.fill()
    cxt.font = 'normal 26px FontAwesome'
    cxt.fillStyle = color
    //  var icon = document.getElementById ( icon ).textContent
    //   cxt.fillText ( icon , x + 4 , y + 24 , 100 ); // 绘制图标

    //   this.drawCircleTxt ( x , y , w , h , color , txt , icon );
  },
  // 绘制定时边界事件
  drawBoundaryTimer: function (x, y, w, h, color, txt) {
    const cxt = this.cxt
    this.drawCircle(x, y, w, h, color, 2)
    cxt.fillStyle = '#fff'
    cxt.fill()
    cxt.font = 'normal 26px FontAwesome'
    cxt.fillStyle = color
    //   var icon = document.getElementById ( "timerIcon" ).textContent
    //   cxt.fillText ( icon , x + 4 , y + 25 , 100 ); // 绘制图标
    //   this.drawCircleTxt ( x , y , w , h , color , txt , icon );
  },
  // 绘制 定时开始节点
  drawStartSignalEvent: function (x, y, w, h, color, txt) {
    const cxt = this.cxt
    this.drawCircle(x, y, w, h, color, 4)
    cxt.fillStyle = '#fff'
    cxt.fill()
    cxt.font = 'normal 40px FontAwesome'
    cxt.fillStyle = color
    //   var icon = document.getElementById ( "upIcon" ).textContent
    //  cxt.fillText ( icon , x + 4 , y + 25 , 100 ); // 绘制图标
    //   this.drawCircleTxt ( x , y , w , h , color , txt , icon );
  },

  // 绘制 结束错误事件
  drawEndErrorEvent: function (x, y, w, h, color, txt) {
    const cxt = this.cxt
    this.drawCircle(x, y, w, h, color, 4)
    cxt.fillStyle = '#fff'
    cxt.fill()
    cxt.font = 'normal 23px FontAwesome'
    cxt.fillStyle = color
    //  var icon = document.getElementById ( "endErrorIcon" ).textContent
    //  cxt.fillText ( icon , x + 6 , y + 23 , 100 ); // 绘制图标
    //  this.drawCircleTxt ( x , y , w , h , color , txt , icon );
  },
  // 绘制 错误边界事件
  drawBoundaryErrorEvent: function (x, y, w, h, color, txt) {
    const cxt = this.cxt
    this.drawCircle(x, y, w, h, color, 4)
    cxt.fillStyle = '#fff'
    cxt.fill()
    cxt.font = 'normal 23px FontAwesome'
    cxt.fillStyle = color
    //    var icon = document.getElementById ( "boundaryErrorIcon" ).textContent
    //   cxt.fillText ( icon , x + 9 , y + 24 , 100 ); // 绘制图标
    //   this.drawCircleTxt ( x , y , w , h , color , txt , icon );
  },
  // 绘制 错误边界事件
  drawEndTerminateEvent: function (x, y, w, h, color, txt) {
    const cxt = this.cxt
    this.drawCircle(x, y, w, h, color, 6)
    cxt.fillStyle = '#fff'
    cxt.fill()
    cxt.font = 'normal 26px FontAwesome'
    cxt.fillStyle = color
    //   var icon = document.getElementById ( "endIcon" ).textContent
    //   cxt.fillText ( icon , x + 4 , y + 24 , 100 ); // 绘制图标
    //   this.drawCircleTxt ( x , y , w , h , color , txt , icon );
  },
  // 绘制 信号边界事件
  drawBoundarySignalEvent: function (x, y, w, h, color, txt) {
    const cxt = this.cxt
    this.drawCircle(x, y, w, h, color, 1)
    const sub = 8
    const subHalf = sub / 2
    this.drawCircle(x + subHalf, y + subHalf, w - sub, h - sub, color, 1)
    cxt.fillStyle = '#fff'
    cxt.fill()
    cxt.font = 'normal 32px FontAwesome'
    cxt.fillStyle = color
    //   var icon = document.getElementById ( "upIcon" ).textContent
    //  cxt.fillText ( icon , x + 6 , y + 23 , 100 ); // 绘制图标
    //  this.drawCircleTxt ( x , y , w , h , color , txt , icon );
  },
  // 绘制 圆角矩形
  drawRoundedRect: function (rect, color, r, isDash) {
    const cxt = this.cxt
    cxt.lineWidth = 1
    const ptA = this.Point(rect.x + r, rect.y)
    const ptB = this.Point(rect.x + rect.width, rect.y)
    const ptC = this.Point(rect.x + rect.width, rect.y + rect.height)
    const ptD = this.Point(rect.x, rect.y + rect.height)
    const ptE = this.Point(rect.x, rect.y)

    cxt.beginPath()

    cxt.moveTo(ptA.x, ptA.y)
    if (isDash && cxt.setLineDash) {
      cxt.setLineDash([3, 5])
    }
    cxt.arcTo(ptB.x, ptB.y, ptC.x, ptC.y, r)
    cxt.arcTo(ptC.x, ptC.y, ptD.x, ptD.y, r)
    cxt.arcTo(ptD.x, ptD.y, ptE.x, ptE.y, r)
    cxt.arcTo(ptE.x, ptE.y, ptA.x, ptA.y, r)
    cxt.stroke()
    if (isDash && cxt.setLineDash) {
      cxt.setLineDash([])
    }
  },

  // 绘制泳道池
  drawPool: function (x, y, w, h, txt, icon, color) {
    const cxt = this.cxt
    this.h = h
    this.w = w
    this.x = x
    this.y = y
    cxt.strokeStyle = color || 'black'

    this.rect(x, y, w, h, color)

    if (txt) {
      cxt.font = 'bold 12px 微软雅黑'
      const ang = (-90 * Math.PI) / 180
      const centerX = x + 15
      const centerY = y + h / 2
      cxt.beginPath()

      cxt.translate(centerX, centerY)
      cxt.rotate(ang)

      cxt.fillStyle = color
      cxt.strokeStyle = color
      cxt.fillText(txt, 0, 0) // 绘制文字 这里的0和0 搞了我好久

      cxt.rotate(-ang)
      cxt.translate(-centerX, -centerY)

      cxt.closePath()
      cxt.stroke()
    }
  },
  // 绘制矩形
  rect: function (x, y, w, h, color) {
    const cxt = this.cxt
    cxt.lineWidth = 1
    cxt.strokeStyle = color || 'black'
    // 描边矩形
    cxt.strokeRect(x, y, w, h)

    // $ ( this.canvas ).drawRect ( {
    // // layer: true,
    // strokeStyle : color ,
    // strokeWidth : 1 ,
    // cornerRadius : 0 ,
    // x : x + w / 2 ,
    // y : y + h / 2 ,
    // width : w ,
    // height : h ,
    // } );
  },
  // 并行网关
  drawParallelGateway: function (x, y, txt, color) {
    const cxt = this.cxt
    const l = 20
    x = x + l
    y = y + l
    this.drawGateWay(x, y, l, txt, color)
    this.drawJia(x, y, l / 2, color)
  },
  // 并行条件网关
  drawInclusiveGateway: function (x, y, txt, color) {
    const cxt = this.cxt
    const l = 20
    x = x + l
    y = y + l
    this.drawGateWay(x, y, l, txt, color)
    x = x - l / 2
    y = y - l / 2
    this.drawCircle(x, y, l, l, color, 2)
  },
  // 分支网关
  drawExclusiveGateway: function (x, y, txt, color) {
    const cxt = this.cxt
    const l = 20
    x = x + l
    y = y + l
    this.drawGateWay(x, y, l, txt, color)
    this.drawXX(x, y, l / 2 - 2, color)
  },
  // 绘制正菱形(也就是网关的外框)
  drawGateWay: function (x, y, l, txt, color) {
    const cxt = this.cxt
    cxt.beginPath()
    cxt.moveTo(x, y + l)
    cxt.lineTo(x - l, y)
    cxt.lineTo(x, y - l)
    cxt.lineTo(x + l, y)
    cxt.closePath()
    cxt.fillStyle = color
    cxt.strokeStyle = color
    if (txt) {
      cxt.font = 'bold 12px 微软雅黑'
      // 绘制文字
      cxt.fillText(txt, x + l / 2, y + l, 100)
    }
    cxt.stroke()
    x = x
    y = y
  },

  /**
   * 绘制子流程
   */
  drawSubProcess: function (x, y, w, h, txt, color) {
    const cxt = this.cxt
    this.h = h
    this.w = w
    this.x = x
    this.y = y
    cxt.strokeStyle = color || Color.LINE
    cxt.fillStyle = color
    if (txt) {
      // cxt.font = "normal 14px 微软雅黑";
      cxt.font = 'bold 12px 微软雅黑'
      cxt.fillText(txt, x + 10, y + 20, 100)
    }
    const rect = new this.Rect(x, y, this.w, this.h)
    this.drawRoundedRect(rect, color, 5)
  },
  /**
   * 绘制外部子流程
   */
  drawCallActivity: function (x, y, w, h, txt, icon, color) {
    const cxt = this.cxt
    cxt.fillStyle = color
    this.drawSubProcess(x, y, w, h, txt, color)
    // 画一个加号
    cxt.font = 'bold 18px FontAwesome'
    //var icon = document.getElementById('plusIcon').textContent
    //cxt.fillText(icon, x + w / 2 - 8, y + h - 5, 100)
  },
  // 绘制注释节点
  drawTextAnnotation: function (x, y, w, h, txt, color) {
    const cxt = this.cxt
    let arrow = new Arrow(x, y, x, y + h)
    arrow.setColor(color)
    arrow.draw(cxt)

    arrow = new Arrow(x, y, x + 20, y)
    arrow.setColor(color)
    arrow.draw(cxt)

    arrow = new Arrow(x, y + h, x + 20, y + h)
    arrow.setColor(color)
    arrow.draw(cxt)

    if (txt) {
      cxt.font = 'bold 12px 微软雅黑'
      cxt.fillText(txt, x + 10, y + h / 2, 100)
    }
  },
  // 绘制动态任务节点
  drawDynamicNode: function (x, y, w, h, txt, icon, color, dynamicTaskCount) {
    const xyz = { actionName: 'dynamic' }
    this.drawTaskNode(x, y, w, h, '', '', color, '', xyz) //
    const offset = 3
    this.drawTaskNode(x + offset, y + offset, w, h, '', '', color, '', xyz) //
    this.drawTaskNode(
      x + 2 * offset,
      y + 2 * offset,
      w,
      h,
      txt,
      dynamicTaskCount || 'dynamicTaskIcon',
      color,
      '',
      xyz
    ) //
  },
  // 画X (分支网关中间的叉叉)
  drawXX: function (x, y, w, color) {
    const cxt = this.cxt
    const startX = x - w
    const startY = y - w
    const endX = x + w
    const endY = y + w

    var arrow = new Arrow(startX, startY, endX, endY)
    arrow.setColor(color)
    arrow.draw(cxt)

    var arrow = new Arrow(startX, endY, endX, startY)
    arrow.setColor(color)
    arrow.draw(cxt)
  },
  // 画+ (同步网关中间的加号)
  drawJia: function (x, y, w, color) {
    const cxt = this.cxt

    var arrow = new Arrow(x - w, y, x + w, y)
    arrow.setColor(color)
    arrow.draw(cxt)

    var arrow = new Arrow(x, y - w, x, y + w)
    arrow.setColor(color)
    arrow.draw(cxt)
  },
  hasDrawedLineId: {
    // 记录已经画过的线,避免重复
  },
  // 绘制线条上面的文字
  drawLineTxt: function (xoffset, yoffset, flowElement) {
    const cxt = this.cxt
    if (!flowElement) {
      return
    }
    const outgoingFlows = flowElement.outgoingFlows || []
    const incomingFlows = flowElement.incomingFlows || []
    outgoingFlows.push.apply(outgoingFlows, incomingFlows)
    for (let k = 0; k < outgoingFlows.length; k++) {
      const outgoingFlow = outgoingFlows[k]
      const name = outgoingFlow.name
      const id = outgoingFlow.id
      if (!id || this.hasDrawedLineId[id]) {
        continue
      }
      this.hasDrawedLineId[id] = true
      const flows = this.flowLocation[id]
      if (!flows) continue

      const flowFrom = flows[0]
      const flowTo = flows[1]
      if (name) {
        // 处理文字换行
        const chr = name.split(' ')
        const row = []
        for (let a = 0; a < chr.length; a++) {
          if (chr[a]) row.push(chr[a])
        }
        if (row.length >= 2) {
          let yoff = 10
          if (row.length == 2) {
            yoff = 3
          }
          if (row.length >= 3) {
            yoff = 0
          }
          for (let b = 0; b < row.length; b++) {
            if (row[row.length - b - 1]) {
              if (flows[0].y == flows[1].y) {
                var color = Color.TXT
                this.drawTxt(
                  flowFrom.x - xoffset,
                  flowFrom.y - yoffset - b * 16,
                  flowTo.x - xoffset,
                  flowTo.y - yoffset - b * 16,
                  row[row.length - b - 1],
                  color
                )
                //		this.drawTxt ( flowFrom.x - xoffset -(b)*16, flowFrom.y - yoffset  , flowTo.x - xoffset -(b)*16, flowTo.y - yoffset , row[row.length-b-1] , color
              } else {
                var color = Color.TXT
                //this.drawTxt ( flowFrom.x - xoffset, flowFrom.y - yoffset -(b)*16 , flowTo.x - xoffset , flowTo.y - yoffset -(b)*16 , row[row.length-b-1] , color );
                this.drawTxt(
                  flowFrom.x - xoffset - b * 16,
                  flowFrom.y - yoffset,
                  flowTo.x - xoffset - b * 16,
                  flowTo.y - yoffset,
                  row[row.length - b - 1],
                  color
                )
              }
            }
          }
        } else {
          // 获取颜色
          //			  		var color = this.flowColorJson[id] || Color.TXT;
          var color = Color.TXT
          this.drawTxt(
            flowFrom.x - xoffset,
            flowFrom.y - yoffset,
            flowTo.x - xoffset,
            flowTo.y - yoffset,
            name,
            color
          )
        }
      }
    }
  },
  // 沿着线画文字
  drawTxt: function (x1, y1, x2, y2, txt, color) {
    // eslint-disable-next-line no-empty
    if (txt == '连线1') {
    }

    const cxt = this.cxt
    let deg = this.getAngle(x1, y1, x2, y2)
    // 测量宽度
    const txtWidth = cxt.measureText(txt).width / 2

    const ofy = Math.abs(y2 - y1) / 2
    const ofx = Math.abs(x2 - x1) / 2

    let startX = x1
    let startY = y1
    if (deg == 0) {
      startX = x1 + ofx - txtWidth / 2 - 5
      startY = y1 - 5
    } else if (deg > 0 && deg < 90) {
      deg = -deg
      startX = x1 + ofx - txtWidth / 2 - 10
      startY = y1 - ofy - 5
    } else if (deg == 90) {
      deg = -deg
      startX = x1 - 10
      startY = y1 - ofy + txtWidth / 2
    } else if (deg > 90 && deg <= 180) {
      deg = 180 - deg
      startX = x2 + ofx - txtWidth / 2 - 5
      startY = y2 + ofy - 10
    } else if (deg > 180 && deg < 270) {
      deg = -(180 + deg)
      startX = x1 - ofx - txtWidth / 2
      startY = y1 + ofy + txtWidth / 2 - 10
    } else if (deg == 270) {
      deg = -(360 - deg)
      startX = x2 - 5
      startY = y2 - ofy + txtWidth / 2 + 5
    } else {
      deg = 360 - deg
      startX = x1 + ofx - txtWidth / 2 + 15
      startY = y1 + ofy - 5
    }
    const ang = (deg * Math.PI) / 180
    const centerX = startX
    const centerY = startY
    // var ang = 90 * Math.PI/180;
    cxt.beginPath()

    cxt.translate(centerX, centerY)
    cxt.rotate(ang)

    cxt.fillStyle = color
    cxt.strokeStyle = color
    cxt.font = 'normal 12px FontAwesome'
    cxt.fillText(txt, 0, 0) // 绘制文字 这里的0和0 搞了我好久

    cxt.rotate(-ang)
    cxt.translate(-centerX, -centerY)

    cxt.closePath()
    cxt.stroke()
  },
  drawTaskBackgroudImg(nodeInfo, x, y, w, h) {
    if (!nodeInfo.imagType) {
      //	    	return 有一些后端是没有返回imagType的
    }
    let imagType =
      nodeInfo.imagType || nodeInfo.type || nodeInfo.nodeType.tuoFengCap()
    if (nodeInfo.signTask == 1) {
      imagType = 'SignTask'
    }
    if (nodeInfo.nodeType == 'mutiInstTaskStart') {
      imagType = 'MutiInstTaskStart'
    }
    if (nodeInfo.id == 'StartNoneEvent_muti') {
      imagType = 'StartNoneEvent_muti'
    }
    if (nodeInfo.nodeType == 'mutiInstTaskEnd') {
      imagType = 'MutiInstTaskEnd'
    }
    if (nodeInfo.nodeType == 'dynamicTask') {
      imagType = 'DynamicTask'
    }
    if (nodeInfo.nodeType == 'boundarySignal') {
      imagType = 'BoundarySignalEvent'
    }

    const converMap = {
      BoundaryEvent: 'BoundaryTimerEvent',
      StartEvent: 'StartNoneEvent',
      EndEvent: 'EndNoneEvent',
      ThrowEvent: 'ThrowSignalEvent',
    }
    imagType = converMap[imagType] || imagType
    //debugger
    if (!flowImages[imagType]) {
      return
    }

    const cxt = this.cxt
    if (nodeInfo.imagId) {
      var img = new Image()
      img.src = `${Setting.apiBaseURL}sys/sysFile/download?fileId=${nodeInfo.imagId}`
      // 图片加载完后，将其显示在canvas中
      img.onload = function () {
        // cxt.globalAlpha = 0.1;
        //	    		cxt.drawImage(this, x+1, y+1, w-2, h-2)
        cxt.drawImage(this, x, y, w, h)
      }
    } else {
      var img = new Image()
      // 流程图是否高亮
      const isTodo =
        !nodeInfo.actionName &&
        (!nodeInfo.opinions || nodeInfo.opinions.length == 0)

      if (isTodo) {
        imagType = `${imagType}_gray`
      }
      //miao
      img.src = flowImages[imagType]
      // 图片加载完后，将其显示在canvas中
      img.onload = function () {
        //	    		 cxt.globalAlpha = 0.5;
        const padding = 0
        cxt.drawImage(this, x + padding, y + padding, w - padding, h - padding)
      }
    }
  },
  // 绘制任务节点(比如用户节点,服务节点)
  drawTaskNode: function (
    x,
    y,
    w,
    h,
    txt,
    icon,
    color,
    revertIconReg,
    nodeInfo
  ) {
    const cxt = this.cxt
    this.flag = 'step'
    this.h = h
    this.w = w
    this.x = x
    this.y = y
    cxt.strokeStyle = color || 'black'
    if (txt) {
      // cxt.font = "normal 14px 微软雅黑";
      cxt.font = 'bold 12px 微软雅黑'

      //		    txt = "我是测试的很长的内容, 记住了哈.凉风有性秋叶无边归我";

      // 处理文字换行
      const chr = txt.split('')
      let temp = ''
      const row = []
      for (let a = 0; a < chr.length; a++) {
        // eslint-disable-next-line no-empty
        if (cxt.measureText(temp).width < w - 20) {
        } else {
          row.push(temp)
          temp = ''
        }
        temp += chr[a]
      }

      row.push(temp)

      if (row.length >= 2) {
        let yoff = 10
        if (row.length == 2) {
          yoff = 3
        }
        if (row.length >= 3) {
          yoff = 0
        }
        for (let b = 0; b < row.length; b++) {
          var txtWidth = (w - cxt.measureText(row[b]).width) / 2
          cxt.fillText(row[b], x + txtWidth, y + h / 2 + yoff + b * 16, 100)
        }
      } else {
        cxt.font = 'bold 12px 微软雅黑'
        var txtWidth = (w - cxt.measureText(txt).width) / 2
        cxt.fillText(txt, x + txtWidth, y + h / 2 + 10, 100)
      }
    }
    cxt.strokeStyle = color || 'black'
    const rect = new this.Rect(x, y, this.w, this.h)
    let isDash = !nodeInfo.actionName
    isDash = false
    //	    this.drawRoundedRect ( rect , color , 5 , isDash );
  },
  // 获取两个点与平行线的角度 0~360
  getAngle: function (x1, y1, x2, y2) {
    const cxt = this.cxt
    const x = x1 - x2,
      y = y1 - y2
    if (!x && !y) {
      return 0
    }
    // var angle = (180+Math.abs(Math.atan2(y, x)) / Math.PI ) % 360
    let angle = Math.atan2(y2 - y1, x2 - x1)
    angle = (-angle * 180) / Math.PI
    if (angle < 0) {
      angle = angle + 360
    }
    return angle
  },
  // 获取两个矩形之间的连线
  getPointFromTwoBox: function (startNode, endNode) {
    const startPointCenter = {
      x: startNode.x + startNode.width / 2,
      y: startNode.y + startNode.height / 2,
    }

    const endPointCenter = {
      x: endNode.x + endNode.width / 2,
      y: endNode.y + endNode.height / 2,
    }

    let len = 20
    // 求这两个点之间的角度
    const ang = this.getAngle(
      startPointCenter.x,
      startPointCenter.y,
      endPointCenter.x,
      endPointCenter.y
    )
    if (ang >= 0 && ang < 90) {
      var xof = Math.abs(startNode.x - endNode.x)
      var yof = Math.abs(startNode.y - endNode.y)
      // 判断两个矩形的y坐标的距离是否超过了60
      if (yof > endNode.height + 30) {
        len = (yof - endNode.height) / 2
        var p1 = { x: startNode.x + startNode.width / 2, y: startNode.y }
        var p2 = { x: startNode.x + startNode.width / 2, y: startNode.y - len }
        var p3 = { x: endNode.x + endNode.width / 2, y: startNode.y - len }
        var p4 = {
          x: endNode.x + endNode.width / 2,
          y: endNode.y + endNode.height,
        }
        return [p1, p2, p3, p4]
      }
      var p1 = { x: startNode.x + startNode.width / 2, y: startNode.y }
      var p2 = { x: startNode.x + startNode.width / 2, y: endNode.y - len }
      var p3 = { x: endNode.x + endNode.width / 2, y: endNode.y - len }
      var p4 = { x: endNode.x + endNode.width / 2, y: endNode.y }
      return [p1, p2, p3, p4]
    }
    if (ang == 90 || ang == 270) {
      var p1 = {
        x: startNode.x + startNode.width,
        y: startNode.y + startNode.height / 2,
      }
      var p2 = {
        x: startNode.x + startNode.width + len,
        y: startNode.y + startNode.height / 2,
      }
      var p3 = {
        x: endNode.x + endNode.width + len,
        y: endNode.y + endNode.height / 2,
      }
      var p4 = {
        x: endNode.x + endNode.width,
        y: endNode.y + endNode.height / 2,
      }
      return [p1, p2, p3, p4]
    }

    if (ang > 90 && ang <= 180) {
      var xof = Math.abs(startNode.x - endNode.x)
      var yof = Math.abs(startNode.y - endNode.y)
      // 判断两个矩形的y坐标的距离是否超过了60
      if (yof > endNode.height) {
        len = yof / 2
        var p1 = { x: startNode.x + startNode.width / 2, y: startNode.y }
        var p2 = {
          x: startNode.x + startNode.width / 2,
          y: endNode.y + endNode.height / 2,
        }
        var p3 = {
          x: endNode.x + endNode.width,
          y: endNode.y + endNode.height / 2,
        }
        var p4 = null
        return [p1, p2, p3]
      }

      var p1 = { x: startNode.x + startNode.width / 2, y: startNode.y }
      var p2 = { x: startNode.x + startNode.width / 2, y: endNode.y - len }
      var p3 = { x: endNode.x + endNode.width / 2, y: endNode.y - len }
      var p4 = { x: endNode.x + endNode.width / 2, y: endNode.y }
      return [p1, p2, p3, p4]
    }

    if (ang > 180 && ang < 270) {
      var xof = Math.abs(startNode.x - endNode.x)
      var yof = Math.abs(startNode.y - endNode.y)
      // 判断两个矩形的y坐标的距离是否超过了60
      if (yof > startNode.height) {
        len = (yof - startNode.height) / 2
        var p1 = {
          x: startNode.x + startNode.width / 2,
          y: startNode.y + startNode.height,
        }
        var p2 = {
          x: startNode.x + startNode.width / 2,
          y: startNode.y + startNode.height + len,
        }

        var p3 = {
          x: endNode.x + endNode.width / 2,
          y: startNode.y + startNode.height + len,
        }
        var p4 = { x: endNode.x + endNode.width / 2, y: endNode.y }
        return [p1, p2, p3, p4]
      }

      var p1 = {
        x: startNode.x + startNode.width / 2,
        y: startNode.y + startNode.height,
      }
      var p2 = {
        x: startNode.x + startNode.width / 2,
        y: endNode.y + endNode.height + len,
      }
      var p3 = {
        x: endNode.x + endNode.width / 2,
        y: endNode.y + endNode.height + len,
      }
      var p4 = {
        x: endNode.x + endNode.width / 2,
        y: endNode.y + endNode.height,
      }
      return [p1, p2, p3, p4]
    }

    if (ang > 270 && ang <= 360) {
      var xof = Math.abs(startNode.x - endNode.x)
      var yof = Math.abs(startNode.y + startNode.height - endNode.y)
      // 判断两个矩形的y坐标的距离是否超过了60
      if (yof > 40) {
        len = yof / 2
        var p1 = {
          x: startNode.x + startNode.width / 2,
          y: startNode.y + startNode.height,
        }
        var p2 = { x: startNode.x + startNode.width / 2, y: endNode.y - len }
        var p3 = { x: endNode.x + endNode.width / 2, y: endNode.y - len }
        var p4 = { x: endNode.x + endNode.width / 2, y: endNode.y }
        return [p1, p2, p3, p4]
      }

      var p1 = {
        x: startNode.x + startNode.width / 2,
        y: startNode.y + startNode.height,
      }
      var p2 = {
        x: startNode.x + startNode.width / 2,
        y: endNode.y + endNode.height + len,
      }
      var p3 = {
        x: endNode.x + endNode.width / 2,
        y: endNode.y + endNode.height + len,
      }
      var p4 = {
        x: endNode.x + endNode.width / 2,
        y: endNode.y + endNode.height,
      }
      return [p1, p2, p3, p4]
    }
  },
  // 获取两组坐标之间最近的点.
  getMinDistancePoint: function (startsP, endsP) {
    let minW = 1000000
    let temps = ''
    let tempe = ''

    for (let ii = 0; ii < startsP.length; ii++) {
      const p = startsP[ii]

      for (let i = 0; i < endsP.length; i++) {
        const tp = endsP[i]
        const oldMin = minW
        minW = Math.min(
          minW,
          Math.sqrt(Math.pow(p.x - tp.x, 2) + Math.pow(p.y - tp.y, 2))
        )
        if (minW < oldMin) {
          temps = p
          tempe = tp
        }
      }
    }

    return {
      s: temps,
      e: tempe,
    }
  },
  showNodeTitle: function (nodeType) {
    return (
      [
        'startEvent',
        'endEvent',
        'parallelGateway',
        'exclusiveGateway',
        'throwSignal',
        'inclusiveGateway',
        'catchSignal',
        'boundaryTimer',
        'catchTimer',
        'boundarySignal',
      ].indexOf(nodeType) < 0
    )
  },
}

export default drawFlowImg

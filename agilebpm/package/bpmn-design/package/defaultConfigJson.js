/**
 * 流程全局属性默认配置
 */
const defaultFlow = {
  nodeMap: {}, //节点配置
  plugins: {
    nodeMessage: [
      {
        desc: '任务待办通知',
        event: 'TASK_CREATED',
        condition: '',
        userRules: [],
        msgType: 'email,inner,dingding',
        templateCode: 'node_message_template',
        emailFile: {},
      },
      {
        desc: '流程结束通知发起人',
        event: 'PROCESS_COMPLETED',
        condition: '',
        userRules: [
          {
            type: 'user',
            extractType: 'no',
            logicType: 'or',
            sn: 1,
            condition: null,
            source: 'start',
          },
        ],
        msgType: 'email,inner,dingding',
        templateCode: 'process_completed_template',
        nodeId: 'EndEvent1',
        emailFile: {},
      },
    ],
    nodeSkip: { firstskip: true },
  },
  flowName: '',
  flowDesc: '',
  defaultForm: { type: 'inner' },
  instForm: { type: 'inner' },
  printForm: { type: 'inner' },
  instanceButtonList: [
    { name: '传阅', actionName: 'carbonCopy' },
    { name: '审批历史', actionName: 'taskOpinion' },
    { name: '流程图', actionName: 'flowImage' },
    { name: '打印', actionName: 'printed' },
    { name: '撤回', actionName: 'recall' },
    { name: '催办', actionName: 'reminder' },
    { name: '撤销', actionName: 'revoke' },
  ],
  bpmProperties: {
    allowExecutorEmpty: true,
    requiredOpinion: 'true',
    status: 'draft',
    custTaskTimeLimit: false,
    isUrgencyTask: false,
    taskTimeLimit: 0,
    emptyUserStrategy: 'ignore',
    backModel: 'normal',
    backUserModel: 'history',
    allowRecall: true,
    allowRevoke: true,
  },
  supportMobile: 0,
  subjectRule:
    '{{currentUser.fullName:发起人}}发起的{{bpmDefinition.name:流程名}}',
  dataModelList: [],
  nodeInitList: [],
  variableList: [],
  bizModeList: [],
}
let tempDefaultFlow = null
export const getDefaultFlowJson = () => {
  tempDefaultFlow = abUtil.clone(defaultFlow)
  bpmApi.bpmDefinition.getBpmDefaultButtons('instance_', true).then((res) => {
    tempDefaultFlow.instanceButtonList = res.data
  })
  return tempDefaultFlow
}

export const defaultBpmnXml =
  '<bpmn2:definitions xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:activiti="http://activiti.org/bpmn" id="diagram_testDesign" targetNamespace="http://activiti.org/bpmn"><bpmn2:process id="ces" name="ces" isExecutable="true"><bpmn2:documentation>ce</bpmn2:documentation><bpmn2:startEvent id="StartEvent1" name="开始事件1" /></bpmn2:process><bpmndi:BPMNDiagram id="BPMNDiagram_ces"><bpmndi:BPMNPlane id="BPMNPlane_ces" bpmnElement="ces"><bpmndi:BPMNShape id="BPMNShape_StartEvent1" bpmnElement="StartEvent1"><dc:Bounds x="162" y="162" width="36" height="36" /><bpmndi:BPMNLabel><dc:Bounds x="155" y="198" width="50" height="14" /></bpmndi:BPMNLabel></bpmndi:BPMNShape></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn2:definitions>'

import { bpmApi } from '@agilebpm/api'
import * as abUtil from '~/agilebpm/utils/ab-util'

/** 默认按钮的配置JSON，需要从后台获取 */
const bpmButtonDefaultJson = {}

export const getDefaultNodeJson = (type) => {
  if (!defaultNodeMap[type]) {
    const nodeJson = JSON.parse(JSON.stringify(defaultNodeMap.defaultType))
    nodeJson.nodeType = type
    return nodeJson
  }

  const nodeJson = JSON.parse(JSON.stringify(defaultNodeMap[type]))

  // 异步从后台取默认按钮赋值
  if (!bpmButtonDefaultJson[type]) {
    bpmApi.bpmDefinition.getBpmDefaultButtons(type, true).then((res) => {
      bpmButtonDefaultJson[type] = res.data
      nodeJson.buttonList = JSON.parse(
        JSON.stringify(bpmButtonDefaultJson[type])
      )
    })
  } else {
    nodeJson.buttonList = JSON.parse(JSON.stringify(bpmButtonDefaultJson[type]))
  }

  return nodeJson
}

export const defaultNodeMap = {
  UserTask: {
    nodeName: '',
    nodeType: 'UserTask', // 节点类型，使用原生的
    nodeKey: '', // 节点KEY，自动计算
    nodeForm: { type: 'inner' }, // 节点表单,空着
    printForm: { type: 'inner' }, // 节点表单,空着
    bpmProperties: {
      // 节点属性配置，默认取全局配置
      backUserMode: 'history',
      backMode: 'normal',
      custNodeUser: 'no',
    },
    plugins: {},
    buttonList: [], // 节点按钮，暂时空着
  },
  StartEvent: {
    nodeName: '',
    nodeType: 'StartEvent', // 节点类型，使用原生的
    nodeForm: { type: 'inner' }, // 节点表单,空着
    printForm: { type: 'inner' }, // 节点表单,空着
    nodeKey: '', // 节点KEY，自动计算
    bpmProperties: {
      // 节点属性配置
      backUserModel: 'history',
      backMode: 'normal',
      custNodeUser: 'no',
    },
    plugins: {
      // 节点插件
      userAssign: {},
    },
    btnList: [], // 节点按钮，暂时空着
  },
  EndEvent: {
    nodeName: '',
    nodeType: 'EndEvent', // 节点类型，使用原生的
    nodeKey: '', // 节点KEY，自动计算
  },
  defaultType: {
    nodeName: '',
    nodeType: '', // 节点类型，使用原生的
    nodeKey: '', // 节点KEY，自动计算
  },
}

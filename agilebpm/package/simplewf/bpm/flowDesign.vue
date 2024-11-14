<template>
  <div>
    <div id="flowSetting" class="dingflow-design">
      <div class="zoom">
        <div
          :class="'zoom-out' + (data.nowVal == 50 ? ' disabled' : '')"
          @click="zoomSize(1)"
        ></div>
        <span>{{ data.nowVal }}%</span>
        <div
          :class="'zoom-in' + (data.nowVal == 300 ? ' disabled' : '')"
          @click="zoomSize(2)"
        ></div>
      </div>
      <div
        id="box-scale"
        class="box-scale"
        :style="
          'transform: scale(' +
          data.nowVal / 100 +
          '); transform-origin: 50% 0px 0px;'
        "
      >
        <nodeDef
          ref="nodeDefRef"
          v-model="setting.steps"
          :common-util="data.commonUtil"
          :director-max-level="data.directorMaxLevel"
        />
        <!-- 结束节点 -->
        <div class="end-node pointer">
          <div class="end-node-circle"></div>
          <div class="end-node-text">流程结束</div>
        </div>
      </div>
    </div>
  </div>
  <scriptVariableInit
    :bpm-setting="data.setting"
    :script-variables="data.scriptVariables"
    :wf-bo-list="data.boList"
  />
</template>

<script lang="ts" setup>
import nodeDef from './nodeDef.vue'
import { sysApi } from '@agilebpm/api'
import nodeConfigSetting from './nodeSetting/nodeConfigSetting.vue'
import scriptVariableInit from '~/agilebpm/package/ab-common-resource/bpmDesign/conditionScript/scriptVariableInit.vue'

const props = defineProps({
  setting: { required: true, type: Object },
  simpleFlow: { required: true, type: Object },
  orderNum: { required: true, type: Number },
  boList: { required: true, type: Array },
})
const { setting, simpleFlow, orderNum } = toRefs(props)
const data: any = reactive({
  boList: props.boList,
  setting: {
    nodeInitList: [],
    variableList: [],
    bizModeList: [],
    flowStatus: 'draft',
  },
  scriptVariables: [],
  nowVal: 100,
  splitStr: '_____',
  commonUtil: {
    OpinionStatus: [],
    ColumnType: {},
    maxNodeNo: 0,
    UserTaskDefaultConf: {}, //用户任务默认配置{ code: 'A1zzb', name: 'A1主子表' }
    ServiceTaskDefaultConf: {}, //服务任务默认配置
    InclusiveGatewayDefaultConf: {}, //路由默认配置
    defaultMsgType: '', // 默认的消息类型
    msgList: [], // 消息通知类型
  },
  currentNode: {},
  endNode: {},
  directorMaxLevel: 0,
})
provide('scriptVariables', data.scriptVariables)

const loadEnmuDatas = () => {
  /* com.dstz.bpm.api.enums.OpinionStatus */
  //初始化节点按钮配置
  /*   sysApi.tools
    .getEnum('com.dstz.bpm.api.enums.ActionType', true)
    .then((resData: any) => {
      if (!data.commonUtil) {
        data.commonUtil = {}
      }
      data.commonUtil.OpinionStatus = resData.data
    }) */

  sysApi.tools
    .getEnum('com.dstz.jdbc.api.enums.ColumnType', true)
    .then((resData: any) => {
      data.commonUtil.ColumnType = resData.data
    })

  //获取消息类型，以及默认消息类型
  sysApi.tools
    .InterFaceImpls(
      'com.dstz.component.msg.handler.AbsNotifyMessageHandler'
    )
    .then((res: any) => {
      data.commonUtil.msgList = res.data
      if (res.data && res.data.length) {
        const msgType = []
        for (let i = 0, msg; (msg = data[i++]); ) {
          if (msg.isDefault) {
            msgType.push(msg.type)
          }
        }
        data.commonUtil.defaultMsgType = msgType.join(',')

        // 对消息配置默认设置消息通知方式
        if (setting.value.plugins.nodeMessage)
          for (
            let i = 0, item;
            (item = setting.value.plugins.nodeMessage[i++]);

          ) {
            if (!item.msgType) {
              item.msgType = data.commonUtil.defaultMsgType
            }
          }
      }
    })
}
const nodeDefRef = ref<any>(null)
const validate = () => {
  setting.value.maxNodeNo = data.commonUtil.maxNodeNo

  if (!setting.value.steps || !setting.value.steps.next) {
    return [{ msgType: '流程设计', msg: '请至少设计一个流程审批环节！' }]
  }
  const arrayMsgs: never[] = []
  nodeDefRef?.value?.validateNode(setting.value.steps, arrayMsgs, false)
  return arrayMsgs
}
const zoomSize = (type: any) => {
  if (type == 1) {
    if (data.nowVal == 50) {
      return
    }
    data.nowVal -= 10
  } else {
    if (data.nowVal == 300) {
      return
    }
    data.nowVal += 10
  }
}
//添加节点时默认配置
const initDefaultNodeSetting = () => {
  // 用户任务默认的配置
  data.commonUtil.UserTaskDefaultConf = JSON.stringify({
    nodeKey: 'UserTask', //+ maxNodeNo
    nodeName: '用户任务', //+ maxNodeNo
    error: false,
    nodeType: 'UserTask',
    bpmProperties: {},
    plugins: {
      sign: {
        // 会签默认不开启
        open: false,
        approvalType: 'vote',
        countType: 'number',
        number: 1,
        percent: 50,
        endType: 'all',
        followUp: 'next',
        opposeAction: 'oppose',
      },

      // 候选人插件 默认不开启
      nodeUser: [
        {
          rule: '',
          description: '  [用户]发起人;\n',
          type: 'user',
          extractType: 'no',
          logicType: 'or',
          sn: 1,
          condition: null,
          source: 'start',
        },
      ],
    },
    buttonList: [
      {
        groovyScript: '',
        name: '同意',
        actionName: 'agree',
        javaScript: '',
      },
      {
        groovyScript: '',
        name: '保存',
        actionName: 'save',
        javaScript: '',
      },
      {
        groovyScript: '',
        name: '发起会签',
        actionName: 'signStart',
        javaScript: '',
      },
      {
        groovyScript: '',
        name: '传阅',
        actionName: 'carbonCopy',
        javaScript: '',
      },
      {
        groovyScript: '',
        name: '驳回',
        actionName: 'reject',
        javaScript: '',
      },
      /* {
            name: '撤回',
            actionName: 'recall',
            javaScript: '',
            groovyScript: '',
        },
        {
            name: '撤销',
            actionName: 'revoke',
            javaScript: '',
            groovyScript: '',
        },*/
      {
        groovyScript: '',
        name: '审批历史',
        actionName: 'taskOpinion',
        javaScript: '',
      },
      {
        groovyScript: '',
        name: '流程图',
        actionName: 'flowImage',
        javaScript: '',
      },
      {
        groovyScript: '',
        name: '转办',
        actionName: 'turn',
        javaScript: '',
      },
      {
        groovyScript: '',
        name: '打印',
        actionName: 'printed',
        javaScript: '',
      },
      {
        groovyScript: '',
        name: '人工终止',
        actionName: 'manualEnd',
        javaScript: '',
      },
    ],
  })
  data.commonUtil.ServiceTaskDefaultConf = JSON.stringify({
    nodeKey: 'ServiceTask', //  + maxNodeNo
    nodeName: '抄送', //  + maxNodeNo
    nodeType: 'ServiceTask',
    error: false,
    // 抄送配置，到时候 copy到抄送插件列表中
    plugins: {
      carbonCopy: {
        nodeId: '',
        formType: 'instance',
        msgType: 'email,inner',
        templateCode: 'copy_template',
        desc: '消息抄送',
        userRules: [
          {
            rule: '',
            description: '  [用户]发起人;\n',
            type: 'user',
            extractType: 'no',
            logicType: 'or',
            sn: 1,
            condition: null,
            source: 'start',
          },
        ],
      },
    },
  })

  data.commonUtil.InclusiveGatewayDefaultConf = JSON.stringify({
    nodeName: '分支网关', //+ maxNodeNo
    nodeKey: 'InclusiveGateway', //+ maxNodeNo
    nodeType: 'InclusiveGateway',
    choices: {
      0: {
        nodeName: '条件1',
        nodeType: 'condition',
        nodeKey: 'condition1',
        choicesConfig: {
          type: 'config',
          handScript: {
            script: '',
            desc: '',
          },
          configScript: {
            script: "return (submitActionName == 'agree')",
            desc: '任务处理动作 等于 同意',
            configs: [
              {
                sn: 1,
                list: [
                  {
                    keyName: ['submitActionName'],
                    key: 'submitActionName',
                    keyType: 'actionType',
                    condition: '{0}.equals( {1} )',
                    valueType: 'actionType',
                    value: 'agree',
                  },
                ],
              },
            ],
          },
        },
        model: 'config',
      },
      1: {
        nodeName: '条件2',
        nodeType: 'condition',
        nodeKey: 'condition2',
        configText: '(任务处理动作等于同意)',
        choicesConfig: {
          type: 'config',
          handScript: {
            script: '',
            desc: '',
          },
          configScript: {
            script: "return (submitActionName == 'agree')",
            desc: '任务处理动作 等于 同意',
            configs: [
              {
                sn: 1,
                list: [
                  {
                    keyName: ['submitActionName'],
                    key: 'submitActionName',
                    keyType: 'actionType',
                    condition: '{0}.equals( {1} )',
                    valueType: 'actionType',
                    value: 'agree',
                  },
                ],
              },
            ],
          },
        },
        model: 'config',
      },
    },
  })
}

onMounted(() => {
  // 获取基础数据
  loadEnmuDatas()
  data.commonUtil.maxNodeNo = setting.value.maxNodeNo

  // 初始化的默认节点配置
  initDefaultNodeSetting()
  // 配置表单权限时读取字段列表
  data.commonUtil.simpleFlow = simpleFlow.value
})

defineExpose({
  validate,
})
</script>
<style scoped>
/* @import "../css/workflow.css"; */
</style>

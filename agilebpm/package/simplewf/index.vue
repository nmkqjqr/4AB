<template>
  <div
    v-if="data.simpleFlow"
    v-loading="data.isloading"
    style="width: 100%; height: 100%"
  >
    <div class="fd-nav">
      <div class="fd-nav-left">
        <div class="fd-nav-back" @click="toReturn">
          <i class="el-icon-arrow-left"></i>
          关闭
        </div>
        <div class="fd-nav-title">
          {{ data.simpleFlow.name }}
        </div>
      </div>
      <div class="fd-nav-center">
        <div class="fd-nav-container">
          <div
            class="ghost-bar"
            :style="{
              transform: 'translateX(' + 150 * (data.orderNum - 1) + 'px)',
            }"
          ></div>
          <template v-if="!info.isAppSquare">
            <div
              class="fd-nav-item"
              :class="{ active: data.orderNum == 1 }"
              @click="data.orderNum = 1"
            >
              <span class="order-num">1</span>
              基础设置
            </div>
            <div
              class="fd-nav-item"
              :class="{ active: data.orderNum == 2 }"
              @click="data.orderNum = 2"
            >
              <span class="order-num">2</span>
              表单设计
            </div>
            <div
              class="fd-nav-item"
              :class="{ active: data.orderNum == 3 }"
              @click="data.orderNum = 3"
            >
              <span class="order-num">3</span>
              流程设计
            </div>
            <div
              class="fd-nav-item"
              :class="{ active: data.orderNum == 4 }"
              @click="data.orderNum = 4"
            >
              <span class="order-num">4</span>
              高级设置
            </div>
          </template>
          <template v-if="info.isAppSquare">
            <div
              class="fd-nav-item"
              :class="{ active: data.orderNum == 2 }"
              @click="data.orderNum = 2"
            >
              <span class="order-num">1</span>
              表单设计
            </div>
            <div
              class="fd-nav-item"
              :class="{ active: data.orderNum == 3 }"
              @click="data.orderNum = 3"
            >
              <span class="order-num">2</span>
              流程设计
            </div>
            <div
              class="fd-nav-item"
              :class="{ active: data.orderNum == 4 }"
              @click="data.orderNum = 4"
            >
              <span class="order-num">3</span>
              高级设置
            </div>
          </template>
        </div>
      </div>
      <div class="fd-nav-right">
        <el-button v-show="data.isSave" type="" @click="save(false)">
          <span>保存</span>
        </el-button>
        <el-button
          v-show="data.isSave"
          style="margin-right: 30px"
          type=""
          @click="save(true)"
        >
          <span>发布新版本</span>
        </el-button>
      </div>
    </div>
    <div class="fd-nav-content">
      <div v-show="data.orderNum == 1">
        <baseSetting ref="baseSettingRef" :flow-setting="data.simpleFlow" />
      </div>
      <div v-show="data.orderNum == 2">
        <formSetting
          ref="formSettingRef"
          v-model:setting="data.simpleFlow"
          :design-id="data.simpleFlow.formId"
        />
      </div>
      <div v-show="data.orderNum == 3">
        <flowDesign
          ref="flowDesignRef"
          v-model:setting="data.simpleFlow.flow"
          :bo-list="info.boList"
          :order-num="data.orderNum"
          :simple-flow="data.simpleFlow"
        />
      </div>

      <div v-show="data.orderNum == 4">
        <advancedSetting
          ref="advancedSettingRef"
          v-model:flowSetting="data.simpleFlow.flow"
        />
      </div>
    </div>
    <el-dialog v-model="data.tipVisible" title="提示" width="500px">
      <div class="ant-confirm-body">
        <el-alert
          :closable="false"
          description="以下内容不完善，需进行修改"
          show-icon
          title="当前无法发布"
          type="error"
        />
        <div class="ant-confirm-content">
          <div>
            <p class="error-modal-desc"></p>
            <div
              class="error-modal-list"
              style="width: 100%; padding-right: 0px"
            >
              <div
                v-for="(item, index) in data.validateMsg"
                :key="index"
                class="error-modal-item"
              >
                <div class="error-modal-item-label">{{ item.msgType }}：</div>
                <div class="error-modal-item-content">{{ item.msg }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="dialog-footer">
        <el-button type="primary" @click="data.tipVisible = false">
          前往修改
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
  import baseSetting from './bpm/baseSetting.vue'
  import flowDesign from './bpm/flowDesign.vue'
  import formSetting from './form/formDesign.vue'
  import advancedSetting from './bpm/advancedSetting.vue'
  import { getCurrentInstance, reactive } from 'vue'
  import { abSimWf,postData } from '@agilebpm/api'
  import { saveResourceDataUrl } from '~/agilebpm/api/modules/ab-appSquare/ab-appSquare-resource'
  import { ElMessage } from 'element-plus'
  import * as abTools from './../../utils/ab-tools'
  import * as abUtil from '@agilebpm/utils/ab-util'
  const { proxy } = abTools.useCurrentInstance()
  const info: any = reactive({
    boList: [],
    flowKey: '',
    isAppSquare:proxy.$route.name == "CreateProcess" ? true : false
  })
  const flowKey = ref('')
  provide('boList', info.boList)

  const data: any = reactive({
    isDeploy: false,
    isSave: true,
    formRev: 0,
    simpleFlow: '',
    orderNum: proxy.$route.name == "CreateProcess" ? 2 : 1,
    isloading: false,
    validateMsg: [],
    tipVisible: false,
    flowTemplateJSON: {
      steps: {
        nodeName: '开始节点',
        nodeKey: 'StartNoneEvent',
        nodeType: 'StartNoneEvent',
        plugins: {},
        buttonList: [
          {
            name: '启动',
            actionName: 'start',
            javaScript: '',
            groovyScript: '',
          },
          {
            name: '保存草稿',
            actionName: 'draft',
            javaScript: '',
            groovyScript: '',
          },
          {
            name: '传阅',
            actionName: 'carbonCopy',
            javaScript: '',
            groovyScript: '',
          },
          {
            name: '复制流程数据',
            actionName: 'relevantData',
            javaScript: '',
            groovyScript: '',
          },
          {
            name: '流程图',
            actionName: 'flowImage',
            javaScript: '',
            groovyScript: '',
          },
        ],
      },
      maxNodeNo: 1,
      properties: {
        requiredOpinion: 'true',
      },
      extProperties: {},
      plugins: {
        nodeSkip: { firstskip: true },
        // 明确候选人
        ensureCandidate: {
          amendUnsureGateway: true,
          canSetUserNodes: false,
          userCanEmpty: false,
          emptyNodeSettingUser: true,
          enable: true,
          noSkiptNodes: [],
          skiptBeforMyTask: true,
        },
        nodeMessage: [
          {
            desc: '任务待办通知',
            event: 'TASK_CREATED',
            condition: '',
            userRules: [],
            msgType: 'email,inner',
            templateCode: 'node_message_template',
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
            msgType: 'email,inner',
            templateCode: 'process_completed_template',
            nodeId: 'EndEvent1',
          },
        ],
      },
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
      nodeInitList: [],
      dataModelList: [],
      variableList: [],
      instForm: {
        type: 'inner',
      },
      printForm: {
        type: 'inner',
      },
      instanceButtonList: [
        {
          name: '传阅',
          actionName: 'carbonCopy',
          javaScript: '',
          groovyScript: '',
        },
        {
          name: '审批历史',
          actionName: 'taskOpinion',
          javaScript: '',
          groovyScript: '',
        },
        {
          name: '流程图',
          actionName: 'flowImage',
          javaScript: '',
          groovyScript: '',
        },
        {
          name: '打印',
          actionName: 'printed',
          javaScript: '',
          groovyScript: '',
        },
        {
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
        },
        {
          name: '催办',
          actionName: 'reminder',
          javaScript: '',
          groovyScript: '',
        },
      ],
    },
    UserTask1: {
      nodeKey: 'UserTask1',
      nodeName: '用户任务1',
      nodeType: 'UserTask',
      bpmProperties: {},
      plugins: {
        nodeUser: [
          {
            rule: '',
            description: '  [用户]发起人',
            type: 'user',
            pluginType: 'user',
            extract: 'no',
            logicCal: 'or',
            source: 'start',
            vars: '',
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
          name: '传阅',
          actionName: 'carbonCopy',
          javaScript: '',
        },
        {
          groovyScript: '',
          name: '审批历史',
          actionName: 'taskOpinion',
          javaScript: '',
        },
        {
          name: '流程图',
          actionName: 'flowImage',
          groovyScript: '',
          javaScript: '',
        },
        {
          name: '转办',
          actionName: 'turn',
          javaScript: '',
          groovyScript: '',
        },
        {
          name: '打印',
          actionName: 'printed',
          javaScript: '',
          groovyScript: '',
        },
      ],
    },
  })
  const baseSettingRef = ref<any>()
  const formSettingRef = ref<any>()
  const flowDesignRef = ref<any>()
  const advancedSettingRef = ref<any>()

  //加载流程key
  provide('flowKey', flowKey)

  onMounted(() => {
    const id = getCurrentInstance()?.proxy?.$route.query.id || proxy?.$route.params.flowId
    if (id) {
      loadData(id)
    } else {
      data.simpleFlow = {
        name: '',
        iconStyle: '',
        status: '',
        typeId: '',
        desc: '',
        rev: 0,
      }
      data.simpleFlow.flow = data.flowTemplateJSON
    }
  })

  const loadData = (id: any) => {
    abSimWf.getsimpleFlowJson(id).then((res: any) => {
      data.simpleFlow = res.data
      //发布状态不可保存流程
      if (data.simpleFlow?.status == 'deploy') {
        data.isDeploy = true
        data.isSave = false
      }
      // 默认生的用户任务1 这里删掉
      removeUserTask1()
    })
  }

  const save = (isPublish: any) => {
    data.isloading = true
    data.validateMsg = []
    if(proxy.$route.name !== 'CreateProcess'){
      if (baseSettingRef?.value?.validate()) {
        data.validateMsg = data.validateMsg.concat(
          baseSettingRef?.value?.validate()
        )
      }
    }


    if (flowDesignRef?.value?.validate()) {
      data.validateMsg = data.validateMsg.concat(
        flowDesignRef?.value?.validate()
      )
    }

    if (advancedSettingRef?.value?.validate()) {
      data.validateMsg = data.validateMsg.concat(
        advancedSettingRef?.value?.validate()
      )
    }
    //新增时修改编码前缀
    const old_flowKey = data.simpleFlow.flowKey
    if (!data.simpleFlow.id) {
      data.simpleFlow.flowKey = `sf_${data.simpleFlow.flowKey}`
    }

    //获取表单设计json，检查表单对象校验是否通过
    let formJson = {
      json: Object as any,
      mbJson: Object,
      msg: [],
    }
    formJson = formSettingRef?.value?.getJson(
      data.simpleFlow.flowKey,
      data.simpleFlow.name
    )
    //表单校验
    if (formJson?.msg.length > 0) {
      formJson?.msg.forEach((mStr) => {
        data.validateMsg.push({ msgType: '表单设计', msg: mStr })
      })
    }
    if (data.formRev != 0) {
      formJson.json.rev = data.formRev
    }

    //判断是否有错误信息
    data.simpleFlow.mobileForm = formJson.mbJson
    data.simpleFlow.pcForm = formJson.json

    //替换bocode，name
    jsonReplace(formJson.json)
    if (data.validateMsg.length != 0) {
      data.simpleFlow.flowKey = old_flowKey
      data.isloading = false
      data.tipVisible = true
      return
    }
    data.simpleFlow.publish = isPublish
    // 保存时添加个userTask1
    addUserTask1()
    if(proxy.$route.name == 'CreateProcess'){
      let paramsData = {
        projectId:proxy.$route.params.projectId,
        resourceType:proxy.$route.params.resourceType,
        resourceId:proxy.$route.params.resourceId,
        data:data.simpleFlow
      }
      postData(saveResourceDataUrl,paramsData)
        .then(
          (result:any) => {
            setSimpleFlowSaveData(result,isPublish,old_flowKey)
          }
        )
        .catch((res: any) => {
          data.simpleFlow.flowKey = old_flowKey
          data.isloading = false
          ElMessage({
            message: `保存失败请联系管理员！${res}`,
            type: 'error',
          })
        })
      return
    }
    data.isSave = false
    abSimWf
      .simpleFlowSave(data.simpleFlow)
      .then((result: any) => {
        setSimpleFlowSaveData(result,isPublish,old_flowKey)
        data.isSave = true
      })
      .catch((res: any) => {
        data.simpleFlow.flowKey = old_flowKey
        data.isloading = false
        ElMessage({
          message: `保存失败请联系管理员！${res}`,
          type: 'error',
        })
      })
  }

  const setSimpleFlowSaveData = (result:any,isPublish:any,old_flowKey:any) => {
    removeUserTask1()
      data.isloading = false
      if (result.data) {
        data.simpleFlow.rev = data.simpleFlow.rev + 2
        if (data.simpleFlow?.status == 'deploy') {
          data.isDeploy = true
          data.isSave = false
        } else {
          data.isDeploy = false
        }
        data.isDeploy
        ElMessage({
          showClose: true,
          message: isPublish ? '发布新版本成功！' : '保存成功！',
          type: 'success',
        })
        setTimeout(function () {
          if (!data.simpleFlow.id || isPublish) {
            if(proxy.$route.name == 'CreateProcess'){
              proxy.$router.replace({ params: {...proxy.$route.params,...{formDesignId:result.data.formDesignId,flowId:result.data.id}},query:{
                mode:'diyBo'
              }});
              data.orderNum = 2
            }else{
              window.location.href = `${
                window.location.origin + window.location.pathname
              }?id=${result.data.id}&mode=diyBo`
            }
          }
        }, 1000)
        data.formRev = result.data.formRev
        //第一次保存后需要重新刷新页面加载url中的id值
      } else {
        data.simpleFlow.flowKey = old_flowKey
        data.isloading = false
        ElMessage({
          showClose: true,
          message: result.msg,
          type: 'error',
        })
      }
  }


  const jsonReplace = (json: any) => {
    let str = JSON.stringify(data.simpleFlow)
    str = str.replaceAll('$AbDesignCode$', json.code)
    str = str.replaceAll('$设计临时名称$', json.name)
    data.simpleFlow = JSON.parse(str)
  }
  const removeUserTask1 = () => {
    // 默认生的用户任务1 这里删掉
    if (data.simpleFlow.flow.steps.next.nodeKey === 'UserTask1') {
      data.simpleFlow.flow.steps.nodeName = '开始节点'
      data.simpleFlow.flow.steps.next = data.simpleFlow.flow.steps.next.next
    }
  }
  const addUserTask1 = () => {
    // 用开始节点复制个UserTask1
    if (data.simpleFlow.flow.steps.next.nodeKey !== 'UserTask1') {
      //复制个UserTask1
      data.UserTask1.next = data.simpleFlow.flow.steps.next
      data.simpleFlow.flow.steps.next = data.UserTask1
      data.simpleFlow.flow.steps.nodeName = '开始'

      if (data.simpleFlow.flow.steps.plugins?.permission?.value) {
        data.simpleFlow.flow.steps.next.plugins.permission = abUtil.clone(
          data.simpleFlow.flow.steps.plugins.permission
        )

        data.simpleFlow.flow.steps.next.plugins.permission.value =
          data.simpleFlow.flow.steps.next.plugins.permission.value.replaceAll(
            data.simpleFlow.flow.steps.nodeKey,
            'UserTask1'
          )
      }
    }
  }
  const toReturn = () => {
    try {
      if (window.opener && window.opener.abTableSearch) {
        window.opener.abTableSearch()
      }
    } finally {
      window.close()
    }
    /*
  abTools.closeTab(proxy.$route.path)
  proxy.$router ? proxy.$router.back() : window.history.back() */
  }

  //监听页面到流程设计时更新bo对象
  watch(
    () => data.orderNum,
    (newValue) => {
      if (newValue == 3) {
        //加载bo信息
        const boJson = formSettingRef?.value?.getBo()
        info.boList[0] = boJson

        flowKey.value = data.simpleFlow.flowKey
      }
    }
  )
  watch(
    () => data.simpleFlow?.status,
    (newValue) => {
      //数据库是发布状态，而且当前修改后还是发布状态 时不能保存
      if (newValue) {
        if (data.isDeploy && newValue == 'deploy') {
          data.isSave = false
        } else {
          data.isSave = true
        }
      }
    }
  )
</script>
<style scoped>
  @import 'css/workflow2.css';
</style>

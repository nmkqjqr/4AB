<template>
  <div>
    <div v-if="!isBranch && !isEnd" class="node-def">
      <div
        class="node-def-box"
        :class="
          (isStart ? 'start-node ' : '') +
          (info.nodeDef.error ? 'active error' : '')
        "
      >
        <div @click="setNodeConfig(info.nodeDef)">
          <div class="title" :style="titleBackColor">
            <span v-show="isTask || isCc" class="iconfont"></span>
            <span>{{ info.nodeDef.nodeName }}</span>
            <i
              v-if="!isStart"
              class="anticon anticon-close close"
              @click="delNode($event)"
            ></i>
          </div>
          <div class="content">
            <div v-if="isStart" class="text">发起人</div>
            <div v-if="isTask" class="text">
              {{ setApproverStr(info.nodeDef.plugins.nodeUser) }}
            </div>
            <div v-if="isCc" class="text">
              {{ setApproverStr(info.nodeDef?.plugins?.carbonCopy?.userRules) }}
            </div>
            <i class="anticon anticon-right arrow"></i>
          </div>
          <div v-if="info.nodeDef.error" class="error_tip">
            <i
              class="anticon anticon-exclamation-circle"
              style="color: rgb(242, 86, 67)"
            ></i>
          </div>
        </div>
      </div>
      <addNode
        class="dingflow-design"
        :common-util="commonUtil"
        :node-def="info.nodeDef"
      />
    </div>
    <div v-if="isBranch" class="branch-wrap">
      <div class="branch-box-wrap">
        <div class="branch-box">
          <button class="add-branch" @click="addCondition">添加条件</button>

          <div
            v-for="(item, index) in info.nodeDef.choices"
            :key="index"
            class="col-box"
          >
            <div class="condition-node">
              <div class="condition-node-box">
                <div class="auto-judge" @click="setCondition(item)">
                  <div class="title-wrapper">
                    <span class="editable-title">{{ item.nodeName }}</span>
                    <i
                      class="anticon anticon-close close"
                      @click="delCondition(index, $event)"
                    ></i>
                  </div>
                  <div class="content">
                    {{ item.choicesConfig?.configScript?.desc || '请设置条件' }}
                  </div>
                  <div v-if="item.error" class="error_tip">
                    <i
                      class="anticon anticon-exclamation-circle"
                      style="color: rgb(242, 86, 67)"
                    ></i>
                  </div>
                </div>
                <addNode :common-util="commonUtil" :node-def="item" />
              </div>
            </div>
            <abNodeDef
              v-if="item.next"
              ref="abNodeDefRef"
              v-model="item.next"
              :common-util="commonUtil"
              :director-max-level="directorMaxLevel"
            />
            <div v-show="index == 0" class="top-left-cover-line"></div>
            <div v-show="index == 0" class="bottom-left-cover-line"></div>
            <div
              v-show="index == conditionLen() - 1"
              class="top-right-cover-line"
            ></div>
            <div
              v-show="index == conditionLen() - 1"
              class="bottom-right-cover-line"
            ></div>
          </div>
        </div>
        <addNode :common-util="commonUtil" :node-def="info.nodeDef" />
      </div>
    </div>
    <el-drawer
      v-model="data.conditionDrawer"
      :append-to-body="true"
      destroy-on-close
      placement="right"
      size="1100px"
      :transfer="true"
      @close="validateNode(info.nodeDef, [], true)"
    >
      <template #header>
        <span style="font-size: 16px">条件设置</span>
      </template>
      <div style="padding: 10px">
        <conditionSetting
          :common-util="commonUtil"
          :select-item="data.selectItem"
        />
      </div>
    </el-drawer>
    <abNodeDef
      v-if="info.nodeDef.next"
      v-model="info.nodeDef.next"
      :common-util="commonUtil"
      :director-max-level="directorMaxLevel"
    />
    <nodeConfigSetting
      ref="nodeConfigSettingRef"
      :common-util="commonUtil"
      :node-def="info.nodeDef"
      @approverDrawerClose="validateNode(info.nodeDef, [], true)"
    />
  </div>
</template>
<script lang="ts" setup>
  import addNode from './nodeSetting/addNode.vue'
  import abNodeDef from './nodeDef.vue'
  import nodeConfigSetting from './nodeSetting/nodeConfigSetting.vue'
  import conditionSetting from './nodeSetting/conditionSetting.vue'

  const props = defineProps({
    modelValue: { required: true, type: Object },
    directorMaxLevel: { required: true, type: Number },
    commonUtil: { required: true, type: Object },
  })
  const { directorMaxLevel, commonUtil } = toRefs(props)

  const emit = defineEmits(['update:modelValue'])
  const mValue = useVModel(props, 'modelValue', emit)

  const info: any = reactive({
    nodeDef: mValue,
  })

  const data: any = reactive({
    placeholderList: ['发起人', '审核人', '抄送人'],
    nodeSettingActName: 1,
    selectItem: {},
    copyerDrawer: false,
    activeName: '1',
    conditionDrawer: false,
    conditions: [],
    conditionList: [],
    conditionRoleVisible: false,
    conditionRoleSearchName: '',
    conditionDepartmentList: [],
    conditionEmployessList: [],
    conditionRoleList: [],
  })

  // 开始节点
  const isStart = computed(() => {
    return info.nodeDef.nodeType === 'StartNoneEvent'
  })
  // 结束节点

  const isEnd = computed(() => {
    return info.nodeDef.nodeType === 'EndNoneEvent'
  })
  // 任务节点

  const isTask = computed(() => {
    return info.nodeDef.nodeType === 'UserTask'
  })
  // 抄送节点

  const isCc = computed(() => {
    // 暂时不需要支持抄送节点
    return info.nodeDef.nodeType === 'ServiceTask'
  })
  // 条件节点

  const isCond = computed(() => {
    return info.nodeDef.nodeType === 'condition'
  })
  // 路由分支

  const isBranch = computed(() => {
    return info.nodeDef.nodeType === 'InclusiveGateway'
  })

  const titleBackColor = computed(() => {
    const colorJson = {
      StartNoneEvent: '87, 106, 149',
      EndNoneEvent: '87, 106, 149',
      UserTask: '255, 148, 62',
      ServiceTask: '50, 150, 250',
    }
    return `background: rgb(${colorJson[info.nodeDef.nodeType]});`
  })

  const conditionLen = () => {
    let len = 0
    for (const i in info.nodeDef.choices) {
      len++
    }
    return len
  }
  const setApproverStr = (nodeUser: any) => {
    let content = ''
    if (!nodeUser) {
      return content
    }
    nodeUser.forEach((calc: any) => {
      const description: any[] = []
      /*     if (rule.calcs[0] == null) {
      rule.calcs = []
    } */
      const keyValues = {
        startUserOrg: '发起人所在组织',
        preTaskUserOrg: '上一任务处理者所在组织',
        formField: '来自表单字段 ',
        currentOrg: '',
        parentOrg: '上级',
        childOrg: '下级',
        parentOrgFilterType: '上级中指定类型为',
        childOrgFilterType: '下级中指定类型为',
        parentOrgSpecicalLevel: '上级中指定',
        2: '上两级',
        3: '上三级',
        4: '上四级',
        5: '上五级',
        10: '集团',
        11: '公司',
        13: '部门',
        15: '班组',
      }

      if (calc.type == 'user' && calc.source == 'start') {
        calc.description = '发起人'
        description.push(calc.description)
      } else if (calc.type == 'user') {
        if (calc?.users?.length > 0) {
          const descStr = calc.users.map((a: any) => a.name).join(',')
          calc.description = descStr
          description.push(descStr)
        }
        /*  calc.description = calc.userName
      calc.userName
        ? description.push(calc.userName)
        : (info.nodeDef.error = true) */
      } else if (calc.type == 'group') {
        if (calc.groupType == 'org' && calc?.orgs?.length > 0) {
          calc.description = calc.orgs.map((a: any) => a.name).join(',')
        }
        if (calc?.groupType == 'role' && calc?.roles?.length > 0) {
          calc.description = calc.roles.map((a: any) => a.name).join(',')
        }
        if (calc?.groupType == 'post' && calc?.posts?.length > 0) {
          calc.description = calc.posts.map((a: any) => a.name).join(',')
        }
        description.push(calc.description)
      } else if (calc.type == 'relativePost') {
        calc.description = calc.relativePost.roleName
        let descriptionStr =
          keyValues[calc.relativePost.orgFrom] == undefined
            ? ''
            : keyValues[calc.relativePost.orgFrom]
        descriptionStr +=
          keyValues[calc.relativePost.orgRelation] == undefined
            ? ''
            : keyValues[calc.relativePost.orgRelation]
        descriptionStr +=
          keyValues[`1${calc.relativePost.parentOrgFilterType}`] == undefined ||
          keyValues[`1${calc.relativePost.parentOrgFilterType}`] == ''
            ? ''
            : `(${keyValues[`1${calc.relativePost.parentOrgFilterType}`]})的`
        descriptionStr +=
          keyValues[calc.relativePost.parentOrgSpecicalLevel] == undefined ||
          keyValues[calc.relativePost.parentOrgSpecicalLevel] == ''
            ? ''
            : `指定类型为(${
                keyValues[calc.relativePost.parentOrgSpecicalLevel]
              })的`
        descriptionStr += calc.relativePost.roleName
        calc.relativePost.roleName
          ? description.push(descriptionStr)
          : (info.nodeDef.error = true)
      }

      content += `${description.join(',')}\n`
      calc.description = description.join(',')
    })
    return content
  }
  const copyerStr = (nodeDef: any) => {
    const desc =
      nodeDef.nodeUser.user.userName +
      nodeDef.nodeUser.role.groupName +
      nodeDef.nodeUser.post.groupName
    if (desc) {
      return desc
    }
    if (nodeDef.ccSelfSelectFlag) {
      return '发起人自选'
    }
    return '请选择'
  }

  const abNodeDefRef = ref<any>(null)
  const delNode = (event: any) => {
    event.stopPropagation()
    commonUtil.value.delNodeConfirmed = true

    if (info?.nodeDef?.next == undefined) {
      //调用上一层删除方法
      info.nodeDef = undefined
    } else {
      info.nodeDef = info.nodeDef.next
    }
  }

  const reSortCondition = () => {
    // 重新排序
    let idx = 0
    const tempData = {}
    for (const i in info.nodeDef.choices) {
      tempData[idx++] = info.nodeDef.choices[i]
    }
    info.nodeDef.choices = tempData
  }
  const addCondition = () => {
    reSortCondition()
    const length = conditionLen()
    const a = {
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
    }

    const choicesObj = {
      choicesConfig: a,
      model: 'config',
      nodeKey: `condition${length + 1}`,
      nodeName: `条件${length + 1}`,
      nodeType: 'condition',
    }
    info.nodeDef.choices[length] = choicesObj
    //emit('update:modelValue', info.nodeDef)
  }
  const delCondition = (index: any, event: any) => {
    event.stopPropagation()
    delete info.nodeDef.choices[index]
    reSortCondition()
    // 如果只有一个节点了 需要将条件下的子节点的保留下来
    if (conditionLen() === 1) {
      info.nodeDef = info.nodeDef.next
    }
  }
  const nodeConfigSettingRef = ref<any>(null)
  const setNodeConfig = (nodeDef: any) => {
    if (isStart || isEnd || isTask || isCc) {
      nextTick(() => {
        nodeConfigSettingRef.value?.show()
      })
    }
  }
  const setCondition = (item: any) => {
    data.conditionDrawer = true
    data.selectItem = item
  }
  const validateNode = (steps: any, arrayMsgs: any, justCurrentNode: any) => {
    const nodeError = []
    if (!steps.nodeName) {
      nodeError.push({
        msgType: `流程设计-${steps.nodeKey}`,
        msg: '节点名字不能为空',
      })
      arrayMsgs = arrayMsgs.concat(nodeError)
    }
    // 如果之前未设计表单，则提醒添加表单
    // 除了开始节点，均默认为只读表单
    if (
      steps.plugins &&
      steps.plugins.nodeUser &&
      steps.nodeType == 'UserTask'
    ) {
      checkUserAssign(steps.nodeName, steps.plugins.nodeUser, arrayMsgs)
    }
    if (steps.nodeType == 'ServiceTask') {
      if (!steps.plugins.carbonCopy.msgType) {
        nodeError.push({
          msgType: `流程设计-${steps.nodeName}`,
          msg: '抄送消息类型不能为空',
        })
      }
      checkUserAssign(
        steps.nodeName,
        steps.plugins.carbonCopy.userRules,
        arrayMsgs
      )
    }
    if (steps.nodeType == 'InclusiveGateway') {
      for (const key in steps.choices) {
        const item = steps.choices[key]
        if (item.configs && item.configs.length == 0) {
          nodeError.push({
            msgType: `流程设计-${steps.nodeName}`,
            msg: '网关条件不能为空',
          })
        }

        if (!item.next) {
          nodeError.push({
            msgType: `流程设计-${steps.nodeName}`,
            msg: '网关没有后续用户任务，请检查',
          })
        } else {
          delete item.error
        }
      }
    }

    // 处理结果
    if (nodeError.length > 0) {
      arrayMsgs = arrayMsgs.concat(nodeError)
      steps.error = true
    } else {
      steps.error = false
    }

    if (steps.next && !justCurrentNode) {
      validateNode(steps.next, arrayMsgs, justCurrentNode)
    }
  }
  const checkUserAssign = (nodeName: any, nodeUser: any, nodeError: any) => {
    if (nodeUser.length == 0) {
      nodeError.push({
        msgType: `流程设计-${nodeName}`,
        msg: '人员配置不能为空',
      })
      return
    }

    if (
      nodeUser.type == 'user' &&
      nodeUser.source == 'spec' &&
      !nodeUser.account
    ) {
      nodeError.push({
        msgType: `流程设计-${nodeName}`,
        msg: '人员配置不完善，请选择具体用户',
      })
    }
    if (nodeUser.type == 'group' && !nodeUser.groupKey) {
      nodeError.push({
        msgType: `流程设计-${nodeName}`,
        msg: '人员配置不完善，请选择具体 组',
      })
    }
    if (nodeUser.type == 'relativePost' && !nodeUser.roleKey) {
      nodeError.push({
        msgType: `流程设计-${nodeName}`,
        msg: '人员配置不完善，请选择具体 相对岗位',
      })
    }
  }
  defineExpose({
    validateNode,
  })
</script>
<style></style>

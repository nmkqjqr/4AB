<template>
  <el-timeline >
    <el-timeline-item
      v-for="nodeInfo in freeData.nodeInfoList"
      :key="nodeInfo.nodeKey"
      :icon ="getTypeByNodeInfo(nodeInfo).icon"
      size="large"
      :type="getTypeByNodeInfo(nodeInfo).style"
    >
      <span :style="`font-size: var(--el-font-size-large) `">
        {{ nodeInfo.nodeName }}
      </span>
      <br/>
      <!--如果是用户任务，且不隐藏-->
      <div
        v-if="
          'ExclusiveGateway,InclusiveGateway,ParallelGateway'.indexOf(
            nodeInfo.nodeType
          ) == -1 && !nodeInfo.isHide
        "
      >
        <div v-show="nodeInfo.nodeType != 'other'">
          <!-- 异常说明-->
          <p>
            <div v-show="nodeInfo.skipReason" class="warning">
                {{ nodeInfo.skipReason }}！  <br/><br/>
            </div>
            <el-space wrap>
            <div
              v-show=" 
                nodeInfo.identitiesMsg && (!nodeInfo.identities || !nodeInfo.identities.length) "
              class="warning"
            >
              {{ nodeInfo.identitiesMsg }} ！ 
            </div>
            <el-tag
              v-for="(identity, index) in nodeInfo.identities"
              :key="identity.id"
              :closable="canSetUser(nodeInfo)"
              plain
              @close="removeIdentity(index, nodeInfo)"
            >
              {{ identity.name }}
            </el-tag>
            <!-- 如果没有候选人且开启了可以自定义候选人，或者允许自定义修改候选人 则可以修改候选人 -->
            <ab-cust-dialog
              v-if="canSetUser(nodeInfo)"
              dialog-key="userSelector"
              :extra-data="nodeInfo"
              @ok="selectNodeUser"
            >
              {{$abT('page.common.personnelSelection','人员选择')}}
            </ab-cust-dialog>
          </el-space>
          <span
            v-show="
              !nodeInfo.identitiesMsg &&
              (!nodeInfo.identities || !nodeInfo.identities.length)
            "
          >
            {{$abT('bpm.office.improveNodeCandidates','请完善节点候选人')}}
          </span>
          </p>
        </div>
      </div>
      <!-- 分支网关时-->
      <div
        v-if="
          nodeInfo.nodeType == 'ExclusiveGateway' &&
          nodeInfo.outGoingNodes &&
          nodeInfo.outGoingNodes.length &&
          !nodeInfo.isHide
        "
      >
        <p>
          <div v-show="!nodeInfo.distnation" class="warning">{{ nodeInfo.identitiesMsg }} <br/><br/></div>
          {{$abT('bpm.office.subsequentBranchNode',' 分支后续节点:')}}
          <el-tag
            v-for="nodes in nodeInfo.outGoingNodes"
            v-show="
              !nodeInfo.distnation || nodes.nodeKey + ',' === nodeInfo.distnation
            "
            :key="nodes.nodeKey"
          >
            {{ nodes.nodeName }}
          </el-tag>
        </p>
      </div>

      <div
        v-if="
          'InclusiveGateway,ParallelGateway'.indexOf(nodeInfo.nodeType) != -1 &&
          nodeInfo.outGoingNodes &&
          nodeInfo.outGoingNodes.length &&
          !nodeInfo.isHide
        "
      >
        <p v-show="!nodeInfo.distnation">
          {{ nodeInfo.identitiesMsg }}
        </p>
        {{ $abT('bpm.office.gatewaySubsequentNodes','网关后续节点') }}:
        <el-space wrap>
          <el-tag v-for="nodes in nodeInfo.outGoingNodes" :key="nodes.nodeKey">
            {{ nodes.nodeName }}
          </el-tag>
        </el-space>
      </div>
    </el-timeline-item>
  </el-timeline>
</template>

<script lang="ts" setup>
  import { Select, Bell, Opportunity } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  import { abT } from '@/i18n'

  //引入 当前实例
  const props = defineProps<{
    freeData?: any //自由跳转的数据
  }>()

  const pageData = reactive({
    nodeInfo: {},
    nodeInfoMap: {},
    confirmed: false,
  })
  onMounted(() => {
    if (
      props.freeData.ensureCandidate &&
      props.freeData.ensureCandidate.enable
    ) {
      // eslint-disable-next-line no-cond-assign
      for (
        var i = 0, nodeInfo;
        (nodeInfo = props.freeData.nodeInfoList[i++]);

      ) {
        pageData.nodeInfoMap[nodeInfo.nodeKey] = nodeInfo
      }
      handSkipBeforeMyTask()
    }
  })
  const iconInfo = {
    success :{ icon: Select ,style:'success'},
    warning: {icon: Bell,style:'warning'}
  }
  const getTypeByNodeInfo = (nodeInfo: any) => {
    // 分支网关有出口则变绿
    if ('ExclusiveGateway' == nodeInfo.nodeType) {
      return nodeInfo.distnation ? iconInfo.success : iconInfo.warning
    }
    // 同步网关均为绿色
    if ('InclusiveGateway,ParallelGateway'.indexOf(nodeInfo.nodeType) != -1) {
      return iconInfo.success 
    }

    // 普通任务，有候选人则为绿色
    if (
      (nodeInfo.identities && nodeInfo.identities.length) ||
      nodeInfo.nodeType == 'other'
    ) {
      return iconInfo.success 
    }
    return iconInfo.warning
  }

  const check = () => {
    // 校验明确责任人插件
    if (
      props.freeData &&
      props.freeData.ensureCandidate &&
      props.freeData.ensureCandidate.enable
    ) {
      // eslint-disable-next-line no-cond-assign
      for (
        var i = 0, nodeInfo;
        (nodeInfo = props.freeData.nodeInfoList[i++]);

      ) {
        if (
          'ExclusiveGateway,InclusiveGateway,ParallelGateway'.indexOf(
            nodeInfo.nodeType
          ) == -1 &&
          nodeInfo.nodeType != 'other' &&
          !nodeInfo.isHide &&
          (!nodeInfo.identities || !nodeInfo.identities.length) && !props.freeData.ensureCandidate.userCanEmpty
        ) {
           ElMessage({
              message: `${nodeInfo.nodeName } ${abT('bpm.office.noCandidatesMsg','节点无候选人，请联系管理员调整流程！')}`,
              type: 'warning',
            })
          return false
        }
        if (
          nodeInfo.nodeType == 'ExclusiveGateway' &&
          !nodeInfo.distnation &&
          !nodeInfo.isHide &&
          !pageData.confirmed
        ) {
          ElMessage({
              message: `${nodeInfo.nodeName } ${abT('bpm.office.noOutGoingMsg','分支走向尚未明确，请确认！若确认无误，请再次提交！')}`,
              type: 'warning',
          })
          pageData.confirmed = true
          return false
        }
      }
      return true
    }
  }
    // 将外部允许调用的方法
  defineExpose({ check })

  // 明确候选人插件的部分
  const removeIdentity = (index: number, nodeInfo: any) => {
    if (
      (props.freeData.ensureCandidate.emptyNodeSettingUser &&
        nodeInfo.identitiesMsg) ||
      props.freeData.ensureCandidate.canSetUserNodes
    ) {
      nodeInfo.identities.splice(index, 1)
      handSkipBeforeMyTask()
    }
  }

  const canSetUser = (nodeInfo: any)=>{
    return (props.freeData.ensureCandidate.emptyNodeSettingUser &&
        nodeInfo.identitiesMsg) ||
      props.freeData.ensureCandidate.canSetUserNodes
  }

  const selectNodeUser = (users: any, nodeInfo: any) => {
    if (!nodeInfo.identities) {
      nodeInfo.identities = []
    }
    // eslint-disable-next-line no-cond-assign
    for (var j = 0, item; (item = users[j++]); ) {
      // eslint-disable-next-line no-cond-assign
      for (var i = 0, user; (user = nodeInfo.identities[i++]); ) {
        if (user.id == item.id) return
      }
      const newUser = {
        id: item.id,
        name: item.name,
        type: 'user', //用户
      }
      nodeInfo.identities.push(newUser)
    }
    handSkipBeforeMyTask()
  }

  const showExclusiveGatewayAfterNodes = (exclusiveGatewayNodeInfo: any) => {
    // 隐藏其他非选择分支的路线
    exclusiveGatewayNodeInfo.outGoingNodes.forEach((outNode: any) => {
      if (outNode.nodeKey !== exclusiveGatewayNodeInfo.distnation) {
        hideAfterNodes(pageData.nodeInfoMap[outNode.nodeKey], true, [])
      }
    })

    // 将自己后续节点全部展示
    const afterNodes = hideAfterNodes(
      pageData.nodeInfoMap[exclusiveGatewayNodeInfo.distnation],
      false,
      []
    )

    const nodeList = props.freeData.nodeInfoList
    const index = nodeList.indexOf(exclusiveGatewayNodeInfo)
    nodeList.splice(index + 1, nodeList.length + 1)
    nodeList.pushAll(afterNodes)

    handSkipBeforeMyTask()
  }

  const hideAfterNodes = (nodeInfo: any, isHide: boolean, afterNodes: any) => {
    if (!nodeInfo) return afterNodes

    nodeInfo.isHide = isHide

    if (!isHide) {
      afterNodes.push(nodeInfo)
      if (nodeInfo.nodeType == 'ExclusiveGateway' && !nodeInfo.distnation) {
        return afterNodes
      }
    }
    nodeInfo.outGoingNodes.foreach((outNode: any) => {
      if (!nodeInfo.distnation || nodeInfo.distnation === outNode.nodeKey) {
        hideAfterNodes(pageData.nodeInfoMap[outNode.nodeKey], isHide, afterNodes)
      }
    })

    return afterNodes
  }

  const handSkipBeforeMyTask = () => {
    const ensureCandidate = props.freeData.ensureCandidate
    if (
      !ensureCandidate ||
      !ensureCandidate.enable ||
      !ensureCandidate.skiptBeforMyTask
    ) {
      return
    }
    const nodeUserMap = {}

    const nodeInfoList = props.freeData.nodeInfoList
    for (let i = nodeInfoList.length - 1; i >= 0; i--) {
      const nodeInfo = nodeInfoList[i]
      // 不存在候选人，暂不计算
      if (
        !nodeInfo.identities ||
        (nodeInfo.identities.length != 1 && !nodeInfo.isDynamicTask) ||
        nodeInfo.isHide
      ) {
        delete nodeInfo.isSkip
        delete nodeInfo.skipReason
        continue
      }

      // 忽略跳过节点
      const isNoSkipNode =
        ensureCandidate.noSkiptNodes &&
        ensureCandidate.noSkiptNodes.indexOf(nodeInfo.nodeKey) != -1

      // 动态任务
      if (nodeInfo.isDynamicTask && nodeInfo.identities.length > 1) {
        const nodeSkipInfo: Array<any> = []
        delete nodeInfo.skipReason

        nodeInfo.identities.forEach((item: any) => {
         
          // 规则
          const key = item.id + item.type
          if (nodeUserMap[key] && !isNoSkipNode) {
            item.isSkip = true
            item.skipReason =
              `${abT('bpm.office.skipsameTaskCandidate','与后续节点【{a}】任务候选人相同跳过',{a: nodeUserMap[key],})}`
            nodeSkipInfo.push(item.name)
          } else {
            delete item.isSkip
            delete item.skipReason
          }
          nodeUserMap[key] = `${nodeInfo.nodeName  }-${  item.name}`
          if (nodeSkipInfo.length > 0) {
            nodeInfo.skipReason =
              `${nodeSkipInfo.join(',')  } ${abT('bpm.office.skipsameTaskCandidate','与后续节点【{a}】任务候选人相同跳过',{a: nodeUserMap[key],})}`
          }
        })
      } else {
        // 普通任务
        const key = nodeInfo.identities[0].id + nodeInfo.identities[0].type
        // 与之前节点任务候选人相同，则跳过
        if (nodeUserMap[key] && !isNoSkipNode) {
          nodeInfo.isSkip = true
          nodeInfo.skipReason =
            `${abT('bpm.office.skipsameTaskCandidate','与后续节点【{a}】任务候选人相同跳过',{a: nodeUserMap[key],})}`
        } else {
          delete nodeInfo.isSkip
          delete nodeInfo.skipReason
        }
        nodeUserMap[key] = nodeInfo.nodeName
      }
    }
  }
</script>
<style scoped>
.warning {
  color:#eebe77
}


</style>

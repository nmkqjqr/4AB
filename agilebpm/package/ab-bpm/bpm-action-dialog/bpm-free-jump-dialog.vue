<template>
  <el-dialog
    :append-to-body="true"
    :before-close="dialogOperator.dialogCancel"
    :model-value="props.isShow"
    :title="props.title"
    width="520px"
  >
    <el-form ref="formRef" label-position="top" :model="actionData">
      <bpm-opinion
        :bpm-data="props.bpmData"
        :opinion-title="$abT('bpm.office.commentsRemarks', '意见/备注')"
        :node-title="$abT('bpm.office.nodeSelection', '节点选择')"
        :show-node="true"
        @init-node="initNodeFn"
      >
        <template #userchoose>
          <el-form-item
            :label="
              $abT('bpm.office.NextTaskCandidate', '下步任务候选人配置：')
            "
          >
            <el-tag
              v-for="(user, index) in info.userList"
              :key="index"
              closable
              style="margin-right: 10px"
              @close="closeUserTag(index)"
            >
              {{ user.name }}
            </el-tag>
            <el-tag v-if="info.userList.length === 0" type="warning">
              {{ $abT('page.common.notSelect', '未选择') }}
            </el-tag>
            <ab-cust-dialog
              :dialog-key="props.dialogKey"
              :dialog-setting="{ multiple: 1 }"
              :icon="Search"
              size="small"
              style="margin-left: 5px"
              type="primary"
              @ok="chooseUser"
            >
              {{ $abT('page.common.personnelSelection', '人员选择') }}
            </ab-cust-dialog>
          </el-form-item>
        </template>
      </bpm-opinion>
    </el-form>
    <template #footer>
      <el-button text type="default" @click="dialogOperator.dialogCancel">
        {{ $abT('page.common.cancel', '取消') }}
      </el-button>
      <el-button type="primary" @click="dialogOk">
        {{ $abT('page.common.ok', '确定') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue'
  import { ElMessage, FormInstance } from 'element-plus'
  import bpmOpinion from './componets/bpm-opinion.vue'
  import UserChoose from './componets/user-choose.vue'
  import dialogOperate from './componets/dialog-operate-mixin'
  import { bpmApi } from '@agilebpm/api'
  import { user } from '~/agilebpm/api/modules/ab-org'
  import * as abUtil from '~/agilebpm/utils/ab-util'

  const formRef = ref<FormInstance>()
  const info: any = reactive({
    viewValue: '',
    userList: [],
  })
  const props = defineProps({
    bpmData: { required: true, type: Object as PropType<BpmData> },
    /** 是否展示对话框 */
    isShow: { required: true, type: Boolean },
    title: { required: false, type: String, default: '意见' },
    dialogKey: { type: String, required: false, default: 'userSelector' },
  })

  // 需要双向绑定的值
  const { actionData } = toRefs(props.bpmData)
  const idenMap = new Map()

  const initNodeFn = (nodeInfoList: any) => {
    if (nodeInfoList && nodeInfoList.length > 0) {
      nodeInfoList.forEach((item: any) => {
        idenMap.set(item.nodeKey, item.identityList)
      })
    }
    initUserList(actionData.value.presetDestination)
  }

  watch(
    () => info.userList,
    (newValue) => {
      if (actionData.value.presetDestination) {
        const IdentityMapTemp = {}
        IdentityMapTemp[actionData.value.presetDestination] = newValue
        actionData.value.identityMap = IdentityMapTemp
      }
    },
    { deep: true }
  )

  watch(
    () => actionData.value.presetDestination,
    (newValue) => {
      initUserList(actionData.value.presetDestination)
    },
    { deep: true }
  )

  const initUserList = (key: any) => {
    info.userList = []
    if (idenMap.get(key)) {
      info.userList = idenMap.get(key)
    }
  }

  //用户选择
  const chooseUser = (list: any) => {
    if (!list && list.length == 0) {
      return
    }
    const userNames = []
    for (const index in list) {
      userNames.push(list[index].name)
      info.userList.push({
        id: list[index].id,
        name: list[index].name,
        type: 'user',
      })
    }
    info.viewValue = userNames.join(',')
  }

  //用户选择
  const closeUserTag = (index: number) => {
    info.userList.splice(index, 1)
  }

  const dialogOk = () => {
    dialogOperator.dialogOk(formRef.value)
  }
  //对话框操作
  const dialogOperator = dialogOperate(formRef, actionData.value)
</script>

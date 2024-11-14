<template>
  <el-dialog
    :append-to-body="true"
    :before-close="dialogCancel"
    :model-value="props.isShow"
    :title="props.title"
    width="550px"
  >
    <el-form
      ref="formRef"
      v-loading="okLoading.pageLoading"
      label-position="top"
      :model="actionData"
    >
      <start-ensure-candidate
        v-if="nodeChoiceData.ensureCandidate"
        ref="ensure"
        :free-data="nodeChoiceData"
      />
      <opinion-node-user-setting
        v-else-if="
          nodeChoiceData &&
          (nodeChoiceData.custGatewayRouter ||
            nodeChoiceData.nodeUserType != 'no') &&
          nodeChoiceData.freeNodeList &&
          nodeChoiceData.freeNodeList.length > 0
        "
        v-model="actionData.presetDestination"
        :action-data="actionData"
        :data="nodeChoiceData"
      />
      <el-form-item
        :label="$abT('bpm.office.commentsRemarks', '意见/备注')"
        prop="opinion"
        :rules="[
          {
            required:
              bpmData.bpmNodeConfig?.requiredOpinion &&
              bpmData.bpmNodeConfig?.requiredOpinion == 'trueAndRequired',
            message: $abT('page.common.required', '必填'),
          },
        ]"
      >
        <el-input
          v-model="actionData.opinion"
          :placeholder="$abT('bpm.office.enterDescOrRemark', '请输入意见/备注')"
          :rows="4"
          :maxlength="1000"
          show-word-limit
          type="textarea"
        />
      </el-form-item>

      <ab-daily-phrases @setDailyPhrases="setDailyPhrasesFn" />

      <el-form-item
        v-if="bpmData.bpmNodeConfig && bpmData.bpmNodeConfig.custTaskTimeLimit"
        :label="$abT('bpm.office.nextTaskComplateTime', '下一步任务限时完成')"
      >
        <abTimes v-model="actionData.extendConf.taskTimeLimit" />
        <el-select
          v-model="actionData.extendConf.isUrgencyTask"
          :placeholder="$abT('bpm.office.isItUrget', '是否加急')"
          style="width: 120px"
        >
          <el-option
            :label="$abT('page.common.systemDefault', '系统默认')"
            value=""
          />
          <el-option
            :label="$abT('bpm.office.urgentTask', '紧急任务')"
            value="true"
          />
          <el-option
            :label="$abT('bpm.office.normalTasks', '正常任务')"
            value="false"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="
          bpmData.bpmNodeConfig?.requiredOpinion &&
          bpmData.bpmNodeConfig?.requiredOpinion.indexOf('true') != -1
        "
      >
        <ab-upload-file
          v-model="actionData.extendConf.files"
          dic-code="ywfj"
          :multiple="true"
          :limit="5"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button text type="default" @click="dialogCancel">
        {{ $abT('page.common.cancel', '取消') }}
      </el-button>
      <el-button
        :disabled="okLoading.pageLoading"
        :loading="okLoading.dialogOkLoading"
        type="primary"
        @click="dialogOk(formRef)"
      >
        {{ $abT('page.common.ok', '确定') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue'
  import { ElMessage, FormInstance } from 'element-plus'
  import opinionNodeUserSetting from './opinion-node-user-setting.vue'
  import startEnsureCandidate from './start-ensure-candidate.vue'
  import { bpmApi } from '@agilebpm/api'
  import { abTimes, abUploadFile } from '@ab-core'
  import { abT } from '@/i18n'

  import abDailyPhrases from '../componets/ab-daily-phrases.vue'

  const formRef = ref<FormInstance>()
  const props = defineProps({
    bpmData: { required: true, type: Object as PropType<BpmData> },
    /** 是否展示对话框 */
    isShow: { required: true, type: Boolean },
    title: {
      required: false,
      type: String,
      default: abT('bpm.office.commentsRemarks', '意见/备注'),
    },
  })
  // callback 为 对话框处理完数据后返回事件
  const emit = defineEmits(['dialogCancel', 'callback'])
  // 需要双向绑定的值
  const { actionData } = toRefs(props.bpmData)
  const okLoading = reactive({
    dialogOkLoading: false,
    timer: null as any,
    pageLoading: true,
  })

  /**
   * 节点 自由分支选择
   * 节点 人员预算，组下人员选择
   * 节点 自由驳回选择
   * 等选择类型的数据配置，二次通过接口到后台取值
   */
  const nodeChoiceData = ref({}) as any
  bpmApi.task.handleNodeFreeSelectUser(actionData.value).then(
    ({ data }) => {
      nodeChoiceData.value = data
      okLoading.pageLoading = false
    },
    () => {
      //okLoading.pageLoading = false
      dialogCancel()
    }
  )

  // 关闭对话框
  const dialogCancel = () => {
    emit('dialogCancel', false)
  }

  const checkNodeChoiceData = () => {
    const targetNode: any = nodeChoiceData.value.freeNodeList.find(
      (item: any) => {
        return item.nodeKey == actionData.value.presetDestination
      }
    )
    if (!targetNode) {
      return true
    }
    //自由候选人选择
    if (nodeChoiceData.value.nodeUserType != 'no') {
      //如果不是结束节点 选择的是 节点人员必选，一定要有候选人
      if (
        !targetNode.nodeKey.startsWith('EndEvent') &&
        nodeChoiceData.value.nodeUserType === 'nodeUserRequired' &&
        (!targetNode.identites || targetNode.identites.length == 0)
      ) {
        ElMessage({
          message: abT('bpm.office.selectOneCandidate', '请至少选择一个候选人'),
          type: 'warning',
        })
        okLoading.dialogOkLoading = false
        return false
      }
      actionData.value.identityMap = {}
      actionData.value.identityMap[actionData.value.presetDestination] =
        targetNode.identites
    }
    return true
  }

  const vueContext = getCurrentInstance()

  const dialogOk = async (formEl: FormInstance | undefined) => {
    okLoading.dialogOkLoading = true
    // 校验明确责任人插件
    const ensureRef: any = vueContext?.refs.ensure
    if (ensureRef) {
      if (!ensureRef.check()) {
        okLoading.dialogOkLoading = false
        return
      }
      // 明确候选人赋值
      actionData.value.extendConf.ensureCandidateInfo =
        nodeChoiceData.value.nodeInfoList
    } else if (
      nodeChoiceData.value &&
      (nodeChoiceData.custGatewayRouter ||
        nodeChoiceData.value.nodeUserType != 'no')
    ) {
      if (!checkNodeChoiceData()) {
        okLoading.dialogOkLoading = false
        return
      }
    }
    if (
      !nodeChoiceData.value.custGatewayRouter &&
      nodeChoiceData.value.nodeUserType == 'no' &&
      !nodeChoiceData.value.canBackHistoryNodes
    ) {
      //置空自由跳转
      actionData.value.presetDestination = ''
    }

    if (!formEl) return
    await formEl.validate((valid, fields) => {
      if (valid) {
        emit('dialogCancel', false, true)
        emit('callback', actionData.value)
      } else {
        okLoading.dialogOkLoading = false
        ElMessage({
          message: abT('page.common.completeForm', '请完善表单！'),
          type: 'warning',
        })
      }
    })

    if (okLoading.timer) clearTimeout(okLoading.timer)
    okLoading.timer = setTimeout(() => {
      okLoading.dialogOkLoading = false
    }, 5000)
  }

  const formatYshxr = (list: []) => {
    const names: string[] = []
    list.forEach((item, index) => {
      if (index < 3) {
        names.push(item['name'])
      }
    })
    if (list.length > 3) {
      return `${names.join(',')}……`
    }
    return names.join(',')
  }

  const setDailyPhrasesFn = (value: string) => {
    if (actionData.value.opinion) {
      actionData.value.opinion = actionData.value.opinion + value
    } else {
      actionData.value.opinion = value
    }
  }
</script>

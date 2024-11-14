<template>
  <el-form-item
    v-if="props.showNode"
    :label="props.nodeTitle + '：'"
    prop="presetDestination"
    :rules="{ required: true, message: $abT('page.common.required', '必填') }"
  >
    <el-select
      v-model="actionData.presetDestination"
      :placeholder="$abT('page.common.choose', '请选择')"
    >
      <el-option
        v-for="(item, index) in info.userTaskNodeMap"
        :key="index"
        :label="item.name"
        :value="item.nodeKey"
      />
    </el-select>
  </el-form-item>
  <slot name="userchoose"></slot>
  <el-form-item
    :label="props.opinionTitle + '：'"
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

  <!-- <el-form-item
    v-if="bpmData.bpmNodeConfig && bpmData.bpmNodeConfig.isCustTaskTimeLimit"
    label="下一步任务限时完成"
  >
    <abTimes v-model="actionData.extendConf.taskTimeLimit" />
  </el-form-item> -->
  <el-form-item
    v-if="props.showMsg"
    :label="$abT('bpm.office.messageType', '消息类型：')"
    prop="extendConf.msgType"
    :rules="{
      required: true,
      message: $abT('bpm.office.selectOneMsgType', '至少选择一个消息类型'),
      trigger: 'change',
    }"
  >
    <ab-msg-type v-model="actionData.extendConf.msgType" />
  </el-form-item>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue'
  import { bpmApi } from '@agilebpm/api'
  import abDailyPhrases from './ab-daily-phrases.vue'
  import { abMsgType } from '@ab-core'
  import { abT } from '@/i18n'

  const props = defineProps({
    bpmData: { required: true, type: Object as PropType<BpmData> },
    opinionTitle: {
      required: false,
      type: String,
      default: abT('bpm.office.commentsRemarks', '意见/备注'),
    },
    nodeTitle: {
      required: false,
      type: String,
      default: abT('bpm.office.nodeSelection', '节点选择'),
    },
    showNode: { required: false, type: Boolean, default: false },
    showMsg: { required: false, type: Boolean, default: false },
    showMsgConten: { required: false, type: Boolean, default: false },
  })

  const emit = defineEmits(['initNode'])

  // 需要双向绑定的值
  const { actionData } = toRefs(props.bpmData)
  const info = reactive({
    userTaskNodeMap: [] as any,
  })

  const setDailyPhrasesFn = (value: string) => {
    if (actionData.value.opinion) {
      actionData.value.opinion = actionData.value.opinion + value
    } else {
      actionData.value.opinion = value
    }
  }

  onMounted(() => {
    //请求 目标节点数据
    if (props.showNode && props.bpmData.bpmInstance) {
      bpmApi.task
        .getAllUserTaskNode(props.bpmData.bpmInstance.id)
        .then((result: any) => {
          if (result.data && result.data.length > 0) {
            info.userTaskNodeMap = result.data
            emit('initNode', result.data)
          }
        })
    }
  })
</script>

<template>
  <el-dialog
    :append-to-body="true"
    :before-close="dialogCancel"
    :model-value="props.isShow"
    :title="props.title"
    width="520px"
  >
    <el-form ref="formRef" label-position="top" :model="info.actionData">
      <el-form-item
        v-if="info.rejectInfo.allowFreeBack"
        :label="$abT('bpm.office.rejectionTransfer ', '驳回后流转方式')"
      >
        <el-select
          v-model="info.actionData.extendConf.backModel"
          :placeholder="
            $abT('bpm.office.rejectDefaultTransfer', '默认按流程设计配置')
          "
          @change="info.actionData.presetDestination = ''"
        >
          <el-option
            :label="$abT('bpm.office.rejectionFlowChart', '驳回后按流程图运行')"
            value="normal"
          />
          <el-option
            :label="
              $abT(
                'bpm.office.rejectionReturnRejectionNode',
                '驳回后返回驳回节点'
              )
            "
            value="back"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="info.rejectInfo.nodes && info.rejectInfo.nodes.length > 0"
        :label="$abT('bpm.office.rejectionSelectNode', '指定驳回节点')"
        prop="presetDestination"
        :rules="{
          required: info.rejectInfo.nodes.length > 1,
          message: $abT('page.common.required', '必填'),
        }"
      >
        <!-- 节点选择 -->
        <el-select
          v-if="info.rejectInfo.nodes.length > 1"
          v-model="info.actionData.presetDestination"
          :placeholder="
            $abT('bpm.office.rejectionSelectNodePlease', '请选择驳回节点')
          "
        >
          <el-option
            v-for="(item, index) in info.rejectInfo.nodes"
            v-show="
              info.actionData.extendConf.backModel == 'back' ||
              info.rejectInfo.path.includes(item.path)
            "
            :key="index"
            :label="item.name"
            :value="item.key"
          />
        </el-select>
        <el-tag v-else>{{ info.rejectInfo.nodes[0].name }}</el-tag>
      </el-form-item>
      <el-form-item
        v-if="info.rejectInfo.allowFreeBack"
        :label="$abT('bpm.office.rejectExecutor', '驳回后执行人')"
      >
        <el-select
          v-model="info.actionData.extendConf.backUserModel"
          :placeholder="
            $abT('bpm.office.rejectDefaultTransfer', '默认按流程设计配置')
          "
        >
          <el-option
            :label="$abT('bpm.office.rejectHistoricalProcessor', '历史处理人')"
            value="history"
          />
          <el-option
            :label="$abT('bpm.office.nodeConfigurator', '节点配置人')"
            value="normal"
          />
        </el-select>
      </el-form-item>

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
          v-model="info.actionData.opinion"
          :placeholder="$abT('bpm.office.enterDescOrRemark', '请输入意见/备注')"
          :rows="4"
          type="textarea"
        />
      </el-form-item>

      <ab-daily-phrases @set-daily-phrases="setDailyPhrasesFn" />
    </el-form>
    <template #footer>
      <el-button text type="default" @click="dialogCancel">
        {{ $abT('page.common.cancel', '取消') }}
      </el-button>
      <el-button
        :loading="info.dialogOkLoading"
        type="primary"
        @click="dialogOk"
      >
        {{ $abT('page.common.ok', '确定') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue'
  import { bpmApi } from '@agilebpm/api'
  import * as abUtil from '~/agilebpm/utils/ab-util'
  import * as abTools from '~/agilebpm/utils/ab-tools'
  import { FormInstance } from 'element-plus'
  import dialogOperate from './componets/dialog-operate-mixin'
  import abDailyPhrases from './componets/ab-daily-phrases.vue'
  const formRef = ref<FormInstance>()

  const props = defineProps({
    bpmData: { required: true, type: Object as PropType<BpmData> },
    /** 是否展示对话框 */
    isShow: { required: true, type: Boolean },
    title: { required: false, type: String, default: '意见' },
  })

  const info: any = reactive({
    actionData: {} as PropType<ActionData>,
    rejectInfo: {},
    dialogOkLoading: false,
  })

  //初始化逻辑
  onMounted(() => {
    //复制bpmData数据达到数据隔离
    info.actionData = abUtil.clone(props.bpmData).actionData
    //获取驳回页面所需数据
    bpmApi.task.getRejectInfo(props.bpmData.bpmTask?.id).then((resp: any) => {
      info.rejectInfo = resp.data
      info.actionData.extendConf.backModel = info.rejectInfo.backModel
      info.actionData.extendConf.backUserModel = info.rejectInfo.backUserModel
    })
  })

  // callback 为 对话框处理完数据后返回事件
  const emit = defineEmits(['dialogCancel', 'callback'])
  // 关闭对话框
  const dialogCancel = () => {
    emit('dialogCancel', false)
  }

  const dialogOk = () => {
    info.dialogOkLoading = true
    info.actionData.dialogCallBack = () => {
      info.dialogOkLoading = false
    }
    abTools.formValidate(formRef.value)?.then(() => {
      emit('callback', info.actionData)
    })
  }

  const setDailyPhrasesFn = (value: string) => {
    if (info.actionData.opinion) {
      info.actionData.opinion = info.actionData.opinion + value
    } else {
      info.actionData.opinion = value
    }
  }
</script>

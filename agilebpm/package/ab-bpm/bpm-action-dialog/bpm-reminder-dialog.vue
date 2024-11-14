<template>
  <el-dialog
    :append-to-body="true"
    :before-close="dialogOperate.dialogCancel"
    :model-value="props.isShow"
    :title="props.title"
    width="520px"
  >
    <el-form ref="formRef" label-position="top" :model="actionData">
      <bpm-opinion
        :bpm-data="props.bpmData"
        :opinion-title="$abT('page.common.remark', '备注')"
        :show-msg="true"
        :show-urgency-task="true"
      />
      <el-tooltip
        class="box-item"
        :content="
          $abT(
            'bpm.office.isUrgencyTask',
            '会对当前实例所有候选人推送催办消息，若选择了加急、则任务会靠前展示'
          )
        "
        effect="dark"
        placement="bottom"
      >
        <el-form-item
          :label="$abT('bpm.office.isItUrget', '是否加急')"
          prop="isUrgencyTask"
        >
          <el-radio-group
            v-model="actionData.extendConf.isUrgencyTask"
            class="ml-4"
          >
            <el-radio :label="true" size="large">
              {{ $abT('page.common.yes', '是') }}
            </el-radio>
            <el-radio :label="false" size="large">
              {{ $abT('page.common.no', '否') }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-tooltip>
    </el-form>
    <template #footer>
      <el-button text type="default" @click="dialogOperate.dialogCancel">
        {{ $abT('page.common.cancel', '取消') }}
      </el-button>
      <el-button type="primary" @click="dialogOperate.dialogOk(formRef)">
        {{ $abT('page.common.ok', '确定') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue'
  import { FormInstance } from 'element-plus'
  import BpmOpinion from './componets/bpm-opinion.vue'
  import dialogOperateMixin from './componets/dialog-operate-mixin'
  import { abT } from '@/i18n'
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

  // 需要双向绑定的值
  const { actionData } = toRefs(props.bpmData)
  //默认值
  actionData.value.opinion = abT(
    'bpm.office.reminderMsg',
    '您好，请您尽快处理任务'
  )

  actionData.value.extendConf.isUrgencyTask = false

  const dialogOperate = dialogOperateMixin(formRef, actionData.value)
</script>

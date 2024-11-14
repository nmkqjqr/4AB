<template>
  <el-dialog
    :append-to-body="true"
    :before-close="dialogOperate.dialogCancel"
    :model-value="props.isShow"
    :title="props.title"
    width="620px"
  >
    <el-space :size="10">
      <el-button type="primary" @click="copyLink()">
        {{ $abT('bpm.office.copyLink', '复制事项链接') }}
      </el-button>
    </el-space>

    <el-form
      ref="formRef"
      label-position="top"
      :model="actionData"
      style="margin-top: 10px"
    >
      <el-form-item
        :label="$abT('bpm.office.reminderContent', '催办内容：')"
        prop="opinion"
        :rules="[
          {
            max: 500,
            message: $abT('page.common.maxLength', '最大长度为{a}', { a: 500 }),
          },
        ]"
      >
        <ab-rich-editor v-model="actionData.opinion" />
      </el-form-item>
      <ab-daily-phrases @setDailyPhrases="setDailyPhrasesFn" />
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
  import { FormInstance, ElMessage } from 'element-plus'
  import abDailyPhrases from './componets/ab-daily-phrases.vue'
  import dialogOperateMixin from './componets/dialog-operate-mixin'
  import { abRichEditor } from '~/agilebpm/package/ab-core'
  import { sysApi } from '~/agilebpm/api'
  import * as abUtil from '~/agilebpm/utils/ab-util'
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
  actionData.value.opinion =
    '<p>' +
    abT(
      'bpm.office.externEventMsgTemplate',
      '您好，您有一个事项需在${expirationTime}请尽快点击链接完成事项提交',
      { a: '${expirationTime}' }
    ) +
    "<a href='${url}' rel='noopener noreferrer' target='_blank'>${url}</a></p>"

  actionData.value.extendConf.isUrgencyTask = false

  const dialogOperate = dialogOperateMixin(formRef, actionData.value)

  const setDailyPhrasesFn = (value: string) => {
    if (actionData.value.opinion) {
      actionData.value.opinion = actionData.value.opinion + value
    } else {
      actionData.value.opinion = value
    }
  }

  const copyLink = async () => {
    const res = await sysApi.tempLink.getTempLinkUrl(
      actionData.value.taskId,
      'bpmExternalEventTask'
    )
    if (res.data) {
      abUtil.handleClipboard(res.data)
    }
  }
</script>

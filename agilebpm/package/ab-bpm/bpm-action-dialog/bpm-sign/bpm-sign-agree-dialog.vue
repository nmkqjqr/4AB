<template>
  <el-dialog
    :append-to-body="true"
    :before-close="dialogCancel"
    draggable
    :model-value="props.isShow"
    :title="props.title"
    width="520px"
  >
    <el-form ref="formRef" label-position="top" :model="info.actionData">
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

      <ab-daily-phrases @setDailyPhrases="setDailyPhrasesFn" />
    </el-form>
    <template #footer>
      <el-button text type="default" @click="dialogCancel">
        {{ $abT('page.common.cancel', '取消') }}
      </el-button>
      <el-button :loading="info.loading" type="primary" @click="dialogOk">
        {{ $abT('page.common.ok', '确定') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue'
  import * as abUtil from '~/agilebpm/utils/ab-util'
  import * as abTools from '~/agilebpm/utils/ab-tools'
  import { FormInstance } from 'element-plus'
  import abDailyPhrases from '../componets/ab-daily-phrases.vue'
  import { abT } from '@/i18n'

  const formRef = ref<FormInstance>()

  const props = defineProps({
    bpmData: { required: true, type: Object as PropType<BpmData> },
    isShow: { required: true, type: Boolean },
    title: {
      required: false,
      type: String,
      default: abT('bpm.office.commentsRemarks', '意见/备注'),
    },
  })
  // callback 为 对话框处理完数据后返回事件
  const emit = defineEmits(['dialogCancel', 'callback'])

  const info: any = reactive({
    actionData: {} as PropType<ActionData>,
    loading: false,
    timer: null as any,
  })

  //复制bpmData数据达到数据隔离
  info.actionData = abUtil.clone(props.bpmData).actionData

  // 关闭对话框
  const dialogCancel = () => {
    emit('dialogCancel', false)
    info.loading = false
  }

  const dialogOk = () => {
    info.loading = true
    abTools.formValidate(formRef.value)?.then(
      (data) => {
        dialogCancel()
        emit('callback', info.actionData)
      },
      () => {
        info.loading = false
      }
    )
  }
  const setDailyPhrasesFn = (value: string) => {
    if (info.actionData.opinion) {
      info.actionData.opinion = info.actionData.opinion + value
    } else {
      info.actionData.opinion = value
    }
  }
</script>

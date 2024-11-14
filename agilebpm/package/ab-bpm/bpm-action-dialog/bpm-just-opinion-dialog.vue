<template>
  <el-dialog
    :append-to-body="true"
    :before-close="dialogOperator.dialogCancel"
    :model-value="props.isShow"
    :title="props.title"
    width="520px"
  >
    <el-form ref="formRef" label-position="top" :model="actionData">
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
          type="textarea"
        />
      </el-form-item>

      <ab-daily-phrases @setDailyPhrases="setDailyPhrasesFn" />
    </el-form>
    <template #footer>
      <el-button text type="default" @click="dialogOperator.dialogCancel">
        {{ $abT('page.common.cancel', '取消') }}
      </el-button>
      <el-button type="primary" @click="dialogOperator.dialogOk(formRef)">
        {{ $abT('page.common.ok', '确定') }}
      </el-button>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
  import { PropType } from 'vue'
  import { FormInstance } from 'element-plus'
  import dialogOperate from './componets/dialog-operate-mixin'
  import abDailyPhrases from './componets/ab-daily-phrases.vue'
  import { abT } from '@/i18n'
  const formRef = ref<FormInstance>()

  const props = defineProps({
    bpmData: { required: true, type: Object as PropType<BpmData> },
    /** 是否展示对话框 */
    isShow: { required: true, type: Boolean },
    title: {
      required: false,
      type: String,
      default: abT('bpm.office.enterDescOrRemark', '请输入意见/备注'),
    },
  })

  // 需要双向绑定的值,其他只读
  const { actionData } = toRefs(props.bpmData)
  //对话框操作
  const dialogOperator = dialogOperate(formRef, actionData.value)

  const setDailyPhrasesFn = (value: string) => {
    if (actionData.value.opinion) {
      actionData.value.opinion = actionData.value.opinion + value
    } else {
      actionData.value.opinion = value
    }
  }
</script>

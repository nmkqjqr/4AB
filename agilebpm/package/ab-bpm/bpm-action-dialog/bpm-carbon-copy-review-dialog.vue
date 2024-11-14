<template>
  <el-dialog
    :append-to-body="true"
    back-router-name="BpmMyReceiveList"
    :before-close="dialogOperator.dialogCancel"
    :model-value="props.isShow"
    :title="props.title"
    width="520px"
  >
    <el-form ref="formRef" label-position="top" :model="actionData">
      <bpm-opinion
        :bpm-data="props.bpmData"
        :opinion-title="$abT('bpm.office.reviewComments ', '审阅意见')"
      />
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
  import { ElMessage, FormInstance } from 'element-plus'
  import bpmOpinion from './componets/bpm-opinion.vue'
  import dialogOperate from './componets/dialog-operate-mixin'
  import { abT } from '@/i18n'
  const formRef = ref<FormInstance>()
  const info = reactive({
    //msgTypeList: [],
    userName: '',
    userId: '',
    userList: '',
  })

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
  //对话框操作
  const dialogOperator = dialogOperate(formRef, actionData.value)
</script>

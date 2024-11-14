<template>
  <el-dialog
    :append-to-body="true"
    :before-close="dialogOperator.dialogCancel"
    :model-value="props.isShow"
    :title="props.title"
    width="520px"
  >
    <el-form
      ref="formRef"
      label-position="top"
      label-width="100px"
      :model="actionData"
    >
      <bpm-opinion
        :bpm-data="props.bpmData"
        :opinion-title="$abT('bpm.office.commentsRemarks', '意见/备注')"
        :show-msg="true"
        :show-msg-content="true"
      >
        <template #userchoose>
          <el-form-item
            :label="$abT('bpm.office.TransferredBy', '转办人')"
            required
          >
            <user-choose v-model="userList" :is-multiple="false" />
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
  import { abT } from '@/i18n'
  const formRef = ref<FormInstance>()
  const userList = ref([])

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

  watch(
    userList,
    (newValue) => {
      if (props.bpmData.bpmTask) {
        const IdentityMapTemp = {}
        IdentityMapTemp[props.bpmData.bpmTask.nodeKey] = newValue
        actionData.value.identityMap = IdentityMapTemp
      }
    },
    { deep: true }
  )

  const dialogOk = () => {
    if (userList.value.length === 0) {
      ElMessage.error(abT('bpm.office.notEmptyTransfer', '转办人不能为空'))
      return
    }
    dialogOperator.dialogOk(formRef.value)
  }
  //对话框操作
  const dialogOperator = dialogOperate(formRef, actionData.value)
</script>

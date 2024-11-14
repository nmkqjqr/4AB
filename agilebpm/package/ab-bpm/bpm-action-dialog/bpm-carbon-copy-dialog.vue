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
        :opinion-title="$abT('page.common.remark', '备注')"
        :show-msg="true"
      >
        <template #userchoose>
          <el-form-item
            :label="$abT('bpm.office.circulator', '传阅人：')"
            required
          >
            <user-choose
              v-model="actionData.extendConf.users"
              :is-multiple="true"
            />
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
  import userChoose from './componets/user-choose.vue'
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
    title: { required: false, type: String, default: '意见' },
  })
  // 需要双向绑定的值
  const { actionData } = toRefs(props.bpmData)

  const dialogOk = () => {
    if (
      !actionData.value.extendConf.users ||
      actionData.value.extendConf.users.length === 0
    ) {
      ElMessage.error(abT('bpm.office.circulationNotEmpry', '传阅人不能为空'))
      return
    }
    dialogOperator.dialogOk(formRef.value)
  }
  const dialogOperator = dialogOperate(formRef, actionData.value)
</script>

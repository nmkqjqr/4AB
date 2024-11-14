<template>
  <el-dialog
    v-model="state.addGroupDialogVisible"
    title="新建分组"
    width="500"
    class="dialogCard"
    :close-on-click-modal="false"
  > 
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="rules"
    label-width="auto"
    class="demo-ruleForm"
    :size="formSize"
    status-icon
  >
    <el-form-item label="分组名称" prop="name">
      <el-input v-model="ruleForm.name" placeholder="请输入"/>
    </el-form-item>
    <el-form-item label="选择分组" prop="parentId">
      <el-select v-model="ruleForm.parentId" placeholder="请选择">
        <el-option v-for="(item,index) in treeData.filter(item => item.type === 'category')" :key="index" :label="item.name" :value="item.id" />
      </el-select>
    </el-form-item>
  </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'
import { postData } from '~/agilebpm/api/ab-request'
import { saveResourceUrl } from '~/agilebpm/api/modules/ab-appSquare/ab-appSquare-resource'
import { abTools } from '~/agilebpm'
const { proxy } = abTools.useCurrentInstance()
const props = defineProps({
  // eslint-disable-next-line vue/require-default-prop
  treeData: {
    type: Array,
    default: null,
  },
})

const { treeData } = toRefs(props)

const emit = defineEmits(['getMyResource'])
interface RuleForm {
  name: string,
  parentId: any
}

const formSize = ref<ComponentSize>('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  name: '分组',
  parentId: null
})

const rules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
  ]
})

const state = reactive({
  addGroupDialogVisible:false,
  params:{
    projectId:proxy.$route.params.projectId,
    type:'category',
    path:'0',
    parentId:"0"
  } as any
})

const openDialog = () => {
  state.addGroupDialogVisible = true
}

const cancel = () => {
  state.addGroupDialogVisible = false
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      state.params.name = ruleForm.name
      state.params.parentId = ruleForm.parentId ? ruleForm.parentId : "0"
      postData(saveResourceUrl,state.params)
      .then(
        ({ data }) => {
          ElMessage({
            showClose: true,
            message: '保存成功',
            type: 'success',
          })
          emit('getMyResource')
          state.addGroupDialogVisible = false
        },
        () => {}
      )
      .catch(() => {
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}

watch(
  () => state.addGroupDialogVisible,
  (newVal) => {
    if(!newVal){
      ruleFormRef.value.resetFields()
    }
  }
)

defineExpose({
  openDialog
})
</script>
<style lang="scss" scoped>

</style>

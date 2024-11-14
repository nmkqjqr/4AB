<template>
  <el-button v-if="props.showButton" type="primary" @click="showAdd">
    新增访问权限组
  </el-button>

  <el-dialog
    title="新增访问权限组"
    v-model="info.dialogVisible"
    width="60%"
    destroy-on-close
  >
    <el-card>
      <el-form
        ref="ruleFormRef"
        :model="info.data"
        :rules="rules"
        label-width="auto"
        :size="formSize"
        status-icon
      >
        <el-form-item
          label="名称"
          prop="name"
          :rules="[
            {
              required: true,
              message: $abT('page.common.required', '必填'),
            },
          ]"
        >
          <el-input
            v-model="info.data.name"
            maxlength="64"
            show-word-limit
            clearable
          />
        </el-form-item>

        <el-form-item label="描述" prop="desc">
          <el-input
            v-model="info.data.desc"
            type="textarea"
            placeholder="请输入"
            show-word-limit
            clearable
            maxlength="200"
          />
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item label="权限成员：">
          <el-space wrap>
            <grant-auth
              :auth-group="info.data"
              :save-data="false"
              :show-button="true"
            />
          </el-space>
        </el-form-item>
        <el-form-item label="资源权限：">
          <allocate-resources
            :auth-group="info.data"
            :save-data="false"
            :project-id="props.projectId"
            :init-data="false"
            :disabled="false"
          />
        </el-form-item>
      </el-form>
    </el-card>
    <template #footer>
      <el-button type="primary" @click="saveAndGrandAuth(ruleFormRef)">
        保存
      </el-button>
      <el-button @click="cancelSave">取消</el-button>
    </template>
  </el-dialog>
</template>
<script type="ts" setup>
  import { defineEmits, reactive, ref,getCurrentInstance } from "vue";
  import { saveAndGrand,getAuthResources } from '~/agilebpm/api/modules/ab-appSquare/ab-appSquare-authGroup'
  import { ElMessage } from 'element-plus'
  import { abT } from '@/i18n'
  import grantAuth from './grantAuth.vue'
  import allocateResources from './allocateResources.vue'
   import { abUtil} from '~/agilebpm'

  const props = defineProps({
    projectId: { required: true, type: String },
    showButton: { type: Boolean, default: true },
  });

  const emit = defineEmits(['saveSuccess'])

  const ruleFormRef = ref()

  const info = reactive({
    data: {
      id:null,
      name:'',
      desc:'',
      projectId:props.projectId,
      identities:[],
      resourceIds:[],
      allResources:0,
      rights:[],
    },
    resInitData:null,
    dialogVisible:false,
    saveLoading:false
  })
  const saveAndGrandAuth = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
    if (valid) {
      info.saveLoading = true
      info.data.projectId = props.projectId
     saveAndGrand(info.data)
        .then(
          ({ msg,data }) => {
            ElMessage({
              showClose: true,
              message: msg,
              type: 'success',
            })
            info.saveLoading = false
            info.dialogVisible = false
            emit('saveSuccess')
          }
        )
        .catch(() => {
          info.saveLoading = false
        })
    }
    })
  }

  const showAdd = ()=> {
    info.dialogVisible = true
  }
  const cancelSave = () => {
    info.dialogVisible = false
    info.data = {}
  }


  const show = async (authorGroup) => {
    info.saveLoading = false
    info.dialogVisible = true
    info.data =abUtil.clone(authorGroup)
    info.data.indentities = []
    info.data.resourceIds = []
    const res =  await getAuthResources(authorGroup.id,authorGroup.projectId)
    if (res.data && res.data.length > 0) {
      const items = [...res.data];
        while (items && items.length > 0) {
          const item = items.shift();
          if (item.checked) {
            info.data.resourceIds.push(item.id);
          }
          if (item.children) {
            items.push(...item.children);
          }
        }
    }
  }
  defineExpose({ show })
</script>
<style lang="scss" scoped>
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>

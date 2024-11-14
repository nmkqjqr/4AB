<template>
  <el-card>
    <template #header>
      <el-row class="card-header">
        <el-col :span="8" style="text-align: left">流程变量定义</el-col>
        <el-col :span="16" style="text-align: right">
          <el-button text @click="deletePlugin()">
            <el-icon>
              <Close />
            </el-icon>
          </el-button>
        </el-col>
      </el-row>
    </template>
    <el-table border :data="pluginData.variables" stripe style="width: 100%">
      <el-table-column label="KEY" prop="key" />
      <el-table-column label="描述" prop="desc" />
      <el-table-column label="操作" width="155">
        <template #header>
          <el-button
            :icon="Plus"
            text
            type="primary"
            @click="openEditVariableDialog"
          >
            新增
          </el-button>
        </template>
        <template #default="scoped">
          <el-space wrap>
            <el-button
              size="small"
              style="padding-right: 1px; padding-left: 1px"
              text
              type="primary"
              @click="editVariableItem(scoped.row, scoped.$index)"
            >
              编辑
            </el-button>
            <el-button
              size="small"
              text
              type="primary"
              @click="removeVariableItem(scoped.$index)"
            >
              删除
            </el-button>
          </el-space>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <el-dialog
    v-model="editVariableDialogVisible"
    title="流程变量编辑"
    width="600px"
  >
    <el-form
      ref="editVariableFormRef"
      label-position="right"
      label-width="120px"
      :model="variableItemModel"
      size="large"
    >
      <el-form-item
        label="变量描述"
        prop="desc"
        :rules="[
          { required: true, message: '请输入变量描述', trigger: 'blur' },
        ]"
      >
        <ab-pinyin
          v-model="variableItemModel.desc"
          v-model:to="variableItemModel.key"
        />
      </el-form-item>
      <el-form-item
        label="变量编码"
        prop="key"
        :rules="[
          { required: true, message: '请输入变量编码', trigger: 'blur' },
        ]"
      >
        <el-input v-model="variableItemModel.key" />
      </el-form-item>
      <el-form-item label="共享方式" prop="shareType">
        <el-select v-model="variableItemModel.shareType">
          <el-option label="不共享" value="no" />
          <el-option label="子流程可回写" value="writeBack" />
          <el-option label="子流程可共享" value="share" />
        </el-select>
      </el-form-item>
      <el-form-item label="数据类型" prop="varType">
        <el-select v-model="variableItemModel.varType">
          <el-option label="字符串" value="varchar" />
          <el-option label="日期" value="date" />
          <el-option label="数字型" value="number" />
          <el-option label="布尔" value="bool" />
        </el-select>
      </el-form-item>
      <el-form-item label="默认值" prop="defaultValue">
        <el-input v-model="variableItemModel.defaultValue" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button text @click="editVariableDialogVisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="okEditVariableDialog(editVariableFormRef)"
        >
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
  import { Close, Delete, Edit, Plus } from '@element-plus/icons-vue'
  import { defineProps, PropType, toRefs, toRef } from 'vue'
  import type { FormInstance } from 'element-plus'
  import * as abUtil from '~/agilebpm/utils/ab-util'

  const props = defineProps({
    pluginData: {
      required: true,
      type: Object as PropType<BpmVariablePluginDef>,
    },
    flowSetting: { required: true, type: Object as PropType<FlowSetting> },
  })

  const { pluginData } = toRefs(props)
  const editVariableFormRef = ref<FormInstance>()
  const editVariableDialogVisible = ref<boolean>(false)
  const variableItemModel = reactive({
    key: '',
    desc: '',
    shareType: '',
    varType: 'varchar',
    defaultValue: '',
  })
  let variableItemIndex = -1

  const deletePlugin = () => {
    ElMessageBox.confirm('确定删除此插件吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        delete props.flowSetting.plugins['bpmVariable']
      })
      .catch(() => {})
  }

  const removeVariableItem = (itemIndex: number) => {
    pluginData?.value?.variables?.splice(itemIndex, 1)
  }

  const editVariableItem = (rowData: BpmVariable, itemIndex: number) => {
    // 赋值表单
    variableItemModel.key = rowData.key
    variableItemModel.desc = rowData.desc
    variableItemModel.shareType = rowData.shareType
    variableItemModel.varType = rowData.varType
    variableItemModel.defaultValue = rowData.defaultValue || ''

    variableItemIndex = itemIndex
    editVariableDialogVisible.value = true
  }

  const openEditVariableDialog = () => {
    // 变量赋值
    variableItemModel.key = ''
    variableItemModel.desc = ''
    variableItemModel.shareType = ''
    variableItemModel.varType = 'varchar'
    variableItemModel.defaultValue = ''

    editVariableDialogVisible.value = true
    variableItemIndex = -1
  }

  const okEditVariableDialog = (formEl: FormInstance) => {
    if (!formEl) {
      return
    }
    formEl.validate((valid, fields) => {
      if (valid) {
        const editData = abUtil.clone(variableItemModel)
        if (variableItemIndex === -1) {
          pluginData?.value?.variables?.push(abUtil.clone(variableItemModel))
        } else {
          pluginData?.value?.variables?.splice(variableItemIndex, 1, editData)
        }
        editVariableDialogVisible.value = false
      }
    })
  }
</script>
<style scoped lang="scss">
  :deep(.el-card__header) {
    padding: 4px 12px !important;
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 36px;
    line-height: 36px;
  }
</style>

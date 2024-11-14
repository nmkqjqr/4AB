<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>流程指引插件</span>

        <el-button text @click="deletePlugin()">
          <el-icon>
            <Close />
          </el-icon>
        </el-button>
      </div>
    </template>
    <el-table
      border
      :data="pluginData"
      empty-text="请配置指引插件"
      stripe
      style="width: 100%"
    >
      <el-table-column label="节点">
        <template #default="scoped">
          <span v-if="!scoped.row.nodeId">所有节点</span>
          <span v-else-if="flowSetting.nodeMap[scoped.row.nodeId]">
            {{ flowSetting.nodeMap[scoped.row.nodeId]['nodeName'] }}
          </span>
          <el-tag v-else type="danger">节点已被删除</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="描述"
        min-width="120px"
        :show-overflow-tooltip="true"
      >
        <template #default="scoped">
          {{ scoped.row.desc }}
        </template>
      </el-table-column>

      <el-table-column prop="address" style="width: 135px">
        <template #header>
          <el-button :icon="Plus" text type="primary" @click="addNodeDialog">
            新增
          </el-button>
        </template>
        <template #default="scoped">
          <el-button
            size="small"
            text
            type="primary"
            @click="editNodeDialog(scoped.row, scoped.$index)"
          >
            编辑
          </el-button>
          <el-button
            size="small"
            text
            type="primary"
            @click="abUtil.Arrays.remove(scoped.row, pluginData)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="dialogVisible"
      :before-close="handleClose"
      :destroy-on-close="true"
      title="流程指引插件"
      width="50%"
    >
      <div>
        <el-form
          ref="formRef"
          label-suffix="："
          label-width="120px"
          :model="data.nodeData"
        >
          <el-form-item
            label="指引描述"
            placeholder="请输入指引描述"
            prop="desc"
            :rules="[{ required: true, message: '请输入指引描述' }]"
          >
            <el-input v-model="data.nodeData.desc" style="width: 360px" />
          </el-form-item>

          <el-form-item
            label="展示节点"
            prop="nodeId"
            :rules="[{ required: false }]"
          >
            <el-select
              v-model="data.nodeData.nodeId"
              clearable
              placeholder="所有节点均展示"
            >
              <el-option
                v-for="item in userTaskNodes"
                :key="item.nodeKey"
                :label="item.nodeName"
                :value="item.nodeKey"
              />
            </el-select>
          </el-form-item>

          <el-form-item
            label="是否自动弹出"
            prop="isAutoPopup"
            :rules="[{ required: false }]"
          >
            <el-switch
              v-model="data.nodeData.isAutoPopup"
              :active-value="true"
              :inactive-value="false"
            />
          </el-form-item>
          <el-form-item
            label="文档类型"
            prop="explainType"
            :rules="[{ required: false }]"
          >
            <el-radio-group v-model="data.nodeData.explainType" class="ml-4">
              <el-radio label="html" size="large">富文本</el-radio>
              <el-radio label="file" size="large">预览文件</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="data.nodeData.explainType == 'html'"
            label="指引内容"
            placeholder="指引内容"
            prop="htmlTemplate"
            :rules="[{ required: true, message: '请输入指引内容' }]"
          >
            <ab-rich-editor v-model="data.nodeData.htmlTemplate" />
          </el-form-item>

          <el-form-item
            v-if="data.nodeData.explainType == 'file'"
            label="指引文件"
            prop="fileJson"
          >
            <el-tooltip
              class="box-item"
              content="文件内容会作为指引内容，支持docx,pdf格式类型"
              effect="dark"
              placement="right"
            >
              <ab-upload-file
                v-model="data.nodeData.fileJson"
                dic-code="word"
                :multiple="true"
                size="small"
                type="docx,pdf"
              />
            </el-tooltip>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button text @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogOk(formRef)">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script lang="ts" setup>
  import { Delete, Edit, Plus, Close, Search } from '@element-plus/icons-vue'
  import { defineProps, PropType } from 'vue'
  import * as abUtil from '~/agilebpm/utils/ab-util'
  import { ElMessage, FormInstance } from 'element-plus'
  import { abRichEditor, abUploadFile } from '@ab-core'
  const props = defineProps({
    pluginData: { required: true, type: Array },
    nodeConfig: { required: true, type: Object as PropType<NodeConfig> },
    flowSetting: { required: true, type: Object as PropType<FlowSetting> },
  })

  const userTaskNodes = inject('userNodeList') as Array<NodeConfig>

  const { pluginData, flowSetting } = toRefs(props)
  const formRef = ref()
  const data = reactive({
    nodeData: {} as NodeExplain,
  })
  // 删除插件，此处 与 插件KEY保持一致，包括后端的插件别名
  const deletePlugin = () => {
    ElMessageBox.confirm('确定删除此插件吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        delete flowSetting.value.plugins['nodeExplain']
      })
      .catch(() => {})
  }

  //dialog
  const dialogVisible = ref(false)

  const handleClose = (done: () => void) => {
    done()
  }
  let index = -1
  const addNodeDialog = () => {
    index = -1
    dialogVisible.value = true
    data.nodeData = {
      desc: '',
      htmlTemplate: '',
      explainType: 'html',
      isAutoPopup: 'false',
    }
  }
  const editNodeDialog = (row: NodeExplain, indexNum: number) => {
    dialogVisible.value = true
    data.nodeData = abUtil.clone(row)
    index = indexNum
  }

  const saveNodeDialog = () => {
    //编辑
    const newData = abUtil.clone(data.nodeData)
    if (index != -1) {
      pluginData.value.splice(index, 1, newData)
    } else {
      //新增
      pluginData.value.push(newData)
    }
    index = -1
    dialogVisible.value = false
  }

  const dialogOk = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
      if (valid) {
        saveNodeDialog()
      } else {
        ElMessage({
          message: '请完善表单！',
          type: 'warning',
        })
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

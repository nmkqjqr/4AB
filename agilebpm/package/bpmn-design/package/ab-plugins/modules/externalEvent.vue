<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>外部事项插件</span>

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
      empty-text="请配置外部事项"
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
      v-model="pageData.dialogVisible"
      :destroy-on-close="true"
      title="外部事项配置"
      width="50%"
    >
      <div>
        <el-form
          ref="formRef"
          label-position="top"
          label-suffix="："
          label-width="120px"
          :model="pageData.nodeData"
        >
          <el-form-item
            label="推送节点"
            prop="nodeId"
            :rules="[{ required: true, message: '请选择节点' }]"
          >
            <el-select
              v-model="pageData.nodeData.nodeId"
              clearable
              placeholder="请选择节点"
            >
              <el-option
                v-for="item in userTaskNodes"
                :key="item.nodeKey"
                :label="item.nodeName"
                :value="item.nodeKey"
              />
            </el-select>
          </el-form-item>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-card :body-style="{ padding: '10px' }" shadow="always">
                <el-form-item label="手机号取值" prop="phoneInfo.value">
                  <bo-variable-select-tree
                    v-model="pageData.nodeData.phoneInfo"
                    data-type="all"
                    :default-expand-all="false"
                    placeholder="请选择"
                    style="margin-left: 10px"
                  />
                </el-form-item>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card :body-style="{ padding: '10px' }" shadow="always">
                <el-form-item label="邮箱取值" prop="emailInfo.value">
                  <bo-variable-select-tree
                    v-model="pageData.nodeData.emailInfo"
                    data-type="all"
                    :default-expand-all="false"
                    placeholder="请选择"
                    style="margin-left: 10px"
                  />
                </el-form-item>
              </el-card>
            </el-col>
          </el-row>
          <el-form-item
            label="描述"
            placeholder="请输入描述"
            prop="desc"
            :rules="[{ required: true, message: '请输入描述' }]"
            style="margin-top: 20px"
          >
            <el-input
              v-model="pageData.nodeData.desc"
              :rows="3"
              type="textarea"
            />
          </el-form-item>
          <el-form-item
            label="外部事项通知内容"
            placeholder="请输入通知内容"
            prop="msgContent"
            :rules="[{ required: true, message: '请输入通知内容' }]"
          >
            <div>
              <div>
                <bo-variable-select-tree
                  v-model="pageData.msgContentParams"
                  data-type="all"
                  :default-expand-all="false"
                  placeholder="请选择模板参数"
                  style="margin-bottom: 10px"
                />
              </div>
              <div>
                <ab-rich-editor v-model="pageData.nodeData.msgContent" />
              </div>
            </div>
          </el-form-item>
          <el-row :gutter="2">
            <el-col :span="10">
              <el-form-item
                label="最大访问次数"
                placeholder="请输入最大访问次数"
                prop="maxVisits"
                :rules="[{ required: true, message: '请输入最大访问次数' }]"
              >
                <el-input-number
                  v-model="pageData.nodeData.maxVisits"
                  :min="1"
                  style="width: 250px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item
                label="有效时长(天)"
                :min="1"
                placeholder="请输入有效时长"
                prop="validDuration"
                :rules="[{ required: true, message: '请输入有效时长' }]"
              >
                <el-input-number
                  v-model="pageData.nodeData.validDuration"
                  :min="1"
                  style="width: 250px"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button text @click="handleClose()">取消</el-button>
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
  import boVariableSelectTree from '~/agilebpm/package/ab-common-resource/bpmDesign/boVariableSelectTree.vue'
  import { abRichEditor } from '~/agilebpm/package/ab-core'
  const props = defineProps({
    pluginData: { required: true, type: Array },
    nodeConfig: { required: true, type: Object as PropType<NodeConfig> },
    flowSetting: { required: true, type: Object as PropType<FlowSetting> },
  })

  const userTaskNodes = inject('userNodeList') as Array<NodeConfig>
  const { pluginData, flowSetting } = toRefs(props)
  const formRef = ref()
  const pageData = reactive({
    dialogVisible: false,
    nodeData: {} as ExternalEvent,
    variableScope: [] as any[],
    msgContentParams: {} as BoTreeModelType,
  })
  // 删除插件，此处 与 插件KEY保持一致，包括后端的插件别名
  const deletePlugin = () => {
    ElMessageBox.confirm('确定删除此插件吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        delete flowSetting.value.plugins['externalEvent']
      })
      .catch(() => {})
  }

  const handleClose = () => {
    pageData.dialogVisible = false
  }
  let index = -1
  const addNodeDialog = () => {
    index = -1
    pageData.dialogVisible = true
    pageData.nodeData = {
      maxVisits: 10,
      validDuration: 10,
      phoneInfo: {},
      emailInfo: {},
      params: {},
      msgContent:
        '<p>您好，有一个事项需要您尽快处理，请点击链接提交事项<a href="${url}" rel="noopener noreferrer" target="_blank">${url}</a></p>',
    }
  }
  const editNodeDialog = (row: ExternalEvent, indexNum: number) => {
    pageData.dialogVisible = true
    pageData.nodeData = abUtil.clone(row)
    index = indexNum
  }

  const saveNodeDialog = () => {
    //编辑
    const newData = abUtil.clone(pageData.nodeData)
    if (index != -1) {
      pluginData.value.splice(index, 1, newData)
    } else {
      //新增
      pluginData.value.push(newData)
    }
    index = -1
    pageData.dialogVisible = false
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

  watch(
    () => pageData.msgContentParams,
    (value: BoTreeModelType) => {
      if (value && value.value) {
        pageData.nodeData.msgContent = `${pageData.nodeData.msgContent}\${${value.value}}`
        pageData.nodeData.params[`\${${value.value}}`] = value
      }
      //pageData.msgContentParams = {}
    },
    { deep: true }
  )
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

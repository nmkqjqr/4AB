<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>流程抄送配置</span>

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
      empty-text="请配置抄送设置"
      stripe
      style="width: 100%"
    >
      <el-table-column label="节点" min-width="120">
        <template #default="scoped">
          <span v-if="!scoped.row.nodeId">所有节点</span>
          <span v-else-if="flowSetting.nodeMap[scoped.row.nodeId]">
            {{ flowSetting.nodeMap[scoped.row.nodeId]['nodeName'] }}
          </span>
          <el-tag v-else type="danger">节点已被删除</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="描述" :show-overflow-tooltip="true">
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
            style="padding-right: 1px; padding-left: 1px"
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
            @click="delNodeDialog(scoped.$index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="dialogVisible"
      :before-close="handleClose"
      height="580px"
      title="流程抄送配置"
      width="50%"
    >
      <div
        :style="{
          overflow: 'auto',
        }"
      >
        <el-form
          ref="formRef"
          label-suffix="："
          label-width="120px"
          :model="data.nodeData"
        >
          <el-form-item
            label="抄送描述"
            placeholder="请输入抄送描述"
            prop="desc"
            :rules="[{ required: true, message: '请输入消息描述' }]"
          >
            <el-input v-model="data.nodeData.desc" />
          </el-form-item>

          <el-form-item
            label="抄送任务节点"
            prop="nodeId"
            :rules="[{ required: true, message: '请选择抄送任务节点' }]"
          >
            <el-select v-model="data.nodeData.nodeId" placeholder="请选择节点">
              <el-option
                v-for="item in carbonUserTask"
                :key="item.nodeKey"
                :label="item.nodeName"
                :value="item.nodeKey"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="抄送表单" placeholder="" prop="reminderCycle">
            <div style="margin-left: 0">
              <el-radio-group v-model="data.nodeData.formType" size="small">
                <el-radio-button label="instance">全局实例表单</el-radio-button>
                <el-radio-button label="task">任务节点表单</el-radio-button>
              </el-radio-group>
            </div>
          </el-form-item>

          <el-form-item
            label="抄送人"
            placeholder=""
            prop="userRules"
            :rules="[{ required: true, message: '' }]"
          >
            <node-user v-model="data.nodeData.userRules" />
          </el-form-item>
          <el-form-item
            label="抄送消息类型"
            placeholder=""
            prop="msgType"
            :rules="[{ required: true, message: '请选择消息类型' }]"
          >
            <ab-msg-type v-model="data.nodeData.msgType" />
          </el-form-item>
          <el-form-item
            label="选择消息模板"
            placeholder=""
            prop="templateCode"
            :rules="[{ required: true, message: '请选择消息模板' }]"
          >
            <msg-template v-model="data.nodeData.templateCode" />
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
  import { Plus, Close } from '@element-plus/icons-vue'
  import { defineProps, PropType } from 'vue'
  import * as abUtil from '~/agilebpm/utils/ab-util'
  import { ElMessage, FormInstance } from 'element-plus'
  import { abMsgType } from '@ab-core'
  import nodeUser from '../../ab-setting/node-setting/node-user/nodeUser.vue'
  import msgTemplate from '~/agilebpm/package/ab-common-resource/bpmDesign/msgTemplate.vue'

  const props = defineProps({
    pluginData: {
      required: true,
      type: Array as PropType<Array<CarbonCopy>>,
    },
    nodeConfig: { required: true, type: Object as PropType<NodeConfig> },
    flowSetting: { required: true, type: Object as PropType<FlowSetting> },
  })
  //处理节点数据
  const carbonUserTask = [] as Array<NodeConfig>
  for (const i in props.flowSetting.nodeMap) {
    if (i.indexOf('StartEvent') == -1) {
      carbonUserTask.push(props.flowSetting.nodeMap[i])
    }
  }
  const { pluginData, flowSetting } = toRefs(props)
  const formRef = ref()

  //本页面dialog使用数据
  const data = reactive({
    nodeData: {} as CarbonCopy,
  })

  //列表删除方法
  const deletePlugin = () => {
    ElMessageBox.confirm('确定删除此插件吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        delete flowSetting.value.plugins['carbonCopy']
      })
      .catch(() => {})
  }

  //dialog
  const dialogVisible = ref(false)

  const handleClose = (done: () => void) => {
    done()
  }
  //初始化添加数据
  let index = -1
  const addNodeDialog = () => {
    index = -1
    dialogVisible.value = true
    data.nodeData = {
      nodeId: '',
      desc: '',
      formType: 'instance',
      event: '',
      userRules: [],
      msgType: 'email,inner',
      templateCode: 'copy_template',
    }
  }

  const editNodeDialog = (row: CarbonCopy, indexNum: number) => {
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

  const delNodeDialog = (index: number) => {
    pluginData.value.splice(index, 1)
  }

  const dialogOk = async (formEl: FormInstance | undefined) => {
    if (data.nodeData.userRules.length == 0) {
      ElMessage({
        message: '请选择抄送人！',
        type: 'warning',
      })
      return
    }
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
  .dialog-height {
    height: 300px;
    overflow: auto;
  }
</style>

<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>节点通知消息</span>

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
      empty-text="请配置节点通知消息"
      stripe
      style="width: 100%"
    >
      <el-table-column label="描述" :show-overflow-tooltip="true">
        <template #default="scoped">
          {{ scoped.row.desc }}
        </template>
      </el-table-column>
      <el-table-column label="节点" width="100">
        <template #default="scoped">
          {{
            (userTaskNodes[scoped.row.nodeId] &&
              userTaskNodes[scoped.row.nodeId]['nodeName']) ||
            scoped.row.nodeId ||
            '所有节点'
          }}
        </template>
      </el-table-column>
      <el-table-column label="时机">
        <template #default="scoped">
          <el-tag>{{ eventDataMap[scoped.row.event] }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="address" width="155">
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
      :destroy-on-close="true"
      title="流程节点消息配置"
      width="788px"
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
            label="消息描述"
            placeholder="请输入消息描述"
            prop="desc"
            :rules="[{ required: true, message: '请输入消息描述' }]"
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
              @change="nodeIdChange"
            >
              <el-option
                v-for="item in userTaskNodes"
                :key="item?.nodeKey"
                :label="item?.nodeName"
                :value="item?.nodeKey"
              />
            </el-select>
          </el-form-item>

          <el-form-item
            label="执行时机"
            prop="event"
            :rules="[{ required: true, message: '请选择执行时机' }]"
          >
            <el-select
              v-model="data.nodeData.event"
              clearable
              :disabled="data.eventIsDis"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, key) in eventDataMap"
                :key="key"
                :disabled="
                  key == 'PROCESS_STARTED' || key == 'PROCESS_COMPLETED'
                "
                :label="item"
                :value="key"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="通知人" placeholder="" prop="userRules">
            <node-user v-model="data.nodeData.userRules" />
            <span v-if="data.nodeData.userRules.length == 0">
              当前节点候选人
            </span>
          </el-form-item>
          <el-form-item
            label="消息类型"
            placeholder=""
            prop="msgType"
            :rules="[{ required: true, message: '请选择消息类型' }]"
          >
            <ab-msg-type v-model="data.nodeData.msgType" />
          </el-form-item>
          <el-form-item label="邮箱附件取值" prop="emailFile.value" v-if="data.nodeData.msgType.indexOf('email')!=-1"  >
            <bo-variable-select-tree
              v-model="data.nodeData.emailFile"
              data-type="all"
              :default-expand-all="false"
              placeholder="请选择"
            />
          </el-form-item>

          <el-form-item
            label="选择消息模板"
            placeholder=""
            prop="templateCode"
            :rules="[{ required: true, message: '请选择消息模板' }]"
          >
            <msg-template v-model="data.nodeData.templateCode" />
          </el-form-item>

          <div class="demo-collapse" style="width: 700px; margin-left: 12px">
            <el-collapse v-model="activeNames">
              <el-collapse-item name="1" title="消息发送的前置条件配置">
                <div>
                  <div style="margin-bottom: 5px; overflow: hidden">
                    <script-variable-select v-model="data.nodeData.condition" />
                  </div>
                  <codemirror
                    v-model="data.nodeData.condition"
                    :autofocus="true"
                    :indent-with-tab="true"
                    placeholder=""
                    :style="{
                      height: `90px`,
                      border: `1px solid #e4e7ed`,
                      width: `100%`,
                    }"
                  />
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button text @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogOk">保存</el-button>
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
import { Codemirror } from 'vue-codemirror'
import { abMsgType } from '@ab-core'
import nodeUser from '../../ab-setting/node-setting/node-user/nodeUser.vue'
import msgTemplate from '~/agilebpm/package/ab-common-resource/bpmDesign/msgTemplate.vue'
import scriptVariableSelect from '~/agilebpm/package/ab-common-resource/bpmDesign/conditionScript/scriptVariableSelect.vue'

import boVariableSelectTree from '~/agilebpm/package/ab-common-resource/bpmDesign/boVariableSelectTree.vue'

const props = defineProps({
  pluginData: { required: true, type: Array as PropType<Array<NodeMessage>> },
  nodeConfig: { required: true, type: Object as PropType<NodeConfig> },
  flowSetting: { required: true, type: Object as PropType<FlowSetting> },
})
const eventDataMap = {
  TASK_CREATED: '任务创建时',
  TASK_COMPLETED: '任务完成时',
  PROCESS_STARTED: '流程启动时',
  PROCESS_COMPLETED: '流程结束时',
}
const userTaskNodes = abUtil.clone(props.flowSetting.nodeMap)

const activeNames = ref([''])
const { pluginData, flowSetting } = toRefs(props)
const formRef = ref()
const data = reactive({
  nodeData: {} as NodeMessage,
  eventIsDis: false,
})
const nodeIdChange = (val: any) => {
  data.eventIsDis = false
  if (val.toLowerCase().indexOf('startevent') != -1) {
    data.eventIsDis = true
    data.nodeData.event = 'PROCESS_STARTED'
  } else if (val.toLowerCase().indexOf('endevent') != -1) {
    data.eventIsDis = true
    data.nodeData.event = 'PROCESS_COMPLETED'
  } else {
    data.nodeData.event = ''
  }
  console.log(val)
}

const deletePlugin = () => {
  ElMessageBox.confirm('确定删除此插件吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      delete flowSetting.value.plugins['nodeMessage']
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
    event: '',
    condition: '',
    userRules: [],
    msgType: 'email,inner,dingding',
    templateCode: 'node_message_template',
    emailFile:{},
  }
}
const editNodeDialog = (row: NodeMessage, indexNum: number) => {
  dialogVisible.value = true
  data.nodeData = abUtil.clone(row)
  //兼容老数据
  if(data.nodeData.emailFile == undefined){
    data.nodeData.emailFile = {}
  }
  index = indexNum
}

const saveNodeDialog = () => {
  //编辑
  const newData = abUtil.clone(data.nodeData)
  console.log(newData)
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

// 条件脚本赋值
const chooseresCondition = (list: any) => {
  if (list) {
    data.nodeData.condition = list[0].script_
  }
}

const dialogOk = async () => {
  if (!formRef) return

  await formRef.value.validate((valid: any) => {
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

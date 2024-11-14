<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>流程催办设置</span>

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
      empty-text="请配置催办设置"
      stripe
      style="width: 100%"
    >
      <el-table-column label="催办节点" min-width="120">
        <template #default="scoped">
          <span v-if="!scoped.row.nodeId">所有节点</span>
          <span v-else-if="flowSetting.nodeMap[scoped.row.nodeId]">
            {{ flowSetting.nodeMap[scoped.row.nodeId]['nodeName'] }}
          </span>
          <el-tag v-else type="danger">节点已被删除</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="催办描述" :show-overflow-tooltip="true">
        <template #default="scoped">
          {{ scoped.row.desc }}
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
      title="任务催办配置"
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
          <el-tabs v-model="data.activeName" class="demo-tabs">
            <el-tab-pane label="基础配置" name="baseConfig">
              <el-form-item
                label="催办描述"
                placeholder="请输入催办描述"
                prop="desc"
                :rules="[{ required: true, message: '请输入催办描述' }]"
              >
                <el-input
                  v-model="data.nodeData.desc"
                  placeholder="请输入催办描述"
                  style="width: 360px"
                />
              </el-form-item>

              <el-form-item
                label="催办任务节点"
                prop="nodeId"
                :rules="[{ required: false }]"
              >
                <el-select
                  v-model="data.nodeData.nodeId"
                  clearable
                  placeholder="所有节点均展示催办"
                >
                  <el-option
                    v-for="item in reminderUserTaskNodes"
                    :key="item.nodeKey"
                    :label="item.nodeName"
                    :value="item.nodeKey"
                  />
                </el-select>
                <el-tooltip
                  class="box-item"
                  content="若不选择默认该流程所有节点任务均执行该催办"
                  effect="dark"
                  placement="right"
                >
                  <el-icon size="14" style="margin-left: 3px">
                    <InfoFilled />
                  </el-icon>
                </el-tooltip>
              </el-form-item>
              <!-- 催办类型-->
              <el-form-item
                label="催办类型"
                prop="reminderType"
                :rules="[{ required: false }]"
              >
                <el-radio-group
                  v-model="data.nodeData.reminderType"
                  class="ml-4"
                >
                  <el-radio-button label="msg" size="large">
                    消息提醒
                  </el-radio-button>
                  <el-radio-button label="flowOperate" size="large">
                    流程操作
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>

              <el-form-item
                v-if="data.nodeData.reminderType === 'msg'"
                label="督办人"
                prop="supervisor"
                :rules="[{ required: false }]"
              >
                <node-user v-model="data.nodeData.supervisor" />
                <span v-if="data.nodeData.supervisor.length == 0">
                  当前节点候选人
                </span>
              </el-form-item>
              <el-form-item
                v-if="data.nodeData.reminderType === 'flowOperate'"
                label="流程操作"
                prop="flowOperate"
                :rules="[{ required: false }]"
              >
                <el-radio-group
                  v-model="data.nodeData.flowOperate"
                  size="large"
                >
                  <el-radio label="turn">转办</el-radio>
                  <el-radio label="skip">跳过当前任务</el-radio>
                  <el-radio label="end">流程终止</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                v-if="
                  data.nodeData.reminderType === 'flowOperate' &&
                  data.nodeData.flowOperate === 'turn'
                "
                label="转办人"
              >
                <node-user v-model="data.nodeData.receiver" />
              </el-form-item>
              <el-form-item
                v-if="
                  data.nodeData.reminderType === 'msg' ||
                  data.nodeData.flowOperate === 'turn'
                "
                label="消息类型"
                placeholder=""
                prop="msgType"
                :rules="[{ required: true, message: '请选择消息类型' }]"
              >
                <ab-msg-type v-model="data.nodeData.msgType" />
              </el-form-item>

              <!--到期策略-->
              <el-form-item label="到期时间策略">
                <el-select
                  v-model="data.nodeData.dueTimeStrategy"
                  placeholder="请选择到期时间策略"
                  prop="dueTimeStrategy"
                >
                  <el-option
                    v-for="(item, indexT) in dueTimeStrategyOptions"
                    :key="indexT"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>

              <el-form-item
                v-if="
                  data.nodeData.dueTimeStrategy &&
                  data.nodeData.dueTimeStrategy !== 'createTime'
                "
                label="指定字段"
                prop="dueTimeField"
                :rules="[{ required: true, message: '请选择字段' }]"
              >
                <bo-variable-select-tree
                  v-model="data.nodeData.dueTimeField"
                  :column-type="['date']"
                  data-type="all"
                  :default-expand-all="false"
                  placeholder="请选择字段"
                />
                <el-tooltip
                  class="box-item"
                  content="若选择的字段值为空，催办插件执行时会报错"
                  effect="dark"
                  placement="right"
                >
                  <el-icon size="14" style="margin-left: 3px">
                    <InfoFilled />
                  </el-icon>
                </el-tooltip>
              </el-form-item>

              <el-form-item
                v-if="
                  data.nodeData.dueTimeStrategy &&
                  ['createTime', 'fieldBefore', 'fieldAfter'].includes(
                    data.nodeData.dueTimeStrategy
                  )
                "
                label="指定限时"
                placeholder=""
                prop="timeLimit"
                :rules="data.rules.timeLimit"
                width="100%"
              >
                <abTimes v-model="data.nodeData.timeLimit" />
              </el-form-item>

              <el-form-item
                v-if="data.nodeData.reminderType === 'msg'"
                label="催办次数"
                placeholder=""
                prop="maxReminderTimes"
              >
                <el-input-number
                  v-model="data.nodeData.maxReminderTimes"
                  :max="200"
                  :min="1"
                  width="160px"
                />
                <el-tooltip
                  class="box-item"
                  content="催办几次后不再进行催办"
                  effect="dark"
                  placement="right"
                >
                  <el-icon size="14" style="margin-left: 3px">
                    <InfoFilled />
                  </el-icon>
                </el-tooltip>
              </el-form-item>
              <el-form-item
                v-if="
                  data.nodeData.maxReminderTimes > 1 &&
                  data.nodeData.reminderType === 'msg'
                "
                label="催办周期"
                placeholder=""
                prop="reminderCycle"
              >
                <abTimes v-model="data.nodeData.reminderCycle" />
                <el-tooltip
                  class="box-item"
                  content="间隔多久进行下一次催办"
                  effect="dark"
                  placement="right"
                >
                  <el-icon size="14" style="margin-left: 3px">
                    <InfoFilled />
                  </el-icon>
                </el-tooltip>
              </el-form-item>
              <el-form-item
                label="催办属性"
                placeholder=""
                prop="reminderCycle"
              >
                <div>
                  <el-radio-group
                    v-model="data.nodeData.isCalcWorkDay"
                    size="small"
                  >
                    <el-radio-button label="true">
                      仅工作日计时催办
                    </el-radio-button>
                    <el-radio-button label="false">
                      所有时间均催办
                    </el-radio-button>
                  </el-radio-group>
                </div>

                <div style="margin-left: 50px">
                  <el-radio-group v-model="data.nodeData.isUrgent" size="small">
                    <el-radio-button label="true">
                      催办同时加急任务
                    </el-radio-button>
                    <el-radio-button label="false">
                      催办但不加急任务
                    </el-radio-button>
                  </el-radio-group>
                </div>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="高级配置" name="seniorConfig">
              <div
                style="margin-bottom: 5px; margin-left: 120px; overflow: hidden"
              >
                <script-variable-select
                  v-model="data.nodeData.conditionScript"
                />

                <el-tooltip
                  class="box-item"
                  content="催办条件脚本, return false 则跳过该催办操作"
                  effect="dark"
                  placement="right"
                >
                  <el-icon size="14" style="margin-left: 3px">
                    <InfoFilled />
                  </el-icon>
                </el-tooltip>
              </div>

              <el-form-item
                label="催办条件脚本"
                placeholder=""
                prop="conditionScript"
              >
                <codemirror
                  v-model="data.nodeData.conditionScript"
                  :autofocus="true"
                  :indent-with-tab="true"
                  placeholder=""
                  :style="{
                    height: `90px`,
                    border: `1px solid #e4e7ed`,
                    width: `100%`,
                  }"
                />
              </el-form-item>

              <div
                style="margin-bottom: 5px; margin-left: 120px; overflow: hidden"
              >
                <script-variable-select v-model="data.nodeData.beforeScript" />

                <el-tooltip class="box-item" effect="dark" placement="right">
                  <template #content>
                    催办执行前置脚本，return false
                    <br />
                    则取消本次催办（下一周期还会继续催办）
                    <br />
                    也可以调用流程终止接口，任务完成接口
                    <br />
                    可以使用到催办次数变量 reminderTimes
                  </template>
                  <el-icon size="14" style="margin-top: 5px; margin-left: 3px">
                    <InfoFilled />
                  </el-icon>
                </el-tooltip>
              </div>

              <el-form-item
                label="催办前置条件"
                placeholder=""
                prop="beforeScript"
              >
                <codemirror
                  v-model="data.nodeData.beforeScript"
                  :autofocus="true"
                  :indent-with-tab="true"
                  placeholder=""
                  :style="{
                    height: `90px`,
                    border: `1px solid #e4e7ed`,
                    width: `100%`,
                  }"
                />
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
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
  import {
    Delete,
    Edit,
    Plus,
    Close,
    Search,
    InfoFilled,
  } from '@element-plus/icons-vue'
  import { defineProps, PropType } from 'vue'
  import * as abUtil from '~/agilebpm/utils/ab-util'
  import { ElMessage, FormInstance } from 'element-plus'
  import { Codemirror } from 'vue-codemirror'
  import { abTimes, abMsgType } from '@ab-core'
  import msgTemplate from '~/agilebpm/package/ab-common-resource/bpmDesign/msgTemplate.vue'
  import boVariableSelectTree from '~/agilebpm/package/ab-common-resource/bpmDesign/boVariableSelectTree.vue'
  import scriptVariableSelect from '~/agilebpm/package/ab-common-resource/bpmDesign/conditionScript/scriptVariableSelect.vue'
  import nodeUser from '../../ab-setting/node-setting/node-user/nodeUser.vue'

  const props = defineProps({
    pluginData: { required: true, type: Object },
    nodeConfig: { required: true, type: Object as PropType<NodeConfig> },
    flowSetting: { required: true, type: Object as PropType<FlowSetting> },
  })
  //处理可展示节点
  const userTaskNodes = inject('userNodeList') as Array<NodeConfig>
  const reminderUserTaskNodes = abUtil.clone(userTaskNodes.value)
  reminderUserTaskNodes.forEach((item: any, index: any) => {
    if (item.nodeKey.indexOf('StartEvent') != -1) {
      reminderUserTaskNodes.splice(index, 1)
    }
  })

  const { pluginData, flowSetting } = toRefs(props)

  const formRef = ref()

  const data = reactive({
    nodeData: {} as ReminderPlugin,
    activeName: 'baseConfig',
    rules: {
      timeLimit: [
        { required: true, message: '请输入内容', trigger: 'blur' },
        { pattern: /^\+?[1-9]\d*$/, message: '请配置催办时间' },
      ],
    },
  })

  //删除插件
  const deletePlugin = () => {
    ElMessageBox.confirm('确定删除此插件吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        delete flowSetting.value.plugins['reminder']
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
      conditionScript: '',
      timeLimit: 4320,
      maxReminderTimes: 0,
      reminderCycle: 0,
      beforeScript: '',
      msgType: 'email,inner',
      templateCode: 'reminder_template',
      isCalcWorkDay: true,
      isUrgent: true,
      dueTimeStrategy: 'createTime',
      dueTimeField: {},
      //催办类型：消息提醒 、任务转办、流程终止
      reminderType: 'msg',
      //督办人
      supervisor: [],
      //转办人
      receiver: [],
      //流程操作
      flowOperate: '',
    }
  }
  const editNodeDialog = (row: ReminderPlugin, indexNum: number) => {
    dialogVisible.value = true
    data.nodeData = abUtil.clone(row)
    //兼容老数据，到期时间给个默认值
    if (!data.nodeData.dueTimeStrategy) {
      data.nodeData.dueTimeStrategy = 'createTime'
    }
    //兼容老数据，formField默认值
    if (!data.nodeData.dueTimeField) {
      data.nodeData.dueTimeField = {}
    }
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
    data.nodeData = {} as ReminderPlugin
  }

  const delNodeDialog = (index: number) => {
    pluginData.value.splice(index, 1)
  }

  const changeButtonData = (type: number) => {
    if (type == 1) {
      data.nodeData.isCalcWorkDay = !data.nodeData.isCalcWorkDay
    }
    if (type == 2) {
      data.nodeData.isUrgent = !data.nodeData.isUrgent
    }
  }

  // 条件脚本赋值
  const chooseresCondition = (list: any) => {
    if (list) {
      data.nodeData.conditionScript = list[0].script_
    }
  }
  const chooseresBeforeScript = (list: any) => {
    if (list) {
      data.nodeData.beforeScript = list[0].script_
    }
  }

  const dialogOk = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
      if (valid) {
        if (
          data.nodeData.dueTimeStrategy !== 'createTime' &&
          !data.nodeData.dueTimeField.value
        ) {
          ElMessage({
            message: '请配置指定字段！',
            type: 'warning',
          })
          return
        }
        saveNodeDialog()
      } else {
        ElMessage({
          message: '请完善表单！',
          type: 'warning',
        })
      }
    })
  }

  const dueTimeStrategyOptions = [
    { value: 'createTime', label: '任务创建之后' },
    { value: 'field', label: '指定字段' },
    { value: 'fieldBefore', label: '指定字段之前' },
    { value: 'fieldAfter', label: '指定字段之后' },
  ]
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

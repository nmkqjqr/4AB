<template>
  <el-dialog
    v-model="info.dialogVisible"
    :append-to-body="true"
    :close-on-click-modal="false"
    :title="props.title"
    :width="props.width"
  >
    <el-tabs v-model="info.eventConfig.model" tab-position="top">
      <!-- 远程HTTP调用 -->
      <el-tab-pane label="远程HTTP调用" name="http">
        <el-card shadow="never">
          <template #header>
            <span>HTTP调用</span>
          </template>
          <el-row
            v-for="(http, index) in info.eventConfig.httpArr"
            :key="http.id"
            :gutter="10"
          >
            <el-col :span="12">
              <el-input v-model="http.url" placeholder="接口地址" />
            </el-col>
            <el-col :span="12">
              <el-checkbox
                v-model="http.isAsync"
                border
                label="异步调用"
                style="margin-right: 10px"
              />
              <div class="el-checkbox">
                <el-button
                  v-if="index === 0"
                  @click="addHttpConfig(info.eventConfig.httpArr)"
                >
                  <el-icon>
                    <Plus />
                  </el-icon>
                </el-button>
                <el-button
                  v-else
                  @click="removeHttpConfig(info.eventConfig.httpArr, index)"
                >
                  <el-icon>
                    <Delete />
                  </el-icon>
                </el-button>
              </div>
            </el-col>
          </el-row>
          <div class="tip-block">
            <strong>TIP</strong>
            <p>1. URL支持变量取值，详细参考文档。</p>
            <p>2. 同步支持反馈执行结果，以及设置流程变量等，请参考脚本插件</p>
            <p>3. 异步不支持反馈状态，基于事务消息实现</p>
          </div>
        </el-card>
        <!-- 传输变量选择 -->
        <el-card shadow="never">
          <template #header>
            <span>传输变量选择</span>
          </template>
          <div>
            <el-checkbox-group v-model="info.eventConfig.passData">
              <el-checkbox
                v-for="passDataDef in passDataDefs"
                :key="passDataDef.value"
                :label="passDataDef.value"
                name="passData"
                size="large"
              >
                {{ passDataDef.label }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </el-card>
        <!-- 执行时机 -->
        <el-card v-if="eventDisplay" shadow="never">
          <template #header>
            <span>指定执行时机</span>
          </template>
          <div>
            <el-checkbox-group v-model="info.eventConfig.eventKeys">
              <el-checkbox
                v-for="eventDef in eventDefs"
                :key="eventDef.value"
                :label="eventDef.value"
                size="large"
              >
                {{ eventDef.label }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </el-card>
      </el-tab-pane>
      <!-- 事务消息 -->
      <el-tab-pane label="事务消息" name="trxMessage">
        <el-card shadow="never">
          <template #header>
            <span>事务消息KEY</span>
          </template>
          <el-input
            v-model="info.eventConfig.trxMessageSubscribeKey"
            placeholder="SubscribeKey"
          />
        </el-card>
        <el-card shadow="never">
          <template #header>
            <span>传输变量选择</span>
          </template>
          <div>
            <el-checkbox-group v-model="info.eventConfig.passData">
              <el-checkbox
                v-for="passDataDef in passDataDefs"
                :key="passDataDef.value"
                :label="passDataDef.value"
                name="passData"
                size="large"
              >
                {{ passDataDef.label }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </el-card>
        <el-card v-if="eventDisplay" shadow="never">
          <template #header>
            <span>指定执行时机</span>
          </template>
          <div>
            <el-checkbox-group v-model="info.eventConfig.eventKeys">
              <el-checkbox
                v-for="eventDef in eventDefs"
                :key="eventDef.value"
                :label="eventDef.value"
                size="large"
              >
                {{ eventDef.label }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </el-card>
      </el-tab-pane>
      <!-- ServiceBean -->
      <el-tab-pane label="ServiceBean" name="serviceBean">
        <el-card shadow="never">
          <template #header>
            <span>ServiceBean调用</span>
          </template>
          <el-input
            v-model="info.eventConfig.serviceBean"
            placeholder="ServiceBean"
          />
        </el-card>
        <el-card shadow="never">
          <template #header>
            <span>传输变量选择</span>
          </template>
          <div>
            <el-checkbox-group v-model="info.eventConfig.passData">
              <el-checkbox
                v-for="passDataDef in passDataDefs"
                :key="passDataDef.value"
                :label="passDataDef.value"
                name="passData"
                size="large"
              >
                {{ passDataDef.label }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </el-card>
        <el-card v-if="eventDisplay" shadow="never">
          <template #header>
            <span>指定执行时机</span>
          </template>
          <div>
            <el-checkbox-group v-model="info.eventConfig.eventKeys">
              <el-checkbox
                v-for="eventDef in eventDefs"
                :key="eventDef.value"
                :label="eventDef.value"
                size="large"
              >
                {{ eventDef.label }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </el-card>
      </el-tab-pane>
      <!-- Groovy 脚本 -->
      <el-tab-pane label="Groovy脚本" name="script">
        <el-card shadow="never">
          <template #header>
            <span>Groovy脚本</span>
          </template>
          <script-dialog v-model="info.eventConfig.script" />
          <el-divider border-style="dashed" />
          <div>
            <p>
              <strong>脚本描述：</strong>
              <span>{{ info.eventConfig.script?.desc }}</span>
            </p>
            <pre
              style="
                min-height: 50px;
                max-height: calc(85vh - 500px);
                overflow: scroll;
              "
              >{{ info.eventConfig.script?.script }}</pre
            >
          </div>
        </el-card>
        <el-card v-if="eventDisplay" shadow="never">
          <template #header>
            <span>指定执行时机</span>
          </template>
          <div>
            <el-checkbox-group v-model="info.eventConfig.eventKeys">
              <el-checkbox
                v-for="eventDef in eventDefs"
                :key="eventDef.value"
                :label="eventDef.value"
                size="large"
              >
                {{ eventDef.label }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <span class="dialog-footer">
        <el-button text @click="cancelDialog">取消</el-button>
        <el-button type="primary" @click="confirmDialog">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
  export default { name: 'EventConfigDialog' }
</script>
<script setup lang="ts">
  import { Plus, Delete } from '@element-plus/icons-vue'
  import { defineProps, PropType, reactive, toRefs } from 'vue'
  import scriptDialog from './scriptDialog.vue'
  import { eventDefs } from '../ab-plugins/modules/globalEvent'
  import * as abUtil from '~/agilebpm/utils/ab-util'

  const props = defineProps({
    modelValue: { required: true, type: Boolean },
    title: { required: true, type: String },
    width: { required: true, type: String },
    pluginData: { required: true, type: Object as PropType<BpmEventPlugin> },
    eventDisplay: { required: false, default: false, type: Boolean },
  })

  // 传输变量定义
  const passDataDefs = [
    { label: '业务对象', value: 'busData' },
    { label: '流程实例', value: 'bpmInstance' },
    { label: '流程任务', value: 'bpmTask' },
    { label: '提交意见', value: 'submitOpinion' },
    { label: '提交的动作KEY', value: 'submitActionName' },
    { label: '流程变量', value: 'variableScope' },
  ]

  const { pluginData } = toRefs(props)

  const emits = defineEmits(['update:modelValue'])

  const info = reactive({
    dialogVisible: useVModel(props, 'modelValue', emits),
    eventConfig: {} as BpmEventPlugin,
  })

  watch(
    () => info.dialogVisible,
    (val, old) => {
      if (val) {
        info.eventConfig = initEventConfig(abUtil.clone(props.pluginData))
      }
    }
  )

  const initEventConfig = (eventConfig: BpmEventPlugin): BpmEventPlugin => {
    if (!eventConfig) {
      eventConfig = {} as BpmEventPlugin
    }
    if (!eventConfig.model) {
      eventConfig.model = 'http'
    }
    // 初始化HTTP请求数组
    if (!eventConfig.httpArr) {
      eventConfig.httpArr = [{ id: 0, url: '', isAsync: false }]
    }
    return eventConfig
  }

  const addHttpConfig = (httpConfigs: any[]) => {
    const ids = new Set(httpConfigs.map((o) => o.id))
    let httpConfigId
    for (let i = 1; ; i++) {
      if (!ids.has(i)) {
        httpConfigId = i
        break
      }
    }
    httpConfigs.push({ id: httpConfigId })
  }

  const removeHttpConfig = (httpConfigs: any[], index: number) => {
    httpConfigs.splice(index, 1)
  }

  const stripEventConfig = (
    eventConfig: BpmEventPlugin | undefined
  ): BpmEventPlugin => {
    if (!eventConfig) {
      return {} as BpmEventPlugin
    }
    let zeroObject = false
    switch (eventConfig.model) {
      case 'http':
        if (eventConfig.httpArr?.length == 1 && !eventConfig.httpArr[0].url) {
          zeroObject = true
        }
        break
      case 'trxMessage':
        if (!eventConfig.trxMessageSubscribeKey) {
          zeroObject = true
        }
        break
      case 'serviceBean':
        if (!eventConfig.serviceBean) {
          zeroObject = true
        }
        break
      case 'script':
        if (!eventConfig.script || !eventConfig.script.script) {
          zeroObject = true
        }
        break
    }
    return zeroObject ? ({} as BpmEventPlugin) : eventConfig
  }

  const cancelDialog = () => {
    info.dialogVisible = false
  }

  const confirmDialog = () => {
    cancelDialog()
    const srcData = stripEventConfig(info.eventConfig)
    const propertyNames = Object.getOwnPropertyNames(srcData)
    if (propertyNames?.length) {
      abUtil.easyClone(srcData, pluginData.value)
    } else {
      Object.getOwnPropertyNames(pluginData?.value).forEach(
        (propName) => delete pluginData.value[propName]
      )
    }
  }
</script>
<style scoped lang="scss">
  .el-row {
    margin-bottom: 20px;
  }

  .el-row:last-child {
    margin-bottom: 0;
  }

  .tip-block {
    padding: 8px 16px;
    background-color: var(--block-tip-bg-color);
    border-left: 5px solid var(--el-color-primary);
    border-radius: 4px;
  }
</style>

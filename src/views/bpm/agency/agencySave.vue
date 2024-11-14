<template>
  <el-container class="layout-container-demo">
    <el-header>
      <ab-save
        :back-name="
          props.addType == 'admin' ? 'BpmAgencyList' : 'BpmMyAgentList'
        "
        :before-save-fn="beforeSaveFn"
        :form-ref="formRef"
        :save-data="info.data"
        :url="
          props.addType == 'admin'
            ? bpmApi.bpmPluginAgent.adminSaveAgentUrl
            : bpmApi.bpmPluginAgent.saveAgentUrl
        "
      />
      <ab-load
        v-model="info.data"
        :url="bpmApi.bpmPluginAgent.getAgentUrl"
        @after-fn="handleLoad"
      />
    </el-header>
    <el-divider class="dividermar" />
    <el-main>
      <el-scrollbar>
        <el-form
          ref="formRef"
          label-suffix="："
          :model="info.data"
          :status-icon="false"
          label-position="right"
          label-width="auto"
        >
          <el-form-item
            :label="$abT('page.common.timeRange', '时间范围')"
            prop="timeRange"
            :rules="[{ required: true, message: '必填' }]"
          >
            <div class="demo-date-picker">
              <div class="block">
                <el-date-picker
                  v-model="info.data.timeRange"
                  :end-placeholder="$abT('page.common.endTime', '结束时间')"
                  range-separator="To"
                  :start-placeholder="$abT('page.common.startTime', '开始时间')"
                  type="daterange"
                  value-format="x"
                />
              </div>
            </div>
          </el-form-item>
          <el-tooltip
            class="box-item"
            :content="
              $abT('bpm.office.proxyAllEmpty', '为空则代理所有，请谨慎操作！')
            "
            effect="dark"
            placement="top-start"
          >
            <el-form-item
              :label="$abT('bpm.office.proxyProcess', '代理流程')"
              :placeholder="
                $abT('bpm.office.selectProxyProcess', '请选择代理流程')
              "
              prop="agencyFlowName"
            >
              <el-tag
                v-if="!info.data.agencyFlow || info.data.agencyFlow.length == 0"
                type="warning"
              >
                {{ $abT('page.common.notSelect', '未选择') }}
              </el-tag>
              <el-tag
                v-else
                v-for="(flow, index) in info.data.agencyFlow"
                :key="index"
                style="margin-right: 5px"
                :closable="!info.data.id"
                @close="deletetFlow(index)"
              >
                {{ flow.name }}
              </el-tag>
              <ab-cust-dialog
                v-if="!info.data.id"
                dialog-key="bpmDefinitionSelector"
                v-model="info.data.agencyFlow"
                type="primary"
                :value-mapping="{
                  key: 'key',
                  name: 'name',
                  id: 'id',
                }"
                style="margin-left: 5px"
                size="small"
                @ok="chooseFlow"
              >
                {{ $abT('bpm.office.selectProcess', '请选择流程') }}
              </ab-cust-dialog>
            </el-form-item>
          </el-tooltip>

          <el-form-item
            v-if="
              info.data.timeRange &&
              info.data.timeRange.length > 0 &&
              new Date().getTime() > info.data.timeRange[0]
            "
            :label="$abT('bpm.office.agentAlreadyTask', '代理已有任务')"
            prop="agencyTask"
          >
            <el-tooltip
              :content="
                $abT(
                  'bpm.office.agentTaskTip',
                  '代理生效后，开关打开，将会代理所有已存在的任务'
                )
              "
            >
              <el-switch
                v-model="info.data.agencyTask"
                :active-text="$abT('page.common.yes', '是')"
                :active-value="1"
                :inactive-text="$abT('page.common.no', '否')"
                :inactive-value="0"
                inline-prompt
              />
            </el-tooltip>
          </el-form-item>
          <el-form-item
            v-if="props.addType == 'admin'"
            :label="$abT('bpm.office.principal', '被代理人')"
            :placeholder="
              $abT('bpm.office.selectPrincipal', '请选择被代理人员')
            "
            prop="configUserName"
          >
            <el-tag v-if="!info.data.configUserName" type="warning">
              {{ $abT('page.common.notSelect', '未选择') }}
            </el-tag>
            <el-tag
              v-else
              style="margin-right: 5px"
              closable
              @close="deletetConfigUser()"
            >
              {{ info.data.configUserName }}
            </el-tag>
            <ab-cust-dialog
              dialog-key="userSelector"
              type="primary"
              v-model="info.data"
              :dialog-setting="{ multiple: false }"
              :value-mapping="{
                id: 'configUserId',
                name: 'configUserName',
              }"
              style="margin-left: 5px"
              size="small"
            >
              {{ $abT('page.common.userSelection', '用户选择') }}
            </ab-cust-dialog>
          </el-form-item>
          <el-form-item
            :label="$abT('bpm.office.agent', '代理人')"
            :placeholder="$abT('bpm.office.selectAgent', '请选择代理人员')"
            prop="targetUserName"
          >
            <el-tag v-if="!info.data.targetUserName" type="warning">
              {{ $abT('page.common.notSelect', '未选择') }}
            </el-tag>
            <el-tag
              v-else
              v-for="(tUserName, tindex) in info.data.targetUserName.split(',')"
              :key="index"
              style="margin-right: 5px"
              closable
              @close="deletetTargetUser(tindex)"
            >
              {{ tUserName }}
            </el-tag>
            <ab-cust-dialog
              v-model="info.data"
              dialog-key="userSelector"
              type="primary"
              :value-mapping="{
                id: 'targetUserId',
                name: 'targetUserName',
              }"
              size="small"
              style="margin-left: 5px"
            >
              {{ $abT('page.common.userSelection', '用户选择') }}
            </ab-cust-dialog>
          </el-form-item>
          <el-form-item
            :label="$abT('page.common.desc', '描述')"
            :placeholder="$abT('page.common.enterDesc', '请输入描述')"
            prop="desc"
            :rules="[
              { required: true, message: $abT('page.common.required', '必填') },
            ]"
          >
            <el-input
              v-model="info.data.desc"
              type="textarea"
              :rows="4"
              show-word-limit
              maxlength="200"
              :autosize="{ minRows: 2, maxRows: 5 }"
            />
          </el-form-item>

          <el-tooltip
            v-if="
              info.data.agencyFlow &&
              info.data.agencyFlow.length == 1 &&
              !info.data.agencyTask
            "
            class="box-item"
            :content="
              $abT(
                'bpm.office.conditionTip',
                '当代理流程只有一个时,配置代理条件才会生效'
              )
            "
            effect="dark"
            placement="top-start"
          >
            <el-form-item
              v-if="info.bpmDefinitionVO?.setting"
              :label="$abT('bpm.office.conditionConfig', '条件配置')"
            >
              <condition-dialog
                ref="script"
                v-model="info.scriptRule"
                :flow-setting="info.bpmDefinitionVO.setting"
                width="80%"
              />
              <el-button
                :icon="Delete"
                text
                type="primary"
                v-if="scriptDesc"
                @click="deleteScript"
              >
                {{ $abT('page.common.clearToEmpty', '清空') }}
              </el-button>
            </el-form-item>
          </el-tooltip>
          <el-form-item v-if="scriptDesc">
            <el-input
              v-model="scriptDesc"
              placeholder=""
              type="textarea"
              rows="3"
              disabled
            ></el-input>
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </el-main>
    <scriptVariableInit
      v-if="info.bpmDefinitionVO?.setting"
      :bo-list="info.boList"
      :bpm-setting="info.bpmDefinitionVO.setting"
      :script-variables="info.scriptVariables"
      :type-list="conditionTypes"
    />
  </el-container>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { bpmApi } from '~/agilebpm'
  import { QuestionFilled, Delete, InfoFilled } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  import scriptVariableInit from '~/agilebpm/package/ab-common-resource/bpmDesign/conditionScript/scriptVariableInit.vue'
  import conditionDialog from './condition/conditionDialog.vue'
  import { conditionTypes } from './condition/config'
  import * as AbFlowUtil from '~/agilebpm/package/ab-common-resource/ab-flow-util'

  const props = defineProps({
    addType: {
      type: String,
      required: true,
    },
  })
  const formRef = ref()
  const info: any = reactive({
    data: {
      id: '',
      startDatetime: '',
      endDatetime: '',
      agencyFlow: [] as any[],
      targetUserId: '',
      targetUserName: '',
      timeRange: [],
      enable: 1,
      agencyTask: 0,
      configUserId: '',
      configUserName: '',
      desc: '',
      conditionScript: '',
    },
    scriptRule: null,
    boList: [],
    scriptVariables: [],
    bpmDefinitionVO: {},
  })
  const scriptDesc = computed(() => {
    return AbFlowUtil.getScriptDesc(info.scriptRule)
  })

  provide('scriptVariables', info.scriptVariables)

  const handleLoad = () => {
    if (!info.data.agencyFlow) {
      info.data.agencyFlow = []
    }
    if (info.data.startDatetime && info.data.endDatetime) {
      info.data.timeRange = []
      info.data.timeRange.push(new Date(info.data.startDatetime).getTime())
      info.data.timeRange.push(new Date(info.data.endDatetime).getTime())
    }
    if (info.data.agencyFlow.length === 1 && info.data.agencyFlow[0].id) {
      getDesignInfo(info.data.agencyFlow[0].id)
    }
    if (info.data.conditionScript) {
      info.scriptRule = JSON.parse(info.data.conditionScript)
    }
  }

  const beforeSaveFn = () => {
    if (info.scriptRule && Object.keys(info.scriptRule).length > 0) {
      info.data.conditionScript = JSON.stringify(info.scriptRule)
    }
    //代理多个 代理所有时清空配置条件
    if (!info.data.agencyFlow || info.data.agencyFlow.length != 1) {
      info.data.conditionScript = ''
    }

    info.data.startDatetime = info.data.timeRange[0]
    info.data.endDatetime = info.data.timeRange[1]
    if (!info.data.configUserId && props.addType == 'admin') {
      ElMessage({
        message: '请选择代理人',
        type: 'warning',
      })
      return false
    }
    if (!info.data.targetUserId) {
      ElMessage({
        message: '请选择被代理人',
        type: 'warning',
      })
      return false
    }

    const index = info.data.targetUserId
      .split(',')
      .indexOf(info.data.configUserId)
    if (index >= 0) {
      ElMessage({
        message: '代理人不能包含被代理人',
        type: 'warning',
      })
      return false
    }
  }

  const deletetTargetUser = (index: any) => {
    if (!info.data.targetUserId) {
      return
    }
    const idList = info.data.targetUserId.split(',')
    const nameList = info.data.targetUserName.split(',')
    idList.splice(index, 1)
    nameList.splice(index, 1)

    if (idList.length === 0) {
      info.data.targetUserId = ''
      info.data.targetUserName = ''
    } else {
      info.data.targetUserId = idList.join(',')
      info.data.targetUserName = nameList.join(',')
    }
  }

  const deletetConfigUser = () => {
    if (!info.data.configUserId) {
      return
    }
    info.data.configUserId = ''
    info.data.configUserName = ''
  }

  const deletetFlow = (index: any) => {
    if (!info.data.agencyFlow || info.data.agencyFlow.length == 0) {
      return
    }
    info.data.agencyFlow.splice(index, 1)
  }

  const chooseFlow = (dataList: any) => {
    if (!dataList || dataList.length != 1) {
      return
    }
    //自由选择一个的时候才配置条件
    getDesignInfo(dataList[0].id)
  }

  const deleteScript = () => {
    info.scriptRule = null
    info.data.conditionScript = ''
  }

  const getDesignInfo = (defId) => {
    if (!defId) {
      return
    }
    bpmApi.bpmDefinition.getBpmDefinitionDesign(defId).then((res) => {
      info.bpmDefinitionVO = res.data
    })
  }
</script>
<style scoped>
  .demo-date-picker {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    padding: 0;
  }
  .demo-date-picker .block {
    flex: 1;
    border-right: solid 1px var(--el-border-color);
  }
  .demo-date-picker .block:last-child {
    border-right: none;
  }
  .demo-date-picker .demonstration {
    display: block;
    margin-bottom: 20px;
    font-size: 14px;
    color: var(--el-text-color-secondary);
  }
</style>

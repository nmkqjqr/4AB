<template>
  <div class="common-layout">
    <el-container>
      <el-main>
        <div class="comprehensive-table-container">
          <div ref="titleForm">
            <el-row class="vab-query-form">
              <el-col class="top-panel">
                <el-form
                  ref="queryForm"
                  :inline="true"
                  :model="query"
                  @submit.prevent
                >
                  <el-form-item
                    :label="$abT('bpm.office.process', '流程')"
                    label-width="90px"
                  >
                    <el-input
                      v-model="query.agencyFlowName$VLK"
                      prop="agencyFlowName$VLK"
                      :placeholder="$abT('page.common.enterName', '请输入名称')"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    :label="$abT('page.common.timeRange', '时间范围')"
                    label-width="90px"
                  >
                    <el-date-picker
                      v-model="timeRange"
                      :end-placeholder="$abT('page.common.endTime', '结束时间')"
                      range-separator="To"
                      :start-placeholder="
                        $abT('page.common.startTime', '开始时间')
                      "
                      type="datetimerange"
                      value-format="YYYYMMDDHHmmss"
                    />
                  </el-form-item>
                  <el-form-item
                    v-if="collapse && activeName == 'all'"
                    :label="$abT('page.common.status', '状态')"
                    label-width="70px"
                    prop="enable$NEQ"
                  >
                    <el-select
                      v-model="query.enable$NEQ"
                      :placeholder="$abT('page.common.all', '全部')"
                      clearable
                    >
                      <el-option
                        :label="$abT('page.common.enable', '启用')"
                        :value="1"
                      />
                      <el-option
                        :label="$abT('page.common.disable', '禁用')"
                        :value="0"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    v-if="collapse"
                    :label="$abT('bpm.office.principal', '被代理人')"
                    label-width="90px"
                  >
                    <el-input
                      v-model="query.configUserName$VLK"
                      prop="configUserName$VLK"
                      :placeholder="$abT('page.common.enterName', '请输入名称')"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    v-if="collapse"
                    :label="$abT('bpm.office.agent', '代理人')"
                    label-width="90px"
                  >
                    <el-input
                      v-model="query.targetUserName$VLK"
                      prop="targetUserName$VLK"
                      :placeholder="$abT('page.common.enterName', '请输入名称')"
                    ></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button :icon="Search" type="primary" @click="search()">
                      {{ $abT('page.common.search', '查询') }}
                    </el-button>
                    <el-button :icon="RefreshRight" @click="toReset()">
                      {{ $abT('page.common.reset', '重置') }}
                    </el-button>

                    <el-button type="text" @click="handleCollapse()">
                      <span v-if="!collapse" type="text">
                        {{ $abT('page.common.expand', '展开') }}
                      </span>
                      <span v-else type="text">
                        {{ $abT('page.common.merge', '合并') }}
                      </span>
                      <el-icon class="el-icon--right">
                        <ArrowUp v-if="collapse" />
                        <ArrowDown v-else />
                      </el-icon>
                    </el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row class="vab-query-form">
              <el-col class="left-panel">
                <router-link v-ab-btn-rights:adminAgency_add to="AgencyEdit">
                  <el-button :icon="Plus" type="primary">
                    {{ $abT('page.common.add', '添加') }}
                  </el-button>
                </router-link>
              </el-col>
            </el-row>
          </div>

          <el-tabs
            v-model="activeName"
            class="demo-tabs"
            @tab-change="tabChangeFn"
          >
            <el-tab-pane
              :label="$abT('page.common.all', '全部')"
              name="all"
            ></el-tab-pane>
            <el-tab-pane
              :label="$abT('bpm.office.inEffect', '生效中')"
              name="takeEffecting"
            ></el-tab-pane>
            <el-tab-pane
              :label="$abT('bpm.office.toBeEffective', '待生效')"
              name="waitEffect"
            ></el-tab-pane>
            <el-tab-pane
              :label="$abT('bpm.office.invalid', '已失效')"
              name="invalid"
            ></el-tab-pane>
          </el-tabs>

          <ab-table
            ref="abTable"
            v-model="selectedData"
            :checkable="false"
            :height="tableHeight"
            :query-param="query"
            row-key="id"
            :url="bpmApi.bpmPluginAgent.bpmAdminAgentListUrl"
          >
            <ab-column
              ab-template="flow"
              :label="$abT('bpm.office.proxyProcess', '代理流程')"
              min-width="120"
              prop="agencyFlowName"
            />
            <template #flow="{ scope }">
              {{
                scope.row.agencyFlowName
                  ? scope.row.agencyFlowName
                  : $abT('bpm.office.allProcess', '全部流程')
              }}
            </template>
            <ab-column
              :label="$abT('bpm.office.principal', '被代理人')"
              prop="configUserName"
              width="120"
            />
            <ab-column
              :label="$abT('bpm.office.agent', '代理人')"
              prop="targetUserName"
              min-width="80"
            />
            <ab-column
              :label="$abT('page.common.startTime', '起始时间')"
              prop="startDatetime"
              width="160"
            />
            <ab-column
              ab-template="endDatetime"
              :label="$abT('page.common.endTime', '结束时间')"
              prop="endDatetime"
              width="160"
            />
            <template #endDatetime="{ scope }">
              <span v-if="scope.row.isInvalid" style="color: crimson">
                {{ scope.row.endDatetime }}
              </span>
              <span v-else>{{ scope.row.endDatetime }}</span>
            </template>
            <ab-column
              :label="$abT('bpm.office.agentAlreadyTask', '代理已有任务')"
              prop="agencyTask"
              width="200"
              :ab-text-formatter="`1-${$abT(
                'page.common.yes',
                '是'
              )}-default|0-${$abT('page.common.no', '否')}-success`"
            />
            <ab-column
              :ab-text-formatter="`1-${$abT(
                'page.common.enable',
                '启用'
              )}-success|0-${$abT('page.common.disable', '禁用')}-danger`"
              :label="$abT('page.common.status', '状态')"
              prop="enable"
              width="90"
            />
            <ab-column
              :label="$abT('bpm.office.agencyConditions', '代理条件')"
              ab-template="conditionScript"
              min-width="200"
            />
            <template #conditionScript="{ scope }">
              <span v-if="scope.row.conditionScript">
                {{
                  AbFlowUtil.getScriptDesc(
                    JSON.parse(scope.row.conditionScript)
                  )
                }}
              </span>
              <span v-else>-</span>
            </template>
            <ab-column
              :label="$abT('page.common.desc', '描述')"
              prop="desc"
              min-width="200"
            />

            <ab-column
              :label="$abT('page.common.createTime', '创建时间')"
              prop="updateTime"
              width="160"
            />
            <ab-column
              ab-template="edit"
              fixed="right"
              :label="$abT('page.common.operate', '操作')"
              prop="key"
              width="280"
            />
            <template #edit="{ scope }">
              <router-link
                :to="{
                  name: 'BpmMyAgentLogList',
                  query: {
                    configId: scope.row.id,
                  },
                }"
              >
                <el-button text type="primary">
                  {{ $abT('bpm.office.proxyRecords', '代理记录') }}
                </el-button>
              </router-link>
              <router-link
                :to="{ name: 'AgencyEdit', query: { id: scope.row.id } }"
              >
                <el-button text type="primary">
                  {{ $abT('page.common.edit', '编辑') }}
                </el-button>
              </router-link>
              <el-button
                v-ab-btn-rights:adminAgency_del
                v-if="scope.row.enable === 0 || scope.row.isInvalid"
                text
                type="primary"
                @click="
                  sendAction(
                    bpmApi.bpmPluginAgent.bpmAgentDeleteUrl + scope.row.id,
                    $abT('page.common.delMsg', '确定删除{a}吗?', {
                      a: scope.row.agencyFlowName,
                    })
                  )
                "
              >
                {{ $abT('page.common.del', '删除') }}
              </el-button>
              <el-button
                v-ab-btn-rights:adminAgency_disable
                v-if="scope.row.enable === 1 && !scope.row.isInvalid"
                text
                type="primary"
                @click="openDialog(scope.row.id)"
              >
                {{ $abT('page.common.disable', '禁用') }}
              </el-button>
            </template>
          </ab-table>
        </div>
      </el-main>
    </el-container>
    <el-dialog
      v-model="dialogVisible"
      :title="$abT('page.common.disablePrompts', '禁用提示')"
      width="500"
      destroy-on-close
    >
      <el-form-item :label="$abT('bpm.office.recycleTasks', '是否回收任务')">
        <el-switch
          v-model="recoverTask"
          inline-prompt
          :active-value="1"
          :inactive-value="0"
          :active-text="$abT('page.common.yes', '是')"
          :inactive-text="$abT('page.common.no', '否')"
        />
      </el-form-item>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">
            {{ $abT('page.common.cancel', '取消') }}
          </el-button>
          <el-button type="primary" @click="disableConfig()">
            {{ $abT('page.common.ok', '确定') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts">
  import { reactive, ref, defineComponent, getCurrentInstance } from 'vue'
  import { Search, RefreshRight, Plus } from '@element-plus/icons-vue'
  import { getData, abTableMix, bpmApi } from '~/agilebpm'
  import * as AbFlowUtil from '~/agilebpm/package/ab-common-resource/ab-flow-util'

  export default defineComponent({
    name: 'BpmMyAgentList',
    mixins: [abTableMix],
    setup() {
      // @ts-ignore
      const { proxy } = getCurrentInstance()
      const query: any = reactive({
        startDatetime$DGE: '',
        startDatetime$DLE: '',
        enable$NEQ: '',
        agencyFlowName$VLK: '',
        configUserName$VLK: '',
        targetUserName$VLK: '',
        tab: '',
      })

      const timeRange = ref()
      const toReset = () => {
        timeRange.value = []
        query.startDatetime$DGE = ''
        query.startDatetime$DLE = ''
        query.enable$NEQ = ''
        query.agencyFlowName$VLK = ''
        query.configUserName$VLK = ''
        query.targetUserName$VLK = ''
        query.tab = ''
        proxy.search()
      }
      watch(timeRange, (newValue) => {
        if (newValue && newValue.length > 0) {
          query.startDatetime$DGE = newValue[0]
          query.startDatetime$DLE = newValue[1]
        } else {
          query.startDatetime$DGE = ''
          query.startDatetime$DLE = ''
        }
      })

      const recoverTask = ref(0)
      const dialogVisible = ref(false)
      const configId = ref('')

      const openDialog = (id: string) => {
        dialogVisible.value = true
        configId.value = id
      }

      const disableConfig = () => {
        getData(bpmApi.bpmPluginAgent.bpmAgentDisableUrl, {
          id: configId.value,
          recoverTask: recoverTask.value,
        }).then(() => {
          proxy.search()
          dialogVisible.value = false
          configId.value = ''
        })
      }

      const activeName = ref('all')
      const tabChangeFn = (panelName: any) => {
        if (activeName.value == 'all') {
          query.tab = ''
        } else {
          query.enable$NEQ = ''
          query.tab = activeName.value
        }
        proxy.search()
      }

      return {
        bpmApi,
        query,
        timeRange,
        toReset,
        Search,
        RefreshRight,
        Plus,
        disableConfig,
        recoverTask,
        dialogVisible,
        openDialog,
        AbFlowUtil,
        activeName,
        tabChangeFn,
      }
    },
  })
</script>

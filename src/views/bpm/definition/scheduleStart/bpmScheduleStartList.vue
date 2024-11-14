<template>
  <div class="common-layout">
    <el-container>
      <el-aside class="left-tree">
        <div
          class="treeBoxHeight"
          shadow="hover"
          style="padding: 10px"
          :style="{
            height: flowTypeTreeOptions.height,
            width: '100%',
          }"
        >
          <el-tree
            ref="flowTypeTreeRef"
            :data="flowTypeTreeOptions.data"
            :default-expand-all="true"
            :expand-on-click-node="false"
            :highlight-current="true"
            node-key="id"
            :props="flowTypeTreeOptions.props"
            @node-click="flowTypeTreeOptions.nodeClick"
          >
            <template #default="{ data }">
              <span :title="data.name">
                {{data.name}}
              </span>
            </template>
          </el-tree>
        </div>
      </el-aside>
      <el-main>
        <div class="comprehensive-table-container">
          <div ref="titleForm">
            <el-row class="vab-query-form">
              <el-col class="top-panel">
                <el-form
                  ref="queryForm"
                  :inline="true"
                  :model="queryParams"
                  @submit.prevent
                >
                  <el-form-item :label="$abT('page.common.desc','描述')" label-width="90px" prop="desc$VLK">
                    <el-input
                      v-model="queryParams.desc$VLK"
                      :placeholder="$abT('page.common.enterDesc','请输入描述')"
                    />
                  </el-form-item>
                  <el-form-item
                    :label="$abT('page.common.status','状态')"
                    label-width="62px"
                    prop="status$VEQ"
                  >
                    <el-select
                      v-model="queryParams.status$VEQ"
                      :placeholder="$abT('page.common.all','全部')"
                      clearable
                    >
                      <el-option
                        v-for="item in systemEmums.bpmScheduleStartStatus"
                        :key="item.key"
                        :label="item.desc"
                        :value="item.key"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    :label="$abT('page.flowTimingStart.taskType','任务类型')"
                    label-width="90px"
                    prop="taskType$VEQ"
                  >
                    <el-select
                      v-model="queryParams.taskType$VEQ"
                      :placeholder="$abT('page.common.all','全部')"
                      clearable
                    >
                      <el-option
                        v-for="item in systemEmums.bpmScheduleStartTaskType"
                        :key="item.key"
                        :label="item.desc"
                        :value="item.key"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button :icon="Search" type="primary" @click="search()">
                      {{ $abT('page.common.search',  '查询' ) }}
                    </el-button>
                    <el-button :icon="RefreshRight" @click="resetQueryParams">
                      {{ $abT('page.common.reset','重置') }}
                    </el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row class="vab-query-form">
              <el-col class="left-panel">
                <el-space>
                  <router-link
                    v-ab-btn-rights:scheduleStart_add
                    to="/bpm/scheduleStart/edit"
                  >
                    <el-button :icon="Plus" type="primary">{{ $abT('page.common.add','添加') }}</el-button>
                  </router-link>
                </el-space>
              </el-col>
            </el-row>
          </div>

          <ab-table
            ref="abTable"
            v-model="selectedData"
            :height="tableHeight"
            :query-column="[
              'id',
              'desc',
              'defKey',
              'taskType',
              'cronExp',
              'nextTriggerTime',
              'startFullname',
              'startOrgCode',
              'status',
            ]"
            :query-param="queryParams"
            row-key="id"
            :url="bpmApi.scheduleStart.bpmScheduleStartListUrl"
          >
            <ab-column :label="$abT('page.common.desc','描述')" min-width="120" prop="desc" />
            <ab-column :label="$abT('page.wfDesign.wfCode','流程编码')" min-width="120" prop="defKey" />
            <ab-column :label="$abT('page.wfDesign.wfName','流程名称')" min-width="120" prop="defName" />
            <ab-column
              :label="$abT('page.flowTimingStart.taskType','任务类型')"
              min-width="130"
              prop="taskTypeDesc"
            />
            <ab-column
              ab-template="triggerTime"
              :label="$abT('page.flowTimingStart.executionTime','执行时间/Cron表达式')"
              width="160"
            />
            <template #triggerTime="{ scope }">
              <span v-if="scope.row.taskType === 'once'">
                {{ scope.row.nextTriggerTime }}
              </span>
              <span v-else-if="scope.row.taskType === 'recycle'">
                <el-tag>{{ scope.row.cronExp }}</el-tag>
              </span>
            </template>
            <ab-column
              :label="$abT('page.common.Initiator','发起人')"
              min-width="100"
              prop="startFullname"
            />
            <ab-column
              :label="$abT('page.common.InitiateOrg','发起组织')"
              min-width="100"
              prop="startOrgName"
            />
            <ab-column
              ab-template="status"
              :label="$abT('page.common.status','状态')"
              min-width="270"
            />
            <template #status="{ scope }">
              <el-radio-group
                v-model="scope.row.status"
                size="small"
                @change="changeStatus(scope.row)"
              >
                <el-radio-button
                  v-for="item in systemEmums.bpmScheduleStartStatus"
                  :key="item.key"
                  :label="item.key"
                >
                  {{ item.desc }}
                </el-radio-button>
              </el-radio-group>
            </template>
            <ab-column
              ab-template="edit"
              fixed="right"
              :label="$abT('page.common.operate','操作')"
              width="260"
            />
            <template #edit="{ scope }">
              <router-link
                v-ab-btn-rights:scheduleStart_edit
                :to="{
                  name: 'BpmScheduleStartEdit',
                  query: { id: scope.row.id },
                }"
              >
                <el-button text type="primary">{{ $abT('page.common.edit','编辑') }}</el-button>
              </router-link>
              <el-button
                v-ab-btn-rights:scheduleStart_del
                text
                type="primary"
                @click="deleteTableRow(scope.row)"
              >
                {{ $abT('page.common.del','删除') }}
              </el-button>
              <router-link
                v-ab-btn-rights:scheduleStart_logs
                :to="{
                  name: 'BpmScheduleStartLogList',
                  query: { id: scope.row.id },
                }"
              >
                <el-button text type="primary">{{ $abT('page.flowTimingStart.startRecording','启动记录') }}</el-button>
              </router-link>
            </template>
          </ab-table>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
  import { abTableMix, sysApi, bpmApi, getData } from '~/agilebpm'
  export default {
    name: 'BpmScheduleStartList',
    mixins: [abTableMix],
  }
</script>

<script lang="ts" setup>
  import { getCurrentInstance, reactive } from 'vue'

  import {
    Delete,
    Edit,
    Search,
    Plus,
    RefreshRight,
    Check,
  } from '@element-plus/icons-vue'
  import {abT} from "@/i18n";

  const { proxy } = getCurrentInstance()

  const queryParams = reactive({
    defKey$VIN: '',
    desc$VLK: '',
    status$VEQ: '',
    taskType$VEQ: '',
  })

  onActivated(() => {
    flowTypeTreeOptions.fetchData()
  })

  /**
   * 重置查询参数
   */
  function resetQueryParams() {
    queryParams['defKey$VIN'] = ''
    flowTypeTreeRef.value.setCurrentKey(null)
    proxy.reset()
  }

  const flowTypeTreeRef = ref()

  // 流程分类数配置选项
  const flowTypeTreeOptions = reactive({
    data: [],
    ref: null,
    props: { children: 'children', label: 'name' },
    height: `${window.innerHeight - (110 + 32 + 20 + 60)}px`,
    nodeClick(node: any) {
      if (node.parentId === '0') {
        queryParams['defKey$VIN'] = ''
      } else {
        const defKeys = []
        const linklist = [node]
        while (linklist && linklist.length) {
          const item = linklist.pop()
          if (item.bpmDefinition) {
            defKeys.push(item.id)
          } else if (item.children && item.children.length) {
            linklist.push(...item.children)
          }
        }
        queryParams['defKey$VIN'] = defKeys.join(',') || '-1'
      }
      proxy.search()
    },
    async fetchData() {
      const { data: treeList } = await bpmApi.scheduleStart.getBpmDefTypeTree()
      flowTypeTreeOptions.data = treeList
    },
  })

  onMounted(() => {
    // 加载数据
    flowTypeTreeOptions.fetchData()
    systemEmums.initLoad()
  })

  // 系统枚举
  const systemEmums = reactive<{
    bpmScheduleStartTaskType: any[]
    bpmScheduleStartStatus: any[]
    initLoad(): void
  }>({
    // 定时启动任务类型
    bpmScheduleStartTaskType: [],
    // 定时启动状态
    bpmScheduleStartStatus: [],
    // 初始化加载
    initLoad() {
      sysApi.tools
        .getEnum('com.dstz.bpm.api.enums.BpmScheduleStartTaskType', true, 'key')
        .then(({ data }) => (systemEmums.bpmScheduleStartTaskType = data))

      sysApi.tools
        .getEnum('com.dstz.bpm.api.enums.BpmScheduleStartStatus', true, 'key')
        .then(({ data }) => (systemEmums.bpmScheduleStartStatus = data))
    },
  })

  /**
   * 变更状态
   * @param data 数据
   */
  async function changeStatus(data: any) {
    const { isOk } = await bpmApi.scheduleStart.bpmScheduleStartChangeStatus(
      data.id,
      data.status
    )
    // 成功触发列表更新
    if (isOk) proxy.search()
  }

  async function deleteTableRow(row: any) {
    const actionCmd = await ElMessageBox.confirm(
      abT('page.common.delMsg','确定删除 {a} 吗？', { a: row.desc }),
      abT('page.common.prompt','提示'),
      {
        confirmButtonText: abT('page.common.ok','确定'),
        cancelButtonText: abT('page.common.cancel','取消'),
        type: 'warning',
      }
    )
    if (actionCmd == 'confirm') {
      const { isOk, msg } = await getData(
        bpmApi.scheduleStart.bpmScheduleStartRemoveUrl + row.id
      )
      ElMessage({
        type: 'success',
        message: abT('page.common.operateSuccess','操作成功'),
        onClose: () => {},
      })
      proxy.selectedData.splice(0, proxy.selectedData.length)
      proxy.search()
      flowTypeTreeOptions.fetchData()
    }
  }
</script>

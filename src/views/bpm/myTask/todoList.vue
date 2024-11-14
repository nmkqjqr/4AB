<template>
  <div class="common-layout">
    <el-container>
      <el-aside v-if="!info.typeGroup" class="left-tree">
        <flow-type-tree
          v-model="randomModel"
          :tree-url="bpmApi.myTask.todoListTypeTreeUrl"
          @node-click="searchData"
        />
      </el-aside>
      <el-main>
        <div class="comprehensive-table-container">
          <div ref="titleForm">
            <el-row class="vab-query-form">
              <el-col class="top-panel">
                <el-form
                  ref="queryForm"
                  :inline="true"
                  label-width="90px"
                  :model="query"
                  @submit.prevent
                >
                  <el-form-item
                    :label="$abT('bpm.office.taskTitle', '任务标题')"
                    prop="title$VLK"
                  >
                    <el-input
                      v-model="query.title$VLK"
                      :placeholder="
                        $abT('page.common.enterTitle', '请输入标题')
                      "
                    />
                  </el-form-item>
                  <el-form-item
                    :label="$abT('bpm.office.taskName', '任务名称')"
                    prop="task.name$VLK"
                  >
                    <el-input
                      v-model="query['task.name$VLK']"
                      :placeholder="$abT('page.common.enterName', '请输入名称')"
                    />
                  </el-form-item>
                  <el-form-item>
                    <el-button :icon="Search" type="primary" @click="search()">
                      {{ $abT('page.common.search', '查询') }}
                    </el-button>
                    <el-button :icon="RefreshRight" @click="reset()">
                      {{ $abT('page.common.reset', '重置') }}
                    </el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </div>

          <ab-table
            ref="abTable"
            v-model="selectedData"
            :checkable="false"
            :height="tableHeight"
            :query-param="query"
            :url="bpmApi.myTask.bpmMyTaskTodoListUrl"
          >
            <ab-column
              :label="$abT('bpm.office.taskTitle', '任务标题')"
              min-width="200"
              prop="title"
            />
            <ab-column
              :label="$abT('bpm.office.taskName', '任务名称')"
              prop="name"
              width="120"
            />
            <ab-column
              ab-tag-type="statusCss"
              :label="$abT('page.common.status', '状态')"
              prop="statusDesc"
              width="120"
            />
            <ab-column
              ab-tag-type="typeCss"
              :label="$abT('page.common.type', '类型')"
              prop="typeDesc"
              width="150"
            />
            <ab-column
              ab-template="priority"
              :label="$abT('bpm.office.urgencyLevel', '紧急程度')"
              width="120"
            />
            <template #priority="{ scope }">
              <el-tag
                :color="custFormat(scope.row.priority)?.color"
                effect="light"
                style="color: aliceblue"
              >
                {{ custFormat(scope.row.priority)?.name }}
              </el-tag>
            </template>
            <ab-column
              :label="$abT('page.common.createTime', '创建时间')"
              prop="createTime"
              width="160"
            />
            <ab-column
              ab-template="durMs"
              :label="$abT('bpm.office.duration', '持续时间')"
              width="100"
            />
            <template #durMs="{ scope }">
              {{ abUtil.timeLag(scope.row.durMs, 2) }}
            </template>
            <ab-column
              ab-template="dueTime"
              :label="$abT('bpm.office.dueTime', '到期时间')"
              width="160"
            />
            <template #dueTime="{ scope }">
              <span
                v-if="new Date(scope.row.dueTime) < new Date()"
                style="color: crimson"
              >
                {{ scope.row.dueTime }}
              </span>
              <span v-else>{{ scope.row.dueTime }}</span>
            </template>
            <ab-column
              ab-template="edit"
              fixed="right"
              :label="$abT('page.common.operate', '操作')"
              prop="key"
              width="130"
            />
            <template #edit="{ scope }">
              <router-link
                :to="{
                  name: 'BpmTaskComplate',
                  query: {
                    id: scope.row.id,
                    type: 'taskId',
                    backR: 'BpmMyTaskTodoList',
                  },
                }"
              >
                <el-button text type="primary">
                  {{ $abT('page.common.dispose', '办理') }}
                </el-button>
              </router-link>
            </template>
          </ab-table>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script lang="ts">
  import { reactive, defineComponent, getCurrentInstance } from 'vue'
  import { abTableMix, bpmApi, abUtil } from '~/agilebpm'
  import flowTypeTree from './components/flow-type-tree.vue'
  import {
    Delete,
    Search,
    RefreshRight,
    InfoFilled,
  } from '@element-plus/icons-vue'
  import { abT } from '@/i18n'

  export default defineComponent({
    name: 'BpmMyTaskTodoList',
    components: { flowTypeTree },
    mixins: [abTableMix],
    setup() {
      // 查询条件定义，如果ts 需要定义所有参数，这里覆盖父类，不是的话可以不用设置，父类已经定义了query 对象
      const query: any = reactive({
        'task.name$VLK': '',
        'def.typeCode$VIN': '',
        'def.key$VEQ': '',
        title$VLK: '',
      })

      const randomModel = ref('')
      // @ts-ignore
      const { proxy } = getCurrentInstance()
      const info: any = reactive({
        typeGroup: false,
      })
      if (
        proxy.$route.query.typeGroup &&
        proxy.$route.query.typeGroup.length > 0
      ) {
        info.typeGroup = true
        query['def.typeCode$VIN'] = proxy.$route.query.typeGroup
      }

      const custFormat = (value: number) => {
        if (!value) return
        if (value < 51) {
          return {
            name: `${abT('bpm.office.UrgentNormal', '正常')}`,
            type: '',
            color: '#409EFF',
          }
        }
        if (value == 51) {
          return {
            name: `${abT('bpm.office.UrgentFirst', '优先')}`,
            type: 'success',
            color: '#ffadd2',
          }
        }
        if (value == 52) {
          return {
            name: `${abT('bpm.office.Urgent4', '加急')}`,
            type: 'info',
            color: '#E6A23C',
          }
        }
        if (value == 53) {
          return {
            name: `${abT('bpm.office.urgent3', '紧急')}`,
            type: 'warning',
            color: '#f90',
          }
        }
        if (value == 54) {
          return {
            name: `${abT('bpm.office.Urgent2', '特急')}`,
            type: 'warning',
            color: '#ed4014',
          }
        }
        if (value >= 55) {
          return {
            name: `${abT('bpm.office.Urgent1', '火急')}`,
            type: 'danger',
            color: '#ed4014',
          }
        }
      }

      const search = () => {
        // 随机数改变 重新获取树
        randomModel.value = `${Math.floor(Math.random() * 100)}`
        proxy.$refs['abTable'].getData()
      }

      const searchData = (type: string, value: string) => {
        if (type === 'default') {
          query['def.typeCode$VIN'] = null
          query['def.key$VEQ'] = null
          proxy.$refs['abTable'].getData()
          return
        }
        if (type === 'flow') {
          query['def.typeCode$VIN'] = null
          query['def.key$VEQ'] = value
          proxy.$refs['abTable'].getData()
          return
        }
        if (type === 'tree') {
          query['def.key$VEQ'] = null
          query['def.typeCode$VIN'] = value
          proxy.$refs['abTable'].getData()
        }
      }

      return {
        custFormat,
        searchData,
        query,
        info,
        bpmApi,
        Search,
        RefreshRight,
        Delete,
        InfoFilled,
        abUtil,
        search,
        randomModel,
        abT,
      }
    },
  })
</script>

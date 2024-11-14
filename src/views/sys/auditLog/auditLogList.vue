<template>
  <div class="common-layout">
    <el-container>
      <el-aside class="left-tree">
        <div
          class="treeBoxHeight"
          shadow="hover"
          style="margin: 10px"
          :style="{ height: info.height }"
        >
          <el-tree
            :data="info.dicTree"
            :default-expanded-keys="['0']"
            :expand-on-click-node="false"
            :highlight-current="true"
            node-key="id"
            :props="info.defaultProps"
            @node-click="handleNodeClick"
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
                  :model="query"
                  @submit.prevent
                >
                  <el-form-item
                    label="操作者"
                    label-width="76px"
                    prop="operator$VLK"
                  >
                    <el-input
                      v-model="query.operator$VLK"
                      placeholder="请输入操作者"
                    />
                  </el-form-item>
                  <el-form-item
                    label="操作描述"
                    label-width="76px"
                    prop="description$VLK"
                  >
                    <el-input
                      v-model="query.description$VLK"
                      placeholder="请输入操作描述"
                    />
                  </el-form-item>
                  <el-form-item
                    v-if="collapse"
                    label="操作时间"
                    label-width="90px"
                  >
                    <el-date-picker
                      v-model="timeRange"
                      end-placeholder="结束时间"
                      range-separator="To"
                      start-placeholder="开始时间"
                      type="datetimerange"
                      value-format="YYYYMMDDHHmmss"
                    />
                  </el-form-item>
                  <el-form-item
                    v-if="collapse"
                    label="操作者IP"
                    label-width="76px"
                    prop="ip$VLK"
                  >
                    <el-input v-model="query.ip$VLK" placeholder="请输入ip" />
                  </el-form-item>
                  <el-form-item>
                    <el-button :icon="Search" type="primary" @click="search()">
                      查询
                    </el-button>
                    <el-button :icon="RefreshRight" @click="toReset()">
                      重置
                    </el-button>
                    <el-button type="text" @click="handleCollapse()">
                      <span v-if="!collapse" type="text">展开</span>
                      <span v-else type="text">合并</span>
                      <el-icon class="el-icon--right">
                        <ArrowUp v-if="collapse" />
                        <ArrowDown v-else />
                      </el-icon>
                    </el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </div>
          <!-- 关键字段设置minwith，特定枚举字段设置with（管理列、日期、状态、字典等），
         不重要字段放最后，管理列设置 fixed="right"
    -->
          <ab-table
            ref="abTable"
            v-model="selectedData"
            :checkable="false"
            :height="tableHeight"
            :query-param="query"
            :url="sysApi.sysAuditlog.auditLogList"
          >
            <ab-column label="操作描述" min-width="250" prop="description" />
            <ab-column label="操作动作" prop="action" width="180" />
            <ab-column ab-date-formatter="yyyy-MM-dd HH:mm"  label="操作时间" prop="createTime" width="160" />
            <ab-column label="操作账户" prop="account" width="100" />
            <ab-column label="操作者" prop="operator" width="120" />
            <ab-column label="操作部门" min-width="150" prop="operatorGroup" />
            <ab-column label="操作者IP" prop="ip" width="100" />
            <ab-column label="操作者地址" prop="ipAddress" width="150" />
            <ab-column label="日志跟踪编号" prop="traceId" width="300" />
            <ab-column
              ab-template="edit"
              fixed="right"
              label="操作"
              width="100"
            />
            <template #edit="{ scope }">
              <el-button v-ab-btn-rights:auditLog_get text type="primary" @click="opentDialog(scope.row)">
                详情
              </el-button>
            </template>
          </ab-table>
          <el-dialog
            v-model="dialogVisable"
            :before-close="closeDialog"
            title="日志详情"
          >
            <audit-log-detail v-if="dialogVisable" :id="rowData.id" />
          </el-dialog>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
  // eslint-disable-next-line no-unused-vars
  import { ref, reactive, defineComponent, getCurrentInstance } from 'vue'
  import { abTableMix, sysApi } from '~/agilebpm'
  import auditLogDetail from './auditLogDetail.vue'
  import {
    Delete,
    Edit,
    Search,
    Plus,
    RefreshRight,
    ArrowUp,
    ArrowDown,
  } from '@element-plus/icons-vue'
  export default defineComponent({
    name: 'AuditLogList',
    components: { auditLogDetail },
    mixins: [abTableMix],
    setup() {
      const info: any = reactive({
        height: `${window.innerHeight - (110 + 32 + 20 + 60)}px`,
        defaultProps: { children: 'children', label: 'name' },
        dicTree: [] as any[],
      })
      // 查询条件定义，如果ts 需要定义所有参数，这里覆盖父类，不是的话可以不用设置，父类已经定义了query 对象
      const query = reactive({
        operator$VLK: '',
        description$VLK: '',
        ip$VLK: '',
        'b.typeCode$VEQ': '',
        'b.action$VEQ': '',
        'b.action$VLK': '',
        'a.createTime$DGE': '',
        'a.createTime$DLE': '',
      })
      // @ts-ignore
      const { proxy } = getCurrentInstance()
      const timeRange = ref()

      //点击左侧树后条件查询
      const handleNodeClick = (item: any) => {
        console.log('item', item)
        query['b.typeCode$VEQ'] = ''
        query['b.action$VEQ'] = ''
        if (item.code) {
          if (item.id !== '0') {
            query['b.typeCode$VEQ'] = item.code
          }
        } else {
          query['b.action$VEQ'] = item.name
        }
        proxy.search()
      }
      const toReset = () => {
        timeRange.value = []
        query.operator$VLK = ''
        query.description$VLK = ''
        query.ip$VLK = ''
        query['a.createTime$DGE'] = ''
        query['a.createTime$DLE'] = ''
        query['b.action$VLK'] = ''
        proxy.search()
      }
      watch(timeRange, (newValue) => {
        query['a.createTime$DGE'] = newValue[0]
        query['a.createTime$DLE'] = newValue[1]
      })

      const dialogVisable = ref(false)
      const rowData: any = ref()
      const opentDialog = (data: any) => {
        rowData.value = data
        dialogVisable.value = true
      }
      const closeDialog = () => {
        dialogVisable.value = false
        rowData.value = null
      }

      sysApi.sysAuditlog.logMetadataTree().then((rel: any) => {
        const date = [
          {
            id: '0',
            name: '所有数据',
            code: '0',
            children: rel,
          },
        ]
        info.dicTree = date
      })

      return {
        query,
        sysApi,
        Delete,
        Edit,
        Search,
        Plus,
        RefreshRight,
        toReset,
        timeRange,
        rowData,
        opentDialog,
        closeDialog,
        dialogVisable,
        info,
        handleNodeClick,
      }
    },
  })
</script>

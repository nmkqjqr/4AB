<template>
  <div class="common-layout">
    <el-container>
      <el-aside class="left-tree">
        <ab-dict-tree
          v-model="query['def.typeCode$VIN']"
          type-code="flowType"
          @node-click="searchResetPage()"
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
                  :model="query"
                  @submit.prevent
                >
                  <el-form-item :label="$abT('page.wfDesign.wfName','流程名称')" prop="def.name$VLK">
                    <el-input
                      v-model="query['def.name$VLK']"
                      :placeholder="$abT('page.wfDesign.pleaseEnterWFName','请输入流程名称')"
                    />
                  </el-form-item>
                  <el-form-item :label="$abT('page.wfDesign.wfCode','流程编码')" prop="def.key$VLK">
                    <el-input
                      v-model="query['def.key$VLK']"
                      :placeholder="$abT('page.wfDesign.pleaseEnterWFCode','请输入流程编码')"
                    />
                  </el-form-item>
                  <el-form-item>
                    <el-button :icon="Search" type="primary" @click="search()">
                      {{ $abT('page.common.search',  '查询' ) }}
                    </el-button>
                    <el-button :icon="RefreshRight" @click="reset()">
                      {{ $abT('page.common.reset','重置') }}
                    </el-button>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col class="left-panel">
                <el-space>
                  <router-link
                    v-ab-btn-rights:openFlow_add
                    :to="{
                      name: 'BpmOpenFlowEdit',
                    }"
                  >
                    <el-button :icon="Plus" type="primary">{{ $abT('page.common.add','添加') }}</el-button>
                  </router-link>
                  <el-button
                    v-ab-btn-rights:openFlow_del
                    :disabled="!selectedData || selectedData.length == 0"
                    :icon="Delete"
                    type="danger"
                    @click="
                      delBySeletedIds(bpmApi.openFlow.bpmOpenFlowRemoveUrl)
                    "
                  >
                    {{ $abT('page.common.batchDel','批量删除') }}
                  </el-button>
                </el-space>
              </el-col>
            </el-row>
          </div>
          <!-- 关键字段设置minwith，特定枚举字段设置with（管理列、日期、状态、字典等），
         不重要字段放最后，管理列设置 fixed="right"
    -->
          <ab-table
            ref="abTable"
            v-model="selectedData"
            :height="tableHeight"
            :query-param="query"
            row-key="id"
            :url="bpmApi.openFlow.bpmOpenFlowListUrl"
          >
            <ab-column :label="$abT('page.wfDesign.wfName','流程名称')" min-width="120" prop="defName" />
            <ab-column :label="$abT('page.wfDesign.wfCode','流程编码')" min-width="120" prop="defKey" />
            <ab-column :label="$abT('page.common.desc','描述')" prop="desc" width="150" />

            <!-- <ab-column
              ab-date-formatter="yyyy-MM-dd HH:mm"
              label="到期时间"
              prop="dueTime"
              width="160"
            /> -->

            <ab-column ab-template="dueTime" :label="$abT('bpm.office.dueTime','到期时间')" width="160" />
            <template #dueTime="{ scope }">
              <span
                v-if="new Date(scope.row.dueTime) < new Date()"
                style="color: crimson"
              >
                {{ scope.row.dueTime }}
              </span>
              <span v-else>{{ scope.row.dueTime }}</span>
            </template>
            <ab-column :label="$abT('page.wfPublicShare.maxAccess','最大访问')" prop="maxVisits" width="100" />
            <ab-column :label="$abT('page.wfPublicShare.Visited','已访问')" prop="visits" width="80" />
            <template #visits="{ scope }">
              <span
                v-if="scope.row.visits >= scope.row.maxVisits"
                style="color: crimson"
              >
                {{ scope.row.maxVisits }}
              </span>
              <span v-else>{{ scope.row.visits }}</span>
            </template>
            <ab-column
              ab-date-formatter="yyyy-MM-dd HH:mm"
              :label="$abT('page.common.updateTime','更新时间')"
              prop="updateTime"
              width="160"
            />
            <ab-column :label="$abT('page.common.updater','更新人')" prop="updater" width="120" />
            <ab-column
              :label="$abT('page.common.status','状态')"
              width="120"
              ab-template="status"
            />
            <template #status="{ scope }">
              <el-tag v-if="scope.row.enabled === 0" type="danger">{{ $abT('page.common.disable','禁用') }}</el-tag>
              <el-tag  v-if="scope.row.enabled === 1" type="success">{{ $abT('page.common.available','可用') }}</el-tag>
              <el-tag  v-if="scope.row.enabled === 100" type="warning">{{ $abT('page.common.numberTimes','限次') }}</el-tag>
              <el-tag  v-if="scope.row.enabled === 200" type="warning">{{ $abT('page.common.overdue','过期') }}</el-tag>
            </template>
            <ab-column
              ab-template="edit"
              fixed="right"
              :label="$abT('page.common.operate','操作')"
              prop="key"
              width="250"
            />
            <template #edit="{ scope }">
              <el-button
                v-if="scope.row.url"
                text
                type="primary"
                @click="openDialog(scope.row)"
              >
                {{ $abT('page.common.QRCode','二维码') }}
              </el-button>
              <router-link
                v-ab-btn-rights:openFlow_edit
                :to="{
                  name: 'BpmOpenFlowEdit',
                  query: {
                    id: scope.row.id,
                  },
                }"
              >
                <el-button text type="primary">{{ $abT('page.common.edit','编辑') }}</el-button>
              </router-link>
              <el-button
                v-ab-btn-rights:openFlow_del
                text
                type="primary"
                @click="
                  sendAction(
                    bpmApi.openFlow.bpmOpenFlowRemoveUrl + scope.row.id,
                     $abT('page.common.delMsg','确定删除 {a} 吗？', { a: scope.row.defName })
                  )
                "
              >
                {{ $abT('page.common.del','删除') }}
              </el-button>
            </template>
          </ab-table>
        </div>
      </el-main>
    </el-container>
    <linkDetail
      v-model="pageData.showLink"
      :open-flow-info="pageData.openFlowInfo"
      @closeDialog="closeDialog()"
    />
  </div>
</template>

<script lang="ts">
  // eslint-disable-next-line no-unused-vars
  import { reactive, defineComponent, getCurrentInstance } from 'vue'
  import { abTableMix, bpmApi, abDictTree, abUtil } from '~/agilebpm'
  import {
    Delete,
    Edit,
    Search,
    Plus,
    RefreshRight,
    Download,
    Upload,
  } from '@element-plus/icons-vue'
  import linkDetail from './linkDetail.vue'

  export default defineComponent({
    name: 'BpmOpenFlowList',
    components: {
      abDictTree,
      linkDetail,
    },
    mixins: [abTableMix],
    setup() {
      // 查询条件定义，如果ts 需要定义所有参数，这里覆盖父类，不是的话可以不用设置，父类已经定义了query 对象
      const query = reactive({
        'def.name$VLK': '',
        'def.key$VLK': '',
        'def.typeCode$VIN': '',
      })

      // @ts-ignore
      const { proxy } = getCurrentInstance()

      const pageData = reactive({
        showLink: false,
        openFlowInfo: null as any,
      })

      const openDialog = (row: any) => {
        pageData.showLink = true
        pageData.openFlowInfo = row
      }
      const closeDialog = () => {
        pageData.openFlowInfo = null
        pageData.showLink = false
      }

      return {
        abUtil,
        query,
        bpmApi,

        Delete,
        Edit,
        Search,
        Plus,
        RefreshRight,
        Download,

        Upload,
        pageData,
        openDialog,
        closeDialog,
      }
    },
  })
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-aside class="left-tree">
        <ab-dict-tree
          v-model="query.typeCode$VIN"
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
                  label-width="120px"
                  :model="query"
                  @submit.prevent
                >
                  <el-form-item :label="$abT('page.wfDesign.wfName','流程名称')" prop="name$VLK">
                    <el-input
                      v-model="query.name$VLK"
                      :placeholder="$abT('page.wfDesign.pleaseEnterWFName','请输入流程名称')"
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
                  <el-button
                    v-ab-btn-rights:simDefinition_add
                    :icon="Plus"
                    type="primary"
                    @click="addSimpleWf('')"
                  >
                    {{ $abT('page.wfDesign.addSimpleWF','添加简式流程') }}
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
            :checkable="false"
            :height="tableHeight"
            is-have-tree
            :query-param="query"
            row-key="id"
            :url="bpmApi.bpmDefinition.bpmDefinitionListUrl"
          >
            <ab-column :label="$abT('page.wfDesign.wfName','流程名称')" min-width="120" prop="name" />
            <ab-column :label="$abT('page.wfDesign.wfCode','流程编码')" min-width="120" prop="key" />
            <ab-column :label="$abT('page.common.desc','描述')" prop="desc" width="150" />

            <ab-column
              :label="$abT('page.common.status','状态')"
              width="100"
              ab-template="status"
            />
            <template #status="{ scope }">
              <el-tag v-if="scope.row.status === 'deploy'" type="success">{{ $abT('page.wfDesign.release','发布') }}</el-tag>
              <el-tag v-if="scope.row.status === 'forbidden'" type="danger">{{ $abT('page.wfDesign.disabled','禁用') }}</el-tag>
              <el-tag  v-if="scope.row.status === 'draft'" type="info">{{ $abT('page.wfDesign.draft','草稿') }}</el-tag>
            </template>
            <ab-column :label="$abT('page.wfDesign.edition','版本')" prop="version" min-width="70" />
            <ab-column :label="$abT('page.wfDesign.sort','排序')" prop="sn" min-width="60" />
            <!-- <ab-column
        ab-text-formatter="bpmn-BPMN-success-dark|simple-简式-primary-dark|empty-待设计-warning-dark"
        label="设计器"
        prop="processEditor"
        width="90"
      /> -->
            <ab-column
              ab-date-formatter="yyyy-MM-dd"
              :label="$abT('page.common.updateTime','更新时间')"
              prop="updateTime"
              min-width="100"
            />
            <ab-column :label="$abT('page.common.updater','更新人')" prop="updater" min-width="100" />
            <ab-column
              ab-template="edit"
              fixed="right"
              :label="$abT('page.common.operate','操作')"
              width="500"
            />
            <template #edit="{ scope }">
              <el-button
                v-ab-btn-rights:simDefinition_design
                text
                type="primary"
                @click="addSimpleWf(scope.row.id)"
              >
                {{ $abT('page.wfDesign.design','设计') }}
              </el-button>
              <el-button
                v-ab-btn-rights:simDefinition_saveAuthorization
                text
                type="primary"
                @click="openAuthoDialog(scope.row.key)"
              >
                {{ $abT('page.common.authorization','授权') }}
              </el-button>
              <router-link
                v-ab-btn-rights:simDefinition_start
                :to="`/bpm/flowStart/${scope.row.key}`"
              >
                <el-button text type="primary">{{ $abT('page.wfDesign.startUp','启动') }}</el-button>
              </router-link>
              <router-link
                v-ab-btn-rights:simDefinition_listJson
                :to="{
                  name: 'BpmDefinitionVersionList',
                  query: { key: scope.row.key },
                }"
              >
                <el-button text type="primary">{{ $abT('page.wfDesign.versionManagement','版本管理') }}</el-button>
              </router-link>
              <el-button
                v-ab-btn-rights:simDefinition_del
                text
                type="primary"
                @click="
                  sendAction(
                    bpmApi.bpmDefinition.bpmDefinitionRemoveUrl + scope.row.id,
                    $abT('page.common.delMsg','确定删除 {a} 吗？', { a: scope.row.name })
                  )
                "
              >
                {{ $abT('page.common.del','删除') }}
              </el-button>
            </template>
          </ab-table>
          <ab-authorization
            v-model="authInfo.showAuthoDialog"
            authorization-type="FLOW"
            :rights-code="authInfo.flowKey"
          />
          <simple-wf
            v-if="designShow"
            v-model="designShow"
            :def-id="designInfo.defId"
            @close="closeDefinition()"
          />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
  // eslint-disable-next-line no-unused-vars
  import { reactive, defineComponent, getCurrentInstance } from 'vue'
  import {
    abTableMix,
    bpmApi,
    abAuthorization,
    abDictTree,
    abTools,
  } from '~/agilebpm'

  import simpleWf from '~/agilebpm/build/simplewf.js'

  import {
    Delete,
    Edit,
    Search,
    Plus,
    RefreshRight,
    ArrowUp,
    ArrowDown,
    Download,
    Upload,
  } from '@element-plus/icons-vue'

  export default defineComponent({
    name: 'BpmDefinitionList',
    components: { abAuthorization, simpleWf, abDictTree },
    mixins: [abTableMix],

    setup() {
      // 查询条件定义，如果ts 需要定义所有参数，这里覆盖父类，不是的话可以不用设置，父类已经定义了query 对象
      const query = reactive({
        name$VLK: '',
        key$VLK: 'sf_',
        typeCode$VIN: '',
        processEditor$VEQ: 'sim',
      })

      const designShow = ref(false)

      const designInfo = reactive({
        defId: '',
        newDefinitionId: '',
      })

      const closeDefinition = () => {
        designShow.value = false
        designInfo.defId = ''
        proxy.search()
      }

      // @ts-ignore
      const { proxy } = getCurrentInstance()

      const addSimpleWf = (id: string) => {
        window.open(
          abTools.getResolveUrl(`/simpleWF?id=${id}&mode=diyBo`, proxy)
        )
      }

      const authInfo = reactive({
        showAuthoDialog: false,
        flowKey: '',
      })
      //授权
      const openAuthoDialog = (flowKey: string) => {
        authInfo.showAuthoDialog = true
        authInfo.flowKey = flowKey
      }
      //导出
      const exportFn = () => {
        const defIds = proxy.selectedData.map((row: any) => row.id).join(',')
        bpmApi.bpmDefinition.exportBpmDef(defIds, exportCallback)
      }
      //导出回调，刷新页面，去掉选中状态
      const exportCallback = () => {
        proxy.selectedData.splice(0, proxy.selectedData.length)
        proxy.search()
      }

      return {
        query,
        bpmApi,
        authInfo,
        abAuthorization,
        openAuthoDialog,
        Delete,
        Edit,
        Search,
        Plus,
        RefreshRight,
        Download,
        exportFn,
        Upload,
        designInfo,
        designShow,
        closeDefinition,
        addSimpleWf,
      }
    },
  })
</script>

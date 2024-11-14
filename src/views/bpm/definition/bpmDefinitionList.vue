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
                  :model="query"
                  @submit.prevent
                >
                  <el-form-item
                    :label="$abT('page.wfDesign.wfName', '流程名称')"
                    prop="name$VLK"
                  >
                    <el-input
                      v-model="query.name$VLK"
                      :placeholder="
                        $abT(
                          'page.wfDesign.pleaseEnterWFName',
                          '请输入流程名称'
                        )
                      "
                    />
                  </el-form-item>
                  <el-form-item
                    :label="$abT('page.wfDesign.wfCode', '流程编码')"
                    prop="key$VLK"
                  >
                    <el-input
                      v-model="query.key$VLK"
                      :placeholder="
                        $abT(
                          'page.wfDesign.pleaseEnterWFCode',
                          '请输入流程编码'
                        )
                      "
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
              <el-col class="left-panel">
                <el-space>
                  <router-link
                    v-if="!abUtil.checkIsPublicProject(true)"
                    v-ab-btn-rights:bpmDefinition_add
                    :to="{
                      name: 'BpmDefinitionEdit',
                      query: { typeCode: query.typeCode$VEQ },
                    }"
                  >
                    <el-button :icon="Plus" type="primary">
                      {{ $abT('page.wfDesign.addBPMNWF', 'BPMN 流程设计') }}
                    </el-button>
                  </router-link>
                  <el-button
                    v-else
                    v-ab-btn-rights:bpmDefinition_add
                    :disabled="true"
                    :icon="Plus"
                    type="primary"
                  >
                    {{ $abT('page.wfDesign.addBPMNWF', 'BPMN 流程设计') }}
                  </el-button>

                  <el-button
                    v-ab-btn-rights:bpmDefinition_export
                    :disabled="!selectedData || selectedData.length == 0"
                    :icon="Download"
                    type="primary"
                    @click="exportFn"
                  >
                    {{ $abT('page.common.export', '导出') }}
                  </el-button>

                  <router-link
                    v-ab-btn-rights:bpmDefinition_import
                    :to="{ name: 'ImportPreview' }"
                  >
                    <el-button :icon="Download" type="primary">
                      {{ $abT('page.common.import', '导入') }}
                    </el-button>
                  </router-link>

                  <router-link
                    v-if="!abUtil.checkIsPublicProject(true)"
                    v-ab-btn-rights:bpmDefinition_edit_user
                    :to="{
                      name: 'BpmDefinitionUserEdit',
                      query: { typeCode: query.typeCode$VEQ },
                    }"
                  >
                    <el-button type="primary">
                      {{
                        $abT(
                          'page.wfDesign.batchNodePersonnel',
                          '批量修改节点人员'
                        )
                      }}
                    </el-button>
                  </router-link>
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
            is-have-tree
            :query-param="query"
            row-key="id"
            :url="bpmApi.bpmDefinition.bpmDefinitionListUrl"
          >
            <ab-column
              :label="$abT('page.wfDesign.wfName', '流程名称')"
              min-width="120"
              prop="name"
            />
            <ab-column
              :label="$abT('page.wfDesign.wfCode', '流程编码')"
              min-width="120"
              prop="key"
            />
            <ab-column
              :label="$abT('page.common.desc', '描述')"
              prop="desc"
              width="150"
            />
            <ab-column
              :label="$abT('page.common.mobile', '移动端')"
              width="130"
              ab-template="supportMobile"
            />
            <template #supportMobile="{ scope }">
              <el-tag v-if="scope.row.supportMobile === 1" type="success">
                {{ $abT('page.common.support', '支持') }}
              </el-tag>
              <el-tag v-if="scope.row.supportMobile === 0" type="info">
                {{ $abT('page.common.dontSupport', '不支持') }}
              </el-tag>
            </template>
            <ab-column
              :label="$abT('page.common.status', '状态')"
              width="100"
              ab-template="status"
            />
            <template #status="{ scope }">
              <el-tag v-if="scope.row.status === 'deploy'" type="success">
                {{ $abT('page.wfDesign.release', '发布') }}
              </el-tag>
              <el-tag v-if="scope.row.status === 'forbidden'" type="danger">
                {{ $abT('page.wfDesign.disabled', '禁用') }}
              </el-tag>
              <el-tag v-if="scope.row.status === 'draft'" type="info">
                {{ $abT('page.wfDesign.draft', '草稿') }}
              </el-tag>
            </template>
            <ab-column
              :label="$abT('page.wfDesign.edition', '版本')"
              prop="version"
              min-width="70"
            />
            <ab-column
              :label="$abT('page.wfDesign.sort', '排序')"
              prop="sn"
              min-width="60"
            />
            <ab-column
              :label="$abT('page.wfDesign.designer', '设计器')"
              ab-template="processEditor"
              width="100"
            />
            <template #processEditor="{ scope }">
              <el-tag v-if="scope.row.processEditor === 'bpmn'" type="success">
                {{ $abT('page.wfDesign.BPMN', 'BPMN') }}
              </el-tag>
              <el-tag
                v-if="scope.row.processEditor === 'simple'"
                type="primary"
              >
                {{ $abT('page.wfDesign.simplified', '简式') }}
              </el-tag>
              <el-tag v-if="scope.row.processEditor === 'empty'" type="warning">
                {{ $abT('page.wfDesign.toBeDesigned', '待设计') }}
              </el-tag>
            </template>
            <ab-column
              ab-date-formatter="yyyy-MM-dd"
              :label="$abT('page.common.updateTime', '更新时间')"
              prop="updateTime"
              min-width="110"
            />
            <ab-column
              :label="$abT('page.common.updater', '更新人')"
              prop="updater"
              min-width="100"
            />
            <ab-column
              ab-template="edit"
              fixed="right"
              :label="$abT('page.common.operate', '操作')"
              width="360"
            />
            <template #edit="{ scope }">
              <el-button
                v-ab-btn-rights:bpmDefinition_design
                text
                type="primary"
                @click="showDesign(scope.row.id)"
              >
                {{ $abT('page.wfDesign.design', '设计') }}
              </el-button>
              <el-button
                v-ab-btn-rights:bpmDefinition_authorizations
                text
                type="primary"
                @click="openAuthoDialog(scope.row.key)"
              >
                {{ $abT('page.common.authorization', '授权') }}
              </el-button>
              <router-link
                v-ab-btn-rights:bpmDefinition_start
                :to="`/bpm/flowStart/${scope.row.key}`"
              >
                <el-button text type="primary">
                  {{ $abT('page.wfDesign.startUp', '启动') }}
                </el-button>
              </router-link>
              <el-dropdown trigger="click">
                <el-button :icon="ArrowDown" text type="primary">
                  {{ $abT('page.common.more', '更多') }}
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <span v-ab-btn-rights:bpmDefinition_definitionVersionList>
                      <el-dropdown-item>
                        <router-link
                          :to="{
                            name: 'BpmDefinitionVersionList',
                            query: { key: scope.row.key },
                          }"
                        >
                          {{
                            $abT('page.wfDesign.versionManagement', '版本管理')
                          }}
                        </router-link>
                      </el-dropdown-item>
                    </span>
                    <span v-ab-btn-rights:bpmDefinition_edit>
                      <router-link
                        :to="{
                          name: 'BpmDefinitionEdit',
                          query: { id: scope.row.id },
                        }"
                      >
                        <el-dropdown-item>
                          <el-button type="text" primary>
                            {{ $abT('page.common.edit', '编辑') }}
                          </el-button>
                        </el-dropdown-item>
                      </router-link>
                    </span>
                    <span v-ab-btn-rights:bpmDefinition_copy>
                      <el-dropdown-item
                        :disabled="scope.row.processEditor === 'empty'"
                        @click="bpmDefinitionDuplicateInfo.show(scope.row)"
                      >
                        <a href="javascript:void(0)">
                          {{ $abT('page.common.copy', '复制') }}
                        </a>
                      </el-dropdown-item>
                    </span>
                    <span v-ab-btn-rights:bpmDefinition_startTest>
                      <el-dropdown-item>
                        <router-link
                          :to="`/bpm/flowStartTest/${scope.row.key}`"
                        >
                          {{ $abT('page.wfDesign.processTest', '流程测试') }}
                        </router-link>
                      </el-dropdown-item>
                    </span>
                    <span v-ab-btn-rights:bpmDefinition_del>
                      <el-dropdown-item
                        @click="
                          sendAction(
                            bpmApi.bpmDefinition.bpmDefinitionRemoveUrl +
                              scope.row.id,
                            $abT('page.common.delMsg', '确定删除 {a} 吗？', {
                              a: scope.row.name,
                            })
                          )
                        "
                      >
                        <a href="javascript:void(0)">
                          {{ $abT('page.common.del', '删除') }}
                        </a>
                      </el-dropdown-item>
                    </span>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </ab-table>
          <ab-authorization
            v-model="authInfo.showAuthoDialog"
            authorization-type="FLOW"
            :rights-code="authInfo.flowKey"
          />
          <ab-designer
            v-if="designShow"
            v-model="designShow"
            :def-id="designInfo.defId"
            @close="closeDefinition()"
          />
          <bpm-definition-duplicate-dialog
            :flow-key="bpmDefinitionDuplicateInfo.flowKey"
            :flow-name="bpmDefinitionDuplicateInfo.flowName"
            :type-code="bpmDefinitionDuplicateInfo.typeCode"
            :visible="bpmDefinitionDuplicateInfo.visible"
            @close="bpmDefinitionDuplicateInfo.close"
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
    abUtil,
    abTools,
  } from '~/agilebpm'
  import abDesigner from '~/agilebpm/build/flowDesigner.js'

  import { useZIndex } from 'element-plus'
  // import { setupZIndex } from '~/agilebpm/build/flowDesigner.js'

  // setupZIndex(useZIndex)

  import {
    Delete,
    Edit,
    Search,
    Plus,
    RefreshRight,
    Download,
    Upload,
    ArrowDown,
  } from '@element-plus/icons-vue'
  import BpmDefinitionDuplicateDialog from './bpmDefinitionDuplicateDialog.vue'
  import { ElMessage } from 'element-plus'
  import { abT } from '~/src/i18n'
  export default defineComponent({
    name: 'BpmDefinitionList',
    components: {
      abAuthorization,
      abDesigner,
      abDictTree,
      BpmDefinitionDuplicateDialog,
    },
    mixins: [abTableMix],
    setup() {
      // 查询条件定义，如果ts 需要定义所有参数，这里覆盖父类，不是的话可以不用设置，父类已经定义了query 对象
      const query = reactive({
        name$VLK: '',
        key$VLK: '',
        typeCode$VIN: '',
        processEditor$VIN: ['bpmn', 'empty'],
      })

      const designShow = ref(false)

      const designInfo = reactive({
        defId: '',
        newDefinitionId: '',
      })

      const showDesign = (defId: string) => {
        window.open(abTools.getResolveUrl(`/bpmDesigner?defId=${defId}`, proxy))
      }
      const closeDefinition = () => {
        designShow.value = false
        designInfo.defId = ''
        proxy.search()
      }

      // @ts-ignore
      const { proxy } = getCurrentInstance()

      // 新建流程后，进入页面自动打开设计器
      watch(
        () => proxy.$route.query.newDefinitionId,
        (id) => {
          if (!id || designInfo.newDefinitionId == id) return
          designInfo.newDefinitionId = id
          proxy.search()
          showDesign(id)
        }
      )
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
        const noDefSetting = proxy.selectedData.find((e: any) => {
          return e.processEditor === 'empty'
        })
        if (noDefSetting) {
          ElMessage.error(
            abT(
              'page.wfDesign.exportedErrorMsg',
              '流程{a}没有完成流程设计，不能导出！',
              { a: '【' + noDefSetting.name + '】' }
            )
          )
          return
        }

        const defIds = proxy.selectedData.map((row: any) => row.id).join(',')
        bpmApi.bpmDefinition.exportBpmDef(defIds, exportCallback)
      }
      //导出回调，刷新页面，去掉选中状态
      const exportCallback = () => {
        proxy.selectedData.splice(0, proxy.selectedData.length)
        proxy.search()
      }
      //导入，刷新页面，去掉选中状态
      watch(
        () => proxy.$route.query.doRef,
        (newValue) => {
          if (newValue) {
            exportCallback()
          }
        }
      )

      // 流程定义复制信息
      const bpmDefinitionDuplicateInfo = reactive({
        visible: false,
        flowKey: '',
        flowName: '',
        typeCode: '',
        show(bpmDefinition: any) {
          bpmDefinitionDuplicateInfo.flowKey = bpmDefinition.key
          bpmDefinitionDuplicateInfo.flowName = bpmDefinition.name
          bpmDefinitionDuplicateInfo.typeCode = bpmDefinition.typeCode
          bpmDefinitionDuplicateInfo.visible = true
        },
        close(newDefId: string) {
          bpmDefinitionDuplicateInfo.visible = false
          // 新流程定义ID
          if (newDefId) {
            designInfo.newDefinitionId = newDefId
            proxy.search()
            showDesign(newDefId)
          }
        },
      })

      return {
        abUtil,
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
        showDesign,
        closeDefinition,
        bpmDefinitionDuplicateInfo,
      }
    },
    computed: {
      ArrowDown() {
        return ArrowDown
      },
    },
  })
</script>

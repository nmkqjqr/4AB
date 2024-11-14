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
                  label-width="120px"
                  :model="query"
                  @submit.prevent
                >
                  <el-form-item
                    :label="$abT('page.insList.processTitle', '流程标题')"
                    prop="title$VLK"
                  >
                    <el-input
                      v-model="query.title$VLK"
                      :placeholder="
                        $abT('page.insList.enterProcessTitle', '请输入流程标题')
                      "
                    />
                  </el-form-item>
                  <el-form-item
                    :label="$abT('page.wfDesign.wfCode', '流程编码')"
                    prop="defKey$VLK"
                  >
                    <el-input
                      v-model="query.defKey$VLK"
                      :placeholder="
                        $abT(
                          'page.wfDesign.pleaseEnterWFCode',
                          '请输入流程编码'
                        )
                      "
                    />
                  </el-form-item>
                  <el-form-item
                    :label="$abT('page.common.status', '状态')"
                    label-width="62px"
                    prop="status$VEQ"
                  >
                    <el-select
                      v-model="query.status$VEQ"
                      :placeholder="$abT('page.common.all', '全部')"
                      clearable
                    >
                      <el-option
                        :label="
                          $abT(
                            'constant.InstanceStatus.RUNNING.value',
                            '运行中'
                          )
                        "
                        value="running"
                      />
                      <el-option
                        :label="
                          $abT(
                            'constant.InstanceStatus.COMPLETED.value',
                            '完成'
                          )
                        "
                        value="completed"
                      />
                      <el-option
                        :label="
                          $abT('constant.InstanceStatus.DRAFT.value', '草稿')
                        "
                        value="draft"
                      />
                      <el-option
                        :label="
                          $abT('constant.InstanceStatus.REJECT.value', '驳回')
                        "
                        value="reject"
                      />
                      <el-option
                        :label="
                          $abT(
                            'constant.InstanceStatus.CANCELLED.value',
                            '进入边界'
                          )
                        "
                        value="cancelled"
                      />
                      <el-option
                        :label="
                          $abT(
                            'constant.InstanceStatus.MANUAL_END.value',
                            '人工终止'
                          )
                        "
                        value="manualEnd"
                      />
                      <el-option
                        :label="
                          $abT('constant.InstanceStatus.RECALL.value', '撤回')
                        "
                        value="recall"
                      />
                      <el-option
                        :label="
                          $abT(
                            'constant.InstanceStatus.REVOKE_END.value',
                            '撤销终止'
                          )
                        "
                        value="revoke_end"
                      />
                      <el-option
                        :label="
                          $abT(
                            'constant.InstanceStatus.UNDEFINED.value',
                            '未定义'
                          )
                        "
                        value="undefined"
                      />
                    </el-select>
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
            <el-row>
              <el-space wrap>
                <div>
                  <ab-cust-dialog
                    dialog-key="bpmDefinitionSelector"
                    type="primary"
                    :dialog-setting="{ multiple: 0 }"
                    :icon="Plus"
                    @ok="startInstanceTest"
                  >
                    启动
                  </ab-cust-dialog>
                </div>
                <div>
                  <el-button
                    v-ab-btn-rights:instance_del
                    :disabled="!selectedData || selectedData.length == 0"
                    :icon="Delete"
                    type="danger"
                    @click="
                      delBySeletedIds(bpmApi.instance.bpmInstanceDeleteUrl)
                    "
                  >
                    {{ $abT('page.common.batchDel', '批量删除') }}
                  </el-button>
                </div>
              </el-space>
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
            :url="bpmApi.instance.bpmInstanceListUrl"
          >
            <ab-column
              :label="$abT('page.insList.processTitle', '流程标题')"
              min-width="250"
              prop="title"
            />
            <ab-column
              :label="$abT('page.wfDesign.wfCode', '流程编码')"
              min-width="150"
              prop="defKey"
            />
            <ab-column
              :label="$abT('page.insList.suspend', '挂起')"
              min-width="90"
              ab-template="suspensionState"
            />
            <template #suspensionState="{ scope }">
              <el-tag v-if="scope.row.suspensionState === 0" type="success">
                {{ $abT('page.common.no', '否') }}
              </el-tag>
              <el-tag v-if="scope.row.suspensionState === 1" type="danger">
                {{ $abT('page.common.yes', '是') }}
              </el-tag>
            </template>
            <ab-column
              ab-tag-type="statusCss"
              :label="$abT('page.common.status', '状态')"
              prop="statusDesc"
              min-width="180"
            />
            <ab-column
              :label="$abT('page.common.createTime', '创建时间')"
              prop="createTime"
              min-width="160"
            />
            <ab-column
              :label="$abT('page.common.creator', '创建人')"
              prop="creator"
              min-width="100"
            />
            <ab-column
              :label="$abT('page.common.completionTime', '完成时间')"
              prop="endTime"
              min-width="160"
            />
            <ab-column
              ab-template="durMs"
              :label="$abT('page.common.duration', '持续时间')"
              min-width="180"
            />
            <template #durMs="{ scope }">
              {{ abUtil.timeLag(scope.row.durationMs, 2) }}
            </template>
            <ab-column
              :label="$abT('page.common.updateTime', '更新时间')"
              prop="updateTime"
              width="160"
            />
            <ab-column
              ab-template="edit"
              fixed="right"
              :label="$abT('page.common.manage', '管理')"
              width="350"
            />
            <template #edit="{ scope }">
              <router-link
                v-ab-btn-rights:instance_detail
                :to="{
                  name: 'BpmInstanceListDetail',
                  query: { id: scope.row.id },
                }"
              >
                <el-button text type="primary">
                  {{ $abT('page.common.details', '详情') }}
                </el-button>
              </router-link>
              <el-button
                v-ab-btn-rights:instance_del
                text
                type="primary"
                @click="
                  sendAction(
                    bpmApi.instance.bpmInstanceDeleteUrl + scope.row.id,
                    $abT('page.common.delMsg', '确定删除 {a} 吗？', {
                      a: scope.row.title,
                    })
                  )
                "
              >
                {{ $abT('page.common.del', '删除') }}
              </el-button>
              <el-button
                v-ab-btn-rights:instance_imageInfo
                text
                type="primary"
                @click="openImageDialog(scope.row.id)"
              >
                {{ $abT('bpm.office.flowChart', '流程图') }}
              </el-button>
              <el-button
                v-if="
                  scope.row.suspensionState === 0 &&
                  scope.row.status != 'completed' &&
                  scope.row.status != 'draft' &&
                  scope.row.status != 'manualEnd' &&
                  scope.row.status != 'revoke_end'
                "
                v-ab-btn-rights:instance_toForbidden
                text
                type="primary"
                @click="forbidden(scope.row)"
              >
                {{ $abT('page.insList.suspend', '挂起') }}
              </el-button>
              <el-button
                v-if="scope.row.suspensionState === 1"
                v-ab-btn-rights:instance_toForbidden
                text
                type="primary"
                @click="forbidden(scope.row)"
              >
                {{ $abT('page.insList.Unsuspend', '取消挂起') }}
              </el-button>
            </template>
          </ab-table>
          <bpm-image-dialog
            v-if="flowImageInfo.showImageDialog"
            :bpm-data="flowImageInfo.bpmData"
            :is-show="flowImageInfo.showImageDialog"
            :title="$abT('bpm.office.flowChart', '流程图')"
            @dialog-cancel="dialogCancel"
          />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
  import { abTableMix } from '~/agilebpm'

  export default defineComponent({
    name: 'BpmInstanceTestList',
    mixins: [abTableMix],
  })
</script>

<script lang="ts" setup>
  import { bpmApi, abUtil, BpmImageDialog } from '~/agilebpm'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { Delete, Search, Plus, RefreshRight } from '@element-plus/icons-vue'
  import { abT } from '@/i18n'

  const { proxy } = getCurrentInstance()
  const router = useRouter()

  const query = reactive({
    title$VLK: '',
    defKey$VLK: '',
    defKey$VEQ: '',
    status$VEQ: '',
    createTime$DGE: '',
    createTime$DLE: '',
    isTest: 1,
  })

  const flowImageInfo = reactive({
    showImageDialog: false,
    bpmData: {
      actionData: {
        instanceId: '',
      },
    } as BpmData,
  })

  const openImageDialog = (instaceId: string) => {
    flowImageInfo.showImageDialog = true
    flowImageInfo.bpmData.actionData.instanceId = instaceId
  }

  const dialogCancel = (isShow: boolean) => {
    flowImageInfo.showImageDialog = false
  }

  const forbidden = (row: any) => {
    ElMessageBox.confirm(
      row.suspensionState == 1
        ? abT('page.insList.confirmUnsuspend', '确定要取消挂起流程{a}吗？', {
            a: row.title,
          })
        : abT('page.insList.confirmSuspend', '确定要挂起流程{a}吗？', {
            a: row.title,
          }),
      abT('page.common.prompt', '提示'),
      {
        confirmButtonText: abT('page.common.ok', '确定'),
        cancelButtonText: abT('page.common.cancel', '取消'),
        type: 'warning',
      }
    ).then(async () => {
      const forbiddenFlag = row.suspensionState != 1
      await bpmApi.instance.toForbidden(row.id, forbiddenFlag).then(
        (result: any) => {
          proxy.search()
          ElMessage({
            type: 'success',
            message: abT('page.common.operateSuccess', '操作成功'),
            onClose: () => {},
          })
        },
        () => {}
      )
    })
  }

  const startInstanceTest = (data: any) => {
    if (data) {
      const defKey = data[0]['key']
      router.push(`/bpm/instanceTest/${defKey}/start`)
    }
  }
</script>

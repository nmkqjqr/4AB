<template>
  <el-dialog
    :append-to-body="true"
    :before-close="dialogCancel"
    :model-value="props.isShow"
    :title="props.title"
    width="60%"
  >
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
                    label-width="50px"
                    :model="pageData.query"
                    @submit.prevent
                  >
                    <el-form-item
                      :label="$abT('bpm.office.processStatus', '流程状态')"
                      label-width="120"
                      prop="inst.status$VEQ"
                    >
                      <el-select
                        v-model="pageData.query['inst.status$VEQ']"
                        :placeholder="
                          $abT('page.common.selectStatus', '请选择状态')
                        "
                      >
                        <el-option
                          v-for="(item, index) in pageData.statusList"
                          :key="index"
                          :label="item.value"
                          :value="item.key"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-button
                        :icon="Search"
                        type="primary"
                        @click="search()"
                      >
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
            <!-- 关键字段设置minwith，特定枚举字段设置with（管理列、日期、状态、字典等），
         不重要字段放最后，管理列设置 fixed="right"
    -->
            <ab-table
              ref="abTable"
              v-model="selectedData"
              :checkable="false"
              :height="500"
              highlight-current-row
              :query-param="pageData.query"
              row-key="id"
              :url="bpmApi.myTask.bpmMyApplyTaskListUrl"
            >
              <ab-column
                :label="$abT('menu.BPM', '流程')"
                min-width="120"
                prop="defName"
              />
              <ab-column
                :label="$abT('bpm.office.processTitle', '流程标题')"
                min-width="300"
                prop="title"
              />
              <ab-column
                ab-tag-type="statusCss"
                :label="$abT('page.common.status', '状态')"
                prop="statusDesc"
                width="95"
              />
              <ab-column
                :label="$abT('page.common.createTime', '创建时间')"
                prop="createTime"
                width="180"
              />
              <ab-column
                :label="$abT('page.common.creator', '创建人')"
                prop="creator"
                width="120"
              />
              <ab-column
                :label="$abT('page.common.completionTime', '完成时间')"
                prop="endTime"
                width="160"
              />
              <ab-column
                ab-template="edit"
                fixed="right"
                :label="$abT('page.common.operate', '操作')"
                width="150"
              />
              <template #edit="{ scope }">
                <el-button text type="primary">
                  <instance-detail
                    :instance-id="scope.row.id"
                    text
                    type="primary"
                  >
                    {{ $abT('page.common.details', '详情') }}
                  </instance-detail>
                </el-button>
                <el-button
                  text
                  type="primary"
                  @click="
                    cloneBizData(scope.row.id, props.bpmData.bpmForm?.boCode)
                  "
                >
                  {{ $abT('page.common.copy', '复制') }}
                </el-button>
              </template>
            </ab-table>
          </div>
        </el-main>
      </el-container>
    </div>
    <template #footer>
      <el-button text type="primary" @click="dialogCancel()">
        {{ $abT('page.common.cancel', '取消') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
  // eslint-disable-next-line no-unused-vars
  import {
    reactive,
    defineComponent,
    onMounted,
    getCurrentInstance,
    PropType,
  } from 'vue'
  import abTableMix from '../../ab-core/components/ab-table/ab-table-mix.vue'
  import { bpmApi, sysApi } from '~/agilebpm/api'
  import { Search, Plus, RefreshRight } from '@element-plus/icons-vue'
  import instanceDetail from './componets/instance-detail-dialog.vue'
  export default defineComponent({
    components: { instanceDetail },
    mixins: [abTableMix],
    props: {
      bpmData: { required: true, type: Object as PropType<BpmData> },
      /** 是否展示对话框 */
      isShow: { required: true, type: Boolean },
      title: { required: false, type: String, default: '意见' },
    },
    setup(props) {
      const pageData = reactive({
        query: {
          'def.id$VEQ': props.bpmData.actionData.defId,
          'inst.status$VEQ': '',
        },
        statusList: [] as any[],
        detailShow: false,
        formData: {} as any,
        bpmData: {} as any,
      })

      const { actionData } = toRefs(props.bpmData)

      const vueContext = getCurrentInstance()
      // 关闭对话框
      const dialogCancel = () => {
        vueContext?.emit('dialogCancel', false)
      }

      const cloneBizData = (instanceId: any, boCode: any) => {
        bpmApi.instance.cloneBizData(instanceId, boCode).then(({ data }) => {
          if (props.bpmData.bpmForm && props.bpmData.bpmForm.boCode) {
            actionData.value.data[props.bpmData.bpmForm.boCode] = data
          }
          dialogCancel()
        })
      }
      onMounted(() => {
        sysApi.tools
          .getEnum('com.dstz.bpm.api.enums.InstanceStatus')
          .then((result) => {
            pageData.statusList = result.data
          })
      })

      return {
        pageData,
        bpmApi,
        props,
        cloneBizData,
        dialogCancel,
        Search,
        Plus,
        RefreshRight,
      }
    },
  })
</script>

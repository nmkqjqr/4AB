<template>
  <div>
    <div class="common-layout">
      <!-- 左侧树 -->
      <!-- 是否启用 -->
      <el-container v-if="info.data.status == 1">
        <el-aside
          v-if="info.data && info.data.leftTreeMap.showTree == '1'"
          v-loading="info.treeDataLoading"
          class="left-tree"
          style="border-right: 10px solid #f5f7f9"
          :style="{ height: info.rightHeight }"
        >
          <el-scrollbar>
            <div class="scrollbar-flex-content">
              <leftTree :data="info.data" @list-query="listQuery" />
            </div>
          </el-scrollbar>
        </el-aside>
        <el-main>
          <div class="comprehensive-table-container">
            <el-row class="vab-query-form">
              <el-col class="top-panel">
                <el-form
                  ref="queryForm"
                  :inline="true"
                  label-width="100px"
                  :model="info.query.params"
                  @submit.prevent
                >
                  <template
                    v-for="(item, index) in info.data.sqlConditionVOS.filter(
                      (itemSql) => itemSql.showType !== '2'
                    )"
                    :key="item.fieldDesc"
                  >
                    <!-- 查询条件 -->
                    <template v-if="index < 3">
                      <formItem
                        ref="formItemRef"
                        :item="item"
                        :query-param="
                          item.dialogConf && item.dialogConf.queryParam
                            ? item.dialogConf.queryParam
                            : false
                        "
                        @handle-query="listFn()"
                        @to-item="getItem"
                      />
                    </template>
                    <template v-else>
                      <formItem
                        v-show="collapse"
                        ref="formItemRef"
                        :item="item"
                        :query-param="
                          item.dialogConf && item.dialogConf.queryParam
                            ? item.dialogConf.queryParam
                            : false
                        "
                        @handle-query="listFn()"
                        @to-item="getItem"
                      />
                    </template>
                  </template>
                  <el-form-item
                    v-if="
                      (info.data.sqlConditionVOS &&
                        info.data.sqlConditionVOS.filter(
                          (itemSql) => itemSql.showType !== '2'
                        ).length > 0) ||
                      info.data.initQuery == 0
                    "
                  >
                    <el-button :icon="Search" type="primary" @click="listFn()">
                      {{ $abT('page.common.search', '查询') }}
                    </el-button>
                    <el-button :icon="RefreshRight" @click="resetquery()">
                      {{ $abT('page.common.reset', '重置') }}
                    </el-button>
                    <el-button
                      v-if="
                        info.data.sqlConditionVOS.filter(
                          (itemSql) => itemSql.showType !== '2'
                        ).length > 3
                      "
                      link
                      type="primary"
                      @click="handleCollapse()"
                    >
                      <span v-if="!collapse" type="primary">{{$abT('page.common.expand','展开')}}</span>
                      <span v-else type="primary">{{$abT('page.common.merge','合并')}}</span>
                      <el-icon class="el-icon--right">
                        <arrow-down v-if="!collapse" />
                        <ArrowUp v-else />
                      </el-icon>
                    </el-button>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col
                v-if="info.allButton && info.allButton.length > 0"
                class="left-panel"
              >
                <!-- 全局按钮 -->
                <operation-btn
                  :all-button="info.allButton"
                  :code="info.code"
                  :data="info.data"
                  :list="info.tableData"
                  :multiple-selection="multipleSelection"
                  :query="info.query"
                  :template-selection="info.templateSelection"
                  @href-set="localAllClickFn"
                  @query-list-fn="listFn"
                />
              </el-col>
            </el-row>
            <el-tabs
              v-if="info.data.gridType === 'app'"
              v-model="info.query.appQueryType"
              class="demo-tabs"
              style="margin-top: 12px"
              @tab-click="handleAppQueryTypeClick"
            >
              <el-tab-pane
                :label="$abT('page.home.todo', '待办')"
                name="todoTask"
              />
              <el-tab-pane
                :label="$abT('page.home.completed', '已办')"
                name="approve"
              />
              <el-tab-pane
                :label="$abT('page.home.myCC', '我的抄送')"
                name="receive"
              />
              <el-tab-pane
                :label="$abT('page.home.initiated', '我发起的')"
                name="applyTask"
              />
            </el-tabs>
            <!--多选情况下 已选择-->
            <el-alert
              v-if="info.data.chooseType == 2"
              :closable="false"
              show-icon
              style="margin-top: 20px; margin-bottom: 10px"
              type="info"
            >
              <template #title>
                <span style="color: black">{{$abT('page.common.selected','已选择')}} &nbsp;</span>
                <strong style="color: #2d8cf0">
                  {{ info.selectedData.length }}
                </strong>
                <el-link
                  style="margin-left: 30px; font-size: 13px"
                  :underline="false"
                  @click="clearSelectedData"
                >
                  {{$abT('page.common.clearSelect','清空已选择')}}
                </el-link>
              </template>
            </el-alert>
            <!-- 列表 -->
            <!-- ref="abTable" -->
            <el-table
              ref="tableRef"
              v-loading="info.loading"
              border
              :cell-style="addClass"
              class="no-hover"
              :data="info.tableData"
              element-loading-background="rgba(0, 0, 0, 0)"
              :height="!props.layoutDesign ? info.tableHeight : 'auto'"
              :row-key="info.data.pkName + abUtil.AbRandom.GetRandomStr(6)"
              :row-style="setRowBackgroundColor"
              style="width: 100%"
              :style="{ marginTop: info.data.gridType !== 'app' ? '18px' : '' }"
              @current-change="getTemplateRow"
              @row-click="clickTable"
              @selection-change="handleSelectionChange"
              @sort-change="sortChange"
            >
              <tableColumn
                ref="tableColumnRef"
                :data="info.data"
                :fields-list="info.fieldsList"
                :lin-button="info.linButton"
                :list="info.tableData"
                :query="info.query"
                @href-setting-set-fn="localclickFn"
                @list-fn="listFn"
                @top-dialog="topTopDialog"
                @type-drawer="drawerDialog"
              />
            </el-table>
            <!--分页-->
            <el-pagination
              v-model:currentPage="info.query.currentPage"
              v-model:page-size="info.query.pageSize"
              :background="true"
              :disabled="false"
              layout="prev, pager, next, jumper,total, sizes"
              :page-sizes="[5, 10, 20, 50, 100, 200, 500]"
              :pager-count="5"
              :total="info.total"
              @current-change="listFn"
              @size-change="listFn"
            />
          </div>
        </el-main>
      </el-container>
    </div>
    <el-dialog
      ref="topDiaStyle"
      v-model="info.dialogVisible"
      :append-to-body="true"
      class="topDiaStyle"
      :title="$abT('page.common.preview','预览')"
      :width="info.hrefSetting.width + info.hrefSetting.widthUnit"
    >
      <iframe
        id="iframe"
        frameborder="0"
        :height="info.iframeHeight"
        :src="info.hrefSettingUrl"
        width="100%"
      ></iframe>
    </el-dialog>
    <el-drawer
      v-model="info.openTypedrawerShow"
      :append-to-body="true"
      :destroy-on-close="true"
      size="70%"
      :with-header="false"
    >
      <div
        v-if="
          info.typedrawerObj.component == 'FormViewEdit' ||
          info.typedrawerObj.component == 'FormViewDetail'
        "
      >
        <formPreview
          :params-data="info.paramsData"
          @close-drawer="closeTypeDrawer"
        />
      </div>
      <div v-else-if="info.typedrawerObj.component == 'FormViewCombination'">
        <div
          style="
            position: fixed;
            top: 10px;
            right: 15px;
            z-index: 99;
            cursor: pointer;
          "
          @click="closeTypeDrawer"
        >
          <el-icon :size="20"><Close /></el-icon>
        </div>
        <FormCombinationPreview
          v-if="info.combinationData.code && info.combinationDataShow"
          :design-code="info.combinationData.code"
          :design-json="info.combinationData.designJson"
          :params="info.combinationData.varibales"
        />
      </div>
      <div v-else style="width: 100%; height: 100%">
        <div
          style="
            position: fixed;
            top: 5px;
            right: 5px;
            z-index: 99;
            cursor: pointer;
          "
          @click="closeTypeDrawer"
        >
          <el-icon :size="20"><Close /></el-icon>
        </div>
        <iframe
          id="iframeDrawer"
          frameborder="0"
          height="100%"
          :src="info.hrefSettingUrl"
          width="100%"
        ></iframe>
      </div>
    </el-drawer>
    <el-dialog
      v-model="info.openTypedialogShow"
      :append-to-body="true"
      class="dialogShow-style"
      :destroy-on-close="true"
      :style="{ height: '90%' }"
      top="5vh"
      width="70%"
    >
      <div
        v-if="
          info.typedrawerObj.component == 'FormViewEdit' ||
          info.typedrawerObj.component == 'FormViewDetail'
        "
      >
        <formPreview
          :params-data="info.paramsData"
          @close-drawer="closeTypeDrawer"
        />
      </div>
      <div v-else-if="info.typedrawerObj.component == 'FormViewCombination'">
        <div
          style="
            position: fixed;
            top: 10px;
            right: 15px;
            z-index: 99;
            cursor: pointer;
          "
          @click="closeTypeDrawer"
        >
          <el-icon :size="20"><Close /></el-icon>
        </div>
        <FormCombinationPreview
          v-if="info.combinationData.code && info.combinationDataShow"
          :design-code="info.combinationData.code"
          :design-json="info.combinationData.designJson"
          :params="info.combinationData.varibales"
        />
      </div>
      <div v-else style="width: 100%; height: 100%">
        <div
          style="
            position: fixed;
            top: 5px;
            right: 5px;
            z-index: 99;
            cursor: pointer;
          "
          @click="closeTypeDrawer"
        >
          <el-icon :size="20"><Close /></el-icon>
        </div>
        <iframe
          id="iframeDrawer"
          frameborder="0"
          height="100%"
          :src="info.hrefSettingUrl"
          width="100%"
        ></iframe>
      </div>
    </el-dialog>
    <el-drawer
      v-model="info.drawerShow"
      :append-to-body="true"
      :destroy-on-close="true"
      size="70%"
      :with-header="false"
    >
      <div>
        <formPreview
          :params-data="info.paramsData"
          @close-drawer="closeDrawer"
        />
      </div>
    </el-drawer>
    <el-dialog
      v-model="info.dialogShow"
      :append-to-body="true"
      :destroy-on-close="true"
      top="5vh"
      width="70%"
    >
      <div>
        <formPreview
          :params-data="info.paramsData"
          @close-drawer="closeDialog"
        />
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
  import abTableMix from '../../ab-core/components/ab-table/ab-table-mix.vue'
  export default {
    name: 'FormCustSqlView',
    mixins: [abTableMix],
  }
</script>
<script setup lang="ts">
  import { abFormCombinationPreview as FormCombinationPreview } from '~/agilebpm/build/combinationApp.js'
  import useAbStoreAdapter from '../../../api/ab-store'
  // eslint-disable-next-line no-unused-vars
  import { RefreshRight, Search } from '@element-plus/icons-vue'
  import type { FormInstance } from 'element-plus'
  import { ElMessage, ElMessageBox, ElTable } from 'element-plus'
  import { reactive, ref } from 'vue'
  import { abUtil, formPreview } from '~/agilebpm'
  import { bizApi, bpmApi, getData, postData, sysApi ,appsquareApi} from '~/agilebpm/api'
  import * as abTools from '~/agilebpm/utils/ab-tools'
  import formItem from './formItem.vue'
  import leftTree from './leftTree.vue'
  import operationBtn from './operationBtn.vue'
  import tableColumn from './tableColumn.vue'
  const emit = defineEmits([
    'currentChange',
    'clickTable',
    'handleSelectionChange',
  ])
  const props = defineProps({
    code: {
      default: '',
      type: String,
    },
    comBinCondition: {
      default: null,
      type: Array,
    },
    isReloadCom: {
      type: Array,
      default: null,
    },
    componentList: {
      default: null,
      type: Array,
    },
    layoutDesign: {
      default: false,
      type: Boolean,
    },
  })
  //引入 当前实例
  const { proxy } = abTools.useCurrentInstance()

  const abUser = useAbStoreAdapter().getAbUser
  const abcurrentOrg = useAbStoreAdapter().getCurrentOrg
  // 查询条件定义，如果ts 需要定义所有参数，这里覆盖父类，不是的话可以不用设置，父类已经定义了query 对象
  const ruleFormRef = ref<FormInstance>()
  // 列表多选数组
  const multipleSelection = ref<User[]>([])
  const tableRef = ref<InstanceType<typeof ElTable>>()
  const topDiaStyle = ref()
  const tableColumnRef = ref()
  const formItemRef = ref()
  const info: any = reactive({
    details: {},
    templateRadio: false,
    templateSelection: {},
    code: '',
    data: {},
    leftTree: {},
    rightHeight: `${window.innerHeight - 210}px`,
    buttons: [],
    conditions: [],
    fieldsList: [],
    allButton: [],
    linButton: [],
    hrefSetting: {},
    treeDataLoading: false,
    tableHeight: `${window.innerHeight - 406}px`,
    loading: false,
    total: 0,
    query: {
      orderBy: '',
      pageSize: 10,
      currentPage: 1,
      queryData: {},
    },
    pageSizeList: [5, 10, 20, 50, 100, 200, 500],
    tableData: [],
    selectedData: [],
    dialogVisible: false,
    drawerShow: false,
    dialogShow: false,
    openTypedrawerShow: false,
    openTypedialogShow: false,
    typedrawerObj: {},
    hrefUrl: '',
    ruleForm: {
      dictType: 'dict',
      typeName: '',
      typeCode: '',
      name: '',
      code: '',
    },
    BizValidatorMap: null,
    saveLoading: false,
    dictKey: '',
    exportBtn: false,
    iframeHeight: '',
    isFirst: true,
    isAllOrtable: 'all',
    hrefSettingUrl: '',
    dictObj: [],
    uploadData: {},
    paramsData: {},
    combinationData: {},
    comBinCondition: [],
    combinationDataShow: true,
    allParamsField: [],
    queryParam: {},
  })
  // 对 双向绑定的值进行watch 监控变化
  watch(
    () => info.dialogVisible,
    (amount, prevamount) => {
      if (!amount) {
        info.ruleForm.name = ''
        info.ruleForm.code = ''
        info.ruleForm.typeName = ''
        info.ruleForm.typeCode = ''
      }
      // ruleFormRef.value.clearValidate()
    }
  )

  const getItem = (item: any) => {
    // info.allParamsField 所有的配置
    if (info.allParamsField.includes(item.fieldName)) {
      info.data.sqlConditionVOS.forEach((i: any) => {
        if (i.controlType == 'dynamicSelect') {
          if (!i.dialogConf.queryParam) {
            i.dialogConf.queryParam = {}
          }
          i.dialogConf.custDialogConditionFields.forEach((field: any) => {
            if (field.paramsField && field.paramsField == item.fieldName) {
              let searchName = `${field.columnName}$`
              if (field.dbType === 'number') {
                searchName += 'N'
              } else if (field.dbType === 'date') {
                searchName += 'D'
              } else {
                searchName += 'V'
              }
              searchName += field.condition
              i.dialogConf.queryParam[searchName] = item.val
            }
          })
        }
      })
    }
  }

  onActivated(() => {
    if (!info.isFirst) {
      listFn()
    } else {
      init()
    }
    info.isFirst = false
  })
  // onDeactivated(() => {
  //   info.isFirst = true
  // })
  const isSomeType = (item: any, value: any) => {
    let val = null
    if (
      !item.formatType ||
      item.formatType == 'percent' ||
      item.formatType === 'picture' ||
      item.formatType === 'file' ||
      item.formatType === 'decimal' ||
      item.formatType === 'javascript' ||
      item.formatType === 'region' ||
      item.formatType === 'cascadeSelect' ||
      item.formatType === 'dialog'
    ) {
      val = value
    }
    if (item.formatType === 'json') {
      let a = ''
      if (item.formatConf && item.formatConf.length > 0) {
        const list = JSON.parse(item.formatConf)
        list.forEach((listItem: any) => {
          if (
            tableColumnRef.value.handleJson(item, value).indexOf(listItem.key) >
            -1
          ) {
            a = listItem.key
          }
        })
      }
      val = a
    }
    if (item.formatType === 'date_picker') {
      val = tableColumnRef.value.handleTime(item, value)
    }
    if (item.formatType === 'dic') {
      val = tableColumnRef.value.handleField(item, value)
    }
    if (item.formatType === 'timestamp') {
      val = tableColumnRef.value.handleTimeStamp(item, value)
    }
    return val
  }
  // 获取背景颜色
  const addClass = ({ row, column }) => {
    let backgroundList = []
    let backgroundColor = ''
    let textColor = ''
    info.fieldsList.forEach((item: any) => {
      if (column.label == item.fieldDesc) {
        if (item.bgColorConfMap && item.bgColorConfMap.backgroundList) {
          backgroundList = item.bgColorConfMap.backgroundList
          if (backgroundList && backgroundList.length > 0) {
            backgroundList.forEach((itm: any) => {
              if (itm.condition == '==') {
                if (itm.value == isSomeType(item, row[item.fieldName])) {
                  backgroundColor = itm.backgroundColor
                  textColor = itm.textColor
                }
              }
              if (itm.condition == '!==') {
                if (itm.value !== isSomeType(item, row[item.fieldName])) {
                  backgroundColor = itm.backgroundColor
                  textColor = itm.textColor
                }
              }
              if (itm.condition == '<') {
                if (
                  Number(itm.value) >
                  Number(isSomeType(item, row[item.fieldName]))
                ) {
                  backgroundColor = itm.backgroundColor
                  textColor = itm.textColor
                }
              }
              if (itm.condition == '>') {
                if (
                  Number(itm.value) <
                  Number(isSomeType(item, row[item.fieldName]))
                ) {
                  backgroundColor = itm.backgroundColor
                  textColor = itm.textColor
                }
              }
              // 数字区间
              if (itm.condition == 'between') {
                if (
                  itm.minNumber <
                    Number(isSomeType(item, row[item.fieldName])) &&
                  itm.maxNumber > Number(isSomeType(item, row[item.fieldName]))
                ) {
                  backgroundColor = itm.backgroundColor
                  textColor = itm.textColor
                }
              }
              // 不在数字区间
              if (itm.condition == 'not between') {
                if (
                  itm.minNumber >
                    Number(isSomeType(item, row[item.fieldName])) ||
                  itm.maxNumber < Number(isSomeType(item, row[item.fieldName]))
                ) {
                  backgroundColor = itm.backgroundColor
                  textColor = itm.textColor
                }
              }
              if (itm.condition == 'null') {
                if (
                  !isSomeType(item, row[item.fieldName]) ||
                  isSomeType(item, row[item.fieldName]) == null ||
                  isSomeType(item, row[item.fieldName]).length <= 0
                ) {
                  backgroundColor = itm.backgroundColor
                  textColor = itm.textColor
                }
              }
              if (itm.condition == 'not null') {
                if (
                  isSomeType(item, row[item.fieldName]) &&
                  isSomeType(item, row[item.fieldName]).length > 0
                ) {
                  backgroundColor = itm.backgroundColor
                  textColor = itm.textColor
                }
              }
              if (itm.condition == 'contains') {
                if (
                  String(isSomeType(item, row[item.fieldName])).indexOf(
                    itm.value
                  ) !== -1
                ) {
                  backgroundColor = itm.backgroundColor
                  textColor = itm.textColor
                }
              }
              if (itm.condition == 'not contains') {
                if (
                  String(isSomeType(item, row[item.fieldName])).indexOf(
                    itm.value
                  ) < 0
                ) {
                  backgroundColor = itm.backgroundColor
                  textColor = itm.textColor
                }
              }
              if (itm.condition == 'in') {
                if (
                  String(isSomeType(item, row[item.fieldName])).indexOf(
                    itm.value
                  ) !== -1
                ) {
                  backgroundColor = itm.backgroundColor
                  textColor = itm.textColor
                }
              }
              if (itm.condition == 'not in') {
                if (
                  String(isSomeType(item, row[item.fieldName])).indexOf(
                    itm.value
                  ) < 0
                ) {
                  backgroundColor = itm.backgroundColor
                  textColor = itm.textColor
                }
              }
            })
          }
        }
      }
    })
    return {
      color: textColor,
      background: backgroundColor,
    }
  }
  // 设置行背景色
  const setRowBackgroundColor = (row: any, index: any) => {
    // 自定义方法，根据行数据设置背景色
    const rowItem = row.row
    let obj
    if (
      info.data.extendConf &&
      JSON.parse(info.data.extendConf).hbackgroundList &&
      JSON.parse(info.data.extendConf).hbackgroundList.length > 0
    ) {
      JSON.parse(info.data.extendConf).hbackgroundList.forEach((item: any) => {
        let a
        info.data.fieldsList.forEach((fieldsItem: any) => {
          if (fieldsItem.fieldName == item.fieldsValue) {
            a = fieldsItem
          }
        })
        if (item.condition == '==') {
          if (isSomeType(a, rowItem[item.fieldsValue]) == item.value) {
            obj = { background: item.backgroundColor, color: item.textColor } // 设置自定义的背景色
          }
        }
        if (item.condition == '!==') {
          if (isSomeType(a, rowItem[item.fieldsValue]) !== item.value) {
            obj = { background: item.backgroundColor, color: item.textColor } // 设置自定义的背景色
          }
        }
        if (item.condition == '<') {
          if (
            Number(item.value) >
            Number(isSomeType(a, rowItem[item.fieldsValue]))
          ) {
            obj = { background: item.backgroundColor, color: item.textColor } // 设置自定义的背景色
          }
        }
        if (item.condition == '>') {
          if (
            Number(item.value) <
            Number(isSomeType(a, rowItem[item.fieldsValue]))
          ) {
            obj = { background: item.backgroundColor, color: item.textColor } // 设置自定义的背景色
          }
        }
        // 数字区间
        if (item.condition == 'between') {
          if (
            item.minNumber < Number(isSomeType(a, rowItem[item.fieldsValue])) &&
            item.maxNumber > Number(isSomeType(a, rowItem[item.fieldsValue]))
          ) {
            obj = { background: item.backgroundColor, color: item.textColor } // 设置自定义的背景色
          }
        }
        // 不在数字区间
        if (item.condition == 'not between') {
          if (
            item.minNumber > Number(isSomeType(a, rowItem[item.fieldsValue])) ||
            item.maxNumber < Number(isSomeType(a, rowItem[item.fieldsValue]))
          ) {
            obj = { background: item.backgroundColor, color: item.textColor } // 设置自定义的背景色
          }
        }
        if (item.condition == 'null') {
          if (
            !isSomeType(a, rowItem[item.fieldsValue]) ||
            isSomeType(a, rowItem[item.fieldsValue]) == null ||
            isSomeType(a, rowItem[item.fieldsValue]).length <= 0
          ) {
            obj = { background: item.backgroundColor, color: item.textColor } // 设置自定义的背景色
          }
        }
        if (item.condition == 'not null') {
          if (
            isSomeType(a, rowItem[item.fieldsValue]) &&
            isSomeType(a, rowItem[item.fieldsValue]).length > 0
          ) {
            obj = { background: item.backgroundColor, color: item.textColor } // 设置自定义的背景色
          }
        }
        if (item.condition == 'contains') {
          if (
            String(isSomeType(a, rowItem[item.fieldsValue])).indexOf(
              item.value
            ) !== -1
          ) {
            obj = { background: item.backgroundColor, color: item.textColor } // 设置自定义的背景色
          }
        }
        if (item.condition == 'not contains') {
          if (
            String(isSomeType(a, rowItem[item.fieldsValue])).indexOf(
              item.value
            ) < 0
          ) {
            obj = { background: item.backgroundColor, color: item.textColor } // 设置自定义的背景色
          }
        }
        if (item.condition == 'in') {
          if (
            String(isSomeType(a, rowItem[item.fieldsValue])).indexOf(
              item.value
            ) !== -1
          ) {
            obj = { background: item.backgroundColor, color: item.textColor } // 设置自定义的背景色
          }
        }
        if (item.condition == 'not in') {
          if (
            String(isSomeType(a, rowItem[item.fieldsValue])).indexOf(
              item.value
            ) < 0
          ) {
            obj = { background: item.backgroundColor, color: item.textColor } // 设置自定义的背景色
          }
        }
      })
    }

    return obj
  }
  // 请求详情
  const init = (resouId:any) => {
    if(proxy.$route.name !== 'CreateAppSquare' && proxy.$route.name !== 'VisitPage'){
      // 组联试有code先支持组联试表单
      info.code = props.code || proxy.$route.params.code
      postData(bizApi.custGrid.voUrl + info.code, {}).then(
        ({ data }) => {
          setInitData(data)
        },
        ({ message }) => {
          // 如果不启用
        }
      )
    }
    if(proxy.$route.name == 'CreateAppSquare' || proxy.$route.name == 'VisitPage'){
      if(proxy.$route.params.id){
        let resourceId = resouId || proxy.$route.params.id
        appsquareApi.thirdParty.bizCustGridgetVoThirdParty(resourceId).then(({ data }) => {
          if(data){
            setInitData(data)
          }
        })
      }
    }
  }
  init()

  const setInitData = (data:any) => {
    info.data = data
    if (!props.layoutDesign) {
      useAbStoreAdapter().changeTabsMeta({
        fullPath: proxy.$route.fullPath,
        meta: { title: `${info.data.name}` },
      })
    }

    // 如果是应用预览
    if (info.data.gridType === 'app') {
      info.query.appQueryType = 'todoTask'
    }
    // 分页数量
    info.query.pageSize = info.data.pageSize

    info.fieldsList = info.data.fieldsList

    info.buttons = info.data.sqlButtonVO
    // 处理按钮
    info.allButton = []
    info.linButton = []
    info.buttons.forEach((item: any) => {
      if (item.type === '2') {
        info.allButton.push(item)
      }
      if (item.type === '1') {
        info.linButton.push(item)
      }
    })
    info.linButton.forEach((item: any) => {
      if (item.exp == 'true') {
        item.exp = true
      }
      if (item.exp == 'false') {
        item.exp = false
      }
    })
    if (info.data.extendConf) {
      const extendConf = JSON.parse(info.data.extendConf)
      if (extendConf.operationWidth) {
        info.data.operationWidth = extendConf.operationWidth
      } else {
        info.data.operationWidth = 220
      }
    }
    // 处理查询条件
    info.data.sqlConditionVOS.forEach(async (item: any, index: any) => {
      if (item.controlType == 'dic') {
        // 数据字典时 请求接口获取字典项
        if (item.formatConf && item.formatConf.length > 0) {
          item.formatConf = JSON.parse(item.formatConf)
          const result = await sysApi.dict.getDictDataUrl({
            dictKey: item.formatConf.code,
            hasRoot: false,
          })
          const arr = readNodes(result.data)
          item.formatConf.dicList = arr
          if (item.extendConf.tagShow) {
            item.formatConf.dicList.unshift({
              name: '全部',
              code: '',
            })
          }
        } else {
          item.formatConf = {}
        }
      }

      if (item.controlType == 'dialog') {
        // 数据字典时 请求接口获取字典项
        if (item.dialogConf.showValueQuery) {
          item.dialogConf.showValueQuery = ''
        }
        item['val'] = ''
      }

      // 动态下拉框
      if (item.controlType == 'dynamicSelect') {
        const custDialogConditionFields =
          item.dialogConf.custDialogConditionFields
        if (
          custDialogConditionFields &&
          custDialogConditionFields.length > 0
        ) {
          custDialogConditionFields.forEach((field: any) => {
            if (field.paramsField && field.paramsField.length > 0) {
              info.allParamsField.push(field.paramsField)
              info.data.sqlConditionVOS.forEach((it: any) => {
                if (
                  field.paramsField == it.fieldName &&
                  it.val.length > 0
                ) {
                  field.defaultValue = JSON.parse(JSON.stringify(it.val))
                }
              })
            }
          })
        }
        item['val'] = ''
        // 数组去重
        info.allParamsField = [...new Set(info.allParamsField)]
      }

      // 默认值类型
      if (item.dfDataType == '${currentDateTime}') {
        item.val = getNowTime()
      }
      if (item.dfDataType == '${currentUserId}') {
        item.val = abUser.userId
      }
      if (item.dfDataType == '${currentUserAccount}') {
        item.val = abUser.username
      }
      if (item.dfDataType == '${currentUserName}') {
        item.val = abUser.fullName
      }
      if (item.dfDataType == '${currentOrgId}') {
        item.val = abcurrentOrg.groupId
      }
      if (item.dfDataType == '${currentOrgName}') {
        item.val = abcurrentOrg.groupName
      }
      if (item.dfDataType == '${currentOrgCode}') {
        item.val = abcurrentOrg.groupCode
      }
      if (
        item.paramType == 'freemarker_params' ||
        item.paramType == 'common_params'
      ) {
        if (proxy.$route.query[item.fieldName]) {
          item.val = proxy.$route.query[item.fieldName]
        }
      }
    })
    // 是否默认请求列表 1：默认，0：不默认
    if (info.data.initQuery === 1) {
      // 请求列表
      listFn()
    }
  }

  const readNodes = (nodes = [] as any[], arr = [] as any[]) => {
    for (const item of nodes) {
      arr.push(item)
      if (item.children && item.children.length) readNodes(item.children, arr)
    }
    return arr
  }
  const getNowTime = () => {
    const myDate = new Date(new Date().getTime() + 8 * 60 * 60 * 1000)
    // const time = myDate.toJSON().split('T').join(' ').substr(0, 19) 年月日时分秒
    const time = myDate.toJSON().split('T')[0]
    return time
  }
  const extend = (parent: Record<string, any>, child: { [x: string]: any }) => {
    child = child || {}
    for (const prop in parent) {
      child[prop] = parent[prop]
    }
    return child
  }

  // setquery
  const setQuery = () => {
    const queryData: any = []
    if (!info.data.sqlConditionVOS || info.data.sqlConditionVOS.length <= 0) {
      return
    }
    info.data.sqlConditionVOS.forEach((item: any, index: any) => {
      if (item.cntype == 'is null' || item.cntype == 'is not null') {
        queryData.push({
          name: item.name.length > 0 ? item.name : item.fieldName,
          con: item.cntype,
          val: '',
        })
      }
      // typeof item.val == 'number' 如果是区域查询或者其他查询就可能是数字
      if (
        (item.val && item.val.length > 0) ||
        item.numbewValStart ||
        item.numbewValEnd ||
        typeof item.val == 'number'
      ) {
        if (item.controlType == 'date_picker' && item.cntype == '>=,<=') {
          item.val.forEach((itemTime: any, itemIndex: any) => {
            queryData.push({
              name: item.fieldName.length > 0 ? item.fieldName : item.name,
              con: itemIndex <= 0 ? '>=' : '<=',
              val: itemTime,
            })
          })
        } else if (
          item.controlType == 'date_picker' &&
          item.formatConf == 'yyyy'
        ) {
          queryData.push({
            name: item.fieldName.length > 0 ? item.fieldName : item.name,
            con: item.cntype,
            val: `${item.val}-01-01 00:00:00`,
          })
        } else if (
          item.controlType == 'date_picker' &&
          item.formatConf == 'yyyy-MM'
        ) {
          queryData.push({
            name: item.fieldName.length > 0 ? item.fieldName : item.name,
            con: item.cntype,
            val: `${item.val}-01 00:00:00`,
          })
        } else if (
          item.controlType === 'decimal' &&
          item.dataType === 'decimal' &&
          item.cntype == '>=,<='
        ) {
          if (item.numbewValStart) {
            queryData.push({
              name: item.name.length > 0 ? item.name : item.fieldName,
              con: '>=',
              val: item.numbewValStart,
            })
          }
          if (item.numbewValEnd) {
            queryData.push({
              name: item.name.length > 0 ? item.name : item.fieldName,
              con: '<=',
              val: item.numbewValEnd,
            })
          }
        } else {
          queryData.push({
            name: item.fieldName.length > 0 ? item.fieldName : item.name,
            con: item.cntype,
            val: item.val,
          })
        }
        if (props.componentList && props.componentList.length > 0) {
          props.componentList.forEach((item: any) => {
            if (
              item.control.code == props.code &&
              item.control.comBinCondition &&
              item.control.comBinCondition.length > 0
            ) {
              info.comBinCondition = item.control.comBinCondition
            }
          })
        }
        if (info.comBinCondition && info.comBinCondition.length > 0) {
          info.comBinCondition.forEach((itema: any) => {
            queryData.forEach((item: any) => {
              if (itema.conditionValue == item.name) {
                item.name = itema.conditionValue
                item.val = itema.value
              }
            })
          })
        }
      } else {
        if (props.componentList && props.componentList.length > 0) {
          props.componentList.forEach((item: any) => {
            if (
              item.control.code == props.code &&
              item.control.comBinCondition &&
              item.control.comBinCondition.length > 0
            ) {
              info.comBinCondition = item.control.comBinCondition
            }
          })
        }
        if (info.comBinCondition && info.comBinCondition.length > 0) {
          info.comBinCondition.forEach((itema: any) => {
            if (itema.conditionValue == item.fieldName) {
              if (itema.value instanceof Array && itema.value.length > 1) {
                itema.value.forEach((aa: any, index: any) => {
                  queryData.push({
                    name: itema.conditionValue,
                    con: index == 0 ? '>=' : '<=',
                    val: aa,
                  })
                })
              } else {
                queryData.push({
                  name: itema.conditionValue,
                  con: item.cntype,
                  val:
                    itema.value &&
                    (itema.value.length > 0 || Number(itema.value))
                      ? itema.value
                      : '',
                })
              }
            }
          })
        }
      }
    })

    return queryData
  }

  // 请求列表
  const listFn = () => {
    info.loading = true
    // 查询条件处理
    info.query.queryData = setQuery()
    if(proxy.$route.name !== 'CreateAppSquare' && proxy.$route.name !== 'VisitPage'){
      postData(bizApi.custGrid.listUrl + info.code, info.query).then(
        (result) => {
          info.loading = false
          info.tableData = result.data.list
          info.total = result.data.count
          reloadFn()
        },
        () => {
          info.loading = false
        }
      )
    }
    if(proxy.$route.name == 'CreateAppSquare' || proxy.$route.name == 'VisitPage'){
      if(proxy.$route.params.id){
        let resourceId = proxy.$route.params.id
        appsquareApi.thirdParty.listDataThirdParty(resourceId,info.query).then((result) => {
          info.loading = false
          info.tableData = result.data.list
          info.total = result.data.count
          reloadFn()
        },
        () => {
          info.loading = false
        })
      }
    }
  }

  const reloadFn = () => {
    if (props.isReloadCom && props.isReloadCom.length > 0) {
      reloadByBtn(props.isReloadCom)
    }
  }

  // 根据按钮配置重新联动加载其他组件
  const reloadByBtn = (linkageRefresh: any) => {
    const list = props.componentList
    if (linkageRefresh && linkageRefresh.length > 0) {
      const result = list.filter((obj: any) => linkageRefresh.includes(obj.key))
      result.forEach((element) => {
        console.info(`to reload - ${element.label}`)
        element.relaod && element.relaod()
      })
    }
  }

  // 排序
  const sortChange = (data: { order: string; prop: any }) => {
    if (!data.order) {
      info.query.orderBy = ''
    } else {
      info.query.orderBy =
        data.order == 'ascending'
          ? `${data.prop}#` + `asc`
          : `${data.prop}#` + `desc`
    }
    listFn()
  }

  const testExportFn = () => {
    info.exportBtn = true
    info.query.queryData = setQuery()
    bizApi.custGrid.testExport(info.query).then(
      (result) => {
        if (result.size === 0) {
          ElMessage.error('该条件未查询到数据！')
          return false
        }
        abTools.downImgFile('导出数据.xls', result)
        info.exportBtn = false
      },
      () => {
        info.exportBtn = false
      }
    )
  }

  // 点击重置
  const resetquery = () => {
    info.query.currentPage = 1
    info.data.sqlConditionVOS.forEach((item: any, index: any) => {
      if (item.controlType === 'dialog') {
        item.dialogConf.queryCustDialog = []
        item.dialogConf.showValueQuery = ''
      }
      if (
        (item.controlType === 'dic' && item.extendConf.tagShow) ||
        (item.controlType === 'json' && item.extendConf.tagShow)
      ) {
        if (item.formatConf.dicList && item.formatConf.dicList.length > 0) {
          item.formatConf.dicList.forEach((dicItem: any) => {
            dicItem.checked = false
          })
        }
        if (
          item.formatConf.formatConfJsonList &&
          item.formatConf.formatConfJsonList.length > 0
        ) {
          item.formatConf.formatConfJsonList.forEach((dicItem: any) => {
            dicItem.checked = false
          })
        }
      }
      if (
        item.controlType === 'decimal' &&
        item.dataType === 'decimal' &&
        item.cntype == '>=,<='
      ) {
        item.numbewValStart = ''
        item.numbewValEnd = ''
      }
      if (item.showType == '1' || item.showType == '3') {
        item.val = ''
      }
    })
    listFn()
  }
  const listQuery = (list: any) => {
    info.data.sqlConditionVOS = list
    info.query.currentPage = 1
    listFn()
  }

  // 点击单选
  const getTemplateRow = (row: any) => {
    info.templateSelection = row
    emit('currentChange', row)
  }

  // 点击单选
  const clickTable = (row: any) => {
    emit('clickTable', row)
  }

  // 多选操作
  const handleSelectionChange = (val: User[]) => {
    multipleSelection.value = val
    info.selectedData = multipleSelection.value
    emit('handleSelectionChange', val)
  }
  // 清空多选操作
  const clearSelectedData = () => {
    multipleSelection.value = []
    info.selectedData = []
    tableRef.value!.clearSelection()
    emit('handleSelectionChange', [])
  }

  // 有提醒内容的按钮操作情况
  const hrefSettingSet = (btnItem: any, item: any) => {
    const url = btnItem.url
    if (btnItem.warnTxt && btnItem.warnTxt.length > 0) {
      ElMessageBox.confirm(btnItem.warnTxt, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          if(proxy.$route.name == "CreateAppSquare" || proxy.$route.name == "VisitPage"){
            alert(111)
            return false
          }
          // 抽屉
          if (
            btnItem.hrefSetting.openType === 'drawer' &&
            (btnItem.hrefSetting.openDrawerOrDialog === 'drawerOpen' ||
              btnItem.hrefSetting.openDrawerOrDialog === 'dialogOpen')
          ) {
            if (btnItem.hrefSetting.component == 'FormViewCombination') {
              drawerDialog(btnItem, item)
            } else {
              drawerFn(btnItem, item)
            }
          }
          // 直接请求
          if (btnItem.hrefSetting.openType === 'directRequest') {
            requestFn(btnItem, item)
          }
          // 事件按钮
          if (btnItem.hrefSetting.openType === 'eventBtn') {
            changeDataFn(btnItem, item)
          }
          // 打开标签页/TAB页
          if (btnItem.hrefSetting.openType === 'tab') {
            // receive
            proxy.$router.push(replaceStr(url, item))
          }
          // 打开top对话框
          if (btnItem.hrefSetting.openType === 'iframeDialog') {
            info.dialogVisible = true
            info.hrefSetting = extend(btnItem.hrefSetting, btnItem)
            info.hrefSettingUrl = replaceStr(info.hrefSetting.url, item)
            // 设置dialog高度
            geDialogHeight()
          }
          // 打开新页面
          if (btnItem.hrefSetting.openType === 'newPage') {
            // const routeData = proxy.$router.resolve({ path: btnItem.url })
            // window.open(routeData.href, '_blank')
            if (url && url.length > 0) {
              window.open(replaceStr(url, item))
            }
          }
          // 导入
          // if (url == `/ab-bpm/biz/bizCustGrid/view/import_${info.data.code}`) {
          //   exportFn()
          // }
          // 导出
          if (url == `/ab-bpm/biz/bizCustGrid/view/export_${info.data.code}`) {
            exportFn(btnItem)
          }
        })
        .catch(() => {})
    } else {
      if(proxy.$route.name == "CreateAppSquare" || proxy.$route.name == "VisitPage"){
        alert(111)
        return false
      }
      // 抽屉
      if (
        btnItem.hrefSetting.openType === 'drawer' &&
        (btnItem.hrefSetting.openDrawerOrDialog === 'drawerOpen' ||
          btnItem.hrefSetting.openDrawerOrDialog === 'dialogOpen')
      ) {
        if (btnItem.hrefSetting.component == 'FormViewCombination') {
          drawerDialog(btnItem, item)
        } else {
          drawerFn(btnItem, item)
        }
      }
      // 直接请求
      if (btnItem.hrefSetting.openType === 'directRequest') {
        requestFn(btnItem, item)
      }
      // 事件按钮
      if (btnItem.hrefSetting.openType === 'eventBtn') {
        changeDataFn(btnItem, item)
      }
      // 打开标签页/TAB页saveBack1
      if (btnItem.hrefSetting.openType === 'tab') {
        proxy.$router.push(replaceStr(url, item))
        if (
          info.query.appQueryType === 'receive' &&
          url.length > 0 &&
          (item.receiveStatus == 'unread' ||
            item.RECEIVESTATUS == 'unread' ||
            item.receivestatus == 'unread')
        ) {
          getData(
            bpmApi.bpmPlugincarboncopy.bpmCarbonCopyUpdateReadUrl +
              (item.carbonId || item.CARBONID || item.carbonid),
            {}
          ).then(
            (result) => {},
            () => {}
          )
        }
      }
      // 打开top对话框
      if (btnItem.hrefSetting.openType === 'iframeDialog') {
        info.dialogVisible = true
        info.hrefSetting = extend(btnItem.hrefSetting, btnItem)
        info.hrefSettingUrl = replaceStr(info.hrefSetting.url, item)
        // 设置dialog高度
        geDialogHeight()
      }
      // 打开新页面
      if (btnItem.hrefSetting.openType === 'newPage') {
        // const routeData = proxy.$router.resolve({ path: btnItem.url })
        // window.open(routeData.href, '_blank')
        if (url && url.length > 0) {
          window.open(replaceStr(url, item))
        }
      }
      // 导入
      // if (url == `/ab-bpm/biz/bizCustGrid/view/import_${info.data.code}`) {
      //   exportFn()
      // }
      // 导出
      if (url == `/ab-bpm/biz/bizCustGrid/view/export_${info.data.code}`) {
        exportFn(btnItem)
      }
    }
  }

  // 导出
  const exportFn = (btnItem: any) => {
    btnItem.btnLoading = true
    bizApi.custGrid
      .exportCodeUrl(info.data.code, { ...info.query, ...{ currentPage: 1 } })
      .then(
        (result) => {
          btnItem.btnLoading = false
          abTools.downImgFile(`${info.data.name}-数据.xls`, result)
        },
        () => {
          btnItem.btnLoading = false
        }
      )
  }

  // 截取特定字符串
  const replaceStr = (url: any, item: any) => {
    const a = /\${(.*?)\}/gi
    const c = url.match(a)
    const aURL = ''
    let dataId = ''
    if (c) {
      for (let i = 0; i < c.length; i++) {
        if (info.isAllOrtable === 'all') {
          if (multipleSelection.value && multipleSelection.value.length > 0) {
            multipleSelection.value.forEach((listItem: any) => {
              let newKey
              for (const key in listItem) {
                if (compareStringsIgnoreCase(key, c[i].replace(a, '$1'))) {
                  newKey = key
                }
              }
              dataId += `${listItem[newKey]},`
            })
            dataId = dataId.slice(0, dataId.length - 1)
          }
          url = url.replace(c[i], dataId)
        } else {
          let newKey
          for (const key in item) {
            if (compareStringsIgnoreCase(key, c[i].replace(a, '$1'))) {
              newKey = key
            }
          }
          url = url.replace(c[i], item[newKey])
        }
        aURL = url
      }
      return aURL
    } else {
      aURL = url
      return aURL
    }
  }

  const compareStringsIgnoreCase = (str1: any, str2: any) => {
    // 去除特殊字符并转为小写
    const cleanStr1 = str1.replace(/[^\w]/g, '').toLowerCase()
    const cleanStr2 = str2.replace(/[^\w]/g, '').toLowerCase()

    // 使用正则表达式进行对比
    const regex = new RegExp(`^${cleanStr1}$`)
    return regex.test(cleanStr2)
  }

  const geDialogHeight = () => {
    if (
      info.hrefSetting.height &&
      info.hrefSetting.height.length > 0 &&
      info.hrefSetting.heightUnit == '%'
    ) {
      const heightPx = abTools.getClientHeight()
      const height = heightPx * (Number(info.hrefSetting.height) / 100) - 120
      info.iframeHeight = `${height}px`
    }
    if (
      info.hrefSetting.height &&
      info.hrefSetting.height.length > 0 &&
      info.hrefSetting.heightUnit == 'px'
    ) {
      info.iframeHeight = `${Number(info.hrefSetting.height) - 117.09}px`
    }
  }

  const topTopDialog = (item: any, row: any) => {
    info.isAllOrtable = 'table'
    info.dialogVisible = true
    info.hrefSetting = item.hrefConfMap
    info.hrefSettingUrl = ''
    info.hrefSettingUrl = replaceStr(item.hrefConfMap.url, row)
    // 设置dialog高度
    geDialogHeight()
  }

  const drawerDialog = (item: any, row: any, isFromFieldsDrawer: any) => {
    // 没有打开方式的话  兼容老数据 默认加上drawerOpen 抽屉
    if (
      item.hrefConfMap &&
      item.hrefConfMap.openType == 'drawer' &&
      !item.hrefConfMap.openDrawerOrDialog
    ) {
      item.hrefConfMap.openDrawerOrDialog = 'drawerOpen'
    }
    info.isAllOrtable = 'table'
    info.typedrawerObj = item.hrefConfMap || item.hrefSetting
    if (
      (info.typedrawerObj &&
        info.typedrawerObj.openType === 'drawer' &&
        info.typedrawerObj.openDrawerOrDialog == 'drawerOpen') ||
      isFromFieldsDrawer == 'drawerOpen'
    ) {
      info.openTypedrawerShow = true
    }
    if (
      (info.typedrawerObj &&
        info.typedrawerObj.openType === 'drawer' &&
        info.typedrawerObj.openDrawerOrDialog == 'dialogOpen') ||
      isFromFieldsDrawer == 'dialogOpen'
    ) {
      info.openTypedialogShow = true
    }

    info.hrefSettingUrl = ''
    if (
      info.typedrawerObj.component == 'FormViewEdit' ||
      info.typedrawerObj.component == 'FormViewDetail'
    ) {
      // 兼容老数据
      if (info.typedrawerObj.params && info.typedrawerObj.params.length > 0) {
        info.paramsData = {
          ...JSON.parse(replaceStr(info.typedrawerObj.params, row)),
          ...{ formCode: info.data.relatedId },
          ...{ isDrawer: true },
        }
      }
      // 配置后的
      if (
        info.typedrawerObj.paramsList &&
        info.typedrawerObj.paramsList.length > 0
      ) {
        const obj = {}
        info.typedrawerObj.paramsList.forEach((itemParams: any) => {
          obj[itemParams.name] =
            row[itemParams.paramsValue] || itemParams.paramsValue
        })
        info.paramsData = {
          ...obj,
          ...{
            formCode: info.typedrawerObj.FormSeletorCode || info.data.relatedId,
          },
          ...{ isDrawer: true },
        }
      }
    }
    if (info.typedrawerObj.component == 'FormViewCombination') {
      const code = info.typedrawerObj.combinationCode
      info.combinationDataShow = false
      let params = {} as any
      abUtil.easyClone(proxy.$route.query, params)
      // 兼容旧数据
      if (info.typedrawerObj.params && info.typedrawerObj.params.length > 0) {
        params = JSON.parse(replaceStr(info.typedrawerObj.params, row))
      }

      // 新列表格式
      if (
        info.typedrawerObj.paramsList &&
        info.typedrawerObj.paramsList.length > 0
      ) {
        info.typedrawerObj.paramsList.forEach((itemParams: any) => {
          params[itemParams.name] =
            row[itemParams.paramsValue] || itemParams.paramsValue
        })
      }

      if (code) {
        bizApi.formCombination.getDesignJson(code, params).then((result) => {
          info.combinationDataShow = true
          info.combinationData = result.data
        })
      }
    }
    if (info.typedrawerObj.component == 'url') {
      const url = info.typedrawerObj.url
      info.hrefSettingUrl = replaceStr(url, row)
      nextTick(() => {
        const iframeDrawer = document.getElementById(
          'iframeDrawer'
        ) as HTMLIFrameElement
        if (!iframeDrawer) {
          console.error('iframeDrawer Iframe 不存在 ！')
          return
        }
        window.onmessage = (e) => {
          if (e.data.type == 'abCloseIframe') {
            closeTypeDrawer()
          }
        }
      })
    }
    // info.hrefSettingUrl = replaceStr(info.hrefSetting.params, row)
    // url = `/biz/bizForm/formViewEdit/${info.data.relatedId}?id=\${${info.data.pkName}}&saveBack=1`
    // 设置dialog高度
    // geDialogHeight()
    window.onmessage = (e) => {
      if (e.data.type == 'abCloseDrawer') {
        closeTypeDrawer()
      }
    }
  }

  // 抽屉打开
  const drawerFn = (btnItem: any, item: any) => {
    if (
      btnItem.hrefSetting.openType === 'drawer' &&
      btnItem.hrefSetting.openDrawerOrDialog == 'drawerOpen'
    ) {
      info.drawerShow = true
    }
    if (
      btnItem.hrefSetting.openType === 'drawer' &&
      btnItem.hrefSetting.openDrawerOrDialog == 'dialogOpen'
    ) {
      info.dialogShow = true
    }
    // 兼容老数据
    if (btnItem.hrefSetting.params && btnItem.hrefSetting.params.length > 0) {
      info.paramsData = {
        ...JSON.parse(replaceStr(btnItem.hrefSetting.params, item)),
        ...{
          formCode: btnItem.hrefSetting.FormSeletorCode || info.data.relatedId,
        },
        ...{ isDrawer: true },
      }
    }
    if (
      btnItem.hrefSetting.paramsList &&
      btnItem.hrefSetting.paramsList.length > 0
    ) {
      const obj = {}
      btnItem.hrefSetting.paramsList.forEach((itemParams: any) => {
        obj[itemParams.name] =
          item[itemParams.paramsValue] || itemParams.paramsValue
      })
      info.paramsData = {
        ...obj,
        ...{
          formCode: btnItem.hrefSetting.FormSeletorCode || info.data.relatedId,
        },
        ...{ isDrawer: true },
      }
    }
  }

  // 点击局部按钮
  const localclickFn = (btnItem: any, item: any) => {
    info.isAllOrtable = 'table'
    // 是否有提醒内容
    hrefSettingSet(btnItem, item)
  }
  // 点击全局按钮
  const localAllClickFn = (btnItem: any, itemList: any) => {
    info.isAllOrtable = 'all'
    // 是否有提醒内容
    hrefSettingSet(btnItem, itemList)
  }
  const closeDrawer = () => {
    info.drawerShow = false
    listFn()
  }
  const closeDialog = () => {
    info.dialogShow = false
    listFn()
  }
  const closeTypeDrawer = () => {
    info.openTypedrawerShow = false
    listFn()
  }
  // 直接请求
  const requestFn = (btnItem: any, item: any) => {
    let url = ''
    if (btnItem.url && btnItem.url.length > 0) {
      if (btnItem.name == '批量删除') {
        if (multipleSelection.value.length <= 0) {
          ElMessage({
            showClose: true,
            message: '请先选择数据',
            type: 'error',
          })
          return false
        }
      }
      url = replaceStr(btnItem.url, item)
    } else {
      ElMessage({
        showClose: true,
        message: '请先填写请求地址',
        type: 'error',
      })
    }
    // item.id 列表ID  relatedId 表单编码
    getData(url).then(({ msg }) => {
      if (btnItem.successTxt.length > 0) {
        ElMessage({
          showClose: true,
          message: btnItem.successTxt,
          type: 'success',
        })
      } else {
        ElMessage({
          showClose: true,
          message: msg,
          type: 'success',
        })
      }
      listFn()
    })
  }

  // 事件按钮请求
  const changeDataFn = (btnItem: any, item: any) => {
    if (
      btnItem.hrefSetting.dialogList &&
      btnItem.hrefSetting.dialogList.length > 0
    ) {
      let data = {}
      if (
        !btnItem.hrefSetting.isDialogValue ||
        !btnItem.hrefSetting.codeValue ||
        btnItem.hrefSetting.codeValue.length <= 0
      ) {
        let ids = ''
        if (Array.isArray(item)) {
          item.forEach((itemI) => {
            ids += `${itemI[btnItem.hrefSetting.dataChangeRelWatchField]},`
          })
          ids = ids.substring(0, ids.length - 1)
        } else {
          ids = item[btnItem.hrefSetting.dataChangeRelWatchField]
        }
        data = {
          refreshFieldList: btnItem.hrefSetting.dialogList,
          buttonAliasStr: btnItem.alias,
          ids: ids,
        }
      }
      // 新配置 值增强
      postData(
        `${bizApi.custGrid.changeDataStatus}/${info.data.code}`,
        data
      ).then(({ data, msg }) => {
        if (data) {
          ElMessage({
            showClose: true,
            message: msg,
            type: 'success',
          })
          listFn()
        } else {
          ElMessage({
            showClose: true,
            message: '数据未执行成功，请检查关联字段',
            type: 'warning',
          })
        }
      })
    } else {
      // 兼容旧配置
      let ids = ''
      if (Array.isArray(item)) {
        item.forEach((itemI) => {
          ids += `${itemI[btnItem.hrefSetting.dataChangeRelWatchField]},`
        })
        ids = ids.substring(0, ids.length - 1)
      } else {
        ids = item[btnItem.hrefSetting.dataChangeRelWatchField]
      }
      postData(
        `${bizApi.custGrid.changeDataStatus}--${info.data.code}--${btnItem.alias}?ids=${ids}`
      ).then(
        ({ msg, data }) => {
          if (data) {
            if (btnItem.successTxt.length > 0) {
              ElMessage({
                showClose: true,
                message: btnItem.successTxt,
                type: 'success',
              })
            } else {
              ElMessage({
                showClose: true,
                message: msg,
                type: 'success',
              })
            }
            listFn()
          } else {
            ElMessage({
              showClose: true,
              message: '数据未执行成功，请检查关联字段',
              type: 'warning',
            })
          }
        },
        () => {}
      )
    }
  }
  // 点击编辑
  const editClickFn = (row: any) => {
    info.dialogVisible = true
    info.ruleForm = JSON.parse(JSON.stringify(row))
  }
  // 点击删除
  const removeDict = (row: any) => {
    if (row.id) {
      ElMessageBox.confirm('确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          getData(sysApi.dict.removeDataDictUrl + row.id, {}).then(
            ({ msg }) => {
              ElMessage({
                showClose: true,
                message: msg,
                type: 'success',
              })
              listFn()
            }
          )
        })
        .catch(() => {})
    }
  }

  bizApi.bizPattern.getAllBizValidator().then((data) => {
    info.BizValidatorMap = data
  })
  // 提交表单
  const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
      if (valid) {
        info.saveLoading = true
        postData(sysApi.dict.saveDataDictUrl, {
          ...info.ruleForm,
          dictKey: info.ruleForm.code,
        })
          .then(
            ({ msg }) => {
              ElMessage({
                showClose: true,
                message: msg,
                type: 'success',
              })
              listFn()
              info.dialogVisible = false
              info.saveLoading = false
            },
            () => {}
          )
          .catch(() => {
            info.saveLoading = false
          })
      } else {
        console.log('error submit!', fields)
      }
    })
  }

  // 格式化样式替换tag
  const tagReplaceFn = (fieldName: any, item: any) => {
    item.cssConfListTag = ''
    if (item.cssConfList && item.cssConfList.length > 0) {
      const arr = JSON.parse(item.cssConfList)
      for (const key in arr) {
        if (fieldName === key) {
          item.cssConfListTag = arr[key]
        }
      }
    }
    return fieldName
  }

  // 切换
  const handleAppQueryTypeClick = (tab: any, event: Event) => {
    info.query.currentPage = 1
    info.query.appQueryType = tab.props.name
    info.tableData = []
    listFn()
  }
  defineExpose({
    init,
    listFn,
    setInitData
  })
</script>
<style lang="scss">
  .topDiaStyle {
    position: absolute;
    top: 50%;
    left: 50%;
    display: flex;
    flex-direction: column;
    margin: 0 !important;
    transform: translate(-50%, -50%);
    .el-dialog__body {
      flex: 1;
    }
  }
  .scrollbar-flex-content {
    display: flex;
  }
  .dialogShow-style {
    .el-dialog__body {
      height: 100% !important;
    }
  }
</style>

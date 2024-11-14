<template>
  <div>
    <el-card class="query-box-card">
      <template #header>
        <div class="card-header">
          <span>请选择</span>
        </div>
      </template>
      <template v-if="info.data.fieldsList && info.data.fieldsList.length > 0">
        <template v-if="info.data.gridType === 'bpmReport'">
          <el-tag
            v-for="(item, index) in info.data.fieldsList.filter(item => item.fieldDesc !== '当前环节' && item.fieldName !== 'abInstValMapLoader_abTaskUserJson')"
            :key="index"
            @click="changeCon(item, index)"
          >
            {{ item.fieldDesc }}
          </el-tag>
        </template>
        <template v-else>
          <el-tag
            v-for="(item, index) in info.data.fieldsList"
            :key="index"
            @click="changeCon(item, index)"
          >
            {{ item.fieldDesc }}
          </el-tag>
        </template>
      </template>
      <div v-else style="text-align: center">没有数据啦</div>
    </el-card>
    <el-table
      class="queryListTable"
      :data="info.data.sqlConditionVOS"
      :expand-row-keys="info.rowKeys"
      :row-key="rowKeyFunc"
      style="width: 100%; margin-top: 10px"
      @expand-change="changeExpand"
    >
      <el-table-column type="expand">
        <template #default="scope">
          <div m="4">
            <p m="t-0 b-2">
              <span style="padding-right: 4px">格式化类型:</span>
              <el-select
                v-model="scope.row.controlType"
                clearable
                placeholder=""
                size="small"
                style="width: 200px"
                @change="selectControlType($event, scope.row)"
              >
                <el-option
                  v-for="(item, index) in info.controlTypeOption"
                  :key="index"
                  :label="item.desc"
                  :value="item.type"
                />
              </el-select>
            </p>
            <p m="t-0 b-2">
              格式化数据:
              <el-popover
                v-if="scope.row.controlType === 'json'"
                placement="top"
                trigger="click"
                :width="400"
                @hide="hidePopover"
              >
                <template #reference>
                  <el-button size="small">设置</el-button>
                </template>
                <div>
                  <el-button
                    style="margin-bottom: 4px"
                    text
                    type="primary"
                    @click="
                      scope.row.formatConfJsonList.push({
                        key: '',
                        valuekey: '',
                      })
                    "
                  >
                    添加+
                  </el-button>
                  <el-table
                    :data="scope.row.formatConfJsonList"
                    style="width: 100%"
                  >
                    <el-table-column label="数据库值" prop="valuekey">
                      <template #default="scopeJson">
                        <el-input
                          v-model="scopeJson.row.valuekey"
                          placeholder="数据库值"
                        />
                      </template>
                    </el-table-column>
                    <el-table-column label="展示值" prop="key">
                      <template #default="scopeJson">
                        <el-input
                          v-model="scopeJson.row.key"
                          placeholder="展示值"
                        />
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="120">
                      <template #default="scopeJson">
                        <el-button
                          text
                          type="primary"
                          @click="
                            scope.row.formatConfJsonList.splice(
                              scopeJson.$index,
                              1
                            )
                          "
                        >
                          删除
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-popover>
              <el-select
                v-else-if="scope.row.controlType === 'date_picker'"
                v-model="scope.row.formatConf"
                clearable
                default-first-option
                placeholder="请选择"
                size="small"
                style="width: 200px"
              >
                <el-option label="年(YYYY)" value="yyyy" />
                <el-option label="年月(YYYY-MM)" value="yyyy-MM" />
                <el-option label="年月日(YYYY-MM-DD)" value="YYYY-MM-DD" />
                <el-option
                  label="年月日时分秒(YYYY-MM-DD HH:mm:ss)"
                  value="YYYY-MM-DD HH:mm:ss"
                />
              </el-select>
              <template v-else-if="scope.row.controlType === 'dialog' || scope.row.controlType === 'dynamicSelect'">
                <template
                  v-if="
                    scope.row.dialogConf.custDialogList.length > 0
                  "
                >
                  <el-tag
                    v-for="item in scope.row.dialogConf.custDialogList"
                    :key="item"
                    closable
                    @close="closeCustDialog(item, scope.row)"
                  >
                    {{ item['name'] }}
                  </el-tag>
                </template>
                <ab-cust-dialog
                  v-model="scope.row.dialogConf.custDialogList"
                  dialog-key="custDialog"
                  :dialog-setting="{ multiple: false }"
                  size="small"
                  style="display: inline-block"
                  @ok="chooseCustDialog($event, scope.row)"
                >
                  选择
                </ab-cust-dialog>
              </template>
              <template v-else-if="scope.row.controlType == 'dic'">
                <el-tag
                  v-if="
                    scope.row.formatDefault.code &&
                    scope.row.formatDefault.code.length > 0
                  "
                  closable
                  style="margin-right: 12px"
                  @close="closeQueryDict(scope.row)"
                >
                  {{ scope.row.formatDefault.name }}
                </el-tag>
                <ab-cust-dialog
                  dialog-key="sjzdsjq"
                  :dialog-setting="{ multiple: false }"
                  size="small"
                  style="display: inline-block"
                  @ok="chooseDictQuery($event, scope.row)"
                >
                  选 择
                </ab-cust-dialog>
              </template>
              <el-input
                v-else
                v-model="scope.row.json"
                placeholder=""
                size="small"
                style="width: 200px"
                @blur="blurJson"
              />
            </p>
            <p
              v-if="
                scope.row.controlType === 'dic' ||
                scope.row.controlType === 'json'
              "
              m="t-0 b-2"
            >
              <span style="padding-right: 1px; padding-left: 22px">
                tag模式:
              </span>
              <el-switch
                v-model="scope.row.extendConf.tagShow"
                active-text="是"
                inactive-text="否"
                inline-prompt
                @change="changeTagShow($event, scope.row)"
              />
            </p>
            <p
              v-if="
                (scope.row.controlType === 'dic' ||
                  scope.row.controlType === 'json') &&
                scope.row.extendConf.tagShow
              "
              m="t-0 b-2"
            >
              <span style="padding-right: 3px; padding-left: 42px">宽度:</span>
              <el-select
                v-model="scope.row.extendConf.width"
                clearable
                placeholder=""
                size="small"
                style="width: 200px"
              >
                <el-option label="自动" value="auto" />
                <el-option label="100%" value="100%" />
              </el-select>
            </p>
            <p v-if="scope.row.controlType === 'dialog' || scope.row.controlType === 'dynamicSelect'" m="t-0 b-2">
              <span style="padding-right: 1px; padding-left: 14px">
                展示字段:
              </span>
              <el-select
                v-model="scope.row.dialogConf.showValue"
                clearable
                placeholder=""
                size="small"
                style="width: 200px"
                @change="changeDialogConf($event, scope.row)"
              >
                <el-option
                  v-for="(item, index) in scope.row.dialogConf
                    .custDialogBackList"
                  :key="index"
                  :label="item.showName"
                  :value="item.returnName"
                />
              </el-select>
            </p>
            <p v-if="scope.row.controlType === 'dialog' || scope.row.controlType === 'dynamicSelect'" m="t-0 b-2">
              <span style="padding-right: 1px; padding-left: 28px">
                值字段:
              </span>
              <el-select
                v-model="scope.row.dialogConf.value"
                clearable
                placeholder=""
                size="small"
                style="width: 200px"
                @change="changeDialogConf($event, scope.row)"
              >
                <el-option
                  v-for="(item, index) in scope.row.dialogConf
                    .custDialogBackList"
                  :key="index"
                  :label="item.showName"
                  :value="item.returnName"
                />
              </el-select>
            </p>
            <p v-if="scope.row.controlType === 'dynamicSelect'" m="t-0 b-2">
              <span style="padding-right: 1px; padding-left: 14px">
                参数配置:
              </span>
              <el-button size="small" @click="openSetdynamicSelectParam(scope.row)">设置</el-button>
            </p>
            <p m="t-0 b-2">
              默认值类型:
              <el-select
                v-model="scope.row.dfDataType"
                clearable
                placeholder=""
                size="small"
                style="width: 200px"
                @change="changeDfDataType($event, scope.row)"
              >
                <el-option
                  v-for="(item, index) in info.DefaultOption"
                  :key="index"
                  :label="item.desc"
                  :value="item.type"
                />
              </el-select>
            </p>
            <p m="t-0 b-2">
              默认值格式:
              <el-input
                v-model="scope.row.val"
                :disabled="
                  scope.row.dfDataType == '${currentDateTime}' ||
                  scope.row.dfDataType == '${currentUserId}' ||
                  scope.row.dfDataType == '${currentUserAccount}' ||
                  scope.row.dfDataType == '${currentUserName}' ||
                  scope.row.dfDataType == '${currentOrgId}' ||
                  scope.row.dfDataType == '${currentOrgName}'
                "
                size="small"
                style="width: 200px"
              />
            </p>
            <p m="t-0 b-2">
              <span style="padding-right: 1px; padding-left: 14px">
                变量类型:
              </span>
              <el-select
                v-model="scope.row.paramType"
                placeholder=""
                size="small"
                style="width: 200px"
              >
                <el-option
                  v-for="(item, index) in info.vaviableOption"
                  :key="index"
                  :label="item.desc"
                  :value="item.type"
                />
              </el-select>
            </p>
            <p m="t-0 b-2">
              <span style="padding-right: 1px; padding-left: 28px">
                占位符:
              </span>
              <el-input
                v-model="scope.row.extendConf.queryPlaceHolder"
                :placeholder="'请输入' + scope.row.fieldDesc"
                size="small"
                style="width: 200px"
              />
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="字段备注"
        min-width="90"
        prop="fieldDesc"
      >
        <template #default="scope">
          <el-input v-model="scope.row.fieldDesc" placeholder="" size="small" />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="条件类型"
        min-width="90"
        prop="cntype"
      >
        <template #default="scope">
          <el-select
            v-model="scope.row.cntype"
            clearable
            placeholder=""
            size="small"
            @change="changeCntype($event, scope.row)"
          >
            <template v-for="item in info.cntypeOptions" :key="item.condition">
              <el-option
                :disabled="
                  scope.row.controlType === 'date_picker' &&
                  (info.isOracle == 'oracle' ||
                    info.isOracle == 'postgresql') &&
                  item.condition == 'like' &&
                  item.condition == 'llike' &&
                  item.condition == 'rlike'
                "
                :label="item.desc"
                :value="item.condition"
              />
            </template>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="显示类型"
        min-width="90"
        prop="showType"
      >
        <template #default="scope">
          <el-select
            v-model="scope.row.showType"
            :disabled="
              scope.row.cntype == 'is null' || scope.row.cntype == 'is not null'
            "
            placeholder=""
            size="small"
          >
            <el-option label="显示" value="1" />
            <el-option label="隐藏" value="2" />
            <el-option label="禁用" value="3" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="100">
        <template #default="scope">
          <el-button
            circle
            class="move-btn"
            :icon="Sort"
            size="small"
            type="primary"
          />
          <el-button
            circle
            :icon="Delete"
            size="small"
            type="danger"
            @click.prevent="deleteRow(scope.row, scope.$index)"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-model="info.dialogVisible"
      :close-on-click-modal="false"
      title="参数设置"
      width="600px"
    >
      <el-table
        v-if="info.dialogVisible"
        border
        :data="info.custDialogConditionFields"
      >
        <el-table-column label="过滤条件" width="140px">
          <template #default="scope">
            <span>{{scope.row.showName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="默认值" min-width="100px">
          <template #default="scope">
            <el-input
              clearable
              v-model="scope.row.defaultValue"
              placeholder="请输入默认值"
            />
          </template>
        </el-table-column>
        <el-table-column label="参数字段" min-width="100px">
          <template #default="scope">
            <el-select v-model="scope.row.paramsField" clearable placeholder="请选择参数字段">
              <el-option
                v-for="item in info.data.sqlConditionVOS"
                :key="item.fieldName"
                :label="item.fieldDesc"
                :value="item.fieldName"
              />
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button text type="primary" @click="info.dialogVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="save">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
  import { Delete, Sort } from '@element-plus/icons-vue'
  import { ref, reactive } from 'vue'
  import Sortable from 'sortablejs'
  import { ArrowDown } from '@element-plus/icons-vue'
  import dayjs from 'dayjs'
  import { sysApi, bizApi, getData } from '@agilebpm/api'
  import * as abUtil from '~/agilebpm/utils/ab-util'

  const emit = defineEmits(['update:modelValue', 'resetDia'])
  const props = defineProps({
    modelValue: { required: true, type: Object }, // 赋值目标对象
    // eslint-disable-next-line vue/require-default-prop
  })
  const info: any = reactive({
    data: useVModel(props, 'modelValue', emit),
    tableHeight: `${window.innerHeight - 370}px`,
    cntypeOptions: [],
    controlTypeOption: [],
    DefaultOption: [
      { desc: '固定值', type: 'fixedValue' },
      { desc: '当前日期', type: '${currentDateTime}' },
      { desc: '当前用户id', type: '${currentUserId}' },
      { desc: '当前用户账户', type: '${currentUserAccount}' },
      { desc: '当前用户名', type: '${currentUserName}' },
      { desc: '当前组织id', type: '${currentOrgId}' },
      { desc: '当前组织名称', type: '${currentOrgName}' },
      { desc: '当前组织编码', type: '${currentOrgCode}' },
    ],
    vaviableOption: [],
    list: [],
    rowKeys: [],
    isOracle: '',
    dialogVisible:false,
    custDialogConditionFields:[],
    instanceStatusOption:[]
  })
  
  // 请求对话框详情数据
  const getDialogData = (code: any, row: any) => {
    getData(bizApi.customDialog.getByCode + code, {}).then(
      (result: any) => {
        row.dialogConf.custDialogBackList = result.data.returnFields
        if (
          row.dialogConf.custDialogList &&
          row.dialogConf.custDialogList.length <= 0
        ) {
          row.dialogConf.custDialogList.push({
            code: code,
            name: result.data.name,
          })
        }
        row.dialogConf.custDialogConditionFields = []
        if(result.data.conditionFields && result.data.conditionFields.length > 0){
          result.data.conditionFields.forEach((item:any) => {
            row.dialogConf.custDialogConditionFields.push({...item,...{
              defaultValue:'',
              paramsField:''
            }})
          })
        }
      },
      () => {}
    )
  }
  if (info.data.sqlConditionVOS.length > 0) {
    info.data.sqlConditionVOS.forEach((item: any, index: any) => {
      item.rowKeyValue = index
      // json格式
      if (item.controlType && item.controlType == 'json') {
        if (!item.formatConfJsonList) {
          item.formatConfJsonList = []
        }
      } else if (item.controlType && item.controlType == 'dic') {
        if (item.formatConf) {
          if (typeof item.formatConf == 'string') {
            item.formatDefault = JSON.parse(item.formatConf)
          }
        }
      } else {
        item.formatConfJsonList = []
      }
      if (!item.extendConf) {
        item.extendConf = {
          queryPlaceHolder: '',
        }
      }
    })
  } else {
     info.data.sqlConditionVOS = []
  }

  // 条件类型
  sysApi.tools
    .getEnum('com.dstz.base.query.ConditionType', true)
    .then((result: any) => {
      info.cntypeOptions = result.data
    })
  //获取当前数据库类型
  sysApi.tools.getCurrentDataSource().then((resp: any) => {
    info.isOracle = resp.data.dbType
  })
  // 格式化类型
  sysApi.tools
    .getEnum('com.dstz.biz.chart.enums.QueryConstantsEnum', true)
    .then((result: any) => {
      info.controlTypeOption = result.data
    })
  // 变量类型
  sysApi.tools
    .getEnum('com.dstz.biz.chart.enums.VariableTypeEnum', true)
    .then((result: any) => {
      info.vaviableOption = result.data
    })
      // 实例状态
  sysApi.tools
    .getEnum('com.dstz.bpm.api.enums.InstanceStatus', true)
    .then((result: any) => {
      info.instanceStatusOption = result.data
    })

  const deleteRow = (row: any, index: number) => {
    info.data.sqlConditionVOS.splice(index, 1)
    JSON.parse(JSON.stringify(info.data.fieldsList)).forEach(
      (item: any, indexf: any) => {
        if (row.fieldName == item.fieldName) {
          // info.list.splice(indexf, 0, item)
        }
      }
    )
  }

  // 添加查询条件
  const changeCon = async (itemA: any, index: any) => {
    const item = JSON.parse(JSON.stringify(itemA))
    item.cntype = 'like'
    item.showType = '1'
    item.hrefConf = ''
    item.paramType = info.vaviableOption[0].type
    // item.formatConfJsonList = []
    if (!item.extendConf) {
      item.extendConf = {
        queryPlaceHolder: '',
      }
    }
    if (item.formatType && item.formatType.length > 0 && item.formatType !== 'cascadeSelect' && item.formatType !== 'region') {
      item.controlType = item.formatType
      if (item.formatConf) {
        if (typeof item.formatConf == 'string') {
          item.formatConf = JSON.parse(item.formatConf)
        }
      }
      if (item.controlType == 'dic') {
        if (!item.formatDefault) {
          item.formatDefault = item.formatConf
        }
        // 补充dicList 回显tag
        const result = await sysApi.dict.getDictDataUrl({
          dictKey: item.formatDefault.code,
          hasRoot: false,
        })
        const arr = readNodes(result.data)
        item.formatDefault.dicList = arr
        item.cntype = '='
      }
      if (item.controlType == 'json') {
        if (item.formatConf) {
          if (typeof item.formatConf == 'string') {
            item.formatConfJsonList = JSON.parse(item.formatConf)
          }
          if (typeof item.formatConf == 'object') {
            item.formatConfJsonList = item.formatConf
          }
        }
        if (item.formatConfJsonList.length > 0) {
          item.formatConfJsonList.forEach((itemJson: any) => {
            if (itemJson.value) {
              itemJson.valuekey = itemJson.value
            }
          })
        }
        item.cntype = '='
      }
      if (item.controlType == 'dialog') {
        if (!item.dialogConf) {
          item.dialogConf = {
            value: '',
            showValue: '',
            custDialogList: [],
            queryCustDialog: [],
            custDialogBackList: [],
          }
        }
        if (item.formatConf && item.formatConf.dialogKey.length > 0) {
          getDialogData(item.formatConf.dialogKey, item)
        }
        if (item.formatConf && item.formatConf.labelField.length > 0) {
          item.dialogConf.showValue = item.formatConf.labelField
        }
        if (item.formatConf && item.formatConf.valueField.length > 0) {
          item.dialogConf.value = item.formatConf.valueField
        }
      }
      if (item.controlType == 'date_picker') {
        const value =
          (item.formatConf && item.formatConf.value) ||
          (item.formatDefault && item.formatDefault.value)
        if (value) {
          if (value == 'yyyy-MM-dd') {
            item.formatConf = 'YYYY-MM-DD'
          }
          if (value == 'yyyy-MM-dd HH:mm:ss') {
            item.formatConf = 'YYYY-MM-DD HH:mm:ss'
          }
          if (value == 'yyyy') {
            item.formatConf = 'yyyy'
          }
          if (value == 'yyyy-MM') {
            item.formatConf = 'yyyy-MM'
          }
        } else {
          item.formatConf = 'YYYY-MM-DD'
        }
        if (info.isOracle == 'oracle' || info.isOracle == 'postgresql') {
          item.cntype = '='
        }
      }
    } else {
      item.controlType = info.controlTypeOption[0].type
    }

    // 流程列表添加实例状态
    if(info.data.gridType == 'bpmReport' && item.fieldName == 'instanceStatus'){
      item.controlType = 'json'
      item.formatConfJsonList = []
      info.instanceStatusOption.forEach((it:any) => {
        if(it.key !== 'draft' && it.key !== 'revoke_end'){
          item.formatConfJsonList.push({
            valuekey:it.key,
            key:it.value
          })
        }
      })
    }
    info.data.sqlConditionVOS.push(item)
  }

  const changeCntype = (val: any, row: any) => {
    if (val == 'is null' || val == 'is not null') {
      row.showType = '2'
    }
  }

  const rowKeyFunc = (row: any) => {
    let a = ''
    if (row) {
      a = row.fieldName + row.sn
    }
    return a
  }
  // 拖拽排序
  // 行拖拽
  const rowDrop = () => {
    setTimeout(() => {
      const table = document.querySelector(
        '.queryListTable .el-table__body-wrapper tbody'
      )
      Sortable.create(table, {
        animation: 300,
        handle: '.move-btn',
        onStart: (evt: any) => {
          // info.rowKeys = []
          if (table.children.length > info.data.sqlConditionVOS.length) {
            ElMessageBox.alert('调整列表位置请先关闭展开', '提示', {
              confirmButtonText: 'OK',
              callback: (action: Action) => {},
            })
          }
        },
        onEnd: (evt: any) => {
          const arr = JSON.parse(JSON.stringify(info.data.sqlConditionVOS))
          let t
          if (
            evt.oldIndex > evt.newIndex &&
            table.children.length > arr.length
          ) {
            t = arr.splice(evt.oldIndex - 1, 1)[0]
          } else {
            t = arr.splice(evt.oldIndex, 1)[0]
          }
          arr.splice(evt.newIndex, 0, t)
          arr.forEach((item: any, index: any) => {
            item.sn = index + 1
          })
          info.data.sqlConditionVOS = arr
        },
      })
    })
  }
  rowDrop()

  const changeExpand = (row: any, expand: any) => {
    // console.log(row)
  }

  const blurJson = () => {
    // 处理查询条件
    info.data.sqlConditionVOS.forEach((item: any, index: any) => {
      if (item.controlType == 'dic') {
        // 数据字典时 请求接口获取字典项
        if (item.json && item.json.length > 0) {
          sysApi.dict.getDictTreeByCodeNoRoot(item.json).then((data) => {
            item.dictList = data
          })
        }
      }
    })
  }

  const changeDfDataType = (val: any, row: any) => {
    if (val == '') {
      row.val = ''
    } else if (val == 'fixedValue') {
      row.val = ''
    } else {
      row.val = val
    }
  }

  const selectControlType = (value: any, item: any) => {
    if (value == 'decimal') {
      item.formatConf = ''
      item.cntype = 'like'
    } else {
      item.cntype = '='
    }
    if (value == 'date_picker') {
      item.formatConf = 'YYYY-MM-DD'
    } else if (value == 'dialog' || value == 'dynamicSelect') {
      item.formatConf = ''
      item.dialogConf = {
        value: '',
        showValue: '',
        custDialogList: [],
        queryCustDialog: [],
        custDialogBackList: [],
        listData:[],
        custDialogConditionFields:[]
      }
    } else if (value == 'dic') {
      item.formatDefault = {}
    } else if (value == 'json') {
      item.formatConf = ''
    } else {
      item.formatConf = ''
      item.json = ''
    }
  }

  // 选择查询对话框OK事件
  const chooseDictQuery = async (list: any, row: any) => {
    row.formatDefault.code = list[0].code
    row.formatDefault.name = list[0].name
    const result = await sysApi.dict.getDictDataUrl({
      dictKey: list[0].code,
      hasRoot: false,
    })
    const arr = readNodes(result.data)
    row.formatDefault.dicList = arr
  }

  const readNodes = (nodes = [] as any[], arr = [] as any[]) => {
    for (const item of nodes) {
      arr.push(item)
      if (item.children && item.children.length) readNodes(item.children, arr)
    }
    return arr
  }

  // 删除
  const closeQueryDict = (row: any) => {
    row.formatDefault = {}
  }

  const chooseCustDialog = (list: any, row: any) => {
    getDialogData(list[0].code, row)
    // row.formatConf = list[0].code
  }

  const changeTagShow = (value: any, row: any) => {
    if (value) {
      row.extendConf.width = 'auto'
    }
    if (!value) {
      row.extendConf.width = ''
    }
  }

  const closeCustDialog = (item: string, row: any) => {
    row.dialogConf.custDialogList.splice(
      row.dialogConf.custDialogList.indexOf(item),
      1
    )
    row.dialogConf.custDialogBackList = []
    row.dialogConf.custDialogConditionFields = []
    row.formatConf = ''
    row.dialogConf.value = ''
    row.dialogConf.showValue = ''
    emit('resetDia', row)
  }

  const changeDialogConf = (value: any, row: any) => {
    emit('resetDia', row)
  }

  const openSetdynamicSelectParam = (row:any) => {
    if(row.dialogConf.custDialogConditionFields.length <= 0){
      ElMessage({
        message: '请先选择对话框',
        type: 'error',
      })
      return false
    }
    info.dialogVisible = true
    info.custDialogConditionFields = row.dialogConf.custDialogConditionFields
  }

  const save = () => {
    info.dialogVisible = false
  }
</script>
<style lang="scss">
  .example-showcase .el-dropdown-link {
    display: flex;
    align-items: center;
    color: var(--el-color-primary);
    cursor: pointer;
  }
  .query-box-card {
    width: 100%;
    .el-card__header {
      padding: 10px;
      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
    .el-card__body {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      padding: 10px !important;
      .el-tag {
        margin-right: 10px !important;
        margin-bottom: 6px !important;
        margin-left: 0 !important;
        cursor: pointer;
      }
    }
  }
</style>

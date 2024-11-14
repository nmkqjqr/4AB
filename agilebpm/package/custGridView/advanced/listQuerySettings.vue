<template>
  <div>
    <el-button
      v-for="item in info.data.fieldsList"
      :key="item.fieldName"
      class="mt-4"
      size="small"
      style="margin-bottom: 12px"
      type="primary"
      @click="onClickAddItem(item)"
    >
      {{ item.fieldName }} {{ item.fieldDesc }}
    </el-button>
    <el-button
      class="mt-4"
      size="small"
      style="margin-bottom: 12px"
      type="primary"
      @click="onAddItem()"
    >
      添加 +
    </el-button>
    <el-table
      class="queryListTable"
      :data="info.data.sqlConditionVOS"
      height="280"
      row-key="name"
      style="width: 100%; margin-bottom: 50px"
    >
      <el-table-column align="center" label="序号" type="index" width="60" />
      <el-table-column
        align="center"
        label="表名"
        min-width="120"
        prop="tableName"
      >
        <template #default="scope">
          <el-input v-model="scope.row.tableName" placeholder="请输入表名" />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="字段别名"
        min-width="120"
        prop="fieldName"
      >
        <template #default="scope">
          <el-input
            v-model="scope.row.fieldName"
            placeholder="比如 tableAlias.name"
            @change="changeFieldName($event, scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="字段备注"
        min-width="120"
        prop="fieldDesc"
      >
        <template #default="scope">
          <el-input v-model="scope.row.fieldDesc" placeholder="" />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="条件类型"
        min-width="120"
        prop="cntype"
      >
        <template #default="scope">
          <el-select
            v-model="scope.row.cntype"
            clearable
            placeholder=""
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
        label="格式化类型"
        min-width="120"
        prop="controlType"
      >
        <template #default="scope">
          <el-select
            v-model="scope.row.controlType"
            clearable
            placeholder=""
            @change="selectControlType($event, scope.row)"
          >
            <el-option
              v-for="(item, index) in info.controlTypeOption"
              :key="index"
              :label="item.desc"
              :value="item.type"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="格式化数据"
        min-width="120"
        prop="json"
      >
        <template #default="scope">
          <el-popover
            v-if="scope.row.controlType === 'json'"
            placement="top"
            trigger="click"
            :width="400"
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
                    value: '',
                  })
                "
              >
                添加+
              </el-button>
              <el-table
                :data="scope.row.formatConfJsonList"
                style="width: 100%"
              >
                <el-table-column label="数据库值" prop="value">
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
                        scope.row.formatConfJsonList.splice(scopeJson.$index, 1)
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
                scope.row.formatDefault &&
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
          <el-input v-else v-model="scope.row.json" placeholder="" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="显示字段" min-width="120" prop="">
        <template #default="scope">
          <el-select
            v-if="scope.row.controlType == 'dialog' || scope.row.controlType === 'dynamicSelect'"
            v-model="scope.row.dialogConf.showValue"
            clearable
            placeholder=""
          >
            <el-option
              v-for="(item, index) in scope.row.dialogConf.custDialogBackList"
              :key="index"
              :label="item.showName"
              :value="item.returnName"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column align="center" label="返回字段" min-width="120" prop="">
        <template #default="scope">
          <el-select
            v-if="scope.row.controlType == 'dialog' || scope.row.controlType === 'dynamicSelect'"
            v-model="scope.row.dialogConf.value"
            clearable
            placeholder=""
          >
            <el-option
              v-for="(item, index) in scope.row.dialogConf.custDialogBackList"
              :key="index"
              :label="item.showName"
              :value="item.returnName"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column align="center" label="参数配置" min-width="120" prop="">
        <template #default="scope">
          <el-button size="small" v-if="scope.row.controlType === 'dynamicSelect'" @click="openSetdynamicSelectParam(scope.row)">设置</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="tag模式" min-width="120" prop="">
        <template #default="scope">
          <el-switch
            v-if="
              scope.row.controlType == 'dic' || scope.row.controlType == 'json'
            "
            v-model="scope.row.extendConf.tagShow"
            active-text="是"
            inactive-text="否"
            inline-prompt
            @change="changeTagShow($event, scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="宽度" min-width="120" prop="">
        <template #default="scope">
          <el-select
            v-if="
              (scope.row.controlType === 'dic' ||
                scope.row.controlType == 'json') &&
              scope.row.extendConf.tagShow
            "
            v-model="scope.row.extendConf.width"
            clearable
            placeholder=""
          >
            <el-option label="自动" value="auto" />
            <el-option label="100%" value="100%" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="显示类型"
        min-width="120"
        prop="showType"
      >
        <template #default="scope">
          <el-select
            v-model="scope.row.showType"
            :disabled="
              scope.row.cntype == 'is null' || scope.row.cntype == 'is not null'
            "
            placeholder=""
          >
            <el-option label="显示" value="1" />
            <el-option label="隐藏" value="2" />
            <el-option label="禁用" value="3" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="默认值类型"
        min-width="120"
        prop="dfDataType"
      >
        <template #default="scope">
          <el-select
            v-model="scope.row.dfDataType"
            clearable
            placeholder=""
            @change="changeDfDataType($event, scope.row)"
          >
            <el-option
              v-for="(item, index) in info.DefaultOption"
              :key="index"
              :label="item.desc"
              :value="item.type"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="默认值格式"
        min-width="120"
        prop="val"
      >
        <template #default="scope">
          <el-input
            v-model="scope.row.val"
            clearable
            :disabled="
              scope.row.dfDataType == '${currentDateTime}' ||
              scope.row.dfDataType == '${currentUserId}' ||
              scope.row.dfDataType == '${currentUserAccount}' ||
              scope.row.dfDataType == '${currentUserName}' ||
              scope.row.dfDataType == '${currentOrgId}' ||
              scope.row.dfDataType == '${currentOrgName}'
            "
          />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="变量类型"
        min-width="120"
        prop="paramType"
      >
        <template #default="scope">
          <el-select v-model="scope.row.paramType" placeholder="">
            <el-option
              v-for="(item, index) in info.vaviableOption"
              :key="index"
              :label="item.desc"
              :value="item.type"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="占位符"
        min-width="120"
        prop="queryPlaceHolder"
      >
        <template #default="scope">
          <el-input
            v-model="scope.row.extendConf.queryPlaceHolder"
            clearable
            :placeholder="'请输入' + scope.row.fieldDesc"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="120">
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
            @click.prevent="deleteRow(scope.$index)"
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
  import { ref, reactive } from 'vue'
  import { sysApi, bizApi, getData } from '~/agilebpm/api'
  import dayjs from 'dayjs'
  import { Sort, Delete } from '@element-plus/icons-vue'
  import Sortable from 'sortablejs'
  const emit = defineEmits(['update:modelValue'])
  const props = defineProps({
    modelValue: { required: true, type: Object }, // 赋值目标对象
    // eslint-disable-next-line vue/require-default-prop
  })
  const info: any = reactive({
    data: useVModel(props, 'modelValue', emit),
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
    isOracle: '',
    dialogVisible:false,
    custDialogConditionFields:[]
  })

  watch(
    () => [props.modelValue],
    (now, old) => {
      info.data = now[0]
    }
  )

  if (info.data.sqlConditionVOS.length > 0) {
    info.data.sqlConditionVOS.forEach((item: any) => {
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
    .then(({ data }) => {
      info.cntypeOptions = data
    })
  //获取当前数据库类型
  sysApi.tools.getCurrentDataSource().then((resp: any) => {
    info.isOracle = resp.data.dbType
  })
  // 格式化类型
  sysApi.tools
    .getEnum('com.dstz.biz.chart.enums.QueryConstantsEnum', true)
    .then(({ data }) => {
      info.controlTypeOption = data
    })
  // 变量类型
  sysApi.tools
    .getEnum('com.dstz.biz.chart.enums.VariableTypeEnum', true)
    .then(({ data }) => {
      info.vaviableOption = data
    })
  const deleteRow = (index: number) => {
    info.data.sqlConditionVOS.splice(index, 1)
  }
  const changeFieldName = (value: any, row: any) => {
    if (row.name.length <= 0) {
      row.name = value
    }
  }
  const onAddItem = () => {
    info.data.sqlConditionVOS.unshift({
      tableName: '',
      fieldName: '',
      name: '',
      fieldDesc: '',
      cntype: 'like',
      controlType: info.controlTypeOption[0].type,
      dialogConf: {
        value: '',
        showValue: '',
        custDialogList: [],
        queryCustDialog: [],
        custDialogBackList: [],
      },
      showType: '2',
      json: '',
      isMust: 0,
      init: 0,
      dfDataType: '',
      paramType: info.vaviableOption[1].type,
      extendConf: {
        queryPlaceHolder: '',
      },
      sn: null,
    })
  }
  const onClickAddItem = async (item: any) => {
    const conditionItem = JSON.parse(JSON.stringify(item))
    // 显示类型
    conditionItem.showType = '1'
    // 条件类型
    conditionItem.cntype = 'like'
    // 条件类型
    conditionItem.controlType = info.controlTypeOption[0].type
    if (!conditionItem.extendConf) {
      conditionItem.extendConf = {
        queryPlaceHolder: '',
      }
    }
    if (conditionItem.formatType && conditionItem.formatType.length > 0 && conditionItem.formatType !== 'cascadeSelect' && conditionItem.formatType !== 'region') {
      conditionItem.controlType = conditionItem.formatType
      if (conditionItem.formatConf) {
        if (typeof conditionItem.formatConf == 'string') {
          conditionItem.formatConf = JSON.parse(conditionItem.formatConf)
        }
      }
      if (conditionItem.controlType == 'dic') {
        if (!conditionItem.formatDefault) {
          conditionItem.formatDefault = conditionItem.formatConf
        }
        conditionItem.cntype = '='
      }
      if (conditionItem.controlType == 'json') {
        if (conditionItem.formatConf) {
          if (typeof conditionItem.formatConf == 'string') {
            conditionItem.formatConfJsonList = JSON.parse(
              conditionItem.formatConf
            )
          }
          if (typeof conditionItem.formatConf == 'object') {
            conditionItem.formatConfJsonList = conditionItem.formatConf
          }
        }
        if (conditionItem.formatConfJsonList.length > 0) {
          conditionItem.formatConfJsonList.forEach((itemJson: any) => {
            if (itemJson.value) {
              itemJson.valuekey = itemJson.value
            }
          })
        }
        conditionItem.cntype = '='
      }
      if (conditionItem.controlType == 'dialog') {
        if (!conditionItem.dialogConf) {
          conditionItem.dialogConf = {
            value: '',
            showValue: '',
            custDialogList: [],
            queryCustDialog: [],
            custDialogBackList: [],
          }
        }
        if (
          conditionItem.formatConf &&
          conditionItem.formatConf.dialogKey.length > 0
        ) {
          const { data } = await getData(
            bizApi.customDialog.getByCode + conditionItem.formatConf.dialogKey,
            {}
          )
          conditionItem.dialogConf.custDialogBackList = data.returnFields
          if (
            conditionItem.dialogConf.custDialogList &&
            conditionItem.dialogConf.custDialogList.length <= 0
          ) {
            conditionItem.dialogConf.custDialogList.push({
              code: conditionItem.formatConf.dialogKey,
              name: data.name,
            })
          }
        }
        if (
          conditionItem.formatConf &&
          conditionItem.formatConf.labelField.length > 0
        ) {
          conditionItem.dialogConf.showValue =
            conditionItem.formatConf.labelField
        }
        if (
          conditionItem.formatConf &&
          conditionItem.formatConf.valueField.length > 0
        ) {
          conditionItem.dialogConf.value = conditionItem.formatConf.valueField
        }
      }

      if (conditionItem.controlType == 'date_picker') {
        const value =
          (conditionItem.formatConf && conditionItem.formatConf.value) ||
          (conditionItem.formatDefault && conditionItem.formatDefault.value)
        if (value) {
          if (value == 'yyyy-MM-dd') {
            conditionItem.formatConf = 'YYYY-MM-DD'
          }
          if (value == 'yyyy-MM-dd HH:mm:ss') {
            conditionItem.formatConf = 'YYYY-MM-DD HH:mm:ss'
          }
          if (value == 'yyyy') {
            conditionItem.formatConf = 'yyyy'
          }
          if (value == 'yyyy-MM') {
            conditionItem.formatConf = 'yyyy-MM'
          }
        } else {
          conditionItem.formatConf = 'YYYY-MM-DD'
        }
        if (info.isOracle == 'oracle' || info.isOracle == 'postgresql') {
          conditionItem.cntype = '='
        }
      }
    } else {
      conditionItem.controlType = info.controlTypeOption[0].type
    }
    info.data.sqlConditionVOS.unshift(conditionItem)
  }
  const rowKeyFunc = (row: any) => {
    let a = ''
    if (row) {
      a = row.fieldName + row.sn
    }
    return a
  }

  // 拖拽排序
  const rowDrop = () => {
    setTimeout(() => {
      const table = document.querySelector(
        '.queryListTable .el-table__body-wrapper tbody'
      )
      Sortable.create(table, {
        animation: 300,
        handle: '.move-btn',
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

  const changeDfDataType = (val: any, row: any) => {
    if (val == '') {
      row.val = ''
    } else if (val == 'fixedValue') {
      row.val = ''
    } else {
      row.val = val
    }
  }

  const changeCntype = (val: any, row: any) => {
    if (val == 'is null' || val == 'is not null') {
      row.showType = '2'
    }
  }

  // 选择查询对话框OK事件
  const chooseDictQuery = (list: any, row: any) => {
    row.formatDefault.code = list[0].code
    row.formatDefault.name = list[0].name
    sysApi.dict.getDictTreeByCodeNoRoot(row.formatDefault.code).then((data) => {
      row.formatDefault.dictList = data
    })
  }
  // 删除
  const closeQueryDict = (row: any) => {
    row.formatDefault = {}
  }

  const selectControlType = (value: any, item: any) => {
    if (value == 'decimal') {
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

  const closeCustDialog = (item: string, row: any) => {
    row.dialogConf.custDialogList.splice(
      row.dialogConf.custDialogList.indexOf(item),
      1
    )
    row.dialogConf.custDialogBackList = []
    row.formatConf = ''
    row.dialogConf.value = ''
    row.dialogConf.showValue = ''
  }
  const chooseCustDialog = (list: any, row: any) => {
    getDialogData(list[0].code, row)
  }
  const changeTagShow = (value: any, row: any) => {
    if (value) {
      row.extendConf.width = 'auto'
    }
    if (!value) {
      row.extendConf.width = ''
    }
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

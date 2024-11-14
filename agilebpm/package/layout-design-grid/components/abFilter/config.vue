<template>
  <div>
    <el-divider content-position="center">过滤条件配置</el-divider>
    <el-form-item label="添加条件">
      <el-button :icon="Plus" text type="primary" @click="add">添加</el-button>
    </el-form-item>
    <el-table
      border
      :data="config.control.filterList"
      row-key="alias"
      style="margin-bottom: 12px"
    >
      <el-table-column label="名称" prop="name">
        <template #default="{ row }">
          <el-input v-model="row.name" placeholder="名称" size="small" />
        </template>
      </el-table-column>
      <el-table-column label="入参" prop="paramsValue">
        <template #default="{ row }">
          <el-select
            v-model="row.paramsValue"
            clearable
            placeholder="请选择"
            size="small"
          >
            <el-option
              v-for="item in formCombination.designJson.params"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column align="center" label="类型" width="70">
        <template #default="{ row, $index }">
          <el-button
            :icon="Edit"
            style="padding: 0; margin-right: 10px"
            text
            type="primary"
            @click="set(row, $index)"
          />
          <el-button
            :icon="Delete"
            style="padding: 0; margin-left: 0"
            text
            type="primary"
            @click="config.control.filterList.splice($index, 1)"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-form-item label="展示搜索">
      <el-switch
        v-model="config.control.clickFilter"
        active-text="是"
        inactive-text="否"
        inline-prompt
      />
    </el-form-item>
    <el-dialog v-model="pageInfo.showDialog" title="类型设置" width="400px">
      <el-form-item label="查询类型">
        <el-select
          v-model="pageInfo.row.controlType"
          clearable
          placeholder=""
          @change="selectControlType"
        >
          <el-option
            v-for="(item, index) in pageInfo.controlTypeOption"
            :key="index"
            :label="item.desc"
            :value="item.type"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="
          pageInfo.row.controlType && pageInfo.row.controlType !== 'decimal'
        "
        :label="pageInfo.row.controlType === 'date_picker' || pageInfo.row.controlType === 'date_picker_f' ? '格式选择' : '设置'"
      >
        <el-select
          v-if="pageInfo.row.controlType === 'date_picker'"
          v-model="pageInfo.row.formatConf"
          clearable
          default-first-option
          placeholder="请选择"
        >
          <el-option label="年(YYYY)" value="YYYY" />
          <el-option label="年月(YYYY-MM)" value="YYYY-MM" />
          <el-option label="年月日(YYYY-MM-DD)" value="YYYY-MM-DD" />
          <el-option
            label="年月日时分秒(YYYY-MM-DD HH:mm:ss)"
            value="YYYY-MM-DD HH:mm:ss"
          />
        </el-select>
        <el-select
          v-if="pageInfo.row.controlType === 'date_picker_f'"
          v-model="pageInfo.row.formatConf"
          clearable
          default-first-option
          placeholder="请选择"
        >
          <!-- <el-option label="年(YYYY)" value="YYYY" /> -->
          <el-option label="年月(YYYY-MM)" value="YYYY-MM" />
          <el-option label="年月日(YYYY-MM-DD)" value="YYYY-MM-DD" />
          <el-option
            label="年月日时分秒(YYYY-MM-DD HH:mm:ss)"
            value="YYYY-MM-DD HH:mm:ss"
          />
        </el-select>
        <template v-else-if="pageInfo.row.controlType == 'dic'">
          <el-tag
            v-if="
              pageInfo.row.formatConf.code &&
              pageInfo.row.formatConf.code.length > 0
            "
            closable
            style="margin-right: 12px"
            @close="closeQueryDict"
          >
            {{ pageInfo.row.formatConf.name }}
          </el-tag>
          <ab-cust-dialog
            dialog-key="sjzdsjq"
            :dialog-setting="{ multiple: false }"
            size="small"
            style="display: inline-block"
            @ok="chooseDictQuery($event)"
          >
            选 择
          </ab-cust-dialog>
        </template>
        <template v-else-if="pageInfo.row.controlType == 'select'">
          <el-button
            :icon="Plus"
            size="small"
            @click="
              pageInfo.row.formatConfJsonList.push({ key: '', valuekey: '' })
            "
          >
            键值对
          </el-button>
        </template>
        <template v-else-if="pageInfo.row.controlType == 'selectMore'">
          <el-button
            :icon="Plus"
            size="small"
            @click="
              pageInfo.row.formatConfJsonList.push({ key: '', valuekey: '' })
            "
          >
            键值对
          </el-button>
        </template>
        <template v-else-if="pageInfo.row.controlType === 'dialog'">
          <el-tag
            v-if="
              pageInfo.row.formatConf.dialogName &&
              pageInfo.row.formatConf.dialogName.length > 0
            "
            style="margin-right: 12px"
          >
            {{ pageInfo.row.formatConf.dialogName }}
          </el-tag>
          <ab-cust-dialog
            dialog-key="custDialog"
            :dialog-setting="{ multiple: false }"
            size="small"
            style="display: inline-block"
            @ok="chooseCustDialog"
          >
            选择
          </ab-cust-dialog>
        </template>
      </el-form-item>
      <el-form-item
        v-if="pageInfo.row.controlType === 'dialog'"
        label="展示字段"
      >
        <el-select
          v-model="pageInfo.row.formatConf.labelField"
          clearable
          placeholder="请选择"
          @change="changeLabelField($event, pageInfo.row)"
        >
          <el-option
            v-for="(item, index) in pageInfo.row.custDialogBackList"
            :key="index"
            :label="item.showName"
            :value="item.returnName"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="pageInfo.row.controlType === 'dialog'" label="值字段">
        <el-select
          v-model="pageInfo.row.formatConf.valueField"
          clearable
          placeholder="请选择"
          @change="changeValueField($event, pageInfo.row)"
        >
          <el-option
            v-for="(item, index) in pageInfo.row.custDialogBackList"
            :key="index"
            :label="item.showName"
            :value="item.returnName"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="占位符">
        <el-input
          v-model="pageInfo.row.placeholderText"
          placeholder="请输入占位符"
        />
      </el-form-item>
      <el-table
        v-if="
          pageInfo.row.controlType == 'select' ||
          pageInfo.row.controlType == 'selectMore'
        "
        :data="pageInfo.row.formatConfJsonList"
        style="width: 100%; margin-top: 10px"
      >
        <el-table-column label="数据库值" prop="valuekey">
          <template #default="scopeJson">
            <el-input v-model="scopeJson.row.valuekey" placeholder="数据库值" />
          </template>
        </el-table-column>
        <el-table-column label="展示值" prop="key">
          <template #default="scopeJson">
            <el-input v-model="scopeJson.row.key" placeholder="展示值" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="90">
          <template #default="scopeJson">
            <el-button
              :icon="Delete"
              text
              type="primary"
              @click="
                pageInfo.row.formatConfJsonList.splice(scopeJson.$index, 1)
              "
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button text @click="pageInfo.showDialog = false">取消</el-button>
          <el-button type="primary" @click="dialogOk">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
  import { defineProps, PropType, toRefs } from 'vue'
  import draggable from 'vuedraggable'
  import { Edit, Plus, Delete } from '@element-plus/icons-vue'
  import { abUploadFile } from '@ab-core'
  import { sysApi, getData, bizApi } from '@agilebpm/api'
  import * as abUtil from '~/agilebpm/utils/ab-util'

  const props = defineProps({
    config: {
      required: true,
      type: Object as PropType<FormCombinationComponent>,
    },
    formCombination: {
      required: true,
      type: Object as PropType<FormCombination>,
    },
  })
  const { config } = toRefs(props)
  const show = ref(true)
  const pageInfo = reactive({
    showDialog: false,
    controlTypeOption: [
      {
        type: 'decimal',
        desc: '输入框',
      },
      {
        type: 'date_picker',
        desc: '时间选择框',
      },
      {
        type: 'date_picker_f',
        desc: '时间范围选择框',
      },
      {
        type: 'dic',
        desc: '数据字典',
      },
      {
        type: 'select',
        desc: '下拉框',
      },
      // {
      //   type: 'selectMore',
      //   desc: '下拉框多选',
      // },
      {
        type: 'dialog',
        desc: '对话框',
      },
    ],
    row: {},
    index: 0,
  })
  const add = () => {
    if (!config.value.control.filterList) {
      config.value.control = {
        filterList: [],
      }
    }
    config.value.control.filterList.push({
      name: '名称',
      controlType: 'decimal',
    })
  }
  const set = (row: any, index: any) => {
    pageInfo.showDialog = true
    pageInfo.row = JSON.parse(JSON.stringify(row))
    pageInfo.index = index
  }

  const selectControlType = (value: any) => {
    if (value == 'date_picker') {
      pageInfo.row.formatConf = 'YYYY-MM-DD'
    }
    if (value == 'date_picker_f') {
      pageInfo.row.formatConf = 'YYYY-MM-DD'
    }
    if (value == 'dic') {
      pageInfo.row.formatConf = {}
    }
    if (value == 'select' || value == 'selectMore') {
      pageInfo.row.formatConf = ''
      pageInfo.row.formatConfJsonList = []
    }
    if (value == 'dialog') {
      pageInfo.row.formatConf = {
        dialogType: '',
        dialogKey: '',
        dialogName: '',
        labelField: '',
        valueField: '',
        labelColumn: '',
        param: '',
      }
      pageInfo.row.custDialogBackList = []
    }
  }

  const dialogOk = () => {
    config.value.control.filterList[pageInfo.index] = pageInfo.row
    pageInfo.showDialog = false
  }

  // 选择查询对话框OK事件
  const chooseDictQuery = (list: any) => {
    pageInfo.row.formatConf.code = list[0].code
    pageInfo.row.formatConf.name = list[0].name
  }

  // 删除
  const closeQueryDict = () => {
    pageInfo.row.formatConf = {}
  }

  const chooseCustDialog = (list: any) => {
    pageInfo.row.formatConf.dialogKey = list[0].code
    pageInfo.row.formatConf.dialogName = list[0].name
    pageInfo.row.formatConf.labelField = ''
    pageInfo.row.formatConf.valueField = ''
    pageInfo.row.formatConf.labelColumn = ''
    pageInfo.row.formatConf.param = ''
    getDialogData(pageInfo.row.formatConf.dialogKey, pageInfo.row, false)
  }

  // 请求对话框详情数据
  const getDialogData = (dialogKey: any, row: any, column: any) => {
    getData(bizApi.customDialog.getByCode + dialogKey, {}).then(
      (result: any) => {
        const fileds = [] as any[]
        row.custDialogBackList = []
        //如果数据源是接口的话取返回值和条件字段的交集
        if (result.data.dataSource === 'interface') {
          if (
            result.data.conditionFields?.length === 0 ||
            result.data.returnFields?.length === 0
          ) {
            return
          }
          result.data.returnFields.forEach((rf: any) => {
            const filed = result.data.conditionFields.find((cf: any) => {
              return rf.columnName === cf.columnName
            })
            if (filed) {
              fileds.push(rf)
            }
          })
          if (fileds.length === 0) {
            return
          }
        } else {
          fileds.push(...result.data.returnFields)
        }
        //处理返回字段和显示字段
        if (result.data.displayFields) {
          fileds.forEach((rf: any) => {
            const item = result.data.displayFields.find((df: any) => {
              return df.columnName === rf.columnName
            })
            rf.showName = rf.returnName
            if (item) {
              rf.showName = `${item.showName}(${rf.returnName})`
            }
          })
        }
        fileds.forEach((item: any) => {
          row.custDialogBackList.push({
            returnName: item.returnName,
            showName: item.showName,
            columnName: item.columnName,
          })
        })
        if (column) {
          if (row.custDialogBackList.length > 0) {
            row.formatConf.labelField = column.dataSelectorConfig.labelField
            row.formatConf.valueField = column.dataSelectorConfig.valueField
            row.formatConf.labelColumn = column.dataSelectorConfig.labelColumn
            row.formatConf.param = column.dataSelectorConfig.param
          }
        }
      },
      () => {}
    )
  }

  const changeLabelField = (value: any, row: any) => {
    row.formatConf.labelColumn = row.custDialogBackList.find(
      (item: any) => item.returnName == value
    ).columnName
  }
  const changeValueField = (value: any, row: any) => {
    row.formatConf.param = row.custDialogBackList.find(
      (item: any) => item.returnName == value
    ).columnName
  }
</script>

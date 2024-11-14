<template>
  <div>
    <label v-if="!isDialog" class="el-form-item__label" style="padding: 0">
      自定义对话框配置：
    </label>
    <el-form-item label="对话框" class="is-required">
      <el-input v-model="data.ctrDialogConfig.dialogName" :readonly="true">
        <template #append>
          <ab-cust-dialog
            dialog-key="custDialog"
            type="primary"
            :dialogSetting="{ multiple: 0, custom: true }"
            @ok="choseDialog"
          >
            <el-icon><Search></Search></el-icon>
          </ab-cust-dialog>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item
      label="按钮文本"
      v-if="!noDesc"
      :class="isDialog ? `is-required` : ``"
    >
      <el-input
        v-model="data.ctrDialogConfig.searchDesc"
        placeholder="请输入按钮文本"
      />
    </el-form-item>
    <el-form-item label="赋值对象" class="is-required">
      <el-select
        v-model="data.ctrDialogConfig.mappingBo"
        placeholder="请选择赋值对象"
        @change="mappInfoBoChange"
      >
        <el-option
          v-for="(bo, index) in pageData.boList"
          :key="index"
          :label="bo.tableComment"
          :value="bo.tablePath"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="多选" v-if="!noMult">
      <el-switch
        v-model="data.ctrDialogConfig.multiple"
        inline-prompt
        active-text="是"
        inactive-text="否"
        :active-value="1"
        :inactive-value="0"
      />
    </el-form-item>
    <el-form-item label="赋值模式" v-if="isDialog && !noDesc">
      <el-radio-group v-model="data.ctrDialogConfig.asmode">
        <el-tooltip
          class="box-item"
          effect="dark"
          content="对话框会回显子表数据，插入前会清空旧数据"
          placement="top-start"
        >
          <el-radio-button label="edit">覆盖子表插入</el-radio-button>
        </el-tooltip>
        <el-radio-button label="add">每次新增插入</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <defult-value-config
      v-if="!isDialog"
      v-model="data.defaultValue"
      :filed-type="data.fieldType"
    ></defult-value-config>
    <!--对话框参数配置-->
    <div
      v-if="
        pageData.dialog.conditionFields &&
        pageData.dialog.conditionFields.length > 0
      "
      style="margin-bottom: 10px"
    >
      <label class="el-form-item__label" style="padding: 0">
        对话框参数配置：
      </label>
      <el-form-item label="参数选择">
        <el-select
          ref="paramSelect"
          v-model="pageData.selectParam"
          multiple
          clearable
          placeholder="请选择参数"
          style="margin-bottom: 10px"
          @clear="clearAll"
          @remove-tag="removeTag"
        >
          <el-option
            v-for="item in pageData.dialog.conditionFields"
            :key="item.value"
            :label="item.showName"
            :value="item.columnName"
          />
        </el-select>
      </el-form-item>

      <el-table
        :data="dialogParams"
        v-if="dialogParams && dialogParams.length > 0"
      >
        <el-table-column label="名称" prop="showName" width="80" />
        <el-table-column label="入参" prop="dialogField" min-width="120">
          <template #default="scope">
            <el-select
              size="small"
              v-model="
                data.ctrDialogConfig.params[
                  dialogUtil.buildcondition(scope.row)
                ]
              "
              placeholder="入参选择"
              clearable
            >
              <el-option
                v-for="(column, index) in pageData.allColumns"
                :key="index"
                :label="column.name"
                :value="column.value"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="默认值" prop="dialogField" min-width="80">
          <template #default="scope">
            <el-input
              size="small"
              v-model="
                data.ctrDialogConfig.paramsDefaultValue[
                  dialogUtil.buildcondition(scope.row)
                ]
              "
              :placeholder="`默认值`"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="60">
          <template #default="scope">
            <el-button
              type="primary"
              @click="deleteParam(scope.row, scope.$index)"
              text
            >
              <el-icon><Delete></Delete></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--字段映射配置-->
    <div
      v-if="data.ctrDialogConfig.dialogKey && data.ctrDialogConfig.mappingBo"
    >
      <label class="el-form-item__label" style="padding: 0">
        字段映射配置：
      </label>
      <br />
      <el-button
        :icon="Plus"
        class="mt-4"
        text
        type="primary"
        style="width: 100%"
        @click="addMappingField"
      >
        添加映射字段
      </el-button>
      <el-table
        :data="data.ctrDialogConfig.mappingFields"
        v-if="
          data.ctrDialogConfig.mappingFields &&
          data.ctrDialogConfig.mappingFields.length > 0
        "
      >
        <el-table-column label="对象字段" prop="boField" min-width="120">
          <template #default="scope">
            <el-select
              v-model="
                data.ctrDialogConfig.mappingFields[scope.$index]['boField']
              "
              placeholder="请选择对象字段"
            >
              <el-option
                v-for="(column, index) in pageData.selectedBo.table.columns"
                :key="index"
                :label="column.comment"
                :value="column.code"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="对话框字段" prop="dialogField" min-width="120">
          <template #default="scope">
            <el-select
              v-model="
                data.ctrDialogConfig.mappingFields[scope.$index]['dialogField']
              "
              placeholder="请选择对象字段"
            >
              <el-option
                v-for="(field, index) in pageData.dialog.returnFields"
                :key="index"
                :label="field.showName"
                :value="field.returnName"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="90">
          <template #default="scope">
            <el-button
              type="primary"
              text
              @click="deleteMappingField(scope.$index)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-form-item label="展示详情" v-if="!isDialog">
      <el-switch
        v-model="data.ctrDialogConfig.showDetail"
        inline-prompt
        active-text="是"
        inactive-text="否"
        :active-value="true"
        :inactive-value="false"
      />
    </el-form-item>
    <!--详情展示配置-->
    <div v-if="data.ctrDialogConfig.showDetail" style="margin-top: 10px">
      <label class="el-form-item__label" style="padding: 0">
        详情展示配置：
      </label>
      <el-form-item label="pc端详情表单" label-width="150px">
        <el-input
          v-model="data.ctrDialogConfig.detailFormName"
          :readonly="true"
        >
          <template #append>
            <ab-cust-dialog
              v-model="data.ctrDialogConfig"
              dialog-key="formSelector"
              :param="{ type_$VEQ: 'pc' }"
              type="primary"
              :dialogSetting="{ multiple: 0 }"
              :value-mapping="{
                code: 'detailFormCode',
                name: 'detailFormName',
              }"
            >
              <el-icon><Search></Search></el-icon>
            </ab-cust-dialog>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="移动端详情表单" label-width="150px">
        <el-input
          v-model="data.ctrDialogConfig.detailFormNameMobile"
          :readonly="true"
        >
          <template #append>
            <ab-cust-dialog
              v-model="data.ctrDialogConfig"
              dialog-key="formSelector"
              :param="{ type_$VEQ: 'mobile' }"
              type="primary"
              :dialogSetting="{ multiple: 0 }"
              :value-mapping="{
                code: 'detailFormCodeMobile',
                name: 'detailFormNameMobile',
              }"
            >
              <el-icon><Search></Search></el-icon>
            </ab-cust-dialog>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="主键字段">
        <el-select
          v-model="data.ctrDialogConfig.detailKey"
          placeholder="请选择对象字段"
        >
          <el-option
            v-for="(column, index) in pageData.allColumns"
            :key="index"
            :label="column.name"
            :value="column.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="链接地址">
        <el-input v-model="data.ctrDialogConfig.detailLink"  type="textarea" :rows="3" />
      </el-form-item> -->
    </div>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'ab-custom-dialog-config',
  }
</script>

<script lang="ts" setup>
  import { defineProps, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import { bizApi } from '@agilebpm/api'
  import { Search, Plus } from '@element-plus/icons-vue'
  import defultValueConfig from './component/defaultValueConfig.vue'
  import * as abTools from '~/agilebpm/utils/ab-tools'
  import * as dialogUtil from './component/DialogConditionUtil'

  const props = defineProps({
    data: { type: Object, required: true },
    isDialog: { type: Boolean, default: false },
    noDesc: { type: Boolean, default: false },
    form: { type: Object, required: true },
    noMult: { type: Boolean, default: false },
  })
  const { data } = toRefs(props)
  const getDiyTableFn = inject('getDiyTable') as any

  //页面展示需要的数据
  const pageData = reactive({
    dialog: {} as any,
    currnetTableRel: null as any,
    parentTableRel: null as any,
    boList: [] as any[],
    allColumns: [] as any[],
    selectedBo: {} as any,
    boInfo: window.getBo() as any,
    isBo: abTools.useCurrentInstance().proxy.$route.query.mode != 'diyBo',
    selectParam: [] as any,
  })

  //选择对话框，对话框改变了，把相关数据清空
  const choseDialog = (list: any) => {
    if (!list || list.length < 1) {
      return
    }
    const dialogNo = list[0]

    data.value.ctrDialogConfig.dialogKey = dialogNo.code
    data.value.ctrDialogConfig.dialogName = dialogNo.name
    data.value.ctrDialogConfig.searchDesc = dialogNo.name
    data.value.ctrDialogConfig.paramsDefaultValue = {}
    data.value.ctrDialogConfig.params = {}

    if (data.value.ctrDialogConfig.mappingFields) {
      data.value.ctrDialogConfig.mappingFields.splice(
        0,
        data.value.ctrDialogConfig.mappingFields.length
      )
    }
    getDialogInfo(dialogNo.code)
    data.value.ctrDialogConfig.mappingFields.push({
      boField: data.value.code,
      dialogField: '',
    })
  }

  const cleanDataDialogInfo = () => {
    data.value.ctrDialogConfig.dialogKey = ''
    data.value.ctrDialogConfig.dialogName = ''
    data.value.ctrDialogConfig.params = {}
    data.value.ctrDialogConfig.searchDesc = ''
  }

  //获取对话框的 相关信息，返回值 ， 参数列表，配置
  const getDialogInfo = (dialogKey: string) => {
    if (!dialogKey) {
      return
    }
    bizApi.customDialog.getDialogByCode(dialogKey).then(
      (result: any) => {
        if (!result.isOk || !result.data) {
          ElMessage.error(`${dialogKey}对话框获取失败`)
          return
        }
        pageData.dialog = result.data
        //处理返回字段和显示字段
        if (pageData.dialog.returnFields && pageData.dialog.displayFields) {
          pageData.dialog.returnFields.forEach((rf: any) => {
            const item = pageData.dialog.displayFields.find((df: any) => {
              return df.columnName === rf.columnName
            })
            if (item) {
              rf.showName = item.showName + '(' + rf.returnName + ')'
            }
          })
        }
        //处理条件字段
        if (pageData.dialog.conditionFields) {
          pageData.dialog.conditionFields.forEach((item: any) => {
            item.paramName = dialogUtil.buildcondition(item)
          })
        }
        if (
          data.value.ctrDialogConfig.multiple == null ||
          data.value.ctrDialogConfig.multiple == undefined
        ) {
          data.value.ctrDialogConfig.multiple = pageData.dialog.multiple
        }
      },
      () => {
        ElMessage.error(
          `【${props.data.label}】字段配置的对话框【${dialogKey}】获取失败，请检查对话框，重新配置`
        )
        cleanDataDialogInfo()
      }
    )
  }

  const mappInfoBoChange = (value: string) => {
    if (data.value.ctrDialogConfig.mappingFields) {
      data.value.ctrDialogConfig.mappingFields.splice(
        0,
        data.value.ctrDialogConfig.mappingFields.length
      )
    }
    initSelectTable()
  }

  const addMappingField = () => {
    if (!data.value.ctrDialogConfig.mappingFields) {
      data.value.ctrDialogConfig.mappingFields = [] as any
    }
    data.value.ctrDialogConfig.mappingFields.push({
      boField: '',
      dialogField: '',
    })
  }

  const deleteMappingField = (index: number) => {
    if (
      !data.value.ctrDialogConfig.mappingFields ||
      data.value.ctrDialogConfig.mappingFields == 0
    ) {
      return
    }
    data.value.ctrDialogConfig.mappingFields.splice(index, 1)
  }

  const getTableColumn = (tableInfo: any) => {
    const columns = [] as any[]
    tableInfo.table.columns.forEach((column: any) => {
      columns.push({
        name: tableInfo.tableComment + '-' + column.comment,
        value: tableInfo.tablePath + '.' + column.code,
        code: column.code,
      })
    })
    return columns
  }

  const getCurrentTable = (tableInfo: any, parentTable: any) => {
    if (tableInfo.tableCode == props.data.tableCode) {
      pageData.currnetTableRel = tableInfo
      pageData.parentTableRel = parentTable
      return
    }
    if (!tableInfo.children || tableInfo.children.length === 0) {
      return
    }
    for (const i in tableInfo.children) {
      getCurrentTable(tableInfo.children[i], tableInfo)
    }
  }

  const setTableInfo = (tableInfo: any, parentTableInfo: any) => {
    let path = ''
    if (tableInfo.type === 'main') {
      path = 'data.' + pageData.boInfo.code
    } else {
      let parentPath = !parentTableInfo
        ? 'data.' + pageData.boInfo.code
        : parentTableInfo.tablePath

      //当前表的path
      if (tableInfo.tableCode == pageData.currnetTableRel.tableCode) {
        path = tableInfo.tableCode
        if (tableInfo.type === 'oneToOne') {
          path = parentPath + '.' + tableInfo.tableCode
        }
      } else {
        //其他表的path
        if (tableInfo.type === 'oneToMany') {
          path = parentPath + '.' + tableInfo.tableCode + 'List'
        }
        if (tableInfo.type === 'oneToOne') {
          path = parentPath + '.' + tableInfo.tableCode
        }
      }
    }
    tableInfo.tablePath = path
    if (!tableInfo.children || tableInfo.children.length === 0) {
      return
    }
    for (const i in tableInfo.children) {
      setTableInfo(tableInfo.children[i], tableInfo)
    }
  }

  const getBoList = (tableInfo: any) => {
    pageData.boList.push(tableInfo)
    if (!tableInfo.children || tableInfo.children.length === 0) {
      return
    }
    for (const i in tableInfo.children) {
      pageData.boList.push(tableInfo.children[i])
    }
  }

  /**
   * 获取可以映射的表,可用的列
   * 可以用的表：当前表，以及字表
   * 可以用的列：当前表的列，以及当前表的父表的列
   */
  const getCanUseTables = () => {
    const currentCode = props.data.tableCode
    const currentTableInfo = {}
    if (pageData.isBo) {
      currentTableInfo = dialogUtil.getCurrentTableInfo(
        props.data.tableCode,
        pageData.boInfo.rel
      )
    } else {
      const currentTable = getDiyTableFn(props.data.prop, props.isMb)
      currentCode = currentTable.tableCode
      currentTableInfo = dialogUtil.getCurrentTableInfo(
        currentCode,
        pageData.boInfo.rel
      )
    }
    pageData.currnetTableRel = currentTableInfo.currentTable
    pageData.parentTableRel = currentTableInfo.parentTable

    //设置tablePath
    dialogUtil.setTableInfo(
      pageData.boInfo.code,
      currentCode,
      pageData.boInfo.rel
    )
    getBoList(pageData.currnetTableRel)
    handleAllColumns(pageData.currnetTableRel)
  }

  const handleAllColumns = (rel: any) => {
    handleTable(rel)
    if (rel.parent) {
      handleTable(rel.parent)
    }
    if (rel.type != 'main' && rel.parent.type != 'main') {
      handleTable(pageData.boInfo.rel)
    }
  }

  const handleTable = (rel: any) => {
    rel.table.columns.forEach((c: any) => {
      pageData.allColumns.push({
        name: `${rel.table.comment}-${c.comment}`,
        value: `${getTablePath(rel)}.${c.code}`,
      })
    })
  }

  const getTablePath = (rel: any): any => {
    if (rel.type == 'main') {
      return `data.${pageData.boInfo.code}`
    }
    if (rel.type == 'oneToMany') {
      return `${rel.tableCode}`
    }
    return `${getTablePath(rel.parent)}.${rel.tableCode}`
  }

  const initSelectTable = () => {
    pageData.boList.forEach((item: any) => {
      if (item.tablePath == data.value.ctrDialogConfig.mappingBo) {
        pageData.selectedBo = item
        data.value.ctrDialogConfig.mappingInitData = `initData.${pageData.boInfo.code}.${item.tableCode}`
        return
      }
    })
  }

  /**
   * 简易模式下获取当前表,目前只考虑了两层的数据结构
   */
  const getCurrentTableEasy = () => {
    pageData.currnetTableRel = getDiyTableFn(data.value.prop, props.form.isMb)
    if (pageData.currnetTableRel.type !== 'main') {
      pageData.parentTableRel = pageData.boInfo.rel
      pageData.parentTableRel.tablePath = 'data.' + pageData.boInfo.code
      pageData.currnetTableRel.tablePath = pageData.currnetTableRel.tableCode
    } else {
      pageData.currnetTableRel.tablePath = 'data.' + pageData.boInfo.code
      pageData.parentTableRel = pageData.currnetTableRel
      setTableInfo(pageData.parentTableRel, null)
    }
  }

  const initData = () => {
    if (!data.value.ctrDialogConfig) {
      data.value.ctrDialogConfig = {
        dialogName: '',
        dialogKey: '',
        multiple: 0,
        params: {} as any,
        paramsDefaultValue: {} as any,
        mappingBo: '',
        detailFormCode: '',
        detailFormName: '',
        detailFormCodeMobile: '',
        detailFormNameMobile: '',
        detailKey: '',
        detailLink: '',
        showDetail: false,
        mappingFields: [] as any,
        mappingTableCode: '',
      }
    }
    initSelectTable()
    if (data.value.ctrDialogConfig.dialogKey) {
      getDialogInfo(data.value.ctrDialogConfig.dialogKey)
    }
  }
  const initParams = () => {
    const selected = [] as string[]
    if (data.value.ctrDialogConfig.params) {
      Object.keys(data.value.ctrDialogConfig.params).forEach((key: string) => {
        selected.push(key.split('-')[0])
      })
    }
    if (data.value.ctrDialogConfig.paramsDefaultValue) {
      Object.keys(data.value.ctrDialogConfig.paramsDefaultValue).forEach(
        (key: string) => {
          const columnName = key.split('-')[0]
          if (!selected.includes(columnName)) {
            selected.push(columnName)
          }
        }
      )
    }
    pageData.selectParam = selected
  }

  getCanUseTables()
  initData()
  initParams()

  const dialogParams = computed(() => {
    return pageData.dialog.conditionFields.filter((e: any) => {
      return pageData.selectParam.includes(e.columnName)
    })
  })

  const deleteByParamName = (param: any) => {
    const paramName = dialogUtil.buildcondition(param)
    // 删除 params
    delete data.value.ctrDialogConfig.params[paramName]
    //删除 defaultValue
    delete data.value.ctrDialogConfig.paramsDefaultValue[paramName]
  }

  const deleteParam = (param: any, index: number) => {
    // 删除选择项 pageData.selectParam
    pageData.selectParam.splice(index, 1)

    deleteByParamName(param)
  }

  const removeTag = (tagValue: any) => {
    const param = data.dialog.conditionFields.find((e: any) => {
      return e.columnName === tagValue
    })
    deleteByParamName(param)
  }

  const clearAll = () => {
    // 删除 params
    data.dialog.conditionFields.forEach((e: any) => {
      deleteByParamName(e)
    })
  }
</script>

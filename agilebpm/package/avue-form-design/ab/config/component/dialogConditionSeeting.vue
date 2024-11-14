<template>
  <!--对话框参数配置-->
  <div
    v-if="
      props.dialog.conditionFields && props.dialog.conditionFields.length > 0
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
          v-for="item in props.dialog.conditionFields"
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
            v-model="params[dialogUtil.buildcondition(scope.row)]"
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
            v-model="paramsDefaultValue[dialogUtil.buildcondition(scope.row)]"
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
</template>

<script lang="ts" setup>
  import { defineProps, onMounted } from 'vue'
  import * as abTools from '~/agilebpm/utils/ab-tools'
  import * as dialogUtil from './DialogConditionUtil'
  import { Delete } from '@element-plus/icons-vue'

  const props = defineProps({
    dialog: { type: Object, required: true },
    params: { type: Object, default: {} },
    paramsDefaultValue: { type: Object, default: {} },
    currentCode: { required: true },
    isMb: { default: false },
    columnProp: { default: null },
  })

  const paramSelect = ref()
  const { params, paramsDefaultValue } = toRefs(props)
  const getDiyTableFn = inject('getDiyTable') as any

  const emit = defineEmits(['getCourrentInfo'])

  const pageData = reactive({
    currentTableInfo: {
      parentTable: {},
      currentTable: {},
    },
    allColumns: [] as any[],
    boInfo: window.getBo() as any,
    isBo: abTools.useCurrentInstance().proxy.$route.query.mode != 'diyBo',
    selectParam: [] as any,
  })

  let currentCode = props.currentCode
  //获取当前表
  if (pageData.isBo) {
    pageData.currentTableInfo = dialogUtil.getCurrentTableInfo(
      props.currentCode,
      pageData.boInfo.rel
    )
  } else {
    const currentTable = getDiyTableFn(props.columnProp, props.isMb)
    currentCode = currentTable.tableCode
    pageData.currentTableInfo = dialogUtil.getCurrentTableInfo(
      currentCode,
      pageData.boInfo.rel
    )
  }
  //设置tablePath
  dialogUtil.setTableInfo(
    pageData.boInfo.code,
    currentCode,
    pageData.boInfo.rel
  )

  //获取可用的列
  // pageData.allColumns = dialogUtil.getCanUseColum(
  //   pageData.currentTableInfo.currentTable
  // )

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

  handleAllColumns(pageData.currentTableInfo.currentTable)

  const dialogParams = computed(() => {
    return props.dialog.conditionFields.filter((e: any) => {
      return pageData.selectParam.includes(e.columnName)
    })
  })

  const deleteByParamName = (param: any) => {
    const paramName = dialogUtil.buildcondition(param)
    // 删除 params
    delete params.value[paramName]
    //删除 defaultValue
    delete paramsDefaultValue.value[paramName]
  }

  const deleteParam = (param: any, index: number) => {
    // 删除选择项 pageData.selectParam
    pageData.selectParam.splice(index, 1)

    deleteByParamName(param)
  }

  const removeTag = (tagValue: any) => {
    const param = props.dialog.conditionFields.find((e: any) => {
      return e.columnName === tagValue
    })
    deleteByParamName(param)
  }

  const clearAll = () => {
    // 删除 params
    props.dialog.conditionFields.forEach((e: any) => {
      deleteByParamName(e)
    })
  }

  onMounted(() => {
    const selected = [] as string[]
    if (props.params) {
      Object.keys(props.params).forEach((key: string) => {
        selected.push(key.split('-')[0])
      })
    }
    if (props.paramsDefaultValue) {
      Object.keys(props.paramsDefaultValue).forEach((key: string) => {
        const columnName = key.split('-')[0]
        if (!selected.includes(columnName)) {
          selected.push(columnName)
        }
      })
    }
    pageData.selectParam = selected
  })

  emit('getCourrentInfo', pageData.currentTableInfo)
</script>

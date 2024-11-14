import { getDialogByCode } from '~/agilebpm/api/modules/ab-biz/ab-biz-customDialog'
import { ElMessage } from 'element-plus'

/**
 * 获取当前表信息 以及当前表的父级
 * @param currentCode 当前表的code
 * @param tableInfo  顶级表信息
 * @param parentTable
 * @returns 当前表以及当前表的父表
 */
export function getCurrentTableInfo(
  currentCode: any,
  tableInfo: any,
  parentTable = null
) {
  let result = {} as any

  if (tableInfo.tableCode === currentCode) {
    if (tableInfo.type === 'main') {
      return {
        currentTable: tableInfo,
        parentTable: tableInfo,
      }
    }
    return {
      currentTable: tableInfo,
      parentTable: parentTable,
    }
  }

  if (tableInfo.children && tableInfo.children.length > 0) {
    for (const i in tableInfo.children) {
      result = getCurrentTableInfo(
        currentCode,
        tableInfo.children[i],
        tableInfo
      )
      if (result.currentTable) {
        return result
      }
    }
  }

  return result
}

/**
 * 为表设置path 如：data.tableCodeList
 * @param tableInfo
 * @param parentTableInfo
 * @returns
 */
export function setTableInfo(
  boCode: any,
  currentCode: any,
  tableInfo: any,
  parentTable = null as any
) {
  let path = ''
  //主表path
  if (tableInfo.type === 'main') {
    path = `data.${boCode}`
  } else if (tableInfo.tableCode === currentCode) {
    //当前表的path
    path = tableInfo.tableCode
    if (tableInfo.type === 'oneToOne') {
      path = parentTable.tablePath + '.' + tableInfo.tableCode
    }
  } else {
    //其他表的path
    if (tableInfo.type === 'oneToMany') {
      path = parentTable.tablePath + '.' + tableInfo.tableCode + 'List'
    }
    if (tableInfo.type === 'oneToOne') {
      path = parentTable.tablePath + '.' + tableInfo.tableCode
    }
  }
  tableInfo.tablePath = path
  if (!tableInfo.children || tableInfo.children.length === 0) {
    return
  }
  for (const i in tableInfo.children) {
    setTableInfo(boCode, currentCode, tableInfo.children[i], tableInfo)
  }
}

//获取表的列表
const getTableColumn = (tableInfo: any) => {
  const columns = [] as any[]
  tableInfo.table.columns.forEach((column: any) => {
    columns.push({
      name: `${column.comment}(${tableInfo.tableComment})`,
      value: tableInfo.tablePath + '.' + column.code,
      code: column.code,
    })
  })
  return columns
}

//对话框查询条件拼接
export function buildcondition(conditionFieldInfo: any) {
  let result = conditionFieldInfo.columnName + '-'
  const dataType = conditionFieldInfo.dbType
  if (!dataType) {
    return result + 'V' + conditionFieldInfo.condition
  }
  if (dataType.search(/DATE/i) != -1 || dataType.search(/TIME/i) != -1) {
    return result + 'D' + conditionFieldInfo.condition
  }

  if (
    dataType.search(/INT/i) != -1 ||
    dataType.search(/FLOAT/i) != -1 ||
    dataType.search(/DOUBLE/i) != -1 ||
    dataType.search(/DECIMAL/i) != -1
  ) {
    return result + 'N' + conditionFieldInfo.condition
  }
  return result + 'V' + conditionFieldInfo.condition
}

/**
 * 获取可以用的列:
 * 当前表的列,
 * 当前表所有的父级的列,
 * @param currentTable 当前表
 * @returns
 */
export function getCanUseColum(currentTable: any) {
  const result = [] as any[]
  getTableColumn(currentTable).forEach((item) => {
    result.push(item)
  })
  if (currentTable.type == 'main') {
    return result
  }
  const allParent = [] as any[]
  getAllParent(currentTable, allParent)
  if (allParent.length > 0) {
    allParent.forEach((parent) => {
      getTableColumn(parent).forEach((column) => {
        result.push(column)
      })
    })
  }
  return result
}
export function getAllParent(tableRel: any, allParent: any) {
  if (!tableRel.parent) {
    return
  }
  allParent.push(tableRel.parent)
  getAllParent(tableRel.parent, allParent)
}

export function getDialog(dialogKey: string) {
  Promise.resolve({
    then: async function (resolve: (arg0: any) => void, _reject: any) {
      const result = await getDialogByCode(dialogKey)
      if (result.isOk && result.data) {
        resolve(result.data)
        return
      } else {
        ElMessage.error(`获取对话框【${dialogKey}信息失败`)
      }
    },
  })
}

//获取展示字段 和value 字段对应的数据库字段 作为 对话框的查询条件
export function getParamAndLabelColumn(dialogReturnFields: any) {
  const result = {} as any
  if (!dialogReturnFields || dialogReturnFields.length === 0) {
    return result
  }

  dialogReturnFields.forEach((e: any) => {
    if (e.returnName === 'id') {
      result.param = e.columnName
    }
    if (e.returnName === 'name') {
      result.labelColumn = e.columnName
    }
  })

  return result
}

export function handleDialogConditionFields(dialogInfo: any) {
  const result = [] as any[]
  if (!dialogInfo) {
    return result
  }
  const fileds = [] as any[]
  //如果数据源是接口的话取返回值和条件字段的交集
  if (dialogInfo.dataSource === 'interface') {
    if (
      dialogInfo.conditionFields?.length === 0 ||
      dialogInfo.returnFields?.length === 0
    ) {
      return result
    }
    dialogInfo.returnFields.forEach((rf: any) => {
      const filed = dialogInfo.conditionFields.find((cf: any) => {
        return rf.columnName === cf.columnName
      })
      if (filed) {
        fileds.push(rf)
      }
    })
    if (fileds.length === 0) {
      return result
    }
  } else {
    fileds.push(...dialogInfo.returnFields)
  }
  fileds.forEach((item: any) => {
    result.push({
      returnName: item.returnName,
      showName: item.showName,
      columnName: item.columnName,
    })
  })

  return result
}

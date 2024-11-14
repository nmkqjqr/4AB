let isEasy: boolean
let showCode: string
let showName: string
let fieldType: string
let currentTable: any
let allArr: any[]
let dataValue: any
let objectMapping: string

//将字典数据转换成指定的格式
export function getDesign(
  bo: any, //window.getBo()
  isEasyCope: boolean, //是否是简式表单
  dataValueCope: any //当前表的data对象
) {
  currentTable = bo.rel
  dataValue = dataValueCope
  isEasy = isEasyCope
  showCode = isEasy ? 'prop' : 'code'
  showName = isEasy ? 'label' : 'comment'
  fieldType = isEasy ? 'fieldType' : 'type'
  allArr = []
  getCurrentTable(true, bo.rel, 'data.' + bo.code)

  return {
    currentTable: currentTable, //选中组件的当前表对象
    allArr: allArr, //当前表单中所有的字段（可以通过类型，以及所属table进行自由筛选）
    objectMapping: objectMapping ? objectMapping : 'data.' + bo.code, //选中字段的前缀objectMapping（因一对多，一对一，以及父，主，tab，分组中都略有不同，因此需要动态返回）
  }
}

//获取当前表，并动态填充当前表的  1 是
const getCurrentTable = (flag: boolean, table: any, pathName: string) => {
  if (flag) {
    let arr = isEasy ? table.json.column : table.table.columns
    if (arr && arr.length > 0) {
      //是否跳出方法的标记
      let isSelect = false

      for (const s in arr) {
        if (arr[s][showCode] == dataValue[showCode]) {
          isSelect = true
        }
        if (
          [
            'title',
            'divider',
            'alert',
            'content',
            'iframe',
            'verificationCode',
          ].includes(arr[s].type)
        ) {
          continue
        }
        allArr.push({
          type: arr[s][fieldType], //实体类型 （字符串还是数字）
          cType: arr[s].type, //组件类型  （单行文本还是下拉框）
          code: arr[s].code, //给多选日期或结束日期的code字符串
          param: pathName + '.' + arr[s].code, //日期最大值最小值的全路径参数
          name: table.tableComment + '-' + arr[s][showName], //下拉框的展示
          table: table.tableCode,
        })
        if (
          !arr[s].subTable &&
          arr[s].children &&
          arr[s].children.column &&
          arr[s].children.column.length > 0
        ) {
          let f = getChild(
            true,
            arr[s].children.column,
            pathName,
            table.tableComment,
            table.tableCode
          )
          if (f) {
            isSelect = true
          }
        }

        if (
          !arr[s].subTable &&
          arr[s].tabsColumn &&
          arr[s].tabsColumn.length > 0
        ) {
          let f = getChild(
            false,
            arr[s].tabsColumn,
            pathName,
            table.tableComment,
            table.tableCode
          )
          if (f) {
            isSelect = true
          }
        }
      }
      if (isSelect) {
        objectMapping = table.type == 'oneToMany' ? table.tableCode : pathName
        currentTable = table
      }
    }
  }

  if (!flag) {
    let arr = isEasy ? table.json.children.column : table.table.columns
    if (arr && arr.length > 0) {
      arr.forEach((s: any) => {
        if (s[showCode] == dataValue[showCode]) {
          objectMapping = table.type == 'oneToMany' ? table.tableCode : pathName
          currentTable = table
        }
        if (isEasy) {
          if (allArr.map((s) => s.code).includes(s.code)) {
            let find = allArr.find((item) => item.code === s.code)
            find['type'] = s[fieldType]
            find['cType'] = s.type
            find['code'] = s.code //给多选日期或结束日期的code字符串
            find['param'] =
              table.type == 'oneToMany'
                ? pathName + 'List[index].' + s.code
                : pathName + '.' + s.code
            find['name'] = table.tableComment + '-' + s[showName] //下拉框的展示
            find['table'] = table.tableCode
          } else {
            allArr.push({
              type: s[fieldType],
              cType: s.type,
              code: s.code, //给多选日期或结束日期的code字符串
              param:
                table.type == 'oneToMany'
                  ? pathName + 'List[index].' + s.code
                  : pathName + '.' + s.code, //日期最大值最小值的全路径参数
              name: table.tableComment + '-' + s[showName], //下拉框的展示
              table: table.tableCode,
            })
          }
        } else {
          allArr.push({
            type: s[fieldType],
            cType: s.type,
            code: s.code, //给多选日期或结束日期的code字符串
            param:
              table.type == 'oneToMany'
                ? pathName + 'List[index].' + s.code
                : pathName + '.' + s.code, //日期最大值最小值的全路径参数
            name: table.tableComment + '-' + s[showName], //下拉框的展示
            table: table.tableCode,
          })
        }
      })
    }
  }
  if (table.children && table.children.length > 0) {
    for (const i in table.children) {
      getCurrentTable(
        false,
        table.children[i],
        pathName + '.' + table.children[i].tableCode
      )
    }
  }
}
//获取当前表，并动态填充当前表的
const getChild = (
  isChild: boolean,
  arr: any[],
  pathName: string,
  tableName: string,
  tableCode: string
) => {
  let flag = false

  if (isChild) {
    for (const s in arr) {
      allArr.push({
        type: arr[s][fieldType],
        cType: arr[s].type,
        code: arr[s].code, //给多选日期或结束日期的code字符串
        param: pathName + '.' + arr[s].code, //日期最大值最小值的全路径参数
        name: tableName + '-' + arr[s][showName], //下拉框的展示
        table: tableCode,
      })
      if (
        arr[s] &&
        !arr[s].subTable &&
        arr[s].children &&
        arr[s].children.column &&
        arr[s].children.column.length > 0
      ) {
        let f = getChild(
          true,
          arr[s].children.column,
          pathName,
          tableName,
          tableCode
        )
        if (f) {
          flag = true
        }
      }
      //~~~~~~~~~~~~~~~~~~
      if (arr[s].tabsColumn && arr[s].tabsColumn.length > 0) {
        let f = getChild(
          false,
          arr[s].tabsColumn,
          pathName,
          tableName,
          tableName
        )
        if (f) {
          flag = true
        }
      }

      if (arr[s][showCode] == dataValue[showCode]) {
        flag = true
      }
    }
  } else {
    for (const s in arr) {
      if (
        arr[s] &&
        !arr[s].subTable &&
        arr[s].children &&
        arr[s].children.column &&
        arr[s].children.column.length > 0
      ) {
        let childArr = arr[s].children.column
        for (const i in childArr) {
          allArr.push({
            type: childArr[i][fieldType],
            cType: childArr[i].type,
            code: childArr[i].code, //给多选日期或结束日期的code字符串
            param: pathName + '.' + childArr[i].code, //日期最大值最小值的全路径参数
            name: tableName + '-' + childArr[i][showName], //下拉框的展示
            table: tableCode,
          })
          if (
            childArr[i].children &&
            childArr[i].children.column &&
            childArr[i].children.column.length > 0
          ) {
            let f = getChild(
              true,
              childArr[i].children.column,
              pathName,
              tableName,
              tableCode
            )
            if (f) {
              flag = true
            }
          }

          if (childArr[i].tabsColumn && childArr[i].tabsColumn.length > 0) {
            let f = getChild(
              false,
              childArr[i].tabsColumn,
              pathName,
              tableName,
              tableName
            )
            if (f) {
              flag = true
            }
          }

          if (childArr[i][showCode] == dataValue[showCode]) {
            flag = true
          }
        }
      }
    }
  }
  return flag
}

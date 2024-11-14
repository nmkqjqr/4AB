export function toJs(json: any, tableCode = '') {
  let js = ''
  const columnName = json.valCol.substring(json.valCol.lastIndexOf('.') + 1)
  const tabCode = json.valCol.substring(0, json.valCol.lastIndexOf('.'))

  if (json.valColRelType == 'oneToOne') {
    js += `props.modelValue.${json.valCol}`
  } else if (json.valColRelType == 'oneToMany') {
    js += `props.modelValue.${columnName}`
  } else {
    //主表
    js += `props.data.${columnName}`
  }
  if (['inl', 'nnl'].includes(json.cond)) {
    js = `${condMap[json.cond]}${js}`
  } else {
    js += ` ${condMap[json.cond]}`
    if (json.valColType == 'varchar') {
      js += ` "${json.condVal}"`
    } else {
      js += ` ${json.condVal}`
    }
  }
  json.children.forEach((jn: any) => {
    js += ` ${logicMap[jn.logic]} ${toJs(jn, tableCode)}`
  })

  if (!json.parentSn) {
    return `return ${js}`
  }
  return js
}

const condMap = {
  eq: '==',
  ne: '!=',
  gt: '>',
  ge: '>=',
  lt: '<',
  le: '<=',
  inl: '!',
  nnl: '!!',
}

const logicMap = {
  and: '&&',
  or: '||',
}

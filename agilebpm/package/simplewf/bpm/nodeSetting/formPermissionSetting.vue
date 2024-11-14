<template>
  <div class="demo-drawer__content">
    <div style="table-layout: auto; border-collapse: collapse">
      <table
        class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition el-table--medium"
      >
        <thead>
          <tr>
            <th class="cell is-center" style="width: 30%">名字</th>
            <th v-if="!readonly" class="cell is-center">必填</th>
            <th v-if="!readonly" class="cell is-center">编辑</th>
            <th class="cell is-center">只读</th>
            <th class="cell is-center">隐藏</th>
          </tr>
        </thead>
        <tbody class="ivu-table-tbody">
          <tr class="tabelTr">
            <td class="cell is-center">全局设置</td>
            <td v-if="!readonly" class="cell is-center">
              <el-radio
                border
                class="radioStyle"
                label="b"
                :model-value="getRightStr(data.permission.boMap.rights)"
                @change="setRightLoopAll(data.permission.boMap, 'b')"
              >
                {{ '' }}
              </el-radio>
            </td>
            <td v-if="!readonly" class="cell is-center">
              <el-radio
                border
                class="radioStyle"
                label="w"
                :model-value="getRightStr(data.permission.boMap.rights)"
                @change="setRightLoopAll(data.permission.boMap, 'w')"
              >
                {{ '' }}
              </el-radio>
            </td>
            <td class="cell is-center">
              <el-radio
                border
                class="radioStyle"
                label="r"
                :model-value="getRightStr(data.permission.boMap.rights)"
                @change="setRightLoopAll(data.permission.boMap, 'r')"
              >
                {{ '' }}
              </el-radio>
            </td>
            <td class="cell is-center">
              <el-radio
                border
                class="radioStyle"
                label="n"
                :model-value="getRightStr(data.permission.boMap.rights)"
                @change="setRightLoopAll(data.permission.boMap, 'n')"
              >
                {{ '' }}
              </el-radio>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- v-if="table.columnsWithoutPrimary.length > 0" -->
      <table
        v-for="(table, idx) in data.tableList"
        :key="idx"
        class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition el-table--medium"
      >
        <tbody class="">
          <tr>
            <td class="cell is-center" style="width: 30%">
              {{ table.comment }}
            </td>
            <td v-if="!readonly" class="cell is-center">
              <el-radio
                border
                class="radioStyle"
                label="b"
                :model-value="
                  getRightStr(data.permission.boMap.tableMap[table.code].rights)
                "
                @change="
                  setRightLoopTable(
                    data.permission.boMap.tableMap[table.code],
                    'b'
                  )
                "
              >
                {{ '' }}
              </el-radio>
            </td>
            <td v-if="!readonly" class="cell is-center">
              <el-radio
                border
                class="radioStyle"
                label="w"
                :model-value="
                  getRightStr(data.permission.boMap.tableMap[table.code].rights)
                "
                @change="
                  setRightLoopTable(
                    data.permission.boMap.tableMap[table.code],
                    'w'
                  )
                "
              >
                {{ '' }}
              </el-radio>
            </td>
            <td class="cell is-center">
              <el-radio
                border
                class="radioStyle"
                label="r"
                :model-value="
                  getRightStr(data.permission.boMap.tableMap[table.code].rights)
                "
                @change="
                  setRightLoopTable(
                    data.permission.boMap.tableMap[table.code],
                    'r'
                  )
                "
              >
                {{ '' }}
              </el-radio>
            </td>
            <td class="cell is-center">
              <el-radio
                border
                class="radioStyle"
                label="n"
                :model-value="
                  getRightStr(data.permission.boMap.tableMap[table.code].rights)
                "
                @change="
                  setRightLoopTable(
                    data.permission.boMap.tableMap[table.code],
                    'n'
                  )
                "
              >
                {{ '' }}
              </el-radio>
            </td>
          </tr>
          <tr v-for="(column, i) in table.columnsWithoutPrimary" :key="i">
            <td class="cell is-center">
              {{ column.comment }}
            </td>
            <td v-if="!readonly" class="cell is-center">
              <el-radio
                border
                class="radioStyle"
                label="b"
                :model-value="
                  getRightStr(
                    data.permission.boMap.tableMap[table.code].columnMap[
                      column.code
                    ].rights
                  )
                "
                @change="
                  setRightStr(
                    data.permission.boMap.tableMap[table.code].columnMap[
                      column.code
                    ].rights,
                    'b'
                  )
                "
              >
                {{ '' }}
              </el-radio>
            </td>

            <td v-if="!readonly" class="cell is-center">
              <el-radio
                border
                class="radioStyle"
                label="w"
                :model-value="
                  getRightStr(
                    data.permission.boMap.tableMap[table.code].columnMap[
                      column.code
                    ].rights
                  )
                "
                @change="
                  setRightStr(
                    data.permission.boMap.tableMap[table.code].columnMap[
                      column.code
                    ].rights,
                    'w'
                  )
                "
              >
                {{ '' }}
              </el-radio>
            </td>
            <td class="cell is-center">
              <el-radio
                border
                class="radioStyle"
                label="r"
                :model-value="
                  getRightStr(
                    data.permission.boMap.tableMap[table.code].columnMap[
                      column.code
                    ].rights
                  )
                "
                @change="
                  setRightStr(
                    data.permission.boMap.tableMap[table.code].columnMap[
                      column.code
                    ].rights,
                    'r'
                  )
                "
              >
                {{ '' }}
              </el-radio>
            </td>
            <td class="cell is-center">
              <el-radio
                border
                class="radioStyle"
                label="n"
                :model-value="
                  getRightStr(
                    data.permission.boMap.tableMap[table.code].columnMap[
                      column.code
                    ].rights
                  )
                "
                @change="
                  setRightStr(
                    data.permission.boMap.tableMap[table.code].columnMap[
                      column.code
                    ].rights,
                    'n'
                  )
                "
              >
                {{ '' }}
              </el-radio>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script lang="ts" setup>
  const props = defineProps({
    nodeDef: { required: true, type: Object },
    commonUtil: { required: true, type: Object },
    readonly: { required: false, type: Boolean },
  })

  const inject_bo = inject('boList') as any
  const flowKey = inject('flowKey', '') as any
  const { nodeDef, commonUtil, readonly } = toRefs(props)
  const data: any = reactive({
    permission: nodeDef.value?.plugins?.permission,
    oldPermission: {},
    boList: inject_bo,
    tableList: [] as any,
    flowKey: flowKey,
  })

  /* onMounted(() => {
  initOldPer()
}) */
  const getRightStr = (rights: any) => {
    let rightStr = ''
    if (rights) {
      for (const right_key in rights) {
        const rlist = rights[right_key]
        if (rlist && rlist.length > 0 && rlist[0].type == 'everyone') {
          rightStr = right_key
        }
      }
    }
    return rightStr
  }
  //表字段设置权限
  const setRightStr = (rights: any, rightStr: any) => {
    if (rights) {
      //如果当前有这个权限修改本权限和其他权限
      if (rights.hasOwnProperty(rightStr)) {
        for (const right_key in rights) {
          const rlist = rights[right_key]
          //如果是传入的权限类型，权限修改为everyone
          if (right_key == rightStr) {
            //判空
            if (rlist && rlist.length > 0) {
              setRightByType(rights, right_key, 'everyone')
              setOtherRights(rights, rightStr)
              /*   //把其他类型权限设为 none
            for (const r_k in rights) {
              if (r_k != rightStr) {
                setRightByType(rights, r_k, 'none')
              }
            } */
              return
            }
          } else {
            //不是本次选中类型改为无权限 none
            setRightByType(rights, right_key, 'none')
          }
        }
      } else {
        //没有这个权限，增加权限
        setRights(rights, rightStr, 'everyone')
        setOtherRights(rights, rightStr)
      }
    }
  }
  /**
   *
   * @param rights
   * @param rightStr 该参数不会被修改,其他right中的类型会被修改为无权限
   * @param type
   */
  const setOtherRights = (rights: any, rightStr: any) => {
    //把其他类型权限设为 none
    for (const r_k in rights) {
      if (r_k != rightStr) {
        setRightByType(rights, r_k, 'none')
      }
    }
  }
  //设置表和表下字段权限
  const setRightLoopTable = (tableObj: any, rightStr: any) => {
    setRightStr(tableObj.rights, rightStr)
    for (const column_key in tableObj.columnMap) {
      setRightStr(tableObj.columnMap[column_key].rights, rightStr)
    }
  }
  //设置全局bo权限
  const setRightLoopAll = (boObj: any, rightStr: any) => {
    setRightStr(boObj.rights, rightStr)
    for (const table_key in boObj.tableMap) {
      setRightLoopTable(boObj.tableMap[table_key], rightStr)
    }
  }
  //字段变更选择时修改model关联对象
  const setRightByType = (rights: any, right_key: any, type: any) => {
    if (type == 'everyone') {
      rights[right_key][0].type = 'everyone'
      rights[right_key][0].desc = '所有人'
    }
    if (type == 'none') {
      rights[right_key][0].type = 'none'
      rights[right_key][0].desc = '无权限'
    }
  }
  const initOldPer = () => {
    if (nodeDef.value.nodeType == 'StartNoneEvent') {
      data.defaultPermission = 'w'
    }
    if (nodeDef.value?.plugins?.permission) {
      data.oldPermission = deepClone(nodeDef.value.plugins.permission)
    } else {
      // 初始化一个节点的权限配置
      data.permission = {
        type: 'flowNode',
        value: String,
        boMap: {},
      }
    }
    initformJson()
  }

  const setRights = (rights: any, key: string, type: string) => {
    rights[key] = [
      {
        type: type,
      },
    ]
    if (type === 'everyone') {
      rights[key][0].desc = '所有人'
    } else {
      rights[key][0].desc = '无权限'
    }
  }

  const getRightsDesc = (rights: any) => {
    if (
      !rights ||
      rights.length == 0 ||
      ['everyone', 'none'].includes(rights[0].type)
    ) {
      return ''
    }

    const list: any = []
    rights.forEach((r: any) => {
      list.push(r.desc)
    })

    return list.join(' 和 ')
  }

  const changeGlobal = () => {
    nextTick(() => {
      data.formJson.tableList.forEach((item: any) => {
        if (!item.children) return

        data.permission.tableMap[item.prop].rights = data.permission.rights
        item.children.column.forEach((column: any) => {
          data.permission.tableMap[item.prop].columnMap[column.prop] =
            data.permission.rights
        })
      })
    })
  }
  //每次初始化最新的bo对象，再把已有的权限赋值
  const initformJson = () => {
    const boObject = data.boList[0] as any

    if (!boObject) {
      return false
    }
    data.permission.boMap = {}
    data.permission.type = 'flowNode'
    data.permission.value = `${data.flowKey}-${nodeDef.value.nodeKey}-default`
    const bo: any = {}
    bo.code = boObject?.code
    bo.comment = boObject?.name
    //业务对象默认编辑权限
    bo.rights = {}

    //对象如果有老数据，把老数据权限配置到这里
    if (data.oldPermission?.boMap?.rights) {
      bo.rights = data.oldPermission?.boMap?.rights
    } else {
      if (readonly.value) {
        setRights(bo.rights, 'r', 'everyone')
        setRights(bo.rights, 'w', 'none')
        setRights(bo.rights, 'b', 'none')
      } else {
        setRights(bo.rights, 'w', 'everyone')
        setRights(bo.rights, 'b', 'none')
        setRights(bo.rights, 'r', 'none')
      }
    }
    bo.tableMap = {}
    data.tableList = []
    data.tableList.push(boObject.rel.table)
    if (boObject?.rel?.children && boObject?.rel?.children.length > 0) {
      boObject?.rel?.children?.forEach((chl: any) =>
        data.tableList.push(chl.table)
      )
    }
    //循环表
    data.tableList.forEach((t: any) => {
      //把表加入boMap
      const table: any = {}
      table.code = t.code
      table.comment = t.comment
      table.rights = {}
      //表如果有老数据，把老数据权限配置到这里
      if (data.oldPermission?.boMap?.tableMap[t.code]?.rights) {
        table.rights = data.oldPermission.boMap.tableMap[t.code].rights
      } else {
        if (readonly.value) {
          setRights(table.rights, 'r', 'everyone')
        } else {
          setRights(table.rights, 'w', 'everyone')
        }
      }

      table.columnMap = {}
      //循环行
      t.columnsWithoutPrimary.forEach((c: any) => {
        const column: any = {}
        column.code = c.code
        column.comment = c.comment
        column.rights = {}
        //行如果有老数据，把老数据权限配置到这里
        if (
          data.oldPermission?.boMap?.tableMap[t.code]?.columnMap[c.code]?.rights
        ) {
          column.rights =
            data.oldPermission.boMap.tableMap[t.code].columnMap[c.code].rights
        } else {
          if (readonly.value) {
            setRights(column.rights, 'r', 'everyone')
          } else {
            setRights(column.rights, 'w', 'everyone')
          }
        }

        table.columnMap[column.code] = column
      })
      bo.tableMap[table.code] = table
    })

    data.permission.boMap = bo
  }

  /**
   * 对象深克隆
   * @param obj 源对象
   * @returns 克隆后的对象
   */
  function deepClone(obj: any) {
    let newObj: any
    try {
      newObj = obj.push ? [] : {}
    } catch (error) {
      newObj = {}
    }
    for (const attr in obj) {
      if (obj[attr] && typeof obj[attr] === 'object') {
        newObj[attr] = deepClone(obj[attr])
      } else {
        newObj[attr] = obj[attr]
      }
    }
    return newObj
  }

  //bo发生变化更新字段
  watch(
    () => data.boList,
    () => {
      initOldPer()
      initformJson()
    },
    { deep: true, immediate: true }
  )
  watch(
    () => data.permission,
    (newVal) => {
      if (newVal) {
        nodeDef.value.plugins.permission = newVal
      }
    },
    { deep: true, immediate: true }
  )
</script>
<style scoped>
  .centerTd td,
  .centerTd th {
    text-align: center;
  }

  .tabelTr td {
    background-color: #f8f8f9;
  }
  .nobefore:before {
    height: 0px;
  }
  td {
    padding: 10px;
  }
  .is-center {
    text-align: center;
  }
  .radioStyle {
    padding: 0px 5px !important;
  }
  :deep(.radioStyle .el-radio__input) {
    padding: 0 0 0 6px !important;
  }
</style>

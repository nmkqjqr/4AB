<template>
  <span @click="open">
    <slot></slot>
  </span>

  <el-dialog
    v-model="info.dialogVisible"
    append-to-body
    destroy-on-close
    draggable
    title="权限配置"
    width="70%"
  >
    <el-container
      v-loading="info.loadProgress != 3"
      class="layout-container-demo"
    >
      <el-header>
        <ab-save
          :after-save-fn="afterSaveFn"
          :back-btn="false"
          :form-ref="formRef"
          :save-data="saveData"
          :url="bizApi.bizPermission.BizPermissionSave"
        />
        <el-button :icon="Back" @click="info.dialogVisible = false">
          返回
        </el-button>

        <ab-load
          v-model="info.data"
          :get-param="`?type=${type}&value=${value}&version=${version || ''}`"
          :url="bizApi.bizPermission.BizPermissioGetPermission"
          @after-fn="afterFn"
        />
        <el-button
          :icon="Refresh"
          plain
          style="margin-left: 10px"
          type="warning"
          @click="reset()"
        >
          重置
        </el-button>
      </el-header>
      <el-main>
        <el-descriptions border :column="2">
          <el-descriptions-item label-align="right">
            <template #label>权限对象类型</template>
            <span v-if="info.BizPermissionType">
              {{ info.BizPermissionType[type] }}
            </span>
          </el-descriptions-item>
          <el-descriptions-item label-align="right">
            <template #label>权限对象值</template>
            {{ value }}
          </el-descriptions-item>
        </el-descriptions>

        <el-table
          v-if="info.loadProgress == 3"
          border
          :data="info.tableData"
          height="400"
          style="width: 100%; margin-top: 10px"
        >
          <el-table-column label="名称" width="600">
            <template #default="scope">
              <el-tag v-if="scope.row.tableMap" class="ml-2" type="danger">
                业务对象
              </el-tag>
              <span v-else-if="scope.row.columnMap">
                <sub-table-dialog
                  v-if="scope.row.rel && scope.row.rel.type == 'oneToMany'"
                  v-model="scope.row.subTableSet"
                  :icon="Edit"
                  :rel="scope.row.rel"
                  size="small"
                  type="primary"
                >
                  子表权限
                </sub-table-dialog>
                <el-tag v-else class="ml-2" type="success">业务主表</el-tag>
              </span>
              <el-tag
                v-else-if="scope.row.type == 'assist'"
                class="ml-2"
                type="primary"
              >
                辅助
              </el-tag>
              <el-tag v-else class="ml-2" type="warning">字段</el-tag>
              {{ `${scope.row.comment}（${scope.row.code}）` }}
              <el-tooltip
                class="box-item"
                content="当前行权限全重置后会自动继承上级权限"
                effect="dark"
                placement="top-start"
              >
                <el-button
                  v-if="
                    JSON.stringify(scope.row.rights) != '{}' &&
                    !scope.row.tableMap
                  "
                  circle
                  :icon="Refresh"
                  size="small"
                  @click="scope.row.rights = {}"
                />
              </el-tooltip>
              <span v-if="scope.row.columnMap" style="float: right">
                <el-button
                  v-if="!scope.row.expanded"
                  circle
                  :icon="ArrowDownBold"
                  plain
                  @click="expand(scope)"
                />
                <el-button
                  v-if="scope.row.expanded"
                  circle
                  :icon="ArrowUpBold"
                  plain
                  @click="unexpand(scope)"
                />
              </span>
            </template>
          </el-table-column>
          <el-table-column
            v-for="item in info.RightsType"
            :key="item.key"
            :label="item.desc"
          >
            <template #default="scope">
              <el-checkbox
                v-if="!getRightsDesc(scope.row.rights[item.key])"
                :disabled="ckDis(scope.row, item.key)"
                :indeterminate="ckInd(scope.row, item.key)"
                :model-value="ck(scope.row, item.key)"
                size="large"
                @change="ckChange(scope.row, item.key, $event)"
              />
              <ab-tooltip-tag
                v-if="!!getRightsDesc(scope.row.rights[item.key])"
                style="margin-left: 5px"
                :text="getRightsDesc(scope.row.rights[item.key])"
              />
              <span style="float: right; margin-top: 8px">
                <multim-user-selector
                  :disabled="ckDis(scope.row, item.key)"
                  :init-data="selectorInit(scope.row.rights[item.key])"
                  style="margin-left: 5px"
                  @ok="selectorOk(scope.row.rights, item.key, $event)"
                >
                  <el-button
                    circle
                    :disabled="ckDis(scope.row, item.key)"
                    :icon="Edit"
                    size="small"
                  />
                </multim-user-selector>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </el-dialog>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'
  import type { FormInstance } from 'element-plus'
  import { ElMessage } from 'element-plus'
  import {
    Edit,
    Refresh,
    ArrowDownBold,
    ArrowUpBold,
    Close,
    User,
    Back,
  } from '@element-plus/icons-vue'

  import * as abUtil from '~/agilebpm/utils/ab-util'
  import * as abTools from '~/agilebpm/utils/ab-tools'

  import { bizApi, getData, sysApi } from '@agilebpm/api'

  import MultimUserSelector from './multimUserSelector.vue'
  import SubTableDialog from './subTableDialog.vue'

  const props = defineProps({
    type: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    boCodes: {
      type: String,
      required: true,
    },
    version: {
      type: Number,
      default: null,
    },
    formCode: {
      type: Number,
      default: null,
    },
  })

  const { proxy } = abTools.useCurrentInstance()
  const info: any = reactive({
    data: {
      type: props.type,
      value: props.value,
      boMap: {},
    }, //数据对象
    tableData: [],
    BizPermissionType: {},
    bizObjects: [],
    RightsType: [
      { key: 'b', desc: '必填' },
      { key: 'w', desc: '编辑' },
      { key: 'r', desc: '只读' },
    ],
    loadProgress: 0, //加载数据进度
    dialogVisible: false,
    types: [
      { key: 'user', val: '用户' },
      { key: 'org', val: '组织' },
      { key: 'role', val: '角色' },
      { key: 'post', val: '岗位' },
    ],
    formDesign: null,
    tableAssistMap: {},
  })
  const formRef = ref<FormInstance>()

  onMounted(() => {})

  const saveData = computed(() => {
    const data = {
      type: props.type,
      value: props.value,
      boMap: {},
      version: props.version,
    }
    if (info.loadProgress != 3) {
      return data
    }

    info.bizObjects.forEach((b: any) => {
      const bo: any = {}
      bo.code = b.code
      bo.comment = b.name
      bo.rights = info.data.boMap[b.code].rights

      bo.tableMap = {}
      const tables = getAllTables(b.rel)
      tables.forEach((t: any) => {
        const table: any = {}
        table.code = t.code
        table.comment = t.comment
        const ta = info.data.boMap[b.code].tableMap[t.code]
        table.rights = ta.rights
        table.subTableSet = ta.subTableSet

        //处理字段
        table.columnMap = {}
        t.columnsWithoutPrimary.forEach((c: any) => {
          if (isFk(t, c)) {
            return
          }

          const column: any = {}
          column.code = c.code
          column.comment = c.comment
          column.rights = ta.columnMap[c.code].rights

          table.columnMap[column.code] = column
        })
        //处理辅助
        table.assistMap = {}
        let list
        if (t.rel.type == 'main') {
          list = info.tableAssistMap[mainTableName] || []
        } else {
          list = info.tableAssistMap[t.code] || []
        }

        list.forEach((c: any) => {
          const assist: any = {}
          assist.code = c.code
          assist.comment = c.title
          assist.rights = ta.assistMap[c.code].rights
          table.assistMap[assist.code] = assist
        })

        bo.tableMap[table.code] = table
      })
      data.boMap[bo.code] = bo
    })
    return data
  })

  const isFk = (t: any, c: any) => {
    if (t.rel.type != 'main') {
      if (
        t.rel.fks.find((f: any) => {
          if (f.type == 'parentField' && f.from == c.code) {
            return true
          }
          if (f.type == 'childField' && f.value == c.code) {
            return true
          }
          return false
        })
      ) {
        return true
      }
    }
    return false
  }

  const mainTableName = '$main'
  const handleBoMap = (boMap: any) => {
    handleTableAssistMap(mainTableName, info.formDesign.pcJson.column)
    console.info('tableAssistMap------------>')
    console.info(info.tableAssistMap)

    info.bizObjects.forEach((b: any) => {
      const bo: any = {}
      bo.code = b.code
      bo.comment = b.name
      //业务对象默认编辑权限
      bo.rights = {}
      setRights(bo.rights, 'w', 'everyone')
      setRights(bo.rights, 'b', 'none')
      setRights(bo.rights, 'r', 'none')

      if (boMap && boMap[b.code]) {
        bo.rights = boMap[b.code].rights
      }

      bo.tableMap = {}

      const tables = getAllTables(b.rel)
      tables.forEach((t: any) => {
        const table: any = {}
        table.code = t.code
        table.comment = t.comment
        table.rights = {}
        if (boMap && boMap[b.code] && boMap[b.code].tableMap[t.code]) {
          table.rights = boMap[b.code].tableMap[t.code].rights
        }

        //处理字段
        table.columnMap = {}
        t.columnsWithoutPrimary.forEach((c: any) => {
          if (isFk(t, c)) {
            return
          }

          const column: any = {}
          column.code = c.code
          column.comment = c.comment
          column.rights = {}
          if (
            boMap &&
            boMap[b.code] &&
            boMap[b.code].tableMap[t.code] &&
            boMap[b.code].tableMap[t.code].columnMap[c.code]
          ) {
            column.rights =
              boMap[b.code].tableMap[t.code].columnMap[c.code].rights
          }
          table.columnMap[column.code] = column
          column.parent = table
        })
        //处理辅助控件
        table.assistMap = {}
        let list = []
        if (t.rel.type == 'main') {
          list = info.tableAssistMap[mainTableName] || []
        } else {
          list = info.tableAssistMap[t.code] || []
        }
        list.forEach((c: any) => {
          const assist: any = {}
          assist.code = c.code
          assist.comment = getAssistDesc(c)
          assist.rights = {}
          assist.type = 'assist'
          if (
            boMap &&
            boMap[b.code] &&
            boMap[b.code].tableMap[t.code] &&
            boMap[b.code].tableMap[t.code].assistMap[c.code]
          ) {
            assist.rights =
              boMap[b.code].tableMap[t.code].assistMap[c.code].rights
          }
          table.assistMap[assist.code] = assist
          assist.parent = table
        })

        bo.tableMap[table.code] = table
        table.parent = bo
        table.rel = t.rel

        if (table.rel.type == 'oneToMany') {
          table.subTableSet = {
            type: 'all',
            column: '',
          }
          if (
            boMap &&
            boMap[b.code] &&
            boMap[b.code].tableMap[t.code] &&
            boMap[b.code].tableMap[t.code].subTableSet
          ) {
            table.subTableSet = boMap[b.code].tableMap[t.code].subTableSet
          }
        }
      })

      info.data.boMap[bo.code] = bo
    })
    initTableData()
    console.info('boMap------------>')
    console.info(info.data.boMap)
  }

  const initTableData = () => {
    info.tableData = []
    props.boCodes.split(',').forEach((b: any) => {
      const bo = info.data.boMap[b]
      info.tableData.push(bo)
      Object.values(bo.tableMap).forEach((t: any) => {
        info.tableData.push(t)
      })
    })
    console.info('tableData------->')
    console.info(info.tableData)
  }

  const getAllTables = (rel: any) => {
    const tables = []
    rel.table.rel = rel
    tables.push(rel.table)
    rel.children.forEach((r: any) => {
      const ts = getAllTables(r)
      ts.forEach((t: any) => {
        tables.push(t)
      })
    })
    return tables
  }

  const expand = (scope: any) => {
    scope.row.expanded = true
    if (scope.row.assistMap) {
      Object.values(scope.row.assistMap)
        .reverse()
        .forEach((c) => {
          info.tableData.splice(scope.$index + 1, 0, c)
        })
    }
    if (scope.row.columnMap) {
      Object.values(scope.row.columnMap)
        .reverse()
        .forEach((c) => {
          info.tableData.splice(scope.$index + 1, 0, c)
        })
    }
  }

  const unexpand = (scope: any) => {
    scope.row.expanded = false
    if (scope.row.assistMap) {
      Object.values(scope.row.assistMap).forEach((c) => {
        abUtil.Arrays.remove(c, info.tableData)
      })
    }
    if (scope.row.columnMap) {
      Object.values(scope.row.columnMap).forEach((c) => {
        abUtil.Arrays.remove(c, info.tableData)
      })
    }
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

  const reset = () => {
    handleBoMap(null)
  }

  const beforeSaveFn = () => {
    delete info.data.config
  }

  const afterFn = (data: any) => {
    info.loadProgress++

    if (info.loadProgress == 3) {
      if (!data) {
        handleBoMap(null)
      } else {
        handleBoMap(info.data.boMap)
      }
    }
  }

  const open = () => {
    info.loadProgress = 0
    info.dialogVisible = true
    info.data.boMap = {}
    info.formDesign = {}

    sysApi.tools
      .getEnum('com.dstz.biz.api.constant.BizPermissionType', true)
      .then((resp: any) => {
        resp.data.forEach((item: any) => {
          info.BizPermissionType[item.key] = item.desc
        })
        console.info(info.BizPermissionType)
      })

    getData(bizApi.bizObject.BizObjectGets, {
      code: props.boCodes,
    }).then((resp: any) => {
      info.bizObjects = resp.data
      info.loadProgress++
      if (info.loadProgress == 3) {
        handleBoMap(info.data.boMap)
      }
    })

    if (props.formCode) {
      bizApi.bizForm.getDesignCode(props.formCode).then((resp: any) => {
        info.formDesign = resp.data
        info.loadProgress++
        handleBoMap(info.data.boMap)
      })
    } else {
      info.loadProgress++
    }
  }

  const afterSaveFn = () => {
    ElMessage({
      showClose: true,
      message: '保存成功',
      type: 'success',
    })
    return false
  }

  const ck = (row: any, key: string) => {
    //所有人才显示选中
    if (
      row.rights[key] &&
      row.rights[key].length > 0 &&
      row.rights[key][0].type == 'everyone'
    ) {
      return true
    }

    return false
  }

  const ckChange = (row: any, key: string, b: any) => {
    //业务对象特殊处理，选中时先重置再设置
    if (!row.parent && b) {
      row.rights = {}
    }

    if (b) {
      setRights(row.rights, key, 'everyone')
    } else {
      setRights(row.rights, key, 'none')
    }
  }

  /**
   * 获取配置过的权限
   * @param row
   */
  const getSetedRights = (row: any, b = false) => {
    for (let i = 0; i < 3; i++) {
      const k = ['b', 'w', 'r'][i]
      if (row.rights[k] && row.rights[k].length > 0) {
        if (!b && row.rights[k][0].type != 'none') return k
        if (b) {
          return k
        }
      }
    }
    return ''
  }

  const ckInd = (row: any, key: string) => {
    //自身存在任意一种配置则就不会有继承状态
    if (getSetedRights(row, true)) {
      return false
    }

    const parent = row.parent
    //父存在配置则继承
    if (parent && getSetedRights(parent, true)) {
      return getSetedRights(parent) == key
    }

    const p = parent ? parent.parent : null
    //父不存在配置直接越级继承
    if (p && getSetedRights(p)) {
      return getSetedRights(p) == key
    }

    return false
  }

  const ckDis = (row: any, key: string) => {
    //业务对象层不控制
    if (!row.parent) {
      return false
    }

    const keys = ['b', 'w', 'r']

    for (let i = 0; i < keys.indexOf(key); i++) {
      const k = keys[i]
      //如果配置了左侧权限
      if (row.rights[k] && row.rights[k].length > 0) {
        if (row.rights[k][0].type == 'everyone') {
          //且等于所有人则当前只读
          return true
        } else if (keys[i + 1] == key) {
          return false
        }
      }
    }

    //如果存在父则继承父的只读状态
    if (row.parent && ckDis(row.parent, key)) {
      return true
    }

    return false
  }

  const selectorOk = (rights: any, key: string, data: any) => {
    rights[key] = []

    info.types.forEach((type: any) => {
      if (data[type.key].length > 0) {
        rights[key].push({
          type: type.key,
          desc: `（${type.val}）【${data[type.key]
            .map((item: any) => item.name)
            .join('、')}】`,
          data: data[type.key],
        })
      }
    })
  }

  const selectorInit = (list: any) => {
    if (!list) {
      return {}
    }
    const data = {}
    list.forEach((item: any) => {
      info.types.forEach((type: any) => {
        if (item.type == type.key) {
          data[type.key] = item.data
        }
      })
    })

    return data
  }

  const handleTableAssistMap = (tableCode: any, jsonList: any) => {
    jsonList.forEach((json: any) => {
      //递归子表
      if (json.subTable) {
        let tc = json.code
        if (info.formDesign.mode == 'diyBo') {
          tc = `${info.formDesign.code}_${json.code}_AbTable`
        }
        handleTableAssistMap(tc, json.children.column)
        return
      }

      //辅助控件
      if (
        [
          'alert',
          'title',
          'iframe',
          'group',
          'tabs',
          'divider',
          'verificationCode',
          'button',
        ].includes(json.type)
      ) {
        if (json.code) {
          info.tableAssistMap[tableCode] = info.tableAssistMap[tableCode] || []
          info.tableAssistMap[tableCode].push(json)
        }
      }
      //递归分组
      if (['group'].includes(json.type)) {
        handleTableAssistMap(tableCode, json.children.column)
      }
      //递归tabs
      if (['tabs'].includes(json.type)) {
        json.tabsColumn.forEach((tabs: any) => {
          handleTableAssistMap(tableCode, tabs.children.column)
        })
      }
    })
  }

  const getAssistDesc = (json: any) => {
    let str = json.title
    if (['alert', 'title', 'divider', 'button'].includes(json.type)) {
      str = json.text
    }

    if (['group', 'tabs', 'verificationCode11'].includes(json.type)) {
      str = json.label
    }
    if (json.type == 'iframe') {
      str = json.tempUrl
    }
    if (str && str.length.length > 30) {
      str = str.substring(0, 30)
    }
    return str
  }
</script>

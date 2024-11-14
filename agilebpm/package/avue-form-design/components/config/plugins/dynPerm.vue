<template>
  <span>
    <el-dialog v-model="dialogVisible" :title="`动态权限`" width="1200px" close>
      <el-button
        :icon="Plus"
        style="margin-bottom: 5px"
        type="primary"
        @click="add()"
      >
        增加
      </el-button>
      <el-form
        label-suffix="："
        ref="formRef"
        :model="plugin"
        label-width="100px"
        style="float: right; width: 400px"
      >
        <el-form-item
          prop="desc"
          label="插件描述"
          :rules="{ required: true, message: '必填' }"
        >
          <el-input v-model="plugin.desc" placeholder="请输入插件描述信息" />
        </el-form-item>
      </el-form>

      <el-table
        border
        ref="tableRef"
        :data="tableData"
        empty-text="请添加字段"
        :max-height="info.maxTableHeight"
        style="width: 100%"
        row-key="sn"
        :tree-props="{ children: 'children1' }"
        :span-method="spanMethod"
      >
        <el-table-column label="字段" min-width="200">
          <template #default="scope">
            <el-select
              v-model="scope.row.column"
              v-if="!scope.row.parentSn && info.bo.code"
              multiple
              collapse-tags
              collapse-tags-tooltip
              :max-collapse-tags="2"
            >
              <el-option-group
                :label="rel.table.comment"
                v-for="rel in getRels('oneToOne')"
              >
                <el-option
                  v-for="r in rel.children"
                  :key="`${info.bo.code}|${r.table.code}`"
                  :label="`${r.table.comment}（表）`"
                  :value="`${info.bo.code}|${r.table.code}`"
                />
                <el-option
                  v-for="val in rel.table.columnsWithoutPrimary"
                  :key="`${rel.table.code}.${val.code}`"
                  :label="`${val.comment}（字段）`"
                  :value="`${rel.table.code}.${val.code}`"
                />
                <el-option
                  v-for="val in info.tableAssistMap[rel.tableCode]"
                  :key="`${rel.table.code}.${val.code}`"
                  :label="`${val.desc}（辅助）`"
                  :value="`${rel.table.code}.${val.code}`"
                />
              </el-option-group>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="权限" :width="100">
          <template #default="scope">
            <el-select v-model="scope.row.rights" v-if="!scope.row.parentSn">
              <el-option label="隐藏" value="n" />
              <el-option label="只读" value="r" />
              <el-option label="编辑" value="w" />
              <el-option label="必填" value="b" />
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="还原" :width="100">
          <template #default="scope">
            <el-switch
              v-if="!scope.row.parentSn"
              v-model="scope.row.recove"
              inline-prompt
              active-text="是"
              inactive-text="否"
            />
            <el-select v-model="scope.row.logic" v-if="scope.row.parentSn">
              <el-option label="或" value="or" />
              <el-option label="且" value="and" />
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="值字段" min-width="150">
          <template #default="scope">
            <el-select
              v-model="scope.row.valCol"
              @change="valColChange(scope.row)"
            >
              <el-option-group
                v-for="rel in getRels('oneToOne')"
                :label="rel.table.comment"
              >
                <el-option
                  v-for="val in rel.table.columns"
                  :key="`${rel.table.code}.${val.code}`"
                  :label="val.comment"
                  :value="`${rel.table.code}.${val.code}`"
                />
              </el-option-group>
              <el-option-group
                v-if="getMainRel().parent"
                :label="getMainRel().parent.table.comment"
              >
                <el-option
                  v-for="val in getMainRel().parent.table.columns"
                  :key="`${getMainRel().parent.table.code}.${val.code}`"
                  :label="val.comment"
                  :value="`${getMainRel().parent.table.code}.${val.code}`"
                />
              </el-option-group>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="值类型" width="90">
          <template #default="scope">
            <el-tag
              v-if="
                scope.row.valColType && info.ColumnType[scope.row.valColType]
              "
            >
              {{ info.ColumnType[scope.row.valColType].desc }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="条件" :width="120">
          <template #default="scope">
            <el-select v-model="scope.row.cond" v-if="scope.row.valColType">
              <el-option
                v-for="con in info.condList.filter((item) =>
                  item.support.includes(scope.row.valColType)
                )"
                :key="con.key"
                :value="con.key"
                :label="con.desc"
              />
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="比较值" min-width="150">
          <template #default="scope">
            <el-input
              v-if="!['inl', 'nnl'].includes(scope.row.cond)"
              v-model="scope.row.condVal"
            />
          </template>
        </el-table-column>

        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button
              circle
              :icon="Plus"
              type="primary"
              @click="add(scope.row)"
              v-if="!scope.row.parentSn"
            />
            <el-button
              circle
              :icon="Edit"
              :type="scope.row.isJs ? 'warning' : 'primary'"
              @click="openJs(scope.row)"
              v-if="!scope.row.parentSn"
            />
            <el-button
              circle
              :icon="Delete"
              type="danger"
              @click="remove(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>

      <template #footer>
        <span class="dialog-footer">
          <el-button text @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="ok()">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!--js对话框-->
    <el-dialog
      v-model="info.jsDialog"
      title="手写脚本"
      width="860px"
      close
      destroy-on-close
    >
      <el-form
        label-suffix="："
        ref="jsFormRef"
        :model="info.editRow"
        label-width="120px"
      >
        <el-form-item label="脚本模式">
          <el-switch
            v-model="info.editRow.isJs"
            inline-prompt
            active-text="开启"
            inactive-text="关闭"
          />
        </el-form-item>
        <el-form-item label="脚本" prop="js">
          <calFunctionScript
            placeholder="请输入脚本并返回布尔值。eg：return true"
            v-model="info.editRow.js"
            ref="jsRef"
          ></calFunctionScript>
        </el-form-item>
        <el-form-item label="配置对应脚本">
          <el-tag>
            {{ abDynPermTools.toJs(info.editRow, getMainRel().tableCode) }}
          </el-tag>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button text @click="info.jsDialog = false">取消</el-button>
          <el-button type="primary" @click="jsOk()">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </span>
</template>
<script setup>
  import { ElMessage } from 'element-plus'
  import { ArrowDown, Plus, Delete, Edit } from '@element-plus/icons-vue'
  import calFunctionScript from './calFunctionScript.vue'
  import { abUtil, sysApi } from '~/agilebpm'
  import * as abDynPermTools from './../../../../ab-common-resource/form/ab-dyn-perm-tools'

  //  ↓↓↓↓↓↓↓↓ 上面为插件通用逻辑,可复制 ↑↑↑↑↑↑↑↑
  const props = defineProps({
    plugin: {
      type: Object,
      required: true,
    },
    modelValue: {
      type: Boolean,
      required: true,
    },
    tableName: {
      type: String,
    },
    form: {
      type: Object,
    },
  })

  const emits = defineEmits(['update:modelValue', 'dialogOk'])
  // 是否展示与外部传入的是否展示双向绑定
  const dialogVisible = useVModel(props, 'modelValue', emits)

  const { plugin } = toRefs(props)
  const formRef = ref()
  const tableRef = ref()
  const jsFormRef = ref()
  const jsRef = ref()
  const getBo = inject('getBo')
  const info = reactive({
    bo: {},
    jsDialog: false,
    editRow: {},
    ColumnType: {},
    condList: [
      { key: 'eq', desc: '等于', support: ['varchar', 'number', 'date'] },
      { key: 'ne', desc: '不等于', support: ['varchar', 'number', 'date'] },
      { key: 'gt', desc: '大于', support: ['number'] },
      { key: 'ge', desc: '大于等于', support: ['number'] },
      { key: 'lt', desc: '小于', support: ['number'] },
      { key: 'le', desc: '小于等于', support: ['number'] },
      { key: 'inl', desc: '为空', support: ['varchar', 'number', 'date'] },
      { key: 'nnl', desc: '不为空', support: ['varchar', 'number', 'date'] },
    ],
    tableAssistMap: {},
  })

  const tableData = computed(() => {
    const list = []
    plugin.value.list.forEach((item) => {
      list.push(item)
      item.children.forEach((c) => {
        list.push(c)
      })
    })
    return list
  })

  const ok = () => {
    formRef.value.validate((valid) => {
      if (!valid) {
        ElMessage({ showClose: true, message: '请检查表单', type: 'warning' })
        return
      }

      if (plugin.value.list.length == 0) {
        ElMessage({
          showClose: true,
          message: '请配置至少一条动态权限',
          type: 'warning',
        })
        return
      }

      let list = plugin.value.list.find((item) => {
        if (item.column.length == 0) {
          return true
        }
        if (!['inl', 'nnl'].includes(item.cond) && !item.condVal) {
          return true
        }
        let l = item.children.find((i) => {
          if (!['inl', 'nnl'].includes(i.cond) && !i.condVal) {
            return true
          }
          return false
        })
        return !!l
      })

      if (list) {
        ElMessage({
          showClose: true,
          message: '请检查表单中比较值、字段是否必填',
          type: 'warning',
        })
        return
      }
      emits('dialogOk', plugin)
    })
  }
  //  ↑↑↑↑↑↑↑↑ 上面为插件通用逻辑,可复制 ↑↑↑↑↑↑↑↑

  onMounted(() => {
    sysApi.tools
      .getEnum('com.dstz.jdbc.api.enums.ColumnType', false, 'key')
      .then((resp) => {
        info.ColumnType = resp.data
      })

    info.bo = getBo()
    handleTableAssistMap(info.bo.rel.tableCode, props.form.column)
    console.info('tableAssistMap------------>')
    console.info(info.tableAssistMap)
  })

  const getMainRel = () => {
    return getRel(props.tableName || info.bo.rel.tableCode)
  }

  const getRels = (type, rel) => {
    if (!rel) {
      rel = getMainRel()
    }
    let list = []
    list.push(rel)
    rel.children.forEach((re) => {
      if (!type || re.type == type) {
        list.push(re)
      }
    })

    return list
  }

  const getRel = (tableCode, rel) => {
    if (!rel) {
      rel = info.bo.rel
    }

    if (rel.tableCode == tableCode) {
      return rel
    }
    let result
    rel.children.forEach((r) => {
      result = getRel(tableCode, r) || result
    })

    return result
  }

  const add = (row) => {
    let list = plugin.value.list
    let sn = abUtil.Arrays.getNextSn(list)
    if (row) {
      list = row.children
      if (list.length == 0) {
        sn = row.sn * 100 + abUtil.Arrays.getNextSn(list)
      } else {
        sn = abUtil.Arrays.getNextSn(list)
      }
      setTimeout(() => {
        tableRef.value.toggleRowExpansion(row, true)
      }, 100)
    }

    let column = getMainRel().table.columnsWithoutPrimary[0]
    list.push({
      column: row ? row.column : [],
      rights: 'r',
      valCol: `${getMainRel().table.code}.${column.code}`,
      valColType: column.type,
      cond: 'eq',
      recove: true,
      valColRelType: getMainRel().type,
      sn: sn,
      children: [],
      parentSn: row ? row.sn : '',
      logic: 'and',
      isJs: false,
      js: '',
    })
  }

  const remove = (row) => {
    if (!row.parentSn) {
      abUtil.Arrays.remove(row, plugin.value.list)
      return
    }
    const list = plugin.value.list.find(
      (item) => item.sn == row.parentSn
    ).children
    abUtil.Arrays.remove(row, list)
  }

  const spanMethod = (param) => {
    if (!param.row.parentSn) {
      if ([0, 1, 2].includes(param.columnIndex)) {
        return {
          rowspan: param.row.children.length + 1,
          colspan: 1,
        }
      }
    } else {
      if ([0, 1, 2].includes(param.columnIndex)) {
        return {
          rowspan: 0,
          colspan: 0,
        }
      }
    }
  }

  const openJs = (row) => {
    info.editRow = abUtil.clone(row)
    info.jsDialog = true
  }

  const jsOk = () => {
    jsFormRef.value.validate((valid) => {
      if (!valid) {
        ElMessage({ showClose: true, message: '请检查表单', type: 'warning' })
        return
      }
      let row = getBySn(info.editRow.sn)
      row.isJs = info.editRow.isJs
      row.js = info.editRow.js
      info.jsDialog = false
    })
  }

  const getBySn = (sn) => {
    let row
    plugin.value.list.forEach((item) => {
      if (row) {
        return
      }
      if (item.sn == sn) {
        row = item
      }
      item.children.forEach((ite) => {
        if (ite.sn == sn) {
          row = ite
        }
      })
    })
    return row
  }

  const valColChange = (row) => {
    let tableCode = row.valCol.substring(0, row.valCol.lastIndexOf('.'))
    let columnCode = row.valCol.substring(row.valCol.lastIndexOf('.') + 1)
    let column = getRel(tableCode).table.columnsWithoutPrimary.find(
      (item) => item.code == columnCode
    )
    let rel = getRel(tableCode)
    row.valColType = column.type
    row.valColRelType = rel.type
  }

  const handleTableAssistMap = (tableCode, jsonList) => {
    jsonList.forEach((json) => {
      //递归子表
      if (json.subTable) {
        let tc = json.code
        if (props.form.mode == 'diyBo') {
          tc = `${props.form.code}_${json.code}_AbTable`
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
          json.desc = getAssistDesc(json)
          info.tableAssistMap[tableCode].push(json)
        }
      }
      //递归分组
      if (['group'].includes(json.type)) {
        handleTableAssistMap(tableCode, json.children.column)
      }
      //递归tabs
      if (['tabs'].includes(json.type)) {
        json.tabsColumn.forEach((tabs) => {
          handleTableAssistMap(tableCode, tabs.children.column)
        })
      }
    })
  }
  const getAssistDesc = (json) => {
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

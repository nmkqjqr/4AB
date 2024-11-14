<template>
  <span>
    <!--已选择-->
    <el-alert
      v-if="checkable"
      :closable="false"
      show-icon
      style="margin-top: 20px; margin-bottom: 10px"
      type="info"
    >
      <template #title>
        <span style="color: black">
          {{ $abT('page.common.selected','已选择') }} &nbsp;
        </span>
        <strong style="color: #2d8cf0">
          {{ selectedData.length }}
        </strong>
        <el-link
          style="margin-left: 30px; font-size: 13px"
          :underline="false"
          @click="clearSelectedData"
        >
          {{ $abT('page.common.clearSelect','清空已选择') }}
        </el-link>
      </template>
    </el-alert>
    <!--列表-->
    <el-table
      ref="table"
      v-loading="loading"
      border
      :data="tableData.rows"
      :default-sort="defaultSort"
      element-loading-background="rgba(0, 0, 0, 0)"
      style="width: 100%; margin-top: 10px"
      v-bind="tableAttr"
      @cell-click="cellClick"
      @select="select"
      @select-all="selectAll"
      @sort-change="sortChange"
    >
      <el-table-column v-if="checkable" type="selection" width="50" />
      <el-table-column
        v-for="ec in elTableColumns"
        :key="ec.props.prop"
        show-overflow-tooltip
        v-bind="ec.props"
      >
        <template #default="scope" v-if="ec.isTemplate">
          <!--ab-text-formatter-->
          <span v-if="ec.abTextFormatter">
            <el-tag
              v-if="ec.abTextFormatter[scope.row[ec.props.prop]]"
              :effect="ec.abTextFormatter[scope.row[ec.props.prop]].effect"
              :type="ec.abTextFormatter[scope.row[ec.props.prop]].type"
            >
              {{ ec.abTextFormatter[scope.row[ec.props.prop]].text }}
            </el-tag>
            <el-tag v-else type="info">
              {{ getPropValue(scope.row, ec.props.prop) }}
            </el-tag>
          </span>
          <!--ab-date-formatter-->
          <span v-if="ec.abDateFormatter && scope.row[ec.props.prop]">
            {{ new Date(scope.row[ec.props.prop]).format(ec.abDateFormatter) }}
          </span>
          <!--ab-template-->
          <slot
            v-if="ec.abTemplate"
            :name="ec.abTemplate"
            :scope="scope"
          ></slot>
          <!--ab-tag-->
          <el-tag
            v-if="ec.abTag"
            :effect="ec.abTag.effect"
            :type="scope.row[ec.abTag.type] || ''"
          >
            {{ getPropValue(scope.row, ec.props.prop) }}
          </el-tag>
        </template>
      </el-table-column>
      <template #empty><el-empty :description="$abT('page.common.noData','无数据')" /></template>
    </el-table>
    <!--分页-->
    <el-pagination
      v-model:currentPage="tableData.page"
      v-model:page-size="tableData.pageSize"
      :background="true"
      :disabled="false"
      layout=" prev, pager, next,total, sizes"
      :page-sizes="[2, 5, 10, 20, 30, 40, 50]"
      :total="tableData.total"
      @current-change="getData(false)"
      @size-change="getData(false)"
    />
  </span>
</template>
<script>
  import { storage } from '@/config'
  import { getData, postData, sysApi } from '@agilebpm/api'
  import * as abUtil from '~/agilebpm/utils/ab-util'

  export default {
    name: 'AbTable',
    props: {
      url: {
        type: String,
        required: true,
      },
      queryParam: {
        type: Object,
        required: true,
      },
      /**
       * 查询列，指定需要的列字段
       */
      queryColumn: {
        type: Array,
        required: false,
        default() {
          return []
        },
      },
      /**
       * 是否可多选
       */
      checkable: {
        type: Boolean,
        default: true,
      },
      value: {
        type: Array,
        default() {
          return []
        },
      },
      /**
       * 控制字段显示与否
       * eg：:
       * ab-column-if="{
       *    edit（ab-column上的prop名）: query.name$VLK（自定义的条件）,
       * }"
       */
      abColumnIf: {
        type: Object,
        default() {
          return {}
        },
      },

      /**
       * order: 排序方式  'ascending':ASC   '':DESC
       * prop : 排序字段
       * 例子1:  :default-sort="{ order: 'ascending', prop: 'id_' }"
       * 例子2:  :default-sort="{ order: '', prop: 'create_date_' }"
       */
      defaultSort: {
        type: Object,
        default() {
          return {}
        },
      },
      /**
       * 使用的也是是否有分类树
       */
      isHaveTree: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['update:modelValue'],
    data() {
      return {
        elTableColumns: [],
        loading: false,
        tableData: {
          rows: [],
          pageSize: 10,
          page: 1,
          total: 0,
        },
        tableAttr: {},
        sortInfo: {
          sortColumn: '',
          sortOrder: '',
          init: true,
        },
        selectedData: [],
        /**
         * enum枚举map缓存
         */
        enumMap: {},
      }
    },
    computed: {
      language() {
        return useI18n().locale
      },
    },
    watch: {
      language: function () {
        this.handleColumns()
      },
      selectedData: {
        handler(val) {
          this.$emit('update:modelValue', val)
        },
        deep: true,
      },
      abColumnIf: function (val) {
        this.handleColumns()
      },
    },
    created: function () {
      this.tableAttr = this.$attrs
      this.handleColumns()
      let b = true //是否要默认加载数据
      if (this.isHaveTree && storage && 'localStorage' == storage) {
        if (localStorage.getItem('focusModeData')) {
          const focusModeData = JSON.parse(
            localStorage.getItem('focusModeData')
          )
          if (focusModeData.open) {
            b = false //配置了专注模式且页面有分类则不需要默认加载（因为在ab-dict-tree）自动加载了
          }
        }
      }
      if (b) {
        this.getData()
      }
    },
    mounted() {
      // watch 语言变化,并更新
      this.$watch(
        () => this.$i18n.locale,
        () => {
          this.handleColumns()
        }
      )
    },
    methods: {
      handleColumns() {
        const abColumns = this.$slots.default()
        this.elTableColumns = []

        abColumns.forEach((c) => {
          if (!c.props) return
          const prop = c.props.prop
          //判断配置的if条件
          if (
            prop &&
            Object.keys(this.abColumnIf).includes(prop) &&
            !this.abColumnIf[prop]
          ) {
            return
          }
          const ec = {
            props: {},
          }

          Object.keys(c.props).forEach((key) => {
            const val = c.props[key]
            if (key.startsWith('ab-')) {
              this.handleAbProps(ec, key, val, c.props)
            } else if (key == 'sortable') {
              ec.props['sortable'] = 'custom'
            } else {
              ec.props[key] = val
            }
          })
          this.elTableColumns.push(ec)
        })
      },
      getData(clear = false) {
        const param = {
          offset: this.tableData.pageSize * (this.tableData.page - 1),
          limit: this.tableData.pageSize,
          queryParam: this.queryParam,
          sortColumn: this.sortInfo.sortColumn,
          sortOrder: this.sortInfo.sortOrder,
        }
        // 指定查询列
        if (this.queryColumn && this.queryColumn.length) {
          param['columnNames'] = this.queryColumn
        }
        if (
          this.sortInfo.init &&
          this.defaultSort.order &&
          this.defaultSort.prop
        ) {
          param.sortColumn = this.defaultSort.prop
          param.sortOrder =
            this.defaultSort.order == 'ascending' ? 'ASC' : 'DESC'
        }

        this.loading = true
        postData(this.url, param).then(
          (result) => {
            this.tableData = result.data
            this.loading = false
            if (clear) {
              this.clearSelectedData() //清数据
            } else {
              setTimeout(this.handleSelectedData) //tableData需要时间来渲染，立刻修改选中状态会修改失败
            }
          },
          () => {
            this.loading = false
          }
        )
      },
      sortChange({ prop, order }) {
        this.sortInfo.init = false
        this.sortInfo.sortColumn = prop || ''
        if (order) {
          this.sortInfo.sortOrder = order == 'ascending' ? 'ASC' : 'DESC'
        } else {
          this.sortInfo.sortOrder = ''
        }
        this.getData()
      },
      cellClick(row, column, cell, event) {
        if (
          column &&
          (column.type != 'selection' ||
            cell.querySelector('label.el-checkbox.is-disabled') != null)
        ) {
          return
        }
        const rowKey = this.tableAttr['row-key']
        let existRow = false
        this.selectedData.forEach((r) => {
          if (row[rowKey] == r[rowKey]) {
            existRow = r
          }
        })
        this.$refs.table.toggleRowSelection(row, !existRow)
        if (!existRow) {
          this.selectedData.push(row)
        } else {
          abUtil.Arrays.remove(existRow, this.selectedData)
        }
      },
      select(selection, row) {
        this.cellClick(row, null)
      },
      /**
       * 加载数据时（分页）处理已选数据的选中状态
       */
      handleSelectedData() {
        const rowKey = this.tableAttr['row-key']
        this.tableData.rows.forEach((row) => {
          this.selectedData.forEach((r) => {
            if (row[rowKey] == r[rowKey]) {
              this.$refs.table.toggleRowSelection(row, true)
            }
          })
        })
      },
      clearSelectedData() {
        this.selectedData = []
        this.tableData.rows.forEach((row) => {
          this.$refs.table.toggleRowSelection(row, false)
        })
      },
      selectAll(selection) {
        this.tableData.rows.forEach((row) => {
          let existRow = false
          this.selectedData.forEach((r) => {
            if (JSON.stringify(row) == JSON.stringify(r)) {
              existRow = r
            }
          })
          if (existRow && selection.length == 0) {
            abUtil.Arrays.remove(existRow, this.selectedData)
          }
          if (!existRow && selection.length > 0) {
            this.selectedData.push(row)
          }
        })
      },
      handleAbProps(elTableColumn, key, val, props) {
        elTableColumn.isTemplate = true
        if (key == 'ab-text-formatter') {
          this.handleAbTextFormatter(elTableColumn, val)
        }
        if (key == 'ab-template') {
          elTableColumn.abTemplate = val
        }
        if (key == 'ab-date-formatter') {
          elTableColumn.abDateFormatter = val
        }
        if (key == 'ab-enum-formatter') {
          this.handleAbEnumFormatter(elTableColumn, val, props)
        }
        /**
         * ab-tag-effect="plain" ab-tag-type="taskTypeLabelCss"
         * ab-tag-effect：对应的tag-effect类型，dark、light、plain，可以去element了解效果
         * ab-tag-type：对应的tag类型字段，success、info、warning、danger、、等等
         */
        if (key == 'ab-tag-type') {
          elTableColumn.abTag = {
            type: val,
            effect: props['ab-tag-effect'] || 'light',
          }
        }
      },
      handleAbTextFormatter(elTableColumn, val) {
        elTableColumn.abTextFormatter = {}
        val.split('|').forEach((str) => {
          const [v, text, type = '', effect = 'light'] = str.split('-')
          elTableColumn.abTextFormatter[v] = {
            text: text,
            type: type,
            effect: effect,
          }
        })
      },
      async handleAbEnumFormatter(elTableColumn, val, props) {
        const key = props['ab-key'] || 'key'
        const text = props['ab-text'] || 'text'
        const type = props['ab-type'] || 'type'
        const effect = props['ab-effect'] || 'light'
        let enumObj = this.enumMap[val]
        if (!enumObj) {
          this.enumMap[val] = {}
          enumObj = await sysApi.tools.getEnum(val)
        }
        //这里利用abTextFormatter的渲染逻辑
        elTableColumn.abTextFormatter = {}

        Object.values(enumObj).forEach((item) => {
          elTableColumn.abTextFormatter[item[key]] = {
            text: item[text],
            type: item[type] || 'success',
            effect: effect,
          }
        })
      },
      getPropValue(row, prop) {
        return eval(`row.${prop}`)
      },
    },
  }
</script>

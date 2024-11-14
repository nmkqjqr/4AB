<template>
  <div style="height: 100%">
    <el-container style="height: 100%">
      <!-- leftTree = 1 开启左侧树 -->
      <el-aside
        v-if="props.dialog.leftTree === 1"
        class="leftTreeStyle"
        width="220px"
      >
        <el-tree
          v-if="!isLeftTreeConfigType('bizCustDialog')"
          ref="treeref"
          :data="info.treeData"
          :default-expanded-keys="info.expandedKeys"
          empty-text=""
          :expand-on-click-node="false"
          :highlight-current="true"
          :node-key="info.nodeKey"
          :props="info.defaultProps"
          @node-click="handleNodeClick"
        />
        <!-- 树型对话框 -->
        <ab-cust-dialog-tree
          v-if="isLeftTreeConfigType('bizCustDialog') && info.leftTreeDialog"
          ref="treeDialog"
          :dialog="info.leftTreeDialog"
          :init-data="[]"
          :param="info.leftTreeDialogParam"
          @node-click="handleNodeClick"
        />
      </el-aside>
      <el-main style="padding: 12px; background: #fff">
        <el-form
          ref="searchForm"
          class="formLableStyle"
          :inline="true"
          :label-width="120"
          :model="info.searchParam"
          style="width: 100%"
          @submit.native.prevent
        >
          <template
            v-for="field in props.dialog.conditionFields"
            :key="field.searchName"
          >
            <el-form-item
              v-if="
                field.valueSource == 'inputText' ||
                (field.valueSource == 'param' &&
                  field.value.ctrlType == 'inputText')
              "
              :label="$abT('custDialog.' + props.dialog.code + '.' +field.columnName,field.showName)"
              :prop="field.searchName"
              style="margin-right: 12px"
            >
              <el-input
                v-model="info.searchParam[field.searchName]"
                clearable
                :placeholder="$abT('abform.placeholderPre','请输入') + ' ' + $abT('custDialog.' + props.dialog.code + '.' +field.columnName,field.showName)"
                style="width: 160px"
                @keydown.enter="postPageData"
                @on-enter="postPageData"
              />
            </el-form-item>
            <el-form-item
              v-if="field.valueSource == 'dict'"
              :label="$abT('custDialog.' + props.dialog.code + '.' +field.columnName,field.showName)"
              :prop="field.searchName"
              style="margin-right: 12px"
            >
              <ab-select-tree
                v-model="info.searchParam[field.searchName]"
                :operation="false"
                style="width: 160px"
                :type-code="field.value.text"
              />
            </el-form-item>
            <el-form-item
              v-if="field.valueSource == 'date'"
              :label="$abT('custDialog.' + props.dialog.code + '.' +field.columnName,field.showName)"
              :prop="field.searchName"
              style="margin-right: 12px"
            >
              <el-date-picker
                v-model="info.searchParam[field.searchName]"
                style="width: 160px"
                :type="
                  field.value.text == 'YYYY-MM-DD'
                    ? 'date'
                    : field.value.text == 'YYYY-MM-DD HH:mm:ss'
                    ? 'datetime'
                    : field.value.text == 'YYYY'
                    ? 'year'
                    : field.value.text == 'YYYY-MM'
                    ? 'month'
                    : 'date'
                "
                :value-format="
                  field.value.text && field.value.text.length > 0
                    ? field.value.text
                    : 'YYYY-MM-DD'
                "
              />
            </el-form-item>
          </template>

          <el-form-item v-if="info.showSearchBtn" style="margin-right: 0">
            <el-button :icon="Search" type="primary" @click="postPageData">
              {{$abT('page.common.search','查询')}}
            </el-button>
            <el-button :icon="RefreshRight" @click="reset">{{$abT('page.common.reset','重置')}}</el-button>
          </el-form-item>
        </el-form>
        <div v-if="info.height" class="tableBox">
          <div
            class="tableBoxLeft"
            :style="{
              width: !props.dialog.multiple ? '100%' : 'calc(100% - 200px)',
            }"
          >
            <!-- row-key="id" -->
            <!-- 这个属性导致查询列表出现了多余数据 -->
            <el-table
              ref="selection"
              v-loading="info.loading"
              border
              :data="info.dataRow"
              :header-cell-class-name="cellClass"
              :height="info.height"
              highlight-current-row
              row-key="id"
              style="width: 100%"
              @row-click="rowClick"
              @select="select"
              @select-all="selectAll"
              @sort-change="sortChange"
            >

              <el-table-column
                align="center"
                :reserve-selection="true"
                type="selection"
                width="60"
              />
              <template v-for="item in info.columns" :key="item.key">
                <el-table-column
                  :label="$abT('custDialog.' + props.dialog.code + '.' +item.key,item.title)"
                  :prop="item.key"
                  sortable="custom"
                  :width="item.width"
                >
                  <template #default="scope">
                    <div
                      v-if="
                        item.formatterType == 'js' &&
                        item.formatter &&
                        item.formatter.length > 0
                      "
                      v-html="handleJs(item, scope.row, scope.$index)"
                    ></div>
                    <div
                      v-if="
                        item.formatterType == 'js' &&
                        item.formatter &&
                        item.formatter.length <= 0
                      "
                    >
                      <span>{{ scope.row[item.key] }}</span>
                    </div>
                    <div v-if="item.formatterType == 'json'">
                      <span
                        v-html="handleJson(item, scope.row[item.key])"
                      ></span>
                    </div>
                    <div v-if="item.formatterType == 'date'">
                      {{ handleTime(item, scope.row[item.key]) }}
                    </div>
                    <div v-if="item.formatterType == 'dict'">
                      {{ handleField(item, scope.row[item.key]) }}
                    </div>
                    <div
                      v-if="
                        !item.formatterType || item.formatterType.length <= 0
                      "
                    >
                      <span>{{ scope.row[item.key] }}</span>
                    </div>
                  </template>
                </el-table-column>
              </template>
            </el-table>
          </div>
          <div v-if="props.dialog.multiple" class="tableBoxRight">
            <!-- 已选列表 -->
            <el-table
              border
              :data="info.sdata"
              :height="info.height"
              row-key="id"
              style="margin-left: 5px"
            >
              <el-table-column
                :label="$abT('custDialog.' + props.dialog.code + '.' +props.dialog.displayFields[0].columnName,props.dialog.displayFields[0].showName)"
                :prop="props.dialog.displayFields[0].columnName"
                :reserve-selection="true"
                width="100"
              />
              <el-table-column :label="$abT('page.common.operate','操作')" width="100">
                <template #default="scope">
                  <el-button
                    circle
                    :icon="Delete"
                    @click="rowClickNew(scope.row)"
                  />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <el-row v-if="props.dialog.page">
          <el-col :span="24">
            <div style="margin-top: 10px; margin-left: 1%">
              <el-pagination
                ref="paginationRef"
                v-model:current-page="info.page"
                background
                layout="total,prev,pager,next,sizes,jumper"
                :page-size="info.pageSize"
                :page-sizes="[10, 20, 30, 40]"
                :pager-count="3"
                :total="info.pageData.total"
                @current-change="pageChange"
                @size-change="pageSizeChange"
              />
            </div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>
<script lang="ts">
  export default { name: 'AbCustDialogList' }
</script>
<script lang="ts" setup>
  import { ref, reactive, defineExpose } from 'vue'
  import { Search, RefreshRight, Delete } from '@element-plus/icons-vue'
  import { postData, getData, sysApi, bizApi } from '~/agilebpm/api'
  import * as abFormat from '~/agilebpm/utils/ab-format'
  import { clone } from '~/agilebpm/utils/ab-util'
  import abCustDialogTree from './ab-cust-dialog-tree.vue'
  import type { ElTable } from 'element-plus'
  import { storage } from '@/config'

  const props = defineProps({
    dialog: { required: true, type: Object },
    // eslint-disable-next-line vue/require-valid-default-prop
    initData: { type: Object, default: [], require: false },
    param: { default: null, type: Object },
  })
  const selection = ref()
  const searchForm = ref()
  const paginationRef = ref()
  const info: any = reactive({
    loading: true,
    page: 1,
    pageSize: 10,
    sortColumn: '',
    sortOrder: '',
    columns: [],
    pageData: {
      rows: [],
      total: 0,
    },
    height: '',
    sdata: [],
    searchParam: {},
    showSearchBtn: false,
    treeData: [],
    defaultProps: { children: 'children', label: 'name' },
    nodeKey: 'id',
    querytree: { pageSize: 999, currentPage: 1, queryParam: {} },
    leftTreeDialogParam: {},
    leftTreeDialog: null,
    conditionFieldsMap: {},
    initParam: {},
    expandedKeys: [],
    dataRow: [],
    focusModeData: null,
    typeCodeMap: { biz: 'bizTypeCode', flowType: 'flowTypeCode' }, //专注模式目前只支持业务和流程分类
  })
  onMounted(() => {
    // 默认数据
    setSdata()
    // 遍历显示字段
    props.dialog.displayFields.forEach(
      (field: {
        showName: any
        columnName: string | number
        formatter: string
        formatterType: string
        func: (arg0: any, arg1: any, arg2: any) => any
      }) => {
        const column = {
          title: field.showName,
          key: field.columnName,
          formatter: field.formatter,
          formatterType: field.formatterType ? field.formatterType : '',
        }

        if (field.formatterType == 'dict') {
          if (field.formatter.length > 0) {
            sysApi.dict
              .getDictTreeByCodeNoCache(JSON.parse(field.formatter).code)
              .then((result) => {
                column.dictList = result.data[0].children
              })
          }
        }

        // if (field.formatter) {
        //   column.render = function (
        //     h: (arg0: string, arg1: { domProps: { innerHTML: any } }) => any,
        //     params: { row: any; index: any }
        //   ) {
        //     const row = params.row
        //     const value = row[field.columnName]
        //     const index = params.index
        //     eval(`field.func = function(value, row, index){${field.formatter}}`)
        //     const html = field.func(value, row, index)
        //     const rlt = h('div', {
        //       domProps: {
        //         innerHTML: html,
        //       },
        //     })
        //     return rlt
        //   }
        // }
        info.columns.push(column)
      }
    )

    // 遍历条件字段
    if (props.param) {
      info.initParam = clone(props.param)
      // info.searchParam = JSON.parse(JSON.stringify(info.initParam))
    }
    props.dialog.conditionFields.forEach(
      (field: {
        columnName: string
        dbType: string
        condition: string
        searchName: string
        valueSource: string
        value: { ctrlType: any }
      }) => {
        let searchName = `${field.columnName}$`
        if (field.dbType === 'number') {
          searchName += 'N'
        } else if (field.dbType === 'date') {
          searchName += 'D'
        } else {
          searchName += 'V'
        }
        searchName += field.condition

        field.searchName = searchName
        // 动态参数
        if (
          field.valueSource == 'dynamicParam' ||
          (field.valueSource == 'param' && field.value.ctrlType !== 'inputText')
        ) {
          if (props.param && props.param[field.columnName]) {
            // eslint-disable-next-line vue/no-mutating-props
            info.initParam[searchName] = props.param[field.columnName]
            delete info.initParam[field.columnName]
          }
        }
        // 兼容老数据
        if (
          field.valueSource == 'inputText' ||
          (field.valueSource == 'param' &&
            field.value.ctrlType == 'inputText') ||
          field.valueSource == 'dict' ||
          field.valueSource == 'date'
        ) {
          info.showSearchBtn = true
        }
        if (
          field.valueSource == 'inputText' ||
          (field.valueSource == 'param' && field.value.ctrlType == 'inputText')
        ) {
          if (field.value.text && field.value.text.length > 0) {
            info.searchParam[field.searchName] = field.value.text
          }
        }
        if (field.valueSource == 'dict') {
          if (field.value.text && field.value.text.length > 0) {
            sysApi.dict
              .getDictTreeByCodeNoRoot(field.value.text)
              .then((data) => {
                field.dictList = data
              })
          }
        }

        if (field.valueSource == 'fixedValue') {
          const text = field.value.text
          info.initParam[field.searchName] = text
        }
        info.conditionFieldsMap[field.columnName] = field
      }
    )
    if (props.dialog.page) {
      if (props.dialog.pageSize) {
        info.pageSize = props.dialog.pageSize
      } else {
        info.pageSize = 10
      }
    }
    // 设置高度
    nextTick(() => {
      const formHeight = searchForm.value.$el.clientHeight
      const paginationHeight = props.dialog.page
        ? paginationRef.value.$el.clientHeight
        : -20
      const headerHeight = 54
      const footerHeight = 62
      const padding = 32
      const paddingY = 60
      info.height =
        props.dialog.height -
        (formHeight +
          paginationHeight +
          headerHeight +
          footerHeight +
          padding +
          paddingY)
    })

    if (
      storage &&
      'localStorage' == storage &&
      info.typeCodeMap[props.dialog.leftTreeConfig.key]
    ) {
      if (localStorage.getItem('focusModeData')) {
        info.focusModeData = JSON.parse(localStorage.getItem('focusModeData'))
      }
    }

    // 左侧树请求
    getlefttreedata()
    if (!info.focusModeData || !info.focusModeData.open) {

      // 如果有默认查询条件  先合并
      if (info.initParam) {
        info.searchParam = {...info.searchParam,...info.initParam}
      }
      // 列表数据
      postPageData()
    }
  })

  const setSdata = async () =>  {
    let sdata = JSON.parse(JSON.stringify(props.initData))
    if(sdata && sdata.length == 1){
      let searchParam = {}
      sdata.forEach((item:any) => {
        for(let key in item){
          searchParam[key + '$VLK'] = item[key]
        }
      })
      const param = {
        pageSize: info.pageSize,
        currentPage: info.page,
        sortColumn: info.sortColumn,
        sortOrder: info.sortOrder,
        queryParam: searchParam,
      }
      let result = await bizApi.customDialog.listDataByCode(props.dialog.code, param)
      if(result.data && result.data.rows){
        const dataRow = trimSpace(result.data.rows)
        if (
          dataRow &&
          dataRow.length > 0
        ) {
          info.sdata = []
          for (let i = 0; i < sdata.length; i++) {
            let sd = sdata[i]
            for (let j = 0; j < dataRow.length; j++) {
              const pd = dataRow[j]
              if (dialogEqual(sd, pd)) {
                info.sdata.push(JSON.parse(JSON.stringify(pd)))
              }
            }
          }
        }
      }else{
        info.sdata = sdata
      }
      }else{
        info.sdata = sdata
      }
  }


  // 如果是单选隐藏全选按钮
  const cellClass = () => {
    if (props.dialog.multiple === 0) {
      return 'disableheadselection'
    }
  }
  // 点击table
  const rowClick = (row: any, column: any, event: any) => {
    select(null, row)
    if (props.dialog.multiple) {
      selection.value.toggleRowSelection(row)
    }
  }
  // 点击删除
  const rowClickNew = (row: any) => {
    let aItem = {}
    for (let j = 0; j < info.dataRow.length; j++) {
      const pd = info.dataRow[j]
      if (dialogEqual(row, pd)) {
        aItem = pd
      }
    }
    // select(null, aItem)
    const index = -1
    info.sdata.forEach((ite: { [x: string]: any }, idx: number) => {
      if (dialogEqual(ite, aItem)) {
        index = idx
      }
    })
    if (index != -1) {
      info.sdata.splice(index, 1)
    }
    // 如果切换了分页再删除 index == -1
    if (index == -1) {
      let a
      info.sdata.forEach((ite: { [x: string]: any }, idx: number) => {
        if (dialogEqual(ite, row)) {
          a = idx
        }
      })
      info.sdata.splice(a, 1)
    }
    if (props.dialog.multiple) {
      selection.value.toggleRowSelection(aItem)
    }
  }
  // 排序
  const sortChange = (data: { order: string; prop: any }) => {
    if (!data.order) {
      info.sortOrder = ''
      info.sortColumn = ''
    } else {
      info.sortOrder = data.order == 'ascending' ? 'asc' : 'desc'
      info.sortColumn = data.prop
    }
    postPageData()
  }

  // 选择分页
  const pageChange = (page: any) => {
    info.page = page
    postPageData()
  }

  // 选择页面大小
  const pageSizeChange = (pageSize: any) => {
    info.page = 1
    info.pageSize = pageSize
    postPageData()
  }

  //获取页面数据
  const postPageData = () => {
    const param = {
      pageSize: info.pageSize,
      currentPage: info.page,
      sortColumn: info.sortColumn,
      sortOrder: info.sortOrder,
      queryParam: info.searchParam,
    }

    // if (info.searchParam) {
    //   extend(info.initParam, param.queryParam) //赋值页面来的参数
    // }

    info.loading = true
    bizApi.customDialog.listDataByCode(props.dialog.code, param).then(
      (res) => {
        info.loading = false
        if(res.data){
          const result = res.data
          info.pageData = result
          const dataRow = info.pageData.rows || info.pageData
          info.dataRow = trimSpace(dataRow)
          setTimeout(() => {
            checkInitSelected()
          })
        }else{
          info.pageData.total = 0
          info.dataRow = []
        }
      },
      () => {}
    )
  }

  const trimSpace = (array: any) => {
    for (let i = 0; i < array.length; i++) {
      //这里为过滤的值
      if (
        array[i] == ' ' ||
        array[i] == null ||
        typeof array[i] == 'undefined' ||
        array[i] == '  '
      ) {
        array.splice(i, 1)
        i = i - 1
      }
    }
    return array
  }
  // select	当用户手动勾选数据行的 Checkbox 时触发的事件
  const select = (selectionItem: any, row: { id: any }) => {
    if (!props.dialog.multiple || props.dialog.multiple === 0) {
      //单选
      selection.value.clearSelection()
      selection.value.toggleRowSelection(row, true)
      info.sdata = []
      info.sdata = [row]
      // const isRowSelection = !info.sdata.some(
      //   (item: { id: any }) => item.id === row.id
      // )

      // info.sdata = []
      // if (isRowSelection) {
      //   info.sdata = [row]
      // }
    } else {
      let sindex = -1
      info.sdata.forEach((ite: { [x: string]: any }, idx: number) => {
        if (dialogEqual(ite, row)) {
          sindex = idx
        }
      })
      if (sindex == -1) {
        //新增
        info.sdata.push(row)
      }
      if (sindex != -1) {
        //删除
        info.sdata.splice(sindex, 1)
      }
      //多选
      // handleSdata(row, !getRowChecked(row))
    }
  }

  const handleSdata = (item: { [x: string]: any }, add: any) => {
    let sindex = -1

    info.sdata.forEach((ite: { [x: string]: any }, idx: number) => {
      if (dialogEqual(ite, item)) {
        sindex = idx
      }
    })
    if (add && sindex == -1) {
      //新增
      info.sdata.push(item)
    }
    if (sindex != -1) {
      //删除
      info.sdata.splice(sindex, 1)
    }
    // if (!add && sindex != -1) {
    //   //删除
    //   info.sdata.splice(sindex, 1)
    // }
  }

  // select-all	当用户手动勾选全选 Checkbox 时触发的事件
  const selectAll = (list: string | any[]) => {
    const b = list && list.length > 0
    info.dataRow.forEach((item: { [x: string]: any }) => {
      handleSdata(item, b)
    })
  }
  // 重置
  const reset = () => {
    info.searchParam = {}
    if (info.initParam) {
      extend(info.initParam, info.searchParam) //赋值页面来的参数
    }
    postPageData()
  }
  // 获取sdata
  const getDataFn = () => {
    return info.sdata
  }

  // 仅以a中存在的字段跟b作相等比较（可以理解为a字段少，b字段多）
  const dialogEqual = (a: { [x: string]: any }, b: { [x: string]: any }) => {
    for (const key in a) {
      if (a[key] != b[key]) {
        return false
      }
    }
    return true
  }

  const getRowChecked = (row: { [x: string]: any; id?: any }) => {
    let b = false
    info.sdata.forEach((item: { [x: string]: any }) => {
      if (dialogEqual(row, item)) {
        b = true
      }
    })
    return b
  }

  // 默认选中回显的数据
  const checkInitSelected = () => {
    // 切换分页时先清空选择
    selection.value.clearSelection()
    if (
      info.sdata &&
      info.sdata.length > 0 &&
      info.dataRow &&
      info.dataRow.length > 0
    ) {
      for (let i = 0; i < info.sdata.length; i++) {
        const sd = info.sdata[i]
        for (let j = 0; j < info.dataRow.length; j++) {
          const pd = info.dataRow[j]
          if (dialogEqual(sd, pd)) {
            selection.value.toggleRowSelection(pd, true)
          }
        }
      }
    }
  }

  const extend = (parent: Record<string, any>, child: { [x: string]: any }) => {
    child = child || {}
    for (const prop in parent) {
      child[prop] = parent[prop]
    }
    return child
  }

  // 请求左侧树数据
  const treeref = ref()
  const getlefttreedata = () => {
    if (!props.dialog.leftTree) {
      return
    }
    if (isLeftTreeConfigType('dataDict')) {
      sysApi.dict
        .getDictDataUrl({
          dictKey: props.dialog.leftTreeConfig.key,
          hasRoot:
            props.dialog.leftTreeConfig.rootName.length > 0 ? true : false,
        })
        .then((result) => {
          info.treeData = buildTree(result.data)
          // 默认展开两级
          info.expandedKeys = []
          info.treeData.forEach((item: any, index: any) => {
            info.expandedKeys.push(item.id)
            if (item.children && item.children.length > 0) {
              item.children.forEach((childrenItem: any) => {
                info.expandedKeys.push(childrenItem.id)
              })
            }
          })

          if (info.focusModeData && info.focusModeData.open) {
            const node = getNode(
              info.focusModeData[
                info.typeCodeMap[props.dialog.leftTreeConfig.key]
              ],
              info.treeData[0]
            )
            if (node) {
              handleNodeClick(node)
              setTimeout(() => {
                treeref.value.setCurrentNode(node)
              }, 100)
            }
          }
        })
    }
    if (isLeftTreeConfigType('bizCustDialog')) {
      // 请求对话框接口
      getData(
        bizApi.customDialog.getByCode + props.dialog.leftTreeConfig.key,
        {}
      ).then(
        (result: any) => {
          if (isRootName()) {
            //增加根节点
            info.leftTreeDialogParam['rootName'] =
              props.dialog.leftTreeConfig.rootName
          }
          info.leftTreeDialog = extend(
            {
              multiple: false,
            },
            result.data
          )
        },
        () => {}
      )
    }
  }
  // 数据的处理
  const buildTree = (data: any[], parentId: undefined) => {
    if (!parentId) {
      //找到根节点
      data.forEach((item: { parentId: any }) => {
        let root = true
        data.forEach((ite: { id: any }) => {
          if (item.parentId == ite.id) {
            root = false
          }
        })
        if (root) {
          parentId = item.parentId
        }
      })
    }

    const tree = []
    let temp
    for (let i = 0; i < data.length; i++) {
      if (data[i].parentId == parentId) {
        const obj = data[i]
        temp = buildTree(data, data[i].id)
        if (temp.length > 0) {
          obj.children = temp
        }
        obj.title = obj.name
        if (
          isLeftTreeConfigType('dataDict') &&
          isRootName() &&
          obj.dictType == 'dict'
        ) {
          obj.title = props.dialog.leftTreeConfig.rootName
        }
        obj.expand = true
        tree.push(obj)
      }
    }
    return tree
  }
  // 判断左侧树的类型
  const isLeftTreeConfigType = (type: any) => {
    if (props.dialog.leftTree === 0) {
      return false
    }
    return props.dialog.leftTreeConfig.type == type
  }
  // 根节点名称
  const isRootName = () => {
    return !!props.dialog.leftTreeConfig.rootName
  }
  // 点击左侧树
  const handleNodeClick = (node: {
    [x: string]: string
    dictType: string
    key: string
  }) => {
    const field = info.conditionFieldsMap[props.dialog.leftTreeConfig.condField]
    let value = ''
    if (isLeftTreeConfigType('dataDict')) {
      if (!isRootName() || node.dictType != 'dict') {
        value = node.code
      }
    }
    if (isLeftTreeConfigType('bizCustDialog')) {
      if (
        !isRootName() ||
        node[info.leftTreeDialog.treeConfig.showColumn] !=
          props.dialog.leftTreeConfig.rootName
      ) {
        value = node[info.leftTreeDialog.treeConfig.id]
      }
    }
    info.searchParam[field.searchName] = value
    postPageData()
  }

  // 处理js格式化
  const handleJs = (item: any, rowA: any, indexA: any) => {
    if (item.formatter && item.formatter.length > 0) {
      const row = rowA
      const value = rowA[item.key]
      const index = indexA
      try {
        const func = new Function('value', item.formatter)
        return func(value)
      } catch (error) {
        console.log(`【${item.title}】js格式化输入有误`)
        return '--'
      }
    }
  }

  // 处理JSON字段
  const handleJson = (item: any, value: any) => {
    if (item.formatter && item.formatter.length > 0) {
      let _value
      // 是否包含
      const a = JSON.parse(item.formatter).some(
        (animal: any) => animal.value == value
      )
      if (a) {
        JSON.parse(item.formatter).forEach((item1: any) => {
          if (item1.value == value) {
            if (item1.styleValue && item1.styleValue.length > 0) {
              let a = ''
              if (item1.styleValue == 'success') {
                a =
                  'display:inline-block;color:#67c23a;background-color:#f0f9eb;border-color:#e1f3d8;display: inline-flex;justify-content: center;align-items: center;height: 24px;padding: 0 9px;font-size:12px;line-height: 1;border-width: 1px;border-style: solid;'
              }
              if (item1.styleValue == 'default') {
                a =
                  'display:inline-block;color:#409eff;background-color:#ecf5ff;border-color:#d9ecff;display: inline-flex;justify-content: center;align-items: center;height: 24px;padding: 0 9px;font-size:12px;line-height: 1;border-width: 1px;border-style: solid;'
              }
              if (item1.styleValue == 'info') {
                a =
                  'display:inline-block;color:#909399;background-color:#f4f4f5;border-color:#e9e9eb;display: inline-flex;justify-content: center;align-items: center;height: 24px;padding: 0 9px;font-size:12px;line-height: 1;border-width: 1px;border-style: solid;'
              }
              if (item1.styleValue == 'warning') {
                a =
                  'display:inline-block;color:#e6a23c;background-color:#fdf6ec;border-color:#faecd8;display: inline-flex;justify-content: center;align-items: center;height: 24px;padding: 0 9px;font-size:12px;line-height: 1;border-width: 1px;border-style: solid;'
              }
              if (item1.styleValue == 'danger') {
                a =
                  'display:inline-block;color:#f56c6c;background-color:#fef0f0;border-color:#fde2e2;display: inline-flex;justify-content: center;align-items: center;height: 24px;padding: 0 9px;font-size:12px;line-height: 1;border-width: 1px;border-style: solid;'
              }
              _value = `<span style="${a}">${item1.key}</span>`
            } else {
              _value = item1.key
            }
          }
        })
      } else {
        _value = value
      }
      return `<span>${_value}</span>`
    } else {
      return `<span>${value}</span>`
    }
  }
  const checkDateTime = (str: any) => {
    if (isNaN(str) && !isNaN(Date.parse(str))) {
      return true
    } else {
      return false
    }
  }
  // 处理时间
  const handleTime = (item: any, value: any) => {
    if (item.formatter && item.formatter.length > 0) {
      let _value
      if (checkDateTime(value)) {
        _value = abFormat.ab_dateFormat(value, item.formatter)
      } else if (!value || value.length <= 0 || value <= 0) {
        _value = ''
      } else {
        _value = '格式不正确'
      }
      return _value
    } else {
      return value
    }
  }

  // 遍历树形数据
  const findNameByCode = (treeData: any, code: any) => {
    for (let i = 0; i < treeData.length; i++) {
      const node = treeData[i]
      if (node.code === code) {
        return node.name
      }
      if (node.children && node.children.length > 0) {
        const result = findNameByCode(node.children, code)
        if (result) {
          return result
        }
      }
    }
    return null
  }

  // 处理数据字典字段
  const handleField = (item: any, value: any) => {
    let value_
    if (item.dictList && item.dictList.length > 0) {
      value_ = findNameByCode(item.dictList, value)
      return value_
    } else {
      return value
    }
  }

  /**
   * 递归根据编码找到节点信息
   */
  const getNode = (code: any, node: any) => {
    let result: any
    if (node.code == code) {
      result = node
    } else if (node.children) {
      node.children.forEach((n: any) => {
        if (result) {
          return
        }
        result = getNode(code, n)
      })
    }
    return result
  }
  defineExpose({
    getDataFn,
    postPageData,
  })
</script>
<style lang="scss" scoped>
  .custom-tree-node {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;
    padding-right: 8px;
    font-size: 14px;
  }
  .tableBox {
    overflow: hidden;
    .tableBoxLeft {
      float: left;
      width: calc(100% - 200px);
    }
    .tableBoxRight {
      float: right;
      width: 200px;
    }
  }

  :deep() {
    .disableheadselection > .cell .el-checkbox__inner {
      display: none;
    }
    .leftTreeStyle {
      box-sizing: border-box;
      height: 100%;
      padding: 10px;
      border-right: 10px solid #f5f7f9;
    }
  }
  :deep(.formLableStyle .el-form-item__label) {
    align-items: center;
    padding: 2px 10px 0 0;
    font-size: 14px;
    line-height: 14px;
  }
</style>

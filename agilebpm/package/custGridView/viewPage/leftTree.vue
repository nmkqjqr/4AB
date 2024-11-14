<template>
  <div>
    <!-- 数据字典类型或自定义列表类型 dataFrom ：2 dataFrom ：4 -->
    <ab-tree
      v-if="
        info.data.leftTreeMap.dataFrom == '2' ||
        info.data.leftTreeMap.dataFrom == '4'
      "
      :left-tree-map="info.data.leftTreeMap"
      :tree-data="info.treeData"
      @node-click="nodeClickFn"
      :is-from-cust="true"
    />
    <!-- 自定义对话框类型 dataFrom ： 1 -->
    <div
      v-if="info.data.leftTreeMap.dataFrom == '1' && info.leftTreeDialog"
      style="padding: 10px"
    >
      <!-- 树型对话框 -->
      <ab-cust-dialog-tree
        ref="treeDialog"
        :dialog="info.leftTreeDialog"
        :dialog-setting="{
          height: info.innerHeight,
          rootName: info.data.leftTreeMap.rootName,
        }"
        :init-data="[]"
        :param="info.leftTreeDialogParam"
        @node-click="nodeClickFn"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { sysApi, bizApi, postData, getData } from '~/agilebpm/api'

  import { abCustDialogTree } from '@ab-core'
  const emit = defineEmits(['update:modelValue', 'listQuery'])
  const props = defineProps({
    data: { required: true, type: Object }, // 赋值目标对象
  })
  const info: any = reactive({
    data: props.data,
    treeData: [],
    treeDataLoading: false,
    innerHeight: window.innerHeight - 110,
    leftTreeDialogParam: {},
    leftTreeDialog: null,
  })
  // 自定义列表请求左侧树列表
  const getCustTree = (row: any) => {
    postData(bizApi.custGrid.listUrl + row.code, { pageSize: 9999 }).then(
      (result) => {
        if (row.rootName && row.rootName.length > 0) {
          //增加根节点
          info.treeData = [
            {
              [info.data.leftTreeMap.nameKey]: row.rootName,
              children: buildTree(result.data.list),
            },
          ]
        } else {
          info.treeData = buildTree(result.data.list)
        }
      },
      () => {}
    )
  }
  // 对话框请求左侧树列表
  const getdiaDataTree = (row: any) => {
    // 请求对话框接口
    getData(bizApi.customDialog.getByCode + row.code, {}).then(
      (result) => {
        if (row.rootName && row.rootName.length > 0) {
          //增加根节点
          info.leftTreeDialogParam['rootName'] = row.rootName
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
  // 数据字典类型请求左侧树列表
  const getdictDataTree = (row: any) => {
    info.treeDataLoading = true
    sysApi.dict
      .getDictDataUrl({
        dictKey: row.code.length > 0 ? row.code : row.name,
        hasRoot: row.rootName && row.rootName.length > 0 ? false : true,
        rootName: row.rootName,
      })
      .then(({ data }) => {
        info.treeDataLoading = false
        if (data.length > 0) {
          info.treeData = data
        }
      })
  }

  const tree = () => {
    // 处理左侧树
    if (info.data.leftTreeMap.showTree == '1') {
      if (info.data.leftTreeMap.dataFrom == '1') {
        // 对话框
        getdiaDataTree(info.data.leftTreeMap)
      }
      if (info.data.leftTreeMap.dataFrom == '2') {
        // 数据字典类型
        getdictDataTree(info.data.leftTreeMap)
      }
      if (info.data.leftTreeMap.dataFrom == '4') {
        // 自定义列表
        getCustTree(info.data.leftTreeMap)
      }
    }
  }
  tree()

  //模仿老版的构建tree 处理树形数据
  const buildTree = (data: any[], parentId: undefined, parent: undefined) => {
    if (!parentId) {
      //找到根节点
      data.forEach((item: { [x: string]: any }) => {
        let root = true
        data.forEach((ite) => {
          if (
            item[info.data.leftTreeMap.pidKey] ==
            ite[info.data.leftTreeMap.idKey]
          ) {
            root = false
          }
        })
        if (root) {
          parentId = item[info.data.leftTreeMap.pidKey]
        }
      })
    }
    const tree = []
    let temp
    for (let i = 0; i < data.length; i++) {
      if (data[i][info.data.leftTreeMap.pidKey] == parentId) {
        const obj = data[i]
        temp = buildTree(data, data[i][info.data.leftTreeMap.idKey], data[i])
        if (temp.length > 0) {
          obj.children = temp
        }

        if (parent) {
          obj.parent = parent
        }

        tree.push(obj)
      }
    }
    return tree
  }

  const extend = (parent: Record<string, any>, child: { [x: string]: any }) => {
    child = child || {}
    for (const prop in parent) {
      child[prop] = parent[prop]
    }
    return child
  }

  // 点击左侧树节点
  const nodeClickFn = (row: any) => {
    if (
      info.data.leftTreeMap.relField &&
      info.data.leftTreeMap.relField.length > 0
    ) {
      info.data.sqlConditionVOS.forEach((item: any, index: any) => {
        if (item.fieldName === info.data.leftTreeMap.relField) {
          // 如果是数据字典
          if (
            info.data.leftTreeMap.dataFrom === '2' ||
            info.data.leftTreeMap.dataFrom === '4'
          ) {
            item.val = ''
            if (row.parentId !== '0') {
              item.val = row[info.data.leftTreeMap.relField] || row.code
            }
          }
          // 如果是自定义对话框
          if (info.data.leftTreeMap.dataFrom === '1') {
            item.val = ''
            // if (row.parentId || row.parent_id_) {
            item.val = info.data.leftTreeMap.diaBack
              ? row[info.data.leftTreeMap.diaBack]
              : ''
            // }
          }
        }
      })

      emit('listQuery', info.data.sqlConditionVOS)
    } else {
      emit('listQuery')
    }
  }
</script>

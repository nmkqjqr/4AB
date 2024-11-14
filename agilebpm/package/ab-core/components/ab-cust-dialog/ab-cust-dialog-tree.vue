<template>
  <div v-if="info.nodeKey" style="overflow: auto" :style="info.style">
    <!-- sync 是否异步 -->
    <el-tree
      v-if="!props.dialog.treeConfig.sync"
      ref="treeref"
      :check-strictly="true"
      :data="info.treeData"
      :default-expand-all="props.expand"
      :expand-on-click-node="false"
      :node-key="info.nodeKey"
      :props="info.props"
      :show-checkbox="props.dialog.multiple == 1 ? true : false"
      @check="check"
      @node-click="nodeClick"
    />
    <el-tree
      v-else
      ref="treeref"
      :check-strictly="true"
      :expand-on-click-node="false"
      lazy
      :load="loadData"
      :node-key="info.nodeKey"
      :props="info.props"
      :show-checkbox="props.dialog.multiple == 1 ? true : false"
      @check="check"
      @node-click="nodeClick"
    />
  </div>
</template>
<script lang="ts">
  export default { name: 'AbCustDialogTree' }
</script>
<script lang="ts" setup>
  import { ref, reactive, defineExpose } from 'vue'
  import { postData, bizApi } from '~/agilebpm/api'
  const emit = defineEmits(['nodeClick'])
  const props = defineProps({
    dialog: { required: true, type: Object }, // 对话框详情
    // eslint-disable-next-line vue/require-valid-default-prop
    initData: { type: Object, default: [], require: false },
    param: { required: false, type: Object }, // 条件
    expand: { type: Boolean, default: true },
    dialogSetting: {
      type: Object,
      default: null,
    },
  })
  const treeref = ref('treeref')
  const info: any = reactive({
    treeData: [],
    style: {
      overflow: 'auto',
    },
    query: {
      currentPage: 1,
      queryParam: {},
    },
    props: {
      children: 'children',
      isLeaf: 'isLeaf', //isLeaf	指定节点是否为叶子节点，仅在指定了 lazy 属性的情况下生效
    },
    nodeKey: '',
  })
  onMounted(() => {
    props.dialog = extend(props.dialogSetting || {}, props.dialog)
    // 对话框高度
    // info.style.height = props.dialog.height - 150 + 'px'
    // 显示字段 label	指定节点标签为节点对象的某个属性值 showColumn 显示名称
    info.props.label = props.dialog.treeConfig.showColumn
    // 显示字段 id ID
    info.nodeKey = props.dialog.treeConfig.id
    // conditionFields 编辑页配置得条件字段
    info.query.queryParam = conditionFieldsdo(props.dialog.conditionFields)
    info.treeData = []
    // sync false 请求对话框树形接口
    if (!props.dialog.treeConfig.sync) {
      postData(
        bizApi.customDialog.treeDataByIdUrl + props.dialog.code,
        info.query
      ).then(
        (result: any) => {
          // 同步如果有根节点
          if (props.dialog.rootName && props.dialog.rootName.length > 0) {
            // 有根节点并且有初始父ID
            if(props.dialog.treeConfig.pidInitVal && props.dialog.treeConfig.pidInitVal.length > 0){
                let treeDataList = buildTree(
                result.data,
                props.dialog.treeConfig.pidInitVal,
                undefined
              )
              info.treeData = [
                  {
                    [props.dialog.treeConfig.showColumn]: props.dialog.rootName,
                    children: treeDataList,
                  },
                ]
            }else{
                info.treeData = [
                  {
                    [props.dialog.treeConfig.showColumn]: props.dialog.rootName,
                    children: transformTozTreeFormat(props.dialog, result.data),
                  },
                ]
            }
          // 同步如果没有根节点
          } else {
             // 如果有初始父ID
            if (props.dialog.treeConfig.pidInitVal && props.dialog.treeConfig.pidInitVal.length > 0) {
              info.treeData = buildTree(
                result.data,
                props.dialog.treeConfig.pidInitVal,
                undefined
              )
            } else {
              info.treeData = transformTozTreeFormat(props.dialog, result.data)
              // 树形如果没有初始父ID 回显数据
              for (let i = 0; i < result.data.length; i++) {
                  const obj = result.data[i]
                  setTimeout(() => {
                    props.initData.forEach((item: any) => {
                      if (dialogEqual(item, obj)) {
                        //等树渲染后再设置 multiple 是否多选
                        if (props.dialog.multiple) {
                          treeref.value.setChecked(obj, true, false) // setChecked	设置节点是否被选中, 使用此方法必须设置 node-key 属性
                        } else {
                          treeref.value.setCurrentNode(obj) // setCurrentNode	设置节点为选中状态，使用此方法必须设置 node-key 属性
                        }
                      }
                    })
                })
              }
            }
          }
        },
        () => {}
      )
    }
  })
  // 处理条件字段
  const conditionFieldsdo = (row: any) => {
    const queryParam = {}
    if (row.length > 0) {
      row.forEach(
        (element: {
          valueSource: string
          columnName: string | string[]
          condition: string
          value: { text: any }
        }) => {
          if (element.valueSource === 'fixedValue') {
            queryParam[
              `${getlastStr(element.columnName)}$V${element.condition}`
            ] = element.value.text
          }
        }
      )
    }
    return queryParam
  }

  const getlastStr = (str: string | string[]) => {
    if (str[str.length - 1] === '_') {
      return str
      // 老的进行这一步操作 ，新版的加下划线
      // return str.slice(0, str.length - 1)
    } else {
      return str
    }
  }

  //模仿老版的构建tree 处理树形数据
  const buildTree = (data: any[], parentId: undefined, parent: undefined) => {
    if (!parentId) {
      //找到根节点
      data.forEach((item: { [x: string]: any }) => {
        let root = true
        data.forEach((ite) => {
          if (
            item[props.dialog.treeConfig.pid] == ite[props.dialog.treeConfig.id]
          ) {
            root = false
          }
        })
        if (root) {
          parentId = item[props.dialog.treeConfig.pid]
        }
      })
    }
    const tree = []
    let temp
    for (let i = 0; i < data.length; i++) {
      if (data[i][props.dialog.treeConfig.pid] == parentId) {
        const obj = data[i]
        temp = buildTree(data, data[i][props.dialog.treeConfig.id], data[i])
        if (temp.length > 0) {
          obj.children = temp
        }

        if (props.dialog.treeConfig.sync) {
          obj.isLeaf = obj.childCount == 0
        }

        setTimeout(() => {
          props.initData.forEach((item: any) => {
            if (dialogEqual(item, obj)) {
              //等树渲染后再设置 multiple 是否多选
              if (props.dialog.multiple) {
                treeref.value.setChecked(obj, true, false) // setChecked	设置节点是否被选中, 使用此方法必须设置 node-key 属性
              } else {
                treeref.value.setCurrentNode(obj) // setCurrentNode	设置节点为选中状态，使用此方法必须设置 node-key 属性
              }
            }
          })
        })

        if (parent) {
          obj.parent = parent
        }

        tree.push(obj)
      }
    }
    return tree
  }

  // 处理父组件传值+详情数据
  const extend = (parent: Record<string, any>, child: { [x: string]: any }) => {
    child = child || {}
    for (const prop in parent) {
      child[prop] = parent[prop]
    }
    return child
  }

  // list转tree
  const transformTozTreeFormat = (setting: any, sNodes: any) => {
    let i,
      l,
      key = setting.treeConfig.id,
      parentKey = setting.treeConfig.pid
    if (!key || key == '' || !sNodes) return []

    if (Array.isArray(sNodes)) {
      const r = []
      const tmpMap = {}
      for (i = 0, l = sNodes.length; i < l; i++) {
        tmpMap[sNodes[i][key]] = sNodes[i]
      }
      for (i = 0, l = sNodes.length; i < l; i++) {
        const p = tmpMap[sNodes[i][parentKey]]
        if (p && sNodes[i][key] != sNodes[i][parentKey]) {
          let children = nodeChildren(setting, p)
          if (!children) {
            children = nodeChildren(setting, p, [])
          }
          children.push(sNodes[i])
        } else {
          r.push(sNodes[i])
        }
      }
      return r
    } else {
      return [sNodes]
    }
  }

  const nodeChildren = (setting: any, node: any, newChildren: any) => {
    if (!node) {
      return null
    }
    const key = 'children'
    if (typeof newChildren !== 'undefined') {
      node[key] = newChildren
    }
    return node[key]
  }

  // 仅以a中存在的字段跟b作相等比较（可以理解为a字段少，b字段多）
  const dialogEqual = (a: { [x: string]: any }, b: { [x: string]: any }) => {
    for (const key in a) {
      let isExist = false
      props.dialog.returnFields.forEach((field: { columnName: string }) => {
        //防止对比一些树型数据的额外字段
        if (key == field.columnName) {
          isExist = true
        }
      })
      if (!isExist) {
        continue
      }

      if (a[key] == b[key]) {
        return true
      }

      if (a[key] != b[key]) {
        return false
      }

    }
    return true
  }

  const getDataFn = () => {
    // multiple 是否多选
    if (props.dialog.multiple) {
      return treeref.value.getCheckedNodes() // getCheckedNodes 如果节点可以被选中，(show-checkbox 为 true), 本方法将返回当前选中节点的数组
    }
    const node = treeref.value.getCurrentNode() // getCurrentNode	返回当前被选中节点的数据 (如果没有则返回 null)
    return node ? [treeref.value.getCurrentNode()] : []
  }

  // 加载数据
  const loadData = (
    node: { data: any; childNodes: any },
    callback: (arg0: any[]) => void
  ) => {
    if (!props.dialog.treeConfig.sync) {
      return callback([])
    }

    const item = node.data
    const p = JSON.parse(JSON.stringify(props.param || {}))
    if (item) {
      // p[props.dialog.treeConfig.pid] = item[props.dialog.treeConfig.pid]
      p['id'] = item[props.dialog.treeConfig.id]
    }
    // postData(bizApi.customDialog.treeDataByIdUrl + props.dialog.code, {
    //   queryParam: p,
    // })
    bizApi.customDialog
      .treeDataByCode(props.dialog.code, {
        queryParam: p,
      })
      .then(
        (result: any) => {
          let pId = props.dialog.treeConfig.pidInitVal
          if (item) {
            pId = item[props.dialog.treeConfig.id]
          }
          const data = buildTree(result.data, pId, item)
          callback(data)
          // node.childNodes.forEach((item: any) => {
          //   if (!item.data.hasChildren) {
          //     item.isLeaf = true
          //   }
          // })
        },
        () => {}
      )
  }

  //
  const check = (node: { children: any; parent: any }) => {
    const checked = treeref.value.getCheckedNodes().includes(node)
    if (!props.dialog.treeConfig.chkboxType) {
      return
    }
    const chkboxType = JSON.parse(props.dialog.treeConfig.chkboxType)
    if (chkboxType['Y'] && checked) {
      //处理勾选事件
      if (chkboxType['Y'].indexOf('s') != -1) {
        checkChildren(node, checked)
      }
      if (chkboxType['Y'].indexOf('p') != -1) {
        checkParent(node, checked)
      }
    }
    if (chkboxType['N'] && !checked) {
      //处理取消勾选事件
      if (chkboxType['N'].indexOf('s') != -1) {
        checkChildren(node, checked)
      }
      if (chkboxType['N'].indexOf('p') != -1) {
        checkParent(node, checked)
      }
    }
  }
  // 勾选子列表
  const checkChildren = (
    node: { children: any; parent?: { children: any[] } | undefined },
    checked: any
  ) => {
    if (!node.children) {
      return
    }
    node.children.forEach(
      (c: { children: any; parent?: { children: any[] } | undefined }) => {
        treeref.value.setChecked(c, checked)
        checkChildren(c, checked)
      }
    )
  }

  //勾选父列表
  const checkParent = (
    node: { children?: any[] | undefined; parent?: any },
    checked: any
  ) => {
    if (!node.parent) {
      return
    }
    if (!checked) {
      //取消父要同级节点都取消才去触发
      let b = true
      node.parent.children.forEach((c: any) => {
        const ck = treeref.value.getCheckedNodes().includes(c)
        if (ck) {
          b = false
        }
      })
      if (!b) {
        return
      }
    }
    treeref.value.setChecked(node.parent, checked)
    checkParent(node.parent, checked)
  }

  // 点击事件
  const nodeClick = (node: { children: any; parent: any }) => {
    const checked = treeref.value.getCheckedNodes().includes(node)
    treeref.value.setChecked(node, !checked)
    check(node)
    emit('nodeClick', node)
  }
  defineExpose({
    getDataFn,
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
</style>

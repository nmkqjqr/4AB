<template>
  <el-tree-select
    ref="selectRef"
    v-model="selectValue"
    v-bind="$attrs"
    check-strictly
    clearable
    :data="info.data"
    default-expand-all
    :node-key="props.returnCode"
    placeholder="请选择"
    :props="defaultProps"
    :render-after-expand="false"
    :style="{ width: props.width }"
    @clear="clearValue"
    @node-click="selectNodeClickFn"
  />
</template>
<script lang="ts">
  export default { name: 'AbSelectTree' }
</script>
<script lang="ts" setup>
  /**
   * <ab-select-tree
   *   v-model="query.typeCode$VEQ"
   *   type-code="script"
   *   tree-data="treeData"
   * />
   * typeCode  分类别名
   * treeData  树形数据
   * （两种方式 typeCode treeData）可根据需求选择传递其中一项
   **/
  import { ElMessage } from 'element-plus'
  import { ref, defineEmits, defineProps, watch, reactive } from 'vue'
  import { sysApi, bizApi } from '~/agilebpm/api'
  import { storage } from '@/config'
  // update: 需要双向绑定的属性名
  const emit = defineEmits(['update:modelValue', 'selectData'])
  //v-model 默认的值为 value 可以通过 : 自定义
  const props = defineProps({
    modelValue: {
      type: String,
      default: '',
      require: true,
    },
    //非字典数据中的返回哪个属性跟modelValue绑定（默认code， 可以改为id 或 pid）
    returnCode: {
      type: String,
      default: 'code',
    },
    typeCode: {
      type: String,
      default: '',
    },
    treeData: {
      type: Object,
      default: () => {},
    } as any,
    width: {
      type: String,
      default: '100%',
    },
    hasRoot: {
      type: Boolean,
      default: false,
    },
    isCust: {
      type: Boolean,
      default: false,
    },

    //下拉树的类型， dict：字典   custGrid：自定义应用/列表   custDialog: 自定义对话框
    /**
     * 示例
     *  <ab-select-tree
        v-model="info.config"
        :tree-options="{           下拉框树的树形关系的字段，需要告诉下拉树 唯一键， 显示名称，以及父关系键三个变量
          id: 'code_',
          name: 'name_',
          pid: 'pcode_',
        }"
        tree-type="custDialog"      下拉树的类型，字典、对话框、列表（不填写则默认是字典）
        type-code="mapData"         类型对应的code（字典code/对话框code/列表code）
      />
    */
    treeType: {
      type: String,
      default: 'dict',
    },

    //当下拉树类型为custGrid自定义应用时，可以自由指定 id字段，显示字段，和父id字段
    treeOptions: {
      type: Object as () => TreeOptions,
      default: () => ({
        id: 'id',
        name: 'name',
        pid: 'pid',
      }),
    },
  })

  const getDisabled = (data: any, node: any) => {
    if (!data.disable) {
      return false
    }
    if (selectValue.value == data.code) {
      return false
    }
    return true
  }
  //下拉框树的名称 和值的隐射
  const defaultProps = {
    children: 'children',
    label: 'name',
    disabled: getDisabled,
  }
  interface TreeOptions {
    id: string //树的标识字段，也是返回字段
    name: string //树的显示字段
    pid: string //树的父id字段、关系字段
  }

  const selectValue = ref('')
  const selectRef = ref('selectRef')
  const info: any = reactive({
    data: [],
    resultData: [],
    findNodesByCode(nodes:any, code:any) {
      let result = [] as any;
      nodes.forEach((node:any) => {
        if (node.code === code) {
          result.push(node);
        }
        // 如果有子节点，递归搜索
        if (node.children) {
          result = result.concat(info.findNodesByCode(node.children, code));
        }
      });
      return result;
    }
  })

  watch(
    () => props.modelValue,
    (newValue) => {
      if (newValue.length <= 0) {
        selectValue.value = ''
      } else {
        assignmentFn()
      }
    }
  )

  const init = () => {
    haveTreeData()
    if (props.typeCode && props.typeCode.length > 0) {
      if (props.treeType == 'dict') {
        getDictDataTree()
      }
      if (props.treeType == 'custGrid') {
        getGridDataTree()
      }
      if (props.treeType == 'custDialog') {
        getCustDialogTree()
      }
    }
  }

  const assignmentFn = () => {
    haveTreeData()
    if (props.typeCode && props.typeCode.length > 0) {
      if (props.treeType == 'dict') {
        if (info.data && info.data.length > 0) {
          // const arr = readNodes(info.data)
          let arr = info.findNodesByCode(info.data,props.modelValue)
          selectValue.value = arr[0] && arr[0].code ? arr[0].code : ''
        }
      }
      if (props.treeType == 'custGrid' || props.treeType == 'custDialog') {
        if (info.resultData && info.resultData.length > 0) {
          info.resultData.forEach((element: any) => {
            if (element[props.treeOptions.id] === props.modelValue) {
              selectValue.value = element[props.treeOptions.id]
              emit('selectData', element)
            }
          })
          info.data = buildTree(info.resultData, undefined)
        }
      }
    }
  }

  const haveTreeData = () => {
    if (props.treeData && props.treeData.length > 0) {
      if (props.isCust) {
        info.data = props.treeData
      } else {
        info.data = props.treeData[0].children
      }
      const arr = readNodes(props.treeData)
      arr.forEach((element) => {
        for (const i in element) {
          if (i == props.returnCode && element[i] == props.modelValue) {
            selectValue.value = element.name
            emit('selectData', element)
          }
        }
      })
    }
  }



  const getDictDataTree = async () => {
    const result = await sysApi.dict.getDictDataUrl({
      dictKey: props.typeCode,
      hasRoot: props.hasRoot,
    })
    if (result) {
      info.data = result.data
    }
    const arr = readNodes(info.data)
    arr.forEach((element: any) => {
      if (element.code === props.modelValue) {
        selectValue.value = element.code
      }
    })

    if (selectValue.value) {
      return
    }
    const typeCodeMap = { biz: 'bizTypeCode', flowType: 'flowTypeCode' } //专注模式目前只支持业务和流程分类
    if (storage && 'localStorage' == storage && typeCodeMap[props.typeCode]) {
      if (localStorage.getItem('focusModeData')) {
        const focusModeData = JSON.parse(localStorage.getItem('focusModeData'))
        if (focusModeData.open) {
          selectValue.value = focusModeData[typeCodeMap[props.typeCode]]
          emit('update:modelValue', focusModeData[typeCodeMap[props.typeCode]])
        }
      }
    }
  }

  //将自定义列表的内容转成树
  const buildTree: any = (list: Array<any>, parentId: string) => {
    if (!list || list.length == 0) {
      return
    }
    const tree = []
    for (let i = 0; i < list.length; i++) {
      if (list[i][props.treeOptions.pid] === parentId) {
        const node = {
          id: list[i][props.treeOptions.id],
          code: list[i][props.treeOptions.id],
          name: list[i][props.treeOptions.name],
          children: buildTree(list, list[i][props.treeOptions.id]),
        }
        tree.push(node)
      }
    }
    return tree
  }

  const getCustDialogTree = async () => {
    const result = await bizApi.customDialog.treeDataByCode(props.typeCode, {})
    if (result.data && result.data.length > 0) {
      info.resultData = result.data
      result.data.forEach((element: any) => {
        if (element[props.treeOptions.id] === props.modelValue) {
          selectValue.value = element[props.treeOptions.id]
          emit('selectData', element)
        }
      })
      info.data = buildTree(result.data, undefined)
    }
  }

  const getGridDataTree = async () => {
    const result = await bizApi.custGrid.custGridList(props.typeCode, null)
    if (result.data.list) {
      info.resultData = result.data.list
      result.data.list.forEach((element: any) => {
        if (element[props.treeOptions.id] === props.modelValue) {
          selectValue.value = element[props.treeOptions.id]
          emit('selectData', element)
        }
      })
      info.data = buildTree(result.data.list, undefined)
    }
  }

  const readNodes = (nodes = [] as any[], arr = [] as any[]) => {
    for (const item of nodes) {
      if (!item.disable) {
        arr.push(item)
      }
      if (item.children && item.children.length) readNodes(item.children, arr)
    }
    return arr
  }

  // 选择分类
  const selectNodeClickFn = (row: any) => {
    if(row.disable == 1){
      return
    }
    // 必须是子节点才可以成功点击赋值
    if (row.name === '所有数据' || !row.id) {
      //|| (row.children && row.children.length > 0)
      ElMessage({
        showClose: true,
        message: '请选择有效数据',
        type: 'warning',
      })
    } else {
      for (const i in row) {
        if (i == props.returnCode) {
          emit('update:modelValue', row[i])
          emit('selectData', row)
        }
      }
      selectValue.value = row.name
      selectRef.value.visible = false
    }
  }

  // 清空选项
  const clearValue = () => {
    emit('update:modelValue', '')
  }
  onMounted(() => {
    init()
  })
</script>

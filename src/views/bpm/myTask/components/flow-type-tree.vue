<template>
  <div
    class="treeBoxHeight"
    shadow="hover"
    style="padding: 10px"
    :style="{ height: treeheight, width: '100%' }"
  >
    <el-tree
      :data="pageData.treeData"
      :default-expanded-keys="['root']"
      :expand-on-click-node="false"
      :highlight-current="true"
      node-key="code"
      :props="defaultProps"
      @node-click="handleNodeClick"
    >
      <template #default="{ data }">
        <span :title="data.countName">
          {{data.countName}}
        </span>
      </template>
    </el-tree>
  </div>
</template>

<script lang="ts" setup>
  import { bpmApi } from '~/agilebpm'
  import { PropType } from 'vue'
  import { ElMessageBox } from 'element-plus'

  interface FlowTypeTree {
    countName: string
    count: number
    name: string
    code: string
    type: string
    typeCode: string
    expand: boolean
    children?: FlowTypeTree[]
  }

  const props = defineProps({
    modelValue: { type: String, default: null },
    treeUrl: { type: String, required: true, default: null },
  })

  const emit = defineEmits(['nodeClick'])

  const treeheight = ref(`${window.innerHeight - (110 + 32 + 20 + 60)}px`)
  const pageData = reactive({
    treeData: [] as any[],
    defaultExpandKeys: [] as any[],
    codeStr: '',
  })

  const getData = async () => {
    pageData.treeData.splice(0, pageData.treeData.length)
    pageData.defaultExpandKeys.splice(0, pageData.defaultExpandKeys.length)

    const result: any = await bpmApi.myTask.getTreeData(props.treeUrl)
    if (!result.isOk) {
      ElMessageBox.alert(
        abT('page.common.RequestTypedataFailedMsg', '请求分类数据失败！')
      )
    }
    pageData.treeData = result.data
  }

  onMounted(() => {
    getData()
  })

  watch(
    () => props.modelValue,
    () => {
      getData()
    }
  )

  // 遍历树形数据
  const traverseTree = (node: any) => {
    pageData.codeStr += `${node.code},`
    if (node.children) {
      node.children.forEach((child: any) => {
        traverseTree(child) // 递归调用遍历子节点
      })
    }
  }
  const handleNodeClick = (data: FlowTypeTree) => {
    if (data.typeCode === 'default') {
      emit('nodeClick', 'default', null)
    } else {
      pageData.codeStr = ''
      traverseTree(data)
      pageData.codeStr = pageData.codeStr.slice(0, -1)
      emit('nodeClick', data.type, pageData.codeStr)
    }
  }
  const defaultProps = {
    children: 'children',
    label: 'countName',
  }
</script>

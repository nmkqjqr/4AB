<template>
  <el-tree
    class="leftTreeStyle"
    ref="treeRef"
    :allow-drop="allowDrop"
    :allow-drag="allowDrag"
    :data="treeData"
    draggable
    default-expand-all
    node-key="id"
    :expand-on-click-node="false"
    @node-drop="handleNodeDrop"
    empty-text="暂无资源"
    :props="defaultProps"
    @node-click="clickNode"
  >
    <template #default="{ node }">
      <div class="labelText">
        <p class="text"><el-icon class="iconStyle"><Message /></el-icon><span class="name" :class="{isnoCategory:node.data.type !== 'category' ? true : false}">{{ node.label }}</span></p>
        <el-dropdown v-if="!isVisit">
          <span class="el-dropdown-link">
            <el-icon class="toolsIcon"><Tools /></el-icon>
            <!-- <el-icon><Sort /></el-icon> -->
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="editName(node)">修改名称</el-dropdown-item>
              <el-dropdown-item @click="moveTo(node)">移动到</el-dropdown-item>
              <el-dropdown-item @click="visit(node)" v-if="node.data.type !== 'category'">访问</el-dropdown-item>
              <!-- <el-dropdown-item @click="design(node)">设计</el-dropdown-item> -->
              <!-- <el-dropdown-item>数据权限</el-dropdown-item> -->
              <el-dropdown-item divided>
                <span style="color:#F56C6C;" @click="removeFn(node)">删除</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </template>
  </el-tree>
  <MoveToDialog ref="moveToDialogRef" :tree-data="treeData" @get-my-resource="getMyResource"></MoveToDialog>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import type Node from 'element-plus/es/components/tree/src/model/node'
import type { DragEvents } from 'element-plus/es/components/tree/src/model/useDragNode'
import type {
  AllowDropType,
  NodeDropType,
} from 'element-plus/es/components/tree/src/tree.type'
import MoveToDialog from '../components/moveToDialog.vue';
import { getData,postData } from '~/agilebpm/api/ab-request'
import { myResourceUrl,removeResourceUrl,saveResourceUrl,saveResourcesUrl } from '~/agilebpm/api/modules/ab-appSquare/ab-appSquare-resource'
import { abTools,abUtil } from '~/agilebpm'
const { proxy } = abTools.useCurrentInstance()
const emit = defineEmits(['getMyResource','clickNode'])
const props = defineProps({
  // eslint-disable-next-line vue/require-default-prop
  treeData: {
    type: Array,
    default: null,
  },
  searchValue:{
    type: Array,
    default: null,
  },
  isVisit:{
    type: Boolean,
    default: false,
  }
})

const moveToDialogRef = ref(null)

const { treeData,searchValue } = toRefs(props)

const state = reactive({

})

// 树组件的引用
const treeRef = ref(null);
// 过滤时选中 跳转
watch(
  () => searchValue.value,
  (newVal) => {
    if(newVal){
      const node = treeRef.value.getNode(newVal[newVal.length - 1]);
      if (node) {
        // 设置当前选中节点
        treeRef.value.setCurrentKey(newVal[newVal.length - 1]);
        // 手动触发node-click事件
        clickNode(node.data);
      }
    }
  }
)

const defaultProps = {
  children: 'children',
  label: 'name',
  value: 'id'
};

const clickNode = (node: any) => {
  console.log(node)
  if(node.type !== 'category'){
    proxy.$router.replace({
      params:{
        resourceType:node.type,
        id: node.type == "form" ? node.formDesignId : node.id
      }
    });
    emit('clickNode', node);
  }
}

const updateSnWithIndex = (array:any, index = 0) => {
  array.forEach((item:any, itemIndex:any) => {
    // 检查是否是最后一个元素，并更新sn
    item.sn = index + itemIndex;

    // 如果存在children属性，则递归调用函数
    if (item.children && Array.isArray(item.children)) {
      // 递归调用，更新索引
      updateSnWithIndex(item.children, index + itemIndex + 1);
    }
  });
}

// 拖拽树形
const handleNodeDrop = (draggingNode:any,dropNode:any,dropType:any,ev:any) => {
  ElMessageBox.confirm(
  `确定需要将【${draggingNode.data.name}】移动到【${
    dropNode.data.name
  }】的${
    dropType == 'after'
      ? '后一个节点?'
      : dropType == 'before'
      ? '前一个节点?'
      : dropType == 'inner'
      ? '子节点中?'
      : ''
  }`,
  '提示',
  {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }
)
  .then(() => {
    if(dropType == 'before' || dropType == 'after'){
      draggingNode.data.parentId = dropNode.data.parentId ? dropNode.data.parentId : '0'
    }
    // 调用函数更新sn
    updateSnWithIndex(Array.isArray(dropNode.parent.data) ? dropNode.parent.data : [dropNode.parent.data]);
    updateNodePosition(Array.isArray(dropNode.parent.data) ? dropNode.parent.data : [dropNode.parent.data]);
  })
  .catch(() => {
  })
}

// 更新节点位置的API调用函数
const updateNodePosition = (resources:any) => {
  let params = {
    projectId:proxy.$route.params.projectId,
    resources:resources
  }
  postData(saveResourcesUrl,params)
  .then(
    ({ data }) => {
      ElMessage({
        showClose: true,
        message: '移动成功',
        type: 'success',
      })
      emit('getMyResource')
    },
    () => {}
  )
  .catch(() => {
  })
};


// 检查节点是否是其子节点的祖先
const isAncestor = (node:any, ancestor:any) => {
  while (node) {
    if (node === ancestor) return true;
    node = node.parent;  // 假设有一个parent属性指向父节点
  }
  return false;
};

const allowDrop = (draggingNode: Node, dropNode: Node, type: AllowDropType) => {
  // 检查拖拽节点是否是目标节点的祖先
  if (isAncestor(dropNode, draggingNode)) {
    // 如果是，禁止放置
    return false;
  }
  // 禁止拖拽给自己
  if(dropNode.data.id == draggingNode.data.id){
    return false
  }
  if(type == 'inner'){
    // 不允许拖拽至表单
    if(dropNode.data.type == 'form'){
      return false
    }else{
      return true
    }
  }else{
    return true
  }
}
const allowDrag = (draggingNode: Node) => {
  return true
}

const design = (node:any) => {
  console.log('design:', node)
}

const removeFn = (node:any) => {
  ElMessageBox.confirm(
    '确定删除"'+ node.label +'"这条资源吗?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      getData(removeResourceUrl+node.data.id)
      .then(
        ({ data }) => {
          ElMessage({
            type: 'success',
            message: '删除成功',
          })
          emit('getMyResource')
        },
        () => {}
      )
      .catch(() => {
      })
    })
    .catch(() => {
    })
}

const editName = (node:any) => {
  ElMessageBox.prompt('名称', '提示', {
    inputValue: node.data.name, // 初始输入值
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputValidator: (value) => {
      if (!value) {
        return '名称不能为空';
      }
      return true;
    }
  })
    .then(({ value }) => {
      let params = abUtil.clone(node.data)
      params.name = value
      postData(saveResourceUrl,params)
      .then(
        ({ data,isOk }) => {
          if(isOk){
            ElMessage({
              showClose: true,
              message: '保存成功',
              type: 'success',
            })
            emit('getMyResource')
          }
        },
        () => {}
      )
      .catch(() => {
      })
    })
    .catch(() => {
    })
}

const moveTo = (node:any) => {
  moveToDialogRef.value.openDialog(node.data)
}

const getMyResource = () => {
  emit('getMyResource')
}

</script>
<style lang="scss">
.leftTreeStyle.is-dragging{
  margin-left: 10px; /* 调整层级缩进 */
}
.leftTreeStyle.is-dragging .el-tree-node__content {
  z-index: 1000; /* 确保拖拽的节点在最上层 */
  background-color: #f1f0f0; /* 拖拽时的背景色 */
  border: 1px dashed #6eb0f3; /* 设置边框宽度、样式和颜色 */
  box-shadow: 0 0 10px #8ec2f5; /* 阴影效果 */
  opacity: 0.8; /* 设置透明度 */
  transition: transform 0.2s ease-out; /* 平滑的变换效果 */
}

.leftTreeStyle{
  .el-tree-node__content{
    padding:20px 0;
    margin-bottom:10px !important;
    .el-tree-node__expand-icon{
      padding:0;
    }
  }
  .el-tree-node__content:active,
  .el-tree-node__content.dragging-node {
    box-shadow: 0 2px 8px rgba(126, 125, 125, 0.2); /* 阴影效果 */
  }
  .el-tree__drop-indicator {
    height: 4px; /* 辅助线高度 */
    background-color: #316ef3; /* 辅助线颜色 */
  }
  .draggable-icon {
    cursor: grab;
  }
  .draggable-icon:active {
    cursor: grabbing;
  }

  // .el-tree-node.is-current>.text{
  //   .isnoCategory{
  //     font-weight: 700;
  //   }
  // }
}
.labelText{
  display: flex;
  align-items: center;
  justify-content: space-between;
  width:100%;
  padding:4px;
  .toolsIcon{
    font-size:16px;
    color:#1672c9;
  }
  .text{
    display: flex;
    align-items: center;
    justify-content: start;
    .iconStyle{
      margin-right:4px;
      font-size:14px;
      color:#1890ff;
    }
    span{
      font-size:14px;
      color:#171a1d;
    }
  }
  .el-dropdown-link{
    display: none;
  }
}
.labelText:hover{
  .el-dropdown-link{
    display: block;
  }
}
</style>

<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header">
        <span>{{state.data.name || '标题'}}</span>
        <el-button @click="backFn">返回</el-button>
      </el-header>
      <el-container>
      <el-aside
        width="240px"
        :style="{
          padding: '20px',
        }"
      >
      <div class="searchInput">
        <el-cascader
          placeholder="搜索"
          v-model="state.searchValue"
          style="border-radius:3px;"
          :options="state.treeData"
          :props="defaultProps"
          clearable
          filterable
        />
      </div>
      <div class="draggableBox">
        <DraggableTree :tree-data="state.treeData" @click-node="clickNode" :is-visit="true" :search-value="state.searchValue"/>
      </div>
      </el-aside>
      <el-main style="padding: 0">
        <AppView ref="appViewRef" :is-visit="true"></AppView>
      </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script lang="ts" setup>
  import { getData, postData } from '~/agilebpm/api/ab-request'
  import { myResourceUrl } from '~/agilebpm/api/modules/ab-appSquare/ab-appSquare-resource'
  import { abTools } from '~/agilebpm'
  import { Search, Plus } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  import DraggableTree from './draggableTree.vue';
  import AppView from './app-view.vue'
  const { proxy } = abTools.useCurrentInstance()
  const state = reactive({
    data:{} as any,
    treeData: [] as any,
    searchValue:'',
  })

  const defaultProps = {
    children: 'children',
    label: 'name',
    value: 'id'
  };

  const appViewRef = ref(null)

  const getMyResource = () => {
  postData(myResourceUrl+proxy.$route.params.projectId)
  .then(
    ({ data }) => {
      if(data && data.menuList && data.menuList.length > 0){
        state.treeData = filterTreeItems(data.menuList);
      }
    },
    () => {}
  )
  .catch(() => {
  })
}

function filterTreeItems(tree) {
  // 定义递归函数，用于深度遍历和过滤树形数据
  function traverse(items) {
    return items
      .map(item => {
        // 如果当前节点的type是'category'或'button'，则继续递归遍历子节点
        if (item.type === 'category' || item.type === 'button') {
          return { ...item, children: item.children ? traverse(item.children) : [] };
        }
        // 否则，保留当前节点，并且如果存在子节点也进行递归处理
        return item.children ? { ...item, children: traverse(item.children) } : item;
      })
      .filter(item => {
        // 过滤掉没有子节点的'category'或'button'节点
        return !['category', 'button'].includes(item.type) || (item.children && item.children.length > 0);
      });
  }

  // 从根节点数组开始递归遍历
  return traverse(tree);
}

  const clickNode = (node:any) => {
    state.data = node
    appViewRef.value.getVo(node)
  }

  const backFn = () => {
    proxy.$router.push({path: '/appSquare'})
  }

  onMounted(() => {
    getMyResource()
  })
</script>
<style lang="scss" scoped>
  .common-layout,
  .el-container {
    height: 100%;
  }
  .common-layout {
    .el-container {
      .el-aside {
        padding: 20px;
        background: #fff;
        .draggableBox{
          margin-top:20px;
        }
      }
    }
  }
  .header{
    display: flex;
    align-items:center;
    justify-content:space-between;
    font-size: 14px;
    line-height: 60px;
    background: #fff
  }
</style>

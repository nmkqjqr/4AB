<template>
  <div>
    <el-select
      v-model="state.selectvalue"
      class="selectstyle"
      placeholder="请选择"
      @change="changeselectvalue"
    >
      <el-option
        v-for="item in state.selectoption"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      />
    </el-select>
    <div
      class="treeBoxHeight"
      style="height: 400px; padding: 8px 6px; border: 1px solid #dcdfe6"
    >
      <el-tree
        :current-node-key="state.nodekey"
        :data="state.data"
        :default-expanded-keys="state.defaultExpanded"
        empty-text="加载中。。。"
        :expand-on-click-node="false"
        :highlight-current="true"
        node-key="id"
        @node-click="handleNodeClick"
      >
        <template #default="{ data }">
          <div
            class="custom-tree-node"
            @mouseenter="data.isshow = true"
            @mouseleave="data.isshow = false"
          >
            <p>
              <vab-icon :icon="data.icon" />
              {{ data.name }}
            </p>
          </div>
        </template>
      </el-tree>
    </div>
  </div>
</template>

<script setup>
  import { onMounted, reactive, toRefs } from 'vue'
  import { sysApi, orgApi, postData, abUtil } from '~/agilebpm'
  import { useRoutesStore } from '@/store/modules/routes'
  import { useAclStore } from '@/store/modules/acl'
  const emit = defineEmits([
    'updateFetchdata',
    'updateLoading',
    'addFn',
    'resetFields',
    'setRow',
    'isApp',
  ])
  const state = reactive({
    defaultExpanded: [],
    nodekey: '',
    height: `${window.innerHeight - (110 + 32 + 20 + 55 + 50)}px`,
    selectvalue: null,
    selectoption: [],
    data: [],
    datato: {
      systemId: null,
    },
    isshow: false,
    id: null,
  })
  // 选择流程平台 / 后台
  const changeselectvalue = (value) => {
    const obj = state.selectoption.find((item) => item.id == value)
    emit('isApp', obj)
    state.datato.systemId = value
    state.data = []
    fetchTreeData()
  }

  // 添加子级/编辑打开窗口
  const append = (row) => {
    emit('addFn', row)
  }

  // 请求详情信息
  const fetchData = async (id) => {
    emit('updateLoading', true)
    const data = await orgApi.resourse.getJson({ id: id })
    emit('updateLoading', false)
    emit('updateFetchdata', data.data)
  }

  // 点击单个tree属性菜单
  const handleNodeClick = (row) => {
    if (row.id !== '0') {
      state.id = row.id
      emit('setRow', row)
      fetchData(row.id)
    } else {
      return
    }
  }

  const getapplicationListJson = () => {
    postData(sysApi.authApplication.applicationListJson, {
      limit: 99,
    }).then(
      (res) => {
        state.selectoption = res.data.rows
        state.selectoption.forEach((item, index) => {
          // isDefault 默认  enabled 启用
          if (item.isDefault === 1 && item.enabled === 1) {
            state.selectvalue = item.id
            state.datato.systemId = item.id
          }
        })
        fetchTreeData()
      },
      () => {}
    )
  }

  // 请求tree菜单列表
  const fetchTreeData = async () => {
    const data = await orgApi.resourse.getTreeData(state.datato)
    state.data = data.data
    // 默认展开两级
    state.defaultExpanded = abUtil.expandTwoLevels(state.data, 'id')
  }

  // tree菜单列表初始化
  onMounted(() => {
    getapplicationListJson()
  })
  defineExpose({
    ...toRefs(state),
    handleNodeClick,
    getapplicationListJson,
    fetchTreeData,
    fetchData,
  })
</script>

<style lang="scss" scoped>
  $base: '.menu-management';
  #{$base}-container {
    padding: 0 !important;
    background: $base-color-background !important;
  }
  .selectstyle {
    width: 100%;
    margin: 20px 0;
    margin-bottom: 10px;
  }
  .custom-tree-node {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;
    padding-right: 8px;
    font-size: 14px;
  }
  .treeBoxHeight {
    overflow: auto;
  }
</style>

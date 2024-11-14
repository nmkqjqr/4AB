<template>
  <div>
    <div
      class="treeBoxHeight"
      :style="{ height: state.height, margin: props.marginStyle }"
    >
      <el-tree
        :data="state.treeData"
        default-expand-all
        empty-text="暂无数据"
        :expand-on-click-node="false"
        :highlight-current="true"
        node-key="id"
        :props="state.defaultProps"
        @node-click="handleNodeClick"
      >
        <template #default="{ data }">
          <span class="custom-tree-node">
            <el-dropdown v-if="state.operation" trigger="contextmenu">
              <span class="el-dropdown-link">
                <vab-icon
                  v-if="data.icon && data.icon.length > 0"
                  :icon="data.icon"
                />
                {{ data.name }}
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-if="
                      data.parentId.length > 0 &&
                      data.parentId !== '0' &&
                      isShowButten(data, 'edit')
                    "
                    @click="edit(data)"
                  >
                    {{ $abT('page.common.edit','编辑') }}
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="
                      data.parentId.length > 0 &&
                      data.parentId !== '0' &&
                      isShowButten(data, 'delete')
                    "
                    @click="remove(data)"
                  >
                    {{ $abT('page.common.del','删除') }}
                  </el-dropdown-item>
                  <el-dropdown-item @click="append(data)">
                    {{ $abT('page.common.add','添加') }}
                  </el-dropdown-item>
                  <el-dropdown-item @click="reload(data)">
                    {{ $abT('page.layout.refresh','刷新') }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-dropdown v-if="state.batchOperation" trigger="click">
              <span class="el-dropdown-link">
                <vab-icon
                  v-if="data.icon && data.icon.length > 0"
                  :icon="data.icon"
                />
                <span :class="{disabled:data.disable == 1 ? true : ''}">{{ data.name }}</span>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="batchOperationFn(data)">
                    {{ $abT('page.common.batchOperations','批量操作') }}
                  </el-dropdown-item>
                  <el-dropdown-item @click="reload(data)">
                    {{ $abT('page.layout.refresh','刷新') }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <span v-else>
              <vab-icon
                v-if="data.icon && data.icon.length > 0"
                :icon="data.icon"
              />
              {{ data[props.leftTreeMap.nameKey] || data.name }}
            </span>
          </span>
        </template>
      </el-tree>
      <slot></slot>
    </div>
    <!-- </vab-card> -->
  </div>
</template>
<script lang="ts">
  export default { name: 'AbTree' }
</script>
<script setup lang="ts">
  import { ref, reactive, watch } from 'vue'
  const props = defineProps({
    treeData: { required: true, type: Object },
    //是否开启操作项目
    operation: {
      type: Boolean,
      default: false,
    },
    batchOperation: {
      type: Boolean,
      default: false,
    },
    treeHeight: {
      type: String,
      default: '',
    },
    marginStyle: {
      type: String,
      default: '10px',
    },
    leftTreeMap: {
      type: Object,
      default: null,
    },
    isFromCust:{
      type: Boolean,
      default: false,
    },
    //dynamicOperation动态操作配置： conlem基于条件字段，conlemValue当条件字段等于什么值得时候，option拥有得按钮
    // 例如下方案例： 当是否内置数据时，不允许删除和修改。
    // {
    //   conlem: 'isSystem',
    //   conlemOption: [
    //     {
    //       conlemValue: 1,
    //       option: ['add', 'refresh'],
    //     },
    //     {
    //       conlemValue: 0,
    //       option: ['add', 'edit', 'delete', 'refresh'],
    //     },
    //   ],
    // }
    dynamicOperation: {
      type: Object as () => {
        conlem: string
        conlemOption: Array<{ conlemValue: string; option: string[] }>
      },
      default: null,
    },
  })
  watch(
    () => props.treeData,
    (v1, v2) => {
      state.treeData = v1
      if(props.isFromCust){
        filterItem(state.treeData)
      }
    },
    { deep: true }
  )
  const emit = defineEmits([
    'nodeClick',
    'addClick',
    'editClick',
    'reloadClick',
    'removeClick',
    'batchOperationClick',
  ])
  const state: any = reactive({
    height:
      props.treeHeight.length > 0
        ? props.treeHeight
        : `${window.innerHeight - (110 + 32 + 20 + 60)}px`,
    treeData: props.treeData,
    operation: props.operation,
    batchOperation: props.batchOperation,
    defaultExpanded: [],
    id: null,
    defaultProps: { children: 'children', label: 'name' },
  })


  const filterItem = (treeData:any) => {
    for (let i = 0; i < treeData.length; i++) {
      if (treeData[i].disable == 1) {
        treeData.splice(i, 1);
      }
      if (treeData[i].children && treeData[i].children.length > 0) {
        filterItem(treeData[i].children);
      }
    }
  }

  const handleNodeClick = (val: any) => {
    state.id = val.id
    emit('nodeClick', val)
  }
  const append = (val: any) => {
    emit('addClick', val)
  }
  const edit = (val: any) => {
    emit('editClick', val)
  }
  const reload = (val: any) => {
    emit('reloadClick', val)
  }
  const remove = (val: any) => {
    emit('removeClick', val)
  }
  const batchOperationFn = (val: any) => {
    emit('batchOperationClick', val)
  }

  //是否展示此按钮
  const isShowButten = (data: any, buttenType: string) => {
    const obj = props.dynamicOperation
    if (!obj) {
      return true
    } else {
      for (const key in data) {
        if (key == obj.conlem)
          for (const index in obj.conlemOption) {
            if (obj.conlemOption[index].conlemValue == data[key]) {
              return obj.conlemOption[index].option.includes(buttenType)
            }
          }
      }
      return false
    }
  }
  onMounted(() => {})
</script>
<style lang="scss" scoped>
  .treeBoxHeight {
    overflow: auto;
  }
  .custom-tree-node {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;
    padding-right: 8px;
    font-size: 14px;
  }
  .disabled{
    text-decoration: line-through ;
  }
</style>

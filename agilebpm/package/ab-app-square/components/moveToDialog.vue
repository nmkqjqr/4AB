<template>
  <el-dialog
    v-model="state.moveToDialogVisible"
    title="移动到"
    width="600"
    class="dialogCard"
    :close-on-click-modal="false"
  > 
  <p>将<span style="display:inline-block;padding:4px 8px;margin:0px 8px;color:#000;background:#f1f2f3;">{{state.data.name}}</span>移动到目标分组</p>
  <el-card style="width: 100%" shadow="never">
    <el-tree
      :data="state.filterCategories"
      :props="defaultProps"
      :default-expand-all="true"
      :expand-on-click-node="false"
      :highlight-current="true"
      @node-click="handleNodeClick"
    >
      <template #default="{ node }">
        <div class="labelText">
          <p class="text">
            <svg-icon
              v-if="node.data.id == '0'"
              :icon="state.parentData.icon"
              style="width: 20px;"
            />
            <el-popover
              placement="bottom"
              effect="dark"
              :width="176"
              trigger="hover"
              content="暂不支持3级及以上分组"
            >
              <template #reference>
                <span v-if="node.data.disabled" :class="{ 'is-disabled': node.data.disabled }">{{ node.label }}</span>
              </template>
            </el-popover>
            <span v-if="!node.data.disabled">{{ node.label }}</span>
          </p>
        </div>
      </template>
    </el-tree>
  </el-card>
  <template #footer>
    <div class="dialog-footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="moveSubmit">
        移动
      </el-button>
    </div>
  </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'
import { postData,getData } from '~/agilebpm/api/ab-request'
import { saveResourceUrl } from '~/agilebpm/api/modules/ab-appSquare/ab-appSquare-resource'
import { getProjectUrl } from '~/agilebpm/api/modules/ab-appSquare/ab-appSquare-project'
import { abTools,abUtil } from '~/agilebpm'
const { proxy } = abTools.useCurrentInstance()
const props = defineProps({
  // eslint-disable-next-line vue/require-default-prop
  treeData: {
    type: Array,
    default: null,
  },
})

const defaultProps = {
  children: 'children',
  label: 'name',
  disabled: 'disabled'
}

const { treeData } = toRefs(props)

const emit = defineEmits(['getMyResource'])

const state = reactive({
  data:{} as any,
  parentData:{},
  moveToDialogVisible:false,
  filterCategories:[],
  checkEdData:{} as any
})

const filterAndAddDisabled = (data:any, excludeId:any) => {
  const filteredData = data.filter(item => item.type === 'category' && item.id !== excludeId);

  function addDisabledToChildren(items:any) {
    return items.map(child => {
      // 递归地为每个子项添加 disabled: true
      child.disabled = true;
      if (child.children) {
        addDisabledToChildren(child.children); // 如果存在子数组，递归调用
      }
      return child;
    });
  }

  // 遍历过滤后的数据，为每个项的 children 添加 disabled 属性
  filteredData.forEach(item => {
    if (item.children) {
      item.children = addDisabledToChildren(item.children);
    }
  });

  return filteredData;
}

const openDialog = (data:any) => {
  state.data = data
  state.moveToDialogVisible = true
}

const cancel = () => {
  state.moveToDialogVisible = false
}

const handleNodeClick = (data:any) => {
  if(data.disabled){
    return;
  }
  state.checkEdData = data
}

const moveSubmit = () => {
  if(!state.checkEdData.id){
    ElMessage({
      type: 'error',
      message: '请选择分组',
    })
    return;
  }
  state.data.parentId = state.checkEdData.id
  postData(saveResourceUrl,state.data)
  .then(
    ({ data }) => {
      ElMessage({
        showClose: true,
        message: '移动成功',
        type: 'success',
      })
      emit('getMyResource')
      state.moveToDialogVisible = false
    },
    () => {}
  )
  .catch(() => {
  })

}

watch(
  () => state.moveToDialogVisible,
  (newVal) => {
    if(newVal){
      state.checkEdData = {}
      getData(getProjectUrl + proxy.$route.params.id).then(
        ({ data }) => {
          if(data){
            state.parentData = data
            state.filterCategories[0] = {
              name: data.name,
              id: "0",
              children: filterAndAddDisabled(treeData.value,state.data.id)
            }
          }
        },
        () => {}
      )
      .catch(() => {
      })
    }
  }
)

defineExpose({
  openDialog
})
</script>
<style lang="scss" scoped>
.is-disabled {
  color: #c0c4cc;
}
</style>

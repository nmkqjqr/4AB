<template>
  <div class="searchInput">
    <el-cascader
      placeholder="搜索"
      v-model="state.searchValue"
      style="width: 145px;border-radius:3px;"
      :options="state.treeData"
      :props="defaultProps"
      clearable
      filterable
    />
    <el-dropdown :hide-on-click="false">
      <span class="el-dropdown-link">
        <el-button type="primary" :icon="Plus"  style="margin-left:10px;border-radius:4px;"/>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="addGrouping">新建 分组</el-dropdown-item>
          <el-dropdown-item divided @click="openForm">新建 表单&列表</el-dropdown-item>
          <el-dropdown-item divided @click="openProcess">新建 简单流程</el-dropdown-item>
          <el-dropdown-item @click="openProfessionalProcess">新建 专业流程</el-dropdown-item>
          <el-dropdown-item divided @click="createProcessTable">新建 流程报表</el-dropdown-item>
          <el-dropdown-item @click="openProcessApp">新建 流程应用</el-dropdown-item>
          <el-dropdown-item divided @click="createLayoutDesignGrid">新建 组联式应用</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
  <div class="draggableBox">
     <DraggableTree :tree-data="state.treeData" @get-my-resource="getMyResource" @click-node="clickNode" :search-value="state.searchValue"/>
  </div>
  <el-dialog
    v-model="state.dialogVisible"
    title="新建表单页面"
    width="600"
    class="dialogCard"
    :close-on-click-modal="false"
  >
  <el-row :gutter="20">
    <el-col :span="8">
      <el-card class="card" shadow="hover" @click="toCreateForm">
        <div>
          <img src="../style/img/add2.png" alt="" srcset="">
        </div>
        <div>
          <p>新建空白页面</p>
          <p>基于空白画布从零开始搭建</p>
        </div>
      </el-card>
    </el-col>
    <el-col :span="8" v-if="state.params.type == 'appList' || state.params.type == 'professionalProcess' || state.params.type == 'processApp'">
      <ab-cust-dialog
        dialog-key="formDesignSelector"
        :param="{
          type_: 'pc',
        }"
        @ok="chooseForm"
        :custom="true"
      >
        <el-card class="card" shadow="hover">
          <div>
            <img src="../style/img/add1.png" alt="" srcset="">
          </div>
          <div>
            <p>复用已有表单</p>
            <p>选择已有表单进行创建</p>
          </div>
        </el-card>
      </ab-cust-dialog>
    </el-col>
    <el-col :span="8" v-if="state.params.type == 'appList'">
      <ab-cust-dialog
        dialog-key="boSelector"
        :custom="true"
        @ok="chooseBocode"
      >
        <el-card class="card" shadow="hover">
          <div>
            <img src="../style/img/add3.png" alt="" srcset="">
          </div>
          <div>
            <p>公用业务对象创建</p>
            <p>选择公用业务对象创建</p>
          </div>
        </el-card>
      </ab-cust-dialog>
    </el-col>
  </el-row>
  </el-dialog>
  <el-dialog
    v-model="state.dialogVisibleProcess"
    title="选择流程"
    width="600"
    class="dialogCard"
    :close-on-click-modal="false"
  >
    <el-row :gutter="20">
      <el-col :span="8">
        <ab-cust-dialog
          dialog-key="bpmDefinitionSelector"
          style="display: inline-block;margin-right:6px;"
          :dialogSetting="{multiple:0}"
          @ok="chooselcdycx"
          :custom="true"
        >
          <el-card class="card" shadow="hover">
            <div>
              <img src="../style/img/add1.png" alt="" srcset="">
            </div>
            <div>
              <p>选择流程</p>
              <p>关联已有流程进行创建</p>
            </div>
          </el-card>
        </ab-cust-dialog>
      </el-col>
    </el-row>
  </el-dialog>
  <div>
     <AddGroupDialog ref="AddGroupDialogRef" @get-my-resource="getMyResource" :tree-data="state.treeData"/>
  </div>
</template>
<script lang="ts" setup>
import { defineComponent, ref } from 'vue';
import { Search,Plus } from '@element-plus/icons-vue'
import draggable from 'vuedraggable';
import DraggableTree from './draggableTree.vue';
import AddGroupDialog from '../components/addGroupDialog.vue';
import { postData,getData } from '~/agilebpm/api/ab-request'
import { saveResourceUrl,projectResourceUrl } from '~/agilebpm/api/modules/ab-appSquare/ab-appSquare-resource'
import { abTools } from '~/agilebpm'
const emit = defineEmits(['clickNode'])
const { proxy } = abTools.useCurrentInstance()
const AddGroupDialogRef = ref(null)
const state = reactive({
  searchValue:'',
  dialogVisible:false,
  dialogVisibleProcess:false,
  treeData:[],
  params:{
    projectId:proxy.$route.params.projectId,
    type:'',
    path:'0',
    parentId:'0'
  } as any,
  designInfo:{
    show: false,
    defId: '',
  },
  boCode:'',
})
const defaultProps = {
  children: 'children',
  label: 'name',
  value: 'id'
};
const openForm = () => {
  state.params.type = 'appList';
  state.dialogVisible = true
}
const openProcess = () => {
  state.params.type = 'process';
  state.dialogVisible = true
}
const openProfessionalProcess = () => {
  state.params.type = 'professionalProcess';
  state.dialogVisible = true
}
const createProcessTable = () => {
  state.params.type = 'processReport';
  state.dialogVisibleProcess = true
}
const openProcessApp = () => {
  state.params.type = 'processApp';
  state.dialogVisible = true
}
const chooseForm = (custData:any) => {
  state.params.formDesignId = custData[0].id;
  createFormFn(state.params.formDesignId)
}
const chooseBocode = (data:any) => {
  state.boCode = data[0].code;
  createFormFn()
}
const chooselcdycx = (data:any) => {
  console.log('data',data)
  createFormFn()
}
const createLayoutDesignGrid = () => {
  state.params.type = 'groupApp';
  // state.designInfo.show = true
  createFormFn()
  // window.open(proxy.$router.resolve('/biz/bizFormCombination/bizFormCombinationList?isAppSquare=true').href, '_blank');
}

const toCreateForm = () => {
  createFormFn()
}
const createFormFn = (formDesignId:any) => {
  postData(saveResourceUrl,state.params)
  .then(
    ({ data }) => {
      // 应用 表单
      if(state.params.type == 'appList'){
        // mode=diyBo
        let query = state.boCode.length > 0 ? { boCode:state.boCode } : { mode:'diyBo' }
        window.open(proxy.$router.resolve({
          name: 'CreateForm',
          params:{
            projectId:state.params.projectId,
            resourceType:state.params.type,
            resourceId:data,
            formDesignId:formDesignId || null
          },
          query:query
        }).href, '_blank');
        state.boCode = ''
      }

      // 简单流程
      if(state.params.type == 'process'){
        window.open(proxy.$router.resolve({
          name: 'CreateProcess',
          params:{
            projectId:state.params.projectId,
            resourceType:state.params.type,
            resourceId:data
          },
          query: { mode:'diyBo' }
        }).href, '_blank');
      }

      // 专业流程
      if(state.params.type == 'professionalProcess'){
        // mode=diyBo
        let query = { mode:'diyBo' }
        window.open(proxy.$router.resolve({
          name: 'CreateForm',
          params:{
            projectId:state.params.projectId,
            resourceType:state.params.type,
            resourceId:data,
            formDesignId:formDesignId || null
          },
          query:query
        }).href, '_blank');
      }

      // 流程报表
      if(state.params.type == 'processReport'){
        window.open(proxy.$router.resolve({
          name: 'CreateForm',
          params:{
            projectId:state.params.projectId,
            resourceType:state.params.type,
            resourceId:data
          }
        }).href, '_blank');
      }

      // 流程应用
      if(state.params.type == 'processApp'){
        // mode=diyBo
        let query = { mode:'diyBo' }
        window.open(proxy.$router.resolve({
          name: 'CreateForm',
          params:{
            projectId:state.params.projectId,
            resourceType:state.params.type,
            resourceId:data,
            formDesignId:formDesignId || null
          },
          query:query
        }).href, '_blank');
      }

      // 组联式表单
      if(state.params.type == 'groupApp'){
        window.open(proxy.$router.resolve({
          name: 'CreateLayout',
          params:{
            projectId:state.params.projectId,
            resourceType:state.params.type,
            resourceId:data
          }
        }).href, '_blank');
      }

      state.dialogVisibleProcess = false
      state.dialogVisible = false
      getMyResource()
    },
    () => {}
  )
  .catch(() => {
  })
}

const getMyResource = () => {
  postData(projectResourceUrl+proxy.$route.params.projectId)
  .then(
    ({ data }) => {
      if(data && data.length > 0){
        state.treeData = filterButtons(data)
      }else{
        state.treeData = []
      }
    },
    () => {}
  )
  .catch(() => {
  })
}

const filterButtons = (data:any) => {
  // 使用递归辅助函数
  function filterItems(items:any) {
    return items.reduce((acc:any, item:any) => {
      // 如果当前项是对象且type属性为button，则跳过
      if (typeof item === 'object' && item.type === 'button') {
        return acc;
      }

      // 如果当前项包含children属性，递归调用filterItems
      if (Array.isArray(item.children)) {
        item.children = filterItems(item.children);
      }

      // 将当前项添加到累加器数组
      acc.push(item);
      return acc;
    }, []);
  }

  // 首先检查传入的数据是否为数组
  if (!Array.isArray(data)) {
    throw new Error('Input must be an array');
  }

  // 对数组进行过滤
  return filterItems(data);
}

const addGrouping = () => {
  AddGroupDialogRef.value.openDialog()
}

const clickNode = (node:any) => {
  emit('clickNode',node)
}

onMounted(() => {
  getMyResource()
})
</script>
<style lang="scss" scoped>
.draggableBox{
  padding:20px 0;
}
.dialogCard{
  .card{
    display: flex;
    align-items: center;
    justify-content: start;
    cursor: pointer;
    background: #f1f4f8;
    p{
      margin:6px 0;
    }
    p:nth-child(1){
      font-size:16px;
    }
    p:nth-child(2){
      font-size:14px;
      color:#b9babb;
    }
  }
}
</style>

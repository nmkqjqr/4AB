<template>
      <ab-save
        v-ab-btn-rights:batchSave
        :after-save-fn="saveAfter"
        :back-btn="false"
        back-name="groupRelBatchSave"
        :before-save-fn="handleBeforeSaveFn"
        :form-ref="formRef"
        :save-data="info.initData"
        :url="orgApi.post.groupBatchSaveUrl"
      />
    <el-main>
      <el-form
        ref="formRef"
        label-suffix="："
        label-width="120px"
        :model="info.orgRelationList"
        :status-icon="true"
      >
        <el-form-item :label="$abT('page.groupList.selectOrg','选择组织')">
          <span>
            <el-tag
              v-for="(relation, index) in info.orgRelationList"
              v-show="relation.type === 'group'"
              :key="index"
              :closable="true"
              @close="deleteRel(relation,index)"
            >
              {{ relation.name }}
            </el-tag>

             <el-button  @click="loadData()" size="small" style="margin-left: 10px;" >
               <span>{{ $abT('page.common.select','选择') }}</span>
             </el-button>
          </span>

          <el-dialog
            v-model="dialogVisible"
            :title="$abT('page.groupList.orgSelect','组织选择')"
            class="dialogStyleBox"
            :close-on-click-modal="false"
            width="750px"
            @open="handleOpen"
          >
            <div
              class="box"
              style="overflow: auto"
              :style="{ height: info.dialogHeight }"
            >
              <el-tree
                ref="treeRef"
                :node-key="info.defaultProps.id"
                :props="info.defaultProps"
                :data="info.treeData"
                :default-checked-keys = "info.checkedKeys"
                :show-checkbox=true
                :highlight-current=true
                :default-expand-all=true
                :check-strictly=true
                :expand-on-click-node=false
              />
            </div>
            <template #footer>
                 <span class="dialog-footer">
                  <el-button @click="dialogVisible = false">{{ $abT('page.common.cancel','取消') }}</el-button>
                  <el-button v-show="info.isCheckAll" type="success"  @click="checkAll">{{ $abT('page.groupList.selectAll','全选') }}</el-button>
                   <el-button v-show="!info.isCheckAll" type="warning" @click="unCheckAll">{{ $abT('page.groupList.deselectAll','取消全选') }}</el-button>
                  <el-button type="primary" @click="ok">{{ $abT('page.common.ok','确定') }}</el-button>
             </span>
            </template>
          </el-dialog>
        </el-form-item>

        <el-form-item :label="$abT('page.groupList.selectRole	','选择角色')">
          <div>
            <el-tag
              v-for="(relation, index) in info.orgRelationList"
              v-show="relation.type === 'role'"
              :key="index"
              :closable="true"
              @close="deleteRel(relation,index)"
            >
              {{ relation.name }}
            </el-tag>
          </div>

          <div  style="display: block;">
            <ab-cust-dialog
              v-model="info.orgRoleList"
              dialog-key="roleSelector"
              style="margin-left: 5px;"
              :param="{}"
              size="small"
            >
              {{ $abT('page.common.select','选择') }}
            </ab-cust-dialog>
          </div>
        </el-form-item>
      </el-form>
    </el-main>
</template>

<script setup lang="ts">
import {reactive, ref} from 'vue'
import {abUtil, orgApi} from '~/agilebpm'
import { ElMessage } from 'element-plus'
import {abT} from "@/i18n";


const emit = defineEmits(['nodeClick'])
const props = defineProps({
  groupRoleType: {
    type: String,
    required: true,
    default: 'groupRole',

  },
})
const treeRef = ref('treeRef')
const formRef = ref()
const dialogVisible = ref(false)
const info: any = reactive({
  initData: {
    roleIds: '',
    strIds: '',
    operationType: 'groupRole'
  },
  roleId: [],
  groupId: [],
  orgRelationList:[],
  orgRoleList: [],
  defaultProps: { children: 'children', label: 'name',id: 'id' },
  treeData:[],
  treeKeys:[],
  treeNodes:[],
  dialogHeight:'750px',
  checkedKeys:[],
  checkedNodes:[],
  isCheckAll:true,
})

const deleteRel = (relation:any,index: number) =>{
  abUtil.Arrays.del(index, info.orgRelationList)
  abUtil.Arrays.del(info.checkedKeys.indexOf(relation.id), info.checkedKeys)
  info.checkedNodes.forEach((item: any) => {
    if (item.id === relation.id){
      abUtil.Arrays.del(info.checkedKeys.indexOf(item), info.checkedNodes)
    }
  })
  info.initData.roleIds = ''
  info.initData.strIds = ''
  info.roleId.splice(0)
  info.groupId.splice(0)
  info.orgRoleList.splice(0)
}


const pushRelationList = (dataArr: any[], type: string) => {
  if (!dataArr) return
  if (!info.orgRelationList) {
    info.orgRelationList = []
  }
  dataArr.forEach((item: any) => {
    //校验是否重复存在
      for (let i = 0, relation; (relation = info.orgRelationList[i++]); ) {
        if (relation.id === item.id) {
          if (type === 'role' || type === 'group') {
            return
          }
        }
      }
      info.orgRelationList.push({
        type: type,
        id: item.id,
        name: item.name,
      })
    })
}

const handleBeforeSaveFn = () => {
  if (info.orgRelationList.length == 0) {
    ElMessage({
      type: 'error',
      message: abT('page.groupList.pleaseSelectOrgRole','请选择组织角色'),
    })
    return false
  }
  info.orgRelationList.forEach((item: any) => {
    if (item.type === 'role') {
      if (info.roleId.indexOf(item.id) === -1){
        info.roleId.push(item.id)
      }
    }
    if (item.type === 'group') {
      if (info.groupId.indexOf(item.id) === -1){
        info.groupId.push(item.id)
      }
    }
  })
  if (info.roleId.length >0){
    info.initData.roleIds = info.roleId.join(',')
  }
  if (info.groupId.length >0) {
    info.initData.strIds = info.groupId.join(',')
  }


  if (info.initData.strIds.length == 0 ){
    ElMessage({
      type: 'error',
      message: abT('page.groupList.pleaseSelectOrg','请选择组织'),
    })
    return false
  }
  if (info.initData.roleIds.length == 0){
    ElMessage({
      type: 'error',
      message: abT('page.groupList.pleaseSelectRole','请选择角色'),
    })
    return  false
  }
}

const  cleanData = () =>{
  info.initData.roleIds = ''
  info.initData.strIds = ''
  info.roleId.splice(0)
  info.groupId.splice(0)
  info.orgRelationList.splice(0)
  info.orgRoleList.splice(0)
  info.treeData.splice(0)
  info.treeKeys.splice(0)
  info.treeNodes.splice(0)
  info.checkedKeys.splice(0)
  info.checkedNodes.splice(0)

}

const saveAfter = () => {
  cleanData()
}

const  checkAll = () =>{
  info.isCheckAll=false
  treeRef.value.setCheckedNodes( info.treeNodes)
  treeRef.value.setCheckedKeys(info.treeKeys,true)
}

const  unCheckAll = () =>{
  info.isCheckAll=true
  treeRef.value.setCheckedNodes([])
  treeRef.value.setCheckedKeys([],true)
}

const ok = ()=>{
  dialogVisible.value = false
  info.checkedKeys=treeRef.value.getCheckedKeys(false)
  info.checkedNodes=treeRef.value.getCheckedNodes(false,false)
  info.orgRelationList.forEach((item: any,index:number) => {
    if ( item.type === 'group'){
      info.orgRelationList.splice(index)
    }
  })
  pushRelationList(info.checkedNodes, 'group')
}


const handleOpen = ()=>{
  info.isCheckAll=true
  treeRef.value.setCheckedNodes(info.checkedNodes)
  treeRef.value.setCheckedKeys(info.checkedKeys,true)
  if (info.checkedKeys.length>0 && info.checkedKeys.length ===  info.treeKeys.length){
    info.isCheckAll=false
  }
}

const getCheckedChildKeys = (node: any, checkedKeys: any[], checkedNodes: any[])=> {

    for (const childless of node.children) {
      checkedKeys.push(childless.id);
      checkedNodes.push(childless)
      if (childless.children&& childless.children.length>0 ) {
            getCheckedChildKeys(childless, checkedKeys,checkedNodes);
          }
  }
}

// 加载数据
const loadData = async () => {
  info.treeData.splice(0)
  info.treeKeys.splice(0)
  info.treeNodes.splice(0)
  await orgApi.group.getOrgTreeData().then((result: any) => {
  if (result.data[0].children){
    info.treeData = result.data[0].children
    for (const items of result.data[0].children){
      info.treeNodes.push(items);
      info.treeKeys.push(items.id)
      if (items.children &&  items.children.length>0){
          getCheckedChildKeys(items, info.treeKeys, info.treeNodes,)
        }
      }

    }
  })
  dialogVisible.value=true
}




watch(
  () => info.orgRoleList,
  (val: any) => {
    if (val) {
      pushRelationList(val, 'role')
    }
    info.orgRoleList.splice(0)
  }
)

watch(
  () => props.groupRoleType,
  () => {
    cleanData()
  }
)
</script>

<style lang="scss" scoped>
.dialogStyleBox {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  transform: translate(-50%, -50%);
  .el-dialog__body {
    flex: 1;
    padding: 10px 10px 0 10px;
    background: #f6f8f9;
    border-top: 1px solid #e4e1e1;
    border-bottom: 1px solid #e4e1e1;
    .box {
      // padding: 12px;
      background: #fff;
    }
  }
}
.custom-tree-node {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  padding-right: 8px;
  font-size: 14px;
}

</style>
